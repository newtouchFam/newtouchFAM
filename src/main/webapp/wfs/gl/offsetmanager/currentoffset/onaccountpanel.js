/**
 * Created by zhaodongchao on 2017/10/9.
 */
Ext.namespace('gl.offsetmanager.currentoffset');
gl.offsetmanager.currentoffset.onaccountpanel = Ext.extend(Ext.grid.GridPanel,
    {
        region : "center",
        id:'gl.offsetmanager.currentoffset.onaccountpanel',
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
                {
                    name : 'voucherid'
                }, {
                    name : 'uqvoucherdetailid'
                },{
                    name : 'iniid'
                }, {
                    name : 'accountdate'
                }, {
                    name : 'varabstract'
                }, {
                    name : 'accountledgertype'
                }, {
                    name : 'accountledger'
                }, {
                    name : 'intisledge'
                }, {
                    name : 'uqledgeid'
                }, {
                    name : 'uqledgetypeid'
                }, {
                    name : 'offsetmoney'
                }, {
                    name : 'yetmoney'
                }, {
                    name : 'remainmoney'
                }, {
                    name : 'isrelate'
                }, {
                    name : 'intvouchernum'
                }, {
                    name : 'accountcode'
                }, {
                    name : 'accountuser'
                }, {
                    name : 'uqaccountid'
                }, {
                    name : 'inttype'
                }, {
                    name : 'uqmainid'
                }]);

            //定义选择方式
            this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});

            this.cm = new Ext.grid.ColumnModel(
                [
                    new Ext.grid.RowNumberer(), this.sm,
                    {
                        hidden : true,
                        dataIndex : "voucherid"
                    },
                    {
                        header : '<div style="text-align:center">记账日期</div>',
                        dataIndex : "accountdate",
                        format : 'Y-m-d',
                        sortable:false,
                        align : "center",
                        width : 80
                    },
                    {
                        header : '<div style="text-align:center">摘要</div>',
                        dataIndex : "varabstract",
                        align : "left",
                        width : 120
                    },
                    {
                        header : '<div style="text-align:center">分户类别</div>',
                        dataIndex : "accountledgertype",
                        align : "left",
                        sortable:true,
                        width : 90
                    },
                    {
                        header : '<div style="text-align:center">分户</div>',
                        dataIndex : "accountledger",
                        align : "left",
                        sortable:true,
                        width : 80
                    },
                    {
                        header : '<div style="text-align:center">挂账金额</div>',
                        dataIndex : "offsetmoney",
                        align : "right",
                        renderer : Ext.app.XyFormat.cnMoney,
                        width : 120
                    },
                    {
                        header : '<div style="text-align:center">已冲金额</div>',
                        dataIndex : "yetmoney",
                        align : "right",
                        renderer : Ext.app.XyFormat.cnMoney,
                        width : 120
                    },
                    {
                        header : '<div style="text-align:center">挂账余额</div>',
                        dataIndex : "remainmoney",
                        align : "right",
                        renderer : Ext.app.XyFormat.cnMoney,
                        width : 120
                    },
                    {
                        header: '<div style="text-align:center">关联凭证</div>',
                        dataIndex: "isrelate",
                        align: "center",
                        width: 65
                    },
                    {
                        header : '<div style="text-align:center">凭证编号</div>',
                        dataIndex : "intvouchernum",
                        align : "center",
                        width : 95
                    },
                    {
                        header : '<div style="text-align:center">科目</div>',
                        dataIndex : "accountcode",
                        align : "left",
                        width : 150
                    },
                    {
                        header : '<div style="text-align:center">制证人</div>',
                        dataIndex : "accountuser",
                        align : "left",
                        width : 80
                    }
                ]);

            this.store = new Ext.data.JsonStore(
                {
                    totalProperty : "total",
                    root : "data",
                    url : 'offsetmanager/currentoffset/onaccount',
                    baseParams:{"jsonParams":"{}","dataType":"onaccount"},
                    fields : record,
                    sortInfo: {
                        field: 'accountdate',  //你要排序的列
                        direction: "ASC"  //排列顺序
                    }
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
            this.manual_match_button =
                {
                    id:'manual_match_button',
                    text : '人工匹配',
                    iconCls : "xy-associate",
                    handler : this.manualMatchHandler.createDelegate(this),
                    scope : this
                }

            this.reset_offset_button =
                {
                    id : "reset_offset_button",
                    text :'还原冲销',
                    iconCls : "xy-stop",
                    handler : this.revertRush.createDelegate(this)
                };
            this.look_voucher_button =
                {
                    id : "look_voucher_button",
                    text :'凭证明细',
                    iconCls : "xy-details",
                    handler : this.detailHandler.createDelegate(this)
                };
            this.intercourse_detail_button =
                {
                    id : "intercourse_detail_button",
                    text :'往来明细',
                    iconCls : "xy-show-complete",
                    handler : this.showIncomeDetails.createDelegate(this)
                };


            this.tbar = new Ext.Toolbar({
                items:['挂账记录:',
                    this.manual_match_button,
                    '-',this.reset_offset_button,
                    '-',this.look_voucher_button,
                    '-',this.intercourse_detail_button]
            });
            gl.offsetmanager.currentoffset.onaccountpanel.superclass.initComponent.call(this);
            this.addListener("rowdblclick", this.detailHandler.createDelegate(this));
        },showIncomeDetails:function () {
//             Ext.Msg.alert('提示','暂未实现');
        	var records = this.getSelectionModel().getSelections();;

        	if (null == records || records.length <= 0) {
                Ext.Msg.alert("提示", "请先勾选一条记录!");
                return;
            }

            if (records.length > 1) {
                Ext.Msg.alert("提示", "查看往来明细只能选择一行信息!");
                return;
            }
            if(records[0].get("inttype") == '1')
            {
            	records[0].set("offsettype", "冲销");
            	var offsetdetail = new gl.offsetmanager.offsetquery.offsetdetailquery(
                        {
                            winType: "offset",
                            selectInfo: records[0]
                        }
                    );
            }
            if(records[0].get("inttype") == '2')
            {
            	records[0].set("offsettype", "挂账");
            	var offsetdetail = new gl.offsetmanager.offsetquery.offsetdetailquery(
                        {
                            winType: "onaccount",
                            selectInfo: records[0]
                        }
                    );
            }
            /*var win = new Ext.Window(
                    {
                    	layout: 'fit',
                        title: "往来明细查询",
                        id : 'offsetdetailwin',
                        frame: true,
                        modal: true,
                        width: 1100,
                        height: 400,
                        border: false,
                        buttonAlign: 'center',
                        items : [offsetdetail]
                    });*/
            offsetdetail.show();
    },manualMatchHandler:function () {
        var records = this.getSelectionModel().getSelections();
        if (null == records || records.length <= 0)
        {
            Ext.Msg.alert("提示","请先勾选一条挂账数据!");
            return;
        }
        if (records.length > 1)
        {
            Ext.Msg.alert("提示","人工匹配只能选择一行信息!");
            return;
        }
        //alert(records[0].get("intvouchernum"));
        records[0].set("varledgername", records[0].get("accountledger"));
        var win = new gl.offsetmanager.currentoffset.manualmachewin(
            {
                winType:"onaccount",
                selectInfo:records[0]
            }
        );
        win.show();
    },detailHandler : function ()
        {
            var records = this.getSelectionModel().getSelections();;

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
            }else
            {
                this.showVoucherDetial(voucherid);
            }
        },revertRush:function ()
    {
        var records = this.getSelectionModel().getSelections();
        if (null == records || records.length <= 0)
        {
            Ext.Msg.alert("提示","请先至少勾选一条记录!");
            return;
        }
        //对于还原冲销操作，操作的数据必定存在于往来信息记录表中，已冲金额必定大于0
        for(var i=0 ; i< records.length ; i++){
            if (records[i].get('yetmoney') == 0 || records[i].get('uqmainid') == ''){
                Ext.Msg.alert("提示","您勾选的记录中存在未冲销记录，请重新勾选!");
                return;
            }
        }
        Ext.Ajax.request(
            {
                url : "offsetmanager/currentoffset/revertRush",
                method: 'post',
                params :
                    {
                        "revertRecords" : JSON.stringify(this.parseRecord2JSON(records))
                    },
                success : function(response)
                {
                    var r = Ext.decode(response.responseText);
                    if (r.success)
                    {
                        Ext.Msg.alert("提示", "还原成功");
                        Ext.getCmp('gl.offsetmanager.currentoffset.conditionpanel').queryHandler();
                    }
                    else
                    {
                        Ext.Msg.alert("错误", r.msg);
                    }
                }.createDelegate(this),
                failure : function(response)
                {
                    Ext.Msg.alert("错误","还原失败！");
                    return;
                }
            });
    },parseRecord2JSON:function (records)
    {
        var results = [] ;
        for (var i=0 ; i< records.length ; i++){
            var record = {} ;
            record.uqmainid = records[i].get('uqmainid');
            record.inttype = records[i].get('inttype') ;
            results.push(record);
        }
        return results ;
    },showVoucherDetial:function (voucherid) {
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