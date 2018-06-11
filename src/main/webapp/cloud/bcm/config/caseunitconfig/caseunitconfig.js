Ext.namespace("com.freesky.ssc.bcm.config.CaseUnitConfig");

CaseUnitConfig=com.freesky.ssc.bcm.config.CaseUnitConfig;

/**
 * 年份选择
 * @class com.freesky.ssc.bcm.config.CaseUnitConfig.combo
 * @extends Ext.form.ComboBox
 */
CaseUnitConfig.CaseYearCombo=com.freesky.ssc.bcm.common.CaseYearCombo;

/**
 * 查询窗口
 * @class com.freesky.ssc.bcm.config.CaseUnitConfig.queryWindows
 * @extends Ext.Window
 */
CaseUnitConfig.queryWindows = Ext.extend(Ext.Window,
{
	title : '查询',
	modal : true,
	initComponent : function()
	{
		
		this.yearCombo = new CaseUnitConfig.CaseYearCombo(
		{
			fieldLabel : "方案",
			isInit : true
		});
		this.periodCombo = new bcm.component.CtrlPeriodComboBox(
		{
			fieldLabel : "控制周期",
			xy_isInit : true,
			xy_hasAll : true
		});
		this.attrCombo = new bcm.component.CtrlAttrComboBox(
		{
			fieldLabel : "控制属性",
			xy_isInit : true,
			xy_hasAll : true
		});
		this.periodActCombo = new bcm.component.CtrlPeriodComboBox(
		{
			fieldLabel : "专项控制周期",
			xy_isInit : true,
			xy_hasAll : true
		});
		this.attrActCombo = new bcm.component.CtrlAttrComboBox(
		{
			fieldLabel : "专项控制属性",
			xy_isInit : true,
			xy_hasAll : true
		});
		
		this.yearCombo.store.load();
		
		Ext.apply(this,
		{
			layout : 'form',
			labelAlign : 'right',
			items : [ this.yearCombo, this.periodCombo, this.attrCombo, this.periodActCombo, this.attrActCombo ],
			buttons : [
			{
				text : '查询',
				handler : this.query,
				scope : this.main
			},
			{
				text : '关闭',
				handler : this.close,
				scope : this
			} ]

		});
		
		CaseUnitConfig.queryWindows.superclass.initComponent.call(this);
	}
});

/**
 * Grid
 * @class com.freesky.ssc.bcm.config.CaseUnitConfig.CaseUnitGridPanel
 * @extends Ext.grid.GridPanel
 */
