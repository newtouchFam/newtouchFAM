Ext.namespace("ssc.component");

ssc.component.YearComboBox = Ext.extend(ssc.component.BaseListComboBox, 
{
	fieldLabel : "年份",
	emptyText : "请选择...",
	width : 200,
	xy_AllowClear : false,
	xy_ParamJsonSerialize : false,
	xy_DataActionURL : "ssc/year/list",
	xy_NewProcAction : true,
	valueField : "year",
	displayField : "year",
	xy_StoreFields : [ "year" ],
	xy_InitLoadData : true,
	initComponent : function()
	{
		this.xy_InitDataID = DateUtil.getCurrentYear();

		ssc.component.YearComboBox.superclass.initComponent.call(this);
	},
	getYear : function()
	{
		return this.getSelectedAttr("year");
	}
});
Ext.reg("ssc.component.yearcombobox", ssc.component.YearComboBox);