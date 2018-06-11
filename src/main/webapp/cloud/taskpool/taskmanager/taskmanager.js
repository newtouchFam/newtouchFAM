Ext.namespace("ssc.taskpool.TaskManager");

/* 任务主列表 */
ssc.taskpool.TaskManager.TaskList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_TeamMemberDialog : null,
	xy_ParentObjHandle : null,
	initComponent : function()
	{
		this.btnAssign = new Ext.Toolbar.Button(
		{
			text : "任务分配",
			iconCls : "xy-user",
			handler : this.btn_AssignEvent,
			scope : this
		});
		this.btnDrawBack = new Ext.Toolbar.Button(
		{
			text : "任务收回",
			iconCls : "xy-back",
			handler : this.btn_DrawBackEvent,
			scope : this
		});
		this.btnReAssign = new Ext.Toolbar.Button(
		{
			text : "重新分配",
			iconCls : "xy-post",
			handler : this.btn_ReAssignEvent,
			scope : this
		});
		this.btnAssignTeam = new Ext.Toolbar.Button(
		{
			text : "转发其他组",
			iconCls : "xy-go-to-post",
			handler : this.btn_AssignTeamEvent,
			scope : this
		});
		this.btnTaskLog = new Ext.Toolbar.Button(
		{
			text : "调度日志",
			iconCls : "xy-list-items",
			handler : this.btn_TaskLogEvent,
			scope : this
		});
		this.btnViewForm = new Ext.Toolbar.Button(
		{
			text : "查看单据",
			iconCls : "xy-browser",
			handler : this.btn_ViewFormEvent,
			scope : this
		});
		this.btnExport = new Ext.Toolbar.Button(
		{
			text : "导出列表",
			iconCls : "xy-export",
			handler : this.btn_ExportEvent,
			scope : this
		});

		this.tbar = [ this.btnAssign, "-",
		              this.btnDrawBack, "-",
		              this.btnReAssign, "-",
		              this.btnAssignTeam, "-",
		              this.btnTaskLog, "-",
		              this.btnViewForm, "-",
		              this.btnExport ];

		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_TaskManagerAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "taskID",
			           "tacheID", "tacheCode", "tacheName",
			           "unitID", "unitCode", "unitName",
			           "taskCode", "taskAbstract", "money",
			           "processInstID", "processInstName",
			           "processID", "processName",
			           "activityInstID", "activityInstName",
			           "activityID", "workItemID",
			           "isEmergency", "emergentLevel", "creditValue", "status", "workload",
			           "teamID", "teamCode", "teamName",
			           "operatorID", "operatorCode", "operatorName",
			           "assignerID", "assignerCode", "assignerName",
			           "pushDate", "assignDate", "endDate",
			           "taskTypeID", "taskTypeCode", "taskTypeName" ]
		});

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false
		});

		this.columnlist = [ new Ext.grid.RowNumberer(), this.sm,
		{
			header : "任务池",
			dataIndex : "tacheName",
			width : 80,
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "任务组",
			dataIndex : "teamName",
			width : 80,
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "摘要",
			dataIndex : "taskAbstract",
			width : 120,
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "单据编号",
			dataIndex : "taskCode",
			width : 120,
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "所属单位",
			dataIndex : "unitName",
			width : 150,
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "金额",
			dataIndex : "money",
			width : 80,
			renderer : this.moneyRender,
			align : "right",
			sortable : true
		},
		{
			header : "状态",
			dataIndex : "status",
			width : 60,
			renderer : this.statusRender,
			sortable : true
		},
		{
			header : "流程名称",
			dataIndex : "processName",
			width : 120,
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "处理人",
			dataIndex : "operatorName",
			width : 80,
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "进入任务池时间",
			dataIndex : "pushDate",
			width : 110,
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "是否应急",
			dataIndex : "isEmergency",
			width : 50,
			renderer : ssc.common.RenderUtil.YesOrNo_FocusRedYes,
			align : "center",
			sortable : true
		},
		{
			header : "紧急程度",
			dataIndex : "emergentLevel",
			width : 50,
			align : "right",
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "分配时间",
			dataIndex : "assignDate",
			width : 110,
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "分配人",
			dataIndex : "assignerName",
			width : 80,
			renderer : this.stringRender,
			sortable : true
		},
		{
			header : "任务结束时间",
			dataIndex : "endDate",
			width : 110,
			renderer : this.stringRender,
			sortable : true
		} ];

		this.cm = new Ext.grid.ColumnModel(this.columnlist);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store,
			xy_PageSizeList : [ 50, 100, 200, 500 ]
		});
		this.on("bodyresize", this.onBodyResize);
		this.store.xy_PagingToolBar = this.bbar;
		var _This = this;

		ssc.taskpool.TaskManager.TaskList.superclass.initComponent.call(this);
	},
	stringRender : function(value, metaData, record)
	{
		var string = "";
		if (Ext.isEmpty(value))
		{
			string = "";
		}
		else
		{
			string = value;
		}

		if (record.data.isEmergency == "1")
		{
			return "<font color=red>" + string + "</font >";
		}
		else
		{
			return string;
		}
	},
	statusRender : function(value, metaData, record)
	{
		var ret = ssc.common.RenderUtil.MapRender(value, RenderMapData.SSC.TaskStatus);
		if (record.data.isEmergency == "1")
		{
			return "<font color=red>" + ret + "</font >";
		}
		else
		{
			return ret;
		}
	},
	moneyRender : function(value, metaData, record)
	{
		var money = Freesky.BCM.MoneyMng.XyMoneyConvert.cnMoney(value);

		if (record.data.isEmergency == "1")
		{
			return "<font color=red>" + money + "</font >";
		}
		else
		{
			return money;
		}
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

		if (param != null && param != undefined)
		{
			var status = param.status;
			if (status == -1)
			{
				this.getColumnModel().setColumnHeader(16, "任务注销时间");
			}
			else
			{
				this.getColumnModel().setColumnHeader(16, "任务结束时间");
			}

			if (status == 0)
			{
				this.btnAssign.enable();
				this.btnDrawBack.disable();
				this.btnReAssign.disable();
				this.btnAssignTeam.enable();
			}
			else if (status == 1)
			{
				this.btnAssign.disable();
				this.btnDrawBack.enable();
				this.btnReAssign.enable();
				this.btnAssignTeam.disable();
			}
			else if (status == 2)
			{
				this.btnAssign.disable();
				this.btnDrawBack.disable();
				this.btnReAssign.disable();
				this.btnAssignTeam.disable();
			}
			else if (status == -1)
			{
				this.btnAssign.disable();
				this.btnDrawBack.disable();
				this.btnReAssign.disable();
				this.btnAssignTeam.disable();
			}
			else
			{
				this.btnAssign.disable();
				this.btnDrawBack.disable();
				this.btnReAssign.disable();
				this.btnAssignTeam.disable();
			}
		}
	},
	btn_AssignEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请选择最少一条任务记录");
			return;
		}

		var strTeamID = records[0].get("teamID");
		for ( var i = 1; i < records.length; i++)
		{
			var strTeamTeamID = records[i].get("teamID");

			if (strTeamTeamID != strTeamID)
			{
				MsgUtil.alert("不能同时分配属于不同任务组的任务");
				return;
			}
		}

		this.m_TeamMemberDialog = new ssc.component.TPTeamMemberAssignDialog(
		{
			xy_ParentObjHandle : this,
			xy_BaseParams :
			{
				teamid : strTeamID
			},
			xy_OKClickEvent : this.assign
		});
		this.m_TeamMemberDialog.show();
	},
	assign : function()
	{
		var strUserID = this.m_TeamMemberDialog.getSelectedID();

		var array = [];
		var records = this.getSelectionModel().getSelections();
		for ( var i = 0; i < records.length; i++)
		{
			array.push(
			{
				taskID : records[i].data.taskID,
				tacheID : records[i].data.tacheID,
				operatorID : strUserID
			});
		}

		Ext.Ajax.request(
		{
			method : "post",
			url : "SSC/ssc_TaskManagerAction!assign.action",
			params :
			{
				jsonString : Ext.encode(array)
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
					MsgUtil.alert(data.msg);
				}
			},
			failure : function(response)
			{
				var data = Ext.decode(response.responseText);
				MsgUtil.alert(data.msg);
			},
			scope : this
		});
	},
	btn_DrawBackEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请选择最少一条任务记录");
			return;
		}

		MsgUtil.confirm("是否收回所选的[" + records.length.toString() + "]项任务?", function(btn, text)
		{
			if (btn == "yes")
			{
				this.drawbackit(records);
			}
		}, this);
	},
	drawbackit : function(records)
	{
		var array = [];
		for ( var i = 0; i < records.length; i++)
		{
			array.push(
			{
				taskID : records[i].data.taskID,
				tacheID : records[i].data.tacheID
			});
		}

		Ext.Ajax.request(
		{
			method : "post",
			url : "SSC/ssc_TaskManagerAction!drawback.action",
			params :
			{
				jsonString : Ext.encode(array)
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
					MsgUtil.alert(data.msg);
				}
			},
			failure : function(response)
			{
				var data = Ext.decode(response.responseText);
				MsgUtil.alert(data.msg);
			},
			scope : this
		});
	},
	btn_ReAssignEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请选择最少一条任务记录");
			return;
		}

		var strTeamID = records[0].get("teamID");
		for ( var i = 1; i < records.length; i++)
		{
			var strTeamTeamID = records[i].get("teamID");

			if (strTeamTeamID != strTeamID)
			{
				MsgUtil.alert("不能同时分配属于不同任务组的任务");
				return;
			}
		}

		this.m_TeamMemberDialog = new ssc.component.TPTeamMemberAssignDialog(
		{
			xy_ParentObjHandle : this,
			xy_BaseParams :
			{
				teamid : strTeamID
			},
			xy_OKClickEvent : this.reAssign
		});
		this.m_TeamMemberDialog.show();
	},
	reAssign : function()
	{
		var strUserID = this.m_TeamMemberDialog.getSelectedID();
		var array = [];
		var records = this.getSelectionModel().getSelections();
		for ( var i = 0; i < records.length; i++)
		{
			array.push(
			{
				taskID : records[i].data.taskID,
				tacheID : records[i].data.tacheID,
				operatorID : strUserID
			});
		}

		Ext.Ajax.request(
		{
			method : "post",
			url : "SSC/ssc_TaskManagerAction!reAssign.action",
			params :
			{
				jsonString : Ext.encode(array)
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
					MsgUtil.alert(data.msg);
				}
			},
			failure : function(response)
			{
				var data = Ext.decode(response.responseText);
				MsgUtil.alert(data.msg);
			},
			scope : this
		});
	},	
	btn_AssignTeamEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请选择最少一条任务记录");
			return;
		}

		var strTacheID = records[0].data.tacheID;
		var strTeamID = records[0].data.teamID;
		for ( var i = 1; i < records.length; i++)
		{
			var tmpTacheID = records[i].get("tacheID");
			if (tmpTacheID != strTacheID)
			{
				MsgUtil.alert("不能同时分配属于不同任务池的任务");
				return;
			}

			var tmpTeamID = records[i].get("teamID");
			if (tmpTeamID != strTeamID)
			{
				MsgUtil.alert("不能同时分配属于不同任务组的任务");
				return;
			}
		}

		this.m_OtherTeamDialog = new ssc.component.TaskPoolSameTacheOtherTeamListDialog(
		{
			xy_ParentObjHandle : this,
			xy_BaseParams :
			{
				tacheid : strTacheID,
				teamid : strTeamID
			},
			xy_OKClickEvent : this.assignTeam
		});
		this.m_OtherTeamDialog.show();
	},
	assignTeam : function()
	{
		var strTeamID = this.m_OtherTeamDialog.getSelectedID();

		var records = this.getSelectionModel().getSelections();
		var array = [];
		for ( var i = 0; i < records.length; i++)
		{
			array.push(
			{
				taskID : records[i].data.taskID,
				tacheID : records[i].data.tacheID,
				teamID : strTeamID
			});
		}

		Ext.Ajax.request(
		{
			method : "post",
			url : "SSC/ssc_TaskManagerAction!assignTeam.action",
			params :
			{
				jsonString : Ext.encode(array)
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
					MsgUtil.alert(data.msg);
				}
			},
			failure : function(response)
			{
				var data = Ext.decode(response.responseText);
				MsgUtil.alert(data.msg);
			},
			scope : this
		});
	},
	btn_TaskLogEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || 0 == records.length)
		{
			MsgUtil.alert("请选择一条任务记录");
			return;
		}
		if (records.length > 1)
		{
			MsgUtil.alert("只能查看一条任务记录的日志");
			return;
		}

		var entity = records[0].data;

		this.taskLogWin = new ssc.taskpool.TaskManager.TaskLogDialog(
		{
			xy_Entity : entity
		});

		this.taskLogWin.show();
	},
	btn_ViewFormEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || 0 == records.length)
		{
			MsgUtil.alert("请选择一条任务记录");
			return;
		}
		if (records.length > 1)
		{
			MsgUtil.alert("只能查看一条任务记录的单据");
			return;
		}

		var taskID = records[0].get("taskID");
		var tacheID = records[0].get("tacheID");
		var processinstID = records[0].get("processInstID");
		if (processinstID == null || Ext.isEmpty(processinstID))
		{
			MsgUtil.alert("该任务单据来自于外部系统，不能直接打开查看");
			return;
		}

		var basePath = Ext.get("basePath").dom.value;
		var url = basePath + "SSC/ssc_commonTaskFormView.action?taskID=" + taskID + "&tacheID=" + tacheID;
		var param = "menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1";
		window.open(url, "", param);
	},
	btn_ExportEvent : function()
	{
		var url = "SSC/ssc_ExportTaskList.action";

		var param = 
		{
			jsonCondition : Ext.encode(this.xy_ParentObjHandle.getQueryParam())
		};

		ssc.common.PostSubmit(url, param);
	}
});

