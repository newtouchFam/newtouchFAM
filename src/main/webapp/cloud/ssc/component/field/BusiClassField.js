Ext.namespace("ssc.component");

/**
 * 业务类型列表框组件
 * @param
 * 	jsonCondition:
 * 		busiclasscode	业务类型编码
 * 		busiclassname	业务类型名称，支持模糊匹配
 * 		status			启用状态，0或1
 * 		isleaf			是否末级，0或1
 * 		level			级别
 * 		parentcode		上级编码
 */
ssc.component.BusiClassListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "业务类型",
	emptyText : "请选择业务类型...",
	xy_WinTitle : "选择业务类型",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_BusiClassAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "busiclasscode",
	xy_DisplayField : "busiclassname",
	xy_FieldList : [ "busiclasscode", "busiclassname", "status", "remark",
	                   "parentcode", "intlevel",
	                   "isleaf", "fullcode", "fullname", "wfformid" ],
	xy_ColumnConfig : [
	{
		header : "编码",
		dataIndex : "busiclasscode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "名称",
		dataIndex : "busiclassname",
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
			keyfield : "busiclasscode",
			displayfield : "busiclassname",
			busiclasscode : this.getBusiClassCode(),
			busiclassname : this.getBusiClassName()
		};

		return busiclass;
	}
});
Ext.reg("ssc.component.busiclasslistfield", ssc.component.BusiClassListField);