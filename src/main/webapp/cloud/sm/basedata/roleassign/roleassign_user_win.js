Ext.namespace("sm.basedata.RoleAssign");

sm.basedata.RoleAssign.UserUnsetList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	loadMask : true,
	m_RoleID : "",
	initComponent : function()
	{
		this.store = new Ext.data.JsonStore(
		{
			url : "sm/userrole/list/unset",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "userID", "userCode", "userName",
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

		sm.basedata.RoleAssign.UserUnsetList.superclass.initComponent.call(this);
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
	}
});

sm.basedata.RoleAssign.UserAssignWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "【用户】-【分配】",
	height : 420,
	width : 650,
	resizable : true,
	layout : "border",
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.Add,
	xy_RoleID : "",
	m_UserUnsetList : null,
	xy_isFixUnit : false,
	xy_Unit : {},
	initComponent : function()
	{
		this.initUI();

		sm.basedata.RoleAssign.UserAssignWin.superclass.initComponent.call(this);

		this.initData();
	},
	initUI : function()
	{
		this.fieldUnit = new sm.component.UnitTreeField(
		{
			fieldLabel : "公司",
			width : 200,
			xy_ParentObjHandle : this,
			xy_AllowClear : true,
			xy_ValueChangeEvent : function(newValue, oldValue, _This)
			{
				this.fieldDept.clearSelections();

				this.queryData();
			},
			xy_ClearClickEvent : function(_This)
			{
				this.queryData();
			}
		});

		this.fieldDept = new sm.component.DeptTreeField(
		{
			fieldLabel : "部门",
			width : 200,
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
				this.queryData();
			},
			xy_ClearClickEvent : function(_This)
			{
				this.queryData();
			}
		});

		this.edtUserText = new ssc.component.BaseSearchField(
		{
			fieldLabel : "用户",
			width : 100,
			emptyText : "请输入登录名或姓名",
			onTrigger1Click : function()
			{
				this.queryData();
			}.createDelegate(this),
			onTrigger2Click : function()
			{
				this.edtUserText.setValue("");

				this.queryData();
			}.createDelegate(this)
		});
		this.edtUserText.on("specialkey", function(_field, e)
		{
			if (e.getKey() == e.ENTER)
			{
				this.queryData();
			}
		}, this);

		this.panelTop = new Ext.Panel(
		{
			frame : true,
			border : true,
			autoWidth : true,
			layout : "column",
			items : [
			{
				columnWidth : .45,
				layout : "form",
				labelAlign : "right",
				labelWidth : 80,
				defaults :
				{
					width : 180
				},
				items : [ this.fieldUnit,
				          this.edtUserText ]
			},
			{
				columnWidth : .45,
				layout : "form",
				labelAlign : "right",
				labelWidth : 80,
				defaults :
				{
					width : 180
				},
				items : [ this.fieldDept ]
			} ]
		});

		this.m_UserUnsetList = new sm.basedata.RoleAssign.UserUnsetList(
		{
		});

		this.items = [
  		{
  			region : "north",
  			layout : "fit",
  			height : 70,
  			items : this.panelTop
  		},
  		{
  			region : "center",
  			layout : "fit",
  			items : this.m_UserUnsetList
  		} ];
	},
	queryData : function()
	{
		var param = 
		{
			roleid : this.xy_RoleID,
			unitID : this.fieldUnit.getSelectedID(),
			deptID : this.fieldDept.getSelectedID(),
			userText : this.edtUserText.getValue().trim()
		}

		this.m_UserUnsetList.loadStoreData(param);
	},
	initData : function()
	{
		if (this.xy_isFixUnit)
		{
			this.fieldUnit.setXyValue(this.xy_Unit);
			this.fieldUnit.disable();
		}

		var param =
		{
			roleID : this.xy_RoleID
		}

		this.m_UserUnsetList.loadStoreData(param);
	},
	/**
	 * @override
	 */
	baseConfirmValid : function()
	{
		if (! this.validData())
		{
			return false;
		}

		return this.addUserRole();
	},
	validData : function()
	{
		var records = this.m_UserUnsetList.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择要分配的用户");
			return false;
		}

		return true;
	},
	addUserRole : function()
	{
		var records = this.m_UserUnsetList.getSelectionModel().getSelections();
		var userroles = [];
		for (var i = 0; i < records.length; i++)
		{
			var record = records[i];

			var ro = 
			{
				roleID : this.xy_RoleID,
				userID : record.data.userID
			}
			userroles.push(ro);
		}

		Ext.Ajax.request(
		{
			url : "sm/userrole/add",
			method : "post",
			params :
			{
				jsonString : Ext.encode(userroles)
			},
			sync : true,
			success : this.baseSuccessCallbackFun,
			failure : this.baseFailureCallbackFun,
			scope : this
		});

		return this.m_ModalResult;
	}
});