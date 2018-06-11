Ext.namespace("bcm.config.ComboCode");

bcm.config.ComboCode.ComboCodeList = Ext.extend(Ext.grid.EditorGridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	border : false,
	xy_ParentObjHandle : null,
	initComponent : function()
	{
		this.store = new Ext.data.JsonStore(
		{
			url : "BCM/bcm_ComboCodeAction/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "isSet", "caseCode", "caseName", "codeID",
			           "respnID", "respnCode", "respnName",
			           "indexID", "indexCode", "indexName",
			           "ctrlType", "ctrlPeriod", "ctrlAttr",
			           "warnPercent", "alwPercent", "detailPercent",
			           "isApply",
			           "centralRespnID", "centralRespnCode", "centralRespnName",
			           "centralMoney" ]
		});

		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : false,
			handleMouseDown : Ext.emptyFn
		});

		this.cmbRespn = new bcm.component.RespnTreeComboBox(
		{
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					casecode : this.xy_ParentObjHandle.cmbCase.getKeyValue(),
					unitid : Ext.get("m8_companyid").dom.value,
					textfield : "[,respnCode,],respnName"
				};
				return param;
			}.createDelegate(this)
		});

		var columnModelConfig = [ new Ext.grid.RowNumberer(), this.sm,
		{
			header : "已设置",
			dataIndex : "isSet",
			width : 45,
			renderer : ssc.common.RenderUtil.YesOrNo_FocusRedNo,
			align : "center",
			sortable : false
		},
		{
			header : "责任中心编码",
			dataIndex : "respnCode",
			width : 120,
			sortable : false
		},
		{
			header : "责任中心名称",
			dataIndex : "respnName",
			width : 150,
			sortable : false
		},
		{
			header : "预算项目编码",
			dataIndex : "indexCode",
			width : 120,
			sortable : false
		},
		{
			header : "预算项目名称",
			dataIndex : "indexName",
			width : 150,
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("控制方式"),
			dataIndex : "ctrlType",
			width : 60,
			renderer : bcm.render.CtrlType,
			editor : new bcm.component.CtrlTypeComboBox(),
			align : "center",
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("控制周期"),
			dataIndex : "ctrlPeriod",
			width : 60,
			renderer : bcm.render.CtrlPeriod,
			editor : new bcm.component.CtrlPeriodComboBox(),
			align : "center",
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("控制属性"),
			dataIndex : "ctrlAttr",
			width : 60,
			renderer : bcm.render.CtrlAttr,
			editor : new bcm.component.CtrlAttrComboBox(),
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("告警率"),
			dataIndex : "warnPercent",
			width : 60,
			renderer : ssc.common.RenderUtil.Percent100,
			editor : new Ext.form.NumberField(),
			align : "center",
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("容差率"),
			dataIndex : "alwPercent",
			width : 60,
			renderer : ssc.common.RenderUtil.Percent100,
			editor : new Ext.form.NumberField(),
			align : "center",
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("明细率"),
			dataIndex : "detailPercent",
			width : 60,
			renderer : ssc.common.RenderUtil.Percent100,
			editor : new Ext.form.NumberField(),
			align : "center",
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("事前申请"),
			dataIndex : "isApply",
			width : 60,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : false
		},
		{
			header : "归口管理责任中心",
			dataIndex : "centralRespnName",
			width : 120,
			editor : this.cmbRespn,
			sortable : false
		},
		{
			header : "归口金额上限",
			dataIndex : "centralMoney",
			width : 80,
			renderer : ssc.common.FormatUtil.Money,
			editor : new Ext.form.NumberField(),
			align : "right",
			sortable : false
		} ];

		this.cm = new Ext.grid.ColumnModel(columnModelConfig);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store,
			xy_PageSizeList : [ 50, 100, 200, 500, 1000 ]
		});
		this.on("bodyresize", this.onBodyResize);
		this.store.xy_PagingToolBar = this.bbar;
		this.store.on("load", ssc.common.NumberColumnWidthAdjust, this);

		bcm.config.ComboCode.ComboCodeList.superclass.initComponent.call(this);

		this.on("afteredit", this.onAfterEditEvent, this);
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
	},
	onAfterEditEvent : function(e
		/*	{grid,
			record,
			field,
			value,
			originalValue,
			row,
			column}*/)
	{
		if (e.grid.getColumnModel().getDataIndex(e.column) == "centralRespnName")
		{
			e.record.set("centralRespnID", e.value[this.cmbRespn.valueField]);
			e.record.set("centralRespnName", e.value[this.cmbRespn.displayField]);
		}
	}
});

