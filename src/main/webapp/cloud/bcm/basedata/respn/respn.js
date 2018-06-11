Ext.namespace("bcm.basedata.Respn");

bcm.basedata.Respn.RespnColumnTreePanel = Ext.extend(Ext.tree.ColumnTree,
{
	screenWidth : screen.width,
	layout : "fit",
	autoWidth : true,
	autoScroll : true,
	rootVisible : true,
	m_CurrentCode : "",
	m_RespnEditWin : null,
	m_RespnDeptWin : null,
	initComponent : function()
	{
		this.getCurrentCode();

		this.root = new Ext.tree.AsyncTreeNode(
		{
			id : "root",
			text : "责任中心",
			level : 0,
			ctType : ""
		});

		this.loader = new Ext.tree.TreeLoader(
		{
			dataUrl : "bcm/respn/tree",
			uiProviders :
			{
				"col" : Ext.tree.ColumnNodeUI
			},
			xy_ColumnTree : true
		});

		this.columns = [
		{
			header : "名称",
			width : 300,
			dataIndex : "text"
		},
		{
			header : "编码",
			width : 100,
			dataIndex : "respnCode"
		},
		{
			header : "级别",
			width : 50,
			dataIndex : "level"
		},
		{
			header : "末级",
			width : 50,
			dataIndex : "isLeaf",
			renderer : ssc.common.RenderUtil.YesOrNo_FocusYes
		},
		{
			header : "类型",
			width : 80,
			dataIndex : "respnTypeName"
		},
		{
			header : "启用",
			width : 50,
			dataIndex : "status",
			renderer : ssc.common.RenderUtil.EnableStatus_Color
		},
		{
			header : "所属方案",
			width : 100,
			dataIndex : "caseName"
		},
		{
			header : "所属单位",
			width : 120,
			dataIndex : "unitName"
		},
		{
			header : "性质",
			width : 60,
			dataIndex : "isUnit",
			renderer : function(value)
			{
				if (value == 1)
				{
					return "单位";
				}
				else
				{
					return "";
				}
			}
		} ];

		this.cmbCase = new bcm.component.CaseListComboBox(
		{
			xy_InitLoadData : true,
			xy_InitDataID : this.m_CurrentCode,
			xy_ParentObjHandle : this,
			xy_SelectEvent : this.onComboboxCaseSelect
		});
		this.btnAddRespn = new Ext.Toolbar.Button(
		{
			text : "新增",
			iconCls : "xy-add",
			scope : this,
			disabled : false,
			handler : this.btn_AddRespnEvent
		});
		this.btnUpdateRespn = new Ext.Toolbar.Button(
		{
			text : "修改",
			iconCls : "xy-edit",
			scope : this,
			disabled : true,
			handler : this.btn_UpdateRespnEvent
		});
		this.btnDeleteRespn = new Ext.Toolbar.Button(
		{
			text : "删除",
			iconCls : "xy-delete",
			scope : this,
			disabled : true,
			handler : this.btn_DeleteRespnEvent
		});
		this.btnRespnDept = new Ext.Toolbar.Button(
		{
			text : "设置与部门对应关系",
			iconCls : "xy-opions",
			scope : this,
			disabled : true,
			handler : this.btn_RespnDeptEvent
		});

		this.tbar = [ this.cmbCase, "-",
		              this.btnAddRespn, "-",
		              this.btnUpdateRespn, "-",
		              this.btnDeleteRespn, "-",
		              this.btnRespnDept ];

		bcm.basedata.Respn.RespnColumnTreePanel.superclass.initComponent.call(this);

		this.loader.baseParams.currentCaseCode = this.m_CurrentCode;
		this.loader.baseParams.jsonCondition = Ext.encode(
		{
			casecode : this.m_CurrentCode
		});

		this.on("click", this.onTreeClickEvent);

		this.root.expand();
	},
	getCurrentCode : function()
	{
		Ext.Ajax.request(
		{
			url : "bcm/case/getcurrentcasecode",
			method : "post",
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);

				if (data.success)
				{
					this.m_CurrentCode = data.data;
				}
				else
				{
					MsgUtil.alert(data.msg);
					return;
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	onLoaderBeforeLoad : function(treeLoader, node)
	{
		treeLoader.baseParams.level  = node.attributes.level;
		treeLoader.baseParams.ctType = node.attributes.ctType;
	},
	onComboboxCaseSelect : function()
	{
		this.loader.baseParams.currentCaseCode = this.cmbCase.getKeyValue();
		this.loader.baseParams.jsonCondition = Ext.encode(
		{
			casecode : this.cmbCase.getKeyValue()
		});
		this.loader.on("beforeload", this.onLoaderBeforeLoad, this);

		this.loader.load(this.root, function()
		{
			this.root.expand();
		}.createDelegate(this));
	},
	getSelected : function()
	{
		var chooseNode = this.getSelectionModel().getSelectedNode();
		if (chooseNode == null)
		{
			MsgUtil.alert("提示", "请先选择一条数据");
			return null;
		}
		return chooseNode;
	},
	btn_AddRespnEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择一个节点作为上级！");
			return;
		}
		var entity =
		{
			caseCode : this.cmbCase.getKeyValue(),
			parentID : node.attributes.respnID,
			parentCode : node.attributes.respnCode,
			parentName : node.attributes.respnName
		};
		if (node.id == "root")
		{
			entity.parentID = "";
			entity.parentCode = "";
			entity.parentName = "";
		}

		this.m_RespnEditWin = new bcm.basedata.Respn.RespnEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.rootReloader.createDelegate(this),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_RespnEditWin.show();
	},
	btn_UpdateRespnEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要修改的责任中心！");
			return;
		}
		if (node.id == "root")
		{
			MsgUtil.alert("不能修改根节点！");
			return;
		}
		var entity = {};
		Ext.apply(entity, node.attributes);
		entity.loader = undefined;
		entity.__proto__ = undefined;

		this.m_RespnEditWin = new bcm.basedata.Respn.RespnEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.rootReloader.createDelegate(this),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_RespnEditWin.show();
	},
	btn_DeleteRespnEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要删除的责任中心");
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
			MsgUtil.alert("还有下级责任中心，不能删除");
			return;
		}
		var entity = {};
		Ext.apply(entity, node.attributes);
		entity.loader = undefined;
		entity.__proto__ = undefined;

		var msg = "如果责任中心已发生过业务数据，则不能删除<br>";
		msg += "是否删除所选的责任中心" + entity.text + "?";
		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "yes")
			{
				this.deleteRespn(entity);
			}
		}, this);
	},
	deleteRespn : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "bcm/respn/delete",
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
					this.rootReloader();
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
	btn_RespnDeptEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要设置的责任中心！");
			return;
		}
		if (node.id == "root")
		{
			MsgUtil.alert("不能设置根节点！");
			return;
		}
		var entity = {};
		Ext.apply(entity, node.attributes);
		entity.loader = undefined;
		entity.__proto__ = undefined;

		this.m_RespnDeptWin = new bcm.basedata.Respn.RespnDeptWin(
		{
			xy_ParentObjHandle : this,
			xy_Entity : entity
		});
		this.m_RespnDeptWin.show();
	},
	onTreeClickEvent :  function(node)
	{
		if(node == null)
		{
			this.btnUpdateRespn.disable();
			this.btnDeleteRespn.disable();
			this.btnRespnDept.disable();
		}
		else if(node.id == "root" && node.attributes.level == "0")
		{
			this.btnUpdateRespn.disable();
			this.btnDeleteRespn.disable();
			this.btnRespnDept.disable();
		}
		else
		{
			this.btnUpdateRespn.enable();
			this.btnDeleteRespn.enable();
			this.btnRespnDept.enable();
		}
	},
	rootReloader : function()
	{
		this.root.reload();
	}
});
Ext.reg("bcm_core_basedata_respn_respncolumntreepanel", bcm.basedata.Respn.RespnColumnTreePanel);

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "bcm_core_basedata_respn_respncolumntreepanel",
			xtype : "bcm_core_basedata_respn_respncolumntreepanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);