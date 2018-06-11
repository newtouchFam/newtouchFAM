Ext.namespace('gl.vouchermanager.vouchermake');
gl.vouchermanager.vouchermake.detail = Ext.extend(Ext.FormPanel, 
{
	height : 55,
	region : "north",
	frame : true,
	border : false,
	initComponent : function() 
	{
		this.createControl();
		gl.vouchermanager.vouchermake.detail.superclass.initComponent.call(this);
	},
	createControl : function() 
	{

		var money = this.detailrecord.get("mnydebit");
		var flag = "借";
		if (money == 0) 
		{
			money = this.detailrecord.get("mnycredit");
			flag = "贷";
		}
		var moneyLab = String.format("分录金额：{0}",
				Ext.app.XyFormat.cnMoney(money));

		this.labAccount = new Ext.form.Label(
		{
			text : "科目："
		});
		
		this.labAbstract = new Ext.form.Label(
		{
			text : "摘要："
		});
		
		this.labFlag = new Ext.form.Label(
		{
			text : "方向："
		});
		
		this.labMoeny = new Ext.form.Label(
		{
			html : moneyLab
		});

		var row1 = 
		{
			layout : 'column',
			border : false,
			labelAlign : 'right',
			bodyStyle : 'padding:0px 10px 5px 5px',
			items : [{
						columnWidth : 1,
						layout : 'form',
						border : false,
						items : [{
									bodyStyle : 'padding:4px 0px 0px 0px',
									items : this.labAbstract
								}]
					}]
		};
		var row2 = {
			layout : 'column',
			border : false,
			labelAlign : 'right',
			bodyStyle : 'padding:0px 10px 5px 5px',
			items : [{
						columnWidth : .5,
						layout : 'form',
						border : false,
						items : [{
									bodyStyle : 'padding:5px 0px 0px 0px',
									items : this.labAccount
								}]
					}, 
					{
						columnWidth : .15,
						layout : 'form',
						border : false,
						items : [{
									bodyStyle : 'padding:5px 0px 0px 0px',
									items : this.labFlag
								}]
					},
					{
						columnWidth : .35,
						layout : 'form',
						border : false,
						items : [{
									bodyStyle : 'padding:5px 0px 0px 0px',
									items : this.labMoeny
								}]
					}]

		};
//		var row3 = 
//		{
//			layout : 'column',
//			border : false,
//			labelAlign : 'right',
//			bodyStyle : 'padding:0px 10px 5px 5px',
//			items : [{
//						columnWidth : .7,
//						layout : 'form',
//						border : false,
//						items : [{
//									bodyStyle : 'padding:5px 0px 0px 0px',
//									items : this.labMoeny
//								}]
//					},
//					{
//						columnWidth : .3,
//						border : false
//					}]
//
//		};
		this.items = [row1, row2];
	},
	setLabMoney : function()
	{
		this.debit = this.detailrecord.get("mnydebit") || 0;
		this.credit = this.detailrecord.get("mnycredit") || 0;
		
		var flag = "借";
		if (this.debit == 0) {
			flag = "贷";
		}
		
		var moneyLab = String.format("分录金额：{0}",
				Ext.app.XyFormat.cnMoney(this.debit
						+ this.credit));

		this.labMoeny.getEl().update(moneyLab);
		this.labFlag.getEl().update("方向：" + flag);
		this.labAccount.getEl().update("科目：" + this.detailrecord.getDisplayValue("uqaccountid"));
		this.labAbstract.getEl().update("摘要：" + this.detailrecord.get("varabstract"));
	}
});
