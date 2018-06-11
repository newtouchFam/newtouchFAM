Ext.namespace("ssc.taskpool.report.TaskDetail");

ssc.taskpool.report.TaskDetail.QueryFormPanel = Ext.extend(Ext.FormPanel,
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
			xy_ValueChangeEvent : function()
			{
				this.tgfieldTeamMember.clearSelections();
			},
			prepareBaseParams : function()
			{
				var param =
				{
					tacheid : this.tgfieldTache.getSelectedID()
				};

				return param;
			}.createDelegate(this)
		});
		this.tgfieldTeamMember = new sm.component.TeamMemberListField(
		{
			emptyText : "不选择表示全部",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					tacheid : this.tgfieldTache.getSelectedID(),
					teamid : this.tgfieldTeam.getSelectedID()
				};

				return param;
			}.createDelegate(this)
		});

		this.rdgTaskState = new Ext.form.RadioGroup(
		{
			frame : true,
			layout : "column",
			columns : 2,
			vertical : true,
			fieldLabel : "任务状态",
			items : [
			{
				name : "rdgTaskState",
				boxLabel : "全部",
				trueValue : 99,
				checked : true,
				comboPanel : this.comboPanel
			},
			{
				name : "rdgTaskState",
				boxLabel : "未分配",
				trueValue : 0,
				comboPanel : this.comboPanel
			},
			{
				name : "rdgTaskState",
				boxLabel : "已分配",
				trueValue : 1,
				comboPanel : this.comboPanel
			},
			{
				name : "rdgTaskState",
				boxLabel : "已完成",
				trueValue : 2,
				comboPanel : this.comboPanel
			} ]
		});

		this.items = [ this.dtFieldBegin,
		               this.dtFieldEnd,
		               this.tgfieldTache,
		               this.tgfieldTeam,
		               this.tgfieldTeamMember,
		               this.rdgTaskState ];

		ssc.taskpool.report.TaskDetail.QueryFormPanel.superclass.initComponent.call(this);
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

		var taskstate = this.rdgTaskState.getValue().trueValue;

		var param =
		{
			begindate : strBeginDate,
			enddate : strEndDate,
			tacheid : this.tgfieldTache.getSelectedID(),
			teamid : this.tgfieldTeam.getSelectedID(),
			userid : this.tgfieldTeamMember.getSelectedID(),
			status : taskstate,
			isemergency : 99
		};

		this.xy_MainPanel.QueryEvent.call(this.xy_MainPanel,
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
});

function init()
{
	var pnlMain = new ssc.component.ReportMainPanel(
	{
		xy_QueryPanel : ssc.taskpool.report.TaskDetail.QueryFormPanel,
		xy_QueryWindowWidth : 350,
		xy_QueryWindowHeight : 300
	});
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ pnlMain ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);