CaseUnitConfig.CaseUnitGridPanel=Ext.extend(Ext.grid.EditorGridPanel,{
	
	stripeRows :true,
	autoWidth: true,
	autoScroll: true,
	enableColumnMove: false,
	enableHdMenu: false,
	autoScroll:true,
	loadMask:true,
	initComponent:function(){
		this.store=new Ext.data.JsonStore({
					url : "BCM/caseUnitConfigAction!list.action",
					root : "data",
					method : "post",
					totalProperty:'total',
					fields : [
							  "casename",
							  "vardescription",
							  "casecode",
							  "unitid",
							  "iscentral_ctrltype",
							  "ctrltype",
							  "iscentral_ctrlperiod",
							  "ctrlperiod",
							  "iscentral_ctrlattr",
							  "ctrlattr",
							  "iscentral_warnpercent",
							  "warnpercent",
							  "iscentral_alwpercent",
							  "alwpercent",
							  "iscentral_detailpercent",
							  "detailpercent",
							  "iscentral_ctrltype_act",
							  "ctrltype_act",
							  "iscentral_ctrlperiod_act",
							  "ctrlperiod_act",
							  "iscentral_ctrlattr_act",
							  "ctrlattr_act"							  
					]
		});
		
		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : true,
			handleMouseDown : Ext.emptyFn
		});
		
		this.cm = new Ext.grid.ColumnModel( [
		{
			header : "预算方案",
			dataIndex : "casename",
			width : 150,
			sortable : true
		},
		{
			header : "公司名称",
			dataIndex : "vardescription",
			width : 250,
			sortable : true
		},
		{
			header : "统一控制方式",
			dataIndex : "iscentral_ctrltype",
			width : 80,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "控制方式",
			dataIndex : "ctrltype",
			width : 60,
			renderer : bcm.render.CtrlType,
			editor : new bcm.component.CtrlTypeComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "统一控制周期",
			dataIndex : "iscentral_ctrlperiod",
			width : 80,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "控制周期",
			dataIndex : "ctrlperiod",
			width : 60,
			renderer : bcm.render.CtrlPeriod,
			editor : new bcm.component.CtrlPeriodComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "统一控制属性",
			dataIndex : "iscentral_ctrlattr",
			width : 80,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "控制属性",
			dataIndex : "ctrlattr",
			width : 60,
			renderer : bcm.render.CtrlAttr,
			editor : new bcm.component.CtrlAttrComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "统一告警率",
			dataIndex : "iscentral_warnpercent",
			width : 80,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "告警率",
			dataIndex : "warnpercent",
			width : 60,
			renderer : ssc.common.RenderUtil.Percent100,
			editor : new Ext.form.NumberField(),
			align : "center",
			sortable : true
		},
		{
			header : "统一容差率",
			dataIndex : "iscentral_alwpercent",
			width : 80,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "容差率",
			dataIndex : "alwpercent",
			width : 60,
			renderer : ssc.common.RenderUtil.Percent100,
			editor : new Ext.form.NumberField(),
			align : "center",
			sortable : true
		},
		{
			header : "统一明细率",
			dataIndex : "iscentral_detailpercent",
			width : 80,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "明细率",
			dataIndex : "detailpercent",
			width : 60,
			renderer : ssc.common.RenderUtil.Percent100,
			editor : new Ext.form.NumberField(),
			align : "center",
			sortable : true
		},
		{
			header : "统一专项方式",
			dataIndex : "iscentral_ctrltype_act",
			width : 80,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "专项控制方式",
			dataIndex : "ctrltype_act",
			width : 80,
			renderer : bcm.render.CtrlType,
			editor : new bcm.component.CtrlTypeComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "统一专项周期",
			dataIndex : "iscentral_ctrlperiod_act",
			width : 80,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "专项控制周期",
			dataIndex : "ctrlperiod_act",
			width : 80,
			renderer : bcm.render.CtrlPeriod,
			editor : new bcm.component.CtrlPeriodComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "统一专项属性",
			dataIndex : "iscentral_ctrlattr_act",
			width : 80,
			renderer : ssc.common.RenderUtil.YesOrNo,
			editor : new ssc.component.YesNoComboBox(),
			align : "center",
			sortable : true
		},
		{
			header : "专项控制属性",
			dataIndex : "ctrlattr_act",
			width : 80,
			renderer : bcm.render.CtrlAttr,
			editor : new bcm.component.CtrlAttrComboBox(),
			align : "center",
			sortable : true
		} ]);

		this.bbar = new Ext.PagingToolbar(
		{
			store : this.store,
			pageSize : 20
		});
		
		CaseUnitConfig.CaseUnitGridPanel.superclass.initComponent.call(this);
	
	},
	load:function(){
		this.store.load({
			params:{
				start:0,
				limit:20
			}
		});
	},
	save:function(){
		
		var records=this.store.getModifiedRecords();
		if(null==records||0==records.length){
			return;
		}
		
		Ext.Msg.show({
		   title:'提示',
		   msg: '是否保存修改?',
		   buttons: Ext.Msg.YESNOCANCEL,
		   scope:this,
		   fn:function(btn,text){
		
			if(btn == 'no'){
				this.store.reload();
				this.store.commitChanges();
				return;
			}else if(btn=="yes"){
				this.saveit();
			}
		}
		});
		
	},saveit:function(){
	
			var rds=[];
			var records=this.store.getModifiedRecords();
			for(var i=0,size=records.length;i<size;i++){
				var rd={};
				rd.casecode=records[i].get("casecode");
				rd.unitid=records[i].get("unitid");
				rd.iscentral_ctrltype=records[i].get('iscentral_ctrltype');
				rd.ctrltype=records[i].get('ctrltype');
				rd.iscentral_ctrlperiod=records[i].get('iscentral_ctrlperiod');
				rd.ctrlperiod=records[i].get('ctrlperiod');
				rd.iscentral_ctrlattr=records[i].get('iscentral_ctrlattr');
				rd.ctrlattr=records[i].get('ctrlattr');
				rd.iscentral_warnpercent=records[i].get('iscentral_warnpercent');
				rd.warnpercent=records[i].get('warnpercent');
				rd.iscentral_alwpercent=records[i].get('iscentral_alwpercent');
				rd.alwpercent=records[i].get('alwpercent');
				rd.iscentral_detailpercent=records[i].get('iscentral_detailpercent');
				rd.detailpercent=records[i].get('detailpercent');
				rd.iscentral_ctrltype_act=records[i].get('iscentral_ctrltype_act');
				rd.ctrltype_act=records[i].get('ctrltype_act');
				rd.iscentral_ctrlperiod_act=records[i].get('iscentral_ctrlperiod_act');
				rd.ctrlperiod_act=records[i].get('ctrlperiod_act');
				rd.iscentral_ctrlattr_act=records[i].get('iscentral_ctrlattr_act');
				rd.ctrlattr_act=records[i].get('ctrlattr_act');
				rds.push(rd);
			}
				
			Ext.Ajax.request(
		{
			url : 'BCM/caseUnitConfigAction!save.action',
			method : 'post',
			params :
			{
				records : Ext.encode(rds)
			},
			success : function(response)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					Ext.Msg.alert("提示", "更新成功!");
					this.store.reload();
					this.store.commitChanges();
				}
				else
				{
					Ext.Msg.alert("提示", data.error, function()
					{
						this.store.reload();
						this.store.commitChanges();
					}, this);
				}
			},
			failure : function(response)
			{
				var data = Ext.decode(response.responseText);
				Ext.Msg.alert(data.error);
				this.store.reload();
				this.store.commitChanges();
			},
			scope : this
		});
	}
});

