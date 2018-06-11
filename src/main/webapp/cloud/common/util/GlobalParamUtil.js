/**
 * 全局参数工具类
 */
ssc.common.GlobalParamUtil = {};

GlobalParamUtil = ssc.common.GlobalParamUtil;

/**
 * 是否调试模式
 */
ssc.common.GlobalParamUtil.isDebugMode = true;

/**
 * 自定义全局变量Map
 * 内部使用
 */
ssc.common.GlobalParamUtil.ValueMap = new ssc.common.BaseCondition();

/**
 * 全局参数是否已经初始化
 */
ssc.common.GlobalParamUtil.isInit = false;

/**
 * 初始化全局参数
 * @TO-DO
 */
ssc.common.GlobalParamUtil.init = function()
{
    ssc.common.GlobalParamUtil.isInit = true;
};

ssc.common.GlobalParamUtil.get_SpecactDistribute = function()
{
	if (! ssc.common.GlobalParamUtil.contains_Key("BCM_SPECACT_DISTRIBUTE"))
	{
		Ext.Ajax.request(
		{
			url : "bcm/globalparam/getspecactdistribute",
			sync: true, 
			success : function(response)
			{
				var data = Ext.decode(response.responseText);
				if (data.success == true)
				{
					if (data.success)
					{
						ssc.common.GlobalParamUtil.set_Integer("BCM_SPECACT_DISTRIBUTE", data.data);
					}
					else
					{
						MsgUtil.alert(data.msg);
						return;
					}
				}
			},
			timeout : 0
		});
	}

	return ssc.common.GlobalParamUtil.get_Integer("BCM_SPECACT_DISTRIBUTE");
};

/**
 * 自定义全局参数读取
 */
ssc.common.GlobalParamUtil.contains_Key = function(key)
{
	return ssc.common.GlobalParamUtil.ValueMap.hasProperty(key);
};
ssc.common.GlobalParamUtil.get_String = function(key)
{
	return ssc.common.GlobalParamUtil.ValueMap.getString(key);
};
ssc.common.GlobalParamUtil.get_Integer = function(key)
{
	return ssc.common.GlobalParamUtil.ValueMap.getInteger(key);
};
ssc.common.GlobalParamUtil.get_Number = function(key)
{
	return ssc.common.GlobalParamUtil.ValueMap.getNumber(key);
};
ssc.common.GlobalParamUtil.get_Boolean = function(key)
{
	return ssc.common.GlobalParamUtil.ValueMap.getBoolean(key);
};
ssc.common.GlobalParamUtil.get_Object = function(key)
{
	return ssc.common.GlobalParamUtil.ValueMap.getObject(key);
};

/**
 * 自定义全局参数写入
 */
ssc.common.GlobalParamUtil.set_String = function(key, value)
{
	ssc.common.GlobalParamUtil.ValueMap.addString(key, value);
};
ssc.common.GlobalParamUtil.set_Integer = function(key, value)
{
	ssc.common.GlobalParamUtil.ValueMap.addInteger(key, value);
};
ssc.common.GlobalParamUtil.set_Number = function(key, value)
{
	ssc.common.GlobalParamUtil.ValueMap.addNumber(key, value);
};
ssc.common.GlobalParamUtil.set_Boolean = function(key, value)
{
	ssc.common.GlobalParamUtil.ValueMap.addBoolean(key, value);
};
ssc.common.GlobalParamUtil.set_Object = function(key, value)
{
	ssc.common.GlobalParamUtil.ValueMap.addObject(key, value);
};