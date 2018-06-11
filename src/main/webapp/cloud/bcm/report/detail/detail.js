Ext.namespace("bcm.report.Detail");

bcm.report.Detail.ConditionWin = Ext.extend(Ext.FormPanel,
{
	frame : true,
	labelAlign : "right",
	labelWidth : 100,
	initComponent : function()
	{
		this.cmbCase = new bcm.component.CaseListComboBox(
		{
			fieldLabel : "预算年份",
			width : 200,
			displayField : "caseYear",
			xy_InitLoadData : true,
			xy_InitCurrentCaseCode : true,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function(cmb, oldValue, newValue)
			{
//				if (!ssc.cup.report.common.ReportCommon.get_IsPermissions())
//				{
//					var authoritySubDept = ssc.cup.report.common.ReportCommon.get_AuthoritySubDept();
//					var respn = ssc.cup.report.common.ReportCommon.getRespnByDeptAndYear(Ext
//							.decode(authoritySubDept.dept).deptid, _new.getXyValue().caseYear);
//					this.fieldRespn.setXyValue(respn);
//				}
//				else
//				{
//					this.fieldRespn.clearSelections();
//				}
				this.fieldRespn.clearSelections();
				this.fieldIndex.clearSelections();
			},
			xy_ClearClickEvent : function(cmb)
			{
				this.fieldRespn.clearSelections();
				this.fieldIndex.clearSelections();
			}
		});

		this.cmbBeginMonth = new ssc.component.MonthComboBox(
		{
			fieldLabel : "预算月份从",
			width : 100,
			xy_InitDataID : 1
		});
		var intNowMonth = (new Date()).getMonth() + 1;
		this.cmbEndMonth = new ssc.component.MonthComboBox(
		{
			fieldLabel : "到",
			width : 100,
			xy_InitDataID : intNowMonth
		});

		this.rdgBudgetType = new Ext.form.RadioGroup(
		{
			layout : "column",
			columns : 4,
			vertical : true,
			width : 200,
			fieldLabel : "状态类型",
			items : [
			{
				name : "budgettype",
				boxLabel : "全部",
				trueValue : -1,
				checked : true
			},
			{
				name : "budgettype",
				boxLabel : "在途",
				trueValue : 1,
				checked : false
			},
			{
				name : "budgettype",
				boxLabel : "预占",
				trueValue : 2,
				checked : false
			},
			{
				name : "budgettype",
				boxLabel : "实际",
				trueValue : 3,
				checked : false
			} ]
		});

		this.fieldRespn = new bcm.component.RespnTreeLinkField(
		{
			fieldLabel : "责任中心",
			width : 200,
			xy_LeafOnly : false,
			xy_MultiSelectMode : true,
			xy_ParentObjHandle : this,
//			disabled : !ssc.cup.report.common.ReportCommon.get_IsPermissions(),
			baseBeforeClickValid : function()
			{
				if (! this.cmbCase.getSelected())
				{
					MsgUtil.alert("请先选择" + this.cmbCase.fieldLabel);
					return false;
				};

				if (ssc.common.StringUtil.isEmpty(Ext.get("session_unitid").dom.value))
				{
					MsgUtil.alert("公司参数不确定");
					return false;
				}

				return true;
			}.createDelegate(this),
			prepareBaseParams : function()
			{
				var param =
				{
					casecode : this.cmbCase.getKeyValue(),
					unitid : Ext.get("session_unitid").dom.value,
					textfield : "[,respnCode,],respnName"
				};

				return param;
			}.createDelegate(this)
		});

		this.fieldIndex = new bcm.component.IndexTreeLinkField(
		{
			fieldLabel : "预算科目",
			width : 200,
			xy_LeafOnly : false,
			xy_MultiSelectMode : true,
			xy_ParentObjHandle : this,
			baseBeforeClickValid : function()
			{
				if (! this.cmbCase.getSelected())
				{
					MsgUtil.alert("请先选择" + this.cmbCase.fieldLabel);
					return false;
				};

				return true;
			}.createDelegate(this),
			prepareBaseParams : function()
			{
				var param =
				{
					casecode : this.cmbCase.getKeyValue(),
					textfield : "[,indexCode,],indexName"
				};

				return param;
			}.createDelegate(this)
		});

		this.items = [ this.cmbCase,
		               this.cmbBeginMonth,
		               this.cmbEndMonth,
		               this.rdgBudgetType,
		               this.fieldRespn,
		               this.fieldIndex ];

		bcm.report.Detail.ConditionWin.superclass.initComponent.call(this);

//		if (!ssc.cup.report.common.ReportCommon.get_IsPermissions())
//		{
//			Ext.Ajax.request(
//			{
//				url : "bcm/case/getcurrentcasecode",
//				method : "post",
//				sync : true,
//				success : function(response, options)
//				{
//					var data = Ext.decode(response.responseText);
//
//					if (data.success)
//					{
//						var authoritySubDept = ssc.cup.report.common.ReportCommon.get_AuthoritySubDept();
//						var respn = ssc.cup.report.common.ReportCommon.getRespnByDeptAndYear(Ext
//								.decode(authoritySubDept.dept).deptid, data.data.substring(4, 8));
//						this.fieldRespn.setXyValue(respn);
//						return;
//					}
//					else
//					{
//						return;
//					}
//				},
//				failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
//				scope : this
//			});
//		}
	},
	query : function()
	{
		if (! this.cmbCase.getSelected())
		{
			MsgUtil.alert("请先选择" + this.cmbCase.fieldLabel);
			return;
		}

		if (! this.cmbBeginMonth.getSelected())
		{
			MsgUtil.alert("请先选择" + this.cmbBeginMonth.fieldLabel);
			return;
		}

		if (! this.cmbEndMonth.getSelected())
		{
			MsgUtil.alert("请先选择" + this.cmbEndMonth.fieldLabel);
			return;
		}

		if (this.cmbBeginMonth.getKeyValue() > this.cmbEndMonth.getKeyValue())
		{
			MsgUtil.alert("开始预算月份不应大于结束预算月份");
			return;
		}

		if (! (this.fieldRespn.getSelected() || this.fieldIndex.getSelected()))
		{
			MsgUtil.alert(this.fieldRespn.fieldLabel + "和" + this.fieldIndex.fieldLabel + "至少选择一项作为条件");
			return;
		}

		if (this.fieldRespn.getSelectedCount() > 50)
		{
			MsgUtil.alert("选择了太多" + this.fieldRespn.fieldLabel + "作为条件，会降低统计速度。<br><br>选择时请不要超过50项");
			return;
		}

		if (this.fieldIndex.getSelectedCount() > 50)
		{
			MsgUtil.alert("选择了太多" + this.fieldIndex.fieldLabel + "作为条件，会降低统计速度。<br><br>选择时请不要超过50项");
			return;
		}

		var param = new ssc.common.BaseCondition();
		param.addString("unitid", Ext.get("session_unitid").dom.value);
		param.addString("casecode", this.cmbCase.getKeyValue());
		param.addInteger("beginmonth", this.cmbBeginMonth.getKeyValue());
		param.addInteger("endmonth", this.cmbEndMonth.getKeyValue());
		param.addInteger("budgettype", this.rdgBudgetType.getValue().trueValue);
		param.addString("respnidlist", this.fieldRespn.getSelectedID());
		param.addString("indexidlist", this.fieldIndex.getSelectedID());
		param.addInteger("budgetyear", this.cmbCase.getYear());

//		this.xy_MainPanel.count.call(this.xy_MainPanel,
//		{
//			jsonCondition : Ext.encode(param)
//		}, "bcm/report/detail/count", function()
//		{
//			this.xy_MainPanel.QueryEvent.call(this.xy_MainPanel,
//			{
//				jasper : "detail.jasper",
//				subdir : "bcm/report/detail/",
//				subreportjasper : "bcm/report/detail/detail_sub.jasper",
//				title : "明细费用查询报表",
//				fileName : "detial",
////				format : "html",
//				basePath : Ext.get("basePath").dom.value,
//				jsonCondition : Ext.encode(param)
//			}, "bcm/report/detail/report");
//		}, this);

		this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
		{
			jasper : "bcm/report/detail/detail.jasper",
			title : "明细费用查询报表",
			fileName : "detial",
			jsonCondition : Ext.encode(param)
		},
		"/bcm/report/detail");
	}
});

function init()
{
	var mainReportPanel = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : bcm.report.Detail.ConditionWin,
		xy_QueryWindowWidth : 360,
		xy_QueryWindowHeight : 300,
		xy_Limit : 100,
		xy_MaxLimit : 30000,
		abovelimitconfirm : false
	});

	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ mainReportPanel ]
	});
}
Ext.onReady(init);