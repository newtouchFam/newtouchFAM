Ext.namespace("ssc.component");

/**
 * 币种下拉框组件
 * @param
 * 	jsonCondition:
 * 		currencycode	币种编码
 * 		currencyname	币种名称，支持模糊匹配
 * 		status			启用状态，0或1
 */
ssc.component.CurrencyComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "币种",
	width : 200,
	xy_AllowClear : true,
	valueField : "currencycode",
	displayField : "currencyname",
	xy_DataActionURL : "SSC/ssc_CurrencyAction/list",
	xy_StoreFields : [ "currencycode", "currencyname", "fullname", "fullname_eng",
	                   "status", "remark", "isdefault" ],
   	getCurrencyCode : function()
	{
		return this.getSelectedAttr("currencycode");
	},
	getCurrencyName : function()
	{
		return this.getSelectedAttr("currencyname");
	},
	getCurrency : function()
	{
		var currency =
		{
			currencycode : this.getCurrencyCode(),
			currencyname : this.getCurrencyName()
		};

		return currency;
	}
});
Ext.reg("ssc.component.currencycombobox", ssc.component.CurrencyComboBox);