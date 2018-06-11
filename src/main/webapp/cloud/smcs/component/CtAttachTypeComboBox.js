Ext.namespace("ssc.smcs.component");

ssc.smcs.component.CtAttachTypeComboBox =  Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "文件类型",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath  : "ssc/smcs/component",
	xy_ProcFile : "ctattachtype",
	valueField : "attachtypecode",
	displayField : "attachtypename",
	xy_StoreFields : [ "attachtypecode", "attachtypename" ]
});
Ext.reg("ssc.smcs.component.ctattachtypecombobox", ssc.smcs.component.CtAttachTypeComboBox);