Ext.namespace("ssc.component");

/**
 * 字典信息下拉框组件
 * @param
 * 	jsonCondition:
 * 		categorytype	类型编码，必填
 * 		categorycode	编码，支持模糊匹配
 * 		categoryname	名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
ssc.component.CategoryListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "[字典信息]",
	width : 200,
	xy_AllowClear : true,
	xy_DataActionURL : "SSC/ssc_CategoryAction!getDictList.action",
	valueField : "code",
	displayField : "name",
	xy_StoreFields : [ "code", "name",
	                 "status",
	                 "categoryTypeID", "categoryTypeCode", "categoryTypeName",
	                 "intValue", "strValue", "otherValue", "varDesc" ],
	xy_Type : "",
 	getCategoryCode : function()
	{
		return this.getSelectedID();
	},
	getCategoryName : function()
	{
		return this.getSelectedAttr("name");
	},
	getCategoryTypeID : function()
	{
		return this.getSelectedAttr("categoryTypeID");
	},
	getCategoryTypeCode : function()
	{
		return this.getSelectedAttr("categoryTypeCode");
	},
	getCategoryTypeName : function()
	{
		return this.getSelectedAttr("categoryTypeName");
	}
});
Ext.reg("ssc.component.categorylistcombobox", ssc.component.CategoryListComboBox);

/**
 * 字典信息下拉框组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		categorytype	类型编码，必填
 * 		status		状态，0或1
 * 		textfield	显示字段，格式"[,categorycode,],categoryname"
 */
ssc.component.CategoryTreeComboBox = Ext.extend(ssc.component.BaseTreeComboBox,
{
	fieldLabel : "[字典信息]",
	emptyText : "请选择[字典信息]...",
	width : 200,
	listWidth : 350,
	xy_RootTitle : "选择[字典信息]",
	xy_AllowClear : true,
	xy_DataActionURL : "SSC/ssc_CategoryAction/tree",
	getCategoryCode : function()
	{
		return this.getSelectedID();
	},
	getCategoryName : function()
	{
		return this.getSelectedAttr("categoryName");
	},
	getCategoryTypeID : function()
	{
		return this.getSelectedAttr("categoryTypeID");
	},
	getCategoryTypeCode : function()
	{
		return this.getSelectedAttr("categoryTypeCode");
	},
	getCategoryTypeName : function()
	{
		return this.getSelectedAttr("categoryTypeName");
	}
});
Ext.reg("ssc.component.categorytreecombobox", ssc.component.CategoryTreeComboBox);