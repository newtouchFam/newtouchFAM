Ext.namespace("ssc.smcs.component");

ssc.smcs.component.IndexDeptField = Ext.extend(ssc.component.BaseListField,
{
	xy_GridType : "xygrid",
	fieldLabel : "预算部门",
	emptyText : "请选择...",
	xy_WinTitle : "预算部门",
	xy_WinWidth : 600,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "indexdept",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_ParamJsonSerialize : false,
	xy_KeyField : "indexdeptcode",
	xy_DisplayField : "indexdeptname",
	xy_FieldList : [ "indexdeptcode", "indexdeptname","deptfullname"],
	xy_ColumnConfig : [
	{
		header : "预算部门编码",
		dataIndex : "indexdeptcode",
		hidden : true
	},
	{
		header : "预算部门名称",
		dataIndex : "indexdeptname",
		width : 235,
		xy_Searched : true
	},
	{
		header : "预算部门全名",
		dataIndex : "deptfullname",
		width : 245
	}  ],
	getXyValue : function()
	{
		return this.getSelectedID();
	},
	setXyValue : function(data)
	{
		this.setInitValue(data[this.xy_KeyField],data[this.xy_DisplayField]);
		this.setValue(data);
	}
});

Ext.reg("ssc.smcs.component.indexdeptfield", ssc.smcs.component.IndexDeptField);