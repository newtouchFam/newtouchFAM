Ext.namespace("demo.report.DeptPageReport");

demo.report.DeptPageReport.ConditionWin = Ext.extend(Ext.FormPanel,
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

		this.edtDeptText = new Ext.form.TextField(
		{
			fieldLabel : "部门过滤参数"
		});

		this.edtReportParam = new Ext.form.TextField(
		{
			fieldLabel : "传送到报表的参数"
		});

		this.items = [ this.edtUnitText,
		               this.edtDeptText,
		               this.edtReportParam ];

		demo.report.DeptPageReport.ConditionWin.superclass.initComponent.call(this);
	},
	query : function()
	{
		var param = new ssc.common.BaseCondition();
		param.addString("unittext", this.edtUnitText.getValue());
		param.addString("depttext", this.edtDeptText.getValue());
		param.addString("reportparam", this.edtReportParam.getValue());

		this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
		{
			/**
			 * (浏览)报表jasper文件路径(非url)，从webapp/webRoot目录算起
			 */
			jasper : "/demo/report/deptpagereport/deptpagereport.jasper",
			/**
			 * (导出)报表jasper文件路径(非url)，从webapp/webRoot目录算起
			 */
			jasper_export : "/demo/report/deptpagereport/deptpagereport.jasper",
			/**
			 * 报表标题，必填
			 */
			title : "部门用户统计(分页)",
			/**
			 * 导出/下载默认文件名
			 */
			fileName : "部门用户统计(分页)",
			/**
			 * 报表查询参数
			 */
			jsonCondition : Ext.encode(param)
		},
		/**
		 * 报表查询url，与Action的@RequestMapping保持一致
		 */
		"/demo/report/deptpagereport");
	}
});

function init()
{
	var pnlReportMain = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : demo.report.DeptPageReport.ConditionWin,
		xy_QueryWindowWidth : 360,
		xy_QueryWindowHeight : 300,
		xy_Limit : 100,
		xy_MaxLimit : 30000,
		abovelimitconfirm : false
	});

	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ pnlReportMain ]
	});
}
Ext.onReady(init);