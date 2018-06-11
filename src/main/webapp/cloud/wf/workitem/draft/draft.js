Ext.namespace("wf.workitem.DraftManager");

wf.workitem.DraftManager.DraftList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableHdMenu : false,
	loadMask : true,
	initComponent : function()
	{
		this.store = new Ext.data.JsonStore(
		{
			url : "workitem/draft/getpage",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "mainid", "processid", "processname",
			           "serialno", "abstract", "affixnum",
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
			header : "保存日期",
			dataIndex : "startdate",
			align : "center",
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
			header : "报账事由",
			dataIndex : "abstract",
			width : 200
		},
		{
			header : "流程名称",
			dataIndex : "processname",
			width : 200
		} ];
		
		this.cm = new Ext.grid.ColumnModel(columnModelConfig);
		
		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		wf.workitem.DraftManager.DraftList.superclass.initComponent.call(this);
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

wf.workitem.DraftManager.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_DraftList : null,
	initComponent : function()
	{
		this.m_DraftList = new wf.workitem.DraftManager.DraftList( {});
		this.m_DraftList.on("dblclick", this.btn_OpenEvent, this);

		this.tbar = [
		{
			text : "修改",
			iconCls : "xy-edit",
			handler : this.btn_OpenEvent,
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
		
		this.items = [ this.m_DraftList ];

		this.m_DraftList.loadDataStore();

		wf.workitem.DraftManager.MainPanel.superclass.initComponent.call(this);

		this.on("render", function()
		{/*
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
				}.createDelegate(this),
				xy_ValueChangeEvent : this.queryList
			});

			this.cmbFormType = new ssc.smcs.component.BZFormTypeComboBox(
			{
				fieldLabel : "报账单类型",
				width : 140,
				xy_ParentObjHandle : this,
				xy_ValueChangeEvent : this.queryList
			});

			this.dtSaveDate_Begin = new Ext.form.DateField(
			{
				fieldLabel : "保存日期 从",
				width : 100,
				format : "Y-m-d"
			});
			this.dtSaveDate_Begin.on("change", this.queryList, this);
			this.dtSaveDate_End = new Ext.form.DateField(
			{
				fieldLabel : "到",
				width : 100,
				format : "Y-m-d"
			});
			this.dtSaveDate_End.on("change", this.queryList, this);

			this.edtSerialNo = new Ext.form.TextField(
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
			this.edtAmount_End.on("specialkey", this.conditionSpecialKeyEvent, this);

			this.btnQuery = new Ext.Toolbar.Button(
			{
				text : "过滤",
				iconCls : "xy-view-select",
				handler : this.queryList,
				scope : this
			});

			var tbar2 = new Ext.Toolbar( [ "报账部门:", this.fieldDept,
			                               "-",
			                               "报账单类型:", this.cmbFormType,
			                               "-",
			                               "保存日期 从:", this.dtSaveDate_Begin,
			                               "到", this.dtSaveDate_End ]);

			var tbar3 = new Ext.Toolbar( [ "报账单编号:", this.edtSerialNo,
			                               "-",
			                               "报账事由:", this.edtAbstract,
			                               "-",
			                               "报账金额 从:", this.edtAmount_Begin,
			                               "到", this.edtAmount_End,
			                               "-",
			                               this.btnQuery ]);

			tbar2.render(this.tbar);
			tbar3.render(this.tbar);
		*/});
	},
	queryList : function()
	{
		/*if (! this.dtSaveDate_Begin.validate())
		{
			MsgUtil.alert("【保存日期(开始)】填写格式不正确");
			return;
		}

		if (! this.dtSaveDate_End.validate())
		{
			MsgUtil.alert("【保存日期(结束)】填写格式不正确");
			return;
		}

		if (this.dtSaveDate_Begin.getValue() != ""
				&& this.dtSaveDate_End.getValue() != "")
		{
			var strDateBegin = this.dtSaveDate_Begin.getValue().format("Y-m-d");
			var strDateEnd = this.dtSaveDate_End.getValue().format("Y-m-d");
		}

		if (strDateBegin > strDateEnd)
		{
			MsgUtil.alert("【保存日期(结束)】不能早于【保存日期(开始)】");
			return;
		}*/

		var param = this.getQueryParam();

		this.m_DraftList.loadDataStore(param);
	},
	getQueryParam : function()
	{
		var param = new ssc.common.BaseCondition();
		/*param.addString("deptid", this.fieldDept.getSelectedID());
		param.addString("formtypecode", this.cmbFormType.getSelectedID());

		if (this.dtSaveDate_Begin.getValue() != "")
		{
			param.addString("savedate_begin", this.dtSaveDate_Begin.getValue().format("Y-m-d"));
		}
		if (this.dtSaveDate_End.getValue() != "")
		{
			param.addString("savedate_end", this.dtSaveDate_End.getValue().format("Y-m-d"));
		}

		param.addString("serialno", this.edtSerialNo.getValue().trim());
		param.addString("abstract", this.edtAbstract.getValue().trim());
		param.addNumber("amount_begin", this.edtAmount_Begin.getValue());
		param.addNumber("amount_end", this.edtAmount_End.getValue());*/

		return param;
	},
	conditionSpecialKeyEvent : function(/*Ext.form.Field*/ f, /*Ext.EventObject*/ e)
	{
		if (e.getKey() == e.ENTER)
		{
			this.queryList();
		}
	},
	btn_OpenEvent : function()
	{
		var record = this.m_DraftList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		var basPath = Ext.get("basePath").dom.value;
		var strMainID = record.get("mainid");
		var strProcessID = record.get("processid");
		
		window.open(basPath + "wf/formmgr/openDraftForm?entityID=" + strMainID + "&processID=" + strProcessID, "", 
						"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1,locationbar=0");
	},
	btn_DeleteEvent : function()
	{
		var record = this.m_DraftList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		MsgUtil.confirm("你确定要删除当前报账单草稿吗?草稿一旦删除无法恢复。<br>选“是”执行删除操作，选“否”取消操作。", function(btn, text)
		{
			if (btn == "yes")
			{
				this.doDelete();
			}
		}, this);
	},
	doDelete : function()
	{
		var record = this.m_DraftList.getSelectionModel().getSelected();

		var strFormID = record.get("mainid");
		var strFormType = record.get("formtypecode");

		var param = 
		{
			dataID : strFormID,
			formType : strFormType
		};

		var loadMask = new Ext.LoadMask(document.body,
		{
			msg : "正在处理，请稍候...",
			removeMask : true
		});
		loadMask.show();

		try
		{
			Ext.Ajax.request(
			{
				url : "wf/draft/delete",
				sync : true,/* 同步 */
				params :
				{
					jsonString : Ext.encode(param)
				},
				success : function(response, options)
				{
					var data = Ext.decode(response.responseText);
					if (data.success)
					{
						MsgUtil.alert("删除成功");
						this.m_DraftList.loadDataStore();
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
		finally
		{
			if (loadMask)
			{
				loadMask.hide();
				loadMask = null;
			}
		}
	},
	btn_ShowTransImgEvent : function()
	{
		var record = this.m_DraftList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择一行记录");
			return;
		}

		var strProcessID = record.get("processid");

		showTransImg(strProcessID);
	},
	btn_ExportEvent : function(type)
	{
		var url = "SSC/ssc_smcs_BZDraftAction!downloadExcel.action";

		var param = this.getQueryParam();
		param.addString("exporttype", type);
		if (type == "thispage")
		{
			param.addInteger("start", this.m_DraftList.getBottomToolbar().cursor);
			param.addInteger("limit", this.m_DraftList.getBottomToolbar().pageSize);
		}

		var postparam =
		{
			jsonCondition : Ext.encode(param)
		};

		ssc.common.PostSubmit(url, postparam);
	}
});

/**
 * 提交完成后回调
 */
function callbackAfterOperation()
{
	Ext.getCmp("mainpanel").m_DraftList.loadDataStore();
}

/**
 * 初始化
 */
function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ new wf.workitem.DraftManager.MainPanel(
		{
			id : "mainpanel"
		}) ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);