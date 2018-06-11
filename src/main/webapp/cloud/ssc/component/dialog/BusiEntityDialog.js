Ext.namespace("ssc.component");

/**
 * 实体
 * 全部
 * condition
 * xy_BaseParams.factorid
 */
ssc.component.BusiEntityListDialog = Ext.extend(ssc.component.BaseListDialog,
{
	/* 默认值 */
	title : "未设置条件选择",
	width : 430,
	height : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.ToolBar,
	xy_DataActionURL : "SSC/ssc_BusiEntityAction!getPageUnSet.action",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "entityID",
	xy_DisplayField : "entityName",
	xy_FieldList : [ "entityID", "entityCode", "entityName" ],
	xy_ColumnConfig : [
	{
		header : "规则实体编码",
		dataIndex : "entityCode",
		width : 100,
		sortable : true
	},
	{
		header : "规则实体名称",
		dataIndex : "entityName",
		width : 125,
		sortable : true
	},
	{
		header : "备注说明",
		dataIndex : "",
		width : 125,
		sortable : true
	} ]
});
Ext.reg("ssc.component.busientitylistdialog", ssc.component.BusiEntityListDialog);
