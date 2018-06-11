<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<HTML>
	<HEAD>
		<%@ include file="/wfs/gl/common/gl_all.jspf" %>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/ledger/ledgertabpanelbase.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/ledger/ledgergroupbase.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/ledger/detail.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/ledger/ledger.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/ledger/ledgerinfo.js"></script>
		<!--往来核销人工匹配引入-->
	    <script type="text/javascript" src="wfs/gl/offsetmanager/currentoffset/manualdetailpanel.js"></script>
	    <script type="text/javascript" src="wfs/gl/offsetmanager/currentoffset/manualmachewin.js"></script>
	    <!--往来核销初始化明细查看引入  -->
	    <script type="text/javascript" src="wfs/gl/offsetmanager/currentoffset/initdetail.js"></script>
    	
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/voucherform.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/voucherlabel.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/voucherdetail.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/vouchercenter.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/vouchermain.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/vouchermakedetail.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/voucherprint.js"></script>
		<script type="text/javascript" src="wfs/gl/vouchermanager/vouchermake/vouchermake.js"></script>
	</HEAD>
<body>
<div id='maindiv'>
</div>
<input type="hidden" id="basePath" value="<%= basePath %>">
</body>
</html>