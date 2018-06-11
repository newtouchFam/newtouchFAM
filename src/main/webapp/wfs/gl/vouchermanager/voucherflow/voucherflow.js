Ext.namespace('gl.vouchermanager.voucherflow');
gl.vouchermanager.voucherflow.voucherflowmain = Ext.extend(Ext.Panel,
{
	frame : false,
    border : false,
    layout : 'border',
    initComponent : function ()
	{
    	this.voucherflowdetail = new gl.vouchermanager.voucherflow.voucherflowdetail({region : 'center'});
    	this.voucherflowcondition = new gl.vouchermanager.voucherflow.voucherflowcondition({region : 'north', voucherflowdetail:this.voucherflowdetail});
    	this.items = [this.voucherflowcondition, this.voucherflowdetail];
    	
    	gl.vouchermanager.voucherflow.voucherflowmain.superclass.initComponent.call(this);
    	
    	this.voucherflowdetail.addListener("rowdblclick", this.voucherflowcondition.queryVoucherHandler.createDelegate(this));
	}
});

function init()
{
	var voucherflowmain = new gl.vouchermanager.voucherflow.voucherflowmain({layout : 'border'});
	new Ext.Viewport(
	{
        layout : 'fit',
        frame : true,
        border : false,
		items : [voucherflowmain]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);