Ext.namespace("sm.component");

/**
 * 岗位field组件
 * @param
 * 	jsonCondition:
 * 		postcode	岗位编码，支持模糊匹配
 * 		postname	岗位名称，支持模糊匹配
 * 		postdesc	岗位描述，支持模糊匹配
 */
sm.component.PostListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "岗位",
	emptyText : "请选择岗位...",
	xy_WinTitle : "选择岗位",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_sm_PostAction/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "postid",
	xy_DisplayField : "postname",
	xy_FieldList : [ "postid", "postcode", "postname", "postdesc" ],
	xy_ColumnConfig : [
	{
		header : "编码",
		dataIndex : "postcode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "名称",
		dataIndex : "postname",
		width : 150,
		xy_DefaultSearched : true
	},
	{
		header : "描述",
		dataIndex : "postdesc",
		width : 150
	} ],
	getPostID : function()
	{
		return this.getSelectedID();
	},
	getPostCode : function()
	{
		return this.getSelectedAttr("postcode");
	},
	getPostName : function()
	{
		return this.getSelectedAttr("postname");
	}
});
Ext.reg("sm.component.postlistfield", sm.component.PostListField);