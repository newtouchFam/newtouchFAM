<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		
		<%
			String path = request.getContextPath();
			String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";	
			
			String casecode = request.getParameter("casecode");
			String beginmonth = request.getParameter("beginmonth");
			String endmonth = request.getParameter("endmonth");
			String budgettype = request.getParameter("budgettype");
			String unitidlist = request.getParameter("unitidlist");
			String specidlist = request.getParameter("specidlist");
			String budgetyear = request.getParameter("budgetyear");
			String respnid = request.getParameter("respnid");
			String indexid = request.getParameter("indexid");
		%>  
		<base href="<%=basePath%>">
		<%@ include file="/SSC/core/common/ssc-common.jsp" %>

		<script type="text/javascript" src="cloud/bcm/report/specsummary/specsummary_exvt.js"></script>

		<title></title>
	</head>
	
	<body>
		<input type="hidden" id="basePath" value="<%= basePath %>">
		<input type="hidden" id="casecode" value="<%= casecode %>">
		<input type="hidden" id="beginmonth" value="<%= beginmonth %>">
		<input type="hidden" id="endmonth" value="<%= endmonth %>">
		<input type="hidden" id="budgettype" value="<%= budgettype %>">
		<input type="hidden" id="unitidlist" value="<%= unitidlist %>">
		<input type="hidden" id="specidlist" value="<%= specidlist %>">
		<input type="hidden" id="budgetyear" value="<%= budgetyear %>">
		<input type="hidden" id="respnid" value="<%= respnid %>">
		<input type="hidden" id="indexid" value="<%= indexid %>">
	</body>
</html>