bcm.config.ComboCode.BatchUpdateList = Ext.extend(Ext.grid.EditorGridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	border : false,
	xy_ParentObjHandle : null,
	initComponent : function()
	{
		this.store = new Ext.data.SimpleStore(
		{
			fields : [ "ctrlType", "ctrlPeriod", "ctrlAttr",
			           "warnPercent", "alwPercent", "detailPercent",
			           "isApply", "centralRespnID", "centralRespnCode", "centralRespnName", "centralMoney" ],
			data:[ ["", "", "", "", "", "", "", "", "", "", ""] ]
		});

		this.cmbRespn = new bcm.component.RespnTreeComboBox(
		{
			xy_ParentObjHandle : this,
			prepareBaseParams : function()
			{
				var param =
				{
					casecode : this.xy_ParentObjHandle.cmbCase.getKeyValue(),
					unitid : Ext.get("m8_companyid").dom.value,
					textfield : "[,respnCode,],respnName"
				};
				return param;
			}.createDelegate(this),
			getValue : function()
			{
				if (this.value != null)
				{
					return this.value[this.displayField];
				}
			},
			setValue : function(v)
			{
		        var text = v;
				if (this.valueField)
				{
					var r = this.findRecord(this.valueField, v);
					if (r)
					{
						text = r.data[this.displayField];
					}
					else if (this.valueNotFoundText !== undefined)
					{
						text = this.valueNotFoundText;
					}
					else
					{
						text = v[this.displayField];
					}
				}
				this.lastSelectionText = text;
				if (this.hiddenField)
				{
					this.hiddenField.value = v;
				}
				Ext.form.ComboBox.superclass.setValue.call(this, text);
				this.value = v;
			}
		});

		var columnModelConfig = [
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("控制方式"),
			dataIndex : "ctrlType",
			width : 60,
			renderer : bcm.render.CtrlType,
			editor : new bcm.component.CtrlTypeComboBox(),
			align : "center",
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("控制周期"),
			dataIndex : "ctrlPeriod",
			width : 60,
			renderer : bcm.render.CtrlPeriod,
			editor : new bcm.component.CtrlPeriodComboBox(),
			align : "center",
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("控制属性"),
			dataIndex : "ctrlAttr",
			width : 60,
			renderer : bcm.render.CtrlAttr,
			editor : new bcm.component.CtrlAttrComboBox(),
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("告警率"),
			dataIndex : "warnPercent",
			width : 60,
			renderer : ssc.common.RenderUtil.Percent100,
			editor : new Ext.form.NumberField(),
			align : "center",
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("容差率"),
			dataIndex : "alwPercent",
			width : 60,
			renderer : ssc.common.RenderUtil.Percent100,
			editor : new Ext.form.NumberField(),
			align : "center",
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("明细率"),
			dataIndex : "detailPercent",
			width : 60,
			renderer : ssc.common.RenderUtil.Percent100,
			editor : new Ext.form.NumberField(),
			align : "center",
			sortable : false
		},
		{
			header : ssc.common.StringUtil.setKeyFieldLabel("事前申请"),
			dataIndex : "isApply",
			width : 60,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : false
		},
		{
			header : "归口管理责任中心",
			dataIndex : "centralRespnName",
			width : 120,
			editor : this.cmbRespn,
			sortable : false
		},
		{
			header : "归口金额上限",
			dataIndex : "centralMoney",
			width : 80,
			renderer : ssc.common.FormatUtil.Money,
			editor : new Ext.form.NumberField(),
			align : "right",
			sortable : false
		} ];

		this.cm = new Ext.grid.ColumnModel(columnModelConfig);

		bcm.config.ComboCode.BatchUpdateList.superclass.initComponent.call(this);
	}
});

