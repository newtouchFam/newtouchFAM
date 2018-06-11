Ext.namespace("gl.offsetmanager.accountCurrentInitialization");
/**
 * 修改数据界面
 */
gl.offsetmanager.accountCurrentInitialization.editgridpanel = Ext.extend(Ext.grid.EditorGridPanel,
                {
                    id : 'editpanel',
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
                    // height : 225,
                    clicksToEdit : 1,
                    initComponent : function()
                    {
                        this.createControl();
                        gl.offsetmanager.accountCurrentInitialization.editgridpanel.superclass.initComponent
                            .call(this);
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
                            },
                            {
                                name : 'flag'
                            },
                            {
                                name : 'updateflag'
                            }]);
                    },
                    createControl : function()
                    {
                        var clnRowNum = new Ext.grid.RowNumberer();

                        var iniid =
                            {
                                header : "编号",
                                width : 200,
                                hidden : false,
                                dataIndex : "iniid"
                            };
                        var busdate =
                            {
                                header : "业务日期",
                                width : 120,
                                dataIndex : "busdate",
                                renderer : Ext.util.Format.dateRenderer( 'Y-m-d'),
                                editor: new Ext.form.DateField({
                                    format : 'Y-m-d',
                                    anchor : '98%',
                                    readOnly : true
                                })
                            };
                        var varabstract =
                            {
                                header : "摘要",
                                width : 170,
                                dataIndex : "varabstract",
                                editor: new Ext.form.TextField({
                                    allowBlank: true
                                })
                            };

                        this.xyledgertree = new Ext.app.xyledgertreeac(
                            {
                                aanchor : '95%',
                                id : 'ledgertree',
                                labelStyle : 'text-align:right:',
                                fieldLabel : '分户',
                                ischeckaccount : true ,
                                leafSelect : true,       //支持中间级选择
                                issinglechecked : true,
                                acin : true
                            });
                        // this.xyledgertree.on("focus",this.getledgerparams.createDelegate(this));
                        this.xyledgertree.on("valuechange",this.fhvaluechanged.createDelegate(this));

                        var uqledgeid =
                            {
                                header : "分户",
                                width : 130,
                                dataIndex : "uqledgeid",
                                complex : true,
                                menuDisabled:true,
                                editor :this.xyledgertree
                            };
                        this.xyledgertree.on("show",this.fhShow.createDelegate(this));
                        //
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
                        var flag =
                            {
                                hidden : true,
                                dataIndex : "flag"
                            };
                        var updateflag =
                            {
                                hidden : true,
                                dataIndex : "updateflag"
                            };
                        var mnydebit =
                            {
                                header : "借方金额",
                                width : 95,
                                css : 'text-align:right;',
                                renderer : Ext.app.XyFormat.cnMoney,
                                dataIndex : "mnydebit",
                                editor : new Ext.form.NumberField(
                                    {
                                        allowBlank: true,
                                        disabled : this.isView,
                                        enableKeyEvents : true,
                                        scope:this
                                    })
                            };

                        var mnycredit =
                            {
                                header : "贷方金额",
                                width : 95,
                                css : 'text-align:right;',
                                renderer :Ext.app.XyFormat.cnMoney,
                                dataIndex : "mnycredit",
                                editor : new Ext.form.NumberField(
                                    {
                                        allowBlank: true,
                                        disabled : this.isView,
                                        enableKeyEvents : true,
                                        scope:this
                                    })
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
                        this.on('afteredit',function(e){
                            var record = Ext.getCmp('accountlist').selModel.getSelected();
                            var uqtypeid= record.get('uqtypeid');
                            if(uqtypeid=='8'||uqtypeid==8||uqtypeid=='2'||uqtypeid==2){
                           if(e.field=='mnydebit'){
                               e.record.set("mnycredit",'');
                               if(e.value >0){
                                   e.record.set("inttype",2);
                               }
                               if(e.value < 0){
                                   e.record.set("inttype",1);
                               }


                           }
                            if(e.field=='mnycredit'){
                                e.record.set("mnydebit",'');
                                if(e.value >0){
                                    e.record.set("inttype",1);
                                }
                                if(e.value < 0){
                                    e.record.set("inttype",2);
                                }
                            }}
                            if(uqtypeid=='7'||uqtypeid==7||uqtypeid=='1'||uqtypeid==1){
                                if(e.field=='mnydebit'){
                                    e.record.set("mnycredit",'');
                                    if(e.value >0){
                                        e.record.set("inttype",1);
                                    }
                                    if(e.value < 0){
                                        e.record.set("inttype",2);
                                    }
                                }
                                if(e.field=='mnycredit'){
                                    e.record.set("mnydebit",'');
                                    if(e.value >0){
                                        e.record.set("inttype",2);
                                    }
                                    if(e.value < 0){
                                        e.record.set("inttype",1);
                                    }
                                }}
                            e.record.set("flag",1);
                            if(e.field=='uqledgeid'||e.field=='busdate'){
                                e.record.set("updateflag",'1');
                            }
                        });
                         this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
                        this.cm = new Ext.grid.ColumnModel([this.sm,clnRowNum,iniid,busdate,varabstract,
                            uqledgeid,mnydebit,mnycredit,inttype,ledgerdetailid,ledgertext,ledgertypeid,flag,updateflag]);


                           this.store = this.getStore();
                                this.bbar = new Ext.PagingToolbar(
                                    {
                                        border : true,
                                        pageSize : 20,
                                        store : this.getStore(),
                                        displayInfo : true,
                                        displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
                                        emptyMsg : "没有记录"
                                    });
                        var addButton =new Ext.Button(
                            {
                                text : '增加',
                                iconCls : "xy-add",
                                id :'addButton',
                                handler : this.addRow.createDelegate(this),
                                scope : this
                            });
                        var deleteButton =new Ext.Button(
                            {
                                text : '删除',
                                iconCls : "xy-delete",
                                id :'deleteButton',
                                handler : this.deleteRow.createDelegate(this),
                                scope : this
                            });
                       this.tbar=['-',addButton,'-',deleteButton];
                       this.deleteId='';
                    },
                    /**
                     * 给recond设置选中的分户的值
                     */
           fhvaluechanged :function(o, evt) {
               if(this.xyledgertree.hiddenData!=null){
                   Ext.getCmp('editpanel').stopEditing();
                   var sm = Ext.getCmp('editpanel').getSelectionModel();
                   var record = sm.getSelected();
                   record.beginEdit();
                   record.set("uqledgeid", this.xyledgertree.getValue());
                   record.set("ledgertext", this.xyledgertree.getValue());
                   record.set("flag",'1');
                   record.set("uqledgetypeid", this.xyledgertree.ledgertypeid);
                   record.set("ledgerdetailid", this.xyledgertree.getXyValue());
                   record.commit();
                   record.endEdit();
               }},
                    /**
                     * 分户组件的设置
                     */
           fhShow :function(o, evt) {
               var sm = Ext.getCmp('editpanel').getSelectionModel();
               var record = sm.getSelected();
               var id=record.get("ledgerdetailid");
               var text=record.get("ledgertext");
               if(!(id==null||id=='')){
                   var jsObj = {};
                   jsObj.id =id ;
                   jsObj.text = text;
                   var str = JSON.stringify(jsObj);
                   this.xyledgertree.setXyValue(str);
                   this.xyledgertree.onLoad();
               }else{
                   var str = JSON.stringify(null);
                   this.xyledgertree.setXyValue(str);
                   this.xyledgertree.onLoad();
               }
                        var sm = Ext.getCmp('accountlist').getSelectionModel();
                        var record = sm.getSelected();
                        var accountcode = record.get('varaccountcode');

                        Ext.getCmp("ledgertree").param =
                            [{
                                name :'accountcode',
                                value :accountcode
                            }];

                        Ext.getCmp("ledgertree").reload();
               },
                    /**
                     * 删除一条明细数据，并保存需要删除数据的id
                     */
           deleteRow : function(){
               this.stopEditing();
              var  reconds = this.getSelections();
              if (reconds.length==0){ Ext.Msg.alert("提示", "请选择数据删除.");}
              else {
                  for (var o = 0; o < reconds.length; o++) {
                      if (reconds[o].get('iniid') != '' && reconds[o].get('iniid') != null){
                          this.deleteId = this.deleteId + ',' + reconds[o].get('iniid');
                      }
                      this.getStore().remove(reconds[o]);
                  }
              }
                    },
                    /**
                     *新增的记录
                     */
           newRecord : function ()
                    {
                        var recond1= Ext.data.Record.create([
                            {name: 'iniid', type: 'string'},
                            {name: 'busdate', type: 'string'},
                            {name: 'varabstract', type: 'string'},
                            {name: 'uqledgeid', type: 'string'},
                            {name: 'mnydebit', type: 'string'},
                            {name: 'mnycredit', type: 'string'},
                            {name: 'inttype', type: 'string'},
                            {name: 'ledgerdetailid', type: 'string'},
                            {name: 'ledgertext', type: 'string'},
                            {name: 'uqledgetypeid', type: 'string'},
                            {name: 'flag', type: 'string'}
                        ]);
                       return  new recond1({
                            iniid: '', busdate: '', varabstract: '', uqledgeid: '', mnydebit: '',
                            mnycredit: '',inttype: '',uqledgetypeid:'',flag:''

                        });
                    },
                    /**
                     * 新增recond
                     */
            addRow : function ()
                    {
                        this.stopEditing();
                        this.store.add(this.newRecord());
                        this.startEditing(0, 0);
                    },
                    /**
                     * load数据
                     */
           editgridpanelload : function (uqaccountid) {
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
                    /**
                     * 检测日期是否相同
                     */
          checkDateIsSame : function(date1,date2){
                        if(typeof date1=="string")
                        {
                            var t1=new Date(Date.parse(date1.replace(/-/g,   "/")));
                        }else{
                            var t1= date1;
                        }
                        if(typeof date2=="string")
                        {
                            var t2=new Date(Date.parse(date2.replace(/-/g,   "/")));
                        }else{
                            var t2= date2;
                        }
              return (t1.getFullYear()+'-'+(t1.getMonth()+1)+'-'+t1.getDate())==(t2.getFullYear()+'-'+(t2.getMonth()+1)+'-'+t2.getDate());

          },
                    changeDate:function(date1){
                        if(typeof date1=="string"){
                           return  date1;
                        }else{
                          return   date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate();
                        }
                    },
                    /**
                     * 拿到新增的数据
                     */
            getJsonDataAdd : function()
                    {
                        var o = [];
                        var record = Ext.getCmp('accountlist').selModel.getSelected();
                        var uqaccountid= record.get('uqaccountid');
                        for (var i = 0; i < this.store.data.length; i++)
                        {
                            var vData = this.store.data.items[i].data;
                            if((vData.iniid==null||vData.iniid=='')){
                            jsonData =
                                {
                                    uqaccountid :uqaccountid,
                                    uqledgetypeid :vData.uqledgetypeid==null?'':vData.uqledgetypeid,
                                    uqledgeid  : vData.ledgerdetailid==null?'':vData.ledgerdetailid,
                                    varabstract:vData.varabstract,
                                    busdate:vData.busdate.getFullYear()+'-'+(vData.busdate.getMonth()+1)+'-'+vData.busdate.getDate(),
                                    mnydebit:vData.mnydebit,
                                    mnycredit:vData.mnycredit,
                                    inttype:vData.inttype,
                                    num : i+1
                                };
                            o.push(jsonData);
                        }}
                        return o;
                    },
                    /**
                     * 拿到修改的数据
                     */
                    getJsonDataUpdate : function()
                    {
                        var o = [];
                        var record = Ext.getCmp('accountlist').selModel.getSelected();
                        var uqaccountid= record.get('uqaccountid');
                        var total = this.store.getCount();
                        for(var i=0;i<total;i++){
                            var vData = this.store.data.items[i].data;
                            if(vData.flag==null||vData.flag==''){
                                continue;
                            }
                            if(!(vData.iniid==null||vData.iniid=='')){
                                jsonData =
                                    {
                                        iniid:vData.iniid,
                                        uqaccountid :uqaccountid,
                                        busdate:this.changeDate(vData.busdate),
                                        varabstract:vData.varabstract,
                                        uqledgeid:vData.ledgerdetailid==null?'':vData.ledgerdetailid,
                                        uqledgetypeid :vData.uqledgetypeid==null?'':vData.uqledgetypeid,
                                        mnydebit:vData.mnydebit,
                                        mnycredit:vData.mnycredit,
                                        inttype:vData.inttype,
                                        updateflag: vData.updateflag,
                                        num : i+1
                                    };
                                o.push(jsonData);
                            }
                        }
                        return o;
                    },
                    /**
                     * 拿到删除的数据记录
                     */
          getDeleteId :function(){
              var o = [];
              var record = Ext.getCmp('accountlist').selModel.getSelected();
              var uqaccountid= record.get('uqaccountid');
              if(!this.deleteId==''){
              jsonData =
                  {
                      iniid:this.deleteId,
                      uqaccountid:uqaccountid
                  };
              o.push(jsonData);
              }
              return o;
          },
                    /**
                     * 保存数据，并验证数据
                     */
          saveDate : function()
                    {
                        var record = Ext.getCmp('accountlist').selModel.getSelected();
                        var uqaccountid= record.get('uqaccountid');
                        Ext.Ajax.request(
                            {
                                url : "offsetmanager/accountcurrent/checkDateIsExistFh",
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
                                        if(r.msg=='1'){
                        validata:
                        for (var i = 0; i < this.store.data.length; i++)
                        {
                            var vData = this.store.data.items[i].data;

                            if(vData.busdate==null||vData.busdate==''){
                                Ext.Msg.alert("提示", "请选择业务日期！");
                                return ;
                                break;
                            }
                            if(vData.uqledgeid==null||vData.uqledgeid==''){
                                    Ext.Msg.alert("提示", "请选择分户！");
                                    return ;
                                break;
                            }
                            if((vData.mnydebit==null||vData.mnydebit==''||vData.mnydebit==0)&&(vData.mnycredit==null||vData.mnycredit==''||vData.mnycredit==0)){
                                Ext.Msg.alert("提示", "请输入借方金额或是贷方金额！");
                                return ;
                                break;
                            }
                            for (var j = 1; j+i < this.store.data.length;  j++)
                            {
                               if(this.checkDateIsSame(vData.busdate,this.store.getAt(j+i).get('busdate'))&&vData.ledgerdetailid==this.store.getAt(j+i).get('ledgerdetailid')){
                                   Ext.Msg.alert("提示", "第"+(j+i+1)+"行的【业务日期】和【分户】与第"+(i+1)+"行相同，请修改再保存！");
                                   return ;
                                   break validata;
                               }
                            }
                            }
                                 }else{
                                                for (var i = 0; i < this.store.data.length; i++)
                                                {
                                                    var vData = this.store.data.items[i].data;

                                                    if(vData.busdate==null||vData.busdate==''){
                                                        Ext.Msg.alert("提示", "请选择业务日期！");
                                                        return ;
                                                        break;
                                                    }
                                                    if((vData.mnydebit==null||vData.mnydebit==''||vData.mnydebit==0)&&(vData.mnycredit==null||vData.mnycredit==''||vData.mnycredit==0)){
                                                        Ext.Msg.alert("提示", "请输入借方金额或是贷方金额！");
                                                        return ;
                                                        break;
                                                    }
                                                    for (var j = 1; j+i < this.store.data.length;  j++)
                                                    {
                                                        if(this.checkDateIsSame(vData.busdate,this.store.getAt(j+i).get('busdate'))){
                                                            Ext.Msg.alert("提示", "第"+(j+i+1)+"行的【业务日期】与第"+(i+1)+"行相同，请修改再保存！");
                                                            return ;
                                                        }
                                                    }
                                                }
                                        }
                                    }
                        Ext.Ajax.request(
                            {
                                url : "offsetmanager/accountcurrent/savedata",
                                params :
                                    {
                                        jsonStringAdd : JSON.stringify(this.getJsonDataAdd()).toString(),
                                        jsonStringUpdate : JSON.stringify(this.getJsonDataUpdate()).toString(),
                                        jsonStringDelete : JSON.stringify(this.getDeleteId())
                                    },
                                dataType: "json",
                                success : function(response)
                                {
                                    var r = Ext.decode(response.responseText);
                                    if (r.success)
                                    {
                                        if(r.msg==''){
                                            Ext.Msg.alert("提示", "已成功保存数据！");
                                            Ext.getCmp('editwindow').close();
                                            Ext.getCmp('accountlist').query();
                                        }else{
                                            Ext.Msg.alert("提示", r.msg);
                                            Ext.getCmp('editwindow').close();
                                            Ext.getCmp('accountlist').query();
                                            // var record = Ext.getCmp('accountlist').getSelections();
                                            // var uqaccountid= record[0].get('uqaccountid');
                                            // this.editgridpanelload(uqaccountid);
                                        }
                                    }
                                    else
                                    {
                                        Ext.Msg.alert("错误", r.msg);
                                    }
                                },
                                failure : function(response)
                                {
                                    Ext.Msg.alert("错误","保存失败！");
                                    return;
                                },
                                scope:this
                            });
                                },
                                failure : function(response)
                                {
                                    Ext.Msg.alert("错误","保存失败！");
                                    return;
                                },
                                scope:this
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