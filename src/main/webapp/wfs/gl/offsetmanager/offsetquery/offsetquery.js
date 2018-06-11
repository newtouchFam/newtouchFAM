/**
 * 往来查询主界面
 * Author : xtc
 * date   : 2017/12/19
 */
Ext.namespace('gl.offsetmanager.offsetquery');
gl.offsetmanager.offsetquery.mainPanel = Ext.extend(Ext.Panel,
    {
        frame : false,
        border : false,
        layout : 'border',
        initComponent : function ()
        {
            this.rushedinfopanel = new gl.offsetmanager.offsetquery.rushedinfopanel ({region : 'center'});
            this.conditionpanel = new gl.offsetmanager.offsetquery.conditionpanel({region : 'north', rushedinfopanel : this.rushedinfopanel});
            this.items = [this.conditionpanel, this.rushedinfopanel];
            gl.offsetmanager.offsetquery.mainPanel.superclass.initComponent.call(this);

        }
    });

function init()
{
    var mainPanel = new gl.offsetmanager.offsetquery.mainPanel({layout : 'border'});
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