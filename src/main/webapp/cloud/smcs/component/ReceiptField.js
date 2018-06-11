Ext.namespace("ssc.smcs.component");

ssc.smcs.component.ReceiptField = Ext.extend(ssc.component.BaseListField,
{
	xy_GridType : "xygrid",
	fieldLabel : "收货方",
	emptyText : "请选择...",
	xy_WinTitle : "收货方",
	xy_WinWidth : 550,
	xy_WinHeight : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "receipt",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_ParamJsonSerialize : false,
	xy_NewProcAction : true,
	xy_KeyField : "receiptid",
	xy_DisplayField : "receiptname",
	xy_FieldList : [ "receiptid", "receiptcode", "receiptname", "isrelation", "taxquality", "address", "contact" ],
	xy_ColumnConfig :[
	{
		header : "收货方名称",
		dataIndex : "receiptname",
		width : 250,
		xy_Searched : true
	},
	{
		header : "收货方编码",
		dataIndex : "receiptcode",
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
		header : "联系方式",
		dataIndex : "contact",
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
	getReceiptID : function()
	{
		return this.getSelectedAttr("receiptid");
	},
	getReceiptCode : function()
	{
		return this.getSelectedAttr("receiptcode");
	},
	getReceiptName : function()
	{
		return this.getSelectedAttr("receiptname");
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
	},
	getContact : function()
	{
		return this.getSelectedAttr("contact");
	}
		
});

Ext.reg("ssc.smcs.component.receiptfield", ssc.smcs.component.ReceiptField);