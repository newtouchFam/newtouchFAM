Ext.namespace("ssc.component");

/**
 * 实体
 * 全部任务组
 */
ssc.component.FactorDataListDialog = Ext.extend(ssc.component.BaseListDialog,
{
	/* 默认值 */
	title : "条件数据选择",
	width : 340,
	height : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.ToolBar,
	xy_DataActionURL : "SSC/ssc_FactorDataAction!getPageUnSet.action",
	xy_PageMode : true,
	xy_MultiSelectMode : true,
	xy_KeyField : "factorDataID",
	xy_DisplayField : "factorDataName",
	xy_FieldList : [ "factorDataID", "factorDataCode", "factorDataName", "factorDataParentID",
	           "factorID" ],
	xy_ColumnConfig : [
	{
		header : "实体数据编码",
		dataIndex : "factorDataCode",
		width : 100,
		sortable : true
	},
	{
		header : "实体数据名称",
		dataIndex : "factorDataName",
		width : 125,
		sortable : true
	} ]
});
Ext.reg("ssc.component.factordatalistdialog", ssc.component.FactorDataListDialog);
