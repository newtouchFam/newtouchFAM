/**
 * 异常处理工具类
 */
ssc.common.ExceptionUtil = {};

ExceptionUtil = ssc.common.ExceptionUtil;

/**
 * Ajax请求异常通用处理事件
 */
ssc.common.ExceptionUtil.AjaxRequestFailureEvent = function(response, options)
{
    var text = response.responseText.substr(0, 50).trim();
    
    if (response.status == 500)
    {
    	MsgUtil.warning("错误号：" + response.status.toString() + ", 错误信息：无法访问服务");
    }
    else
    {
    	MsgUtil.warning("错误号：" + response.status.toString() + ", 错误信息：" + text);
    }
};

/**
 * jsonStore加载异常通用处理事件
 */
ssc.common.ExceptionUtil.StoreLoadExcpetionEvent = function(This, node, response)
{
	try
	{
		var data = Ext.decode(response.responseText);

		MsgUtil.warning("数据加载出现问题，错误信息：" + data.msg);
	}
	catch(ex)
	{
		MsgUtil.warning("数据加载出现问题，返回信息格式错误");
	}	
};

/**
 * 树Store加载异常通用处理事件
 */
ssc.common.ExceptionUtil.TreeLoadExceptionEvent = function(This, node, response)
{
	try
	{
		var data = Ext.decode(response.responseText);

		MsgUtil.warning("数据加载出现问题，错误信息：" + data.msg);
	}
	catch(ex)
	{
		MsgUtil.warning("数据加载出现问题，返回信息格式错误");
	}
};