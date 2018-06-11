Ext.namespace("sm.component");

/**
 * 用户状态
 */
sm.component.UserStatusComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "用户状态",
	width : 200,
	xy_DataArray : sm.renderdata.UserStatus,
	initComponent : function()
	{
		sm.component.UserStatusComboBox.superclass.initComponent.call(this);
	}
});

/**
 * 角色类型
 */
sm.component.RoleTypeComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "用户状态",
	width : 200,
	xy_DataArray : sm.renderdata.RoleType,
	initComponent : function()
	{
		sm.component.UserStatusComboBox.superclass.initComponent.call(this);
	}
});