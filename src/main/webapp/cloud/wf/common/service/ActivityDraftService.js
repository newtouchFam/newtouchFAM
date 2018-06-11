ActivityDraftService = {};

ActivityDraftService.saveDraft = function(formID, formDataJson,
	successCallback, failureCallback, scope)
{
	p_url = "wf/draft/save";
	p_param =
	{
		formID : formID,
		data : formDataJson
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