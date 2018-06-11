Ext.namespace("ssc.component");

/**
 * 流程类型下拉框组件
 * @param
 * 	jsonCondition	无
 */
ssc.component.WFProcessTypeTreeComboBox = Ext.extend(ssc.component.BaseTreeComboBox,
{
	fieldLabel : "选择流程类型",
	emptyText : "请选择流程类型...",
	width : 200,
	listWidth : 350,
	xy_RootTitle : "选择流程类型",
	xy_AllowClear : true,
	xy_DataActionURL : "SSC/ssc_WFProcessTypeAction/tree"
});
ssc.component.WFProcessTypeComboBoxTree = ssc.component.WFProcessTypeTreeComboBox;
Ext.reg("ssc.component.wfprocesstypetreecombobox", ssc.component.WFProcessTypeTreeComboBox);
