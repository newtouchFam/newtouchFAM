Ext.namespace("bcm.report.SpecSummary");

bcm.report.SpecSummary.ConditionWin = Ext.extend(Ext.FormPanel,
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
				this.fieldSpecact.clearSelections();

				if (GlobalParamUtil.get_SpecactDistribute() == 1)
				{
					this.fieldIndex.clearSelections();
				}
				else if (GlobalParamUtil.get_SpecactDistribute() == 2)
				{
					this.fieldRespn.clearSelections();
				}
				else if (GlobalParamUtil.get_SpecactDistribute() == 3)
				{
					this.fieldRespn.clearSelections();
					this.fieldIndex.clearSelections();
				}

				if (!ssc.cup.report.common.ReportCommon.get_IsPermissions())
				{
					var authoritySubDept = ssc.cup.report.common.ReportCommon.get_AuthoritySubDept();
					var respn_tree = ssc.cup.report.common.ReportCommon.getRespnByDeptAndYear(Ext
							.decode(authoritySubDept.dept).deptid, cmb.getYear());

					var respn =
					{
						respnID : respn_tree.respnid,
						respnCode : respn_tree.respncode,
						respnName : respn_tree.respnname
					};
	
					this.fieldRespn.setValue(respn);
				}
			},
			xy_ClearClickEvent : function(cmb)
			{
				this.fieldSpecact.clearSelections();

				if (GlobalParamUtil.get_SpecactDistribute() == 1)
				{
					this.fieldIndex.clearSelections();
				}
				else if (GlobalParamUtil.get_SpecactDistribute() == 2)
				{
					this.fieldRespn.clearSelections();
				}
				else if (GlobalParamUtil.get_SpecactDistribute() == 3)
				{
					this.fieldRespn.clearSelections();
					this.fieldIndex.clearSelections();
				}
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

		this.fieldUnit = new ssc.component.UnitPermissionListTGField(
		{
			fieldLabel : "公司",
			width : 200,
			xy_PageMode : true,
			xy_MultiSelectMode : true,
			disabled : !ssc.cup.report.common.ReportCommon.get_IsPermissions(),
			operationcode : "BCM0505",
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function(newValue, oldValue, field)
			{
				this.fieldSpecact.clearSelections();

				if (GlobalParamUtil.get_SpecactDistribute() == 2
						|| GlobalParamUtil.get_SpecactDistribute() == 3)
				{
					this.fieldRespn.clearSelections();
				}
			}
		});

		this.fieldSpecact = new ssc.component.SpecactListTGField(
		{
			fieldLabel : "项目",
			width : 200,
			xy_MultiSelectMode : true,
			xy_ParentObjHandle : this,
			baseBeforeClickValid : function()
			{
				if (! this.cmbCase.getSelected())
				{
					MsgUtil.alert("请先选择" + this.cmbCase.fieldLabel);
					return false;
				};
				if (! this.fieldUnit.getSelected())
				{
					MsgUtil.alert("请先选择" + this.fieldUnit.fieldLabel);
					return false;
				};

				return true;
			}.createDelegate(this),
			prepareBaseParams : function()
			{
				var param =
				{
					casecode : this.cmbCase.getKeyValue(),
					unitid : this.fieldUnit.getSelectedID()
				};

				return param;
			}.createDelegate(this)
		});

		this.fieldRespn = new ssc.component.RespnListTGField(
		{
			fieldLabel : "责任中心",
			width : 200,
			xy_PageMode : true,
			xy_MultiSelectMode : true,
			xy_ParentObjHandle : this,
			disabled : !ssc.cup.report.common.ReportCommon.get_IsPermissions(),
			baseBeforeClickValid : function()
			{
				if (! this.cmbCase.getSelected())
				{
					MsgUtil.alert("请先选择" + this.cmbCase.fieldLabel);
					return false;
				};
				if (! this.fieldUnit.getSelected())
				{
					MsgUtil.alert("请先选择" + this.fieldUnit.fieldLabel);
					return false;
				};

				return true;
			}.createDelegate(this),
			prepareBaseParams : function()
			{
				var param =
				{
					casecode : this.cmbCase.getKeyValue(),
					unitid : this.fieldUnit.getSelectedID()
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
			boxLabel : "只统计有发生数的项目",
			labelSeparator : "",
			checked : false,
			hideLabel : true
		});

		this.items = [ this.cmbCase,
		               this.rdgTimeType,
		               this.rdgQueryType,
		               this.fieldUnit,
		               this.fieldSpecact
		               /*2013-07-08 下级预算查询有问题，取消该选项
		               ,{
						   layout : "column",
						   fieldLabel : "查询类别",
						   isFormField : true,
						   items : [ this.chbQueryAttr ]
		               }*/
		               ];

		if (GlobalParamUtil.get_SpecactDistribute() == 1)
		{
			this.items.push(this.fieldIndex);
		}
		else if (GlobalParamUtil.get_SpecactDistribute() == 2)
		{
			this.items.push(this.fieldRespn);
		}
		else if (GlobalParamUtil.get_SpecactDistribute() == 3)
		{
			this.items.push(this.fieldRespn);
			this.items.push(this.fieldIndex);
		}

		bcm.report.SpecSummary.ConditionWin.superclass.initComponent.call(this);

		if (! ssc.cup.report.common.ReportCommon.get_IsPermissions())
		{
			var authoritySubDept = ssc.cup.report.common.ReportCommon.get_AuthoritySubDept();
			var unit =
			{
				unitID : Ext.decode(authoritySubDept.unit).unitid,
				unitCode : Ext.decode(authoritySubDept.unit).unitcode,
				unitName : Ext.decode(authoritySubDept.unit).unitname
			};
			this.fieldUnit.setValue(unit);

			Ext.Ajax.request(
			{
				url : "bcm/case/getcurrentcasecode",
				method : "post",
				sync : true,
				success : function(response, options)
				{
					var data = Ext.decode(response.responseText);

					if (data.success)
					{
						var authoritySubDept = ssc.cup.report.common.ReportCommon.get_AuthoritySubDept();
						var respn_tree = ssc.cup.report.common.ReportCommon.getRespnByDeptAndYear(Ext
								.decode(authoritySubDept.dept).deptid, data.data.substring(4, 8));

						var respn =
						{
							respnID : respn_tree.respnid,
							respnCode : respn_tree.respncode,
							respnName : respn_tree.respnname
						};

						this.fieldRespn.setValue(respn);

						return;
					}
					else
					{
						return;
					}
				},
				failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
				scope : this
			});
		}
	},
	query : function()
	{
		if (! this.cmbCase.getSelected())
		{
			MsgUtil.alert("请先选择" + this.cmbCase.fieldLabel);
			return;
		}

		if (! this.fieldUnit.getSelected())
		{
			MsgUtil.alert("请先选择" + this.fieldUnit.fieldLabel);
			return false;
		};

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
		param.addInteger("timetype", this.rdgTimeType.getValue().trueValue);
		param.addInteger("querytype", this.rdgQueryType.getValue().trueValue);
		param.addString("unitidlist", this.fieldUnit.getSelectedID());
		param.addString("specidlist", this.fieldSpecact.getSelectedID());
		param.addInteger("queryattr", (this.chbQueryAttr.checked ? 0 : 1));
		param.addInteger("budgetyear", this.cmbCase.getYear());
		if (GlobalParamUtil.get_SpecactDistribute() == 0)
		{
			param.addString("respnidlist", "");
			param.addString("indexidlist", "");
		}
		else if (GlobalParamUtil.get_SpecactDistribute() == 1)
		{
			param.addString("respnidlist", "");
			param.addString("indexidlist", this.fieldIndex.getSelectedID());
		}
		else if (GlobalParamUtil.get_SpecactDistribute() == 2)
		{
			param.addString("respnidlist", this.fieldRespn.getSelectedID());
			param.addString("indexidlist", "");
		}
		else if (GlobalParamUtil.get_SpecactDistribute() == 3)
		{
			param.addString("respnidlist", this.fieldRespn.getSelectedID());
			param.addString("indexidlist", this.fieldIndex.getSelectedID());
		}

		var strTitle = "";
		var strSubJasper = "";
		if (this.rdgTimeType.getValue().trueValue == 0)
		{
			strTitle = "项目预算综合查询报表（全年）";
/*2013-01-29 改在action层处理
			strSubJasper = "BCM/core/report/specsummary/specsummary_sub_year.jasper";
*/
		}
		else if (this.rdgTimeType.getValue().trueValue == 1)
		{
			strTitle = "项目预算综合查询报表（月份）";
/*2013-01-29 改在action层处理
			strSubJasper = "BCM/core/report/specsummary/specsummary_sub_month.jasper";
*/
		}
		else if (this.rdgTimeType.getValue().trueValue == 2)
		{
			strTitle = "项目预算综合查询报表（季度）";
/*2013-01-29 改在action层处理
			strSubJasper = "BCM/core/report/specsummary/specsummary_sub_quarter.jasper";
*/
		}
		else if (this.rdgTimeType.getValue().trueValue == 3)
		{
			strTitle = "项目预算综合查询报表（半年）";
/*2013-01-29 改在action层处理
			strSubJasper = "BCM/core/report/specsummary/specsummary_sub_halfyear.jasper";
*/
		}

		this.xy_MainPanel.QueryEvent.call(this.xy_MainPanel,
		{
			jasper : "specsummary.jasper",
			subdir : "BCM/core/report/specsummary/",
			subreportjasper : strSubJasper,
			exvtreporturl : "BCM/core/report/specsummary/specsummary_exvt.jsp",
			title : strTitle,
			fileName : "specsummary",
			basePath : Ext.get("basePath").dom.value,
			jsonCondition : Ext.encode(param)
		}, "SSC/bcm_SpecSummaryAction$report.action");
	}
});

function init()
{
	var pnlMain = new ssc.component.ReportMainPanel(
	{
		xy_QueryPanel : bcm.report.SpecSummary.ConditionWin,
		xy_QueryWindowWidth : 360,
		xy_QueryWindowHeight : 300
	});
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ pnlMain ]
	});
}
Ext.onReady(init);