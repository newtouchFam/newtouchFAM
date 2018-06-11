gl.vouchermanager.vouchermake.voucherCenter = Ext.extend(Ext.Panel,
{
	layout : "border",
	region : "center",
	isView : false,
	isOpenVoucher : false,
	grid : null,
	vouchertag : '',
	framevoucherid : '',
	initComponent : function () 
	{
		this.barSumLeft = new Ext.form.Label(
        {
            text : ""
        });
        this.barSumRight = new Ext.form.Label(
        {
            text : ""
        });
        this.barSum = new Ext.Panel(
        {
            layout : 'column',
            frame : true,
            height : 28,
            items : [
                    {
                        columnWidth : .5,
                        layout : 'form',
                        cls : "x-voucher-leftSum-info",
                        items : [this.barSumLeft]
                    },
                    {
                        columnWidth : .5,
                        layout : 'form',
                        cls : "x-voucher-rightSum-info",
                        items : [this.barSumRight]
                    }]
        });
        
        this.grid = new gl.vouchermanager.vouchermake.voucherdetail({centerinfo : this, isView : this.isView, isOpenVoucher : this.isOpenVoucher, framevoucherid : this.framevoucherid, vouchertag : this.vouchertag});
        
        this.grid.getStore().on("update", this.storeUpdate, this);
        this.grid.getStore().on("load", this.loaded, this);
        
        this.items = [this.grid,
                      {
                          region : "south",
                          height : 28,
                          items : [this.barSum]
                      }];
        
		gl.vouchermanager.vouchermake.voucherCenter.superclass.initComponent.call(this);
	},
	storeUpdate : function ()
	{
		this.updateSumLable();
	},
	loaded : function(store, records, options)
	{
		this.debitSum = Ext.getCmp("mnydebitsum").getValue();
        this.creditSum = Ext.getCmp("mnycreditsum").getValue();

        var debit = store.sum("mnydebit");
        var credit = store.sum("mnycredit");
        this.initCurrPageSum =
        {
            debit : debit,
            credit : credit
        };

        this.updateSumLable(this.debitSum, this.creditSum);
	},
	updateSumLable : function(debitSum, creditSum)
    {
        if (debitSum === undefined)
        {
        	if(this.debitSum === undefined)
        	{
        		debitSum = 0 - this.getInitCurrPageSum().debit
                + this.getCurrPageSum().debit;       		
        	}
        	else
        	{
        		debitSum = this.debitSum - this.getInitCurrPageSum().debit
                + this.getCurrPageSum().debit;        	
        	}
        }
        if (creditSum === undefined)
        {
        	if(this.creditSum === undefined)
        	{
        		creditSum = 0 - this.getInitCurrPageSum().credit
                + this.getCurrPageSum().credit;        		
        	}
        	else
        	{
        		creditSum = this.creditSum - this.getInitCurrPageSum().credit
                + this.getCurrPageSum().credit;      		
        	}
        }
        //2018-3-7 金额小数位数不正确修改
        debitSum = debitSum.toFixed(2);
        creditSum = creditSum.toFixed(2);
        var sum = Math.abs(debitSum);
        var uppercaseMoney = convertCurrency(sum);
        uppercaseMoney = debitSum < 0
                ? "<font color=red>" + uppercaseMoney + "</font>"
                : uppercaseMoney;

        var debitLab = Ext.app.XyFormat.cnMoney(debitSum);
        var creditLab = Ext.app.XyFormat.cnMoney(creditSum);;

        var note = "大写金额：{0}";
        var updateLeftNote = String.format(note, uppercaseMoney);
        this.barSumLeft.getEl().update(updateLeftNote);

        var note = "合计：{0}&nbsp;|&nbsp;{1}";
        var updateRightNote = String.format(note, debitLab, creditLab);
        this.barSumRight.getEl().update(updateRightNote);
    },
    getCurrPageSum : function()
    {
        var debit = this.grid.getStore().sum("mnydebit");
        var credit = this.grid.getStore().sum("mnycredit");

        var obj =
        {
            debit : debit,
            credit : credit
        };
        return obj;
    },
    getInitCurrPageSum : function()
    {
        if (this.initCurrPageSum === undefined)
        {
            this.initCurrPageSum =
            {
                debit : 0,
                credit : 0
            };
        }
        return this.initCurrPageSum;
    },
	saveButtonHandler : function ()
	{
		//1.调用每个面板的validate
		
		//2.调用每个面版的getCommitData
		
		//3.ajax调用提交数据
		
	}
});