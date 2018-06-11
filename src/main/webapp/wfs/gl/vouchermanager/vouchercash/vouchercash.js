Ext.namespace('gl.vouchermanager.vouchercash');
gl.vouchermanager.vouchercash.vouchercashmain = Ext.extend(Ext.Panel,
{
	frame : false,
    border : false,
    layout : 'border',
    vouchertag : null,
    initComponent : function ()
	{
    	this.vouchercashdetail = new gl.vouchermanager.vouchercash.vouchercashdetail({region : 'center'});
    	this.vouchercashcondition = new gl.vouchermanager.vouchercash.vouchercashcondition({region : 'north', vouchercashdetail:this.vouchercashdetail});
    	this.items = [this.vouchercashcondition, this.vouchercashdetail];
    	gl.vouchermanager.vouchercash.vouchercashmain.superclass.initComponent.call(this);
    	
    	this.vouchercashdetail.addListener("rowdblclick", this.vouchercashcondition.detailHandler.createDelegate(this));
	}
});

function init()
{
	var vouchercashmain = new gl.vouchermanager.vouchercash.vouchercashmain({layout : 'border'});
	new Ext.Viewport(
	{
        layout : 'fit',
        frame : true,
        border : false,
		items : [vouchercashmain]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);