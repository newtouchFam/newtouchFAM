Ext.namespace("ssc.component");

/**
 * 外部系统下拉框(列表)<br>
 */
ssc.component.IfOutSystemComboBoxList = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "外部系统",
	width : 200,
	xy_AllowClear : true,
	valueField : "outSystemCode",
	displayField : "outSystemName",
	xy_DataActionURL : "SSC/ssc_IfOutSystemAction/list",
	xy_StoreFields : [ "outSystemCode", "outSystemName", "status", "remark" ]
});
Ext.reg("ssc.component.ifoutsystemcomboboxlist", ssc.component.IfOutSystemComboBoxList);