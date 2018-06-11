/**
 * 往来明细查询界面 2018/01/05
 */
Ext.namespace('gl.offsetmanager.offsetquery');
gl.offsetmanager.offsetquery.offsetdetailquery = Ext.extend(Ext.Window,
    {
        layout: 'fit',
        title: "往来明细查询",
        id: "gl.offsetmanager.offsetquery.offsetdetailquery",
        frame: true,
        modal: true,
        width: 1109,
        height: 400,
        border: false,
        buttonAlign: 'center',
        winType: null,//打开方式，时显示冲挂账数据还是显示冲付款数据
        selectInfo: null,//主界面选择的一条record
        initComponent: function () {       
            this.offsetdatefrom_win = new Ext.form.DateField(
                {
                    id: 'offsetquery.offsetdetailquery.offsetdatefrom',
                    fieldLabel: "冲销日期从",
                    width: 120,
                    format: "Y-m-d",
                    disabled: false,
                    anchor: '100%',
                    labelStyle: "text-align: right;width:90px;"
                });
            this.offsetdatefrom_win.on('specialkey',this.queryHandler.createDelegate(this), this);

            this.offsetdateto_win = new Ext.form.DateField(
                {
                    id: 'offsetquery.offsetdetailquery.offsetdateto',
                    fieldLabel: '至',
                    width: 120,
                    anchor: '100%',
                    format: "Y-m-d",
                    labelSeparator: '',
                    labelStyle: "text-align: right;width:60px;",
                    disabled: false
                });
            this.offsetdateto_win.on('specialkey',this.queryHandler.createDelegate(this), this);
            
            this.offset_person = new Ext.form.TextField(
                {
                    id: 'offsetquery.offsetdetailquery.offset_person',
                    fieldLabel: '冲销人',
                    width: 120,
                    anchor: '100%',
                    disabled: false,
                    labelStyle: "text-align: right;width:60px;"
                });
            this.offset_person.on('specialkey',this.queryHandler.createDelegate(this), this);
            
            //查询
            this.querybutton = new Ext.Button(
                {
                    id : "query_button",
                    iconCls : "xy-view-select",
                    text :'查询',
                    minWidth : 60,
                    labelStyle : "text-align: right;width:60px;",
                    handler : this.queryHandler.createDelegate(this)
                });
            //查看明细数据来自的凭证或初始化信息
            this.look_voucher_button =new Ext.Button(
                {
                    id: "look_voucher_button",
                    iconCls: "xy-details",
                    text: '凭证明细',
                    minWidth: 80,
                    handler: this.getDetailHandler.createDelegate(this)
                });
            /*var row1 =
            {
                layout: 'column',
                border: false,
                labelAlign: "right",
                labelWidth : 60,
                items: [{
                	labelWidth : 90,
                    columnWidth: .24,
                    layout: 'form',
                    border: false,
                    defaults: {
                        width: 210,
                        anchor: '100%'
                    },
                    items: [this.offsetdatefrom]
                }, {
                    columnWidth: .21,
                    layout: 'form',
                    border: false,
                    defaults: {
                    	anchor: '100%',
                        width: 180
                    },
                    items: [this.offsetdateto]
                }, {
                    columnWidth: .21,
                    layout: 'form',
                    border: false,
                    defaults: {
                    	anchor: '100%',
                        width: 180
                    },
                    items: [this.offset_person]
                }, {
                    columnWidth: .20,
                    style : 'margin-left:40px',
                    layout: 'form',
                    border: false,
                    defaults: {
                        width: 80
                    },
                    items: [this.querybutton]
                }]
            };*/
            this.tbar = ['冲销日期从:', this.offsetdatefrom_win, '&nbsp;&nbsp;&nbsp;至:', this.offsetdateto_win,
                         '&nbsp;冲销人:',this.offset_person, this.querybutton, '-', this.look_voucher_button ];
            this.infoPanel = new gl.offsetmanager.offsetquery.offsetdetailinfo({
                winType: this.winType,
                selectInfo: this.selectInfo,
                id: 'gl.offsetmanager.offsetquery.offsetdetailinfo'
            });
            var mainPanel = new Ext.Panel({
                layout: 'border',
                frame: true,
                border: false,
                items: [this.infoPanel]
            });
            this.items = [mainPanel];

            var button_cancel = new Ext.Button({
                id: "button_cancel",
                text: '关闭',
                minWidth: 50,
                handler: function () {
                    this.close();
                }.createDelegate(this)
            });

            this.buttons = [button_cancel];
            gl.offsetmanager.offsetquery.offsetdetailquery.superclass.initComponent.call(this);
            
            /*var params = {};
            params.uqmainid = this.selectInfo.get("uqmainid");
            if(this.selectInfo.get("offsettype") == "冲销")
            {
            	params.inttype = "1";
            }
            if(this.selectInfo.get("offsettype") == "挂账")
            {
            	params.inttype = "2";
            }
            params.iswindow = 1;
            this.infoPanel.store.baseParams.jsonParams = Ext.encode(params);
            this.infoPanel.store.load({
                params: {
                    start: 0,
                    limit: 20
                }
            });*/
            this.queryHandler();

    }, queryHandler: function () {
        //查询数据
    	var params = {};
        params.offsetdatefrom = this.offsetdatefrom_win.getValue();
        params.offsetdateto = this.offsetdateto_win.getValue();
        params.offsetuser = this.offset_person.getValue();
        params.uqmainid = this.selectInfo.get("uqmainid");
        if(this.selectInfo.get("offsettype") == "冲销")
        {
        	params.inttype = "1";
        }
        if(this.selectInfo.get("offsettype") == "挂账")
        {
        	params.inttype = "2";
        }
        params.iswindow = 1;
        this.infoPanel.store.baseParams.jsonParams = Ext.encode(params);
        this.infoPanel.store.load({
            params: {
                start: 0,
                limit: 20
            }
        });
    },
    getDetailHandler : function () {
    	Ext.getCmp('gl.offsetmanager.offsetquery.offsetdetailinfo').detailHandler();
    }
    
})
;