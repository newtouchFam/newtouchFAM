Ext.namespace("ssc.smcs.component");

ssc.smcs.component.TaxPayerQualityComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "纳税人资质",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "taxpayerquality",
	valueField : "taxpayerqualitycode",
	displayField : "taxpayerqualityname",
	xy_StoreFields : [ "taxpayerqualitycode", "taxpayerqualityname" ]
});
Ext.reg("ssc.smcs.component.taxpayerqualitycombobox", ssc.smcs.component.TaxPayerQualityComboBox);