Ext.namespace("bcm.basedata.Respn");

bcm.basedata.Respn.RespnDeptList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	xy_Entity : null,
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
		this.store.on("loadexception", ssc.common.StoreLoadExcpetionEvent, this.m_GridStore);

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});
		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(), this.sm,
		{
			header : "单位编码",
			dataIndex : "deptUnitCode",
			width : 70,
			sortable : true
		},
		{
			header : "单位名称",
			dataIndex : "deptUnitName",
			width : 180,
			sortable : true
		},
		{
			header : "部门编码",
			dataIndex : "deptCode",
			width : 80,
			sortable : true
		},
		{
			header : "部门名称",
			dataIndex : "deptName",
			width : 160,
			sortable : true
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});

		bcm.basedata.Respn.RespnDeptList.superclass.initComponent.call(this);
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

bcm.basedata.Respn.RespnDeptWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "责任中心与部门对应",
	height : 350,
	width : 500,
	layout : "fit",
	labelAlign : "right",
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.Close,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.None,
	xy_Entity : {},
	m_List : null,
	m_DeptDialog : null,
	initComponent : function()
	{
		this.initUI();

		this.initData();

 		bcm.basedata.Respn.RespnDeptWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.tbar = [
		{
			text : "增加对应部门",
			iconCls : "xy-add",
			scope : this,
			handler : this.btn_AddDeptEvent
		}, "-",
		{
			text : "删除对应部门",
			iconCls : "xy-delete",
			scope : this,
			handler : this.btn_DeleteDeptEvent
		} ];

		this.m_List = new bcm.basedata.Respn.RespnDeptList(
		{
			xy_Entity : this.xy_Entity
		});

		this.items = [ this.m_List ];
	},
	initData : function()
	{
		var param =
		{
			casecode : this.xy_Entity.caseCode,
			respnid : this.xy_Entity.respnID
		};

		this.m_List.loadStoreData(param);
	},
	btn_AddDeptEvent : function()
	{
		this.m_DeptDialog = new sm.component.DeptTreeByUnitDialog(
		{
			xy_LeafOnly : false,
			xy_MultiSelectMode : false,
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.addDept
		});
		this.m_DeptDialog.show();
	},
	addDept : function()
	{
		var entity =
		{
			caseCode : this.xy_Entity.caseCode,
			respnID : this.xy_Entity.respnID,
			deptID : this.m_DeptDialog.getSelectedID()
		};

		Ext.Ajax.request(
		{
			url : "SSC/bcm_RespnDeptAction/add",
			method : "post",
			params :
			{
				jsonString : Ext.encode(entity)
			},
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.initData();
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
	btn_DeleteDeptEvent : function()
	{
		var records = this.m_List.getSelectionModel().getSelections();

		if (records.length <= 0)
		{
			MsgUtil.alert("请先选择要取消对应关系的部门");
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
			url : "SSC/bcm_RespnDeptAction/delete",
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
					this.initData();
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