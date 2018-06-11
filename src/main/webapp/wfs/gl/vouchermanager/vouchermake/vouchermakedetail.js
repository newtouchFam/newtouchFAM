Ext.namespace('gl.vouchermanager.vouchermake');
gl.vouchermanager.vouchermake.vouchermakedetail = Ext.extend(Ext.grid.GridPanel,
{
	id : "vouchermakedetail",
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
	layout : 'fit',
	initComponent : function ()
	{
		var record = Ext.data.Record.create([
		{ name : 'voucherid'},
		{ name : 'uqnumbering'},
		{ name : 'intcompanyseq'},
		{ name : 'intvouchernum'},
		{ name : 'dtfiller'},
		{ name : 'mnydebitsum'},
		{ name : 'linenumber'}]);
		
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
			align : "right",
			width : 60
		};
		
		//定义选择方式
		this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
		
		this.cm = new Ext.grid.ColumnModel(
		[
		 	new Ext.grid.RowNumberer(), this.sm, voucherid, uqnumbering, 
		 	intcompanyseq, intvouchernum,dtfiller, mnydebitsum, 
		    linenumber
	    ]);
		
		this.store = new Ext.data.JsonStore(
		{	
			totalProperty : "total",
			root : "data",
			url : 'vouchermanager/vouchermain/makeinfo',
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
		
		this.newbutton = new Ext.Button(
    	{
    		id : "newbutton",
    		iconCls : "xy-add",
    		text :'新建',
			handler : this.newHandler.createDelegate(this),
			minWidth:70
    	});
    	
    	this.editbutton = new Ext.Button(
    	{
    		id : "editbutton",
    		iconCls : "xy-edit",
    		text :'修改',
			handler : this.editHandler.createDelegate(this),
			minWidth:70
    	});
    	
    	this.deletebutton = new Ext.Button(
    	{
    		id : "deletebutton",
    		iconCls : "xy-delete",
    		text :'删除',
			handler :this.deleteHandler.createDelegate(this),
			minWidth:70
    	});
    	
    	this.refreshbutton = new Ext.Button(
    	{
    		id : "refreshbutton",
    		iconCls : "xy-toolbar_refresh",
    		text :'刷新',
			handler :this.refreshHandler.createDelegate(this),
			minWidth:70
    	});

    	this.printVoucherButton = new Ext.Button(
    	{
    		id : "printvoucherbutton",
    		iconCls : "xy-print",
    		text :'打印',
			handler :this.printVoucherHandler.createDelegate(this),
			minWidth:70
    	});
    	
    	var barTop = [this.newbutton,
    	              '-',this.editbutton,
    	              '-', this.deletebutton,
    	              '-', this.refreshbutton,
    	              '-', this.printVoucherButton ];
 
		this.tbar = barTop;
		
		gl.vouchermanager.vouchermake.vouchermakedetail.superclass.initComponent.call(this);
	},
	refreshHandler : function ()
	{
		Ext.getCmp("vouchermakedetail").getStore().reload();
	},
	editHandler : function ()
	{
		var records = Ext.getCmp("vouchermakedetail").getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			Ext.Msg.alert("提示","请先勾选查询明细的凭证!");
			return;
		}
		
		if (records.length > 1)
		{
			Ext.Msg.alert("提示","查看明细只能选择一行信息!");
			return;
		}
		
		var voucherid=records[0].get('voucherid');
		
		var vouchermain = new gl.vouchermanager.vouchermake.vouchermain({isView : false, layout : 'border', vouchertag : '1', voucherid : voucherid});
		
		var win = new Ext.Window(
		{
			layout : 'fit',
	        frame : true,
	        title : "凭证",
	        id : "voucherwin",
	        width : 800,
	        modal : true,
	        height : 455,
	        border : false,
			items : [vouchermain]
		});
		
		win.show();
	},
	deleteHandler : function ()
	{
		var detailData = new Array();
		var records = Ext.getCmp("vouchermakedetail").getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			Ext.Msg.alert("提示","请先勾选查询明细的凭证!");
			return;
		}
		
		for(var i = 0; i < records.length; i ++)
		{
			var voucherid=records[i].get('voucherid');
			var obj = 
			{
				uqvoucherid : voucherid
			};
			detailData[i] = obj;
		}
		
		//3.ajax请求提交到服务端处理
		Ext.Msg.confirm("提示", "请确认是否要删除所选凭证?", function(btn)
		{
			if (btn == "yes") 
			{
				Ext.Ajax.request(
				{
					url : "vouchermanager/vouchermain/unsave",
					params :
					{
						jsonVoucherid : Ext.encode(detailData)
		          	},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success)
						{
							Ext.Msg.alert("提示", "凭证删除成功");
							Ext.getCmp("vouchermakedetail").getStore().reload();
						}
						else
						{
							Ext.Msg.alert("错误", r.msg);
							Ext.getCmp("vouchermakedetail").getStore().reload();
						}
					},
					failure : function(response)
					{
						Ext.Msg.alert("错误","保存失败！");
						Ext.getCmp("vouchermakedetail").getStore().reload();
						return;
					},
					scope:this
				});
			}
		},this);
	},
	newHandler : function ()
	{
		var vouchermain = new gl.vouchermanager.vouchermake.vouchermain({layout : 'border',vouchertag : '0'});
		
		var win = new Ext.Window(
		{
			layout : 'fit',
			id : "voucherwin",
			title : "凭证",
	        frame : true,
	        width : 800,
	        height : 455,
	        modal:true,
	        border : false,
			items : [vouchermain]
		});
		
		win.show();
	},
	detailHandler : function ()
	{
		var records = Ext.getCmp("vouchermakedetail").getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			Ext.Msg.alert("提示","请先勾选查询明细的凭证!");
			return;
		}
		
		if (records.length > 1)
		{
			Ext.Msg.alert("提示","查看明细只能选择一行信息!");
			return;
		}
		
		var voucherid=records[0].get('voucherid');
		
		var vouchermain = new gl.vouchermanager.vouchermake.vouchermain({isView : true, layout : 'border', vouchertag : '1', voucherid : voucherid});
		
		var win = new Ext.Window(
		{
			layout : 'fit',
	        frame : true,
	        width : 800,
	        title : "凭证",
	        id : "voucherwin",
	        modal : true,
	        height : 455,
	        border : false,
			items : [vouchermain]
		});
		
		win.show();
	},
	printVoucherHandler : function()
	{
		var records = Ext.getCmp("vouchermakedetail").getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			Ext.Msg.alert("提示", "请先勾选要打印的凭证");
			return;
		}
		if (records.length > 1)
		{
			Ext.Msg.alert("提示", "一次只能打印一张凭证");
			return;
		}

		var voucherid = records[0].get("voucherid");

		VoucherPrintUtil.voucher_printPDF(voucherid);
	}
});