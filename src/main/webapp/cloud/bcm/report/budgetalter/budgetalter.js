Ext.namespace("bcm.report.BudgetAlter");

bcm.report.BudgetAlter.ConditionWin = Ext.extend(Ext.FormPanel,
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
					MsgUtil.alert("单位参数不确定");
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
			fieldLabel : "预算项目",
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

		this.dtEndDate = new Ext.form.DateField(
		{
			fieldLabel : "调整截止日期",
			width : 100,
			format : "Y-m-d",
			value : ssc.common.DateUtil.getNow(),
			readOnly : true
		});

		this.cmbOrderType = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "排序方式",
			xy_DataArray : [ [ "org", "按组织排序" ], [ "date_asc", "按调整时间顺序" ], [ "date_desc", "按调整时间倒序" ] ],
			xy_AllowClear : false,
			xy_InitDataID : "org"
		});

		this.items = [ this.cmbCase,
		               this.cmbBeginMonth,
		               this.cmbEndMonth,
		               this.fieldRespn,
		               this.fieldIndex,
		               this.dtEndDate,
		               this.cmbOrderType ];

		bcm.report.BudgetAlter.ConditionWin.superclass.initComponent.call(this);

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

		if (! (this.fieldRespn.getSelected() || this.fieldIndex.getSelected()))
		{
			MsgUtil.alert(this.fieldRespn.fieldLabel + "和" + this.fieldIndex.fieldLabel + "至少选择一项作为条件");
			return;
		}

		if (this.cmbBeginMonth.getKeyValue() > this.cmbEndMonth.getKeyValue())
		{
			MsgUtil.alert("开始预算月份不应大于结束预算月份");
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
		param.addString("casecode", this.cmbCase.getKeyValue());
		param.addInteger("beginmonth", this.cmbBeginMonth.getKeyValue());
		param.addInteger("endmonth", this.cmbEndMonth.getKeyValue());
		param.addString("respnidlist", this.fieldRespn.getSelectedID());
		param.addString("indexidlist", this.fieldIndex.getSelectedID());
		param.addInteger("budgetyear", this.cmbCase.getYear());
		param.addString("enddate", this.dtEndDate.getValue().format("Y-m-d"));
		param.addString("sorttype", this.cmbOrderType.getKeyValue());

		var strTitle = this.cmbCase.getDisplayValue() + "年部门预算调整表";

/*		this.xy_MainPanel.count.call(this.xy_MainPanel,
		{
			jsonCondition : Ext.encode(param)
		}, "SSC/bcm_BudgetAlterAction!count.action", function()
		{
			this.xy_MainPanel.QueryEvent.call(this.xy_MainPanel,
			{
				jasper : "budgetalter.jasper",
				subdir : "BCM/core/report/budgetalter/",
				subreportjasper : "BCM/core/report/budgetalter/budgetalter_sub.jasper",
				title : strTitle,
				fileName : "budgetalter",
				basePath : Ext.get("basePath").dom.value,
				jsonCondition : Ext.encode(param)
			}, "SSC/bcm_BudgetAlterAction$report.action");
		}, this);*/

		this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
		{
			jasper : "bcm/report/budgetalter/budgetalter.jasper",
			title : strTitle,
			fileName : "budgetalter",
			jsonCondition : Ext.encode(param)
		},
		"/bcm/report/budgetalter");
	}
});

function init()
{
	var mainReportPanel = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : bcm.report.BudgetAlter.ConditionWin,
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