Ext.namespace("bcm.config.RespnDept");

bcm.config.RespnDept.RespnDeptEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增对应关系",
	height : 250,
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

		bcm.config.RespnDept.RespnDeptEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtCaseCode = new Ext.form.TextField(
		{
			fieldLabel : "预算方案"
		});

		this.tgfieldRespn = new bcm.component.RespnTreeField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("责任中心"),
			xy_LeafOnly : false,
			xy_MultiSelectMode : false,
			xy_ParentObjHandle : this,
			xy_BaseParams : { casecode : this.xy_Entity.caseCode }
		});

		this.tgfieldDept = new sm.component.DeptTreeByUnitField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("部门"),
			xy_LeafOnly : false,
			xy_MultiSelectMode : false,
			xy_ParentObjHandle : this
		});

		this.mainFormPanel = new Ext.form.FormPanel(
		{
			frame : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 120,
			defaults :
			{
				width : 200
			},
			items : [ this.edtCaseCode,
			          this.tgfieldRespn,
			          this.tgfieldDept ]
		});

		this.items = [ this.mainFormPanel ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "新增对应关系";
			this.edtCaseCode.setValue(this.xy_Entity.caseCode);
			this.edtCaseCode.setReadOnly(true);
		}
	},
	baseConfirmValid : function()
	{
		if (!this.validData())
		{
			return false;
		}

		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			return this.addRespnDept();
		}
	},
	validData : function()
	{
		if (this.tgfieldRespn.getSelectedCount() <= 0)
		{
			MsgUtil.alert("请选择资金责任中心");
			return false;
		}

		if (this.tgfieldDept.getSelectedCount() <= 0)
		{
			MsgUtil.alert("请选择部门");
			return false;
		}

		return true;
	},
	addRespnDept : function()
	{
		this.xy_Entity.respnID = this.tgfieldRespn.getSelectedID();
		this.xy_Entity.deptID = this.tgfieldDept.getSelectedID();

		Ext.Ajax.request(
		{
			url : "bcm/respndept/add",
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