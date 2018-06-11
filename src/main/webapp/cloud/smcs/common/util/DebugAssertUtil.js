Ext.namespace("ssc.shcs.common");

/**
 * 调试状态断言工具类
 */
ssc.shcs.common.DebugAssertUtil = {};

DebugAssertUtil = ssc.shcs.common.DebugAssertUtil;

/**
 * 提示信息
 */
ssc.shcs.common.DebugAssertUtil.alert = function(msg)
{
	ssc.common.AssertUtil.alert(msg, FormGlobalVariant.isDebugMode);
};