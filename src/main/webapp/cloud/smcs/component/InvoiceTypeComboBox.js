Ext.namespace("ssc.smcs.component");

ssc.smcs.component.InvoiceTypeComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "支票类型",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "invoicetype",
	valueField : "invoicetypecode",
	displayField : "invoicetypename",
	xy_StoreFields : [ "invoicetypecode", "invoicetypename" ]
});
Ext.reg("ssc.smcs.component.invoicetypecomboBox", ssc.smcs.component.InvoiceTypeComboBox);