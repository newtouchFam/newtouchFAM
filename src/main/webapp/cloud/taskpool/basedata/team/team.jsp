<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ taglib prefix="s" uri="/struts-tags" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>  
<base href="<%= basePath %>">
<%@ include file="/SSC/core/common/ssc-common.jsp" %>

<script type="text/javascript" src="SSC/core/component/combobox/UnitComboBox.js"></script>
<script type="text/javascript" src="SSC/core/component/dialog/UserDialog.js"></script>
<script type="text/javascript" src="SSC/core/component/tgfield/UserTGField.js"></script>

<script type="text/javascript" src="SSC/core/taskpool/basedata/team/team_edit_win.js"></script>
<script type="text/javascript" src="SSC/core/taskpool/basedata/team/team_userproperty_win.js"></script>
<script type="text/javascript" src="SSC/core/taskpool/basedata/team/team.js"></script>

<title></title>
</head>

<body>
<s:hidden id="defaultMethodid" name="defaultMethodid"/>
</body>
</html>