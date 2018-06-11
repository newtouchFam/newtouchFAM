Ext.namespace("ssc.smcs.component");

ssc.smcs.component.EconItemTypeField = Ext.extend(ssc.component.BaseListField,
{
	xy_GridType : "xygrid",
	fieldLabel : "经济事项大类",
	emptyText : "请选择...",
	xy_WinTitle : "经济事项大类",
	xy_WinWidth : 500,
	xy_WinHeight : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "econitemtype",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_ParamJsonSerialize : false,
	xy_NewProcAction : true,
	xy_KeyField : "econitemtypeid",
	xy_DisplayField : "econitemtypename",
	xy_FieldList : [ "econitemtypeid", "econitemtypecode", "econitemtypename" ],
	xy_ColumnConfig : [
   	{
		header : "事项大类名称",
		dataIndex : "econitemtypename",
		width : 200,
		xy_Searched : true
	},
	{
		header : "事项大类编码",
		dataIndex : "econitemtypecode",
		width : 150,
		xy_Searched : true
	} ],
	getEconItemTypeID : function()
	{
		return this.getSelectedID();
	},
	getEconItemTypeCode : function()
	{
		return this.getSelectedAttr("econitemtypecode");
	},
	getEconItemTypeName : function()
	{
		return this.getSelectedAttr("econitemtypename");
	}
});
Ext.reg("ssc.smcs.component.econitemtypefield", ssc.smcs.component.EconItemTypeField);