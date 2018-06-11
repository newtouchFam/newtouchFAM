<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<base href="<%= basePath %>">
<%@ include file="/SSC/core/common/ssc-common.jsp" %>

<script type="text/javascript" src="SSC/core/component/tgfield/TPTacheTGField.js"></script>
<script type="text/javascript" src="SSC/core/component/tgfield/TPTeamTGField.js"></script>
<script type="text/javascript" src="SSC/core/taskpool/report/summaryuser/summaryuser.js"></script>

<title></title>
</head>

<body>
<input type="hidden" id="basePath" value="<%= basePath %>">
</body>
</html>