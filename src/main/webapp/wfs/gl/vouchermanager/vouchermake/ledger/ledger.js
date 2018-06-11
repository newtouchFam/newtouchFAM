Ext.namespace('gl.vouchermanager.vouchermake');
gl.vouchermanager.vouchermake.ledge = Ext.extend(gl.vouchermanager.vouchermake.ledgertabpanelbase,
{
    id : "ledger",
    idPrefix : 'gl_ledger_',
    isView : false,
    isOpenVoucher : false,
    isOffset : false,
	groupTabs : null,	//多维goupTab
    initComponent : function()
    {
        this.createControl();
        gl.vouchermanager.vouchermake.ledge.superclass.initComponent.call(this);
        var groupIndex = 0;
        var sheetnum = this.accountledger.length;
        this.debit = this.detailrecord.get("mnydebit");
        this.credit = this.detailrecord.get("mnycredit");
        for(var i = 0; i < sheetnum; i ++)
        {
        	var sheetId = this.idPrefix + i;
            tabGroup = this.groupTabs.getItem(sheetId);
            if (tabGroup == null)
            {
                tabGroup = new gl.vouchermanager.vouchermake.ladgergroupbase({id : sheetId, isOffset : this.isOffset, isView : this.isView, isOpenVoucher : this.isOpenVoucher, debit : this.debit, credit : this.credit, acflag : this.acflag});
                tabGroup.setTitle(this.accountledger[i].varledgetypename);
                
                this.groupTabs.add(tabGroup);
                this.groupTabs.setActiveTab(groupIndex);
                
                groupIndex ++;
            }
        }
    },
    getMapTabObject : function()
    {
        if (this.mapTabObject === undefined || this.mapTabObject == null)
        {
            this.mapTabObject = new Ext.app.XyMap();
        }
        return this.mapTabObject;
    },
    createControl : function()
    {

        this.labBalance = new Ext.form.Label(
        {
            hidden : true
        });
        
        this.labTips = new Ext.form.Label(
        {
            html : "提示：请输入分户编号后回车",
            anchor : '100%' 
        });
        
        this.edtCode = new Ext.form.TextField(
        {
        	id : "edtCode",
            fieldLabel : '编号定位',
            anchor : '100%' 
        });
        
        this.edtCode.on('specialkey', function(f, e)
        {
            if (e.getKey() == e.ENTER)
            {
                this.locate();
            }
        }, this);

        this.topPnl =
        {
            layout : 'column',
            height : 30,
            border : false,
            labelAlign : 'right',
            frame : true,
            items : [{
                        columnWidth : .5,
                        layout : 'form',
                        items : [this.edtCode]
                    },
                    {
                        columnWidth : .1,
                        layout : 'form',
                        items : [this.labBalance]
                    },
                    {
                        columnWidth : .4,
                        layout : 'form',
                        bodyStyle : 'padding:6px 10px 5px 5px',
                        items : [this.labTips]
                    }]
        };

        this.groupTabs = new Ext.TabPanel(
        {
            frame : false,
            autoHeight : true
        });
        this.items = [this.topPnl, this.groupTabs];       
    },
    getStore : function()
    {
        if (this.store === undefined || this.store == null)
        {
            this.store = new Ext.data.JsonStore(
            {
                url : '',
                totalProperty : "total",
                root : "data",
                fields : ["voudetailid", "itemmoneyid", "credit", "debit",
                        "itemdetailid", "itemdetailcode", "itemdetailname",
                        "itemgroupid", "itemgroupname", "itemgroupcode", "delflag",
                        "directcost"]
            });
        }
        return this.store;
    },
    getJsonData : function()
    {
        var jsonData = new Array();

        this.groupTabs.items.each(function(item)
        {
            jsonData = jsonData.concat(item.getJsonData());
        });

        return jsonData;
    },
    updateBalanceLab : function(_This, balance)
    {
        if (balance === undefined)
        {
            balance = 0;
        }

        var detailMoney = this.debit + this.credit;
        alert(detailMoney);
        
        var tabGroup = this.groupTabs.getActiveTab();
        if (tabGroup)
        {
            var sumObj = tabGroup.grid.getSummary().getSum();
            this.commonBalance = detailMoney - sumObj.money - balance;
        }
		else
		{
			this.commonBalance = detailMoney - balance;
		}

        var balanceLab = Ext.app.XyFormat.cnMoney(this.commonBalance);

        balanceLab = String.format("差额：{0}", balanceLab);
        this.labBalance.getEl().update(balanceLab);
    },
    fillData : function(records)
    {
    	this.serverRecLen = records.length; //从服务器返回的数据组长度
    	this.currRecIndex = 0;  //当前数据序号，用于填充循环中
    	
    	records = records.concat(this.initdata);
        var groupIdLast = "";
        var tabGroup = null;
        var store = null;
        this.groupIndex = 0;
        com.freesky.em8.gl.common.chunk(records,
	        this.fillDataItem.createDelegate(this), function()
	        {
	            this.groupTabs.on("tabchange", this.on_tabPnlAction, this);
	
	            if (this.groupTabs.items.length > 1)
	            {
	                this.groupTabs.activate(0);
	            }
	            else
	            {
	                this.updateBalanceLab(this);
	            }
	            com.freesky.em8.gl.common.resume();
	        }.createDelegate(this));
    },
    fillDataItem : function()
    {
    	var sheetnum = this.accountledgertype.length;
        
        for(var i = 0; i < sheetnum; i ++)
        {
        	var sheetId = this.idPrefix + i;
            tabGroup = this.groupTabs.getItem(sheetId);
            if (tabGroup == null)
            {
                tabGroup = new gl.vouchermanager.vouchermake.ladgergroupbase({id : sheetId, isView : this.isView});
                tabGroup.setTitle(this.accountledgertype[0].varledgetypename);
                
                this.groupTabs.add(tabGroup);
                if(i == sheetnum - 1)
                {
                	this.groupTabs.setActiveTab(0);
                }
            }
        }
    },
    validate : function()
    {
        var detailMoney = this.debit + this.credit;

        var items = this.groupTabs.items;
        var length = items.length;
        for (var i = 0; i < length; i++)
        {
            if (!this.groupTabs.getItem(i).validate()) return false;
        }
        return true;
    },
    locate : function()
    {
    	var tabSheet = this.groupTabs.getActiveTab();
    	tabSheet.locateCode(Ext.getCmp("edtCode").getValue());
    },
    switchTab : function()
    {
    	var curTab = this.groupTabs.getActiveTab();
    	var index = this.groupTabs.items.items.indexOf(curTab);
    	var length = this.groupTabs.items.items.length;
    	if (index <length-1)
    	{
    		index++;
    	}
    	else
    	{
    		index = 0;
    	}
    	this.groupTabs.setActiveTab(index);
    	curTab = this.groupTabs.getActiveTab();
    	curTab.grid.focus();          	
    },
    getCommitData : function()
    {
    	var sheetnum = this.accountledgertype.length;
        var ledgerinfo = [];
        for(var i = 0; i < sheetnum; i ++)
        {
        	var sheetId = this.idPrefix + i;
        	var datajson = Ext.getCmp(sheetId).getJsonData();
        	
        	var ledgertypeid = this.accountledgertype[i].ledgetypeid;
        	var varledgetypename = this.accountledgertype[i].varledgetypename;
        	
        	var ledgertypeobj = 
        	{
        		ledgertypeid : ledgertypeid,
        		varledgetypename : varledgetypename,
        		ledgerdata : datajson
        	};
        	
        	ledgerinfo.push(ledgertypeobj);
        }
        return ledgerinfo;
    }
});