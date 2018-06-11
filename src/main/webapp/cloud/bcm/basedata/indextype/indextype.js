Ext.namespace("bcm.basedata.RespnType");

bcm.basedata.IndexType.IndexTypeList = Ext.extend(Ext.grid.GridPanel,
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
			url : "bcm/indextype/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "indexTypeID", "indexTypeCode", "indexTypeName", "status", "remark" ]
		});
		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : true
		});

		var rowNumber = new Ext.grid.RowNumberer();
		var columnModelConfig = [ rowNumber,
		{
			header : "编码",
			dataIndex : "indexTypeCode",
			width : 120,
			sortable : true
		},
		{
			header : "名称",
			dataIndex : "indexTypeName",
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

		bcm.basedata.IndexType.IndexTypeList.superclass.initComponent.call(this);
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

bcm.basedata.IndexType.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_IndexTypeList : null,
	m_IndexTypeEditWin : null,
	initComponent : function()
	{
		this.m_IndexTypeList = new bcm.basedata.IndexType.IndexTypeList(
		{
		});
		this.m_IndexTypeList.on("dblclick", this.btn_UpdateIndexTypeEvent, this);

		this.tbar = [
		{
			text : "新增预算项目类型",
			iconCls : "xy-add",
			handler : this.btn_AddIndexTypeEvent,
			scope : this
		}, "-",
		{
			text : "修改预算项目类型",
			iconCls : "xy-edit",
			handler : this.btn_UpdateIndexTypeEvent,
			scope : this
		}, "-",
		{
			text : "删除预算项目类型",
			iconCls : "xy-delete",
			handler : this.btn_DeleteIndexTypeEvent,
			scope : this
		} ];

		this.items = [ this.m_IndexTypeList ];

		this.m_IndexTypeList.load();

		bcm.basedata.IndexType.MainPanel.superclass.initComponent.call(this);
	},
	btn_AddIndexTypeEvent : function()
	{
		this.m_IndexTypeEditWin = new bcm.basedata.IndexType.IndexTypeEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.m_IndexTypeList.load.createDelegate(this.m_IndexTypeList),
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_IndexTypeEditWin.show();
	},
	btn_UpdateIndexTypeEvent : function()
	{
		var record = this.m_IndexTypeList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择需要修改的预算项目类型！");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		this.m_IndexTypeEditWin = new bcm.basedata.IndexType.IndexTypeEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.m_IndexTypeList.load.createDelegate(this.m_IndexTypeList),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_IndexTypeEditWin.show();
	},
	btn_DeleteIndexTypeEvent : function()
	{
		var record = this.m_IndexTypeList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择需要删除的预算项目类型！");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		var msg = "预算项目类型如果已经被使用，则不能被删除<br>";
		msg += "是否删除所选的预算项目类型?";
		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "yes")
			{
				this.deleteIndexType(entity);
			}
		}, this);
	},
	deleteIndexType : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "bcm/indextype/delete",
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
					this.m_IndexTypeList.load();
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
Ext.reg("bcm_core_basedata_indextype_mainpanel", bcm.basedata.IndexType.MainPanel);

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
			id : "bcm_core_basedata_indextype_mainpanel",
			xtype : "bcm_core_basedata_indextype_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);