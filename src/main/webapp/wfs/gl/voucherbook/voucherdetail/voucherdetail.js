Ext.namespace("gl.voucherbook.voucherdetail");
gl.voucherbook.voucherdetail.voucherDetailPanel = Ext.extend(Ext.Panel,
{
	frame : true,
	layout : 'fit',
    width : 800,
    modal : true,
    height : 400,
    border : false,
    initComponent : function ()
	{
    	var getparam = this.parseurl();
    	
    	var vouchermain = new gl.vouchermanager.vouchermake.vouchermain({isView : true, layout : 'border', vouchertag : '1', voucherid : getparam['voucherid']});
		
		this.items = [vouchermain];
		
    	gl.voucherbook.voucherdetail.voucherDetailPanel.superclass.initComponent.call(this);
    	
	},
	
	//获取url带过来的参数
	parseurl : function(){
        var url=location.href;
        var i=url.indexOf('?'); //记录'?'的下标
        if(i==-1) //当i==-1,说明没有传参
        {
        	return;
        }
        var querystr=url.substr(i+1);//截取所有的参数
        var arr1=querystr.split('&');//将所有的参数都分开
        var arr2=new Object();
        for  (var m = 0;m < arr1.length; m++){ //循环参数
            var ta=arr1[m].split('='); //将每一个参数都用=分开 
            arr2[ta[0]]=ta[1];  //将参数以key-value的形式放进新的对象
        }
        return arr2;
    }
});

function init()
{
	new Ext.Viewport(
	{
        layout : 'fit',
        frame : true,
        border : false,
		items : [new gl.voucherbook.voucherdetail.voucherDetailPanel]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);