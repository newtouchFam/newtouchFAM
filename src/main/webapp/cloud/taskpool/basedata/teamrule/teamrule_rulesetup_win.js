Ext.namespace("ssc.taskpool.basedata.TeamRule");

/* 实体列表 */
ssc.taskpool.basedata.TeamRule.RuleFactorList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_strRuleID : "",
	m_BusiEntityDialog : null,
	m_FactorDataDialog : null,
	initComponent : function()
	{
		this.tbar = [
		{
			text : "增加条件",
			iconCls : "xy-add",
			handler : this.btn_AddEntityEvent,
			scope : this
		}, "-",
		{
			text : "删除条件",
			iconCls : "xy-delete",
			handler : this.btn_DeleteEntityEvent,
			scope : this
		} ];

		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_FactorAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "factorID",
			           "entityID", "entityCode", "entityName",
			           "operSign", "containSub",
			           "ruleID", "ruleCode", "ruleName" ]
		});

		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(),
		{
			header : "条件参数编码",
			dataIndex : "entityCode",
			width : 100,
			sortable : true
		},
		{
			header : "条件参数名称",
			dataIndex : "entityName",
			width : 125,
			sortable : true
		},
		{
			header : "关系",
			dataIndex : "operSign",
			width : 125,
			sortable : true,
			hidden : true,
			renderer : null
		},
		{
			header : "包含下级",
			dataIndex : "containSub",
			width : 125,
			sortable : true,
			hidden : true,
			renderer : null
		}]);

		ssc.taskpool.basedata.TeamRule.RuleFactorList.superclass.initComponent.call(this);
	},
	loadStoreData : function ()
	{
		var param =
		{
			ruleid : this.m_strRuleID
		};
		this.store.baseParams.jsonCondition = Ext.encode(param);
		this.store.load();
	},
	btn_AddEntityEvent : function()
	{
		this.m_BusiEntityDialog = new ssc.component.BusiEntityListDialog(
		{
			xy_BaseParams :
			{
				ruleid : this.m_strRuleID
			}, 
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.openFactorDataDialog
		});
		this.m_BusiEntityDialog.show();
	},
	openFactorDataDialog : function()
	{
		var strEntityID = this.m_BusiEntityDialog.getSelectedID();

		this.m_FactorDataDialog = new ssc.component.FactorDataListDialog(
		{
			xy_BaseParams :
			{
				entityid : strEntityID
			},
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.addFactor
		});
		this.m_FactorDataDialog.show();
	},
	addFactor : function()
	{
		var strEntityID = this.m_BusiEntityDialog.getSelectedID();
		var strEntityDataIDList = this.m_FactorDataDialog.getSelectedID();

		var factorEntity =
		{
			ruleID : this.m_strRuleID,
			entityID : strEntityID
		};

		var factorDataEntity =
		{
			factorDataID : strEntityDataIDList
		};
		Ext.Ajax.request(
		{
			url : "SSC/ssc_FactorAction!add.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(factorEntity),
				jsonCondition : Ext.encode(factorDataEntity)
			},
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.loadStoreData();
					this.getSelectionModel().selectRow(0);
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			failure : this.baseFailureCallbackFun,
			scope : this
		});
	},
	btn_DeleteEntityEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择需要删除的条件");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		MsgUtil.confirm("是否删除所选的条件[" + entity.entityName + "]?", function(btn, text)
		{
			if (btn == "yes")
			{
				this.deleteFactor(entity);
			}
		}, this);
	},
	deleteFactor : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "SSC/ssc_FactorAction!del.action",
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
					this.loadStoreData();
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			failure : this.baseFailureCallbackFun,
			scope : this
		});
	}
});

