Ext.namespace("ssc.component");

/**
 * 分配任务组员
 * condition:
 * xy_BaseParams.teamid
 * xy_BaseParams.userid
 */
ssc.component.TPTeamMemberAssignDialog = Ext.extend(ssc.component.BaseListDialog,
{
	title : "组员选择",
	width : 550,
	height : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_TeamUserAction!getPageTeamMemberAssign.action",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "USERID",
	xy_DisplayField : "USERNAME",
	xy_FieldList : [ "USERID", "USERCODE", "USERNAME",
	                 "UNITID", "UNITCODE", "UNITNAME",
	                 "DEPTID", "DEPTCODE", "DEPTNAME",
	                 "ISLEADER",
	                 "TEAMID", "TEAMCODE", "TEAMNAME",
	                 "TASKCOUNT_TEAM", "TASKCOUNT_ALL", "WICOUNT_ALL" ],
	xy_ColumnConfig : [
	{
		header : "姓名",
		dataIndex : "USERNAME",
		width : 70,
		sortable : true
	},
	{
		header : "所属任务组",
		dataIndex : "TEAMNAME",
		width : 90,
		sortable : true
	},
	{
		header : "是否组长",
		dataIndex : "ISLEADER",
		align : "center",
		width : 60,
		renderer : ssc.common.RenderUtil.YesOrNo_FocusYes,
		sortable : true
	},
	{
		header : "剩余工作量(本组)",
		dataIndex : "TASKCOUNT_TEAM",
		align : "right",
		width : 100,
		sortable : true
	},
	{
		header : "剩余工作量(全部)",
		dataIndex : "TASKCOUNT_ALL",
		align : "right",
		width : 100,
		sortable : true
	},
	{
		header : "待办数量",
		dataIndex : "WICOUNT_ALL",
		align : "right",
		width : 60,
		sortable : true
	},
	{
		header : "单位",
		dataIndex : "UNITNAME",
		width : 120,
		sortable : true
	},
	{
		header : "部门",
		dataIndex : "DEPTNAME",
		width : 100,
		sortable : true
	} ]
});
Ext.reg("ssc.component.tpteammemberassigndialog", ssc.component.TPTeamMemberAssignDialog);
