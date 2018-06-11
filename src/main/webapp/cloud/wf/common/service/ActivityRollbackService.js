ActivityRollbackService = {};

/**
 * 审批 - 退回
 * callback
 * {
 * 		callback ：function(result), 成功result=null，否则会提示
 * 		errorHandler : function(errorString, exception)
 * }
 */
ActivityRollbackService.submit = function(p0, p1, p2, p3, p4, p5, callback)
{
	p_url = "wf/wfactivityrollback/submit";
	p_param =
	{
		workItemID : p0,
		activityID : p1,
		userIdJson : p2,
		formDataJson : p3,
		workDataJson : p4,
		historyJson : p5
	};

	dwrcallutil.call(p_url, p_param, this, callback);
};

/**
 * 个人跟踪 - 撤回
 */
ActivityRollbackService.undo = function(userID, processInstID,
	successCallback, failureCallback, scope)
{
	p_url = "wf/wfactivityrollback/undo";
	p_param =
	{
			userID : userID,
			processInstID : processInstID
	};

	Ext.Ajax.request(
	{
		url : p_url,
		method : "post",
		params : p_param,
		success : successCallback,
		failure : failureCallback,
		scope : scope
	});
};