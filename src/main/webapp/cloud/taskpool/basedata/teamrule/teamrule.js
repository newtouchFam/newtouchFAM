Ext.namespace("ssc.taskpool.basedata.TeamRule");

ssc.taskpool.basedata.TeamRule.TeamList = Ext.extend(Ext.grid.GridPanel,
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
			url : "SSC/ssc_TeamAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "teamID", "teamCode", "teamName",
			           "methodID", "methodCode", "methodName" ]
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
				
		ssc.taskpool.basedata.TeamRule.TeamList.superclass.initComponent.call(this);
	},
	loadStoreData : function()
	{
		this.store.load( {});
	}
});

ssc.taskpool.basedata.TeamRule.RuleList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_TeamList : null,
	m_RuleEditWin : null,
	initComponent : function()
	{
		this.tbar = [
		{
			text : "新增规则",
			iconCls : "xy-add",
			handler : this.btn_AddRuleEvent,
			scope : this
		}, "-",
		{
			text : "修改规则",
			iconCls : "xy-edit",
			handler : this.btn_EditRuleEvent,
			scope : this
		}, "-",
		{
			text : "删除规则",
			iconCls : "xy-delete",
			handler : this.btn_DeleteRuleEvent,
			scope : this
		}, "-",
		{
			text : "设置规则数据",
			iconCls : "xy-opions",
			handler : this.btn_SetRuleEvent,
			scope : this
		} ];

		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_RuleAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "ruleID", "ruleCode", "ruleName",
			           "teamID", "teamCode", "teamName",
			           "remark", "ruleType", "className" ]
		});
		this.store.on("loadexception", showExtLoadException);

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});

		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(), this.sm,
		{
			header : "规则编码",
			dataIndex : "ruleCode",
			width : 150,
			sortable : true
		},
		{
			header : "规则名称",
			dataIndex : "ruleName",
			width : 150,
			sortable : true
		},
		{
			header : "备注",
			dataIndex : "remark",
			width : 200,
			sortable : true
		},
		{
			header : "类型",
			dataIndex : "ruleType",
			width : 100,
			sortable : true,
			renderer : function(value)
			{
				return ssc.common.RenderUtil.MapRender(value, RenderMapData.SSC.RuleType);
			}
		},
		{
			header : "接口",
			dataIndex : "className",
			width : 100,
			sortable : true
		} ]);
		this.on("bodyresize", this.onBodyResize);
		this.on("rowdblclick", this.OnRowDbClickEvent, this);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});

		ssc.taskpool.basedata.TeamRule.RuleList.superclass.initComponent.call(this);
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

		this.openRuleSetDialog(entity);
	},
	btn_AddRuleEvent : function()
	{
		var record = this.m_TeamList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择已有的任务组!");
			return;
		}
		var strTeamID = record.get("teamID");

		var entity =
		{
			teamID : strTeamID
		};

		this.m_RuleEditWin = new ssc.taskpool.basedata.TeamRule.RuleEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.afterAddRule,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_RuleEditWin.show();
	},
	afterAddRule : function()
	{
		this.loadStoreData();

		var msg = "新建的规则需要配置规则数据后才生效。<br>点击“是”马上开始配置，点击“否”暂不配置。";

		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "no")
			{
				return;
			}
			else if (btn == "yes")
			{
				ruleEntity = this.m_RuleEditWin.xy_Entity;
				this.openRuleSetDialog(ruleEntity);
			}
		}, this);	
	},
	btn_EditRuleEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择已有的任务组规则");
			return;
		}

		if (records.length > 1)
		{
			MsgUtil.alert("只能选择一条任务组规则进行修改！");
			return;
		}
		var entity = records[0].data;
		
		this.m_RuleEditWin = new ssc.taskpool.basedata.TeamRule.RuleEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_RuleEditWin.show();
	},
	btn_DeleteRuleEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择已有的任务组规则");
			return;
		}

		MsgUtil.confirm("请确认是否删除所选的[" + records.length.toString() + "]条任务组规则?", function(btn, text)
		{
			if (btn == "no")
			{
				return;
			}
			else if (btn == "yes")
			{
				this.deleteRule(records);
			}
		}, this);
	},
	deleteRule : function(rules)
	{
		var strTeamID = rules[0].data.teamID;
		var ruleIDArray = [];
		for ( var i = 0; i < rules.length; i++)
		{
			ruleIDArray.push(rules[i].data.ruleID);
		}
		var entity =
		{
			teamID : strTeamID,
			ruleID : ruleIDArray.toString()
		};

		Ext.Ajax.request(
		{
			url : "SSC/ssc_RuleAction!del.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(entity)
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
	btn_SetRuleEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择已有的任务组规则");
			return;
		}

		if (records.length > 1)
		{
			MsgUtil.alert("只能选择一条任务组规则进行设置！");
			return;
		}
		var entity = records[0].data;

		this.openRuleSetDialog(entity);
	},
	openRuleSetDialog : function(entity)
	{
		this.frm_RuleEdit = new ssc.taskpool.basedata.TeamRule.RuleSetupWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_Entity : entity
		});

		this.frm_RuleEdit.show();
	}
});

ssc.taskpool.basedata.TeamRule.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "border",
	initComponent : function()
	{
		this.m_TeamList = new ssc.taskpool.basedata.TeamRule.TeamList( {});

		this.m_RuleList = new ssc.taskpool.basedata.TeamRule.RuleList(
		{
			m_TeamList : this.m_TeamList
		});
		this.m_TeamList.on("rowclick", this.m_RuleList.loadStoreData, this.m_RuleList);

		this.items = [
		{
			region : "west",
			layout : "fit",
			width : 285,
			split : true,
			items : this.m_TeamList
		},
		{
			region : "center",
			layout : "fit",
			items : this.m_RuleList
		} ];

		ssc.taskpool.basedata.TeamRule.MainPanel.superclass.initComponent.call(this);

		this.m_TeamList.loadStoreData();
	}
});
Ext.reg("ssc_taskpool_basedata_teamrule_mainpanel", ssc.taskpool.basedata.TeamRule.MainPanel);

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "ssc_taskpool_basedata_teamrule_mainpanel",
			xtype : "ssc_taskpool_basedata_teamrule_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);