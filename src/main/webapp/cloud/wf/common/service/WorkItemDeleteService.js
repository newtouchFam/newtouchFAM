WorkItemDeleteService = {};

WorkItemDeleteService.deleteOwnerProcessinst = function(processInstID, userID,
	successCallback, failureCallback, scope)
{
	p_url = "wf/wfworkitem/delete/deleteownerprocessinst";
	p_param =
	{
		processInstID : processInstID,
		userID : userID
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