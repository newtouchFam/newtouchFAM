Ext.namespace("sm.component");

/**
 * 团队field组件
 * @param
 * 	jsonCondition:
 * 		teamcode	团队编码，支持模糊匹配
 * 		teamname	团队名称，支持模糊匹配
 * 		status		状态，0或1
 */
sm.component.TeamListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "团队",
	emptyText : "请选择团队...",
	xy_WinTitle : "选择团队",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_sm_TeamAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "teamid",
	xy_DisplayField : "teamname",
	xy_FieldList : [ "teamid", "teamcode", "teamname", "teamdesc", "teammemo",
	                 "fullcode", "fullname",
	                 "parentid", "status", "isleaf", "level" ],
	xy_ColumnConfig : [
	{
		header : "编码",
		dataIndex : "teamcode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "名称",
		dataIndex : "teamname",
		width : 150,
		xy_DefaultSearched : true
	},
	{
		header : "状态",
		dataIndex : "status",
		width : 50,
		renderer : ssc.common.RenderUtil.EnableStatus_Color,
		sortable : true
	} ],
	getTeamID : function()
	{
		return this.getSelectedID();
	},
	getTeamCode : function()
	{
		return this.getSelectedAttr("teamcode");
	},
	getTeamName : function()
	{
		return this.getSelectedAttr("teamname");
	}
});
Ext.reg("sm.component.teamlistfield", sm.component.TeamListField);

/**
 * 团队field组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		textfield	显示字段，格式"[,teamcode,],teamname"
 */
sm.component.TeamTreeField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "团队",
	emptyText : "请选择团队...",
	xy_WinTitle : "选择团队",
	xy_WinWidth : 400,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_sm_TeamAction/tree",
	xy_RootTitle : "选择团队",
	xy_LeafOnly : false,
	xy_MultiSelectMode : false,
	getTeamID : function()
	{
		return this.getSelectedID();
	},
	getTeamCode : function()
	{
		return this.getSelectedAttr("teamcode");
	},
	getTeamName : function()
	{
		return this.getSelectedAttr("teamname");
	}
});
Ext.reg("sm.component.teamtreefield", sm.component.TeamTreeField);