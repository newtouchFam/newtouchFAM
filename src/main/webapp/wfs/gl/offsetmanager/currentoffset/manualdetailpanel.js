/**
 * Created by zhaodongchao on 2017/10/19.
 */
Ext.namespace('gl.offsetmanager.currentoffset');
gl.offsetmanager.currentoffset.manualdetailpanel = Ext.extend(Ext.grid.XyEditorGridPanel,
    {
        id : "offsetmanager.currentoffset.manualdetailpanel",
        bodyStyle : 'width:100%',
        iconCls : 'xy-grid',
        isView : false,
        region : "center",
        autoScroll : true,
        params : null,
        height : 150,
        winType : null,//打开方式，时显示冲挂账数据还是显示冲付款数据
        selectInfo:null,//主界面选择的一条record
        realRecords:[],
        clicksToEdit : 1,
        mainData : null,
        detailDatas : null,
      //新增变量判断总冲销金额是否 大于 未冲金额
//      realremainmoney : null,
        ladgerac : null,
        listeners :{ afteredit:function (e) {
            var recordIndex = this.store.indexOf(e.record) ;
            var offsetmoney = e.record.get('offsetmoney');;
            var yetmoney = this.realRecords[recordIndex];
            var remainmoney = e.record.get('remainmoney');
            //总的本次冲销金额不能大于前页面所选记录的未冲金额
            var unoffset = Ext.getCmp('currentoffset.manualmachewin.moeny_unoffset');
            var currentSelectUnrushMoney = this.selectInfo.get('remainmoney');

            var mainFlag = true ;
            var detailFlag = true ;

            if (currentSelectUnrushMoney < 0){
                mainFlag = false ;
            }
            if (offsetmoney < 0){
                detailFlag = false ;
            }
            if(!detailFlag && e.value > 0){
                Ext.Msg.alert('提示','本次冲销金额应该为负数！');
                e.record.set('currentrushmoney',0);
                e.record.set('yetmoney',yetmoney);
                return ;
            }
            if(detailFlag && e.value < 0){
                Ext.Msg.alert('提示','总的本次冲销金额应该为正数！');
                e.record.set('currentrushmoney',0);
                e.record.set('yetmoney',yetmoney);
                return ;
            }
            if (this.parseToNumber(currentSelectUnrushMoney) < this.parseToNumber(e.value)){
                Ext.Msg.alert('提示','总的本次冲销金额不能大于前页面所选记录的未冲金额');
                e.record.set('currentrushmoney',0);
                e.record.set('yetmoney',yetmoney);
                return ;
            }
            //求表格中总的本次冲销金额
            var totalRushMoney = 0.0 ;
            for(var n=0 ; n < e.grid.store.getCount() ; n++){
                var currentrushmoney = e.grid.store.getAt(n).get('currentrushmoney');
                if(!currentrushmoney){
                    currentrushmoney = 0 ;
                }
                totalRushMoney +=this.parseToNumber(currentrushmoney);
            }
            if(this.parseToNumber(currentSelectUnrushMoney) - this.parseToNumber(totalRushMoney)<0){
                Ext.Msg.alert('提示','本次冲销金额超过额度');
                e.record.set('currentrushmoney',0);
                e.record.set('yetmoney',yetmoney);
                return;
            }
            if ((this.parseToNumber(offsetmoney) - this.parseToNumber(yetmoney) - this.parseToNumber(e.value))<0){//填写的本次冲销金额超过额度
                Ext.Msg.alert('提示','本次冲销金额超过额度');
                e.record.set('currentrushmoney',0);
                e.record.set('yetmoney',yetmoney);
                return;
            }else{
                e.record.set('yetmoney',this.formatMoney(this.parseToNumber(yetmoney) + this.parseToNumber(e.value),detailFlag));
                e.record.set('remainmoney',this.formatMoney(this.parseToNumber(offsetmoney)-this.parseToNumber(yetmoney) - this.parseToNumber(e.value),detailFlag));
                unoffset.setValue(this.formatMoney(this.parseToNumber(currentSelectUnrushMoney) - this.parseToNumber(totalRushMoney),mainFlag).toFixed(2));
            }
        } },
        getRecord : function ()
        {
            return Ext.data.XyCalcRecord.create([
                {
                    name : 'voucherid'
                }, {
                    name : 'uqvoucherdetailid'
                }, {
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
                    name : 'uqledgeid'
                }, {
                    name : 'uqledgetypeid'
                }, {
                    name : 'intcompanyseq'
                }, {
                    name : 'intisledge'
                }, {
                    name : 'offsetmoney'
                }, {
                    name : 'yetmoney'
                }, {
                    name : 'currentrushmoney'
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
                }
            ]);
        },
        getStore : function()
        {
            if (this.store === undefined || this.store == null) {
                //定义数据集
                var url = '';
                if (this.winType == 'offset') {
                    url = 'offsetmanager/currentoffset/onaccount';//加载挂账数据
                } else {
                    url = 'offsetmanager/currentoffset/offset';
                }
                this.store = new Ext.data.Store(
                    {
                        url : url,
                        reader : new Ext.data.JsonReader(
                            {
                                root : 'data'
                            }, this.getRecord())
                    });
            }
            return this.store;
        },
        
        //新增  2017-12-20
    	//Created by wuzehua on 2017/12/20.
    	//凭证中核销回写
        load : function(value)
        {
//        	console.log(this.selectInfo.get("offsetmoney"));
        	if(value != null && value.getCount() > 0)
        	{
        		if(this.selectInfo.get("accountledger") != "" && this.selectInfo.get("accountledger") != "\"\"")
        		{
//        			console.log("有分户回写");
        			var accountledger = this.selectInfo.get("accountledger");
        			if(typeof(accountledger)!= 'object')
        			{
        				if(accountledger != "")
        				{
        					accountledger = Ext.util.JSON.decode(accountledger);
        				}
        			}
        			
        			for(var i = 0; i < accountledger.length ; i++)
        			{
        				var ledgerdata = accountledger[i].ledgerdata;
        				for(var ii=0; ii < ledgerdata.length ; ii++ )
        				{
        					var acdata = this.ladgerac.get("acdata");
        					if(typeof(acdata)!= 'object')
    	        			{
    	        				if(acdata != "")
    	        				{
    	        					acdata = Ext.util.JSON.decode(acdata);
    	        				}
    	        			}
        					if(acdata != null && acdata != "")
    						{
	            				if(ledgerdata[ii].uqledgerid != "" && acdata.mainData.uqledgeid == ledgerdata[ii].uqledgerid )
	            				{
	        						this.mainData = acdata.mainData;
	                				Ext.getCmp("gl.offsetmanager.currentoffset.manualmachewin").moeny_unoffset.setValue(this.mainData.remainmoney);
	        						this.detailDatas = acdata.detailDatas;
	        						this.showDetail(this.detailDatas,value);
        						}
            				}
        				}
        			}
        		}
        		else
        		{
        			if (this.selectInfo.get('noledgerac') != "") 
        	        {
//        				console.log("无分户回写");
        				var noledgerac = this.selectInfo.get('noledgerac');
        				if(typeof(this.selectInfo.get('noledgerac')) != 'object')
        				{
        					noledgerac = Ext.util.JSON.decode(this.selectInfo.get('noledgerac'));
        				}
        				this.mainData = noledgerac.mainData;
//        				console.log(Ext.getCmp("gl.offsetmanager.currentoffset.manualmachewin"));
        				Ext.getCmp("gl.offsetmanager.currentoffset.manualmachewin").moeny_unoffset.setValue(this.mainData.remainmoney);
        				this.detailDatas = noledgerac.detailDatas;
        				this.showDetail(this.detailDatas,value);
        	        }
        		}
        	}
        	
        	
        },
        showDetail : function(detailDatas,value)
        {
        	if(detailDatas != null && detailDatas != "")
        	{
//        		this.realremainmoney = Math.abs(this.selectInfo.get("offsetmoney"));
        		for (var k=0;k<detailDatas.length;k++)
            	{
            		var iniid = "";
            		var uqvoudetailid = "";
            		var money = "";
            		var uqledgeid ="";
            		if(detailDatas[k].iniid != "")
            		{
            			iniid = detailDatas[k].iniid;
            			money = detailDatas[k].money;
            		}
            		else
            		{
            			uqledgeid = detailDatas[k].uqledgeid;
            			uqvoudetailid = detailDatas[k].uqvoudetailid;
            			money = detailDatas[k].money;
            		}
            		for(var n=0;n<value.getCount();n++)
            		{
            			if(value.getAt(n).get("iniid") != "" && value.getAt(n).get("uqvoucherdetailid") == ""
            				&& value.getAt(n).get("iniid") == iniid)
            			{
            				value.getAt(n).set("currentrushmoney",money);
            				value.getAt(n).set("remainmoney",value.getAt(n).get("remainmoney")-money);
            				value.getAt(n).set("yetmoney",value.getAt(n).get("yetmoney")+money);
//            				this.reWriteDetail(money,n,value);
            			}
            			else if(value.getAt(n).get("uqvoucherdetailid") != "" && value.getAt(n).get("iniid") == "")
            			{
            				if(value.getAt(n).get("uqledgeid") != "" && value.getAt(n).get("uqledgeid") == uqledgeid 
            					&& value.getAt(n).get("uqvoucherdetailid") == uqvoudetailid)
            				{
            					value.getAt(n).set("currentrushmoney",money);
            					value.getAt(n).set("remainmoney",value.getAt(n).get("remainmoney")-money);
            					value.getAt(n).set("yetmoney",value.getAt(n).get("yetmoney")+money);
//            					this.reWriteDetail(money,n,value);
            				}
            				else if(value.getAt(n).get("uqledgeid") == "" && value.getAt(n).get("uqvoucherdetailid") == uqvoudetailid)
            				{
            					value.getAt(n).set("currentrushmoney",money);
            					value.getAt(n).set("remainmoney",value.getAt(n).get("remainmoney")-money);
            					value.getAt(n).set("yetmoney",value.getAt(n).get("yetmoney")+money);
//            					this.reWriteDetail(money,n,value);
            				}
            			}
            		}
            	}
        	}
        },
       /*reWriteDetail : function(money,n,value)
        {
        	if(Math.abs(money) > Math.abs(this.realremainmoney))
			{
				if(this.selectInfo.get("offsetmoney") >= 0)
				{
					Ext.getCmp("gl.offsetmanager.currentoffset.manualmachewin").moeny_unoffset.setValue(this.realremainmoney);
					this.mainData.remainmoney = this.realremainmoney;
				}
				else
				{
					Ext.getCmp("gl.offsetmanager.currentoffset.manualmachewin").moeny_unoffset.setValue(0-this.realremainmoney);
					this.mainData.remainmoney = 0-this.realremainmoney;
				}
			}
			else
			{
				value.getAt(n).set("currentrushmoney",money);
				value.getAt(n).set("remainmoney",value.getAt(n).get("remainmoney")-money);
				value.getAt(n).set("yetmoney",value.getAt(n).get("yetmoney")+money);
				this.realremainmoney = Math.abs(this.realremainmoney) - Math.abs(money);
			}
        },*/
        initComponent : function ()
        {
            if (this.winType == 'offset'){
                this.title = '冲挂账';
            }else{
                this.title = '冲付款';
            }
            var url = '';
            if (this.winType == 'offset') {
                url = 'offsetmanager/currentoffset/onaccount';//加载挂账数据
            } else {
                url = 'offsetmanager/currentoffset/offset';
            }
            this.store = new Ext.data.Store(
                {
                    url : url,
                    reader : new Ext.data.JsonReader(
                        {
                            root : 'data'
                        }, this.getRecord())
                });

            this.createColModel = function (type) {
                var cols = [];
                cols.push(new Ext.grid.RowNumberer());
                cols.push(new Ext.grid.CheckboxSelectionModel({singleSelect: true}));
                cols.push({
                    hidden : true,
                    dataIndex : "voucherid"
                });
                if (type == 'offset'){
                    //显示挂账列
                    cols.push({
                        header : '<div style="text-align:center">挂账日期</div>',
                        dataIndex : "accountdate",
                        format : 'Y-m-d',
                        align : "right",
                        width : 80
                    });
                }else {
                    cols.push({
                        header : '<div style="text-align:center">付款日期</div>',
                        dataIndex : "accountdate",
                        format : 'Y-m-d',
                        align : "right",
                        width : 80
                    });
                }
                cols.push({
                    header : '<div style="text-align:center">摘要</div>',
                    dataIndex : "varabstract",
                    width : 120
                });
                cols.push({
                    header : '<div style="text-align:center">科目</div>',
                    dataIndex : "accountcode",
                    menuDisabled:true,
                    renderer : Freesky.Common.XyFormat.overFlowTip,
                    width : 120
                });
                cols.push({
                    header : '<div style="text-align:center">分户类别</div>',
                    dataIndex : "accountledgertype",
                    width : 80
                });
                cols.push({
                    header : '<div style="text-align:center">分户</div>',
                    dataIndex : "accountledger",
                    css : 'text-align:right;',
                    width : 80
                });
                if (type == 'offset'){
                    cols.push({
                        header : '<div style="text-align:right">挂账金额</div>',
                        dataIndex : "offsetmoney",
                        align : "right",
                        renderer : Ext.app.XyFormat.cnMoney,
                        width : 90
                    });
                    cols.push({
                        header : '<div style="text-align:right">已冲金额</div>',
                        dataIndex : "yetmoney",
                        align : "right",
                        renderer : Ext.app.XyFormat.cnMoney,
                        width : 90
                    });
                }else {
                    cols.push({
                        header : '<div style="text-align:right">付款金额</div>',
                        dataIndex : "offsetmoney",
                        align : "right",
                        renderer : Ext.app.XyFormat.cnMoney,
                        width : 90
                    });
                    cols.push({
                        header : '<div style="text-align:right">已付金额</div>',
                        dataIndex : "yetmoney",
                        align : "right",
                        renderer : Ext.app.XyFormat.cnMoney,
                        width : 90
                    });
                }
                cols.push({
                    header : '<div style="text-align:right">本次冲销金额</div>',
                    dataIndex : "currentrushmoney",
                    align : "right",
                    renderer : Ext.app.XyFormat.cnMoney,
                    width : 90,
                    id:'currentRushedMoney',
                    editor : new Freesky.Common.XyMoneyField(
                        {
                            allowBlank : true,
                            allowNegative : true,
                            maxValue : 1000000000,
                            disabled : false
                        })
                });
                cols.push({
                    header : '<div style="text-align:right">余额</div>',
                    dataIndex : "remainmoney",
                    align : "right",
                    renderer : Ext.app.XyFormat.cnMoney,
                    width : 90
                });
                cols.push({
                    header : '<div style="text-align:center">流水号</div>',
                    dataIndex : "intcompanyseq",
                    width : 70
                });
                cols.push({
                    header : '<div style="text-align:center">凭证编号</div>',
                    dataIndex : "intvouchernum",
                    align : "center",
                    width : 70
                });
                if (type == 'offset'){
                    cols.push({
                        header : '<div style="text-align:center">挂账人</div>',
                        dataIndex : "accountuser",
                        width : 70
                    });
                }else {
                    cols.push({
                        header : '<div style="text-align:center">制证人</div>',
                        dataIndex : "accountuser",
                        width : 70
                    });
                }
                return new Ext.grid.XyColumnModel(cols);
            }

            this.colModel = this.createColModel(this.winType);
            //定义选择方式,按enter键之后会调到下一行的可编辑列
            this.selModel = new Ext.grid.RowSelectionModel(
                {
                    singleSelect : true,
                    moveEditorOnEnter : true,
                    onEditorKey : function(field, e)
                    {
                        var k = e.getKey(), newCell, g = this.grid, last = g.activeEditor, ed = g.activeEditor,
                            shift = e.shiftKey, ae, last, r, c;
                        if (k == e.ENTER)
                        {
                            if (this.moveEditorOnEnter !== false)
                            {
                                if (shift)
                                {
                                    newCell = g.walkCells(last.row, last.col - 1, -1,
                                        this.acceptsNav, this);
                                } else {
                                    newCell = g.walkCells(last.row, last.col + 1, 1,
                                        this.acceptsNav, this);
                                }
                            }
                        }
                        if (newCell)
                        {
                            r = newCell[0];
                            c = newCell[1];

                            this.selectRow(r);

                            if (g.isEditor && g.editing)
                            {
                                ae = g.activeEditor;
                                if (ae && ae.field.triggerBlur)
                                {
                                    ae.field.triggerBlur();
                                }
                            }
                            g.startEditing(r, c);
                        }
                    }
                });
            
            this.store.on('load',function (st,records) {
                this.realRecords= [];
                for(var i=0 ; i<st.getCount();i++){
                    this.realRecords.push(st.getAt(i).get('yetmoney'));
                }
                
                //新增  2017-12-21
            	//Created by wuzehua on 2017/12/21.
            	//根据accountuser判断 是冲销页面还是凭证页面的调用，前者不加载load(),后者加载
                if(typeof(this.selectInfo.data)!= 'object')
    			{
    				if(this.selectInfo.data != "")
    				{
    					this.selectInfo.data = Ext.util.JSON.decode(this.selectInfo.data);
    				}
    			}
//                console.log(this.selectInfo.data);
                if(!this.selectInfo.data.hasOwnProperty("accountuser"))
                {
                	this.load(st);
                }
            }.createDelegate(this));
            
            gl.offsetmanager.currentoffset.manualdetailpanel.superclass.initComponent.call(this);

        },
        getSelectedIndex : function ()
        {
            var record = this.getSelectionModel().getSelected();
            if(record != null)
            {
                return this.getStore().indexOf(record);
            }
            return -1;
        },parseToNumber:function (value) {
            if (value >=0){
                return value;
            }else {
                return (0-value) ;
            }
        },formatMoney:function (value,type) {
            if (type){
                return value ;
            }else {
                return 0-value;
            }
        }
    });