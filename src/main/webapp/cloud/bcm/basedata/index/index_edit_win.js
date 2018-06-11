Ext.namespace("bcm.basedata.Index");

bcm.basedata.Index.IndexEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增预算项目",
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

 		bcm.basedata.Index.IndexEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtIndexCode = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("预算项目编码")
		});
		this.edtIndexName = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("预算项目名称")
		});

		this.cmbIndexType = new bcm.component.IndexTypeEnabledListComboBox();

		this.edtParentIndexCode = new Ext.form.TextField(
		{
			fieldLabel : "上级项目编码"
		});
		this.edtParentIndexName = new Ext.form.TextField(
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
			this.title = "新增预算项目";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "修改预算项目";
		};
		this.edtParentIndexCode.setReadOnly(true);
		this.edtParentIndexName.setReadOnly(true);
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
			items : [ this.edtIndexCode,
			          this.edtIndexName,
			          this.cmbIndexType,
			          this.edtParentIndexCode,
			          this.edtParentIndexName,
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
			this.edtParentIndexCode.setValue(this.xy_Entity.parentCode);
			this.edtParentIndexName.setValue(this.xy_Entity.parentName);

			this.cmbStatus.setKeyValue(1);
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.edtIndexCode.setValue(this.xy_Entity.indexCode);
			this.edtIndexName.setValue(this.xy_Entity.indexName);

			this.cmbIndexType.setInitValue(this.xy_Entity.indexTypeID, this.xy_Entity.indexTypeName);

			this.edtParentIndexCode.setValue(this.xy_Entity.parentCode);
			this.edtParentIndexName.setValue(this.xy_Entity.parentName);

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
			return this.addIndex();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateIndex();
		}
	},
	validData : function()
	{
		if (this.edtIndexCode.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写预算项目编码!");
			return false;
		}

		if (this.edtIndexName.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写预算项目名称!");
			return false;
		}

		return true;
	},
	getIndexEntityData : function()
	{
		this.xy_Entity.indexCode = this.edtIndexCode.getValue().trim();
		this.xy_Entity.indexName = this.edtIndexName.getValue().trim();
		this.xy_Entity.indexTypeID = this.cmbIndexType.getKeyValue();
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.remark = this.textareaRemark.getValue().trim();
	},
	addIndex : function()
	{
		this.getIndexEntityData();

		Ext.Ajax.request(
		{
			url : "bcm/index/add",
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
	updateIndex : function()
	{
		this.getIndexEntityData();

		Ext.Ajax.request(
		{
			url : "bcm/index/update",
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