/**
 * 原有dwr远程调用替换工具类
 */
dwrcallutil = {};

/**
 * callback
 * {
 * 		callback ：function(result),
 * 		errorHandler : function(errorString, exception)
 * }
 */
dwrcallutil.call = function(p_url, p_params, p_scope, p_callback)
{
	Ext.Ajax.request(
	{
		url : p_url,
		method : "post",
		params : p_params,
		sync : true,
		success : function(response, options)
		{
			var data = Ext.decode(response.responseText);
			if (data.success)
			{
				if (p_callback != undefined
						&& p_callback.callback != undefined
						&& typeof(p_callback.callback) == "function")
				{
					p_callback.callback(data.msg);
				}
			}
			else
			{
				if (p_callback != undefined
						&& p_callback.errorHandler != undefined
						&& typeof(p_callback.errorHandler) == "function")
				{
					p_callback.errorHandler(data.msg.message, data.msg);
				}
			}
		},
		failure : function(response, options)
		{
			var data = Ext.decode(response.responseText);
			alert(data.msg);
		},
		scope : p_scope
	});
}