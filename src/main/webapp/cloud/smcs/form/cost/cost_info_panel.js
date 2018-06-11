Ext.namespace("ssc.smcs.form.cost");

ssc.smcs.form.cost.CostInfoPanel = Ext.extend(ssc.component.BaseFormGridPanel,
{
	id : "costinfo",
	xy_Title : "日常费用报账业务信息",
	entities : [ "SMCSFM_COST_INFO" ],
	keycolumns : [ "DETAILID" ],
	xy_StoreUrl : "SSC/ssc_smcs_CostFormAction!getCostInfo.action",
	xy_StoreParams : null,
	xy_MinPrintDataRecordCount : 3,
	xy_IsMoneyFormatString : true,
	initComponent : function()
	{
		this.store = this.createStore();

		this.tbar = this.createToolbar();

		this.selModel = new Ext.grid.RowSelectionModel(
		{
			singleSelect : true
		});

		this.colModel = this.createColumnModel();

		Ext.getCmp("budgetyear").on("valuechange",function(field, oldValue, newValue)
		{
			this.budgetYear_ChangeEvent(field, oldValue, newValue);
		}.createDelegate(this));
		ssc.smcs.form.cost.CostInfoPanel.superclass.initComponent.call(this);
	},
	/**
	 * @extneds
	 * 创建CalcRecord
	 */
	createCalcRecord : function()
	{
		var arrayRecordConfig = [
		{
			name : "detailid"
		},
		{
			name : "mainid"
		},
		{
			name : "status"
		},
		{
			name : "seq"
		},
		{
			name : "econitemid"
		},
		{
			name : "deptid"
		},
		{
			name : "indexdeptid"
		},
		{
			name : "amount"
		},
		{
			name : "taxratetext"
		},
		{
			name : "taxrate"
		},
		{
			name : "amount_notax"
		},
		{
			name : "amount_tax"
		},
		{
			name : "indexid"
		},
		{
			name : "remark"
		} ];

		var record = Ext.data.XyCalcRecord.create(arrayRecordConfig);

		/* XyCalcRecord属性设置 */
		FormFieldAttrUtil.setXyCalcRecordAttr(ssc.smcs.form.cost.FieldAttrConfig, this.id, record);

		return record;
	},
	/**
	 * @extneds
	 * 创建空行
	 */
	newRecord : function()
	{
		var record = this.createCalcRecord();

		var strMemo = FormInfoUtil.get_Header_Abstract();
		var defaultDept = FormInfoUtil.get_Header_DeptField().getSelectedData();

		var initRecordData =
		{
			detailid : FormNewIDUtil.getNewID(),
			mainid : "",
			status : 0,
			seq : 0,
			econitemid : "",
			deptid : "",
			indexdeptid : "",
			amount : 0,
			taxratetext : "",
			taxrate : 0,
			amount_notax : 0,
			amount_tax : 0,
			indexid : 0,
			remark : 0
		};

		return new record(initRecordData);
	},
	getCopyConfig : function(record)
	{
		var config =
		{
			detailid : FormNewIDUtil.getNewID()
		};

		return config;
	},
	/**
	 * 创建工具栏
	 */
	createToolbar : function()
	{
		this.createToolbarButton();

		var toolbarTop = [];
		this.btnDel = new Ext.Toolbar.Button(
		{
			text : "删除",
			iconCls : "xy-delete1",
			handler : this.btn_DeleteEvent,
			scope : this
		});
		this.btnMod = new Ext.Toolbar.Button(
		{
			text : "修改",
			iconCls : "xy-edit",
			handler : this.editRowEvent,
			scope : this
		});

		if (FormStatusUtil.isStart())
		{
			toolbarTop = [ this.btnAdd, "-",this.btnMod, "-", this.btnCopy, "-", this.btnDel];
		}
		else
		{
			toolbarTop = [ "-" ];
		}

		return new Ext.Toolbar(
		{
			items : toolbarTop,
			height : 28
		});
	},
	/**
	 * 表格列
	 */
	createColumnModel : function()
	{
		var colRowNum = new Ext.grid.RowNumberer(
		{
			summaryType : "合计",
			width : 30
		});
		var colDetailID =
		{
			header : "实体ID",
			dataIndex : "detailid",
			hidden : true
		};
		var colMainID =
		{
			header : "表单ID",
			dataIndex : "mainid",
			hidden : true
		};
		var colSeq =
		{
			dataIndex : "seq",
			hidden : true
		};

		this.fieldEconItem = new ssc.smcs.component.EconItemField(
		{
			fieldLabel : "经济事项",
			xy_ParentObjHandle : this,
			baseBeforeClickValid : function()
			{
				return true;
			}.createDelegate(this),
			prepareBaseParams : function()
			{
				var record = this.getSelectionModel().getSelected();
				var condition =
				{
					P_Year : FormInfoUtil.get_Header_AccountYear(),
					P_EconItemTypeID : ""
				};
				return condition;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
				var record = this.getSelectionModel().getSelected();

				record.setEx("indexid", field.getIndex());
			}
		});
		var colEconItemID =
		{
			header : "经济事项",
			dataIndex : "econitemid",
			complex : true,
			editor : this.fieldEconItem
		};

		this.fieldDept = new sm.component.DeptTreeField(
		{
			fieldLabel : "报账部门",
			xy_GridType : "xygrid",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var condition = {};
				return condition;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
			}
		});
		var colDeptID =
		{
			header : "报账部门",
			dataIndex : "deptid",
			complex : true,
			editor : this.fieldDept
		};

		this.fieldIndexDept = new ssc.smcs.component.IndexDeptField(
		{
			fieldLabel : "预算部门",
			xy_GridType : "xygrid",
			xy_ParentObjHandle : this
		});
		var colIndexDeptID =
		{
			header : "预算部门",
			dataIndex : "indexdeptid",
			complex : true,
			editor : this.fieldIndexDept
		};

		this.fieldAmount = new Freesky.Common.XyMoneyField(
		{
			fieldLabel : "报账总金额",
			allowBlank : false,
			allowNegative : true,
			maxValue : ssc.smcs.common.MoneyMaxValue
		});
		var colAmount =
		{
			header : "报账总金额",
			dataIndex : "amount",
			editor : this.fieldAmount
		};

		this.edtTaxRateText = new Ext.form.TextField(
		{
			fieldLabel : "税率文本",
			maxLength : 50
		});
		var colTaxRateText =
		{
			header : "税率文本",
			dataIndex : "taxratetext",
			editor : this.edtTaxRateText
		};

		this.cmbTaxRate = new ssc.smcs.component.TaxRateComboBox(
		{
			fieldLabel : "税率",
			width : 120,
			xy_ParentObjHandle : this,
			disabled : true,
			prepareBaseParams : function()
			{
				var param = {};
				return param;
			}.createDelegate(this),
			xy_SelectEvent : function(combo, record, index)
			{
			}
		});
		var colTaxRate =
		{
			header : "税率",
			dataIndex : "taxrate",
			complex : true,
			editor : this.cmbTaxRate
		};

		this.edtAmountNoTax = new Freesky.Common.XyMoneyField(
		{
			fieldLabel : "报账金额(不含税)",
			allowBlank : false,
			allowNegative : true,
			maxValue : ssc.smcs.common.MoneyMaxValue
		});
		var colAmountNoTax =
		{
			header : "报账金额(不含税)",
			dataIndex : "amount_notax",
			editor : this.edtFinAmountNoTax
		};

		this.fieldAmountTax = new Freesky.Common.XyMoneyField(
		{
			fieldLabel : "税额",
			allowBlank : false,
			allowNegative : true,
			maxValue : ssc.smcs.common.MoneyMaxValue
		});
		var colAmountTax =
		{
			header : "税额",
			dataIndex : "amount_tax",
			editor : this.fieldAmountTax
		};

		this.fieldIndex = new bcm.component.IndexListField(
		{
			fieldLabel : "预算项目",
			xy_ParentObjHandle : this
		});
		var colIndexID =
		{
			header : "预算项目",
			dataIndex : "indexid",
			complex : true,
			editor : this.fieldIndex
		};

		this.edtRemark = new Ext.form.TextField(
		{
			fieldLabel : "备注",
			maxLength : 50
		});
		var colRemark =
		{
			header : "备注",
			dataIndex : "remark",
			editor : this.edtRemark
		};

		return new Ext.grid.XyColumnModel([ colRowNum, colDetailID, colMainID, 
		                                    colSeq, colEconItemID, colDeptID,
		                                    colIndexDeptID, colAmount, colTaxRateText, 
		                                    colTaxRate, colAmountNoTax, 
		                                    colAmountTax, colIndexID, colRemark ]);
	},
	initComponentEvents : function(){},
	initComponentStatus : function(){},	
	validate : function(submittype)
	{
		if (submittype != "submit")
		{
			return true;
		}

		/* 应当填写明细记录 */
		if (!FormCheckUtil.check_Grid_Store_Null(this, this.getStore()))
		{
			return false;
		}

		/**
		 * 填单环节，经济事项、部门、金额
		 */
		if (FormStatusUtil.isStart() || FormStatusUtil.isFin()){}

		/**
		 * 财务核定环节
		 */
		if (FormStatusUtil.isFin()){}

		return true;
	},
	check_Record : function(record, index, length)
	{
		this.xy_CheckResult = true;
		return true;
	},
	update_PrintDataRecord : function(index, record, data)
	{
		var dept = record.get("indexdeptid");
		if (dept != undefined && dept != null)
		{
			data["deptid_name"] = dept.deptName;
		}
		else
		{
			data["deptid_name"] = "";
		}

		data["textrate_text"] = record.get("taxrate").taxratename;

		return data;
	},
	
    getStoreLoaded : function()
    {
		return this.xy_StoreLoaded;
	},
    addRowEvent : function()
    {
		if (!FormCheckUtil.check_Header_Object_Null("econitemtypeid"))
		{
			return false;
		}

		var win = new ssc.smcs.form.cost.CostInfoWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : null,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});

		win.show();
	},
    editRowEvent : function(record, rowIndex)
	{
		var record = BusinessPanel.getCostInfoPanel().getSelectionModel().getSelected();
		var rowIndex = BusinessPanel.getCostInfoPanel().getSelectionModel().lastActive;
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}
		var buttonType;
		if (FormStatusUtil.isStart())
		{
			buttonType = true;
		}
		else
		{
			buttonType = false;
		}
			
		var entity = {};
		Ext.apply(entity, record.data);
		entity.index = rowIndex;
		var win = new ssc.smcs.form.cost.CostInfoWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : null,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update,
			xy_ButtonType : buttonType ? ssc.component.DialogButtonTypeEnum.OkCancel:ssc.component.DialogButtonTypeEnum.Close
		});
		win.show();
	},
	
    btn_DeleteEvent : function()
	{
		var writeStore = BusinessPanel.getCostInfoPanel().store;
		if (writeStore.getCount() <= 0)
		{
			return;
		}
		var record = BusinessPanel.getCostInfoPanel().getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		var msg = "是否确定删除所选的明细事项?";
		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "yes")
			{
				this.doDelete();
			}
		}, this);
	},
	doDelete : function()
	{
		var costStore = BusinessPanel.getCostInfoPanel().store;
		var record = BusinessPanel.getCostInfoPanel().getSelectionModel().getSelected();
		costStore.remove(record);
		BusinessPanel.getCostInfoPanel().getView().refresh();
	},
    /**
     * 获取最大行金额和经济事项
     * return
     * {
     * 		econitemid : "",
     * 		maxrowamount : 100
     * }
     */
    getMaxRowAmountAndEconItemID : function()
    {
		var strEconItemID = "";
		var mnyMaxRowAmount = 0;
		for (i = 0; i < this.getStore().getCount(); i++)
		{
			var record = this.getStore().getAt(i);

			var strCurrentEconItemID = FormInfoUtil.get_Record_EconItemID(record);
			var mnyCurrentRowAmount = FormInfoUtil.get_Record_Money(record, "amount");

			if (mnyMaxRowAmount < mnyCurrentRowAmount)
			{
				mnyMaxRowAmount = mnyCurrentRowAmount;
				strEconItemID = strCurrentEconItemID;
			}
		}

		var retObject =
		{
			econitemid : strEconItemID,
			maxrowamount : mnyMaxRowAmount
		};

		return retObject;
	},
	budgetYear_ChangeEvent :function (field, oldValue, newValue)
	{
		var intCount = BusinessPanel.getCostInfoPanel().getRecordCount();
		if (intCount > 0)
		{
			var msg = "更换账期年份，会清除已填写的" + intCount.toString() + "条【" + BusinessPanel.getCostInfoPanel().xy_Title + "】, <br>";
			msg += "需要重新填写【" + BusinessPanel.getCostInfoPanel().xy_Title + "】";
			msg += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否继续？<br><br>";
			msg += "选择【取消】则不更换账期年份，也不会清除【" + BusinessPanel.getCostInfoPanel().xy_Title + "】";

			MsgUtil.prompt(msg,
			function(btn)
			{
				if(btn == "ok")
				{
					BusinessPanel.getCostInfoPanel().removeAllRecords();
				}
				else
				{
					field.setXyValue(oldValue);
				}
			}, this);
		}
	}
});
