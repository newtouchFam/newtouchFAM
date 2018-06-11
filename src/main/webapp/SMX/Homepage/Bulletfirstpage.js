Ext.namespace('com.freesky.ssc.form.system');
com.freesky.ssc.form.system.Bulletfirstpage = Ext.extend(Ext.grid.GridPanel, {
	border : false,
	enableColumnMove : false,
	enableHdMenu : false,
	iconCls : 'xy-grid',
	getStore : function () {
		if (this.store === undefined || this.store == null) {
			this.store = new Ext.data.JsonStore({
				url:"SM/getNewMsg.action", 
				totalProperty : "total",
				root:"data", 
				fields:["BULLETINID","DTSTART","TITLE","MESSAGE"]
		    });
		}
		return this.store;
    },
    initComponent : function() {
    	var m_RowNum = new Ext.grid.RowNumberer();
		var m_BULLETINID = {header:"公告标识",dataIndex:"BULLETINID",hidden:true,fixed:true};
		var m_DTSTART = {header:"发布日期",dataIndex:"DTSTART",sortable:true,width:80};
		var m_TITLE = {header:"标题",dataIndex:"TITLE",sortable:true,width:150};
		var m_MESSAGE = {header : "内容",dataIndex  :"MESSAGE",sortable:true,width:550 };
		var m_newBulcm = new Ext.grid.ColumnModel([m_RowNum,m_BULLETINID,m_DTSTART,m_TITLE,m_MESSAGE]);
		this.store = this.getStore();
		this.selModel= new Ext.grid.RowSelectionModel({singleSelect:true});
		this.colModel=m_newBulcm;
		this.bbar = new Ext.PagingToolbar({
			border : true,
			pageSize : 10,
			store : this.getStore(),
			displayInfo : true,
			displayMsg : '一共 {2}条',
			emptyMsg : "没有记录"
		});
		this.on("click", this.bulletclick.createCallback(this));
		com.freesky.ssc.form.system.Bulletfirstpage.superclass.initComponent.call(this);
//		this.getStore().load();
    },
    bulletclick : function(scope) {
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
});