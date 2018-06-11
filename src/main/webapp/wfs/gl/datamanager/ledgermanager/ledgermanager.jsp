<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<HTML>
	<HEAD>
		<%@ include file="/wfs/gl/common/gl_all.jspf" %>
		
		<script type="text/javascript" src="wfs/gl/datamanager/ledgermanager/ledgermanagermain.js"></script>
		<script type="text/javascript" src="wfs/gl/datamanager/ledgermanager/ledgeritemtree.js"></script>
		<script type="text/javascript" src="wfs/gl/datamanager/ledgermanager/ledgeritemwin.js"></script>
		<script type="text/javascript" src="wfs/gl/datamanager/ledgermanager/ledgertypetree.js"></script>
		<script type="text/javascript" src="wfs/gl/datamanager/ledgermanager/ledgertypewin.js"></script>
	</HEAD>
	<BODY>
		<input type="hidden" id="M8_COMPANYNAME" name="M8_COMPANYNAME" value='<%=request.getSession().getAttribute("M8_COMPANYNAME")%>' />
		<input type="hidden" id="M8_COMPANYID" name="M8_COMPANYID" value='<%=request.getSession().getAttribute("M8_COMPANYID")%>' />
	</BODY>
</HTML>