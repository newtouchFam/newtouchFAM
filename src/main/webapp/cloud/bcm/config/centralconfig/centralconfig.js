Ext.namespace("com.freesky.ssc.bcm.config.CentralConfig");

CentralConfig=com.freesky.ssc.bcm.config.CentralConfig;

CentralConfig.CompanyCombo=com.freesky.ssc.bcm.common.CompanyComboFilterTree;

CentralConfig.CaseYearCombo=com.freesky.ssc.bcm.common.CaseYearCombo;

CentralConfig.IndexComboFilterTree=com.freesky.ssc.bcm.common.IndexComboFilterTree;

CentralConfig.StatusCombo=com.freesky.ssc.bcm.common.YesNoCombo;

CentralConfig.IndexTree=com.freesky.ssc.bcm.common.IndexTree;

CentralConfig.NewCentralConfigWindows=Ext.extend(Ext.Window,{
	modal:true,
	initComponent:function(){
	
		this.respText=new Ext.form.TextField({
			fieldLabel:'责任单位',
			disabled:true,
			editable:false,
			width:250,
			value:this.respValue
		});
		
		if(this.update){
		
			this.indexCombo =new CentralConfig.IndexComboFilterTree({
				fieldLabel:'预算项目',
				baseParams:{
					casecode:this.casecode
				},
				winHeight:250,
				expandAll:false,
				notLeafFilterExpand:true
			})
		
		}else{
			this.indexTree=new CentralConfig.IndexTree({
				fieldLabel:'预算项目',
				baseParams:{
					casecode:this.casecode
				},
				winHeight:200,
				expandAll:false,
				notLeafFilterExpand:true,
				region:'center',
				checkUI:true,
				border:false
			})
			this.indexCombo=new Ext.Panel({
				width:380,
				height:200,
				border:false,
				layout:'border',
				items:[new Ext.form.Label({text:'预算项目:',region:'west',width:102}),this.indexTree]	
			})		
		}
		
		this.moneyCombo=new Freesky.Common.XyMoneyField({
			fieldLabel:'设置归口金额',
			width:250,
			value:0
		});

		this.statusCombo=new CentralConfig.StatusCombo({
			fieldLabel:'启用',
			width:100,
			isInit:true,
			width:100
		});

		if(this.record){
			this.moneyCombo.setValue(this.record.get('centralmoney'));
			this.statusCombo.setValue(this.record.get('status'));
			this.indexCombo.setValue('['+this.record.get('indexcode')+']'+this.record.get('indexname'));
			this.indexCombo.setHiddenValue(this.record.get('indexid'));
			this.oldindexid=this.record.get('indexid');
		}
		
		Ext.apply(this,{
			layout:'form',
			labelAlign:'right',
//			defaults:{width:250},
//			closeAction:'hide',
			items:[
				this.respText,
				this.indexCombo,
				this.moneyCombo,
				this.statusCombo
			],
			title:this.update?'修改归口设置:'+'['+this.record.get('indexcode')+']'+this.record.get('indexname'):'新增归口设置',
			buttons:[{
				text:this.update?'修改':'新增',
				handler:this.update?this.updateit:this.save,
				scope:this
			},{
				text:'关闭',
				handler:this.close,
				scope:this
			}]
		});
		
		CentralConfig.NewCentralConfigWindows.superclass.initComponent.call(this);
		
	},save:function(){
		this.main.save();
	},clear:function(){
		this.indexCombo.clearValue();
		this.moneyCombo.setValue(null);
		this.statusCombo.clearValue();
	},updateit:function(){
		this.main.updateit();
	}
})

