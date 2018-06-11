var m_loginForm = null;
var m_loginWin = null;
var m_loadMask = null;
var cp = null;
var m_updatePwdForm = null;
var m_updatePwdWin = null;
var m_updatePwdLoadMask = null;

function alert_usercode_callback(result) {
	m_loginForm.getComponent("usercode").focus();
}

function alert_setid_callback(result) {
	m_loginForm.getComponent("setid").focus();
}

function hideLoadMask() {
	if (m_loadMask != null) {
		m_loadMask.hide();
		m_loadMask = null;
	}
}

function hideUpdatePwdLoadMask() {
	if (m_updatePwdLoadMask != null) {
		m_updatePwdLoadMask.hide();
		m_updatePwdLoadMask = null;
	}
}

function doCloseUpdateWin() {
	if (m_updatePwdWin != null) {
		m_updatePwdWin.hide();
	}
}

function alert_varcode_callback() {
	m_updatePwdForm.getComponent("varcode").focus();
}

function alert_newPwd_callback() {
	m_updatePwdForm.getComponent("newPwd").focus();
}

function doUpdatePassword() {
	var varcode = m_updatePwdForm.getComponent("varcode").getValue().trim();
	if (varcode == "") {
		Ext.MessageBox.alert("提示", "请输入账号。", alert_varcode_callback);
		return false;
	}

	var newPwd = m_updatePwdForm.getComponent("newPwd").getValue();
	var newsPwd2 = m_updatePwdForm.getComponent("newsPwd2").getValue();
	if (newPwd != newsPwd2) {
		Ext.MessageBox.alert("提示", "新密码和确认密码不一致。", alert_newPwd_callback);
		return false;
	}

	var oldPwd = m_updatePwdForm.getComponent("oldPwd").getValue();

	var setid = "001";

	m_updatePwdLoadMask = new Ext.LoadMask("updatePwdWin", {
				msg : "修改...",
				removeMask : true
			});
	m_updatePwdLoadMask.show();

	try {
		AuthProxy.updatePassword(varcode, oldPwd, newPwd, setid, "", {
					callback : processUpdatePasswordResult,
					async : true
				});
	}
	catch (ex) {
		hideUpdatePwdLoadMask();

		Ext.MessageBox.alert("异常", ex);
	}

	return true;
}

function processUpdatePasswordResult(result) {
	hideUpdatePwdLoadMask();

	if (result.error == 0) {

		Ext.MessageBox.alert("信息", "密码修改成功。");

	}
	else {

		Ext.MessageBox.alert("错误", result.errDesc);

	}
}

function showUpdatePassword() {
	var setid = "001";
	if (setid == "") {
		Ext.MessageBox.alert("提示", "没有指定账套。", alert_setid_callback);
		return false;
	}

	if (m_updatePwdForm == null) {
		var items = new Array();
		items[0] = {
			fieldLabel : "账号",
			id : "varcode",
			xtype : "textfield"
		};
		items[1] = {
			fieldLabel : "原密码",
			id : "oldPwd",
			xtype : "textfield",
			inputType : "password"
		};
		items[2] = {
			fieldLabel : "新密码",
			id : "newPwd",
			xtype : "textfield",
			inputType : "password"
		};
		items[3] = {
			fieldLabel : "确认密码",
			id : "newsPwd2",
			xtype : "textfield",
			inputType : "password"
		};

		var buttons = new Array();
		buttons[0] = {
			text : "确定",
			handler : doUpdatePassword
		};
		buttons[1] = {
			text : "关闭",
			handler : doCloseUpdateWin
		};

		m_updatePwdForm = new Ext.form.FormPanel({
					frame : true,
					labelAlign : "right",
					labelWidth : 80,
					items : items,
					buttons : buttons
				});
	}

	if (m_updatePwdWin == null) {
		m_updatePwdWin = new Ext.Window({
					id : "updatePwdWin",
					title : "修改密码",
					width : 300,
					autoHeight : true,
					draggable : false,
					resizable : false,
					plain : true,
					border : false,
					modal : false,
					closable : false,
					items : m_updatePwdForm
				});
	}
	m_updatePwdWin.show();
	if (Ext.getCmp("usercode").getValue() != "") {
		Ext.getCmp("varcode").setValue(Ext.getCmp("usercode").getValue());
	}
}

