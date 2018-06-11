/**
 * Created by zhaodongchao on 2017/10/9.
 */
Ext.namespace('gl.offsetmanager.currentoffset');
gl.offsetmanager.currentoffset.conditionpanel = Ext.extend(Ext.FormPanel,
    {
        frame : false,
        id:'gl.offsetmanager.currentoffset.conditionpanel',
        height : 62,
        border : false,
        offsetPanel : null,
        onAccountPanel : null,
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
                    id : 'gl.offsetmanager.currentoffset.account',
                    anchor : '100%',
                    labelStyle : 'text-align:right;width:60px;',
                    codecondition : '1,2,7,8',
                    fieldLabel : '科目'
                });
            //定义分户组件,跟科目不需要联动关系
           /* this.ledger = new Ext.app.xyledgertree(
                {
                    id : 'gl.offsetmanager.currentoffset.ledger',
                    anchor : '100%',
                    labelStyle : 'text-align:right:',
                    fieldLabel : '分户',
                    leafSelect : true,       //支持中间级选择
                    issinglechecked : true    //仅单选
                });*/
            this.ledger = new Ext.app.xyledgertreeac(
                {
                    id : 'ledgertree',
                    anchor : '100%',
                    labelStyle : 'text-align:right; width:60px',
                    fieldLabel : '分户',
                    ischeckaccount : true ,
                    issinglechecked : false,
                    accurrent : true  //往来冲销标志位
                });
            this.dtfilldatefrom = new Ext.form.DateField(
                {
                    id : 'gl.offsetmanager.currentoffset.dtfilldatefrom',
                    fieldLabel : "记账日期从",
                    width : 100,
                    anchor : '100%',
                    format : "Y-m-d",
                    disabled : false,
                    labelStyle : "text-align: right;width:100px"
                });

            this.dtfilldateto = new Ext.form.DateField(
                {
                    id : 'gl.offsetmanager.currentoffset.dtfilldateto',
                    fieldLabel : '至',
                    labelStyle : "text-align: right;width:45px",
                    width : 100,
                    anchor : '100%',
                    format : "Y-m-d",
                    labelSeparator:'',
                    disabled : false
                });
            this.account_user = new Ext.form.TextField(
                {
                    id : 'gl.offsetmanager.currentoffset.account_user',
                    fieldLabel : '制证人',
                    disabled : false,
                    labelStyle : "text-align: right;width :70px",
                    anchor : '100%'
                });

            this.moeny_form = new Ext.form.NumberField(
                {
                    id : 'gl.offsetmanager.currentoffset.moeny_form',
                    fieldLabel : '金额',
                    disabled : false,
                    labelStyle : "text-align: right; width:60px;",
                    anchor : '100%'
                });
            this.moeny_to = new Ext.form.NumberField(
                {
                    id : 'gl.offsetmanager.currentoffset.moeny_to',
                    fieldLabel : '-',
                    disabled : false,
                    labelStyle : "text-align: right; width:60px;",
                    labelSeparator:'',
                    anchor : '100%'
                });
            this.intStatus = new Ext.app.XyComboBoxCom(
                {
                    id : 'gl.offsetmanager.currentoffset.intstatus',
                    listWidth : 125,
                    leafSelect : true,
                    XyAllowDelete : false,
                    disabled : false,
                    anchor : '100%',
                    value:'全部',
                    rootTitle : '请选择',
                    labelStyle : "text-align: right;width:100px",
                    fieldLabel : '状态',
                    fields : ["column0", "column1"],
                    displayField : "column1",
                    valueField : "column0",
                    scriptPath : 'wfs',
                    sqlFile : 'selectuqrushstatus'
                });

            //查询
            this.querybutton = new Ext.Button(
                {
                    id : "query_button",
                    text :'查询',
                    labelStyle : "text-align: right;",
                    minWidth:70,
                    style : "margin-left:50px",
                    handler : this.queryHandler.createDelegate(this)
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
                        items : [this.startAccount, this.moeny_form]
                    }, {
                        columnWidth : .18,
                        layout : 'form',
                        border : false,
                        defaults : {
                            width : 150,
                            anchor : '100%'
                        },
                        items : [this.ledger, this.moeny_to]
                    }, {
                        columnWidth : .21,
                        layout : 'form',
                        border : false,
                        labelWidth :100,
                        defaults : {
                            width : 140,
                            anchor : '100%'
                        },
                        items : [this.dtfilldatefrom, this.intStatus]
                    }, {
                        columnWidth : .16,                        
                        layout : 'form',
                        border : false,
                        labelWidth : 45,
                        defaults : {
                            width : 140,
//                            anchor : '100%'
                        },
                        items : [this.dtfilldateto,this.querybutton]
                    },{
                        columnWidth : .18,
                        layout : 'form',
                        border : false,
                        labelWidth : 70,
                        defaults : {
                            width : 140,
                            anchor : '100%'
                        },
                        items : [this.account_user]
                    }]
                };

            this.items = [row0, row1];
            gl.offsetmanager.currentoffset.conditionpanel.superclass.initComponent.call(this);

            this.queryHandler();
        },
        getConditionParams : function ()
        {
            var params = {};
            params.account = Ext.getCmp("gl.offsetmanager.currentoffset.account").getXyValue();
          //  params.ledger = Ext.getCmp("gl.offsetmanager.currentoffset.ledger").getXyValue();
            params.ledger = this.ledger.ledgerdetailid;
            params.ledgertypeid = this.ledger.ledgertypeid;
            params.dtfilldatefrom = Ext.getCmp("gl.offsetmanager.currentoffset.dtfilldatefrom").getValue();
            params.dtfilldateto = Ext.getCmp("gl.offsetmanager.currentoffset.dtfilldateto").getValue();

            params.account_user = Ext.getCmp("gl.offsetmanager.currentoffset.account_user").getValue();
          //  params.money_form = this.moeny_form.value ;
            params.money_form = Ext.getCmp('gl.offsetmanager.currentoffset.moeny_form').getValue();
          //  params.money_to = this.moeny_to.value;
            params.money_to = Ext.getCmp('gl.offsetmanager.currentoffset.moeny_to').getValue();
 /*           if (!params.money_form){
                params.money_form = 0;
            }
            if (!params.money_to){
                params.money_to = 0;
            }*/
            params.intstatus = Ext.getCmp("gl.offsetmanager.currentoffset.intstatus").getValue();
            params.iswindow = 0 ;
            return Ext.encode(params);
        },
        queryHandler : function ()
        {
            //加载冲销数据
            this.offsetPanel.store.baseParams.jsonParams = this.getConditionParams();
            this.offsetPanel.store.load({
                params :
                    {
                        start : 0,
                        limit : 20
                    }
            });
            //加载挂账数据
            this.onAccountPanel.store.baseParams.jsonParams = this.getConditionParams();
            this.onAccountPanel.store.load({
                params :
                    {
                        start : 0,
                        limit : 20
                    }
            });
        },detailHandler : function ()
        {
            var records = this.getSelectionModel().getSelections();

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

            if (voucherid == '')
            {
                Ext.Msg.alert("提示","此记录没有关联凭证!");
                return;
            }
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
    });
