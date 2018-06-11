Ext.namespace("wf.workitem.Approve");

wf.workitem.Approve.ApproveList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	loadMask : true,
	initComponent : function()
	{
		this.store = new Ext.data.JsonStore(
		{
			url : "workitem/approve/getpage",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "mainid", "processid", "processinstid", "pistartdate", "pistatus",
			           "activityinstid", "activityid", "activityname", "activitydesc", "workitemid",
			           "serialno", "abstract", "affixnum",
			           "formtypecode", "formtypename",
			           "busiclasscode", "busiclassname",
			           "unitid", "unitcode", "unitname",
			           "deptid", "deptcode", "deptname",
			           "userid", "usercode", "username",
			           "startuserid", "startusercode", "startusername",
			           "startdate", "busidate,",
			           "amount", "finamount","isreject" ]
		});
		var rowNumber = new Ext.grid.RowNumberer();
		var columnModelConfig = [ rowNumber,
		{
			header : "报账单编号",
			dataIndex : "serialno",
			width : 180
		},
		{
			header : "报账部门",
			dataIndex : "deptname",
			width : 100
		},
		{
			header : "报账单类型",
			dataIndex : "formtypename",
			width : 100
		},
		{
			header : "当前环节",
			dataIndex : "activityname",
			width : 100
		},
		{
			header : "是否驳回",
			dataIndex : "isreject",
			width : 80,
			align : "center",
			renderer : ssc.common.RenderUtil.YesOrNo_RedYes
			
		},
		{
			header : "报账人",
			dataIndex : "startusername",
			width : 100
		},
		{
			header : "报账事由",
			dataIndex : "abstract",
			width : 100
		},
		{
			header : "报账金额",
			dataIndex : "amount",
			width : 100,
			renderer : RenderUtil.RenderMoney_ThirteenFont,
			align : "right"
		},
		{
			header : "申请时间",
			dataIndex : "pistartdate",
			align : "center",
			width : 140
		} ];
		
		this.cm = new Ext.grid.ColumnModel(columnModelConfig);
		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		wf.workitem.Approve.ApproveList.superclass.initComponent.call(this);
	},
	loadDataStore : function(param)
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
	viewConfig : 
	{
        getRowClass :function(record, rowIndex, rowParams, store) 
        {
        	if(record.get("isreject") == 1)
        	{
        		return "red-row";
        	}
        }
	}
});

