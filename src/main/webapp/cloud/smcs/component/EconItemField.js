Ext.namespace("ssc.smcs.component");

ssc.smcs.component.EconItemField = Ext.extend(ssc.component.BaseListField,
{
	xy_GridType : "xygrid",
	fieldLabel : "经济事项",
	emptyText : "请选择...",
	xy_WinTitle : "经济事项",
	xy_WinWidth : 500,
	xy_WinHeight : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "econitem",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_ParamJsonSerialize : false,
	xy_NewProcAction : true,
	xy_KeyField : "econitemid",
	xy_DisplayField : "econitemname",
	xy_FieldList : [ "econitemid", "econitemcode", "econitemname",
			"indexid", "indexcode", "indexname"],
	xy_ColumnConfig : [
   	{
		header : "事项名称",
		dataIndex : "econitemname",
		width : 200,
		xy_Searched : true
	},
	{
		header : "事项编码",
		dataIndex : "econitemcode",
		width : 150,
		xy_Searched : true
	},
	{
		header : "预算项目",
		dataIndex : "indexname",
		width : 150
	} ],
	getEconItemID : function()
	{
		return this.getSelectedID();
	},
	getEconItemCode : function()
	{
		return this.getSelectedAttr("econitemcode");
	},
	getEconItemName : function()
	{
		return this.getSelectedAttr("econitemname");
	},
	getIndex : function()
	{
		var index =
		{
			keyfield : "indexID",
			displayfield : "indexName",
			indexID : this.getSelectedAttr("indexid"),
			indexCode : this.getSelectedAttr("indexcode"),
			indexName : this.getSelectedAttr("indexname")
		};

		return index;
	}
});
Ext.reg("ssc.smcs.component.econitemfield", ssc.smcs.component.EconItemField);