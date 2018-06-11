/*
 * 使窗体随浏览器变化居中的plugin 使用例子： var win = new Ext.Window( { ... plugins:[new
 * Ext.ux.CenterWindowPlugin()] });
 */
Ext.ux.CenterWindowPlugin = function()
{
    this.init = function(win)
    {
        Ext.EventManager.onWindowResize(function()
        {
            if (win.isVisible()) win.center();
        });
    };
};