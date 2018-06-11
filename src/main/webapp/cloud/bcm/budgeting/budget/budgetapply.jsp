<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ taglib prefix="s" uri="/struts-tags" %>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<%
			String path = request.getContextPath();
			String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
			String m8_companyid = request.getSession().getAttribute("M8_COMPANYID").toString();
		%>  
		<base href="<%= basePath %>">
		<%@ include file="/SSC/core/common/ssc-common.jsp" %>

		<script type="text/javascript" src="cloud/bcm/budgeting/budget/budgetapply.js"></script>
	</head>
	<body>
		<input type="hidden" id="basePath" value="<%= basePath %>">
		<input type="hidden" id="m8_companyid" value="<%= m8_companyid %>" />
	</body>
</html>