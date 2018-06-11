Ext.namespace("ssc.taskpool.report.SummaryUser");

function init()
{
	var pnlMain = new ssc.component.ReportMainPanel( {});
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ pnlMain ]
	});

	var param =
	{
		begindate : Ext.get("begindate").dom.value,
		enddate : Ext.get("enddate").dom.value,
		tacheid : Ext.get("tacheid").dom.value,
		teamid : Ext.get("teamid").dom.value,
		userid : Ext.get("userid").dom.value,
		status : Ext.get("status").dom.value,
		isemergency : Ext.get("isemergency").dom.value
	};

	pnlMain.QueryEvent(
	{
		jasper : "taskdetail.jasper",
		subdir : "SSC/core/taskpool/report/taskdetail/",
		subreportjasper : "SSC/core/taskpool/report/taskdetail/taskdetail_sub.jasper",
		title : "组员任务明细表",
		fileName : "taskdetail",
		basePath : Ext.get("basePath").dom.value,
		jsonCondition : Ext.encode(param)
	}, "SSC/ssc_TaskDetailAction$report.action");
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);