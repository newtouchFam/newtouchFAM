Ext.namespace("ssc.taskpool.basedata.Team");

ssc.taskpool.basedata.Team.TeamEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增任务组",
	height : 200,
	width : 350,
	layout : "fit",
	labelAlign : "right",
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.Add,
	xy_Entity : {},
	initComponent : function()
	{
		this.initUI();

		this.initData();
			
		ssc.taskpool.basedata.Team.TeamEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtTeamCode = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("任务池编码")
		});
		this.edtTeamName = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("任务池名称")
		});

		this.mainFormPanel = new Ext.form.FormPanel(
		{
			frame : true,
			autoWidth : true,
			labelAlign : "right",
			defaults :
			{
				width : 200
			},
			items : [ this.edtTeamCode,
			          this.edtTeamName ]
		});

		this.items = [ this.mainFormPanel ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "新增任务池";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "修改任务池";
			this.edtTeamCode.setValue(this.xy_Entity.teamCode);
			this.edtTeamName.setValue(this.xy_Entity.teamName);
		}
	},
	baseConfirmValid : function()
	{
		if (!this.validData())
		{
			return false;
		}

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			return this.addTeam();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateTeam();
		}
	},
	validData : function()
	{
		var strTeamCode = this.edtTeamCode.getValue().trim();
		var strTeamName = this.edtTeamName.getValue().trim();

		if (strTeamCode.isEmpty())
		{
			MsgUtil.alert("请填写任务组编码!");
			return false;
		}

		if (strTeamName.isEmpty())
		{
			MsgUtil.alert("请填写任务组名称!");
			return false;
		}

		return true;
	},
	addTeam : function()
	{
		this.xy_Entity.teamCode = this.edtTeamCode.getValue().trim();
		this.xy_Entity.teamName = this.edtTeamName.getValue().trim();

		Ext.Ajax.request(
		{
			url : "SSC/ssc_TeamAction!add.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(this.xy_Entity)
			},
			sync : true,
			success : this.baseSuccessCallbackFun,
			failure : this.baseFailureCallbackFun,
			scope : this
		});

		return this.m_ModalResult;
	},
	updateTeam : function()
	{
		this.xy_Entity.teamCode = this.edtTeamCode.getValue().trim();
		this.xy_Entity.teamName = this.edtTeamName.getValue().trim();

		Ext.Ajax.request(
		{
			url : "SSC/ssc_TeamAction!update.action",
			method : "post",
			sync : true,
			params :
			{
				jsonString : Ext.encode(this.xy_Entity)
			},
			success : this.baseSuccessCallbackFun,
			failure : this.baseFailureCallbackFun,
			scope : this
		});

		return this.m_ModalResult;
	}
});