Ext.namespace("bcm.config.Period");

bcm.config.Period.PeriodEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增预算账期",
	height : 150,
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

		bcm.config.Period.PeriodEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.cmbCase = new bcm.component.CaseListComboBox(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("预算方案"),
			xy_DataActionURL : "bcm/case/getnoperiodcaselist"
		});

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
			items : [ this.cmbCase ]
		});

		this.items = [ this.formpanelMain ];
	},
	initData : function()
	{
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
			return this.addPeriod();
		}
	},
	validData : function()
	{
		if (! this.cmbCase.getSelected())
		{
			MsgUtil.alert("请先选择预算方案");
			return false;
		}

		return true;
	},
	addPeriod : function()
	{
		this.xy_Entity.caseCode = this.cmbCase.getKeyValue();

		Ext.Ajax.request(
		{
			url : "BCM/bcm_PeriodAction/add",
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