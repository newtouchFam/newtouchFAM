<%--
  Created by IntelliJ IDEA.
  User: zhaodongchao
  Date: 2017/10/9
  Time: 17:23
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
	<style type="text/css">
		.x-window-tbar {
			width : 101% !important;
		}
		.x-panel-bc {
			height : 0px !important;
		}	
	</style>
    <%@ include file="/wfs/gl/common/gl_all.jspf" %>
    
    <!-- 往来明细相关页面导入 -->
    <script type="text/javascript" src="wfs/gl/offsetmanager/offsetquery/offsetdetailquery.js"></script>
    <script type="text/javascript" src="wfs/gl/offsetmanager/offsetquery/offsetdetailinfo.js"></script>
    
    <!--往来核销主脚本引入-->
    <script type="text/javascript" src="wfs/gl/offsetmanager/currentoffset/manualdetailpanel.js"></script>
    <script type="text/javascript" src="wfs/gl/offsetmanager/currentoffset/manualmachewin.js"></script>
    <script type="text/javascript" src="wfs/gl/offsetmanager/currentoffset/conditionpanel.js"></script>
    <script type="text/javascript" src="wfs/gl/offsetmanager/currentoffset/offsetpanel.js"></script>
    <script type="text/javascript" src="wfs/gl/offsetmanager/currentoffset/onaccountpanel.js"></script>
    <script type="text/javascript" src="wfs/gl/offsetmanager/currentoffset/initdetail.js"></script>
    
    <!--分户相关页面引入-->
    <script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/ledger/ledgertabpanelbase.js"></script>
    <script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/ledger/ledgergroupbase.js"></script>
    <script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/ledger/detail.js"></script>
    <script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/ledger/ledger.js"></script>
    <script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/ledger/ledgerinfo.js"></script>
    <!--凭证查看相关页面引入-->
    <script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/voucherform.js"></script>
    <script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/voucherlabel.js"></script>
    <script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/voucherdetail.js"></script>
    <script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/vouchercenter.js"></script>
    <script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/vouchermain.js"></script>

    <script type="text/javascript" src="wfs/gl/offsetmanager/currentoffset/currentoffset.js"></script>
    
</head>
<body>
<div id='maindiv'>
</div>
</body>
</html>
