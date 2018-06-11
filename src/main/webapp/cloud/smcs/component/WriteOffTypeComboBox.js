Ext.namespace("ssc.smcs.component");

ssc.smcs.component.WriteOffTypeComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "核销类型",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "writeofftype",
	valueField : "writeofftypecode",
	displayField : "writeofftypename",
	xy_StoreFields : [ "writeofftypecode", "writeofftypename" ]
});
Ext.reg("ssc.smcs.component.writeofftypecombobox", ssc.smcs.component.WriteOffTypeComboBox);