Ext.namespace("bcm.component");

/**
 * 预算方案下拉框组件
 * @param
 * 	xy_InitCurrentCaseCode	是否初始化即选中默认预算方案
 * 	jsonCondition	无
 */
bcm.component.CaseListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "预算方案",
	width : 200,
	xy_AllowClear : false,
	valueField : "caseCode",
	displayField : "caseName",
	xy_InitLoadData : true,
	/* 是否初始化即选中默认预算方案 */
	xy_InitCurrentCaseCode : false,
	/* 默认预算方案编码 */
	xy_CurrentCaseCode : "",
	xy_DataActionURL : "bcm/case/list",
	xy_StoreFields : [ "caseCode", "caseName", "caseYear",
	                 "status", "isCurrent", "remark" ],
	initComponent : function()
	{
		if (this.xy_InitCurrentCaseCode == true)
		{
			this.getCurrentYear();

			this.xy_InitDataID = this.xy_CurrentCaseCode;
		}
		bcm.component.CaseListComboBox.superclass.initComponent.call(this);
	},
	getCaseCode : function()
	{
		return this.getSelectedID();
	},
	getCaseName : function()
	{
		return this.getSelectedAttr("caseName");
	},
	getCaseYear : function()
	{
		return this.getSelectedAttr("caseYear");
	},
	/**
	 * 按照年份设置选择的方案
	 */
	setYear : function(year)
	{
		this.setFieldValue("caseYear", year);
	},
	/**
	 * 获取选择方案的年份
	 */
	getYear : function()
	{
		return this.getSelectedAttr("caseYear");
	},
	getCurrentYear : function()
	{
		Ext.Ajax.request(
		{
			url : "bcm/case/getcurrentcasecode",
			method : "post",
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);

				if (data.success)
				{
					this.xy_CurrentCaseCode = data.data;
					return;
				}
				else
				{
					MsgUtil.alert(data.msg);
					return;
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	}
});
Ext.reg("bcm.component.caselistcombobox", bcm.component.CaseListComboBox);