Ext.namespace("sm.component");

/**
 * 角色field组件
 * @param
 * 	jsonCondition:
 * 		rolename	角色编码，支持模糊匹配
 * 		roledesc	角色名称，支持模糊匹配
 * 		status		状态，0或1
 * 		type		类型
 */
sm.component.RoleListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "角色",
	emptyText : "请选择角色...",
	xy_WinTitle : "选择角色",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_sm_RoleAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "roleid",
	xy_DisplayField : "rolename",
	xy_FieldList : [ "roleid", "rolename", "roledesc",
	                 "status", "type" ],
	xy_ColumnConfig : [
	{
		header : "名称",
		dataIndex : "rolename",
		width : 80,
		xy_DefaultSearched : true
	},
	{
		header : "描述",
		dataIndex : "roledesc",
		width : 150,
		xy_Searched : true
	},
	{
		header : "状态",
		dataIndex : "status",
		width : 50,
		renderer : ssc.common.RenderUtil.EnableStatus_Color
	},
	{
		header : "类型",
		dataIndex : "type",
		width : 50
	} ],
	getRoleID : function()
	{
		return this.getSelectedID();
	},
	getRoleName : function()
	{
		return this.getSelectedAttr("rolename");
	},
	getRoleDesc : function()
	{
		return this.getSelectedAttr("roledesc");
	},
	getRoleStatus : function()
	{
		return this.getSelectedAttr("status");
	},
	getRoleType : function()
	{
		return this.getSelectedAttr("type");
	}
});
Ext.reg("sm.component.rolelistfield", sm.component.RoleListField);