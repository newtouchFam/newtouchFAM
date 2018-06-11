<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>  
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
//如果是https协议，则去掉端口号
if ( request.getScheme().equalsIgnoreCase("https") ) 
	basePath = request.getScheme() + "://" + request.getServerName() + request.getContextPath()+"/";
%>
<base href="<%= basePath %>">
<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="resources/css/m8-common.css" />
<link rel="stylesheet" type="text/css" href="resources/css/ext-patch.css" />
<link rel="stylesheet" type="text/css" href="SMX/resources/css/portal.css" />
<link rel="stylesheet" type="text/css" href="SSC/zj/component/rowactions/Ext.ux.grid.RowActions.css"/>
<link rel="stylesheet" type="text/css" href="WfMgr/resources/css/wfmgr_processinst.css" />



<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="ext/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="json/json.js"></script>
<script type="text/javascript" src="SSC/scripts/GUIDTwoUtils.js"></script>
<script type="text/javascript" src="SSC/scripts/GUIDUtil.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyCalcRecord.js"></script>
<script type="text/javascript" src="WfApp/scripts/exception.js"></script>
<script type="text/javascript" src="WfApp/scripts/wfGlobal.js"></script>
<script type="text/javascript" src="SMX/scripts/Portal.js"></script>
<script type="text/javascript" src="SMX/scripts/PortalColumn.js"></script>
<script type="text/javascript" src="SMX/scripts/Portlet.js"></script>
<script type="text/javascript" src="WfMgr/scripts/WfMgrGlobal.js"></script>
<script type="text/javascript" src="WfMgr/common/freesky.ssc.wfmgr.common.services.js"></script>
<script type='text/javascript' src="SSC/core/component/PageSizePlugin.js"></script>
<script type='text/javascript' src="SSC/core/component/BasePagingToolBar.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyFormat.js"></script>
<script type="text/javascript" src="SMX/Homepage/welcome.js"></script>
<script type="text/javascript" src="SMX/Homepage/FirstPageApprove.js"></script>
<script type="text/javascript" src="SMX/Homepage/Bulletfirstpage.js"></script>
<script type="text/javascript" src="SMX/Homepage/NewBulletfirstpage.js"></script>
<script type="text/javascript" src="SSC/zj/component/rowactions/Ext.ux.grid.RowActions.js"></script>
<STYLE type="text/css">
html, body {
    margin:0;
    padding:0;
    border:0 none;
    overflow:hidden;
    height:100%;
    width:100%;
}
</STYLE>
</head>
<body>
<input type="hidden" id="basePath" value="<%= basePath %>">
<input type="hidden" id="path" name="path" value='<%=path%>' />
<input type="hidden" id="M8_USERID" name="M8_USERID"
       value='<%=request.getSession().getAttribute("M8_USERID")%>' />

</body>
</html>