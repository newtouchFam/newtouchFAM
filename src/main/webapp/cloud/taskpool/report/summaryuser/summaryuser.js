Ext.namespace("ssc.taskpool.report.SummaryUser");

ssc.taskpool.report.SummaryUser.QueryFormPanel = Ext.extend(Ext.FormPanel,
{
	frame : true,
	labelAlign : "right",
	labelWidth : 100,
	defaults :
	{
		width : 200
	},
	initComponent : function()
	{
		this.dtFieldBegin = new Ext.form.DateField(
		{
			fieldLabel : "到达日期从",
			width : 100,
			format : "Y-m-d",
			value : ssc.common.DateUtil.getMonthFirstDay(),
			readOnly : true
		});
		this.dtFieldEnd = new Ext.form.DateField(
		{
			fieldLabel : "到",
			width : 100,
			format : "Y-m-d",
			value : ssc.common.DateUtil.getNow(),
			readOnly : true
		});
		this.tgfieldTache = new ssc.component.TPTacheListField(
		{
			emptyText : "不选择表示全部",
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function()
			{
				this.tgfieldTeam.clearSelections();
			}
		});
		this.tgfieldTeam = new ssc.component.TPTeamListField(
		{
			emptyText : "不选择表示全部",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					tacheid : this.tgfieldTache.getSelectedID()
				};

				return param;
			}.createDelegate(this)
		});

		this.items = [ this.dtFieldBegin, this.dtFieldEnd, this.tgfieldTache, this.tgfieldTeam ];

		ssc.taskpool.report.SummaryUser.QueryFormPanel.superclass.initComponent.call(this);
	},
	query : function()
	{
		var strBeginDate = this.dtFieldBegin.getValue().format("Y-m-d");
		var strEndDate = this.dtFieldEnd.getValue().format("Y-m-d");

		if (strBeginDate > strEndDate)
		{
			MsgUtil.alert("起始日期应不大于终止日期");
			return;
		}

		var param =
		{
			begindate : strBeginDate,
			enddate : strEndDate,
			tacheid : this.tgfieldTache.getSelectedID(),
			teamid : this.tgfieldTeam.getSelectedID()
		};

		this.xy_MainPanel.QueryEvent.call(this.xy_MainPanel,
		{
			jasper : "summaryuser.jasper",
			subdir : "SSC/core/taskpool/report/summaryuser/",
			subreportjasper : "SSC/core/taskpool/report/summaryuser/summaryuser_sub.jasper",
			exvtreporturl : "SSC/core/taskpool/report/summaryuser/summaryuser_exvt.jsp",
			title : "组员工作量统计表",
			fileName : "summaryuser",
			basePath : Ext.get("basePath").dom.value,
			jsonCondition : Ext.encode(param)
		}, "SSC/ssc_SummaryUserAction$report.action");
	}
});

function init()
{
	var pnlMain = new ssc.component.ReportMainPanel(
	{
		xy_QueryPanel : ssc.taskpool.report.SummaryUser.QueryFormPanel,
		xy_QueryWindowWidth : 350,
		xy_QueryWindowHeight : 250
	});
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ pnlMain ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);