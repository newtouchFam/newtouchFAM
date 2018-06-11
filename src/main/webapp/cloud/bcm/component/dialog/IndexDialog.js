Ext.namespace("bcm.component");

/**
 * 预算项目
 */
bcm.component.IndexTreeDialog = Ext.extend(ssc.component.BaseTreeDialog,
{
	/* 默认值 */
	title : "预算项目选择",
	xy_RootTitle : "选择预算项目",
	xy_LeafOnly : false,
	xy_DataActionURL : "bcm/index/tree"
});
Ext.reg("bcm.component.indextreedialog", bcm.component.IndexTreeDialog);

/**
 * 预算项目（关联下级）
 */
bcm.component.IndexTreeDialogLink = Ext.extend(bcm.component.IndexTreeDialog,
{
	initComponent : function()
	{
		this.chbLink = new Ext.form.Checkbox(
		{
			fieldLabel : "关联下级",
			labelSeparator : ":",
			checked : true
		});

		this.tbar = new Ext.Toolbar(
		{
			items : [ "关联下级：", this.chbLink ]
		});

		bcm.component.IndexTreeDialogLink.superclass.initComponent.call(this);

		this.chbLink.on("check", this.onCheckBoxCheckEvent, this);
	},
	onCheckBoxCheckEvent : function(/*Ext.form.Checkbox*/_This, /*Boolean*/checked)
	{
		this.m_Tree.xy_LinkLower = checked;
	}
});
Ext.reg("bcm.component.indextreedialoglink", bcm.component.IndexTreeDialogLink);