ssc.taskpool.TaskManager.TeamUserGridPanel = Ext.extend(Ext.grid.GridPanel,
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
			url : "SSC/ssc_TeamUserAction!getTeamMemberList.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "teamid", "userid", "isleader", "isagent", "agentuserid", "varname", "displayname", "agentid",
					"agentdisplayname", "unitid", "unitdescription", "deptid", "deptdescription" ]
		});

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});

		this.cm = new Ext.grid.ColumnModel( [ this.sm,
		{
			header : "登录名",
			dataIndex : "varname",
			width : 75,
			sortable : true
		},
		{
			header : "姓名",
			dataIndex : "displayname",
			width : 100,
			sortable : true
		},
		{
			header : "单位",
			dataIndex : "unitdescription",
			width : 175,
			sortable : true
		},
		{
			header : "部门",
			dataIndex : "deptdescription",
			width : 150,
			sortable : true
		},
		{
			header : "组长",
			dataIndex : "isleader",
			width : 50,
			renderer : yesno,
			sortable : true
		},
		{
			header : "授权类型",
			dataIndex : "isagent",
			width : 75,
			renderer : agent,
			sortable : true
		},
		{
			header : "授权人",
			dataIndex : "agentdisplayname",
			width : 75,
			sortable : true
		} ]);

		ssc.taskpool.TaskManager.TeamUserGridPanel.superclass.initComponent.call(this);
	},
	load : function()
	{

		this.store.baseParams.teamid = this.getTeamid();
		this.store.load();
	}
});

