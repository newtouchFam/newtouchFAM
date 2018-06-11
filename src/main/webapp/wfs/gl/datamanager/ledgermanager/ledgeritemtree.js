Ext.namespace("gl.datamamager.ledgermanager");
/**
 * 右侧分户项目树
 */
gl.datamamager.ledgermanager.ledgeritemtree = Ext.extend(Ext.tree.TreePanel, 
{
	//定义变量、属性
	id : 'ledgeritemtree',//ID  Ext.getCmp("id")获得该panel
	region : 'center',// border布局  中间
	width : '200',//设置宽度
	root : new Ext.tree.AsyncTreeNode({id:"00000000-0000-0000-0000-000000000000", text:"项目"}),//根部 id是根ID,后台存放node对象的属性
	loader : new Ext.tree.TreeLoader({dataUrl:"datamanager/ledgermanager/ledgeritemtree"}),//载入tree的action
	autoScroll : true, //卷动
	collapsible : true,
	split : true,
	animate : true, //
	enableDD : false, 
	border : true, //边界
	rootVisible : true,//根是否可见
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
		var barTop = ['-', addButton, '-', editButton, '-', deleteButton , 
		              '-', importButton, '-', exportButton, '-', downloadButton];
		this.tbar = barTop;
		//3.渲染；
		gl.datamamager.ledgermanager.ledgeritemtree.superclass.initComponent.call(this);
	},
	//新增分户项目
	addHandler : function()
	{
		//1.获取分户类别
		//2.判断必填
		//3.结串，传递到action层，按照jsonCondition传递。
		//4.成功，要刷新树
		
		//必须先选择公司才能进行操作
		var varcompanyid = Ext.getCmp("company").getXyValue();
		if(varcompanyid==null||varcompanyid==undefined||varcompanyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		var typenode = Ext.getCmp("ledgertypetree").getSelectionModel().getSelectedNode();
		if(typenode==null||typenode==undefined||typenode==""
			||typenode.id == '00000000-0000-0000-0000-000000000000')
		{
			Ext.Msg.alert("提示", "请先选择一个分户类别");
			return;
		}
		var node = this.getSelectionModel().getSelectedNode();
		if (node != null)
		{
			var itemwin = new gl.datamamager.ledgermanager.ledgeritemwin(
			{
				title : '新增分户项目',
				flag : 'add',
				node : node
			});
			itemwin.show();
		}
		else
		{
			Ext.Msg.alert("提示", "请选择一个父级项目！");
			return;
		}
	},
	//修改分户项目
	editHandler : function()
	{
		//1.获取分户类别
		//2.按照XXX判断是修改的窗体还是新增的窗体
		//3.判断是否选择了某个节点，没有要提示选择。
		//4.如果是修改的，要填充窗体的数据，从node获取
		//5.判断业务组件填写是否正确
		//6.结串，传递到action层，按照jsonCondition传递。
		//7.成功，要刷新树
		
		//必须先选择公司才能进行操作
		var varcompanyid = Ext.getCmp("company").getXyValue();
		if(varcompanyid==null||varcompanyid==undefined||varcompanyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		var node = this.getSelectionModel().getSelectedNode();
		if(node != null)
		{
			if(node.id != "00000000-0000-0000-0000-000000000000")
			{
				var itemwin = new gl.datamamager.ledgermanager.ledgeritemwin(
				{
					title : '修改分户项目',
					flag : 'edit',
					node : node
				});
				itemwin.show();
			}
			else
			{
				Ext.Msg.alert("提示", "顶级分户项目不可修改，请重新选择！");
				return;
			}
		}
		else
		{
			Ext.Msg.alert("提示", "请选择一个分户项目！");
			return;
		}
	},
	//删除分户项目
	deleteHandler : function()
	{
		//1.判断是否选择了某个节点，没有要提示选择。
		//2.选择的节点id传递到action层
		//3.成功，要刷新树
		
		//必须先选择公司才能进行操作
		var varcompanyid = Ext.getCmp("company").getXyValue();
		if(varcompanyid==null||varcompanyid==undefined||varcompanyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		var node = this.getSelectionModel().getSelectedNode();
		if(node != null)
		{
			if(node.id != "00000000-0000-0000-0000-000000000000")
			{
				Ext.Msg.confirm("提示", "请确认是否要删除所选项目?", function(btn)
				{
					if (btn == "yes") 
					{
						Ext.Ajax.request(
						{
							url : "datamanager/ledgermanager/deleteledgeritem",
							params :
							{
								uqledgeid : node.id,
								companyid : varcompanyid
			              	},
							success : function(response)
							{
								var r = Ext.decode(response.responseText);
								if (r.success) 
								{
									Ext.Msg.alert("提示", "删除成功！");
									//重新加载树
									
									if(node.attributes.intlevel=="1")
			    					{
										this.root.reload();
			    					}
									else 
									{
										Ext.getCmp("ledgeritemtree").getLoader().load(Ext.getCmp("ledgeritemtree").getNodeById(node.attributes.parentid));
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
				Ext.Msg.alert("提示", "顶级分户项目不可删除，请重新选择！");
				return;
			}
		}
		else
		{
			Ext.Msg.alert("提示", "请选择一个分户项目！");
			return;
		}
	},
	
	//导入信息
	importHandler : function()
	{
		var companyid = Ext.getCmp("company").getXyValue();
		if(companyid==null||companyid==undefined||companyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		var param = {"companyid" : companyid};
		
		var postparam =
		{
			jsonCondition : Ext.encode(param)
		};
		
		this.m_FileUploadDialog = new ssc.component.BaseUploadDialog(
		{
			xy_ParentObjHandle : this,
			/*
			xy_OKClickEvent : function()
			{
				Ext.getCmp("cashflowtree").getLoader().load(Ext.getCmp("cashflowtree").root);
			},
			*/
			xy_UploadAction : "datamanager/ledgermanager/importledgeritem",
			xy_BaseParams : postparam,
			xy_DownloadAction : "wfs/gl/datamanager/ledgermanager/ledgerImportModel.xls",
			xy_FileAccept : "application/msexcel",
			xy_FileExt : "xls"
		});
		this.m_FileUploadDialog.show();
	},
	
	//导出
	exportHandler : function()
	{
		var companyid = Ext.getCmp("company").getXyValue();
		if(companyid==null||companyid==undefined||companyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		var url = "datamanager/ledgermanager/exportledgeritem";
		var param = {"companyid" : companyid};
		
		var postparam =
		{
			jsonCondition : Ext.encode(param)
		};
		
		ssc.common.PostSubmit(url, postparam);
	},
	 
	//获取路径，这样ie和火狐都能运行，否则ie不能运行 
	getContextPath : function() 
	{
	    var pathName = document.location.pathname;
	    var index = pathName.substr(1).indexOf("/");
	    var result = pathName.substr(0,index+1);
	    return result;
	},
	//导入模板下载
	downloadHandler : function()
	{
		//必须先选择公司才能进行操作
		var varcompanyid = Ext.getCmp("company").getXyValue();
		if(varcompanyid==null||varcompanyid==undefined||varcompanyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		var url = '';
		url = "datamanager/ledgermanager/downloadledgerimportmodel";	
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