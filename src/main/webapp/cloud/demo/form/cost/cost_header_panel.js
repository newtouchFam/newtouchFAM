Ext.namespace("demo.form.cost");

/**
 * 表单通用主实体面板
 */
demo.form.cost.CostHeaderPanel = Ext.extend(ssc.component.BaseFormHeaderPanel,
{
	initComponent : function()
	{
		this.createControl();

		demo.form.cost.CostHeaderPanel.superclass.initComponent.call(this);
	},
	createControl : function()
	{
		this.edtSerialNo = new Ext.form.TextField(
		{
			id : "serialno",
			fieldLabel : "表单号"
		});

		this.row1 =
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .66,
				layout : "form",
				border : false,
				items : [ this.edtSerialNo ]
			} ]
		};

		this.edtAbstract = new Ext.form.TextField(
		{
			id : "abstract",
			fieldLabel : "报账事由",
			maxLength : 50
		});

		this.row2 =
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .66,
				layout : "form",
				border : false,
				items : [ this.edtAbstract ]
			} ]
		};

		this.items = [ this.row1, this.row2 ];
	}
});