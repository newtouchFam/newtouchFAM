Ext.namespace("bcm.report.SpecDetail");

bcm.report.SpecDetail.ConditionWin = Ext.extend(Ext.FormPanel,
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

		this.fieldUnit = new ssc.component.UnitPermissionListTGField(
		{
			fieldLabel : "公司",
			width : 200,
			xy_PageMode : true,
			xy_MultiSelectMode : true,
			disabled : !ssc.cup.report.common.ReportCommon.get_IsPermissions(),
			operationcode : "BCM0506",
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

		this.items = [ this.cmbCase,
		               this.cmbBeginMonth,
		               this.cmbEndMonth,
		               this.rdgBudgetType,
		               this.fieldUnit,
		               this.fieldSpecact ];

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

		bcm.report.SpecDetail.ConditionWin.superclass.initComponent.call(this);

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
		param.addInteger("budgettype", this.rdgBudgetType.getValue().trueValue);
		param.addString("unitidlist", this.fieldUnit.getSelectedID());
		param.addString("specidlist", this.fieldSpecact.getSelectedID());
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

		this.xy_MainPanel.count.call(this.xy_MainPanel,
		{
			jsonCondition : Ext.encode(param)
		}, "SSC/bcm_SpecDetailAction!count.action", function()
		{
			this.xy_MainPanel.QueryEvent.call(this.xy_MainPanel,
			{
				jasper : "specdetail.jasper",
				subdir : "BCM/core/report/specdetail/",
/*2013-01-29 改在action层处理
				subreportjasper : "BCM/core/report/specdetail/specdetail_sub.jasper",
*/
				title : "项目预算明细查询报表",
				fileName : "specdetial",
				basePath : Ext.get("basePath").dom.value,
				jsonCondition : Ext.encode(param)
			}, "SSC/bcm_SpecDetailAction$report.action");
		}, this);
	}
});

function init()
{
	var pnlMain = new ssc.component.ReportMainPanel(
	{
		xy_QueryPanel : bcm.report.SpecDetail.ConditionWin,
		xy_QueryWindowWidth : 360,
		xy_QueryWindowHeight : 300,
		xy_Limit : 100,
		xy_MaxLimit : 30000,
		abovelimitconfirm : false
	});
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ pnlMain ]
	});
}
Ext.onReady(init);