Ext.namespace("ssc.taskpool.basedata.Tache");

ssc.taskpool.basedata.Tache.TacheList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_TacheEditWin : null,
	initComponent : function()
	{
		this.tbar = [
		{
			text : "新增任务池",
			iconCls : "xy-add",
			handler : this.btn_AddTacheEvent,
			scope : this
		}, "-",
		{
			text : "修改任务池",
			iconCls : "xy-edit",
			handler : this.btn_UpdateTacheEvent,
			scope : this
		}, "-",
		{
			text : "删除任务池",
			iconCls : "xy-delete",
			handler : this.btn_DeleteTacheEvent,
			scope : this
		} ];
		     		
		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_TacheAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "tacheID", "tacheCode", "tacheName", "remark", "tacheType" ]
		});
		this.store.on("loadexception", showExtLoadException);

		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(),
		{
			header : "任务池编码",
			dataIndex : "tacheCode",
			width : 200,
			sortable : true
		},
		{
			header : "任务池名称",
			dataIndex : "tacheName",
			width : 180,
			sortable : true
		},
		{
			header : "备注",
			dataIndex : "remark",
			width : 100,
			sortable : true
		},
		{
			header : "业务类型",
			dataIndex : "tacheType",
			width : 80,
			sortable : true,
			renderer : function(value)
			{
				return ssc.common.RenderUtil.MapRender(value, RenderMapData.SSC.TacheType);
			}
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);
		this.on("dblclick", this.btn_UpdateTacheEvent, this);

		ssc.taskpool.basedata.Tache.TacheList.superclass.initComponent.call(this);
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
	},
	btn_AddTacheEvent : function()
	{
		this.m_TacheEditWin = new ssc.taskpool.basedata.Tache.TacheEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_TacheEditWin.show();
	},
	btn_UpdateTacheEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择需要修改的任务池！");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		this.m_TacheEditWin = new ssc.taskpool.basedata.Tache.TacheEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_TacheEditWin.show();
	},
	btn_DeleteTacheEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择需要删除的任务池");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		MsgUtil.confirm("是否删除所选任务池[" + entity.tacheName + "]?", function(btn, text)
		{
			if (btn == "yes")
			{
				this.deleteTache(entity);
			}
		}, this);
	},
	deleteTache : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "SSC/ssc_TacheAction!del.action",
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
					this.loadStoreData();
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

ssc.taskpool.basedata.Tache.TacheTeamList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_TacheList : null,
	m_TeamDialog : null,
	initComponent : function()
	{
		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_TeamAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "tacheID", "tacheCode", "tacheName", "teamID",
					"teamCode", "teamName" ]
		});
		this.store.on("loadexception", showExtLoadException);

		this.tbar = [
		{
			text : "设置任务组",
			iconCls : "xy-add",
			handler : this.btn_AddTacheTeamEvent,
			scope : this
		}, "-",
		{
			text : "取消任务组",
			iconCls : "xy-delete",
			handler : this.btn_DeleteTacheTeamEvent,
			scope : this
		},
		{
			text : "向上一位",
			iconCls : "xy-upbloc",
			handler : this.btn_UpTacheTeamEvent,
			hidden : true,
			scope : this
		},
		{
			text : "向下一位",
			iconCls : "xy-upbloc",
			handler : this.btn_DownTacheTeamEvent,
			hidden : true,
			scope : this
		} ];

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});
		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(), this.sm,
		{
			header : "任务组编码",
			dataIndex : "teamCode",
			width : 150,
			sortable : true
		},
		{
			header : "任务组名称",
			dataIndex : "teamName",
			width : 200,
			sortable : true
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		ssc.taskpool.basedata.Tache.TacheTeamList.superclass.initComponent.call(this);
	},
	loadStoreData : function()
	{
		var record = this.m_TacheList.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}
		var strTacheID = record.get("tacheID");
		var param =
		{
			tacheid : strTacheID
		};
		
		this.store.baseParams.jsonCondition = Ext.encode(param);
		this.store.load(
		{
			params :
			{
				start : this.getBottomToolbar().cursor,
				limit : this.getBottomToolbar().pageSize
			}
		});
	},
	btn_AddTacheTeamEvent : function()
	{
		var record = this.m_TacheList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择一个任务池!");
			return;
		}
		var strTacheID = record.get("tacheID");

		this.m_TeamDialog = new ssc.component.TaskPoolTeamListDialog(
		{
			xy_DataActionURL : "SSC/ssc_TeamAction!getListUnSetTache.action",
			xy_PageMode : true,
			xy_MultiSelectMode : true,
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					tacheid : strTacheID
				};
				
				return param;
			},
			xy_OKClickEvent : this.addTacheTeam
		});
		
		this.m_TeamDialog.show();
	},
	addTacheTeam : function()
	{
		var record = this.m_TacheList.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}
		var strTacheID = record.get("tacheID");
		var strTeamID = this.m_TeamDialog.getSelectedID();

		var param =
		{
			tacheID : strTacheID,
			teamID : strTeamID
		};

		Ext.Ajax.request(
		{
			url : "SSC/ssc_TacheTeamAction!add.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(param)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.loadStoreData();
				}
				else
				{
					MsgUtil.alert("提示", data.msg, function()
					{
						this.loadStoreData();
					}, this);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	btn_DeleteTacheTeamEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请选择需要取消设置的任务组");
			return;
		}

		MsgUtil.confirm("请确认是否取消设置所选的任务组?", function(btn, text)
		{
			if (btn == "no")
			{
				return;
			}
			else if (btn == "yes")
			{
				this.deleteTacheTeam(records);
			}
		}, this);
	},
	deleteTacheTeam : function(teams)
	{
		var record = this.m_TacheList.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}
		var strTacheID = record.get("tacheID");

		var teamIDArray = [];
		for ( var i = 0; i < teams.length; i++)
		{
			teamIDArray.push(teams[i].get("teamID"));
		}

		var param =
		{
			tacheID : strTacheID,
			teamID : teamIDArray.toString()
		};
		
		Ext.Ajax.request(
		{
			url : "SSC/ssc_TacheTeamAction!del.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(param)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.loadStoreData();
				}
				else
				{
					Ext.Msg.alert("提示", data.msg, function()
					{
						this.loadStoreData();
					}, this);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	btn_UpTacheTeamEvent : function()
	{
		return;
	},
	btn_DownTacheTeamEvent : function()
	{
		return;
	}
});

ssc.taskpool.basedata.Tache.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "border",
	initComponent : function()
	{
		this.m_TacheList = new ssc.taskpool.basedata.Tache.TacheList({});

		this.m_TacheTacheList = new ssc.taskpool.basedata.Tache.TacheTeamList(
		{
			m_TacheList : this.m_TacheList
		});
		this.m_TacheList.on("rowclick", this.m_TacheTacheList.loadStoreData, this.m_TacheTacheList);
		
		this.items = [
		{
			region : "west",
			layout : "fit",
			width : 400,
			split : true,
			items : this.m_TacheList
		},
		{
			region : "center",
			layout : "fit",
			items : this.m_TacheTacheList
		} ];

		this.m_TacheList.loadStoreData();

		ssc.taskpool.basedata.Tache.MainPanel.superclass.initComponent.call(this);
	}
});
Ext.reg("ssc_taskpool_basedata_tache_mainpanel", ssc.taskpool.basedata.Tache.MainPanel);

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "ssc_taskpool_basedata_tache_mainpanel",
			xtype : "ssc_taskpool_basedata_tache_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);