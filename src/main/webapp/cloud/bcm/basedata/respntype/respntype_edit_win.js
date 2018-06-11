Ext.namespace("bcm.basedata.RespnType");

bcm.basedata.RespnType.RespnTypeEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增责任中心类型",
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

		bcm.basedata.RespnType.RespnTypeEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtRespnTypeCode = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("类型编码")
		});
		this.edtRespnTypeName = new Ext.form.TextField(
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
			this.title = "新增责任中心类型";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "修改责任中心类型";
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
			items : [ this.edtRespnTypeCode,
			          this.edtRespnTypeName,
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
			this.edtRespnTypeCode.setValue(this.xy_Entity.respnTypeCode);
			this.edtRespnTypeName.setValue(this.xy_Entity.respnTypeName);
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
			return this.addRespnType();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateRespnType();
		}
	},
	validData : function()
	{
		var strRespnTypeCode = this.edtRespnTypeCode.getValue().trim();
		var strRespnTypeName = this.edtRespnTypeName.getValue().trim();

		if (strRespnTypeCode.isEmpty())
		{
			MsgUtil.alert("请填写类型编码");
			return false;
		}

		if (strRespnTypeName.isEmpty())
		{
			MsgUtil.alert("请填写类型名称");
			return false;
		}

		return true;
	},
	addRespnType : function()
	{
		this.xy_Entity.respnTypeCode = this.edtRespnTypeCode.getValue().trim();
		this.xy_Entity.respnTypeName = this.edtRespnTypeName.getValue().trim();
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.remark = this.textareaRemark.getValue().trim();

		Ext.Ajax.request(
		{
			url : "bcm/respntype/add",
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
	updateRespnType : function()
	{
		this.xy_Entity.respnTypeCode = this.edtRespnTypeCode.getValue().trim();
		this.xy_Entity.respnTypeName = this.edtRespnTypeName.getValue().trim();
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.remark = this.textareaRemark.getValue().trim();

		Ext.Ajax.request(
		{
			url : "bcm/respntype/update",
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