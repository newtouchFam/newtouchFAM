Ext.namespace("ssc.component");

/**
 * 外部接口下拉框(列表)<br>
 */
ssc.component.IfInterfaceComboBoxList = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "外部接口",
	width : 200,
	xy_AllowClear : true,
	valueField : "ifFlag",
	displayField : "ifName",
	xy_DataActionURL : "SSC/ssc_IfInterfaceAction/list",
	xy_StoreFields : [ "ifFlag", "ifName",
			           "moduleCode", "moduleName",
			           "direct",
			           "outSystemCode", "outSystemName",
			           "status", "remark" ]
});
Ext.reg("ssc.component.ifinterfacecomboboxlist", ssc.component.IfInterfaceComboBoxList);