Ext.namespace('gl.vouchermanager.voucherflow');
gl.vouchermanager.voucherflow.voucherflowdetail = Ext.extend(Ext.grid.GridPanel,
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
		{ name : 'flowitemcode'},
		{ name : 'flowitemname'},
		{ name : 'dtaccountant'},
		{ name : 'dtfiller'},
		{ name : 'numberingname'},
		{ name : 'intvouchernum'},
		{ name : 'uqaccountid'},
		{ name : 'varabstract'},
		{ name : 'mnydebit'},
		{ name : 'mnycredit'},
		{ name : 'dtvoucherflow'},
		{ name : 'intstatus'},
		{ name : 'voucherid'},
		{ name : 'voucherdetailid'},
		{ name : 'uqflowitemid'}]);
		
		var flowitemcode =
		{
			header : '<div style="text-align:center">项目编号</div>',
			dataIndex : "flowitemcode",
			width : 75
		};
		
		this.periodid = new Ext.app.XyComboBoxCom(
    	{
    		id : 'periodid',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '会计期',
    		XyAllowDelete : false,
    		rootTitle :'',
		    fields : ["column0", "column1", "column2", "column3"],
            displayField : "column3",
            othervalue : "column0",
            valueField : "column1",
            scriptPath : 'wfs',
            sqlFile : 'selectperiodall'
    	});
		
		var flowitemname =
		{
			header : '<div style="text-align:center">项目名称</div>',
			dataIndex : "flowitemname",
			width : 75
		};
		
		var dtaccountant =
		{
			header : '<div style="text-align:center">记账日期</div>',
			dataIndex : "dtaccountant",
			width : 80
		};
		
		var dtfiller =
		{
			header : '<div style="text-align:center">制证日期</div>',
			dataIndex : "dtfiller",
			format : 'Y-m-d',
			width : 80
		};
		
		var numberingname =
		{
			header : '<div style="text-align:center">凭证字</div>',
			dataIndex : "numberingname",
			width : 60
		};
		
		var intvouchernum =
		{
			header : '<div style="text-align:center">凭证编号</div>',
			dataIndex : "intvouchernum",
			width : 60
		};
		
		var uqaccountid =
		{
			header : '<div style="text-align:center">科目</div>',
			dataIndex : "uqaccountid",
			width : 180
		};
		
		var varabstract =
		{
			header : '<div style="text-align:center">摘要</div>',
			dataIndex : "varabstract",
			width : 160
		};
		
		var mnydebit =
		{
			header : '<div style="text-align:center">借方金额</div>',
			css : 'text-align:right;',
			renderer : Ext.app.XyFormat.cnMoneyEx,
			dataIndex : "mnydebit",
			width : 80
		};
		
		var mnycredit =
		{
			header : '<div style="text-align:center">贷方金额</div>',
			css : 'text-align:right;',
			renderer : Ext.app.XyFormat.cnMoneyEx,
			dataIndex : "mnycredit",
			width : 80
		};
		
		var dtvoucherflow =
		{
			header : '<div style="text-align:center">编制日期</div>',
			dataIndex : "dtvoucherflow",
			width : 100
		};
		
		var intstatus =
		{
			header : '<div style="text-align:center">状态</div>',
			dataIndex : "intstatus",
			width : 70
		};
		
		var voucherid = 
		{
			hidden : true,
			dataIndex : "voucherid"
		};
		
		var voucherdetailid = 
		{
			hidden : true,
			dataIndex : "voucherdetailid"
		};
		
		var uqflowitemid = 
		{
			hidden : true,
			dataIndex : "uqflowitemid"
		};
		
		//定义选择方式
		this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
		
		this.cm = new Ext.grid.ColumnModel(
		[
		 	new Ext.grid.RowNumberer(), this.sm, 
		 	flowitemcode,flowitemname,dtaccountant,dtfiller,
			numberingname,intvouchernum,uqaccountid,varabstract,
			mnydebit,mnycredit,dtvoucherflow,intstatus,
			voucherid,voucherdetailid,uqflowitemid
	    ]);
		
		this.store = new Ext.data.JsonStore(
		{	
			totalProperty : "total",
			root : "data",
			url : 'vouchermanager/voucherflow/getVoucherFlowInfo',
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
		
		gl.vouchermanager.voucherflow.voucherflowdetail.superclass.initComponent.call(this);
		
		this.getPeriod();
		
		var obj = {};
		obj.intstatus = "3";
		obj.periodid = Ext.getCmp("periodid").getOtherValue();
		this.store.jsonCondition = Ext.encode(obj);
		
		this.store.load(
		{
			params : 
			{
				start : 0,
				limit : 20
			}
		});
	},
	
	getPeriod : function()
	{
		var obj = {"flag":"1"};
		Ext.Ajax.request(
		{		  
			url : "voucherbook/aldetailbook/getPeriod", 
			params :
			{	
				jsonCondition : Ext.encode(obj)
	      	},
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success) 
				{
					var data = 
	    			{
						column0 : r.uqglobalperiodid,
						column1 : r.intyearmonth,
						column2 : r.dtend,
	    				column3 : r.varname,
	    				column4 : r.dtbegin,
	    				column5 : r.dtend
	    			}
					Ext.getCmp("periodid").hiddenData = data;
					Ext.getCmp("periodid").setXyValue(data);
				}
			}
		});
	
	}
});