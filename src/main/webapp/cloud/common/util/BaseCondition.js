/**
 * 基础条件对象
 */
ssc.common.BaseCondition = function()
{
	this.hasProperty = function(key)
	{
		for (var field in this)
		{
			if (field.toString().trim() === key.toString().trim())
			{
				return true;
			}
		}
		
		return false;
	},
	this.addString = function(key, value)
	{
		if (! ssc.common.StringUtil.isEmpty(value))
		{
			this.addObject(key, value);
		}
	};
	this.addInteger = function(key, value)
	{
		if (ssc.common.NumberUtil.isNumber(value))
		{
			this.addObject(key, value);
		}
	};
	this.addNumber = function(key, value)
	{
		if (ssc.common.NumberUtil.isNumber(value))
		{
			this.addObject(key, value);
		}
	};
	this.addBoolean = function(key, value)
	{
		if (value === true || value === "true" || value === 1)
		{
			this.addObject(key, true);
		}
		else if (value === false || value === "false" || value === 0)
		{
			this.addObject(key, false);
		}
	};
	this.addObject = function(key, value)
	{
		this[key] = value;
	};
	this.deleteProperty = function(key)
	{
		delete this[key];
	};
	this.getString = function(key)
	{
		var value;
		if (this.hasProperty(key))
		{
			value = this[key];
		}
		else
		{
			value = "";
		}

		try
		{
			value = value.toString();
		}
		catch(ex)
		{
			value = "";
		}

		return value;
	};
	this.getInteger = function(key)
	{
		var value;
		if (this.hasProperty(key))
		{
			value = this[key];
		}
		else
		{
			value = "";
		}

		try
		{
			value = Number(value);
		}
		catch(ex)
		{
			value = 0;
		}

		return value;
	};
	this.getNumber = function(key)
	{
		var value;
		if (this.hasProperty(key))
		{
			value = this[key];
		}
		else
		{
			value = "";
		}

		try
		{
			value = Number(value);
		}
		catch(ex)
		{
			value = 0;
		}

		return value;
	};
	this.getBoolean = function(key)
	{
		var value;
		if (this.hasProperty(key))
		{
			value = this[key];
		}
		else
		{
			value = "";
		}

		if (value === true || value == "true")
		{
			value == true;
		}
		else if (value === false || value == "false")
		{
			value == false;
		}

		return value;
	};
	this.getObject = function(key)
	{
		var value;
		if (this.hasProperty(key))
		{
			value = this[key];
		}
		else
		{
			value = null;
		}

		return value;
	};
};

BaseCondition = ssc.common.BaseCondition;