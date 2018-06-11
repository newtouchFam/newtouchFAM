Ext.namespace("bcm.basedata.Case");

bcm.basedata.Case.CasePropertyWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "修改预算控制属性",
	height : 300,
	width : 450,
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

		bcm.basedata.Case.CasePropertyWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.cmbIsCentralCtrlType = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "统一控制方式"
		});
		this.cmbCtrlType = new bcm.component.CtrlTypeComboBox();
		this.cmbIsCentralCtrlPeriod = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "统一控制周期"
		});
		this.cmbCtrlPeriod = new bcm.component.CtrlPeriodComboBox();
		this.cmbIsCentralCtrlAttr = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "统一控制属性"
		});
		this.cmbCtrlAttr = new bcm.component.CtrlAttrComboBox();

		this.cmbIsCentralWarnPercent = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "统一告警率"
		});
		this.edtWarnPercent = new Ext.form.NumberField(
		{
			fieldLabel : "告警率"
		});
		this.cmbIsCentralALWPercent = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "统一容差率"
		});
		this.edtALWPercent = new Ext.form.NumberField(
		{
			fieldLabel : "容差率"
		});
		this.cmbIsCentralDetailPercent = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "统一明细率"
		});
		this.edtDetailPercent = new Ext.form.NumberField(
		{
			fieldLabel : "明细率"
		});

		this.cmbIsCentralCtrlType_Act = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "统一控制方式"
		});
		this.cmbCtrlType_Act = new bcm.component.CtrlTypeComboBox();
		this.cmbIsCentralCtrlPeriod_Act = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "统一控制周期"
		});
		this.cmbCtrlPeriod_Act = new bcm.component.CtrlPeriodComboBox();
		this.cmbIsCentralCtrlAttr_Act = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "统一控制属性"
		});
		this.cmbCtrlAttr_Act = new bcm.component.CtrlAttrComboBox();

		this.formpanelBudget = new Ext.form.FormPanel(
		{
			frame : true,
			border : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			layout : "column",
			items : [
			{
				columnWidth : .5,
				layout : "form",
				defaults :
				{
					width : 100
				},
				items : [ this.cmbIsCentralCtrlType,
				          this.cmbIsCentralCtrlPeriod,
				          this.cmbIsCentralCtrlAttr,
				          this.cmbIsCentralWarnPercent,
				          this.cmbIsCentralALWPercent,
				          this.cmbIsCentralDetailPercent ]
			},
			{
				columnWidth : .5,
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
				          this.edtDetailPercent ]
			} ]
		});

		this.formpanelSpecact = new Ext.form.FormPanel(
		{
			frame : true,
			border : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			layout : "column",
			items : [
			{
				columnWidth : .5,
				layout : "form",
				defaults :
				{
					width : 100
				},
				items : [ this.cmbIsCentralCtrlType_Act,
				          this.cmbIsCentralCtrlPeriod_Act,
				          this.cmbIsCentralCtrlAttr_Act ]
			},
			{
				columnWidth : .5,
				layout : "form",
				defaults :
				{
					width : 100
				},
				items : [ this.cmbCtrlType_Act,
				          this.cmbCtrlPeriod_Act,
				          this.cmbCtrlAttr_Act ]
			} ]
		});

		this.tabpanelMain = new Ext.TabPanel(
		{
			plain : false,
			activeTab : 0,
			items : [
			{
				title : "预算控制策略",
				closable : false,
				layout : "fit",
				items : [ this.formpanelBudget ]
			},
			{
				title : "专项活动控制策略",
				closable : false,
				layout : "fit",
				items : [ this.formpanelSpecact ]
			} ]
		});
		this.items = [ this.tabpanelMain ];
	},
	initData : function()
	{
		this.cmbIsCentralCtrlType.setKeyValue(this.xy_Entity.isCentral_CtrlType);
		this.cmbCtrlType.setKeyValue(this.xy_Entity.ctrlType);
		this.cmbIsCentralCtrlPeriod.setKeyValue(this.xy_Entity.isCentral_CtrlPeriod);
		this.cmbCtrlPeriod.setKeyValue(this.xy_Entity.ctrlPeriod);
		this.cmbIsCentralCtrlAttr.setKeyValue(this.xy_Entity.isCentral_CtrlAttr);
		this.cmbCtrlAttr.setKeyValue(this.xy_Entity.ctrlAttr);

		this.cmbIsCentralWarnPercent.setKeyValue(this.xy_Entity.isCentral_WarnPercent);
		this.edtWarnPercent.setValue(this.xy_Entity.warnPercent);
		this.cmbIsCentralALWPercent.setKeyValue(this.xy_Entity.isCentral_ALWPercent);
		this.edtALWPercent.setValue(this.xy_Entity.alwPercent);
		this.cmbIsCentralDetailPercent.setKeyValue(this.xy_Entity.isCentral_DetailPercent);
		this.edtDetailPercent.setValue(this.xy_Entity.detailPercent);

		this.cmbIsCentralCtrlType_Act.setKeyValue(this.xy_Entity.isCentral_CtrlType_Act);
		this.cmbCtrlType_Act.setKeyValue(this.xy_Entity.ctrlType_Act);
		this.cmbIsCentralCtrlPeriod_Act.setKeyValue(this.xy_Entity.isCentral_CtrlPeriod_Act);
		this.cmbCtrlPeriod_Act.setKeyValue(this.xy_Entity.ctrlPeriod_Act);
		this.cmbIsCentralCtrlAttr_Act.setKeyValue(this.xy_Entity.isCentral_CtrlAttr_Act);
		this.cmbCtrlAttr_Act.setKeyValue(this.xy_Entity.ctrlAttr_Act);
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

		return this.updateCaseProperty();
	},
	validData : function()
	{
		var intWarnPercent = this.edtWarnPercent.getValue();
		var intAlwPercent = this.edtALWPercent.getValue();
		var intDetailPercent = this.edtDetailPercent.getValue();

		if (intWarnPercent > 100 || intWarnPercent < 0)
		{
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
	updateCaseProperty : function()
	{
		this.xy_Entity.isCentral_CtrlType = this.cmbIsCentralCtrlType.getKeyValue();
		this.xy_Entity.ctrlType = this.cmbCtrlType.getKeyValue();
		this.xy_Entity.isCentral_CtrlPeriod = this.cmbIsCentralCtrlPeriod.getKeyValue();
		this.xy_Entity.ctrlPeriod = this.cmbCtrlPeriod.getKeyValue();
		this.xy_Entity.isCentral_CtrlAttr = this.cmbIsCentralCtrlAttr.getKeyValue();
		this.xy_Entity.ctrlAttr = this.cmbCtrlAttr.getKeyValue();

		this.xy_Entity.isCentral_WarnPercent = this.cmbIsCentralWarnPercent.getKeyValue();
		this.xy_Entity.warnPercent = this.edtWarnPercent.getValue();
		this.xy_Entity.isCentral_ALWPercent = this.cmbIsCentralALWPercent.getKeyValue();
		this.xy_Entity.alwPercent = this.edtALWPercent.getValue();
		this.xy_Entity.isCentral_DetailPercent = this.cmbIsCentralDetailPercent.getKeyValue();
		this.xy_Entity.detailPercent = this.edtDetailPercent.getValue();

		this.xy_Entity.isCentral_CtrlType_Act = this.cmbIsCentralCtrlType_Act.getKeyValue();
		this.xy_Entity.ctrlType_Act = this.cmbCtrlType_Act.getKeyValue();
		this.xy_Entity.isCentral_CtrlPeriod_Act = this.cmbIsCentralCtrlPeriod_Act.getKeyValue();
		this.xy_Entity.ctrlPeriod_Act = this.cmbCtrlPeriod_Act.getKeyValue();
		this.xy_Entity.isCentral_CtrlAttr_Act = this.cmbIsCentralCtrlAttr_Act.getKeyValue();
		this.xy_Entity.ctrlAttr_Act = this.cmbCtrlAttr_Act.getKeyValue();

		Ext.Ajax.request(
		{
			url : "bcm/case/updateproperty",
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