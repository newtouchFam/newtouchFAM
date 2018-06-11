<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*, Freesky.M8.SMX.Common.JspCommon"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%  
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%
	
    String M8ServerHost = "http://132.148.4.78";		
	String userName = "mh";		 
	String localIP = JspCommon.getLocalIP();	
%>
<base href="<%= basePath %>">
<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script src="dwrjs/engine.js" type="text/javascript"></script>
<script src="dwrjs/util.js" type="text/javascript"></script>

<script src="SMX/Homepage/SSOLogin.js" type="text/javascript"></script>
<script src="SMX/singleSign/SingleSignProxy.js" type="text/javascript"></script>
<script type="text/javascript">
function LoadToken()
{
	var strToken;
	var strErr;
	var strOutErr;
	//alert( Ext.get("basePath").dom.value);
	SingleSignProxy.CreateToken(Ext.get("userName").dom.value, "<SSO><IC>OA</IC><IP>" + Ext.get("localIP").dom.value + "</IP></SSO>",{callback:OAResponse ,async:false});
}
function OAResponse(data)
{
    if(data.error == 0)
	{
    	alert(data.tokenvalue);
		var basPath = Ext.get("basePath").dom.value;
		window.location.href = basPath + "SMX/Homepage/M8SSOLogin.jsp?tokenvalue= "+data.tokenvalue+" &userName= "+Ext.get("userName").dom.value;
	}
	else
	{
		top.Ext.MessageBox.alert("错误",data.errDesc);
	}
}
</script>

</head>
<body  onload="LoadToken();">
<input type="hidden" id="basePath" value="<%= basePath %>">
<input type="hidden" id="path" name="path" value='<%=path%>' />
<input type="hidden" id="userName" name="userName" value="<%= userName %>">
<input type="hidden" id="localIP" name="localIP" value='<%=localIP%>' />
</body>
</html>