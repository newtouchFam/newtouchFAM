Ext.namespace('gl.component');
gl.component.accountsel = Ext.extend(
		gl.component.basetreegridselect, {
	title: "科目选择",	
	leftPnlTitle: "科目",
	nodeId : "groupid",
	codecondition : "",
	rootVisible: true,
	rootText : "科目",
	treeUrl: "vouchermanager/voucheraccount/group",
	gridUrl: "vouchermanager/voucheraccount/filter",
	conditionData : [
		['code', '科目编号']
	],
	getDataFilter : function()
	{
		var dataFilter = 
		{
			codecondition : this.codecondition || null,
		    accountsetid : this.accountsetid || null
		};
		return dataFilter;
	},
	getTreeDataFilter : function()
	{
		var dataFilter = 
		{
			accountsetid : this.accountsetid || null
		};			
		
		return dataFilter;
	},
	initComponent : function()
	{
		this.fields = ['varaccountcode', 'varaccountname', 'varaccountfullname', 'uqaccountid', 'intproperty',
		               'uqtypeid', 'uqforeigncurrid', 'intisledge', 'varmeasure', 'intflag', 'intislastlevel'];
		this.colModel = [
		     			{header : "科目编号",dataIndex : "varaccountcode",width : 120,sortable : true},
		     			{header : "科目名称",dataIndex : "varaccountname",width : 180,sortable : true},
		     			{header : "科目全名称",dataIndex : "varaccountfullname",width : 180,sortable : true},
		     			{header : "科目性质",dataIndex : "intproperty",width : 60,sortable : true},
		     			{header : "科目类别",dataIndex : "uqtypeid",width : 60,sortable : true},
		     			{header : "外币",dataIndex : "uqforeigncurrid",width : 40,sortable : true},
		     			{header : "是否分户核算",dataIndex : "intisledge",renderer : this.isledgeRenderer.createDelegate(this),width : 80,sortable : true},
		     			{header : "计量单位",dataIndex : "varmeasure",width : 60,sortable : true},
		     			{header : "状态",dataIndex : "intflag",renderer : this.flagRenderer.createDelegate(this),width : 40,sortable : true},
		     			{header : "是否末级",dataIndex : "intislastlevel", renderer : this.isledgeRenderer.createDelegate(this), width : 180,sortable : true}
		     		];		
		
		gl.component.accountsel.superclass.initComponent.call(this);
	},
	yesOrNoRenderer : function(value)
	{
		return value == 1 ? formatColor("是","green") : formatColor("否","red");
	},
	propertyRenderer : function(value)
	{
		switch(value)
		{
			case 0: value = "资产";break;
			case 1: value = "负债";break;
			case 2: value = "权益";break;
			case 3: value = "成本";break;
			case 4: value = "损益";break;
		}
		return value;
	},
	contractRenderer : function(value)
	{
		return value == 0 ? formatColor("不需要","red") : 
			(value == 1 ? formatColor("可输","green") : "必输");
	},
	innerOrderRenderer : function(value)
	{
		return value == 0 ? formatColor("不需要","red") : 
			(value == 1 ? formatColor("可输","green") : "必输");
	},
	supplierRenderer : function(value)
	{
		return value == 0 ? formatColor("不需要","red") : 
			(value == 1 ? formatColor("可输","green") : "必输");
	},
	customerRenderer : function(value)
	{
		return value == 0 ? formatColor("不需要","red") : 
			(value == 1 ? formatColor("可输","green") : "必输");
	},
	profitcostRenderer : function(value)
	{
		return value == 0 ? formatColor("常规","red") : 
			(value == 1 ? formatColor("利润中心","green") : "成本中心");
	},
	dcflagRenderer : function(value)
	{
		return value == 0 ? formatColor("借方","green") : formatColor("贷方","red");	
	},
	flowRenderer : function(value)
	{
		return value == 0 ? formatColor("不需要","red") : 
			(value == 1 ? formatColor("可输","green") : "必输");
	},
	//---新增字段数值转换---
	isledgeRenderer : function(value)
	{
		return value == 0 ? formatColor("否","red") : formatColor("是","green");	
	},
	flagRenderer : function(value)
	{
		return value == 0 ? formatColor("停用","red") : 
			(value == 1 ? formatColor("新建","green") : "启用");
	}
});