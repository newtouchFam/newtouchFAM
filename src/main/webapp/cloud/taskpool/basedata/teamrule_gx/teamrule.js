Ext.namespace("com.freesky.ssc.core.taskpool.TaskTeamRuleManager");

TaskTeamRuleManager=com.freesky.ssc.core.taskpool.TaskTeamRuleManager;

TaskTeamRuleManager.CompanyComboFilterTree=com.freesky.ssc.bcm.core.common.CompanyComboFilterTree;
TaskTeamRuleManager.AgentCombo=com.freesky.ssc.bcm.core.common.AgentCombo;
TaskTeamRuleManager.TeamMemberCombo=com.freesky.ssc.bcm.core.common.TeamMemberCombo;

TaskTeamRuleManager.TaskAssignModeCombo=com.freesky.ssc.bcm.core.common.TaskAssignModeCombo;
TaskTeamRuleManager.TaskAutoAssignModeCombo=com.freesky.ssc.bcm.core.common.TaskAutoAssignModeCombo;

TaskTeamRuleManager.TaskTeamRuleGridPanel=Ext.extend(Ext.grid.GridPanel,{
	stripeRows :true,
	autoWidth: true,
	autoScroll: true,
	enableColumnMove: false,
	enableHdMenu: false,
	autoScroll:true,
	loadMask:true,
	initComponent:function(){
		
			this.store=new Ext.data.JsonStore({
						url : (this.url?this.url:"SSC/ssc_TeamUserAction!getUserList.action"),
						root : "data",
						method : "post",
						totalProperty:'total',
						fields : [
							"varname",
							"displayname",
							"userid",
							"companyid",
							"companname",
							"deptid",
							"deptname"
                    	]
			})
			
			this.sm=new Ext.grid.CheckboxSelectionModel({
				singleSelect:this.singleSelect
			});
		
			this.cm=new Ext.grid.ColumnModel([this.sm,{
					header: "登录名",
					dataIndex: "varname",
					width:85,
					sortable:true
				},{
					header: "姓名",
					dataIndex: "displayname",
					width:85,
					sortable:true
				},{
					header: "单位",
					dataIndex: "companname",
					width:145,
					sortable:true
				},{
					header: "部门",
					dataIndex: "deptname",
					width:145,
					sortable:true
				}
			]);
			
			this.bbar=new Ext.PagingToolbar({
				store:this.store,
				pageSize:20
			});
			
//			this.store.load();
			
		TaskTeamRuleManager.TaskTeamRuleGridPanel.superclass.initComponent.call(this);
		
	}
})

TaskTeamRuleManager.addTeamUserWindow=Ext.extend(Ext.Window,{
	title:'组员选择',
	modal:true,
	singleSelect:false,
	initComponent:function(){
		
		this.taskTeamName=new TaskTeamRuleManager.CompanyComboFilterTree({
			fieldLabel:'单位',
			expandAll:false
		});
		
		this.taskTeamCode=new Ext.form.TriggerField({
			fieldLabel:'姓名',
			triggerClass:"x-form-search-trigger",
			onTriggerClick:this.query,
			main:this
		});
		
		this.taskTeamRuleGridPanel=new TaskTeamRuleManager.TaskTeamRuleGridPanel({
			url:this.url,
			singleSelect:this.singleSelect
		});
		
		if(this.update){
			this.taskTeamCode.setValue(this.teamCodeValue);
			this.taskTeamName.setValue(this.teamNameValue);
		}
				
		Ext.apply(this,{
			layout:'border',
			items:[{
				region:'north',
				height:65,
				frame:true,
				layout:'form',
				border:false,
				labelAlign:'right',
				defaults:{width:230},
	//			closeAction:'hide',
				items:[
					this.taskTeamName,
					this.taskTeamCode
				]},{
					border:false,
					frame:true,
					region:'center',
					layout:'fit',
					items:this.taskTeamRuleGridPanel
				}],
			buttons:[{
				text:'确定',
				handler:this.main.saveTeamUser,
				scope:this.main
			},{
				text:'关闭',
				handler:this.close,
				scope:this
			}]
			
		});
		
		TaskTeamRuleManager.addTeamUserWindow.superclass.initComponent.call(this);
	},query:function(){
		
		var unitid=this.main.taskTeamName.getValue();
		var name=this.main.taskTeamCode.getValue();
		
		if(Ext.isEmpty(unitid)){
		   Ext.Msg.alert('提示','请选择单位!');
		   return;
		}
		
		this.main.taskTeamRuleGridPanel.store.baseParams.unitid=unitid;
		this.main.taskTeamRuleGridPanel.store.baseParams.name=name;
		this.main.taskTeamRuleGridPanel.store.load({
			params:{
				start:0,
				limit:20
			}
		});	
		
	}

})


