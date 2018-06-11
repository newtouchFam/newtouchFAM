Ext.namespace("gl.datamamager.accountmamager");
/**
 * 科目编辑面板
 */
gl.datamamager.accountmamager.AccounteditWin = Ext.extend(Ext.Window, 
{
	title : '编辑科目',
	autoHeight : true,
	enableColumnMove : false,
	enableHdMenu : false,
	border : false,
	buttonAlign : 'right',
	width : 500,
	height : 350,
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
    	
    	this.varaccountcode = new Ext.form.TextField(
		{
			id : 'varaccountcode',
			fieldLabel : '科目编码<span style="color:red;">*</span>',
			readOnly : boolalue,
			labelStyle : 'text-align:right;',
			allowBlank : false,
			anchor : '100%'
		});
    	
    	this.varaccountname = new Ext.form.TextField(
		{
			id : 'varaccountname',
			fieldLabel : '科目名称<span style="color:red;">*</span>',
			readOnly : false,
			labelStyle : 'text-align:right;',
			allowBlank : false,
			anchor : '100%'
		});
    	
    	this.intproperty = new Ext.app.XyComboBoxCom(
		{
			id : 'intproperty',
			loaded : false,
            leafSelect : true,
            emptyText : '请选择科目性质...',
            rootTitle : '科目性质',
            fieldLabel : '科目性质<span style="color:red;">*</span>',
            labelStyle : "text-align: right;",
            fields : ["column0", "column1"],
            editable : false,
            valueField : 'column0',
            displayField : 'column1',
            scriptPath : 'wfs',
            sqlFile : 'selectintproperty',
            anchor : '100%'
        });
    	
    	this.uqtypeid = new Ext.app.XyComboBoxCom(
		{
			id : 'uqtypeid',
			loaded : false,
            leafSelect : true,
            emptyText : '请选择科目类别...',
            rootTitle : '科目类别',
            fieldLabel : '科目类别',
            labelStyle : "text-align: right;",
            fields : ["column0", "column1"],
            editable : false,
            valueField : 'column0',
            displayField : 'column1',
            scriptPath : 'wfs',
            sqlFile : 'selectuqtypeid',
            anchor : '100%'
        });
    	
    	this.intisflow = new Ext.app.XyComboBoxCom(
		{
			id : 'intisflow',
			loaded : false,
            leafSelect : true,
            emptyText : '请选择是否需要现金流量...',
            rootTitle : '现金流量',
            fieldLabel : '现金流量<span style="color:red;">*</span>',
            labelStyle : "text-align: right;",
            fields : ["column0", "column1"],
            editable : false,
            valueField : 'column0',
            displayField : 'column1',
            scriptPath : 'wfs',
            sqlFile : 'selectintisflow',
            anchor : '100%'
        });
    	this.intisflow.on("valuechange", this.intisflowValuechange, this);
    	
    	this.uqforeigncurrid = new Ext.app.XyComboBoxCom(
		{
			id : 'uqforeigncurrid',
			loaded : false,
            leafSelect : true,
            emptyText : '请选择外币...',
            rootTitle : '外币',
            fieldLabel : '外币',
            labelStyle : "text-align: right;",
            fields : ["column0", "column1"],
            editable : false,
            valueField : 'column0',
            displayField : 'column1',
            scriptPath : 'wfs',
            sqlFile : 'selectuqforeigncurrid',
            anchor : '100%'
        });
    	
    	this.varmeasure = new Ext.app.XyComboBoxCom(
		{
			id : 'varmeasure',
			loaded : false,
            leafSelect : true,
            emptyText : '请选择计量单位...',
            rootTitle : '计量单位',
            fieldLabel : '计量单位',
            labelStyle : "text-align: right;",
            fields : ["column0", "column1"],
            editable : false,
            valueField : 'column0',
            displayField : 'column1',
            scriptPath : 'wfs',
            sqlFile : 'selectvarmeasure',
            anchor : '100%'
        });
    	
    	this.intisledge = new gl.component.xycheckedtree(
		{
			id : 'intisledge',
			fieldLabel : '分户',
			rootTitle :'分户类别',
			readOnly : false,
			leafSelect :true,
			labelStyle : 'text-align:right;',
			anchor : '100%',
			scriptPath :'wfs',
			firstSqlFile :'selectledgetype0'
		});
    	
    	this.parentname = new Ext.form.TextField(
		{
			id : 'parentname',
			fieldLabel : '上级科目<span style="color:red;">*</span>',
			readOnly : true,
			labelStyle : 'text-align:right;',
			anchor : '100%'
		});
    	
    	this.uqparentid = new Ext.form.Hidden(
		{
			id : 'uqparentid',
			readOnly : true
		});
    	
    	this.uqaccountid = new Ext.form.Hidden(
		{
			id : 'uqaccountid',
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
				items : [this.varaccountcode]
			},
			{
				columnWidth : .45,
				layout : 'form',
				border : false,
				items : [this.varaccountname]
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
				items : [this.intproperty]
			},
			{
				columnWidth : .45,
				layout : 'form',
				border : false,
				items : [this.uqtypeid]
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
				items : [this.intisflow]
			},
			{
				columnWidth : .45,
				layout : 'form',
				border : false,
				items : [this.uqforeigncurrid]
			}]
		};
    	
    	var row4 = 
		{
			layout : 'column',
			border : false,
			height : 36,
			items : 
			[{
				columnWidth : .45,
				layout : 'form',
				border : false,
				items : [this.varmeasure]
			},
			{
				columnWidth : .45,
				layout : 'form',
				border : false,
				items : [this.intisledge]
			}]
		};
    	
    	var row5 = 
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
    	
    	 var hiddenRow = 
    	 {
     		layout : 'column',
     		border : false,
 			items : 
 				[this.uqaccountid, this.uqparentid]
         }
   	
    	//声明的控件放到formPanel中
    	this.formPanel = new Ext.Panel(
		{
			frame : true,
			autoHeight : true,
			items : [row1, row2, row3, row4, row5, hiddenRow]
		});
    	//加入items
    	this.items = [this.formPanel];
    	//按钮
    	this.buttons = [
	    {	
	    	text : '保存',
	    	handler : this.saveAccountHandler,
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
    	gl.datamamager.accountmamager.AccounteditWin.superclass.initComponent.call(this);
    	
    	//赋初值
    	if (this.flag == "add")
		{
    		if(this.record != null && this.record != '')
    		{
    			//父级id、父级名称
    			this.uqparentid.setValue(this.record.get("uqaccountid"));
    			this.parentname.setValue("["+this.record.get("varaccountcode")+"]"+this.record.get("varaccountname"));
    		}
    		if(this.node != null)
    		{
    			if(this.node.id == "00000000-0000-0000-0000-000000000000")
    			{
    				this.uqparentid.setValue(this.node.id);
        			this.parentname.setValue("[0000]科目");
    			}
    			else
    			{
    				//父级id、父级名称
        			this.uqparentid.setValue(this.node.id);
        			this.parentname.setValue(this.node.text);
    			}
    		}
    		//现金流量
			var data1 = 
			{
				column0 : 0,
				column1 : "不需要"
			};
			this.intisflow.hiddenData = data1;
			this.intisflow.setXyValue(data1);
		}
    	else if(this.flag == "edit")
    	{
    		//通过列表传入
    		if(this.record != null && this.record != '')
    		{
    			//科目编号、名称、父级id、父级名称
    			this.varaccountcode.setValue(this.record.get("varaccountcode"));
    			this.varaccountname.setValue(this.record.get("varaccountname"));
    			this.uqparentid.setValue(this.record.get("uqparentid"));
    			this.parentname.setValue(this.record.get("parentname"));
    			this.uqaccountid.setValue(this.record.get("uqaccountid"));
    			
    			//科目性质
    			var data1 = 
    			{
    				column0 : this.record.get("intpropertyno"),
    				column1 : this.record.get("intproperty")
    			};
    			this.intproperty.hiddenData = data1;
    			this.intproperty.setXyValue(data1);
    			
    			//现金流量
    			var data2 = 
    			{
    				column0 : this.record.get("intisflowno"),
    				column1 : this.record.get("intisflow")
    			};
    			this.intisflow.hiddenData = data2;
    			this.intisflow.setXyValue(data2);
    			
    			//科目类别
    			if(this.record.get("uqtypeid") != null && this.record.get("uqtypeid") != '')
    			{
    				var data3 = 
        			{
        				column0 : this.record.get("uqtypeidno"),
        				column1 : this.record.get("uqtypeid")
        			};
        			this.uqtypeid.hiddenData = data3;
        			this.uqtypeid.setXyValue(data3);
    			}
    			
    			//外币
    			if(this.record.get("uqforeigncurrid") != null && this.record.get("uqforeigncurrid") != '')
	    		{
    				var data4 = 
	    			{
	    				column0 : this.record.get("uqforeigncurridno"),
	    				column1 : this.record.get("uqforeigncurrid")
	    			};
	    			this.uqforeigncurrid.hiddenData = data4;
	    			this.uqforeigncurrid.setXyValue(data4);
	    		}
    			
    			//计量单位
    			if(this.record.get("varmeasure") != null && this.record.get("varmeasure") != '')
    			{
    				var data5 = 
        			{
        				column0 : this.record.get("varmeasureno"),
        				column1 : this.record.get("varmeasure")
        			};
        			this.varmeasure.hiddenData = data5;
        			this.varmeasure.setXyValue(data5);
    			}
    			
    			//分户信息
    			if(this.record.get("uqledgetypeids") != null && this.record.get("uqledgetypeids") != '')
    			{
    				var data6 = 
        			{
        				id : this.record.get("uqledgetypeids"),
        				text : this.record.get("varledgetypenames")
        			};
    				this.intisledge.hiddenData = data6;
    				this.intisledge.setXyValue(data6);
    			}
    		}
    		//通过树节点传入
    		if(this.node != null)
    		{
    			//科目编号、名称、父级id、父级名称
    			this.varaccountcode.setValue(this.node.attributes.accountcode);
    			this.varaccountname.setValue(this.node.attributes.accountname);
    			this.uqparentid.setValue(this.node.attributes.uqparentid);
    			this.parentname.setValue(this.node.attributes.parentname);
    			this.uqaccountid.setValue(this.node.id);
    			
    			//科目性质
    			var data1 = 
    			{
    				column0 : this.node.attributes.intpropertyno,
    				column1 : this.node.attributes.intproperty
    			};
    			this.intproperty.hiddenData = data1;
    			this.intproperty.setXyValue(data1);
    			
    			//现金流量
    			var data2 = 
    			{
    				column0 : this.node.attributes.intisflowno,
    				column1 : this.node.attributes.intisflow
    			};
    			this.intisflow.hiddenData = data2;
    			this.intisflow.setXyValue(data2);
    			
    			//科目类别
    			if(this.node.attributes.uqtypeid != null && this.node.attributes.uqtypeid != '')
    			{
    				var data3 = 
        			{
        				column0 : this.node.attributes.uqtypeidno,
        				column1 : this.node.attributes.uqtypeid
        			};
        			this.uqtypeid.hiddenData = data3;
        			this.uqtypeid.setXyValue(data3);
    			}
    			
    			//外币
    			if(this.node.attributes.uqforeigncurrid != null && this.node.attributes.uqforeigncurrid != '')
	    		{
    				var data4 = 
	    			{
	    				column0 : this.node.attributes.uqforeigncurridno,
	    				column1 : this.node.attributes.uqforeigncurrid
	    			};
	    			this.uqforeigncurrid.hiddenData = data4;
	    			this.uqforeigncurrid.setXyValue(data4);
	    		}
    			
    			//计量单位
    			if(this.node.attributes.varmeasure != null && this.node.attributes.varmeasure != '')
    			{
    				var data5 = 
        			{
        				column0 : this.node.attributes.varmeasureno,
        				column1 : this.node.attributes.varmeasure
        			};
        			this.varmeasure.hiddenData = data5;
        			this.varmeasure.setXyValue(data5);
    			}
    			
    			//科目分户信息
    			if(this.node.attributes.uqledgetypeids != null && this.node.attributes.uqledgetypeids != '')
    			{
    				var data6 = 
        			{
        				id : this.node.attributes.uqledgetypeids,
        				text : this.node.attributes.varledgetypenames
        			};
        			this.intisledge.hiddenData = data6;
        			this.intisledge.setXyValue(data6);
    			}
    		}
    	}
    },
    //是否需要现金流量修改判断
    intisflowValuechange : function()
    {
    	//新增科目不需要判断，修改科目需要判断是否已经进行现金流量编制，已经进行现金流量编制的科目，不允许改现金流量标志
    	if(this.flag == "edit")
    	{
    		var uqaccountid = this.uqaccountid.getValue();
    		Ext.Ajax.request(
    		{
    			url : "datamanager/accountmanager/checkflow",
    			method : "post",
    			params :
    			{
    				uqAccountId : uqaccountid
    			},
        		success : function(response)
        		{
        			var r = Ext.decode(response.responseText);
        			if(r.success)
        			{
        				return;
        			}
        			else 
    				{
        				if(this.record != null && this.record != '')
        				{
        					var data = 
        	    			{
        	    				column0 : this.record.get("intisflowno"),
        	    				column1 : this.record.get("intisflow")
        	    			};
        	    			this.intisflow.hiddenData = data;
        	    			this.intisflow.setXyValue(data);
        				}
        				if(this.node != null)
    					{
        					var data = 
        	    			{
        	    				column0 : this.node.attributes.intisflowno,
        	    				column1 : this.node.attributes.intisflow
        	    			};
        	    			this.intisflow.hiddenData = data;
        	    			this.intisflow.setXyValue(data);
    					}
        				Ext.Msg.alert("提示", r.msg);
        				return;
    				}
        		},
        		failure : function(response)
    			{
    				Ext.Msg.alert("错误","现金流量编制检查失败！");
    				return;
    			},
    			scope : this
    		});
    	}
    },
    //提交信息判断
    saveAccountHandler : function()
    {
    	if (this.flag == "add")
		{
			this.addAccount();
		}
		else if (this.flag == "edit")	//修改
		{
			this.editAccount();
		}
    },
    //添加科目
    addAccount : function()
    {
    	//验证非空
    	if(!this.validate())
		{
    		return;
		}
    	else
		{
    		var uqaccountid = this.uqaccountid.getValue();
    		var varaccountcode = this.varaccountcode.getValue();
    		var varaccountname = this.varaccountname.getValue();
    		var uqparentid = this.uqparentid.getValue();
    		var intproperty = this.intproperty.getXyValue();
    		var uqtypeid = this.uqtypeid.getXyValue();
    		var intisflow = this.intisflow.getXyValue();
    		var uqforeigncurrid = this.uqforeigncurrid.getXyValue();
    		var varmeasure = this.varmeasure.getXyValue();
    		var uqledgetypeids = this.intisledge.getXyValue();
    		var intisledge = 0;
    		if(uqledgetypeids != '' && uqledgetypeids != null)
    		{
    			intisledge = 1;
    		}
    		if(uqtypeid == '' || uqtypeid == null)
    		{
    			uqtypeid = 0;
    		}
    		
    		var param = 
			{
				uqAccountId : uqaccountid,
				varAccountCode : varaccountcode,
				varAccountName : varaccountname,
				intProperty : intproperty,
				uqTypeId : uqtypeid,
				intIsFlow : intisflow,
				uqForeignCurrId : uqforeigncurrid,
				varMeasure : varmeasure,
				uqParentId : uqparentid,
				uqLedgeTypeIds : uqledgetypeids,
				intIsLedge : intisledge
			}
    		
    		Ext.Ajax.request(
        	{
    			url : "datamanager/accountmanager/add",
    			method : "post",
    			params :
    			{
    				jsonString : Ext.encode(param)
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
    						if(this.record.get("intislastlevel") == '1')
    						{
    							var treenode = Ext.getCmp("accounttree").getNodeById(this.record.get("uqparentid"));
        						if(typeof treenode != "undefined")
        						{
        							Ext.getCmp("accounttree").getLoader().baseParams.parentId = this.record.get("uqparentid");
                    				Ext.getCmp("accounttree").getLoader().load(treenode);
        						}
    						}
    						else
    						{
                				Ext.getCmp("accounttree").getLoader().load(Ext.getCmp("accounttree").getNodeById(this.record.get("uqaccountid")));
    						}
    					}
    					if(this.node != null)
    		    		{
    						if(this.node.leaf)
    						{
    							Ext.getCmp("accounttree").getLoader().baseParams.parentId = this.node.attributes.uqparentid;
                				Ext.getCmp("accounttree").getLoader().load(Ext.getCmp("accounttree").getNodeById(this.node.attributes.uqparentid));
    						}
    						else
    						{
                				Ext.getCmp("accounttree").getLoader().load(Ext.getCmp("accounttree").getNodeById(this.node.id));
    						}
    		    		}
    					Ext.getCmp("accountlist").store.reload();
    					Ext.Msg.alert("成功","科目新增成功！");
    				} 
    				else 
    				{
        				Ext.Msg.alert("提示", r.msg);
        				return;
    				}
    			},
    			failure : function(response)
    			{
    				Ext.Msg.alert("错误","科目新增失败！");
    				return;
    			},
    			scope : this
    		});
		}
    },
    //修改科目
    editAccount : function()
    {
    	//验证非空
    	if(!this.validate())
		{
    		return;
		}
    	else
		{
    		var uqaccountid = this.uqaccountid.getValue();
    		var varaccountcode = this.varaccountcode.getValue();
    		var varaccountname = this.varaccountname.getValue();
    		var intproperty = this.intproperty.getXyValue();
    		var uqtypeid = this.uqtypeid.getXyValue();
    		var intisflow = this.intisflow.getXyValue();
    		var uqforeigncurrid = this.uqforeigncurrid.getXyValue();
    		var varmeasure = this.varmeasure.getXyValue();
    		var uqparentid = this.uqparentid.getValue();
    		var uqledgetypeids = this.intisledge.getXyValue();
    		var intisledge = 0;
    		if(uqledgetypeids != "" && uqledgetypeids != null)
    		{
    			intisledge = 1;
    		}
    		if(uqtypeid == '' || uqtypeid == null)
    		{
    			uqtypeid = 0;
    		}
    		
    		var param = 
			{
				uqAccountId : uqaccountid,
				varAccountCode : varaccountcode,
				varAccountName : varaccountname,
				intProperty : intproperty,
				uqTypeId : uqtypeid,
				intIsFlow : intisflow,
				uqForeignCurrId : uqforeigncurrid,
				varMeasure : varmeasure,
				uqParentId : uqparentid,
				uqLedgeTypeIds : uqledgetypeids,
				intIsLedge : intisledge
			}
    		Ext.Ajax.request(
        	{
    			url : "datamanager/accountmanager/edit",
    			method : "post",
    			params :
    			{
    				jsonString : Ext.encode(param)
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
    						var treenode = Ext.getCmp("accounttree").getNodeById(this.record.get("uqparentid"));
    						if(typeof treenode != "undefined")
    						{
    							Ext.getCmp("accounttree").getLoader().baseParams.parentId = this.record.get("uqparentid");
                				Ext.getCmp("accounttree").getLoader().load(treenode);
    						}
    					}
    					if(this.node != null)
    		    		{
    						Ext.getCmp("accounttree").getLoader().baseParams.parentId = this.node.attributes.uqparentid;
            				Ext.getCmp("accounttree").getLoader().load(Ext.getCmp("accounttree").getNodeById(this.node.attributes.uqparentid));
    		    		}
    					Ext.getCmp("accountlist").store.reload();
    					Ext.Msg.alert("成功","科目修改成功！");
    				} 
    				else 
    				{
        				Ext.Msg.alert("提示", r.msg);
        				return;
    				}
    			},
    			failure : function(response)
    			{
    				Ext.Msg.alert("错误","修改科目失败！");
    				return;
    			},
    			scope : this
    		});
		}
    },
  //设置各组件非空验证
	validate : function()
	{
		if (this.varaccountcode.getValue() == "" || this.varaccountcode.getValue() == null) 
		{
			Ext.Msg.alert("提示", "请先输入科目编号！");
			return false;
		}
		if (this.varaccountname.getValue() == "" || this.varaccountname.getValue() == null) 
		{
			Ext.Msg.alert("提示", "请先填写科目名称！");
			return false;
		}
		if (this.intproperty.getXyValue() == "" || this.intproperty.getXyValue() == null) 
		{
			Ext.Msg.alert("提示", "请先选择科目性质！");
			return false;
		}
		if (this.intisflow.getXyValue() === "" || this.intisflow.getXyValue() == null) 
		{
			Ext.Msg.alert("提示", "请先选择是否需要现金流量！");
			return false;
		}
		return true;
	}
});
