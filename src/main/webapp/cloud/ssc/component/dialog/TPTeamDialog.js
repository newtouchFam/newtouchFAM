Ext.namespace("ssc.component");

/**
 * 任务组列表选择对话框
 * 全部任务组
 */
ssc.component.TaskPoolTeamListDialog = Ext.extend(ssc.component.BaseListDialog,
{
	/* 默认值 */
	title : "任务组选择",
	width : 500,
	height : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_TeamAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : true,
	xy_KeyField : "teamID",
	xy_DisplayField : "teamName",
	xy_FieldList : [ "teamID", "teamCode", "teamName" ],
	xy_ColumnConfig : [
	{
		header : "任务组编码",
		dataIndex : "teamCode",
		width : 150,
		sortable : true
	},
	{
		header : "任务组名称",
		dataIndex : "teamName",
		width : 200,
		sortable : true
	} ]
});
Ext.reg("ssc.component.taskpoolteamlistdialog", ssc.component.TaskPoolTeamListDialog);

/**
 * 转发其他任务组
 */
ssc.component.TaskPoolSameTacheOtherTeamListDialog = Ext.extend(ssc.component.BaseListDialog,
{
	/* 默认值 */
	title : "任务组选择",
	width : 500,
	height : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_TeamAction!getPageSameTacheOtherTeam.action",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "TEAMID",
	xy_DisplayField : "TEAMNAME",
	xy_FieldList : [ "TEAMID", "TEAMCODE", "TEAMNAME", "TASKCOUNT" ],
	xy_ColumnConfig : [
	{
		header : "任务组编码",
		dataIndex : "TEAMCODE",
		width : 120,
		sortable : true
	},
	{
		header : "任务组名称",
		dataIndex : "TEAMNAME",
		width : 140,
		sortable : true
	},
	{
		header : "未完成工作量",
		dataIndex : "TASKCOUNT",
		align : "right",
		width : 70,
		sortable : true
	}]
});