TaskTeamRuleManager.agentWindow=Ext.extend(Ext.Window,{
	title:'组员设置',
	modal:true,
	width:400,
	heigth:350,
	initComponent:function(){
		
		this.teamLeaderRadio=new Ext.form.Radio({
			fieldLabel:'组长'
		});
		
		this.agentTypeCombo=new TaskTeamRuleManager.AgentCombo({
			fieldLabel:'授权类型'
		});
		

		this.taskTeamName=new Ext.form.TriggerField({
			fieldLabel:'组外代理人',
			onTriggerClick:this.selectTeamUser,
			scope:this,
			main:this,
			triggerClass:"x-form-search-trigger",
			hidden:true
		});
		
		this.agentTypeCombo.on('select',function(){
			
			if(this.agentTypeCombo.getValue()==2){
				this.taskTeamName.setVisible(true);
			}else{
				this.taskTeamName.setVisible(false);
			}
			
		},this)
		
		this.taskTeamUserID=new Ext.form.Hidden({});
		
		if(this.update){
			
			if(this.record.get('isleader')==1){
				this.teamLeaderRadio.setValue(true);
			}
			
			this.taskTeamUserID.setValue(this.record.get('agentid'));

			this.agentTypeCombo.setValue(this.record.get('isagent'));
			
			if(this.record.get('isagent')==2){
				this.taskTeamName.setVisible(true);
				this.taskTeamName.setValue(this.record.get('agentdisplayname'));
			}
		}
				
		Ext.apply(this,{
			layout:'form',
			labelAlign:'right',
			defaults:{width:200},
//			closeAction:'hide',
			items:[
				this.teamLeaderRadio,
				this.agentTypeCombo,
				this.taskTeamName,
				this.taskTeamUserID
			],
			buttons:[{
				text:'确定',
				handler:this.main.updateItTeamUser,
				scope:this.main
			},{
				text:'关闭',
				handler:this.close,
				scope:this
			}]
			
		});
		
		TaskTeamRuleManager.agentWindow.superclass.initComponent.call(this);
		
	},selectTeamUser:function(){

		this.selectWindows=new TaskTeamRuleManager.addTeamUserWindow({
			width:400,
			height:350,
			main:this.main,
			teamid:this.main.record.get('teamid'),
			url:"SSC/ssc_TeamUserAction!getUserWithOutTeamAndUserList.action",
			query:function(){
				
				var teamid=this.main.teamid;
				var unitid=this.main.taskTeamName.getValue();
				var name=this.main.taskTeamCode.getValue();
				
				if(Ext.isEmpty(unitid)){
				   Ext.Msg.alert('提示','请选择单位!');
				   return;
				}
				
				this.main.taskTeamRuleGridPanel.store.baseParams.teamid=teamid;
				this.main.taskTeamRuleGridPanel.store.baseParams.unitid=unitid;
				this.main.taskTeamRuleGridPanel.store.baseParams.name=name;
				this.main.taskTeamRuleGridPanel.store.load({
					params:{
						start:0,
						limit:20
					}
				});
					
			},
			singleSelect:true
		});
		
		this.selectWindows.show();
	
	},saveTeamUser:function(){
		
		var users=this.taskTeamName.selectWindows.taskTeamRuleGridPanel.getSelectionModel().getSelected();
		
		if(null==users||0==users.length){
			Ext.Msg.alert('提示','请选择');
			return;
		}
		
		var userid=users.get('userid');
		var displayname=users.get('displayname');
		
		this.taskTeamName.setValue(displayname);
		this.taskTeamUserID.setValue(userid);
		this.taskTeamName.selectWindows.close();
	}

})

