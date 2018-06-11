Ext.namespace("ssc.taskpool.basedata.Team");

ssc.taskpool.basedata.Team.TeamList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_TeamEditWin : null,
	initComponent : function()
	{
		this.tbar = [
		{
			text : "新增任务组",
			iconCls : "xy-add",
			handler : this.btn_AddTeamEvent,
			scope : this
		}, "-",
		{
			text : "修改任务组",
			iconCls : "xy-edit",
			handler : this.btn_UpdateTeamEvent,
			scope : this
		}, "-",
		{
			text : "删除任务组",
			iconCls : "xy-delete",
			handler : this.btn_DeleteTeamEvent,
			scope : this
		} ];

		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_TeamAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "teamID", "teamCode", "teamName", "methodID", "methodCode", "methodName" ]
		});
		this.store.on("loadexception", showExtLoadException);

		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(),
		{
			header : "任务组编码",
			dataIndex : "teamCode",
			width : 150,
			sortable : true
		},
		{
			header : "任务组名称",
			dataIndex : "teamName",
			width : 125,
			sortable : true
		} ]);

		this.on("bodyresize", this.onBodyResize);
		this.on("dblclick", this.btn_UpdateTeamEvent, this);

		ssc.taskpool.basedata.Team.TeamList.superclass.initComponent.call(this);
	},
	loadStoreData : function()
	{
		this.store.load( {});
	},
	btn_AddTeamEvent : function()
	{
		this.m_TeamEditWin = new ssc.taskpool.basedata.Team.TeamEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_TeamEditWin.show();
	},
	btn_UpdateTeamEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择需要修改的任务组！");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		this.m_TeamEditWin = new ssc.taskpool.basedata.Team.TeamEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_TeamEditWin.show();
	},
	btn_DeleteTeamEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择需要删除的任务组");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		MsgUtil.confirm("是否删除所选任务组[" + entity.teamName + "]?", function(btn, text)
		{
			if (btn == "yes")
			{
				this.deleteTeam(entity);
			}
		}, this);
	},
	deleteTeam : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "SSC/ssc_TeamAction!del.action",
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

