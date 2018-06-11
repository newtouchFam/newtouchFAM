Ext.namespace("bcm.basedata.RespnType");

bcm.basedata.RespnType.RespnTypeList = Ext.extend(Ext.grid.GridPanel,
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
			url : "bcm/respntype/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "respnTypeID", "respnTypeCode", "respnTypeName", "status", "remark" ]
		});
		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : true
		});

		var rowNumber = new Ext.grid.RowNumberer();
		var columnModelConfig = [ rowNumber,
		{
			header : "编码",
			dataIndex : "respnTypeCode",
			width : 120,
			sortable : true
		},
		{
			header : "名称",
			dataIndex : "respnTypeName",
			width : 150,
			sortable : true
		},
		{
			header : "启用状态",
			dataIndex : "status",
			width : 50,
			renderer : ssc.common.RenderUtil.EnableStatus_Color,
			sortable : true
		},
		{
			header : "备注",
			dataIndex : "remark",
			width : 100,
			sortable : true
		} ];

		this.cm = new Ext.grid.ColumnModel(columnModelConfig);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		bcm.basedata.RespnType.RespnTypeList.superclass.initComponent.call(this);
	},
	load : function()
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

bcm.basedata.RespnType.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_RespnTypeList : null,
	m_RespnTypeEditWin : null,
	initComponent : function()
	{
		this.m_RespnTypeList = new bcm.basedata.RespnType.RespnTypeList(
		{
		});
		this.m_RespnTypeList.on("dblclick", this.btn_UpdateRespnTypeEvent, this);

		this.tbar = [
		{
			text : "新增责任中心类型",
			iconCls : "xy-add",
			handler : this.btn_AddRespnTypeEvent,
			scope : this
		}, "-",
		{
			text : "修改责任中心类型",
			iconCls : "xy-edit",
			handler : this.btn_UpdateRespnTypeEvent,
			scope : this
		}, "-",
		{
			text : "删除责任中心类型",
			iconCls : "xy-delete",
			handler : this.btn_DeleteRespnTypeEvent,
			scope : this
		} ];

		this.items = [ this.m_RespnTypeList ];

		this.m_RespnTypeList.load();

		bcm.basedata.RespnType.MainPanel.superclass.initComponent.call(this);
	},
	btn_AddRespnTypeEvent : function()
	{
		this.m_RespnTypeEditWin = new bcm.basedata.RespnType.RespnTypeEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.m_RespnTypeList.load.createDelegate(this.m_RespnTypeList),
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_RespnTypeEditWin.show();
	},
	btn_UpdateRespnTypeEvent : function()
	{
		var record = this.m_RespnTypeList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择需要修改的责任中心类型！");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		this.m_RespnTypeEditWin = new bcm.basedata.RespnType.RespnTypeEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.m_RespnTypeList.load.createDelegate(this.m_RespnTypeList),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_RespnTypeEditWin.show();
	},
	btn_DeleteRespnTypeEvent : function()
	{
		var record = this.m_RespnTypeList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择需要删除的责任中心类型！");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		var msg = "责任中心类型如果已经被使用，则不能被删除<br>";
		msg += "是否删除所选的责任中心类型?";
		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "yes")
			{
				this.deleteRespnType(entity);
			}
		}, this);
	},
	deleteRespnType : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "bcm/respntype/delete",
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
					this.m_RespnTypeList.load();
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
Ext.reg("bcm_core_basedata_respntype_mainpanel", bcm.basedata.RespnType.MainPanel);

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
			id : "bcm_core_basedata_respntype_mainpanel",
			xtype : "bcm_core_basedata_respntype_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);