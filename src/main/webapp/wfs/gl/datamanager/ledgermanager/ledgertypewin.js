Ext.namespace("gl.datamamager.ledgermanager");
/**
 * 分户类别新增或修改弹窗
 * 
 */
gl.datamamager.ledgermanager.ledgertypewin = Ext.extend(Ext.Window, 
{
	title : '编辑分户',
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
		//判断当前是新增还是修改
    	var boolalue = '';
    	if(this.flag=='add')
    	{
    		boolalue = false;
    	}
    	else if (this.flag=='edit')
    	{
    		boolalue = true ;
    	}
    	
    	//定义的文本框组件
    	this.varledgetypename = new Ext.form.TextField(
		{
			id : 'varledgetypename',
			fieldLabel : '分户类别名称<span style="color:red;">*</span>',
			readOnly : false,
			labelStyle : 'text-align:right;',
			allowBlank : false,
			anchor : '100%'
		});
    	
    	//定义两个隐藏的from用于传递参数
    	this.uqparentid = new Ext.form.Hidden(
		{
			id : 'uqparentid',
			readOnly : true
		});
    	
    	this.uqledgetypeid = new Ext.form.Hidden(
		{
			id : 'uqledgetypeid',
			readOnly : true
		});
    	
    	//定义行控件，放置文本框
    	var row1 = 
		{
			layout : 'column',
			border : false,
			height : 36,
			items : 
			[{
				columnWidth : .67,
				layout : 'form',
				border : false,
				items : [this.varledgetypename]
			}]
		};
    	
    	//定义隐藏行控件，里面两个隐藏的文本框用于传参
    	 var hiddenRow = 
    	 {
     		layout : 'column',
     		border : false,
 			items : 
 				[this.uqparentid, this.uqledgetypeid]
         }
   	
    	//声明的控件放到formPanel中
    	this.formPanel = new Ext.Panel(
		{
			frame : true,
			autoHeight : true,
			items : [row1,hiddenRow]
		});
    	 
    	//加入items
    	this.items = [this.formPanel];
    	
    	//定义按钮
    	this.buttons = [
	    {	
	    	text : '保存',
	    	handler : this.saveLedgerTypeHandler,
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
    	gl.datamamager.ledgermanager.ledgertypewin.superclass.initComponent.call(this);
    	
    	//赋初值
    	if (this.flag == "add")
		{
    		if(this.node != null)
    		{
				//父级id、父级名称
				this.uqparentid.setValue(this.node.id);
    		}
		}
    	if(this.flag == "edit")
    	{
    		if(this.node!=null)
    		{
    			this.varledgetypename.setValue(this.node.text);
    			this.uqledgetypeid.setValue(this.node.id);
    		}
    	}
    },
    saveLedgerTypeHandler : function()
    {
    	if (this.flag == "add")
		{
			this.addledgerType();
		}
		else if (this.flag == "edit")	//修改
		{
			this.editledgerType();
		}
    },
    addledgerType : function()
    {
    	//验证非空
    	if(!this.validate())
		{
    		return;
		}
    	else
		{
    		var ledgetypename = this.varledgetypename.getValue();
    		var parentid=this.uqparentid.getValue();
    		
    		var paramString = 
			{
    			varledgetypename : ledgetypename
			}
    		
    		Ext.Ajax.request(
        	{
    			url : "datamanager/ledgermanager/addledgertype",
    			method : "post",
    			params :
    			{
    				paramString : Ext.encode(paramString)
    			},
    			success : function(response) 
    			{
    				var r = Ext.decode(response.responseText);
    				if (r.success) 
    				{
    					this.close();
    					//重新加载树
    					if(this.node != null)
    		    		{
    						Ext.getCmp("ledgertypetree").root.reload();
    		    		}
    					Ext.Msg.alert("成功","分户类别新增成功！");
    				} 
    				else 
    				{
        				Ext.Msg.alert("提示", r.msg);
        				return;
    				}
    			},
    			failure : function(response)
    			{
    				Ext.Msg.alert("错误","分户类别新增失败！");
    				return;
    			},
    			scope : this
    		});
		}
    },
    editledgerType : function()
    {
    	//验证非空
    	if(!this.validate())
		{
    		return;
		}
    	else
		{
    		//ajax调用
    		var ledgetypename = this.varledgetypename.getValue();
    		var ledgertypeid=this.uqledgetypeid.getValue();
    		
    		var paramString = 
			{
    			varledgetypename : ledgetypename,
    			uqledgetypeid:ledgertypeid
			}
    		
    		Ext.Ajax.request(
        	{
    			url : "datamanager/ledgermanager/editledgertype",
    			method : "post",
    			params :
    			{
    				paramString : Ext.encode(paramString)
    			},
    			success : function(response) 
    			{
    				var r = Ext.decode(response.responseText);
    				if (r.success) 
    				{
    					this.close();
    					//重新加载树
    					if(this.node != null)
    		    		{
    						Ext.getCmp("ledgertypetree").root.reload();
    		    		}
    					Ext.Msg.alert("成功","分户类别修改成功！");
    				} 
    				else 
    				{
        				Ext.Msg.alert("提示", r.msg);
        				return;
    				}
    			},
    			failure : function(response)
    			{
    				Ext.Msg.alert("错误","修改分户类别失败！");
    				return;
    			},
    			scope : this
    		});
		}
    },
    //设置各组件非空验证
	validate : function()
	{
		if (this.varledgetypename.getValue() == "" || this.varledgetypename.getValue() == null) 
		{
			Ext.Msg.alert("提示", "请输入分户类别名称！");
			return false;
		}
		return true;
	}
});