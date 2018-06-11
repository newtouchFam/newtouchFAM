Ext.namespace("ssc.smcs.component")

ssc.smcs.component.CustomerField = Ext.extend(ssc.component.BaseListField,
{
	xy_GridType : "xygrid",
	fieldLabel : "客户",
	emptyText : "请选择...",
	xy_WinTitle : "客户",
	xy_WinWidth : 550,
	xy_WinHeight : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "customer",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_ParamJsonSerialize : false,
	xy_NewProcAction : true,
	xy_KeyField : "customerid",
	xy_DisplayField : "customername",
	xy_FieldList : [ "customerid", "customercode", "customername", "isrelation", "taxquality", "address" ],
	xy_ColumnConfig :[
	{
		header : "客户名称",
		dataIndex : "customername",
		width : 250,
		xy_Searched : true
	},
	{
		header : "客户编码",
		dataIndex : "customercode",
		width : 140,
		xy_Searched : true
	},
	{
		header : "纳税人资质",
		dataIndex : "taxquality",
		width : 140,
		xy_Searched : false
	},
	{
		header : "地址",
		dataIndex : "address",
		width : 140,
		xy_Searched : false
	},
	{
		header : "是否关联方",
		dataIndex : "isrelation",
		width : 70,
		align : "center",
		renderer : ssc.common.RenderUtil.YesOrNo_RedYes
	}],
	getCustomerID : function()
	{
		return this.getSelectedAttr("customerid");
	},
	getCustomerCode : function()
	{
		return this.getSelectedAttr("customercode");
	},
	getCustomerName : function()
	{
		return this.getSelectedAttr("customername");
	},
	getIsRelation : function()
	{
		if(this.getSelected())
		{
			return this.getSelectedAttr("isrelation");
		}else{
			return 0;
		}
	},
	getTaxQuality : function()
	{
		return this.getSelectedAttr("taxquality");
	},
	getAddress : function()
	{
		return this.getSelectedAttr("address");
	}
		
});

Ext.reg("ssc.smcs.component.customerfield", ssc.smcs.component.CustomerField);