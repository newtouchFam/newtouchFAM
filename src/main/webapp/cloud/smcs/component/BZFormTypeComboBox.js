Ext.namespace("ssc.smcs.component");

ssc.smcs.component.BZFormTypeComboBox = Ext.extend(ssc.component.FormTypeComboBox,
{
	prepareBaseParams : function()
	{
		var condition =
		{
			status : 1,
			isleaf : 1,
			parentcode : "BT01"
		};
		return condition;
	}.createDelegate(this)
});
Ext.reg("ssc.smcs.component.bzFormtypecombobox", ssc.smcs.component.BZFormTypeComboBox);