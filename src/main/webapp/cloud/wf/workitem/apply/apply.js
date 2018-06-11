Ext.namespace("wf.workitem.Apply");

wf.workitem.Apply.ProcessTypeTree = Ext.extend(Ext.tree.TreePanel,
{
	animate : true,
	autoScroll : true,
	border : false,
	enableDD : false,
	rootVisible : true,
	initComponent : function()
	{
		this.root = new Ext.tree.AsyncTreeNode(
		{
			id : "root",
			text : "流程类型"
		});

		this.loader = new Ext.tree.TreeLoader(
		{
			url : "wf/processtype/tree",
		});

		wf.workitem.Apply.ProcessTypeTree.superclass.initComponent.call(this);
	},
	loadStoreData : function()
	{
		this.root.reload();
	}
});

wf.workitem.Apply.ProcessList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	loadMask : true,
	m_ProcessChartWin : null,
	initComponent : function()
	{
		this.store = new Ext.data.JsonStore(
		{
			url : "wf/process/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "processID", "processName", "processDesc" ]
		});

		this.tbar = [
 		{
 			text : "发起流程",
 			iconCls : "xy-add",
 			handler : this.btn_LaunchProcessEvent,
 			scope : this
 		}, "-",
 		{
 			text : "显示流程图",
 			iconCls : "xy_wf_transimg",
 			handler : this.btn_ShowProcessChartEvent,
 			scope : this
 		} ];

		var rowNumber = new Ext.grid.RowNumberer();
		var columnModelConfig = [ rowNumber,
		{
			header : "流程名称",
			dataIndex : "processName",
			width : 180
		},
		{
			header : "流程描述",
			dataIndex : "processDesc",
			width : 250
		} ];

		this.cm = new Ext.grid.ColumnModel(columnModelConfig);
		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		wf.workitem.Apply.ProcessList.superclass.initComponent.call(this);

		this.on("dblclick", this.onProcessLaunchEvent, this);
	},
	loadStoreData : function(param)
	{
		if (param != null && param != undefined)
		{
			this.store.baseParams.jsonCondition = Ext.encode(param);
		}

		this.store.load(
		{
			params :
			{
				start : this.getBottomToolbar().cursor,
				limit : this.getBottomToolbar().pageSize
			}
		});
	},
	btn_LaunchProcessEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择要发起的流程");
			return;
		}

		if (records.length > 1)
		{
			MsgUtil.alert("只能选择一个流程");
			return;
		}

		var process = records[0].data;

		this.launchProcess(process.processID);
	},
	onProcessLaunchEvent : function()
	{
		this.btn_LaunchProcessEvent();
	},
	launchProcess : function(processID)
	{
		var basPath = Ext.get("basePath").dom.value;

		window.open(basPath + "wf/formmgr/newProcess?processID=" + escape(processID), "",
			"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
	},
	btn_ShowProcessChartEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择流程");
			return;
		}

		if (records.length > 1)
		{
			MsgUtil.alert("只能选择一个流程");
			return;
		}

		var process = records[0].data;
		var processID = process.processID;

		var basePath = Ext.getDom("basePath").value;
		var m_ProcessChartWin = new freesky.ssc.wfmgr.processinstMgr.processChartWin(
		{
			basePath : basePath,
			processid : processID
		});

		m_ProcessChartWin.show();
	}
});

wf.workitem.Apply.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "border",
	m_ProcessTypeTree : null,
	m_ProcessList : null,
	initComponent : function()
	{
		this.m_ProcessTypeTree = new wf.workitem.Apply.ProcessTypeTree({});
		this.m_ProcessTypeTree.on("click", this.onProcessTypeTreeClickEvent, this);

		this.m_ProcessList = new wf.workitem.Apply.ProcessList({});

		this.items = [
		{
			region : "west",
			layout : "fit",
			width : 250,
			split : true,
			items : this.m_ProcessTypeTree
		},
		{
			region : "center",
			layout : "fit",
			items : this.m_ProcessList
		} ];

		wf.workitem.Apply.MainPanel.superclass.initComponent.call(this);

		this.m_ProcessTypeTree.loadStoreData();
	},
	onProcessTypeTreeClickEvent : function(node, event)
	{
		var param = 
		{
			processTypeID : node.id
		};

		this.m_ProcessList.loadStoreData(param);
	}
});

/**
 * 初始化
 */
function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ new wf.workitem.Apply.MainPanel({}) ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);