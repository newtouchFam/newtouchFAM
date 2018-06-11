Ext.namespace("bcm.basedata.Respn");

bcm.basedata.Respn.RespnEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增责任中心",
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

 		bcm.basedata.Respn.RespnEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtRespnCode = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("责任中心编码")
		});
		this.edtRespnName = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("责任中心名称")
		});

		this.cmbRespnType = new bcm.component.RespnTypeEnabledListComboBox();

		this.edtParentRespnCode = new Ext.form.TextField(
		{
			fieldLabel : "上级编码"
		});
		this.edtParentRespnName = new Ext.form.TextField(
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

		this.tgfieldDept = new sm.component.DeptTreeByUnitField(
		{
			fieldLabel : "引用部门",
			xy_LeafOnly : false,
			xy_MultiSelectMode : false,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : this.refDept
		});

		this.cmbIsUnit = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "类型",
			xy_DataArray : [ [ 0, "其他" ], [ 1, "单位" ] ],
			xy_AllowClear : false
		});
		this.tgfieldUnit = new sm.component.UnitTreeField(
		{
			fieldlable : "所属单位"
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
			this.title = "新增责任中心";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "修改责任中心";
		};
		this.edtParentRespnCode.setReadOnly(true);
		this.edtParentRespnName.setReadOnly(true);
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
					items : [ this.edtRespnCode,
					          this.edtRespnName,
					          this.cmbRespnType,
					          this.cmbIsUnit,
					          this.tgfieldUnit,
					          this.cmbStatus]
				},
				{
					columnWidth : .5,
					layout : "form",
					defaults :
					{
						width : 200
					},
					items : [ this.edtParentRespnCode,
					          this.edtParentRespnName,
					          this.edtFullCode,
					          this.edtFullName,
					          this.tgfieldDept ]
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
			this.edtParentRespnCode.setValue(this.xy_Entity.parentCode);
			this.edtParentRespnName.setValue(this.xy_Entity.parentName);

			this.cmbIsUnit.setKeyValue(0);
			this.cmbStatus.setKeyValue(1);

			this.tgfieldDept.setReadOnly(false);
			this.tgfieldDept.enable();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.edtRespnCode.setValue(this.xy_Entity.respnCode);
			this.edtRespnName.setValue(this.xy_Entity.respnName);

			this.cmbRespnType.setInitValue(this.xy_Entity.respnTypeID, this.xy_Entity.respnTypeName);
			this.cmbIsUnit.setKeyValue(this.xy_Entity.isUnit);
			this.tgfieldUnit.setInitValue(this.xy_Entity.unitID, this.xy_Entity.unitName);

			this.edtParentRespnCode.setValue(this.xy_Entity.parentCode);
			this.edtParentRespnName.setValue(this.xy_Entity.parentName);

			this.edtFullCode.setValue(this.xy_Entity.fullCode);
			this.edtFullName.setValue(this.xy_Entity.fullName);

			this.cmbStatus.setKeyValue(this.xy_Entity.status);
			this.textareaRemark.setValue(this.xy_Entity.remark);

			this.tgfieldDept.setReadOnly(true);
			this.tgfieldDept.disable();
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
			return this.addRespn();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateRespn();
		}
	},
	validData : function()
	{
		if (this.edtRespnCode.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写责任中心编码!");
			return false;
		}

		if (this.edtRespnName.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写责任中心名称!");
			return false;
		}

		if (this.cmbIsUnit.getKeyValue() == 1 && this.tgfieldUnit.getSelectedCount() <= 0)
		{
			MsgUtil.alert("类型为单位的责任中心，请设置所属单位");
			return false;
		}

		return true;
	},
	getRespnEntityData : function()
	{
		this.xy_Entity.respnCode = this.edtRespnCode.getValue().trim();
		this.xy_Entity.respnName = this.edtRespnName.getValue().trim();
		this.xy_Entity.respnTypeID = this.cmbRespnType.getKeyValue();
		this.xy_Entity.isUnit = this.cmbIsUnit.getKeyValue();
		this.xy_Entity.unitID = this.tgfieldUnit.getSelectedID();
		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.remark = this.textareaRemark.getValue().trim();
	},
	getRespnDeptEntityData : function()
	{
		var respnDeptEntity = {};

		if (this.tgfieldDept.getSelectedCount() > 0)
		{
			respnDeptEntity =
			{
				caseCode : this.xy_Entity.caseCode,
				respnID : "",
				deptID : this.tgfieldDept.getSelectedID()
			};
		}

		return respnDeptEntity;
	},
	addRespn : function()
	{
		this.getRespnEntityData();

		var respnDeptEntity = this.getRespnDeptEntityData();

		Ext.Ajax.request(
		{
			url : "bcm/respn/add",
			method : "post",
			params :
			{
				jsonString : Ext.encode(this.xy_Entity),
				jsonCondition : Ext.encode(respnDeptEntity)
			},
			sync : true,
			success : this.baseSuccessCallbackFun,
			failure : this.baseFailureCallbackFun,
			scope : this
		});

		return this.m_ModalResult;
	},
	updateRespn : function()
	{
		this.getRespnEntityData();

		Ext.Ajax.request(
		{
			url : "bcm/respn/update",
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
	refDept : function()
	{
		var msg = "引用部门后将把该部门的编码、名称作为该责任中心的编码、名称；并将自动把该部门与责任中心建立对应关系。是否继续？";
		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "yes")
			{
				if (this.tgfieldDept.getSelected())
				{
					this.edtRespnCode.setValue(this.tgfieldDept.getDeptCode());
					this.edtRespnName.setValue(this.tgfieldDept.getDeptName());

					this.tgfieldUnit.setInitValue(this.tgfieldDept.getUnitID(), this.tgfieldDept.getUnitName());
				}
			}
		}, this);

	}
});