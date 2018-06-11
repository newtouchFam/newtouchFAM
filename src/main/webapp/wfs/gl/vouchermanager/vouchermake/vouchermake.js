Ext.namespace('gl.vouchermanager.vouchermake');

/**
 * 凭证录入界面
 */
function init()
{
	var vouchermakedetail = new gl.vouchermanager.vouchermake.vouchermakedetail();
	new Ext.Viewport(
	{
        layout : 'fit',
		items : [vouchermakedetail]
	});
	
	vouchermakedetail.addListener("rowdblclick", vouchermakedetail.detailHandler.createDelegate(this));
	
	var vouchermain = new gl.vouchermanager.vouchermake.vouchermain({layout : 'border',vouchertag : '0'});
	
	var win = new Ext.Window(
	{
		title : "凭证",
		layout : 'fit',
		id : "voucherwin",
        frame : true,
        width : 800,
//      height : 400,
        height : 455,
        modal:true,
        border : false,
		items : [vouchermain]
	});
	
	Ext.getCmp("vouchermakedetail").getStore().load(
	{
		params : 
		{
			start : 0,
			limit : 20
		}
	});
	
	win.show();
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);