/**
 * 布局
 * 
 * @class com.freesky.ssc.bcm.config.CaseUnitConfig.layout
 * @extends Ext.Panel
 */
CaseUnitConfig.layout=Ext.extend(Ext.Panel,{
	screenWidth:screen.width,
	initComponent: function(){
	
		this.caseUnitGridPanel=new CaseUnitConfig.CaseUnitGridPanel({
			main:this
		});
		

		Ext.apply(this,{
			layout:'fit',
			items:this.caseUnitGridPanel,
			tbar:[{
				text:'查询',
				iconCls:'xy-browser',
				handler:this.query,
				scope:this
			},'-',{
				text:'保存修改',
				iconCls:'xy-save',
				handler:this.save,
				scope:this
			}]
		
		});
		
		this.query();
		CaseUnitConfig.layout.superclass.initComponent.call(this);
	},
	load:function(){
		
		var year=this.queryWindow.yearCombo.getValue();
		if(year=='--'){
			this.caseUnitGridPanel.store.baseParams.year=null;
		}else{
			this.caseUnitGridPanel.store.baseParams.year=year;
		}
		
		var period=this.queryWindow.periodCombo.getValue();
		if(period=='--'){
			this.caseUnitGridPanel.store.baseParams.ctrlperiod=null;
		}else{
			this.caseUnitGridPanel.store.baseParams.ctrlperiod=period;
		}
		
		var attr=this.queryWindow.attrCombo.getValue();
		if(attr=='--'){
			this.caseUnitGridPanel.store.baseParams.ctrlattr=null;
		}else{
			this.caseUnitGridPanel.store.baseParams.ctrlattr=attr;
		}
		
		var periodAct=this.queryWindow.periodActCombo.getValue();
		if(periodAct=='--'){
			this.caseUnitGridPanel.store.baseParams.ctrlperiodact=null;
		}else{
			this.caseUnitGridPanel.store.baseParams.ctrlperiodact=periodAct;
		}
		
		var attrAct= this.queryWindow.attrActCombo.getValue();
		if(attrAct=='--'){
			this.caseUnitGridPanel.store.baseParams.ctrlattract=null;
		}else{
			this.caseUnitGridPanel.store.baseParams.ctrlattract=attrAct;
		}
		
		this.caseUnitGridPanel.load();
		this.queryWindow.close();
		
	},
	query:function(){
		
		this.queryWindow=new CaseUnitConfig.queryWindows({
			width:320,
			height:210,
			main:this,
			query:this.load
		});
		
		this.queryWindow.show();
	},
	save:function(){
		this.caseUnitGridPanel.save();
	}

});
Ext.reg("caseunitconfig_layout",CaseUnitConfig.layout);


function init()
{
	var m_view = new Ext.Viewport({
				layout: 'fit',
				items: [{
					    id:'caseunitconfig_layout',
						xtype: 'caseunitconfig_layout'
				}]
			});

}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);


