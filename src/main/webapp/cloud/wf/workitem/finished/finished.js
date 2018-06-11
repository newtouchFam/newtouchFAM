Ext.namespace("wf.workitem.Finished");

wf.workitem.Finished.FinishedList = Ext.extend(Ext.grid.GridPanel,
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
			url : "workitem/finished/getpage",
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
			header : "核定金额",
			dataIndex : "finamount",
			width : 100,
			renderer : RenderUtil.RenderMoney_ThirteenFont,
			align : "right",
			hidden:true
		},
		{
			header : "申请时间",
			dataIndex : "pistartdate",
			align : "center",
			width : 140
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
		},
		{
			header : "审批状态",
			dataIndex : "pistatus",
			width : 80
		}
		];
		
		this.cm = new Ext.grid.ColumnModel(columnModelConfig);
		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		wf.workitem.Finished.FinishedList.superclass.initComponent.call(this);
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

wf.workitem.Finished.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	finishedPanel : null,
	screenHigt : "auto",
	initComponent : function()
	{
		this.m_FinishedList = new wf.workitem.Finished.FinishedList( {});
		this.m_FinishedList.on("dblclick", this.btn_ShowFormDetail, this);
		
		this.tbar = [
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
		}, "-",
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
		     		
		this.items = [this.m_FinishedList ];

		this.m_FinishedList.loadDataStore();

		wf.workitem.Finished.MainPanel.superclass.initComponent.call(this);
		
		this.on("render", function()
		{
			/*
			 * this.fieldDept = new sm.component.DeptTreeField( { fieldLabel :
			 * "部门", xy_ParentObjHandle : this, width : 150,
			 * baseBeforeClickValid : function() { if (!
			 * Ext.get("session_unitid").dom.value == null ||
			 * Ext.get("session_unitid").dom.value == "") { MsgUtil.alert("公司ID为空");
			 * return false; } return true; }.createDelegate(this),
			 * prepareBaseParams : function() { var condition = { unitid :
			 * Ext.get("session_unitid").dom.value, status : 1, textfield : "deptName" };
			 * return condition; }.createDelegate(this), xy_ValueChangeEvent :
			 * this.queryList });
			 */

			this.cmbFormType = new ssc.smcs.component.BZFormTypeComboBox(
			{
				fieldLabel : "报账单类型",
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
			this.edtSerialNo.on("specialkey", this.conditionSpecialKeyEvent, this);

			this.edtAbstract = new Ext.form.TextField(
			{
				fieldLabel : "报账事由",
				width : 130
			});
			this.edtAbstract.on("specialkey", this.conditionSpecialKeyEvent, this);

			this.edtAmount_Begin = new Freesky.Common.XyMoneyField(
			{
				fieldLabel : "报账金额 从",
				width : 100		
			});
			this.edtAmount_Begin.on("specialkey", this.conditionSpecialKeyEvent, this);
			
			this.edtAmount_End = new Freesky.Common.XyMoneyField(
			{
				fieldLabel : "到",
				width : 100
			});
			this.edtAmount_End.on("specialkey", this.conditionSpecialKeyEvent, this);*/
			
			this.cmbPistatus = new ssc.component.BaseSimpleComboBox(
			{
				fieldLabel : "表单状态",
				width : 180,
				xy_DataArray : [ [ 1, "运行中" ], [ 4, "结束" ], [ 5, "终止" ] ],
				xy_InitDataID : 0,
				xy_AllowClear : true,
				xy_ParentObjHandle : this
			});

			this.btnQuery = new Ext.Toolbar.Button(
			{
				text : "查询",
				iconCls : "xy-view-select",
				handler : this.queryList,
				scope : this
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

			var tbar3 = new Ext.Toolbar( [ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", "表单类型:", this.cmbFormType,
					"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", "审批状态:", this.cmbPistatus, "&nbsp;&nbsp;",
					this.btnQuery ]);

			tbar2.render(this.tbar);
			tbar3.render(this.tbar);
		});

	},
	queryList : function()
	{
		if (! this.dtStartDate_Begin.validate())
		{
			MsgUtil.alert("申请日期(开始)填写格式不正确");
			return;
		}

		if (! this.dtStartDate_End.validate())
		{
			MsgUtil.alert("申请日期(结束)填写格式不正确");
			return;
		}

		var param = this.getQueryParam();

		this.m_FinishedList.loadDataStore(param);
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

		param.addInteger("pistatus", this.cmbPistatus.getValue());

		return param;
	},
	conditionSpecialKeyEvent : function(/*Ext.form.Field*/ f, /*Ext.EventObject*/ e)
	{
		if (e.getKey() == e.ENTER)
		{
			this.queryList();
		}
	},
	btn_ShowHistory : function()
	{
		var record = this.m_FinishedList.getSelectionModel().getSelected();
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
		var record = this.m_FinishedList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		var strProcessInstID = record.get("processinstid");

		showTransInstImg(strProcessInstID);
	},
	btn_ShowFormDetail : function()
	{
		var record = this.m_FinishedList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}
		var basPath = Ext.get("basePath").dom.value;
		window.open(basPath+"wf/formmgr/viewFinishedForm?processInstID=" + escape(record.get("processinstid")));
	},
	btn_ExportEvent : function(type)
	{
		var url = "SSC/ssc_smcs_BZFinishedAction!downloadExcel.action";

		var param = this.getQueryParam();
		param.addString("exporttype", type);
		if (type == "thispage")
		{
			param.addInteger("start", this.m_FinishedList.getBottomToolbar().cursor);
			param.addInteger("limit", this.m_FinishedList.getBottomToolbar().pageSize);
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
	Ext.getCmp("mainpanel").m_FinishedList.loadDataStore();
}

/**
 * 初始化
 */
function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ new wf.workitem.Finished.MainPanel(
		{
			id : "mainpanel"
		}) ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);