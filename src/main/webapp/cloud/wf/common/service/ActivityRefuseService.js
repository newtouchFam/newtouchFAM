ActivityRefuseService = {};

ActivityRefuseService.refuse = function(workItemID, formDataJson, workDataJson, historyJson,
	successCallback, failureCallback, scope)
{
	p_url = "wf/wfactivity/refuse/refuse";
	p_param =
	{
		workItemID : workItemID,
		formDataJson : formDataJson,
		workDataJson : workDataJson,
		historyJson : historyJson
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