Ext.namespace("ssc.smcs.form.common");

ssc.form.common.CheckHistoryPanel = Ext.extend(Ext.form.FieldSet,
{
	title : '审批历史',
	collapsible : true,
	autoHeight : true,
	initComponent : function()
	{
		this.createControl();
		ssc.form.common.CheckHistoryPanel.superclass.initComponent.call(this);
		this.getStore().on("loadexception", this.loadexception);
		this.grid.load();
	},
	getStore : function()
	{
		return this.grid.getStore();
	},
	createControl : function()
	{
		this.grid = new Ext.grid.XyCheckHistoryGridPanel(
		{
			direction : "ASC",
			processinstID : this.processInstID,
			autoHeight : true,
			autoScroll : true,
			enableColumnMove : false,
			enableHdMenu : false,
			border : false,
			iconCls : 'xy-grid',
			loadMask :
			{
				msg : "数据加载中，请稍等..."
			}
		});

		this.items = [
		{
			layout : 'column',
			border : false,
			items : [
			{
				columnWidth : 1,
				layout : 'fit',
				items : [ this.grid ]
			} ]
		} ];
	},
	getPrintData : function()
	{
		var data = new Array();
		for ( var i = 0, j = this.getStore().data.length; i < j; i++)
		{
			var json = {};
			for ( var m = 1, n = this.grid.colModel.getColumnCount(); m < n; m++)
			{
				var key = this.grid.colModel.getDataIndex(m);
				json[key] = this.getStore().getAt(j - 1 - i).get(this.grid.colModel.getDataIndex(m));
			}
			data.push(json);
		}
		return data;
	}
});
