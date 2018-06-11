Ext.namespace('gl.vouchermanager.vouchermake');
gl.vouchermanager.vouchermake.ladgergroupbase = Ext.extend(Ext.Panel,
{
    autoHeight : true,
    id : '',
    labelAlign : 'right',
    bodyStyle : 'padding:5px 5px 5px 5px',
    border : false,
    isView : false,
    isOpenVoucher : false,
    frame : false,
    count : 0,
    acdataInfo : null,
    isOffset : false,
    listeners :
    {
        activate : function()
        {
            this.doLayout();
        }
    },
    initComponent : function()
    {
        this.createControl();
        gl.vouchermanager.vouchermake.ladgergroupbase.superclass.initComponent
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
				reader : new Ext.data.JsonReader(
						{
							root : 'ledgerdata'
						}, this.getRecord())
			});
        }
        return this.store;
    },
    getRecord : function()
    {
        return Ext.data.XyCalcRecord.create([
        {
            name : "voudetailid"
        },
        {
            name : 'uqledgerid'
        },
        {
            name : 'varledgercode'
        },
        {
            name : 'varledgername'
        },
        {
            name : 'intseq'
        },
        {
            name : 'percent',
            dependencies : ['money'],
            notDirty : true,
            calc : this.calcPercent.createDelegate(this),
        },
        {
            name : 'money',
            dependencies : ['percent'],
            notDirty : true,
            calc : this.calcMoney.createDelegate(this),
        },
        {
        	name : "isfirst"
        },
        {
        	name : "acdata"
        }
        ]);
    },
    calcPercent : function(record)
    {
        var detailMoney = this.debit + this.credit;
        
        var money = Number(record.get('money'));
        money = Ext.isEmpty(money) ? 0 : money;
        
        var per = 0;
        if (money != 0)
        {
            per = Number(Number(money).div(detailMoney).toFixed(4).movePoint(2));
        }
        
        var sumObj = this.grid.getSummary().getSum();
        if ((sumObj.percent + per) != 100 && sumObj.money + money == detailMoney)
        {
            per = 100 - sumObj.percent;
        }
            
        return isNaN(per) ? 0 : per;
    },
    calcMoney : function(record)
    {
    	//2018-04-12 修复制证再编辑标志位判断错误 导致使用四舍五入百分比计算金额导致的金额误差
		if ( record.get('isfirst') == true || record.get('isfirst').length == 0)
		{
			record.set('isfirst', false);
			return record.get('money');
		}
		
		var detailMoney = this.debit + this.credit;
		
        var per = Number(record.get('percent'));
        per = Ext.isEmpty(per) ? 0 : per; 
        
        var money = 0;
        if (per != 0)
        {
            money = Number(Number(detailMoney).mul(per).toFixed(0).movePoint(-2));
        }
        
        var sumObj = this.grid.getSummary().getSum();
        if ((sumObj.money + money) != detailMoney && sumObj.percent + per == 100)
        {
            money = detailMoney - sumObj.money;
        }
        
        money = money + 0;

        return isNaN(money) ? 0 : money;
    },
    createControl : function()
    {
        var clnRowNum = new Ext.grid.RowNumberer();

        this.nfPercent = new Ext.form.NumberField(
        {
            maxValue : 100,
			disabled : this.isView
        });
        
        this.nfMoney = new Ext.form.NumberField(
        {
            maxValue : 1000000000,
			disabled : this.isView
        });
        
        var varledgercode =
        {
            header : "分户编号",
            width : 80,
            dataIndex : "varledgercode"
        };
        
        var voudetailid =
        {
            hidden : true,
            dataIndex : "voudetailid"
        };
        
        var uqledgerid =
        {
            hidden : true,
            dataIndex : "uqledgerid"
        };
        
        var intseq =
        {
            hidden : true,
            dataIndex : "intseq"
        };
        
        var isfirst =
        {
            hidden : true,
            dataIndex : "isfirst"
        };
        
        var acdata =
        {
    		hidden : true,
    		dataIndex : "acdata"
        };
        
        var varledgername =
        {
            header : "分户名称",
            width : 150,
            dataIndex : "varledgername"
        };
        
        var percent =
        {
            header : "摊分比例",
            width : 60,
            summaryType : 'sum',
            dataIndex : "percent",
            css : 'text-align:right;',
            renderer : Ext.app.XyFormat.cnPercent,
            editor : this.nfPercent
        };
        
        var money =
        {
            header : "金额",
            width : 95,
            css : 'text-align:right;',
            summaryType : 'sum',
            renderer : Ext.app.XyFormat.cnMoney,
            dataIndex : "money",
            editor : this.nfMoney,
        };
        /*//给金额修改添加监听时间
        this.nfMoney.on("valuechange",this.changemoney.createDelegate(this));*/
        
        var cm = new Ext.grid.XyColumnModel([clnRowNum,voudetailid,uqledgerid, 
                                             varledgercode, varledgername, percent, money,
                                             intseq,isfirst,acdata]);

        var sm = new Ext.grid.RowSelectionModel(
        {
            singleSelect : true
        });

      //添加往来按钮
		var barac =
		{
			id : "barac",
			text : "往来核销",
			iconCls : "xy-associate",
			handler : this.showacwin,
			scope : this
		};
		if(this.isOffset && ! this.isView)
		{
			this.tbar = ["-", barac];
		}
		else
		{
			this.tbar = ["-"];
		}
       
        this.grid = new Ext.grid.XyEditorGridPanel(
        {
        	groupId : this.id,
        	mnydebit : this.debit, 
        	mnycredit : this.credit,
            border : true,
            store : this.getStore(),
            colModel : cm,
            enableColumnMove : false,
            enableHdMenu : false,
            enableColumnResize : false,
            autoScroll : true,
            selModel : sm,
            iconCls : 'xy-grid',
//            height : 225,
            height : 206,
            clicksToEdit : 1,
            allChangeName : '',
            allOffsetName : '',
            iChange : 0,
            iOffset : 0,
            allOffsetLedger : [],
            allChangeLedger : [],
            loadMask :
            {
                msg : "数据加载中，请稍等..."
            },
            
            //新增监听事件，判断金额是否修改
	        listeners :
	        {
	            afteredit:function (e) 
	            {
//	            	console.log(e.record);
	            	var money = e.record.get("money");
	            	var ladger = e.record;
	                if(ladger != null)
	                {
	                	var acdatatemp = ladger.get("acdata");
	            		if(acdatatemp != "" && acdatatemp != "\"\"" && acdatatemp != null )
	            		{
	            			if(typeof(acdatatemp)!= 'object')
	            			{
	            				acdatatemp = Ext.util.JSON.decode(acdatatemp);
	            			}
	            			
	            			if(this.mnycredit == 0 && this.mnydebit != 0 && this.mnydebit != "")
	            			{
	            				var moneyType = "mnydebit";
	            			}
	            			if(this.mnydebit == 0 && this.mnycredit != 0 && this.mnycredit != "")
	            			{
	            				var moneyType = "mnycredit";
	            			}
	            			if((this.mnycredit == 0 && this.mnydebit != 0 && this.mnydebit != "") || (this.mnydebit == 0 && this.mnycredit != 0 && this.mnycredit != "")) 
	                    	{
	            				/*if(moneyType == e.record.get("moneytype"))
	            				{
//	            					var remoney = money;
	            				}
	            				else
	            				{
	            					money = 0 - money;
//	            					var remoney = 0 - money;
	            				}*/
	//	            			console.log(acdatatemp.mainData);
		            			var acremainmoney = acdatatemp.mainData.remainmoney;
		            			var acyetmoney = acdatatemp.mainData.yetmoney;
		            			if(money != acremainmoney + acyetmoney)
		            			{
		            				if(this.iChange == 0)
		            				{
		            					this.allChangeName += ladger.get("varledgername");
		            					this.iChange++;
		            				}
		            				else
		            				{
		            					if(this.allChangeName.indexOf(ladger.get("varledgername")) < 0)
		            					{
		            						this.allChangeName += "," + ladger.get("varledgername");
		            						this.iChange++;
		            					}
		            				}
		            				this.allChangeLedger = this.allChangeName.split(",");
	            					Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").isChangeMoney = true;
	            					Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allChangeName = this.allChangeName;
	            					
	            					//当分摊金额绝对值小于冲销总金额绝对值
	            					if(Math.abs(money) - Math.abs(acyetmoney) < 0)
	            					{
	            						if(this.iOffset == 0)
	            						{
	            							this.allOffsetName += ladger.get("varledgername");
	            							this.iOffset++;
	            						}
	            						else
	            						{
	            							if(this.allOffsetName.indexOf(ladger.get("varledgername")) < 0)
	    	            					{
	            								this.allOffsetName += "," + ladger.get("varledgername");
	            								this.iOffset++;
	    	            					}
	            							
	            						}
	            						this.allOffsetLedger = this.allOffsetName.split(",");
	            						Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").isCanOffset = false;
	            						Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allOffsetName = this.allOffsetName;
	            					}
	            					else
	            					{
	            						for(var i = 0 ; i < this.allOffsetLedger.length ; i++) 
	            						{
	            							if(this.allOffsetLedger[i] == ladger.get("varledgername")) 
	            							{
	            								if(this.allOffsetLedger.length == 1)
	            								{
	            									this.allOffsetName = this.allOffsetName.replace(this.allOffsetLedger[i],"");
	            									Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allOffsetName = this.allOffsetName;
	            								}
	            								else if(i == 0)
	            								{
	            									this.allOffsetName = this.allOffsetName.replace(this.allOffsetLedger[i] + ",","");
	            									Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allOffsetName = this.allOffsetName;
	            								}
	            								else
	            								{
	            									this.allOffsetName = this.allOffsetName.replace(","+this.allOffsetLedger[i],"");
	            									Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allOffsetName = this.allOffsetName;
	            								}
	            								this.iOffset = this.iOffset -1;
	            								this.allOffsetLedger.splice(i,1);
	            							} 
	            						}
	            						if(this.allOffsetLedger.length == 0 || this.allOffsetLedger == "")
	            						{
	            							this.allOffsetName = '';
	            							this.iOffset = 0;
	            							Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").currentId = this.groupId;
	            							Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allOffsetName = this.allOffsetName;
	//            							Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").isCanOffset = true;
	            						}
	            					}
		            			}
	            			}
	            		}
	                }
	            }
	        }
        });
        this.items = [this.grid];  
    },
    
    getCurrRecord : function()
    {
        var sm = this.grid.getSelectionModel();
        if (sm)
        {
            return sm.getSelected();
        }
    },
    gridUpdateHandler : function(_this, record, operation)
    {
    	
    },
    getJsonData : function()
    {
        var o = [];
        for (var i = 0, j = this.getStore().data.length; i < j; i++)
        {
            var vData = this.getStore().data.items[i].data;
//            if (vData.money == 0) continue;
            var acdatatemp = vData.acdata;
            if(acdatatemp != "" && acdatatemp != "\"\"" && acdatatemp != null )
    		{
    			if(typeof(acdatatemp)!= 'object')
    			{
    				acdatatemp = Ext.util.JSON.decode(acdatatemp);
    			}
    		}
            var jsonData = null;
            var debit = 0;
            var credit = 0;
            if (this.credit == 0)
            {
                debit = vData.money;
                credit = 0;
                if(acdatatemp != "" && acdatatemp != "\"\"" && acdatatemp != null )
                {
                	acdatatemp.mainData.moneytype = "mnydebit";
                }
            }
            else
            {
                debit = 0;
                credit = vData.money;
                if(acdatatemp != "" && acdatatemp != "\"\"" && acdatatemp != null )
                {
                	acdatatemp.mainData.moneytype = "mnycredit";
                }
            }
            jsonData =
            {
            	voudetailid : vData.voudetailid,
            	uqledgerid : vData.uqledgerid,
            	varledgercode : vData.varledgercode,
            	varledgername : vData.varledgername,
            	intseq : vData.intseq,
                debit : debit+"",
                credit : credit+"",
                money : vData.money+"",
                acdata : acdatatemp
                //加一个往来数据
            };
            o.push(jsonData);
        }
        return o;
    },
    locateCode : function(varledgercode)
    {
    	var view = this.grid.getView();
    	var v = null;
    	var i = 1;
    	var isInnerText = Ext.isIE || Ext.isSafari2 || Ext.isSafari3;
    	for (i=1; i <= this.getStore().getCount(); i++)
    	{
    		if (isInnerText)
    			v = view.getCell(i ,3).innerText;
    		else
    			v = view.getCell(i ,3).textContent;
    		
    		if (!Ext.isEmpty(v) && v.toUpperCase().substr(0, varledgercode.length) == varledgercode.toUpperCase())
    		{
    			this.grid.getSelectionModel().selectRow(i);
				this.grid.startEditing(i,6);
				break;
    		}
    	}            	
    },
    validate : function()
    {
        var detailMoney = this.debit + this.credit;
        var sum = this.grid.getSummary().getSum().money;
        if (Math.abs(Number(detailMoney) - Number(sum)) > 0.0005)
        {
            Ext.Msg.alert("提示","分户合计金额与分录金额不等！");
            return false;
        }
        return true;
    },
    getBalance : function()
    {
    	var sumMoney = this.grid.getSummary().getSum().money;
        var detailMoney = this.debit + this.credit;
        return detailMoney - sumMoney;
    },
    //新增
	//往来核销按钮 处理过程
    showacwin : function ()
	{
    	//console.log(this.id);
		//返回被第一条被选中的记录
		var detailrecord = Ext.getCmp("vouchergriddetail").getSelectionModel().getSelected();
		if(detailrecord.get("intisac") == "0")
		{
			Ext.MessageBox.alert("提示", "该科目不是往来科目!");
			return false;
		}
		var accountledger = detailrecord.get("accountledger");
		
		var ladger = this.grid.getSelectionModel().getSelected();
		if(ladger == undefined || ladger == "")
		{
			Ext.MessageBox.alert("提示", "请选择分户明细!");
			return false;
		}
		var money = ladger.get("money")
		if(money == 0)
		{
			Ext.MessageBox.alert("提示", "请填写分户分摊金额!");
			return false;
		}
		
		var winType = "";
		if(this.acflag == 1)
		{
			winType = "offset";
			detailrecord.set("inttype",1);
		}
		else if(this.acflag == 2)
		{
			winType = "onaccount";
			detailrecord.set("inttype",2);
		}
		 //设置金额
		var remainmoney = 0;
        if(accountledger == "")
        {
        	var money = "";
        	if(mnycredit == 0)
        	{
        		money = mnydebit;
        		var moneyType = "mnydebit";
        	}
        	else
        	{
        		money = mnycredit;
        		var moneyType = "mnycredit";
        	}
        	remainmoney = money;
        }
        else
        {
        	remainmoney = money;
        }
        detailrecord.set("accountcode",detailrecord.displayData.uqaccountid);
        detailrecord.set("uqaccountid",detailrecord.primaryData.uqaccountid);
        detailrecord.set("uqledgeid",ladger.get("uqledgerid"));
        detailrecord.set("varledgername",ladger.get("varledgername"));
		detailrecord.set("remainmoney",remainmoney);
		detailrecord.set("offsetmoney",remainmoney);
		detailrecord.set("yetmoney",0);
		
		if(this.debit != 0 && this.credit == 0)
		{
			var moneyType = "mnydebit";
		}
		if(this.debit == 0 && this.credit != 0)
		{
			var moneyType = "mnycredit";
		}
		//定义一个临时的acdata,使得每次分户分摊金额改变，人工匹配的相应数据也改变
		var acdatatemp = ladger.get("acdata");
		if(acdatatemp != "" && acdatatemp != "\"\"" && acdatatemp != null )
		{
			if(typeof(acdatatemp)!= 'object')
			{
				acdatatemp = Ext.util.JSON.decode(acdatatemp);
			}
//			console.log(acdatatemp.mainData);
			var acremainmoney = acdatatemp.mainData.remainmoney;
			var acyetmoney = acdatatemp.mainData.yetmoney;
			
			/*if(detailrecord.data.hasOwnProperty("moneytype"))
			{
				//借贷方向相同
				if(moneyType == detailrecord.get('moneytype'))
				{
					if(remainmoney * (acremainmoney * 1 + acyetmoney) < 0)
					{
						acdatatemp.mainData.offsetmoney = remainmoney;
						acdatatemp.mainData.remainmoney = remainmoney;
						ladger.set("acdata", acdatatemp);
					}
					else
					{
						acdatatemp.mainData.offsetmoney = remainmoney;
						acdatatemp.mainData.remainmoney = remainmoney - acyetmoney;
						ladger.set("acdata", acdatatemp);
					}
				}
				
				//借贷方向不同
				if(moneyType != detailrecord.get('moneytype'))
				{
					if((0 - remainmoney) * (acremainmoney * 1 + acyetmoney) < 0)
					{
						acdatatemp.mainData.offsetmoney = remainmoney;
						acdatatemp.mainData.remainmoney = remainmoney;
						ladger.set("acdata", acdatatemp);
					}
					else
					{
						acdatatemp.mainData.offsetmoney = remainmoney;
						acdatatemp.mainData.remainmoney = remainmoney + acyetmoney;
						acdatatemp.mainData.money = 0 - acdatatemp.mainData.money;
						acdatatemp.mainData.yetmoney = 0 - acyetmoney;
						ladger.set("acdata", acdatatemp);
					}
				}
			}*/
			if(acdatatemp.mainData.hasOwnProperty("moneytype"))
			{
				//借贷方向相同
				if(moneyType == acdatatemp.mainData.moneytype)
				{
					if(remainmoney * (acremainmoney * 1 + acyetmoney) < 0)
					{
						acdatatemp.mainData.offsetmoney = remainmoney;
						acdatatemp.mainData.remainmoney = remainmoney;
						ladger.set("acdata", acdatatemp);
					}
					else
					{
						acdatatemp.mainData.offsetmoney = remainmoney;
						acdatatemp.mainData.remainmoney = (remainmoney - acyetmoney).toFixed(2);
						ladger.set("acdata", acdatatemp);
					}
				}
				
				//借贷方向不同
				if(moneyType != acdatatemp.mainData.moneytype)
				{
					if((0 - remainmoney) * (acremainmoney * 1 + acyetmoney) < 0)
					{
						acdatatemp.mainData.offsetmoney = remainmoney;
						acdatatemp.mainData.remainmoney = remainmoney;
						ladger.set("acdata", acdatatemp);
					}
					else
					{
						acdatatemp.mainData.offsetmoney = remainmoney;
						acdatatemp.mainData.remainmoney = remainmoney + acyetmoney;
						acdatatemp.mainData.money = 0 - acdatatemp.mainData.money;
						acdatatemp.mainData.yetmoney = 0 - acyetmoney;
						ladger.set("acdata", acdatatemp);
					}
					//当借贷方向不同时，改变mainData的moneytype字段值，从而动态改变借贷方向
					acdatatemp.mainData.moneytype = moneyType;
				}
			}
			else
			{
				if(remainmoney * (acremainmoney * 1 + acyetmoney) < 0)
				{
					acdatatemp.mainData.offsetmoney = remainmoney;
					acdatatemp.mainData.remainmoney = remainmoney;
					ladger.set("acdata", acdatatemp);
				}
				else
				{
					acdatatemp.mainData.offsetmoney = remainmoney;
					acdatatemp.mainData.remainmoney = (remainmoney - acyetmoney).toFixed(2);
					ladger.set("acdata", acdatatemp);
				}
			}
			/*if(remainmoney * (acremainmoney * 1 + acyetmoney) < 0)
			{
				acdatatemp.mainData.remainmoney = remainmoney;
				ladger.set("acdata", acdatatemp);
			}
			else
			{
				acdatatemp.mainData.offsetmoney = remainmoney;
				acdatatemp.mainData.remainmoney = remainmoney - acyetmoney;
				ladger.set("acdata", acdatatemp);
			}*/
		}
		
		//点击了往来核销按钮后,把下面三个变量的值复原
		for(var i = 0 ; i < this.grid.allChangeLedger.length ; i++) 
		{
			if(this.grid.allChangeLedger[i] == ladger.get("varledgername")) 
			{
				if(this.grid.allChangeLedger.length == 1)
				{
					this.grid.allChangeName = this.grid.allChangeName.replace(this.grid.allChangeLedger[i],"");
					Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allChangeName = this.grid.allChangeName;
				}
				else if(i == 0)
				{
					this.grid.allChangeName = this.grid.allChangeName.replace(this.grid.allChangeLedger[i] + ",","");
					Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allChangeName = this.grid.allChangeName;
				}
				else
				{ 
					this.grid.allChangeName = this.grid.allChangeName.replace(","+this.grid.allChangeLedger[i],"");
					Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allChangeName = this.grid.allChangeName;
				}
				this.grid.iChange = this.grid.iChange -1;
				this.grid.allChangeLedger.splice(i,1);
			} 
		}
		if(this.grid.allChangeLedger.length == 0 || this.grid.allChangeLedger == "")
		{
			this.grid.allChangeName = '';
			this.grid.iChange = 0;
			Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").currentId = this.id;
			Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allChangeName = this.grid.allChangeName;
//			Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").isChangeMoney = false;
		}
		/*if(this.acdataInfo != null && this.acdataInfo != "")
		{
			ladger.set("acdata", this.acdataInfo);
		}*/
	
//		console.log("分户数据");
//		console.log(detailrecord);
//		console.log(ladger);
		
		var win = new gl.offsetmanager.currentoffset.manualmachewin
		(
            {
                winType : winType,
                selectInfo : detailrecord,
                intisvoucher : true,
                isOpenVoucher : this.isOpenVoucher,
                ladgerac : ladger,
                //新增参数，传递页面id
                ledgerPageId : this.id
            }
        );
//		win.setMainData();
        win.show();
	},
	
	//新增函数，在打开了人工匹配页面后，重新判断能否冲销
	reJudgeOffset : function()
	{
		var ladger = this.grid.getSelectionModel().getSelected();
		var iscanoffset = ladger.get("iscanoffset");
		
		for(var i = 0 ; i < this.grid.allOffsetLedger.length ; i++) 
		{
			if(this.grid.allOffsetLedger[i] == ladger.get("varledgername")) 
			{
				if(this.grid.allOffsetLedger.length == 1)
				{
					this.grid.allOffsetName = this.grid.allOffsetName.replace(this.grid.allOffsetLedger[i],"");
					Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allOffsetName = this.grid.allOffsetName;
				}
				else if(i == 0)
				{
					this.grid.allOffsetName = this.grid.allOffsetName.replace(this.grid.allOffsetLedger[i] + ",","");
					Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allOffsetName = this.grid.allOffsetName;
				}
				else
				{
					this.grid.allOffsetName = this.grid.allOffsetName.replace(","+this.grid.allOffsetLedger[i],"");
					Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allOffsetName = this.grid.allOffsetName;
				}
				this.grid.iOffset = this.grid.iOffset -1;
				this.grid.allOffsetLedger.splice(i,1);
			} 
		}
		if(this.grid.allOffsetLedger.length == 0 || this.grid.allOffsetLedger == "")
		{
			this.grid.allOffsetName = '';
			this.grid.iOffset = 0;
			Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").currentId = this.id;
			Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").allOffsetName = this.grid.allOffsetName;
//			Ext.getCmp("gl.vouchermanager.vouchermake.ledgerinfo").isCanOffset = true;
		}
	}
});