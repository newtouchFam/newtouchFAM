Ext.namespace("ssc.smcs.component");

ssc.smcs.component.ReportTypeComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "报表类型",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "reporttype",
	valueField : "reporttypecode",
	displayField : "reporttypename",
	xy_StoreFields : [ "reporttypecode", "reporttypename" ],
    isMonthR : function()
	{
		return (this.getKeyValue() == "RT00");
	},
	isYearR : function()
	{
		return (this.getKeyValue() == "RT01");
	}
});
Ext.reg("ssc.smcs.component.reporttypecombobox", ssc.smcs.component.ReportTypeComboBox);