/* 主界面 */
ssc.taskpool.TaskManager.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_TaskList : null,
	initComponent : function()
	{
		this.m_TaskList = new ssc.taskpool.TaskManager.TaskList(
		{
			xy_ParentObjHandle : this
		});
		this.m_TaskList.getStore().on("load", ssc.common.NumberColumnWidthAdjust, this.m_TaskList);

		this.btnQuery = new Ext.Toolbar.Button(
		{
			text : "查询",
			iconCls : "xy-view-select",
			handler : this.query,
			scope : this
		});

		this.cmbTaskStatus = new ssc.component.BaseSimpleComboBox(
		{
			width : 80,
			fieldLabel : "任务状态",
			xy_DataArray : RenderMapData.SSC.TaskStatus,
			xy_AllowClear : false,
			xy_InitDataID : 0,
			xy_hasAll : true,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : this.query
		});

		this.tgfieldTache = new ssc.component.TPTacheListField(
		{
			width : 130,
			emptyText : "不选择表示全部",
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function()
			{
				this.tgfieldTeam.clearSelections();
			}
		});
		this.tgfieldTeam = new ssc.component.TPTeamListField(
		{
			width : 130,
			emptyText : "不选择表示全部",
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function()
			{
				this.tgfieldTeamMember.clearSelections();
			},
			prepareBaseParams : function()
			{
				var param =
				{
					tacheid : this.tgfieldTache.getSelectedID()
				};

				return param;
			}.createDelegate(this)
		});

		this.tgfieldTeamMember = new sm.component.TeamMemberListField(
		{
			width : 130,
			emptyText : "不选择表示全部",
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					tacheid : this.tgfieldTache.getSelectedID(),
					teamid : this.tgfieldTeam.getSelectedID()
				};

				return param;
			}.createDelegate(this)
		});

		this.tgfieldUnit = new sm.component.UnitTreeField(
		{
			width : 130,
			emptyText : "不选择表示全部",
			fieldLabel : "单据单位",
			xy_MultiSelectMode : true
		});

		this.tgfieldBillType = new ssc.component.BillTypeField
		({
			fieldLabel : "单据类型:",
			width : 120
		});

		this.edtFormCode = new Ext.form.TextField(
		{
			fieldLabel : "编码:",
			width : 120
		});
		this.edtFormCode.on("specialKey", function(field, e)
		{
			if (e.getKey() == Ext.EventObject.ENTER)
			{
				this.queryByFormCode();
			}
		}, this);

		this.dtFieldBegin = new Ext.form.DateField(
		{
			fieldLabel : "到达日期从",
			width : 100,
			format : "Y-m-d",
			readOnly : true
		});
		this.dtFieldEnd = new Ext.form.DateField(
		{
			fieldLabel : "到",
			width : 100,
			format : "Y-m-d",
			readOnly : true
		});

		this.moneystart = new Ext.form.NumberField(
		{
			fieldLabel : "金额从",
			width : 100
		});
		this.moneyend = new Ext.form.NumberField(
		{
			fieldLabel : "到",
			width : 100
		});


		this.tbar = [ "任务状态:", this.cmbTaskStatus, "-",
		              "任务池:", this.tgfieldTache, "-",
		              "任务组:", this.tgfieldTeam, "-",
		              "处理人:", this.tgfieldTeamMember, "-",
		              "单据单位：", this.tgfieldUnit, "-",
		              this.btnQuery ]; 

		this.items = [ this.m_TaskList ];

		this.query();
		this.edtFormCode.focus(false, 100);

		ssc.taskpool.TaskManager.MainPanel.superclass.initComponent.call(this);

		this.on("render", function()
		{
			var tbar = new Ext.Toolbar(
			{
				items : [ "单据类型:", this.tgfieldBillType, "-",
				          "单据编号:", this.edtFormCode, "-",
				          "到达日期:从", this.dtFieldBegin, "到", this.dtFieldEnd, "-",
				          "金额:从", this.moneystart, "到", this.moneyend ]
			});
			
			tbar.render(this.tbar);
		});
	},
	queryByFormCode : function()
	{
		var formcode = this.edtFormCode.getValue() ? this.edtFormCode.getValue() : "";
		if (Ext.isEmpty(formcode))
		{
			return;
		}
		this.m_TaskList.loadStoreData(
		{
			formcode : formcode.trim()
		});
	},
	getQueryParam : function()
	{
		if (! this.cmbTaskStatus.getSelected())
		{
			return;
		}

		var formCode = this.edtFormCode.getValue() ? this.edtFormCode.getValue().trim() : "";

		var strBeginDate = this.dtFieldBegin.getValue() != "" ? this.dtFieldBegin.getValue().format("Y-m-d") : "";
		var strEndDate = this.dtFieldEnd.getValue() != "" ? this.dtFieldEnd.getValue().format("Y-m-d") : "";

		var lowmoney = this.moneystart.getValue();
		var topmonty = this.moneyend.getValue();

		if (lowmoney.toString() != "" && topmonty.toString() != "" && lowmoney > topmonty)
		{
			MsgUtil.alert("最小金额[" + lowmoney + "]大于了最大金额[" + topmonty + "]，请重新输入金额条件！");
			return;
		}

		var param =
		{
			status : this.cmbTaskStatus.getKeyValue(),
			statusname : this.cmbTaskStatus.getDisplayValue(),
			tacheid : this.tgfieldTache.getSelectedID(),
			tachename : this.tgfieldTache.getSelectedText(),
			teamid : this.tgfieldTeam.getSelectedID(),
			teamname : this.tgfieldTeam.getSelectedText(),
			operuserid : this.tgfieldTeamMember.getSelectedID(),
			operusername : this.tgfieldTeamMember.getSelectedText(),
			unitid : this.tgfieldUnit.getSelectedID(),
			unitname : this.tgfieldUnit.getSelectedText(),
			billtypecode : this.tgfieldBillType.getSelectedID(),
			billtypename : this.tgfieldBillType.getSelectedText(),
			formcode : formCode,
			beginpushdate : strBeginDate,
			endpushdate : strEndDate,
			lowmoney : lowmoney,
			topmoney : topmonty
		};

		return param;
	},
	query : function()
	{
		var param = this.getQueryParam();

		this.m_TaskList.loadStoreData(param);
	}
});
Ext.reg("ssc_taskmanager_mainpanel", ssc.taskpool.TaskManager.MainPanel);

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "ssc_taskmanager_mainpanel",
			xtype : "ssc_taskmanager_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);