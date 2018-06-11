Ext.namespace('com.freesky.ssc.form.system');
com.freesky.ssc.form.system.NewBulletfirstpage = Ext.extend(Ext.Panel, {
	id : "Bulletfirstpage",
	autoHeight : true,
    labelAlign : 'right',
    bodyStyle : 'padding:5px 5px 5px 5px',
    border : false,
    frame : false,
    param : null,
    count : 0,
    listeners :
    {
        activate : function()
        {
            this.doLayout();
        }
    },
	initComponent : function() {
    	initData();
    	this.on("click", bulletclick);
		com.freesky.ssc.form.system.NewBulletfirstpage.superclass.initComponent.call(this);
	}
});
bulletclick = function(scope) {
	var frameId = "frame_" + "LeftButtonSM_SelfBulletin";
	var sheetId = "ext_sheet_" + frameId;
	
	var oframe = top.Ext.get(frameId);		
	if (oframe == null)
	{
		var sframe = "<iframe id='" + frameId + "' name='" + frameId + "' src='SMX/bulletInBoard/newBulletInfo.jsp' width='100%' height='100%' frameborder=0>";
		top.m_funcAreaTabs.add({id:sheetId, title:"公告", closable:true, html:sframe});
	}
	else
	{
		oframe.dom.src = 'SMX/bulletInBoard/newBulletInfo.jsp';
	}
	
	var sheet = top.m_funcAreaTabs.getItem(sheetId);
	top.m_funcAreaTabs.setActiveTab(sheet);
}
initData = function(){
	
	Ext.Ajax.request(
	{
		url : "SM/getNewMsg.action",
		params : "",
		success : function(response) 
		{
			var backJson = Ext.decode(response.responseText);
			if(backJson.data.length>0)
			{
				
				var index = 0;
				updateBodyInfo(response.responseText,index);
				return;
			}
			else
			{
				setTimeout(initData, 2000000);
			}
		}.createDelegate(this),
		failure : function(response) 
		{
			return;
		}
	});
	
}

updateBodyInfo = function(str_date,index) {
	str_date = str_date.replace("\r\n\r\n", "");
	var data = Ext.decode(str_date).data;
	if(index == data.length){
		initData();
		return true;
	}
	var paddNum = function(num){
	    num += "";
	    return num.replace(/^(\d)$/,"0$1");
	}
	var date = new Date(data[index].DTSTART);
	var str = data[index].TITLE + "("+data[index].USERDISPLAY +" "+ date.getFullYear()+"/"+paddNum(date.getMonth() + 1)+"/"+ paddNum(date.getDate())+ ")";
	var html = "<marquee onclick='bulletclick()' id='affiche' align='left' behavior='scroll'  direction=left "
			+ " height='100%' width='100%' loop='-1' scrollamount='10' scrolldelay='150'> "
			+ "<a ><font size=+1 color=black >"+str+"</font></a></marquee> ";
	Ext.getCmp("Bulletfirstpage").body.update(html);
	index++;
	setTimeout("updateBodyInfo('"+str_date+"',"+index+")", 20000);
};

