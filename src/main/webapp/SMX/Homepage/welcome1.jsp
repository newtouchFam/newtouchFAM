<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>  
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
//如果是https协议，则去掉端口号
if ( request.getScheme().equalsIgnoreCase("https") ) 
	basePath = request.getScheme() + "://" + request.getServerName() + request.getContextPath()+"/";
%>
<base href="<%= basePath %>">
<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="SMX/Homepage/bulletMsg.js"></script>
</head>
<body>

</body>
</html>