TaskTeamRuleManager.teamRuleSet=Ext.extend(Ext.Window,{
	title:'任务组设置',
	modal:true,
	initComponent:function(){
				
		this.taskTeamCode=new Ext.form.TextField({
			fieldLabel:'任务组编码',
			disabled:true
		});
		
		this.taskTeamName=new Ext.form.TextField({
			fieldLabel:'任务组名称',
			disabled:true
		});
		
		this.taskMatchRank=new Ext.form.NumberField({
			fieldLabel:'匹配顺序',
			minValue:0
		});
		
		this.taskAssignMode=new TaskTeamRuleManager.TaskAssignModeCombo({
			fieldLabel:'分配方式'
		});
		
		this.taskAutoAssignMode=new TaskTeamRuleManager.TaskAutoAssignModeCombo({
			fieldLabel:'自动分配算法'
		});
		
		this.taskMax=new Ext.form.NumberField({
			fieldLabel:'最大待办数量',
			minValue:0
		});
		
		if(this.record){
			this.taskTeamCode.setValue(this.record.get('TEAMCODE'));
			this.taskTeamName.setValue(this.record.get('TEAMNAME'));
			this.taskMatchRank.setValue(this.record.get('calsequence'));
			this.taskAssignMode.setValue(this.record.get('assigntype'));
			this.taskAutoAssignMode.setValue(this.record.get('assignmethod'));
			this.taskMax.setValue(this.record.get('maxcount'));
		}
		
		Ext.apply(this,{
			layout:'form',
			labelAlign:'right',
			defaults:{width:200},
//			closeAction:'hide',
			items:[
				this.taskTeamCode,
				this.taskTeamName,
				this.taskMatchRank,
				this.taskAssignMode,
				this.taskAutoAssignMode,
				this.taskMax
			],
			buttons:[{
				text:'确定',
				handler:this.main.teamRuleSetIt,
				scope:this.main
			},{
				text:'关闭',
				handler:this.close,
				scope:this
			}]
			
		});		
		
		
		TaskTeamRuleManager.teamRuleSet.superclass.initComponent.call(this);
	}
})

TaskTeamRuleManager.FormGridPanel=Ext.extend(Ext.grid.GridPanel,{
	modal:true,
	initComponent:function(){
		
			this.store=new Ext.data.JsonStore({
						url : "SSC/ssc_TeamRuleGXAction!getFormType.action",
						root : "data",
						method : "post",
						totalProperty:'total',
						fields : [
							"formid",
							"formname",
							"formtype",
							"checked"
                    	]
						})
						
			this.sm=new Ext.grid.CheckboxSelectionModel({
				singleSelect:false,
				handleMouseDown: Ext.emptyFn
			});
		
			this.cm=new Ext.grid.ColumnModel([this.sm,{
					header: "表单名称",
					dataIndex: "formname",
					width:165,
					sortable:true
				},{
					header: "表单类型",
					dataIndex: "formtype",
					width:120,
					sortable:true
				}
			]);
			
//			this.bbar=new Ext.PagingToolbar({
//				store:this.store,
//				pageSize:20
//			});		
			
			if(this.update){
				this.store.on("load",function(){
					for(var i=0,size=this.store.getCount();i<size;i++){
						var record=this.store.getAt(i);
						alert(record.get('checked'));
						if(record.get('checked')){
							this.getSelectionModel().selectRow(i);
						}
					}
				},this);
			}
		TaskTeamRuleManager.FormGridPanel.superclass.initComponent.call(this);
	
	},load:function(){
		this.store.load(
//			{
//			params:{
//				start:0,
//				limit:20
//			}		
//			}
		)
	}
})

