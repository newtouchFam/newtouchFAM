Ext.namespace("ssc.smcs.component");

ssc.smcs.component.SettleTypeComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "结算方式",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "wf/CommonGridListDataAction.action",
	xy_NewProcAction : true,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "settletype",
	valueField : "settletypecode",
	displayField : "settletypename",
	xy_StoreFields : [ "settletypecode", "settletypename" ],
    isLoan : function()
	{
   		return (this.getKeyValue() == "ST00");
   	},
   	isPayMent : function()
   	{
   		return (this.getKeyValue() == "ST01");
   	}
});
Ext.reg("ssc.smcs.component.settletypecombobox", ssc.smcs.component.SettleTypeComboBox);