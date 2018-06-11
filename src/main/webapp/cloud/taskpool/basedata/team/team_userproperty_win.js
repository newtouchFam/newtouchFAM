Ext.namespace("ssc.taskpool.basedata.Team");

ssc.taskpool.basedata.Team.UserPropertyWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "组员设置",
	height : 250,
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
			
		ssc.taskpool.basedata.Team.UserPropertyWin.superclass.initComponent.call(this);

		this.on("show", this.OnShowEvent, this);
	},
	initUI : function()
	{
		this.edtTeamName = new Ext.form.TextField(
		{
			fieldLabel : "任务组"
		});
		this.edtTeamName.readOnly = true;
		this.edtTeamName.setReadOnly(true);

		this.edtUserName = new Ext.form.TextField(
		{
			fieldLabel : "组员姓名"
		});
		this.edtUserName.readOnly = true;
		this.edtUserName.setReadOnly(true);

		this.cmbIsLeader = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "组长"
		});
		this.cmbIsAgent = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "代理类型",
			xy_DataArray : RenderMapData.SSC.AgentType,
			xy_AllowClear : false,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function()
			{
				if (this.cmbIsAgent.getKeyValue() == 2)
				{
					this.tgfieldAgent.show();
					this.tgfieldAgent.showFieldLabel();
				}
				else
				{
					this.tgfieldAgent.hide();
					this.tgfieldAgent.hideFieldLabel();					
				}
			}
		});

		this.tgfieldAgent = new sm.component.UserTPTeamAgentField(
		{
			xy_ParentObjHandle : this,
			xy_BaseParams :
			{
				userid : this.xy_Entity.userID,
				teamid : this.xy_Entity.teamID
			}
		});
		
		this.mainFormPanel = new Ext.form.FormPanel(
		{
			frame : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			defaults :
			{
				width : 200
			},
			items : [ this.edtTeamName,
			          this.edtUserName,
			          this.cmbIsLeader,
			          this.cmbIsAgent,
			          this.tgfieldAgent ]
		});

		this.items = [ this.mainFormPanel ];
	},
	initData : function()
	{
		this.edtTeamName.setValue(this.xy_Entity.teamName);
		this.edtUserName.setValue(this.xy_Entity.userName);
		this.cmbIsLeader.setKeyValue(this.xy_Entity.isLeader);
		this.cmbIsAgent.setKeyValue(this.xy_Entity.isAgent);

		if (this.xy_Entity.isAgent == 2)
		{
			this.tgfieldAgent.show();
			this.tgfieldAgent.setInitValue(this.xy_Entity.agentUserID, this.xy_Entity.agentUserName);
		}
		else
		{
			this.tgfieldAgent.hide();
		}
	},
	OnShowEvent : function()
	{
		if (this.cmbIsAgent.getKeyValue() == 2)
		{
			this.tgfieldAgent.show();
			this.tgfieldAgent.showFieldLabel();
		}
		else
		{
			this.tgfieldAgent.hide();
			this.tgfieldAgent.hideFieldLabel();					
		}
	},
	baseConfirmValid : function()
	{
		if (!this.validData())
		{
			return false;
		}

		return this.setUserProperty();
	},
	validData : function()
	{
		return true;
	},
	setUserProperty : function()
	{
		this.xy_Entity.isLeader = this.cmbIsLeader.getKeyValue();
		this.xy_Entity.isAgent = this.cmbIsAgent.getKeyValue();
		if (this.cmbIsAgent.getKeyValue() == 2)
		{
			this.xy_Entity.agentUserID = this.tgfieldAgent.getSelectedID();
		}
		else
		{
			this.xy_Entity.agentUserID = "";
		}

		Ext.Ajax.request(
		{
			url : "SSC/ssc_TeamUserAction!update.action",
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
	}
});