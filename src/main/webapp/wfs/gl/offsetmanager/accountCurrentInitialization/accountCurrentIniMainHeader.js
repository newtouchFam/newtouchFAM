Ext.namespace("gl.offsetmanager.accountCurrentInitialization");
/**
 * 头部js
 */
gl.offsetmanager.accountCurrentInitialization.HeaderPanel = Ext.extend(Ext.Panel,
    {
        //定义变量、属性
        id : 'accounthearder',
        region : 'center',
        border : false,
       // isView : false,
        frame : true,
        //构造面板内容
        initComponent : function() {

            var iniButton =new Ext.Button(
                {
                    text : '初始化',
                   // iconCls : "xy-act-post",
                    handler : this.init.createDelegate(this),
                    minWidth:70
                });
            var editIniButton =new Ext.Button(
                {
                    text : '修改初始化',
                  //  iconCls : "xy-act-post",
                    handler : this.editInit.createDelegate(this),
                    minWidth:70
                });
            var clearButton =new Ext.Button(
                {
                    text : '清除初始化',
                  //  iconCls : "xy-delete",
                    handler : this.deleteInit.createDelegate(this),
                    minWidth:70

                });
            var row1 =
                {
                    layout : 'column',
                    border : false,
                    labelAlign : "right",
                    labelWidth : 100,
                    style : 'margin-left:7px;',
                    items : [ {
                        columnWidth : .072,
                        layout : 'form',
                        border : false,
                        defaults : {
                            width : 200
                        },
                        items : [iniButton]
                    }, {
                        columnWidth : .082,
                        layout : 'form',
                        border : false,
                        defaults : {
                            width : 200
                        },
                        items : [editIniButton]
                    }, {
                        columnWidth : .072,
                        layout : 'form',
                        border : false,
                        defaults : {
                            width : 200
                        },
                        items : [clearButton]
                    }]
                };
            this.items = [row1];
            //5.渲染
            gl.offsetmanager.accountCurrentInitialization.HeaderPanel.superclass.initComponent.call(this);
        },
        init : function(){
            Ext.getCmp('accountlist').showInitPanel();
        },
        editInit : function(){
            Ext.getCmp('accountlist').showEditInitPanel();
        },
        deleteInit : function(){
            Ext.getCmp('accountlist').clearInitDetailData();
        }
    });
