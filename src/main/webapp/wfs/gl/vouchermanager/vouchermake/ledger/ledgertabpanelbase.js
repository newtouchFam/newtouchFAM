Ext.namespace('gl.vouchermanager.vouchermake');
gl.vouchermanager.vouchermake.ledgertabpanelbase = Ext.extend(Ext.Panel, 
{
	autoHeight : true,
	labelAlign : 'right',
	border : false,
	frame : false,
	listeners : 
	{
		activate : function() 
		{
			this.doLayout();
		}
	},
	initComponent : function() 
	{
		gl.vouchermanager.vouchermake.ledgertabpanelbase.superclass.initComponent.call(this);
	},
	createControl : Ext.emptyFn,
	validate : Ext.emptyFn
});
