Ext.namespace("com.freesky.ssc.bcm.config.FormatIndexConfig");

FormatIndexConfig=com.freesky.ssc.bcm.config.FormatIndexConfig;

FormatIndexConfig.CaseYearCombo=com.freesky.ssc.bcm.common.CaseYearCombo;

FormatIndexConfig.IndexComboFilterTree=com.freesky.ssc.bcm.common.IndexComboFilterTree;

FormatIndexConfig.StatusCombo=com.freesky.ssc.bcm.common.YesNoCombo;

FormatIndexConfig.IndexTreeByFormatIndex=com.freesky.ssc.bcm.common.IndexTreeByFormatIndex;

FormatIndexConfig.NewCentralConfigWindows=Ext.extend(Ext.Window,{
	modal:true,
	initComponent:function()
	{	
		this.respText=new Ext.form.TextField({
			fieldLabel:'编制项目名称',
			disabled:true,
			editable:false,
			width:250,
			value:this.formIndexValue
		});
		
		if(this.update)
		{		
			this.indexCombo =new FormatIndexConfig.IndexComboFilterTree({
				fieldLabel:'预算项目',
				baseParams:{
					casecode:this.casecode
				},
				winHeight:250,
				expandAll:false,
				notLeafFilterExpand:true
			})		
		}
		else
		{
			this.indexTree=new FormatIndexConfig.IndexTreeByFormatIndex({
				fieldLabel:'预算项目',
				url:'BCM/specActManagerAction!getUnSelIndexList.action',
				baseParams:{
					casecode:this.casecode,
					formindexid:this.formindexid
				},
				winHeight:200,
				expandAll:false,
				notLeafFilterExpand:true,
				region:'center',
				checkUI:false,
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

		this.statusCombo=new FormatIndexConfig.StatusCombo({
			fieldLabel:'启用',
			width:100,
			isInit:true,
			width:100
		});

		if(this.record)
		{			
			this.statusCombo.setValue(this.record.get('status'));
			this.indexCombo.setValue('['+this.record.get('indexcode')+']'+this.record.get('indexname'));
			this.indexCombo.setHiddenValue(this.record.get('indexid'));
			this.oldindexid=this.record.get('indexid');
		}
		
		Ext.apply(this,{
			layout:'form',
			labelAlign:'right',
			//defaults:{width:250},
			//closeAction:'hide',
			items:[
				this.respText,
				this.indexCombo,				
				this.statusCombo
			],
			title:this.update?'修改编制项目设置:'+'['+this.record.get('indexcode')+']'+this.record.get('indexname'):'新增编制项目设置',
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
		
		FormatIndexConfig.NewCentralConfigWindows.superclass.initComponent.call(this);
		
	},
	save:function()
	{
		this.main.save();
	},
	clear:function()
	{
		this.indexCombo.clearValue();		
		this.statusCombo.clearValue();
	},
	updateit:function()
	{
		this.main.updateit();
	}
})

FormatIndexConfig.respGridPanel=Ext.extend(Ext.grid.GridPanel,{
	stripeRows :true,
	autoWidth: true,
	autoScroll: true,
	enableColumnMove: false,
	enableHdMenu: false,
	autoScroll:true,
	loadMask:true,
	initComponent:function()
	{		
		this.store=new Ext.data.JsonStore({
					url : "BCM/formatIndexConfigAction!getFormatIndexList.action",
					root : "data",
					method : "post",
					totalProperty:'total',
					fields:[
						"formindexid",
						"formindexname",
						"fullcode",
						"formindexcode",
						"countsize"
					]
					});
		
		this.sm=new Ext.grid.CheckboxSelectionModel({
			singleSelect:true
		});
		
		this.cm=new Ext.grid.ColumnModel([
				{
					header: "编制项目编码",
					dataIndex: "formindexcode",
					width:150,
					sortable:true
				},
				{
					header: "编制项目名称",
					dataIndex: "formindexname",
					width:175,
					sortable:true
				},
				{
					header: "已设置",
					dataIndex: "countsize",
					textAlign:'rigth',
					width:50,
					renderer:function(value){
						if(value==0)
						{
							return "否"
						}
						else
						{
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
		
		FormatIndexConfig.respGridPanel.superclass.initComponent.call(this);	
	
	},
	load:function()
	{
		var casecode=this.caseYearCombo.getValue();
		//alert(casecode);
		
		/*if(Ext.isEmpty(casecode))
		{
			Ext.Msg.alert('提示','请选择方案!');				
			return;
		}*/	

		this.store.baseParams.casecode=casecode;		
		this.store.load({
			params:{
				start:0,
				limit:20
			}
		});
	}
})

FormatIndexConfig.indexGridPanel=Ext.extend(Ext.grid.GridPanel,{
	stripeRows :true,
	autoWidth: true,
	autoScroll: true,
	enableColumnMove: false,
	enableHdMenu: false,
	autoScroll:true,
	loadMask:true,
	initComponent:function(){
		
			this.store=new Ext.data.JsonStore({
						url : "BCM/formatIndexConfigAction!list.action",
						root : "data",
						method : "post",
						totalProperty:'total',
						fields : [
							"indexcode",
							"indexname",
							"indexid",
							"formatindexid",
							"casecode",
							"status"
						]					
			})
			
			this.sm=new Ext.grid.CheckboxSelectionModel({
				singleSelect:false,
				handleMouseDown: Ext.emptyFn
			});
		
			this.cm=new Ext.grid.ColumnModel([this.sm,{
					header: "预算项目编码",
					dataIndex: "indexcode",
					width:150,
					sortable:true
				},{
					header: "预算项目名称",
					dataIndex: "indexname",
					width:200,
					sortable:true
				},{
					header: "状态",
					dataIndex: "status",
					width:50,
					renderer:function(value){
						if(value==0)
						{
							return "无效"
						}
						else
						{
							return "有效";
						}
					},
					sortable:true
				}
			]);
			
			this.bbar=new Ext.PagingToolbar({
				store:this.store,
				pageSize:20
			});			
			
			
		this.respGridPanel.on("rowclick",this.load,this);
		this.respGridPanel.store.on("load",this.clear,this);
		
		FormatIndexConfig.indexGridPanel.superclass.initComponent.call(this);	
	},
	load:function()
	{
		
		var record=this.respGridPanel.getSelectionModel().getSelected();
		
		if(Ext.isEmpty(record)){
			Ext.Msg.alert('提示','请选择编制项目!');
			return;
		}
		
		var casecode=this.caseYearCombo.getValue();		
		
		this.store.baseParams.casecode=casecode;
		this.store.baseParams.formindexid=record.get('formindexid');
		this.store.load({
			params:{
				start:0,
				limit:20
			}
		});
		
	},
	clear:function()
	{		
		this.store.removeAll();
		this.store.baseParams={};
		
	},
	add:function()
	{		
		var record=this.respGridPanel.getSelectionModel().getSelected();
		
		if(Ext.isEmpty(record))
		{
			Ext.Msg.alert('提示','请选择编制项目!');
			return;
		}
		var casecode=this.caseYearCombo.getValue();
		
		if(Ext.isEmpty(casecode))
		{
			Ext.Msg.alert('提示','请选择预算方案!');
			return;
		}
		
		this.addWindow=new  FormatIndexConfig.NewCentralConfigWindows({
			width:400,
			height:375,
			formIndexValue:record.get('formindexname'),
			formindexid:record.get('formindexid'),
			casecode:casecode,
			y:50,
			main:this
		});
		this.addWindow.show();

	},
	save:function()
	{		
		var record=this.respGridPanel.getSelectionModel().getSelected();
		
		if(Ext.isEmpty(record))
		{
			Ext.Msg.alert('提示','请选择编制项目!');
			return;
		}
		var casecode=this.caseYearCombo.getValue();
		
		if(Ext.isEmpty(casecode))
		{
			Ext.Msg.alert('提示','请选择预算方案!');
			return;
		}
		
		var nodes = this.addWindow.indexTree.getChecked();
		if (nodes.length <= 0)
		{
			Ext.Msg.alert("提示","请选择需要设置的预算项目!");
			return;
		}		
		
		var status=this.addWindow.statusCombo.getValue();
		if(Ext.isEmpty(status))
		{
			Ext.Msg.alert('提示','请设置启用状态!');
			return;
		}
		
		var nodess=[];
		
		for(var i=0,size=nodes.length;i<size;i++)
		{
			var node=nodes[i];
			nodess.push({id:node.id,name:node.text});
		}
		
		Ext.Ajax.request({
			scope:this,
			method: 'post',
			url:'BCM/formatIndexConfigAction!save.action',
			params:{				
				casecode:casecode,
				formindexid:record.get('formindexid'),
				records:Ext.encode(nodess),
				status:status
			},
			success:function(response)
			{
				
				var data = Ext.decode(response.responseText);
				
				if (data.success)
				{
					this.store.reload();
					this.respGridPanel.store.reload();
					this.addWindow.close();
				}
				else
				{
					Ext.Msg.alert("提示",data.error);
				}
				
			},
			failure: function(response)
			{
				var data = Ext.decode(response.responseText);
				Ext.Msg.alert(data.error);
				this.store.reload();
				this.respGridPanel.store.reload();
			}
		})
		
	},
	del:function()
	{		
		var records =this.getSelectionModel().getSelections(); 
		
		if(null==records||0==records.length)
		{
			Ext.Msg.alert('提示','请先选择预算对应设置记录!');
			return;			
		}
		
		Ext.Msg.show({
		   title:'提示',
		   msg: '是否删除所选记录?',
		   buttons: Ext.Msg.YESNO,
		   scope:this,
		   fn:function(btn,text)
		   {		
				if(btn == 'no')
				{
					return;
				}
				else if(btn=="yes")
				{
					this.delit();
				}
		   }
		});
	},
	delit:function()
	{		
		var records =this.getSelectionModel().getSelections(); 
		
		if(null==records||0==records.length)
		{
			return;			
		}
		
		var rds=[];
		for(var i=0;i<records.length;i++)
		{
			var rd={};
			rd.casecode=records[i].get('casecode');
			rd.indexid=records[i].get('indexid');
			rd.formatindexid=records[i].get('formatindexid');
			rds.push(rd);
		}
		
		Ext.Ajax.request({
			scope:this,
			method: 'post',
			url:'BCM/formatIndexConfigAction/delete',
			params:{
				records:Ext.encode(rds)
			},
			success:function(response)
			{				
				var data = Ext.decode(response.responseText);
				
				if (data.success)
				{
					this.store.reload();
					this.respGridPanel.store.reload();
				}
				else
				{					
					Ext.Msg.alert("提示",data.error);
				}				
			},
			failure: function(response)
			{
				var data = Ext.decode(response.responseText);
				Ext.Msg.alert(data.error);
				this.store.reload();
				this.respGridPanel.store.reload();
			}
		})		
		
	},
	update:function()
	{		
		var records =this.getSelectionModel().getSelections(); 
		
		if(null==records||0==records.length)
		{
			Ext.Msg.alert('提示','请先选择预算项目记录!');
			return;			
		}

		if(1<records.length)
		{
			Ext.Msg.alert('提示','只能选择一条预算项目进行设置!');
			return;			
		}
		
		var record=this.respGridPanel.getSelectionModel().getSelected();
		if(Ext.isEmpty(record))
		{
			Ext.Msg.alert('提示','请选择编制项目!');
			return;
		}
		
		this.addWindow=new FormatIndexConfig.NewCentralConfigWindows({
			width:400,
			height:175,
			formIndexValue:record.get('formindexname'),
			formindexid:record.get('formindexid'),
			casecode:records[0].get('casecode'),
			y:50,
			main:this,
			record:records[0],
			update:true
		});
		this.addWindow.show();
		
	},
	updateit:function()
	{		
		var record=this.respGridPanel.getSelectionModel().getSelected();
		
		if(Ext.isEmpty(record))
		{
			Ext.Msg.alert('提示','请选择编制项目!');
			return;
		}
		var casecode=this.caseYearCombo.getValue();
		
		if(Ext.isEmpty(casecode))
		{
			Ext.Msg.alert('提示','请选择预算方案!');
			return;
		}
		
		var indexid=this.addWindow.indexCombo.getValue();
		if(Ext.isEmpty(indexid))
		{
			Ext.Msg.alert('提示','请设置预算项目!');
			return;
		}
		
		var status=this.addWindow.statusCombo.getValue();
		if(Ext.isEmpty(status))
		{
			Ext.Msg.alert('提示','请设置启用状态!');
			return;
		}
		
		Ext.Ajax.request({
			scope:this,
			method: 'post',
			url:'BCM/formatIndexConfigAction/update',
			params:{				
				casecode:casecode,
				formindexid:record.get('formindexid'),
				indexid:indexid,
				oldindexid:this.addWindow.oldindexid,
				status:status
			},
			success:function(response)
			{		
				var data = Ext.decode(response.responseText);
				
				if (data.success)
				{
					this.store.reload();
					this.addWindow.close();
					
				}
				else
				{
					Ext.Msg.alert("提示",data.error);
				}				
			},
			failure: function(response)
			{
				var data = Ext.decode(response.responseText);
				this.store.reload();
				Ext.Msg.alert(data.error);
			}
		})
		
	}
})

FormatIndexConfig.layout=Ext.extend(Ext.Panel,{
	screenWidth:screen.width,
	initComponent: function()
	{
		this.caseYearCombo=new FormatIndexConfig.CaseYearCombo({
			isInit:true	
		});		
		
		this.respGridPanel=new FormatIndexConfig.respGridPanel({
			caseYearCombo:this.caseYearCombo
		});
		
		this.indexGridPanel=new FormatIndexConfig.indexGridPanel({
			respGridPanel:this.respGridPanel,
			caseYearCombo:this.caseYearCombo
		});
		
		this.caseYearCombo.store.load();		
		this.caseYearCombo.on("select", this.query,this);
		this.query();
		
		Ext.apply(this,{
			layout:'fit',
			items:[{
				layout:'border',
				tbar:[{
						text:'新增设置',
						iconCls:'xy-save',
						handler:this.insert,
						scope:this
					},'-',{
						text:'修改设置',
						iconCls:'xy-browser',
						handler:this.update,
						scope:this
					},'-',{
						text:'删除设置',
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
			tbar:['方案:',this.caseYearCombo]
		});
		
		FormatIndexConfig.layout.superclass.initComponent.call(this);		
	},
	query:function()
	{
		this.respGridPanel.load();
	},
	save:function()
	{
		this.indexGridPanel.save();
	},
	del:function()
	{
		this.indexGridPanel.del();
	},
	insert:function()
	{
		this.indexGridPanel.add();
	},
	update:function()
	{
		this.indexGridPanel.update();
	}
})
Ext.reg("formatindexconfig_layout",FormatIndexConfig.layout);

function init()
{
	var m_view = new Ext.Viewport({
				layout: 'fit',
				items: [{
					    id:'formatindexconfig_layout',
						xtype: 'formatindexconfig_layout'
				}]
			});

}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);