Ext.namespace("ssc.component");

/**
 * 覆盖TreeLoader创建node的方法
 * 允许根据传入的是否多选属性，决定是否要显示多选框
 * @param attr
 * @return
 */
Ext.tree.TreeLoader.prototype.createNode = function(attr)
{
    if (this.baseAttrs)
	{
		Ext.applyIf(attr, this.baseAttrs);
	}

    /**
	 * SSC改进，增加选择框
	 */
	if (this.xy_MultiSelectMode == true)
	{
		/* 是否末级 */
		if (attr.leaf == true || attr.leaf == 1)
		{
			/* 末级无条件加上选择框 */
			Ext.applyIf(attr,
			{
				checked : false
			});
		}
		else
		{
			/* 中间级，需检查xy_LeafOnly标志 */
			if (this.xy_LeafOnly != true)
			{
				Ext.applyIf(attr,
				{
					checked : false
				});
			}
		}
	}

	if (this.applyLoader !== false)
	{
		attr.loader = this;
	}
	
	if (this.xy_ColumnTree)
	{
		attr.uiProvider = "col";
	}
	else
	{
		delete attr["uiProvider"];
	}

	if (typeof attr.uiProvider == 'string')
	{
		attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider);
	}
	return (attr.leaf ? new Ext.tree.TreeNode(attr) : new Ext.tree.AsyncTreeNode(attr));
};

/**
 * @class Tree扩展基类<br>
 * @extends Ext.tree.TreePanel<br>
 *
 * 一、特性：<br>
 * 扩展Tree特性基类
 * 1.通过开关支持单选和多选，不需要其他的js文件<br>
 * 2.取数支持action、配置sql文件、配置procedure文件方式<br>
 * 3.支持外部传入固定查询参数<br>
 * 4.支持是否仅有末级可选择开关<br>
 * 5.支持展现默认右键菜单<br>
 * 6.单击中间级可展开<br>
 * 8.支持初始选择项<br>
 * 9.支持初始全部展开，或只展开根节点<br>
 * 10.支持重新加载数据<br>
 */
