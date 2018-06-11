//---------------------弹出框界面---------------
Ext.namespace("wfs.gl.datamanager.editinitperiod");
wfs.gl.datamanager.editinitperiod.EditInitPeriodWin = Ext.extend(Ext.Window,
{
	title : '',
	enableColumnMove : false,
	enableHdMenu : false,
	border : false,
	buttonAlign : 'right',
	width : 300,
	height : 245,
    layout : 'fit',
    modal : true,
    record : null,
    resizable : false,
    initPeriodPanel : null,
    
    initComponent : function()
    {
    	this.account = new gl.component.xychooseaccount(
		{
			id : 'account',
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		isOnlyLastLevel : true, 
    		fieldLabel : '科目'
		});
    	
    	this.mnyDebitPeriod = new Freesky.Common.XyMoney(
    	{
    		id : 'mnydebitperiod',
    		fieldLabel : '年初借方余额',
    		anchor : '95%',
			labelStyle : 'text-align:right;',
    		allowBlank : false,
			msgTarget : 'qtip',
			renderer : Ext.app.XyFormat.cnMoneyEx
    	});
    	
    	this.mnyCreditPeriod = new Freesky.Common.XyMoney(
    	{
    		id : 'mnycreditperiod',
    		fieldLabel : '年初贷方余额',
    		anchor : '95%',
			labelStyle : 'text-align:right;',
    		allowBlank : false,
    		allowNegative : true,
			msgTarget : 'qtip'

    	});
    	
    	//定义FormPanel
    	this.formPanel = new Ext.form.FormPanel(
	    {
	    	width : 150,
	    	hight : 250,
	    	frame : true,
	    	items : [this.account, this.mnyDebitPeriod, this.mnyCreditPeriod]
	    });
    	this.items = [this.formPanel];
    	
    	//定义保存和取消两个按钮
    	this.buttons = [
    	{	
    	    text : '保存',
    	    handler : this.saveHandler,
    	    scope : this
    	 },
    	 {
    	    text : '取消',
    	    handler : function()
			{
			  this.close();
			},
    	    scope : this
    	 }];
    	wfs.gl.datamanager.editinitperiod.EditInitPeriodWin.superclass.initComponent.call(this);
    	//当window页面打开时，如果为修改，则给组件赋值
    	this.on("show",this.isEdit,this);
    },
	//保存按钮事件，根据点击主页面按钮的类型来判断调用的方法
	saveHandler : function()
	{
		if(this.account.getXyValue()==null||this.account.getXyValue()==undefined||this.account.getXyValue()=="")
		{
			Ext.Msg.alert("提示", "科目不能为空");
			return false;
		};
		if((this.mnyDebitPeriod.getValue()==null||this.mnyDebitPeriod.getValue()==undefined||this.mnyDebitPeriod.getValue()==0)
			&&(this.mnyCreditPeriod.getValue()==null||this.mnyCreditPeriod.getValue()==undefined||this.mnyCreditPeriod.getValue()==0))
		{
			Ext.Msg.alert("提示", "年初借方余额和年初贷方余额必须填写一个");
			return false;
		};
		if(this.mnyDebitPeriod.getValue() != 0&&this.mnyCreditPeriod.getValue() != 0)
		{
			Ext.Msg.alert("提示", "年初借方余额和年初贷方余额只能填写一个");
			return false;
		}
		
		if(this.title == "新增")
		{	
			var uqcompanyid = Ext.getCmp('company').getXyValue();
			var accountid = this.account.getXyValue();
			var varaccountcode = this.account.getCodeValue();
			//var mnydebitperiod = this.mnyDebitPeriod.getValue();
			//var mnycreditperiod = this.mnyCreditPeriod.getValue();
			
			if(this.mnyDebitPeriod.getValue()==null||this.mnyDebitPeriod.getValue()=="")
			{
				var mnydebitperiod = 0;
			}
			else
			{
				var mnydebitperiod = this.mnyDebitPeriod.getValue();
			}
			
			if(this.mnyCreditPeriod.getValue()==null||this.mnyCreditPeriod.getValue()=="")
			{
				var mnycreditperiod = 0;
			}
			else
			{
				var mnycreditperiod = this.mnyCreditPeriod.getValue();
			}
			
			var paramString = 
			{
				uqcompanyid : uqcompanyid,
				accountid : accountid,
				varaccountcode : varaccountcode,
				mnydebitperiod : mnydebitperiod+"",
				mnycreditperiod : mnycreditperiod+""
			}
			
			Ext.Ajax.request(
			{
				url : "datamanager/initperiod/addinitperiod",
				params :
    			{
    				paramString : Ext.encode(paramString)
    			},
				success : function(response)
				{
					var r = Ext.decode(response.responseText);
					if (r.success)
					{
						Ext.Msg.alert("提示", "新增科目期初余额成功！");
						this.close();
						/*
						this.initPeriodPanel.store.baseParams.uqcompanyid = Ext.getCmp('company').getXyValue();
						this.initPeriodPanel.store.baseParams.varaccountcode = Ext.getCmp('varaccountcode').getValue();
						this.initPeriodPanel.store.baseParams.varaccountname = Ext.getCmp('varaccountname').getValue();
						*/
						var paramstring = 
						{
							uqcompanyid : Ext.getCmp('company').getXyValue(),
							varaccoundcode : Ext.getCmp('varaccountcode').getValue(),
							varaccountname : Ext.getCmp('varaccountname').getValue()
						}
						this.store.baseParams.paramString = Ext.encode(paramstring);
						this.initPeriodPanel.store.load(
					   {
					       params : 
					       {
					    	  start:0,
							  limit:20
					       }
					   });
					}
					else
					{
						Ext.Msg.alert("错误", r.msg);
					}
				},
				failure : function(response)
    			{
    				Ext.Msg.alert("错误","新增科目期初余额失败！");
    				return;
    			},
				scope:this
			});
		}
		else
		{
			var uqcompanyid = Ext.getCmp('company').getXyValue();
			var accountid = this.account.getXyValue();
			var varaccountcode = this.account.getCodeValue();
			//var mnydebitperiod = this.mnyDebitPeriod.getValue();
			//var mnycreditperiod = this.mnyCreditPeriod.getValue();
			
			if(this.mnyDebitPeriod.getValue()==null||this.mnyDebitPeriod.getValue()=="")
			{
				var mnydebitperiod = 0;
			}
			else
			{
				var mnydebitperiod = this.mnyDebitPeriod.getValue();
			}
			
			if(this.mnyCreditPeriod.getValue()==null||this.mnyCreditPeriod.getValue()=="")
			{
				var mnycreditperiod = 0;
			}
			else
			{
				var mnycreditperiod = this.mnyCreditPeriod.getValue();
			}
			
			var paramString = 
			{
				uqcompanyid : uqcompanyid,
				accountid : accountid,
				varaccountcode : varaccountcode,
				mnydebitperiod : mnydebitperiod+"",
				mnycreditperiod : mnycreditperiod+""
			}
			
			Ext.Ajax.request(
			{
				url : "datamanager/initperiod/editinitperiod",
				params :
    			{
    				paramString : Ext.encode(paramString)
    			},
				success : function(response)
				{
					var r = Ext.decode(response.responseText);
					if (r.success)
					{
						Ext.Msg.alert("提示", "修改科目期初余额成功！");
						this.close();
						this.initPeriodPanel.store.reload();
					}
					else
					{
						Ext.Msg.alert("错误", r.msg);
					}
				},
				failure : function(response)
    			{
    				Ext.Msg.alert("错误","修改科目期初余额失败！");
    				return;
    			},
				scope:this
			});
		}	
	},
	//根据状态来判断组件的值是否能够被修改
	isEdit : function()
	{	
		
		if(this.title == "修改")
		{
			//如果时修改，则给组件赋值
			this.account.setXyValue(this.setAccountValue(this.record.get("uqaccountid"),
					this.record.get("varaccountcode"),this.record.get("varaccountname")));
			this.mnyDebitPeriod.setValue(this.record.get("mnydebitperiod"));
			this.mnyCreditPeriod.setValue(this.record.get("mnycreditperiod"));
			//修改时，科目不允许修改
			this.account.disable();
		}
	},
	//给科目组件赋值，需要传入一个对象
	setAccountValue : function(accountid,accountcode,accountname)
	{
		var tempValue=
		{
			displayField :"uqaccountid",
	    	valueField :"text",
	    	uqaccountid : accountid,
	    	text : '['+accountcode+']'+accountname,
	    	varaccountcode : accountcode
		};
		return tempValue;
	}   
});