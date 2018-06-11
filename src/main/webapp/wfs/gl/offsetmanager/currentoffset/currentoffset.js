Ext.namespace('gl.offsetmanager.currentoffset');
gl.offsetmanager.currentoffset.mainPanel = Ext.extend(Ext.Panel,
    {
        frame : false,
        border : false,
        layout : 'border',
        initComponent : function ()
        {
            this.onaccountpanel = new gl.offsetmanager.currentoffset.onaccountpanel ({region : 'south',height : 210});
            this.offsetPanel = new gl.offsetmanager.currentoffset.offsetPanel({layout: 'fit',height : 200});
            this.conditionpanel = new gl.offsetmanager.currentoffset.conditionpanel({region : 'north', offsetPanel:this.offsetPanel,onAccountPanel:this.onaccountpanel});
            this.items = [{items:[this.offsetPanel],region : 'center',height:200}, this.conditionpanel,this.onaccountpanel];
            gl.offsetmanager.currentoffset.mainPanel.superclass.initComponent.call(this);

        }
    });

function init()
{
    var mainPanel = new gl.offsetmanager.currentoffset.mainPanel({layout : 'border'});
    new Ext.Viewport(
        {
            layout : 'fit',
            frame : true,
            border : false,
            items : [mainPanel]
        });
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);