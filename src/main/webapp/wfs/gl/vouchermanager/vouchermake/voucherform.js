Ext.namespace('gl.vouchermanager.vouchermake');
gl.vouchermanager.vouchermake.voucherform = Ext.extend(Ext.FormPanel,
{
	frame : true,
	vouchertag : null,//0-制证，1-查删改打开，2-查询
	framevoucherid : '',
	isView : false,
	id : "voucherform",
	getRecord : function()
    {
        return Ext.data.XyCalcRecord.create(
        [{
            name : 'uqvoucherid' 	
        }, {
            name : 'intvouchernum' 	
        }, {
            name : 'uqnumbering' 	
        }, {
            name : 'uqcompanyid' 	
        }, {
            name : 'intcompanyseq' 	
        }, {
            name : 'intaffix' 	
        }, {
            name : 'uqglobalperiodid' 	
        }, {
            name : 'mnydebitsum' 	
        }, {
            name : 'mnycreditsum' 	
        }, {
            name : 'uqfinacialmanagerid' 	
        }, {
            name : 'uqaccountantid' 	
        }, {
            name : 'uqcasherid' 	
        }, {
            name : 'uqcheckerid' 	
        }, {
            name : 'uqfillerid' 	
        }, {
            name : 'dtdate' 	
        }, {
            name : 'dtdatesrv' 	
        }, {
            name : 'intflag' 	
        }, {
            name : 'intcashflag' 	
        }, {
            name : 'uqcancelid' 	
        }, {
            name : 'uqaccountantname' 	
        }, {
            name : 'uqcashername' 	
        }, {
            name : 'uqcheckername' 	
        }, {
            name : 'uqfillername' 	
        }, {
            name : 'accountmanager' 	
        }]);
    },
	getStore : function()
    {
        if (this.store === undefined || this.store == null)
        {
            this.store = new Ext.data.Store(
    		{
                url : 'vouchermanager/vouchermain/maininfo',
                reader : new Ext.data.JsonReader({
                            root : 'data'
                        }, this.getRecord())
            });
        }
        return this.store;
    },
	initComponent : function ()
	{
		this.intcompanyseq = new Ext.form.TextField(
		{
            id : 'intcompanyseq',
            fieldLabel : '流水号',
            disabled : true,
            labelStyle : "text-align: right;",
            listeners: {     
                'render': function(c) {
                    c.getEl().dom.style.background = "#E4E4E4";        
                }
		    },
            anchor : '100%'
        });
		
		this.uqnumbering = new Ext.app.XyComboBoxCom(
		{
            id : 'uqnumbering',
            width : 200,
            listWidth : 300,
            leafSelect : true,
            disabled : (this.vouchertag == 1),
            XyAllowDelete : false,
            anchor : '100%',
            rootTitle : '请选择',
            labelStyle : "text-align: right;",
            fieldLabel : '凭证字<font color="red">*</font>',
            fields : ["column0", "column1"],
            displayField : "column1",
            valueField : "column0",
            scriptPath : 'wfs',
            sqlFile : 'selectuqnumbering'
        });
		
		this.intvouchernum = new Ext.form.TextField(
		{
            id : 'intvouchernum',
            fieldLabel : '凭证编号',
            disabled : true,
            labelStyle : "text-align: right;",
            listeners: {     
                'render': function(c) {
                    c.getEl().dom.style.background = "#E4E4E4";        
                }
		    },
            anchor : '100%'
        });
		
		var row1 = 
		{
            layout : 'column',
            border : false,
            items : [{
		                columnWidth : .33,
		                layout : 'form',
		                border : false,
		                items : [this.uqnumbering]
		            }, {
                        columnWidth : .33,
                        layout : 'form',
                        border : false,
                        items : [this.intcompanyseq]
                    }, {
                        columnWidth : .33,
                        layout : 'form',
                        border : false,
                        items : [this.intvouchernum]
                    }]
        };
		
		this.dtdate = new Ext.app.XyDateField(
		{
            id : 'dtdate',
            fieldLabel : '制证日期',
            value : new Date(),
            readOnly : true,
            format : "Y-m-d",
            disabled : this.isView,
            labelStyle : "text-align: right;",
            anchor : '100%'
        });
		this.dtdate.on("valuechange", this.on_FillDateSelect.createDelegate(this), this);
		
		this.uqglobalperiodid = new Ext.app.XyComboBoxCom(
		{
            id : 'uqglobalperiodid',
            width : 200,
            listWidth : 300,
            leafSelect : true,
            XyAllowDelete : false,
            disabled : (this.vouchertag == 1),
            anchor : '100%',
            rootTitle : '请选择',
            labelStyle : "text-align: right;",
            fieldLabel : '会计期<font color="red">*</font>',
            fields : ["column0", "column1", "column2", "column3"],
            displayField : "column3",
            valueField : "column0",
            scriptPath : 'wfs',
            sqlFile : 'selectperiod'
        });
		this.uqglobalperiodid.on("valuechange",this.periodchange.createDelegate(this));
		
		this.intaffix = new Ext.form.NumberField(
		{
            id : 'intaffix',
            fieldLabel : '附件数<font color="red">*</font>',
            disabled : this.isView,
            labelStyle : "text-align: right;",
            anchor : '100%'
        });
		
		var row2 = 
		{
            layout : 'column',
            border : false,
            items : [{
		                columnWidth : .33,
		                layout : 'form',
		                border : false,
		                items : [this.uqglobalperiodid]
		            }, {
                        columnWidth : .33,
                        layout : 'form',
                        border : false,
                        items : [this.dtdate]
                    }, {
                        columnWidth : .33,
                        layout : 'form',
                        border : false,
                        items : [this.intaffix]
                    }]
        };
		
		this.mnydebitsum = 
        {
            xtype : 'hidden',
            id : 'mnydebitsum'
        };
		
		this.mnycreditsum = 
        {
            xtype : 'hidden',
            id : 'mnycreditsum'
        };
		
		this.uqcompanyid = 
        {
            xtype : 'hidden',
            id : 'uqcompanyid'
        };
		
		this.uqaccountantid = 
        {
            xtype : 'hidden',
            id : 'uqaccountantid'
        };
		
		this.uqcasherid = 
        {
            xtype : 'hidden',
            id : 'uqcasherid'
        };
		
		this.uqcheckerid = 
        {
            xtype : 'hidden',
            id : 'uqcheckerid'
        };
		
		this.uqfillerid = 
        {
            xtype : 'hidden',
            id : 'uqfillerid'
        };
        
        this.dtdatesrv = 
        {
            xtype : 'hidden',
            id : 'dtdatesrv'
        };
        
        this.uqvoucherid = 
        {
            xtype : 'hidden',
            id : 'uqvoucherid'
        };
		
		var hiddenrow = 
	    {
	        layout : 'column',
	        border : false,
	        items : [
	        {
	            columnWidth : 1,
	            layout : 'form',
	            border : false,
	            items : [ this.mnydebitsum, this.mnycreditsum, this.uqcompanyid, 
	                     this.uqaccountantid, this.uqcasherid, this.uqcheckerid, this.uqfillerid,
	                     this.dtdatesrv, this.uqvoucherid]
	        }]
	    };
		
		var row0 = 
		{
            layout : 'column',
            border : false,
            labelAlign : 'right',
            items : [ {
                        columnWidth : 1,
                        layout : 'form',
                        border : false,
                        items : [
                        {
                            html : "会  计  凭  证",
                            cls : "xy-wf-title-txt"
                        }]
                    }]
        };
		
		this.items = [row0, row1, row2, hiddenrow];
		
		this.getStore().on("load", this.loaded, this);
		
		this.stopMonitoring();
		
		gl.vouchermanager.vouchermake.voucherform.superclass.initComponent.call(this);
		
		if(this.vouchertag == '0')
		{
			this.getStore().baseParams.vouchertag = '0';
		}
		else
		{
			this.getStore().baseParams.vouchertag = '1';
			this.getStore().baseParams.voucherid = this.framevoucherid;
		}	
		this.getStore().load();
	},
	periodchange : function (oldv,newv)
	{
		var intyearmonth = newv["column1"] + "";
		var strYear = intyearmonth.substr(0, 4);
        var strMonth = intyearmonth.substr(4, 2);
        
        var strDay = '01';
        if (!Ext.isEmpty(this.dtdate.getValue()))
        {
            strDay = this.dtdate.getValue().getDate().toString().padLeft(2);
        }
        if (strMonth < '01')
        {
            strMonth = '01';
            strDay = '01';
        }
        else if (strMonth > '12')
        {
            strMonth = '12';
            strDay = '31';
        }
        else
        {
        }
        this.dtdate.suspendEvents();
        this.dtdate.setValue(strYear + '-' + strMonth + '-' + strDay);
        this.dtdate.resumeEvents();
	},
	on_FillDateSelect : function(This)
    {
		if(this.vouchertag != 1)
		{
			var date = new Date(this.dtdate.getValue());
	        var strYearMonth = date.getFullYear().toString()
	                + (date.getMonth() + 1).toString().padLeft(2);
	        
	        if (this.uqglobalperiodid.store.lastOptions == null) // 没有取过数据
	        {
	            this.uqglobalperiodid.store.load();
	        }
	        else
	        {
	        	var store = this.uqglobalperiodid.store;
	            var index = store.find("column1", strYearMonth);
	            if (index >= 0)
	            {
	            	this.uqglobalperiodid.suspendEvents();
	            	this.uqglobalperiodid.setXyValue(store.getAt(index).data);
	            	this.uqglobalperiodid.resumeEvents();
	            }
	            else
	            {
	            	Ext.Msg.alert("提示","该制证日期对应的会计期没有开启");
	            	this.uqglobalperiodid.reset();
	            }
	        }
		}
    },
	validate : function()
	{
		//凭证字、会计期、单据数必输
		if (this.uqnumbering.getXyValue() == "")
        {
            Ext.Msg.alert("提示", "凭证字不能为空");
            return false;
        }
		if (this.uqglobalperiodid.getXyValue() == "")
        {
            Ext.Msg.alert("提示", "会计期不能为空");
            return false;
        }
		if (this.intaffix.getValue() == "")
        {
            Ext.Msg.alert("提示", "单据数不能为空");
            return false;
        }
		//日期是否在会计期起止时间范围内
		
		return true;
	},
	getCommitData : function()
	{
		var mnydebitsum = parseFloat(Ext.getCmp("mnydebitsum").getValue()).toFixed(2);
		var mnycreditsum = parseFloat(Ext.getCmp("mnycreditsum").getValue()).toFixed(2);
		//提交凭证主表数据
	    var commitobj = 
	    {
			uqvoucherid : Ext.getCmp("uqvoucherid").getValue(),
		    intvouchernum : Ext.getCmp("intvouchernum").getValue(),
		    uqnumbering : Ext.getCmp("uqnumbering").getXyValue(),
		    uqcompanyid : Ext.getCmp("uqcompanyid").getValue(),
		    intcompanyseq : Ext.getCmp("intcompanyseq").getValue(),
		    intaffix : Ext.getCmp("intaffix").getValue(),
		    uqglobalperiodid : Ext.getCmp("uqglobalperiodid").getXyValue(),
		    mnydebitsum : mnydebitsum+"",
		    mnycreditsum : mnycreditsum+"",
//		    mnydebitsum : Ext.getCmp("mnydebitsum").getValue(),
//		    mnycreditsum : Ext.getCmp("mnycreditsum").getValue(),
		    uqaccountantid : Ext.getCmp("uqaccountantid").getValue(),
		    uqcasherid : Ext.getCmp("uqcasherid").getValue(),
		    uqcheckerid : Ext.getCmp("uqcheckerid").getValue(),
		    uqfillerid : Ext.getCmp("uqfillerid").getValue(),
		    dtdate : Ext.getCmp("dtdate").getValue(),
		    dtdatesrv : Ext.getCmp("dtdatesrv").getValue()
	    };
	    
	    return commitobj;
	},
	loaded : function(store, records, options)
    {
		this.setInfo(store);
		
		Ext.get("lab_FillerName").dom.innerHTML = "制单：" + store.getAt(0).data["uqfillername"];
        Ext.get("lab_CheckName").dom.innerHTML = "审核：" + store.getAt(0).data["uqcheckername"];
        Ext.get("lab_CashName").dom.innerHTML = "出纳：" + store.getAt(0).data["uqcashername"];
        Ext.get("lab_AccountName").dom.innerHTML = "记账：" + store.getAt(0).data["uqaccountantname"];
        Ext.get("lab_AccountManager").dom.innerHTML = "会计主管：" + store.getAt(0).data["accountmanager"];
        
        if (this.uqglobalperiodid.store.lastOptions == null) // 没有取过数据
        {
            this.uqglobalperiodid.store.load();
        }
        
		if(this.vouchertag == '1')
		{
			Ext.getCmp("vouchergriddetail").getStore().baseParams.uqvoucherid = this.framevoucherid;
			Ext.getCmp("vouchergriddetail").getStore().load();
		}
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
						if (key == 'dtdate')
						{
							Ext.getCmp(key).suspendEvents();
							Ext.getCmp(key).setValue(record.data[key]);
							Ext.getCmp(key).resumeEvents();
						}
						else if (key == 'uqglobalperiodid')
						{
							Ext.getCmp(key).suspendEvents();
							Ext.getCmp(key).setXyValue(record.data[key]);
							Ext.getCmp(key).resumeEvents();
						}
						else if (Ext.getCmp(key).getXType().indexOf('xy') == 0
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
