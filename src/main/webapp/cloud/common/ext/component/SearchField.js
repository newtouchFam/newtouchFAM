Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField,
{
	initComponent : function()
	{
		Ext.app.SearchField.superclass.initComponent.call(this);
		this.on('specialkey', function(f, e)
		{
			if (e.getKey() == e.ENTER)
			{
				this.onTrigger1Click();
			}
		}, this);
	},
	readOnly : true,
	validationEvent : false,
	validateOnBlur : false,
	trigger1Class : 'x-form-search-trigger',
	trigger2Class : 'x-form-clear-trigger',
	width : 180,
	paramName : 'query',
	hiddenData : null
});