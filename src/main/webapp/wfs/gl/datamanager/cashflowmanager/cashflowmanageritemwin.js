Ext.namespace("gl.datamamager.cashflowmanager");

gl.datamamager.cashflowmanager.cashflowitemwin = Ext.extend(Ext.Window, 
{
	title : '编辑项目',
	autoHeight : true,
	enableColumnMove : false,
	enableHdMenu : false,
	border : false,
	buttonAlign : 'right',
	width : 500,
	height : 260,
    layout : 'fit',
    modal : true,
    resizable : false,
    record : null,
    node : null,
    flag : '',
    
    //初始化面板
	initComponent : function()
    {
		//判断当前是新曾还是修改
    	var boolalue = '';
    	if(this.flag=='add')
    	{
    		boolalue = false;
    	}
    	else if (this.flag=='edit')
    	{
    		boolalue = true ;
        }
    	
    	this.varitemcode = new Ext.form.TextField(
    	{
    	    id : 'varitemcode',
    	    fieldLabel : '项目编号<span style="color:red;">*</span>',
    	    readOnly : false,
    	    labelStyle : 'text-align:right;',
    	    allowBlank : false,
    	    anchor : '100%'
    	});
    	
    	this.varitemname = new Ext.form.TextField(
    	{
    	    id : 'varitemname',
    	    fieldLabel : '项目名称<span style="color:red;">*</span>',
    	    readOnly : false,
    	    labelStyle : 'text-align:right;',
    	    allowBlank : false,
    	    anchor : '100%'
    	});
    	
    	this.parentname = new Ext.form.TextField(
    	{
    	    id : 'parentname',
    	    fieldLabel : '所属分类<span style="color:red;">*</span>',
    	    disabled : true,
    	    labelStyle : 'text-align:right;',
    	    allowBlank : false,
    	    anchor : '100%'
    	});
    	
    	this.uqflowitemid = new Ext.form.Hidden(
    	{
    	    id : 'uqflowitemid',
    	    readOnly : true
    	});
    	
    	//父级ID
     	this.uqparentid = new Ext.form.Hidden(
     	{
     		id : 'uqparentid',
     		readOnly : true
     	});
     	
     	//所属类别编号
     	this.varcode = new Ext.form.Hidden(
     	{
     		id : 'varcode',
     		readOnly : true
     	});
     	
    	var row1 = 
     	{
     		layout : 'column',
    		border : false,
    		height : 36,
    		items :
    		[{
    			columnWidth : .45,
				layout : 'form',
				border : false,
				items : [this.varitemcode]
    		}]
     	};
     	var row2 = 
     	{
     		layout : 'column',
        	border : false,
        	height : 36,
        	items :
        	[{
        		columnWidth : .45,
    			layout : 'form',
    			border : false,
    			items : [this.varitemname]
        	}]	
     	};
     	var row3 = 
     	{
     		layout : 'column',
            border : false,
            height : 36,
            items :
            [{
            	columnWidth : .45,
        		layout : 'form',
        		border : false,
        		items : [this.parentname]
            }]	
     	};
     	
     	//定义隐藏行控件，里面两个隐藏的文本框用于传参
     	var hiddenRow = 
    	{
     		layout : 'column',
     		border : false,
 			items : [this.uqflowitemid, this.uqparentid, this.varcode]
        };
     	
    	//声明的控件放到formPanel中
     	this.formPanel = new Ext.Panel(
     	{
     		frame : true,
     		autoHeight : true,
     		items : [row1,row2,row3,hiddenRow]
     	});
     	
    	//加入items
    	this.items = [this.formPanel]; 
    	
    	//定义按钮
    	this.buttons = [
	    {	
	    	text : '保存',
	    	handler : this.savecashflowitemHandler,
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
    	
    	//渲染
    	gl.datamamager.cashflowmanager.cashflowitemwin.superclass.initComponent.call(this);
    
    	//赋初值
    	if (this.flag == "add")
		{
    		if(this.record != null && this.record != '')
    		{
    			//设置类别编号
    			this.varcode.setValue(this.record.get("vartypecode"));
    			//父级id、父级名称
    			this.uqparentid.setValue(this.record.get("uqflowitemid"));
    			this.parentname.setValue("["+this.record.get("vartypecode")+"]"+this.record.get("vartypename"));
    		}
    		if(this.node != null)
    		{
    			if(this.node.id == "00000000-0000-0000-0000-000000000000")
    			{
    				this.uqparentid.setValue(this.node.id);
    				this.parentname.setValue("[0000]类别");
    			}
    			else
    			{
    				//父级id、父级名称
        			this.uqparentid.setValue(this.node.id);
        			this.parentname.setValue(this.node.text);
    			}
    		}	
		}
    	
    	else if(this.flag == "edit")
    	{
    		//因为是修改操作，所以首先要往各个组件上放值，否则各个组件上就是空白的内容
    		if(this.record != null && this.record != '')
    		{
    			this.varitemcode.setValue(this.record.get("varitemcode"));
    			this.varitemname.setValue(this.record.get("varitemname"));
    			this.uqparentid.setValue(this.record.get("uqparentid"));
    			this.parentname.setValue("["+this.record.get("vartypecode")+"]"+this.record.get("vartypename"));
    			this.uqflowitemid.setValue(this.record.get("uqflowitemid"));
    		}
    	}
    },

	savecashflowitemHandler : function()
	{
    	if (this.flag == "add")
		{
			this.addcashitem();
		}
		else if (this.flag == "edit")	//修改
		{
			this.editcashitem();
		}
	},
	
	addcashitem : function()
	{
		if (this.node == "" || this.node == null) 
		{
			var uqflowtypeid = "";
		}
		else
		{
			var uqflowtypeid = this.node.id;
		}
		
		//验证非空
    	if(!this.validate())
		{
    		return;
		}
    	else
    	{
    		var varitemcode = this.varitemcode.getValue();
    		var varitemname = this.varitemname.getValue();
    		var uqparentid = this.uqparentid.getValue();
    		var parentname = this.parentname.getValue();
    		var uqflowitemid = this.uqflowitemid.getValue();
    		//获取选择项目时 项目的所属分类编码
    		var uqvarcode = this.varcode.getValue();
    		var obj = 
    		{
				varitemcode : varitemcode,
	    		varitemname : varitemname,
	    		uqflowtypeid : uqflowtypeid/*this.node.id*//*uqparentid*/,
	    		uqvarcode : uqvarcode
    		};
    		Ext.Ajax.request(
    	    {
    	    	url : "datamanager/cashflowmanager/addItems",
    	    	method : "post",
    	    	params :
    	    	{
    	    		jsonCondition : Ext.encode(obj)
    	    	},
    	    	success : function(response) 
    	    	{
    	    		var r = Ext.decode(response.responseText);
    	        	if (r.success)
    	        	{
    	        		this.close();
    	        		//重新加载数和列表
    	        		if(this.record != null && this.record != '')
        		    	{
    	        			var treenode = Ext.getCmp("cashflowtree").getNodeById(this.record.get("uqparentid"));
    						if(typeof treenode != "undefined")
    						{
    							Ext.getCmp("cashflowtree").getLoader().baseParams.parentId = this.record.get("uqparentid");
                				Ext.getCmp("cashflowtree").getLoader().load(treenode);
    						}
      		    		}
    	        		if(this.node != null)
    		    		{
    	        			if(this.node.leaf)
    						{
    							Ext.getCmp("cashflowtree").getLoader().baseParams.parentId = this.node.attributes.uqparentid;
                				Ext.getCmp("cashflowtree").getLoader().load(Ext.getCmp("cashflowtree").getNodeById(this.node.attributes.uqparentid));
    						}
    	        			else
    						{
                				Ext.getCmp("cashflowtree").getLoader().load(Ext.getCmp("cashflowtree").getNodeById(this.node.id));
    						}
    		    		}
    	        		Ext.getCmp("cashflowlist").store.reload();
    					Ext.Msg.alert("成功","项目新增成功！");
    	        	}
    	        	else 
    				{
        				Ext.Msg.alert("提示", r.msg);
        				return;
    				}
    	    	},
    	    	 failure : function(response)
     			{
     				Ext.Msg.alert("错误","类别新增失败！");
     				return;
     			},
     			scope : this
    	    });
    	}
	},
	
	editcashitem : function()
	{
		//验证非空
    	if(!this.validate())
		{
    		return;
		}
    	else
    	{
    		//在修改过后，从各个组件上取值
    		var varitemcode = this.varitemcode.getValue();
    		var varitemname = this.varitemname.getValue();
    		var uqparentid = this.uqparentid.getValue();
    		var parentname = this.parentname.getValue();
    		var uqflowitemid = this.uqflowitemid.getValue();
    		var obj =
    		{
				varitemcode : varitemcode,
	    		varitemname : varitemname,
	    		uqparentid  : uqparentid,
	    		parentname  : parentname,
	    		uqflowitemid : uqflowitemid
    		}
    		Ext.Ajax.request(
    	    {
    	    	url : "datamanager/cashflowmanager/editItems",
    	    	method : "post",
    	    	params :
    	        {
    	    		jsonCondition : Ext.encode(obj)
    	        },
    	    	success : function(response) 
    	    	{
    	    		var r = Ext.decode(response.responseText);
    				if (r.success) 
    				{
    					this.close();
    					//重新加载树和列表
    					if(this.record != null && this.record != '')
    		    		{
    						var treenode = Ext.getCmp("cashflowtree").getNodeById(this.record.get("uqparentid"));
    						if(typeof treenode != "undefined")
    						{
    							Ext.getCmp("cashflowtree").getLoader().baseParams.parentId = this.record.get("uqparentid");
                				Ext.getCmp("cashflowtree").getLoader().load(treenode);
    						}
    		    		}
    					if(this.node != null)
    		    		{
    						Ext.getCmp("cashflowtree").getLoader().baseParams.parentId = this.node.attributes.uqparentid;
            				Ext.getCmp("cashflowtree").getLoader().load(Ext.getCmp("cashflowtree").getNodeById(this.node.attributes.uqparentid));
    		    		}
    					Ext.getCmp("cashflowlist").store.reload();
    					Ext.Msg.alert("成功","项目修改成功！");
    				}
    				else 
    				{
        				Ext.Msg.alert("提示", r.msg);
        				return;
    				}
    	    	},
    	    	failure : function(response)
    			{
    				Ext.Msg.alert("错误","项目修改失败！");
    				return;
    			},
    			scope : this
    	    });
    	}
	},
	
	validate : function()
    {
    	if (this.varitemcode.getValue() == "" || this.varitemcode.getValue() == null) 
		{
			Ext.Msg.alert("提示", "请先输入项目编号！");
			return false;
		}
		if (this.varitemname.getValue() == "" || this.varitemname.getValue() == null) 
		{
			Ext.Msg.alert("提示", "请先填写项目名称！");
			return false;
		}
		return true;
    }
});
    	        		
