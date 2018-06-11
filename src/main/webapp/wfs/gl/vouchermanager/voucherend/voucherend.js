Ext.namespace('gl.vouchermanager.voucherend');
gl.vouchermanager.voucherend.voucherendmain = Ext.extend(Ext.Panel,
{
	frame : false,
    border : false,
    layout : 'border',
    vouchertag : null,
    initComponent : function ()
	{
    	this.voucherenddetail = new gl.vouchermanager.voucherend.voucherenddetail({region : 'center'});
    	this.voucherendcondition = new gl.vouchermanager.voucherend.voucherendcondition({region : 'north', voucherenddetail:this.voucherenddetail});
    	this.items = [this.voucherendcondition, this.voucherenddetail];
    	gl.vouchermanager.voucherend.voucherendmain.superclass.initComponent.call(this);
    	
    	this.voucherenddetail.addListener("rowdblclick", this.voucherendcondition.detailHandler.createDelegate(this));
	}
});

function init()
{
	var voucherendmain = new gl.vouchermanager.voucherend.voucherendmain({layout : 'border'});
	new Ext.Viewport(
	{
        layout : 'fit',
        frame : true,
        border : false,
		items : [voucherendmain]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);