CentralConfig.respGridPanel=Ext.extend(Ext.grid.GridPanel,{
	stripeRows :true,
	autoWidth: true,
	autoScroll: true,
	enableColumnMove: false,
	enableHdMenu: false,
	autoScroll:true,
	loadMask:true,
	initComponent:function(){
		
		this.store=new Ext.data.JsonStore({
					url : "BCM/centralConfigAction!getRespList.action",
					root : "data",
					method : "post",
					totalProperty:'total',
					fields:[
						"respnid",
						"respnname",
						"fullcode",
						"respncode",
						"unitid",
						"countsize"
					]
					})
		
		this.sm=new Ext.grid.CheckboxSelectionModel({
			singleSelect:true
		});
		
		this.cm=new Ext.grid.ColumnModel([
				{
					header: "责任中心编码",
					dataIndex: "respncode",
					width:150,
					sortable:true
				},
				{
					header: "责任中心名称",
					dataIndex: "respnname",
					width:175,
					sortable:true
				},
				{
					header: "已设置",
					dataIndex: "countsize",
					textAlign:'rigth',
					width:50,
					renderer:function(value){
						if(value==0){
							return "否"
						}else{
							return value;
						}
					},
					sortable:true
				}
			]);
			
			this.bbar=new Ext.PagingToolbar({
				store:this.store,
				pageSize:20
			});			
			
			
		
		CentralConfig.respGridPanel.superclass.initComponent.call(this);	
	
	},load:function(){
		var casecode=this.caseYearCombo.getValue();
		
		if(Ext.isEmpty(casecode)){
			Ext.Msg.alert('提示','请选择方案!');				
			return;
		}
		
		var unitid=this.companyCombo.getValue();
		if(Ext.isEmpty(unitid)){
			Ext.Msg.alert('提示','请选择单位!');				
			return;
		}

		this.store.baseParams.casecode=casecode;
		this.store.baseParams.unitid=unitid;
		this.store.load({
			params:{
				start:0,
				limit:20
			}
		});
	}
})

