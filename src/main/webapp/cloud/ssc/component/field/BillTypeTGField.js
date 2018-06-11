Ext.namespace("ssc.component");

/**
 * 单据类型列表
 */
ssc.component.BillTypeField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "单据类型",
	emptyText : "请选择...",
	xy_WinTitle : "选择单据类型",
	xy_WinWidth : 400,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_BillTypeAction/tree",
	xy_RootTitle : "单据类型",
	xy_LeafOnly : true,
	xy_InitExpandAll : true,
	xy_MultiSelectMode : true
});
Ext.reg("ssc.component.billtypefield", ssc.component.BillTypeField);