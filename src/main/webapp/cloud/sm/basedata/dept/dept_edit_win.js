Ext.namespace("sm.basedata.Dept");

sm.basedata.Dept.DeptEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增部门",
	height : 300,
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

		sm.basedata.Dept.DeptEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtDeptCode = new Ext.form.TextField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("部门编码")
		});
		this.edtDeptName = new Ext.form.TextField(
		{
			fieldLabel : StringUtil.setKeyFieldLabel("部门名称")
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

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "【部门】-【新增】";
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "【部门】-【修改】";
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
					items : [ this.edtDeptCode,
					          this.edtDeptName,
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
					items : [ this.edtAddress,
					          this.edtFax ]
				},
				{
					columnWidth : .5,
					layout : "form",
					defaults :
					{
						width : 200
					},
					items : [ this.edtTel ]
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
			this.edtDeptCode.setValue(this.xy_Entity.deptCode);
			this.edtDeptName.setValue(this.xy_Entity.deptName);

			this.edtParentCode.setValue(this.xy_Entity.parentCode);
			this.edtParentName.setValue(this.xy_Entity.parentName);

			this.edtFullCode.setValue(this.xy_Entity.fullCode);
			this.edtFullName.setValue(this.xy_Entity.fullName);

			this.cmbStatus.setKeyValue(this.xy_Entity.status);
			this.edtRemark.setValue(this.xy_Entity.memo);

			this.edtAddress.setValue(this.xy_Entity.address);
			this.edtTel.setValue(this.xy_Entity.tel);
			this.edtFax.setValue(this.xy_Entity.fax);
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
			return this.addDept();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateDept();
		}
	},
	validData : function()
	{
		if (this.edtDeptCode.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写部门编码");
			return false;
		}

		if (this.edtDeptName.getValue().trim().isEmpty())
		{
			MsgUtil.alert("请填写部门名称");
			return false;
		}

		return true;
	},
	getDeptEntityData : function()
	{
		this.xy_Entity.deptCode = this.edtDeptCode.getValue().trim();
		this.xy_Entity.deptName = this.edtDeptName.getValue().trim();

		this.xy_Entity.status = this.cmbStatus.getKeyValue();
		this.xy_Entity.memo = this.edtRemark.getValue().trim();

		this.xy_Entity.address = this.edtAddress.getValue().trim();
		this.xy_Entity.tel = this.edtTel.getValue().trim();
		this.xy_Entity.fax = this.edtFax.getValue().trim();
	},
	addDept : function()
	{
		this.getDeptEntityData();

		Ext.Ajax.request(
		{
			url : "sm/dept/add",
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
	updateDept : function()
	{
		this.getDeptEntityData();

		Ext.Ajax.request(
		{
			url : "sm/dept/update",
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