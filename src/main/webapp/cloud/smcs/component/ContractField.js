Ext.namespace("ssc.smcs.component");

ssc.smcs.component.ContractField = Ext.extend(ssc.component.BaseListField,
{
	xy_GridType : "xygrid",
	fieldLabel : "合同信息",
	emptyText : "请选择...",
	xy_WinTitle : "合同信息",
	xy_WinWidth : 750,
	xy_WinHeight : 400,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_SQLPath : "ssc/smcs/component",
	xy_ProcFile : "contract",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_ParamJsonSerialize : false,
	xy_NewProcAction : true,
	xy_KeyField : "contractid",
	xy_DisplayField : "contractcode",
	xy_FieldList : [ "contractid", "contractcode", "contractname",
	                  "isrelation","contracttype","contractclass1",
	                  "contractclass2","begindate","amount",
	                  "formserialno","processinstid","applyamount","balance" ],
	xy_ColumnConfig : [
	{
		header : "合同名称",
		dataIndex : "contractname",
		width : 250,
		xy_Searched : true
	},
	{
		header : "合同编码",
		dataIndex : "contractcode",
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
		header : "合同类型",
		dataIndex : "contracttype",
		width : 140
	},
	{
		header : "合同大类",
		dataIndex : "contractclass1",
		width : 140
	},
	{
		header : "合同小类",
		dataIndex : "contractclass2",
		width : 140
	}],
	/**
	 * supplier
	 */
	getContractID : function()
	{
		return this.getSelectedAttr("contractid");
	},
	getContractCode : function()
	{
		return this.getSelectedAttr("contractcode");
	},
	getContractName : function()
	{
		return this.getSelectedAttr("contractname");
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
	getBeginDate : function()
	{
		return this.getSelectedAttr("begindate");
	},
	getAmount : function()
	{
		return this.getSelectedAttr("amount");
	},
	getFormSerialno : function()
	{
		return this.getSelectedAttr("formserialno");
	},
	getProcessInstID : function()
	{
		return this.getSelectedAttr("processinstid");
	},
	getApplyAmount : function()
	{
		return this.getSelectedAttr("applyamount");
	},
	getBalance : function()
	{
		return this.getSelectedAttr("balance");
	}
	
});

Ext.reg("ssc.smcs.component.contractfield", ssc.smcs.component.ContractField);