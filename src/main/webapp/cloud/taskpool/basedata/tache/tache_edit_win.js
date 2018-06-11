Ext.namespace("ssc.taskpool.basedata.Tache");

ssc.taskpool.basedata.Tache.TacheEditWin = Ext.extend(ssc.component.BaseDialog,
{
	title : "新增任务池",
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
			
		ssc.taskpool.basedata.Tache.TacheEditWin.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.edtTacheCode = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("任务池编码")
		});
		this.edtTacheName = new Ext.form.TextField(
		{
			fieldLabel : ssc.common.StringUtil.setKeyFieldLabel("任务池名称")
		});
		this.textareaRemark = new Ext.form.TextArea(
		{
			fieldLabel : "备注",
			height : 60
		});
		this.cmbTackeType = new ssc.component.BaseSimpleComboBox(
		{
			fieldLabel : "业务类型",
			xy_DataArray : RenderMapData.SSC.TacheType
		});

		this.mainFormPanel = new Ext.form.FormPanel(
		{
			frame : true,
			autoWidth : true,
			labelAlign : "right",
			labelWidth : 100,
			defaults :
			{
				width : 200
			},
			items : [ this.edtTacheCode,
			          this.edtTacheName,
			          this.textareaRemark,
			          this.cmbTackeType ]
		});

		this.items = [ this.mainFormPanel ];
	},
	initData : function()
	{
		if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Add)
		{
			this.title = "新增任务池";
			this.cmbTackeType.setKeyValue(0);
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			this.title = "修改任务池";
			this.edtTacheCode.setValue(this.xy_Entity.tacheCode);
			this.edtTacheName.setValue(this.xy_Entity.tacheName);
			this.textareaRemark.setValue(this.xy_Entity.remark);
			this.cmbTackeType.setKeyValue(this.xy_Entity.tacheType);
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
			return this.addTache();
		}
		else if (this.xy_EditMode === ssc.component.DialogEditModeEnum.Update)
		{
			return this.updateTache();
		}
	},
	validData : function()
	{
		var strTacheCode = this.edtTacheCode.getValue().trim();
		var strTacheName = this.edtTacheName.getValue().trim();

		if (strTacheCode.isEmpty())
		{
			MsgUtil.alert("请填写任务池编码!");
			return false;
		}

		if (strTacheName.isEmpty())
		{
			MsgUtil.alert("请填写任务池名称!");
			return false;
		}

		return true;
	},
	addTache : function()
	{
		this.xy_Entity.tacheCode = this.edtTacheCode.getValue().trim();
		this.xy_Entity.tacheName = this.edtTacheName.getValue().trim();
		this.xy_Entity.remark = this.textareaRemark.getValue();
		this.xy_Entity.tacheType = this.cmbTackeType.getKeyValue();

		Ext.Ajax.request(
		{
			url : "SSC/ssc_TacheAction!add.action",
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
	updateTache : function()
	{
		this.xy_Entity.tacheCode = this.edtTacheCode.getValue().trim();
		this.xy_Entity.tacheName = this.edtTacheName.getValue().trim();
		this.xy_Entity.remark = this.textareaRemark.getValue();
		this.xy_Entity.tacheType = this.cmbTackeType.getKeyValue();

		Ext.Ajax.request(
		{
			url : "SSC/ssc_TacheAction!update.action",
			method : "post",
			sync : true,
			params :
			{
				jsonString : Ext.encode(this.xy_Entity)
			},
			success : this.baseSuccessCallbackFun,
			failure : this.baseFailureCallbackFun,
			scope : this
		});

		return this.m_ModalResult;
	}
});