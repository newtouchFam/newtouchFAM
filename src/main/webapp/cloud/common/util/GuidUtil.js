/**
 * Guid工具类
 */
ssc.common.GuidUtil = {};

/**
 * 缩写定义
 */
GuidUtil = ssc.common.GuidUtil;

/**
 * 判断对象是否是数组
 */
ssc.common.GuidUtil.getNewID = function(randomLength)
{
	return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36);
};