/* 实体数据列表 */
ssc.taskpool.basedata.TeamRule.RuleFactorDataList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_FactorList : null,
	m_FactorDataDialog : null,
	initComponent : function()
	{
		this.tbar = [
		{
			text : "增加条件参数",
			iconCls : "xy-add",
			handler : this.btn_AddFactorDataEvent,
			scope : this
		}, "-",
		{
			text : "删除条件参数",
			iconCls : "xy-delete",
			handler : this.btn_DeleteFactorDataEvent,
			scope : this
		} ];

		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_FactorDataAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "factorID", "factorDataID", "factorDataCode",
					"factorDataName", "factorDataParentID" ]
		});
		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});
		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(), this.sm,
		{
			header : "条件参数编码",
			dataIndex : "factorDataCode",
			width : 100,
			sortable : true
		},
		{
			header : "条件参数名称",
			dataIndex : "factorDataName",
			width : 125,
			sortable : true
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});

		ssc.taskpool.basedata.TeamRule.RuleFactorDataList.superclass.initComponent.call(this);
	},
	loadStoreData : function()
	{
		var record = this.m_FactorList.getSelectionModel().getSelected();
		var strFactorID = "";
		var strEntityID = "";
		if (null == record)
		{
			strFactorID = "";
			strEntityID = "";
		}
		else
		{
			strFactorID = record.get("factorID");
			strEntityID = record.get("entityID");
		}

		var param =
		{
			factorid : strFactorID,
			entityid : strEntityID
		};

		this.store.baseParams.jsonCondition = Ext.encode(param);

		this.store.load(
		{
			params :
			{
				start : this.getBottomToolbar().cursor,
				limit : this.getBottomToolbar().pageSize
			}
		});
	},
	btn_AddFactorDataEvent : function()
	{
		var record = this.m_FactorList.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请先选择已有的条件!");
			return;
		}
		var strFactorID = record.get("factorID");
		var strEntityID = record.get("entityID");

		this.m_FactorDataDialog = new ssc.component.FactorDataListDialog(
		{
			xy_BaseParams :
			{
				factorid : strFactorID,
				entityid : strEntityID
			},
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.addFactorData
		});
		this.m_FactorDataDialog.show();
	},
	addFactorData : function()
	{
		var record = this.m_FactorList.getSelectionModel().getSelected();
		var strFactorID = record.get("factorID");
		var strEntityDataIDList = this.m_FactorDataDialog.getSelectedID();

		var entity =
		{
			factorID : strFactorID,
			factorDataID : strEntityDataIDList
		};

		Ext.Ajax.request(
		{
			url : "SSC/ssc_FactorDataAction!add.action",
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
					this.loadStoreData();
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			failure : this.baseFailureCallbackFun,
			scope : this
		});		
	},
	btn_DeleteFactorDataEvent : function()
	{
		var records = this.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择要删除的条件参数");
			return;
		}

		MsgUtil.confirm("请确认是否删除所选的[" + records.length.toString() + "]项条件参数?", function(btn, text)
		{
			if (btn == "no")
			{
				return;
			}
			else if (btn == "yes")
			{
				this.deleteFactorData(records);
			}
		}, this);
	},
	deleteFactorData : function(records)
	{
		var strFactorID = records[0].data.factorID;
		var factorDataIDArray = [];
		for ( var i = 0; i < records.length; i++)
		{
			factorDataIDArray.push(records[i].data.factorDataID);
		}
		var entity =
		{
			factorID : strFactorID,
			factorDataID : factorDataIDArray.toString()
		};

		Ext.Ajax.request(
		{
			url : "SSC/ssc_FactorDataAction!del.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(entity)
			},
			success : function(response)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.loadStoreData();
				}
				else
				{
					Ext.Msg.alert("提示", data.msg, function()
					{
						this.loadStoreData();
					}, this);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	}
});

/* 规则参数设置窗体 */
ssc.taskpool.basedata.TeamRule.RuleSetupWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "规则参数设置",
	width : 600,
	height : 450,
	layout : "border",
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.Close,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.None,
	xy_Entity : {},
	m_FactorList : null,
	m_FactorDataList : null,
	initComponent : function()
	{
		this.initUI();

		this.initData();

		ssc.taskpool.basedata.TeamRule.RuleSetupWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtRuleCode = new Ext.form.TextField(
		{
			fieldLabel : "规则编码",
			disabled : true
		});
		this.edtRuleName = new Ext.form.TextField(
		{
			fieldLabel : "规则名称",
			disabled : true
		});
		this.edtRemark = new Ext.form.TextArea(
		{
			fieldLabel : "备注",
			disabled : true,
			height : 50,
			grow : false
		});
		this.edtRuleCode.setReadOnly(true);
		this.edtRuleName.setReadOnly(true);
		this.edtRemark.setReadOnly(true);

		this.m_FactorList = new ssc.taskpool.basedata.TeamRule.RuleFactorList(
		{
			title : "已设置条件",
			m_strRuleID : this.xy_Entity.ruleID
		});
		this.m_FactorDataList = new ssc.taskpool.basedata.TeamRule.RuleFactorDataList(
		{
			title : "已设置条件参数",
			m_FactorList : this.m_FactorList
		});
		this.m_FactorList.on("rowclick", this.m_FactorDataList.loadStoreData, this.m_FactorDataList);
		this.m_FactorList.store.on("load", this.m_FactorDataList.loadStoreData, this.m_FactorDataList);

		this.items = [
		{
			region : "north",
			frame : true,
			autoHeight : true,
			layout : "column",
			items : [
			{
				columnWidth : 0.5,
				layout : "form",
				labelAlign : "right",
				labelWidth : 60,
				defaults :
				{
					width : 200
				},
				items : [ this.edtRuleCode, this.edtRuleName ]
			},
			{
				columnWidth : 0.5,
				layout : "form",
				labelAlign : "right",
				labelWidth : 60,
				defaults :
				{
					width : 200
				},
				items : [ this.edtRemark ]
			} ]
		},
		{
			region : "west",
			layout : "fit",
			width : 250,
			split : true,
			items : this.m_FactorList
		},
		{
			region : "center",
			layout : "fit",
			split : true,
			items : this.m_FactorDataList
		} ];
	},
	initData : function()
	{
		this.edtRuleCode.setValue(this.xy_Entity.ruleCode);
		this.edtRuleName.setValue(this.xy_Entity.ruleName);
		this.edtRemark.setValue(this.xy_Entity.remark);

		this.m_FactorList.loadStoreData();
	}	
});