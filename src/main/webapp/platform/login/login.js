$(function()
{
	/* 获取cookie信息并填充到文本框 */
	$('#setid').val($.cookie('setid'));
	$('#usercode').val($.cookie('usercode'));
	$('#password').val($.cookie('password'));

	$("#xg_pass").click(function()
	{
		$("#lg_popup_panel").css("display", "block");
		// 将用户信息带到修改界面
        var setid = $("#setid").val();
		var usercode = $("#usercode").val();
		$('#varsetid').val(setid);
		$('#varcode').val(usercode);
	})

	$("#cancel_btn").click(function()
	{
		$("#lg_popup_panel").css("display", "none");
	})

	/* 回车事件 */
	$("#setid").keydown(function(event)
	{  
	    if(event.which == "13")
	    {
	    	$("#usercode").focus();
	    }
	});
	
	$("#usercode").keydown(function(event)
	{
		if (event.which == "13")
		{
			$("#password").focus();
		}
	});

	$("#password").keydown(function(event)
	{
		if (event.which == "13") dologin();
	});

	/* 失去焦点事件 */
	$("#setid").blur(function()
	{
		var setid = $("#setid").val();
		if(setid!="")
		{
			showmsg("");
		}
	});
	
	$("#usercode").blur(function()
	{
		var usercode = $("#usercode").val();
		if (usercode != "")
		{
			showmsg("");
		}
	});
})

/**
 * 登录
 * @returns {Boolean}
 */
function dologin()
{
	var setid = $("#setid").val();
	var usercode =  $("#usercode").val();
	var password =$("#password").val();

	if (setid == "")
	{
		showmsg("请输入账套号！");
		$("#setid").focus();
		return false;
	}

	if (usercode == "")
	{
		showmsg("请输入账号！");
		$("#usercode").focus();
		return false;
	}

	var argus =
	{
		setid : setid,
		usercode : usercode,
		password : password
	};

	/**
	 * 检查账套号
	 * 检查通过则登录
	 */
	checkSetInfo(setid, request_LoginValidate, argus);
}

/**
 * 快速体验 登录
 */
function tosharelogin(){
	$.post("platform/security/fastlogin",
	{ },
	function(data, status)
	{
		if (data.success)
		{
			if (data.msg != undefined && data.msg != null)
			{
				showmsg(data.msg);
			}

			var browser = checkBrowser()
			if(browser == "ie")
			{
				window.location = "../home/mainframe.jsp";
			}
			else if (browser == "Chrome" || browser == "Firefox")
			{
				window.location = "platform/home/mainframe.jsp";
			}
			else 
			{
				window.location = "platform/home/mainframe.jsp";
			}
		}
	});
}

/**
 * 检查账套号
 * @param setid		账套号
 * @param callback	检查通过回调时间
 */
function checkSetInfo(setid, callback, argus)
{
	/* 检查账套号 */
	$.post("platform/security/checksetid",
	{
		setid : setid
	},
	function(data, status)
	{
		if (data.success)
		{
			/* 检查通过 */

			if (data.msg != undefined && data.msg != null)
			{
				showmsg(data.msg);
				return;
			}

			if (callback != undefined && typeof(callback) == "function")
			{
				callback(argus);
			}
		}
		else
		{
			/* 登录失败 */
			showmsg(data.msg);
			$('#password').val("");
			$("#password").focus();
		}
	});
}

/**
 * 登录验证
 * @param argus
 */
function request_LoginValidate(argus)
{
	$.post("platform/security/login",
	{
		setid : argus.setid,
		loginname : argus.usercode,
		pwd : stringToHex(argus.password)
	},
	function(data, status)
	{
		if (data.success)
		{
			/* 登录成功 */
			if (data.msg != undefined && data.msg != null)
			{
				showmsg(data.msg);
			}

			saveCookies(argus.setid, argus.usercode, argus.password);
//			var browser = checkBrowser()
			var path = getContextPath();
			window.location = path+"/platform/home/mainframe.jsp";
		}
		else
		{
			/* 登录失败 */
			showmsg(data.msg);
			$('#password').val("");
			$("#password").focus();
		}
	});
}

/**
 * 修改密码
 * @returns {Boolean}
 */
function updatepwd()
{
	var setid = $("#varsetid").val();
	var usercode = $("#varcode").val();
	var oldpwd = $("#oldpwd").val();
	var newpwd1 = $("#newpwd1").val();
	var newpwd2 = $("#newpwd2").val();

	if (setid == "")
	{
		layer.alert('请输入账套号！');
		return false;
	}

	if (usercode == "")
	{
		layer.alert('请输入账号');
		return false;
	}

	if (newpwd1 != newpwd2)
	{
		layer.alert('确认密码和新密码不一致');
		return false;
	}

	var argus =
	{
		setid : setid,
		usercode : usercode,
		oldpwd : oldpwd,
		newpwd : newpwd1
	};

	/**
	 * 检查账套号
	 * 检查通过则修改密码
	 */
	checkSetInfo(setid, request_UpdatePassword, argus);
}

function request_UpdatePassword(argus)
{
	$.post("platform/security/updatepassword",
	{
		setid : argus.setid,
		loginname : argus.usercode,
		oldpwd : stringToHex(argus.oldpwd),
		newpwd : stringToHex(argus.newpwd)
	},
	function(data, status)
	{
		if (data.success)
		{
			layer.alert('密码修改成功');
			$("#lg_popup_panel").css("display", "none");
		}
		else
		{
			layer.alert(data.msg);
		}
	});
}

/**
 * 密码加盐
 * @param str
 * @returns {String}
 */
function stringToHex(str)
{
	str = "a1b2c3x7y8z9" + str;
	var val = "";
	for (var i = 0; i < str.length; i++)
	{
		if (val == "") val = str.charCodeAt(i).toString(16);
		else val += str.charCodeAt(i).toString(16);
	}
	return val;
}

/**
 * 提示信息显示
 * @param msg
 */
function showmsg(msg)
{
	$("#msg").empty();
	$("#msg").html(msg);
}

/**
 * 保存cookies
 * @param usercode
 * @param password
 */
function saveCookies(setid, usercode, password)
{
	$.cookie("setid", setid,
	{
		expires : 7
	});
	$.cookie("usercode", usercode,
	{
		expires : 7
	});
	$.cookie("password", password,
	{
		expires : 7
	});
}

function getContextPath() 
{
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0,index+1);
    return result;
 }

function checkBrowser()
{
	var explorer = window.navigator.userAgent;
	//ie 
	if (explorer.indexOf("Trident") >= 0) {
	    return "ie";
	}
	//firefox 
	else if (explorer.indexOf("Firefox") >= 0) {
	    return "Firefox";
	}
	//Chrome
	else if(explorer.indexOf("Chrome") >= 0){
	    return "Chrome";
	}
	//Opera
	else if(explorer.indexOf("Opera") >= 0){
	    return "Opera";
	}
	//Safari
	else if(explorer.indexOf("Safari") >= 0){
	    return "Safari";
	}
}
