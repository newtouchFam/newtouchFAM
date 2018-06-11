<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
	<head>
		<title></title>
		<%@ include file="/cloud/common/common_meta_basepath.jspf" %>
		<%@ include file="/cloud/common/common_css_ext.jspf" %>
		<%@ include file="/cloud/common/common_js.jspf" %>	
		<%@ include file="/cloud/common/common_js_ext.jspf" %>
		<%@ include file="/cloud/common/common_component_ext.jspf" %>

	<script src="platform/home/top.js" type="text/javascript"></script>
	
	<link rel="stylesheet" type="text/css" href="themes/metro/easyui.css">
	<link rel="stylesheet" type="text/css" href="themes/icon.css">
	<script type="text/javascript" src="easyui/jquery.min.js"></script>
	<script type="text/javascript" src="easyui/jquery.easyui.min.js"></script>
	
<STYLE type="text/css">
	td
	{
		color: yellow;
		font-size: 9px
	}
	
	html, body
	{
		margin: 0;
		padding: 0;
		border: 0 none;
		overflow: hidden;
		height: 100%;
		width: 100%;
	}
	
	.l-btn-text{line-height:30px;}
	.l-btn{
		display:inline-block;border:none;color:#fff;background:none;
		text-shadow: 1px 1px 1px #333;outline:none;
		filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0); BORDER-LEFT: none;
	}
	.l-btn span{display:block;}
	.l-btn-focus{}
	.l-btn:hover{
		border:none;background:none;text-shadow:none;color:#f5f5f5;
	}
	.l-btn-focus .l-btn-text{
		background:#fff;margin-top:4px;line-height:25px;color:#333;text-shadow:none;border:1px solid #ccc;border-bottom:none;
		filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffffff,endColorstr=#ffffff,GradientType=0);
	}
</STYLE>
	</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" style="background-image: url(platform/resources/images/line5.jpg); background-repeat: repeat-x;">
	<tr>
		<td valign="bottom" style="padding-right: 12px;">
			<table width="100%" border="0" cellpadding="0" cellspacing="0">
				<tr>
					<td align="left" valign="top" style="background:url('platform/resources/images/img1.png') no-repeat;">
	                    <div style="font-size:24px;font-weight:bold;color:#144997;width:450px;height:55px;display:inline-block;line-height:55px;padding-left:270px;font-family:'Microsoft Yahei', '微软雅黑', Tahoma, serif;">财务核算</div>
	    			</td>
	
					<td align="left" valign="middle">
						<table>
							<tr>
								<td>
									<font color="#333" size="2" style="margin:0 15px;">
										<label style="width:60px;text-align:right;display:inline-block">单位：</label><span id="compName" for='compName' style="color:#144997;font-weight:bold;"></span>
									</font>
								</td>
								<td>
									<font color="#333" size="2" style="margin:0 15px;">
										<label style="width:60px;text-align:right;display:inline-block">用户：</label><span id="userName" for='userName' style="color:#144997;font-weight:bold;"></span>
									</font>
								</td>
							</tr>
							<tr>
								<td>
									<font color="#333" size="2" style="margin:0 15px;">
										<label style="width:60px;text-align:right;display:inline-block">账套：</label><span id="setId" for='setId' style="color:#144997;font-weight:bold;"></span>
									</font>
								</td>
								<td>
									<font color="#333" size="2" style="margin:0 15px;">
										<label style="width:60px;text-align:right;display:inline-block">会计期：</label><span id="period" for='period' style="color:#144997;font-weight:bold;"></span>
									</font>
								</td>
							</tr>
						</table>
					</td>
					<td width="37" align="left" valign="top"></td>
					<td width="40" align="left" valign="top"></td>
					<td width="40" align="left" valign="top">
						<a href="" onclick="javascript:logout()" target="_top">
							<div id="pngclose1">
								<img height='100%' src="platform/resources/images/close.png" />
							</div>
							<div id="pngclose2" class="x-hidden">
								<img height='100%' src="platform/resources/images/close-over.png" />
							</div>
						</a>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td valign="bottom">
			<table width="100%" cellpadding="0" cellspacing="0"
				style='background-image: url(SMX/resources/images/line.png);padding:0 10px;'>
				<tr>
					<td style="height:30px;">
						<div class="easyui-navpanel">
							<div>
								<div class="m-toolbar">
									<div class="m-title" id="tool">
									</div>
								</div>
							</div>
						</div>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
		<input type="hidden" id="M8_SETID" name="M8_SETID" value='<%=request.getSession().getAttribute("M8_SETID")%>' />
		<input type="hidden" id="M8_COMPANYNAME" name="M8_COMPANYNAME" value='<%=request.getSession().getAttribute("M8_COMPANYNAME")%>' />
		<input type="hidden" id="M8_USERNAME" name="M8_USERNAME" value='<%=request.getSession().getAttribute("M8_USERNAME")%>' />
		<input type="hidden" id="M8_USERCODE" name="M8_USERCODE" value='<%=request.getSession().getAttribute("M8_USERCODE")%>' />
		<input type="hidden" id="M8_COMPANYID" name="M8_COMPANYID" value='<%=request.getSession().getAttribute("M8_COMPANYID")%>' />
		<input type="hidden" id="M8_COMPANYCODE" name="M8_COMPANYCODE" value='<%=request.getSession().getAttribute("M8_COMPANYCODE")%>' />
		<input type="hidden" id="M8_USERID" name="M8_USERID" value='<%=request.getSession().getAttribute("M8_USERID")%>' />
	</body>
</html>

