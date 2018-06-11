Ext.namespace("bcm.component");

/**
 * 预算账期列表选择下拉框
 * 可编制账期账期
 */
bcm.component.PeriodBudgetingComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "预算账期",
	width : 200,
	xy_AllowClear : false,
	valueField : "periodID",
	displayField : "periodName",
	xy_DataActionURL : "BCM/bcm_PeriodAction!getBudgetingPeriodList.action",
	xy_StoreFields : [ "periodID", "periodCode", "periodName",
	                   "caseCode", "caseName", "year", "month",
	                   "budgetStatus", "performanceStatus" ]
});
Ext.reg("bcm.component.periodbudgetingcombobox", bcm.component.PeriodBudgetingComboBox);