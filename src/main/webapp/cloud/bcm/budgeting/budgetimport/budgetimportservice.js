Ext.namespace("com.freesky.ssc.bcm.budget.BudgetImport");

var m_Mask=null;
var batchsize=1000;




com.freesky.ssc.bcm.budget.BudgetImport.BudgetImportService = Ext.extend(Ext.util.Observable, {
	BudgetImportAction:function(respnID, yearID, filePath, callBack, scope)
	{
		Ext.Ajax.request({
								url:"BCM/BudgtImport.action",
								method: 'post',
								params: {
											respnID : respnID,
										    yearID : yearID,
										    filePath : filePath
										},
								success: function(response)
								{
									callBack.call(scope,response);
								},
								failure: this.failureHandle,
								timeout: 0
						});
	},
	BudgetImportGridActionStart:function(respnID, yearID,end,recordss,callBack, scope){
		
		Ext.Ajax.request({url:"BCM/BudgtImport.action",
							method: 'post',
							enctype:'multipart/form-data',
							timeout:120000,
							params: {
										respnID : respnID,
									    yearID : yearID,
									    records : Ext.encode(recordss[end].records),
									    start:recordss[end].start,
									    end:recordss[end].end
									},
							success: function(response){
								
								end++;
								if(end==recordss.length){
									if(m_Mask!=null){
										m_Mask.hide();
										m_Mask=null;
									}
									callBack.call(scope,response);
								}else{
									this.BudgetImportGridActionStart(respnID, yearID,end,recordss,callBack, scope);
								}
							},
							failure: this.failureHandle,
							scope:this
					});	
	},BudgetImportGridActionBySubmit:function(respnID, yearID,recordss,callBack, scope){
		
		
		var submitpanel = new Ext.FormPanel({
            hiddne : true,
            fileUpload : true,
            labelWidth:60,
            collapsible : true,
			autoHeight : true,
			labelAlign : 'right',
			autoWidth : true,  
            items : [new Ext.form.Hidden({
            	name:'records',
            	value:Ext.encode(recordss[0].records)
            }),new Ext.form.Hidden({
            	name:'respnID',
            	value:respnID
            }),new Ext.form.Hidden({
            	name:'yearID',
            	value:yearID
            }),new Ext.form.Hidden({
            	name:'start',
            	value:recordss[0].start
            }),new Ext.form.Hidden({
            	name:'end',
            	value:recordss[0].end
            })]
        });		
        
        
        var importWin = new Ext.Window({
            width : 0,
            items : [submitpanel]});
			 
        importWin.show();
        
		submitpanel.getForm().submit({
                    	method : "POST",
                    	scope : this,
                        url : 'BCM/BudgtImport.action',
                        action: '',
               			waitTitle : "请稍候",
                        waitMsg: '导入中, 请稍候...',
                        success : function(form, action){
                        	importWin.close();
                        	callBack.call(scope,action.response);
                        },
                        failure : function(form, action) {
                        	var alertwin = new Freesky.AlertWindow({
                        		msg:action.result.msg
                        	});
                        	alertwin.show();
                        	
//                            Ext.Msg.alert("提示",action.result.msg);
                            return;
                        }
          });		
	
	},BudgetImportGridAction:function(respnID, yearID,recordss,callBack, scope)
	{
		
		if(m_Mask==null){
			m_Mask=new Ext.LoadMask(Ext.getBody(),{msg:'导入中...'});
		}
		m_Mask.show();
		
		var fin=0;
		
		Ext.Ajax.request({url:"BCM/BudgtImport.action",
								method: 'post',
								timeout:120000,
								params: {
											respnID : respnID,
										    yearID : yearID,
										    records : Ext.encode(recordss[fin].records),
										    start:recordss[fin].start,
										    end:recordss[fin].end
										},
								success: function(response){
									
									fin++;
									if(fin==recordss.lenght){
										callBack.call(scope,response);
									}else{
										this.BudgetImportGridActionStart(respnID,yearID,fin,recordss,callBack, scope);
									}
								},
								failure: this.failureHandle,
								scope:this
						});
	},
	SpecActBudgetImportAction:function(yearID, filePath, callBack, scope)
	{
		Ext.Ajax.request({
								url:"BCM/SpecActBudgetImport.action",
								params: {   yearID : yearID,
										    filePath : filePath
										},
								success: function(response)
								{
									callBack.call(scope,response);
								},
								failure: this.failureHandle,
								timeout: 0
						});
	},SpecActBudgetImportGridActionStart:function(yearID,end,recordss,callBack, scope){
		
		Ext.Ajax.request({url:"BCM/SpecActBudgetImport.action",
							method: 'post',
							timeout:120000,
							params: {
									    yearID : yearID,
									    records : Ext.encode(recordss[end].records),
									    start:recordss[end].start,
									    end:recordss[end].end
									},
							success: function(response){
								
								end++;
								if(end==recordss.length){
									if(m_Mask!=null){
										m_Mask.hide();
										m_Mask=null;
									}
									callBack.call(scope,response);
								}else{
									this.SpecActBudgetImportGridActionStart(yearID,end,recordss,callBack, scope);
								}
							},
							failure: this.failureHandle,
							scope:this
					});	
	},SpecActBudgetImportGridAction:function(yearID,recordss,callBack, scope)
	{
		
		if(m_Mask==null){
			m_Mask=new Ext.LoadMask(Ext.getBody(),{msg:'导入中...'});
		}
		m_Mask.show();
		
		var fin=0;
		
		Ext.Ajax.request({url:"BCM/SpecActBudgetImport.action",
								method: 'post',
								timeout:120000,
								params: {
										    yearID : yearID,
										    records : Ext.encode(recordss[fin].records),
										    start:recordss[fin].start,
										    end:recordss[fin].end
										},
								success: function(response){
									
									fin++;
									if(fin==recordss.lenght){
										callBack.call(scope,response);
									}else{
										this.SpecActBudgetImportGridActionStart(yearID,fin,recordss,callBack, scope);
									}
								},
								failure: this.failureHandle,
								scope:this
						});
	},SpecActBudgetImportGridActionBySumbit:function(yearID,recordss,callBack, scope){
		
		var submitpanel = new Ext.FormPanel({
            hiddne : true,
            fileUpload : true,
            labelWidth:60,
            collapsible : true,
			autoHeight : true,
			labelAlign : 'right',
			autoWidth : true,  
            items : [new Ext.form.Hidden({
            	name:'records',
            	value:Ext.encode(recordss[0].records)
            }),new Ext.form.Hidden({
            	name:'yearID',
            	value:yearID
            }),new Ext.form.Hidden({
            	name:'start',
            	value:recordss[0].start
            }),new Ext.form.Hidden({
            	name:'end',
            	value:recordss[0].end
            })]
        });		
        
        
        var importWin = new Ext.Window({
            width : 0,
            items : [submitpanel]});
			 
        importWin.show();
        
		submitpanel.getForm().submit({
                    	method : "POST",
                    	scope : this,
                        url : 'BCM/SpecActBudgetImport.action',
                        action: '',
               			waitTitle : "请稍候",
                        waitMsg: '导入中, 请稍候...',
                        success : function(form, action){
                        	importWin.close();
                        	callBack.call(scope,action.response);
                        },
                        failure : function(form, action) {
                        	importWin.close();
                        	
                        	var alertwin = new Freesky.AlertWindow({
                        		msg:action.result.msg
                        	});
                        	alertwin.show();
                        	
 //                           Ext.Msg.alert("提示",action.result.msg);
                            return;
                        }
          });		
	
	},
	failureHandle : function(response)
	{
		if(m_Mask!=null){
			m_Mask.hide();
			m_Mask=null;
		}
		
		if (response.result == null || response.result == "") 
		{
			MsgUtil.alert("失败", "不能访问用户服务");
		} else {
			MsgUtil.alert("失败", response.result.msg);
		}
	}
	
});