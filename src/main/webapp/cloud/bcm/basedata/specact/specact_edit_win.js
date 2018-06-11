Ext.namespace("bcm.basedata.Specact");

bcm.basedata.Specact.SpecactEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增专项活动",
	height : 330,
	width : 640,
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

 		bcm.basedata.Specact.SpecactEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtSpecactCode = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("专项活动编码")
		});
		this.edtSpecactName = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("专项活动名称")
		});

		this.edtParentSpecactCode = new Ext.form.TextField(
		{
			fieldLabel : "上级项目编码"
		});
		this.edtParentSpecactName = new Ext.form.TextField(
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

		this.cmbIsShare = new ssc.component.YesNoComboBox(
		{
			fieldLabel : "是否全局共享",
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function(_this, oldValue, newValue)
			{
				if (newValue == 1)
				{
					/* 全局共享，不能选择所属单位 */
					this.tgfieldUnit.disable();
					this.tgfieldUnit.setReadOnly(true);
					this.tgfieldUnit.clearSelections();
				}
				else
				{
					/* 非共享，要选择所属单位 */
					this.tgfieldUnit.enable();
					this.tgfieldUnit.setReadOnly(false);
				}
			}
		});
		this.tgfieldUnit = new sm.component.UnitTreeField(
		{
			fieldlable : "所属单位"
		});
		this.dtStartDate = new Ext.form.DateField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("开始日期"),
			format : "Y-m-d",
			readOnly : false
		});
		this.dtEndDate = new Ext.form.DateField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("结束日期"),
			format : "Y-m-d",
			readOnly : false
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
			this.title = "新增专项活动";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "修改专项活动";
		};
		this.edtParentSpecactCode.setReadOnly(true);
		this.edtParentSpecactName.setReadOnly(true);
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
					items : [ this.edtSpecactCode,
					          this.edtSpecactName,
					          this.cmbIsShare,
					          this.tgfieldUnit,
					          this.dtStartDate,
					          this.cmbStatus ]
				},
				{
					columnWidth : .5,
					layout : "form",
					defaults :
					{
						width : 200
					},
					items : [ this.edtParentSpecactCode,
					          this.edtParentSpecactName,
					          this.edtFullCode,
					          this.edtFullName,
					          this.dtEndDate ]
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
						width : 500
					},
					items : [ this.textareaRemark ]
				} ]
			} ]
		});

		this.items = [ this.formpanelBaseData ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.edtParentSpecactCode.setValue(this.xy_Entity.parentCode);
			this.edtParentSpecactName.setValue(this.xy_Entity.parentName);

			this.cmbIsShare.setKeyValue(0);

			var now = new Date();
			var vYear = now.getFullYear();
			var vMonth = now.getMonth() + 1;
			var vStartDate = vYear + "-" + String.leftPad(vMonth, 2, "0") + "-01";
			var vEndDate = vYear + "-12-31";

			this.dtStartDate.setValue(vStartDate);
			this.dtEndDate.setValue(vEndDate);

			this.cmbStatus.setKeyValue(1);
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.edtSpecactCode.setValue(this.xy_Entity.specactCode);
			this.edtSpecactName.setValue(this.xy_Entity.specactName);

			this.edtParentSpecactCode.setValue(this.xy_Entity.parentCode);
			this.edtParentSpecactName.setValue(this.xy_Entity.parentName);

			this.edtFullCode.setValue(this.xy_Entity.fullCode);
			this.edtFullName.setValue(this.xy_Entity.fullName);

			this.cmbIsShare.setKeyValue(this.xy_Entity.isShare);
			this.tgfieldUnit.setInitValue(this.xy_Entity.unitID, this.xy_Entity.unitName);
			if (this.xy_Entity.isShare == 1)
			{
				this.tgfieldUnit.disable();
				this.tgfieldUnit.setReadOnly(true);
				this.tgfieldUnit.clearSelections();
			}
			this.dtStartDate.setValue(this.xy_Entity.startDate);
			this.dtEndDate.setValue(this.xy_Entity.endDate);

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
		if (this.edtSpecactCode.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写专项活动编码");
			return false;
		}

		if (this.edtSpecactName.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写专项活动名称");
			return false;
		}

		if (this.cmbIsShare.getKeyValue() == 0)
		{
			if (this.tgfieldUnit.getSelectedCount() <= 0)
			{
				MsgUtil.alert("非共享的专项活动，需要选择所属单位");
				return false;
			}
		}
		return true;
	},
	getEntityData : function()
	{
		this.xy_Entity.specactCode = this.edtSpecactCode.getValue().trim();
		this.xy_Entity.specactName = this.edtSpecactName.getValue().trim();
		this.xy_Entity.unitID = this.tgfieldUnit.getSelectedID();
		this.xy_Entity.isShare = this.cmbIsShare.getKeyValue();
		this.xy_Entity.startDate = this.dtStartDate.getValue().format("Y-m-d");
		this.xy_Entity.endDate = this.dtEndDate.getValue().format("Y-m-d");
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.remark = this.textareaRemark.getValue().trim();
	},
	addIndex : function()
	{
		this.getEntityData();

		Ext.Ajax.request(
		{
			url : "bcm/specact/add",
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
		this.getEntityData();

		Ext.Ajax.request(
		{
			url : "bcm/specact/update",
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