TaskTeamRuleManager.teamRuleSetAdd=Ext.extend(Ext.Window,{
	title:'新建规则',
	modal:true,
//	maximizable:true,
	initComponent:function(){
		
		this.taskRuleCode=new Ext.form.TextField({
			fieldLabel:'规则编码'
		});
		
		this.taskRuleName=new Ext.form.TextField({
			fieldLabel:'规则名称'
		});
		
		this.taskRemark=new Ext.form.TextArea({
			fieldLabel:'备注',
			height:120,
			grow:false,
			maxLengthText:10
		});
		
//		this.taskTeamName=new TaskTeamRuleManager.CompanyComboFilterTree({
//			fieldLabel:'单位',
//			checkUI:true,
//			winHeight:200,
//			expandAll:false,
//			treeClick:function(node){
//				node.toggle();
//			}
//		});
		
		this.taskTeamName=new com.freesky.ssc.bcm.core.common.CompanyTree({
			title:'单位[不选择表示全部有效]',
			checkUI:true,
			expandAll:false
		});
		
		this.taskFormName=new TaskTeamRuleManager.FormGridPanel({
			title:'表单[不选择表示全部有效]'
		});
		this.taskFormName.load();
		
//		this.taskFormName=new com.freesky.ssc.bcm.core.common.ComboGridPanel({
//			fieldLabel:'表单',
//			main:this,
//			winHeight:200,
//			listWidth:400,
//			grid:this.gridpanel
//		});
		
		
		this.taskChargeType=new Ext.form.RadioGroup({
			fieldLabel:'费用类型',
			frame:true,
			items:[
				new Ext.form.Radio({
					trueValue:0,
					name:'rds',
					boxLabel:'全部',
					checked:true
				}),
				new Ext.form.Radio({
					name:'rds',
					boxLabel:'公司费用',
					trueValue:1
				}),
				new Ext.form.Radio({
					name:'rds',
					boxLabel:'员工费用',
					trueValue:2
				})
			]
		});
		
		Ext.apply(this,{
			layout:'border',
			items:[
			{
			border:0,
			region:'west',
			width:330,
			layout:'form',
			frame:true,
			labelAlign:'right',
			defaults:{width:210},
			items:[
				this.taskRuleCode,
				this.taskRuleName,
				this.taskRemark,
//				this.taskTeamName,
//				this.taskFormName,
				this.taskChargeType
			]},{
				region:'center',
				layout:'fit',
	 			items:this.taskTeamName
	 		},{
				region:'east',
				width:320,
				layout:'fit',
	 			items:this.taskFormName
	 		}],
			buttons:[{
				text:'确定',
				handler:this.update?this.main.updateItTeam:this.main.addItTeam,
				scope:this.main
			},{
				text:'关闭',
				handler:this.close,
				scope:this
			}]
		});
		
		if(this.update){
			this.on('show',this.setUpdateInfo,this);
		}
		
		this.on('maximize', function(){
					this.tools.restore.hide();
//					this.tools.maximize.hide();
		},this)
		
		TaskTeamRuleManager.teamRuleSetAdd.superclass.initComponent.call(this);
		
	},setUpdateInfo:function(){
		
		this.taskRuleCode.setValue(this.rulerecord.get('rulecode'));
		this.taskRuleName.setValue(this.rulerecord.get('rulename'));
		this.taskRemark.setValue(this.rulerecord.get('remark'));
		
		var m_loadMask=new Ext.LoadMask(Ext.getBody(),'加载数据……');
		m_loadMask.show();
		Ext.Ajax.request({
				url: 'SSC/ssc_TeamRuleGXAction!get.action',
				method: 'post',
				params: {
					ruleid:this.rulerecord.get('ruleid')
				},
				success: function(response){
					var data = Ext.decode(response.responseText);
					if (data.success){
						var data=data.data;
						for(var i=0;i<data.feetypeinfo.length;i++){
							var dataid=data.feetypeinfo[i].dataid;
		                    this.taskChargeType.items.each(function(item){
		                        if (item.trueValue!=dataid){
		                            item.setValue(false);
		                        }else{
		                            item.setValue(true);
		                        }
		                    },this);
						}
						
						var selects=[];
						for(var i=0;i<data.forminfo.length;i++){
							var dataid=data.forminfo[i].dataid;
							var store=this.taskFormName.store;
							for(var j=0;j<store.getCount();j++){
								var record=store.getAt(j);
								if(dataid==record.get('formid')){
									selects.push(j);
								}
							}
						}
						
						this.taskFormName.getSelectionModel().selectRows(selects);
						
						var companys=[];
						for(var i=0;i<data.companyinfo.length;i++){
							var dataid=data.companyinfo[i].dataid;
							var node = this.taskTeamName.root;
							if (node.id==dataid){
								node.getUI().checkbox.checked = true;
							}
							companys.push(dataid);
						}
						this.taskTeamName.companys=companys;
						this.taskTeamName.on('expandnode',this.checkNode,this);
						this.taskTeamName.root.expand(true);
						if (m_loadMask != null){
							m_loadMask.hide();
						}
						return true;
					}else{
						Ext.Msg.alert("提示", data.error);
					}
				},
				failure: function(response)
				{
					var data = Ext.decode(response.responseText);
					Ext.Msg.alert(data.error);
				},
				scope: this
		})
		
	},checkNode:function(node){
		node.eachChild(function(cd){
			for(var i=0;i<this.taskTeamName.companys.length;i++){
				if(cd.id==this.taskTeamName.companys[i]){
					cd.getUI().checkbox.checked = true;
					cd.attributes.checked=true;
				}
			};
		},this)
	}
})



