Ext.namespace("ssc.smcs.form.cost");

ssc.smcs.form.cost.CostInfoWin = Ext.extend(ssc.component.BaseDialog,
{
	titile : "经济事项明细-新增",
	height : 280,
	width : 670,
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

		ssc.smcs.form.cost.CostInfoWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.fieldEconItem = new ssc.smcs.component.EconItemField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("经济事项"),
			width : 180,
			xy_ParentObjHandle : this,
			disabled : !FormStatusUtil.isStart(),
			baseBeforeClickValid : function()
			{
				if (!FormCheckUtil.check_Header_Object_Null("econitemtypeid"))
				{
					return false;
				}
				return true;
			}.createDelegate(this),
			prepareBaseParams : function()
			{
				var econitemTypeID = ExpandHeaderPanel.fieldEconItemType.getSelectedID();
				var condition =
				{
					P_Year : Ext.getCmp("budgetyear").getYear(),
					P_EconItemTypeID : econitemTypeID
				};
				return condition;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
				this.fieldIndex.setXyValue(field.getIndex());
				if (field.getIndex().indexID == "")
				{
					this.fieldIndexDept.clearSelections();
				}
			}
		});

		this.fieldDept = new sm.component.DeptTreeField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("报账部门"),
			width : 180,
			xy_GridType : "xygrid",
			xy_ParentObjHandle : this,
			disabled : true,
			prepareBaseParams : function()
			{
				var condition = {};
				return condition;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field){}
		});

		this.fieldIndexDept = new ssc.smcs.component.IndexDeptField(
		{
			fieldLabel : "预算部门",
			width : 180,
			xy_GridType : "xygrid",
			xy_ParentObjHandle : this,
			disabled : !FormStatusUtil.isStart(),
			prepareBaseParams : function()
			{
				var condition =
				{
					P_UnitID : FormInfoUtil.get_Header_UnitField().getUnitID(),
					P_IndexID : this.fieldIndex.getSelectedID(),
					P_CaseYear : Ext.getCmp("budgetyear").getKeyValue()
				};
				return condition;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field){},
			baseBeforeClickValid : function()
			{
				if (this.fieldIndex.getSelectedID() == "")
				{
					MsgUtil.alert("请先选择预算项目");
					return false;
				}
				else
				{
					return true;
				}
			}.createDelegate(this)
		});

		this.fieldIndex = new bcm.component.IndexListField(
		{
			fieldLabel : "预算项目",
			emptyText : "",
			width : 180,
			xy_GridType : "xygrid",
			xy_ParentObjHandle : this,
			disabled : true,
			prepareBaseParams : function()
			{
				var param =
				{
					year : Ext.getCmp("budgetyear").getYear()
				};

				return param;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field){}
		});

		this.fieldAmount = new Freesky.Common.XyMoneyField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("报账总金额"),
			width : 180,
			allowBlank : true,
			allowNegative : true,
			disabled : !FormStatusUtil.isStart(),
			maxValue : ssc.smcs.common.MoneyMaxValue
		});

		this.cmbTaxRate = new ssc.smcs.component.TaxRateComboBox(
		{
			fieldLabel : "税率",
			width : 180,
			xy_ParentObjHandle : this,
			disabled : !FormStatusUtil.isStart(),
			style : "text-align:right",
			prepareBaseParams : function()
			{
				var param = {};
				return param;
			}.createDelegate(this),
			xy_SelectEvent : function(combo, record, index){}
		});

		this.fieldAmount_noTax = new Freesky.Common.XyMoneyField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("报账金额(不含税)"),
			width : 180,
			allowBlank : true,
			allowNegative : true,
			disabled : !FormStatusUtil.isStart(),
			maxValue : ssc.smcs.common.MoneyMaxValue
		});

		this.fieldAmount_Tax = new Freesky.Common.XyMoneyField(
		{
			fieldLabel : "税额",
			width : 180,
			allowBlank : true,
			allowNegative : true,
			disabled : !FormStatusUtil.isStart(),
			maxValue : ssc.smcs.common.MoneyMaxValue
		});

		this.edtRemark = new Ext.form.TextArea(
		{
			fieldLabel : "备注",
			disabled : !FormStatusUtil.isStart()
		});

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "经济事项明细信息-新增";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "经济事项明细信息-修改";
		}
		
		this.formpanelMain = new Ext.form.FormPanel(
		{
			frame : true,
			labelAlign : "right",
			labelWidth : 110,
			layout : "form",
			items : [
			{
				layout : "column",
				items : [
				{
					columnWidth : .45,
					layout : "form",
					items : [ this.fieldEconItem, this.fieldIndex, this.fieldAmount, this.fieldAmount_noTax ]
				},
				{
					columnWidth : .45,
					layout : "form",
					items : [ this.fieldDept, this.fieldIndexDept, this.cmbTaxRate, this.fieldAmount_Tax ]
				} ]
			},
			{
				layout : "column",
				items : [
				{
					columnWidth : 1,
					layout : "form",
					defaults :
					{
						width : 475
					},
					items : [ this.edtRemark ]
				} ]
			} ]
		});
		this.items = [ this.formpanelMain ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			var initTaxRate =
			{
				taxratecode : "TR00",
				taxratename : "0%",
				taxratetext : 0,
				taxrate : 0.00
			};

			this.cmbTaxRate.setXyValue(initTaxRate);
			var defaultDept = FormInfoUtil.get_Header_DeptField().getSelectedData();
			this.fieldDept.setXyValue(defaultDept);
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.fieldEconItem.setXyValue(this.xy_Entity.econitemid);
			this.fieldAmount.setValue(this.xy_Entity.amount);
			this.fieldAmount_noTax.setValue(this.xy_Entity.amount_notax);
			this.fieldDept.setXyValue(this.xy_Entity.deptid);
			this.fieldIndex.setXyValue(this.xy_Entity.indexid);
			if (this.xy_Entity.indexdeptid != null)
			{
				this.fieldIndexDept.setXyValue(this.xy_Entity.indexdeptid);
			}

			this.cmbTaxRate.setXyValue(this.xy_Entity.taxrate);

			this.fieldAmount_Tax.setValue(this.xy_Entity.amount_tax);
			this.edtRemark.setValue(this.xy_Entity.remark);
		}

		this.fieldAmount.on("change",function()
		{
			this.numberEdit();
		},this);
		
		this.cmbTaxRate.on("blur",function()
		{
			this.numberEdit();
		},this);
	},
	baseConfirmValid : function()
	{
		if (!this.validData())
		{
			return false;
		}
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			return this.addCostInfo();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.editCostInfo();
		}
	},
	validData : function()
	{
		if (!this.fieldEconItem.getSelected())
		{
			MsgUtil.alert("请选择经济事项");
			return false;
		}

		if (StringUtil.hasLimitedChar(this.edtRemark.getValue()))
		{
			MsgUtil.alert("【备注】填写内容不能包含字符【" + StringUtil.getFirstLimitedChar(this.edtRemark.getValue()) + "】");
			return;
		}

		if (this.fieldIndex.getSelectedID() != null && this.fieldIndex.getSelectedID() != "")
		{
			if (this.fieldIndexDept.getSelectedID() == null || this.fieldIndexDept.getSelectedID() == "")
			{
				MsgUtil.alert("请选择预算部门");
				return false;
			}
		}

		if (this.fieldAmount.getValue() == "")
		{
			MsgUtil.alert("请填写报账金额");
			return false;
		}

		return true;
	},
	addCostInfo : function()
	{
		var amount_tax = this.fieldAmount_Tax.getValue();
		if (amount_tax == "")
		{
			amount_tax = 0;
		}

		var record = BusinessPanel.getCostInfoPanel().createCalcRecord();

		var initRecordData =
		{
			detailid : FormNewIDUtil.getNewID(),
			mainid : "",
			status : 0,
			seq : 0,
			econitemid : this.fieldEconItem.getSelectedData(),
			indexdeptid : this.fieldIndexDept.getSelectedData(),
			deptid : this.fieldDept.getSelectedData(),
			amount : this.fieldAmount.getValue(),
			taxratetext : this.cmbTaxRate.getTaxRate(),
			taxrate : this.cmbTaxRate.getSelectedData(),
			amount_notax : this.fieldAmount_noTax.getValue(),
			amount_tax : amount_tax,
			indexid : this.fieldIndex.getSelectedData(),
			remark : this.edtRemark.getValue()
		};

		var record = new record(initRecordData);
		if (record == null || record == undefined)
		{
			return;
		}

		Freesky.Common.XyGridUtil.add(BusinessPanel.getCostInfoPanel(), record, BusinessPanel.getCostInfoPanel()
				.getSelectedIndex() + 1);
		Freesky.Common.XyGridUtil.refreshRowNum(BusinessPanel.getCostInfoPanel(), 0);

		return true;
	},
	editCostInfo : function()
	{
		var amount_tax = this.fieldAmount_Tax.getValue();
		if (amount_tax == "")
		{
			amount_tax = 0;
		}

		var record = BusinessPanel.getCostInfoPanel().createCalcRecord();
		var initRecordData =
		{
			detailid : FormNewIDUtil.getNewID(),
			mainid : "",
			status : 0,
			seq : 0,
			econitemid : this.fieldEconItem.getSelectedData(),
			indexdeptid : this.fieldIndexDept.getSelectedData(),
			deptid : this.fieldDept.getSelectedData(),
			amount : this.fieldAmount.getValue(),
			taxratetext : this.cmbTaxRate.getTaxRate(),
			taxrate : this.cmbTaxRate.getSelectedData(),
			amount_notax : this.fieldAmount_noTax.getValue(),
			amount_tax : amount_tax,
			indexid : this.fieldIndex.getSelectedData(),
			remark : this.edtRemark.getValue()
		};

		var record = new record(initRecordData);
		if (record == null || record == undefined)
		{
			return;
		}

		Freesky.Common.XyGridUtil.del(BusinessPanel.getCostInfoPanel());
		Freesky.Common.XyGridUtil.refreshRowNum(BusinessPanel.getCostInfoPanel(), 0);
		Freesky.Common.XyGridUtil.add(BusinessPanel.getCostInfoPanel(), record, this.xy_Entity.index);
		Freesky.Common.XyGridUtil.refreshRowNum(BusinessPanel.getCostInfoPanel(), 0);

		return true;
	},
	numberEdit : function()
	{
		var amount = this.fieldAmount.getValue();
		var amount_tax = this.fieldAmount_Tax.getValue();
		var rate = this.cmbTaxRate.getTaxRate();
		var amount_noTax = FormMoneyUtil.div(amount, FormMoneyUtil.add(1, rate));
		var amount_tax = FormMoneyUtil.multi(amount_noTax, rate);

		this.fieldAmount_noTax.setValue(amount_noTax);

		this.fieldAmount_Tax.setValue(amount_tax);
	},
	btn_OkEvent : function()
	{
		if (this.baseConfirmValid() !== true)
		{
			return;
		}
		
		this.closeDialog();
	}
	
});