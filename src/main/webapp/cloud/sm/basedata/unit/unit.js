Ext.namespace("sm.basedata.Unit");

sm.basedata.Unit.UnitColumnTreePanel = Ext.extend(Ext.tree.ColumnTree,
{
	autoWidth : true,
	autoScroll : true,
	rootVisible : true,
	initComponent : function()
	{
		this.root = new Ext.tree.AsyncTreeNode(
		{
			id : "root",
			text : "公司",
			level : 0
		});

		this.loader = new Ext.tree.TreeLoader(
		{
			dataUrl : "sm/unit/tree",
			uiProviders :
			{
				"col" : Ext.tree.ColumnNodeUI
			},
			xy_ColumnTree : true
		});

		this.columns = [
		{
			header : "公司",
			width : 250,
			dataIndex : "text"
		},
		{
			header : "编码",
			width : 100,
			dataIndex : "unitCode"
		},
		{
			header : "名称",
			width : 150,
			dataIndex : "unitName"
		},
		{
			header : "简码",
			width : 60,
			dataIndex : "shortCode"
		},
		{
			header : "简称",
			width : 60,
			dataIndex : "shortName"
		},
		{
			header : "级别",
			width : 40,
			dataIndex : "level"
		},
		{
			header : "末级",
			width : 40,
			dataIndex : "isleaf",
			renderer : ssc.common.RenderUtil.YesOrNo_FocusYes
		},
		{
			header : "状态",
			width : 40,
			dataIndex : "status",
			renderer : ssc.common.RenderUtil.EnableStatus_Color
		},
		{
			header : "备注",
			width : 100,
			dataIndex : "memo"
		},
		{
			header : "性质",
			width : 100,
			dataIndex : "property"
		},
		{
			header : "地址",
			width : 100,
			dataIndex : "address"
		},
		{
			header : "电话",
			width : 100,
			dataIndex : "tel"
		},
		{
			header : "传真",
			width : 100,
			dataIndex : "fax"
		},
		{
			header : "电子邮件",
			width : 100,
			dataIndex : "email"
		} ];

		sm.basedata.Unit.UnitColumnTreePanel.superclass.initComponent.call(this);
	}
});

sm.basedata.Unit.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_UnitTree : null,
	m_UnitEditWin : null,
	initComponent : function()
	{
		this.tbar = [
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
			text : "删除",
			iconCls : "xy-delete",
			scope : this,
			handler : this.btn_DeleteEvent
		}, "-",
		{
			text : "导出",
			iconCls : "xy-export",
			hidden : true,
			disabled : true,
			scope : this,
			handler : this.btn_ExportEvent
		} ];

		this.m_UnitTree = new sm.basedata.Unit.UnitColumnTreePanel({});

		this.items = [ this.m_UnitTree ];

		this.m_UnitTree.root.expand();

		sm.basedata.Unit.MainPanel.superclass.initComponent.call(this);
	},
	reloadTree : function()
	{
		this.m_UnitTree.root.reload();
	},
	btn_AddEvent : function()
	{
		var node = this.m_UnitTree.getSelectionModel().getSelectedNode();

		var entity = {};
		if (node == null || node.id == "root")
		{
			entity.parentID = "";
			entity.parentCode = "";
			entity.parentName = "";
		}
		else
		{
			entity.parentID = node.attributes.unitID;
			entity.parentCode = node.attributes.unitCode;
			entity.parentName = node.attributes.unitName;
		}

		this.m_UnitEditWin = new sm.basedata.Unit.UnitEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.reloadTree,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_UnitEditWin.show();
	},
	btn_UpdateEvent : function()
	{
		var node = this.m_UnitTree.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要修改的公司");
			return;
		}
		if (node.id == "root")
		{
			MsgUtil.alert("不能修改根节点");
			return;
		}
		var entity = {};
		Ext.apply(entity, node.attributes);
		entity.loader = undefined;
		entity.__proto__ = undefined;

		this.m_UnitEditWin = new sm.basedata.Unit.UnitEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.reloadTree,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_UnitEditWin.show();
	},
	btn_DeleteEvent : function()
	{
		var node = this.m_UnitTree.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要删除的公司");
			return;
		}

		if (node.id == "root")
		{
			MsgUtil.alert("不能删除根节点");
			return;
		}
		if (node.childNodes.length > 0
				|| node.leaf == 0
				|| node.leaf == false)
		{
			MsgUtil.alert("还有下级公司，不能删除");
			return;
		}
		var entity = {};
		Ext.apply(entity, node.attributes);
		entity.loader = undefined;
		entity.__proto__ = undefined;

		var msg = "如果公司已发生过业务数据，则不能删除<br>";
		msg += "请确认是否删除所选的公司【" + entity.text + "】?";
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
			url : "sm/unit/delete",
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
					this.reloadTree();
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
		items : [ new sm.basedata.Unit.MainPanel() ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);