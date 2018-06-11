Ext.namespace("ssc.component");

/**
 * 资金年份列表选择下拉框
 * 所有已存在年份
 */
ssc.component.FundYearComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "年份",
	width : 100,
	xy_AllowClear : false,
	valueField : "fundYear",
	displayField : "fundYearName",
	xy_DataActionURL : "SSC/ssc_FundYearAction/list",
	xy_StoreFields : [ "fundYear", "fundYearName" ],
	xy_InitLoadData : true,
	xy_InitDataID : ssc.common.DateUtil.getNow().getFullYear()
});
Ext.reg("ssc.component.fundyearcombobox", ssc.component.FundYearComboBox);