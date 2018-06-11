Ext.namespace('gl.component');

gl.component.flowsel = Ext.extend(
		gl.component.cashflowtreegridselect, {
	title: "现金流量选择",	
	leftPnlTitle: "现金流量",
	nodeId : "",
	codecondition : "",
	rootVisible: true,
	rootText : "现金流量类别类别",
	treeUrl: "vouchermanager/flowchoose/findFlowGroup",
	gridUrl: "vouchermanager/flowchoose/findFlowByFilter",
	conditionData : [
		['code', '项目编号']
	],
	getDataFilter : function()
	{
		var dataFilter = 
		{
			codecondition : this.codecondition || null
		};
		return dataFilter;
	},
	getTreeDataFilter : function()
	{
		var dataFilter = 
		{
		};			
		
		return dataFilter;
	},
	initComponent : function()
	{
		this.fields = ['uqflowitemid', 'varcode', 'varname', 'vartypecode', 'vartypename'];
		this.colModel = [
			{header : "现金流量项目ID", dataIndex : "uqflowitemid", hidden : true},
			{header : "项目编号",dataIndex : "varcode",width : 60,sortable : true},
			{header : "项目名称",dataIndex : "varname",width : 150,sortable : true},
			{header : "所属分类编号",dataIndex : "vartypecode",width : 100,sortable : true},
			{header : "所属分类名称",dataIndex : "vartypename",width : 150,sortable : true}
		];		
		
		gl.component.flowsel.superclass.initComponent.call(this);
	}
});