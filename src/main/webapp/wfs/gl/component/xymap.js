Ext.app.XyMap = function(config) {
	config = config || {};
	
	this.keyArray = new Array();
	this.valueArray = new Array();
	
	this.put = function(key,value)
	{
		var index = this.keyArray.indexOf(key);
		if (index >= 0)
		{
			this.valueArray[index] = value;
		}
		else
		{
			this.keyArray.push(key);
			this.valueArray.push(value);		
		}
	},
	this.get = function(key)
	{
		var index = this.keyArray.indexOf(key);
		if (index >= 0)
		{
			return this.valueArray[index];
		}
		else
		{
			return null;
		}
	},
	this.contains = function(key)
	{
		var index = this.keyArray.indexOf(key);
		return index >= 0;
	},
	this.swap = function(fromIndex, toIndex)
	{
		var temp = this.keyArray[toIndex];
		this.keyArray[toIndex] = this.keyArray[fromIndex];
		this.keyArray[fromIndex] = temp;
		
		temp = this.valueArray[toIndex];
		this.valueArray[toIndex] = this.valueArray[fromIndex];
		this.valueArray[fromIndex] = temp;
	},
	this.remove = function(key)
	{
		var index = this.keyArray.indexOf(key);
		if (index >= 0)
		{
			var valueObject = this.valueArray[index];
			this.valueArray.remove(valueObject);
			
			var keyObject = this.keyArray[index];
			this.keyArray.remove(keyObject);
		}
	}
	this.clear = function()
	{
		var nCount = this.valueArray.length;
		this.valueArray.splice(0, nCount);
		
		nCount = this.keyArray.length;
		this.keyArray.splice(0, nCount);
	}
	this.clone = function()
	{
		var newMap = new Ext.app.XyMap();
		for (var i = 0; i < this.keyArray.length; i++)
		{
			newMap.put(this.keyArray[i], this.valueArray[i]);
		}
		return newMap;
	},
	this.size = function()
	{
		return this.valueArray.length;
	}
}
Ext.reg('xymap', Ext.app.XyMap);