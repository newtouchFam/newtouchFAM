Ext.namespace("sm.basedata.Unit");

sm.basedata.Unit.UnitEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增公司",
	height : 320,
	width : 660,
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

		sm.basedata.Unit.UnitEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtUnitCode = new Ext.form.TextField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("公司编码")
		});
		this.edtUnitName = new Ext.form.TextField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("公司名称")
		});

		this.edtParentCode = new Ext.form.TextField(
		{
			fieldLabel : "上级编码"
		});
		this.edtParentName = new Ext.form.TextField(
		{
			fieldLabel : "上级名称"
		});
		this.edtFullCode = new Ext.form.TextField(
		{
			fieldLabel : "全编码"
		});
		this.edtFullName = new Ext.form.TextField(
		{
			fieldLabel : "全名称"
		});

		this.cmbStatus = new ssc.component.EnableComboBox(
		{
			fieldLabel : "状态"
		});
		this.edtRemark = new Ext.form.TextArea(
		{
			fieldLabel : "备注",
			height : 40
		});

		this.edtCorporation = new Ext.form.TextField(
		{
			fieldLabel : "法人"
		});
		this.edtProperty = new Ext.form.TextField(
		{
			fieldLabel : "性质"
		});
		this.edtAddress = new Ext.form.TextField(
		{
			fieldLabel : "地址"
		});
		this.edtTel = new Ext.form.TextField(
		{
			fieldLabel : "电话"
		});
		this.edtFax = new Ext.form.TextField(
		{
			fieldLabel : "传真"
		});
		this.edtEMail = new Ext.form.TextField(
		{
			fieldLabel : "电子邮件"
		});

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "【公司】-【新增】";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "【公司】-【修改】";
		};
		this.edtParentCode.setReadOnly(true);
		this.edtParentName.setReadOnly(true);
		this.edtFullCode.setReadOnly(true);
		this.edtFullName.setReadOnly(true);

		this.formpanelBaseData = new Ext.form.FormPanel(
		{
			frame : true,
			border : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			layout : "column",
			items : [
			{
				layout : "column",
				items : [
				{
					columnWidth : .5,
					layout : "form",
					defaults :
					{
						width : 200
					},
					items : [ this.edtUnitCode,
					          this.edtUnitName,
					          this.cmbStatus ]
				},
				{
					columnWidth : .5,
					layout : "form",
					defaults :
					{
						width : 200
					},
					items : [ this.edtParentCode,
					          this.edtParentName,
					          this.edtFullCode,
					          this.edtFullName ]
				} ]
			},
			{
				layout : "column",
				items : [
				{
					columnWidth : 1,
					layout : "form",
					defaults :
					{
						width : 505
					},
					items : [ this.edtRemark ]
				} ]
			},
			{
				layout : "column",
				items : [
				{
					columnWidth : .5,
					layout : "form",
					defaults :
					{
						width : 200
					},
					items : [ this.edtCorporation,
					          this.edtProperty,
					          this.edtAddress ]
				},
				{
					columnWidth : .5,
					layout : "form",
					defaults :
					{
						width : 200
					},
					items : [ this.edtTel,
					          this.edtFax,
					          this.edtEMail ]
				} ]
			} ]
		});

		this.items = [ this.formpanelBaseData ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.edtParentCode.setValue(this.xy_Entity.parentCode);
			this.edtParentName.setValue(this.xy_Entity.parentName);

			this.cmbStatus.setKeyValue(1);
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.edtUnitCode.setValue(this.xy_Entity.unitCode);
			this.edtUnitName.setValue(this.xy_Entity.unitName);

			this.edtParentCode.setValue(this.xy_Entity.parentcode);
			this.edtParentName.setValue(this.xy_Entity.parentname);

			this.edtFullCode.setValue(this.xy_Entity.fullCode);
			this.edtFullName.setValue(this.xy_Entity.fullName);

			this.cmbStatus.setKeyValue(this.xy_Entity.status);
			this.edtRemark.setValue(this.xy_Entity.memo);

			this.edtCorporation.setValue(this.xy_Entity.corporation);
			this.edtProperty.setValue(this.xy_Entity.property);
			this.edtAddress.setValue(this.xy_Entity.address);
			this.edtTel.setValue(this.xy_Entity.tel);
			this.edtFax.setValue(this.xy_Entity.fax);
			this.edtEMail.setValue(this.xy_Entity.email);
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
			return this.addUnit();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateUnit();
		}
	},
	validData : function()
	{
		if (this.edtUnitCode.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写公司编码");
			return false;
		}

		if (this.edtUnitName.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写公司名称");
			return false;
		}

		return true;
	},
	getUnitEntityData : function()
	{
		this.xy_Entity.unitCode = this.edtUnitCode.getValue().trim();
		this.xy_Entity.unitName = this.edtUnitName.getValue().trim();

		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.memo = this.edtRemark.getValue().trim();

		this.xy_Entity.corporation = this.edtCorporation.getValue().trim();
		this.xy_Entity.property = this.edtProperty.getValue().trim();
		this.xy_Entity.address = this.edtAddress.getValue().trim();
		this.xy_Entity.tel = this.edtTel.getValue().trim();
		this.xy_Entity.fax = this.edtFax.getValue().trim();
		this.xy_Entity.email = this.edtEMail.getValue().trim();
	},
	addUnit : function()
	{
		this.getUnitEntityData();

		Ext.Ajax.request(
		{
			url : "sm/unit/add",
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
	updateUnit : function()
	{
		this.getUnitEntityData();

		Ext.Ajax.request(
		{
			url : "sm/unit/update",
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