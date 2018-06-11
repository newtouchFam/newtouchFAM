<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>  
<base href="<%= basePath %>">
<%@ include file="/SSC/core/common/ssc-common.jsp" %>

<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="resources/css/m8-common.css" />
<link rel="stylesheet" type="text/css" href="resources/css/m8pcm-common.css" />
<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="BCM/scripts/render.js"></script>
<script type="text/javascript" src="BCM/scripts/exception.js"></script>
<script type="text/javascript" src="BCM/scripts/common.js"></script>

<script type="text/javascript" src="BCM/common/com.freesky.ssc.bcm.common.ComboFilterTree.js"></script>
<script type="text/javascript" src="BCM/common/com.freesky.ssc.bcm.common.CaseYearCombo.js"></script>
<!--
<script type="text/javascript" src="BCM/common/com.freesky.ssc.bcm.common.CtrlAttrCombo.js"></script>
<script type="text/javascript" src="BCM/common/com.freesky.ssc.bcm.common.CtrlPeriodCombo.js"></script>
<script type="text/javascript" src="BCM/common/com.freesky.ssc.bcm.common.YesNoCombo.js"></script>
<script type="text/javascript" src="BCM/common/com.freesky.ssc.bcm.common.CtrlTypeCombo.js"></script>
-->

<script type="text/javascript" src="cloud/bcm/config/caseunitconfig/caseunitconfig.js"></script>
<title></title>
</head>

<body>

</body>
</html>