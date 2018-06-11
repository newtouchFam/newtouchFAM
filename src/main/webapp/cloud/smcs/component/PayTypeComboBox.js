Ext.namespace("ssc.smcs.component");

ssc.smcs.component.PayTypeComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "支付方式",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "paytype",
	valueField : "paytypecode",
	displayField : "paytypename",
	xy_StoreFields : [ "paytypecode", "paytypename" ]
});
Ext.reg("ssc.smcs.component.paytypecombobox", ssc.smcs.component.PayTypeComboBox);