Ext.namespace("bcm.config.GlobalParam");

bcm.config.GlobalParam.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "fit",
	m_DataStore : null,	/*后台数据集*/
	m_LoadMask : null,
	initComponent : function()
	{
		this.tbar = [
		{
			text : "保存全部",
			iconCls : "xy-save",
			handler : this.btn_SaveAllEvent,
			scope : this
		}, "-",
		{
			text : "清除修改",
			iconCls : "xy-edit",
			handler : this.btn_RevertAllEvent,
			scope : this
		}];

		this.cmbMultiCase = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "同一年启用多个预算方案",
			xy_DataArray : [ [ 0, "未启用" ], [ 1, "启用" ] ],
			xy_AllowClear : false
		});
		this.cmbMiddleControl = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "启用中间级控制",
			xy_DataArray : [ [ 0, "未启用" ], [ 1, "启用" ] ],
			xy_AllowClear : false
		});
		this.cmbSpecact = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "启用专项控制",
			xy_DataArray : [ [ 0, "未启用" ], [ 1, "启用" ] ],
			xy_AllowClear : false
		});
		this.cmbSpecactDistribute = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "专项控制分解方式",
			xy_DataArray : [ [ 0, "不分解" ], [ 1, "分解到预算项目" ], [ 2, "分解到责任中心" ], [ 3, "分解到组合代码" ] ],
			xy_AllowClear : false
		});
		this.cmbApplyMatch = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "申请与报账预算项目不匹配",
			xy_DataArray : [ [ 0, "允许不匹配" ], [ 1, "必须匹配" ] ],
			xy_AllowClear : false
		});
		this.cmbCentralType = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "归口控制级别",
			xy_DataArray : [ [ 0, "核算单位" ], [ 1, "组合代码（责任中心与预算项目组合）" ] ],
			xy_AllowClear : false
		});
		this.cmbBudgetSumType = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "预算金额合计控制方式",
			xy_DataArray : [ [ 0, "不控制" ], [ 1, "必须相等" ], [ 2, "不大于表单总金额" ] ],
			xy_AllowClear : false
		});
		this.cmbSpecactSumType = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "专项活动金额合计控制方式",
			xy_DataArray : [ [ 0, "不控制" ], [ 1, "必须相等" ], [ 2, "不大于表单总金额" ] ],
			xy_AllowClear : false
		});
		this.cmbGlobalPolicyLevel = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "全局控制策略级别",
			xy_DataArray : [ [ 0, "预算方案" ], [ 1, "核算单位" ] ],
			xy_AllowClear : false
		});
		this.cmbDetailPolicyLevel = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "明细控制策略级别",
			xy_DataArray : [ [ 0, "预算项目" ], [ 1, "组合代码（责任中心与预算项目组合）" ] ],
			xy_AllowClear : false
		});

		this.formpanelMain = new Ext.FormPanel(
		{
			frame : true,
			border : true,
			autoWidth : true,
			labelWidth : 150,
			labelAlign : "right",
			layout : "column",
			items : [
			{
				columnWidth : 0.5,
				layout : "form",
				defaults :
				{
					width : 220
				},
				items : [ this.cmbMultiCase,
				          this.cmbMiddleControl,
				          this.cmbSpecact,
				          this.cmbSpecactDistribute,
				          this.cmbApplyMatch,
				          this.cmbCentralType ]
			},
			{
				columnWidth : 0.5,
				layout : "form",
				defaults :
				{
					width : 220
				},
				items : [ this.cmbBudgetSumType,
				          this.cmbSpecactSumType,
				          this.cmbGlobalPolicyLevel,
				          this.cmbDetailPolicyLevel ]
			} ]
		});

		this.tabpanelMain = new Ext.TabPanel(
		{
			plain : false,
			activeTab : 0,
			items : [
			{
				title : "全局预算控制策略和设置",
				closable : false,
				layout : "fit",
				items : [ this.formpanelMain ]
			} ]
		});
		this.items = [ this.tabpanelMain ];

		bcm.config.GlobalParam.MainPanel.superclass.initComponent.call(this);

		this.initDataStore();

		this.loadStoreData();
	},
	initDataStore : function()
	{
		this.m_DataStore = new Ext.data.JsonStore(
		{
			url : "bcm/globalparam/list",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "code", "paramString", "paramInt", "paramNumber", "status", "remark" ]
		});
	},
	loadStoreData : function()
	{
		this.m_LoadMask = new Ext.LoadMask(window.document.body,
		{
			msg : "正在读取配置数据，请稍候！",
			removeMask : true
		});
		this.m_LoadMask.show();

		this.m_DataStore.load(
		{
			callback : this.parserParam,
			scope : this
		});
	},
	parserParam : function(recordarray, options, success)
	{
		for (var i = 0; i < recordarray.length; i++)
		{
			var record = recordarray[i];

			if (record.data["code"] == "BCM_MULTI_CASE")
			{
				this.cmbMultiCase.setKeyValue(record.data["paramInt"]);
			}
			if (record.data["code"] == "BCM_MIDDLE_CONTROL")
			{
				this.cmbMiddleControl.setKeyValue(record.data["status"]);
			}
			if (record.data["code"] == "BCM_SPECACT")
			{
				this.cmbSpecact.setKeyValue(record.data["paramInt"]);
			}
			if (record.data["code"] == "BCM_SPECACT_DISTRIBUTE")
			{
				this.cmbSpecactDistribute.setKeyValue(record.data["paramInt"]);
			}
			if (record.data["code"] == "BCM_APPLY_MATCH")
			{
				this.cmbApplyMatch.setKeyValue(record.data["paramInt"]);
			}
			if (record.data["code"] == "BCM_CENTRAL_TYPE")
			{
				this.cmbCentralType.setKeyValue(record.data["paramInt"]);
			}
			if (record.data["code"] == "BCM_BUDGET_SUM_TYPE")
			{
				this.cmbBudgetSumType.setKeyValue(record.data["paramInt"]);
			}
			if (record.data["code"] == "BCM_SPECACT_SUM_TYPE")
			{
				this.cmbSpecactSumType.setKeyValue(record.data["paramInt"]);
			}
			if (record.data["code"] == "BCM_GLOBAL_POLICY_LEVEL")
			{
				this.cmbGlobalPolicyLevel.setKeyValue(record.data["paramInt"]);
			}
			if (record.data["code"] == "BCM_DETAIL_POLICY_LEVEL")
			{
				this.cmbDetailPolicyLevel.setKeyValue(record.data["paramInt"]);
			}
		}

		this.m_LoadMask.hide();
	},
	btn_SaveAllEvent : function()
	{
		MsgUtil.confirm("是否保存所有的修改项？", function(btn, text)
		{
			if (btn == "yes")
			{
				this.saveAllParam();
			}
		}, this);
	},
	saveAllParam : function()
	{
		this.m_LoadMask = new Ext.LoadMask(window.document.body,
		{
			msg : "正在保存配置数据，请稍候！",
			removeMask : true
		});
		this.m_LoadMask.show();

		var paramlist = new Array();

		var param = new bcm.config.GlobalParam.GlobalParamEntity("BCM_MULTI_CASE");
		param.setInt(this.cmbMultiCase.getKeyValue());
		paramlist.push(param);

		param = new bcm.config.GlobalParam.GlobalParamEntity("BCM_MIDDLE_CONTROL");
		param.setStatus(this.cmbMiddleControl.getKeyValue());
		paramlist.push(param);

		param = new bcm.config.GlobalParam.GlobalParamEntity("BCM_SPECACT");
		param.setInt(this.cmbSpecact.getKeyValue());
		paramlist.push(param);

		param = new bcm.config.GlobalParam.GlobalParamEntity("BCM_SPECACT_DISTRIBUTE");
		param.setInt(this.cmbSpecactDistribute.getKeyValue());
		paramlist.push(param);

		param = new bcm.config.GlobalParam.GlobalParamEntity("BCM_APPLY_MATCH");
		param.setInt(this.cmbApplyMatch.getKeyValue());
		paramlist.push(param);

        param = new bcm.config.GlobalParam.GlobalParamEntity("BCM_CENTRAL_TYPE");
		param.setInt(this.cmbCentralType.getKeyValue());
		paramlist.push(param);

  		param = new bcm.config.GlobalParam.GlobalParamEntity("BCM_BUDGET_SUM_TYPE");
  		param.setInt(this.cmbBudgetSumType.getKeyValue());
  		paramlist.push(param);

  		param = new bcm.config.GlobalParam.GlobalParamEntity("BCM_SPECACT_SUM_TYPE");
  		param.setInt(this.cmbSpecactSumType.getKeyValue());
  		paramlist.push(param);

  		param = new bcm.config.GlobalParam.GlobalParamEntity("BCM_GLOBAL_POLICY_LEVEL");
  		param.setInt(this.cmbGlobalPolicyLevel.getKeyValue());
  		paramlist.push(param);

  		param = new bcm.config.GlobalParam.GlobalParamEntity("BCM_DETAIL_POLICY_LEVEL");
  		param.setInt(this.cmbDetailPolicyLevel.getKeyValue());
  		paramlist.push(param);

		Ext.Ajax.request(
		{
			url : "bcm/globalparam/updateall",
			method : "post",
			params :
			{
				jsonString : Ext.encode(paramlist)
			},
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);

				if (data.success)
				{
					MsgUtil.alert("保存完成");
					this.m_LoadMask.hide();
					return;
				}
				else
				{
					MsgUtil.alert(data.msg);
					this.m_LoadMask.hide();
					return;
				}
			},
			failure : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				MsgUtil.alert(data.msg);
				this.m_LoadMask.hide();
			},
			scope : this
		});
	},
	btn_RevertAllEvent : function()
	{
		MsgUtil.confirm("将清除所有的修改，恢复到保存前设置。是否继续？", function(btn, text)
		{
			if (btn == "yes")
			{
				this.loadStoreData();
			}
		}, this);
	}
});
Ext.reg("bcm_core_config_globalparam_mainpanel", bcm.config.GlobalParam.MainPanel);

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "bcm_core_config_globalparam_mainpanel",
			xtype : "bcm_core_config_globalparam_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);