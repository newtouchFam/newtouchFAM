Ext.namespace("sm.basedata.RoleAssign");

sm.basedata.RoleAssign.RoleList = Ext.extend(Ext.grid.GridPanel,
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

		sm.basedata.RoleAssign.RoleList.superclass.initComponent.call(this);
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
	}
});

sm.basedata.RoleAssign.UserRoleList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	loadMask : true,
	m_RoleID : "",
	m_UserRoleAssignWin : null,
	xy_isFixUnit : false,
	initComponent : function()
	{
		this.fieldUnit = new sm.component.UnitTreeField(
		{
			fieldLabel : "公司",
			width : 150,
			xy_ParentObjHandle : this,
			xy_AllowClear : true,
			xy_ValueChangeEvent : function(newValue, oldValue, _This)
			{
				this.fieldDept.clearSelections();

				this.btn_QueryEvent();
			},
			xy_ClearClickEvent : function(_This)
			{
				this.btn_QueryEvent();
			}
		});

		this.fieldDept = new sm.component.DeptTreeField(
		{
			fieldLabel : "部门",
			width : 150,
			xy_ParentObjHandle : this,
			xy_AllowClear : true,
			prepareBaseParams : function()
			{
				var param =
				{
					unitid : this.fieldUnit.getSelectedID()
				};

				return param;
			}.createDelegate(this),
			xy_ValueChangeEvent : function(newValue, oldValue, _This)
			{
				this.btn_QueryEvent();
			},
			xy_ClearClickEvent : function(_This)
			{
				this.btn_QueryEvent();
			}
		});

		this.edtUserText = new Ext.form.TextField(
		{
			fieldLabel : "用户",
			width : 100,
			emptyText : "登录名或姓名"
		});
		this.edtUserText.on("specialkey", function(_field, e)
		{
			if (e.getKey() == e.ENTER)
			{
				this.btn_QueryEvent();
			}
		}, this);

		this.tbar = [
		"公司:", this.fieldUnit, "-",
		"部门:", this.fieldDept, "-",
		"用户", this.edtUserText, "-",
		{
			text : "过滤",
			iconCls : "xy-view-select",
			handler : this.btn_QueryEvent,
			scope : this
		} ];

		this.store = new Ext.data.JsonStore(
		{
			url : "sm/userrole/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "id", "userID", "userCode", "userName",
			           "unitID", "unitCode", "unitName",
			           "deptID", "deptCode", "deptName" ]
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
			header : "登录名",
			dataIndex : "userCode",
			width : 100
		},
		{
			header : "姓名",
			dataIndex : "userName",
			width : 80
		},
		{
			header : "部门编码",
			dataIndex : "deptCode",
			width : 100
		},
		{
			header : "部门名称",
			dataIndex : "deptName",
			width : 100
		},
		{
			header : "公司编码",
			dataIndex : "unitCode",
			width : 100
		},
		{
			header : "公司名称",
			dataIndex : "unitName",
			width : 100
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		sm.basedata.RoleAssign.UserRoleList.superclass.initComponent.call(this);

		this.on("render", function()
		{
			var tbar2 = new Ext.Toolbar(
			[{
				text : "分配用户",
				iconCls : "xy-add",
				handler : this.btn_AddEvent,
				scope : this
			}, "-",
			{
				text : "撤销分配",
				iconCls : "xy-delete",
				handler : this.btn_DeleteEvent,
				scope : this
			} ]);

 			tbar2.render(this.tbar);
		});
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

		this.btn_QueryEvent();	
	},
	btn_QueryEvent : function()
	{
		var param =
		{
			roleID : this.m_RoleID,
			unitID : this.fieldUnit.getSelectedID(),
			deptID : this.fieldDept.getSelectedID(),
			userText : this.edtUserText.getValue().trim()
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

		this.m_UserAssignWin = new sm.basedata.RoleAssign.UserAssignWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : function()
			{
				this.loadStoreData();
			},
			xy_EditMode : ssc.component.DialogEditModeEnum.None,
			xy_RoleID : this.m_RoleID,
			xy_isFixUnit : this.xy_isFixUnit,
			xy_Unit : this.fieldUnit.getSelectedData()
		});
		this.m_UserAssignWin.show();
	},
	btn_DeleteEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择要取消权限的用户");
			return;
		}

		var userroles = [];
		for (var i = 0; i < records.length; i++)
		{
			var record = records[i];

			userroles.push(record.data);
		}

		MsgUtil.confirm("是否取消所选的【" + userroles.length + "】位用户的权限?", function(btn, text)
		{
			if (btn == "yes")
			{
				this.doDelete(userroles);
			}
		}, this);
	},
	doDelete : function(userroles)
	{
		Ext.Ajax.request(
		{
			url : "sm/userrole/delete",
			method : "post",
			params :
			{
				jsonString : Ext.encode(userroles)
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

sm.basedata.RoleAssign.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "border",
	m_RoleList : null,
	m_UserRoleList : null,
	m_isFixUnit : false,
	initComponent : function()
	{
		this.m_RoleList = new sm.basedata.RoleAssign.RoleList(
		{
		});
		this.m_RoleList.on("rowclick", this.onRoleListClick, this);
	
		this.m_UserRoleList = new sm.basedata.RoleAssign.UserRoleList(
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
			items : [ this.m_UserRoleList ]
		} ];

		sm.basedata.RoleAssign.MainPanel.superclass.initComponent.call(this);

		this.m_RoleList.loadStoreData();

		this.getDefaultUnit();
	},
	onRoleListClick : function(_ThisGrid, _RowIndex, e)
	{
		var record = _ThisGrid.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}

		this.m_UserRoleList.loadStoreDataByRoleID(record.data.roleID);
	},
	/**
	 * 获取默认公司，并设置到公司选择组件中 如公司只有一个，把公司选择组件设置为禁用，不允许选择其他公司
	 */
	getDefaultUnit : function()
	{
		if (Ext.get("session_unitid").dom.value == "" || Ext.get("session_unitid").dom.value == null)
		{
			return;
		}
		var currentUnitID = Ext.get("session_unitid").dom.value;

		var param = 
		{
			status : 1
		}

		Ext.Ajax.request(
		{
			url : "sm/unit/list",
			method : "post",
			params :
			{
				jsonCondition : Ext.encode(param)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					if (data.data.length > 0)
					{
						if (data.data.length > 1)
						{
							return;
						}

						var unit = null;
						for (var i = 0; i < data.data.length; i++)
						{
							var srvUnit = data.data[i];
							if (srvUnit.unitID == currentUnitID)
							{
								unit = srvUnit;
								break;
							}
						}

						if (unit == null)
						{
							return;
						}

						var treeUnit = 
						{
							id : unit.unitID,
							text : "[" + unit.unitCode + "]" + unit.unitName
						}

						this.m_UserRoleList.fieldUnit.setXyValue(treeUnit);
						this.m_UserRoleList.fieldUnit.disable();
						this.m_isFixUnit = true;
						this.m_UserRoleList.xy_isFixUnit = this.m_isFixUnit;
					}
					else
					{
						MsgUtil.alert("未找到公司数据");
					}
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

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ new sm.basedata.RoleAssign.MainPanel() ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);