Ext.namespace("ssc.smcs.component");

ssc.smcs.component.PayObjectTypeComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "支付类型",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "payobjecttype",
	valueField : "payobjecttypecode",
	displayField : "payobjecttypename",
	xy_StoreFields : [ "payobjecttypecode", "payobjecttypename" ],
	isSupplier : function()
	{
		return (this.getKeyValue() == "POT01");
	},
	isStaff : function()
	{
		return (this.getKeyValue() == "POT00");
	},
	isCustomer : function()
	{
		return (this.getKeyValue() == "POT02");
	}
});
Ext.reg("ssc.smcs.component.payobjecttypecombobox", ssc.smcs.component.PayObjectTypeComboBox);