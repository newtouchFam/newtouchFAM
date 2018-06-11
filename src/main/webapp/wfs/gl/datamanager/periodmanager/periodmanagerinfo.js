//---------------------子界面---------------
Ext.namespace("wfs.gl.datamanager.periodmanagerinfo");
wfs.gl.datamanager.periodmanagerinfo.PeriodManagerInfoPanel = Ext.extend(Ext.grid.GridPanel,
{	
	id : 'periodmanagerinfopanel',
	frame : false,
	enableColumnMove : false,
	enableHdMenu : false,
	autoHeight : false,
	height : 200,
	border : false,
	autoWidth : true,
	autoScroll : true,
	unitid : null,
	loadMask : true,
	initComponent : function() 
	{
		//定义record
		var record = Ext.data.Record.create([
		    { name : 'uqglobalperiodid'},                               
			{ name : 'varname'}, 
			{ name : 'intyear'},
			{ name : 'intmonth'},
			{ name : 'intstatus'},
			{ name : 'dtbegin'},
			{ name : 'dtend'}]);
		//定义数据集	
		this.store = new Ext.data.JsonStore(
		{	
			totalProperty : "total",
			root : "data",
			url : 'datamanager/periodmanager/get',
			fields : record
		});
		//定义列
		var clnRowNum = new Ext.grid.RowNumberer();
		var uqglobalperiodid =
		{
			header : '会计期id',
			dataIndex : 'uqglobalperiodid',					 
			width : 100	 ,
			hidden : true
		};
		var varname =
		{
			header : '<div style="text-align:center">会计期名称</div>',
			dataIndex : 'varname',					 
			width : 100
		};
		
		var intyear =
		{
			header : '<div style="text-align:center">会计期年份</div>',
			dataIndex : 'intyear',	
			align : "right",
			width : 100
		};
		
		var intmonth =
		{
			header : '<div style="text-align:center">会计期月份</div>',
			dataIndex : 'intmonth',
			align : "right",
			width : 150
		};
		
		var intstatus =
		{
			header : '<div style="text-align:center">会计期状态</div>',
			dataIndex : 'intstatus',
			width : 100,
			renderer : function (val)
			{
				switch(val)
				{
					case 0:
						return '关闭';
					case 1 :
						return '未启用';
					case 2 :
						return '启用';
				}
			}
		};	
		
		var dtbegin =
		{
			header : '<div style="text-align:center">有效开始日期</div>',
			dataIndex : 'dtbegin',
			width : 150
		};
		
		var dtend =
		{
			header : '<div style="text-align:center">有效结束日期</div>',
			dataIndex : 'dtend',
			width : 150
		};	
		
		this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
		
		this.cm = new Ext.grid.ColumnModel([this.sm, clnRowNum, uqglobalperiodid, varname, intyear, intmonth, intstatus,  dtbegin, dtend]);
		
		//this.sm = new Ext.grid.RowSelectionModel({singleSelect : false});

		
		//定义bbar
		this.bbar = new Ext.PagingToolbar(
		{
			border : true,
			pageSize : 20,
			store : this.store,
			displayInfo : true,
			displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
			emptyMsg : "没有记录"
		});
		
		this.loadMask = 
		{
			msg : "数据加载中,请稍等...",
			removeMask : true
		};
		
		wfs.gl.datamanager.periodmanagerinfo.PeriodManagerInfoPanel.superclass.initComponent.call(this);
		
		this.store.load(
		{
			params : 
			{
				start : 0,
				limit : 20
			}
		});
	},
	//给数据加颜色
	viewConfig : 
	{ 
	    getRowClass : function(record,rowIndex,rowParams,store)
	    {
		    //当状态为关闭时，该条数据都显示为红色的，'color'定义在periodmanager.jsp中，这是一个css样式
		     if(record.get("intstatus")==0)
		     {
		    	  return 'color';
		     }
	    }
	}
});