<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<base href="<%= basePath %>">
<title>新致财务核算专家</title>
<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="dwrjs/engine.js"></script>
<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="resources/css/m8-common.css" />
<link rel="stylesheet" type="text/css" href="resources/css/ext-patch.css" />

<script type="text/javascript" src="SMX/Homepage/AuthProxy.js"></script>
<script type="text/javascript" src="SMX/Homepage/MenuProxy.js"></script>
<script type="text/javascript" src="SMX/Homepage/mainframe.js"></script>
<script type="text/javascript" src="SMX/Homepage/loginIndex.js"></script>

<script type="text/javascript">
	window.onbeforeunload = function() {
		if( window==top)
		{		
			Ext.Ajax.request( {
				url :'SMX/destroySession.action'
			});	
		}		
	    return;
	};
	//默认异步请求最长等待时间3分钟
	Ext.Ajax.timeout = 180000;
	
	this.loginSSO = false;
</script>

<% 
String hostName = request.getRemoteHost();
String hostIp = request.getRemoteAddr();
%>


</head>
<body>
<!--<img   id='img1' border='0' src='resources/images/w1.jpg' width='100%' height='100%' style='position:absolute;z-index:-1'>-->





<input type="hidden" id="basePath" value="<%= basePath %>">
<input type="hidden" id="hostName" value="<%= hostName %>">
<input type="hidden" id="hostIp" value="<%= hostIp %>">
</body>
</html>