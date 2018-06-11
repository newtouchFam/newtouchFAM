Ext.namespace("bcm.basedata.FormatIndex");

bcm.basedata.FormatIndex.FormatIndexEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增编制预算项目",
	height : 360,
	width : 350,
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

 		bcm.basedata.FormatIndex.FormatIndexEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtFormatIndexCode = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("编制项目编码")
		});
		this.edtFormatIndexName = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("编制项目名称")
		});

		this.edtParentFormatIndexCode = new Ext.form.TextField(
		{
			fieldLabel : "上级项目编码"
		});
		this.edtParentFormatIndexName = new Ext.form.TextField(
		{
			fieldLabel : "上级项目名称"
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
		this.textareaRemark = new Ext.form.TextArea(
		{
			fieldLabel : "备注",
			height : 60
		});

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "新增编制预算项目";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "修改编制预算项目";
		};
		this.edtParentFormatIndexCode.setReadOnly(true);
		this.edtParentFormatIndexName.setReadOnly(true);
		this.edtFullCode.setReadOnly(true);
		this.edtFullName.setReadOnly(true);

		this.formpanelBaseData = new Ext.form.FormPanel(
		{
			frame : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			defaults :
			{
				width : 200
			},
			items : [ this.edtFormatIndexCode,
			          this.edtFormatIndexName,
			          this.edtParentFormatIndexCode,
			          this.edtParentFormatIndexName,
			          this.edtFullCode,
			          this.edtFullName,
			          this.cmbStatus,
			          this.textareaRemark ]
		});

		this.items = [ this.formpanelBaseData ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.edtParentFormatIndexCode.setValue(this.xy_Entity.parentCode);
			this.edtParentFormatIndexName.setValue(this.xy_Entity.parentName);

			this.cmbStatus.setKeyValue(1);
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.edtFormatIndexCode.setValue(this.xy_Entity.formatIndexCode);
			this.edtFormatIndexName.setValue(this.xy_Entity.formatIndexName);

			this.edtParentFormatIndexCode.setValue(this.xy_Entity.parentCode);
			this.edtParentFormatIndexName.setValue(this.xy_Entity.parentName);

			this.edtFullCode.setValue(this.xy_Entity.fullCode);
			this.edtFullName.setValue(this.xy_Entity.fullName);

			this.cmbStatus.setKeyValue(this.xy_Entity.status);
			this.textareaRemark.setValue(this.xy_Entity.remark);
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
			return this.addFormatIndex();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateFormatIndex();
		}
	},
	validData : function()
	{
		if (this.edtFormatIndexCode.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写编制预算项目编码!");
			return false;
		}

		if (this.edtFormatIndexName.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写编制预算项目名称!");
			return false;
		}

		return true;
	},
	getFormatIndexEntityData : function()
	{
		this.xy_Entity.formatIndexCode = this.edtFormatIndexCode.getValue().trim();
		this.xy_Entity.formatIndexName = this.edtFormatIndexName.getValue().trim();
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.remark = this.textareaRemark.getValue().trim();
	},
	addFormatIndex : function()
	{
		this.getFormatIndexEntityData();

		Ext.Ajax.request(
		{
			url : "bcm/formatindex/add",
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
	updateFormatIndex : function()
	{
		this.getFormatIndexEntityData();

		Ext.Ajax.request(
		{
			url : "bcm/formatindex/update",
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