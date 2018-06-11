Ext.namespace("ssc.smcs.component");

ssc.smcs.component.UserField = Ext.extend(ssc.component.BaseListField,
{
	xy_GridType : "xygrid",
	fieldLabel : "用户",
	emptyText : "请选择...",
	xy_WinTitle : "用户",
	xy_WinWidth : 550,
	xy_WinHeight : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "user",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_ParamJsonSerialize : false,
	xy_NewProcAction : true,
	xy_KeyField : "userid",
	xy_DisplayField : "username",
	xy_FieldList : [ "userid", "usercode", "username",
	                 "deptid", "deptcode", "deptname" ],
	xy_ColumnConfig : [
	{
		header : "姓名",
		dataIndex : "username",
		width : 120,
		xy_Searched : true
	},
	{
		header : "工号",
		dataIndex : "usercode",
		width : 100,
		xy_Searched : true
	},
	{
		header : "部门",
		dataIndex : "deptname",
		width : 100
	} ],
	getUserID : function()
	{
		return this.getSelectedAttr("userid");
	},
	getUserCode : function()
	{
		return this.getSelectedAttr("usercode");
	},
	getUserName : function()
	{
		return this.getSelectedAttr("username");
	}
	
	
});

Ext.reg("ssc.smcs.component.userfield", ssc.smcs.component.UserField);