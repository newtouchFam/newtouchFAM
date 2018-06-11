Ext.namespace("ssc.taskpool.basedata.TeamRule");

ssc.taskpool.basedata.TeamRule.RuleEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增规则",
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
			
		ssc.taskpool.basedata.TeamRule.RuleEditWin.superclass.initComponent.call(this);

		this.on("show", this.OnShowEvent, this);
	},
	initUI : function()
	{
		this.edtRuleCode = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("规则编码")
		});
		this.edtRuleName = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("规则名称")
		});
		this.edtRemark = new Ext.form.TextArea(
		{
			fieldLabel : "备注",
			height : 40,
			grow : false
		});

		this.cmbRuleType = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "类型",
			xy_DataArray : RenderMapData.SSC.RuleType,
			xy_AllowClear : false,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function()
			{
				if (this.cmbRuleType.getKeyValue() == 1)
				{
					this.edtClassName.show();
					this.edtClassName.showFieldLabel();
				}
				else
				{
					this.edtClassName.hide();
					this.edtClassName.hideFieldLabel();
				}
			}
		});

		this.edtClassName = new Ext.form.TextField(
		{
			fieldLabel : "自定义类名"
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
			items : [ this.edtRuleCode,
			          this.edtRuleName,
			          this.edtRemark,
			          this.cmbRuleType,
			          this.edtClassName ]
		});

		this.items = [ this.mainFormPanel ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "新增规则";
			this.cmbRuleType.setKeyValue(0);
			this.getDefaultRuleCodeName();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "修改规则";
			this.edtRuleCode.setValue(this.xy_Entity.ruleCode);
			this.edtRuleName.setValue(this.xy_Entity.ruleName);
			this.edtRemark.setValue(this.xy_Entity.remark);
			this.cmbRuleType.setKeyValue(this.xy_Entity.ruleType);
			this.edtClassName.setValue(this.xy_Entity.className);
		}
	},
	OnShowEvent : function()
	{
		if (this.cmbRuleType.getKeyValue() == 1)
		{
			this.edtClassName.show();
			this.edtClassName.showFieldLabel();
		}
		else
		{
			this.edtClassName.hide();
			this.edtClassName.hideFieldLabel();
		}
	},
	getDefaultRuleCodeName : function()
	{
		var param =
		{
			teamid : this.xy_Entity.teamID
		};

		Ext.Ajax.request(
		{
			url : "SSC/ssc_RuleAction!getDefaultRuleCodeName.action",
			method : "post",
			params :
			{
				jsonCondition : Ext.encode(param)
			},
			success : function(response)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					var ruleEntity = data.data; 
					this.xy_Entity.ruleID = ruleEntity.ruleID;
					this.edtRuleCode.setValue(ruleEntity.ruleCode);
					this.edtRuleName.setValue(ruleEntity.ruleName);
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			failure : function(response)
			{
				var data = Ext.decode(response.responseText);
				MsgUtil.alert(data.msg);
			},
			scope : this
		});
	},	
	baseConfirmValid : function()
	{
		if (!this.validData())
		{
			return false;
		}

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			return this.addRule();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateRule();
		}
	},
	validData : function()
	{
		var strRuleCode = this.edtRuleCode.getValue().trim();
		var strRuleName = this.edtRuleName.getValue().trim();
		var strClassName = this.edtClassName.getValue().trim();

		if (strRuleCode.isEmpty())
		{
			MsgUtil.alert("请填写规则编码!");
			return false;
		}

		if (strRuleName.isEmpty())
		{
			MsgUtil.alert("请填写规则名称!");
			return false;
		}

		if (this.cmbRuleType.getKeyValue() == 1
				&& strClassName.isEmpty())
		{
			MsgUtil.alert("请填写自定义类名!");
			return false;
		}

		return true;
	},
	addRule : function()
	{
		this.xy_Entity.ruleCode = this.edtRuleCode.getValue().trim();
		this.xy_Entity.ruleName = this.edtRuleName.getValue().trim();
		this.xy_Entity.remark = this.edtRemark.getValue();
		this.xy_Entity.ruleType = this.cmbRuleType.getKeyValue();
		if (this.xy_Entity.ruleType == 0)
		{
			this.xy_Entity.className = "";
		}
		else
		{
			this.xy_Entity.className = this.edtClassName.getValue().trim();
		}

		Ext.Ajax.request(
		{
			url : "SSC/ssc_RuleAction!add.action",
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
	updateRule : function()
	{
		this.xy_Entity.ruleCode = this.edtRuleCode.getValue().trim();
		this.xy_Entity.ruleName = this.edtRuleName.getValue().trim();
		this.xy_Entity.remark = this.edtRemark.getValue();
		this.xy_Entity.ruleType = this.cmbRuleType.getKeyValue();
		if (this.xy_Entity.ruleType == 0)
		{
			this.xy_Entity.className = "";
		}
		else
		{
			this.xy_Entity.className = this.edtClassName.getValue().trim();
		}

		Ext.Ajax.request(
		{
			url : "SSC/ssc_RuleAction!update.action",
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