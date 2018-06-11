Ext.namespace("gl.datamamager.ledgermanager");
/**
 * 分户类别新增或修改弹窗
 */
gl.datamamager.ledgermanager.ledgeritemwin = Ext.extend(Ext.Window, 
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
    	this.varledgecode = new Ext.form.TextField(
		{
			id : 'varledgecode',
			fieldLabel : '分户项目编码<span style="color:red;">*</span>',
			disabled : boolalue,
			labelStyle : 'text-align:right;',
			allowBlank : false,
			anchor : '100%'
		});
    	
    	this.varledgename = new Ext.form.TextField(
		{
			id : 'varledgename',
			fieldLabel : '分户项目名称<span style="color:red;">*</span>',
			readOnly : false,
			labelStyle : 'text-align:right;',
			allowBlank : false,
			anchor : '100%'
		});
    	
    	this.parentcodeandname = new Ext.form.TextField(
		{
			id : 'parentcodeandname',
			fieldLabel : '上级分户项目',
			disabled : true,
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
    	
    	this.uqledgeid = new Ext.form.Hidden(
		{
			id : 'uqledgeid',
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
				items : [this.varledgecode]
			}]
		};
    	
    	var row2 = 
		{
			layout : 'column',
			border : false,
			height : 36,
			items : 
			[{
				columnWidth : .67,
				layout : 'form',
				border : false,
				items : [this.varledgename]
			}]
		};
    	
    	var row3 = 
		{
			layout : 'column',
			border : false,
			height : 36,
			items : 
			[{
				columnWidth : .67,
				layout : 'form',
				border : false,
				items : [this.parentcodeandname]
			}]
		};
    	//定义隐藏行控件，里面两个隐藏的文本框用于传参
    	var hiddenRow = 
    	{
     		layout : 'column',
     		border : false,
 			items : [this.uqparentid, this.uqledgeid]
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
	    	handler : this.saveLedgerItemHandler,
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
    	gl.datamamager.ledgermanager.ledgeritemwin.superclass.initComponent.call(this);
    	
    	//赋初值
    	if (this.flag == "add")
		{
    		//"分户项目代码"默认显示其上级的代码，"上级项目"显示其上级项目的代码+名称，格式为[代码]名称
    		if(this.node != null)
    		{
    			if(this.node.id == "00000000-0000-0000-0000-000000000000")
    			{
    				this.uqparentid.setValue(this.node.id);
    			}
    			else
    			{
    				//父级id、父级名称
        			this.uqparentid.setValue(this.node.id);
        			this.varledgecode.setValue(this.node.attributes.ledgercode);
        			//this.varledgename.setValue(this.node.attributes.ledgername);
        			this.parentcodeandname.setValue(this.node.text);
    			}
    		}
		}
    	else if(this.flag == "edit")
    	{
    		//"分户项目代码"和"上级项目"不允许用户修改，只允许用户修改分户项目名称
    		this.uqparentid.setValue(this.node.attributes.parentid);
    		this.uqledgeid.setValue(this.node.id);
    		this.varledgecode.setValue(this.node.attributes.ledgercode);
    		this.varledgename.setValue(this.node.attributes.ledgername);
    		this.parentcodeandname.setValue("["+this.node.attributes.parentcode+"]"+this.node.attributes.parentname);
    		
    	}
    },
    saveLedgerItemHandler : function()
    {
    	if (this.flag == "add")
		{
			this.addledgerItem();
		}
		else if (this.flag == "edit")	//修改
		{
			this.editledgerItem();
		}
    },
    addledgerItem : function()
    {
    	if(!this.validate())
		{
    		return;
		}
    	else
		{
    		var ledgeritemcode = this.varledgecode.getValue();
    		var ledgerietmname = this.varledgename.getValue();
    		var company = Ext.getCmp("company").getXyValue();
    		var parentid = this.uqparentid.getValue();
    		var typenode = Ext.getCmp("ledgertypetree").getSelectionModel().getSelectedNode();
    		var uqledgetypeid = typenode.id;
    		
    		var paramString = 
			{
				varledgecode : ledgeritemcode,
				varledgename : ledgerietmname,
				uqparentid : parentid,
				uqledgetypeid : uqledgetypeid,
				companyid : company
			}
    		
    		Ext.Ajax.request(
        	{
    			url : "datamanager/ledgermanager/addledgeritem",
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
    						Ext.getCmp("ledgeritemtree").getLoader().baseParams.uqledgeid = this.node.attributes.uqparentid;
    						Ext.getCmp("ledgeritemtree").getLoader().load(Ext.getCmp("ledgeritemtree").root);
    		    		}
    					Ext.Msg.alert("成功","分户项目新增成功！");
    				} 
    				else 
    				{
        				Ext.Msg.alert("提示", r.msg);
        				return;
    				}
    			},
    			failure : function(response)
    			{
    				Ext.Msg.alert("错误","分户项目新增失败！");
    				return;
    			},
    			scope : this
    		});
		}
    },
    editledgerItem : function()
    {
    	//验证非空
    	if(!this.validate())
		{
    		return;
		}
    	else
		{
    		var ledgeritemcode = this.varledgecode.getValue();
    		var ledgerietmname = this.varledgename.getValue();
    		var ledgerid = this.uqledgeid.getValue();
    		var parentid = this.uqparentid.getValue();
    		var typenode = Ext.getCmp("ledgertypetree").getSelectionModel().getSelectedNode();
    		var uqledgetypeid = typenode.id;
    		
    		var paramString = 
			{
				varledgename : ledgerietmname,
				uqledgeid : ledgerid,
				uqparentid : parentid,
				uqledgetypeid : uqledgetypeid,
				varledgecode : ledgeritemcode
			}
    		
    		Ext.Ajax.request(
        	{
    			url : "datamanager/ledgermanager/editledgeritem",
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
    						Ext.getCmp("ledgeritemtree").getLoader().baseParams.uqledgeid = this.node.attributes.uqparentid;
    						Ext.getCmp("ledgeritemtree").getLoader().load(Ext.getCmp("ledgeritemtree").root);
    		    		}
    					Ext.Msg.alert("成功","分户项目修改成功！");
    				} 
    				else 
    				{
        				Ext.Msg.alert("提示", r.msg);
        				return;
    				}
    			},
    			failure : function(response)
    			{
    				Ext.Msg.alert("错误","分户项目修改失败！");
    				return;
    			},
    			scope : this
    		});
		}
    },
    //设置各组件非空验证
	validate : function()
	{
		if (this.varledgecode.getValue() == "" || this.varledgecode.getValue() == null) 
		{
			Ext.Msg.alert("提示", "请先输入分户项目编码！");
			return false;
		}
		if (this.varledgename.getValue() == "" || this.varledgename.getValue() == null) 
		{
			Ext.Msg.alert("提示", "请先填写分户项目名称！");
			return false;
		}
		return true;
	}
});