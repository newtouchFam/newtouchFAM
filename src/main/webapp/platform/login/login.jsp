<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
	<head>
		<title>财务核算</title>
		<%@ include file="/cloud/common/common_meta_basepath.jspf" %>	
		<%@ include file="/cloud/common/common_css_jquery.jspf" %>
		<%@ include file="/cloud/common/common_js_jquery.jspf" %>

		<link rel="stylesheet" type="text/css" href="platform/resources/css/content-style.css" />
		<link rel="stylesheet" type="text/css" href="platform/resources/css/style-base.css" />
		
		<script type="text/javascript" src="platform/login/jplaceholder.js"></script>
		<script type="text/javascript" src="platform/login/login.js"></script>
		
		<script>
			jQuery(function()
			{
				JPlaceHolder.init();
			});
		</script>
	</head>

	<body class="lg_back">
		<input type="hidden" id="basePath" value="<%=basePath%>">
		<div class="lg_bg">
			<div class="lg_header">
				<div class="lg_header_box">
					<img class="fleft" src="platform/resources/images/lg_logo.png"
						alt="" />
					<h2 class="fleft">财务核算</h2>
					<!-- <h2 class="fleft" style="font-size: 12px;margin: 0 20px;color: #eee;">（定于xx月xx日xx点至xx点进行系统升级，届时系统将停用。）</h2> -->
					<div class="fright test_btn_box">
						<a href="JavaScript:tosharelogin()" id="test_share" class="test_share" > 快速体验</a>
						<a href="platform/login/register.jsp" id="test_personal"
							class="test_personal">试用申请</a>
					</div>
				</div>
			</div>
			<div class="lg_content clearfix">
				<div class="lg_left fleft"></div>
				<div class="lg_right fright">
					<div class="lg_box">
	
						<form action="">
							<label id="msg" style="color: red;"></label>
							<div style="overflow: hidden">
								<div class="lg_control zhangtao">
									<input id="setid" type="text" placeholder="账套号" />
								</div>
							</div>
							<div style="overflow: hidden">
								<div class="lg_control user">
									<input id="usercode" type="text" placeholder="账号" />
								</div>
							</div>
							<div style="overflow: hidden">
	
								<div class="lg_control pass">
									<input id="password" type="password" placeholder="密码" />
								</div>
							</div>
							<input type="button" class="us_btn lg_btn" value="登录"
								onclick="dologin()">
							<p class="clearfix">
								<a href="javascript:;" class="fleft" id="xg_pass">密码修改</a>
							</p>
						</form>
					</div>
				</div>
			</div>
			<div class="lg_bottom">
				<div class="tips" style="position: absolute;text-align: center;left: 0;width: 100%;height: 30px;font-size: 13px;color: #ff8a3d;line-height: 30px;top: -40px;">
				温馨提示：IE浏览器下,为了更好使用本系统，建议您使用IE10以上版本。
				</div>
				<div class="lg_footer">
					<p>© 2014-2018 Newtouch.com</p>
				</div>
			</div>
		</div>
	
		<!--弹出框-->
		<div class="lg_popup_panel" id="lg_popup_panel">
			<div class="lg_popup">
				<div class="popup_title">
					<span>密码修改</span>
				</div>
				<div class="popup_form">
					<form action="">
						<div class="popup_control">
							<div style="overflow: hidden">
								<div class="lg_control">
									<input id="varsetid" type="text" placeholder="账套号" />
								</div>
							</div>
							<p></p>
						</div>
						<div class="popup_control">
							<div style="overflow: hidden">
								<div class="lg_control">
									<input id="varcode" type="text" placeholder="账号" />
								</div>
							</div>
							<p></p>
						</div>
						<div class="popup_control">
							<div style="overflow: hidden">
								<div class="lg_control">
									<input id="oldpwd" type="password" placeholder="原密码" />
								</div>
							</div>
							<p></p>
						</div>
						<div class="popup_control">
							<div style="overflow: hidden">
								<div class="lg_control">
									<input id="newpwd1" type="password" placeholder="新密码" />
								</div>
							</div>
							<p></p>
						</div>
						<div class="popup_control">
							<div style="overflow: hidden">
								<div class="lg_control">
									<input id="newpwd2" type="password" placeholder="确认密码" />
								</div>
							</div>
							<p></p>
						</div>
						<div class="qr_btn">
							<input id="update_btn" type="button"
								class="us_btn lg_btn popup_btn" onclick="updatepwd()" value="确定">
							<input id="cancel_btn" type="button"
								class="us_btn lg_btn popup_btn" value="取消">
						</div>
					</form>
				</div>
			</div>
			<div class="lg_popup_shade"></div>
		</div>
	</body>
</html>