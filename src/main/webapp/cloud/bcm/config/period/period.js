Ext.namespace("bcm.config.Period");

bcm.config.Period.PeriodList = Ext.extend(Ext.grid.EditorGridPanel,
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
			url : "BCM/bcm_PeriodAction/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "caseCode", "caseName",
			   		"year", "month",
					"budgetStatus", "performanceStatus" ]
		});

		var columnModelConfig = [ new Ext.grid.RowNumberer(),
		{
			header : "方案编码",
			dataIndex : "caseCode",
			width : 120,
			sortable : false
		},
		{
			header : "方案名称",
			dataIndex : "caseName",
			width : 150,
			sortable : false
		},
		{
			header : "年份",
			dataIndex : "year",
			width : 50,
			sortable : false,
			align : "center"
		},
		{
			header : "月份",
			dataIndex : "month",
			width : 50,
			sortable : false,
			align : "center"
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("编制状态"),
			dataIndex : "budgetStatus",
			width : 100,
			sortable : false,
			align : "center",
			renderer : ssc.common.RenderUtil.OpenClose_ColorOpen,
			editor : new ssc.component.OpenCloseComboBox()
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("执行状态"),
			dataIndex : "performanceStatus",
			width : 100,
			sortable : false,
			align : "center",
			renderer : ssc.common.RenderUtil.OpenClose_ColorOpen,
			editor : new ssc.component.OpenCloseComboBox()
		} ];

		this.cm = new Ext.grid.ColumnModel(columnModelConfig);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		bcm.config.Period.PeriodList.superclass.initComponent.call(this);
	},
	loadStoreData : function()
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

bcm.config.Period.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_PeriodList : null,
	m_PeriodEditWin : null,
	initComponent : function()
	{
		this.m_PeriodList = new bcm.config.Period.PeriodList( {});

		this.tbar = [
		{
			text : "新增预算账期",
			iconCls : "xy-add",
			handler : this.btn_AddPeriodEvent,
			scope : this
		}, "-",
		{
			text : "全部保存",
			iconCls : "xy-save",
			handler : this.btn_SavePeriodEvent,
			scope : this
		} ];

		this.items = [ this.m_PeriodList ];

		this.m_PeriodList.loadStoreData();

		bcm.config.Period.MainPanel.superclass.initComponent.call(this);
	},
	btn_AddPeriodEvent : function()
	{
		this.m_PeriodEditWin = new bcm.config.Period.PeriodEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.m_PeriodList.loadStoreData.createDelegate(this.m_PeriodList),
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_PeriodEditWin.show();
	},
	btn_SavePeriodEvent : function()
	{
		var records = this.m_PeriodList.getStore().getModifiedRecords();
		if (records.length <= 0)
		{
			return;
		}

		MsgUtil.confirm("是否要保存目前所有的修改？", function(btn, text)
		{
			if (btn == "yes")
			{
				this.savePeriod();
			}
		}, this);
	},
	savePeriod : function()
	{
		var records = this.m_PeriodList.getStore().getModifiedRecords();

		var periodArray = [];
		for ( var i = 0; i < records.length; i++)
		{
			periodArray.push(records[i].data);
		}

		Ext.Ajax.request(
		{
			url : "BCM/bcm_PeriodAction!saveAll.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(periodArray)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.m_PeriodList.loadStoreData();
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
Ext.reg("bcm_core_config_period_mainpanel", bcm.config.Period.MainPanel);

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
			id : "bcm_core_config_period_mainpanel",
			xtype : "bcm_core_config_period_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);