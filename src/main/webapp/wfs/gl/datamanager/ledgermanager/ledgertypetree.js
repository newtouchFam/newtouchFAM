Ext.namespace("gl.datamamager.ledgermanager");
/**
 * 左侧分户类别树
 */
gl.datamamager.ledgermanager.ledgertypetree = Ext.extend(Ext.tree.TreePanel, 
{
	//定义变量、属性
	id : 'ledgertypetree',//ID  Ext.getCmp("id")获得该panel
	region : 'west',// border布局  西边
	width : '350',//设置宽度
	root : new Ext.tree.AsyncTreeNode({id:"00000000-0000-0000-0000-000000000000", text:"分户类别"}),//根部 id是根ID,后台存放node对象的属性
	loader : new Ext.tree.TreeLoader({dataUrl:"datamanager/ledgermanager/ledgertypetree"}),//载入tree的action
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
		//2.创建tbar；
		var barTop = ['-', addButton, '-', editButton, '-', deleteButton , '-'];
		this.tbar = barTop;
		//3.渲染；
		gl.datamamager.ledgermanager.ledgertypetree.superclass.initComponent.call(this);
		//4.指定节点点击事件
		this.on('click',this.tree_click,this);
	},
	//新增分户类别
	addHandler : function()
	{
		//1.判断业务组件填写是否正确(拿到叶子节点)
		//2.结串，传递到action层，按照jsonCondition传递。
		//3.成功，要刷新树
		var node = this.getSelectionModel().getSelectedNode();
		if (node != null)
		{
			var typewin = new gl.datamamager.ledgermanager.ledgertypewin(
			{
				title : '新增分户类别',
				flag : 'add',
				node : node
			});
			typewin.show();
		}
		else
		{
			Ext.Msg.alert("提示", "请选择一个父级类别！");
			return;
		}
		
	},
	//修改分户类别
	editHandler : function()
	{
		//1.按照XXX判断是修改的窗体还是新增的窗体
		//2.判断是否选择了某个节点，没有要提示选择。
		//3.如果是修改的，要填充窗体的数据，从node获取
		//4.判断业务组件填写是否正确
		//5.结串，传递到action层，按照jsonCondition传递。
		//6.成功，要刷新树
		var node = this.getSelectionModel().getSelectedNode();
		if(node != null)
		{
			if(node.id != "00000000-0000-0000-0000-000000000000")
			{
				var typewin = new gl.datamamager.ledgermanager.ledgertypewin(
				{
					title : '修改分户类别',
					flag : 'edit',
					node : node
				});
				typewin.show();
			}
			else
			{
				Ext.Msg.alert("提示", "根结点不可修改，请重新选择！");
				return;
			}
		}
		else
		{
			Ext.Msg.alert("提示", "请选择一个分户类别！");
			return;
		}
	},
	//删除分户类别
	deleteHandler : function()
	{
		//1.判断是否选择了某个节点，没有要提示选择。
		//2.选择的节点id传递到action层
		//3.成功，要刷新树
		var node = this.getSelectionModel().getSelectedNode();
		if(node != null)
		{
			if(node.id != "00000000-0000-0000-0000-000000000000")
			{
				Ext.Msg.confirm("提示", "请确认是否要删除所选分户类别?", function(btn)
				{
					if (btn == "yes") 
					{
						Ext.Ajax.request(
						{
							url : "datamanager/ledgermanager/deleteledgertype",
							params :
							{
								uqledgetypeid : node.id
			              	},
							success : function(response)
							{
								var r = Ext.decode(response.responseText);
								if (r.success) 
								{
									Ext.Msg.alert("提示", "删除成功！");
									//重新加载树
									this.root.reload();
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
			Ext.Msg.alert("提示", "请选择一个分户类别！");
			return;
		}
	},
	//节点点击事件
	tree_click : function(node)
	{
		//按照分户类别加载分户项目
		//1.获取分户类别id(node.id)
		//2.获取分户的树treepanel
		//3.处理参数，把类别ID作为入参传递给项目树的treepanel.gettreeloader
		//4.treepanel.getRoot().expand();
		if(node.id!="00000000-0000-0000-0000-000000000000")
		{
			Ext.getCmp("ledgeritemtree").getLoader().baseParams.uqledgetypeid = node.id;
			Ext.getCmp("ledgeritemtree").getLoader().baseParams.companyid = Ext.getCmp("company").getXyValue();
			if(Ext.getCmp("ledgeritemtree").root.isExpanded())
			{
				Ext.getCmp("ledgeritemtree").root.reload();
			}
			else
			{
				Ext.getCmp("ledgeritemtree").root.expand();
				//用下面加载的方式去覆盖上面的
				Ext.getCmp("ledgeritemtree").root.reload();
			}
//			Ext.getCmp("ledgeritemtree").getLoader().load(Ext.getCmp("ledgeritemtree").root);
		}
		else
		{
			Ext.getCmp("ledgeritemtree").getLoader().baseParams.uqledgetypeid = "00000000-0000-0000-0000-000000000000";
			Ext.getCmp("ledgeritemtree").getLoader().baseParams.companyid = Ext.getCmp("company").getXyValue();
			if(Ext.getCmp("ledgeritemtree").root.isExpanded())
			{
				Ext.getCmp("ledgeritemtree").root.reload();
			}
			else
			{
				Ext.getCmp("ledgeritemtree").root.expand();
				//用下面加载的方式去覆盖上面的
				Ext.getCmp("ledgeritemtree").root.reload();
			}
		}
	}
});