bcm.config.ComboCode.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "border",
	m_CurrentCode : "",
	m_ComboCodeList : null,
	m_BatchUpdateList : null,
	initComponent : function()
	{
		this.getCurrentCode();

		this.cmbCase = new bcm.component.CaseListComboBox(
		{
			width : 120,
			xy_InitLoadData : true,
			xy_InitDataID : this.m_CurrentCode,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function()
			{
				this.tgfieldRespn.clearSelections();
				this.tgfieldIndex.clearSelections();
				this.btn_QueryEvent();
			}
		});

		this.tgfieldRespn = new bcm.component.RespnTreeField(
		{
			width : 200,
			emptyText : "请选择或输入",
			xy_LeafOnly : false,
			xy_MultiSelectMode : true,
			xy_ParentObjHandle : this,
			xy_AllowInput : true,
			prepareBaseParams : function()
			{
				var param =
				{
					casecode : this.cmbCase.getKeyValue(),
					unitid : Ext.get("m8_companyid").dom.value,
					textfield : "[,respnCode,],respnName"
				};
				return param;
			}.createDelegate(this)
		});

		this.tgfieldIndex = new bcm.component.IndexTreeField(
		{
			width : 200,
			emptyText : "请选择或输入",
			xy_LeafOnly : false,
			xy_MultiSelectMode : true,
			xy_ParentObjHandle : this,
			xy_AllowInput : true,
			prepareBaseParams : function()
			{
				var param =
				{
					casecode : this.cmbCase.getKeyValue(),

					textfield : "[,indexCode,],indexName"
				};
				return param;
			}.createDelegate(this)
		});

		this.tbar = [ "预算方案:", this.cmbCase, "-",
		              "责任中心:", this.tgfieldRespn, "-",
		              "预算项目:", this.tgfieldIndex, "-",
		{
			text : "查询",
			iconCls : "xy-view-select",
			handler : this.btn_QueryEvent,
			scope : this
		} ];

		this.btnSaveAll = new Ext.Toolbar.SplitButton(
		{
			text : "全部保存",
			iconCls : "xy-save",
			scope : this,
			menu :
			{
				items : [
				{
					text : "当页修改行",
					handler : function()
					{
						this.btn_SaveAllEvent("modify");
					},
					scope : this
				},
				{
					text : "当页勾选行",
					handler : function()
					{
						this.btn_SaveAllEvent("select");
					},
					scope : this
				},
				{
					text : "当页全部行",
					handler : function()
					{
						this.btn_SaveAllEvent("thispage");
					},
					scope : this
				}]
			}
		});
		this.btnSaveAll.on("click", function(_This, e)
		{
			if (_This.menu && !_This.menu.isVisible() && !_This.ignoreNextClick)
			{
				_This.showMenu();
			}
			_This.fireEvent("arrowclick", _This, e);
			if (_This.arrowHandler)
			{
				_This.arrowHandler.call(_This.scope || _This, _This, e);
			}
		}, this);

		var tbar = new Ext.Toolbar(
		{
			items : [
			{
				text : "批量设置",
				iconCls : "xy-edit",
				handler : this.btn_BatchUpdateEvent,
				scope : this
			}, "-", this.btnSaveAll ]
		});

		this.m_ComboCodeList = new bcm.config.ComboCode.ComboCodeList(
		{
			xy_ParentObjHandle : this
		});
		this.m_BatchUpdateList = new bcm.config.ComboCode.BatchUpdateList(
		{
			xy_ParentObjHandle : this
		});

		this.items = [
		{
			region : "north",
			layout : "fit",
			height : 48,
			items : this.m_BatchUpdateList
		},
		{
			region : "center",
			layout : "fit",
			items : this.m_ComboCodeList
		} ];

		var param =
		{
			casecode : this.m_CurrentCode,
			unitid : Ext.get("m8_companyid").dom.value
		};
		this.m_ComboCodeList.loadStoreData(param);

		bcm.config.ComboCode.MainPanel.superclass.initComponent.call(this);

		this.on("render", function()
		{
			tbar.render(this.tbar);
		});
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
	btn_QueryEvent : function()
	{
		if (this.tgfieldRespn.getSelectedCount() > 100)
		{
			MsgUtil.alert("您已选择了【" + this.tgfieldRespn.getSelectedCount().toString() + "】个责任中心，一次选择请不要超过100个");
			return;
		}
		if (this.tgfieldIndex.getSelectedCount() > 100)
		{
			MsgUtil.alert("您已选择了【" + this.tgfieldIndex.getSelectedCount().toString() + "】个预算项目，一次选择请不要超过100个");
			return;
		}

		var param = new ssc.common.BaseCondition();
		param.addString("casecode", this.cmbCase.getKeyValue());
		param.addString("unitid", Ext.get("m8_companyid").dom.value);
		if (this.tgfieldRespn.getSelected())
		{
			param.addString("respnid", this.tgfieldRespn.getSelectedID());
		}
		else if (this.tgfieldRespn.getInputed())
		{
			param.addString("respntext", this.tgfieldRespn.getValue());
		}
		if (this.tgfieldIndex.getSelected())
		{
			param.addString("indexid", this.tgfieldIndex.getSelectedID());
		}
		else if (this.tgfieldIndex.getInputed())
		{
			param.addString("indextext", this.tgfieldIndex.getValue());
		}

		this.m_ComboCodeList.loadStoreData(param);
	},
	btn_BatchUpdateEvent : function()
	{
		var modifyRecord = this.m_BatchUpdateList.getStore().getAt(0);

		if (modifyRecord.data.warnPercent > 100 || modifyRecord.data.warnPercent < 0)
		{
			var msg = "批量设置栏内告警率不得超过100%或低于0%";
			MsgUtil.alert(msg);
			return;
		}

		if (modifyRecord.data.warnPercent < 0)
		{
			var msg = "批量设置栏内容差率不得低于0%";
			MsgUtil.alert(msg);
			return;
		}

		if (modifyRecord.data.detailPercent > 100 || modifyRecord.data.detailPercent < 0)
		{
			var msg = "批量设置栏内明细率不得超过100%或低于0%";
			MsgUtil.alert(msg);
			return;
		}

		var records = this.m_ComboCodeList.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			MsgUtil.alert("请先选择需要批量设置的记录");
			return;
		}

		for ( var i = 0; i< records.length; i++)
		{
			for ( var prop in modifyRecord.data)
			{
				if (! ssc.common.StringUtil.isEmpty(modifyRecord.get(prop).toString())
						&& modifyRecord != 0)
				{
					records[i].set(prop, modifyRecord.get(prop));
				}
			}
		}
	},
	/**
	 * type
	 * modify:当页修改行
	 * select:当页勾选行
	 * thispage:当页全部行
	 */
	btn_SaveAllEvent : function(type)
	{
		var records = [];
		if (type == "modify")
		{
			records = this.m_ComboCodeList.getStore().getModifiedRecords();
			if (null == records || records.length <= 0)
			{
				MsgUtil.alert("当前页没有修改过的行");
				return;
			}
		}
		else if (type == "select")
		{
			records = this.m_ComboCodeList.getSelectionModel().getSelections();
			if (null == records || records.length <= 0)
			{
				MsgUtil.alert("请选择记录");
				return;
			}
		}
		else if (type == "thispage")
		{
			if (this.m_ComboCodeList.getStore().getCount() <= 0)
			{
				MsgUtil.alert("当前页没有记录");
				return;
			}

			for (var i = 0; i < this.m_ComboCodeList.getStore().getCount(); i++)
			{
				records.push(this.m_ComboCodeList.getStore().getAt(i));
			}
		}
		else
		{
			return;
		}

		var recordList = [];
		for (var i = 0; i < records.length; i++)
		{
			var record = records[i];
			var pageindex = this.m_ComboCodeList.getStore().indexOf(record);
			var index = this.m_ComboCodeList.getBottomToolbar().xy_Current + pageindex + 1;

			if (record.data.warnPercent > 100 || record.data.warnPercent < 0)
			{
				var msg = "第" + index.toString() + "行【" + record.data.respnCode + "】【" + record.data.respnName + "】";
				msg += "【" + record.data.indexCode + "】【" + record.data.indexName + "】";
				msg += "告警率不得超过100%或低于0%";
				MsgUtil.alert(msg);
				return;
			}

			if (record.data.warnPercent < 0)
			{
				var msg = "第" + index.toString() + "行【" + record.data.respnCode + "】【" + record.data.respnName + "】";
				msg += "【" + record.data.indexCode + "】【" + record.data.indexName + "】";
				msg += "容差率不得低于0%";
				MsgUtil.alert(msg);
				return;
			}

			if (record.data.detailPercent > 100 || record.data.detailPercent < 0)
			{
				var msg = "第" + index.toString() + "行【" + record.data.respnCode + "】【" + record.data.respnName + "】";
				msg += "【" + record.data.indexCode + "】【" + record.data.indexName + "】";
				msg += "明细率不得超过100%或低于0%";
				MsgUtil.alert(msg);
				return;
			}

			recordList.push(record.data);
		}

		var msg = "";
		if (type == "modify")
		{
			msg = "是否要保存当页修改的【" + recordList.length.toString() + "】行组合代码记录？";
		}
		else if (type == "select")
		{
			msg = "是否要保存当页勾选的【" + recordList.length.toString() + "】行组合代码记录？";
		}
		else if (type == "thispage")
		{
			msg = "是否要保存当页全部【" + recordList.length.toString() + "】行组合代码记录？";
		}
		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "yes")
			{
				this.saveComboCode(recordList);
			}
		}, this);
	},
	saveComboCode : function(recordList)
	{
		Ext.Ajax.request(
		{
			url : "BCM/bcm_ComboCodeAction!saveAll.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(recordList)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.btn_QueryEvent();
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
Ext.reg("bcm_core_config_period_mainpanel", bcm.config.ComboCode.MainPanel);

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
			id : "bcm_core_config_period_mainpanel",
			xtype : "bcm_core_config_period_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);