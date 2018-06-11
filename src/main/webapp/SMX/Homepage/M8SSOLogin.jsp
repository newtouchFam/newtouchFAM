<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@page import="java.net.*"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title></title>  
<%
request.setCharacterEncoding("UTF-8");
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<base href="<%= basePath %>">
<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script src="dwrjs/engine.js" type="text/javascript"></script>
<script src="dwrjs/util.js" type="text/javascript"></script>
<script type="text/javascript" src="SMX/Homepage/AuthProxy.js"></script>
<script type="text/javascript" src="SMX/Homepage/MenuProxy.js"></script>
<script type="text/javascript" src="SMX/Homepage/mainframe.js"></script>
<script src="SMX/Homepage/M8SSOLogin.js" type="text/javascript"></script>

</head>
<body> 
<input type="hidden" id="basePath" value="<%= basePath %>">
<input type="hidden" id="path" name="path" value='<%=path%>' />
<input type="hidden" id="UserCode" name="UserCode" value='<%=URLDecoder.decode(request.getParameter("code"),"utf-8")%>' />
<%-- <input type="hidden" id="PW" name="PW" value='<%=request.getParameter("PW")%>' /> --%>
</body>
</html>