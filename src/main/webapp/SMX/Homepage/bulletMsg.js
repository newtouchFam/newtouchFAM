var m_newBulDs = null;
var m_newBulGrid = null;

function searchNewBulletFailureHandler(response)
{
	top.Ext.MessageBox.alert(response.responseText);
}

function searchNewBulletSuccessHandler(response)
{
	var data = Ext.decode(response.responseText);
	if(data.resultint != '0')
	{
		    var m_RowNum = new Ext.grid.RowNumberer();
			var m_BULLETINID = {header:"公告标识",dataIndex:"BULLETINID",hidden:true,fixed:true};
			var m_DTSTART = {header:"发布日期",dataIndex:"DTSTART",sortable:true,width:80};
			var m_TITLE = {header:"标题",dataIndex:"TITLE",sortable:true,width:150};
			var m_MESSAGE = {header : "内容",dataIndex  :"MESSAGE",sortable:true,width:150 };
		    m_newBulDs = new  Ext.data.JsonStore({url:"SM/getNewMsg.action", root:"data", fields:["BULLETINID","DTSTART","TITLE","MESSAGE"]});
		    var m_newBulcm = new Ext.grid.ColumnModel([m_RowNum,m_BULLETINID,m_DTSTART,m_TITLE,m_MESSAGE]);
		    m_newBulGrid = new Ext.grid.GridPanel({
					  		                                region: 'center',
					  		                                store:m_newBulDs,
													  		selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
													  		colModel:m_newBulcm, 
													  		autoWidth: true,
													  		height: 300,
											  		        autoScroll:true,
													  		loadMask : true,
													  		enableColumnMove:false,
													  		enableHdMenu:false
										        });
			
			
			new Ext.ux.window.MessageWindow({
															autoDestroy: true,
															autoHide: true,
													        closable: true,
													        minWidth: 250,
													        layout:"border",
													        items:[m_newBulGrid],
													        shadow: false,
											                shiftHeader: true,
											                showFx: {
											                    delay: 0, 
											                    duration: 0.85, 
											                    useProxy: false 
											                },
													        width: 250,
													        height:350
											}).show(Ext.getDoc()); 
			
			m_newBulDs.load();
    								        
	}
	else
	{
	}
}

function getTimeIntervalSuccessHandler(response)
{
	/*var data = Ext.decode(response.responseText);
	var task = {
	    run: function(){
	        Ext.Ajax.request({
									url:"SM/searchNewBullet.action",
									success:searchNewBulletSuccessHandler,
									timeout:0
							});
	    },
	    interval: data.timeinterval
	}
	

	Ext.TaskMgr.start(task);*/
}


function init()
{
	Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
	Ext.Ajax.request({
							url:"SM/getTimeInterval.action",
							success:getTimeIntervalSuccessHandler,
							timeout:0
					});
	
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);