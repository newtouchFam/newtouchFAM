Ext.namespace("sm.basedata.User");

sm.basedata.User.DeptTree = Ext.extend(Ext.tree.TreePanel,
{
	animate : true,
	autoScroll : true,
	border : false,
	enableDD : false,
	rootVisible : true,
	initComponent : function()
	{
		this.root = new Ext.tree.AsyncTreeNode(
		{
			id : "root",
			text : "部门"
		});

		this.loader = new Ext.tree.TreeLoader(
		{
			dataUrl : "sm/dept/tree"
		});

		sm.basedata.User.DeptTree.superclass.initComponent.call(this);
	},
	loadStoreData : function(unitid)
	{
		var param = 
		{
			unitid : unitid
		};

		this.loader.baseParams.jsonCondition = Ext.encode(param);
		this.root.reload();
	}
});

sm.basedata.User.UserList = Ext.extend(Ext.grid.GridPanel,
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
			url : "sm/user/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "userID", "userCode", "userName", "status",
			           "unitID", "unitCode", "unitName",
			           "deptID", "deptCode", "deptName",
			           "empolyNo", "email", "mobileTel"]
		});

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});

		var rowNumber = new Ext.grid.RowNumberer();
		var columnModelConfig = [ this.sm,
		rowNumber,
		{
			header : "登录名",
			dataIndex : "userCode",
			width : 100
		},
		{
			header : "姓名",
			dataIndex : "userName",
			width : 100
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
			header : "状态",
			dataIndex : "status",
			width : 50,
			align : "center",
			renderer : sm.render.UserStatus
		},
		{
			header : "工号",
			dataIndex : "empolyNo",
			width : 100
		},
		{
			header : "电子邮件",
			dataIndex : "email",
			width : 100
		},
		{
			header : "电话",
			dataIndex : "mobileTel",
			width : 100
		} ];

		this.cm = new Ext.grid.ColumnModel(columnModelConfig);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});

		this.on("bodyresize", this.onBodyResize);
		this.store.xy_PagingToolBar = this.bbar;
		this.store.on("load", ssc.common.NumberColumnWidthAdjust, this);

		sm.basedata.User.UserList.superclass.initComponent.call(this);
	},
	loadStoreData : function(unitid, deptid, usertext, status)
	{
		var param = new ssc.common.BaseCondition();
		param.addString("unitid", unitid);
		param.addString("deptid", deptid);
		param.addString("usertext", usertext);
		param.addInteger("status", status);

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

sm.basedata.User.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "border",
	m_DeptTree : null,
	m_UserList : null,
	m_UnitEditWin : null,
	m_UnitLockWin : null,
	m_ResetPwdWin : null,
	initComponent : function()
	{
		this.m_DeptTree = new sm.basedata.User.DeptTree( {} );

		this.m_UserList = new sm.basedata.User.UserList( {} );
		this.m_UserList.on("dblclick", this.btn_UpdateEvent, this);

		this.fieldUnit = new sm.component.UnitTreeField(
		{
			width : 300,
			xy_ParentObjHandle : this,
			xy_AllowClear : false,
			xy_ValueChangeEvent : function(newValue, oldValue, _This)
			{
				var unitid = this.fieldUnit.getUnitID();

				this.m_DeptTree.loadStoreData(unitid);
			},
			xy_ClearClickEvent : function(_This)
			{
				this.reloadDeptTree();
			}
		});

		this.edtUserText = new Ext.form.TextField(
		{
			fieldLabel : "用户信息",
			emptyText : "登录名或姓名",
			width : 100
		});
		this.edtUserText.on("specialkey", function(_field, e)
		{
			if (e.getKey() == e.ENTER)
			{
				this.queryUserList();
			}
		}, this);

		this.cmbUserStatus = new sm.component.UserStatusComboBox(
		{
			fieldLabel : "用户状态",
			xy_ParentObjHandle : this,
			xy_hasAll : true,
			xy_InitDataID : "--",
			width : 100,
			xy_ValueChangeEvent : function(_this, oldValue, newValue)
			{
				this.queryUserList();
			}
		});

		this.tbar = [
		"公司:", this.fieldUnit, "-",
		"用户信息:", this.edtUserText, "-",
		"用户状态:", this.cmbUserStatus, "-",
		{
			text : "过滤",
			iconCls : "xy-view-select",
 			handler : this.btn_QueryEvent,
 			scope : this
 		} ];

		this.items = [
		{
			region : "west",
			layout : "fit",
			width : 200,
			split : true,
			collapsible : true,
			items : this.m_DeptTree
		},
		{
			region : "center",
			layout : "fit",
			split : true,
			items : this.m_UserList
		} ];

		sm.basedata.User.MainPanel.superclass.initComponent.call(this);

		this.getDefaultUnit();

		var unitid = Ext.get("session_unitid").dom.value;
		this.m_DeptTree.loadStoreData(unitid);

		this.m_DeptTree.on("click", this.onDeptTreeClickEvent, this);

		this.on("render", function()
		{
			var tbar2 = new Ext.Toolbar([
			{
				text : "新增",
				iconCls : "xy-add",
				scope : this,
				handler : this.btn_AddEvent
			}, "-",
			{
				text : "修改",
				iconCls : "xy-edit",
				scope : this,
				handler : this.btn_UpdateEvent
			}, "-",
			{
				text : "锁定",
				iconCls : "xy-lock",
				handler : this.btn_LockEvent,
				scope : this
			}, "-",
			{
				text : "密码重置",
				iconCls : "xy-edit",
				handler : this.btn_ResetPwdEvent,
				scope : this
			}, "-",
			{
				text : "删除",
				iconCls : "xy-delete",
				scope : this,
				handler : this.btn_DeleteEvent
			}, "-",
			{
				text : "查询角色信息",
				iconCls : "xy-details",
				handler : this.btn_QueryRole,
				hidden : true,
				scope : this
			}, "-",
			{
				text : "导出",
				iconCls : "xy-export",
				hidden : true,
				disabled : true,
				scope : this,
				handler : this.btn_ExportEvent
			} ]);

			tbar2.render(this.tbar);
		});
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
						this.fieldUnit.setXyValue(treeUnit);
						this.fieldUnit.disable();
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
	},
	onDeptTreeClickEvent : function(node, event)
	{
		this.queryUserList(node);
	},
	reloadDeptTree : function()
	{
		this.m_DeptTree.root.reload();
	},
	btn_QueryEvent : function()
	{
		this.queryUserList();
	},
	queryUserList : function(node)
	{
		var unitid = this.fieldUnit.getUnitID();

		if (node == undefined || node == null)
		{
			node = this.m_DeptTree.getSelectionModel().getSelectedNode();
		}

		var deptid = "";
		if (node.id != "root")
		{
			deptid = node.id;
		}
		else
		{
			deptid = "";
		}

		var usertext = this.edtUserText.getValue().trim();

		var status = null;
		if (! this.cmbUserStatus.isAllItem())
		{
			status = this.cmbUserStatus.getKeyValue();
		}

		this.m_UserList.loadStoreData(unitid, deptid, usertext, status);		
	},
	btn_AddEvent : function()
	{
		if (! this.fieldUnit.getSelected())
		{
			MsgUtil.alert("请先选择公司");
			return;
		}
		var node = this.m_DeptTree.getSelectionModel().getSelectedNode();
		if (node == null)
		{
			MsgUtil.alert("请先选择部门");
			return;
		}

		if (node.id == "root")
		{
			//MsgUtil.alert("不可选择部门根节点");
			//return;
			var entity = {};
			entity.unitID = this.fieldUnit.getUnitID();
			entity.deptID = "00000000-0000-0000-0000-000000000000";
		}
		else
		{
			var entity = {};
			entity.unitID = this.fieldUnit.getUnitID();
			entity.deptID = node.id
		}

		this.m_UnitEditWin = new sm.basedata.User.UserEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.queryUserList,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_UnitEditWin.show();		
	},
	btn_UpdateEvent : function()
	{
		var records = this.m_UserList.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择要修改的用户");
			return;
		}

		if (records.length > 1)
		{
			MsgUtil.alert("只能选择一位用户修改");
			return;
		}

		var entity = records[0].data;

		this.m_UnitEditWin = new sm.basedata.User.UserEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.queryUserList,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_UnitEditWin.show();		
	},
	btn_DeleteEvent : function()
	{
		var records = this.m_UserList.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择要删除的用户");
			return;
		}

		if (records.length > 1)
		{
			MsgUtil.alert("只能选择删除一位用户");
			return;
		}

		var entity = records[0].data;

		if (entity.status != 2)
		{
			MsgUtil.alert("用户未停用/锁定，不能直接删除");
			return;
		}

		var msg = "请确认是否删除所选的用户【" + entity.userCode + "/" + entity.userName + "】?";
		MsgUtil.confirm(msg, function(btn, text)
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
			url : "sm/user/delete",
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
					this.queryUserList();
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
	btn_LockEvent : function()
	{
		var records = this.m_UserList.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择要锁定的用户");
			return;
		}

		var entity = [];
		for (var i = 0; i < records.length; i++)
		{
			var record = records[i];
			entity.push(record.data);
		}

		this.m_UnitLockWin = new sm.basedata.User.LockWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.btn_QueryEvent,
			xy_Entity : entity
		});
		this.m_UnitLockWin.show();
	},
	btn_ResetPwdEvent : function()
	{
		var records = this.m_UserList.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择要重置密码的用户");
			return;
		}

		var entity = [];
		for (var i = 0; i < records.length; i++)
		{
			var record = records[i];
			entity.push(record.data);
		}

		this.m_ResetPwdWin = new sm.basedata.User.ResetPasswordWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.queryUserList,
			xy_Entity : entity
		});

		this.m_ResetPwdWin.show();
	}
});

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ new sm.basedata.User.MainPanel() ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);