Ext.namespace("ssc.smcs.component");

ssc.smcs.component.CustomerFieldByContract = Ext.extend(ssc.component.BaseListField,
{
	xy_GridType : "xygrid",
	fieldLabel : "客户",
	emptyText : "请选择...",
	xy_WinTitle : "客户",
	xy_WinWidth : 620,
	xy_WinHeight : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "customerbycontract",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_ParamJsonSerialize : false,
	xy_NewProcAction : true,
	xy_KeyField : "customerid",
	xy_DisplayField : "customername",
	xy_FieldList : [ "customerid", "customercode", "customername", "isrelation", 
	                 "customeramount","applyamount","balance" ],
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
		header : "是否关联方",
		dataIndex : "isrelation",
		width : 70,
		align : "center",
		renderer : ssc.common.RenderUtil.YesOrNo_RedYes
	},
	{
		header : "合同订单金额",
		dataIndex : "customeramount",
		width : 100,
		align : "right",
		renderer : ssc.common.RenderUtil.RenderMoney_ThirteenFont 
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
	getCustomerAmount : function()
	{
		return this.getSelectedAttr("customeramount");
	},
	getApplyAmount : function()
	{
		return this.getSelectedAttr("applyamount");
	},
	getBalance : function()
	{
		return this.getSelectedAttr("balance");
	},
	getRelation : function()
	{
		if (this.getSelectedAttr("isrelation") == 1)
		{
			return "是";
		}
		else
		{
			return "否";
		}
	}
		
});

Ext.reg("ssc.smcs.component.customerfieldbycontract", ssc.smcs.component.CustomerFieldByContract);