ssc.component.BaseTree = Ext.extend(Ext.tree.TreePanel,
{
	/**
	 * ==========默认值==========
	 */
	animate : true,
	autoScroll : true,
	border : false,
	enableDD : false,
	rootVisible : true,

	/**
	 * ==========外观与行为==========
	 */
	/* 根节点名称 */
	xy_RootTitle : "请选择",
	/**
	 * 是否只允许选择末级<br>
	 * 单选模式下，不能点击或双击中间级来选择<br>
	 * 多选模式下，中间级没有选择框<br>
	 */
	xy_LeafOnly : false,
	/* 多选模式 */
	xy_MultiSelectMode : false,
	/* 是否展现默认右键菜单 */
	xy_ShowContextMenu : false,
	/**
	 * 点击即选定模式<br>
	 * 在部分组件(例如BaseTreeComboBox)，点击后即选定，不需要展开下级
	 */
	xy_ClickSelectMode : false,

	/* 是否关联下级 */
	xy_LinkLower : false,

	/**
	 * ==========数据加载==========
	 */
	/* 取数action */
	xy_DataActionURL : "",
	/* 取数SQL存放路径 */
	xy_SQLPath : "",
	/* 取数SQL脚本文件名(根节点) */
	xy_SQLFile : "",
	/* 取数SQL脚本文件名(非根节点) */
	xy_SQLFile2 : "",
	/* 取数存储过程脚本文件名 */
	xy_ProcFile : "",
	/* 是否采用新版本的存储过程读取方式 */
	xy_NewProcAction : false,

	/**
	 * 初始查询参数，支持数组和对象两种格式<br>
	 * 数组：[ {name : "status", value : "1"}, {name : "name", value : "杭州"} ]<br>
	 * 对象：{ status : "1", name : "杭州" }<br>
	 */
	xy_BaseParams : null,	
	/* 查询参数是否序列化 */
	xy_ParamJsonSerialize : true,

	/**
	 * ==========初始化==========
	 */
	/* 初始已选择项 */
	xy_InitDataID : "",
	/* 初始是否展开 */
	xy_InitExpand : true,
	/* 初始全部展开 */
	xy_InitExpandAll : false,
	/* 初始展开级别 */
	xy_InitExpandLevel : 0,

	/**
	 * ==========内部成员==========
	 */
	/* 初始已选择项解析后数组 */
	m_InitIDList : [],
	/* 查询参数对象 */
	m_BaseParams : null,
	/* 上次查询参数对象 */
	m_PreBaseParams : null,

	initComponent : function()
	{
		this.initTreeRoot();

		this.initTreeLoader();

		this.initContextMenu();

		ssc.component.BaseTree.superclass.initComponent.call(this);

		this.initEvent();

		if (this.xy_InitDataID != null && this.xy_InitDataID != undefined)
		{
			this.m_InitIDList = this.xy_InitDataID.split(",");
		}

		this.initTteeExpand();
	},
	/**
	 * @private
	 * 初始化根节点
	 */
	initTreeRoot : function()
	{
		this.root = new Ext.tree.AsyncTreeNode(
		{
			id : "root",
			text : this.xy_RootTitle
		});
	},
	/**
	 * @private
	 * 初始化dataLoader
	 */
	initTreeLoader : function()
	{
		var dataURL = "";

		if (ssc.common.StringUtil.isEmpty(this.xy_DataActionURL))
		{
			if (this.xy_NewProcAction)
			{
				/**
				 * 未实现，暂时用旧的
				 * dataURL = "SSC/CommonTreeDataExAction.action";
				 */
				dataURL = "wf/CommonTreeDataAction.action";				
			}
			else
			{
				dataURL = "wf/CommonTreeDataAction.action";	
			}
		}
		else
		{
			dataURL = this.xy_DataActionURL;
		}

		this.loader = new Ext.tree.TreeLoader(
		{
			xy_MultiSelectMode : this.xy_MultiSelectMode,
			xy_LeafOnly : this.xy_LeafOnly,
			dataUrl : dataURL
		});

		this.loader.on("beforeload", this.onTreeLoaderBeforeLoadEvent, this);
		this.loader.on("load", this.onTreeLoaderLoadEvent, this);
		this.loader.on("loadexception", ssc.common.StoreLoadExcpetionEvent);
	},
	/**
	 * @private
	 * TreeLoader准备查询参数
	 */
	onTreeLoaderBeforeLoadEvent : function(/* TreeLoader this*/ treeLoader, /*Object node*/ node)
	{
		var params = null;

		/* 读取基础查询参数 */
		if (this.xy_BaseParams != null || this.xy_BaseParams != undefined)
		{
			params = this.xy_BaseParams;
		}
		else
		{
			if (this.prepareBaseParams != null && this.prepareBaseParams != undefined
					&& typeof (this.prepareBaseParams) == "function")
			{
				params = this.prepareBaseParams();
			}
		}

		if (params == null)
		{
			params = {};
		}

		/* 把数组格式转换为对象格式 */
		this.m_BaseParams = ssc.common.loadStoreParamConvert(params);

		if (! ssc.common.StringUtil.isEmpty(this.xy_SQLPath)
				|| ! ssc.common.StringUtil.isEmpty(this.xy_SQLFile)
				|| ! ssc.common.StringUtil.isEmpty(this.xy_SQLFile2)
				|| ! ssc.common.StringUtil.isEmpty(this.xy_ProcFile))
		{
			ssc.common.loadStoreWfCommonParam(this.loader,
				this.xy_SQLPath,
				this.xy_SQLFile,
				this.xy_SQLFile2,
				this.xy_ProcFile);
		}

		/* 设置到baseParams */
		ssc.common.loadStoreParserParam(this.loader, this.m_BaseParams, this.xy_ParamJsonSerialize);
	},
	onTreeLoaderLoadEvent : function(/* Object */This, /* Object */node, /* Object */response)
	{
		this.m_PreBaseParams = this.m_BaseParams;
	},
	/**
	 * 初始化右键菜单
	 */
	initContextMenu : function()
	{
		var menuItems = [
		{
			text : "展开所有下级",
			handler : function()
			{
				var node = this.getSelectionModel().getSelectedNode();
				node.expand(true);
			},
			scope : this
		},
		{
			text : "收起所有下级",
			handler : function()
			{
				var node = this.getSelectionModel().getSelectedNode();
				node.collapse(true);
			},
			scope : this
		} ];

		if (this.xy_MultiSelectMode)
		{
			menuItems.push("-",
			{
				text : "全选下级",
				handler : function()
				{
					var node = this.getSelectionModel().getSelectedNode();
					this.treeNode_Iterate_Check(node, 1);
				},
				scope : this
			},
			{
				text : "全清下级",
				handler : function()
				{
					var node = this.getSelectionModel().getSelectedNode();
					this.treeNode_Iterate_Check(node, 2);
				},
				scope : this
			},
			{
				text : "反选下级",
				handler : function()
				{
					var node = this.getSelectionModel().getSelectedNode();
					this.treeNode_Iterate_Check(node, 3);
				},
				scope : this
			});
		};

		this.m_TreeContextMenu = new Ext.menu.Menu(
		{
			items : menuItems
		});
	},
	/**
	 * @private
	 * 迭代选择所有下级 type: 选择方式。1全选2全清3反选
	 */
	treeNode_Iterate_Check : function(node, type)
	{
		if (node == null)
		{
			return;
		}

		if (node.getUI().checkbox != undefined)
		{
			if (type === 1)
			{
				node.getUI().checkbox.checked = true;
				node.attributes.checked = true;
			}
			else if (type === 2)
			{
				node.getUI().checkbox.checked = false;
				node.attributes.checked = false;
			}
			else if (type === 3)
			{
				node.getUI().checkbox.checked = !node.getUI().checkbox.checked;
				node.attributes.checked = !node.attributes.checked;
			}
		}

		for ( var i = 0; i < node.childNodes.length; i++)
		{
			var childNode = node.childNodes[i];

			this.treeNode_Iterate_Check(childNode, type);
		}
	},
	/**
	 * @private
	 * 初始化事件
	 */
	initEvent : function()
	{
		this.on("click", this.onClickEvent, this);
		this.on("expandnode", this.onExpandNodeEvent, this);

		if (this.xy_ShowContextMenu)
		{
			this.on("contextmenu", this.onContextMenuEvent, this);
		}

		this.on("checkchange", this.onCheckChangeEvent, this);
	},
	/**
	 * @private
	 * 树点击事件
	 */
	onClickEvent : function(node)
	{
		if (node == null)
		{
			return;
		}

		/* 单击中间级展开 */
		if (node.leaf == 1 || node.leaf == true)
		{
			/* 不是中间级 */
			return;
		}

		if (this.xy_MultiSelectMode == false && this.xy_LeafOnly == false && this.xy_ClickSelectMode == true)
		{
			/* 单选、不限于只选择末级、并且是选择对话框 */
			return;
		}

		if (node.isExpanded())
		{
			node.collapse();
		}
		else
		{
			node.expand();
		}

		return;
	},
	/**
	 * 初始化展开
	 */
	initTteeExpand : function()
	{
		if (! this.xy_InitExpand)
		{
			return;
		}

		if (this.xy_InitExpandAll)
		{
			this.root.expand(true);
		}
		else
		{
			if (this.xy_InitExpandLevel >= 0)
			{
				this.root.expand(false);
			}
		}
	},
	/**
	 * 加载节点时，加载已选定项目
	 */
	onExpandNodeEvent : function(/*Object*/ node)
	{
		for ( var i = 0; i < node.childNodes.length; i++)
		{
			var childNode = node.childNodes[i];
			if (this.m_InitIDList.indexOf(childNode.id) >= 0)
			{
				if (this.xy_MultiSelectMode)
				{
					if (childNode.getUI().checkbox != undefined)
					{
						childNode.getUI().checkbox.checked = true;
						childNode.attributes.checked = true;
					}
				}
				else
				{
					childNode.select();
				}
			}
		}
/*暂不提供按级展开的功能
		if (this.xy_InitExpandLevel >= 0)
		{
			for ( var i = 0; i < node.childNodes.length; i++)
			{
				var childNode = node.childNodes[i];

				if (childNode.getDepth() <= this.xy_InitExpandLevel)
				{
					childNode.expand(false);
				}
			}
		}*/
	},
	/**
	 * 右键上下文菜单事件
	 */
	onContextMenuEvent : function(node, e)
	{
		e.preventDefault();
		node.select();

		this.m_TreeContextMenu.showAt(e.getXY());
	},
	onCheckChangeEvent : function(/*Node*/ _This, /*Boolean*/ checked)
	{
		if (! this.xy_LinkLower)
		{
			return;
		}

		_This.getUI().checkbox.checked = checked;
		_This.attributes.checked = checked;

		if (checked)
		{
			_This.expand(false, false, this.expandCompleteCallback.createDelegate(this));
		}
		else
		{
			for ( var i = 0; i < _This.childNodes.length; i++)
			{
				var childNode = _This.childNodes[i];

				this.fireEvent("checkchange", childNode, false);
			}
		}
	},
	expandCompleteCallback : function(node)
	{
		for ( var i = 0; i < node.childNodes.length; i++)
		{
			var childNode = node.childNodes[i];

			this.fireEvent("checkchange", childNode, true);
		}
	},
	/**
	 * 在查询action提交之前，设置查询参数
	 * 由具体实现类实现
	 * @private
	 * @abstract
	 */
	prepareBaseParams : function()
	{
	},
	/**
	 * @public
	 * 获取所有选择数据的ID<br>
	 * 如单选，则返回TreeNode.id<br>
	 * 如多选，则返回TreeNode.id的字符串，逗号分隔<br>
	 * 不会查找未加载的节点<br>
	 */
	getSelectedID : function()
	{
		var value = "";

		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			var nodes = this.getChecked();
			for ( var i = 0; i < nodes.length; i++)
			{
				var node = nodes[i];

				if (node.id == this.root.id)
				{
					continue;
				}

				if (value.trim().length > 0)
				{
					value += ",";
				}
				value += node.id;
			}
		}
		else
		{
			/* 单选 */
			var node = this.getSelectionModel().getSelectedNode();

			if (node != null && node.id != this.root.id)
			{
				value = node.id;
			}
			else
			{
				value = "";
			}
		}

		return value;
	},
	/**
	 * @public
	 * 获取所有选择数据的文本<br>
	 * 如单选，则返回TreeNode.text<br>
	 * 如多选，则返回TreeNode.text的字符串，逗号分隔<br>
	 * 不会查找未加载的节点<br>
	 */
	getSelectedText : function()
	{
		var value = "";

		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			var nodes = this.getChecked();
			for ( var i = 0; i < nodes.length; i++)
			{
				var node = nodes[i];

				if (node.id == this.root.id)
				{
					continue;
				}

				if (value.trim().length > 0)
				{
					value += ",";
				}
				value += node.text;
			}
		}
		else
		{
			/* 单选 */
			var node = this.getSelectionModel().getSelectedNode();

			if (node != null && node.id != this.root.id)
			{
				value = node.text;
			}
			else
			{
				value = "";
			}
		}

		return value;
	},
	/**
	 * @public
	 * 获取所有选择数据的数据<br>
	 * 如单选，则返回TreeNode.attributes<br>
	 * 如多选，则返回TreeNode.attributes的Array<br>
	 * 不会查找未加载的节点<br>
	 */
	getSelectedData : function()
	{
		var value = [];

		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			var nodes = this.getChecked();
			for ( var i = 0; i < nodes.length; i++)
			{
				var node = nodes[i];

				if (node.id == this.root.id)
				{
					continue;
				}

				var attr = node.attributes;
				attr.loader = undefined;
				attr.__proto__ = undefined;

				value.push(attr);
			}
		}
		else
		{
			/* 单选 */
			var node = this.getSelectionModel().getSelectedNode();

			if (node != null && node.id != this.root.id)
			{
				var attr = node.attributes;
				attr.loader = undefined;
				attr.__proto__ = undefined;

				value = attr;
			}
			else
			{
				value = null;
			}
		}

		return value;
	},
	/**
	 * @public
	 * 获取所有选择数据的特定属性<br>
	 * 如单选，则返回TreeNode.attrname<br>
	 * 如多选，则返回TreeNode.attrname的字符串，逗号分隔<br>
	 * 不会查找未加载的行<br>
	 */
	getSelectedAttr : function(attrname)
	{
		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			var entityList = this.getSelectedData();
			
			var attrList = new Array();
			for (var i = 0; i < entityList.length; i++)
			{
				var entity = entityList[i];

				if (entity != null && entity[attrname] != undefined)
				{
					attrList.push(entity[attrname]);
				}
			}

			return attrList.toString();
		}
		else
		{
			/* 单选 */
			var entity = this.getSelectedData();

			if (entity != null && entity[attrname] != undefined)
			{
				return entity[attrname].toString();
			}
			else
			{
				return "";
			}
		}
	},
	/**
	 * @public
	 * 获取选择项数量<br>
	 */
	getSelectedCount : function()
	{
		if (this.xy_MultiSelectMode)
		{
			var nodes = this.getChecked();

			return nodes.length;
		}
		else
		{
			var node = this.getSelectionModel().getSelectedNode();
			
			if (node != null && node.id != this.root.id)
			{
				return 1;
			}
			else
			{
				return 0;
			}
		}
	},
	/**
	 * @public
	 * 设置已设置的值<br>
	 * 不会查找未加载的节点<br>
	 */
	setSelectedID : function(id)
	{
		this.treeNode_Iterate_Select(this.root, id);
	},
	/**
	 * @private
	 * 迭代所有下级，设置已选项
	 */
	treeNode_Iterate_Select : function(node, id)
	{
		if (node == null)
		{
			return;
		}

		var idlist = id.split(",");
		
		if (idlist.indexOf(node.id) >= 0)
		{
			if (this.xy_MultiSelectMode)
			{
				if (node.getUI().checkbox != undefined)
				{
					node.getUI().checkbox.checked = true;
					node.attributes.checked = true;
				}
			}
			else
			{
				node.select();
			}
		}

		for ( var i = 0; i < node.childNodes.length; i++)
		{
			var childNode = node.childNodes[i];

			this.treeNode_Iterate_Select(childNode, id);
		}
	},
	/**
	 * @public
	 * 清除所有已选项<br>
	 * 不会查找未加载的节点<br>
	 */
	clearSelections : function()
	{
		if (this.xy_MultiSelectMode)
		{
			this.treeNode_Iterate_Clear(this.root);
		}
		else
		{
			var node = this.getSelectionModel().getSelectedNode();
			
			if (node != null && node.id != this.root.id)
			{
				if (node.isSelected())
				{
					node.unselect();
				}
			}
		}
	},
	/**
	 * @private
	 */
	treeNode_Iterate_Clear : function(node)
	{
		if (node == null)
		{
			return;
		}
		
		if (node.getUI().checkbox != undefined)
		{
			node.getUI().checkbox.checked = false;
			node.attributes.checked = false;
		}
		
		for ( var i = 0; i < node.childNodes.length; i++)
		{
			var childNode = node.childNodes[i];

			this.treeNode_Iterate_Clear(childNode);
		}
	},
	/**
	 * @public
	 * 按层级扩展
	 */
	expandLevel : function(level)
	{
		//TreeNode.getDepth();
	}
});
Ext.reg("ssc.component.basetree", ssc.component.BaseTree);