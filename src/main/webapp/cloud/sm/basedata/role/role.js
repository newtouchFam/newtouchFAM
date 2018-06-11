Ext.namespace("sm.basedata.Role");

sm.basedata.Role.RoleList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_RoleEditWin : null,
	initComponent : function()
	{
		this.tbar = [
		{
			text : "新增",
			iconCls : "xy-add",
			handler : this.btn_AddEvent,
			scope : this
		}, "-",
		{
			text : "修改",
			iconCls : "xy-edit",
			handler : this.btn_UpdateEvent,
			scope : this
		}, "-",
		{
			text : "删除",
			iconCls : "xy-delete",
			handler : this.btn_DeleteEvent,
			scope : this
		}, "-",
		{
			text : "启用",
			iconCls : "xy-enable",
			handler : this.btn_EnableEvent,
			scope : this
		}, "-",
		{
			text : "停用",
			iconCls : "xy-disable",
			handler : this.btn_DisableEvent,
			scope : this
		}, "-",
		{
			text : "导出",
			iconCls : "xy-export",
			handler : this.btn_DisableEvent,
			hidden : true,
			scope : this
		} ];

		this.store = new Ext.data.JsonStore(
		{
			url : "sm/role/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "roleID", "roleName", "roleDesc", "type", "status" ]
		});
		this.store.on("loadexception", showExtLoadException);

		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(),
		{
			header : "角色名称",
			dataIndex : "roleName",
			width : 100
		},
		{
			header : "角色描述",
			dataIndex : "roleDesc",
			width : 120
		},
		{
			header : "类型",
			dataIndex : "type",
			align : "center",
			renderer : sm.render.RoleType,
			width : 80
		},
		{
			header : "状态",
			dataIndex : "status",
			align : "center",
			renderer : ssc.common.RenderUtil.EnableStatus_Color,
			width : 80
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);
		this.on("dblclick", this.btn_UpdateEvent, this);

		sm.basedata.Role.RoleList.superclass.initComponent.call(this);
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
	btn_AddEvent : function()
	{
		this.m_RoleEditWin = new sm.basedata.Role.RoleEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_RoleEditWin.show();
	},
	btn_UpdateEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择需要修改的角色");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		this.m_RoleEditWin = new sm.basedata.Role.RoleEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_RoleEditWin.show();
	},
	btn_DeleteEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择需要删除的角色");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		MsgUtil.confirm("是否删除所选角色【" + entity.roleName + "/" + entity.roleDesc + "】?", function(btn, text)
		{
			if (btn == "yes")
			{
				this.doDelete(entity);
			}
		}, this);
	},
	doDelete : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "sm/role/delete",
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
	},
	btn_EnableEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择角色");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);
		
		Ext.Ajax.request(
		{
			url : "sm/role/enable",
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
	},
	btn_DisableEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择角色");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);
		
		Ext.Ajax.request(
		{
			url : "sm/role/disable",
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

sm.basedata.Role.RoleOperationList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	loadMask : true,
	m_RoleID : "",
	m_RoleOperationWin : null,
	initComponent : function()
	{
		this.cmbModule = new sm.component.ModuleListComboBox(
		{
			fieldLabel : "模块",
			width : 200,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function(_this, oldValue, newValue)
			{
				this.btn_QueryEvent();
			}
		});
		this.tbar = [ this.cmbModule, "-",
		{
			text : "过滤",
			iconCls : "xy-view-select",
			handler : this.btn_QueryEvent,
			scope : this
		}, "-",
		{
			text : "增加",
			iconCls : "xy-add",
			handler : this.btn_AddEvent,
			scope : this
		}, "-",
		{
			text : "取消",
			iconCls : "xy-delete",
			handler : this.btn_DeleteEvent,
			scope : this
		}, "-",
		{
			text : "导出",
			iconCls : "xy-export",
			handler : this.btn_ExportEvent,
			hidden : true,
			scope : this
		} ];

		this.store = new Ext.data.JsonStore(
		{
			url : "sm/roleoperation/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "id", "roleID", "roleName", "roleDesc",
			           "operationCode", "operationName",
			           "moduleCode", "moduleName" ]
		});
		this.store.on("loadexception", showExtLoadException);

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});

		this.cm = new Ext.grid.ColumnModel( [ this.sm,
		new Ext.grid.RowNumberer(),
		{
			header : "操作编码",
			dataIndex : "operationCode",
			width : 100
		},
		{
			header : "操作名称",
			dataIndex : "operationName",
			width : 140
		},
		{
			header : "模块编码",
			dataIndex : "moduleCode",
			width : 80
		},
		{
			header : "模块名称",
			dataIndex : "moduleName",
			width : 150
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		sm.basedata.Role.RoleOperationList.superclass.initComponent.call(this);
	},
	loadStoreData : function(param)
	{
		if (param != undefined && param != null)
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
	loadStoreDataByRoleID : function(roleID)
	{
		this.m_RoleID = roleID;

		this.cmbModule.clearSelections();

		this.btn_QueryEvent();	
	},
	btn_QueryEvent : function()
	{
		var param = 
		{
			roleid : this.m_RoleID,
			modulecode : this.cmbModule.getModuleCode()
		}

		this.loadStoreData(param);
	},
	btn_AddEvent : function()
	{
		if (this.m_RoleID == "")
		{
			MsgUtil.alert("请先选择角色");
			return;
		}

		this.m_RoleOperationWin = new sm.basedata.Role.RoleOperationWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : function()
			{
				this.loadStoreData();
			},
			xy_EditMode : ssc.component.DialogEditModeEnum.None,
			xy_RoleID : this.m_RoleID
		});
		this.m_RoleOperationWin.show();
	},
	btn_DeleteEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择要删除的操作权限");
			return;
		}

		var operations = [];
		for (var i = 0; i < records.length; i++)
		{
			var record = records[i];

			operations.push(record.data);
		}

		MsgUtil.confirm("是否删除所选的【" + operations.length + "】个操作权限?", function(btn, text)
		{
			if (btn == "yes")
			{
				this.doDelete(operations);
			}
		}, this);
	},
	doDelete : function(operations)
	{
		Ext.Ajax.request(
		{
			url : "sm/roleoperation/delete",
			method : "post",
			params :
			{
				jsonString : Ext.encode(operations)
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

sm.basedata.Role.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "border",
	m_RoleList : null,
	m_RoleOperationList : null,
	initComponent : function()
	{
		this.m_RoleList = new sm.basedata.Role.RoleList(
		{
		});

		this.m_RoleList.on("rowclick", this.onRoleListClick, this);
	
		this.m_RoleOperationList = new sm.basedata.Role.RoleOperationList(
		{
		});

		this.items = [
		{
			region : "west",
			layout : "fit",
			width : 440,
			split : true,
			items : this.m_RoleList
		},
		{
			region : "center",
			layout : "fit",
			items : [ this.m_RoleOperationList ]
		} ];

		sm.basedata.Role.MainPanel.superclass.initComponent.call(this);

		this.m_RoleList.loadStoreData();
	},
	onRoleListClick : function(grid, rowIndex, e)
	{
		var record = grid.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}

		this.m_RoleOperationList.loadStoreDataByRoleID(record.data.roleID);
	}
});

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ new sm.basedata.Role.MainPanel() ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);