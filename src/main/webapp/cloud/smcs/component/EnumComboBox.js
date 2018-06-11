Ext.namespace("ssc.smcs.component");

ssc.component.BaseSimpleComboBox.prototype.renderer = function(v)
{
	var arry = this.xy_DataArray;
	for ( var i = 0; i < arry.length; i++)
	{
		var a = arry[i];
		var key = a[0];
		var displace = a[1];
		if (key == v)
		{
			return displace;
		}
	}
	return v;
};

ssc.smcs.component.SettleTypeComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "结算方式",
	width : 200,
	xy_DataArray : [ [ 0, "挂账" ], [ 1, "付款" ], [ 2, "计提" ], [ 3, "暂估" ] ],
	xy_InitDataID : 1,
	isWZ : function()
	{
		return (this.getKeyValue() == 0);
	},
	isPay : function()
	{
		return (this.getKeyValue() == 1);
	},
	isAccrue : function()
	{
		return (this.getKeyValue() == 2);
	},
	isEstimate : function()
	{
		return (this.getKeyValue() == 3);
	}
});
Ext.reg("ssc.smcs.component.settletypecombobox", ssc.smcs.component.SettleTypeComboBox);

ssc.smcs.component.PayObjectTypeCostComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "支付对象类型",
	width : 200,
	xy_DataArray : [ [ 0, "供应商" ], [ 2, "员工" ] ],
	xy_InitDataID : 0,
	isSupplier : function()
	{
		return (this.getKeyValue() == 0);
	},
	isStaff : function()
	{
		return (this.getKeyValue() == 2);
	}
});
Ext.reg("ssc.smcs.component.payobjecttypecostcombobox", ssc.smcs.component.PayObjectTypeCostComboBox);

ssc.smcs.component.TaxTypeComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "税种",
	width : 200,
	xy_DataArray : [ [ 0, "营业税" ], [ 1, "增值税" ], [ 2, "企业所得税[当期]" ], [ 3, "企业所得税[递延]" ], [ 6, "土地使用税" ], [ 7, "房产税" ],
			[ 8, "营业外收入税金" ] ],
	xy_InitDataID : 1
});
Ext.reg("ssc.smcs.component.taxtypecombobox", ssc.smcs.component.TaxTypeComboBox);

ssc.smcs.component.TaxFjTypeComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "附加税种",
	width : 200,
	xy_DataArray : [ [ 0, "营业税" ], [ 1, "城建税" ], [ 2, "国家教育费附加" ], [ 3, "地方教育费附加" ], [ 4, "水利建设基金" ], [ 5, "文化事业发展费" ],
			[ 6, "投资性房地产房产税" ], [ 7, "投资性房地产土地使用税" ], [ 8, "价格调节基金" ] ],
	xy_InitDataID : 1
});
Ext.reg("ssc.smcs.component.taxtypecombobox", ssc.smcs.component.TaxFjTypeComboBox);

ssc.smcs.component.TaxComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "税率",
	width : 200,
	xy_DataArray : [ [ 1, "1%" ], [ 2, "2%" ], [ 3, "3%" ], [ 5, "5%" ], [ 7, "7%" ], [ 13, "13%" ], [ 17, "17%" ] ]
});
Ext.reg("ssc.smcs.component.taxtypecombobox", ssc.smcs.component.TaxComboBox);


ssc.smcs.component.PayObjectTypeComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel : "支付对象类型",
	width : 200,
	xy_DataArray : [ [ 0, "供应商" ], [ 1, "员工" ] ],
	xy_InitDataID : 1
});
Ext.reg("ssc.smcs.component.payobjectttypecombobox", ssc.smcs.component.PayObjectTypeComboBox);

ssc.smcs.component.ReportMonthComboBox = Ext.extend(ssc.component.BaseSimpleComboBox,
{
	fieldLabel: "报表月份",
	width : 200,
	xy_DataArray : [ [ 1, "1月" ], [ 2, "2月" ], [ 3, "3月" ], [ 4, "4月" ], [ 5, "5月" ], [ 6, "6月" ], 
	                 [ 7, "7月" ], [ 8, "8月" ], [ 9, "9月" ], [ 10, "10月" ], [ 11, "11月" ], [ 12, "12月" ] ],
	xy_InitDataId : 1
});
Ext.reg("ssc.smcs.component.ReportMonthComboBox",ssc.smcs.component.ReportMonthComboBox);
