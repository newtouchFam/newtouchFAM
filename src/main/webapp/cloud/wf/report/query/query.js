Ext.namespace("ssc.smcs.bz.workitem.BZQuery");

ssc.smcs.bz.workitem.BZQuery.BZQueryList = Ext.extend(Ext.grid.GridPanel,
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
			url : "SSC/ssc_smcs_BZQueryAction/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "mainid", "processid", "processinstid", "pistartdate", "pistatus",
			           "activityinstid", "activityid", "activityname", "activitydesc", "workitemid",
			           "serialno", "abstract", "affixnum","belongusername",
			           "formtypecode", "formtypename",
			           "busiclasscode", "busiclassname",
			           "unitid", "unitcode", "unitname",
			           "deptid", "deptcode", "deptname",
			           "userid", "usercode", "username",
			           "startuserid", "startusercode", "startusername",
			           "startdate", "busidate,",
			           "amount", "finamount" ]
		});

		var rowNumber = new Ext.grid.RowNumberer();
		var columnModelConfig = [ 
		 new Ext.grid.RowNumberer(
		{
			summaryType : "合计",
			width : 30
		}),
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
			header : "当前处理人",
			dataIndex : "belongusername",
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
			align : "right",
			summaryType : "sum"
		},
		{
			header : "申请时间",
			dataIndex : "pistartdate",
			align : "center",
			width : 140
		},
		{
			header : "表单状态",
			dataIndex : "pistatus",
			width : 140
		}];
		this.cm = new Ext.grid.ColumnModel(columnModelConfig);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		
		this.summary = new Ext.grid.XyGridSummary();
		
		if(this.plugins && this.plugins.length > 0)
		{
			this.plugins[this.plugins.length] = this.summary;
		}
		else
		{
			this.plugins = [this.summary];
		}
		this.on("bodyresize", this.onBodyResize);

		this.store.xy_PagingToolBar = this.bbar;
		this.store.on("load", ssc.common.NumberColumnWidthAdjust, this);

		ssc.smcs.bz.workitem.BZQuery.BZQueryList.superclass.initComponent.call(this);
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

