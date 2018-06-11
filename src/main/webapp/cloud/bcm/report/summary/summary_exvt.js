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
	param.addString("unitid", Ext.get("m8_companyid").dom.value);
	param.addString("casecode", Ext.get("casecode").dom.value);
	param.addInteger("beginmonth", Ext.get("beginmonth").dom.value);
	param.addInteger("endmonth", Ext.get("endmonth").dom.value);
	param.addInteger("budgettype", Ext.get("budgettype").dom.value);
	param.addString("respnidlist", Ext.get("respnidlist").dom.value);
	param.addString("indexidlist", Ext.get("indexidlist").dom.value);
	param.addInteger("budgetyear", Ext.get("budgetyear").dom.value);

	pnlMain.count.call(pnlMain,
	{
		jsonCondition : Ext.encode(param)
	}, "SSC/bcm_DetailAction!count.action", function()
	{
		pnlMain.QueryEvent.call(pnlMain,
		{
			jasper : "detail.jasper",
			subdir : "BCM/core/report/detail/",
			subreportjasper : "BCM/core/report/detail/detail_sub.jasper",
			title : "明细费用查询报表",
			fileName : "detial",
			basePath : Ext.get("basePath").dom.value,
			jsonCondition : Ext.encode(param)
		}, "SSC/bcm_DetailAction$report.action");
	}, this);
}
Ext.onReady(init);