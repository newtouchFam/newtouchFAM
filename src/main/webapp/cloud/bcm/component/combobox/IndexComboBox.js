Ext.namespace("bcm.component");

/**
 * 预算项目下拉框组件
 * @param
 * 	jsonCondition:
 * 		casecode	预算方案编码
 * 		year		预算年份
 * 		indexcode	预算项目编码，支持模糊匹配
 * 		indexname	预算项目名称，支持模糊匹配
 * 		indextext	预算项目编码或名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
bcm.component.IndexListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "预算项目",
	emptyText : "请选择预算项目...",
	width : 200,
	xy_AllowClear : true,
	xy_DataActionURL : "bcm/index/list",
	valueField : "indexID",
	displayField : "indexName",
	xy_StoreFields : [ "indexID", "indexCode", "indexName",
	                 "level", "isLeaf", "fullCode", "fullName", "status", "remark",
	                 "caseCode", "caseName",
	                 "parentID", "parentCode", "parentName",
	                 "indexTypeID", "indexTypeCode", "indexTypeName"],
	getIndexID : function()
	{
		return this.getSelectedID();
	},
	getIndexCode : function()
	{
		return this.getSelectedAttr("indexCode");
	},
	getIndexName : function()
	{
		return this.getSelectedAttr("indexName");
	},
	getCaseCode : function()
	{
		return this.getSelectedAttr("caseCode");
	},
	getCaseName : function()
	{
		return this.getSelectedAttr("caseName");
	}
});
Ext.reg("bcm.component.indexlistcombobox", bcm.component.IndexListComboBox);

/**
 * 预算项目下拉框组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		casecode	预算方案编码
 * 		year		预算年份
 * 		textfield	显示字段，格式"[,indexCode,],indexName"
 */
bcm.component.IndexTreeComboBox = Ext.extend(ssc.component.BaseTreeComboBox,
{
	fieldLabel : "预算项目",
	emptyText : "请选择预算项目...",
	width : 200,
	listWidth : 350,
	xy_RootTitle : "预算项目",
	xy_AllowClear : true,
	xy_DataActionURL : "bcm/index/tree",
	getIndexID : function()
	{
		return this.getSelectedID();
	},
	getIndexCode : function()
	{
		return this.getSelectedAttr("indexCode");
	},
	getIndexName : function()
	{
		return this.getSelectedAttr("indexName");
	},
	getCaseCode : function()
	{
		return this.getSelectedAttr("caseCode");
	},
	getCaseName : function()
	{
		return this.getSelectedAttr("caseName");
	}
});
Ext.reg("bcm.component.indextreecombobox", bcm.component.IndexTreeComboBox);