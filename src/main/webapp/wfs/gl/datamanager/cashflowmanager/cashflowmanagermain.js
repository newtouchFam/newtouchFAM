Ext.namespace("gl.datamamager.cashflowmanager");
/**
 * 主的js
 */
gl.datamamager.cashflowmanager.MainPanel = Ext.extend(Ext.Panel, 
{
	//定义变量属性
	id : 'cashflowmain',
	frame : false,
	border : false,
	layout : 'border',
	//构造面板内容
	initComponent : function()
	{
		//定义按钮
		var addTypeButton = 
		{
			text : '新增类别',
			iconCls : "xy-add",
			handler : this.addHandler,
			scope : this
		};
		var editTypeButton =
		{
			text : '修改类别',
			iconCls : "xy-edit",
			handler : this.editHandler,
			scope : this
		};
		var deleteTypeButton =
		{
			text : '删除类别',
			iconCls : "xy-delete",
			handler : this.deleteHandler,
			scope : this
		};
		var addItemButton = 
		{
			text : '新增项目',
			iconCls : "xy-add",
			handler : this.addItemHandler,
			scope : this		
		};
		var editItemButton =
		{
			text : '修改项目',
			iconCls : "xy-edit",
			handler : this.editItemHandler,
			scope : this
		};
		var deleteItemButton =
		{
			text : '删除项目',
			iconCls : "xy-delete",
			handler : this.deleteItemHandler,
			scope : this
		};
		var startButton =
		{
			text : '启用',
			iconCls : "xy-act-post",
			handler : this.startItemHandler,
			scope : this
		};
		var closeButton =
		{
			text : '停用',
			iconCls : "xy-stop",
			handler : this.closeItemHandler,
			scope : this
		};
		var importButton =
		{
			text : '导入',
			iconCls : "xy-import",
			handler : this.importHandler,
			scope : this
		};
		
		var exportButton =
		{
			text : '导出',
			iconCls : "xy-export",
			handler : this.exportHandler,
			scope : this
		};
		
		var downloadButton =
		{
			text : '导入模板下载',
			iconCls : "xy-import",
			handler : this.downloadHandler,
			scope : this
		};
		//创建Tbar
		var barTop = ['-',addTypeButton,'-',editTypeButton,'-',deleteTypeButton,
		              '-',addItemButton,'-',editItemButton,'-',deleteItemButton,
		              '-',startButton,'-',closeButton,'-',importButton,'-',exportButton,'-',downloadButton];
		this.tbar = barTop;
		
		//创建左侧树面板
		this.cashflowtree = new gl.datamamager.cashflowmanager.cashflowtree({});
		this.cashflowtree.on("click", onClickExpand, this);
		
		//创建列表信息
		this.cashflowlist = new gl.datamamager.cashflowmanager.cashflowlist({});
		
		//加一个双击监听
		this.cashflowlist.addListener('rowdblclick',this.editItemHandler,this);
		
		this.items = [this.cashflowtree,this.cashflowlist];
		//5.渲染
		gl.datamamager.cashflowmanager.MainPanel.superclass.initComponent.call(this);
	},
	
	//新增类别
	addHandler : function()
	{
		var node = this.cashflowtree.getSelectionModel().getSelectedNode();
	
		if (node != null)
		{
			var cashflowtypewin = new gl.datamamager.cashflowmanager.cashflowtypewin(
			{
				title : '新增类别',
				flag : 'add',
				node : node
			});
			cashflowtypewin.show();
		}
		else
		{
			Ext.Msg.alert("提示", "请选择一个类别！");
			return;
		}
	},
	
	//修改类别
	editHandler : function()
	{
		var node = this.cashflowtree.getSelectionModel().getSelectedNode();
		
		if(node != null)
		{
			if(node.id != "00000000-0000-0000-0000-000000000000")
			{
				var cashflowtypewin = new gl.datamamager.cashflowmanager.cashflowtypewin(
				{
					title : '修改类别',
					flag : 'edit',
					node : node
				});
				cashflowtypewin.show();
			}
			else 
			{
				Ext.Msg.alert("提示", "根结点不可修改，请重新选择！");
				return;
			}
	    }
		else
		{
			Ext.Msg.alert("提示", "请选择修改的类别！");
			return;
		}
	},
	
	//删除类别
	deleteHandler : function()
	{
		var node = this.cashflowtree.getSelectionModel().getSelectedNode();
		if(node != null)
		{
			if(node.id != "00000000-0000-0000-0000-000000000000")
			{
				Ext.Msg.confirm("提示", "请确认是否要删除所选类别?", function(btn)
				{
					if (btn == "yes") 
					{
						Ext.Ajax.request(
						{
							url : "datamanager/cashflowmanager/removeType",
							params :
							{
								uqflowtypeid : node.id
							},
							success : function(response)
							{
								var r = Ext.decode(response.responseText);
								if (r.success) 
								{
									Ext.Msg.alert("提示", "删除成功！");
									//如果删除的是一级节点就重新加载树
									if(node.attributes.intlevel=="1")
			    					{
										this.cashflowtree.root.reload();
			    					}
									else 
									{
										//如果删除的不是一级节点就只重新加载他的上级为根节点的子树
										Ext.getCmp("cashflowtree").getLoader().baseParams.parentId = node.attributes.uqparentid;
			            				Ext.getCmp("cashflowtree").getLoader().load(Ext.getCmp("cashflowtree").getNodeById(node.attributes.uqparentid));
									}
								}
								else
								{
									Ext.Msg.alert("错误", r.msg);
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
			}
			else
			{
				Ext.Msg.alert("提示", "顶级类别不可删除，请重新选择！");
				return;
			}
		}
		else
		{
			Ext.Msg.alert("提示", "请选择删除的类别！");
			return;
		}
	},
	
	//新增项目
	addItemHandler : function()
	{
		var node = this.cashflowtree.getSelectionModel().getSelectedNode();
		var records = this.cashflowlist.getSelectionModel().getSelections();
		
		if (node != null)
		{
			if(node==null||node==undefined||node==""
				||node.id == '00000000-0000-0000-0000-000000000000')
			{
				Ext.Msg.alert("提示", "请先选择一个类别");
				return;
			}
			var cashflowitemwin = new gl.datamamager.cashflowmanager.cashflowitemwin(
			{
				title : '新增项目',
				flag : 'add',
				node : node
			});
			cashflowitemwin.show();
		}
		//以下都判断record是否为空 且record是否大于1
		else if (records!=null && records !='' && records.length !=0 )
		{
			//且record是否大于1 修改只能选一条
			if(records.length>1)
			{
				Ext.Msg.alert("提示", "不可多选，请选择一个项目!");
				return;
			}
			var record = records[0];
			var cashflowitemwin = new gl.datamamager.cashflowmanager.cashflowitemwin(
			{
				title : '新增项目',
				flag : 'add',
				record : record
			});
			cashflowitemwin.show();
		}
		else
		{
			Ext.Msg.alert("提示", "请选择一个项目或者类别！");
			return;
		}
	},
	
	//修改项目
	editItemHandler : function()
	{
		var records = this.cashflowlist.getSelectionModel().getSelections();
		if (records!=null && records!='' && records.length!=0)
		{
			//且record是否大于1 修改只能选一条
			if(records.length>1)
			{
				Ext.Msg.alert("提示", "不可多选，请选择一个项目!");
				return;
			}
			var record = records[0];
			var cashflowitemwin = new gl.datamamager.cashflowmanager.cashflowitemwin(
			{
				title : '修改项目',
				flag : 'edit',
				record : record
			});
			cashflowitemwin.show();
		}
		else
		{
			Ext.Msg.alert("提示", "请选择修改的项目！");
			return;
		}
	},

	//删除项目
	deleteItemHandler : function()
	{
		//cashflowlist.getSelectionModel().getSelections()是拿到被选中的一条记录
		var records = this.cashflowlist.getSelectionModel().getSelections();
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要删除的项目！");
			return;
		}
		for(var i = 0; i < records.length; i ++)
		{
			if(records[i].get("intstatus")==2)
			{
				Ext.Msg.alert("提示", "项目:"+records[i].get("varitemname")+"是启用状态，不能删除");
    			return;
			}
		}
		//遍历行数据 
		var idarray = [];
		for(var i = 0; i < records.length; i ++)
    	{
			idarray[i] = records[i].get("uqflowitemid");
    	}
		Ext.Msg.confirm("提示", "请确认是否要删除所选项目?", function(btn)
		{
			if (btn == "yes") 
			{
				Ext.Ajax.request(
				{
					url : "datamanager/cashflowmanager/removeItems",
					params :
					{
						idArrays : idarray
					},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success) 
						{
							Ext.Msg.alert("提示", "已删除！");
							//重新加载树
							this.cashflowtree.root.reload();
							//重新加载列表
							this.cashflowlist.store.reload();
						}
						else
						{
							Ext.Msg.alert("错误", r.msg);
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
	
	//启用项目
	startItemHandler : function()
	{
		//cashflowtree.getSelectionModel().getSelectedNode()拿到被选中的节点
		var node = this.cashflowtree.getSelectionModel().getSelectedNode();
		var records = this.cashflowlist.getSelectionModel().getSelections();	
		var startorclose = "start";
		var idarray = [];
		if (records!=null&&records!=''&&records.length!=0)
		{
			var str ="";
	    	for(var i = 0; i < records.length; i ++)
	    	{
	    		var record = records[i];
	    		if(record.get("intstatus")==1||record.get("intstatus")==0)//只有关闭或新建状态才能启用
	    		{
	    			idarray[i] = record.get("uqflowitemid");
	    			str = str+" "+record.get("varitemcode");
	    		}
	    		else
	    		{
	    			Ext.Msg.alert("提示", "项目:"+record.get("varitemname")+"不是新建或关闭状态，不能启用!");
	    			return;
	    		}
	    	}
		}
		else if(node != null)
		{
			idarray[0] = node.id;
		}
		else
		{
			Ext.Msg.alert("提示", "请选择要启用的项目!");
			return;
		}
		Ext.Msg.confirm("提示", "请确认是否启用所选项目?", function(btn)
		{
			if (btn == "yes") 
			{
				Ext.Ajax.request(
				{
					url : "datamanager/cashflowmanager/startItems",
					params :
					{
						idArrays : idarray,
						startorclose : startorclose
					},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success) 
						{
							Ext.Msg.alert("提示", "项目已启用！");
							this.cashflowlist.store.reload();
						}
						else
						{
							Ext.Msg.alert("错误", r.msg);
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
	
	//停用项目
	closeItemHandler : function()
	{
		var node = this.cashflowtree.getSelectionModel().getSelectedNode();
		var records = this.cashflowlist.getSelectionModel().getSelections();
		var startorclose = "close";
		var idarray = [];
		if (records!=null&&records!=''&&records.length!=0)
		{
			var str = "";
			for(var i = 0; i < records.length; i ++)
			{
				var record = records[i];
				if(record.get("intstatus")==2)//只有启用状态才能关闭
				{
					idarray[i] = record.get("uqflowitemid");
					str = str+" "+record.get("varitemcode");
				}
				else
				{
					Ext.Msg.alert("提示", "项目:"+record.get("varitemcode")+"不是启用状态，不能关闭");
					return;
				}
			}	
		}
		else if(node != null)
		{
			idarray[0] = node.id;
		}
		else
		{
			Ext.Msg.alert("提示", "请选择要停用的项目！");
			return;
		}
		Ext.Msg.confirm("提示", "请确认是否停用所选项目?", function(btn)
		{
			if (btn == "yes") 
			{
				Ext.Ajax.request(
				{
					url : "datamanager/cashflowmanager/startItems",
					params :
					{
						idArrays : idarray,
						startorclose : startorclose
					},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success) 
						{
							Ext.Msg.alert("提示", "项目已关闭！");
							this.cashflowlist.store.reload();
						}
						else
						{
							Ext.Msg.alert("错误", r.msg);
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
	},
	
	//导入信息
	importHandler : function()
	{
		this.m_FileUploadDialog = new ssc.component.BaseUploadDialog(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : function()
			{
				Ext.getCmp("cashflowtree").getLoader().load(Ext.getCmp("cashflowtree").root);
			},
			xy_UploadAction : "datamanager/cashflowmanager/importCashFlowFile",
			xy_BaseParams : {},
			xy_DownloadAction : "wfs/gl/datamanager/cashflowmanager/cashflowImportModel.xls",
			xy_FileAccept : "application/msexcel",
			xy_FileExt : "xls"
		});
		this.m_FileUploadDialog.show();
	},
	
	//导出
	exportHandler : function()
	{
		var url = "datamanager/cashflowmanager/exportCashFlowInfo";
		var param = {}
		var postparam =
		{
			jsonCondition : Ext.encode(param)
		};
		ssc.common.PostSubmit(url, postparam);
	},
	
	// 获取路径，这样ie和火狐都能运行，否则ie不能运行 
	getContextPath : function() 
	{
		var pathName = document.location.pathname;
	    var index = pathName.substr(1).indexOf("/");
	    var result = pathName.substr(0,index+1);
	    return result;
	},
	
	//模版下载
	downloadHandler : function ()
	{
		var url = '';
		url = "datamanager/cashflowmanager/downloadCashFlowImportModel";
		var qryCondition = {fileID:""};	
		
		var oForm = document.createElement("form");
		oForm.id = "freesky-postForm";
		oForm.name = "freesky-postForm";
		oForm.method = "post";
		oForm.action = url;
		oForm.target = "_blank";
		oForm.style.display = "none";
		
		for(var prop in qryCondition)
		{
			var oInput = document.createElement("input");
			oInput.name = prop;
			oInput.value = qryCondition[prop]; 
			oForm.appendChild(oInput);
	    }
		document.body.appendChild(oForm);
		oForm.submit();
	}
});

function init()
{
	new Ext.Viewport(
	{
		layout : 'fit',
		items : [ new gl.datamamager.cashflowmanager.MainPanel ]
	});
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);
