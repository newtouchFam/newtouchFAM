Ext.namespace('gl.vouchermanager.voucherquery');
gl.vouchermanager.voucherquery.voucherquerymain = Ext.extend(Ext.Panel,
{
	frame : false,
    border : false,
    layout : 'border',
    vouchertag : null,
    initComponent : function ()
	{
    	this.voucherquerydetail = new gl.vouchermanager.voucherquery.voucherquerydetail({region : 'center'});
    	this.voucherquerycondition = new gl.vouchermanager.voucherquery.voucherquerycondition({region : 'north', voucherquerydetail:this.voucherquerydetail});
    	this.items = [this.voucherquerycondition, this.voucherquerydetail];
    	gl.vouchermanager.voucherquery.voucherquerymain.superclass.initComponent.call(this);
    	
    	this.voucherquerydetail.addListener("rowdblclick", this.voucherquerycondition.detailHandler.createDelegate(this));
	}
});

function init()
{
	var voucherquerymain = new gl.vouchermanager.voucherquery.voucherquerymain({layout : 'border'});
	new Ext.Viewport(
	{
        layout : 'fit',
        frame : true,
        border : false,
		items : [voucherquerymain]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);