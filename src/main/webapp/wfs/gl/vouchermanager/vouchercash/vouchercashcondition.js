Ext.namespace('gl.vouchermanager.vouchercash');
gl.vouchermanager.vouchercash.vouchercashcondition = Ext.extend(Ext.FormPanel,
{
	frame : false,
	height : 112,
    border : false,
    vouchercashdetail : null,
    getRecord : function()
    {
        return Ext.data.XyCalcRecord.create(
        [{
            name : 'numberid' 	
        }, {
            name : 'dtfilldatefrom' 	
        }, {
            name : 'dtfilldateto' 	
        }, {
            name : 'intstatus' 	
        }, {
            name : 'periodid' 	
        }, {
            name : 'compseq' 	
        }, {
            name : 'uqglobalperiodid' 	
        }, {
            name : 'vouchernum' 	
        }, {
            name : 'cashdate' 	
        }]);
    },
    getStore : function()
    {
        if (this.store === undefined || this.store == null)
        {
            this.store = new Ext.data.Store(
    		{
                url : 'vouchermanager/vouchermain/initcash',
                reader : new Ext.data.JsonReader({
                            root : 'data'
                        }, this.getRecord())
            });
        }
        return this.store;
    },
    initComponent : function ()
	{
    	this.numberid = new Ext.app.XyComboBoxCom(
		{
            id : 'numberid',
            listWidth : 300,
            leafSelect : true,
            XyAllowDelete : false,
            anchor : '100%',
            rootTitle : '请选择',
            labelStyle : "text-align: right;",
            fieldLabel : '凭证字',
            fields : ["column0", "column1"],
            displayField : "column1",
            valueField : "column0",
            scriptPath : 'wfs',
            sqlFile : 'selectuqnumberingall'
        });
    	
    	this.dtfilldatefrom = new Ext.form.DateField(
		{
			id : 'dtfilldatefrom',
            fieldLabel : "制证日期从",
            width : 100,
            anchor : '100%',
            format : "Y-m-d",
            disabled : false,
            labelStyle : "text-align: right;"
        });
    	
    	this.dtfilldateto = new Ext.form.DateField(
		{
			id : 'dtfilldateto',
            fieldLabel : '至',
            width : 100,
            anchor : '100%',
            format : "Y-m-d",
            labelStyle : "text-align: right;",
            disabled : false
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
            sqlFile : 'selectcashintstatus'
        });
    	
    	this.periodid = new Ext.app.XyComboBoxCom(
		{
            id : 'periodid',
            listWidth : 300,
            leafSelect : true,
            XyAllowDelete : false,
            anchor : '100%',
            rootTitle : '请选择',
            labelStyle : "text-align: right;",
            fieldLabel : '会计期',
            fields : ["column0", "column1", "column2", "column3"],
            displayField : "column3",
            valueField : "column0",
            scriptPath : 'wfs',
            sqlFile : 'selectperiod'
        });
    	this.periodid.on("valuechange",this.periodchange.createDelegate(this));
    	
    	this.dtfilldatefromlabel = new Ext.form.Label
        ({
              id:"dtfilldatefromlabel",
              text:"制证日期从"
        });
    	
    	this.dtfilldatetolabel = new Ext.form.Label
        ({
              id:"dtfilldatetolabel",
              text:"至"
        });
    	
    	this.compseq = new Ext.form.TextField(
		{
            id : 'compseq',
            fieldLabel : '流水号',
            disabled : false,
            labelStyle : "text-align: right;",
            anchor : '100%'
        });
    	
    	this.vouchernum = new Ext.form.TextField(
		{
            id : 'vouchernum',
            fieldLabel : '凭证编号',
            disabled : false,
            labelStyle : "text-align: right;",
            anchor : '100%'
        });
    	
    	this.querybutton = new Ext.Button(
    	{
    		id : "querybutton",
    		text :'查询',
    		minWidth:70,
			handler : this.queryHandler.createDelegate(this)
    	});
    	
    	this.detailbutton = new Ext.Button(
    	{
    		id : "detailbutton",
    		text :'查看凭证',
    		minWidth:70,
			handler : this.detailHandler.createDelegate(this)
    	});

    	this.printVoucherButton = new Ext.Button(
    	{
    		id : "printvoucherbutton",
    		text : "打印凭证",
			handler : this.printVoucherHandler.createDelegate(this),
			minWidth:70
    	});

    	this.cashdate = new Ext.form.DateField(
		{
            id : 'cashdate',
            fieldLabel : '出纳日期',
            format : "Y-m-d",
            disabled : false,
            labelStyle : "text-align: right;",
            anchor : '100%'
        });

    	var row0 =
        {
    		height : 6,
    		border : false
        };
    	
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
                items : [this.numberid]
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
    	
    	var row2 =
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
                items : [this.dtfilldatefrom]
            }, {
                columnWidth : .23,
                layout : 'form',
                border : false,
                defaults : {
                    width : 170
                },
                items : [this.dtfilldateto]
            }, {
                columnWidth : .23,
                layout : 'form',
                border : false,
                defaults : {
                    width : 170
                },
                items : [this.compseq]
            }, 
            {
                columnWidth : .23,
                layout : 'form',
                border : false,
                defaults : {
                    width : 170,
                    anchor : '100%'
                },
                items : [this.vouchernum]
            }]
        };
    	
    	var row3 =
        {
            layout : 'column',
            border : false,
            labelAlign : "right",
            style : 'margin-left:105px;',
            labelWidth : 100,
            items : [{
                columnWidth : .075,
                layout : 'form',
                border : false,
                defaults : {
                    width : 200
                },
                items : [this.querybutton]
            }, {
                columnWidth : .075,
                layout : 'form',
                border : false,
                defaults : {
                    width : 200
                },
                items : [this.detailbutton]
            }, {
                columnWidth : .075,
                layout : 'form',
                border : false,
                defaults : {
                    width : 200
                },
                items : [this.printVoucherButton ]
            }]
        };

    	    	
    	    this.cashbutton = new Ext.Button(
    	    	{
    	    		id : "cashbutton",
    	    		iconCls : "xy-act-post ",
    	    		text :'出纳',
    				handler :this.cashHandler.createDelegate(this)
    	    	});
    	    this.uncashbutton = new Ext.Button(
    	        {
    	        	id : "uncheckbutton",
    	        	iconCls : "xy-stop ",
    	        	text :'反出纳',
    	    		handler : this.uncashHandler.createDelegate(this)
    	  });
    	this.items = [row0, row1, row2, row3];
    	var barTop = ['出纳日期：',this.cashdate,'-', this.cashbutton,'-',this.uncashbutton];
		this.bbar = barTop;
    	
    	this.getStore().on("load", this.loaded, this);
		
    	gl.vouchermanager.vouchercash.vouchercashcondition.superclass.initComponent.call(this);
    	
    	this.getStore().load();
	},
	periodchange : function (oldv,newv)
	{
		var intyearmonth = newv["column1"] + "";
		var strYear = intyearmonth.substr(0, 4);
        var strMonth = intyearmonth.substr(4, 2);
        
        var strDay0 = '01';
        var strDay1 = '31';
        if (strMonth == '04' || strMonth == '06' || strMonth == '09' || strMonth == '11')
        {
        	strDay1= '30';
        }
        else if(strMonth == '02')
        {
        	if(strYear%4==0&&strYear%100!=0||strYear%400==0){  
        		var strDay1 = '29';
            }else{  
            	var strDay1 = '28'; 
            } 
        }
        if (strMonth < '01')
        {
            strMonth = '01';
            strDay0 = '01';
        }
        else if (strMonth > '12')
        {
            strMonth = '12';
            strDay1 = '31';
        }
        this.dtfilldatefrom.suspendEvents();
        this.dtfilldateto.suspendEvents();
        this.dtfilldatefrom.setValue(strYear + '-' + strMonth + '-' + strDay0);
        this.dtfilldateto.setValue(strYear + '-' + strMonth + '-' + strDay1);
        this.dtfilldatefrom.resumeEvents();
        this.dtfilldateto.resumeEvents();
	},
	queryHandler : function ()
	{
		var obj = {};
		obj.numberid = Ext.getCmp("numberid").getXyValue();
		obj.dtfilldatefrom = Ext.getCmp("dtfilldatefrom").getValue();
		obj.dtfilldateto = Ext.getCmp("dtfilldateto").getValue();
		obj.periodid = Ext.getCmp("periodid").getXyValue();
		obj.compseq = Ext.getCmp("compseq").getValue();
		obj.vouchernum = Ext.getCmp("vouchernum").getValue();
		obj.cashdate = Ext.getCmp("cashdate").getValue();
		obj.intstatus = Ext.getCmp("intstatus").getXyValue();
		this.vouchercashdetail.getStore().baseParams.jsonCondition = Ext.encode(obj);
		this.vouchercashdetail.getStore().load(
		{
			params : 
			{
				start : 0,
				limit : 20
			}
		});
	},
	detailHandler : function ()
	{
		var records = this.vouchercashdetail.getSelectionModel().getSelections();
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
	printVoucherHandler : function()
	{
		var records = this.vouchercashdetail.getSelectionModel().getSelections();
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
	},
	cashHandler : function ()
	{
		var detailData = new Array();
		var records = this.vouchercashdetail.getSelectionModel().getSelections();
		if (null == records || records.length <= 0)
		{
			Ext.Msg.alert("提示","请先勾选查询明细的凭证!");
			return;
		}
		
		if(Ext.getCmp("cashdate").getValue() == "" || Ext.getCmp("cashdate").getValue() == null)
		{
			Ext.Msg.alert("提示","请选择出纳日期!");
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
			
			if(records[i].get('intstatus') == '已出纳')
			{
				Ext.Msg.alert("提示","已出纳的凭证不能出纳!");
				return;
			}
		}
		
		//3.ajax请求提交到服务端处理
		Ext.Ajax.request(
		{
			url : "vouchermanager/vouchermain/cash",
			params :
			{
				vouchercashdate : Ext.getCmp("cashdate").getValue().format('Y-m-d'),
				jsonVoucherid : Ext.encode(detailData)
          	},
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success)
				{
					Ext.Msg.alert("提示", "凭证出纳成功");
					this.vouchercashdetail.getStore().reload();
				}
				else
				{
					Ext.Msg.alert("错误", r.msg);
					this.vouchercashdetail.getStore().reload();
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
	uncashHandler : function ()
	{
		var detailData = new Array();
		var records = this.vouchercashdetail.getSelectionModel().getSelections();
		
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
			
			if(records[i].get('intstatus') == '待出纳')
			{
				Ext.Msg.alert("提示","待出纳的凭证不能反出纳!");
				return;
			}
		}
		
		//3.ajax请求提交到服务端处理
		Ext.Ajax.request(
		{
			url : "vouchermanager/vouchermain/uncash",
			params :
			{
				intstatus : Ext.getCmp("intstatus").getXyValue(),
				jsonVoucherid : Ext.encode(detailData)
          	},
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success)
				{
					Ext.Msg.alert("提示", "凭证反出纳成功");
					this.vouchercashdetail.getStore().reload();
				}
				else
				{
					Ext.Msg.alert("错误", r.msg);
					this.vouchercashdetail.getStore().reload();
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
	loaded : function(store, records, options)
    {
		this.setInfo(store);
		
		//条件面板有默认参数，作为列表查询的过滤条件
		var obj = {};
		obj.numberid = Ext.getCmp("numberid").getXyValue();
		obj.dtfilldatefrom = Ext.getCmp("dtfilldatefrom").getValue();
		obj.dtfilldateto = Ext.getCmp("dtfilldateto").getValue();
		obj.periodid = Ext.getCmp("periodid").getXyValue();
		obj.compseq = Ext.getCmp("compseq").getValue();
		obj.vouchernum = Ext.getCmp("vouchernum").getValue();
		obj.cashdate = Ext.getCmp("cashdate").getValue();
		obj.intstatus = Ext.getCmp("intstatus").getXyValue();
		this.vouchercashdetail.getStore().baseParams.jsonCondition = Ext.encode(obj);
		this.vouchercashdetail.getStore().load(
		{
			params : 
			{
				start : 0,
				limit : 20
			}
		});
	},
	setInfo : function(store) 
	{
		if (store.getTotalCount() == 0) 
		{
			return;
		}
		var record = store.getAt(0);
		for (var key in record.data) 
		{
			if (typeof record.data[key] != "function") 
			{
                if (Ext.getCmp(key) != null) 
                {
					if (record.data[key] != null && record.data[key] != '') 
					{
						if (Ext.getCmp(key).getXType().indexOf('xy') == 0
								&& typeof Ext.getCmp(key).setXyValue == 'function')
						{
							Ext.getCmp(key).setXyValue(record.data[key]);
						}
						else 
						{
							Ext.getCmp(key).setValue(record.data[key]);
						}
					}
				}
			}
		}
	}
});