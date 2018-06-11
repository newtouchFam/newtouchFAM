Ext.namespace("gl.offsetmanager.accountCurrentInitialization");
/**
 * 主js
 */
gl.offsetmanager.accountCurrentInitialization.ListPanel = Ext.extend(Ext.grid.GridPanel,
    {
        //定义变量、属性
        id : 'accountlist',
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
        //构造面板内容
        initComponent : function()
        {
            //1.声明record;
            var record = Ext.data.Record.create([
                { name : 'uqaccountid'},
                { name : 'varaccountcode'},
                { name : 'varaccountname'},
                { name : 'uqparentid'},
                { name : 'intproperty'},
                { name : 'uqtypeid'},
                { name : 'inidate'}
            ]);

            //2.创建JsonStore；
            this.store = new Ext.data.JsonStore(
                {
                    totalProperty : "total",
                    root : "data",
                    url : 'offsetmanager/accountcurrent/accountlist',
                    fields : record
                });

            //3.组件变量；
            var clnRowNum = new Ext.grid.RowNumberer();
            var uqaccountid =
                {
                    header : '科目id',
                    dataIndex : 'uqaccountid',
                    hidden : true
                };
            var varaccountcode =
                {
                    header : '<div style="text-align:center">科目编号</div>',
                    dataIndex : 'varaccountcode',
                    width : 130
                };
            var varaccountname =
                {
                    header : '<div style="text-align:center">科目名称</div>',
                    dataIndex : 'varaccountname',
                    width : 200
                };
            var uqparentid =
                {
                    header : '<div style="text-align:center">上级科目</div>',
                    dataIndex : 'uqparentid',
                    width : 180,
                    hidden : !true
                };
            var intproperty =
                {
                    header : '<div style="text-align:center">科目性质</div>',
                    dataIndex : 'intproperty',
                    width : 120
                };
            var uqtypeid =
                {
                    header : '<div style="text-align:center">科目类别</div>',
                    dataIndex : 'uqtypeid',
                    renderer :function(value){
                        if(value==1||value=='1')
                            return '预付';
                        if(value==2||value=='2')
                            return '预收';
                        if(value==8||value=='8')
                            return '应付';
                        if(value==7||value=='7')
                            return '应收';
                        return '';
                    },
                    width : 150
                };
            var inidate =
                {
                    header : '<div style="text-align:center">初始化日期</div>',
                    dataIndex : 'inidate',
                    width : 100
                };
            //4.创建ColumnModel加入声明的列变量;
            this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
            this.cm = new Ext.grid.ColumnModel(
                [ this.sm, clnRowNum, uqaccountid, varaccountcode,
                    varaccountname,uqparentid, intproperty,  uqtypeid, inidate]);
            // //5. 创建tbar
            // this.tbar = [{text : '初始化',iconCls : "xy-act-post", handler : this.showInitPanel, scope : this},
            //     {xtype : "tbseparator" },
            //     {text : '修改初始化', iconCls : "xy-edit",handler : this.showEditInitPanel,scope : this},
            //     {xtype : "tbseparator"},
            //     {text : '清除初始化',iconCls : "xy-delete", handler : this.clearInitDetailData,scope : this}];

            //6.创建bbar放置PagingToolbar；
            this.bbar = new Ext.PagingToolbar(
                {
                    border : true,
                    pageSize : 20,
                    store : this.store,
                    displayInfo : true,
                    displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
                    emptyMsg : "没有记录"
                });
            this.on('dblclick',function(){
                var sm = Ext.getCmp('accountlist').getSelections();
                var record = Ext.getCmp('accountlist').getSelections();
                if(!record)
                {
                    Ext.Msg.alert('提示', "只能选择一行");
                    return;
                }
                    if(record[0].get('inidate')== null||record[0].get('inidate')==''){
                        this.editWindowShow();
                        Ext.getCmp('editwindow').setTitle('初始化');
                    }else{
                        this.editWindowShow();
                        Ext.getCmp('editwindow').setTitle('修改初始化');
                    }

            });
            this.loadMask =
                {
                    msg : "数据加载中,请稍等...",
                    removeMask : true
                };
            //7.渲染
            gl.offsetmanager.accountCurrentInitialization.ListPanel.superclass.initComponent.call(this);
        },
        //按条件模糊查询科目初始化数据
        query : function()
        {
            var accountcodeQueryText=Ext.getCmp('accountcodeQueryText').getValue();
            var accountnameQueryText=Ext.getCmp('accountnameQueryText').getValue();

            this.store.baseParams.varAccountCode=accountcodeQueryText!=null?accountcodeQueryText:'';
            this.store.baseParams.varAccountName = accountnameQueryText!=null?accountnameQueryText:'';
            this.store.load(
                {
                    params :
                        {
                            start:0,
                            limit:20
                        }
                });
        },
        //初始化界面显示
        showInitPanel : function ()
        {
            var sm = Ext.getCmp('accountlist').getSelections();
            var record = Ext.getCmp('accountlist').getSelections();
            if(!record||record.length!=1)
            {
                Ext.Msg.alert('提示', "只能选择一行");
                return;
            }
                if(record[0].get('inidate')== null||record[0].get('inidate')==''){
                this.editWindowShow();
                Ext.getCmp('editwindow').setTitle('初始化');
                }else{
                    Ext.Msg.alert('提示', "该科目已经初始化请点击修改初始化!");
                    return;
                }
        },
        //修改初始化
        showEditInitPanel : function(){
            var sm = Ext.getCmp('accountlist').getSelections();
            var record = Ext.getCmp('accountlist').getSelections();
            if(!record||record.length!=1)
            {
                Ext.Msg.alert('提示', "只能选择一行");
                return;
            }
                if(record[0].get('inidate')== null||record[0].get('inidate')==''){
                    Ext.Msg.alert('提示', "该科目没有初始化请点击初始化!");
                    return;
                }else{
                    this.editWindowShow();
                    Ext.getCmp('editwindow').setTitle('修改初始化');
                }
        },
        /**
         * 修改界面的显示
         */
        editWindowShow : function(){
            var sm = Ext.getCmp('accountlist').getSelections();
            var record = Ext.getCmp('accountlist').getSelections();
            if(!record||record.length!=1)
            {
                Ext.Msg.alert('提示', "只能选择一行");
                return;
            }
            var uqaccountid= record[0].get('uqaccountid');
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
                    width : 953,
                    height : 430,
                    modal : true,
                    buttonAlign:'right',
                    closeAction: 'close',
                    layout : 'border',
                    resizable : false,
                    items : [
                        {region:'north',layout:'border',height : 30,items:[editWinLabel]},
                        {region:'center',layout:'border',items:[new gl.offsetmanager.accountCurrentInitialization.editgridpanel]}
                    ],
                    buttons : [{handler : function() { this.onSaveClick();}.createDelegate(this), text : "保存",id :'saveButton'},
                        { handler : function() {win.close();}.createDelegate(this), text : "关闭"}]
                });
            win.show();
            Ext.getCmp('editWinLabel').setTitle('科目：'+record[0].get('varaccountcode')+':'+record[0].get('varaccountname'));
            Ext.getCmp('editpanel').editgridpanelload(uqaccountid);
        },
        /**
         * 保存
         */
        onSaveClick : function(){
            Ext.getCmp('editpanel').saveDate();
        },
        /**
         * 清除初始化
         */
        clearInitDetailData :function(msg){
            var sm = Ext.getCmp('accountlist').getSelections();
            var record = Ext.getCmp('accountlist').getSelections();
            if(record.length==0)
            {
                Ext.Msg.alert('提示', "请选择要清除的数据");
                return;
            }
                Ext.Msg.confirm("提示", "是否要清除所有初始化明细数据?", function(btn)
                {
                    if (btn == "yes")
                    {
                var uqaccountid='';
                        for (var i = 0; i < record.length; i++) {
                            uqaccountid=uqaccountid+','+ record[i].get('uqaccountid');
                        }
                Ext.Ajax.request(
                    {
                        url : "offsetmanager/accountcurrent/deletedata",
                        params :
                            {
                                uqaccountid : uqaccountid
                            },
                        dataType: "json",
                        success : function(response)
                        {
                            var r = Ext.decode(response.responseText);
                            if (r.success)
                            {
                                if(r.msg==''){
                                    Ext.Msg.alert("提示", "已成功清除初始化数据！");
                                    Ext.getCmp('accountlist').query();
                                }else{
                                    Ext.Msg.alert("提示", r.msg);
                                    Ext.getCmp('accountlist').query();
                                }

                            }
                            else
                            {
                                Ext.Msg.alert("错误", r.msg);
                            }
                        },
                        failure : function(response)
                        {
                            Ext.Msg.alert("错误","清除初始化失败！");
                            return;
                        },
                        scope:this
                    });
                    }
                },this);


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