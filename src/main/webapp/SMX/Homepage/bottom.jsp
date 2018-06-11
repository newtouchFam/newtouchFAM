<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>  
<base href="<%= basePath %>">
<title>Insert title here</title>
<link rel="stylesheet" type="text/css"
	href="ext/resources/css/ext-all.css" />
<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="dwrjs/engine.js"></script>
<script type="text/javascript" src="SMX/Homepage/AuthProxy.js"></script>
<script type="text/javascript" src="WfApp/reimbursementGuideUpload/reimbursementGuideUpload.js"></script>
<script type="text/javascript" src="SSC/zj/component/rowactions/Ext.ux.grid.RowActions.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyCalcRecord.js"></script>
<script type="text/javascript" src="SSC/zj/form/reimbursement/callbackservice.js"></script>

<script src="SMX/Homepage/bottom.js" type="text/javascript"></script>
<STYLE type="text/css">
td {
	color: yellow;
	font-size: 9px
}

html,body {
	margin: 0;
	padding: 0;
	border: 0 none;
	overflow: hidden;
	height: 100%;
	width: 100%;
}
</STYLE>
</head>
<body>
	<table width="100%" cellpadding="0" cellspacing="0"
	style="background-image: url(resources/images/bottom3.jpg); background-repeat: repeat-x;">
    <tr>
        <td align="left" valign="bottom">
	    	<font color="white" size="2" >上海新致软件股份有限公司 版权所有©2014-2018 Newtouch.com</font>
	    </td>
	</tr>
	</table>
</body>
</html>