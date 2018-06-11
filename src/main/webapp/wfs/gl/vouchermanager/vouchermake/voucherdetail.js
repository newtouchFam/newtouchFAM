Ext.namespace('gl.vouchermanager.vouchermake');
gl.vouchermanager.vouchermake.voucherdetail = Ext.extend(Ext.grid.XyEditorGridPanel,
{
	id : "vouchergriddetail",
	bodyStyle : 'width:100%',
	iconCls : 'xy-grid',
	isView : false,
	isOpenVoucher : false,
	region : "center",
	autoScroll : true,
	framevoucherid : '',
	vouchertag : null,
	voucherbooktag : null,
	params : null,
	height : 150,
	centerinfo : null,
	clicksToEdit : 1,
	allChangeName : '',
    allOffsetName : '',
    iChange : 0,
    iOffset : 0,
    allOffsetArray : [],
    allChangeArray : [],
	//新增监听事件，判断做过核销的分录金额是否修改
	listeners :
    {
        afteredit:function (e) 
        {
//        	console.log(e.record);
        	var mnydebit = e.record.get("mnydebit");
        	var mnycredit = e.record.get("mnycredit");
        	var noledgeractemp = e.record.get("noledgerac");
        	var intacflag = e.record.get("intacflag");
        	//console.log(e.record.get("uqaccountid"));
        	//console.log(e.record.get("uqaccountid").get("test"));
        	var uqaccountid = e.record.get("uqaccountid");
        	var accountCode = uqaccountid.text;
        	if(accountCode == undefined || accountCode == null || accountCode =="")
        	{
        		accountCode = e.record.get("accountcode");
        		if(accountCode != undefined)
        		{
        			accountCode = accountCode.substring(1,accountCode.indexOf("]"));
        		}
        	}
    		if(noledgeractemp != "" && noledgeractemp != "\"\"" && noledgeractemp != null )
    		{
    			if(typeof(noledgeractemp)!= 'object')
    			{
    				noledgeractemp = Ext.util.JSON.decode(noledgeractemp);
    			}
//        			console.log(acdatatemp.mainData);
    			if(mnycredit == 0 && mnydebit != 0 && mnydebit != "")
    			{
    				var moneyType = "mnydebit";
    				var money = mnydebit;
    			}
    			if(mnydebit == 0 && mnycredit != 0 && mnycredit != "")
    			{
    				var moneyType = "mnycredit";
    				var money = mnycredit;
    			}
    			if((mnycredit == 0 && mnydebit != 0 && mnydebit != "") || (mnydebit == 0 && mnycredit != 0 && mnycredit != "")) 
            	{
    				/*if(moneyType == e.record.get("moneytype"))
    				{
    					var money = e.record.get(moneyType);
    					var remoney = money;
    				}
    				else
    				{
    					var money = 0 - e.record.get(moneyType);
    					var remoney = 0 - money;
    				}*/
    				//分录金额修改
    				var acremainmoney = noledgeractemp.mainData.remainmoney;
        			var acyetmoney = noledgeractemp.mainData.yetmoney;
    				if(money != acremainmoney + acyetmoney)
	    			{
	    				if(this.iChange == 0)
	    				{
	    					this.allChangeName += accountCode;
	    					this.iChange++;
	    				}
	    				else
	    				{
	    					if(this.allChangeName.indexOf(accountCode) < 0)
	    					{
	    						this.allChangeName += "," + accountCode;
	    						this.iChange++;
	    					}
	    				}
	    				this.allChangeArray = this.allChangeName.split(",");
						Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").isChangeMoney = true;
						Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allChangeName = this.allChangeName;
						
						//分录金额绝对值小于冲销总金额绝对值
						if(Math.abs(money) - Math.abs(acyetmoney) < 0)
						{
							if(this.iOffset == 0)
							{
								this.allOffsetName += accountCode;
								this.iOffset++;
							}
							else
							{
								if(this.allOffsetName.indexOf(accountCode) < 0)
	        					{
									this.allOffsetName += "," + accountCode;
									this.iOffset++;
	        					}
								
							}
							this.allOffsetArray = this.allOffsetName.split(",");
							Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").isCanOffset = false;
							Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allOffsetName = this.allOffsetName;
						}
						else
						{
							for(var i = 0 ; i < this.allOffsetArray.length ; i++) 
							{
								if(this.allOffsetArray[i] == accountCode) 
								{
									if(1 == this.allOffsetArray.length)
									{
										this.allOffsetName = this.allOffsetName.replace(this.allOffsetArray[i],"");
										Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allOffsetName = this.allOffsetName;
									}
									else if(i == 0)
									{
										this.allOffsetName = this.allOffsetName.replace(this.allOffsetArray[i] + ",","");
										Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allOffsetName = this.allOffsetName;
									}
									else
									{
										this.allOffsetName = this.allOffsetName.replace(","+this.allOffsetArray[i],"");
										Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allOffsetName = this.allOffsetName;
									}
									this.iOffset = this.iOffset - 1;
									this.allOffsetArray.splice(i,1);
								} 
							}
							if(this.allOffsetArray.length == 0 || this.allOffsetArray == "")
							{
								this.allOffsetName = '';
								this.iOffset = 0;
								Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allOffsetName = this.allOffsetName;
								Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").isCanOffset = true;
							}
						}
	    			}
            	}
    		}
        }
    },
	getRecord : function ()
	{
		return Ext.data.XyCalcRecord.create([
		{
			name : 'voucherdetailid'
		},
		{
			name : 'voucherid'
		},
		{
			name : 'intseq'
		},
		{
			name : 'varabstract'
		},
		{
			name : 'uqaccountid'
		},
		{
			name : 'mnydebit'
		},
		{
			name : 'mnycredit'
		},
		{
			name : 'intisledger'
		},
		{
			name : 'accountledgertype'
		},
		{
			name : 'accountledger'
		},
		{
			name : 'intisac'
		},
		{
			name : 'intacflag'
		},
		{
			name : 'noledgerac'
		}
		]);
	},
	getStore : function()
	{
		if (this.store === undefined || this.store == null) {
			//定义数据集
			this.store = new Ext.data.Store(
			{
				url : 'vouchermanager/voucherdetail/detailinfo',
				reader : new Ext.data.JsonReader(
						{
							root : 'data'
						}, this.getRecord())
			});
		}
		return this.store;
	},
	initComponent : function ()
	{
		this.store = new Ext.data.Store(
		{
			url : 'vouchermanager/voucherdetail/detailinfo',
			reader : new Ext.data.JsonReader(
					{
						root : 'data'
					}, this.getRecord())
		});
		//定义列
		var voucherdetailid = 
		{
			hidden : true,
			dataIndex : "voucherdetailid"
		};
		
		var voucherid = 
		{
			hidden : true,
			dataIndex : "voucherid"
		};
		
		var intseq = 
		{
			hidden : true,
			dataIndex : "intseq"
		};
		
		var varabstract =
		{
			header : '<div style="text-align:center">摘要</div>',
			dataIndex : "varabstract",
			width : 150,
			renderer : Freesky.Common.XyFormat.overFlowTip,
			menuDisabled:true,
			editor : new Ext.form.TextField(
			{
				id : "varabstract",
				disabled : this.isView
			})
		};
		
		this.accountcom = new gl.component.xychooseaccountex(
		{
			id : "uqaccountid",
			grid : this,
			disabled : this.isView
		});
		
		this.accountcom.on("afterset",this.accountcomafterset.createDelegate(this));
		this.accountcom.on("afterset",this.getAccountAC.createDelegate(this));
		
		var uqaccountid = 
		{
			header : '<div style="text-align:center">科目</div>',
			complex : true,
			dataIndex : "uqaccountid",
			width : 250,
			menuDisabled:true,
			renderer : Freesky.Common.XyFormat.overFlowTip,
			editor : this.accountcom
		};

		/**
		 * 科目组件回车后后台查询科目填充界面
		 */
		this.accountcom.on("inputend", function(field, data)
		{
			var records = this.getSelectionModel().getSelections();
			if (records == null || records == '' || records.length == 0)
			{
				return;
			};

			var record = records[0];

			record.setEx("uqaccountid", data, data.text, data.id);
		}, this);

		var mnydebit =
		{
			header : '<div style="text-align:center">借方金额</div>',
			dataIndex : "mnydebit",
			width : 150,
			menuDisabled:true,
			summaryType : 'sum',
			XySumToCom : 'mnydebitsum',
			css : 'text-align:right;',
			renderer : Ext.app.XyFormat.cnMoneyEx,
			editor : new Freesky.Common.XyMoneyField(
			{
				allowBlank : true,
				allowNegative : true,
				maxValue : 1000000000,
				disabled : this.isView
			})
		};
		
		var mnycredit =
		{
			header : '<div style="text-align:center">贷方金额</div>',
			dataIndex : "mnycredit",
			width : 150,
			summaryType : 'sum',
			menuDisabled:true,
			XySumToCom : 'mnycreditsum',
			css : 'text-align:right;',
			renderer : Ext.app.XyFormat.cnMoneyEx,
			editor : new Freesky.Common.XyMoneyField(
			{
				allowBlank : true,
				allowNegative : true,
				maxValue : 1000000000,
				disabled : this.isView
			})
		};
		
		//此为分户相关属性 隐藏便于取值
		var intisledger = 
		{
			hidden : true,
			dataIndex : "intisledger"
		};
		
		//此为电信核销科目属性 隐藏便于取值
		var intisac = 
		{
			hidden : true,
			dataIndex : "intisac"
		};
		
		//此为科目类别标志位 隐藏便于取值   0为应付、预收  1为应收、预付
		var intacflag = 
		{
			hidden : true,
			dataIndex : "intacflag"
		};
		
		//此为 往来数据   暂定仅存没有分户的分录
		var noledgerac = 
		{
			hidden : true,
			dataIndex : "noledgerac"
		};
		
		var accountledgertype = 
		{
			hidden : true,
			dataIndex : "accountledgertype"
		};
		
		var accountledger = 
		{
			hidden : true,
			dataIndex : "accountledger"
		};
		
		this.colModel = new Ext.grid.XyColumnModel(
		[
		    voucherdetailid, voucherid, intseq, varabstract
		    ,uqaccountid, mnydebit, mnycredit, intisledger
		    ,accountledgertype,accountledger,intisac,intacflag,noledgerac
	    ]);
		
		//定义选择方式
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
					
					var com = g.getColumnModel().getCellEditor(c, r);
					if(com != null && com.field.id == "uqaccountid")
					{
						this.grid.accountcomafterset.createDelegate(this);
						Ext.getCmp("uqaccountid").acteditor = {r:r,c:c};
					}
				}
			}
		});
		
		//定义tbar
		var barAdd =
		{
			id : "pbtnadd",
			text : "添加",
			iconCls : "xy-add",
			handler : this.addItem,
			scope : this
		};
		
		var barDelete =
		{
			id : "pbtndelete",
			text : "删除",
			iconCls : "xy-delete",
			handler : this.delItem,
			scope : this
		};
		
		var barledger =
		{
			id : "barledger",
			text : "分户",
			iconCls : "xy-comment",
			handler : this.showledgerwin,
			scope : this
		};
		
		//新增
		//添加往来按钮
		var barac =
		{
			id : "barac",
			text : "往来核销",
			iconCls : "xy-associate",
			handler : this.showacwin,
			scope : this
		};

		//修改 添加barac
		//可编辑 和 仅查看情况下的tbar
		if(this.isView == false)
	    {
			this.tbar = ["-", barAdd, "-", barDelete, "-", barledger, "-", barac];
	    }
		else
		{
			this.tbar = [ "-", barledger/*, "-", barac*/];
		}
		
		gl.vouchermanager.vouchermake.voucherdetail.superclass.initComponent.call(this);
		
		this.on("click",this.getACinfo.createDelegate(this));
	},
	newRecord : function ()
	{
		var uqaccountidnew = 
		{
			id : '',
			text : ''
		};
		var re = this.getSelectionModel().getSelected();
//		console.log(re);
		var varabstractnew = re != null ? re.get("varabstract") : '';
		var record = this.getRecord();
		return new record(
		{
			voucherdetailid : '',
			voucherid : '',
			intseq : '',
			varabstract : varabstractnew,
			uqaccountid : uqaccountidnew,
			mnydebit : 0,
			mnycredit : 0,
			intisledger : 0,
			accountledgertype : '',
			accountledger : '',
			intisac : 3,
			intacflag : 3,
			noledgerac : ''
		});
	},
	addItem : function () 
	{
		Freesky.Common.XyGridUtil.add(this, this.newRecord(), this.getSelectedIndex()+1);
		Freesky.Common.XyGridUtil.refreshRowNum(this, 0);
	},
	delItem : function () 
	{
		Freesky.Common.XyGridUtil.del(this);
		Freesky.Common.XyGridUtil.refreshRowNum(this, 0);
		
		this.centerinfo.updateSumLable();
	},
	showledgerwin : function ()
	{
		var voucherline = Ext.getCmp("vouchergriddetail").getStore().getCount();
		if(voucherline < 1)
		{
			Ext.MessageBox.alert("提示", "请填写凭证分录!");
			return false;
		}
		var detailrecord = Ext.getCmp("vouchergriddetail").getSelectionModel().getSelected();
		if(detailrecord == null)
		{
			Ext.MessageBox.alert("提示", "请选择一条分录！");
			return false;
		}
		if(detailrecord.getXyValue("uqaccountid") == "")
		{
			Ext.MessageBox.alert("提示", "请选择科目!");
			return false;
		}
		if(detailrecord.get("intisledger") == "0")
		{
			Ext.MessageBox.alert("提示", "该科目未启用分户核算!");
			return false;
		}
		if(detailrecord.get("mnydebit") != 0 && detailrecord.get("mnycredit") != 0)
		{
			Ext.MessageBox.alert("提示", "分录不能同时存在借贷金额，请填写借方金额或者贷方金额！");
			return false;
		}
		if(detailrecord.get("mnydebit") == 0 && detailrecord.get("mnycredit") == 0)
		{
			Ext.MessageBox.alert("提示", "请填写借方金额或者贷方金额!");
			return false;
		}
		if(detailrecord.get("mnydebit") == '' && detailrecord.get("mnycredit") == '')
		{
			Ext.MessageBox.alert("提示", "请填写借方金额或者贷方金额!");
			return false;
		}
		var accountledgertype = detailrecord.get("accountledgertype");
		var accountledger = detailrecord.get("accountledger");
		
		//获取科目类别标志位   0为应付、预收  1为应收、预付     再通过借贷数值判断冲销、挂账类型   
		var intacflag = detailrecord.get("intacflag");
		//借
		var mnydebit = detailrecord.get("mnydebit");
		//贷
		var mnycredit = detailrecord.get("mnycredit");
		var acflag = "未知";
		if(intacflag == 0)
		{
			if(mnydebit != "" && mnydebit > 0)
			{
				acflag = 1;
			}
			else
			{
				acflag = 2;
			}
			if(mnycredit != "" && mnycredit > 0)
			{
				acflag = 2;
			}
			else
			{
				acflag = 1;
			}
		}
		else if(intacflag == 1)
		{
			if(mnydebit != "" && mnydebit > 0)
			{
				acflag = 2;
			}
			else if(mnydebit != "" && mnydebit < 0)
			{
				acflag = 1;
			}
			if(mnycredit != "" && mnycredit > 0)
			{
				acflag = 1;
			}
			else if(mnycredit != "" && mnycredit < 0)
			{
				acflag = 2;
			}
		}
		
		if(typeof(accountledger)!= 'object')
		{
			if(accountledger != "")
			{
				accountledger = Ext.util.JSON.decode(detailrecord.get("accountledger"));
			}
		}
		
		if(typeof(accountledgertype) != 'object')
		{
			if(accountledgertype != "")
			{
				accountledgertype = Ext.util.JSON.decode(detailrecord.get("accountledgertype"));
			}
		}
		
		var ledgerparam = 
		{
			intisledger : detailrecord.get("intisledger"),
			accountledgertype : accountledgertype,
			accountledger : accountledger,
			detailrecord : detailrecord,
			vouchergrid : this,
			isView : this.isView,
			//新增标志位，只有经过了凭证的新增以及修改操作，分户组件有核销按钮
			isOffset : true,
			isOpenVoucher : this.isOpenVoucher,
			acflag : acflag
		};
		
		var ledgerinfowin = new gl.vouchermanager.vouchermake.ledgerinfo(ledgerparam);
		
		ledgerinfowin.show();
		
		var sheetnum = ledgerparam.accountledgertype.length;
		
		ledgerinfowin.pnlDetail.setLabMoney();
		
		for(var i = sheetnum - 1 ; i >= 0; i --)
        {
			var sheetId = "gl_ledger_" + i;
			ledgerinfowin.tabCommon.groupTabs.setActiveTab(i);
			Ext.getCmp(sheetId).getStore().loadData(ledgerparam.accountledger[i]);
        }
	},
	//新增
	//往来核销按钮 处理过程
	showacwin : function ()
	{
		//获取获得缓存的记录数目
		var voucherline = Ext.getCmp("vouchergriddetail").getStore().getCount();
		if(voucherline < 1)
		{
			Ext.MessageBox.alert("提示", "请填写凭证分录!");
			return false;
		}
		//返回被第一条被选中的记录
		var detailrecord = Ext.getCmp("vouchergriddetail").getSelectionModel().getSelected();
		if(detailrecord == null)
		{
			Ext.MessageBox.alert("提示", "请选择一条分录！");
			return false;
		}
		if(detailrecord.getXyValue("uqaccountid") == "")
		{
			Ext.MessageBox.alert("提示", "请选择科目!");
			return false;
		}
		if(detailrecord.get("intisac") == "")
		{
			this.getAccountAC(detailrecord,detailrecord);
		}
		if(detailrecord.get("intisac") == "0")
		{
			Ext.MessageBox.alert("提示", "该科目不是往来科目!");
			return false;
		}
		if(detailrecord.get("intisledger") == "1")
		{
			Ext.MessageBox.alert("提示", "该科目存在分户核算，请在分户界面进行往来核销!");
			return false;
		}
		if(detailrecord.get("mnydebit") != 0 && detailrecord.get("mnycredit") != 0)
		{
			Ext.MessageBox.alert("提示", "分录不能同时存在借贷金额，请填写借方金额或者贷方金额！");
			return false;
		}
		if(detailrecord.get("mnydebit") == 0 && detailrecord.get("mnycredit") == 0)
		{
			Ext.MessageBox.alert("提示", "请填写借方金额或者贷方金额!");
			return false;
		}
		
		if(detailrecord.get("mnydebit") == '' && detailrecord.get("mnycredit") == '')
		{
			Ext.MessageBox.alert("提示", "请填写借方金额或者贷方金额!");
			return false;
		}
		var accountledgertype = detailrecord.get("accountledgertype");
		var accountledger = detailrecord.get("accountledger");
		
		//获取科目类别标志位   0为应付、预收  1为应收、预付     再通过借贷数值判断冲销、挂账类型   
		var intacflag = detailrecord.get("intacflag");
		//借
		var mnydebit = detailrecord.get("mnydebit");
		//贷
		var mnycredit = detailrecord.get("mnycredit");
		//冲销为1  挂账为2
		var acflag = 0;
		if(intacflag == 0)
		{
			if(mnydebit != "" && mnydebit > 0)
			{
				acflag = 1;
			}
			else if(mnydebit != "" && mnydebit < 0)
			{
				acflag = 2;
			}
			if(mnycredit != "" && mnycredit > 0)
			{
				acflag = 2;
			}
			else if(mnycredit != "" && mnycredit < 0)
			{
				acflag = 1;
			}
		}
		else if(intacflag == 1)
		{
			if(mnydebit != "" && mnydebit > 0)
			{
				acflag = 2;
			}
			else if(mnydebit != "" && mnydebit < 0)
			{
				acflag = 1;
			}
			if(mnycredit != "" && mnycredit > 0)
			{
				acflag = 1;
			}
			else if(mnycredit != "" && mnycredit < 0)
			{
				acflag = 2;
			}
		}
		if(typeof(accountledger)!= 'object')
		{
			if(accountledgertype != "" && accountledger != "")
			{
				accountledgertype = Ext.util.JSON.decode(detailrecord.get("accountledgertype"));
				accountledger = Ext.util.JSON.decode(detailrecord.get("accountledger"));
			}
		}
		var winType = "";
		if(acflag == 1)
		{
			winType = "offset"
			detailrecord.set("inttype",1);
		}
		else if(acflag == 2)
		{
			winType = "onaccount"
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
		detailrecord.set("remainmoney",remainmoney);
		detailrecord.set("offsetmoney",remainmoney);
		detailrecord.set("yetmoney",0);
		
		var noledgerac = detailrecord.get('noledgerac');
		if(noledgerac != "" && noledgerac != "\"\"" && noledgerac != null )
		{
			if(typeof(noledgerac)!= 'object')
			{
				noledgerac = Ext.util.JSON.decode(noledgerac);
			}
//			console.log(noledgerac.mainData);
			var acremainmoney = noledgerac.mainData.remainmoney;
			var acyetmoney = noledgerac.mainData.yetmoney;
			
			if(detailrecord.data.hasOwnProperty("moneytype"))
			{
				//借贷方向相同
				if(moneyType == detailrecord.get('moneytype'))
				{
					if(remainmoney * (acremainmoney * 1 + acyetmoney) < 0)
					{
						noledgerac.mainData.offsetmoney = remainmoney;
						noledgerac.mainData.remainmoney = remainmoney;
						detailrecord.set("noledgerac", noledgerac);
					}
					else
					{
						noledgerac.mainData.offsetmoney = remainmoney;
						noledgerac.mainData.remainmoney = (remainmoney - acyetmoney).toFixed(2);
						detailrecord.set("noledgerac", noledgerac);
					}
				}
				
				//借贷方向不同
				if(moneyType != detailrecord.get('moneytype'))
				{
					if((0 - remainmoney) * (acremainmoney * 1 + acyetmoney) < 0)
					{
						noledgerac.mainData.remainmoney = remainmoney;
						detailrecord.set("noledgerac", noledgerac);
					}
					else
					{
						noledgerac.mainData.offsetmoney = remainmoney;
						noledgerac.mainData.remainmoney = remainmoney + acyetmoney;
						noledgerac.mainData.money = 0 - noledgerac.mainData.money;
						noledgerac.mainData.yetmoney = 0 - acyetmoney;
						detailrecord.set("noledgerac", noledgerac);
					}
				}
			}
			//凭证保存后，页面关闭，然后重新修改凭证，通过在mainData里新增的一个字段，来判断借贷方向
			else if(noledgerac.mainData.hasOwnProperty("moneytype"))
			{
				//借贷方向相同
				if(moneyType == noledgerac.mainData.moneytype)
				{
					if(remainmoney * (acremainmoney * 1 + acyetmoney) < 0)
					{
						noledgerac.mainData.offsetmoney = remainmoney;
						noledgerac.mainData.remainmoney = remainmoney;
						detailrecord.set("noledgerac", noledgerac);
					}
					else
					{
						noledgerac.mainData.offsetmoney = remainmoney;
						noledgerac.mainData.remainmoney = (remainmoney - acyetmoney).toFixed(2);
						detailrecord.set("noledgerac", noledgerac);
					}
				}
				
				//借贷方向不同
				if(moneyType != noledgerac.mainData.moneytype)
				{
					if((0 - remainmoney) * (acremainmoney * 1 + acyetmoney) < 0)
					{
						noledgerac.mainData.remainmoney = remainmoney;
						detailrecord.set("noledgerac", noledgerac);
					}
					else
					{
						noledgerac.mainData.offsetmoney = remainmoney;
						noledgerac.mainData.remainmoney = remainmoney + acyetmoney;
						noledgerac.mainData.money = 0 - noledgerac.mainData.money;
						noledgerac.mainData.yetmoney = 0 - acyetmoney;
						detailrecord.set("noledgerac", noledgerac);
					}
				}
			}
		}
		
		//点击了往来核销按钮后,把下面三个变量的值复原
		var accountCode = detailrecord.get("accountcode");
		//截取accountcode获取前面的数字编号部分
		accountCode = accountCode.substring(1,accountCode.indexOf("]"));
		for(var i = 0 ; i < this.allChangeArray.length ; i++) 
		{
			if(this.allChangeArray[i] == accountCode) 
			{
				if(1 == this.allChangeArray.length)
				{
					this.allChangeName = this.allChangeName.replace(this.allChangeArray[i],"");
					Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allChangeName = this.allChangeName;
				}
				else if(i == 0)
				{
					this.allChangeName = this.allChangeName.replace(this.allChangeArray[i] + ",","");
					Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allChangeName = this.allChangeName;
				}
				else
				{
					this.allChangeName = this.allChangeName.replace(","+this.allChangeArray[i],"");
					Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allChangeName = this.allChangeName;
				}
				this.iChange = this.iChange - 1;
				this.allChangeArray.splice(i,1);
			} 
		}
		if(this.allChangeArray.length == 0 || this.allChangeArray == "")
		{
			this.allChangeName = '';
			this.iChange = 0;
			Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allChangeName = this.allChangeName;
			Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").isChangeMoney = false;
		}
		
		//新增  判断是借还是贷
		if(detailrecord.get("mnydebit") != 0 && detailrecord.get("mnydebit") != null && detailrecord.get("mnydebit") != undefined)
		{
			detailrecord.set("moneytype", "mnydebit");
		}
		if(detailrecord.get("mnycredit") != 0 && detailrecord.get("mnycredit") != null && detailrecord.get("mnycredit") != undefined)
		{
			detailrecord.set("moneytype", "mnycredit");
		}
		
		var win = new gl.offsetmanager.currentoffset.manualmachewin
		(
            {
                winType : winType,
                selectInfo : detailrecord,
                intisvoucher : true,
                isOpenVoucher : this.isOpenVoucher,
                vouchergrid : this
            }
        );
//		console.log(detailrecord);
//		win.setMainData();
        win.show();
	},
	getCommitData : function ()
	{
		//提交明细数据
		var detailData = new Array();
		for (var i = 0; i < this.getStore().getCount(); i++)
		{
			var storeinfo = this.getStore().getAt(i);
			var mnydebit = 0;
			var mnycredit = 0;
			if(storeinfo.get("mnydebit") == '' || storeinfo.get("mnydebit") == null)
			{
				mnydebit = 0;
			}
			else
			{
				mnydebit = storeinfo.get("mnydebit");
			}
			if(storeinfo.get("mnycredit") == '' || storeinfo.get("mnycredit") == null)
			{
				mnycredit = 0;
			}
			else
			{
				mnycredit = storeinfo.get("mnycredit");
			}
			
			var noledgeracs = '';
			if(storeinfo.get("noledgerac") != '')
			{
				if(typeof(storeinfo.get("noledgerac")) == "object")
				{
					noledgeracs = storeinfo.get("noledgerac");
				}
				else
				{
					noledgeracs = Ext.util.JSON.decode(storeinfo.get("noledgerac"));
				}
				if(mnydebit != 0 && mnydebit != null && mnydebit != undefined)
				{
					noledgeracs.mainData.moneytype = "mnydebit";
				}
				if(mnycredit != 0 && mnycredit != null && mnycredit != undefined)
				{
					noledgeracs.mainData.moneytype = "mnycredit";
				}
			}
			
			var accountledgertype = '';
			if(storeinfo.get("accountledgertype") != '')
			{
				if(typeof(storeinfo.get("accountledgertype")) == "object")
				{
					accountledgertype = storeinfo.get("accountledgertype");
				}
				else
				{
					accountledgertype = Ext.util.JSON.decode(storeinfo.get("accountledgertype"));
				}
			}
			var accountledger = '';
			if(storeinfo.get("accountledger") != '')
			{
				if(typeof(storeinfo.get("accountledger")) == "object")
				{
					accountledger = storeinfo.get("accountledger");
				}
				else
				{
					accountledger = Ext.util.JSON.decode(storeinfo.get("accountledger"));
				}
			}
			var obj = 
			{
				uqvoucherdetailid : storeinfo.get("voucherdetailid"),
				uqvoucherid : storeinfo.get("voucherid"),
				intseq : storeinfo.get("intseq"),
				varabstract : storeinfo.get("varabstract"),
				uqaccountid : storeinfo.getXyValue("uqaccountid"),
				mnydebit : mnydebit+"",
				mnycredit : mnycredit+"",
				accountledgertype : accountledgertype,
				accountledger : accountledger,
				noledgerac : noledgeracs
			};
			detailData[i] = obj;
		}
		return detailData;
	},
	validate : function ()
	{
		//1.凭证分录检查：至少两条分录
		var voucherline = this.getStore().getCount();
		if(voucherline < 2)
		{
			Ext.MessageBox.alert("提示", "凭证分录至少两条!");
			return false;
		}
		
		//2.不允许单边凭证出现
		var mdebit = 0; 
		var mcredit = 0;
		
		//3.任何一条分录金额不能为0  科目必输，摘要必输
		for(var i = 0; i < this.getStore().getCount(); i++)
		{
			var storeinfo = this.getStore().getAt(i);
			
			if(storeinfo.get("varabstract") == "")
			{
				Ext.MessageBox.alert("提示", "分录" + ( i + 1 ) +"请填写摘要!");
				return false;
			}
			
			if(storeinfo.getXyValue("uqaccountid") == "")
			{
				Ext.MessageBox.alert("提示", "分录" + ( i + 1 ) +"请选择科目!");
				return false;
			}
			
			if(storeinfo.get("mnydebit") == 0 && storeinfo.get("mnycredit") == 0)
			{
				Ext.MessageBox.alert("提示", "分录" + ( i + 1 ) +"请填写借方金额或者贷方金额!");
				return false;
			}
			
			if(storeinfo.get("mnydebit") == '' && storeinfo.get("mnycredit") == '')
			{
				Ext.MessageBox.alert("提示", "分录" + ( i + 1 ) +"请填写借方金额或者贷方金额!");
				return false;
			}
			
			if(storeinfo.get("mnydebit") != 0 && storeinfo.get("mnycredit") != 0)
			{
				Ext.MessageBox.alert("提示", "分录" + ( i + 1 ) +"行分录不能同时存在借贷金额，请填写借方金额或者贷方金额！");
				return false;
			}
			
			if (storeinfo.get("mnydebit") != 0)
			{
				mdebit = mdebit + 1;
			}
			if (storeinfo.get("mnycredit") != 0)
			{
				mcredit = mcredit + 1;
			}
			
		}
		
		if(mdebit == 0 || mcredit == 0)
		{
			Ext.MessageBox.alert("提示", "不能是单边凭证！");
			return false;
		}
		//4.借方总额必须等于贷方总额

		return true;
	},
	getSelectedIndex : function () 
	{
		var record = this.getSelectionModel().getSelected();
		if(record != null) 
		{
		    return this.getStore().indexOf(record);	
		}
		return -1;
	},
	accountcomafterset : function(oldv, newv)
    {
		//带出科目是否需要分户和分户的类别和明细
    	this.stopEditing();
    	var sm = this.getSelectionModel();
		var record = sm.getSelected();
		
		Ext.Ajax.request (
		{
			url : 'vouchermanager/voucherdetail/ledgerinfo',
			params : 
			{
				uqaccountid : newv.uqaccountid
			},
			success : function(response, options) 
			{
				var respText = Ext.util.JSON.decode(response.responseText);
				if(respText.success == true)
				{
					var sm = this.getSelectionModel();
	        		var record = sm.getSelected();
	        		record.beginEdit();
	        		
	        		record.set("intisledger",respText.intisledger);
	        		record.set("accountledgertype",Ext.util.JSON.encode(respText.accountledgertype));
	        		record.set("accountledger",Ext.util.JSON.encode(respText.accountledger));
	        		record.set("noledgerac","");
	        		record.commit();
	        		record.endEdit();
				} 
				else 
				{
					Ext.MessageBox.alert('警告',respText.msg);
				}
			}.createDelegate(this),
			failure : function(response, options)
			{
				Ext.MessageBox.alert('警告','失败');
			}
	    });
		
		
	},
	getAccountAC : function(oldv, newv)
	{
		var uqaccountid = null;
		if(newv.uqaccountid == undefined)
		{
			uqaccountid = newv.data.uqaccountid.id
		}
		else
		{
			uqaccountid = newv.uqaccountid
		}
		//检测科目是否符合电信核销科目
		//判别冲销挂账标志位
		Ext.Ajax.request (
		{
			url : 'vouchermanager/voucherdetail/acinfo',
			params : 
			{
				uqaccountid : uqaccountid
			},
			success : function(response, options) 
			{
				var respText = Ext.util.JSON.decode(response.responseText);
				if(respText.success == true)
				{
					var sm = this.getSelectionModel();
	        		var record = sm.getSelected();
	        		
	        		record.beginEdit();
	        		var intacflag = 2;
	        		if(newv.uqtypeid == "应收" || newv.uqtypeid == "预付")
	        		{
	        			intacflag = 1;
	        		}
	        		else if(newv.uqtypeid == "应付" || newv.uqtypeid == "预收")
	        		{
	        			intacflag = 0;
	        		}
	        		//凭证修改
	        		if(intacflag == 2)
	        		{
	        			intacflag = respText.intacflag;
	        		}
	        		record.set("intisac",respText.intisac);
	        		record.set("intacflag",intacflag);
	        		record.commit();
	        		record.endEdit();
				} 
				else 
				{
					Ext.MessageBox.alert('警告',respText.msg);
				}
			}.createDelegate(this),
			failure : function(response, options)
			{
				Ext.MessageBox.alert('警告','失败.');
			}
		});
	},
	getACinfo : function () 
	{
		var detailrecord = Ext.getCmp("vouchergriddetail").getSelectionModel().getSelected();
		if(detailrecord != undefined)
		{
			if(detailrecord.get("intisac") == "")
			{
				this.getAccountAC(detailrecord,detailrecord);
			}
		}
	},
	//新增函数，在打开了人工匹配页面后，重新判断能否冲销
	reJudgeOffset : function()
	{
		var detailrecord = Ext.getCmp("vouchergriddetail").getSelectionModel().getSelected();
		
		var accountCode = detailrecord.get("accountcode");
		//截取accountcode获取前面的数字编号部分
		accountCode = accountCode.substring(1,accountCode.indexOf("]"));
		for(var i = 0 ; i < this.allOffsetArray.length ; i++) 
		{
			if(this.allOffsetArray[i] == accountCode) 
			{
				if(1 == this.allOffsetArray.length)
				{
					this.allOffsetName = this.allOffsetName.replace(this.allOffsetArray[i],"");
					Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allOffsetName = this.allOffsetName;
				}
				else if(i == 0)
				{
					this.allOffsetName = this.allOffsetName.replace(this.allOffsetArray[i] + ",","");
					Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allOffsetName = this.allOffsetName;
				}
				else
				{
					this.allOffsetName = this.allOffsetName.replace(","+this.allOffsetArray[i],"");
					Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allOffsetName = this.allOffsetName;
				}
				this.iOffset = this.iOffset - 1;
				this.allOffsetArray.splice(i,1);
			} 
		}
		if(this.allOffsetArray.length == 0 || this.allOffsetArray == "")
		{
			this.allOffsetName = '';
			this.iOffset = 0;
			Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").allOffsetName = this.allOffsetName;
			Ext.getCmp("gl.vouchermanager.vouchermake.vouchermain").isCanOffset = true;
		}
	}
});