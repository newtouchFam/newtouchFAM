Ext.namespace("ssc.component");

/**
 * 任务组列表
 */
ssc.component.TPTeamListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "任务组",
	emptyText : "请选择...",
	xy_WinTitle : "选择任务组",
	xy_WinWidth : 400,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_TeamAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : true,
	xy_KeyField : "teamID",
	xy_DisplayField : "teamName",
	xy_FieldList : [ "teamID", "teamCode", "teamName", "methodID", "methodCode", "methodName" ],
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
		width : 125,
		sortable : true
	} ]
});