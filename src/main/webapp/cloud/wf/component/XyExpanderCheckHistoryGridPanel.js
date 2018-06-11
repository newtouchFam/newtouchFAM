Ext.grid.XyCheckHistoryGridPanel = Ext.extend(Ext.grid.GridPanel, {
	processinstID : "",
	direction : "ASC",
	initComponent : function() {
		Ext.grid.XyCheckHistoryGridPanel.superclass.initComponent.call(this);
		this.autoScroll = false;
		this.autoWidth = false;
		if (Ext.isArray(this.columns)) {
			this.colModel = new Ext.grid.ColumnModel(this.columns);
			delete this.columns
		}
		this.store = new Ext.data.JsonStore({
			url : "wf/checkhistory/list",
			root : "data",
			sortInfo: {field: "checkstep", direction: this.direction} ,
			fields : ["checkid", "checkstep", "activityname", "checkdesc", "displayname", "checktime", "isagree", "checkdesc"]
		});
		this.store.on("loadexception", showExtLoadException);
		var clnCheckID = {header: "ID", dataIndex: "checkid", hidden: true};
		var clnStep = {header: "步骤", dataIndex: "checkstep", width:65, resizable: false, sortable: true};
		var clnActivity = {header: "环节名称", dataIndex: "activityname", width:180, resizable: true, sortable: true};
		var clnAc = {header: "审批意见", dataIndex: "checkdesc", width:300, sortable: true,renderer:renderDesc};
		var clnUser = {header: "审批者", dataIndex: "displayname", width:80, sortable: true};
		var clnTime = {header: "审批时间", dataIndex: "checktime", width:125, sortable: true};
		var clnType = {header: "类型", dataIndex: "isagree", width:80, sortable: true, renderer: this.onTypeRender};
		this.cm = new Ext.grid.ColumnModel([clnCheckID, clnStep, clnActivity, clnUser,clnTime, clnType, clnAc]);
		this.sm = new Ext.grid.RowSelectionModel({singleSelect : true});	

		if (this.cm) {
			this.colModel = this.cm;
			delete this.cm
		}
		if (this.sm) {
			this.selModel = this.sm;
			delete this.sm
		}
		this.addEvents("click", "dblclick", "contextmenu", "mousedown",
				"mouseup", "mouseover", "mouseout", "keypress", "keydown",
				"cellmousedown", "rowmousedown", "headermousedown",
				"cellclick", "celldblclick", "rowclick", "rowdblclick",
				"headerclick", "headerdblclick", "rowcontextmenu",
				"cellcontextmenu", "headercontextmenu", "bodyscroll",
				"columnresize", "columnmove", "sortchange");
	},
	onTypeRender : function (s)
	{
		switch(s)
		{
			case 0:
				return "拒绝";
			case 1:
				return "同意";
			case 2:
				return "转发";
			case 3:
				return "转拟办";
			case 4:
				return "修改数据";
			case 11:
				return "转拟办提交";
			default:
				return "其他";
		}
	},
	load : function() {
		this.store.load({params: {processInstID: this.processinstID}});
	}
});

function renderDesc(value, metadata, record){ 
	metadata.attr = 'style="white-space:normal;"'; 
	return value; 
} 

Ext.reg("grid", Ext.grid.XyCheckHistoryGridPanel);