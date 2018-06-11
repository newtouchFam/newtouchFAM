Ext.namespace("ssc.component");

/**
 * 业务类型下拉框组件
 * @param
 * 	jsonCondition:
 * 		busiclasscode	业务类型编码
 * 		busiclassname	业务类型名称，支持模糊匹配
 * 		status			启用状态，0或1
 * 		isleaf			是否末级，0或1
 * 		level			级别
 * 		parentcode		上级编码
 */
ssc.component.BusiClassComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "业务类型",
	width : 200,
	xy_AllowClear : true,
	valueField : "busiclasscode",
	displayField : "busiclassname",
	xy_DataActionURL : "SSC/ssc_BusiClassAction/list",
	xy_StoreFields : [ "busiclasscode", "busiclassname", "status", "remark",
	                   "parentcode", "intlevel",
	                   "isleaf", "fullcode", "fullname", "wfformid" ],
   	getBusiClassCode : function()
	{
		return this.getSelectedAttr("busiclasscode");
	},
	getBusiClassName : function()
	{
		return this.getSelectedAttr("busiclassname");
	},
	getBusiClass : function()
	{
		var busiclass =
		{
			busiclasscode : this.getBusiClassCode(),
			busiclassname : this.getBusiClassName()
		};

		return busiclass;
	}
});
Ext.reg("ssc.component.busiclasscombobox", ssc.component.BusiClassComboBox);