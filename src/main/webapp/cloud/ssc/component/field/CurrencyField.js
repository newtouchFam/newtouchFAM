Ext.namespace("ssc.component");

/**
 * 币种列表框组件
 * @param
 * 	jsonCondition:
 * 		currencycode	币种编码
 * 		currencyname	币种名称，支持模糊匹配
 * 		status			启用状态，0或1
 */
ssc.component.CurrencyListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "币种",
	emptyText : "请选择币种...",
	xy_WinTitle : "选择币种",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_CurrencyAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "currencycode",
	xy_DisplayField : "currencyname",
	xy_FieldList : [ "currencycode", "currencyname", "fullname", "fullname_eng",
	                   "status", "remark", "isdefault" ],
	xy_ColumnConfig : [
	{
		header : "编码",
		dataIndex : "currencycode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "名称",
		dataIndex : "currencyname",
		width : 150,
		xy_DefaultSearched : true
	},
	{
		header : "中文全称",
		dataIndex : "fullcode",
		width : 150
	},
	{
		header : "英文全称",
		dataIndex : "fullname",
		width : 150
	},
	{
		header : "状态",
		dataIndex : "status",
		width : 50,
		renderer : ssc.common.RenderUtil.EnableStatus_Color
	},
	{
		header : "备注",
		dataIndex : "remark",
		width : 150
	} ],
	getCurrencyCode : function()
	{
		return this.getSelectedAttr("currencycode");
	},
	getCurrencyName : function()
	{
		return this.getSelectedAttr("currencyname");
	},
	getCurrency : function()
	{
		var currency =
		{
			keyfield : "currencycode",
			displayfield : "currencyname",
			currencycode : this.getCurrencyCode(),
			currencyname : this.getCurrencyName()
		};

		return currency;
	}
});
Ext.reg("ssc.component.currencylistfield", ssc.component.CurrencyListField);