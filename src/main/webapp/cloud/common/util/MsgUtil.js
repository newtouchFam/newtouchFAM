Ext.namespace("ssc.common");

/**
 * 消息工具类
 */
ssc.common.MsgUtil = {};

/**
 * 缩写定义
 */
MsgUtil = ssc.common.MsgUtil;

/**
 * 提示信息
 */
ssc.common.MsgUtil.alert = function(msg, callbackFun, scope)
{
	Ext.Msg.show(
	{
		title : "提示",
		msg : msg,
		icon : Ext.Msg.INFO,
		buttons: Ext.Msg.OK,
		fn : callbackFun,
		scope : scope
	});
};

/**
 * 确认信息，是否
 */
ssc.common.MsgUtil.confirm = function(msg, callbackFun, scope)
{
	Ext.Msg.show(
	{
		title : "确认",
		msg : msg,
		icon : Ext.Msg.QUESTION,
		buttons : Ext.Msg.YESNO,
		fn : callbackFun,
		scope : scope
	});
};

/**
 * 确认信息，确定取消
 */
ssc.common.MsgUtil.prompt = function(msg, callbackFun, scope)
{
	Ext.Msg.show(
	{
		title : "确认",
		msg : msg,
		icon : Ext.Msg.QUESTION,
		buttons : Ext.Msg.OKCANCEL,
		fn : callbackFun,
		scope : scope
	});
};

/**
 * 警告、错误信息
 */
ssc.common.MsgUtil.warning = function(msg, callbackFun, scope)
{
	Ext.Msg.show(
	{
		title : "提示",
		msg : msg,
		icon : Ext.Msg.WARNING,
		buttons : Ext.Msg.OK,
		fn : callbackFun,
		scope : scope
	});
};