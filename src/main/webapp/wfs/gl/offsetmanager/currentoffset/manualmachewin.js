/**
 * Created by Administrator on 2017/10/18.
 */
Ext.namespace('gl.offsetmanager.currentoffset');
gl.offsetmanager.currentoffset.manualmachewin = Ext.extend(Ext.Window,
    {
        layout: 'fit',
        title: "人工匹配",
        id: "gl.offsetmanager.currentoffset.manualmachewin",
        frame: true,
        modal: true,
        width: 1150,
        height: 400,
        border: false,
        buttonAlign: 'center',
        winType: null,//打开方式，时显示冲挂账数据还是显示冲付款数据
        selectInfo: null,//主界面选择的一条record
        //凭证相关参数
        vouchergrid : null,
        ladgerac : null,
        //凭证往来标志位
        intisvoucher : false,
        ledgerPageId : '',
        initComponent: function () {
            this.account_win = new Ext.form.TextField(
                {
                    id: 'currentoffset.manualmachewin.account_win',
                    fieldLabel: '科目',
                    disabled: true,
                    labelStyle: "text-align: right;",
                    anchor: '100%',
                    listeners: {
                        'render': function (c) {
                            c.getEl().dom.style.background = "#E4E4E4";
                        }
                    }
                });
            this.ledge_win = new Ext.form.TextField(
                {
                    id: 'currentoffset.manualmachewin.ledge_win',
                    fieldLabel: '分户',
                    disabled: true,
                    labelStyle: "text-align: right;width:70px",
                    anchor: '100%',
                    listeners: {
                        'render': function (c) {
                            c.getEl().dom.style.background = "#E4E4E4";
                        }
                    }
                });

            this.moeny_unoffset = new Ext.form.TextField(
                {
                    id: 'currentoffset.manualmachewin.moeny_unoffset',
                    fieldLabel: '未冲金额',
                    disabled: true,
                    labelStyle: "text-align: right;",
                    anchor: '100%'
                });
            this.dtfilldatefrom_win = new Ext.form.DateField(
                {
                    id: 'currentoffset.manualmachewin.dtfilldatefrom_win',
                    fieldLabel: "记账日期从",
                    labelWidth: 80,
                    format: "Y-m-d",
                    disabled: false,
                    anchor: '100%',
                    labelStyle: "text-align: right;"
                });

            this.dtfilldateto_win = new Ext.form.DateField(
                {
                    id: 'currentoffset.manualmachewin.dtfilldateto_win',
                    fieldLabel: '至',
                    width: 170,
                    anchor: '90%',
                    labelWidth: 30,
                    format: "Y-m-d",
                    labelSeparator: '',
                    labelStyle: "align: left;width:50px;",
                    disabled: false
                });

            this.moeny_form_win = new Ext.form.NumberField(
                {
                    id: 'currentoffset.manualmachewin.moeny_form_win',
                    fieldLabel: '金额',
                    disabled: false,
                    labelWidth: 50,
                    labelStyle: "text-align: right;width:50px;",
                    anchor: '90%',
                    width: 170
                });
            this.moeny_to_win = new Ext.form.NumberField(
                {
                    id: 'currentoffset.manualmachewin.moeny_to_win',
                    fieldLabel: '-',
                    disabled: false,
                    labelSeparator: '',
                    labelWidth: 30,
                    width: 170,
                    anchor: '90%',
                    labelStyle: "align: left;width:30px;"
                });
            this.voucher_remark = new Ext.form.TextField(
                {
                    id: 'currentoffset.manualmachewin.voucher_remark',
                    fieldLabel: '摘要',
                    anchor: '100%',
                    disabled: false,
                    labelStyle: "text-align: right;"
                });
            var row0 =
                {
                    height: 6,
                    border: false
                };
            var row1 =
                {
                    layout: 'column',
                    border: false,
                    labelAlign: "right",
                    labelWidth: 100,
                    items: [{
                        columnWidth: .29,
                        layout: 'form',
                        border: false,
                        defaults: {
                            width: 220,
                            anchor: '100%'
                        },
                        items: [this.account_win]
                    }, {
                    	labelWidth : 70,
                        columnWidth: .27,
                        layout: 'form',
                        border: false,
                        defaults: {
                            width: 220
                        },
                        items: [this.ledge_win]
                    }, {
                        columnWidth: .258,
                        layout: 'form',
                        border: false,
                        defaults: {
                            width: 220
                        },
                        items: [this.moeny_unoffset]
                    }]
                };
            var row2 =
                {
                    layout: 'column',
                    border: false,
                    labelAlign: "right",
                    labelWidth: 100,
                    items: [{
                        columnWidth: .23,
                        layout: 'form',
                        border: false,
                        defaults: {
                            width: 130,
                         
                        },
                        items: [this.dtfilldatefrom_win]
                    }, {
                        columnWidth: .20,
                        layout: 'form',
                        border: false,
                        labelWidth: 40,
                        defaults: {
                            width: 130,
                        
                        },
                        items: [this.dtfilldateto_win]
                    }, {
                        columnWidth: .21,
                        layout: 'form',
                        border: false,
                        labelWidth: 40,
                        defaults: {
                            width: 110
                        },
                        items: [this.moeny_form_win]
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        border: false,
                        labelWidth: 30,
                        defaults: {
                            width: 110
                        },
                        items: [this.moeny_to_win]
                    }]
                };
            //查询
            this.querybutton = new Ext.Button(
                {
                    id: "query_button",
                    text: '查询',
                    minWidth: 70,
                    style : "margin-left:36px",
                    handler: this.queryHandler.createDelegate(this)
                });
            this.look_voucher_button =new Ext.Button(
                {
                    id: "look_voucher_button",
                    style : "margin-left:30px",
                    text: '凭证明细',
                    minWidth: 70,
                    handler: this.detailHandler.createDelegate(this)
                });
            var row3 =
                {
                    layout: 'column',
                    border: false,
                    labelAlign: "right",
                    labelWidth: 100,
                    items: [{
                        columnWidth: .416,
                        layout: 'form',
                        border: false,
                        defaults: {
                            width: 220,
                            anchor: '100%'
                        },
                        items: [this.voucher_remark]
                    }, {
                        columnWidth: .10,
                        layout: 'form',
                        border: false,
                        defaults: {
                            width: 170
                        },
                        items: [this.querybutton]
                    }, {
                        columnWidth: .10,
                        layout: 'form',
                        border: false,
                        defaults: {
                            width: 170
                        },
                        items: [this.look_voucher_button]
                    }]
                };
            this.conditionPanel = new Ext.FormPanel({
                frame: false,
                height: 88,
                border: false,
                region: "north",
                items: [row0, row1, row2, row3]
            });
            this.detailPanel = new gl.offsetmanager.currentoffset.manualdetailpanel({
                winType: this.winType,
                selectInfo: this.selectInfo,
                ladgerac : this.ladgerac,
                id: 'gl.offsetmanager.currentoffset.manualdetailpanel'
            });
            var mainPanel = new Ext.Panel({
                layout: 'border',
                frame: true,
                border: false,
                items: [this.conditionPanel, this.detailPanel]
            });
            this.items = [mainPanel];
            //定义tbar
            //根据intisvoucher判断 来自往来还是凭证
            var method = this.onOkClick.createDelegate(this);
            if(this.intisvoucher == true)
            {
               // console.log("来自凭证");
                method = this.save.createDelegate(this);
            }
            var button_ok = new Ext.Button({
                id: "button_ok",
                text: '确定',
                minWidth: 50,
                handler: method
            });
            var button_cancel = new Ext.Button({
                id: "button_cancel",
                text: '取消',
                minWidth: 50,
                handler: function () {
                    this.close();
                }.createDelegate(this)
            });

            this.buttons = [button_ok, button_cancel];
            gl.offsetmanager.currentoffset.manualmachewin.superclass.initComponent.call(this);

            this.initCondition();
        }, initCondition: function () {
        var accountcode = this.selectInfo.get('accountcode');//科目
        var varledgername = this.selectInfo.get('varledgername');//分户
        var remainmoney = this.selectInfo.get('remainmoney');//未冲金额
        this.account_win.setValue(accountcode);
        this.ledge_win.setValue(varledgername);
        this.moeny_unoffset.setValue(remainmoney);

        //查询数据
        this.detailPanel.store.baseParams.jsonParams = this.getCondtionParams();
        this.detailPanel.store.load({
            params: {
                start: 0,
                limit: 999999
            }
        });
    }, getCondtionParams: function () {
        var params = {};
        params.account = this.selectInfo.get('uqaccountid');//不可编辑的，取传入记录中科目id
        params.ledger = this.selectInfo.get('uqledgeid');
        params.dtfilldatefrom = this.dtfilldatefrom_win.getValue();
        params.dtfilldateto = this.dtfilldateto_win.getValue();

       /* params.money_form = this.moeny_form_win.getValue() ? this.moeny_form_win.getValue() : 0;
        params.money_to = this.moeny_to_win.getValue() ? this.moeny_to_win.getValue() : 0;*/
        params.money_form = Ext.getCmp('currentoffset.manualmachewin.moeny_form_win').getValue();
        params.money_to = Ext.getCmp('currentoffset.manualmachewin.moeny_to_win').getValue() ;
        params.remark = this.voucher_remark.getValue();
        params.iswindow = 1;

        return Ext.encode(params);
    }, onOkClick: function () {
        //找出store中本次冲销金额不为0的记录（本次冲销金额默认为0，如果不为0表示用户修改过，本次需要做冲销）
        var modifiedRecords = this.detailPanel.getStore().getModifiedRecords();
        if (modifiedRecords.length == 0) {
            Ext.Msg.alert("提示", "请至少填写一条记录中要冲销的金额！");
            return;
        }

        var params = {};
        //获取此条主记录的相关参数，
//        console.log(this.selectInfo);
        var modifys = this.parseRecord2JSON(modifiedRecords) ;
        params.mainData = JSON.stringify(this.createMainParam(this.selectInfo, modifiedRecords));
        params.detailDatas = JSON.stringify(modifys);
        if(modifys.length == 0)
        {
            Ext.Msg.alert("提示", "请至少填写一条本次要冲销的记录");
            this.queryHandler();
            return ;
        }
        var totalRushedMoney = 0.0;
        var lastUnrushedMoney = this.selectInfo.get('remainmoney');
        if(lastUnrushedMoney < 0){
            lastUnrushedMoney = 0 -lastUnrushedMoney ;
        }
        var currentUnrushedMomeny = this.moeny_unoffset.value ;
        for (var i=0 ; i< modifys.length ; i++){
            var money = modifys[i].money;
            if(money < 0){
                money = 0 - money ;
            }
            totalRushedMoney += money ;
        }
        var money = (lastUnrushedMoney - totalRushedMoney).toFixed(2);
        if(Math.abs(money)!=Math.abs(currentUnrushedMomeny)){
            Ext.Msg.alert("提示", "数据信息异常，请重新填写");
            this.queryHandler();
            return ;
        }
       // return ;
        //3.ajax请求提交到服务端处理
        Ext.Ajax.request(
            {
                url: "offsetmanager/currentoffset/doManualRush",
                method: 'post',
                params: params,
                success: function (response) {
                    var r = Ext.decode(response.responseText);
                    if (r.success) {
                        Ext.Msg.alert("提示", "冲销成功");
                        this.close();
                        Ext.getCmp('gl.offsetmanager.currentoffset.conditionpanel').queryHandler();
                    }
                    else {
                        Ext.Msg.alert("错误", r.msg);
                    }
                }.createDelegate(this),
                failure: function () {
                    Ext.Msg.alert("错误", "冲销失败！");
                    return;
                }
            });

    }, parseRecord2JSON: function (records) {
        var results = [];
        for (var i = 0; i < records.length; i++) {
            var record = {};
            record.uqvoucherid = records[i].get('voucherid') == undefined ? '' : records[i].get('voucherid');
            record.uqvoudetailid = records[i].get('uqvoucherdetailid') == undefined ? '' : records[i].get('uqvoucherdetailid');
            record.iniid = records[i].get('iniid') == undefined ? '' : records[i].get('iniid');
            record.uqaccountid = records[i].get('uqaccountid') == undefined ? '' : records[i].get('uqaccountid');
            record.uqledgetypeid = records[i].get('uqledgetypeid') == undefined ? '' : records[i].get('uqledgetypeid');
            record.uqledgeid = records[i].get('uqledgeid') == undefined ? '' : records[i].get('uqledgeid');
            record.offsetmoney = records[i].get('offsetmoney') == undefined ? '0' : records[i].get('offsetmoney');
            record.yetmoney = records[i].get('yetmoney') == undefined ? '0' : records[i].get('yetmoney');
            record.remainmoney = records[i].get('remainmoney') == undefined ? '0' : records[i].get('remainmoney');
            record.money = records[i].get('currentrushmoney') == undefined ? '0' : records[i].get('currentrushmoney');
            record.inttype = records[i].get('inttype');
            if(records[i].get('currentrushmoney')=='' || records[i].get('currentrushmoney') ==undefined ){
                continue ;
            }
            results.push(record);
        }
        return results;
    }, createMainParam: function (record, mrecords) {
        var params = {};
        var main_rushed_money = 0;
        for (var i = 0; i < mrecords.length; i++) {
            main_rushed_money += this.detailPanel.parseToNumber(mrecords[i].get('currentrushmoney'));
        }
        params.uqvoucherid = record.get('voucherid') == undefined ? '' : record.get('voucherid');
        params.uqvoudetailid = record.get('uqvoucherdetailid') == undefined ? '' : record.get('uqvoucherdetailid');
        params.iniid = record.get('iniid') == undefined ? '' : record.get('iniid');
        params.uqaccountid = record.get('uqaccountid') == undefined ? '' : record.get('uqaccountid');
        params.uqledgetypeid = record.get('uqledgetypeid') == undefined ? '' : record.get('uqledgetypeid');
        params.uqledgeid = record.get('uqledgeid') == undefined ? '' : record.get('uqledgeid');
        params.offsetmoney = record.get('offsetmoney') == undefined ? '0' : record.get('offsetmoney');
        params.remainmoney = this.moeny_unoffset.getValue();
        params.money = record.get('offsetmoney')>0 ? main_rushed_money: this.detailPanel.formatMoney(main_rushed_money,false); //本次冲销金额，手工匹配明细中填写的本次冲销金额的和
        params.inttype = record.get('inttype');
        params.yetmoney = record.get('yetmoney') + params.money;
        if (params.yetmoney == null || params.yetmoney == undefined){
            params.yetmoney = 0 ;
        }
        return params;
    }, queryHandler: function () {
        //查询数据
        var params = this.getCondtionParams();
        this.detailPanel.store.baseParams.jsonParams = params;
        this.detailPanel.store.load({
            params: {
                start: 0,
                limit: 999999
            }
        });
        //重置主记录未冲金额
        this.moeny_unoffset.setValue(this.selectInfo.get('remainmoney'));
    }, save: function ()
    {
            /*Ext.Msg.confirm("提示", "往来核销已保存,如果修改分录科目或金额,本次核销操作将还原.", function (btn) {
                if (btn == "yes") {*/
			var data = this.getCommitData();
			if(typeof(data)!= 'object')
			{
				if(data != "")
				{
					data = Ext.util.JSON.encode(data);
				}
			}
			if(data != "" && data != "\"\"")
			{
				//总金额与剩余金额非同负同正，出现错误提示
				if(data.mainData.offsetmoney * data.mainData.remainmoney < 0)
				{
					Ext.Msg.alert("提示","冲销总金额大于分户分摊金额，不能保存");
					return false;
				}
			}
            //无分户  由凭证页面过来 直接往分录noledgerac字段设置往来数据
            if (this.selectInfo.get('accountledger') == "" || this.selectInfo.get("accountledger") == "\"\"") 
            {
//                        console.log("无分户往来");
                var sm = this.vouchergrid.getSelectionModel();
                var record = sm.getSelected();
                record.beginEdit();
                record.set("noledgerac", Ext.util.JSON.encode(this.getCommitData()));
                record.commit();
                record.endEdit();
                //打开人工匹配页面后，调用voucherdetail的reJudgeOffset()函数，重新判断能否冲销
                Ext.getCmp("vouchergriddetail").reJudgeOffset();
            }
            else 
            {
//                        console.log("有分户往来");
                this.ladgerac.set("acdata", Ext.util.JSON.encode(this.getCommitData()));
                this.ladgerac.set("iscanoffset", true);
//              console.log(this.ladgerac);
                //打开人工匹配页面后，调用分户的reJudgeOffset()函数，重新判断能否冲销
                Ext.getCmp(this.ledgerPageId).reJudgeOffset();
            }
//                }
//            }, this);

            this.close();
    }, getCommitData: function ()
    {
        var modifiedRecords = this.detailPanel.getStore().getModifiedRecords();
        if (modifiedRecords.length == 0) {
            Ext.Msg.alert("提示", "请至少填写一条记录中要冲销的金额！");
            return;
        }

        var params = {};
        //获取此条主记录的相关参数，

        params.mainData = this.createMainParam(this.selectInfo, modifiedRecords);
        params.detailDatas = this.parseRecord2JSON(modifiedRecords);
        return params;
    },detailHandler: function ()
    {
            var records = this.detailPanel.getSelectionModel().getSelections();

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
        }, showVoucherDetial: function (voucherid)
    {
        	if(this.isOpenVoucher)
        	{
        		window.open('wfs/gl/voucherbook/voucherdetail/voucherdetail.jsp?voucherid='+voucherid, 'voucheroffset', '', true);
        	}
        	else
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
        	}
            

}, showInitDetail: function (uqaccountid, varaccountcode)
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
}/*,setMainData : function()
{
	if (this.selectInfo.get('accountledger') == "" ) 
    {
		if (this.selectInfo.get('noledgerac') != "") 
        {
			console.log("无分户回写");
			var noledgerac = this.selectInfo.get('noledgerac');
			if(typeof(this.selectInfo.get('noledgerac')) != 'object')
			{
				noledgerac = Ext.util.JSON.decode(this.selectInfo.get('noledgerac'));
			}
			this.moeny_unoffset.setValue(noledgerac.mainData.remainmoney);
			this.detailPanel.detailDatas = noledgerac.detailDatas;
        }
    }
    else 
    {
        console.log("有分户回写");
//      var mainData = Ext.getCmp("voucherform").getCommitData();
//		var detailData = Ext.getCmp("voucherdetail").grid.getCommitData();
//		console.log(mainData);
//		console.log(detailData);
        var accountledger = this.selectInfo.get('accountledger');
       
    }
}*/
    })
;