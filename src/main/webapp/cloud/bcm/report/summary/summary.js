Ext.namespace("bcm.report.Summary");

bcm.report.Summary.ConditionWin = Ext.extend(Ext.FormPanel,
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
//				if(! ssc.cup.report.common.ReportCommon.get_IsPermissions())
//				{
//					var authoritySubDept = ssc.cup.report.common.ReportCommon.get_AuthoritySubDept();
//					var respn = ssc.cup.report.common.ReportCommon.getRespnByDeptAndYear(Ext.decode(authoritySubDept.dept).deptid, cmb.getYear());
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

		this.rdgTimeType = new Ext.form.RadioGroup(
		{
			layout : "column",
			columns : 4,
			vertical : true,
			width : 200,
			fieldLabel : "时间类型",
			items : [
			{
				name : "timeType",
				boxLabel : "全年",
				trueValue : 0,
				checked : true
			},
			{
				name : "timeType",
				boxLabel : "月份",
				trueValue : 1,
				checked : false
			},
			{
				name : "timeType",
				boxLabel : "季度",
				trueValue : 2,
				checked : false
			},
			{
				name : "timeType",
				boxLabel : "半年",
				trueValue : 3,
				checked : false
			} ]
		});

		this.rdgQueryType = new Ext.form.RadioGroup(
		{
			layout : "column",
			columns : 2,
			vertical : true,
			width : 200,
			fieldLabel : "查询方式",
			items : [
			{
				name : "queryType",
				boxLabel : "按本期查询",
				trueValue : 0,
				checked : true
			},
			{
				name : "queryType",
				boxLabel : "按累计查询",
				trueValue : 1,
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

		this.chbQueryAttr = new Ext.form.Checkbox(
		{
			fieldLabel : "查询类别",
			boxLabel : "只统计有发生数的科目",
			labelSeparator : "",
			checked : false,
			hideLabel : true
		});

		this.items = [ this.cmbCase,
		               this.rdgTimeType,
		               this.rdgQueryType,
		               this.fieldRespn,
		               this.fieldIndex,
		               {
						   layout : "column",
						   fieldLabel : "查询类别",
						   isFormField : true,
						   items : [ this.chbQueryAttr ]
		               } ];

		bcm.report.Summary.ConditionWin.superclass.initComponent.call(this);

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
		param.addInteger("timetype", this.rdgTimeType.getValue().trueValue);
		param.addInteger("querytype", this.rdgQueryType.getValue().trueValue);
		param.addString("respnidlist", this.fieldRespn.getSelectedID());
		param.addString("indexidlist", this.fieldIndex.getSelectedID());
		param.addInteger("queryattr", (this.chbQueryAttr.checked ? 0 : 1));
		param.addInteger("budgetyear", this.cmbCase.getYear());

		var title = "";
		var subJasper = "";
		if (this.rdgTimeType.getValue().trueValue == 0)
		{
			title = "综合费用查询报表（全年）";
			subJasper = "bcm/report/summary/summary_sub_year.jasper";
		}
		else if (this.rdgTimeType.getValue().trueValue == 1)
		{
			title = "综合费用查询报表（月份）";
			subJasper = "bcm/report/summary/summary_sub_month.jasper";
		}
		else if (this.rdgTimeType.getValue().trueValue == 2)
		{
			title = "综合费用查询报表（季度）";
			subJasper = "bcm/report/summary/summary_sub_quarter.jasper";
		}
		else if (this.rdgTimeType.getValue().trueValue == 3)
		{
			title = "综合费用查询报表（半年）";
			subJasper = "bcm/report/summary/summary_sub_halfyear.jasper";
		}

//		this.xy_MainPanel.QueryEvent.call(this.xy_MainPanel,
//		{
//			jasper : "summary.jasper",
//			subdir : "BCM/core/report/summary/",
//			subreportjasper : strSubJasper,
//			exvtreporturl : "BCM/core/report/summary/summary_exvt.jsp",
//			title : strTitle,
//			fileName : "summary",
//			basePath : Ext.get("basePath").dom.value,
//			jsonCondition : Ext.encode(param)
//		}, "SSC/bcm_SummaryAction$report.action");

		this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
		{
			jasper : "bcm/report/summary/summary.jasper",
			subJasper : subJasper,
			title : title,
			fileName : "summary",
			jsonCondition : Ext.encode(param)
		},
		"/bcm/report/summary");
	}
});

function init()
{
	var mainReportPanel = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : bcm.report.Summary.ConditionWin,
		xy_QueryWindowWidth : 360,
		xy_QueryWindowHeight : 300
	});
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ mainReportPanel ]
	});
}
Ext.onReady(init);