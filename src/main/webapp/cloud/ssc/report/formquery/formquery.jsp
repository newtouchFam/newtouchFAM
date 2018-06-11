<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	
	String userid = request.getSession().getAttribute("M8_USERID").toString();
%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<base href="<%=basePath%>" />
		<meta http-equiv="x-ua-compatible" content="ie=6" />
		<jsp:include page="/SSC/shcs/common/common.jsp"></jsp:include>

		<script type="text/javascript" src="SSC/core/component/tgfield/BillTypeTGField.js"></script>
		<script type="text/javascript" src="SSC/cup/component/XyBusiClassMCField.js"></script>
		<script type="text/javascript" src="SSC/cup/component/XyMasterDataMCField.js"></script>

		<script type="text/javascript" src="SSC/core/report/formquery/formquery.js"></script>
		<title></title>
	</head>
	
	<body>
		<input type="hidden" id="basePath" value="<%=basePath%>">
		<input type="hidden" id="userid" value="<%=session_userid%>">
	</body>
</html>