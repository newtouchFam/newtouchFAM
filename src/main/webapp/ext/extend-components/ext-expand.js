Ext.data.Record.prototype.contains_FieldName = function(strFieldName)
{
	for (var i = 0; i < this.fields.keys.length; i++)
	{
		var key = this.fields.keys[i];

		if (key == strFieldName)
		{
			return true;
		}
	}

	return false;
};

/**设置textfield超出最大长度不让其输入*/
Ext.form.TextField.prototype.size = 20;
Ext.form.TextField.prototype.initValue = function()
{
	if (this.value !== undefined)
	{
		this.setValue(this.value);
	}
	else if (this.el.dom.value.length > 0)
	{
		this.setValue(this.el.dom.value);
	}
	this.el.dom.size = this.size;
	if (!isNaN(this.maxLength) && (this.maxLength * 1) > 0 && (this.maxLength != Number.MAX_VALUE))
	{
		this.el.dom.maxLength = this.maxLength * 1;
	}
};  
