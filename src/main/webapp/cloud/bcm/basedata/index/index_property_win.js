Ext.namespace("bcm.basedata.Index");

bcm.basedata.Index.IndexPropertyWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "修改预算控制属性",
	height : 300,
	width : 250,
	layout : "fit",
	labelAlign : "right",
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.Update,
	xy_Entity : {},
	initComponent : function()
	{
		this.initUI();

		this.initData();

		bcm.basedata.Index.IndexPropertyWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.cmbCtrlType = new bcm.component.CtrlTypeComboBox();

		this.cmbCtrlPeriod = new bcm.component.CtrlPeriodComboBox();

		this.cmbCtrlAttr = new bcm.component.CtrlAttrComboBox();

		this.edtWarnPercent = new Ext.form.NumberField(
		{
			fieldLabel : "告警率"
		});
		this.edtALWPercent = new Ext.form.NumberField(
		{
			fieldLabel : "容差率"
		});
		this.edtDetailPercent = new Ext.form.NumberField(
		{
			fieldLabel : "明细率"
		});

		this.cmbIsApply = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "事前申请"
		});

		this.formpanelBudget = new Ext.form.FormPanel(
		{
			frame : true,
			border : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			layout : "form",
			defaults :
			{
				width : 100
			},
			items : [ this.cmbCtrlType,
			          this.cmbCtrlPeriod,
			          this.cmbCtrlAttr,
			          this.edtWarnPercent,
			          this.edtALWPercent,
			          this.edtDetailPercent,
			          this.cmbIsApply ]
		});

		this.items = [ this.formpanelBudget ];
	},
	initData : function()
	{
		this.cmbCtrlType.setKeyValue(this.xy_Entity.ctrlType);
		this.cmbCtrlPeriod.setKeyValue(this.xy_Entity.ctrlPeriod);
		this.cmbCtrlAttr.setKeyValue(this.xy_Entity.ctrlAttr);

		this.edtWarnPercent.setValue(this.xy_Entity.warnPercent);
		this.edtALWPercent.setValue(this.xy_Entity.alwPercent);
		this.edtDetailPercent.setValue(this.xy_Entity.detailPercent);
		this.cmbIsApply.setKeyValue(this.xy_Entity.isApply);
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

		return this.updateIndexProperty();
	},
	validData : function()
	{
		var intWarnPercent = this.edtWarnPercent.getValue();
		var intAlwPercent = this.edtALWPercent.getValue();
		var intDetailPercent = this.edtDetailPercent.getValue();

		if (intWarnPercent > 100 || intWarnPercent < 0)
		{
			alert(intWarnPercent)
			MsgUtil.alert("告警率应当为0-100之间的整数");
			return false;
		}
		if (intAlwPercent > 100 || intAlwPercent < 0)
		{
			MsgUtil.alert("容差率应当为0-100之间的整数");
			return false;
		}
		if (intDetailPercent > 100 || intDetailPercent < 0)
		{
			MsgUtil.alert("明细率应当为0-100之间的整数");
			return false;
		}

		return true;
	},
	updateIndexProperty : function()
	{
		this.xy_Entity.ctrlType = this.cmbCtrlType.getKeyValue();
		this.xy_Entity.ctrlPeriod = this.cmbCtrlPeriod.getKeyValue();
		this.xy_Entity.ctrlAttr = this.cmbCtrlAttr.getKeyValue();

		this.xy_Entity.warnPercent = this.edtWarnPercent.getValue();
		this.xy_Entity.alwPercent = this.edtALWPercent.getValue();
		this.xy_Entity.detailPercent = this.edtDetailPercent.getValue();
		this.xy_Entity.isApply = this.cmbIsApply.getKeyValue();

		Ext.Ajax.request(
		{
			url : "bcm/index!updateProperty.action",
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