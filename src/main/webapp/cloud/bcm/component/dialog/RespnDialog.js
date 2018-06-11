Ext.namespace("ssc.component");

/**
 * 责任中心
 */
bcm.component.RespnTreeDialog = Ext.extend(ssc.component.BaseTreeDialog,
{
	/* 默认值 */
	title : "责任中心选择",
	xy_RootTitle : "选择责任中心",
	xy_LeafOnly : false,
	xy_DataActionURL : "bcm/respn/tree"
});
Ext.reg("bcm.component.respntreedialog", bcm.component.RespnTreeDialog);

/**
 * 责任中心（关联下级）
 */
bcm.component.RespnTreeDialogLink = Ext.extend(bcm.component.RespnTreeDialog,
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

		bcm.component.RespnTreeDialogLink.superclass.initComponent.call(this);

		this.chbLink.on("check", this.onCheckBoxCheckEvent, this);
	},
	onCheckBoxCheckEvent : function(/*Ext.form.Checkbox*/ _This, /*Boolean*/ checked)
	{
		this.m_Tree.xy_LinkLower = checked;
	}
});
Ext.reg("bcm.component.respntreedialoglink", bcm.component.RespnTreeDialogLink);