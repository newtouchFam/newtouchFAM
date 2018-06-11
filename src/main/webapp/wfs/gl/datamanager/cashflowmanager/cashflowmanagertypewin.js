Ext.namespace("gl.datamamager.cashflowmanager");
/**
 * 类别编辑面板
 */
gl.datamamager.cashflowmanager.cashflowtypewin = Ext.extend(Ext.Window, 
{
	title : '编辑类别',
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
    	
    	this.vartypecode = new Ext.form.TextField(
    	{
    		id : 'vartypecode',
    		fieldLabel : '类别编号<span style="color:red;">*</span>',
    		readOnly : false,
    		labelStyle : 'text-align:right;',
    		allowBlank : false,
    		anchor : '100%'
    	}); 
    	
     	this.vartypename = new Ext.form.TextField(
     	{
     	    id : 'vartypename',
     	    fieldLabel : '类别名称<span style="color:red;">*</span>',
     	    readOnly : false,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : false,
     	    anchor : '100%'
     	}); 
     	
     	this.parentname = new Ext.form.TextField(
     	{
     	    id : 'parentname',
     	    fieldLabel : '上级类别<span style="color:red;">*</span>',
     	    disabled : true,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : false,
     	    anchor : '100%'
     	}); 
     	
     	//类别ID
     	this.uqflowtypeid = new Ext.form.Hidden(
     	{
     		id : 'uqflowtypeid',
     		readOnly : true
     	});
     	
     	//父级ID
     	this.uqparentid = new Ext.form.Hidden(
     	{
     		id : 'uqparentid',
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
				items : [this.vartypecode]
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
    			items : [this.vartypename]
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
 			items : [this.uqflowtypeid, this.uqparentid]
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
	    	handler : this.savecashflowtypeHandler,
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
    	gl.datamamager.cashflowmanager.cashflowtypewin.superclass.initComponent.call(this);
    	
    	//赋初值
    	if (this.flag == "add")
		{
    		if(this.record != null && this.record != '')
    		{
    			//父级id、父级名称
    			this.uqparentid.setValue(this.record.get("uqflowtypeid"));
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
    		//通过树节点传入
    		if(this.node != null)
    		{
    			this.vartypecode.setValue(this.node.attributes.varcode);
    			this.vartypename.setValue(this.node.attributes.varname);
    			this.uqparentid.setValue(this.node.attributes.uqparentid);
    			this.parentname.setValue(this.node.attributes.parentname);
    			this.uqflowtypeid.setValue(this.node.id);
    		}
    	}	
    },
    savecashflowtypeHandler : function()
    {
    	if (this.flag == "add")
		{
			this.addcashtype();
		}
		else if (this.flag == "edit")	//修改
		{
			this.editcashtype();
		}
    },
    addcashtype : function()
    {
    	//验证非空
    	if(!this.validate())
		{
    		return;
		}
    	else
    	{
    		var vartypecode = this.vartypecode.getValue();
    		var vartypename = this.vartypename.getValue();
    		var uqparentid = this.uqparentid.getValue();
    		var parentname = this.parentname.getValue();
    		var uqflowtypeid = this.uqflowtypeid.getValue();
    		var obj = 
	    	{
    			vartypecode : vartypecode,
	    		vartypename : vartypename,
	    		uqparentid  : uqparentid,
	    		parentname  : parentname,
	    		uqflowtypeid : uqflowtypeid
	    	};
    		Ext.Ajax.request(
    	    {
    	    	
    	    	url : "datamanager/cashflowmanager/addType",
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
    	        		//如果是1级别 从root加载树
    	        		if(this.node.attributes.intlevel=="1")
    	        		{
    	        			Ext.getCmp("cashflowtree").getLoader().load(Ext.getCmp("cashflowtree").root);
    	        		}
    	        		if(this.node != null)
    		    		{
    	        			//是叶子节点
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
    					Ext.Msg.alert("成功","类别新增成功！");
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
    editcashtype : function()
    {
    	//验证非空
    	if(!this.validate())
		{
    		return;
		}
    	else
    	{
    		var vartypecode = this.vartypecode.getValue();
    		var vartypename = this.vartypename.getValue();
    		var uqparentid = this.uqparentid.getValue();
    		var parentname = this.parentname.getValue();
    		var uqflowtypeid = this.uqflowtypeid.getValue();
    		var obj =
	    	{
	    		vartypecode : vartypecode,
	    		vartypename : vartypename,
	    		uqparentid  : uqparentid,
	    		parentname  : parentname,
	    		uqflowtypeid : uqflowtypeid
	    	};
    		Ext.Ajax.request(
    	    {
    	    	
    	    	url : "datamanager/cashflowmanager/editType",
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
    					if(this.node.attributes.intlevel=="1")
    					{
    						Ext.getCmp("cashflowtree").root.reload();
    					}
    					else
    					{
    						Ext.getCmp("cashflowtree").getLoader().baseParams.parentId = this.node.attributes.uqparentid;
            				Ext.getCmp("cashflowtree").getLoader().load(Ext.getCmp("cashflowtree").getNodeById(this.node.attributes.uqparentid));
    					}
    					
    					Ext.getCmp("cashflowlist").store.reload();
    					Ext.Msg.alert("成功","类别修改成功！");
    				}
    				else 
    				{
        				Ext.Msg.alert("提示", r.msg);
        				return;
    				}
    			},
    			failure : function(response)
    			{
    				Ext.Msg.alert("错误","类别列表失败！");
    				return;
    			},
    			scope : this
    	    });
    	}
    },
  
    //设置各组件非空验证
    validate : function()
    {
    	if (this.vartypecode.getValue() == "" || this.vartypecode.getValue() == null) 
		{
			Ext.Msg.alert("提示", "请先输入类别编号！");
			return false;
		}
		if (this.vartypename.getValue() == "" || this.vartypename.getValue() == null) 
		{
			Ext.Msg.alert("提示", "请先填写类别名称！");
			return false;
		}
		return true;
    }
});