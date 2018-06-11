/**
 * 格式转换工具类
 */
ssc.common.FormatUtil = {};

/**
 * 缩写定义
 */
FormatUtil = ssc.common.FormatUtil;

/**
 * 数值保留n位小数并四舍五入
 * 如果不是合法数值，则返回0
 * v: 四舍五入前的数值
 * n: 保留小数位数
 * return: 四舍五入后的数值
 */
ssc.common.FormatUtil.Number_Decimal = function(v, n)
{
	return ssc.common.NumberUtil.toRound(v, n);
};
/**
 * 数值保留n位小数并四舍五入后，格式化为金额字符串，包括千分位
 * v: 四舍五入前的数值
 * n: 保留小数位数
 * return: 格式化后的字符串
 */
ssc.common.FormatUtil.Number_Money = function(v, n)
{
	if (! ssc.common.NumberUtil.isNumber(v))
	{
		return "0";
	}

	v = ssc.common.NumberUtil.toRound(v, n);

	v = String(v);
	var ps = v.split(".");
	var whole = ps[0];
	var sub = ps[1] ? "." + ps[1] + Math.pow(10, n - ps[1].length).toString().substr(1) 
			: "." + Math.pow(10, n).toString().substr(1);

	var r = /(\d+)(\d{3})/;
	while (r.test(whole))
	{
		whole = whole.replace(r, "$1" + "," + "$2");
	}
	v = whole + sub;
	if (v.charAt(0) == "-")
	{
		return "-" + v.substr(1);
	}

	return "" + v;
};

/**
 * 数值四舍五入后，按照金额格式化为字符串，包括2位小数和千分位
 * 参数支持数值和字符串
 */
ssc.common.FormatUtil.MoneyFormat = function(v)
{
	return ssc.common.FormatUtil.Number_Money(v, 2);
	/*
	if (! ssc.common.NumberUtil.isNumber(v))
	{
		return "0.00";
	}

	v = (Math.round((v - 0) * 100)) / 100;
	v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
	
	v = String(v);
	var ps = v.split(".");
	var whole = ps[0];
	var sub = ps[1] ? "." + ps[1] : ".00";
	var r = /(\d+)(\d{3})/;
	while (r.test(whole))
	{
		whole = whole.replace(r, "$1" + "," + "$2");
	}
	v = whole + sub;
	if (v.charAt(0) == "-")
	{
		return "-" + v.substr(1);
	}

	return "" + v;
	*/
};

/**
 * 金额Render，保留2位小数
 */
ssc.common.FormatUtil.Money = function(value)
{
	return ssc.common.FormatUtil.Number_Money(value, 2);
};

/**
 * 金额Render，保留4位小数
 */
ssc.common.FormatUtil.Money_4D = function(value)
{
	return ssc.common.FormatUtil.Number_Money(value, 4);
};

/**
 * 金额字体大小
 * 将金额字体设置为指定大小
 */
ssc.common.FormatUtil.FontSizeMoneyFormat = function(v, size)
{
	var value = ssc.common.FormatUtil.MoneyFormat(v);
	return "<span style='font-size:" + size + "px;'>" + value + "</span>";
};

/**
 * 金额列宽度
 * 在金额格式下，保证完整显示到千万
 */
ssc.common.FormatUtil.MoneyColumnWidth = 200;
