<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<HTML>
	<HEAD>
		<%@ include file="/wfs/gl/common/gl_all.jspf" %>
		
		<script type="text/javascript" src="wfs/gl/datamanager/initledgeperiod/initledgeperiod.js"></script>
		<script type="text/javascript" src="wfs/gl/datamanager/initledgeperiod/initledgeperiodwin.js"></script>
	</HEAD>
<BODY>
	<input type="hidden" id="userID" name="userID" value='<%= session.getAttribute("M8_USERID")==null ? "" : session.getAttribute("M8_USERID").toString()%>' />
	<input type="hidden" id="companyid" name="companyid" value='<%= session.getAttribute("M8_COMPANYID")==null ? "" : session.getAttribute("M8_COMPANYID").toString()%>' />
	<input type="hidden" id="companyname" name="companyname" value='<%= session.getAttribute("M8_COMPANYNAME")==null ? "" : session.getAttribute("M8_COMPANYNAME").toString()%>' />
</BODY>
</HTML>