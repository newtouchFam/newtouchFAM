ApproveUserService = {};

/**
 * 获取下一环节审批人
 */
ApproveUserService.getNextActivityUser = function(processInstID, activityInstID, workDataJson,
	successCallback, failureCallback, scope)
{
	p_url = "wf/wfapproveuser/getnextactivityuser";
	p_param =
	{
		processInstID : processInstID,
		activityInstID : activityInstID,
		workDataJson : workDataJson
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
}

/**
 * 发起环节获取下一环节审批人
 */
ApproveUserService.getSMANextActivityUser = function(userID, processID, activityID, workDataJson,
	successCallback, failureCallback, scope)
{
	p_url = "wf/wfapproveuser/getsmanextactivityuser";

	p_param =
	{
		userID : userID,
		processID : processID,
		activityID : activityID,
		workDataJson : workDataJson
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
}