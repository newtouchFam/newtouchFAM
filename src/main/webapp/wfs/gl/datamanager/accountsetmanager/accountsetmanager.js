/**
 * 主界面js 一个panel 
 */
Ext.namespace("gl.datamanager.accountsetmanager");
//new 一个panel 
gl.datamanager.accountsetmanager.MainPanel = Ext.extend(Ext.Panel,
{
	//属性 布局fit 等
	id : 'mainpanel',
	frame : false,
	border : false,
	layout : 'fit',
	
	//initComponent
	initComponent : function()
	{
		//声明增加按钮
		var addButton =
		{
			text : '增加',
			iconCls : "xy-add",
			handler : this.addHandler,	
			scope : this				
		};
		//声明修改按钮
		var editButton =
		{
			text : '修改',
			iconCls : "xy-edit",
			handler : this.editHandler,	
			scope : this				
		};
		//声明删除按钮
		var deleteButton =
		{
			text : '删除',
			iconCls : "xy-delete",
			handler : this.delHandler,	
			scope : this				
		};
		//声明启用按钮
		var startButton =
		{
			text : '启用',
			iconCls : "xy-act-post ",
			handler : this.startHandler,	
			scope : this				
		};
		//声明关闭按钮
		var closeButton =
		{
			text : '关闭',
			iconCls : "xy-stop ",
			handler : this.closeHandler,	
			scope : this				
		};
		//this.tbar
		var barTop = ['-',  addButton, '-', editButton, '-',deleteButton ,'-', startButton, '-', closeButton];
		this.tbar = barTop;
		//new 一个GridPanel显示帐套列表信息
		this.accountconfig = new gl.datamanager.accountsetmanager.AccountConfigPanel({});
		//items接收panel
		this.items = [this.accountconfig];
		//调用构造器
		gl.datamanager.accountsetmanager.MainPanel.superclass.initComponent.call(this);
		//给gridpanel增加一个监听 双击事件
		//addListener( String eventName, Function handler, [Object scope], [Object options] ) : void 
		this.accountconfig.addListener('rowdblclick',this.editHandler,this);
	},
	//双击事件
	clickHandler : function(accountconfig,rowIdx,eobj)
	{
		var record = accountconfig.store.getAt(rowIdx);
		var accountconfigadd = new gl.datamanager.accountsetmanager.accountconfigadd(
		{
			title : '修改',
			record : record,
			accountgridpanel : this //this代表gridpanel了
		});
		accountconfigadd.show();
	},
	//新增
	addHandler : function() 
	{
		//new accountsetmanageradd
		var accountconfigadd = new gl.datamanager.accountsetmanager.accountconfigadd(
		{
			//传title
			title : '新增',
			//传record 列表gridpanel
			accountgridpanel : this.accountconfig
		});     
		//.show()
		accountconfigadd.show();
	},	
	
	//修改
	editHandler : function()
	{
		var records = this.accountconfig.getSelectionModel().getSelections();
		
		//以下都判断record是否为空 且record是否大于1
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要修改的帐套！");
			return;
		}
		//且record是否大于1 修改只能选一条
		if(records.length>1)
		{
			Ext.Msg.alert("提示", "一次只能修改一个帐套！");
			return;
		}
		var record = records[0];
		var accountconfigadd = new gl.datamanager.accountsetmanager.accountconfigadd(
		{
			//传record 列表gridpanel
			title : '修改',
			record : record,
			accountgridpanel : this.accountconfig
		});
		//.show()
		accountconfigadd.show();
	},
	
	//删除
	delHandler : function()
	{
		var records = this.accountconfig.getSelectionModel().getSelections();
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要删除的帐套！");
			return;
		}
		//遍历行数据  且判断状态
		var idarray = [];
    	//遍历数组 得到record 先判断状态是否符合 不符合直接报错 返回
    	for(var i = 0; i < records.length; i ++)
    	{
    		var obj = {};
    		var record = records[i];
    		if(record.get("intflag")==1)//只有新建状态才能删除
    		{
    			//将得到的ID放入数组中
    			idarray[i] = record.get("uqaccountsetid");
    		}
    		else
    		{
    			Ext.Msg.alert("提示", "帐套:"+record.get("varaccountsetname")+"不是新建状态，不能删除");
    			return;
    		}
    	}
		Ext.Msg.confirm("提示", "请确认是否要删除所选帐套?", function(btn)
		{
			if (btn == "yes") 
			{
				Ext.Ajax.request(
				{
					url : "/datamanager/accountsetmanager/delaccountset",
					params :
					{
						idarrays : idarray
	              	},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success) 
						{
							Ext.Msg.alert("提示", "已删除！");
							this.accountconfig.store.reload();
						}
						else
						{
							Ext.Msg.alert("错误", r.errDesc);
						}
					},
					failure : function(response)
        			{
        				Ext.Msg.alert("错误","删除失败！");
        				return;
        			},
					scope:this
				});
			}
		},this);
	},
			
	//启用
	startHandler : function()
	{
		//获得选择行
		var records = this.accountconfig.getSelectionModel().getSelections();	
		//判断选择行是否为空
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要启用所选的帐套！");
			return;
		}
		var idarray = [];
		//遍历选择行 并判断状态是否符合
    	for(var i = 0; i < records.length; i ++)
    	{
    		var record = records[i];
    		if(record.get("intflag")==1||record.get("intflag")==0||record.get("intflag")==2)//只有关闭或新建状态才能启用
    		{
    			idarray[i] = record.get("uqaccountsetid");
    		}
    		else
    		{
    			Ext.Msg.alert("提示", "帐套:"+record.get("varaccountsetname")+"不是新建或关闭状态，不能启用");
    			return;
    		}
    	}
		Ext.Msg.confirm("提示", "请确认是否启用所选帐套？", function(btn)
		{
			if (btn == "yes") 
			{				
				Ext.Ajax.request(
				{
					url : "/datamanager/accountsetmanager/startaccountset",
					params :
					{
						idarrays : idarray,
						intflag : 2
	              	},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success) 
						{
							Ext.Msg.alert("提示", "已启用！");
							this.accountconfig.store.reload();
						}
						else
						{
							Ext.Msg.alert("错误", r.errDesc);
						}
					},
					failure : function(response)
        			{
        				Ext.Msg.alert("错误","启用失败！");
        				return;
        			},
					scope:this
				});
			}
		},this);
	},
	
	//关闭
		//遍历records判断各个状态是否是启用的 是启用的继续执行
		//此时提示 启用中将要关闭的name....
		//根据records 为参数   执行action
	closeHandler : function()
	{
		var records = this.accountconfig.getSelectionModel().getSelections();
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要关闭的帐套！");
			return;
		}
		var idarray = [];
    	for(var i = 0; i < records.length; i ++)
    	{
    		var record = records[i];
    		if(record.get("intflag")==2||record.get("intflag")==0)//只有启用状态才能关闭
    		{
    			idarray[i] = record.get("uqaccountsetid");
    		}
    		else
    		{
    			Ext.Msg.alert("提示", "帐套:"+record.get("varaccountsetname")+"不是启用状态，不能关闭");
    			return;
    		}
    	}
		Ext.Msg.confirm("提示", "请确认是否所选关闭帐套？", function(btn)
		{
			if (btn == "yes") 
			{				
				Ext.Ajax.request(
				{
					url : "/datamanager/accountsetmanager/startaccountset",
					params :
					{
						idarrays : idarray,
						intflag : 0
	              	},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success) 
						{
							Ext.Msg.alert("提示", "已关闭！");
							this.accountconfig.store.reload();
						}
						else
						{
							Ext.Msg.alert("错误", r.errDesc);
						}
					},
					failure : function(response)
        			{
        				Ext.Msg.alert("错误","关闭失败！");
        				return;
        			},
					scope:this
				});
			}
		},this);
	}
});
//init()
function init()
{
	new Ext.Viewport(
	{
		layout : 'fit',
		items : [ new gl.datamanager.accountsetmanager.MainPanel ]
	});
};
//Ext.BLANK_IMAGE_URL
//onReady(init)
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);	