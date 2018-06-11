Ext.namespace("sm.component");

/**
 * 模块下拉框组件
 * @param
 * 	jsonCondition	无
 */
sm.component.ModuleListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "模块",
	width : 200,
	xy_AllowClear : true,
	valueField : "moduleCode",
	displayField : "moduleName",
	xy_DataActionURL : "sm/module/list",
	xy_StoreFields : [ "moduleCode", "moduleName", "status" ],
	getModuleCode : function()
	{
		return this.getSelectedAttr("moduleCode");
		
	},
	getModuleName : function()
	{
		return this.getSelectedAttr("moduleName");		
	}
});
Ext.reg("sm.component.modulelistcombobox", sm.component.ModuleListComboBox);