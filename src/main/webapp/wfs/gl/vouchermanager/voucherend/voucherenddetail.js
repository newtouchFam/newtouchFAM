Ext.namespace('gl.vouchermanager.voucherend');
gl.vouchermanager.voucherend.voucherenddetail = Ext.extend(Ext.grid.GridPanel,
{
	region : "center",
	//列是否能移动
	enableColumnMove : false,
	//是否显示列菜单
	enableHdMenu : false,
	//是否隐藏滚动条
	autoHeight : false,
	autoScroll : true,
	store : null,
	frame : false,
	border : false,
	initComponent : function ()
	{
		var record = Ext.data.Record.create([
		{ name : 'voucherid'},
		{ name : 'uqnumbering'},
		{ name : 'intcompanyseq'},
		{ name : 'intvouchernum'},
		{ name : 'dtfiller'},
		{ name : 'mnydebitsum'},
		{ name : 'linenumber'},
		{ name : 'uqfillerid'},
		{ name : 'dtchecker'},
		{ name : 'uqcheckerid'},
		{ name : 'dtcasher'},
		{ name : 'uqcasherid'},
		{ name : 'dtaccountant'},
		{ name : 'uqaccountantid'}]);
		
		var voucherid = 
		{
			hidden : true,
			dataIndex : "voucherid"
		};
		
		var uqnumbering =
		{
			header : '<div style="text-align:center">凭证字</div>',
			dataIndex : "uqnumbering",
			width : 75
		};
		
		var intcompanyseq =
		{
			header : '<div style="text-align:center">流水号</div>',
			dataIndex : "intcompanyseq",
			align : "right",
			width : 60
		};
		
		var intvouchernum =
		{
			header : '<div style="text-align:center">凭证编号</div>',
			dataIndex : "intvouchernum",
			width : 100
		};
		
		var dtfiller =
		{
			header : '<div style="text-align:center">制证日期</div>',
			dataIndex : "dtfiller",
			format : 'Y-m-d',
			align : "right",
			width : 80
		};
		
		var mnydebitsum =
		{
			header : '<div style="text-align:center">金额</div>',
			dataIndex : "mnydebitsum",
			css : 'text-align:right;',
			renderer : Ext.app.XyFormat.cnMoneyEx,
			width : 100
		};
		
		var linenumber =
		{
			header : '<div style="text-align:center">附件数</div>',
			dataIndex : "linenumber",
			width : 60
		};
		
		var uqfillerid =
		{
			header : '<div style="text-align:center">制证人</div>',
			dataIndex : "uqfillerid",
			width : 70
		};
		
		var dtchecker =
		{
			header : '<div style="text-align:center">审核日期</div>',
			dataIndex : "dtchecker",
			format : 'Y-m-d',
			width : 80
		};
		
		var uqcheckerid =
		{
			header : '<div style="text-align:center">审核人</div>',
			dataIndex : "uqcheckerid",
			width : 70
		};
		
		var dtcasher =
		{
			header : '<div style="text-align:center">出纳日期</div>',
			dataIndex : "dtcasher",
			format : 'Y-m-d',
			width : 80
		};
		
		var uqcasherid =
		{
			header : '<div style="text-align:center">出纳人</div>',
			dataIndex : "uqcasherid",
			width : 70
		};
		
		var dtaccountant =
		{
			header : '<div style="text-align:center">记账日期</div>',
			dataIndex : "dtaccountant",
			format : 'Y-m-d',
			width : 80
		};
		
		var uqaccountantid =
		{
			header : '<div style="text-align:center">记账人</div>',
			dataIndex : "uqaccountantid",
			width : 70
		};
		
		//定义选择方式
		this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
		
		this.cm = new Ext.grid.ColumnModel(
		[
		 	new Ext.grid.RowNumberer(), this.sm, voucherid, uqnumbering, 
		 	intcompanyseq, intvouchernum,dtfiller, mnydebitsum, 
		    linenumber, uqfillerid,dtchecker, uqcheckerid, 
		    dtcasher, uqcasherid,dtaccountant, uqaccountantid
	    ]);
		
		this.store = new Ext.data.JsonStore(
		{	
			totalProperty : "total",
			root : "data",
			url : 'vouchermanager/vouchermain/endinfo',
			fields : record
		});
		
		this.bbar = new Ext.PagingToolbar(
		{
			border : true,
			pageSize : 20,
			store : this.store,
			displayInfo : true,
			displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
			emptyMsg : "没有记录"
		});
		
		gl.vouchermanager.voucherend.voucherenddetail.superclass.initComponent.call(this);
	}
});