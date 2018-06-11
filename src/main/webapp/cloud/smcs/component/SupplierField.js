Ext.namespace("ssc.smcs.component");

ssc.smcs.component.SupplierField = Ext.extend(ssc.component.BaseListField,
{
	xy_GridType : "xygrid",
	fieldLabel : "供应商",
	emptyText : "请选择...",
	xy_WinTitle : "供应商",
	xy_WinWidth : 550,
	xy_WinHeight : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "supplier",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_ParamJsonSerialize : false,
	xy_NewProcAction : true,
	xy_KeyField : "supplierid",
	xy_DisplayField : "suppliername",
	xy_FieldList : [ "supplierid", "suppliercode", "suppliername",
	                  "isrelation" ],
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
	} ],
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
	}
	
});

Ext.reg("ssc.smcs.component.supplierfield", ssc.smcs.component.SupplierField);