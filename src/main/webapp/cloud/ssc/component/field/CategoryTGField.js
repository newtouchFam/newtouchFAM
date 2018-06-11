Ext.namespace("ssc.component");

/**
 * 字典信息field组件
 * @param
 * 	jsonCondition:
 * 		categorytype	类型编码，必填
 * 		categorycode	编码，支持模糊匹配
 * 		categoryname	名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
ssc.component.CategoryListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "[字典信息]",
	emptyText : "请选择[字典信息]...",
	xy_WinTitle : "[字典信息]",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_CategoryAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "categoryCode",
	xy_DisplayField : "categoryName",
	xy_FieldList : [ "categoryCode", "categoryName",
		                 "status", "level", "isLeaf",
		                 "parentCode", "parentName",
		                 "categoryTypeID", "categoryTypeCode", "categoryTypeName",
		                 "strValue", "otherValue", "varDesc" ],
	xy_ColumnConfig : [
	{
		header : "编码",
		dataIndex : "categoryCode",
		width : 80,
		sortable : true,
		xy_Searched : true
	},
	{
		header : "名称",
		dataIndex : "categoryName",
		width : 150,
		sortable : true,
		xy_DefaultSearched : true
	},
	{
		header : "状态",
		dataIndex : "status",
		width : 50,
		renderer : ssc.common.RenderUtil.EnableStatus_Color,
		sortable : true
	},
	{
		header : "是否末级",
		dataIndex : "isLeaf",
		width : 50,
		renderer : ssc.common.RenderUtil.YesOrNo_FocusYes,
		sortable : true
	} ],
	getCategoryCode : function()
	{
		return this.getSelectedID();
	},
	getCategoryName : function()
	{
		return this.getSelectedAttr("categoryName");
	},
	getCategoryTypeID : function()
	{
		return this.getSelectedAttr("categoryTypeID");
	},
	getCategoryTypeCode : function()
	{
		return this.getSelectedAttr("categoryTypeCode");
	},
	getCategoryTypeName : function()
	{
		return this.getSelectedAttr("categoryTypeName");
	}
});
Ext.reg("ssc.component.categorylistfield", ssc.component.CategoryListField);

/**
 * 字典信息field组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		categorytype	类型编码，必填
 * 		status		状态，0或1
 * 		textfield	显示字段，格式"[,categorycode,],categoryname"
 */
ssc.component.CategoryTreeField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "[字典信息]",
	emptyText : "请[字典信息]...",
	xy_WinTitle : "[字典信息]",
	xy_RootTitle : "[字典信息]",
	xy_LeafOnly : false,
	xy_DataActionURL : "SSC/ssc_CategoryAction/tree",
	getCategoryCode : function()
	{
		return this.getSelectedID();
	},
	getCategoryName : function()
	{
		return this.getSelectedAttr("categoryName");
	},
	getCategoryTypeID : function()
	{
		return this.getSelectedAttr("categoryTypeID");
	},
	getCategoryTypeCode : function()
	{
		return this.getSelectedAttr("categoryTypeCode");
	},
	getCategoryTypeName : function()
	{
		return this.getSelectedAttr("categoryTypeName");
	}
});
Ext.reg("ssc.component.categorytreefield", ssc.component.CategoryTreeField);
