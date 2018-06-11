Ext.namespace('gl.vouchermanager.voucherflow');
gl.vouchermanager.voucherflow.voucherflowcondition = Ext.extend(Ext.FormPanel,
{
	frame : false,
	height : 52,
    border : false,
    voucherflowdetail : null,
    initComponent : function ()
	{
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
    	
    	this.intstatus = new Ext.app.XyComboBoxCom(
		{
            id : 'intstatus',
            listWidth : 300,
            leafSelect : true,
            XyAllowDelete : false,
            disabled : false,
            anchor : '100%',
            rootTitle : '请选择',
            labelStyle : "text-align: right;",
            fieldLabel : '状态',
            fields : ["column0", "column1"],
            displayField : "column1",
            valueField : "column0",
            scriptPath : 'wfs',
            sqlFile : 'selectflowstatus'
        });
    	
    	var row1 =
        {
            layout : 'column',
            border : false,
            labelAlign : "right",
            labelWidth : 100,
            items : [{
                columnWidth : .23,
                layout : 'form',
                border : false,
                defaults : {
                    width : 170,
                    anchor : '100%'
				},
                items : [this.periodid]
            }, {
                columnWidth : .23,
                layout : 'form',
                border : false,
                defaults : {
                    width : 170
                },
                items : [this.intstatus]
            }]
        };
    	
    	this.querybutton = new Ext.Button(
    	{
    		id : "querybutton",
    		text :'查询',
			handler : this.queryHandler.createDelegate(this),
			minWidth:70
    	});
    	
    	this.queryvoucherbutton = new Ext.Button(
    	{
    		id : "queryvoucherbutton",
    		text :'查看凭证',
			handler : this.queryVoucherHandler.createDelegate(this),
			minWidth:70
    	});
    	
    	this.notusebutton = new Ext.Button(
    	{
    		id : "notusebutton",
    		text :'不用',
			handler : this.notUseHandler.createDelegate(this),
			minWidth:70
    	});
    	
    	this.usebutton = new Ext.Button(
    	{
    		id : "usebutton",
    		text :'指定',
			handler : this.useHandler.createDelegate(this),
			minWidth:70
    	});
    	
    	var row2 =
        {
			layout : 'column',
            border : false,
			labelAlign : "right",
			labelWidth : 100,
			style : 'margin-left:105px;',
            items : [{
                columnWidth : .05,
                layout : 'form',
                border : false
            }, {
                columnWidth : .07,
                layout : 'form',
                border : false,
                items : [this.querybutton]
            }, {
                columnWidth : .07,
                layout : 'form',
                border : false,
                items : [this.queryvoucherbutton]
            }, {
                columnWidth : .07,
                layout : 'form',
                border : false,
                items : [this.notusebutton]
            }, {
                columnWidth : .07,
                layout : 'form',
                border : false,
                items : [this.usebutton]
            }]
        };
    	
    	this.items = [ row1, row2 ];
    	gl.vouchermanager.voucherflow.voucherflowcondition.superclass.initComponent.call(this);
    	
    	
    	var obj = 
    	{
    		column0 : "3",
    		column1 : "全部"
    	};
    	this.intstatus.setXyValue(obj);
	},
	
	queryHandler : function()
	{
		var obj = {};
		obj.periodid = Ext.getCmp("periodid").getOtherValue();
		obj.intstatus = Ext.getCmp("intstatus").getXyValue();
		this.voucherflowdetail.getStore().baseParams.jsonCondition = Ext.encode(obj);
		
		this.voucherflowdetail.getStore().load(
		{
			params : 
			{
				start : 0,
				limit : 20
			}
		});
	},
	queryVoucherHandler : function()
	{
		var records = this.voucherflowdetail.getSelectionModel().getSelections();
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
	        id : "voucherwin",
	        width : 800,
	        modal : true,
	        height : 400,
	        border : false,
	        title : "凭证",
			items : [vouchermain]
		});
		
		win.show();
	},
	notUseHandler : function()
	{
		var detailData = new Array();
		var records = this.voucherflowdetail.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			Ext.Msg.alert("提示","请先勾选凭证分录!");
			return;
		}
		
		for(var i = 0; i < records.length; i ++)
		{
			var voucherdetailid=records[i].get('voucherdetailid');
			var voucherid=records[i].get('voucherid');
			var obj = 
			{
				voucherdetailid : voucherdetailid,
				voucherid : voucherid
			};
			detailData[i] = obj;
		}
		
		//3.ajax请求提交到服务端处理
		Ext.Ajax.request(
		{
			url : "vouchermanager/voucherflow/noUseHandler",
			params :
			{
				jsonVoucherDetailid : Ext.encode(detailData)
          	},
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success)
				{
					Ext.Msg.alert("提示","操作完成!");
					this.voucherflowdetail.getStore().reload();
				}
				else
				{
					Ext.Msg.alert("提示","操作失败!");
					this.voucherflowdetail.getStore().reload();
				}
			},
			failure : function(response)
			{
				Ext.Msg.alert("错误","保存失败！");
				this.vouchercashdetail.getStore().reload();
				return;
			},
			scope:this
		});
	},
	useHandler : function()
	{
		var detailDatas = new Array();
		var recordss = this.voucherflowdetail.getSelectionModel().getSelections();
		if (null == recordss || recordss.length <= 0)
		{
			Ext.Msg.alert("提示","请先勾选凭证分录!");
			return;
		}
		
		for(var i = 0; i < recordss.length; i ++)
		{
			var voucherdetailid=recordss[i].get('voucherdetailid');
			var voucherid=recordss[i].get('voucherid');
			var obj = 
			{
				voucherdetailid : voucherdetailid,
				voucherid : voucherid
			};
			detailDatas[i] = obj;
		}
		
		var flowwin = new gl.component.flowsel(
		{
			id : "flowwin",
			closeAction : "close"
		});
		
		flowwin.on('selected', function(e) 
		{
			//3.ajax请求提交到服务端处理
			Ext.Ajax.request(
			{
				url : "vouchermanager/voucherflow/useHandler",
				params :
				{
					jsonVoucherDetailid : Ext.encode(detailDatas),
					uqflowitemid : e.uqflowitemid
	          	},
				success : function(response)
				{
					var r = Ext.decode(response.responseText);
					if (r.success)
					{
						Ext.Msg.alert("提示","操作完成!");
						this.voucherflowdetail.getStore().reload();
						Ext.getCmp("flowwin").close();
					}
					else
					{
						Ext.Msg.alert("提示","操作失败!");
						this.voucherflowdetail.getStore().reload();
						Ext.getCmp("flowwin").close();
					}
				},
				failure : function(response)
				{
					Ext.Msg.alert("错误","保存失败！");
					this.vouchercashdetail.getStore().reload();
					Ext.getCmp("flowwin").close();
					return;
				},
				scope:this
			});
		}, this);
		flowwin.show();
	}
});