Ext.namespace("gl.datamamager.ledgermanager");
/**
 * 分户管理界面主面板
 * 
 */
gl.datamamager.ledgermanager.MainPanel = Ext.extend(Ext.Panel, 
{
	//定义变量、属性
	id : 'ledgermanagermain',
	frame : false,
	border : false,
	layout : 'border',
	//构造面板内容
	initComponent : function()
	{
		//1.创建公司选择组件；
		//给公司组件一个默认值
		var data = 
		{
			id : Ext.getDom('M8_COMPANYID').value,
			text : Ext.getDom('M8_COMPANYNAME').value
		};
		this.varcompanyname = new Ext.app.XyComboBoxTree(
		{
			id : 'company',
			width :200,
			fieldLabel : '公司',
			leafSelect :false,
			XyAllowDelete : false,
			hiddenData :data,
			rootTitle :'请选择公司',
			winHeight :500,
			scriptPath :'wfs',
			firstSqlFile :'selectcompanytree0',
			otherSqlFile :'selectcompanytree1'
		});
		//2.创建tbar；
		var barTop = ['-','公司:',this.varcompanyname,'-'];
		this.tbar = barTop;
		//3.创建左侧树面板；
		this.ledgertypetree = new gl.datamamager.ledgermanager.ledgertypetree({});
		this.ledgertypetree.on("click", onClickExpand, this);
		//4.创建右侧树面板；
		this.ledgeritemtree = new gl.datamamager.ledgermanager.ledgeritemtree({});
		this.ledgeritemtree.on("click", onClickExpand, this);

		this.items = [this.ledgertypetree,this.ledgeritemtree];
		//5.渲染
		gl.datamamager.ledgermanager.MainPanel.superclass.initComponent.call(this);
	}
});

function init()
{
	new Ext.Viewport(
	{
		layout : 'fit',
		items : [ new gl.datamamager.ledgermanager.MainPanel ]
	});
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);