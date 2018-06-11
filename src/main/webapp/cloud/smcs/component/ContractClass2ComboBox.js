Ext.namespace("ssc.smcs.component");

ssc.smcs.component.ContractClass2ComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "合同大类",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "contractclass2",
	valueField : "contractclasscode",
	displayField : "contractclassname",
	xy_StoreFields : [ "contractclasscode", "contractclassname"]
});
Ext.reg("ssc.smcs.component.contractclass2combobox", ssc.smcs.component.ContractClass2ComboBox);