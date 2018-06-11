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
<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />

<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="SMX/Homepage/AuthProxy.js"></script>
<script type="text/javascript" src="WfApp/reimbursementGuideUpload/reimbursementGuideUpload.js"></script>
<script type="text/javascript" src="SSC/zj/component/rowactions/Ext.ux.grid.RowActions.js"></script>
<script type="text/javascript" src="WfApp/businessComponent/XyCalcRecord.js"></script>
<script type="text/javascript" src="SSC/zj/form/reimbursement/callbackservice.js"></script>
<script type="text/javascript" src="js/jquery-1.11.2.min.js"></script>

<script src="SMX/Homepage/top.js" type="text/javascript"></script>

	<!--引入easyui-->
	<link rel="stylesheet" type="text/css" href="themes/metro/easyui.css">
	<link rel="stylesheet" type="text/css" href="themes/icon.css">
	<script type="text/javascript" src="easyui/jquery.min.js"></script>
	<script type="text/javascript" src="easyui/jquery.easyui.min.js"></script>

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
<script>
$(function(){
	$(".l-btn").click(function(){
		$(this).addClass("l-btn-focus").siblings().removeClass("l-btn-focus");
	})
})
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
				<td align="left" valign="top" style="background:url('SMX/resources/images/img1.png') no-repeat;">
    <!--<img height='100%'src="SMX/resources/images/img1.png" />-->
                    <div style="font-size:24px;font-weight:bold;color:#144997;width:450px;height:55px;display:inline-block;line-height:55px;padding-left:200px;font-family:'Microsoft Yahei', '微软雅黑', Tahoma, serif;">新致财务核算专家</div>
    </td>

				<td align="left" valign="middle">
				<!-- <font color="#333" size="2" style="margin:0 15px;">
						单位：<label id="compName" for='compName' style="color:#144997;font-weight:bold;"></label>
					</font>
					<font color="#333" size="2" style="margin:0 15px;">
						用户：<label id="userName" for='userName' style="color:#144997;font-weight:bold;"></label>
					</font>
					<br/>
					<font color="#333" size="2" style="margin:0 15px;">
						账套：<label id="setId" for='setId' style="color:#144997;font-weight:bold;"></label>
					</font>
					<font color="#333" size="2" style="margin:0 15px;">
						会计期：<label id="period" for='period' style="color:#144997;font-weight:bold;"></label>
					</font>
				 -->
				
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
					<!--
			    <td width="75" align="right" valign="bottom" style='padding-top:29px;'><a href="#" style='text-decoration:none'
					onclick="javascript:downLoad();return false;" ><font style='font-size:12px;color:#'>报账指南下载</font>
				</a>
				</td> -->
				<td width="37" align="left" valign="top">
        <!--<img height='100%'
    src="SMX/resources/images/img2.png" />-->
    </td>
				<td width="40" align="left" valign="top"><a href="#"
					onclick="javascript:downLoad();return false;" >
				<td width="40" align="left" valign="top"><a
					href="" onclick="javascript:logout()" target="_top">
				<div id="pngclose1"><img height='100%'
					src="SMX/resources/images/close.png" /></div>
				<div id="pngclose2" class="x-hidden"><img height='100%'
					src="SMX/resources/images/close-over.png" /></div>
				</a></td>

			</tr>
		</table>
		</td>
	</tr>
	  <tr>
		<td valign="bottom">
		<table width="100%" cellpadding="0" cellspacing="0"
			style='background-image: url(SMX/resources/images/line.png);padding:0 10px;'>
			<tr>
				<!--
				<td valign="top"></td>
				<td width="100%"><div id="header" style="height: 35px;"></div></td>-->
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
<script type="text/javascript">
	$(function () {
		$.getJSON("menu/menutree",{"node":"LeftButton_M8"},function(data)
		{
			var str = "";
			str += "<a href='javascript:button()' class='easyui-linkbutton l-btn l-btn-small' data-options='' style='width:70px'><span class='l-btn-left' style=\"margin-top: 0px;\"><span class=\"l-btn-text\">首页</span></span></a>";
			$.each(data,function(index,value)
			{
				str+= "<a href='javascript:click(\""+value.id+"\")' class='easyui-linkbutton l-btn l-btn-small' data-options='' style='width:70px'><span class='l-btn-left' style=\"margin-top: 0px;\"><span class=\"l-btn-text\">"+value.text+"</span></span></a> "
			});
			$("#tool").html(str.toString());
			$("#tool a").click(function(){
				$(this).addClass("l-btn-focus").siblings().removeClass("l-btn-focus");
			})
		});
	})

	function click(node) {			
		window.parent.loadTree(node);
	}
	
	function button() {
		window.parent.addmain();
	}
	function logout() {
		$.getJSON("http://localhost/platform/security/logout",function(data){
			if(data.success){
				history.back(-1);
			}
		});
	}
</script>