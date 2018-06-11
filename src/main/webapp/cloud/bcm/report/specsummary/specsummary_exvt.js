Ext.namespace("bcm.report.Summary");

function init()
{
	var pnlMain = new ssc.component.ReportMainPanel(
	{
		xy_Limit : 100,
		xy_MaxLimit : 30000,
		abovelimitconfirm : false
	});

	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ pnlMain ]
	});

	var param = new ssc.common.BaseCondition();
	param.addString("casecode", Ext.get("casecode").dom.value);
	param.addInteger("beginmonth", Ext.get("beginmonth").dom.value);
	param.addInteger("endmonth", Ext.get("endmonth").dom.value);
	param.addInteger("budgettype", Ext.get("budgettype").dom.value);
	param.addString("unitidlist", Ext.get("unitidlist").dom.value);
	param.addString("specidlist", Ext.get("specidlist").dom.value);
	param.addInteger("budgetyear", Ext.get("budgetyear").dom.value);
	param.addString("respnidlist", Ext.get("respnid").dom.value);
	param.addString("indexidlist", Ext.get("indexid").dom.value);

	pnlMain.count.call(pnlMain,
	{
		jsonCondition : Ext.encode(param)
	}, "SSC/bcm_SpecDetailAction!count.action", function()
	{
		pnlMain.QueryEvent.call(pnlMain,
		{
			jasper : "specdetail.jasper",
			subdir : "BCM/core/report/specdetail/",
/*2013-01-29 改在action层处理
			subreportjasper : "BCM/core/report/specdetail/specdetail_sub.jasper",
*/
			title : "专项费用明细查询报表",
			fileName : "specdetail",
			basePath : Ext.get("basePath").dom.value,
			jsonCondition : Ext.encode(param)
		}, "SSC/bcm_SpecDetailAction$report.action");
	}, this);
}
Ext.onReady(init);