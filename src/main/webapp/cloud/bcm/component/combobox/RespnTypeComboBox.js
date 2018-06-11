Ext.namespace("bcm.component");

/**
 * 责任中心类型下拉框组件
 * @param
 * 	jsonCondition:
 * 		respntypecode	责任中心类型编码，支持模糊匹配
 * 		respntypename	责任中心类型名称，支持模糊匹配
 * 		status			状态，0或1
 */
bcm.component.RespnTypeListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "责任中心类型",
	width : 200,
	xy_AllowClear : true,
	xy_DataActionURL : "bcm/respntype/list",
	valueField : "respnTypeID",
	displayField : "respnTypeName",
	xy_StoreFields : [ "respnTypeID","respnTypeCode", "respnTypeName",
	                 "status", "remark" ]
});
Ext.reg("bcm.component.respntypelistcombobox", bcm.component.RespnTypeListComboBox);

/**
 * 已生效责任中心类型下拉框组件
 * @param
 * 	jsonCondition:
 * 		respntypecode	责任中心类型编码，支持模糊匹配
 * 		respntypename	责任中心类型名称，支持模糊匹配
 */
bcm.component.RespnTypeEnabledListComboBox = Ext.extend(bcm.component.RespnTypeListComboBox,
{
	xy_DataActionURL : "bcm/respntype/list/enabled"
});
Ext.reg("bcm.component.respntypeenabledlistcombobox", bcm.component.RespnTypeEnabledListComboBox);
