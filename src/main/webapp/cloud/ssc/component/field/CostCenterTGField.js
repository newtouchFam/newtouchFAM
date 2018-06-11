Ext.namespace("ssc.component");

ssc.component.CostCenterListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "成本中心",
	emptyText : "请选择成本中心...",
	xy_WinTitle : "选择成本中心",
	xy_WinWidth : 400,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/em8_CostCenterAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : true,
	xy_KeyField : "ccID",
	xy_DisplayField : "ccName",
	xy_FieldList : [ "ccID", "ccCode", "ccName" ],
	xy_ColumnConfig : [
	{
		header : "成本中心编码",
		dataIndex : "ccCode",
		width : 150,
		sortable : true
	},
	{
		header : "成本中心名称",
		dataIndex : "ccName",
		width : 200,
		sortable : true
	} ]
});

/**
 * 默认单位ID
 * xy_UnitID : "",
 * 默认单位名称
 * xy_UnitText : "",
 */
ssc.component.CostCenterListByUnitTGField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "成本中心",
	emptyText : "请选择成本中心...",
	/* 默认单位ID */
	xy_UnitID : "",
	/* 默认单位名称 */
	xy_UnitText : "",
	/**
	 * @override ssc.component.BaseTreeField.createDialog
	 */
	createDialog : function()
	{
		this.m_Dialog = new ssc.component.CostCenterListByUnitDialog(
		{
			closeAction : "hide",
			xy_UnitID : this.xy_UnitID,
			xy_UnitText : this.xy_UnitText,
			xy_ParentObjHandle : this.xy_ParentObjHandle,
			xy_OKClickEvent : this.xy_OKClickEvent,
			xy_PageMode : this.xy_PageMode,
			xy_MultiSelectMode : this.xy_MultiSelectMode
		});
	}
});