ssc.smcs.bz.workitem.BZQuery.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_BZQueryList : null,
	/* 上次查询条件 */
	m_PreParam : {},
	initComponent : function()
	{
		this.m_BZQueryList = new ssc.smcs.bz.workitem.BZQuery.BZQueryList( {});
		this.m_BZQueryList.on("dblclick", this.btn_QueryEvent, this);

		this.tbar = [
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
		
		this.items = [ this.m_BZQueryList ];

		/* 初次查询默认条件 */
		this.m_PreParam = new ssc.common.BaseCondition();
		this.m_BZQueryList.loadDataStore(this.m_PreParam);

		ssc.smcs.bz.workitem.BZQuery.MainPanel.superclass.initComponent.call(this);

		this.on("render", function()
		{
			/*
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
			*/
			this.fieldDept = new Ext.form.TextField(
			{
				width : 150
			});

			this.cmbFormType = new ssc.smcs.component.BZFormTypeComboBox(
			{
				fieldLabel : "报账单类型",
				width : 150,
				xy_ParentObjHandle : this
			});

			this.edtStartUser = new Ext.form.TextField(
			{
				fieldLabel : "报账人",
				width : 150
			});

			this.dtStartDate_Begin = new Ext.form.DateField(
			{
				fieldLabel : "申请日期 从",
				width : 150,
				value : new Date().getFirstDateOfMonth(),
				format : "Y-m-d"
			});
			
			this.dtStartDate_End = new Ext.form.DateField(
			{
				fieldLabel : "到",
				width : 150,
				value : new Date(),
				format : "Y-m-d"
			});

			this.edtAmount_Begin = new Freesky.Common.XyMoneyField(
			{
				fieldLabel : "报账金额范围",
				width : 150		
			});
			
			this.edtAmount_End = new Freesky.Common.XyMoneyField(
			{
				fieldLabel : "至",
				width : 150
			});
			
			this.cmbPistatus = new ssc.component.BaseSimpleComboBox(
			{
				fieldLabel: "表单状态",
				width : 150,
				xy_DataArray : [ [ 1 , "运行中" ], [4 , "结束" ], [ 5, "终止"] ],
				xy_InitDataID : 0,
				xy_AllowClear:true,
				xy_ParentObjHandle : this
			});

			this.btnQuery = new Ext.Toolbar.Button(
			{
				text : "查询",
				iconCls : "xy-view-select",
				handler : this.queryList,
				scope : this
			});
			/* test test test test test test test test */
			this.btnTest = new Ext.Toolbar.Button(
			{
				text : "查询测试",
				iconCls : "xy-view-select",
				handler : this.btn_Test,
				scope : this
			});
			
			var tbar2 = new Ext.Toolbar( [ "&nbsp;&nbsp;",
			                               "提交开始时间:", this.dtStartDate_Begin,
			                               "&nbsp;&nbsp;",
			                               "提交结束时间:", this.dtStartDate_End,
			                               "&nbsp;&nbsp;",
			                               "表单类型:", this.cmbFormType
			                               ]);

			var tbar3 = new Ext.Toolbar( [ 
			                               "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
			                               "报账人:", this.edtStartUser,
			                               "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
			                               "报账部门:", this.fieldDept,
			                               "&nbsp;&nbsp;",
			                               "表单状态:", this.cmbPistatus
			                               ]);
			var tbar4 = new Ext.Toolbar( [ 
			                               "&nbsp;&nbsp;",
			                               "报账金额范围:", this.edtAmount_Begin,
			                               "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
			                               "至:", this.edtAmount_End,
			                               "&nbsp;&nbsp;",
			                               this.btnQuery,
			                           	/* test test test test test test test test */
			                               this.btnTest ]);

			tbar2.render(this.tbar);
			tbar3.render(this.tbar);
			tbar4.render(this.tbar);
		});
	},
	/* test test test test test test test test */
	btn_Test : function()
	{
		if (! this.dtStartDate_Begin.validate())
		{
			MsgUtil.alert("申请日期(开始)填写格式不正确");
			return;
		}

		if (! this.dtStartDate_Begin.validate())
		{
			MsgUtil.alert("申请日期(结束)填写格式不正确");
			return;
		}
		
		if (StringUtil.hasLimitedChar(this.edtStartUser.getValue()))
		{
			MsgUtil.alert("【报账人】填写内容不能包含字符【" + StringUtil.getFirstLimitedChar(this.edtStartUser.getValue()) + "】");
			return ;
		}
		if (StringUtil.hasLimitedChar(this.fieldDept.getValue()))
		{
			MsgUtil.alert("【报账部门】填写内容不能包含字符【" + StringUtil.getFirstLimitedChar(this.fieldDept.getValue()) + "】");
			return ;
		}

		var param = this.getQueryParam();

		Ext.Ajax.request(
		{
			url : "GetDataTestService",
			method : "post",
			params :
			{
				jsonString : Ext.encode(param),
				start : this.m_BZQueryList.getBottomToolbar().cursor,
				limit : this.m_BZQueryList.getBottomToolbar().pageSize
			},
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.m_BZQueryList.store.loadData(data);
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	queryList : function()
	{
		if (! this.dtStartDate_Begin.validate())
		{
			MsgUtil.alert("申请日期(开始)填写格式不正确");
			return;
		}

		if (! this.dtStartDate_Begin.validate())
		{
			MsgUtil.alert("申请日期(结束)填写格式不正确");
			return;
		}
		
		if (StringUtil.hasLimitedChar(this.edtStartUser.getValue()))
		{
			MsgUtil.alert("【报账人】填写内容不能包含字符【" + StringUtil.getFirstLimitedChar(this.edtStartUser.getValue()) + "】");
			return ;
		}
		if (StringUtil.hasLimitedChar(this.fieldDept.getValue()))
		{
			MsgUtil.alert("【报账部门】填写内容不能包含字符【" + StringUtil.getFirstLimitedChar(this.fieldDept.getValue()) + "】");
			return ;
		}

		this.m_PreParam = this.getQueryParam();

		this.m_BZQueryList.loadDataStore(this.m_PreParam);
	},
	getQueryParam : function()
	{
		var param = new ssc.common.BaseCondition();
		param.addString("deptname",  this.fieldDept.getValue().trim());
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

		param.addNumber("amount_begin", this.edtAmount_Begin.getValue());
		param.addNumber("amount_end", this.edtAmount_End.getValue());
		param.addInteger("pistatus", this.cmbPistatus.getValue());
		
		param.addInteger("start", this.m_BZQueryList.getBottomToolbar().cursor);
		param.addInteger("limit", this.m_BZQueryList.getBottomToolbar().pageSize);
		

		return param;
	},
	conditionSpecialKeyEvent : function(/*Ext.form.Field*/ f, /*Ext.EventObject*/ e)
	{
		if (e.getKey() == e.ENTER)
		{
			this.queryList();
		}
	},
	btn_QueryEvent : function()
	{
		var record = this.m_BZQueryList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		var basPath = Ext.get("basePath").dom.value;

		window.open(basPath+"wf/viewFinishedForm?processInstID=" + escape(record.get("processinstid")));
	},
	btn_ExportEvent : function(type)
	{
		var url = "SSC/ssc_smcs_BZQueryAction!downloadExcel.action";

		var param = this.m_PreParam;
		param.addString("exporttype", type);
		if (type == "thispage")
		{
			param.addInteger("start", this.m_BZQueryList.getBottomToolbar().cursor);
			param.addInteger("limit", this.m_BZQueryList.getBottomToolbar().pageSize);
		}

		var postparam =
		{
			jsonCondition : Ext.encode(param)
		};

		ssc.common.PostSubmit(url, postparam);
	}
});
Ext.reg("ssc_smcs_bz_workitem_bzquery_mainpanel", ssc.smcs.bz.workitem.BZQuery.MainPanel);

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
			id : "ssc_smcs_bz_workitem_bzquery_mainpanel",
			xtype : "ssc_smcs_bz_workitem_bzquery_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);