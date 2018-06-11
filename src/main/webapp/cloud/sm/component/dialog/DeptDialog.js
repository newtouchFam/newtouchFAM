Ext.namespace("sm.component");

sm.component.DeptTreeDialog = Ext.extend(ssc.component.BaseTreeDialog,
{
	title : "部门选择",
	width : 400,
	height : 300,
	xy_DataActionURL : "sm/dept/tree",
	xy_RootTitle : "选择部门",
	xy_LeafOnly : false,
	xy_MultiSelectMode : false
});

/**
 * 分单位选择部门
 */
sm.component.DeptTreeByUnitDialog = Ext.extend(sm.component.DeptTreeDialog,
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

		this.cmbUnit = new sm.component.UnitTreeComboBox(
		{
			width : 200,
			emptyText : "请先选择单位",
			xy_AllowClear : false,
			xy_ParentObjHandle : this,
			xy_ValueChangeEvent : function()
			{
				this.m_Tree.enable();

				var condition = new ssc.common.BaseCondition();
				if (this.cmbUnit.getSelected())
				{
					condition.addString("unitid", this.cmbUnit.getKeyValue());
				}

				this.m_Tree.xy_BaseParams = condition;
				this.m_Tree.xy_InitExpand = true;

				if (this.m_Tree.getRootNode().childNodes.length <= 0)
				{
					this.m_Tree.getRootNode().expand();
				}
				else
				{
					this.loadStoreData(false);
				}
			}
		});
		this.tbar = new Ext.Toolbar(
		{
			items : [ "单位：", this.cmbUnit ]
		});
		
		sm.component.DeptTreeByUnitDialog.superclass.initComponent.call(this);

		if (this.xy_UnitID == null || this.xy_UnitID == undefined || this.xy_UnitID.trim() == "")
		{
			this.m_Tree.disable();
			this.cmbUnit.setInitValue(this.xy_UnitID, this.xy_UnitText);
		}
	}
});