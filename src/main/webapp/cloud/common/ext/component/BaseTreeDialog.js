Ext.namespace("ssc.component");

ssc.component.BaseTreeDialog = Ext.extend(ssc.component.BaseDialog,
{
	/**
	 * ==========默认值==========
	 */
	closeAction : "close",

	xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.None,

	/**
	 * ==========外观与行为==========
	 */
	/* 是否显示根节点 */
	xy_RootVisible : true,
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
	xy_ShowContextMenu : true,
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
	m_Tree : null,

	initComponent : function()
	{
		this.initTree();

		this.fillItems();

		ssc.component.BaseListDialog.superclass.initComponent.call(this);

		this.m_Tree.on("bodyresize", this.m_Tree.onBodyResize, this.m_Tree);
		this.m_Tree.on("dblclick", this.btn_OkEvent, this);
	},
	initTree : function()
	{
		this.m_Tree = new ssc.component.BaseTree(
		{
			rootVisible : this.xy_RootVisible,
			xy_RootTitle : this.xy_RootTitle,
			xy_LeafOnly : this.xy_LeafOnly,
			xy_MultiSelectMode : this.xy_MultiSelectMode,
			xy_ShowContextMenu : this.xy_ShowContextMenu,
			xy_ClickSelectMode : this.xy_ClickSelectMode,
			xy_LinkLower : this.xy_LinkLower,

			xy_DataActionURL : this.xy_DataActionURL,
			xy_SQLPath : this.xy_SQLPath,
			xy_SQLFile : this.xy_SQLFile,
			xy_SQLFile2 : this.xy_SQLFile2,
			xy_ProcFile : this.xy_ProcFile,
			xy_NewProcAction : this.xy_NewProcAction,
			xy_BaseParams : this.xy_BaseParams,
			xy_ParamJsonSerialize : this.xy_ParamJsonSerialize,
			prepareBaseParams : this.prepareBaseParams,

			xy_InitDataID : this.xy_InitDataID,
			xy_InitExpand : this.xy_InitExpand,
			xy_InitExpandAll : this.xy_InitExpandAll,
			xy_InitExpandLevel : this.xy_InitExpandLevel
		});
	},
	fillItems : function()
	{
		this.items = [ this.m_Tree ];
	},
	/**
	 * @private 加载数据
	 * force	强制查询
	 */
	loadStoreData : function(/*boolean*/ force)
	{
		this.m_Tree.onTreeLoaderBeforeLoadEvent();

		if (force != true)
		{
			if (ssc.common.loadStoreParamCompare(this.m_Tree.m_PreBaseParams, this.m_Tree.m_BaseParams))
			{
				return;
			}
		}

		this.m_Tree.loader.load(this.m_Tree.root);

		this.m_Tree.initTteeExpand();
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
	 * 点击“确定”按钮后验证方法，加入了选择后校验是否已选择的过程
	 * @private
	 * @override	ssc.component.BaseDialog.baseConfirmValid
	 * @retrun boolean
	 */
	baseConfirmValid : function()
	{
		if (this.xy_MultiSelectMode)
		{
			var nodes = this.m_Tree.getSelectedID();

			if (nodes.length <= 0)
			{
				var msg = "请先选择数据";			
				MsgUtil.alert(msg, this);

				return false;
			}
		}
		else
		{
			if (this.m_Tree.getSelectedID().trim() == "")
			{
				var msg = "请先选择数据";
				MsgUtil.alert(msg, this);

				return false;
			}

			if (this.xy_LeafOnly == true
					&& this.m_Tree.getSelectedData().leaf != true)
			{
				var msg = "不能选择中间级";
				MsgUtil.alert(msg, this);

				return false;
			}
		}

		return  true;
	},
	/**
	 * @public
	 * 是否选定
	 */
	getSelected : function()
	{
		return (this.m_Tree.getSelectedCount() > 0);
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
		return this.m_Tree.getSelectedID();
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
		return this.m_Tree.getSelectedText();
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
		return this.m_Tree.getSelectedData();
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
		return this.m_Tree.getSelectedAttr();
	},
	/**
	 * @public
	 * 获取选择项数量<br>
	 */
	getSelectedCount : function()
	{
		return this.m_Tree.getSelectedCount();
	},
	/**
	 * @public
	 * 清除所有已选项<br>
	 * 不会查找未加载的节点<br>
	 */
	clearSelections : function()
	{
		if (this.m_Tree != null)
		{
			this.m_Tree.clearSelections();
		}
	}
});
Ext.reg("ssc.component.basetreedialog", ssc.component.BaseTreeDialog);