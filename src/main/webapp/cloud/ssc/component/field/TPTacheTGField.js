Ext.namespace("ssc.component");

/**
 * 任务池列表
 */
ssc.component.TPTacheListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "任务池",
	emptyText : "请选择...",
	xy_WinTitle : "选择任务池",
	xy_WinWidth : 400,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_TacheAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : true,
	xy_KeyField : "tacheID",
	xy_DisplayField : "tacheName",
	xy_FieldList : [ "tacheID", "tacheCode", "tacheName", "remark", "tacheType" ],
	xy_ColumnConfig : [
	{
		header : "任务池编码",
		dataIndex : "tacheCode",
		width : 200,
		sortable : true
	},
	{
		header : "任务池名称",
		dataIndex : "tacheName",
		width : 180,
		sortable : true
	},
	{
		header : "备注",
		dataIndex : "remark",
		width : 100,
		sortable : true
	} ]
});