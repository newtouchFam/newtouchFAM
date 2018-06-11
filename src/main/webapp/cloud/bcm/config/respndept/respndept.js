Ext.namespace("bcm.config.RespnDept");

bcm.config.RespnDept.RespnDeptList = Ext.extend(Ext.grid.EditorGridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	border : false,
	initComponent : function()
	{
		this.store = new Ext.data.JsonStore(
		{
			url : "bcm/respndept/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "caseCode", "caseName",
			           "respnID", "respnCode", "respnName",
			           "respnUnitID", "respnUnitCode", "respnUnitName",
			           "deptID", "deptCode", "deptName",
			           "deptUnitID", "deptUnitCode", "deptUnitName" ]
		});

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});

		var columnModelConfig = [ new Ext.grid.RowNumberer(), this.sm,
		{
			header : "责任中心编码",
			dataIndex : "respnCode",
			width : 100,
			sortable : false
		},
		{
			header : "责任中心名称",
			dataIndex : "respnName",
			width : 120,
			sortable : false
		},
		{
			header : "责任中心所属单位编码",
			dataIndex : "respnUnitCode",
			width : 100,
			sortable : false
		},
		{
			header : "责任中心所属单位名称",
			dataIndex : "respnUnitName",
			width : 120,
			sortable : false
		},
		{
			header : "部门编码",
			dataIndex : "deptCode",
			width : 100,
			sortable : false
		},
		{
			header : "部门名称",
			dataIndex : "deptName",
			width : 120,
			sortable : false
		},
		{
			header : "部门所属单位编码",
			dataIndex : "deptUnitCode",
			width : 100,
			sortable : false
		},
		{
			header : "部门所属单位名称",
			dataIndex : "deptUnitName",
			width : 120,
			sortable : false
		} ];

		this.cm = new Ext.grid.ColumnModel(columnModelConfig);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store,
			xy_PageSizeList : [ 50, 100, 200, 500 ]
		});
		this.on("bodyresize", this.onBodyResize);

		this.store.xy_PagingToolBar = this.bbar;
		this.store.on("load", ssc.common.NumberColumnWidthAdjust, this);

		bcm.config.RespnDept.RespnDeptList.superclass.initComponent.call(this);
	},
	loadStoreData : function(param)
	{
		this.store.baseParams.jsonCondition = Ext.encode(param);

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

bcm.config.RespnDept.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_CurrentCode : "",
	m_RespnDeptList : null,
	m_RespnDeptEditWin : null,
	initComponent : function()
	{
		this.getCurrentCode();

		this.m_RespnDeptList = new bcm.config.RespnDept.RespnDeptList( {});

		this.cmbCase = new bcm.component.CaseListComboBox(
		{
			width : 150,
			xy_InitLoadData : true,
			xy_InitDataID : this.m_CurrentCode,
			xy_ParentObjHandle : this,
			xy_SelectEvent : this.queryRespnDeptList
		});

		this.cmbRespnUnit = new sm.component.UnitTreeComboBox(
		{
			width : 150,
			xy_InitLoadData : true,
			xy_ParentObjHandle : this
		});

		this.edtRespnText = new Ext.form.TextField(
		{
			width : 150,
			emptyText : "请输入责任中心编码或名称..."
		});

		this.cmbDeptUnit = new sm.component.UnitTreeComboBox(
		{
			width : 150,
			xy_InitLoadData : true,
			xy_ParentObjHandle : this
		});

		this.edtDeptText = new Ext.form.TextField(
		{
			width : 150,
			emptyText : "请输入部门编码或名称..."
		});

		this.btnQuery = new Ext.Toolbar.Button(
		{
			text : "过滤",
			iconCls : "xy-view-select",
			handler : this.queryRespnDeptList,
			scope : this
		});

		this.tbar = [ this.cmbCase, "-",
		              "责任中心所属单位:", this.cmbRespnUnit, "-",
		              "责任中心:", this.edtRespnText, "-",
		              this.btnQuery ];

		this.items = [ this.m_RespnDeptList ];

		this.m_RespnDeptList.loadStoreData(
		{
			casecode : this.m_CurrentCode
		});

		bcm.config.RespnDept.MainPanel.superclass.initComponent.call(this);

		this.on("render", function()
		{
			var tbar2 = new Ext.Toolbar( [
			"部门所属单位:", this.cmbDeptUnit, "-",
			"部门:", this.edtDeptText ]);

			this.btnExport = new Ext.Toolbar.SplitButton(
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
			});
			this.btnExport.on("click", function(_This, e)
			{
				if (_This.menu && !_This.menu.isVisible() && !_This.ignoreNextClick)
				{
					_This.showMenu();
				}
				_This.fireEvent("arrowclick", _This, e);
				if (_This.arrowHandler)
				{
					_This.arrowHandler.call(_This.scope || _This, _This, e);
				}
			}, this);

			var tbar3Config = [
			{
				text : "新增",
				iconCls : "xy-add",
				handler : this.btn_AddEvent,
				scope : this
			}, "-",
			{
				text : "删除",
				iconCls : "xy-delete",
				handler : this.btn_DeleteEvent,
				scope : this
			}, "-",
			{
				text : "导入",
				iconCls : "xy-import",
				handler : this.btn_ImportEvent,
				scope : this
			}, "-", this.btnExport, "-",
			{
				text : "复制到其他预算方案",
				iconCls : "xy-add",
				handler : this.btn_CopyEvent,
				scope : this
			} ];

			var tbar3 = new Ext.Toolbar(tbar3Config);

			tbar2.render(this.tbar);
			tbar3.render(this.tbar);
		});
	},
	getCurrentCode : function()
	{
		Ext.Ajax.request(
		{
			url : "bcm/case/getcurrentcasecode",
			method : "post",
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);

				if (data.success)
				{
					this.m_CurrentCode = data.data;
				}
				else
				{
					MsgUtil.alert(data.msg);
					return;
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	getQueryParam : function()
	{
		var param = new ssc.common.BaseCondition();
		param.addString("casecode", this.cmbCase.getKeyValue());
		param.addString("respnunitid", this.cmbRespnUnit.getKeyValue());
		param.addString("respntext", this.edtRespnText.getValue().trim());
		param.addString("deptunitid", this.cmbDeptUnit.getKeyValue());
		param.addString("depttext", this.edtDeptText.getValue().trim());

		return param;
	},
	queryRespnDeptList : function()
	{
		var param = this.getQueryParam();

		this.m_RespnDeptList.loadStoreData(param);
	},
	btn_AddEvent : function()
	{
		var entity =
		{
			caseCode : this.cmbCase.getKeyValue()
		};

		this.m_RespnDeptEditWin = new bcm.config.RespnDept.RespnDeptEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.queryRespnDeptList,
			xy_Entity : entity
		});
		this.m_RespnDeptEditWin.show();
	},
	btn_DeleteEvent : function()
	{
		var records = this.m_RespnDeptList.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先勾选需要删除的对应关系");
			return;
		}

		var msg = "";
		if (records.length == 1)
		{
			var entity = records[0].data;
			msg = "是否删除所选对应关系[责任中心:" + entity.respnName + "][部门:" + entity.deptName + "]?";
		}
		else
		{
			msg = "是否删除所勾选的[" + records.length.toString() + "]个对应关系?";
		}

		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "yes")
			{
				this.deleteRespnDept(records);
			}
		}, this);
	},
	deleteRespnDept : function(records)
	{
		var entityArray = [];
		for ( var i = 0; i < records.length; i++)
		{
			entityArray.push(records[i].data);
		}

		Ext.Ajax.request(
		{
			url : "bcm/respndept/delete",
			method : "post",
			params :
			{
				jsonString : Ext.encode(entityArray)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.queryRespnDeptList();
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
	btn_ImportEvent : function()
	{
		var param = this.getQueryParam();

		this.m_FileUploadDialog = new ssc.component.BaseUploadDialog(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.queryRespnDeptList,
			xy_UploadAction : "bcm/respndept/import",
			xy_BaseParams : param,
			xy_DownloadAction : "bcm/respndept/downloadtemplate",
			xy_FileAccept : "application/msexcel",
			xy_FileExt : "xls"
		});
		this.m_FileUploadDialog.show();
	},
	btn_ExportEvent : function(type)
	{
		var url = "bcm/respndept/export";

		var param = this.getQueryParam();
		param.addString("exporttype", type);

		var postparam =
		{
			jsonCondition : Ext.encode(param)
		};

		if (type !== "all")
		{
			postparam.start = this.m_RespnDeptList.getBottomToolbar().cursor;
			postparam.limit = this.m_RespnDeptList.getBottomToolbar().pageSize
		}

		ssc.common.PostSubmit(url, postparam);
	}
});
Ext.reg("bcm_core_config_respndept_mainpanel", bcm.config.RespnDept.MainPanel);

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
			id : "bcm_core_config_respndept_mainpanel",
			xtype : "bcm_core_config_respndept_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);