TaskTeamRuleManager.TeamRuleGridPanel=Ext.extend(Ext.grid.GridPanel,{
	stripeRows :true,
	autoWidth: true,
	autoScroll: true,
	enableColumnMove: false,
	enableHdMenu: false,
	autoScroll:true,
	loadMask:true,
	initComponent:function(){
		

			this.store=new Ext.data.JsonStore({
						url : "SSC/ssc_TeamRuleGXAction!list.action",
						root : "data",
						method : "post",
						totalProperty:'total',
						fields : [
							"teamid",
							"ruleid",
							"rulecode",
							"rulename",
							"remark"
                    	]
			})
						
			this.sm=new Ext.grid.CheckboxSelectionModel({
				singleSelect:false,
				handleMouseDown: Ext.emptyFn
			});
		
			this.cm=new Ext.grid.ColumnModel([this.sm,{
					header: "规则编码",
					dataIndex: "rulecode",
					width:175,
					sortable:true
				},{
					header: "规则名称",
					dataIndex: "rulename",
					width:200,
					sortable:true
				},{
					header: "备注",
					dataIndex: "remark",
					width:275,
					sortable:true
				}
			]);
			
			this.teamGridPanel.on('rowclick',this.load,this);
			
			this.bbar=new Ext.PagingToolbar({
				store:this.store,
				pageSize:20
			});			
			
		TaskTeamRuleManager.TeamRuleGridPanel.superclass.initComponent.call(this);
	},load:function(){
		
		var record=this.teamGridPanel.getSelectionModel().getSelected();
		var teamid=record.get('TEAMID');
		this.store.baseParams.teamid=teamid;
		this.store.load({
			params:{
				start:0,
				limit:20
			}
		});
	
	}
})

TaskTeamRuleManager.TeamGridPanel=Ext.extend(Ext.grid.GridPanel,{
	stripeRows :true,
	autoWidth: true,
	autoScroll: true,
	enableColumnMove: false,
	enableHdMenu: false,
	autoScroll:true,
	loadMask:true,
	initComponent:function(){
		
			this.store=new Ext.data.JsonStore({
						url : "SSC/ssc_TeamRuleGXAction!listTeam.action",
						root : "data",
						method : "post",
						totalProperty:'total',
						fields : [
						 "TEAMID",
						 "TEAMCODE",
						 "TEAMNAME",
						 "calsequence",
						 "assigntype",
						 "assignmethod",
						 "maxcount"
                    ]					
			})
			
			this.sm=new Ext.grid.CheckboxSelectionModel({
				singleSelect:true
			});
		
			this.cm=new Ext.grid.ColumnModel([{
					header: "任务组编码",
					dataIndex: "TEAMCODE",
					width:150,
					sortable:true
				},{
					header: "任务组名称",
					dataIndex: "TEAMNAME",
					width:125,
					sortable:true
				}
			]);
			
//			this.bbar=new Ext.PagingToolbar({
//				store:this.store,
//				pageSize:20
//			});			
			
		TaskTeamRuleManager.TeamGridPanel.superclass.initComponent.call(this);
		
	}
})

