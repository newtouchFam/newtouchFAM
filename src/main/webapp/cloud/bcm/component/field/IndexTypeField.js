Ext.namespace("bcm.component");

/**
 * 预算项目类型field组件
 * @param
 * 	jsonCondition:
 * 		indextypecode	预算项目类型编码，支持模糊匹配
 * 		indextypename	预算项目类型名称，支持模糊匹配
 * 		status			状态，0或1
 */
bcm.component.IndexTypeListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "预算项目类型",
	emptyText : "请选择预算项目类型...",
	xy_WinTitle : "预算项目类型选择",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "bcm/indextype/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "indexTypeID",
	xy_DisplayField : "indexTypeName",
	xy_FieldList : [ "indexTypeID","indexTypeCode", "indexTypeName",
		                 "status", "remark" ],
	xy_ColumnConfig : [
	{
		header : "预算项目类型编码",
		dataIndex : "indexTypeCode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "预算项目类型名称",
		dataIndex : "indexTypeName",
		width : 150,
		xy_DefaultSearched : true
	},
	{
		header : "状态",
		dataIndex : "status",
		width : 50,
		renderer : ssc.common.RenderUtil.EnableStatus_Color
	} ]
});
Ext.reg("ssc.component.indextypelistfield", bcm.component.IndexTypeListField);
		 
/**
 * 已生效预算项目类型field组件
 * @param
 * 	jsonCondition:
 * 		indextypecode	预算项目类型编码，支持模糊匹配
 * 		indextypename	预算项目类型名称，支持模糊匹配
 */
bcm.component.IndexTypeEnabledListField = Ext.extend(bcm.component.IndexTypeListField,
{
	xy_DataActionURL : "bcm/indextype/list/enabled"
});
Ext.reg("bcm.component.indextypeenabledlistfield", bcm.component.IndexTypeEnabledListField);