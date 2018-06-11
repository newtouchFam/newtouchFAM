Ext.namespace('gl.vouchermanager.vouchermake');
gl.vouchermanager.vouchermake.vouchermakecondition = Ext.extend(Ext.FormPanel,
{
	frame : true,
	height : 120,
    border : false,
    vouchermakedetail : null,
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
            name : 'fromperiodid' 	
        }, {
            name : 'toperiodid' 	
        }, {
            name : 'compseq' 	
        }, {
            name : 'vouchernum' 	
        }]);
    },
    getStore : function()
    {
        if (this.store === undefined || this.store == null)
        {
            this.store = new Ext.data.Store(
    		{
                url : 'VOUMANAGER/getInitvouchermake.action',
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
            sqlFile : 'selectqueryintstatus'
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
    	
    	this.fromperiodid = new Ext.app.XyComboBoxCom(
		{
            id : 'fromperiodid',
            listWidth : 200,
            leafSelect : true,
            XyAllowDelete : false,
            othervalue : "column1",
            anchor : '100%',
            rootTitle : '请选择',
            labelStyle : "text-align: right;",
            fieldLabel : '会计期从',
            fields : ["column0", "column1", "column2", "column3"],
            displayField : "column3",
            valueField : "column0",
            scriptPath : 'wfs',
            sqlFile : 'selectperiod'
        });
    	this.fromperiodid.on("valuechange",this.periodchange.createDelegate(this));
    	
    	this.toperiodid = new Ext.app.XyComboBoxCom(
		{
            id : 'toperiodid',
            listWidth : 200,
            leafSelect : true,
            XyAllowDelete : false,
            anchor : '100%',
            othervalue : "column1",
            rootTitle : '请选择',
            labelStyle : "text-align: right;",
            fieldLabel : '至',
            fields : ["column0", "column1", "column2", "column3"],
            displayField : "column3",
            valueField : "column0",
            scriptPath : 'wfs',
            sqlFile : 'selectperiod'
        });
    	this.toperiodid.on("valuechange",this.periodchange1.createDelegate(this));
    	
    	this.fromperiodidlabel = new Ext.form.Label
        ({
              id:"fromperiodidlabel",
              text:"会计期从"
        });
    	
    	this.toperiodidlabel = new Ext.form.Label
        ({
              id:"toperiodidlabel",
              text:"至"
        });
    	
    	this.querybutton = new Ext.Button(
    	{
    		id : "querybutton",
    		text :'查询',
			handler : this.queryHandler.createDelegate(this),
			minWidth:70
    	});
    	
    	this.detailbutton = new Ext.Button(
    	{
    		id : "detailbutton",
    		text :'查看凭证',
			handler : this.detailHandler.createDelegate(this),
			minWidth:70
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
                    width : 200,
                    anchor : '100%'
				},
                items : [this.fromperiodid, this.dtfilldatefrom]
            }, {
                columnWidth : .23,
                layout : 'form',
                border : false,
                defaults : {
                    width : 200
                },
                items : [this.toperiodid, this.dtfilldateto]
            }, {
                columnWidth : .23,
                layout : 'form',
                border : false,
                defaults : {
                    width : 200
                },
                items : [this.numberid, this.compseq]
            }, {
                columnWidth : .23,
                layout : 'form',
                border : false,
                defaults : {
                    width : 200,
                    anchor : '100%'
                },
                items : [this.intstatus, this.vouchernum]
            }]
        };
    	
    	var row2 =
        {
            layout : 'column',
            border : false,
            labelAlign : "right",
            labelWidth : 100,
            style : 'margin-left:105px;',
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
            }]
        };
    	
    	this.items = [row1, row2];
    	var barTop = ['-', this.newbutton, '-',this.editbutton,'-', this.deletebutton ];
		this.bbar = barTop;
    	
    	this.getStore().on("load", this.loaded, this);
		
    	gl.vouchermanager.vouchermake.vouchermakecondition.superclass.initComponent.call(this);
    	
    	this.getStore().load();
	},
	periodchange : function (oldv,newv)
	{
		var intyearmonth = newv["column1"] + "";
		var strYear = intyearmonth.substr(0, 4);
        var strMonth = intyearmonth.substr(4, 2);
        
        var strDay0 = '01';
        if (strMonth < '01')
        {
            strMonth = '01';
            strDay0 = '01';
        }
        else if (strMonth > '12')
        {
            strMonth = '12';
            strDay0 = '31';
        }
        this.dtfilldatefrom.suspendEvents();
        this.dtfilldatefrom.setValue(strYear + '-' + strMonth + '-' + strDay0);
        this.dtfilldatefrom.resumeEvents();
	},
	periodchange1 : function (oldv,newv)
	{
		var intyearmonth = newv["column1"] + "";
		var strYear = intyearmonth.substr(0, 4);
        var strMonth = intyearmonth.substr(4, 2);
        
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
            strDay1 = '01';
        }
        else if (strMonth > '12')
        {
            strMonth = '12';
            strDay1 = '31';
        }
        this.dtfilldateto.suspendEvents();
        this.dtfilldateto.setValue(strYear + '-' + strMonth + '-' + strDay1);
        this.dtfilldateto.resumeEvents();
	},
	editHandler : function ()
	{
		var records = this.vouchermakedetail.getSelectionModel().getSelections();
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
		
		if(records[0].get('intstatus') != '待审核')
		{
			Ext.Msg.alert("提示","只有待审核的凭证可以编辑!");
			return;
		}
		
		var voucherid=records[0].get('voucherid');
		
		var vouchermain = new gl.vouchermanager.vouchermake.vouchermain({isView : false, layout : 'border', vouchertag : '1', voucherid : voucherid});
		
		var win = new Ext.Window(
		{
			layout : 'fit',
			title : "凭证",
			id : "voucherwin",
	        frame : true,
	        width : 800,
	        modal : true,
	        height : 400,
	        border : false,
			items : [vouchermain]
		});
		
		win.show();
	},
	deleteHandler : function ()
	{
		var detailData = new Array();
		var records = this.vouchermakedetail.getSelectionModel().getSelections();
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

			if(records[i].get('intstatus') != '待审核')
			{
				Ext.Msg.alert("提示","只有待审核的凭证可以删除!");
				return;
			}
		}
		
		//3.ajax请求提交到服务端处理
		Ext.Msg.confirm("提示", "请确认是否要删除所选凭证?", function(btn)
		{
			if (btn == "yes") 
			{
				Ext.Ajax.request(
				{
					url : "VOUMANAGER/unVoucherSave.action",
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
							this.vouchermakedetail.getStore().reload();
						}
						else
						{
							Ext.Msg.alert("错误", r.msg);
							this.vouchermakedetail.getStore().reload();
						}
					},
					failure : function(response)
					{
						Ext.Msg.alert("错误","保存失败！");
						this.vouchermakedetail.getStore().reload();
						return;
					},
					scope:this
				});
			}
		},this);
	},
	queryHandler : function ()
	{
		var obj = {};
		obj.numberid = Ext.getCmp("numberid").getXyValue();
		obj.dtfilldatefrom = Ext.getCmp("dtfilldatefrom").getValue();
		obj.dtfilldateto = Ext.getCmp("dtfilldateto").getValue();
		obj.fromperiodid = Ext.getCmp("fromperiodid").getOtherValue();
		obj.toperiodid = Ext.getCmp("toperiodid").getOtherValue();
		obj.compseq = Ext.getCmp("compseq").getValue();
		obj.vouchernum = Ext.getCmp("vouchernum").getValue();
		obj.intstatus = Ext.getCmp("intstatus").getXyValue();
		this.vouchermakedetail.getStore().baseParams.jsonCondition = Ext.encode(obj);
		this.vouchermakedetail.getStore().load(
		{
			params : 
			{
				start : 0,
				limit : 20
			}
		});
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
	        height : 400,
	        modal:true,
	        border : false,
			items : [vouchermain]
		});
		
		win.show();
	},
	detailHandler : function ()
	{
		var records = this.vouchermakedetail.getSelectionModel().getSelections();
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
			title : "凭证",
			id : "voucherwin",
	        frame : true,
	        width : 800,
	        modal : true,
	        height : 400,
	        border : false,
			items : [vouchermain]
		});
		
		win.show();
	},
	loaded : function(store, records, options)
    {
		this.setInfo(store);
		
		//条件面板有默认参数，作为列表查询的过滤条件
		var obj = {};
		obj.numberid = Ext.getCmp("numberid").getXyValue();
		obj.dtfilldatefrom = Ext.getCmp("dtfilldatefrom").getValue();
		obj.dtfilldateto = Ext.getCmp("dtfilldateto").getValue();
		obj.fromperiodid = Ext.getCmp("fromperiodid").getOtherValue();
		obj.toperiodid = Ext.getCmp("toperiodid").getOtherValue();
		obj.compseq = Ext.getCmp("compseq").getValue();
		obj.vouchernum = Ext.getCmp("vouchernum").getValue();
		obj.intstatus = Ext.getCmp("intstatus").getXyValue();
		this.vouchermakedetail.getStore().baseParams.jsonCondition = Ext.encode(obj);
//		this.vouchermakedetail.getStore().load(
//		{
//			params : 
//			{
//				start : 0,
//				limit : 20
//			}
//		});
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