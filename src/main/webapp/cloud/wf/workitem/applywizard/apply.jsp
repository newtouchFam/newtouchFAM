<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<HTML class="xy-viewport">
	<HEAD>
		<%@ include file="/cloud/common/common_meta_basepath.jspf" %>
		<%@ include file="/cloud/wf/common/wf_all.jspf" %>

		<script type="text/javascript" src="cloud/wf/workitem/applywizard/BusiClassView.js"></script>
		<script type="text/javascript" src="cloud/wf/workitem/applywizard/processChartWin.js"></script>
		<script type="text/javascript" src="cloud/wf/workitem/applywizard/XyStepBottomButton.js"></script>	
		<script type="text/javascript" src="cloud/wf/workitem/applywizard/apply.js"></script>	
	</HEAD>
	<BODY>
		<input type="hidden" id="basePath" value="<%=basePath%>">
		<input type="hidden" id="submited" name="submited" value="0" />
		<input type="hidden" id="userID" name="userID" value="<%=session_userid%>" />
	</BODY>
</HTML>
