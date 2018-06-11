Ext.namespace("sm.basedata.Dept");

sm.basedata.Dept.DeptColumnTreePanel = Ext.extend(Ext.tree.ColumnTree,
{
	autoWidth : true,
	autoScroll : true,
	rootVisible : true,
	initComponent : function()
	{
		this.root = new Ext.tree.AsyncTreeNode(
		{
			id : "root",
			text : "部门",
			level : 0
		});

		this.loader = new Ext.tree.TreeLoader(
		{
			dataUrl : "sm/dept/tree",
			uiProviders :
			{
				"col" : Ext.tree.ColumnNodeUI
			},
			xy_ColumnTree : true
		});

		this.columns = [
		{
			header : "部门",
			width : 250,
			dataIndex : "text"
		},
		{
			header : "编码",
			width : 100,
			dataIndex : "deptCode"
		},
		{
			header : "名称",
			width : 150,
			dataIndex : "deptName"
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
			dataIndex : "isLeaf",
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
		} ];

		sm.basedata.Dept.DeptColumnTreePanel.superclass.initComponent.call(this);
		
	}
});

sm.basedata.Dept.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_DeptTree : null,
	m_DeptEditWin : null,
	initComponent : function()
	{
		this.m_DeptTree = new sm.basedata.Dept.DeptColumnTreePanel(
		{
		});
		
		//单击树展开
        this.m_DeptTree.on("click", onClickExpand, this);
        function onClickExpand(node){
            if(!node.isExpanded() && !node.isLeaf()){
                node.expand();
            } else if (node.isExpanded()){
                node.collapse();
            }
        }

		this.fieldUnit = new sm.component.UnitTreeField(
		{
			width : 300,
			xy_ParentObjHandle : this,
			xy_AllowClear : false,
			xy_ValueChangeEvent : function(newValue, oldValue, _This)
			{
				var userID = this.fieldUnit.getUnitID();
				if (this.fieldUnit.getUnitID() == "")
				{
					userID = "-1";
				}

				this.m_DeptTree.loader.baseParams.jsonCondition = Ext.encode(
				{
					unitid : userID
				});

				this.reloadTree();
			},
			xy_ClearClickEvent : function(_This)
			{
				this.reloadTree();
			}
		});

		this.tbar = [
		"公司:", this.fieldUnit, "-",
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

		this.items = [ this.m_DeptTree ];

		sm.basedata.Dept.MainPanel.superclass.initComponent.call(this);

		this.getDefaultUnit();

		var currentUnitID = Ext.get("session_unitid").dom.value;
		this.m_DeptTree.loader.baseParams.jsonCondition = Ext.encode(
		{
			unitid : currentUnitID
		});

		this.reloadTree();

	},
	reloadTree : function()
	{
		this.m_DeptTree.root.reload();
	},
	/**
	 * 获取默认公司，并设置到公司选择组件中
	 * 如公司只有一个，把公司选择组件设置为禁用，不允许选择其他公司
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
	btn_AddEvent : function()
	{
		if (! this.fieldUnit.getSelected())
		{
			MsgUtil.alert("请先选择公司");
			return;
		}

		var node = this.m_DeptTree.getSelectionModel().getSelectedNode();

		var entity = {};
		if (node == null || node.id == "root")
		{
			entity.unitID = this.fieldUnit.getUnitID();
			entity.parentID = "";
			entity.parentCode = "";
			entity.parentName = "";
		}
		else
		{
			entity.unitID = this.fieldUnit.getUnitID();
			entity.parentID = node.attributes.deptID;
			entity.parentCode = node.attributes.deptCode;
			entity.parentName = node.attributes.deptName;
		}

		this.m_DeptEditWin = new sm.basedata.Dept.DeptEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.reloadTree,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_DeptEditWin.show();
	},
	btn_UpdateEvent : function()
	{
		var node = this.m_DeptTree.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要修改的部门");
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

		this.m_DeptEditWin = new sm.basedata.Dept.DeptEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.reloadTree,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_DeptEditWin.show();
	},
	btn_DeleteEvent : function()
	{
		var node = this.m_DeptTree.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要删除的部门");
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
			MsgUtil.alert("还有下级部门，不能删除");
			return;
		}
		var entity = {};
		Ext.apply(entity, node.attributes);
		entity.loader = undefined;
		entity.__proto__ = undefined;

		var msg = "如果部门已发生过业务数据，则不能删除<br>";
		msg += "请确认是否删除所选的部门【" + entity.text + "】?";
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
			url : "sm/dept/delete",
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
		items : [ new sm.basedata.Dept.MainPanel() ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);