wf.workitem.Approve.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_ApproveList : null,
	initComponent : function()
	{
		this.m_ApproveList = new wf.workitem.Approve.ApproveList( {});
		this.m_ApproveList.on("dblclick", this.btn_ApproveEvent, this);

		this.tbar = [
		{
			text : "审批",
			iconCls : "xy-wf-approve",
			handler : this.btn_ApproveEvent,
			scope : this
		},
		"-",
		{
			text : "转办",
			iconCls : "xy-wf-transwith",
			handler : this.btn_TransWithEvent,
			scope : this
		},
		"-",
		{
			text : "转拟办",
			iconCls : "xy-wf-transmit",
			handler : this.btn_TransmitEvent,
			scope : this
		},
		"-",
		{
			text : "删除",
			iconCls : "xy-delete1",
			handler : this.btn_DeleteEvent,
			scope : this
		},
		"-",
		{
			text : "审批历史",
			iconCls : "xy-wf-history",
			handler : this.btn_ShowHistoryEvent,
			scope : this
		},
		"-",
		{
			text : "流程图",
			iconCls : "xy_wf_transimg",
			handler : this.btn_ShowTransImgEvent,
			scope : this
		},
		"-",
		{
			text : "导出",
			iconCls : "xy-export",
			scope : this,
			menu :
			{
				items : [
				{
					text : "全部",
					handler : function()
					{
						this.btn_ExportEvent("all");
					},
					scope : this
				},
				{
					text : "当前页",
					handler : function()
					{
						this.btn_ExportEvent("thispage");
					},
					scope : this
				} ]
			}
		} ];
		
		this.items = [ this.m_ApproveList ];

		this.m_ApproveList.loadDataStore();

		wf.workitem.Approve.MainPanel.superclass.initComponent.call(this);

		this.on("render", function()
		{
			this.fieldDept = new sm.component.DeptTreeField(
			{
				fieldLabel : "部门",
				xy_ParentObjHandle : this,
				width : 150,
				baseBeforeClickValid : function()
				{
					if (! Ext.get("session_unitid").dom.value == null || Ext.get("session_unitid").dom.value == "")
					{
						MsgUtil.alert("公司ID为空");
						return false;
					}
					return true;
				}.createDelegate(this),
				prepareBaseParams : function()
				{
					var condition =
					{
						unitid : Ext.get("session_unitid").dom.value,
						status : 1,
						textfield : "deptName"
					};
					return condition;
				}.createDelegate(this)
			});

			this.cmbFormType = new ssc.smcs.component.BZFormTypeComboBox(
			{
				fieldLabel : "报账单类型",
				width : 180,
				xy_ParentObjHandle : this
			});

			this.edtStartUser = new Ext.form.TextField(
			{
				fieldLabel : "报账人",
				width : 180
			});

			this.dtStartDate_Begin = new Ext.form.DateField(
			{
				fieldLabel : "提交开始时间",
				width : 180,
				value : new Date().getFirstDateOfMonth(),
				format : "Y-m-d"
			});
			
			this.dtStartDate_End = new Ext.form.DateField(
			{
				fieldLabel : "提交结束时间",
				width : 180,
				value : new Date(),
				format : "Y-m-d"
			});

			this.edtSerialNo = new Ext.form.TextField(
			{
				fieldLabel : "报账单编号",
				width : 180
			});

			this.edtAbstract = new Ext.form.TextField(
			{
				fieldLabel : "报账事由",
				width : 130
			});

			this.edtAmount_Begin = new Freesky.Common.XyMoneyField(
			{
				fieldLabel : "报账金额 从",
				width : 100
			});

			this.edtAmount_End = new Freesky.Common.XyMoneyField(
			{
				fieldLabel : "到",
				width : 100
			});

			this.btnQuery = new Ext.Toolbar.Button(
			{
				text : "查询",
				iconCls : "xy-view-select",
				handler : this.queryList,
				scope : this
			});

			var tbar2 = new Ext.Toolbar( [ 
			                               "提交开始时间:", this.dtStartDate_Begin,
			                               "&nbsp;&nbsp;",
			                               "提交结束时间:", this.dtStartDate_End ]);

			var tbar3 = new Ext.Toolbar( [ 
			                               "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
			                               "表单类型:", this.cmbFormType,
			                               "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
			                               "报账人:", this.edtStartUser,
			                               "&nbsp;&nbsp;",
			                               this.btnQuery ]);

			tbar2.render(this.tbar);
			tbar3.render(this.tbar);
		});
	},
	queryList : function()
	{
		if (! this.dtStartDate_Begin.validate())
		{
			MsgUtil.alert("【" + this.dtStartDate_Begin.fieldLabel + "】填写格式不正确");
			return;
		}

		if (! this.dtStartDate_End.validate())
		{
			MsgUtil.alert("【" + this.dtStartDate_End.fieldLabel + "】填写格式不正确");
			return;
		}

		if (this.dtStartDate_Begin.getValue() != ""
			&& this.dtStartDate_End.getValue() != "")
		{
			var strDateBegin = this.dtStartDate_Begin.getValue().format("Y-m-d");
			var strDateEnd = this.dtStartDate_End.getValue().format("Y-m-d");
		}
	
		if (strDateBegin > strDateEnd)
		{
			MsgUtil.alert("【" + this.dtStartDate_Begin.fieldLabel + "】不能早于【" + this.dtStartDate_End.fieldLabel + "】");
			return;
		}
		if (StringUtil.hasLimitedChar(this.edtStartUser.getValue()))
		{
			MsgUtil.alert("【报账人】填写内容不能包含字符【" + StringUtil.getFirstLimitedChar(this.edtStartUser.getValue()) + "】");
			return;
		}

		var param = this.getQueryParam();

		this.m_ApproveList.loadDataStore(param);
	},
	getQueryParam : function()
	{
		var param = new ssc.common.BaseCondition();
		param.addString("formtypecode", this.cmbFormType.getSelectedID());
		param.addString("startusername", this.edtStartUser.getValue().trim());

		if (this.dtStartDate_Begin.getValue() != "")
		{
			param.addString("startdate_begin", this.dtStartDate_Begin.getValue().format("Y-m-d"));
		}
		if (this.dtStartDate_End.getValue() != "")
		{
			param.addString("startdate_end", this.dtStartDate_End.getValue().format("Y-m-d"));
		}

		return param;
	},
	conditionSpecialKeyEvent : function(/*Ext.form.Field*/ f, /*Ext.EventObject*/ e)
	{
		if (e.getKey() == e.ENTER)
		{
			this.queryList();
		}
	},
	btn_ApproveEvent : function()
	{
		var record = this.m_ApproveList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		if ("3" == record.get("pistatus"))
		{
			MsgUtil.confirm("该工作项目前处于挂起状态，不能继续审批。<br>是否用只读方式打开?", function(btn)
			{
				if (btn == "yes")
				{
					var strSerialNo = record.get("serialno");
					this.viewForm(strSerialNo);
				}
			}, this);
		}
		else
		{
			var strWorkItemID = record.get("workitemid");
			
			var basPath = Ext.get("basePath").dom.value;

			window.open(basPath + "wf/formmgr/formApproveForm?workItemID=" + escape(strWorkItemID), "",
				"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
		}
	},
	viewForm : function(serialno)
	{
		var basPath = Ext.get("basePath").dom.value;
		window.open(basPath + "SSC/billview.action?idtype=1&billid=" + serialno, "",
			"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
	},
	btn_TransWithEvent : function()
	{
		MsgUtil.alert("尚未移植");
		return;

		var record = this.m_ApproveList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		if ("3" == record.get("pistatus"))
		{
			MsgUtil.confirm("该工作项目前处于挂起状态，不能继续审批。<br>是否用只读方式打开?", function(btn)
			{
				if (btn == "yes")
				{
					var strSerialNo = record.get("serialno");
					this.viewForm(strSerialNo);
				}
			}, this);
		}
		else
		{
			var strUserID = Ext.get("userid").dom.value;

			MsgUtil.confirm("转办后将由您指定的其他人员代替您进行审批处理。<br>确认请选“是”，取消请选“否”。", function(btn, text)
			{
				if (btn == "yes")
				{
					showTransform(strUserID, this.doTransWith.createDelegate(this));
				}
			}, this);
		}
	},
	doTransWith : function(transformId)
	{
		var record = this.m_ApproveList.getSelectionModel().getSelected();
		var strWorkItemID = record.get("workitemid");
		var strFormDataJson = "";
		var strWorkDataJson = "";
		var strHistory = "";

		WorkItemTransformService.transform(strWorkItemID, transformId, strFormDataJson, strWorkDataJson, strHistory,
		{
			callback : this.afterTransWith.createDelegate(this),
			async : false
		});
	},
	afterTransWith : function(result)
	{
		if (result == null || result == "")
		{
			MsgUtil.alert("转办完成");
			this.m_ApproveList.loadDataStore();
		}
		else
		{
			MsgUtil.alert(result);
		}
	},
	btn_TransmitEvent : function()
	{
		MsgUtil.alert("尚未移植");
		return;

		var record = this.m_ApproveList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		if ("3" == record.get("pistatus"))
		{
			MsgUtil.confirm("该工作项目前处于挂起状态，不能继续审批。<br>是否用只读方式打开?", function(btn)
			{
				if (btn == "yes")
				{
					var strSerialNo = record.get("serialno");
					this.viewForm(strSerialNo);
				}
			}, this);
		}
		else
		{
			var strUserID = Ext.get("userid").dom.value;

			MsgUtil.confirm("转拟办将向您指定的人员收集意见，其处理完成后还需要您再次提交。<br>确认请选“是”，取消请选“否”。", function(btn, text)
			{
				if (btn == "yes")
				{
					showTransform(strUserID, this.doTransmit.createDelegate(this));
				}
			}, this);
		}
	},
	doTransmit : function(transformId)
	{
		var record = this.m_ApproveList.getSelectionModel().getSelected();
		var strWorkItemID = record.get("workitemid");
		var strFormDataJson = "";
		var strWorkDataJson = "";
		var strHistory = "";

		WorkItemTransmitService.transmit(strWorkItemID, transformId, strFormDataJson, strWorkDataJson, strHistory,
		{
			callback : this.afterTransmit.createDelegate(this),
			async : false
		});
	},
	afterTransmit : function(result)
	{
		if (result == null || result == "")
		{
			MsgUtil.alert("转拟办完成");
			this.m_ApproveList.loadDataStore();
		}
		else
		{
			MsgUtil.alert(result);
		}
	},
	btn_DeleteEvent : function()
	{
		var record = this.m_ApproveList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		if ("3" == record.get("pistatus"))
		{
			MsgUtil.alert("该工作项目前处于挂起状态，不能删除。");
			return;
		}

		var strUserID = Ext.get("userid").dom.value;
		if (strUserID != record.get("startuserid"))
		{
			MsgUtil.alert("只能删除自己发起的报账单。");
			return;
		}

		MsgUtil.confirm("你确定要删除当前报账单吗?报账单一旦删除无法恢复。<br>选“是”执行删除操作，选“否”取消操作。", function(btn, text)
		{
			if (btn == "yes")
			{
				this.doDelete();
			}
		}, this);
	},
	doDelete : function()
	{
		var record = this.m_ApproveList.getSelectionModel().getSelected();

		var strUserID = Ext.get("userid").dom.value;
		var strProcessInstID = record.get("processinstid");

		var loadMask = new Ext.LoadMask(document.body,
		{
			msg : "正在处理，请稍候...",
			removeMask : true
		});
		loadMask.show();

		try
		{
			WorkItemDeleteService.deleteOwnerProcessinst(strProcessInstID, strUserID,
				function(response, options)
				{
					if (loadMask)
					{
						loadMask.hide();
					}

					var data = Ext.decode(response.responseText);
					if (data.success)
					{
						MsgUtil.alert("删除成功");

						this.m_ApproveList.loadDataStore();
					}
					else
					{
						MsgUtil.alert(data.msg);
					}
				},
				function(response, options)
				{
					if (loadMask)
					{
						loadMask.hide();
					}

					MsgUtil.alert("删除发生错误");
				},
				this);
		}
		finally
		{
			if (loadMask)
			{
				loadMask.hide();
				loadMask = null;
			}
		}
	},
	btn_ShowHistoryEvent : function()
	{
		var record = this.m_ApproveList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		var strProcessInstID = record.get("processinstid");

		showCheckHistoryWin(strProcessInstID);
	},
	btn_ShowTransImgEvent : function()
	{
		var record = this.m_ApproveList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		var strProcessInstID = record.get("processinstid");

		showTransInstImg(strProcessInstID);
	},
	btn_ExportEvent : function(type)
	{
		var url = "SSC/ssc_smcs_BZApproveAction!downloadExcel.action";

		var param = this.getQueryParam();
		param.addString("exporttype", type);
		if (type == "thispage")
		{
			param.addInteger("start", this.m_ApproveList.getBottomToolbar().cursor);
			param.addInteger("limit", this.m_ApproveList.getBottomToolbar().pageSize);
		}

		var postparam =
		{
			jsonCondition : Ext.encode(param)
		};

		ssc.common.PostSubmit(url, postparam);
	}
});

/**
 * 回退完成后回调
 */
function callbackAfterOperation()
{
	Ext.getCmp("mainpanel").m_ApproveList.loadDataStore();
}

/**
 * 初始化
 */
function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ new wf.workitem.Approve.MainPanel(
		{
			id : "mainpanel"
		}) ]
	});
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);