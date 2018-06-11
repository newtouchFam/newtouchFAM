Ext.namespace("bcm.component");

/**
 * 预算项目field组件
 * @param
 * 	jsonCondition:
 * 		casecode	预算方案编码
 * 		year		预算年份
 * 		indexcode	预算项目编码，支持模糊匹配
 * 		indexname	预算项目名称，支持模糊匹配
 * 		indextext	预算项目编码或名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
bcm.component.IndexListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "预算项目",
	emptyText : "请选择预算项目...",
	xy_WinTitle : "预算项目",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "bcm/index/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "indexID",
	xy_DisplayField : "indexName",
	xy_FieldList : [ "indexID", "indexCode", "indexName",
	                 "level", "isLeaf", "fullCode", "fullName", "status", "remark",
	                 "caseCode", "caseName",
	                 "parentID", "parentCode", "parentName",
	                 "indexTypeID", "indexTypeCode", "indexTypeName"],
	xy_ColumnConfig : [
	{
		header : "编码",
		dataIndex : "indexCode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "名称",
		dataIndex : "indexName",
		width : 150,
		xy_DefaultSearched : true
	},
	{
		header : "状态",
		dataIndex : "status",
		width : 50,
		renderer : ssc.common.RenderUtil.EnableStatus_Color
	},
	{
		header : "是否末级",
		dataIndex : "isLeaf",
		width : 50,
		renderer : ssc.common.RenderUtil.YesOrNo_FocusYes
	},
	{
		header : "类型名称",
		dataIndex : "indexTypeName",
		width : 100
	},
	{
		header : "上级编码",
		dataIndex : "parentCode",
		width : 100
	},
	{
		header : "上级名称",
		dataIndex : "parentName",
		width : 100
	},
	{
		header : "预算方案编码",
		dataIndex : "caseCode",
		width : 100
	},
	{
		header : "预算方案名称",
		dataIndex : "caseName",
		width : 100
	} ],
	getIndexID : function()
	{
		return this.getSelectedID();
	},
	getIndexCode : function()
	{
		return this.getSelectedAttr("indexCode");
	},
	getIndexName : function()
	{
		return this.getSelectedAttr("indexName");
	},
	getCaseCode : function()
	{
		return this.getSelectedAttr("caseCode");
	},
	getCaseName : function()
	{
		return this.getSelectedAttr("caseName");
	}
});
Ext.reg("bcm.component.indexlistfield", bcm.component.IndexListField);

/**
 * 预算项目field组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		casecode	预算方案编码
 * 		year		预算年份
 * 		textfield	显示字段，格式"[,indexCode,],indexName"
 */
bcm.component.IndexTreeField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "预算项目",
	emptyText : "请选择预算项目...",
	xy_WinTitle : "预算项目",
	xy_RootTitle : "预算项目",
	xy_LeafOnly : false,
	xy_DataActionURL : "bcm/index/tree",
	getIndexID : function()
	{
		return this.getSelectedID();
	},
	getIndexCode : function()
	{
		return this.getSelectedAttr("indexCode");
	},
	getIndexName : function()
	{
		return this.getSelectedAttr("indexName");
	},
	getCaseCode : function()
	{
		return this.getSelectedAttr("caseCode");
	},
	getCaseName : function()
	{
		return this.getSelectedAttr("caseName");
	}
});
Ext.reg("bcm.component.indextreefield", bcm.component.IndexTreeField);

/**
 * 预算项目field组件(树)，可关联下级
 * @param
 * 	root
 * 	jsonCondition:
 * 		casecode	预算方案编码
 * 		year		预算年份
 * 		textfield	显示字段，格式"[,indexCode,],indexName"
 */
bcm.component.IndexTreeLinkField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "预算项目",
	emptyText : "请选择预算项目...",
	xy_WinTitle : "预算项目",
	xy_RootTitle : "预算项目",
	xy_LeafOnly : false,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "bcm/index/tree",
	/**
	 * @override ssc.component.BaseListField.createDialog
	 */
	createDialog : function()
	{
		this.m_Dialog = new bcm.component.IndexTreeDialogLink(
		{
			title : this.xy_WinTitle,
			width : this.xy_WinWidth,
			height : this.xy_WinHeight,
			closeAction : "hide",

			xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
			xy_ButtonStyle : this.xy_ButtonStyle,
			xy_EditMode : ssc.component.DialogEditModeEnum.None,
			xy_RootTitle : this.xy_RootTitle,
			xy_LeafOnly : this.xy_LeafOnly,
			xy_MultiSelectMode : this.xy_MultiSelectMode,
			xy_ShowContextMenu : this.xy_ShowContextMenu,
			xy_ClickSelectMode : this.xy_ClickSelectMode,

			xy_DataActionURL : this.xy_DataActionURL,
			xy_SQLPath : this.xy_SQLPath,
			xy_SQLFile : this.xy_SQLFile,
			xy_SQLFile2 : this.xy_SQLFile2,
			xy_ProcFile : this.xy_ProcFile,
			xy_BaseParams : this.xy_BaseParams,
			xy_ParamJsonSerialize : this.xy_ParamJsonSerialize,
			prepareBaseParams : ((this.prepareBaseParams !== undefined) ? this.prepareBaseParams.createDelegate(this)
					: undefined),

			xy_InitDataID : this.xy_InitDataID,
			xy_InitExpand : this.xy_InitExpand,
			xy_InitExpandAll : this.xy_InitExpandAll,
			xy_InitExpandLevel : this.xy_InitExpandLevel,

			xy_ParentObjHandle : this.xy_ParentObjHandle,
			xy_OKClickEvent : this.xy_OKClickEvent
		});
	},
	getIndexID : function()
	{
		return this.getSelectedID();
	},
	getIndexCode : function()
	{
		return this.getSelectedAttr("indexCode");
	},
	getIndexName : function()
	{
		return this.getSelectedAttr("indexName");
	},
	getCaseCode : function()
	{
		return this.getSelectedAttr("caseCode");
	},
	getCaseName : function()
	{
		return this.getSelectedAttr("caseName");
	}
});
Ext.reg("bcm.component.indextreelinkfield", bcm.component.IndexTreeLinkField);
