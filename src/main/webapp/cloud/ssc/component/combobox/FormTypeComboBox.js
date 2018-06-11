Ext.namespace("ssc.component");

/**
 * 表单类型下拉框组件
 * @param
 * 	jsonCondition:
 * 		formtypecode	表单类型编码，支持模糊匹配
 * 		formtypename	表单类型名称，支持模糊匹配
 * 		status			启用状态，0或1
 * 		isleaf			是否末级，0或1
 * 		level			级别
 * 		parentcode		上级编码
 */
ssc.component.FormTypeComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "表单类型",
	width : 200,
	xy_AllowClear : true,
	valueField : "formtypecode",
	displayField : "formtypename",
	xy_DataActionURL : "SSC/ssc_FormTypeAction/list",
	xy_StoreFields : [ "formtypecode", "formtypename", "status", "remark",
	                   "parentcode", "intlevel", "isleaf",
	                   "fullcode", "fullname", "wfformid" ],
   	getFormTypeCode : function()
	{
		return this.getSelectedAttr("formtypecode");
	},
	getFormTypeName : function()
	{
		return this.getSelectedAttr("formtypename");
	},
	getFormType : function()
	{
		var formtype =
		{
			formtypecode : this.getFormTypeCode(),
			formtypename : this.getFormTypeName()
		};

		return formtype;
	}
});
Ext.reg("ssc.component.formtypecombobox", ssc.component.FormTypeComboBox);