function doVerifyLogin() {
	var usercode = Ext.getCmp("usercode").getValue().trim();
	var password = Ext.getCmp("password").getValue();
	cp.set("username",usercode);
	var setid = '001';

	if (usercode == "") {
		Ext.MessageBox.alert("提示", "请输入账号。", alert_usercode_callback);
		return false;
	}

	var basePath = Ext.get("basePath").dom.value;

	m_loadMask = new Ext.LoadMask("loginWin", {
				msg : "登录...",
				removeMask : true
			});
	m_loadMask.show();
	
	password = stringToHex("a1b2c3x7y8z9" + password);

	try
	{
		var params =
		{
			logincode : usercode,
			password : password
		};

		Ext.Ajax.request(
		{
			url : "auth/verifylogin",
			method : "post",
			params :
			{
				jsonString : Ext.encode(params)
			},
			sync : true,
			success : processVerifyLoginResult,
			failure : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				alert(data.msg);
			},
			scope : this
		});

/*		AuthProxy.verifyLogin(basePath, usercode, password, setid, "", "001",{
					callback : processVerifyLoginResult,
					async : true
				});*/
	}
	catch (ex)
	{
		hideLoadMask();

		Ext.MessageBox.alert("异常", ex);
	}

	return true;
}

function stringToHex(str)
{
	var val = "";
	for ( var i = 0; i < str.length; i++)
	{
		if (val == "")
			val = str.charCodeAt(i).toString(16);
		else
			val += str.charCodeAt(i).toString(16);
	}
	return val;
} 

function processVerifyLoginResult(result)
{
	hideLoadMask();
	
	var data = Ext.decode(result.responseText);

	if (data.success == 0) 
	{
		m_loginWin.hide();
		document.getElementById("img1").src = "";
		createMainFrame();
	}
	else if (data.success == 6) 
	{
		m_loginWin.hide();
		showUpdatePassword();
		Ext.MessageBox.alert("提示", data.msg);
	}
	else if (data.success == 7)
	{
		// location.href = "/XineM8/SMX/Test/error.jsp";
		m_loginWin.hide();

		document.getElementById("img1").src = "";

		createMainFrame();

		Ext.MessageBox.alert("提示", data.msg);
	}
	else
	{
		Ext.MessageBox.alert("错误", data.msg);
	}
}

function resetInfo() {
	Ext.getCmp("usercode").setValue("");
	Ext.getCmp("password").setValue("");
}

function forgetPassWord()
{
   var forgetWindow = new com.freesky.ssc.form.system.forgetPassWordWindow();
}

function init() {
	cp = new Ext.state.CookieProvider(); 
	Ext.state.Manager.setProvider(cp); 
	var cpUsername = cp.get("username");
	var items = new Array();
	items[0] = {
		fieldLabel : "账号",
		id : "usercode",
		xtype : "textfield",
		listeners : {
			specialKey : function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					Ext.getCmp("password").focus(true);
				}
			}
		}
	};
	items[1] = {
		fieldLabel : "密码",
		id : "password",
		// width:130,
		// onTriggerClick:showUpdatePassword,
		// readOnly : false,
		// xtype:"xysearch",
		xtype : "textfield",
		inputType : "password",
		listeners : {
			specialKey : function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					doVerifyLogin();
				}
			}
		}
	};
	
	var buttons = new Array();
	buttons[0] = {
		text : "登录",
		handler : doVerifyLogin
	};
	buttons[1] = {
		text : "修改密码",
		handler : showUpdatePassword
	};

	m_loginForm = new Ext.form.FormPanel({
				frame : true,
				labelAlign : "right",
				labelWidth : 80,
				items : items,
				buttons : buttons
			});

	m_loginWin = new Ext.Window({
				id : "loginWin",
				title : "登录",
				width : 300,
				autoHeight : true,
				draggable : false,
				resizable : false,
				plain : true,
				border : false,
				modal : false,
				closable : false,
				items : m_loginForm,
				html : '<div style="text-align:right;width:285px;background-color:#B4C9E4;padding-right:3px">'
					// +'<a href="javascript:void(0)" onclick="forgetPassWord()">忘记密码</a></div>'
			});
	m_loginWin.show();
	Ext.getCmp("usercode").setValue("cy");
	Ext.getCmp("password").setValue("a222222");

	//Ext.getCmp("setid").setValue("001");
	// doVerifyLogin();
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";

Ext.onReady(init);