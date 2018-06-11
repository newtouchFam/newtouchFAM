Ext.namespace("ssc.component");

ssc.component.CostCenterListDialog = Ext.extend(ssc.component.BaseListDialog,
{
	title : "成本中心选择",
	width : 400,
	height : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/em8_CostCenterAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : true,
	xy_KeyField : "ccID",
	xy_DisplayField : "ccName",
	xy_FieldList : [ "ccID", "ccCode", "ccName" ],
	xy_ColumnConfig : [
	{
		header : "成本中心编码",
		dataIndex : "ccCode",
		width : 150,
		sortable : true
	},
	{
		header : "成本中心名称",
		dataIndex : "ccName",
		width : 200,
		sortable : true
	} ]
});
		
/**
 * 分单位选择部门
 */
ssc.component.CostCenterListByUnitDialog = Ext.extend(ssc.component.CostCenterListDialog,
{
	xy_InitExpand : false,
	/* 默认单位ID */
	xy_UnitID : "",
	/* 默认单位名称 */
	xy_UnitText : "",
	/* 是否已经加载过 */
	m_Loaded : true,
	initComponent : function()
	{
		if (this.xy_UnitID == null || this.xy_UnitID == undefined || this.xy_UnitID.trim() == "")
		{
			this.xy_InitExpand = false;
		}
		else
		{
			this.xy_InitExpand = true;
		}

		this.cmbUnit = new ssc.component.UnitComboBoxTree(
		{
			width : 200,
			emptyText : "请先选择单位",
			xy_AllowClear : false,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function()
			{
				var condition = new ssc.common.BaseCondition();
				if (this.cmbUnit.getSelected())
				{
					condition.addString("unitid", this.cmbUnit.getKeyValue());
				}

				this.xy_BaseParams = condition;

				this.loadStoreData(false);
			}
		});
		this.tbar = new Ext.Toolbar(
		{
			items : [ "单位：", this.cmbUnit ]
		});
		
		ssc.component.CostCenterListByUnitDialog.superclass.initComponent.call(this);

		if (this.xy_UnitID == null || this.xy_UnitID == undefined || this.xy_UnitID.trim() == "")
		{
			this.cmbUnit.setInitValue(this.xy_UnitID, this.xy_UnitText);
		}
	}
});