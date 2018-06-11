/**
 * 已冲销数据信息面板
 * Author : xtc
 * date   : 2017/12/19
 */
Ext.namespace('gl.offsetmanager.offsetquery');
gl.offsetmanager.offsetquery.rushedinfopanel = Ext.extend(Ext.grid.GridPanel,
    {
        region: "south",
        //列是否能移动
        enableColumnMove: false,
        //是否显示列菜单
        enableHdMenu: false,
        //是否隐藏滚动条
        autoHeight: false,
        autoScroll: true,
        store: null,
        frame: false,
        border: false,
        initComponent: function () {
            var record = Ext.data.Record.create([
                {
                    name: 'voucherid'//序号
                }, 
                {
                    name: 'accountdate'//记账日期
                },
                {
                    name: 'offsettype'//往来类型
                },
                {
                    name: 'intvouchernum'//凭证编号
                },
                {
                    name: 'accountuser'//制证人
                },
                {
                    name: 'varabstract'//摘要
                }, 
                {
                    name: 'accountledgertype'//分户类别
                }, 
                {
                    name: 'accountledger'//分户
                },
                {
                    name: 'offsetmoney'//往来金额
                }, 
                {
                    name: 'yetmoney'//已冲金额
                }, 
                {
                    name: 'remainmoney'//未往来金额
                }, 
                {
                    name: 'isrelate'//关联凭证
                },  
                {
                    name: 'accountcode'//科目
                }, 
                {
                    name: 'accountingperiod'//会计期
                }, 
                {
                    name: 'uqvoucherdetailid'
                }, 
                {
                    name: 'iniid'
                },  
                {
                    name: 'uqledgeid'
                }, 
                {
                    name: 'uqledgertypeid'
                }, 
                {
                    name: 'intisledge'
                },
                {
                    name: 'uqaccountid'
                }, 
                {
                    name: 'inttype'
                }, 
                {
                    name: 'uqmainid'
                }]);


            //定义选择方式
            this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect: false});

            this.cm = new Ext.grid.ColumnModel(
                [
                    new Ext.grid.RowNumberer(), this.sm,
                    {
                        hidden: true,
                        dataIndex: "voucherid"
                    },
                    {
                        header: '<div style="text-align:center">记账日期</div>',
                        dataIndex: "accountdate",
                        format: 'Y-m-d',
                        align: "center",
                        sortable: false,
                        width: 80
                    },
                    {
                        header: '<div style="text-align:center">往来类型</div>',
                        dataIndex: "offsettype",
                        align: "left",
                        width: 60
                    },
                    {
                        header: '<div style="text-align:center">凭证编号</div>',
                        dataIndex: "intvouchernum",
                        align: "center",
                        width: 65
                    },
                    {
                        header: '<div style="text-align:center">制证人</div>',
                        dataIndex: "accountuser",
                        align: "left",
                        width: 80
                    },
                    {
                        header: '<div style="text-align:center">摘要</div>',
                        dataIndex: "varabstract",
                        align: "left",
                        width: 100
                    },
                    {
                        header: '<div style="text-align:center">分户类别</div>',
                        dataIndex: "accountledgertype",
                        align: "left",
                        sortable: true,
                        width: 80
                    },
                    {
                        header: '<div style="text-align:center">分户</div>',
                        dataIndex: "accountledger",
                        sortable: true,
                        align: "left",
                        width: 80
                    },
                    {
                        header: '<div style="text-align:center">往来金额</div>',
                        dataIndex: "offsetmoney",
                        align: "right",
                        renderer: Ext.app.XyFormat.cnMoney,
                        width: 100
                    },
                    {
                        header: '<div style="text-align:center">已冲金额</div>',
                        dataIndex: "yetmoney",
                        align: "right",
                        renderer: Ext.app.XyFormat.cnMoney,
                        width: 100
                    },
                    {
                        header: '<div style="text-align:center">未往来金额</div>',
                        dataIndex: "remainmoney",
                        align: "right",
                        renderer: Ext.app.XyFormat.cnMoney,
                        width: 100
                    },
                    {
                        header: '<div style="text-align:center">关联凭证</div>',
                        dataIndex: "isrelate",
                        align: "center",
                        width: 54
                    },
                  
                    {
                        header: '<div style="text-align:center">科目</div>',
                        dataIndex: "accountcode",
                        align: "left",
                        width: 120
                    },
                    {
                        header: '<div style="text-align:center">会计期</div>',
                        dataIndex: "accountingperiod",
                        align: "left",
                        width: 80
                    },
                 
                ]);

            this.store = new Ext.data.JsonStore(
                {
                    totalProperty: "total",
                    root: "data",
                    url: 'offsetmanager/offsetquery/getdata',
                    baseParams: {"jsonParams": "{}"},
                    fields: record,
                    sortInfo: {
                        field: 'accountdate',  //你要排序的列
                        direction: "ASC"  //排列顺序
                    }
                });

            this.bbar = new Ext.PagingToolbar(
                {
                    border: true,
                    pageSize: 20,
                    store: this.store,
                    displayInfo: true,
                    displayMsg: '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
                    emptyMsg: "没有记录"
                });

            this.look_voucher_button =
                {
                    id: "look_voucher_button",
                    text: '凭证明细',
                    iconCls: "xy-details",
                    minWidth: 70,
                    handler: this.detailHandler.createDelegate(this)
                };
            this.intercourse_detail_button =
                {
                    id: "intercourse_detail_button",
                    text: '往来明细',
                    iconCls: "xy-show-complete",
                    minWidth: 70,
                    handler: this.showIncomeDetails.createDelegate(this)
                };


            gl.offsetmanager.offsetquery.rushedinfopanel.superclass.initComponent.call(this);
            //设置双击事件
            this.addListener("rowdblclick", this.detailHandler.createDelegate(this));
        }, showIncomeDetails: function () {
        Ext.Msg.alert('提示', '暂未实现');
    }, 
        detailHandler: function () {
            var records = this.getSelectionModel().getSelections();

            if (null == records || records.length <= 0) {
                Ext.Msg.alert("提示", "请先勾选一条记录!");
                return;
            }

            if (records.length > 1) {
                Ext.Msg.alert("提示", "查看明细只能选择一行信息!");
                return;
            }

            var voucherid = records[0].get('voucherid');
            var uqaccountid = records[0].get('uqaccountid');
            if (voucherid == '') {
                this.showInitDetail(uqaccountid, records[0].get('accountcode'));
            } else {
                this.showVoucherDetial(voucherid);
            }
        },  parseRecord2JSON: function (records) {
        var results = [];
        for (var i = 0; i < records.length; i++) {
            var record = {};
            record.uqmainid = records[i].get('uqmainid');
            record.inttype = records[i].get('inttype');
            results.push(record);
        }
        return results;
    }, showVoucherDetial: function (voucherid) {
        var vouchermain = new gl.vouchermanager.vouchermake.vouchermain({
            isView: true,
            layout: 'border',
            vouchertag: '1',
            voucherid: voucherid
        });

        var win = new Ext.Window(
            {
                layout: 'fit',
                id: "voucherwin",
                frame: true,
                width: 800,
                modal: true,
                height: 400,
                border: false,
                title: "凭证",
                items: [vouchermain]
            });

        win.show();

    }, showInitDetail: function (uqaccountid, varaccountcode) {
        var editWinLabel = new Ext.Panel({
            layout: 'table',
            id: 'editWinLabel',
            region: 'center',
            border: false,
            title: '科目'
        });
        var win = new Ext.Window(
            {
                id: 'editwindow',
                title: '初始化',
                border: false,
                width: 713,
                height: 450,
                modal: true,
                buttonAlign: 'center',
                closeAction: 'close',
                layout: 'border',
                resizable: false,
                items: [
                    {region: 'north', layout: 'border', height: 30, items: [editWinLabel]},
                    {
                        region: 'center',
                        layout: 'border',
                        items: [new gl.offsetmanager.currentoffset.initdetail({uqaccountid: uqaccountid})]
                    }
                ],
                buttons: [{
                    handler: function () {
                        win.close();
                    }.createDelegate(this), text: "关闭"
                }]
            });
        win.show();
        Ext.getCmp('editWinLabel').setTitle('科目：' + varaccountcode);
    },  parseRecord2JSON_rush: function (records) {
        var results = [];
        for (var i = 0; i < records.length; i++) {
            var record = {};
            record.uqvoucherid = records[i].get('voucherid') == undefined ? '' : records[i].get('voucherid');
            record.uqvoudetailid = records[i].get('uqvoucherdetailid') == undefined ? '' : records[i].get('uqvoucherdetailid');
            record.iniid = records[i].get('iniid') == undefined ? '' : records[i].get('iniid');
            record.uqaccountid = records[i].get('uqaccountid') == undefined ? '' : records[i].get('uqaccountid');
            record.uqledgetypeid = records[i].get('uqledgertypeid') == undefined ? '' : records[i].get('uqledgertypeid');
            record.uqledgeid = records[i].get('uqledgeid') == undefined ? '' : records[i].get('uqledgeid');
            record.offsetmoney = records[i].get('offsetmoney') == undefined ? '0' : records[i].get('offsetmoney')+'';
            record.yetmoney = records[i].get('yetmoney') == undefined ? '0' : records[i].get('yetmoney')+'';
            record.remainmoney = records[i].get('remainmoney') == undefined ? '0' : records[i].get('remainmoney')+'';
            record.inttype = records[i].get('inttype');
            results.push(record);
        }
        return results;
    }

    });