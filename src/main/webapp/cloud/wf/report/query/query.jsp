<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
	<head>
		<%@ include file="/cloud/common/common_meta_basepath.jspf" %>
		<%@ include file="/cloud/wf/common/wf_all.jspf" %>

		<script type="text/javascript" src="cloud/wf/report/query/query.js"></script>
	</head>

	<body>
		<input type="hidden" id="basePath" value="<%=basePath%>">
		<input type="hidden" id="session_unitid" value="<%=session_unitid%>">
		<input type="hidden" id="userid" value="<%=session_userid%>">
		<input type="hidden" id="operationcode" value="SSC0406">
	</body>
</html>