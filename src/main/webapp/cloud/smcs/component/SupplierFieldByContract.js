Ext.namespace("ssc.smcs.component");

ssc.smcs.component.SupplierFieldByContract = Ext.extend(ssc.component.BaseListField,
{
	xy_GridType : "xygrid",
	fieldLabel : "供应商",
	emptyText : "请选择...",
	xy_WinTitle : "供应商",
	xy_WinWidth : 630,
	xy_WinHeight : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "supplierbycontract",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_ParamJsonSerialize : false,
	xy_NewProcAction : true,
	xy_KeyField : "supplierid",
	xy_DisplayField : "suppliername",
	xy_FieldList : [ "supplierid", "suppliercode", "suppliername",
	                  "isrelation" ,"supplieramount","applyamount","balance"],
	xy_ColumnConfig : [
	{
		header : "供应商名称",
		dataIndex : "suppliername",
		width : 250,
		xy_Searched : true
	},
	{
		header : "供应商编码",
		dataIndex : "suppliercode",
		width : 140,
		xy_Searched : true
	},
	{
		header : "是否关联方",
		dataIndex : "isrelation",
		width : 70,
		align : "center",
		renderer : ssc.common.RenderUtil.YesOrNo_RedYes
	} ,
	{
		header : "合同订单预算额度",
		dataIndex : "supplieramount",
		width : 130,
		align : "right",
		renderer : ssc.common.RenderUtil.RenderMoney_ThirteenFont 
	}],
	/**
	 * supplier
	 */
	getSupplierID : function()
	{
		return this.getSelectedAttr("supplierid");
	},
	getSupplierCode : function()
	{
		return this.getSelectedAttr("suppliercode");
	},
	getSupplierName : function()
	{
		return this.getSelectedAttr("suppliername");
	},
	getIsRelation : function()
	{
		if (this.getSelected())
		{
			return this.getSelectedAttr("isrelation");
		}
		else
		{
			return 0;
		}
	},
	getSupplierAmount : function()
	{
		return this.getSelectedAttr("supplieramount");
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

Ext.reg("ssc.smcs.component.supplierfieldbycontract", ssc.smcs.component.SupplierFieldByContract);