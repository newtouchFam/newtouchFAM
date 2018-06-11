Ext.namespace("ssc.smcs.component");
ssc.smcs.component.EconItemTypeComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "经济事项类型",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : true,
	xy_DataActionURL : "SSC/ssc_smcs_EconItemTypeAction/list",
	valueField : "econItemTypeID",
	displayField : "econItemTypeName",
	xy_StoreFields : [ "econItemTypeID", "econItemTypeCode", "econItemTypeName" ]
	
});
Ext.reg("ssc.smcs.component.econitemcombobox", ssc.smcs.component.EconItemTypeComboBox);