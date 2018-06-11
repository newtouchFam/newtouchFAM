Ext.namespace("ssc.report.FormQuery");
Ext.Ajax.timeout=9999999999;

ssc.report.FormQuery.ConditionWin = Ext.extend(Ext.FormPanel,
{
	frame : true,
	labelAlign : "right",
	labelWidth : 100,
	layout : "column",
	xy_MainPanel : null,
	xy_OperationCode : "SSC0902",
	xy_AuthLevel : -1,
	xy_OperatorID : "",
	initComponent : function()
	{
		this.xy_OperatorID = Ext.get("userid").dom.value;

		this.edtFormCode = new Ext.form.TextField(
		{
			fieldLabel : "表单编号"
		});

		this.chbStartDate = new Ext.form.Checkbox
		({
			fieldLabel : "发起日期",
			boxLabel : " ",
			checked : true
		});
		this.chbStartDate.on("check", function(/* Ext.form.Checkbox */_this, /* boolean */checked)
		{
			this.dtFieldStartDateBegin.setReadOnly(!checked);
			this.dtFieldStartDateEnd.setReadOnly(!checked);
		}, this);
		this.dtFieldStartDateBegin = new Ext.form.DateField(
		{
			fieldLabel : "从",
			width : 100,
			format : "Y-m-d",
			value : ssc.common.DateUtil.getMonthFirstDay(),
			readOnly : true
		});
		this.dtFieldStartDateEnd = new Ext.form.DateField(
		{
			fieldLabel : "到",
			width : 100,
			format : "Y-m-d",
			value : ssc.common.DateUtil.getNow(),
			readOnly : true
		});

		this.chbBusiDate = new Ext.form.Checkbox
		({
			fieldLabel : "业务日期",
			boxLabel : " ",
			checked : false
		});
		this.chbBusiDate.on("check", function(/* Ext.form.Checkbox */_this, /* boolean */checked)
		{
			this.dtFieldBusiDateBegin.setReadOnly(!checked);
			this.dtFieldBusiDateEnd.setReadOnly(!checked);
		}, this);
		this.dtFieldBusiDateBegin = new Ext.form.DateField(
		{
			fieldLabel : "从",
			width : 100,
			format : "Y-m-d",
			value : ssc.common.DateUtil.getMonthFirstDay(),
			readOnly : true
		});
		this.dtFieldBusiDateEnd = new Ext.form.DateField(
		{
			fieldLabel : "到",
			width : 100,
			format : "Y-m-d",
			value : ssc.common.DateUtil.getNow(),
			readOnly : true
		});
		this.dtFieldBusiDateBegin.setReadOnly(true);
		this.dtFieldBusiDateEnd.setReadOnly(true);

		this.chbAccDate = new Ext.form.Checkbox
		({
			fieldLabel : "记账日期",
			boxLabel : " ",
			checked : false
		});
		this.chbAccDate.on("check", function(/* Ext.form.Checkbox */_this, /* boolean */checked)
		{
			this.dtFieldAccDateBegin.setReadOnly(!checked);
			this.dtFieldAccDateEnd.setReadOnly(!checked);
		}, this);
		this.dtFieldAccDateBegin = new Ext.form.DateField(
		{
			fieldLabel : "从",
			width : 100,
			format : "Y-m-d",
			value : ssc.common.DateUtil.getMonthFirstDay(),
			readOnly : true
		});
		this.dtFieldAccDateEnd = new Ext.form.DateField(
		{
			fieldLabel : "到",
			width : 100,
			format : "Y-m-d",
			value : ssc.common.DateUtil.getNow(),
			readOnly : true
		});
		this.dtFieldAccDateBegin.setReadOnly(true);
		this.dtFieldAccDateEnd.setReadOnly(true);

		this.edtStartUser = new Ext.form.TextField(
		{
			fieldLabel : "发起人姓名"
		});

		this.fieldUnit = new ssc.shcs.component.UnitPermissionField(
		{
			fieldLabel : "报账公司",
			xy_PageMode : true,
			xy_MultiSelectMode : false,
			operationcode : this.xy_OperationCode,
			operatorid : this.xy_OperatorID,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
				this.fieldDept.clearSelections();
			}
		});
		
		this.fieldDept = new ssc.shcs.component.ReportDeptField(
		{
			fieldLabel : "报账部门",
			xy_MultiSelectMode : true,
			xy_ParentObjHandle : this,
			baseBeforeClickValid : function()
			{
				if (! this.fieldUnit.getSelected())
				{
					MsgUtil.alert("请先选择公司");
					return false;
				};

				return true;
			}.createDelegate(this),
			prepareBaseParams : function()
			{
				var params =
				{
					unitid : this.fieldUnit.getUnitID(),
					operationcode : this.xy_OperationCode,
					operatorid : this.xy_OperatorID
				};
				return params;
			}.createDelegate(this)
		});

		this.edtMoneyBegin = new Ext.form.NumberField(
		{
			fieldLabel : "报账金额:从",
			width : 100
		});
		this.edtMoneyEnd = new Ext.form.NumberField (
		{
			fieldLabel : "到",
			width : 100
		});

		this.fieldBillType = new ssc.component.BillTypeTGField(
		{
			id : "billtypeid",
			fieldLabel : "表单类型",
			xy_ParentObjHandle : this
		});
		this.fieldBusiClass = new ssc.cup.component.XyBusiClassMCField(
		{
			fieldLabel : "业务类型",
			xy_ParentObjHandle : this,
			baseBeforeClickValid : function()
			{
				if (! this.fieldBillType.getSelected())
				{
					MsgUtil.alert("请先选择表单类型");
					return false;
				}
				;

				return true;
			}.createDelegate(this),
	    	prepareBaseParams : function()
			{
				var condition =
				{
					P_LangCode : "",
					P_BillType : this.fieldBillType.getSelectedID()
				};
				return condition;
			}.createDelegate(this)
		});

		this.fieldFormStatus = new ssc.cup.component.XyMasterDataMCField(
		{
			fieldLabel : "表单状态",
			xy_ParentObjHandle : this,
	    	prepareBaseParams : function()
			{
				var condition =
				{
					P_LangCode : "",
					P_CateGorytype : "90000013"
				};
				return condition;
			}.createDelegate(this)
		});
		this.edtBillAbstract = new Ext.form.TextField(
		{
			fieldLabel : "表单摘要"
		});

		this.cmbOrder = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "排序方式",
			xy_DataArray : [ [ "formcode", "表单编号" ], [ "unit", "单位" ], [ "startdate", "发起时间" ] ],
			xy_AllowClear : false,
			xy_InitDataID : "formcode"
		});

		this.items = [
		{
			columnWidth : 1,
			layout : "form",
			defaults :
			{
				width : 340
			},
			items : [ this.edtFormCode ]

		},
		{
			columnWidth : .33,
			layout : "form",
			items : [ this.chbStartDate,
			          this.chbBusiDate,
			          this.chbAccDate ]
		},
		{
			columnWidth : .33,
			layout : "form",
			labelWidth : 20,
			items : [ this.dtFieldStartDateBegin,
			          this.dtFieldBusiDateBegin,
			          this.dtFieldAccDateBegin ]
		},
		{
			columnWidth : .33,
			layout : "form",
			labelWidth : 20,
			items : [ this.dtFieldStartDateEnd,
			          this.dtFieldBusiDateEnd,
			          this.dtFieldAccDateEnd ]
		},
		{
			columnWidth : 1,
			layout : "form",
			defaults :
			{
				width : 340
			},
			items : [ this.fieldUnit,
			          this.fieldDept,
			          this.edtStartUser,
			          this.edtMoneyBegin,
			          this.edtMoneyEnd,
			          this.fieldBillType,
			          this.fieldBusiClass,
			          this.fieldFormStatus,
			          this.edtBillAbstract,
			          this.cmbOrder ]
		},
		{
			columnWidth : .5,
			layout : "form",
			defaults :
			{
				width : 130
			},
			items : [ this.edtMoneyBegin ]
		},
		{
			columnWidth : .5,
			layout : "form",
			labelWidth : 20,
			defaults :
			{
				width : 170
			},
			items : [ this.edtMoneyEnd ]
		},
		{
			columnWidth : 1,
			layout : "form",
			defaults :
			{
				width : 340
			},
			items : [ this.fieldBillType,
			          this.fieldBusiClass,
			          this.fieldFormStatus,
			          this.edtBillAbstract,
			          this.cmbOrder ]
		} ];

		ssc.report.FormQuery.ConditionWin.superclass.initComponent.call(this);

		this.xy_AuthLevel = ReportAuthUtil.setUnitDeptField(this.xy_OperatorID, this.xy_OperationCode, this.fieldUnit, this.fieldDept);
	},
	query : function()
	{
		if (! this.fieldUnit.getSelected())
		{
			MsgUtil.alert("请先选择公司");
			return;
		}

		if (this.xy_AuthLevel == 2
				|| this.xy_AuthLevel == 3
				|| this.xy_AuthLevel == 4)
		{
			if (! this.fieldDept.getSelected())
			{
				MsgUtil.alert("请先选择部门");
				return;
			}
		}
		else if (this.xy_AuthLevel == -1)
		{
			MsgUtil.alert("您没有本查询的权限，请联系管理员增加");
			return;
		}

		var param = new ssc.common.BaseCondition();
		param.addString("formcode", this.edtFormCode.getValue().trim());

		if (this.chbStartDate.checked)
		{
			var strStartDateBegin = this.dtFieldStartDateBegin.getValue().format("Y-m-d");
			var strStartDateEnd = this.dtFieldStartDateEnd.getValue().format("Y-m-d");
			if (strStartDateBegin > strStartDateEnd)
			{
				MsgUtil.alert("发起日期应不大于结束日期");
				return;
			}

			param.addString("startdate_begin", strStartDateBegin);
			param.addString("startdate_end", strStartDateEnd);
		}

		if (this.chbBusiDate.checked)
		{
			var strBusiDateBegin = this.dtFieldBusiDateBegin.getValue().format("Y-m-d");
			var strBusiDateEnd = this.dtFieldBusiDateEnd.getValue().format("Y-m-d");
			if (strBusiDateBegin > strBusiDateEnd)
			{
				MsgUtil.alert("业务日期应不大于结束日期");
				return;
			}

			param.addString("busidate_begin", strBusiDateBegin);
			param.addString("busidate_end", strBusiDateEnd);
		}

		if (this.chbAccDate.checked)
		{
			var strAccDateBegin = this.dtFieldAccDateBegin.getValue().format("Y-m-d");
			var strAccDateEnd = this.dtFieldAccDateEnd.getValue().format("Y-m-d");
			if (strAccDateBegin > strAccDateEnd)
			{
				MsgUtil.alert("记账日期应不大于结束日期");
				return;
			}
			
			param.addString("accdate_begin", strAccDateBegin);
			param.addString("accdate_end", strAccDateEnd);
		}

		param.addString("startuser", this.edtStartUser.getValue().trim());
		param.addString("unitid", this.fieldUnit.getSelectedID());
		param.addString("deptname", this.fieldDept.getSelectedID());
		param.addNumber("moneybegin", this.edtMoneyBegin.getValue());
		param.addNumber("moneyend", this.edtMoneyEnd.getValue());
		param.addString("billtype", this.fieldBillType.getSelectedID());
		param.addString("busiclass", this.fieldBusiClass.getSelectedID());
		param.addString("formtype", this.fieldFormStatus.getSelectedID());
		param.addString("billabstract", this.edtBillAbstract.getValue().trim());

		param.addString("operationcode", this.xy_OperationCode);
		param.addString("operatorid", this.xy_OperatorID);

		param.addString("order", this.cmbOrder.getKeyValue());

		this.xy_MainPanel.count.call(this.xy_MainPanel,
		{
			jsonCondition : Ext.encode(param)
		}, "SSC/ssc_shcs_FormQueryAction!count.action", function()
		{
			this.xy_MainPanel.QueryEvent.call(this.xy_MainPanel,
			{
				jasper : "formquery.jasper",
				subdir : "SSC/core/report/formquery/",
				subreportjasper : "SSC/core/report/formquery/formquery_sub.jasper",
				title : "表单查询",
				fileName : "formquery",
				basePath : Ext.get("basePath").dom.value,
				jsonCondition : Ext.encode(param)
			}, "SSC/ssc_shcs_FormQueryAction$report.action");
		}, this);
	}
});

function init()
{
	var pnlMain = new ssc.component.ReportMainPanel(
	{
		xy_QueryPanel : ssc.report.FormQuery.ConditionWin,
		xy_QueryWindowWidth : 500,
		xy_QueryWindowHeight : 430,
		xy_Limit : 500,
		xy_MaxLimit : 30000,
		abovelimitconfirm : false
	});

	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ pnlMain ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);