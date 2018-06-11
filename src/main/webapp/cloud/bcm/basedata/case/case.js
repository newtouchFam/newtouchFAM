Ext.namespace("bcm.basedata.Case");

bcm.basedata.Case.CaseList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_GlobalPolicyLevel : null,
	initComponent : function()
	{
		this.store = new Ext.data.JsonStore(
		{
			url : "bcm/case/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "caseCode", "caseName", "caseYear", "status", "isCurrent", "remark",
			   		"isCentral_CtrlType", "ctrlType",
					"isCentral_CtrlPeriod", "ctrlPeriod",
					"isCentral_CtrlAttr", "ctrlAttr",
					"isCentral_WarnPercent", "warnPercent",
					"isCentral_ALWPercent", "alwPercent",
					"isCentral_DetailPercent", "detailPercent",
					"isCentral_CtrlType_Act", "ctrlType_Act",
					"isCentral_CtrlPeriod_Act", "ctrlPeriod_Act",
					"isCentral_CtrlAttr_Act", "ctrlAttr_Act" ]
		});
		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : true
		});
		var rowNumber = new Ext.grid.RowNumberer();
		var columnModelConfig = [ rowNumber,
		{
			header : "方案编码",
			dataIndex : "caseCode",
			width : 120,
			sortable : true
		},
		{
			header : "方案名称",
			dataIndex : "caseName",
			width : 150,
			sortable : true
		},
		{
			header : "年份",
			dataIndex : "caseYear",
			width : 50,
			sortable : true
		},
		{
			header : "状态",
			dataIndex : "status",
			width : 50,
			renderer : ssc.common.RenderUtil.EnableStatus_Color,
			sortable : true
		},
		{
			header : "默认",
			dataIndex : "isCurrent",
			width : 50,
			renderer : ssc.common.RenderUtil.YesOrNo_FocusYes,
			sortable : true
		},
		{
			header : "备注",
			dataIndex : "remark",
			width : 100,
			sortable : true
		} ];

		if (this.m_GlobalPolicyLevel == 0)
		{
			columnModelConfig.push(
			{
				header : "统一控制方式",
				dataIndex : "isCentral_CtrlType",
				width : 80,
				renderer : ssc.common.RenderUtil.YesOrNo,
				align : "center",
				sortable : true
			},
			{
				header : "控制方式",
				dataIndex : "ctrlType",
				width : 60,
				renderer : bcm.render.CtrlType,
				align : "center",
				sortable : true
			},
			{
				header : "统一控制周期",
				dataIndex : "isCentral_CtrlPeriod",
				width : 80,
				renderer : ssc.common.RenderUtil.YesOrNo,
				align : "center",
				sortable : true
			},
			{
				header : "控制周期",
				dataIndex : "ctrlPeriod",
				width : 60,
				renderer : bcm.render.CtrlPeriod,
				align : "center",
				sortable : true
			},
			{
				header : "统一控制属性",
				dataIndex : "isCentral_CtrlAttr",
				width : 80,
				renderer : ssc.common.RenderUtil.YesOrNo,
				align : "center",
				sortable : true
			},
			{
				header : "控制属性",
				dataIndex : "ctrlAttr",
				width : 60,
				renderer : bcm.render.CtrlAttr,
				align : "center",
				sortable : true
			},
			{
				header : "统一告警率",
				dataIndex : "isCentral_WarnPercent",
				width : 80,
				renderer : ssc.common.RenderUtil.YesOrNo,
				align : "center",
				sortable : true
			},
			{
				header : "告警率",
				dataIndex : "warnPercent",
				width : 60,
				renderer : ssc.common.RenderUtil.Percent100,
				align : "center",
				sortable : true
			},
			{
				header : "统一容差率",
				dataIndex : "isCentral_ALWPercent",
				width : 80,
				renderer : ssc.common.RenderUtil.YesOrNo,
				align : "center",
				sortable : true
			},
			{
				header : "容差率",
				dataIndex : "alwPercent",
				width : 60,
				renderer : ssc.common.RenderUtil.Percent100,
				align : "center",
				sortable : true
			},
			{
				header : "统一明细率",
				dataIndex : "isCentral_DetailPercent",
				width : 80,
				renderer : ssc.common.RenderUtil.YesOrNo,
				align : "center",
				sortable : true
			},
			{
				header : "明细率",
				dataIndex : "detailPercent",
				width : 60,
				renderer : ssc.common.RenderUtil.Percent100,
				align : "center",
				sortable : true
			},
			{
				header : "统一专项控制方式",
				dataIndex : "isCentral_CtrlType_Act",
				width : 110,
				renderer : ssc.common.RenderUtil.YesOrNo,
				align : "center",
				sortable : true
			},
			{
				header : "专项控制方式",
				dataIndex : "ctrlType_Act",
				width : 80,
				renderer : bcm.render.CtrlType,
				align : "center",
				sortable : true
			},

			{
				header : "统一专项控制周期",
				dataIndex : "isCentral_CtrlPeriod_Act",
				width : 110,
				renderer : ssc.common.RenderUtil.YesOrNo,
				align : "center",
				sortable : true
			},
			{
				header : "专项控制周期",
				dataIndex : "ctrlPeriod_Act",
				width : 80,
				renderer : bcm.render.CtrlPeriod,
				align : "center",
				sortable : true
			},

			{
				header : "统一专项控制属性",
				dataIndex : "isCentral_CtrlAttr_Act",
				width : 110,
				renderer : ssc.common.RenderUtil.YesOrNo,
				align : "center",
				sortable : true
			},
			{
				header : "专项控制属性",
				dataIndex : "ctrlAttr_Act",
				width : 80,
				renderer : bcm.render.CtrlAttr,
				align : "center",
				sortable : true
			});
		}

		this.cm = new Ext.grid.ColumnModel(columnModelConfig);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		bcm.basedata.Case.CaseList.superclass.initComponent.call(this);
	},
	load : function()
	{
		this.store.load(
		{
			params :
			{
				start : this.getBottomToolbar().cursor,
				limit : this.getBottomToolbar().pageSize
			}
		});
	}
});

