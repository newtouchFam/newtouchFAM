Ext.namespace("sm.basedata.User");

sm.basedata.User.LockWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "【锁定】",
	height : 300,
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

		sm.basedata.User.LockWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtCaption = new Ext.form.TextField(
		{
			fieldLabel : "已选择",
			disabled : true,
		});

		this.edtDesc = new Ext.form.TextArea(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("锁定说明"),
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
			          this.edtDesc ]
		});

		this.items = [ this.formpanelBaseData ];
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

		return this.lockUser();
	},
	validData : function()
	{
		if (this.edtDesc.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写说明");
			return false;
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
			desc : this.edtDesc.getValue().trim(),
		}

		return params;

	},
	lockUser : function()
	{
		var params = this.getPostData();

		Ext.Ajax.request(
		{
			url : "sm/user/lock",
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