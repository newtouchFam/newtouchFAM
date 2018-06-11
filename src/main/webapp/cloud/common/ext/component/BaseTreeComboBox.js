Ext.namespace("ssc.component");

/**
 * @class 下拉框(树)基类<br>
 * @extends ssc.component.BaseComboBox<br>
 *
 * 二、使用
 * 1.外观
 * fieldLabel、width、listWidth、xy_AllowClear、
 * xy_AutoWidth、xy_MaxWidth、xy_TreeHeight、xy_RootTitle、xy_LeafOnly、xy_TreeLoaderCache、
 * 2.数据
 * valueField、displayField、
 * xy_StoreFields、xy_DataActionURL、xy_SQLPath、xy_SQLFile、xy_SQLFile2、xy_ProcedurePath、xy_BaseParams、
 * 3.初始化
 * xy_hasAll、xy_isInitSelect、xy_InitDataID
 * 4.事件
 * xy_ParentObjHandle、xy_SelectEvent、xy_ValueChangeEvent
 * 5.方法
 * getValue、setValue、getXyValue、setXyValue、
 * getKeyValue、setKeyValue、getDisplayValue、getStore、
 * getItemCount、getSelected、getSelectedIndex、setSelectedIndex、
 * reload
 */
ssc.component.BaseTreeComboBox = Ext.extend(ssc.component.BaseComboBox,
{
	/**
	 * ==========外观与行为==========
	 */
	/* 选择区宽度自适应*/
	xy_AutoWidth : false,
	/*选择区最大宽度*/
	xy_MaxWidth : 500,
	/* 树显示高度*/
	xy_TreeHeight : 300,
	/* 根节点名称 */
	xy_RootTitle : "请选择",
	/**
	 * 是否只允许选择末级<br>
	 * 单选模式下，不能点击或双击中间级来选择<br>
	 * 多选模式下，中间级没有选择框<br>
	 */
	xy_LeafOnly : true,
	/* 是否展现默认右键菜单 */
	xy_ShowContextMenu : false,
	/**
	 * 点击即选定模式<br>
	 * 在部分组件(例如BaseTreeComboBox)，点击后即选定，不需要展开下级
	 */
	xy_ClickSelectMode : true,
	/* 缓存 */
	xy_TreeLoaderCache : true,
	/* 是否显示全名称 */
	xy_FullDisplay : false,

	/**
	 * ==========数据加载==========
	 */
	/**
	 * 固定key字段名称和显示字段名称
	 * @inherit from Ext.form.ComboBox
	 */
	valueField : "id",
	displayField : "text",

	/**
	 * 外部编辑器，支持XyGridPanel体系
	 */
	outterEditor : null,

	/**
	 * 成员对象
	 */
	m_loaded : false,
	m_TreeDivID : null,
	m_Tree : null,
	m_TreeLoader : null,
	m_RootNode : null,

	/**
	 * 向下兼容
	 */
	/* @deprecated ssc.component.BaseComboBox.xy_TreeHeight */
	winHeight : null,
	/* @deprecated ssc.component.BaseComboBox.xy_RootTitle */
	rootTitle : null,
	/* @deprecated ssc.component.BaseComboBox.xy_LeafOnly */
	leafSelect : null,
	/* @deprecated ssc.component.BaseComboBox.xy_TreeLoaderCache */
	XyCache : null,
	/* @deprecated ssc.component.BaseComboBox.xy_FullDisplay */
	isLocation : null,

	initComponent : function()
	{
		/* 参数向下兼容 */
		this.initSubArguCompatible();

		ssc.component.BaseTreeComboBox.superclass.initComponent.call(this);

		/* 初始化树组件 */
		this.initTree();

		/* 树展开事件 */
		this.on("expand", this.onExpandEvent, this);
	},
	/**
	 * @private
	 * 参数向下兼容
	 */
	initSubArguCompatible : function()
	{
		if (this.winHeight != null)
		{
			this.xy_TreeHeight = this.winHeight;
		}
		if (this.leafSelect != null)
		{
			this.xy_LeafOnly = this.leafSelect;
		}
		if (! ssc.common.StringUtil.isEmpty(this.rootTitle))
		{
			this.xy_RootTitle = this.rootTitle;
		}
		if (this.XyCache != null)
		{
			this.xy_TreeLoaderCache = this.XyCache;
		}
		if (this.isLocation != null)
		{
			this.xy_FullDisplay = this.isLocation;
		}		
	},
	/**
	 * @private
	 * @override	Ext.form.ComboBox.initStore()
	 * @abstract	在子类中实现
	 * 初始化store
	 */
	initStore : function()
	{
		this.store = new top.Ext.data.SimpleStore(
		{
			fields : [],
			data : [ [] ]
		});
	},
	/**
	 * @private
	 * 初始化树组件
	 */
	initTree : function()
	{
		if (this.m_Tree != null)
		{
			if (this.m_loaded && this.xy_TreeLoaderCache)
			{
				return;
			}
			else
			{
				this.m_Tree.loader.load(this.m_Tree.root);
				this.m_Tree.root.expand();
				this.m_loaded = true;
				return;
			}
		}

		this.m_Tree = new ssc.component.BaseTree(
		{
			height : this.xy_TreeHeight,
			xy_RootTitle : this.xy_RootTitle,
			xy_LeafOnly : this.xy_LeafOnly,
			xy_ShowContextMenu : this.xy_ShowContextMenu,
			xy_ClickSelectMode : this.xy_ClickSelectMode,

			xy_DataActionURL : this.xy_DataActionURL,
			xy_SQLPath : this.xy_SQLPath,
			xy_SQLFile : this.xy_SQLFile,
			xy_SQLFile2 : this.xy_SQLFile2,
			xy_ProcFile : this.xy_ProcFile,
			xy_BaseParams : this.xy_BaseParams,
			prepareBaseParams : this.prepareBaseParams,

			xy_InitDataID : this.xy_InitDataID,
			xy_InitExpand : false,
			xy_InitExpandAll : false
		});

		this.m_Tree.loader.on("load", this.onTreeLoaderLoadEvent, this);
		this.m_Tree.on("click", this.onTreeClickEvent, this);

		this.m_TreeDivID = Ext.id();
		this.tpl = "<div id='" + this.m_TreeDivID + "' style='height:" + this.xy_TreeHeight + "px;'></div>";

	},
	/**
	 * @private
	 * 树点击事件
	 */
	onTreeClickEvent : function(node)
	{
		if (node.id == "root")
		{
			return;
		}

		if (! (node.leaf == 1 || node.leaf == true))/* node.leaf 0中间级1末级 */
		{
			if (this.xy_LeafOnly)
			{
				return;
			}
		}

		var oldValue = this.value;
		var newValue = node;

		this.collapse();

		if (this.xy_FullDisplay)
		{
			this.originvalue = node.text;
			node.setText(this.getFullDisplay(node));
		}

		this.setValue(node);

		if (this.outterEditor !== undefined && this.outterEditor != null)
		{
			this.outterEditor.completeEdit();
		}

		if (oldValue == null || oldValue[this.valueField] != newValue[this.valueField])
		{
			this.fireEvent("valuechange", this, oldValue, newValue);
		}
	},
	/**
	 * 加载数据时确定最大宽度
	 */
	onTreeLoaderLoadEvent : function(/*Object*/_this, /*Object*/ node, /*Object*/ response)
	{
		if (this.xy_AutoWidth == false || this.xy_AutoWidth == null || this.xy_AutoWidth == undefined)
		{
			return;
		}

		var childNodes = node.childNodes;
		var maxLength = 0;
		var maxchildNode = 0;

		var metrics = Ext.util.TextMetrics.createInstance(this.m_Tree.getEl());
		for ( var i = 0; i < childNodes.length; i++)
		{
			if (i == 0)
			{
				maxchildNode = childNodes[0];
				maxLength = metrics.getWidth(childNodes[0].text);
			}
			else if (childNodes[i].text.length > maxLength)
			{
				var length = metrics.getWidth(childNodes[i].text);
				if (length > maxLength)
				{
					maxchildNode = childNodes[i];
					maxLength = length;					
				}
			}
		}

		maxLength += 50;

		if (this.xy_MaxWidth < maxLength && this.xy_MaxWidth != null && this.xy_MaxWidth != undefined)
		{
			maxLength = this.xy_MaxWidth;
		}

		if (maxLength < this.m_Tree.getInnerWidth())
		{
			maxLength = this.m_Tree.getInnerWidth();
		}
		this.listLayerEl = Ext.query(".x-combo-list").pop();
		this.innerListEl = Ext.query(".x-combo-list-inner").pop();
		this.treeEl = Ext.query(".x-tree").pop();
		this.treeEl.style.width = maxLength + "px";
		this.innerListEl.style.width = maxLength + "px";
		this.listLayerEl.style.width = maxLength + "px";
	},
	getFullDisplay : function (node)
	{
		if (node == null)
		{
			return;
		}

		var nodearr = node.getPath().split("/");

		var fulldisplay = "";

		for ( var i = 1; i < nodearr.length; i++)
		{
			if (nodearr[i].toString() != "root")
			{
				fulldisplay += this.m_Tree.getNodeById(nodearr[i].toString()).text;
			}
		}

		return fulldisplay;
	},
	onTrigger1Click : function()
	{
		this.onTriggerClick();
	},
	onTrigger2Click : function()
	{
		if (this.disabled)
		{
			return;
		}

		var oldValue = this.getValue();
		this.setValue(null);
		this.setRawValue("");
		if (oldValue != null)
		{
			this.fireEvent("valuechange", this, oldValue, null);
		}
	},
	/**
	 * @private
	 * @override	Ext.form.ComboBox.onTriggerClick
	 */
	onTriggerClick : function()
	{
		if (this.disabled)
		{
			return;
		}

		if (this.isExpanded())
		{
			this.collapse();
			this.el.focus();
		}
		else
		{
			this.onFocus( {});
			this.expand();
			this.el.focus();
		}
	},
	onExpandEvent : function()
	{
		this.m_Tree.render(this.m_TreeDivID);

		this.m_Tree.onTreeLoaderBeforeLoadEvent();

		if (ssc.common.loadStoreParamCompare(this.m_Tree.m_PreBaseParams, this.m_Tree.m_BaseParams))
		{
			/* 参数相同 */
			this.m_Tree.root.expand();
			this.m_loaded = true;
		}
		else
		{
			this.m_Tree.root.reload();

			this.m_Tree.root.expand(false);
		}
	},
	/**
	 * @public
	 * @override	ssc.component.BaseComboBox.setKeyValue
	 * 设置选择项的valueField定位
	 */
	setKeyValue : function(key)
	{
		//不需要实现
	},
	/**
	 * @public
	 * @override	ssc.component.BaseComboBox.getSelectedData
	 * 设置选择项的valueField定位
	 */
	getSelectedData : function()
	{
		var node = this.getValue();
		if (node != null && node != undefined)
		{
			if (node.attributes != null && node.attributes != undefined)
			{
				var data = node.attributes;
				data.loader = undefined;
				data.__proto__ = undefined;

				return data;
			}
		}

		return null;
	},
	/**
	 * @public
	 * @override	ssc.component.BaseComboBox.getSelectedAttr
	 * 设置选择项的valueField定位
	 */
	getSelectedAttr : function(attrname)
	{
		var object = this.getSelectedData();

		if (object != null && object != undefined && attrname != "")
		{
			if (object[attrname] != undefined)
			{
				return object[attrname];
			}
		}

		return "";
	},
	reload : function()
	{
		this.m_loaded = false;
	}	
});
Ext.reg("ssc.component.basecomboboxtree", ssc.component.BaseTreeComboBox);