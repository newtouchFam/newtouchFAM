Ext.namespace("sm.component");

/**
 * 菜单账套下拉框组件
 * @param
 * 	jsonCondition	无
 */
sm.component.MenuFrameSetListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "菜单账套",
	width : 200,
	xy_AllowClear : true,
	valueField : "framesetid",
	displayField : "framesetname",
	xy_DataActionURL : "SSC/ssc_sm_MenuFrameSetAction/list",
	xy_StoreFields : [ "framesetid","framesetname", "isdefault" ]
});
Ext.reg("sm.component.menuframesetlistcombobox", sm.component.MenuFrameSetListComboBox);