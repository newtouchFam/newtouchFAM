/**
 * Created by Administrator on 2017/11/8.
 */
Ext.namespace("gl.offsetmanager.offsetquery");
/**
 * 查看初始化明细窗口
 */
gl.offsetmanager.offsetquery.initdetail = Ext.extend(Ext.grid.EditorGridPanel,
    {
        id : 'gl.offsetmanager.offsetquery.initdetail',
        autoHeight : true,
        region : 'center',
        //列是否能移动
        enableColumnMove : false,
        //是否显示列菜单
        enableHdMenu : false,
        //是否隐藏滚动条
        autoHeight : false,
        layout : 'fit',
        border : true,
        autoWidth : true,
        autoScroll : true,
        loadMask : true,
        iconCls : 'xy-grid',
        uqaccountid:'',
        // height : 225,
        clicksToEdit : 1,
        initComponent : function()
        {
            this.createControl();
            gl.offsetmanager.offsetquery.initdetail.superclass.initComponent.call(this);
            this.loadData(this.uqaccountid);
        },
        load : function()
        {
            this.getStore().load();
        },
        getStore : function()
        {
            if (this.store === undefined || this.store == null)
            {
                this.store = new Ext.data.Store(
                    {
                        autoLoad :false,
                        url : 'offsetmanager/accountcurrent/editlist',
                        reader : new Ext.data.JsonReader(
                            {
                                totalProperty : "total",
                                root : 'data'
                            }, this.getRecord())
                    });
            }
            return this.store;
        },
        getRecord : function()
        {
            return Ext.data.Record.create([
                {
                    name : "iniid"
                },
                {
                    name : 'busdate'
                },
                {
                    name : 'varabstract'
                },
                {
                    name : 'uqledgeid'
                },
                {
                    name : 'mnydebit'
                },
                {
                    name : 'mnycredit'
                },
                {
                    name : 'inttype'
                },
                {
                    name : 'ledgerdetailid'
                },
                {
                    name : 'ledgertext'
                },
                {
                    name : 'uqledgetypeid'
                }]);
        },
        createControl : function()
        {
            var clnRowNum = new Ext.grid.RowNumberer();

            var iniid =
                {
                    header : "初始化id",
                    hidden : true,
                    dataIndex : "iniid"
                };
            var busdate =
                {
                    header : "业务日期",
                    width : 120,
                    dataIndex : "busdate",
                    renderer : Ext.util.Format.dateRenderer( 'Y-m-d')
                };
            var varabstract =
                {
                    header : "摘要",
                    width : 170,
                    dataIndex : "varabstract"
                };

            this.xyledgertree = new Ext.app.xyledgertree(
                {
                    anchor : '95%',
                    labelStyle : 'text-align:right:',
                    leafSelect : true,
                    issinglechecked : true,
                    enableKeyEvents : true
                });
            var uqledgeid =
                {
                    header : "分户",
                    width : 130,
                    dataIndex : "uqledgeid",
                    complex : true,
                    menuDisabled:true
                };


            //此为分户相关属性 隐藏便于取值
            var ledgerdetailid =
                {
                    hidden : true,
                    dataIndex : "ledgerdetailid"
                };
            var ledgertext =
                {
                    hidden : true,
                    dataIndex : "ledgertext"
                };
            var ledgertypeid =
                {
                    hidden : true,
                    dataIndex : "uqledgetypeid"
                };
            var mnydebit =
                {
                    header : "借方金额",
                    width : 95,
                    css : 'text-align:right;',
                    renderer : Ext.app.XyFormat.cnMoney,
                    dataIndex : "mnydebit"
                };
            var mnycredit =
                {
                    header : "贷方金额",
                    width : 95,
                    css : 'text-align:right;',
                    renderer :Ext.app.XyFormat.cnMoney,
                    dataIndex : "mnycredit"
                };
            var inttype =
                {
                    header : "初始化类型",
                    width : 70,
                    dataIndex : "inttype",
                    renderer :function(value){
                        if(value==1||value=='1')
                            return '挂账';
                        if(value==2||value=='2')
                            return '冲销';
                        return '';
                    }
                };
            var cm = new Ext.grid.ColumnModel([clnRowNum,iniid,busdate,varabstract,
                uqledgeid,mnydebit,mnycredit,inttype,ledgerdetailid,ledgertext,ledgertypeid]);

            var sm = new Ext.grid.RowSelectionModel(
                {
                    singleSelect : true
                });
            this.store = this.getStore();
            this.colModel = cm;
            this.selModel =sm;
            this.bbar = new Ext.PagingToolbar(
                {
                    border : true,
                    pageSize : 20,
                    store : this.getStore(),
                    displayInfo : true,
                    displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
                    emptyMsg : "没有记录"
                });
        },
        /**
         * load数据
         */
        loadData : function (uqaccountid) {
            this.store.baseParams.uqaccountid = uqaccountid;
            this.store.load(
                {
                    params :
                        {
                            start:0,
                            limit:20
                        }
                });
        },
        //设置字体颜色
        viewConfig :
            {
                getRowClass : function(record,rowIndex,rowParams,store)
                {
                    if(record.get("intflag")==0)
                    {
                        return 'color';
                    }
                }
            }
    });