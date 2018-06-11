<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<html>
<head>
<style type="text/css">
	.color table
	{
	 	color:Red;  //修改字体颜色
	 }
</style> 
<base href="<%=basePath%>" />
<meta http-equiv="x-ua-compatible" content="ie=6" /> 
<link rel="stylesheet" type="text/css"	href="ext/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="WfApp/upload/css/dhtmlXVault.css" />
<link rel="stylesheet" type="text/css" href="resources/css/commonFormMgrBar.css" />
<link rel="stylesheet" type="text/css" href="resources/css/ext-patch.css" />
<link rel="stylesheet" type="text/css" href="resources/css/m8-common.css" />
<link rel="stylesheet" type="text/css" href="resources/css/m8pcm-common.css" />
<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="ext/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="json/json.js"></script>
<script type="text/javascript" src="dwrjs/engine.js" ></script>
<script type="text/javascript" src="dwrjs/util.js" ></script>
<!-- 下面三个用于往来组件 -->
<script type="text/javascript" src="WfApp/scripts/Portal.js"></script>
<script type="text/javascript" src="WfApp/scripts/PortalColumn.js"></script>
<script type="text/javascript" src="WfApp/scripts/Portlet.js"></script>
<script type="text/javascript" src="WfApp/scripts/wfGlobal.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyGridSummary.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyCalcRecord.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyCategory.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyColumnModel.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyTree.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyComboBoxTree.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyComboBoxTreeEx.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyComboBoxEx.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyComboBox.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyGrid.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyGridUtil.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyGridEx.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyEditor.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyGridPanel.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyGridView.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyGridEditor.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyEditorGridPanel.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyMoneyField.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyGridSummary.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyFormat.js"></script>
<script type="text/javascript" src="WfApp/upload/xyWfUploadFile.js"></script>
<script type="text/javascript" src="scripts/ext-patch-TextField.js"></script>
<script type="text/javascript" src="scripts/exceptionutil.js"></script>
<script type="text/javascript" src="scripts/PageTool.js"></script>
<script type="text/javascript" src="wfs/gl/component/xyformat.js"></script>
<script type="text/javascript" src="wfs/gl/component/globalcomponent.js"></script>
<script type="text/javascript" src="wfs/gl/component/centerwindowplugin.js"></script>
<script type="text/javascript" src="wfs/gl/component/basegridselect.js"></script>
<script type="text/javascript" src="wfs/gl/component/basetreegridselect.js"></script>
<script type="text/javascript" src="wfs/gl/component/accountsel.js"></script>
<script type="text/javascript" src="wfs/gl/component/xycomboboxacext.js"></script>
<script type="text/javascript" src="wfs/gl/component/xychooseaccountex.js"></script>

<script type="text/javascript" src="wfs/gl/datamanager/accountsetmanager/accountsetmanagerinfo.js"></script>
<script type="text/javascript" src="wfs/gl/datamanager/accountsetmanager/accountsetmanageradd.js"></script>
<script type="text/javascript" src="wfs/gl/datamanager/accountsetmanager/accountsetmanager.js"></script>

</head>
<body>
<div id='maindiv'>
</div>
<input type="hidden" id="basePath" value="<%= basePath %>">
</body>
</html>