Ext.namespace("ssc.component");

/**
 * 是否
 */
ssc.component.YesNoComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "是否",
	width : 200,
	xy_DataArray : RenderMapData.YesNo,
	initComponent : function()
	{
		ssc.component.YesNoComboBox.superclass.initComponent.call(this);
	},
	isTrue : function()
	{
		return (this.getKeyValue() == 1);
	},
	isFalse : function()
	{
		return (this.getKeyValue() == 0);
	},
	isYes : function()
	{
		return (this.getKeyValue() == 1);
	},
	isNo : function()
	{
		return (this.getKeyValue() == 0);
	}
});
Ext.reg("ssc.component.yesnocombobox", ssc.component.YesNoComboBox);

/**
 * 状态
 */
ssc.component.StatusComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "状态",
	width : 200,
	xy_DataArray : RenderMapData.Status,
	initComponent : function()
	{
		ssc.component.StatusComboBox.superclass.initComponent.call(this);
	},
	isEnable : function()
	{
		return (this.getKeyValue() == 1);
	},
	isDisable : function()
	{
		return (this.getKeyValue() == 0);
	}
});
Ext.reg("ssc.component.statuscombobox", ssc.component.StatusComboBox);

/**
 * 启用
 */
ssc.component.EnableComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "启用",
	width : 200,
	xy_DataArray : RenderMapData.Enable,
	initComponent : function()
	{
		ssc.component.EnableComboBox.superclass.initComponent.call(this);
	},
	isEnable : function()
	{
		return (this.getKeyValue() == 1);
	},
	isDisable : function()
	{
		return (this.getKeyValue() == 0);
	}
});
Ext.reg("ssc.component.enablecombobox", ssc.component.EnableComboBox);

/**
 * 开启关闭
 */
ssc.component.OpenCloseComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "启用",
	width : 200,
	xy_DataArray : RenderMapData.OpenClose,
	initComponent : function()
	{
		ssc.component.OpenCloseComboBox.superclass.initComponent.call(this);
	},
	isOpen : function()
	{
		return (this.getKeyValue() == 1);
	},
	isClose : function()
	{
		return (this.getKeyValue() == 0);
	}
});
Ext.reg("ssc.component.openclosecombobox", ssc.component.OpenCloseComboBox);

/**
 * 月份
 */
ssc.component.MonthComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "月份",
	width : 200,
	xy_DataArray : RenderMapData.Month,
	initComponent : function()
	{
		ssc.component.MonthComboBox.superclass.initComponent.call(this);
	}
});
Ext.reg("ssc.component.monthcombobox", ssc.component.MonthComboBox);