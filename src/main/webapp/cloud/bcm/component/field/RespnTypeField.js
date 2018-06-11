Ext.namespace("bcm.component");

/**
 * 责任中心类型field组件
 * @param
 * 	jsonCondition:
 * 		respntypecode	责任中心类型编码，支持模糊匹配
 * 		respntypename	责任中心类型名称，支持模糊匹配
 * 		status			状态，0或1
 */
bcm.component.RespnTypeListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "责任中心类型",
	emptyText : "请选择责任中心类型...",
	xy_WinTitle : "责任中心类型选择",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "bcm/respntype/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "respnTypeID",
	xy_DisplayField : "respnTypeName",
	xy_FieldList : [ "respnTypeID","respnTypeCode", "respnTypeName",
		                 "status", "remark" ],
	xy_ColumnConfig : [
	{
		header : "责任中心类型编码",
		dataIndex : "respnTypeCode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "责任中心类型名称",
		dataIndex : "respnTypeName",
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
Ext.reg("bcm.component.respntypelistfield", bcm.component.RespnTypeListField);

/**
 * 已生效责任中心类型field组件
 * @param
 * 	jsonCondition:
 * 		respntypecode	责任中心类型编码，支持模糊匹配
 * 		respntypename	责任中心类型名称，支持模糊匹配
 */
bcm.component.RespnTypeEnabledListField = Ext.extend(bcm.component.RespnTypeListField,
{
	xy_DataActionURL : "bcm/respntype/list/enabled"
});
Ext.reg("bcm.component.respntypeenabledlistfield", bcm.component.RespnTypeEnabledListField);