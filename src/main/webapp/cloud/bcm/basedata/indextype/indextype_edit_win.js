Ext.namespace("bcm.basedata.IndexType");

bcm.basedata.IndexType.IndexTypeEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增预算项目类型",
	height : 250,
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

		bcm.basedata.IndexType.IndexTypeEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtIndexTypeCode = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("类型编码")
		});
		this.edtIndexTypeName = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("类型名称")
		});
		this.cmbStatus = new ssc.component.EnableComboBox(
		{
			fieldLabel : "启用状态"
		});
		this.textareaRemark = new Ext.form.TextArea(
		{
			fieldLabel : "备注"
		});

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "新增预算项目类型";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "修改预算项目类型";
		};

		this.formpanelMain = new Ext.form.FormPanel(
		{
			frame : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			defaults :
			{
				width : 200
			},
			items : [ this.edtIndexTypeCode,
			          this.edtIndexTypeName,
			          this.cmbStatus,
			          this.textareaRemark ]
		});

		this.items = [ this.formpanelMain ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.cmbStatus.setKeyValue(1);
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.edtIndexTypeCode.setValue(this.xy_Entity.indexTypeCode);
			this.edtIndexTypeName.setValue(this.xy_Entity.indexTypeName);
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
			return this.addIndexType();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateIndexType();
		}
	},
	validData : function()
	{
		var strIndexTypeCode = this.edtIndexTypeCode.getValue().trim();
		var strIndexTypeName = this.edtIndexTypeName.getValue().trim();

		if (strIndexTypeCode.isEmpty())
		{
			MsgUtil.alert("请填写类型编码");
			return false;
		}

		if (strIndexTypeName.isEmpty())
		{
			MsgUtil.alert("请填写类型名称");
			return false;
		}

		return true;
	},
	addIndexType : function()
	{
		this.xy_Entity.indexTypeCode = this.edtIndexTypeCode.getValue().trim();
		this.xy_Entity.indexTypeName = this.edtIndexTypeName.getValue().trim();
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.remark = this.textareaRemark.getValue().trim();

		Ext.Ajax.request(
		{
			url : "bcm/indextype/add",
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
	updateIndexType : function()
	{
		this.xy_Entity.indexTypeCode = this.edtIndexTypeCode.getValue().trim();
		this.xy_Entity.indexTypeName = this.edtIndexTypeName.getValue().trim();
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.remark = this.textareaRemark.getValue().trim();

		Ext.Ajax.request(
		{
			url : "bcm/indextype/update",
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