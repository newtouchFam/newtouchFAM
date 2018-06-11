/**
 * 弹出窗体
 */
Ext.namespace("gl.datamanager.accountsetmanager");
//new一个window
gl.datamanager.accountsetmanager.accountconfigadd = Ext.extend(Ext.Window,
{
	//属性 声明变量 布局
	id : 'accountconfigadd',
	title : '',
	enableColumnMove : false,
	enableHdMenu : false,
	border : false,
	buttonAlign : 'right',
	width : 350,
	height : 245,
    layout : 'fit',
    modal : true,
    record : null,
    resizable : false,
    accountgridpanel : null,
    
	
	//initComponent
    initComponent : function()
	{
    	//判断  如果是新增 编码是可填写的 是修改只能读
    	var boolalue = '';
    	if(this.title=='新增')
    	{
    		boolalue = false;
    	}
    	else
    	{
    		boolalue = true ;
    	}
		//TextField	2个一个是code  一个name
    	this.varaccountcode = new Ext.form.TextField(
		{
			id : 'varaccountcode',
			fieldLabel : '帐套编码<span style="color:red;">*</span>',
			readOnly : boolalue,
			labelStyle : 'text-align:right;',
			allowBlank : false
		});
    	
    	this.varaccountname = new Ext.form.TextField(
		{
			id : 'varaccountname',
			fieldLabel : '帐套名称<span style="color:red;">*</span>',
			readOnly : false,
			labelStyle : 'text-align:right;',
			allowBlank : false
		});
		//Hidden id
    	this.uqaccountsetid = new Ext.form.Hidden(
		{
			id : 'uqaccountsetid',
			fieldLabel : '帐套ID<span style="color:red;">*</span>',
			readOnly : true,
			labelStyle : 'text-align:right;',
			allowBlank : false
		});

		//new 一个FormPanel 将组件都加入
    	this.formPanel = new Ext.form.FormPanel(
		{
			width : 260,
			hight : 400,
			frame : true,
			items : [this.uqaccountsetid,this.varaccountcode,this.varaccountname]
		});
		//this.items接收formpanel
    	this.items = [this.formPanel];

		//buttons 保存 或取消  
    	this.buttons = [
	    {	
	    	text : '保存',
	    	handler : this.updateRecordHandler,
	    	scope : this
	    },
	    {
	    	text : '关闭',
			handler : function()
			{
			  this.close();
			},
			scope : this
		}];
		//调用构造器
    	gl.datamanager.accountsetmanager.accountconfigadd.superclass.initComponent.call(this);
		//if判断是新增要像组件里set值进去
    	if (this.title=='修改' )
		{
			this.varaccountcode.setValue(this.record.get("varaccountsetcode"));
			this.varaccountname.setValue(this.record.get("varaccountsetname"));
			this.uqaccountsetid.setValue(this.record.get("uqaccountsetid"));
		}	
	},
	
	//判断是新增还是修改
	updateRecordHandler : function() 
	{	
		if (this.title == '新增')
		{
			this.addRecord();
		}
		else	//修改
		{
			this.editRecord();
		}
	},
	
	//新增的方法
	addRecord : function() 
	{
		//getForm	获取组件的值作为参数传递
		var form=this.formPanel.getForm();
		if(form.isValid())
		{
			//add的action
	    	Ext.Ajax.request(
	    	{
				url : "/datamanager/accountsetmanager/addaccountset",
				method : "post",
				params :
				{
					varaccountsetcode : Ext.getCmp("varaccountcode").getValue(),
					varaccountsetname : Ext.getCmp("varaccountname").getValue()
				},
				success : function(response) 
				{
					var r = Ext.decode(response.responseText);
					if (r.success) 
					{
						Ext.Msg.alert("提示", "新增成功！");
						this.close();
						this.accountgridpanel.store.reload();
					} 
					else 
					{
	    				Ext.Msg.alert("提示", r.msg);        				
					}
					
				},
				failure : function(response)
				{
					Ext.Msg.alert("错误","新增失败！");
					return;
				},
				scope : this
			});
		}
	},
	editRecord : function() 
	{
		//getForm	获取组件的值作为参数传递
		var form=this.formPanel.getForm();
		if(form.isValid())
		{
			//add的action
			Ext.Ajax.request(
			{
				url : "/datamanager/accountsetmanager/editaccountset",
				method : "post",
				params :
				{
					uqaccountsetid : Ext.getCmp("uqaccountsetid").getValue(),
					varaccountsetcode : Ext.getCmp("varaccountcode").getValue(),
					varaccountsetname : Ext.getCmp("varaccountname").getValue()
				},
				success : function(response) 
				{
					var r = Ext.decode(response.responseText);
					if (r.success) 
					{
						Ext.Msg.alert("提示", "修改成功！");
						this.close();
					//	Ext.getCmp("accountconfigpanel").store.reload();
						this.accountgridpanel.store.reload();
					} 
					else 
					{
						Ext.Msg.alert("提示", r.msg);        				
					}
					
				},
				failure : function(response)
				{
					Ext.Msg.alert("错误","修改失败！");
					return;
				},
				scope : this
			});
		}
	},
	
	//修改的方法
	editRecord1 : function()
	{
		//getForm	获取组件的值作为参数传递 选择行的id
		var form=this.formPanel.getForm();
		if(form.isValid())
		{
			//Ajax请求
	    	Ext.Ajax.request(
	    	{
				url : "/datamanager/accountsetmanager/editaccountset",
				method : "post",
				params :
				{
					uqaccountsetid : Ext.getCmp("uqaccountsetid").getValue(),
					varaccountsetcode : Ext.getCmp("varaccountcode").getValue(),
					varaccountsetname : Ext.getCmp("varaccountname").getValue()
				},
				success : function(response) 
				{
					var r = Ext.decode(response.responseText);
					if (r.success) 
					{
						this.close();
						Ext.Msg.alert("提示", "已经修改成功！");
						this.accountgridpanel.store.reload();
					} 
					else 
					{
						this.close();
	    				Ext.Msg.alert("提示", r.msg);        				
					}
					this.close();
				},
				failure : function(response)
				{
					Ext.Msg.alert("错误","修改失败！");
					return;
				},
				scope : this
			});
		}
	}
});