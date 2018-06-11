Ext.namespace("ssc.taskpool.report.SummaryTeam");

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
		teamid : Ext.get("teamid").dom.value
	};

	pnlMain.QueryEvent(
	{
		jasper : "summaryuser.jasper",
		subdir : "SSC/core/taskpool/report/summaryuser/",
		subreportjasper : "SSC/core/taskpool/report/summaryuser/summaryuser_sub.jasper",
		title : "组员工作量统计表",
		fileName : "summaryuser",
		basePath : Ext.get("basePath").dom.value,
		jsonCondition : Ext.encode(param)
	}, "SSC/ssc_SummaryUserAction$report.action");
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);