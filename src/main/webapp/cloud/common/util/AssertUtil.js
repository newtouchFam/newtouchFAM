/**
 * 断言工具类
 */
ssc.common.AssertUtil = {};

AssertUtil = ssc.common.AssertUtil;

/**
 * 提示信息
 */
ssc.common.AssertUtil.alert = function(msg, expression)
{
	if (expression)
	{
		alert("assert false, msg : \r\n" + msg);
	}
};