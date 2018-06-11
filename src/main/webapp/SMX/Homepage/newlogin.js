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
/*	function toshare(){
		$.getJSON("CSMANAGER/ToSharAction.action","",function(data){
	    	var obj = jQuery.parseJSON(data); 
	    	if(obj.success) {
	    		window.location = "SMX/Homepage/mainFrame.jsp";
	    	}
	    	else {
	    		layer.msg('登入失败，请稍后再试！', { time: 0, btn:['确定'] });
    		}
	    });
	}*/
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
		$.getJSON("http://localhost/platform/security/checksetid",{"setid":setid},function(data){
	    	if(data.success) {
	    		//密码加盐
	    		password = stringToHex("a1b2c3x7y8z9" + password);
	    		var param = {
	    			"setid":setid,
	    			"loginname"	: usercode,
	    			"pwd" : password
	    		}
	    		//登入请求
	    		$.getJSON("http://localhost/platform/security/login",param,function(data){
	    			if(data.success){
	    				window.location = "SMX/Homepage/mainFrame.jsp";
	    			} else if(data.type == 10 || data.type == 11 || data.type == 12) {
	    				showmsg("账号或密码不正确！");
	    			} else {
	    				showmsg(data.msg+"!");
	    			}
	    		});
	    	} else {
	    		showmsg(data.msg);
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
		
		$.getJSON("http://localhost/platform/security/checksetid",{"setid":varsetid},function(data){
	    	if(data.success) {
				oldpwd = stringToHex("a1b2c3x7y8z9" + oldpwd);
				var newpwd = stringToHex("a1b2c3x7y8z9" + newpwd1);
				var param = {
					"setid":varsetid,
					"loginname"	: varcode,
					"oldpwd" : oldpwd,
					"newpwd" : newpwd
				}
				$.getJSON("http://localhost/platform/security/updatepassword",param,function(data){
					if(data.success){
						layer.alert('密码修改成功');
						$("#lg_popup_panel").css("display","none");
					} else if(data.type == 10 || data.type == 11 || data.type == 12) {
						layer.alert("账号或密码不正确！");
	    			} else {
	    				layer.alert(data.msg+"!");
	    			}
				});
	    	}
	    	else {
	    		layer.alert(data.msg);
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
//	//登入结果处理
//	function processVerifyLoginResult(result) {
//		if (result.error == 0) {
//			window.location = "SMX/Homepage/mainFrame.jsp";
//		}
//		else if (result.error == 1) {
//			showmsg("账号或密码不正确!");
//		}
//		else if(result.error == -2) {
//			showmsg(result.errDesc);
//		}
//		else {
//			showmsg("登入失败，请稍后再试！");
//		}
//	}
//	//修改密码结果处理
//	function processUpdatePasswordResult(result){
//		if (result.error == 0) {
//			layer.alert('密码修改成功');
//			$("#lg_popup_panel").css("display","none");
//		} else if (result.error == 1) {
//			layer.alert("账号或密码不正确!");
//		} else {
//			layer.alert(result.errDesc);
//		}
//	}
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