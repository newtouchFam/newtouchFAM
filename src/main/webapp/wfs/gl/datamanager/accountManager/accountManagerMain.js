Ext.namespace("gl.datamamager.accountmamager");
/**
 * 主js
 */
gl.datamamager.accountmamager.MainPanel = Ext.extend(Ext.Panel, 
{
	//定义变量、属性
	id : 'accountmain',
	frame : false,
	border : false,
	layout : 'border',
	//构造面板内容
	initComponent : function()
	{
		//1.定义上方按钮；
		var addButton =
		{
			text : '新增',
			iconCls : "xy-add",
			handler : this.addHandler,
			scope : this
		};
		var editButton =
		{
			text : '修改',
			iconCls : "xy-edit",
			handler : this.editHandler,
			scope : this
		};
		var deleteButton =
		{
			text : '删除',
			iconCls : "xy-delete",
			handler : this.deleteHandler,
			scope : this
		};
		var startButton =
		{
			text : '启用',
			iconCls : "xy-act-post",
			handler : this.startHandler,
			scope : this
		};
		var closeButton =
		{
			text : '停用',
			iconCls : "xy-stop",
			handler : this.closeHandler,
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
		//2.创建tbar；
		var barTop = ['-', addButton, '-', editButton, '-', deleteButton , '-', startButton,
		             '-', closeButton, '-', importButton, '-', exportButton, '-', downloadButton];
		this.tbar = barTop;
		//3.创建左侧树面板；
		this.accounttree = new gl.datamamager.accountmamager.AccountTree({});
		this.accounttree.on("click", onClickExpand, this);
		//4.创建信息列表面板；
		this.accountlist = new gl.datamamager.accountmamager.AccountList({});
		//加一个双击监听
		this.accountlist.addListener('rowdblclick',this.editHandler,this);

		this.items = [this.accounttree,this.accountlist];
		//5.渲染
		gl.datamamager.accountmamager.MainPanel.superclass.initComponent.call(this);
		
		this.accountlist.store.load(
		{
		    params : 
		    {
		    	fullCode : "root",
		    	start:0,
				limit:20
		    }
		});
	},
	
	//新增科目
	addHandler : function()
	{
		var node = this.accounttree.getSelectionModel().getSelectedNode();
		var records = this.accountlist.getSelectionModel().getSelections();
		//以下都判断record是否为空 且record是否大于1
		if (records!=null && records !='' && records.length !=0 )
		{
			//且record是否大于1 修改只能选一条
			if(records.length>1)
			{
				Ext.Msg.alert("提示", "不可多选，请选择一个科目！");
				return;
			}
			var record = records[0];
			var accounteditwin = new gl.datamamager.accountmamager.AccounteditWin(
			{
				title : '新增科目',
				flag : 'add',
				record : record
			});
			accounteditwin.show();
		}
		else if (node != null)
		{
			var accounteditwin = new gl.datamamager.accountmamager.AccounteditWin(
			{
				title : '新增科目',
				flag : 'add',
				node : node
			});
			accounteditwin.show();
		}
		else
		{
			Ext.Msg.alert("提示", "请选择一个父级科目！");
			return;
		}
	},
	//修改科目
	editHandler : function()
	{
		var node = this.accounttree.getSelectionModel().getSelectedNode();
		var records = this.accountlist.getSelectionModel().getSelections();
		//以下都判断record是否为空 且record是否大于1
		if (records!=null && records!='' && records.length!=0)
		{
			//且record是否大于1 修改只能选一条
			if(records.length>1)
			{
				Ext.Msg.alert("提示", "不可多选，请选择一个科目！");
				return;
			}
			var record = records[0];
			var accounteditwin = new gl.datamamager.accountmamager.AccounteditWin(
			{
				title : '修改科目',
				flag : 'edit',
				record : record
			});
			accounteditwin.show();
		}
		else if(node != null)
		{
			if(node.id != "00000000-0000-0000-0000-000000000000")
			{
				var accounteditwin = new gl.datamamager.accountmamager.AccounteditWin(
				{
					title : '修改科目',
					flag : 'edit',
					node : node
				});
				accounteditwin.show();
			}
			else
			{
				Ext.Msg.alert("提示", "根结点不可修改，请重新选择！");
				return;
			}
		}
		else
		{
			Ext.Msg.alert("提示", "请选择一个科目！");
			return;
		}
	},
	//删除科目
	deleteHandler : function()
	{
		var records = this.accountlist.getSelectionModel().getSelections();
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要删除的科目！");
			return;
		}
		//遍历行数据 
		var idarray = [];
		for(var i = 0; i < records.length; i ++)
    	{
			idarray[i] = records[i].get("uqaccountid");
    	}
    	
		Ext.Msg.confirm("提示", "请确认是否要删除所选科目?", function(btn)
		{
			if (btn == "yes") 
			{
				Ext.Ajax.request(
				{
					url : "datamanager/accountmanager/del",
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
							this.accounttree.root.reload();
							//重新加载列表
							this.accountlist.store.reload();
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
	//启用科目
	startHandler : function()
	{
		var node = this.accounttree.getSelectionModel().getSelectedNode();
		var records = this.accountlist.getSelectionModel().getSelections();	
		var startorclose = "start";
		var idarray = [];
		if (records!=null&&records!=''&&records.length!=0)
		{
			var str ="";
	    	for(var i = 0; i < records.length; i ++)
	    	{
	    		var record = records[i];
	    		if(record.get("intflag")==1||record.get("intflag")==0)//只有关闭或新建状态才能启用
	    		{
	    			idarray[i] = record.get("uqaccountid");
	    			str = str+" "+record.get("varaccountname");
	    		}
	    		else
	    		{
	    			Ext.Msg.alert("提示", "科目:"+record.get("varaccountname")+"不是新建或关闭状态，不能启用!");
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
			Ext.Msg.alert("提示", "请选择要启用的科目！");
			return;
		}
		
    	Ext.Msg.confirm("提示", "请确认是否启用所选科目及其上级和所有子级科目？", function(btn)
		{
			if (btn == "yes") 
			{				
				Ext.Ajax.request(
				{
					url : "datamanager/accountmanager/updateflag",
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
							Ext.Msg.alert("提示", "科目已启用！");
							this.accountlist.store.reload();
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
	//停用科目
	closeHandler : function()
	{
		var node = this.accounttree.getSelectionModel().getSelectedNode();
		var records = this.accountlist.getSelectionModel().getSelections();
		var startorclose = "close";
		var idarray = [];
		if (records!=null&&records!=''&&records.length!=0)
		{
			var str = "";
			for(var i = 0; i < records.length; i ++)
			{
				var record = records[i];
				if(record.get("intflag")==2)//只有启用状态才能关闭
				{
					idarray[i] = record.get("uqaccountid");
					str = str+" "+record.get("varaccountname");
				}
				else
				{
					Ext.Msg.alert("提示", "科目:"+record.get("varaccountname")+"不是启用状态，不能关闭");
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
			Ext.Msg.alert("提示", "请选择要停用的科目！");
			return;
		}
		
		Ext.Msg.confirm("提示", "请确认是否关闭所选科目及其所有子级科目？", function(btn)
		{
			if (btn == "yes") 
			{				
				Ext.Ajax.request(
				{
					url : "datamanager/accountmanager/updateflag",
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
							Ext.Msg.alert("提示", "科目已关闭！");
							this.accountlist.store.reload();
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
	
	
	//导入科目信息
	importHandler : function()
	{
		this.m_FileUploadDialog = new ssc.component.BaseUploadDialog(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : function()
			{
				Ext.getCmp("accounttree").getLoader().load(Ext.getCmp("accounttree").root);
			},
			xy_UploadAction : "datamanager/accountmanager/upload",
			xy_BaseParams : {},
			xy_DownloadAction : "wfs/gl/datamanager/accountManager/accountImportModel.xls",
			xy_FileAccept : "application/msexcel",
			xy_FileExt : "xls"
		});
		this.m_FileUploadDialog.show();
	},
	
	//导出
	exportHandler : function()
	{
		//获取路径
		var path = this.getContextPath();
		//定义导出链接
		window.location.href = path + "/datamanager/accountmanager/export";
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
		url = "datamanager/accountmanager/downloadImportModel";	
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
		items : [ new gl.datamamager.accountmamager.MainPanel ]
	});
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);
