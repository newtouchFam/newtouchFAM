Ext.namespace("ssc.common.Map");


/**
 * 基础Map对象
 */

MapData = function(key, value)
{
	this.key = key;
	this.value = value;
};

Map = function()
{
	this.m_KeyList = new Array();
	
	this.put = function(key, value)
	{
		for ( var i = 0; i < this.m_KeyList.length; i++)
		{
			if (this.m_KeyList[i].key == key)
			{
				this.m_KeyList[i].value = value;
				return;
			}
		}
		this.m_KeyList[this.m_KeyList.length] = new MapData(key, value);
	},
	this.get = function(key)
	{
		for ( var i = 0; i < this.m_KeyList.length; i++)
		{
			if (this.m_KeyList[i].key == key)
			{
				return this.m_KeyList[i].value;
			}
		}
		return null;
	},
	this.putAll = function(array)
	{
		if (typeof(array) != "object")
		{
			return;
		}

		for (var i = 0; i < array.length; i++)
		{
			var o = array[i];
			this.put(o[0], o[1]);
		}
	},
	this.remove = function(key)
	{
		var v;
		for ( var i = 0; i < this.m_KeyList.length; i++)
		{
			v = this.m_KeyList.pop();
			if (v.key == key)
			{
				continue;
			}
			this.m_KeyList.unshift(v);
		}
	},
	this.getSize = function()
	{
		return this.m_KeyList.length;
	},
	this.isEmpty = function()
	{
		return this.m_KeyList.length <= 0;
	};
};
Map.prototype = function(array)
{
	this.m_KeyList = new Array();
	this.putAll(array);
};
