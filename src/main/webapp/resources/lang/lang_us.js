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
	fieldLabel : "business date"

},
{
	id : "itemid",
	fieldLabel : "item",
	xytype : "ssc.cup.component.xyitemfield",
	title : "select item",
	emptyText : "please select item...",
	xy_WinTitle : "item",
	xy_ColumnConfig :
	{
		itemcode : "item code",
		itemname : "item name"
	}
} ];


/**
 * 费用报账单业务明细
 */
Lang.Form.CostDetailPanel = {};
Lang.Form.CostDetailPanel.MapData = [
{
	id : "paymain",
	title : "Pay Info&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
},
{
	id : "reimdetail",
	title : "Cost Info&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
} ];

/**
 * 费用报账单业务明细
 */
Lang.Form.CostCompPanel = {};
Lang.Form.CostCompPanel.MapData = [
{
} ];
