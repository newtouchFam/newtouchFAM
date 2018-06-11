Ext.namespace("ssc.component");

/**
 * 预算项目类型下拉框组件
 * @param
 * 	jsonCondition:
 * 		indextypecode	预算项目类型编码，支持模糊匹配
 * 		indextypename	预算项目类型名称，支持模糊匹配
 * 		status			状态，0或1
 */
bcm.component.IndexTypeListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "预算项目类型",
	width : 200,
	xy_AllowClear : true,
	xy_DataActionURL : "bcm/indextype/list",
	valueField : "indexTypeID",
	displayField : "indexTypeName",
	xy_StoreFields : [ "indexTypeID","indexTypeCode", "indexTypeName",
	                 "status", "remark" ]
});
Ext.reg("bcm.component.indextypelistcombobox", bcm.component.IndexTypeListComboBox);

/**
 * 已生效预算项目类型下拉框组件
 * @param
 * 	jsonCondition:
 * 		indextypecode	预算项目类型编码，支持模糊匹配
 * 		indextypename	预算项目类型名称，支持模糊匹配
 */
bcm.component.IndexTypeEnabledListComboBox = Ext.extend(bcm.component.IndexTypeListComboBox,
{
	xy_DataActionURL : "bcm/indextype/list/enabled"
});
Ext.reg("bcm.component.indextypeenabledlistcombobox", bcm.component.IndexTypeEnabledListComboBox);