bcm.basedata.Case.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_CaseList : null,
	m_GlobalPolicyLevel : null,
	m_CaseEditWin : null,
	initComponent : function()
	{
		this.getGlobalPolicyLevel();

		this.m_CaseList = new bcm.basedata.Case.CaseList(
		{
			m_GlobalPolicyLevel : this.m_GlobalPolicyLevel
		});
		this.m_CaseList.on("dblclick", this.btn_UpdateCaseEvent, this);

		this.tbar = [
		{
			text : "新增预算方案",
			iconCls : "xy-add",
			handler : this.btn_AddCaseEvent,
			scope : this
		}, "-",
		{
			text : "修改预算方案",
			iconCls : "xy-edit",
			handler : this.btn_UpdateCaseEvent,
			scope : this
		}, "-",
		{
			text : "删除预算方案",
			iconCls : "xy-delete",
			handler : this.btn_DeleteCaseEvent,
			scope : this
		} ];

		if (this.m_GlobalPolicyLevel == 0)
		{
			this.tbar.push("-",
			{
				text : "调整控制策略属性",
				iconCls : "xy-opions",
				handler : this.btn_UpdatePropertyEvent,
				scope : this
			});
		}

		this.items = [ this.m_CaseList ];

		this.m_CaseList.load();

		bcm.basedata.Case.MainPanel.superclass.initComponent.call(this);
	},
	getGlobalPolicyLevel : function()
	{
		Ext.Ajax.request(
		{
			url : "bcm/globalparam/getglobalpolicylevel",
			method : "post",
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);

				if (data.success)
				{
					this.m_GlobalPolicyLevel = data.data;
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
	btn_AddCaseEvent : function()
	{
		this.m_CaseEditWin = new bcm.basedata.Case.CaseEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.m_CaseList.load.createDelegate(this.m_CaseList),
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_CaseEditWin.show();
	},
	btn_UpdateCaseEvent : function()
	{
		var record = this.m_CaseList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择需要修改的预算方案！");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		this.m_CaseEditWin = new bcm.basedata.Case.CaseEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.m_CaseList.load.createDelegate(this.m_CaseList),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_CaseEditWin.show();
	},
	btn_DeleteCaseEvent : function()
	{
		var record = this.m_CaseList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择需要删除的预算方案！");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		var msg = "要删除的预算方案必须没有任何基础配置数据，<br>";
		msg += "以及没有任何预算数、发生数，<br>";
		msg += "否则该预算方案将无法删除。<br><br>";
		msg += "是否删除所选的预算方案?";
		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "yes")
			{
				this.deleteCase(entity);
			}
		}, this);
	},
	deleteCase : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "bcm/case/delete",
			method : "post",
			params :
			{
				jsonString : Ext.encode(entity)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.m_CaseList.load();
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
	btn_UpdatePropertyEvent : function()
	{
		var record = this.m_CaseList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择需要修改的预算方案！");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		this.m_CasePropertyWin = new bcm.basedata.Case.CasePropertyWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.m_CaseList.load.createDelegate(this.m_CaseList),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_CasePropertyWin.show();
	}
});
Ext.reg("bcm_core_basedata_case_mainpanel", bcm.basedata.Case.MainPanel);

/**
 * 初始化
 */
function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "bcm_core_basedata_case_mainpanel",
			xtype : "bcm_core_basedata_case_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);