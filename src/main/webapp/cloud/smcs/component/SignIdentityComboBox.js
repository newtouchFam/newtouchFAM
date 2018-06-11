Ext.namespace("ssc.smcs.component");

ssc.smcs.component.SignIdentityComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "签约身份",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "signidentity",
	valueField : "signidentitycode",
	displayField : "signidentityname",
	xy_StoreFields : [ "signidentitycode", "signidentityname" ]
});
Ext.reg("ssc.smcs.component.signidentitycombobox", ssc.smcs.component.SignIdentityComboBox);