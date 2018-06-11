ActivitySubmitService = {};

ActivitySubmitService.submit = function(workItemID, formDataJson, workDataJson, historyJson, activityUserIDXml,
	successCallback, failureCallback, scope)
{
	p_url = "wf/wfactivity/submit/submit";
	p_param =
	{
		workItemID : workItemID,
		formDataJson : formDataJson,
		workDataJson : workDataJson,
		historyJson : historyJson,
		activityUserIDXml : activityUserIDXml
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

ActivitySubmitService.startEx = function(userID, processID, activityID, formID, workItemID,
	formDataJson, workDataJson, historyJson, activityUserIDXml,
	successCallback, failureCallback, scope)
{
	p_url = "wf/wfactivity/submit/startex";
	p_param =
	{
		userID : userID,
		processID : processID,
		activityID : activityID,
		formID : formID,
		workItemID : workItemID,
		formDataJson : formDataJson,
		workDataJson : workDataJson,
		historyJson : historyJson,
		activityUserIDXml : activityUserIDXml
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

ActivitySubmitService.getNextWorkitem = function(p0, p1, callback)
{
	p_url = "wf/wfactivity/submit/getnextworkitem";
	p_param =
	{
		userID : p0,
		processinstID : p1
	};

	dwrcallutil.call(p_url, p_param, this, callback);
};