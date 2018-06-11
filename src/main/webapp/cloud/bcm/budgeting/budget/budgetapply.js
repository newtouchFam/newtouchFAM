Ext.namespace("bcm.budgeting.BudgetApply");

bcm.budgeting.BudgetApply.MainList = Ext.extend(Ext.grid.EditorGridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	border : false,

	initComponent : function()
	{
		this.store = new Ext.data.JsonStore(
		{
			url : "BCM/bcm_BudgetAction!getBudgetingList.action",
			root : "data",
			method : "post",
			fields : [ "INDEXID", "INDEXCODE", "INDEXNAME",
			           "DATAVALUE",
			           "CTRLTYPE", "CTRLPERIOD", "CTRLATTR",
			           "WARNPERCENT", "ALWPERCENT", "DETAILPERCENT", "CODEID" ]
		});
		var rowNumber = new Ext.grid.RowNumberer();
		var columnModelConfig = [ rowNumber,
		{
			header : "项目编码",
			dataIndex : "INDEXCODE",
			width : 120,
			sortable : false
		},
		{
			header : "项目名称",
			dataIndex : "INDEXNAME",
			width : 150,
			sortable : false
		},
		{
			header : "本期预算<font color='red'>*</font>",
			dataIndex : "DATAVALUE",
			width : 100,
			renderer : ssc.common.FormatUtil.Money_4Decimal,
			sortable : false,
			align : "right",
			editor : new Freesky.Common.XyMoneyField(
			{
				decimalPrecision : 4
			})
		},
		{
			header : "控制方式",
			dataIndex : "CTRLTYPE",
			width : 80,
			renderer : bcm.render.CtrlType,
			sortable : false,
			align : "center"
		},
		{
			header : "控制周期",
			dataIndex : "CTRLPERIOD",
			width : 80,
			renderer : bcm.render.CtrlPeriod,
			sortable : false,
			align : "center"
		},
		{
			header : "控制属性",
			dataIndex : "CTRLATTR",
			width : 80,
			renderer : bcm.render.CtrlAttr,
			sortable : false,
			align : "center"
		},
		{
			header : "告警率",
			dataIndex : "WARNPERCENT",
			width : 60,
			sortable : false,
			align : "right"
		},
		{
			header : "容差率",
			dataIndex : "ALWPERCENT",
			width : 60,
			sortable : false,
			align : "right"
		},
		{
			header : "明细率",
			dataIndex : "DETAILPERCENT",
			width : 60,
			sortable : false,
			align : "right"
		} ];

		this.cm = new Ext.grid.ColumnModel(columnModelConfig);

		bcm.budgeting.BudgetApply.MainList.superclass.initComponent.call(this);
	},
	loadStoreData : function(param)
	{
		this.store.load(
		{
			params :
			{
				jsonCondition : Ext.encode(param)
			}
		});
	}
});

