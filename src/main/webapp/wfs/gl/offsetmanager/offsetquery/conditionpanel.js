/**
 * 条件查询面板
 * Author : xtc
 * date   : 2017/12/19
 */
Ext.namespace('gl.offsetmanager.offsetquery');
gl.offsetmanager.offsetquery.conditionpanel = Ext.extend(Ext.FormPanel,
    {
        frame : false,
        id :  'gl.offsetmanager.offsetquery.conditionpanel',
        height : 86,
        border : false,
        rushedinfopanel : null,
        initComponent : function ()
        {
            var row0 =
                {
                    height : 6,
                    border : false
                };
            //定义科目组件
            this.startAccount = new gl.component.xychooseaccount(
                {	               	
                    id : 'gl.offsetmanager.offsetquery.account',
                    anchor : '100%',
                    labelStyle : 'text-align:right;width:60px;',
                    fieldLabel : '科目',
                    width : 100,
                });
            //定义分户组件
            this.ledger = new Ext.app.xyledgertreeac(
                {
                    id : 'ledgertree',
                    anchor : '100%',
                    labelStyle : 'text-align:right;width:60px;',
                    fieldLabel : '分户',
                    ischeckaccount : true ,
                    issinglechecked : false,
                    accurrent : true  //往来冲销标志位
                });
            this.offsettype =  new Ext.app.XyComboBoxCom(
                {
                    id : 'gl.offsetmanager.offsetquery.offsettype',
                    listWidth : 107,
                    leafSelect : true,
                    XyAllowDelete : false,
                    disabled : false,
                    anchor : '100%',
                    value : '全部',
                    rootTitle : '请选择',
                    labelStyle : "text-align: right;width:80px;",
                    fieldLabel : '往来类型',
                    fields : ["column0", "column1"],
                    displayField : "column1",
                    valueField : "column0",
                    scriptPath : 'wfs',
                    sqlFile : 'selectoffsettype',
                });
            this.accountingperiodfrom = new Ext.app.XyComboBoxCom(
                {
                    id : 'gl.offsetmanager.offsetquery.accountingperiodfrom',
                    fieldLabel : "会计期",
                    width : 80,
                    anchor : '100%',
                    leafSelect : true,
                    XyAllowDelete : true,
                    disabled : (this.vouchertag == 1),
                    rootTitle : '请选择',
                    labelStyle : "text-align: right;width:70px;",
                    fields : ["column0", "column1", "column2", "column3"],
                    displayField : "column3",
                    valueField : "column0",
                    scriptPath : 'wfs',
                    sqlFile : 'selectperiod',
                });
        
            this.accountingperiodto = new Ext.app.XyComboBoxCom(
                {
                    id : 'gl.offsetmanager.offsetquery.accountingperiodto',
                    fieldLabel : '至',
                    labelStyle : "text-align: right;width:40px;",
                    width : 80,
                    anchor : '100%',
                    leafSelect : true,
                    XyAllowDelete : true,
                    disabled : (this.vouchertag == 1),
                    labelSeparator : '',
                    fields : ["column0", "column1", "column2", "column3"],
                    displayField : "column3",
                    valueField : "column0",
                    scriptPath : 'wfs',
                    sqlFile : 'selectperiod',
                });
            this.dtfilldatefrom = new Ext.form.DateField(
                {
                    id : 'gl.offsetmanager.offsetquery.dtfilldatefrom',
                    fieldLabel : "记账日期",
                    width : 50,
                    anchor : '100%',
                    format : "Y-m-d",
                    disabled : false,
                    labelStyle : "text-align: right;width:60px;"
                });

            this.dtfilldateto = new Ext.form.DateField(
                {
                    id : 'gl.offsetmanager.offsetquery.dtfilldateto',
                    fieldLabel : '至',
                    width : 80,
                    anchor : '100%',
                    format : "Y-m-d",
                    labelSeparator : '',
                    disabled : false,
                    labelStyle : "text-align: right;width:58px;"
                });
            this.account_user = new Ext.form.TextField(
                {
                    id : 'gl.offsetmanager.offsetquery.account_user',
                    fieldLabel : '制证人',
                    disabled : false,
                    labelStyle : "text-align: right;width:80px;",
                    anchor : '100%'
                });

            this.moeny_form = new Ext.form.NumberField(
                {
                    id : 'gl.offsetmanager.offsetquery.moeny_form',
                    fieldLabel : '金额',
                    disabled : false,
                    labelStyle : "text-align: right;width:70px;",
                    anchor : '100%',
                });
            this.moeny_to = new Ext.form.NumberField(
                {
                    id : 'gl.offsetmanager.offsetquery.moeny_to',
                    fieldLabel : '-',
                    labelWidth : 50,
                    disabled : false,
                    labelSeparator : '',
                    anchor : '100%',
                    labelStyle : "text-align: right;width:40px;",
                });
            this.intStatus = new Ext.app.XyComboBoxCom(
                {
                    id : 'gl.offsetmanager.offsetquery.intstatus',
                    listWidth : 130,
                    leafSelect : true,
                    XyAllowDelete : false,
                    disabled : false,
                    anchor : '100%',
                    value : '全部',
                    rootTitle : '请选择',
                    labelStyle : "text-align: right;width:60px;",
                    fieldLabel : '状态',
                    fields : ["column0", "column1"],
                    displayField : "column1",
                    valueField : "column0",
                    scriptPath : 'wfs',
                    sqlFile : 'selectuqrushstatus'
                });
            this.varabstract = new Ext.form.TextField(
                {
                    id : 'gl.offsetmanager.offsetquery.varabstract',
                    fieldLabel : '摘要',
                    disabled : false,
                    anchor : '100%',
                    labelStyle : "text-align: right;width:60px;",
                });
            //查询
            this.querybutton = new Ext.Button(
                {
                    id : "query_button",
                    text :'查询',
                    minWidth : 70,
                    labelStyle : "text-align: right;width:50px;",
                    handler : this.queryHandler.createDelegate(this)
                });
            //凭证明细
            this.voucherbutton = new Ext.Button(
            	{
            		id : "voucher_button",
                    text :'凭证明细',
                    minWidth : 70,
                    labelStyle : "text-align: right;width:50px;",
                    handler: this.voucherHandler.createDelegate(this)	
            	});
            //往来明细
            this.offsetbutton = new Ext.Button(
                {
                	id : "offset_button",
                    text :'往来明细',
                    minWidth : 70,
                    labelStyle : "text-align: right;width:50px;",
                    handler : this.showIncomeDetails.createDelegate(this)	
                });
            var row1 =
                {	
                    layout : 'column',
                    border : false,
                    labelAlign : "right",
                    labelWidth : 60,
                    items : [{
                        columnWidth : .18,
                        layout : 'form',
                        border : false,  
                        defaults : {
                        	width : 150,
                            anchor : '100%'
                        },
                        items : [this.startAccount, this.dtfilldatefrom,]
                    }, {
                        columnWidth : .18,
                        layout : 'form',
                        border : false,
                        defaults : {
                        	width : 150,
                            anchor : '100%'
                        },
                        items : [this.ledger, this.dtfilldateto]
                    }, {
                        columnWidth : .18,
                        layout : 'form',
                        border : false,
                        labelAlign : "right",
                        labelWidth : 80,
                        defaults : {
                        	width : 125,
                            anchor : '100%'
                        },
                        items : [this.offsettype, this.account_user]
                    },{
                        columnWidth : .18,
                        layout : 'form',
                        border : false,
                        labelAlign : "right",
                        labelWidth : 70,
                        defaults : {
                            anchor : '100%'
                        },
                        items : [this.accountingperiodfrom, this.moeny_form]
                    },{
                        columnWidth : .18,
                        layout : 'form',
                        border : false,
                        labelWidth : 40,
                        defaults : {
                            anchor : '100%'
                        },
                        items : [this.accountingperiodto, this.moeny_to]
                    }]
                };
            var row2 =
            	{	
            		 layout : 'column',
                     border : false,
                     labelAlign : "right",
                     labelWidth : 60,
                     items : [{
                    	 columnWidth : .18,
                         layout : 'form',
                         border : false,
                         defaults : {
                        	 width : 150,
                             anchor : '100%'
                         },
                         items : [this.intStatus]
                     },{
                         columnWidth : .36,
                         layout : 'form',
                         border : false,
                         defaults : {
                        	 width : 360,
                             anchor : '100%'
                         },
                         items : [this.varabstract]
                     },{
                         columnWidth : .095,
                         style : 'margin-left:35px',
                         layout : 'form',
                         border : false,
                         defaults : {
                         width : 70,
                         },
                         items : [this.querybutton]
                     },{
                         columnWidth : .08,
                         style : 'margin-left:20px',
                         layout : 'form',
                         border : false,
                         defaults : {
                            width : 70,
                         },
                         items : [this.voucherbutton]
                     },{
                    	 style : 'margin-left:20px',
                         columnWidth : .08,
                         layout : 'form',
                         border : false,
                         defaults : {
                             width : 70,
                         },
                         items : [this.offsetbutton]
                     }]
            	}
         

            this.items = [row0, row1, row2];
            gl.offsetmanager.offsetquery.conditionpanel.superclass.initComponent.call(this);
            this.queryHandler();
        },
        getConditionParams : function ()
        {	
            var params = {};
            params.account = Ext.getCmp("gl.offsetmanager.offsetquery.account").getXyValue();
            params.ledger = this.ledger.ledgerdetailid;
            params.ledgertypeid = this.ledger.ledgertypeid;
            params.offsettype = Ext.getCmp("gl.offsetmanager.offsetquery.offsettype").getValue(); 
            params.accountingperiodfrom = Ext.getCmp("gl.offsetmanager.offsetquery.accountingperiodfrom").getRawValue();
            params.accountingperiodto = Ext.getCmp("gl.offsetmanager.offsetquery.accountingperiodto").getRawValue();
            params.dtfilldatefrom = Ext.getCmp("gl.offsetmanager.offsetquery.dtfilldatefrom").getValue();
            params.dtfilldateto = Ext.getCmp("gl.offsetmanager.offsetquery.dtfilldateto").getValue();
            params.account_user = Ext.getCmp("gl.offsetmanager.offsetquery.account_user").getValue();
            params.money_form = Ext.getCmp("gl.offsetmanager.offsetquery.moeny_form").getValue();
            params.money_to = Ext.getCmp("gl.offsetmanager.offsetquery.moeny_to").getValue();
            params.intstatus = Ext.getCmp("gl.offsetmanager.offsetquery.intstatus").getValue();
            params.varabstract = Ext.getCmp("gl.offsetmanager.offsetquery.varabstract").getValue();
            params.iswindow = 0 ;
            return Ext.encode(params);
        },
        queryHandler : function ()
        {	
            //加载数据
            this.rushedinfopanel.getStore().baseParams.jsonParams = this.getConditionParams();
            this.rushedinfopanel.getStore().load({
                params :
                    {
                        start : 0,
                        limit : 20
                    }
            });
        },voucherHandler : function ()
        {	
            var records = this.rushedinfopanel.getSelectionModel().getSelections();

            if (null == records || records.length <= 0)
            {
                Ext.Msg.alert("提示","请先勾选一条记录!");
                return;
            }

            if (records.length > 1)
            {
                Ext.Msg.alert("提示","查看明细只能选择一行信息!");
                return;
            }

            var voucherid=records[0].get('voucherid');
            var uqaccountid = records[0].get('uqaccountid');
            if (voucherid == '')
            {
            	 this.showInitDetail(uqaccountid,records[0].get('accountcode'));
            }
            else
            {
            	 var vouchermain = new gl.vouchermanager.vouchermake.vouchermain({isView : true, layout : 'border', vouchertag : '1', voucherid : voucherid});

                 var win = new Ext.Window(
                     {
                         layout : 'fit',
                         id : "voucherwin",
                         frame : true,
                         width : 800,
                         modal : true,
                         height : 400,
                         border : false,
                         title : "凭证",
                         items : [vouchermain]
                     });

                 win.show();
            }
           
        },showIncomeDetails: function () 
        {
        	var records = this.rushedinfopanel.getSelectionModel().getSelections();

            if (null == records || records.length <= 0) {
                Ext.Msg.alert("提示", "请先勾选一条记录!");
                return;
            }

            if (records.length > 1) {
                Ext.Msg.alert("提示", "查看往来明细只能选择一行信息!");
                return;
            }
            if(records[0].get("offsettype") == "冲销")
            {
            	var win = new gl.offsetmanager.offsetquery.offsetdetailquery(
                        {
                            winType: "offset",
                            selectInfo: records[0]
                        }
                    );
            }
            if(records[0].get("offsettype") == "挂账")
            {
            	var win = new gl.offsetmanager.offsetquery.offsetdetailquery(
                        {
                            winType: "onaccount",
                            selectInfo: records[0]
                        }
                    );
            }
            
            win.show();
        },showInitDetail:function (uqaccountid,varaccountcode) {
            var editWinLabel= new Ext.Panel({
                layout : 'table',
                id :'editWinLabel',
                region:'center',
                border : false,
                title :'科目'
            });
            var win = new Ext.Window(
                {
                    id : 'editwindow',
                    title : '初始化',
                    border : false,
                    width :713,
                    height : 450,
                    modal : true,
                    buttonAlign:'center',
                    closeAction: 'close',
                    layout : 'border',
                    resizable : false,
                    items : [
                        {region:'north',layout:'border',height : 30,items:[editWinLabel]},
                        {region:'center',layout:'border',items:[new gl.offsetmanager.currentoffset.initdetail({uqaccountid:uqaccountid})]}
                    ],
                    buttons : [ { handler : function() {win.close();}.createDelegate(this), text : "关闭"}]
                });
            win.show();
            Ext.getCmp('editWinLabel').setTitle('科目：'+varaccountcode);
        }
    });
