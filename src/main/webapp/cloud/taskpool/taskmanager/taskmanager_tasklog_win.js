Ext.namespace("ssc.taskpool.TaskManager");

/* 调度日志列表 */
ssc.taskpool.TaskManager.TaskLogList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	initComponent : function()
	{
		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_TaskLogAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "logID", "taskID", "tacheID", "tacheCode", "tacheName", "alterType", "alterTypeName",
					"alterDate", "alterUserID", "alterUserName",

					"preStatus", "preStatusName", "preTeamID", "preTeamCode", "preTeamName", "preOperatorID",
					"preOperatorName",

					"afterStatus", "afterStatusName", "afterTeamID", "afterTeamCode", "afterTeamName",
					"afterOperatorID", "afterOperatorName" ]
		});

		this.columnlist = [new Ext.grid.RowNumberer(),
		{
			header : "操作时间",
			dataIndex : "alterDate",
			sortable : true
		},
		{
			header : "操作人",
			dataIndex : "alterUserName",
			sortable : true
		},
		{
			header : "操作类型",
			dataIndex : "alterTypeName",
			sortable : true
		},
		{
			header : "前状态",
			dataIndex : "preStatusName",
			sortable : true
		},
		{
			header : "前用户组",
			dataIndex : "preTeamName",
			sortable : true
		},
		{
			header : "前用户",
			dataIndex : "preOperatorName",
			sortable : true
		},
		{
			header : "后状态",
			dataIndex : "afterStatusName",
			sortable : true
		},
		{
			header : "后用户组",
			dataIndex : "afterTeamName",
			sortable : true
		},
		{
			header : "后用户",
			dataIndex : "afterOperatorName",
			sortable : true
		} ];

		this.cm = new Ext.grid.ColumnModel(this.columnlist);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		ssc.taskpool.TaskManager.TaskLogList.superclass.initComponent.call(this);
	},
	loadStoreData : function(param)
	{
		this.store.baseParams.jsonCondition = Ext.encode(param);
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

/* 调度日志窗体 */
ssc.taskpool.TaskManager.TaskLogDialog = Ext.extend(ssc.component.BaseDialog,
{
	title : "日志",
	width : 600,
	height : 400,
	layout : "fit",
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.Close,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.Add,
	xy_Entity : {},
	m_TaskLogList : null,
	initComponent : function()
	{
		this.initUI();

		this.initData();

		ssc.taskpool.TaskManager.TaskLogDialog.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.m_TaskLogList = new ssc.taskpool.TaskManager.TaskLogList( {});

		this.items = [this.m_TaskLogList ];
	},
	initData : function()
	{
		var param =
		{
			taskID : this.xy_Entity.taskID,
			tacheID : this.xy_Entity.tacheID
		};

		this.m_TaskLogList.loadStoreData(param);
	}
});