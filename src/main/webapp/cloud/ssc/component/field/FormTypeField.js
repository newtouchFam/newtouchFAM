Ext.namespace("ssc.component");

/**
 * 表单类型列表框组件
 * @param
 * 	jsonCondition:
 * 		formtypecode	表单类型编码
 * 		formtypename	表单类型名称，支持模糊匹配
 * 		status			启用状态，0或1
 * 		isleaf			是否末级，0或1
 * 		level			级别
 * 		parentcode		上级编码
 */
ssc.component.FormTypeListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "表单类型",
	emptyText : "请选择表单类型...",
	xy_WinTitle : "选择表单类型",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_FormTypeAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "formtypecode",
	xy_DisplayField : "formtypename",
	xy_FieldList : [ "formtypecode", "formtypename", "status", "remark",
	                   "parentcode", "intlevel",
	                   "isleaf", "fullcode", "fullname", "wfformid" ],
	xy_ColumnConfig : [
	{
		header : "编码",
		dataIndex : "formtypecode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "名称",
		dataIndex : "formtypename",
		width : 150,
		xy_DefaultSearched : true
	},
	{
		header : "状态",
		dataIndex : "status",
		width : 50,
		renderer : ssc.common.RenderUtil.EnableStatus_Color
	},
	{
		header : "是否末级",
		dataIndex : "isleaf",
		width : 50,
		renderer : ssc.common.RenderUtil.YesOrNo_FocusYes
	},
	{
		header : "级别",
		dataIndex : "intlevel",
		width : 50
	},
	{
		header : "全编码",
		dataIndex : "fullcode",
		width : 150
	},
	{
		header : "全名称",
		dataIndex : "fullname",
		width : 150
	},
	{
		header : "备注",
		dataIndex : "remark",
		width : 150
	} ],
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
			keyfield : "formtypecode",
			displayfield : "formtypename",
			formtypecode : this.getFormTypeCode(),
			formtypename : this.getFormTypeName()
		};

		return formtype;
	}
});
Ext.reg("ssc.component.formtypelistfield", ssc.component.FormTypeListField);