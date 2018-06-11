<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setDateHeader("Expires", 0);
	//如果是https协议，则去掉端口号
	if ( request.getScheme().equalsIgnoreCase("https") ) 
		basePath = request.getScheme() + "://" + request.getServerName() + request.getContextPath()+"/";

%>
<base href="<%=basePath%>">
<link rel="stylesheet" type="text/css"
	href="ext/resources/css/ext-all.css" />
<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="dwrjs/engine.js"></script>
<script type="text/javascript" src="SMX/Homepage/AuthProxy.js"></script>
<script src="SMX/Homepage/top.js" type="text/javascript"></script>


<STYLE type="text/css">
td {
	color: yellow;
	font-size: 9px
}

html,body {
	margin: 0;
	padding: 0;
	border: 0 none;
	overflow: hidden;
	height: 100%;
	width: 100%;
}
</STYLE>
<script>
	
</script>
</head>
<body>
<!--  <img border='0' src='resources/images/logo.png' width='100%' height='100%' style='position:absolute;z-index:-1'> 
        <table  border="0" >
			<tbody>
                <tr height="40"></tr>
                <tr>
                    <td  align="right" width="400"  style="font-size:small"> 
                                                               账套号：<label id="setId" for='setId'></label>&nbsp;&nbsp;&nbsp;
					</td>
					<td  align="left"  width="300" style="font-size:small" >
					          单位：<label id="compName" for='compName'></label>
					</td>
                    <td  align="center" width="300" style="font-size:small" >
                                                                用户: <label id="userName" for='userName'></label>
                    </td>
				</tr> 
				
			</tbody>
		</table>-->

<table width="100%" cellpadding="0" cellspacing="0"
	style="background-image: url(SMX/resources/images/line5.jpg); background-repeat: repeat-x;">
	<tr>
		<td valign="bottom" style="padding-right: 12px;">
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
			<tr>
				<td align="left" valign="top"><img height='100%'
					src="SMX/resources/images/img1.png" /></td>

				<td align="left" valign="bottom"><font color="white" size="2">账套号：<label
					id="setId" for='setId'></label></font> <br />
				<font color="white" size="2">单位：<label id="compName"
					for='compName'></label></font> <br />
				<font color="white" size="2">用户：<label id="userName"
					for='userName'></label></font></td>				
			</tr>
		</table>
		</td>
	</tr>
	<tr>
		<td valign="bottom">
		<table width="100%" cellpadding="0" cellspacing="0"
			style='background-image: url(SMX/resources/images/line.png)'>
			<tr>
				<td valign="top"></td>
				<td width="100%">
				<div id="header" style="height: 35px;"></div>

				</td>

			</tr>
		</table>
		</td>
	</tr>
</table>
<input type="hidden" id="M8_SETID" name="M8_SETID"
	value='<%=request.getSession().getAttribute("M8_SETID")%>' />
<input type="hidden" id="M8_COMPANYNAME" name="M8_COMPANYNAME"
	value='<%=request.getSession().getAttribute("M8_COMPANYNAME")%>' />
<input type="hidden" id="M8_USERNAME" name="M8_USERNAME"
	value='<%=request.getSession().getAttribute("M8_USERNAME")%>' />

<input type="hidden" id="M8_USERCODE" name="M8_USERCODE"
	value='<%=request.getSession().getAttribute("M8_USERCODE")%>' />
<input type="hidden" id="M8_COMPANYID" name="M8_COMPANYID"
	value='<%=request.getSession().getAttribute("M8_COMPANYID")%>' />
<input type="hidden" id="M8_COMPANYCODE" name="M8_COMPANYCODE"
	value='<%=request.getSession().getAttribute("M8_COMPANYCODE")%>' />

<input type="hidden" id="M8_USERID" name="M8_USERID"
    value='<%=request.getSession().getAttribute("M8_USERID")%>' />

</body>
</html>