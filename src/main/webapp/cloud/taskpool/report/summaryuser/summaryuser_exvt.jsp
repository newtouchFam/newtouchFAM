<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

	String begindate = request.getParameter("begindate");
	String enddate = request.getParameter("enddate");
	String tacheid = request.getParameter("tacheid");
	String teamid = request.getParameter("teamid");
	String userid = request.getParameter("userid");
	String status = request.getParameter("status");
	String isemergency = request.getParameter("isemergency");
%>  
<base href="<%= basePath %>">
<%@ include file="/SSC/core/common/ssc-common.jsp" %>

<link rel="stylesheet" type="text/css" href="resources/css/m8-common.css" />
<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />

<script type="text/javascript" src="SSC/core/taskpool/report/summaryuser/summaryuser_exvt.js"></script>

<title></title>
</head>

<body>
<input type="hidden" id="basePath" value="<%= basePath %>"></input>
<input type="hidden" id="begindate" value="<%= begindate %>"></input>
<input type="hidden" id="enddate" value="<%= enddate %>"></input>
<input type="hidden" id="tacheid" value="<%= tacheid %>"></input>
<input type="hidden" id="teamid" value="<%= teamid %>"></input>
<input type="hidden" id="userid" value="<%= userid %>"></input>
<input type="hidden" id="status" value="<%= status %>"></input>
<input type="hidden" id="isemergency" value="<%= isemergency %>"></input>
</body>
</html>