Ext.namespace("sm.basedata.Role");

sm.basedata.Role.RoleOperationUnsetList = Ext.extend(Ext.grid.GridPanel,
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
			url : "sm/roleoperation/list/unset",
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

		sm.basedata.Role.RoleOperationUnsetList.superclass.initComponent.call(this);
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

sm.basedata.Role.RoleOperationWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "【操作权限】-【分配】",
	height : 380,
	width : 580,
	resizable : true,
	layout : "border",
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.Add,
	xy_RoleID : "",
	m_RoleOperationUnsetList : null,
	initComponent : function()
	{
		this.initUI();

		this.initData();

		sm.basedata.Role.RoleOperationWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.cmbModule = new sm.component.ModuleListComboBox(
		{
			fieldLabel : "模块",
			width : 200,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function(_this, oldValue, newValue)
			{
				this.queryData();
			},
			xy_ClearClickEvent : function(_This)
			{
				this.queryData();
			}
		});

		this.panelTop = new Ext.form.FormPanel(
		{
			frame : true,
			border : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 80,
			defaults :
			{
				width : 200
			},
			items : [ this.cmbModule ]
		});

		this.m_RoleOperationUnsetList = new sm.basedata.Role.RoleOperationUnsetList(
		{
		});

		this.items = [
  		{
  			region : "north",
  			layout : "fit",
  			height : 40,
  			items : this.panelTop
  		},
  		{
  			region : "center",
  			layout : "fit",
  			items : this.m_RoleOperationUnsetList
  		} ];
	},
	queryData : function()
	{
		var param = 
		{
			roleID : this.xy_RoleID,
			moduleCode : this.cmbModule.getModuleCode()
		}

		this.m_RoleOperationUnsetList.loadStoreData(param);
	},
	initData : function()
	{
		var param =
		{
			roleID : this.xy_RoleID
		}
		this.m_RoleOperationUnsetList.loadStoreData(param);
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

		return this.addRoleOperation();
	},
	validData : function()
	{
		var records = this.m_RoleOperationUnsetList.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择要分配的操作权限");
			return false;
		}

		return true;
	},
	addRoleOperation : function()
	{
		var records = this.m_RoleOperationUnsetList.getSelectionModel().getSelections();
		var operations = [];
		for (var i = 0; i < records.length; i++)
		{
			var record = records[i];

			var ro = 
			{
				roleID : this.xy_RoleID,
				operationCode : record.data.operationCode
			}
			operations.push(ro);
		}

		Ext.Ajax.request(
		{
			url : "sm/roleoperation/add",
			method : "post",
			params :
			{
				jsonString : Ext.encode(operations)
			},
			sync : true,
			success : this.baseSuccessCallbackFun,
			failure : this.baseFailureCallbackFun,
			scope : this
		});

		return this.m_ModalResult;
	}
});