ssc.taskpool.basedata.Team.TeamUserList = Ext.extend(Ext.grid.GridPanel,
{
	id : "abc",
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_TeamList : null,
	m_TeamUserDialog : null,
	initComponent : function()
	{
		this.tbar = [
		{
			text : "分配组员",
			iconCls : "xy-add",
			handler : this.btn_AddTeamUserEvent,
			scope : this
		}, "-",
		{
			text : "取消组员",
			iconCls : "xy-delete1",
			handler : this.btn_DeleteTeamUserEvent,
			scope : this
		}, "-",
		{
			text : "组员设置",
			iconCls : "xy-edit",
			handler : this.btn_UpdateTeamUserEvent,
			scope : this
		} ];

		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_TeamUserAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "teamID", "teamCode", "teamName",
			           "userID", "userCode", "userName",
			           "unitID", "unitCode", "unitName",
			           "deptID", "deptCode", "deptName",
			           "isLeader", "isAgent",
			           "agentUserID", "agentUserCode", "agentUserName",
			           "unitID", "unitCode", "unitName",
			           "deptID", "deptCode", "deptName" ]
		});
		this.store.on("loadexception", showExtLoadException);

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});

		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(), this.sm,
		{
			header : "姓名",
			dataIndex : "userName",
			width : 80,
			sortable : true
		},
		{
			header : "登录名",
			dataIndex : "userCode",
			width : 70,
			sortable : true
		},
		{
			header : "单位",
			dataIndex : "unitName",
			width : 150,
			sortable : true
		},
		{
			header : "部门",
			dataIndex : "deptName",
			width : 120,
			sortable : true
		},
		{
			header : "组长",
			dataIndex : "isLeader",
			width : 50,
			renderer : ssc.common.RenderUtil.YesOrNo_FocusYes,
			sortable : true
		},
		{
			header : "代理类型",
			dataIndex : "isAgent",
			width : 75,
			sortable : true,
			renderer : function(value)
			{
				return ssc.common.RenderUtil.MapRender(value, RenderMapData.SSC.AgentType);
			}
		},
		{
			header : "代理人",
			dataIndex : "agentUserName",
			width : 75,
			sortable : true
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);
		this.on("rowdblclick", this.OnRowDbClickEvent, this);

		ssc.taskpool.basedata.Team.TeamUserList.superclass.initComponent.call(this);
	},
	loadStoreData : function()
	{
		var record = this.m_TeamList.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}
		var strTeamID = record.get("teamID");
		var param =
		{
			teamid : strTeamID
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
	OnRowDbClickEvent : function(/*Grid*/ _This, /*Number*/ rowIndex, /*Ext.EventObject*/ e)
	{
		var entity = _This.store.getAt(rowIndex).data;

		this.updateTeamUser(entity);
	},
	btn_AddTeamUserEvent : function()
	{
		var record = this.m_TeamList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择一个任务组!");
			return;
		}
		var strTeamID = record.get("teamID");
		
		this.m_TeamUserDialog = new sm.component.TPTeamUnSetUserDialog(
		{
			xy_ParentObjHandle : this,
			xy_BaseParams :
			{
				teamid : strTeamID
			},
			xy_OKClickEvent : this.addTeamUser
		});
		
		this.m_TeamUserDialog.show();
	},
	addTeamUser : function()
	{
		var record = this.m_TeamList.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}
		var strTeamID = record.get("teamID");
		var strUserID = this.m_TeamUserDialog.getSelectedID();

		var param =
		{
			teamID : strTeamID,
			userID : strUserID
		};

		Ext.Ajax.request(
		{
			url : "SSC/ssc_TeamUserAction!add.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(param)
			},
			success : function(response)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.loadStoreData();
				}
				else
				{
					MsgUtil.alert(data.msg, function()
					{
						this.loadStoreData();
					}, this);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	btn_DeleteTeamUserEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请选择需要取消设置的组员");
			return;
		}

		MsgUtil.confirm("请确认是否取消设置所选的[" + records.length.toString() + "]位组员?", function(btn, text)
		{
			if (btn == "no")
			{
				return;
			}
			else if (btn == "yes")
			{
				this.deleteTeamUser(records);
			}
		}, this);
	},
	deleteTeamUser : function(users)
	{
		var record = this.m_TeamList.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}
		var strTeamID = record.data.teamID;

		var userIDArray = [];
		for ( var i = 0; i < users.length; i++)
		{
			userIDArray.push(users[i].data.userID);
		}

		var param =
		{
			teamID : strTeamID,
			userID : userIDArray.toString()
		};
		
		Ext.Ajax.request(
		{
			url : "SSC/ssc_TeamUserAction!del.action",
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
	btn_UpdateTeamUserEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请选择设置的组员");
			return;
		}

		if (records.length > 1)
		{
			MsgUtil.alert("只能选择一位组员进行设置！");
			return;
		}
		var entity = records[0].data;

		this.updateTeamUser(entity);
	},
	updateTeamUser : function(entity)
	{
		this.m_UserPropertyWin = new ssc.taskpool.basedata.Team.UserPropertyWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_UserPropertyWin.show();
	}
});

ssc.taskpool.basedata.Team.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "border",
	initComponent : function()
	{
		this.m_TeamList = new ssc.taskpool.basedata.Team.TeamList( {});

		this.m_TeamUserList = new ssc.taskpool.basedata.Team.TeamUserList(
		{
			m_TeamList : this.m_TeamList
		});
		this.m_TeamList.on("rowclick", this.m_TeamUserList.loadStoreData, this.m_TeamUserList);

		this.items = [
		{
			region : "west",
			layout : "fit",
			width : 300,
			split : true,
			items : this.m_TeamList
		},
		{
			region : "center",
			layout : "fit",
			items : this.m_TeamUserList
		} ];

		this.m_TeamList.loadStoreData();

		ssc.taskpool.basedata.Team.MainPanel.superclass.initComponent.call(this);
	}
});
Ext.reg("ssc_taskpool_basedata_team_mainpanel", ssc.taskpool.basedata.Team.MainPanel);

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "ssc_taskpool_basedata_team_mainpanel",
			xtype : "ssc_taskpool_basedata_team_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);