bcm.budgeting.BudgetApply.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",

	/*预算编制状态对象*/
	m_BudgetingStatus : null,
	/*可否编制*/
	m_ReadOnly : false,
	m_CaseCode : "",
	m_PeriodMonth : "",
	m_RespnID : "",

	m_MainList : null,
	initComponent : function()
	{
		this.m_MainList = new bcm.budgeting.BudgetApply.MainList(
		{
		});

		this.cmbPeriod = new bcm.component.PeriodBudgetingComboBox(
		{
			width : 150,
			xy_InitLoadData : true,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function(combobox, oldValue, newValue)
			{
				if (oldValue == null || newValue == null
						|| oldValue.caseCode != newValue.caseCode)
				{
					this.tgfieldRespn.clearSelections();
				}
			}
		});

		this.tgfieldRespn = new bcm.component.RespnTreeField(
		{
			width : 200,
			xy_MultiSelectMode : false,
			xy_ParentObjHandle : this,
			baseBeforeClickValid : function()
			{
				if (! this.cmbPeriod.getSelected())
				{
					MsgUtil.alert("请先选择编制预算账期");
					return false;
				};

				return true;
			}.createDelegate(this),
			prepareBaseParams : function()
			{
				var param =
				{
					casecode : this.cmbPeriod.getSelectedData().caseCode,
					unitid : Ext.get("m8_companyid").dom.value,
					textfield : "respnName,[,respnCode,]"
				};

				return param;
			}.createDelegate(this)
		});

		this.btnOpen = new Ext.Toolbar.Button(
		{
			text : "打开",
			iconCls : "xy-open",
			handler : this.btn_OpenEvent,
			scope : this
		});
		this.btnSave = new Ext.Toolbar.Button(
		{
			text : "保存",
			iconCls : "xy-save",
			handler : this.btn_SaveEvent,
			scope : this
		});
		this.btnCommit = new Ext.Toolbar.Button(
		{
			text : "上报",
			iconCls : "xy-icon-show-all",
			handler : this.btn_CommitEvent,
			scope : this,
			disabled : true
		});

		this.btnHist = new Ext.Toolbar.Button(
		{
			text : "历史数据",
			iconCls : "xy-album",
			handler : Ext.emptyFn,
			hidden : true,
			scope : this
		});
		this.btnExport = new Ext.Toolbar.Button(
		{
			text : "导出",
			iconCls : "xy-export",
			handler : Ext.emptyFn,
			hidden : true,
			scope : this
		});
		this.btnImport = new Ext.Toolbar.Button(
		{
			text : "导入",
			iconCls : "xy-import",
			handler : Ext.emptyFn,
			hidden : true,
			scope : this
		});

		this.tbar = [ "预算账期", this.cmbPeriod,
		              "-",
		              "责任中心", this.tgfieldRespn,
		              "-",
		              this.btnOpen,
		              this.btnSave,
		              this.btnCommit,
		              "-",
		              this.btnHist,
		              this.btnExport,
		              this.btnImport
		              , "->", "<font color='red'>单位：万元</font>"];

		this.m_LabelStatus = new Ext.Toolbar.TextItem("预算编制状态：");
		this.m_LabelSeparator1 = new Ext.Toolbar.Separator();
		this.m_LabelVersion = new Ext.Toolbar.TextItem("版本号：");
		this.m_LabelSeparator2 = new Ext.Toolbar.Separator();
		this.m_LabelDate = new Ext.Toolbar.TextItem("编制时间：");
		this.m_LabelSeparator3 = new Ext.Toolbar.Separator();
		this.m_LabelUser = new Ext.Toolbar.TextItem("编制人：");

		this.bbar = new Ext.Toolbar(
		{
			items : [ this.m_LabelStatus,
			          this.m_LabelSeparator1,
			          this.m_LabelVersion,
			          this.m_LabelSeparator2,
			          this.m_LabelDate,
			          this.m_LabelSeparator3,
			          this.m_LabelUser]
		});

		this.items = [ this.m_MainList ];

		this.m_MainList.loadStoreData();
		this.m_MainList.on("beforeedit", this.onBeforeEditEvent, this);
		this.m_MainList.on("afteredit", this.onAfterEditEvent, this);

		bcm.budgeting.BudgetApply.MainPanel.superclass.initComponent.call(this);
	},
	onBeforeEditEvent : function(object)
	{
		if (this.m_BudgetingStatus.hasbudgetdata == 1)
		{
			MsgUtil.alert("已有预算数，不能编制");
		}
		else
		{
			if (this.m_BudgetingStatus.hasbudgetingdata == 1
					&& this.m_BudgetingStatus.status == 1)
			{
				MsgUtil.alert("已上报，不能修改");
			}
		}

		object.cancel = this.m_ReadOnly;
	},
	onAfterEditEvent : function(object)
	{
		/* 修改数据后不能直接上报，保存后才能上报 */
		this.btnCommit.disable();
	},
	btn_OpenEvent : function()
	{
		if (!this.cmbPeriod.getSelected())
		{
			MsgUtil.alert("请先选择编制预算账期");
			return;
		}

		if (this.tgfieldRespn.getSelectedCount() <= 0)
		{
			MsgUtil.alert("请先选择责任中心");
			return;
		}

		this.m_CaseCode = this.cmbPeriod.getSelectedData().caseCode;
		this.m_PeriodMonth = this.cmbPeriod.getSelectedData().month.toString();
		this.m_RespnID = this.tgfieldRespn.getSelectedID();

		this.loadUIData();
	},
	loadUIData : function()
	{
		var param =
		{
			casecode : this.m_CaseCode,
			periodmonth : this.m_PeriodMonth,
			respnid : this.m_RespnID
		};

		this.getBudgetingStatus(param);

		this.m_MainList.loadStoreData(param);
	},
	getBudgetingStatus : function(param)
	{
		Ext.Ajax.request(
		{
			url : "SSC/bcm_BudgetAction!getBudgetingStatus.action",
			method : "post",
			params :
			{
				jsonCondition : Ext.encode(param)
			},
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);

				if (data.success)
				{
					this.m_BudgetingStatus = data;

					this.showBudgetingStatus();
				}
				else
				{
					MsgUtil.alert(data.msg);
					return;
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	showBudgetingStatus : function()
	{
		if (this.m_BudgetingStatus.hasbudgetdata == 1)
		{
			if (this.m_BudgetingStatus.hasbudgetingdata == 1)
			{
				if (this.m_BudgetingStatus.status == 1)
				{
					this.m_LabelStatus.getEl().innerHTML = "预算编制状态：<font color='green'>已上报</font>";
					this.m_ReadOnly = true;
				}
				else
				{
					this.m_LabelStatus.getEl().innerHTML = "预算编制状态：<font color='green'>已有预算数</font>";
					this.m_ReadOnly = true;
				}
			}
			else
			{
				if (this.m_BudgetingStatus.status == 1)
				{

				}
				else
				{
					this.m_LabelStatus.getEl().innerHTML = "预算编制状态：<font color='green'>已有预算数</font>";
					this.m_ReadOnly = true;
				}
			}
		}
		else
		{
			if (this.m_BudgetingStatus.hasbudgetingdata == 1)
			{
				if (this.m_BudgetingStatus.status == 1)
				{
					this.m_LabelStatus.getEl().innerHTML = "预算编制状态：<font color='green'>已上报</font>";
					this.m_ReadOnly = true;
				}
				else
				{
					this.m_LabelStatus.getEl().innerHTML = "预算编制状态：<font color='red'>编制中</font>";
					this.m_ReadOnly = false;
				}
			}
			else
			{
				if (this.m_BudgetingStatus.status == 1)
				{

				}
				else
				{
					this.m_LabelStatus.getEl().innerHTML = "预算编制状态：<font color='red'>编制中</font>";
					this.m_ReadOnly = false;
				}
			}
		}

		this.showButtons();

		if (this.m_BudgetingStatus.hasbudgetingdata == 1)
		{
			this.m_LabelVersion.getEl().innerHTML = "版本号：" + this.m_BudgetingStatus.version.toString();
			this.m_LabelDate.getEl().innerHTML = "编制时间：" + this.m_BudgetingStatus.budgetingDate.toString();
			this.m_LabelUser.getEl().innerHTML = "编制人：" + this.m_BudgetingStatus.userName.toString();
		}
	},
	showButtons : function()
	{
		if (this.m_ReadOnly)
		{
            this.btnSave.disable();
		}
		else
		{
            this.btnSave.enable();
		}
	},
	btn_SaveEvent : function()
	{
		var records = this.m_MainList.getStore().getModifiedRecords();
		if (records.length <= 0)
		{
			return;
		}

		MsgUtil.confirm("是否要保存目前所有的修改？", function(btn, text)
		{
			if (btn == "yes")
			{
				this.save();
			}
		}, this);
	},
	save : function()
	{
		var budgetingArray = [];
		for ( var i = 0; i < this.m_MainList.getStore().getCount(); i++)
		{
			record = this.m_MainList.getStore().getAt(i);
			budgetingArray.push(record.data);
		}

		var param =
		{
			casecode : this.m_CaseCode,
			periodmonth : this.m_PeriodMonth,
			respnid : this.m_RespnID
		};

		Ext.Ajax.request(
		{
			url : "BCM/bcm_BudgetAction!saveBudgetingList.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(budgetingArray),
				jsonCondition : Ext.encode(param)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.loadUIData();

					this.btnCommit.enable();
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	btn_CommitEvent : function()
	{
		MsgUtil.confirm("上报以后该预算数后就不能修改，变为实际执行控制的预算数了。<br>是否要上报目前编制的预算数？", function(btn, text)
		{
			if (btn == "yes")
			{
				this.commit();
			}
		}, this);
	},
	commit : function()
	{
		var param =
		{
			casecode : this.m_CaseCode,
			periodmonth : this.m_PeriodMonth,
			respnid : this.m_RespnID
		};

		Ext.Ajax.request(
		{
			url : "BCM/bcm_BudgetAction!commitBudgetingList.action",
			method : "post",
			params :
			{
				jsonCondition : Ext.encode(param)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.loadUIData();
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	}
});
Ext.reg("bcm_core_budgeting_budgetapply_mainpanel", bcm.budgeting.BudgetApply.MainPanel);

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "bcm_core_budgeting_budgetapply_mainpanel",
			xtype : "bcm_core_budgeting_budgetapply_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);