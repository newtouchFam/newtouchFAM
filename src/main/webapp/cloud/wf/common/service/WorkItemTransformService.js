WorkItemTransformService = {};

WorkItemTransformService.transform = function(p0, p1, p2, p3, p4, callback)
{
	p_url = "wf_WfWorkItemTransformService!transform.action";
	p_param =
	{
		workItemID : p0,
		userID : p1,
		formDataJson : p2,
		workDataJson : p3,
		history : p4
	};

	dwrcallutil.call(p_url, p_param, this, callback);
}