<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		
		<%
			String path = request.getContextPath();
			String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";	
			
			String m8_companyid = request.getSession().getAttribute("M8_COMPANYID").toString();
			String casecode = request.getParameter("casecode");
			String beginmonth = request.getParameter("beginmonth");
			String endmonth = request.getParameter("endmonth");
			String budgettype = request.getParameter("budgettype");
			String respnidlist = request.getParameter("respnidlist");
			String indexidlist = request.getParameter("indexidlist");
			String budgetyear = request.getParameter("budgetyear");
		%>  
		<base href="<%=basePath%>">
		<%@ include file="/SSC/core/common/ssc-common.jsp" %>

		<script type="text/javascript" src="cloud/bcm/report/summary/summary_exvt.js"></script>

		<title></title>
	</head>
	
	<body>
		<input type="hidden" id="basePath" value="<%= basePath %>">
		<input type="hidden" id="m8_companyid" value="<%= m8_companyid %>">
		<input type="hidden" id="casecode" value="<%= casecode %>">
		<input type="hidden" id="beginmonth" value="<%= beginmonth %>">
		<input type="hidden" id="endmonth" value="<%= endmonth %>">
		<input type="hidden" id="budgettype" value="<%= budgettype %>">
		<input type="hidden" id="respnidlist" value="<%= respnidlist %>">
		<input type="hidden" id="indexidlist" value="<%= indexidlist %>">
		<input type="hidden" id="budgetyear" value="<%= budgetyear %>">
	</body>
</html>