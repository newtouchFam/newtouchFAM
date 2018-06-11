Ext.namespace("demo.report.UnitReport");

demo.report.UnitReport.ConditionWin = Ext.extend(Ext.FormPanel,
{
	frame : true,
	labelAlign : "right",
	labelWidth : 100,
	initComponent : function()
	{
		this.edtUnitText = new Ext.form.TextField(
		{
			fieldLabel : "公司过滤参数"
		});

		this.edtReportParam = new Ext.form.TextField(
		{
			fieldLabel : "传送到报表的参数"
		});

		this.items = [ this.edtUnitText,
		               this.edtReportParam ];

		demo.report.UnitReport.ConditionWin.superclass.initComponent.call(this);
	},
	query : function()
	{
		var param = new ssc.common.BaseCondition();
		param.addString("unittext", this.edtUnitText.getValue());
		param.addString("reportparam", this.edtReportParam.getValue());

		this.xy_MainPanel.QueryEvent.call(this.xy_MainPanel,
		{
			/**
			 * 报表jasper文件路径(非url)，从webapp/webRoot目录算起
			 */
			jasper : "/demo/report/unitreport/unitreport.jasper",
			/**
			 * 报表标题，必填
			 */
			title : "公司用户统计(非分页)",
			/**
			 * 导出/下载默认文件名
			 */
			fileName : "公司用户统计(非分页)",
			/**
			 * 报表查询参数
			 */
			jsonCondition : Ext.encode(param)
		},
		/**
		 * 报表查询url，与Action的@RequestMapping保持一致
		 */
		"/demo/report/unitreport");
	}
});

function init()
{
	var pnlReportMain = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : demo.report.UnitReport.ConditionWin,
		xy_QueryWindowWidth : 360,
		xy_QueryWindowHeight : 300
	});

	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ pnlReportMain ]
	});
}
Ext.onReady(init);