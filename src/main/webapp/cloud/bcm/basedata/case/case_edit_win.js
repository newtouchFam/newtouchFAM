Ext.namespace("bcm.basedata.Case");

bcm.basedata.Case.CaseEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增预算方案",
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

		bcm.basedata.Case.CaseEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtCaseCode = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("预算方案编码")
		});
		this.edtCaseName = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("预算方案名称")
		});
		this.edtCaseYear = new Ext.form.NumberField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("预算年份")
		});
		this.cmbStatus = new ssc.component.EnableComboBox(
		{
			fieldLabel : "方案状态"
		});
		this.cmbIsCurrent = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "是否默认"
		});
		this.textareaRemark = new Ext.form.TextArea(
		{
			fieldLabel : "备注"
		});

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "新增预算方案";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "修改预算方案";
			this.edtCaseCode.setReadOnly(true);
			this.edtCaseYear.setReadOnly(true);
		};

		this.formpanelMain = new Ext.form.FormPanel(
		{
			frame : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			defaults :
			{
				width : 200
			},
			items : [ this.edtCaseCode,
			          this.edtCaseName,
			          this.edtCaseYear,
			          this.cmbStatus,
			          this.cmbIsCurrent,
			          this.textareaRemark ]
		});

		this.items = [ this.formpanelMain ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.cmbStatus.setKeyValue(1);
			this.cmbIsCurrent.setKeyValue(1);
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.edtCaseCode.setValue(this.xy_Entity.caseCode);
			this.edtCaseName.setValue(this.xy_Entity.caseName);
			this.edtCaseYear.setValue(this.xy_Entity.caseYear);
			this.cmbStatus.setKeyValue(this.xy_Entity.status);
			this.cmbIsCurrent.setKeyValue(this.xy_Entity.isCurrent);
			this.textareaRemark.setValue(this.xy_Entity.remark);
		}
	},
	/**
	 * @override
	 */
	baseConfirmValid : function()
	{
		if (!this.validData())
		{
			return false;
		}

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			return this.addCase();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateCase();
		}
	},
	validData : function()
	{
		var strCaseCode = this.edtCaseCode.getValue().trim();
		var strCaseName = this.edtCaseName.getValue().trim();
		var intCaseYear = this.edtCaseYear.getValue();

		if (strCaseCode.isEmpty())
		{
			MsgUtil.alert("请填写预算方案编码");
			return false;
		}

		if (strCaseName.isEmpty())
		{
			MsgUtil.alert("请填写预算方案名称");
			return false;
		}

		if (! ssc.common.NumberUtil.isNumber(intCaseYear))
		{
			MsgUtil.alert("请填写预算方案年份");
			return false;
		}

		if (! ssc.common.NumberUtil.isNumber(intCaseYear))
		{
			MsgUtil.alert("预算方案年份应当为整数");
			return false;
		}

		return true;
	},
	addCase : function()
	{
		this.xy_Entity.caseCode = this.edtCaseCode.getValue().trim();
		this.xy_Entity.caseName = this.edtCaseName.getValue().trim();
		this.xy_Entity.caseYear = this.edtCaseYear.getValue();
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.isCurrent = this.cmbIsCurrent.getKeyValue();
		this.xy_Entity.remark = this.textareaRemark.getValue().trim();

		Ext.Ajax.request(
		{
			url : "bcm/case/add",
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
	updateCase : function()
	{
		this.xy_Entity.caseCode = this.edtCaseCode.getValue().trim();
		this.xy_Entity.caseName = this.edtCaseName.getValue().trim();
		this.xy_Entity.caseYear = this.edtCaseYear.getValue();
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.isCurrent = this.cmbIsCurrent.getKeyValue();
		this.xy_Entity.remark = this.textareaRemark.getValue().trim();

		Ext.Ajax.request(
		{
			url : "bcm/case/update",
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