<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
	<head>
		<title>审批处理中：${processName}</title>

		<%@ include file="/cloud/common/common_meta_basepath.jspf" %>

		<link rel="stylesheet" type="text/css" href="cloud/wf/resources/css/commonFormMgrBar.css" />
		<%@ include file="/cloud/wf/common/wf_all.jspf" %>

		<script type="text/javascript" src="cloud/wf/formmanager/viewInTransForm.js"></script>
	</head>
	
	<script language="javascript">
		function window_onload()
		{
			AddCARoot.AddSHCARoot(0);
		}
	</script>
	
	<body onload="hideMask();">
		<input type="hidden" id="basePath" value="<%= basePath %>">
	
		<input type="hidden" id="userID" value="${userID}">
		<input type="hidden" id="formID" value="${formID}">
		<input type="hidden" id="processID" value="${processID}">
		<input type="hidden" id="processName" value="${processName}">
		<input type="hidden" id="processInstID" value="${processInstID}">

		<input type="hidden" id="activityID" value="${activityID}">
		<input type="hidden" id="activityName" value="${activityName}">
		<input type="hidden" id="activityInstID" value="${activityInstID}">

		<input type="hidden" id="workItemID" value="${workItemID}">
		<input type="hidden" id="entityDataID" value="${entityDataID}">
		<input type="hidden" id="formSerialNo" value="${formSerialNo}">

		<input type="hidden" id="activity_BusiType" value="${activity_BusiType}">
		<input type="hidden" id="activity_Attachment" value="${activity_Attachment}">
	
		<input type="hidden" id="processInstState" value="${processInstState}">
		<input type="hidden" id="workDataState" value="${workDataState}">
		<input type="hidden" id="activityProperty" value="${activityProperty}">

		<iframe id="frmFormInfo" name="frmFormInfo" width="100%" height="100%" frameborder=0 src="${pageUrl}"></iframe>
	</body>
</html>