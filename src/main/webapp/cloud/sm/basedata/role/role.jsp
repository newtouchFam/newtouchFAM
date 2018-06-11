<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
	<head> 
		<%@ include file="/cloud/common/common_meta_basepath.jspf" %>
		<%@ include file="/cloud/sm/common/sm_all.jspf" %>

		<script type="text/javascript" src="cloud/sm/basedata/role/role_edit_win.js"></script>
		<script type="text/javascript" src="cloud/sm/basedata/role/role_operation_win.js"></script>
		<script type="text/javascript" src="cloud/sm/basedata/role/role.js"></script>
	</head>
	<body>
		<input type="hidden" id="session_unitid" value="<%=session_unitid%>">
	</body>
</html>