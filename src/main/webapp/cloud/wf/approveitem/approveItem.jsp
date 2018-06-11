<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="s" uri="/struts-tags" %>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
//如果是https协议，则去掉端口号
if ( request.getScheme().equalsIgnoreCase("https") ) 
	basePath = request.getScheme() + "://" + request.getServerName() + request.getContextPath()+"/";
%>
<HTML>
	<HEAD>
		<base href="<%=basePath%>"/>
		<jsp:include page="/SSC/cup/common/form_common.jsp"></jsp:include>
		<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="resources/css/m8-common.css" />
		<link rel="stylesheet" type="text/css" href="resources/css/ext-patch.css" />
		<link rel="stylesheet" type="text/css" href="WfApp/resources/css/approveItem.css"/>
		<link rel="stylesheet" type="text/css" href="SSC/cup/component/rowactions/Ext.ux.grid.RowActions.css"/>
		<link rel="stylesheet" type="text/css" href="WfMgr/resources/css/wfmgr_processinst.css" />
		<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="ext/ext-all.js"></script>
        <script type="text/javascript" src="ext/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="dwrjs/engine.js" ></script>
		<script type="text/javascript" src="dwrjs/util.js" ></script>		
        <script type="text/javascript" src="SSC/cup/component/rowactions/Ext.ux.grid.RowActions.js"></script>
        <script type="text/javascript" src="WfApp/businessComponent/XyCalcRecord.js"></script>
		<script type="text/javascript" src="WfApp/scripts/exception.js"></script>
		<script type="text/javascript" src="WfApp/scripts/wfGlobal.js"></script>
		<script type="text/javascript" src="WfApp/approveItem/filterWin.js"></script>
		<script type="text/javascript" src="WfApp/formManager/showTransImg.js"></script>
		<script type="text/javascript" src="WfApp/formManager/showCheckHistory.js"></script>
		<script type="text/javascript" src="WfApp/newItem/RowExpander.js"></script>
		<script type="text/javascript" src="WfApp/scripts/SearchField.js"></script>
		<script type="text/javascript" src="WfApp/scripts/wfengine/wfwebui.js"></script>
<!--
		<script type="text/javascript" src="WfApp/WorkItemTransformService.js"></script>
		<script type="text/javascript" src="WfApp/WorkItemTransmitService.js"></script>
		<script type="text/javascript" src="WfApp/WorkItemDeleteService.js"></script>
-->
		<script type="text/javascript" src="WfApp/dwrcallutil.js"></script>
		<script type="text/javascript" src="WfApp/WorkItemTransformServiceEx.js"></script>
		<script type="text/javascript" src="WfApp/WorkItemTransmitServiceEx.js"></script>
		<script type="text/javascript" src="WfApp/WorkItemDeleteServiceEx.js"></script>

		<script type="text/javascript" src="WfApp/businessComponent/XyComboBoxTree.js"></script>
		<script type="text/javascript" src="WfApp/businessComponent/XyTopGrid.js"></script>
		<script type="text/javascript" src="WfApp/businessComponent/XyTopTree.js"></script>
		<script type="text/javascript" src="WfApp/businessComponent/XyFormat.js"></script>
		<script type="text/javascript" src="SSC/component/DraftTemplate/TemplateEditForm.js"></script>
		<script type="text/javascript" src="SSC/component/DraftTemplate/TemplateAddForm.js"></script>
		<script type="text/javascript" src="SSC/component/DraftTemplate/Service.js"></script>
		<script type="text/javascript" src="gl/core/voucher/voucherprocess/VoucherOpen.js"></script>
		<script type="text/javascript" src="WfMgr/processinstMgr/processChartWin.js"></script>
		<script type="text/javascript" src="WfMgr/scripts/ScriptLoader.js"></script>
		<script type="text/javascript" src="WfMgr/scripts/WfMgrGlobal.js"></script>
		<script type="text/javascript" src="WfMgr/common/freesky.ssc.wfmgr.common.services.js"></script>
		<script type="text/javascript" src="WfMgr/common/freesky.ssc.wfmgr.common.winTriggerField.js"></script>
		<script type="text/javascript" src="WfMgr/common/freesky.ssc.wfmgr.common.comboTree.js"></script>
		<script type="text/javascript" src="WfMgr/processinstMgr/companyTrigger.js"></script>
		<script type="text/javascript" src="WfMgr/processinstMgr/checkHistoryWin.js"></script>
		<script type="text/javascript" src="WfMgr/processinstMgr/processChartWin.js"></script>
		<script type="text/javascript" src="WfMgr/processinstMgr/activityInstWin.js"></script>
		<script type="text/javascript" src="WfMgr/processinstMgr/workDataWin.js"></script>
		<script type="text/javascript" src="WfMgr/processinstMgr/processInstMgrGrid.js"></script>
		<script type="text/javascript" src="WfApp/approveItem/approveItem.js"></script>
		<script type="text/javascript" src="WfApp/formManager/showEbsHistoryWindow.js"></script>
	</HEAD>
	<BODY>	
		<DIV id="div1" height="100%" width="100%"></DIV>
		<s:hidden id="userID" name="userID"/>
		<s:hidden id="applyUser" name="applyUser"></s:hidden>
		<s:hidden id="compID" name="compID"/>
		<s:hidden id="deptID" name="deptID"/>
		<s:hidden id="beginDate" name="beginDate"/>
		<s:hidden id="endDate" name="endDate"/>
		<s:hidden id="isM8WorkList" name="isM8WorkList"></s:hidden>
		<input type="hidden" id="basePath" value="<%= basePath %>">
		<input type="hidden" id="path" name="path" value='<%=path%>' />
	</BODY>
</HTML>
