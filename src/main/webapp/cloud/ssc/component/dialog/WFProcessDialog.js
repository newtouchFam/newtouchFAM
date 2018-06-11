Ext.namespace("ssc.component");

/**
 * 流程选择
 */
ssc.component.WFProcessBaseDialog = Ext.extend(ssc.component.BaseListDialog,
{
	/* 默认值 */
	title : "流程选择",
	width : 500,
	height : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_WFProcessAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : true,
	xy_KeyField : "processID",
	xy_DisplayField : "processName",
	xy_FieldList : [ "processID", "processName", "processDesc",
	                 "processTypeID", "processTypeName",
	                 "beginDate", "endDate",
	                 "creatorID", "creatorCode", "creatrorName",
	                 "createDate",
	                 "lastEditorID", "lastEditorCode", "lastEditorName",
	                 "lastEditDate",
	                 "isValid" ],
	xy_ColumnConfig : [
	{
		header : "流程名称",
		dataIndex : "processName",
		width : 120,
		sortable : true
	},
	{
		header : "流程描述",
		dataIndex : "processDesc",
		width : 120,
		sortable : true
	},
	{
		header : "流程类型",
		dataIndex : "processTypeName",
		width : 120,
		sortable : true
	},
	{
		header : "启用时间",
		dataIndex : "beginDate",
		width : 120,
		sortable : true
	},
	{
		header : "失效时间",
		dataIndex : "endDate",
		width : 120,
		sortable : true
	},
	{
		header : "创建人",
		dataIndex : "creatrorName",
		width : 80,
		sortable : true
	},
	{
		header : "创建时间",
		dataIndex : "creatrDate",
		width : 120,
		sortable : true
	},
	{
		header : "更新人",
		dataIndex : "lastEditorName",
		width : 80,
		sortable : true
	},
	{
		header : "更新时间",
		dataIndex : "lastEditDate",
		width : 120,
		sortable : true
	},
	{
		header : "是否验证",
		dataIndex : "isValid",
		width : 120,
		renderer : ssc.common.RenderUtil.YesOrNo_RedNo,
		sortable : true
	} ]
});
Ext.reg("ssc.component.wfprocessbasedialog", ssc.component.WFProcessBaseDialog);

/**
 * 分类型流程选择
 */
ssc.component.WFProcessDialog = Ext.extend(ssc.component.WFProcessBaseDialog,
{
	xy_InitLoadData : false,
	xy_PageMode : true,
	xy_MultiSelectMode : true,
	initComponent : function()
	{
		this.cmbProcessType = new ssc.component.WFProcessTypeComboBoxTree(
		{
			width : 150,
			emptyText : "不选即全部流程"
		});
		this.edtProcessName = new Ext.form.TextField(
		{
			width : 100,
			emptyText : "请输入名称或描述"
		});
		this.tbar = new Ext.Toolbar(
		{
			items : [ "流程类型：", this.cmbProcessType, "-", "流程名称：", this.edtProcessName, "-",
			{
				text : "查询",
				iconCls : "xy-view-select",
				handler : this.btn_QueryEvent,
				scope : this
			}, "-" ]
		});
		sm.component.UserUnitDialog.superclass.initComponent.call(this);
	},
	btn_QueryEvent : function()
	{
		var condition = new ssc.common.BaseCondition();

		if (this.cmbProcessType.getSelected())
		{
			condition.addString("processtypeid", this.cmbProcessType.getKeyValue());
		}

		if (this.edtProcessName.getValue().trim().length > 0)
		{
			condition.addString("processname", this.edtProcessName.getValue().trim());
		}

		this.xy_BaseParams = condition;

		this.loadStoreData(true);
	}
});
Ext.reg("ssc.component.wfprocessdialog", ssc.component.WFProcessDialog);