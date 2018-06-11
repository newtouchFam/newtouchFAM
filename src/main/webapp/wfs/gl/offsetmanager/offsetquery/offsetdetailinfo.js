/**
 * 往来明细信息显示子页面
 */
Ext.namespace('gl.offsetmanager.offsetquery');
gl.offsetmanager.offsetquery.offsetdetailinfo = Ext.extend(Ext.grid.GridPanel,
    {
        height : 300,
        width : 1115,
        bodyStyle : "padding-right:0px!important",
        region : "center",
        autoScroll : true,
        count : 0,
        winType : '',
        title : '',
        getRecord : function ()
        {
            return Ext.data.Record.create([
                {
                    name : 'voucherid'
                }, {
                    name : 'perioddate'
                }, {
                    name : 'accountdate'
                }, {
                    name : 'intvouchernum'
                }, {
                    name : 'accountuser'
                }, {
                    name : 'varabstract'
                },{
                    name : 'accountledgertype'
                }, {
                    name : 'accountledger'
                }, {
                    name : 'yetmoney'
                }, {
                    name : 'isrelate'
                }, {
                    name : 'offsetuser'
                }, {
                    name : 'offsetdate'
                }, {
                    name : 'accountcode'
                }, {
                    name : 'uqaccountid'
                }/*, {
                    name : 'isrelate'
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
                }*/
            ]);
        },
        initComponent : function ()
        {
            if (this.winType == 'offset'){
                this.title = '冲挂账';
            }else{
                this.title = '冲付款';
            }
            //查找往来核销明细数据
            var url = 'offsetmanager/offsetquery/getdetaildata';
            this.store = new Ext.data.JsonStore(
                    {
                        totalProperty: "total",
                        root: "data",
                        url: url,
                        baseParams: {"jsonParams": "{}"},
                        fields: this.getRecord()
                    });
            this.createColModel = function (type) {
                var cols = [];
                cols.push(new Ext.grid.RowNumberer());
                cols.push(new Ext.grid.CheckboxSelectionModel({singleSelect: true}));
                cols.push({
                    hidden : true,
                    dataIndex : "voucherid"
                });
            
                cols.push({
                    header : '<div style="text-align:center">会计期</div>',
                    dataIndex : "perioddate",
                    format : 'Y-m-d',
                    align : "center",
                    width : 100
                });
                cols.push({
                    header : '<div style="text-align:center">记账日期</div>',
                    dataIndex : "accountdate",
                    format : 'Y-m-d',
                    align : "center",
                    width : 100
                });
                cols.push({
                    header : '<div style="text-align:center">凭证编号</div>',
                    dataIndex : "intvouchernum",
                    align : "center",
                    width : 80,
                });
                if (type == 'offset'){
                    cols.push({
                        header : '<div style="text-align:center">挂账人</div>',
                        dataIndex : "accountuser",
                        width : 80
                    });
                }else {
                    cols.push({
                        header : '<div style="text-align:center">制证人</div>',
                        dataIndex : "accountuser",
                        width : 80
                    });
                }
                cols.push({
                    header : '<div style="text-align:center">摘要</div>',
                    dataIndex : "varabstract",
                    width : 140
                });
                cols.push({
                	hidden : true,
                    header : '<div style="text-align:center">科目</div>',
                    dataIndex : "accountcode",
                    menuDisabled:true,
                    renderer : Freesky.Common.XyFormat.overFlowTip,
                    width : 130
                });
                cols.push({
                    header : '<div style="text-align:center">分户类别</div>',
                    dataIndex : "accountledgertype",
                    css : 'text-align:left;',
                    width : 90
                });
                cols.push({
                    header : '<div style="text-align:center">分户</div>',
                    dataIndex : "accountledger",
                    css : 'text-align:left;',
                    width : 90
                });
                if (type == 'offset'){
                    cols.push({
                        header : '<div style="text-align:right">本次被冲金额</div>',
                        dataIndex : "yetmoney",
                        align : "right",
                        renderer : Ext.app.XyFormat.cnMoney,
                        width : 100
                    });
                }else {
                    cols.push({
                        header : '<div style="text-align:right">本次所冲金额</div>',
                        dataIndex : "yetmoney",
                        align : "right",
                        renderer : Ext.app.XyFormat.cnMoney,
                        width : 100
                    });
                }
                cols.push({
                    header: '<div style="text-align:center">关联凭证</div>',
                    dataIndex: "isrelate",
                    align: "center",
                    width: 65
                });
                cols.push({
                    header : '<div style="text-align:center">冲销人</div>',
                    dataIndex : "offsetuser",
                    width : 80
                });
                cols.push({
                    header : '<div style="text-align:center">冲销时间</div>',
                    dataIndex : "offsetdate",
                    format : 'Y-m-d',
                    align : "center",
                    width : 130
                });
                return new Ext.grid.ColumnModel(cols);
            }
            this.colModel = this.createColModel(this.winType);
            
            //定义bbar
    		this.bbar = new Ext.PagingToolbar(
    		{
    			border : true,
    			pageSize : 20,
    			store : this.store,
    			displayInfo : true,
    			displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
    			emptyMsg : "没有记录"
    		});
    		
    		this.loadMask = 
    		{
    			msg : "数据加载中,请稍等...",
    			removeMask : true
    		};
    		
    		gl.offsetmanager.offsetquery.offsetdetailinfo.superclass.initComponent.call(this);
    		
    		this.addListener("rowdblclick", this.detailHandler.createDelegate(this));
    		
    		/*this.store.load(
    	    		{
    	    			params : 
    	    			{
    	    				start : 0,
    	    				limit : 20
    	    			}
    	    		});*/
        },
        detailHandler: function ()
        {
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
        }, 
        showVoucherDetial: function (voucherid)
        {
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
    	}, 
    	showInitDetail: function (uqaccountid, varaccountcode)
        {
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
        }
    });