<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		
		<%
			String path = request.getContextPath();
			String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
			String m8_companyid = request.getSession().getAttribute("M8_COMPANYID").toString();
			String m8_companycode = request.getSession().getAttribute("M8_COMPANYCODE").toString();
			String m8_companyname = request.getSession().getAttribute("M8_COMPANYNAME").toString();
		%>  
		<base href="<%= basePath %>">
		
		<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
		<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="ext/ext-all.js"></script>
		
		
		<STYLE type="text/css">
		
		.browser {
			background-image: url(resources/images/browser.gif) !important;
		}
		
		.import {
			background-image: url(resources/images/edit.gif) !important;
		}
		
		</STYLE>
		
		<script src="scripts/XyGlobal.js" type="text/javascript"></script>
		<script type="text/javascript" src="ext/ext-lang-zh_CN.js"></script>
		<script src="dwrjs/engine.js" type="text/javascript"></script>
		<script src="dwrjs/util.js" type="text/javascript"></script>
		<script src="BCM/common/Freesky.AlertWindow.js" type="text/javascript"></script>
		<script src="bcm/budgeting/budgetimport/spectactbudgetimport.js" type="text/javascript"></script>
		<script src="SSC/core/common/FileUploadField.js" type="text/javascript"></script>
		<link rel="stylesheet" type="text/css" href="SSC/core/common/FileUploadField.css" />
		<script type="text/javascript" src="cloud/bcm/budgeting/budgetimport/budgetimportservice.js"></script>
		
		<title></title>
	</head>
	
	<body>
		<input type="hidden" id="basePath" value="<%= basePath %>">
		<input type="hidden" id="path" name="path" value='<%=path%>' />
		<input type="hidden" id="m8_companyid" value="<%= m8_companyid %>" />
		<input type="hidden" id="m8_companycode" value="<%= m8_companycode %>" />
		<input type="hidden" id="m8_companyname" value="<%= m8_companyname %>" />
	</body>
</html>