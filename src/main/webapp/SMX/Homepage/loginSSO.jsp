<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="javax.servlet.http.HttpSession,java.util.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	//如果是https协议，则去掉端口号
	if ( request.getScheme().equalsIgnoreCase("https") ) 
		basePath = request.getScheme() + "://" + request.getServerName() + request.getContextPath()+"/";

%>
<base href="<%=basePath%>">
<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="resources/css/ext-patch.css" />
<link rel="stylesheet" type="text/css" href="resources/css/m8-common.css" />

<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="ext/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="dwrjs/engine.js"></script>

<script type="text/javascript" src="SSC/scripts/ColumnNodeUI.js"></script>
<script type="text/javascript" src="SSC/scripts/SearchField.js"></script>

<script type="text/javascript" src="SMX/Homepage/AuthProxy.js"></script>
<script type="text/javascript" src="SMX/Homepage/MenuProxy.js"></script>
<script type="text/javascript" src="SMX/Homepage/mainframe.js"></script>
<script type="text/javascript" src="SMX/scripts/Search.js"></script>
<script type="text/javascript" src="SMX/RoleManager/CheckBoxTreeForCheck.js"></script>

<script type="text/javascript" src="scripts/CookieUtil.js"></script>
<script type="text/javascript" src="SSC/zj/component/XyMessageBox.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyMoneyField.js"></script> 

<script type="text/javascript" src="scripts/dateFieldIE8BugFix.js"></script>

<script type="text/javascript">
    if( Ext )
    {
		window.onbeforeunload = function() {
			if( window==top)
			{		
				Ext.Ajax.request( {
					url :'SMX/destroySession.action'
				});	
			}			
			return;
		};
	
		Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
	
		Ext.onReady(function() {
			document.getElementById("img1").src = "";
			createMainFrame();
		});
		//默认异步请求最长等待时间3分钟
		Ext.Ajax.timeout = 180000;
    }

	self.moveTo(0, 0)
	self.resizeTo(screen.availWidth, screen.availHeight)
	
	this.loginSSO = true;
</script>

<title></title>
<%
	String hostName = request.getRemoteHost();
	String hostIp = request.getRemoteAddr();
%>

<STYLE type="text/css">
html,body {
	margin: 0;
	padding: 0;
	border: 0 none;
	overflow: hidden;
	height: 100%;
	width: 100%;
}
</STYLE>
<OBJECT classid="clsid:adb880a6-d8ff-11cf-9377-00aa003b7a11" onreadystatechange="if (this.readyState==4) this.Click();" VIEWASTEXT><PARAM name="Command" value="Maximize"></OBJECT>
</head>
<title>财务核算</title>
<body>
<img id='img1' border='0' src='resources/images/w1.jpg' width='100%'
	height='100%' style='position: absolute; z-index: -1'>
<input type="hidden" id="basePath" value="<%=basePath%>">
<input type="hidden" id="hostName" value="<%=hostName%>">
<input type="hidden" id="hostIp" value="<%=hostIp%>">
</body>
</html>