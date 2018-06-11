Ext.namespace("ssc.smcs.component");

ssc.smcs.component.IsUrgentComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "紧急程度",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "isurgent",
	valueField : "isurgentcode",
	displayField : "isurgentname",
	xy_StoreFields : [ "isurgentcode", "isurgentname" ]
});
Ext.reg("ssc.smcs.component.isurgentcombobox", ssc.smcs.component.IsUrgentComboBox);