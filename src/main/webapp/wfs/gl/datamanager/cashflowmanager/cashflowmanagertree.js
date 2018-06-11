Ext.namespace("gl.datamamager.cashflowmanager");
/**
 * 左侧数
 */
gl.datamamager.cashflowmanager.cashflowtree = Ext.extend(Ext.tree.TreePanel, 
{
	//定义变量
	id : 'cashflowtree',  //id   可以通过 Ext.getCmp("id")获得该panel
	region : 'west',// border布局  西部
	width : '200',//设置宽度
	root : new Ext.tree.AsyncTreeNode({id:"00000000-0000-0000-0000-000000000000", text:"现金流量分类"}),//根部 id是根ID text一般name  后台存放node对象的属性
	loader : new Ext.tree.TreeLoader({dataUrl:"datamanager/cashflowmanager/getTypeTree"}),//载入tree 动作action
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
		gl.datamamager.cashflowmanager.cashflowtree.superclass.initComponent.call(this);
		//2.指定节点点击事件
		this.on('click',this.tree_click,this);
	},
	//节点点击事件
	tree_click : function(node, e)
	{
		if(node.id=="00000000-0000-0000-0000-000000000000")
		{
			//1.获取项目信息store并设置参数；
			Ext.getCmp("cashflowlist").store.baseParams.uqflowtypeid = "root";
		}
		else
		{												
			Ext.getCmp("cashflowlist").store.baseParams.uqflowtypeid = node.id;
		}
		//2.加载store
		Ext.getCmp("cashflowlist").store.load(
		{
			params : 
			{
				start:0,
				limit:20
		    }
		});
	}
});