Ext.namespace("bcm.component");

bcm.component.SpecactListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "专项活动",
	emptyText : "请选择专项活动...",
	xy_WinTitle : "选择专项活动",
	xy_WinWidth : 600,
	xy_WinHeight : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "bcm/specact/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "specactID",
	xy_DisplayField : "specactName",
	xy_FieldList : [ "specactID", "specactCode", "specactName", "level", "isLeaf",
	                 "fullCode", "fullName", "isShare", "startDate", "endDate",
	                 "status", "remark", "caseCode", "caseName", "parentID", "parentCode", "parentName",
	                 "unitID", "unitCode", "unitName" ],
	xy_ColumnConfig : [
	{
		header : "编码",
		width : 100,
		dataIndex : "specactCode",
		xy_DefaultSearched : true
	},
	{
		header : "名称",
		width : 200,
		dataIndex : "specactName",
		xy_DefaultSearched : true
	},
	{
		header : "级别",
		width : 50,
		dataIndex : "level",
		hidden : true
	},
	{
		header : "末级",
		width : 50,
		dataIndex : "isLeaf",
		renderer : ssc.common.RenderUtil.YesOrNo_FocusYes,
		hidden : true
	},
	{
		header : "单位",
		width : 100,
		dataIndex : "unitName"
	},
	{
		header : "开始日期",
		width : 80,
		dataIndex : "startDate"
	},
	{
		header : "结束日期",
		width : 80,
		dataIndex : "endDate"
	},
	{
		header : "启用",
		width : 50,
		dataIndex : "status",
		renderer : ssc.common.RenderUtil.EnableStatus_Color
	},
	{
		header : "共享",
		width : 50,
		dataIndex : "isShare",
		renderer : ssc.common.RenderUtil.YesOrNo_FocusYes,
		hidden : true
	},
	{
		header : "所属方案",
		width : 100,
		dataIndex : "caseName"
	} ]
});
Ext.reg("bcm.component.specactlistfield", bcm.component.SpecactListField);