CentralConfig.indexGridPanel=Ext.extend(Ext.grid.GridPanel,{
	stripeRows :true,
	autoWidth: true,
	autoScroll: true,
	enableColumnMove: false,
	enableHdMenu: false,
	autoScroll:true,
	loadMask:true,
	initComponent:function(){
		
			this.store=new Ext.data.JsonStore({
						url : "BCM/centralConfigAction!list.action",
						root : "data",
						method : "post",
						totalProperty:'total',
						fields : [
							"indexcode",
							"indexname",
							"indexid",
							"centralrespnid",
							"casecode",
							"centralmoney",
							"status"
						]					
			})
			
			this.sm=new Ext.grid.CheckboxSelectionModel({
				singleSelect:false,
				handleMouseDown: Ext.emptyFn
			});
		
			this.cm=new Ext.grid.ColumnModel([this.sm,{
					header: "归口预算项目编码",
					dataIndex: "indexcode",
					width:150,
					sortable:true
				},{
					header: "归口预算项目名称",
					dataIndex: "indexname",
					width:200,
					sortable:true
				},{
					header: "归口金额",
					dataIndex: "centralmoney",
					width:125,
					renderer:cnMoney,
					align:'right',
					sortable:true
				},{
					header: "状态",
					dataIndex: "status",
					width:50,
					renderer:effect,
					sortable:true
				}
			]);
			
			this.bbar=new Ext.PagingToolbar({
				store:this.store,
				pageSize:20
			});			
			
			
		this.respGridPanel.on("rowclick",this.load,this);
		this.respGridPanel.store.on("load",this.clear,this);
		
		CentralConfig.indexGridPanel.superclass.initComponent.call(this);	
	},load:function(){
		
		var record=this.respGridPanel.getSelectionModel().getSelected();
		
		if(Ext.isEmpty(record)){
			Ext.Msg.alert('提示','请选择责任中心!');
			return;
		}
		
		var casecode=this.caseYearCombo.getValue();
		var unitid=this.companyCombo.getValue();
		
		this.store.baseParams.casecode=casecode;
		this.store.baseParams.unitid=unitid;
		this.store.baseParams.respid=record.get('respnid');
		this.store.load({
			params:{
				start:0,
				limit:20
			}
		});
		
	},clear:function(){
		
		this.store.removeAll();
		this.store.baseParams={};
		
	},add:function(){
		
		var record=this.respGridPanel.getSelectionModel().getSelected();
		
		if(Ext.isEmpty(record)){
			Ext.Msg.alert('提示','请选择责任中心!');
			return;
		}
		var casecode=this.caseYearCombo.getValue();
		
		if(Ext.isEmpty(casecode)){
			Ext.Msg.alert('提示','请选择预算方案!');
			return;
		}
		
		this.addWindow=new  CentralConfig.NewCentralConfigWindows({
			width:400,
			height:375,
			respValue:record.get('respnname'),
			casecode:casecode,
			y:50,
			main:this
		});
		this.addWindow.show();

	},save:function(){
		
		var record=this.respGridPanel.getSelectionModel().getSelected();
		
		if(Ext.isEmpty(record)){
			Ext.Msg.alert('提示','请选择责任中心!');
			return;
		}
		var casecode=this.caseYearCombo.getValue();
		
		if(Ext.isEmpty(casecode)){
			Ext.Msg.alert('提示','请选择预算方案!');
			return;
		}
		
		var nodes = this.addWindow.indexTree.getChecked();
		if (nodes.length <= 0){
			Ext.Msg.alert("提示","请选择需要设置的预算项目!");
			return;
		}
		
		var money=this.addWindow.moneyCombo.getValue();
		if(Ext.isEmpty(money)){
			Ext.Msg.alert('提示','请设置归口金额!');
			return;
		}
		var status=this.addWindow.statusCombo.getValue();
		if(Ext.isEmpty(status)){
			Ext.Msg.alert('提示','请设置启用状态!');
			return;
		}
		
		var nodess=[];
		
		for(var i=0,size=nodes.length;i<size;i++){
			var node=nodes[i];
			nodess.push({id:node.id,name:node.text});
		}
		
		Ext.Ajax.request({
			scope:this,
			method: 'post',
			url:'BCM/centralConfigAction!save.action',
			params:{
				unitid:record.get('unitid'),
				casecode:casecode,
				respid:record.get('respnid'),
				records:Ext.encode(nodess),
				money:money,
				status:status
			},success:function(response){
				
				var data = Ext.decode(response.responseText);
				
				if (data.success){
//					Ext.Msg.alert("提示","新增成功!");
					this.store.reload();
					this.respGridPanel.store.reload();
					this.addWindow.close();
				}else{
					Ext.Msg.alert("提示",data.error);
				}
				
			},failure: function(response){
				var data = Ext.decode(response.responseText);
				Ext.Msg.alert(data.error);
				this.store.reload();
				this.respGridPanel.store.reload();
			}
		})
		
	},del:function(){
		
		var records =this.getSelectionModel().getSelections(); 
		
		if(null==records||0==records.length){
			Ext.Msg.alert('提示','请先选择记录!');
			return;			
		}
		
		Ext.Msg.show({
		   title:'提示',
		   msg: '是否删除所选记录?',
		   buttons: Ext.Msg.YESNO,
		   scope:this,
		   fn:function(btn,text){
		
			if(btn == 'no'){
				return;
			}else if(btn=="yes"){
				this.delit();
			}
		}
		});
	},delit:function(){
		
		var records =this.getSelectionModel().getSelections(); 
		
		if(null==records||0==records.length){
			return;			
		}
		
		var rds=[];
		for(var i=0;i<records.length;i++){
			var rd={};
			rd.casecode=records[i].get('casecode');
			rd.indexid=records[i].get('indexid');
			rd.centralrespnid=records[i].get('centralrespnid');
			rds.push(rd);
		}
		
		Ext.Ajax.request({
			scope:this,
			method: 'post',
			url:'BCM/centralConfigAction/delete',
			params:{
				records:Ext.encode(rds)
			},success:function(response){
				
				var data = Ext.decode(response.responseText);
				
				if (data.success){
//					Ext.Msg.alert("提示","删除成功!");
					this.store.reload();
					this.respGridPanel.store.reload();
				}else{
					Ext.Msg.alert("提示",data.error);
				}
				
			},failure: function(response){
				var data = Ext.decode(response.responseText);
				Ext.Msg.alert(data.error);
				this.store.reload();
				this.respGridPanel.store.reload();
			}
		})		
		
	},update:function(){
		
		var records =this.getSelectionModel().getSelections(); 
		
		if(null==records||0==records.length){
			Ext.Msg.alert('提示','请先选择归口项目记录!');
			return;			
		}

		if(1<records.length){
			Ext.Msg.alert('提示','只能选择一条归口项目进行设置!');
			return;			
		}
		
		var record=this.respGridPanel.getSelectionModel().getSelected();
		if(Ext.isEmpty(record)){
			Ext.Msg.alert('提示','请选择责任中心!');
			return;
		}
		
		this.addWindow=new CentralConfig.NewCentralConfigWindows({
			width:400,
			height:175,
			respValue:record.get('respnname'),
			casecode:records[0].get('casecode'),
			y:50,
			main:this,
			record:records[0],
			update:true
		});
		this.addWindow.show();
		
	},updateit:function(){
		
		var record=this.respGridPanel.getSelectionModel().getSelected();
		
		if(Ext.isEmpty(record)){
			Ext.Msg.alert('提示','请选择责任中心!');
			return;
		}
		var casecode=this.caseYearCombo.getValue();
		
		if(Ext.isEmpty(casecode)){
			Ext.Msg.alert('提示','请选择预算方案!');
			return;
		}
		
		var indexid=this.addWindow.indexCombo.getValue();
		if(Ext.isEmpty(indexid)){
			Ext.Msg.alert('提示','请设置预算项目!');
			return;
		}
		var money=this.addWindow.moneyCombo.getValue();
		if(Ext.isEmpty(money)){
			Ext.Msg.alert('提示','请设置归口金额!');
			return;
		}
		var status=this.addWindow.statusCombo.getValue();
		if(Ext.isEmpty(status)){
			Ext.Msg.alert('提示','请设置启用状态!');
			return;
		}
		
		Ext.Ajax.request({
			scope:this,
			method: 'post',
			url:'BCM/centralConfigAction/update',
			params:{
				unitid:record.get('unitid'),
				casecode:casecode,
				respid:record.get('respnid'),
				indexid:indexid,
				oldindexid:this.addWindow.oldindexid,
				money:money,
				status:status
			},success:function(response){
		
				var data = Ext.decode(response.responseText);
				
				if (data.success){
//					Ext.Msg.alert("提示","更新成功!");
					this.store.reload();
					this.addWindow.close();
					
				}else{
					Ext.Msg.alert("提示",data.error);
				}
				
			},failure: function(response){
				var data = Ext.decode(response.responseText);
				this.store.reload();
				Ext.Msg.alert(data.error);
			}
		})
		
	}
})

