Ext.namespace("wf.workitem.Trans");

wf.workitem.Trans.TransList = Ext.extend(Ext.grid.GridPanel,
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
			url : "workitem/trans/getpage",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "mainid", "processid", "processinstid", "pistartdate", "pistatus","processinstname",
			           "activityinstid", "activityid", "activityname", "activitydesc", "workitemid",
			           "serialno", "abstract", "affixnum",
			           "formtypecode", "formtypename",
			           "busiclasscode", "busiclassname",
			           "unitid", "unitcode", "unitname",
			           "deptid", "deptcode", "deptname",
			           "userid", "usercode", "username",
			           "startuserid", "startusercode", "startusername",
			           "startdate", "busidate,",
			           "amount", "finamount" ,"belongusername"]
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
		},
		{
			header : "流程名称",
			dataIndex : "processinstname",
			width : 160
		},
		{
			header : "当前环节",
			dataIndex : "activityname",
			width : 100
		},
		{
			header : "当前处理人",
			dataIndex : "belongusername",
			width : 100
		}];
		
		this.cm = new Ext.grid.ColumnModel(columnModelConfig);
		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		
		this.on("bodyresize", this.onBodyResize);

		wf.workitem.Trans.TransList.superclass.initComponent.call(this);
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
	}
});

wf.workitem.Trans.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	screenHigt : "auto",
	initComponent : function()
	{
		this.m_TransList = new wf.workitem.Trans.TransList( {});
		this.m_TransList.on("dblclick", this.btn_ShowFormDetail, this);
		
		this.tbar = [
		{
			text : "撤回",
			iconCls : "xy_wf_undo",
			handler : this.btn_UnDo,
			scope : this
		},
		"-",
		{
			text : "查看表单",
			iconCls : "xy-details",
			handler : this.btn_ShowFormDetail,
			scope : this
		}, "-",
		{
			text : "审批历史",
			iconCls : "xy-wf-history",
			handler : this.btn_ShowHistory,
			scope : this
		},
		"-",
		{
			text : "流程图",
			iconCls : "xy_wf_transimg",
			handler : this.btn_ShowTransImg,
			scope : this
		}, "-",
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

		this.items = [ this.m_TransList ];

		this.m_TransList.loadDataStore();

		wf.workitem.Trans.MainPanel.superclass.initComponent.call(this);
		
		this.on("render", function()
		{
			this.cmbFormType = new ssc.smcs.component.BZFormTypeComboBox(
			{
				fieldLabel : "表单类型",
				width : 180,
				xy_ParentObjHandle : this
			});

			this.dtStartDate_Begin = new Ext.form.DateField(
			{
				fieldLabel : "提交开始时间",
				width : 180,
				format : "Y-m-d",
				value : new Date().getFirstDateOfMonth()
			});
			
			this.dtStartDate_End = new Ext.form.DateField(
			{
				fieldLabel : "提交结束时间",
				width : 180,
				format : "Y-m-d",
				value : new Date()
			});

			/*this.edtSerialNo = new Ext.form.TextField(
			{
				fieldLabel : "报账单编号",
				width : 140
			});
			this.edtSerialNo.on("specialkey", this.conditionSpecialKeyEvent, this);*/

		/*	this.edtAbstract = new Ext.form.TextField(
			{
				fieldLabel : "报账事由",
				width : 130
			});
			this.edtAbstract.on("specialkey", this.conditionSpecialKeyEvent, this);*/

		/*	this.edtAmount_Begin = new Freesky.Common.XyMoneyField(
			{
				fieldLabel : "报账金额 从",
				width : 100		
			});
			this.edtAmount_Begin.on("specialkey", this.conditionSpecialKeyEvent, this);*/
			
		/*	this.edtAmount_End = new Freesky.Common.XyMoneyField(
			{
				fieldLabel : "到",
				width : 100
			});
			this.edtAmount_End.on("specialkey", this.conditionSpecialKeyEvent, this);*/
			
			this.btnQuery = new Ext.Toolbar.Button(
			{
				text : "查询",
				iconCls : "xy-view-select",
				handler : this.queryList,
				scope : this
			});

			this.edtText = new Ext.form.TextField(
			{
				width : 600
			});
			
			/*var tbar2 = new Ext.Toolbar( [ "报账部门:", this.fieldDept,
			                               "-",
			                               "报账单类型:", this.cmbFormType,
			                               "-",
			                               "报账人:", this.edtStartUser,
			                               "-",
			                               "申请日期 从:", this.dtStartDate_Begin,
			                               "到", this.dtStartDate_End ]);

			var tbar3 = new Ext.Toolbar( [ "报账单编号:", this.edtSerialNo,
			                               "-",
			                               "报账事由:", this.edtAbstract,
			                               "-",
			                               "报账金额 从:", this.edtAmount_Begin,
			                               "到", this.edtAmount_End,
			                               "-",
			                               this.btnQuery ]);*/
			var tbar2 = new Ext.Toolbar( [ "提交开始时间:", this.dtStartDate_Begin, "&nbsp;&nbsp;", "提交结束时间:",
					this.dtStartDate_End ]);

			var tbar3 = new Ext.Toolbar( [ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", "表单类型:", this.cmbFormType, "&nbsp;&nbsp;",
					this.btnQuery, this.edtText ]);

			tbar2.render(this.tbar);
			tbar3.render(this.tbar);
		});
	},
	queryList : function()
	{
		if (! this.dtStartDate_Begin.validate())
		{
			MsgUtil.alert("上报日期(开始)填写格式不正确");
			return;
		}

		if (! this.dtStartDate_Begin.validate())
		{
			MsgUtil.alert("上报日期(结束)填写格式不正确");
			return;
		}

		var param = this.getQueryParam();
		var param = this.getQueryParam();
		this.m_TransList.loadDataStore(param);
	},
	getQueryParam : function()
	{
		var param = new ssc.common.BaseCondition();
		param.addString("formtypecode", this.cmbFormType.getSelectedID());

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
	btn_UnDo : function()
	{
		var record = this.m_TransList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}
	
		var processInstID = record.get("processinstid");
		var userID = Ext.get("userid").dom.value;
	
		if (processInstID == null || processInstID.length == 0)
		{
			MsgUtil.alert("提示", "流程实例值不存在，请与系统管理员联系。");
			return;
		}

		if (userID == null || userID.length == 0)
		{
			MsgUtil.alert("提示", "用户信息缺失，请重新登陆。");
			return;
		}

		var smLoadMask = new top.Ext.LoadMask(document.body,
		{
			msg : "正在处理，请稍候...",
			removeMask : true
		});

		ActivityRollbackService.undo(userID, processInstID,
			function(response, options)
			{
				if (smLoadMask)
				{
					smLoadMask.hide();
				}

				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					MsgUtil.alert("成功撤回，请到您的待审批报账单中删除或修改提交");

					this.m_TransList.loadDataStore();
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			function(response, options)
			{
				if (smLoadMask)
				{
					smLoadMask.hide();
				}

				MsgUtil.alert("撤回发生错误");
			},
			this);
	},
	btn_ShowFormDetail : function()
	{
		var record = this.m_TransList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		var basPath = Ext.get("basePath").dom.value;

		window.open(basPath+"wf/formmgr/viewInTransForm?workItemID=" + escape(record.get("workitemid")));
	},
	btn_ShowHistory : function()
	{
		var record = this.m_TransList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		var strProcessInstID = record.get("processinstid");

		showCheckHistoryWin(strProcessInstID);
	},
	btn_ShowTransImg : function()
	{
		var record = this.m_TransList.getSelectionModel().getSelected();
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
		var url = "SSC/ssc_smcs_BZTransAction!downloadExcel.action";

		var param = this.getQueryParam();
		param.addString("exporttype", type);
		if (type == "thispage")
		{
			param.addInteger("start", this.m_TransList.getBottomToolbar().cursor);
			param.addInteger("limit", this.m_TransList.getBottomToolbar().pageSize);
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
	Ext.getCmp("mainpanel").m_TransList.loadDataStore();
}

/**
 * 初始化
 */
function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ new wf.workitem.Trans.MainPanel(
		{
			id : "mainpanel"
		}) ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);