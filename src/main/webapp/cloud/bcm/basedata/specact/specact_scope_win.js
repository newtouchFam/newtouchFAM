Ext.namespace("bcm.basedata.Specact");

bcm.basedata.Specact.SpecactScopList = Ext.extend(Ext.grid.GridPanel,
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
			url : "bcm/specactscope/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "caseCode", "caseName",
				          "specactID", "specactCode", "specactName",
				          "unitID", "unitCode", "unitName" ]
		});
		this.store.on("loadexception", ssc.common.StoreLoadExcpetionEvent, this.m_GridStore);
		this.store.baseParams.jsonCondition = Ext.encode(
		{
			caseCode : this.xy_Entity.caseCode,
			specactID : this.xy_Entity.specactID
		});

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});
		this.cm = new Ext.grid.ColumnModel( [ this.sm,
		{
			header : "单位编码",
			dataIndex : "unitCode",
			width : 150,
			sortable : true
		},
		{
			header : "单位名称",
			dataIndex : "unitName",
			width : 200,
			sortable : true
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});

		bcm.basedata.Specact.SpecactScopList.superclass.initComponent.call(this);
	},
	loadStoreData : function()
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

bcm.basedata.Specact.SpecactScopeWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "设置应用范围",
	height : 300,
	width : 450,
	layout : "fit",
	labelAlign : "right",
	maximized : true,
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.Close,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.ToolBar,
	xy_EditMode : ssc.component.DialogEditModeEnum.Update,
	xy_Entity : {},
	initComponent : function()
	{
		this.initUI();

		this.initData();

		bcm.basedata.Specact.SpecactScopeWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.tbar = [
		{
			text : "增加应用范围",
			iconCls : "xy-add",
			scope : this,
			handler : this.btn_AddScopeEvent
		}, "-",
		{
			text : "删除应用范围",
			iconCls : "xy-delete",
			scope : this,
			handler : this.btn_DeleteScopeEvent
		} ];

		this.m_List = new bcm.basedata.Specact.SpecactScopList(
		{
			xy_Entity : this.xy_Entity
		});

		this.items = [ this.m_List ];
	},
	initData : function()
	{
		this.m_List.loadStoreData();
	},
	btn_AddScopeEvent : function()
	{
		this.m_dialog = new sm.component.UnitListDialog(
		{
			xy_PageMode : true,
			xy_MultiSelectMode : true,
			xy_DataActionURL : "bcm/specactscope!getUnSetPage.action",
			xy_FieldList : [ "unitID", "unitCode", "unitName" ],
			xy_ColumnConfig : [
			{
				header : "编码",
				dataIndex : "unitCode",
				width : 80,
				sortable : true,
				xy_Searched : true
			},
			{
				header : "名称",
				dataIndex : "unitName",
				width : 150,
				sortable : true,
				xy_Searched : true
			} ],
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var condition = new ssc.common.BaseCondition();
				condition.addString("caseCode", this.xy_Entity.caseCode);
				condition.addString("specactID", this.xy_Entity.specactID);

				return condition;
			}.createDelegate(this),
			xy_OKClickEvent : function()
			{
				var unitIDs = this.m_dialog.getSelectedID();

				var entity =
				{
					caseCode : this.xy_Entity.caseCode,
					specactID : this.xy_Entity.specactID,
					unitID : unitIDs
				};

				Ext.Ajax.request(
				{
					url : "bcm/specactscope/add",
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
							this.m_List.loadStoreData();
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
		this.m_dialog.show();
	},
	btn_DeleteScopeEvent : function()
	{
		var records = this.m_List.getSelectionModel().getSelections();

		if (records.length <= 0)
		{
			MsgUtil.alert("请先选择要删除应用范围的单位");
			return false;
		}

		var idList = new Array();
		for (var i = 0; i < records.length; i++)
		{
			var entity = records[i].data;
			idList.push(entity.unitID);
		}

		var unitIDs = idList.toString();

		var entity =
		{
			caseCode : this.xy_Entity.caseCode,
			specactID : this.xy_Entity.specactID,
			unitID : unitIDs
		};

		Ext.Ajax.request(
		{
			url : "bcm/specactscope/delete",
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
					this.m_List.loadStoreData();
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