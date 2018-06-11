Lang = {};

/**
 * 表单部分
 */
Lang.Form = {};

/**
 * 通用表头
 */
Lang.Form.BasePanel = {};

/**
 * 费用报账单扩展表头
 */
Lang.Form.CostBasePanel = {};
Lang.Form.CostBasePanel.AAA = "AAA";
Lang.Form.CostBasePanel.BBB = "BBB";
Lang.Form.CostBasePanel.MapData = [
{
	id : "busidate",
	fieldLabel : "业务日期"
},
{
	id : "itemid",
	xytype : "ssc.cup.component.xyitemfield",
	fieldLabel : "项目",
	title : "项目选择",
	emptyText : "请选择...",
	xy_WinTitle : "项目",
	xy_ColumnConfig :
	{
		itemcode : "项目编号",
		itemname : "项目名称"
	}
} ];

/**
 * 费用报账单业务明细
 */
Lang.Form.CostDetailPanel = {};
Lang.Form.CostDetailPanel.MapData = [
{
	id : "paymain",
	title : "支付信息&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
},
{
	id : "reimdetail",
	title : "费用明细&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
} ];
