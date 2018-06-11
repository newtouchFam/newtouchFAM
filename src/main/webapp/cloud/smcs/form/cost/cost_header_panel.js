Ext.namespace("ssc.smcs.form.cost");

ssc.smcs.form.cost.CostHeaderPanel = Ext.extend(ssc.component.BaseFormHeaderPanel,
{
	xy_StoreUrl : "SSC/ssc_smcs_CostFormAction!getExpandHeaderInfo.action",
	xy_StoreParams : null,
	initComponent : function()
	{
		this.xy_StoreParams = FormGlobalVariant.create_StoreParams();

		this.createControl();

		ssc.smcs.form.cost.CostHeaderPanel.superclass.initComponent.call(this);
	},
	getRecord : function()
	{
		return Ext.data.XyCalcRecord.create( [
		{
			name : "detailid"
		},
		{
			name : "settletype"
		},
		{
			name : "payobjecttype"
		},
		{
			name : "supplierid"
		},
		{
			name : "suppliername"
		},
		{
			name : "payuserid"
		},
		{
			name : "payusername"
		},
		{
			name : "customerid"
		},
		{
			name : "customername"
		},
		{
			name : "isrelation"
		},
		{
			name : "paytype"
		},
		{
			name : "econitemtypeid"
		},
		{
			name : "ispay"
		},
		{
			name : "invoicetype"
		},
		{
			name : "remark"
		} ]);
	},
	createControl : function()
	{
		this.cmbSettleType = new ssc.smcs.component.SettleTypeComboBox(
		{
			id : "settletype",
			fieldLabel : "结算方式",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					
				};

				return param;
			}.createDelegate(this),
			xy_SelectEvent : function(combo, record, index)
			{
				if(this.cmbSettleType.getKeyValue()=="ST01"&&this.cmbPayObjectType.isStaff())
				{
					this.row3.hide();
					this.row2.hide();
					this.row31.hide();
					this.fieldPayUser.setInitValue(CommonHeaderPanel.fieldUser.getUserID(), CommonHeaderPanel.fieldUser.getUserCode());
					this.edtPayUserName.setValue(CommonHeaderPanel.fieldUser.getUserName());
				}
				if(this.cmbSettleType.getKeyValue()=="ST00"&&this.cmbPayObjectType.isStaff())
				{
					this.row3.show();
					this.row2.hide();
					this.row31.hide();
				}
				
			}
		});
		this.MainChildControls.push(this.cmbSettleType);

		this.cmbPayObjectType = new ssc.smcs.component.PayObjectTypeComboBox(
		{
			id : "payobjecttype",
			fieldLabel : "支付类型",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
				};

				return param;
			}.createDelegate(this),
			xy_SelectEvent : function(combo, record, index)
			{
				if (combo.isSupplier())
				{
					this.row2.show();
					this.row3.hide();
					this.row31.hide();
				}
				else if (combo.isStaff())
				{
					if(this.cmbSettleType.getKeyValue()=="ST01")
					{
						this.row3.hide();
						this.row2.hide();
						this.row31.hide();
						this.fieldPayUser.setInitValue(CommonHeaderPanel.fieldUser.getUserID(), CommonHeaderPanel.fieldUser.getUserCode());
						this.edtPayUserName.setValue(CommonHeaderPanel.fieldUser.getUserName());
					}
					else 
					{
						this.row3.show();
						this.row2.hide();
						this.row31.hide();
					}
				} 
				else if (combo.isCustomer())
				{
					this.row31.show();
					this.row2.hide();
					this.row3.hide();
				}
			}
		});
		this.MainChildControls.push(this.cmbPayObjectType);
		
		this.cmbIsRelation = new ssc.component.YesNoComboBox(
		{
			id : "isrelation",
			fieldLabel : "是否关联交易",
			xy_DataArray : [ [ 0, "否" ], [ 1, "是" ] ],
			xy_InitDataID : 0,
			xy_ParentObjHandle : this,
			xy_SelectEvent : function(cmbox, record, index)
			{
				
			}
		});
		this.MainChildControls.push(this.cmbIsRelation);
		
		this.fieldEconItemType = new ssc.smcs.component.EconItemTypeField(
		{
			id : "econitemtypeid",
			fieldLabel : "经济事项大类",
			xy_DisplayField : "econitemtypename",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					
				};

				return param;
			}.createDelegate(this),
			xy_beforeValueChangeValid : function(newValue, oldValue, field)
			{
				var intCount = BusinessPanel.getCostInfoPanel().getRecordCount();
				if (intCount > 0)
				{
					var msg = "更换经济事项，会清除已填写的" + intCount.toString() + "条【" + BusinessPanel.getCostInfoPanel().xy_Title + "】, ";
					msg += "需要重新填写【" + BusinessPanel.getCostInfoPanel().xy_Title + "】<br>";
					msg += "是否继续？<br><br>";
					msg += "选择【取消】则不更换经济事项，也不会清除【" + BusinessPanel.getCostInfoPanel().xy_Title + "】";

					MsgUtil.prompt(msg,
					function(btn)
					{
						if(btn == "ok")
						{
							field.xy_beforeValueChangeValidPass(newValue, oldValue);
						}
					}, this);
				}
				else
				{
					field.xy_beforeValueChangeValidPass(newValue, oldValue);
				}
			},
			xy_beforeClearValid : function(field)
			{
				var intCount = BusinessPanel.getCostInfoPanel().getRecordCount();
				if (intCount > 0)
				{
					var msg = "更换经济事项，会清除已填写的" + intCount.toString() + "条【" + BusinessPanel.getCostInfoPanel().xy_Title + "】, ";
					msg += "需要重新填写【" + BusinessPanel.getCostInfoPanel().xy_Title + "】<br>";
					msg += "是否继续？<br><br>";
					msg += "选择【取消】则不更换经济事项，也不会清除【" + BusinessPanel.getCostInfoPanel().xy_Title + "】";

					MsgUtil.prompt(msg,
					function(btn)
					{
						if(btn == "ok")
						{
							field.xy_beforeClearValidPass();
						}
					}, this);
				}
				else
				{
					field.xy_beforeClearValidPass();
				}
			},
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
				BusinessPanel.getCostInfoPanel().removeAllRecords();	
			}
		});
		this.MainChildControls.push(this.fieldEconItemType);

		this.row1 =
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.cmbSettleType ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.cmbPayObjectType ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.fieldEconItemType ]
			},
			{
				columnWidth : .01,
				layout : "form",
				border : false,
				items : [ this.cmbIsRelation ]
			} ]
		};

		this.fieldSupplier = new ssc.smcs.component.SupplierField(
		{
			id : "supplierid",
			fieldLabel : "供应商编号",
			xy_DisplayField : "suppliercode",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					P_IsRelation : 0
				};

				return param;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
				this.edtSupplierName.setValue(field.getSupplierName());
			}
		});
		this.MainChildControls.push(this.fieldSupplier);

		this.edtSupplierName = new Ext.form.TextField(
		{
			id : "suppliername",
			fieldLabel : "供应商名称"
		});

		this.row2 = new Ext.Panel(
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.fieldSupplier ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.edtSupplierName ]
			} ]
		});
		this.fieldPayUser = new ssc.smcs.component.UserField(
		{
			id : "payuserid",
			fieldLabel : "员工编码",
			xy_DisplayField : "usercode",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					P_UnitID : FormInfoUtil.get_Header_UnitID(),
					P_DeptID : FormInfoUtil.get_Header_DeptID()
				};

				return param;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
				this.edtPayUserName.setValue(field.getUserName());
			}
		});
		this.MainChildControls.push(this.fieldPayUser);

		this.edtPayUserName = new Ext.form.TextField(
		{
			id : "payusername",
			fieldLabel : "员工名称"
		});

		this.row3 = new Ext.Panel(
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.fieldPayUser ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.edtPayUserName ]
			} ]
		});
		
		this.fieldCustomer = new ssc.smcs.component.CustomerField(
		{
			id : "customerid",
			fieldLabel : "客户编号",
			xy_DisplayField : "customercode",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					P_IsRelation : 0
				};

				return param;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
				this.edtCustomerName.setValue(field.getCustomerName());
			}
		});
		this.MainChildControls.push(this.fieldCustomer);

		this.edtCustomerName = new Ext.form.TextField(
		{
			id : "customername",
			fieldLabel : "客户名称"
		});
	
		this.row31 = new Ext.Panel(
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.fieldCustomer ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.edtCustomerName ]
			} ]
		});
		
		this.cmbPayType = new ssc.smcs.component.PayTypeComboBox(
		{
			id : "paytype",
			fieldLabel : "支付方式",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					
				};

				return param;
			}.createDelegate(this),
			xy_SelectEvent : function(combo, record, index)
			{
			},
			isCheque : function()
			{
				return (this.getKeyValue() == "PT00");
			},
			xy_ValueChangeEvent : function(cmb, oldValue, newValue)
			{
				var loadMask = new Ext.LoadMask(Ext.getBody(),
				{
					msg : "处理中....",
					removeMask : true
				});
				loadMask.show();
				
				try
				{
					if (cmb.isCheque())
					{
						FormAccessUtil.setFieldHiddenEx(this.cmbCheckType, false);
					}
					else
					{
						FormAccessUtil.setFieldHiddenEx(this.cmbCheckType, true);
					}
				}
				finally
				{
					loadMask.hide();
				}
			}
			
		});
		this.MainChildControls.push(this.cmbPayType);
		
		this.cmbCheckType = new ssc.smcs.component.InvoiceTypeComboBox(
		{
			id : "invoicetype",
			fieldLabel : "支票类型",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					
				};

				return param;
			}.createDelegate(this),
			xy_SelectEvent : function(combo, record, index)
			{
				
			}
		});
		this.MainChildControls.push(this.cmbCheckType);
		
		this.cmbIsPay = new ssc.component.YesNoComboBox(
		{
			id : "ispay",
			fieldLabel : "款项已付",
			xy_DataArray : [ [ 0, "否" ], [ 1, "是" ] ],
			xy_InitDataID : 0,
			xy_ParentObjHandle : this,
			xy_SelectEvent : function(cmbox, record, index)
			{
				
			}
		});
		this.MainChildControls.push(this.cmbIsPay);
		
		this.row4 = new Ext.Panel(
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.cmbPayType ]
			},
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.cmbCheckType ]
			} ,
			{
				columnWidth : .33,
				layout : "form",
				border : false,
				items : [ this.cmbIsPay ]
			} ]
		});
		
		this.edtRemark = new Ext.form.TextField(
		{
			id : "remark",
			fieldLabel : "备注"
		});
		this.MainChildControls.push(this.edtRemark);
		this.row5 = new Ext.Panel(
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : 1,
				layout : "form",
				border : false,
				items : [ this.edtRemark ]
			}  ]
		});

		/*以下为隐藏列*/
		this.edtDetailID =
		{
			xtype : "hidden",
			id : "detailid"
		};
		this.MainChildControls.push(this.edtDetailID);

		this.rowHidden =
		{
			hidden : true,
			items : [ this.edtDetailID ]
		};

		var ClassCode = FormGlobalVariant.get_BusiClassCode();
		
		this.items = [ this.row1, this.row2,this.row3, this.row31 , this.row4,this.row5, this.rowHidden ];
		
	},
	initComponentEvents : function()
	{
		this.getStore().on("load", this.onStoreLoadEvent, this);
		
	},
	onStoreLoadEvent : function(store, records, options)
	{
		this.setFormData(store);

		this.initComponentStatus();

		BusinessPanel.initComponentStatus();
	},
	initComponentStatus : function()
	{
		if (FormOperTypeUtil.isCreateNew() 
//		|| FormOperTypeUtil.isDraft()
		)
		{
			this.cmbSettleType.setInitValue("ST01","付款");
			this.cmbPayObjectType.setInitValue("POT01","供应商");
			this.cmbPayType.setInitValue("PT00","支票");
			this.cmbCheckType.setInitValue("IT00","限额支票");
		}
		
//		this.cmbSettleType.setInitValue("ST01","付款");
//		this.cmbPayObjectType.setInitValue("POT01","供应商");
//		this.cmbPayType.setInitValue("PT00","支票");
//		this.cmbCheckType.setInitValue("IT00","限额支票");
		
		
		this.row2.hide();
		this.row3.hide();
		this.row31.hide();
		if(this.cmbPayObjectType.isSupplier()){
			this.row2.show();
		}
		if(this.cmbPayObjectType.isStaff()){
			if(this.cmbSettleType.getKeyValue()=="ST01"&&this.cmbPayObjectType.isStaff())
			{
				this.row3.hide();
			}
			else
			{
				this.row3.show();
			}
			
		}
		if(this.cmbPayObjectType.isCustomer()){
			this.row31.show();
		}
		
		if (this.cmbPayType.isCheque())
		{
			FormAccessUtil.setFieldHiddenEx(this.cmbCheckType, false);
		}
		else
		{
			FormAccessUtil.setFieldHiddenEx(this.cmbCheckType, true);
		}
		
	},
	validate : function(submittype)
	{
		if (submittype != "submit")
		{
			return true;
		}

		/**
		 * 填单环节，结算方式、支付对象类型、供应商
		 */
		if (FormStatusUtil.isStart() || FormStatusUtil.isFin())
		{
			if (! FormCheckUtil.check_Header_SettleType_Null())
			{
				return false;
			}

			if (! FormCheckUtil.check_Header_Object_Null("payobjecttype"))
			{
				return false;
			}
			
			if (! FormCheckUtil.check_Header_Object_Null("econitemtypeid"))
			{
				return false;
			}

			if (this.cmbPayObjectType.isSupplier())
			{
				if (! FormCheckUtil.check_Header_Supplier_Null())
				{
					return false;
				}
			}
			
			if (this.cmbPayObjectType.isStaff())
			{
				if (! FormCheckUtil.check_Header_Object_Null("payuserid"))
				{
					return false;
				}
			}
			
			if (this.cmbPayObjectType.isStaff())
			{
				if (ExpandHeaderPanel.fieldPayUser.getSelectedID() ==null)
				{
					return false;
				}
			}
			
			if (this.cmbPayObjectType.isCustomer())
			{
				if (! FormCheckUtil.check_Header_Object_Null("customerid"))
				{
					return false;
				}
			}
			
			if (this.cmbPayObjectType.isCustomer())
			{
				if (ExpandHeaderPanel.fieldCustomer.getSelectedID() ==null)
				{
					return false;
				}
			}
			
			if (StringUtil.hasLimitedChar(this.edtRemark.getValue()))
			{
				MsgUtil.alert("【备注】填写内容不能包含字符【" + StringUtil.getFirstLimitedChar(this.edtRemark.getValue()) + "】");
				return false;
			}
		}

		return true;
	},
	clearFormData : function()
	{
	}
});