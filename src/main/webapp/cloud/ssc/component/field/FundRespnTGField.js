Ext.ns("ssc.component");

ssc.component.FundRespnListTGField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "资金责任中心",
	emptyText : "请选择资金责任中心...",
	xy_PageMode : true,
	xy_ColumnConfig : [
	{
		header : "编码",
		dataIndex : "respnCode",
		width : 80,
		sortable : true,
		xy_Searched : true
	},
	{
		header : "名称",
		dataIndex : "respnName",
		width : 150,
		sortable : true,
		xy_Searched : true
	},
	{
		header : "所属单位编码",
		dataIndex : "unitCode",
		width : 150,
		sortable : true
	},
	{
		header : "所属单位名称",
		dataIndex : "unitName",
		width : 150,
		sortable : true
	},
	{
		header : "状态",
		dataIndex : "status",
		width : 50,
		renderer : ssc.common.RenderUtil.EnableStatus_Color,
		sortable : true
	},
	{
		header : "备注",
		dataIndex : "remark",
		width : 150,
		sortable : true
	} ],
	xy_DataActionURL : "SSC/ssc_FundRespnAction/list",
	xy_FieldList : [ "respnCode", "respnName", "year", "month", "status", "remark",
	                 "unitID", "unitCode", "unitName" ],
		xy_KeyField : "respnCode",
	xy_DisplayField : "respnName",
	initComponent : function()
	{
		ssc.component.FundRespnListTGField.superclass.initComponent.call(this);
	}
});

ssc.component.FundRespnTreeTGField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "资金责任中心",
	emptyText : "请选择资金责任中心...",
	xy_RootTitle : "选择资金责任中心",
	xy_LeafOnly : true,
	xy_DataActionURL : "SSC/ssc_FundRespnAction/tree"
});