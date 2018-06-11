/**
 * array(数组)类型工具类
 */
ssc.common.ArrayUtil = {};

/**
 * 缩写定义
 */
ArrayUtil = ssc.common.ArrayUtil;

/**
 * 判断对象是否是数组
 */
ssc.common.ArrayUtil.isArray = function(object)
{
	if (object == null)
	{
		return false;
	}

	if (typeof(object) != "object")
	{
		return false;
	}

	if (object.length == undefined)
	{
		return false;
	}

	if (typeof(object.length) != "number")
	{
		return false;
	}

	if (object.length > 0 && typeof(object[0]) == "undefined")
	{
		return false;
	}

	if (typeof(object.push) != "function")
	{
		return false;
	}

	return (Object.prototype.toString.call(object) === "[object Array]");      
};

/**
 * 
 */
ssc.common.ArrayUtil.indexOfArray = function(array, value)
{
	if (! ssc.common.ArrayUtil.isArray(array))
	{
		return -1;
	}

	for (var i = 0; i < array.length; i++)
	{
		if (array[i] == value)
		{
			return i;
		}
	}

	return -1;
};

/**
 * 判断两个数组内容是否相同，无关顺序
 */
ssc.common.ArrayUtil.compare = function(array1, array2)
{
	if (! ssc.common.ArrayUtil.isArray(array1)
			|| ! ssc.common.ArrayUtil.isArray(array2))
	{
		return false;
	}

	if (array1.length != array2.length)
	{
		return false;
	}

	for (var i = 0; i < array1.length; i++)
	{
		if (ssc.common.ArrayUtil.indexOfArray(array2, array1[i]) < 0)
		{
			return false;
		}
	}

	for (var i = 0; i < array2.length; i++)
	{
		if (ssc.common.ArrayUtil.indexOfArray(array1, array2[i]) < 0)
		{
			return false;
		}
	}

	return true;
};

/**
 * 
 */
ssc.common.ArrayUtil.indexOfArrayByAttr = function(array, attrname, attrvalue)
{
	if (! ssc.common.ArrayUtil.isArray(array))
	{
		return -1;
	}

	for (var i = 0; i < array.length; i++)
	{
		var entity = array[i];
		if (entity != null
				&& entity[attrname] != undefined
				&& entity[attrname] == attrvalue)
		{
			return i;
		}
	}

	return -1;
};

/**
 * 根据对象数组的特定属性，判断两个数组是否相同，无关顺序
 */
ssc.common.ArrayUtil.compareByAttr = function(array1, array2, attrname)
{
	if (! ssc.common.ArrayUtil.isArray(array1)
			|| ! ssc.common.ArrayUtil.isArray(array2))
	{
		return false;
	}

	if (array1.length != array2.length)
	{
		return false;
	}

	for (var i = 0; i < array1.length; i++)
	{
		var entity1 = array1[i];
		if (entity1[attrname] == undefined)
		{
			return false;
		}

		if (ssc.common.ArrayUtil.indexOfArrayByAttr(array2, attrname, entity1[attrname]) < 0)
		{
			return false;
		}
	}

	for (var i = 0; i < array2.length; i++)
	{
		var entity2 = array1[i];
		if (entity2[attrname] == undefined)
		{
			return false;
		}

		if (ssc.common.ArrayUtil.indexOfArrayByAttr(array1, attrname, entity2[attrname]) < 0)
		{
			return false;
		}
	}

	return true;
};