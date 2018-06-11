Ext.namespace("ssc.smcs.form.common");

/**
 * 表单通用主实体面板
 */
ssc.smcs.form.common.CommonHeaderPanel = Ext.extend(ssc.component.BaseFormHeaderPanel,
{
	xy_StoreUrl : "smcs/form/commonheader/get",
	xy_StoreParams : null,
	initComponent : function()
	{
		this.xy_StoreParams = FormGlobalVariant.create_StoreParams();

		this.createControl();

		ssc.smcs.form.common.CommonHeaderPanel.superclass.initComponent.call(this);
	},
	getRecord : function()
	{
		return Ext.data.XyCalcRecord.create( [
		{
			name : "id"
		},
		{
			name : "status"
		},
		{
			name : "startuserid"
		},
		{
			name : "startdate"
		},
		{
			name : "processid"
		},
		{
			name : "processinstid"
		},
		{
			name : "formtypecode"
		},
		{
			name : "busiclasscode"
		},
		{
			name : "serialno"
		},
		{
			name : "unitid"
		},
		{
			name : "deptid"
		},
		{
			name : "userid"
		},
		{
			name : "email"
		},
		{
			name : "telephone"
		},

		{
			name : "busidate"
		},
		{
			name : "busiperiod"
		},
		{
			name : "busiyear"
		},
		{
			name : "busimonth"
		},
		{
			name : "busiday"
		},

		{
			name : "accountdate"
		},
		{
			name : "accountperiod"
		},
		{
			name : "accountyear"
		},
		{
			name : "accountmonth"
		},
		{
			name : "accountday"
		},

		{
			name : "budgetdate"
		},
		{
			name : "budgetperiod"
		},
		{
			name : "budgetyear"
		},
		{
			name : "budgetmonth"
		},
		{
			name : "budgetday"
		},

		{
			name : "abstract"
		},
		{
			name : "affixnum"
		},
		{
			name : "amount"
		},
		{
			name : "finamount"
		},
		{
			name : "isemergency"
		},
		{
			name : "isdept_other"
		},
		{
			name : "deptid_other"
		} ]);
	},
	createControl : function()
	{
		this.edtSerialNo = new Ext.form.TextField(
		{
			id : "serialno",
			fieldLabel : "表单号"
		});
		this.MainEntityControls.push(this.edtSerialNo);

		this.dtBusiDate = new Ext.form.DateField(
		{
			id : "busidate",
			fieldLabel : "报账日期",
			value : new Date()
		});
		this.MainEntityControls.push(this.dtBusiDate);

		this.row1 =
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .66,
				layout : "form",
				border : false,
				items : [ this.edtSerialNo ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.dtBusiDate ]
			} ]
		};

		this.fieldUser = new ssc.smcs.component.UserField(
		{
			id : "userid",
			fieldLabel : "报账人",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var condition =
				{
					P_UnitID : FormInfoUtil.get_Header_UnitID(),
					P_DeptID : FormInfoUtil.get_Header_DeptID()
				};
				return condition;
			},
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
			}
		});
		this.MainEntityControls.push(this.fieldUser);

		this.fieldDept = new sm.component.DeptTreeField(
		{
			id : "deptid",
			fieldLabel : "部门",
			xy_ParentObjHandle : this,
			baseBeforeClickValid : function()
			{
				if (!FormCheckUtil.check_Header_Unit_Null())
				{
					return false;
				}
				return true;
			}.createDelegate(this),
			prepareBaseParams : function()
			{
				var condition =
				{
					unitid : FormInfoUtil.get_Header_UnitID(),
					status : 1
				};
				return condition;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
			}
		});
		this.MainEntityControls.push(this.fieldDept);

		this.cmbBudgetYear = new ssc.component.YearComboBox(
		{
			id : "budgetyear",
			fieldLabel : "预算年份",
			xy_ParentObjHandle : this,
			xy_SelectEvent : function(combo, record, index)
			{
			}
		});
		this.MainEntityControls.push(this.cmbBudgetYear);

		this.row2 =
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.fieldUser ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.fieldDept ]
			}
			,
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.cmbBudgetYear ]
			}
			]
		};

		this.edtEmail = new Ext.form.TextField(
		{
			id : "email",
			fieldLabel : "电子邮箱"
		});
		this.MainEntityControls.push(this.edtEmail);

		this.edtTelephone = new Ext.form.TextField(
		{
			id : "telephone",
			fieldLabel : "联系电话"
		});
		this.MainEntityControls.push(this.edtTelephone);

		this.row3 =
		{
			layout : "column",
			border : false,
			hidden : true,
			items : [
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.edtEmail ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.edtTelephone ]
			} ]
		};

		this.cmbIsDept_Other = new ssc.component.YesNoComboBox(
		{
			id : "isdept_other",
			fieldLabel : "是否跨部门",
			xy_InitDataID : 0,
			xy_ParentObjHandle : this,
			xy_SelectEvent : function(combo, record, index)
			{
				if (combo.isYes())
				{
					FormAccessUtil.setFieldHiddenEx(this.fieldDept_Other, false);
				}
				else
				{
					FormAccessUtil.setFieldHiddenEx(this.fieldDept_Other, true);
					this.fieldDept_Other.clearSelections();
				}
			}
		});
		this.MainEntityControls.push(this.cmbIsDept_Other);

		this.fieldDept_Other = new sm.component.DeptTreeField(
		{
			id : "deptid_other",
			fieldLabel : "跨部门",
			xy_ParentObjHandle : this,
			baseBeforeClickValid : function()
			{
				if (! FormCheckUtil.check_Header_Unit_Null())
				{
					return false;
				}
				return true;
			}.createDelegate(this),
			prepareBaseParams : function()
			{
				var condition =
				{
					unitid : FormInfoUtil.get_Header_UnitID(),
					status : 1
				};
				return condition;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
			}
		});
		this.MainEntityControls.push(this.fieldDept_Other);

		this.row4 =
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.cmbIsDept_Other ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.fieldDept_Other ]
			} ]
		};

		this.edtAbstract = new Ext.form.TextField(
		{
			id : "abstract",
			fieldLabel : "报账事由",
			maxLength : 50
		});
		this.MainEntityControls.push(this.edtAbstract);

		this.edtAffixnum = new Ext.form.NumberField(
		{
			id : "affixnum",
			fieldLabel : "附件张数",
			allowDecimals : false
		});
		this.MainEntityControls.push(this.edtAffixnum);

		this.row5 =
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .66,
				layout : "form",
				border : false,
				items : [ this.edtAbstract ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.edtAffixnum ]
			} ]
		};

		this.edtMainID = new Ext.form.Hidden(
		{
			id : "id"
		});
		this.MainEntityControls.push(this.edtMainID);

		this.edtStatus = new Ext.form.Hidden(
		{
			id : "status"
		});
		this.MainEntityControls.push(this.edtStatus);

		this.edtStartUserID = new Ext.form.Hidden(
		{
			id : "startuserid"
		});
		this.MainEntityControls.push(this.edtStartUserID);
		this.edtStartDate = new Ext.form.Hidden(
		{
			id : "startdate"
		});
		this.MainEntityControls.push(this.edtStartDate);

		this.edtProcessID = new Ext.form.Hidden(
		{
			id : "processid"
		});
		this.MainEntityControls.push(this.edtProcessID);
		this.edtProcessInstID = new Ext.form.Hidden(
		{
			id : "processinstid"
		});
		this.MainEntityControls.push(this.edtProcessInstID);

		this.cmbFormType = new ssc.component.FormTypeComboBox(
		{
			id : "formtypecode",
			fieldLabel : "表单类型",
			xy_ParentObjHandle : this
		});
		this.MainEntityControls.push(this.cmbFormType);

		this.cmbBusiClass = new ssc.component.BusiClassComboBox(
		{
			id : "busiclasscode",
			fieldLabel : "业务类型",
			xy_ParentObjHandle : this
		});
		this.MainEntityControls.push(this.cmbBusiClass);

		this.fieldUnit = new sm.component.UnitListField(
		{
			id : "unitid",
			fieldLabel : "报账公司",
			xy_ParentObjHandle : this,
			hidden : true,
			hiddenLabel : true
		});
		this.MainEntityControls.push(this.fieldUnit);

		this.edtBusiPeriod = new Ext.form.Hidden(
		{
			id : "busiperiod"
		});
		this.MainEntityControls.push(this.edtBusiPeriod);
		this.edtBusiYear = new Ext.form.Hidden(
		{
			id : "busiyear"
		});
		this.MainEntityControls.push(this.edtBusiYear);
		this.edtBusiMonth = new Ext.form.Hidden(
		{
			id : "busimonth"
		});
		this.MainEntityControls.push(this.edtBusiMonth);
		this.edtBusiDay = new Ext.form.Hidden(
		{
			id : "busiday"
		});
		this.MainEntityControls.push(this.edtBusiDay);

		this.edtAccountDate = new Ext.form.Hidden(
		{
			id : "accountdate"
		});
		this.MainEntityControls.push(this.edtAccountDate);
		this.edtAccountPeriod = new Ext.form.Hidden(
		{
			id : "accountperiod"
		});
		this.MainEntityControls.push(this.edtAccountPeriod);
		this.edtAccountYear = new Ext.form.Hidden(
		{
			id : "accountyear"
		});
		this.MainEntityControls.push(this.edtAccountYear);
		this.edtAccountMonth = new Ext.form.Hidden(
		{
			id : "accountmonth"
		});
		this.MainEntityControls.push(this.edtAccountMonth);
		this.edtAccountDay = new Ext.form.Hidden(
		{
			id : "accountday"
		});
		this.MainEntityControls.push(this.edtAccountDay);

		this.edtBudgetDate = new Ext.form.Hidden(
		{
			id : "budgetdate"
		});
		this.MainEntityControls.push(this.edtBudgetDate);
		this.edtBudgetPeriod = new Ext.form.Hidden(
		{
			id : "budgetperiod"
		});
		this.MainEntityControls.push(this.edtBudgetPeriod);
		this.edtBudgetMonth = new Ext.form.Hidden(
		{
			id : "budgetmonth"
		});
		this.MainEntityControls.push(this.edtBudgetMonth);
		this.edtBudgetDay = new Ext.form.Hidden(
		{
			id : "budgetday"
		});
		this.MainEntityControls.push(this.edtBudgetDay);

		this.edtAmount = new Freesky.Common.XyMoneyField(
		{
			id : "amount",
			fieldLabel : "报账总金额",
			hidden : true,
			hiddenLabel : true
		});
		this.MainEntityControls.push(this.edtAmount);
		this.edtFinAmount = new Freesky.Common.XyMoneyField(
		{
			id : "finamount",
			fieldLabel : "核定总金额",
			hidden : true,
			hiddenLabel : true
		});
		this.MainEntityControls.push(this.edtFinAmount);

		this.edtIsEmergency = new Ext.form.Hidden(
		{
			id : "isemergency"
		});
		this.MainEntityControls.push(this.edtIsEmergency);

		this.hiddenRow =
		{
			hidden : true,
			items : [ this.edtMainID, this.edtStatus, this.edtStartUserID, this.edtStartDate,
			          this.edtProcessID, this.edtProcessInstID, this.cmbFormType, this.cmbBusiClass,
			          this.fieldUnit,
			          this.edtBusiPeriod, this.edtBusiYear, this.edtBusiMonth, this.edtBusiDay,
			          this.edtAccountDate, this.edtAccountPeriod, this.edtAccountYear, this.edtAccountMonth, this.edtAccountDay,
			          this.edtBudgetDate, this.edtBudgetPeriod, this.edtBudgetMonth, this.edtBudgetDay,
			          this.edtAmount, this.edtFinAmount, this.edtIsEmergency ]
		};

		this.items = [ this.row1, this.row2, this.row3, this.row4, this.row5, this.hiddenRow ];
	},
	initComponentEvents : function()
	{
		this.getStore().on("load", this.onStoreLoadEvent, this);
	},
	onStoreLoadEvent : function(store, records, options)
	{
		if (FormOperTypeUtil.isCreateNew())
		{
			this.cmbFormType.setXyValue(FormGlobalVariant.get_FormTypeObject());
			this.cmbBusiClass.setXyValue(FormGlobalVariant.get_BusiClassObject());

			this.edtProcessID.setValue(this.processID);
			this.edtProcessInstID.setValue(this.processInstID);
			this.edtSerialNo.setValue(this.formSerialNo);
			this.edtStartUserID.setValue(this.userID);
		}

		this.setFormData(store);

		/* 草稿提交报：缺少表单编码 的错误 */
		if (parent.Ext.get("serialNum") != null && parent.Ext.get("serialNum") != undefined)
		{
			parent.Ext.get("serialNum").dom.value = this.edtSerialNo.getValue();
		}

		this.initComponentStatus();
	},
	initComponentStatus : function()
	{
		if (this.cmbIsDept_Other.isYes())
		{
			FormAccessUtil.setFieldHiddenEx(this.fieldDept_Other, false);
		}
		else
		{
			FormAccessUtil.setFieldHiddenEx(this.fieldDept_Other, true);
		}
	},
	doClearFormData : function()
	{
		if (ExpandHeaderPanel != null && ExpandHeaderPanel != undefined)
		{
			if (ExpandHeaderPanel.clearFormData != undefined && typeof(ExpandHeaderPanel.clearFormData) == "function")
			{
				ExpandHeaderPanel.clearFormData();
			}
		}

		if (BusinessPanel != null && BusinessPanel != undefined)
		{
			if (BusinessPanel.clearFormData != undefined && typeof(BusinessPanel.clearFormData) == "function")
			{
				BusinessPanel.clearFormData();
			}
		}
	},
	validate : function(submittype)
	{
		if (submittype != "submit")
		{
			return true;
		}

		/**
		 * 填单环节，表单编号、表单类型、业务类型、报账公司、报账部门、报账人、业务日期、预算年份、报账事由、附件张数
		 * 计提暂估金额
		 */
		var arrayCheckConditionStart = [ FormCheckUtil.check_Header_FormType_Null,
		                                 FormCheckUtil.check_Header_BusiClass_Null,
		                                 FormCheckUtil.check_Header_Unit_Null,
		                                 FormCheckUtil.check_Header_Dept_Null,
		                                 FormCheckUtil.check_Header_User_Null,
		                                 FormCheckUtil.check_Header_BusiDate_Format,
		                                 FormCheckUtil.check_Header_BusiDate_Null ];

		if (this.cmbBudgetYear.isVisible() && ! this.cmbBudgetYear.hidden)
		{
			arrayCheckConditionStart.push(FormCheckUtil.check_Header_BudgetYear_Null);
		}

		arrayCheckConditionStart = arrayCheckConditionStart.concat([ FormCheckUtil.check_Header_Abstract_Null,
		                         									FormCheckUtil.check_Header_Abstract_Length,
		                         									FormCheckUtil.check_Header_Abstract_Safety ]);

		if (this.edtAffixnum.isVisible() && ! this.edtAffixnum.hidden)
		{
			arrayCheckConditionStart.push(FormCheckUtil.check_Header_Affix_NullAndPositive);
		}

		if (! FormCheckUtil.check_Header_Data(arrayCheckConditionStart, this))
		{
			return false;
		}

		/**
		 * 财务核定环节, null
		 */
		if (FormStatusUtil.isFin())
		{
			var arrayCheckConditionFin = [ ];
			if (! FormCheckUtil.check_Header_Data(arrayCheckConditionFin, this))
			{
				return false;
			}
		}

		/**
		 * 是否跨部门,null
		 */
		if (this.cmbIsDept_Other.isVisible())
		{
			if (this.cmbIsDept_Other.isYes())
			{
				if (!this.fieldDept_Other.getSelected())
				{
					MsgUtil.alert("跨部门不能为空");
					return false;
				}
			}
		}
		
		if(!FormCheckUtil.check_Header_String_Safety("abstract"))
		{
			return false;
		}

		parent.m_WorkData.setValue("G_SSC_UNITID", 	FormInfoUtil.get_Header_UnitID());
		parent.m_WorkData.setValue("G_SSC_UNITCODE", FormInfoUtil.get_Header_UnitField().getUnitCode());
		parent.m_WorkData.setValue("G_SSC_UNITNAME", FormInfoUtil.get_Header_UnitField().getUnitName());
		parent.m_WorkData.setValue("G_SSC_DEPTID", 	FormInfoUtil.get_Header_DeptID());
		parent.m_WorkData.setValue("G_SSC_DEPTCODE", FormInfoUtil.get_Header_DeptField().getDeptCode());
		parent.m_WorkData.setValue("G_SSC_DEPTNAME", FormInfoUtil.get_Header_DeptField().getDeptName());
		parent.m_WorkData.setValue("G_SSC_FORMTYPE", FormGlobalVariant.get_FormTypeCode());
		parent.m_WorkData.setValue("G_SSC_BUSICLASS", FormGlobalVariant.get_BusiClassCode());
		parent.m_WorkData.setValue("G_SSC_FORMMAINID", FormInfoUtil.get_Header_FormMainID());
		parent.m_WorkData.setValue("G_SSC_SERIALNO", FormInfoUtil.get_Header_SerialNo());

		parent.m_WorkData.setValue("G_SSC_SMCS_ISDEPT_OTHER", this.cmbIsDept_Other.getKeyValue());
		parent.m_WorkData.setValue("G_SSC_SMCS_DEPTID_OTHER", this.fieldDept_Other.getDeptID());

		return true;
	}
});