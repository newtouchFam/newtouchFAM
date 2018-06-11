Ext.namespace("sm.basedata.User");

sm.basedata.User.ResetPasswordWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "【重置密码】",
	height : 340,
	width : 400,
	layout : "fit",
	labelAlign : "right",
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.Add,
	xy_Entity : {},
	initComponent : function()
	{
		this.initUI();

		this.initData();

		sm.basedata.User.ResetPasswordWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtCaption = new Ext.form.TextField(
		{
			fieldLabel : "已选择",
			disabled : true,
		});

		this.chbDefaultPwd = new Ext.form.Checkbox(
		{
			fieldLabel : "密码类型",
			boxLabel : "使用默认密码",
			checked : true
		});
		this.chbDefaultPwd.on("check", this.onCheckDefaultPwdEvent, this);

		this.edtPassword = new Ext.form.TextField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("新密码"),
			inputType : "password"
		});
		this.edtPasswordRepeat = new Ext.form.TextField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("确认密码"),
			inputType : "password"
		});

		this.edtDesc = new Ext.form.TextArea(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("重置密码说明"),
			height : 100
		});

		this.formpanelBaseData = new Ext.form.FormPanel(
		{
			frame : true,
			border : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			layout : "form",
			defaults :
			{
				width : 200
			},
			items : [ this.edtCaption,
			          this.chbDefaultPwd,
			          this.edtPassword,
			          this.edtPasswordRepeat,
			          this.edtDesc ]
		});

		this.items = [ this.formpanelBaseData ];
	},
	onCheckDefaultPwdEvent : function(_this, checked)
	{
		if (checked)
		{
			this.edtPassword.disable();
			this.edtPasswordRepeat.disable();
		}
		else
		{
			this.edtPassword.enable();
			this.edtPasswordRepeat.enable();
		}
	},
	initData : function()
	{
		var caption = "";
		if (this.xy_Entity.length > 0)
		{
			caption += "【" + this.xy_Entity[0].userName + "】等";
		}
		caption += this.xy_Entity.length + "位用户";

		this.edtCaption.setValue(caption);
		this.edtCaption.disable();

		this.edtPassword.disable();
		this.edtPasswordRepeat.disable();
	},
	/**
	 * @override
	 */
	baseConfirmValid : function()
	{
		if (!this.validData())
		{
			return false;
		}

		return this.resetPwd();
	},
	validData : function()
	{
		if (this.edtDesc.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写说明");
			return false;
		}

		if (! this.chbDefaultPwd.getValue())
		{
			var pwd = this.edtPassword.getValue().trim();
			var pwd_repeat = this.edtPasswordRepeat.getValue().trim();
			if (pwd != pwd_repeat)
			{
				MsgUtil.alert("新密码与确认密码不一致");
				return false;
			}
		}

		return true;
	},
	getPostData : function()
	{
		var userid = "";
		for (var i = 0; i < this.xy_Entity.length; i++)
		{
			record = this.xy_Entity[i];

			if (userid.trim().length > 0)
			{
				userid += ",";
			}

			userid += record.userID; 
		}

		var params =
		{
			userid : userid,
			defaultpwd : this.chbDefaultPwd.getValue(),
			pwd : HexUtil.toHex(this.edtPassword.getValue().trim(), "fysty"),
			desc : this.edtDesc.getValue().trim(),
		}

		return params;
	},
	resetPwd : function()
	{
		var params = this.getPostData();

		Ext.Ajax.request(
		{
			url : "sm/user/resetpwd",
			method : "post",
			params :
			{
				jsonCondition : Ext.encode(params)
			},
			sync : true,
			success : this.baseSuccessCallbackFun,
			failure : this.baseFailureCallbackFun,
			scope : this
		});

		return this.m_ModalResult;
	}
});