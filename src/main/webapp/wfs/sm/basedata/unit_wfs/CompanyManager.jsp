<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<HTML>
	<HEAD>
		<%@ include file="/wfs/gl/common/gl_all.jspf" %>

		<link rel="stylesheet" type="text/css" href="wfs/sm/basedata/resources/css/docs.css" />
		<link rel="stylesheet" type="text/css" href="wfs/sm/basedata/resources/css/MSG.css" />
		
		<script type='text/javascript' src='wfs/sm/basedata/unit_wfs/CompanyManager.js'></script>
		
		<script type='text/javascript' >Ext.BLANK_IMAGE_URL = 'resources/images/default/s.gif';</script>
		
		<STYLE type="text/css">
		.edit {
			background-image: url(resources/images/edit.gif) !important;
		}
		.x-panel-mc{background:url(wfs/sm/basedata/resources/images/test.png) no-repeat center top!important;}
		</STYLE>
		
	</HEAD>
	
	<BODY>
		<div id = "MsgBox"></div>
	    <div id = "MsgWaiting"></div>
	    <div id = "saveLoading"></div> 
		<input type="hidden" id="M8_COMPANYID" name="M8_COMPANYID" value='<%=request.getSession().getAttribute("M8_COMPANYID")%>' />
		<input type="hidden" id="M8_COMPANYNAME" name="M8_COMPANYNAME" value='<%=request.getSession().getAttribute("M8_COMPANYNAME")%>' />
	</BODY>
</HTML>