CentralConfig.layout=Ext.extend(Ext.Panel,{
	screenWidth:screen.width,
	initComponent: function(){

		this.caseYearCombo=new CentralConfig.CaseYearCombo({
			isInit:true	
		})
		
		this.companyCombo=new CentralConfig.CompanyCombo({
			expandAll:false
		});
		
		this.companyCombo.on('valueChange',this.query,this);
		
		this.respGridPanel=new CentralConfig.respGridPanel({
			caseYearCombo:this.caseYearCombo,
			companyCombo:this.companyCombo
		});
		
		this.indexGridPanel=new CentralConfig.indexGridPanel({
			respGridPanel:this.respGridPanel,
			caseYearCombo:this.caseYearCombo,
			companyCombo:this.companyCombo
		});
		
		this.caseYearCombo.store.load();
		
		Ext.apply(this,{
			layout:'fit',
			items:[{
				layout:'border',
				tbar:[{
						text:'新增归口设置',
						iconCls:'xy-save',
						handler:this.insert,
						scope:this
					},'-',{
						text:'修改归口设置',
						iconCls:'xy-browser',
						handler:this.update,
						scope:this
					},'-',{
						text:'删除归口设置',
						iconCls:'xy-delete',
						handler:this.del,
						scope:this
				}],
				items:[{
				region:'west',
				width:400,
				split:true,
				layout:'fit',
				items:this.respGridPanel
				},{
					region:'center',
					layout:'fit',
					items:this.indexGridPanel
				}]}],
			tbar:['方案:',this.caseYearCombo,'单位:',this.companyCombo]
		});
		
		CentralConfig.layout.superclass.initComponent.call(this);
		
	},query:function(){
		this.respGridPanel.load();
	},save:function(){
		this.indexGridPanel.save();
	},del:function(){
		this.indexGridPanel.del();
	},insert:function(){
		this.indexGridPanel.add();
	},update:function(){
		this.indexGridPanel.update();
	}
})
Ext.reg("centralconfig_layout",CentralConfig.layout);

function init()
{
	var m_view = new Ext.Viewport({
				layout: 'fit',
				items: [{
					    id:'centralconfig_layout',
						xtype: 'centralconfig_layout'
				}]
			});

}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);