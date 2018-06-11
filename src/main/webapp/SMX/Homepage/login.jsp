<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<base id="baseID" href="<%= basePath %>">
    <title>新致财务核算专家</title>
    <link rel="stylesheet" type="text/css" href="SMX/Homepage/css/content-style.css"/>
    <link rel="stylesheet" type="text/css" href="SMX/Homepage/css/style-base.css"/>
    
    <script type="text/javascript" src="SMX/Homepage/js/jquery-1.11.2.min.js"></script>
    <script type="text/javascript" src="SMX/Homepage/js/layer.js"></script>
    <script type="text/javascript" src="SMX/Homepage/js/jquery.cookie.js"></script>
    <script type="text/javascript" src="SMX/Homepage/newlogin.js"></script>
<% 
	String hostName = request.getRemoteHost();
	String hostIp = request.getRemoteAddr();
 %>
     <script>
        /*
         * jQuery placeholder, fix for IE6,7,8,9
         * @author JENA
         * @since 20131115.1504
         * @website ishere.cn
         */
        var JPlaceHolder = {
            //检测
            _check : function(){
                return 'placeholder' in document.createElement('input');
            },
            //初始化
            init : function(){
                if(!this._check()){
                    this.fix();
                }
            },
            //修复
            fix : function(){
                jQuery(':input[placeholder]').each(function(index, element) {
                    var self = $(this), txt = self.attr('placeholder');
                    self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
                    var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
                    var holder = $('<span></span>').text(txt).css({position:'absolute','line-height':h + 'px', left:pos.left, top:pos.top, height:h,  paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
                    self.focusin(function(e) {
                        holder.hide();
                    }).focusout(function(e) {
                        if(!self.val()){
                            holder.show();
                        }
                    });
                    holder.click(function(e) {
                        holder.hide();
                        self.focus();
                    });
                });
            }
        };
        //执行
        jQuery(function(){
            JPlaceHolder.init();
        });
    </script>
</head>

<body class="lg_back">
<input type="hidden" id="basePath" value="<%= basePath %>">
<input type="hidden" id="hostName" value="<%= hostName %>">
<input type="hidden" id="hostIp" value="<%= hostIp %>">
<div class="lg_bg">
    <!--<div class="lg_bg"></div>-->
    <div class="lg_header">
        <div class="lg_header_box">
            <img class="fleft" src="SMX/Homepage/img/lg_logo.png" alt=""/>
            <h2 class="fleft">新致财务核算专家</h2>

            <div class="fright test_btn_box">
                <a href="JavaScript:toshare()" id="test_share" class="test_share">快速体验</a>
                <a href="SMX/Homepage/regTest.jsp" id="test_personal" class="test_personal">试用申请</a>
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
	                
	                    <div class="lg_control zhangtao" >
	                        <input id="setid" type="text" placeholder="账套号"/>
	                    </div>
	                </div>
	                <div style="overflow: hidden">
		                
	                    <div class="lg_control user">
	                        <input id="usercode" type="text" placeholder="账号"/>
	                    </div>
                    </div>
                    <div style="overflow: hidden">
	                    
	                    <div class="lg_control pass">
	                        <input id="password" type="password" placeholder="密码"/>
	                    </div>
                    </div>
                    <!--<div class="lg_infor" style="padding: 10px 0;">
                        <label for="check"><input type="checkbox" id="check" style="vertical-align: middle;margin-top: -2px;"/> 记住密码</label>
                    </div>-->
                    <!--<button class="us_btn lg_btn">登录</button>-->
                    <input type="button" class="us_btn lg_btn" value="登录" onclick="dologin()">
                    <p class="clearfix">
                        <a href="javascript:;" class="fleft" id="xg_pass">密码修改</a>
                        <!--<a href="" class="fright">立即注册</a>-->
                        <!--账套  用户名 原密码  新密码 确认密码-->
                    </p>
                </form>
            </div>
        </div>
    </div>
    <div class="lg_bottom">
        <!--<div class="lg_footer_bg"></div>-->
        <!--<div style="background: #fafafa;height: 30px;"></div>-->
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
                        <!-- <label for="" class="fleft">账套号</label> -->
                        <div class="lg_control">
                            <input id="varsetid" type="text" placeholder="账套号"/>
                        </div>
                    </div>
                    <p></p>
                </div>
                <div class="popup_control">
                    <div style="overflow: hidden">
                        <!-- <label for="" class="fleft">账号</label> -->
                        <div class="lg_control">
                            <input id="varcode" type="text" placeholder="账号"/>
                        </div>
                    </div>
                    <p></p>
                </div>
                <div class="popup_control">
                    <div style="overflow: hidden">
                        <!-- <label for="" class="fleft">原密码</label> -->
                        <div class="lg_control">
                            <input id="oldpwd" type="password" placeholder="原密码"/>
                        </div>
                    </div>
                    <p></p>
                </div>
                <div class="popup_control">
                    <div style="overflow: hidden">
                        <!-- <label for="" class="fleft">新密码</label> -->
                        <div class="lg_control">
                            <input id="newpwd1" type="password" placeholder="新密码"/>
                        </div>
                    </div>
                    <p></p>
                </div>
                <div class="popup_control">
                    <div style="overflow: hidden">
                        <!-- <label for="" class="fleft">确认密码</label> -->
                        <div class="lg_control">
                            <input id="newpwd2" type="password" placeholder="确认密码"/>
                        </div>
                    </div>
                    <p></p>
                </div>
                <div class="qr_btn">
                    <input id="update_btn" type="button" class="us_btn lg_btn popup_btn" onclick="updatepwd()" value="确定">
                    <input id="cancel_btn" type="button" class="us_btn lg_btn popup_btn" value="取消">
                </div>
            </form>
        </div>
    </div>
    <div class="lg_popup_shade"></div>
</div>
  
</body>
</html>
<!-- <script type="text/javascript">
	$(function () {
		//获取cookie信息并填充到文本框
		$('#setid').val($.cookie('setid'));
		$('#usercode').val($.cookie('usercode'));
		$('#password').val($.cookie('password')); 
		
	    $("#xg_pass").click(function () {
	        $("#lg_popup_panel").css("display","block");
	        //将用户信息带到修改界面
	        var setid = $("#setid").val();
			var usercode = $("#usercode").val();
			$('#varsetid').val(setid);
			$('#varcode').val(usercode);
	    })
	    
	    $("#cancel_btn").click(function () {
	        $("#lg_popup_panel").css("display","none");
	    })
	    
	  //绑定回车事件
	  $("#setid").keydown(function(event){  
		    if(event.which == "13"){
		    	$("#usercode").focus();
		    }
		});
	    
	    $("#usercode").keydown(function(event){  
		    if(event.which == "13"){
		    	$("#password").focus();
		    }
		});
	    
		$("#password").keydown(function(event){  
		    if(event.which == "13")    
		    	dologin();
		});  
		 
		// 失去焦点  
		$("#setid").blur(function(){
			var setid = $("#setid").val();
			if(setid!=""){
				showmsg("");
			}
		});
		$("#usercode").blur(function(){
			var usercode = $("#usercode").val();
			if(usercode!=""){
				showmsg("");
			}
		});
	})
	//快速体验登入方法
	function toshare(){
		$.getJSON("CSMANAGER/ToSharAction.action","",function(data){
	    	var obj = jQuery.parseJSON(data); 
	    	if(obj.success) {
	    		window.location = "SMX/Homepage/mainFrame.jsp";
	    	}
	    	else {
	    		layer.msg('登入失败，请稍后再试！', { time: 0, btn:['确定'] });
    		}
	    });
	}
	//正常登入方法
	function dologin(){
		var basePath = $("#basePath").val();
		var setid = $("#setid").val();
		var usercode = $("#usercode").val();
		var password = $("#password").val();
		
		if(setid==""){
			showmsg("请输入账套号！");
			$("#setid").focus();
			return false;
		}
		if(usercode==""){
			showmsg("请输入账号！");
			$("#usercode").focus();
			return false;
		}
		savecookies(setid,usercode,password);
		//先检查账套
		$.getJSON("CSMANAGER/CheckSetID.action",{"SetID":setid},function(data){
	    	var obj = jQuery.parseJSON(data); 
	    	if(obj.success) {
	    		password = stringToHex("a1b2c3x7y8z9" + password);
	    		try {
	    			AuthProxy.verifyLogin(basePath, usercode, password, setid, "", "001",
    					{
    						callback : processVerifyLoginResult,
    						async : true
    					});
	    		}
	    		catch (ex) {
	    			alert(ex);
	    		}
	    	} else {
	    		showmsg(obj.msg);
	    		return false;
    		}
	    });
		return true;
	}
	//修改密码方法
	function updatepwd(){
		var basePath = $("#basePath").val();
		var varsetid = $("#varsetid").val();
		var varcode = $("#varcode").val();
		var oldpwd = $("#oldpwd").val();
		var newpwd1 = $("#newpwd1").val();
		var newpwd2 = $("#newpwd2").val();
		if (varsetid == "") {
			layer.alert('请输入账套号！');
			return false;
		}
		if (varcode == "") {
			layer.alert('请输入账号！');
			return false;
		}
		if (newpwd1 != newpwd2) {
			layer.alert('确认密码和新密码不一致！');
			return false;
		}
		
		$.getJSON("CSMANAGER/CheckSetID.action",{"SetID":varsetid},function(data){
	    	var obj = jQuery.parseJSON(data);
	    	if(obj.success) {
	    		try {
	    			AuthProxy.updatePassword(varcode, oldpwd, newpwd1, varsetid, "", {
	    						callback : processUpdatePasswordResult,
	    						async : true
	    					});
	    		}
	    		catch (ex) {
	    			layer.alert(ex);
	    		}
	    	}
	    	else {
	    		layer.alert(obj.msg);
	    		return false;
    		}
	    });
	}
	//密码加盐方法
	function stringToHex(str) {
		var val = "";
		for ( var i = 0; i < str.length; i++) {
			if (val == "")
				val = str.charCodeAt(i).toString(16);
			else
				val += str.charCodeAt(i).toString(16);
		}
		return val;
	} 
	//登入结果处理
	function processVerifyLoginResult(result) {
		if (result.error == 0) {
			window.location = "SMX/Homepage/mainFrame.jsp";
		}
		else if (result.error == 1) {
			showmsg("账号或密码不正确!");
		}
		else if(result.error == -2) {
			showmsg(result.errDesc);
		}
		else  {
			showmsg("登入失败，请稍后再试！");
		}
	}
	//修改密码结果处理
	function processUpdatePasswordResult(result){
		if (result.error == 0) {
			layer.alert('密码修改成功');
			$("#lg_popup_panel").css("display","none");
		} else if (result.error == 1) {
			layer.alert("账号或密码不正确!");
		} else {
			layer.alert(result.errDesc);
		}
	}
	//提示信息显示
	function showmsg(msg){
		$("#msg").empty();
		$("#msg").html(msg);
	}
	//保存cookie方法
	function savecookies(setid,usercode,password){
		$.cookie("setid", setid, { expires: 7 });
		$.cookie("usercode", usercode, { expires: 7 });
		$.cookie("password", password, { expires: 7 });
	}
	
</script> -->