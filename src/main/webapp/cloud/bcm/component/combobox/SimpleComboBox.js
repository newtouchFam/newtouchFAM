Ext.namespace("bcm.component");

/**
 * 预算控制类型
 */
bcm.component.CtrlTypeComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "控制类型",
	width : 200,
	xy_DataArray : bcm.renderdata.CtrlType,
	initComponent : function()
	{
		bcm.component.CtrlTypeComboBox.superclass.initComponent.call(this);
	}
});
Ext.reg("bcm.component.ctrltypecombobox", bcm.component.CtrlTypeComboBox);

/**
 * 预算控制周期
 */
bcm.component.CtrlPeriodComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "控制周期",
	width : 200,
	xy_DataArray : bcm.renderdata.CtrlPeriod,
	initComponent : function()
	{
		bcm.component.CtrlPeriodComboBox.superclass.initComponent.call(this);
	}
});
Ext.reg("bcm.component.ctrlperiodcombobox", bcm.component.CtrlPeriodComboBox);

/**
 * 预算控制属性
 */
bcm.component.CtrlAttrComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "控制属性",
	width : 200,
	xy_DataArray : bcm.renderdata.CtrlAttr,
	initComponent : function()
	{
		bcm.component.CtrlAttrComboBox.superclass.initComponent.call(this);
	}
});
Ext.reg("bcm.component.ctrlAttrcombobox", bcm.component.CtrlAttrComboBox);
