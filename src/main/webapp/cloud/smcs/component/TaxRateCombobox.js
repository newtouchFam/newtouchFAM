Ext.namespace("ssc.smcs.component");

ssc.smcs.component.TaxRateComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "税率",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "taxrate",
	valueField : "taxratecode",
	displayField : "taxratename",
	xy_StoreFields : [ "taxratecode", "taxratename", "taxratetext", "taxrate" ],
	getTaxRateText : function()
	{
		return this.getSelectedAttr("taxratetext");
	},
	getTaxRate : function()
	{
		return this.getSelectedAttr("taxrate");
	}
});
Ext.reg("ssc.smcs.component.taxrateCombobox", ssc.smcs.component.TaxRateComboBox);