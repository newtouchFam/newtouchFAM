Ext.namespace("bcm.basedata.Specact");

bcm.basedata.Specact.SpecactColumnTreePanel = Ext.extend(Ext.tree.ColumnTree,
{
	screenWidth : screen.width,
	layout : "fit",
	autoWidth : true,
	autoScroll : true,
	rootVisible : true,
	m_CurrentCode : "",
	m_SpecactEditWin : null,
	initComponent : function()
	{
		this.getCurrentCode();

		this.root = new Ext.tree.AsyncTreeNode(
		{
			id : "root",
			text : "专项活动",
			level : 0,
			ctType : ""
		});

		this.loader = new Ext.tree.TreeLoader(
		{
			dataUrl : "bcm/specact/tree",
			uiProviders :
			{
				"col" : Ext.tree.ColumnNodeUI
			},
			xy_ColumnTree : true
		});

		this.columns = [
		{
			header : "名称",
			width : 200,
			dataIndex : "text"
		},
		{
			header : "编码",
			width : 100,
			dataIndex : "specactCode"
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
			header : "共享",
			width : 50,
			dataIndex : "isShare",
			renderer : ssc.common.RenderUtil.YesOrNo_FocusYes
		},
		{
			header : "单位",
			width : 100,
			dataIndex : "unitName"
		},
		{
			header : "开始日期",
			width : 80,
			dataIndex : "startDate"
		},
		{
			header : "结束日期",
			width : 80,
			dataIndex : "endDate"
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
		} ];

		this.cmbCase = new bcm.component.CaseListComboBox(
		{
			xy_InitLoadData : true,
			xy_InitDataID : this.m_CurrentCode,
			xy_ParentObjHandle : this,
			xy_SelectEvent : this.onComboboxCaseSelect
		});
		this.btnAddSpecact = new Ext.Toolbar.Button(
		{
			text : "新增",
			iconCls : "xy-add",
			scope : this,
			disabled : false,
			handler : this.btn_AddSpecactEvent
		});
		this.btnUpdateSpecact = new Ext.Toolbar.Button(
		{
			text : "修改",
			iconCls : "xy-edit",
			scope : this,
			disabled : true,
			handler : this.btn_UpdateSpecactEvent
		});
		this.btnDeleteSpecact = new Ext.Toolbar.Button(
		{
			text : "删除",
			iconCls : "xy-delete",
			scope : this,
			disabled : true,
			handler : this.btn_DeleteSpecactEvent
		});
		this.btnSetScope = new Ext.Toolbar.Button(
		{
			text : "设置应用范围",
			iconCls : "xy-opions",
			scope : this,
			disabled : true,
			handler : this.btn_SetScopeEvent
		});

		this.tbar = [ this.cmbCase, "-",
		              this.btnAddSpecact, "-",
		              this.btnUpdateSpecact, "-",
		              this.btnDeleteSpecact, "-",
		              this.btnSetScope ];

		bcm.basedata.Specact.SpecactColumnTreePanel.superclass.initComponent.call(this);

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
	btn_AddSpecactEvent : function()
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
			parentID : node.attributes.specactID,
			parentCode : node.attributes.specactCode,
			parentName : node.attributes.specactName
		};
		if (node.id == "root")
		{
			entity.parentID = "";
			entity.parentCode = "";
			entity.parentName = "";
		}

		this.m_SpecactEditWin = new bcm.basedata.Specact.SpecactEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.rootReloader.createDelegate(this),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_SpecactEditWin.show();
	},
	btn_UpdateSpecactEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要修改的专项活动！");
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

		this.m_SpecactEditWin = new bcm.basedata.Specact.SpecactEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.rootReloader.createDelegate(this),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_SpecactEditWin.show();
	},
	btn_DeleteSpecactEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要删除的专项活动");
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
			MsgUtil.alert("还有下级专项活动，不能删除");
			return;
		}
		var entity = {};
		Ext.apply(entity, node.attributes);
		entity.loader = undefined;
		entity.__proto__ = undefined;

		var msg = "如果专项活动已发生过业务数据，则不能删除<br>";
		msg += "是否删除所选的专项活动" + entity.text + "?";
		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "yes")
			{
				this.deleteSpecact(entity);
			}
		}, this);
	},
	deleteSpecact : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "bcm/specact/delete",
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
	btn_SetScopeEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要设置的专项活动！");
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

		if (entity.isShare != 1)
		{
			MsgUtil.alert("该专项活动不是全局共享，不能设置应用范围");
			return;
		}

		this.m_SpecactScopeWin = new bcm.basedata.Specact.SpecactScopeWin(
		{
			xy_ParentObjHandle : this,
			xy_Entity : entity
		});
		this.m_SpecactScopeWin.show();
	},
	onTreeClickEvent :  function(node)
	{
		if(node == null)
		{
			this.btnUpdateSpecact.disable();
			this.btnDeleteSpecact.disable();
			this.btnSetScope.disable();
		}
		else if(node.id == "root" && node.attributes.level == "0")
		{
			this.btnUpdateSpecact.disable();
			this.btnDeleteSpecact.disable();
			this.btnSetScope.disable();
		}
		else
		{
			this.btnUpdateSpecact.enable();
			this.btnDeleteSpecact.enable();
			this.btnSetScope.enable();
		}
	},
	rootReloader : function()
	{
		this.root.reload();
	}
});
Ext.reg("bcm_core_basedata_specact_specactcolumntreepanel", bcm.basedata.Specact.SpecactColumnTreePanel);

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "bcm_core_basedata_specact_specactcolumntreepanel",
			xtype : "bcm_core_basedata_specact_specactcolumntreepanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);