TaskTeamRuleManager.layout=Ext.extend(Ext.Panel,{
	screenWidth:screen.width,
	initComponent: function(){
							   	 
		this.teamGridPanel=new TaskTeamRuleManager.TeamGridPanel({
		})
		
		this.teamRuleGridPanel=new TaskTeamRuleManager.TeamRuleGridPanel({
			teamGridPanel:this.teamGridPanel			
		})
		
		Ext.apply(this,{
			layout:'border',
			tbar:[{
					text:'任务组设置',
					iconCls:'xy-edit',
					handler:this.teamRuleSet,
					scope:this
			},'-',{
					text:'新增规则',
					iconCls:'xy-add',
					handler:this.addTeamRule,
					scope:this
			},'-',{
					text:'修改规则',
					iconCls:'xy-edit',
					handler:this.updateTeamRule,
					scope:this
			},'-',{
					text:'删除规则',
					iconCls:'xy-delete',
					handler:this.deleteTeamRule,
					scope:this
			}],
			items:[{
				region:'west',
				layout:'fit',
				width:285,
				split:true,
				items:this.teamGridPanel},
				{
				region:'center',
				layout:'fit',
				items:this.teamRuleGridPanel}]
		});
		
		this.teamGridPanel.store.load();
		
		TaskTeamRuleManager.layout.superclass.initComponent.call(this);
		
	},teamRuleSet:function(){
		
		var record=this.teamGridPanel.getSelectionModel().getSelected();
		
		if(Ext.isEmpty(record)){
			Ext.Msg.alert('提示','请先选择任务组!');			
			return;
		}
		
		this.teamRuleSet=new TaskTeamRuleManager.teamRuleSet({
			width:375,
			height:250,
			main:this,
			record:record
		})
		
		this.teamRuleSet.show();
		
	},teamRuleSetIt:function(){
		
		var teamid=this.teamRuleSet.record.get('TEAMID');
		var calsequence=this.teamRuleSet.taskMatchRank.getValue();
		var assigntype=this.teamRuleSet.taskAssignMode.getValue();	
		var assignmethod=this.teamRuleSet.taskAutoAssignMode.getValue();	
		var maxcount=this.teamRuleSet.taskMax.getValue();
		
		if(Ext.isEmpty(calsequence)||calsequence<0){
			Ext.Msg.alert('提示','匹配顺序不正确!该参数未输入或小于0!');
			return;
		}
		
		if(Ext.isEmpty(maxcount)||maxcount<0){
			Ext.Msg.alert('提示','最大待办数量不正确!该参数未输入或小于0!');
			return;
		}
		
		Ext.Ajax.request({
				url: 'SSC/ssc_TeamRuleGXAction!save.action',
				method: 'post',
				params: {
					teamid:teamid,
					calsequence:calsequence,
					assigntype:assigntype,
					assignmethod:assignmethod,
					maxcount:maxcount
				},
				success: function(response)
				{
					var data = Ext.decode(response.responseText);
					if (data.success){
//						Ext.Msg.alert("提示","保存成功!");
						this.teamRuleSet.close();
						this.teamGridPanel.store.reload();
					}
					else
					{
						Ext.Msg.alert("提示", data.error,function(){
							this.teamGridPanel.store.reload();								
						},this);
					}
				},
				failure: function(response)
				{
					var data = Ext.decode(response.responseText);
					Ext.Msg.alert(data.error);
					this.teamGridPanel.store.reload();
				},
				scope: this
		})		
		
	},addTeamRule:function(){
		
		var record=this.teamGridPanel.getSelectionModel().getSelected();

		this.teamRuleAdd=new TaskTeamRuleManager.teamRuleSetAdd({
			title:'任务组:'+"["+record.get('TEAMCODE')+"]"+record.get('TEAMNAME'),
			width:800,
			height:350,
			y:10,
			main:this,
			teamid:record.get('TEAMID')
		})
		
		this.teamRuleAdd.show();
		this.teamRuleAdd.toggleMaximize();
		
	},updateTeamRule:function(){
		
		var record=this.teamGridPanel.getSelectionModel().getSelected();
		var rulerecord=this.teamRuleGridPanel.getSelectionModel().getSelected();
	
		if(null==record||0==record.length){
			Ext.Msg.alert('提示','请选择任务组!');
			return;
		}
		if(0<record.length){
			Ext.Msg.alert('提示','只能选择一个任务组!');
			return;
		}
		if(null==rulerecord||0==rulerecord.length){
			Ext.Msg.alert('提示','请选择任务组规则!');
			return;
		}
		if(0<rulerecord.length){
			Ext.Msg.alert('提示','只能选择一条任务组规则进行设置!');
			return;
		}
		
		this.teamRuleAdd=new TaskTeamRuleManager.teamRuleSetAdd({
			title:'任务组:'+"["+record.get('TEAMCODE')+"]"+record.get('TEAMNAME'),
			width:900,
			height:350,
			y:10,
			main:this,
			update:this,
			teamid:rulerecord.get('teamid'),
			rulerecord:rulerecord
		})
		
		this.teamRuleAdd.show();
		this.teamRuleAdd.toggleMaximize();
	
	},updateItTeam:function(){
	
		var ruleid=this.teamRuleAdd.rulerecord.get('ruleid');
		var oldrulecode=this.teamRuleAdd.rulerecord.get('rulecode');
		var teamid=this.teamRuleAdd.teamid;
		var ruleCode=this.teamRuleAdd.taskRuleCode.getValue();
		var taskRuleName=this.teamRuleAdd.taskRuleName.getValue();
		var taskRemark=this.teamRuleAdd.taskRemark.getValue();
		var companynodes=this.teamRuleAdd.taskTeamName.getChecked();
		var formnodes=this.teamRuleAdd.taskFormName.getSelectionModel().getSelections();
		var taskChargeType=this.teamRuleAdd.taskChargeType.getValue();
		
		if(Ext.isEmpty(ruleCode)){
			Ext.Msg.alert('提示','规则编码不能为空!');
			return;
		}
		
		if(Ext.isEmpty(taskRuleName)){
			Ext.Msg.alert('提示','规则名称不能为空!');
			return;
		}
		
		var companys=[];
		var forms=[];
		
		for(var i=0,size=companynodes.length;i<size;i++){
			companys.push({
				companyid:companynodes[i].id
			})	
		}
		
		for(var i=0,size=formnodes.length;i<size;i++){
			forms.push({
				formid:formnodes[i].get('formid')
			})
		}
		
		Ext.Ajax.request({
				url: 'SSC/ssc_TeamRuleGXAction!updateRules.action',
				method: 'post',
				params: {
					ruleid:ruleid,
					teamid:teamid,
					rulecode:ruleCode,
					oldrulecode:oldrulecode,
					taskrulename:taskRuleName,
					taskchargetype:taskChargeType.trueValue,
					taskremark:taskRemark,
					companys:Ext.encode(companys),
					forms:Ext.encode(forms)
				},
				success: function(response)
				{
					var data = Ext.decode(response.responseText);
					if (data.success){
//						Ext.Msg.alert("提示","保存成功!");
						this.teamRuleAdd.close();
						this.teamRuleGridPanel.store.reload();
					}
					else
					{
						Ext.Msg.alert("提示", data.error);
					}
				},
				failure: function(response)
				{
					var data = Ext.decode(response.responseText);
					Ext.Msg.alert(data.error);
				},
				scope: this
		})	
	
	},addItTeam:function(){
	
		var teamid=this.teamRuleAdd.teamid;
		var ruleCode=this.teamRuleAdd.taskRuleCode.getValue();
		var taskRuleName=this.teamRuleAdd.taskRuleName.getValue();
		var taskRemark=this.teamRuleAdd.taskRemark.getValue();
		var companynodes=this.teamRuleAdd.taskTeamName.getChecked();
		var formnodes=this.teamRuleAdd.taskFormName.getSelectionModel().getSelections();
		var taskChargeType=this.teamRuleAdd.taskChargeType.getValue();
		
		if(Ext.isEmpty(ruleCode)){
			Ext.Msg.alert('提示','规则编码不能为空!');
			return;
		}
		
		if(Ext.isEmpty(taskRuleName)){
			Ext.Msg.alert('提示','规则名称不能为空!');
			return;
		}
		
		var companys=[];
		var forms=[];
		
		for(var i=0,size=companynodes.length;i<size;i++){
			companys.push({
				companyid:companynodes[i].id
			})	
		}
		
		for(var i=0,size=formnodes.length;i<size;i++){
			forms.push({
				formid:formnodes[i].get('formid')
			})
		}
		
		Ext.Ajax.request({
				url: 'SSC/ssc_TeamRuleGXAction!saveRules.action',
				method: 'post',
				params: {
					teamid:teamid,
					rulecode:ruleCode,
					taskrulename:taskRuleName,
					taskchargetype:taskChargeType.trueValue,
					taskremark:taskRemark,
					companys:Ext.encode(companys),
					forms:Ext.encode(forms)
				},
				success: function(response){
					var data = Ext.decode(response.responseText);
					if (data.success){
//						Ext.Msg.alert("提示","保存成功!");
						this.teamRuleAdd.close();
						this.teamRuleGridPanel.store.reload();
					}
					else
					{
						Ext.Msg.alert("提示", data.error);
					}
				},
				failure: function(response){
					var data = Ext.decode(response.responseText);
					Ext.Msg.alert(data.error);
				},
				scope: this
		})
		
	},deleteTeamRule:function(){
	
		Ext.Msg.show({
		   title:'提示',
		   msg: '是否删除所选记录?',
		   buttons: Ext.Msg.YESNO,
		   scope:this,
		   fn:function(btn,text){
		
			if(btn == 'no'){
				return;
			}else if(btn=="yes"){
				this.deleteItTeamRule();
			}
		}
		});
	
	},deleteItTeamRule:function(){
		
		var team = this.teamGridPanel.getSelectionModel().getSelected();
		var records = this.teamRuleGridPanel.getSelectionModel().getSelections();
		
		if(null==records||0==records.length){
			return;
		}
		
		var rds=[];
		for(var i=0;i<records.length;i++){
			rds.push({
				ruleid:records[i].get('ruleid')
			})
		}
		
		Ext.Ajax.request({
				url: 'SSC/ssc_TeamRuleGXAction!del.action',
				method: 'post',
				params: {
					teamid:team.get('TEAMID'),
					records:Ext.encode(rds)
				},
				success: function(response)
				{
					var data = Ext.decode(response.responseText);
					if (data.success){
//						Ext.Msg.alert("提示","保存成功!");
						this.teamRuleGridPanel.store.reload();
					}
					else
					{
						Ext.Msg.alert("提示", data.error,function(){
							this.teamRuleGridPanel.store.reload();								
						},this);
					}
				},
				failure: function(response)
				{
					var data = Ext.decode(response.responseText);
					Ext.Msg.alert(data.error);
					this.teamRuleGridPanel.store.reload();
				},
				scope: this
		})
		
		
		
	}
})
Ext.reg("taskteamrulemanager_layout",TaskTeamRuleManager.layout);

function init(){
	var m_view = new Ext.Viewport({
				layout: 'fit',
				items: [{
					    id:'taskteamrulemanager_layout',
						xtype: 'taskteamrulemanager_layout'
				}]
			});

}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);