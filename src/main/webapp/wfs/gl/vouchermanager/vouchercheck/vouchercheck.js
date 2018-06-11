Ext.namespace('gl.vouchermanager.vouchercheck');
gl.vouchermanager.vouchercheck.vouchercheckmain = Ext.extend(Ext.Panel,
{
	frame : false,
    border : false,
    layout : 'border',
    vouchertag : null,
    initComponent : function ()
	{
    	this.vouchercheckdetail = new gl.vouchermanager.vouchercheck.vouchercheckdetail({region : 'center'});
    	this.vouchercheckcondition = new gl.vouchermanager.vouchercheck.vouchercheckcondition({region : 'north', vouchercheckdetail:this.vouchercheckdetail});
    	this.items = [this.vouchercheckcondition, this.vouchercheckdetail];
    	gl.vouchermanager.vouchercheck.vouchercheckmain.superclass.initComponent.call(this);
    	
    	this.vouchercheckdetail.addListener("rowdblclick", this.vouchercheckcondition.detailHandler.createDelegate(this));
	}
});

function init()
{
	var vouchercheckmain = new gl.vouchermanager.vouchercheck.vouchercheckmain({layout : 'border'});
	new Ext.Viewport(
	{
        layout : 'fit',
        frame : true,
        border : false,
		items : [vouchercheckmain]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);