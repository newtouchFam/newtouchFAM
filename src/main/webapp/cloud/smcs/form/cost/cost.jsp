<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
	<head>
		<%@ include file="/cloud/common/common_meta_basepath.jspf" %>
		<%@ include file="/cloud/smcs/common/smcs_all.jspf" %>

		<script type="text/javascript" src="cloud/smcs/form/cost/cost_config_access.js"></script>
		<script type="text/javascript" src="cloud/smcs/form/cost/cost_config_fieldattr.js"></script>
		<script type="text/javascript" src="cloud/smcs/form/cost/cost_header_panel.js"></script>
		<script type="text/javascript" src="cloud/smcs/form/cost/cost_business_panel.js"></script>
		<script type="text/javascript" src="cloud/smcs/form/cost/cost_info_win.js"></script>
		<script type="text/javascript" src="cloud/smcs/form/cost/cost_info_panel.js"></script>

		<script type="text/javascript" src="cloud/smcs/form/cost/cost.js"></script>
	</head>
	<body style="background-color: #EDF3FB;">
		<div id="maindiv">
		</div>
		<input type="hidden" id="basePath" value="<%= basePath %>">

		<input type="hidden" id="operType" value="${operType}">
		<input type="hidden" id="formTypeCode" value="${formTypeCode}">
		<input type="hidden" id="formTypeName" value="${formTypeName}">
		<input type="hidden" id="busiClassCode" value="${busiClassCode}">
		<input type="hidden" id="busiClassName" value="${busiClassName}">
		<input type="hidden" id="formStatus" value="${formStatus}">

		<input type="hidden" id="jsonString" value="${jsonString}">
	</body>
</html>