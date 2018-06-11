Ext.namespace("sm.basedata.User");

sm.basedata.User.UserEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增部门",
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

		sm.basedata.User.UserEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtUserCode = new Ext.form.TextField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("登录名")
		});
		this.edtUserName = new Ext.form.TextField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("姓名")
		});

		this.edtPassword = new Ext.form.TextField(
		{
			fieldLabel : "密码",
			inputType : "password",
			emptyText : "不填写则使用默认密码"
		});

		this.edtEmpolyNo = new Ext.form.TextField(
		{
			fieldLabel : "工号"
		});
		this.edtEMail = new Ext.form.TextField(
		{
			fieldLabel : "电子邮件"
		});
		this.edtMobileTel = new Ext.form.TextField(
		{
			fieldLabel : "电话"
		});

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "【用户】-【新增】";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "【用户】-【修改】";
		};

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
			items : [ this.edtUserCode,
			          this.edtUserName,
			          this.edtPassword,
			          this.edtEmpolyNo,
			          this.edtEMail,
			          this.edtMobileTel ]
		});

		this.items = [ this.formpanelBaseData ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.edtUserCode.setValue(this.xy_Entity.userCode);
			this.edtUserName.setValue(this.xy_Entity.userName);

			this.edtPassword.setValue("******");
			this.edtPassword.disable();

			this.edtEmpolyNo.setValue(this.xy_Entity.empolyNo);
			this.edtEMail.setValue(this.xy_Entity.email);
			this.edtMobileTel.setValue(this.xy_Entity.mobileTel);
		}
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

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			return this.addUser();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateUser();
		}
	},
	validData : function()
	{
		if (this.edtUserCode.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写登录名");
			return false;
		}

		if (this.edtUserName.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写姓名");
			return false;
		}

		return true;
	},
	getDeptEntityData : function()
	{
		this.xy_Entity.userCode = this.edtUserCode.getValue().trim();
		this.xy_Entity.userName = this.edtUserName.getValue().trim();

		this.xy_Entity.password = this.edtPassword.getValue().trim();

		this.xy_Entity.empolyNo = this.edtEmpolyNo.getValue().trim();
		this.xy_Entity.email = this.edtEMail.getValue().trim();
		this.xy_Entity.mobileTel = this.edtMobileTel.getValue().trim();
	},
	addUser : function()
	{
		this.getDeptEntityData();

		Ext.Ajax.request(
		{
			url : "sm/user/add",
			method : "post",
			params :
			{
				jsonString : Ext.encode(this.xy_Entity)
			},
			sync : true,
			success : this.baseSuccessCallbackFun,
			failure : this.baseFailureCallbackFun,
			scope : this
		});

		return this.m_ModalResult;
	},
	updateUser : function()
	{
		this.getDeptEntityData();

		Ext.Ajax.request(
		{
			url : "sm/user/update",
			method : "post",
			params :
			{
				jsonString : Ext.encode(this.xy_Entity)
			},
			sync : true,
			success : this.baseSuccessCallbackFun,
			failure : this.baseFailureCallbackFun,
			scope : this
		});

		return this.m_ModalResult;
	}
});