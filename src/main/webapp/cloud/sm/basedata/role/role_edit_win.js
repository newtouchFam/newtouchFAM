Ext.namespace("sm.basedata.Role");

sm.basedata.Role.RoleEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增角色",
	height : 220,
	width : 380,
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

		sm.basedata.Role.RoleEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtRoleName = new Ext.form.TextField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("角色名称")
		});
		this.edtRoleDesc = new Ext.form.TextField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("角色描述")
		});

		this.cmbRoleType = new sm.component.RoleTypeComboBox(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("类型")
		});

		this.cmbStatus = new ssc.component.EnableComboBox(
		{
			fieldLabel : "状态"
		});

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "【角色】-【新增】";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "【角色】-【修改】";
		};

		this.formpanelBaseData = new Ext.form.FormPanel(
		{
			frame : true,
			border : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			defaults :
			{
				width : 200
			},
			items : [ this.edtRoleName,
			          this.edtRoleDesc,
			          this.cmbRoleType,
			          this.cmbStatus]
		});

		this.items = [ this.formpanelBaseData ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.cmbStatus.setKeyValue(1);
			this.cmbRoleType.setKeyValue(0);
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.edtRoleName.setValue(this.xy_Entity.roleName);
			this.edtRoleDesc.setValue(this.xy_Entity.roleDesc);

			this.cmbRoleType.setKeyValue(this.xy_Entity.type);
			this.cmbRoleType.disable();
			this.cmbStatus.setKeyValue(this.xy_Entity.status);
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
			return this.addRole();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateRole();
		}
	},
	validData : function()
	{
		if (this.edtRoleName.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写角色名称");
			return false;
		}

		if (this.edtRoleDesc.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写角色描述");
			return false;
		}

		return true;
	},
	getRoleEntityData : function()
	{
		this.xy_Entity.roleName = this.edtRoleName.getValue().trim();
		this.xy_Entity.roleDesc = this.edtRoleDesc.getValue().trim();

		this.xy_Entity.type = this.cmbRoleType.getKeyValue();
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
	},
	addRole : function()
	{
		this.getRoleEntityData();

		Ext.Ajax.request(
		{
			url : "sm/role/add",
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
	updateRole : function()
	{
		this.getRoleEntityData();

		Ext.Ajax.request(
		{
			url : "sm/role/update",
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