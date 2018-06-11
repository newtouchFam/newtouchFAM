<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="javax.servlet.http.HttpSession"  %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>  
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<base href="<%= basePath %>">
<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="dwrjs/engine.js"></script>
<script type="text/javascript" src="SMX/Homepage/AuthProxy.js"></script>
<script type="text/javascript" src="SMX/Homepage/MenuProxy.js"></script>
<script type="text/javascript" src="SMX/Homepage/mainframe.js"></script>
<script type="text/javascript">
Ext.onReady(function(){
createMainFrame();
});
</script>
<title></title>
<% 
String hostName = request.getRemoteHost();
String hostIp = request.getRemoteAddr();
session.setAttribute("staffid","B4908E36-7626-4F60-ABDF-0F3CA44B8A11");		
%>

<STYLE type="text/css">
html, body {
    margin:0;
    padding:0;
    border:0 none;
    overflow:hidden;
    height:100%;
    width:100%;
}
</STYLE>
</head>
<body>
<img   id='img1' border='0' src='resources/images/w1.jpg' width='100%' height='100%' style='position:absolute;z-index:-1'>
<input type="hidden" id="basePath" value="<%= basePath %>">
<input type="hidden" id="hostName" value="<%= hostName %>">
<input type="hidden" id="hostIp" value="<%= hostIp %>">
</body>
</html>