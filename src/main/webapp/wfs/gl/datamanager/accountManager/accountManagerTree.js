Ext.namespace("gl.datamamager.accountmamager");
/**
 * 左侧科目组树
 */
gl.datamamager.accountmamager.AccountTree = Ext.extend(Ext.tree.TreePanel, 
{
	//定义变量、属性
	id : 'accounttree',//ID  Ext.getCmp("id")获得该panel
	region : 'west',// border布局  西部
	width : '200',//设置宽度
	root : new Ext.tree.AsyncTreeNode({id:"00000000-0000-0000-0000-000000000000", text:"科目", expanded:true}),//根部 id是根ID text一般name  后台存放node对象的属性
	loader : new Ext.tree.TreeLoader({dataUrl:"datamanager/accountmanager/tree"}),//载入tree 动作action
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
		//1.渲染；
		gl.datamamager.accountmamager.AccountTree.superclass.initComponent.call(this);
//		this.expandAll();
		//2.指定节点点击事件
		this.on('click',this.tree_click,this);
	},
	//节点点击事件
	tree_click : function(node)
	{
		if(node.id=="00000000-0000-0000-0000-000000000000")
		{
			//1.获取科目信息store并设置参数；
			Ext.getCmp("accountlist").store.baseParams.fullCode = "root";
		}
		else
		{
			Ext.getCmp("accountlist").store.baseParams.fullCode = node.attributes.fullcode;
		}
		Ext.getCmp("accountlist").store.baseParams.varAccountCode = "";
		Ext.getCmp("accountlist").store.baseParams.varAccountName = "";
		//2.加载store
		Ext.getCmp("accountlist").store.load(
		{
		    params : 
		    {
		    	start:0,
				limit:20
		    }
		});
	}
});
