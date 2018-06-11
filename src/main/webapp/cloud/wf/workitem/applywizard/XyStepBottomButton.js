Ext.XyStepBottomButton = Ext.extend(Ext.Button,
{
	text : "按钮",
	initComponent : function()
	{
		this.pressed = false;
		this.menu = false;
		this.enableToggle = false;
		this.pressed = false;

		Ext.XyStepBottomButton.superclass.initComponent.call(this);
	}
});
Ext.reg("xystepbottombutton", Ext.XyStepBottomButton);