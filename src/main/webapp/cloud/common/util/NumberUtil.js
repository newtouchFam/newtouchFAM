/**
 * number类型工具类
 */
ssc.common.NumberUtil = {};

/**
 * 缩写定义
 */
NumberUtil = ssc.common.NumberUtil;

/**
 * 判断是否为数字，支持数值类型和字符串类型
 * alert(ssc.common.NumberUtil.isNumber(1)) = true;
 * alert(ssc.common.NumberUtil.isNumber(1.34)) = true;
 * alert(ssc.common.NumberUtil.isNumber("abc")) = false;
 * alert(ssc.common.NumberUtil.isNumber("1.2abc")) = false;
 * alert(ssc.common.NumberUtil.isNumber("1.2")) = true;
 * alert(ssc.common.NumberUtil.isNumber(this)) = false;
 * alert(ssc.common.NumberUtil.isNumber(null)) = false;
 * alert(ssc.common.NumberUtil.isNumber("")) = false;
 * alert(ssc.common.NumberUtil.isNumber({})) = false;
 * alert(ssc.common.NumberUtil.isNumber(undefined)) = false;
 */
ssc.common.NumberUtil.isNumber = function(value)
{
	if (value === null)
	{
		return false;
	}

	if (value === "")
	{
		return false;
	}

	if (typeof(value) === "object")
	{
		return false;
	}
	
	return !isNaN(Number(value));
};

/**
 * 浮点数高精度加法
 * @return
 */
ssc.common.NumberUtil.add = function(arg1, arg2)
{
	var r1, r2, m;
	try
	{
		r1 = (1 * arg1).toString().split(".")[1].length;
	}
	catch (e)
	{
		r1 = 0;
	}

	try
	{
		r2 = (1 * arg2).toString().split(".")[1].length;
	}
	catch (e)
	{
		r2 = 0;
	}

	m = Math.pow(10, Math.max(r1, r2));
	return (arg1 * m + arg2 * m) / m;
};

/**
 * 浮点数高精度减法
 * @return
 */
ssc.common.NumberUtil.sub = function(arg1, arg2)
{
	return ssc.common.NumberUtil.add(arg1, -arg2);
};

/**
 * 浮点数高精度乘法
 * @return
 */
ssc.common.NumberUtil.multi = function(arg1, arg2)
{
	var m = 0;
	var s1 = (1 * arg1).toString();
	var s2 = (1 * arg2).toString();
	try
	{
		m += s1.split(".")[1].length;
	}
	catch (e)
	{
	}

	try
	{
		m += s2.split(".")[1].length;
	}
	catch (e)
	{
	}

	var ss = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
	return Math.round(ss * 100) / 100;
};

/**
 * 浮点数高精度除法
 * @return
 */
ssc.common.NumberUtil.div = function(arg1, arg2)
{
	var t1 = 0;
	var t2 = 0;
	var r1, r2;
	try
	{
		t1 = (1 * arg1).toString().split(".")[1].length;
	}
	catch (e)
	{
	}

	try
	{
		t2 = (1 * arg2).toString().split(".")[1].length;
	}
	catch (e)
	{
	}

	with (Math)
	{
		r1 = Number((1 * arg1).toString().replace(".", ""));
		r2 = Number((1 * arg2).toString().replace(".", ""));
		var ss = (r1 / r2) * pow(10, t2 - t1);
		return Math.round(ss * 100) / 100;
	}
};

/**
 * 数值保留n位小数并四舍五入
 * 如果不是合法数值，则返回0
 * value: 四舍五入前的数值
 * n: 保留小数位数
 * return: 四舍五入后的数值
 */
ssc.common.NumberUtil.toRound = function(value, n)
{
	if (! ssc.common.NumberUtil.isNumber(value))
	{
		return 0;
	}

	var v = 1;
	if (typeof(value) != "number")
	{
		v = Number(value);
	}
	else
	{
		v = value;
	}

	if (n < 0)
	{
		n = 0;
	}
	var pow = Math.pow(10, n);
	v = NumberUtil.div(Math.round(NumberUtil.multi(v, pow)), pow);

	return Number(v);
};

/**
 * 四舍五入保留2位小数
 * @return	number
 */
ssc.common.NumberUtil.toRound2 = function(value)
{
	return ssc.common.NumberUtil.toRound(value, 2);
};

/**
 * 数值精度格式化字符串，多余位数四舍五入，缺少位数补0
 */
ssc.common.NumberUtil.toFixed = function(value)
{
	return ssc.common.FormatUtil.MoneyFormat(value);
};

ssc.common.NumberUtil.toMoneyLink = function(value)
{
	var moneyString = ssc.common.FormatUtil.MoneyFormat(value);
	return "<font color=#208FFF><u>" + moneyString + "</u></font>";
/*
	if (isNaN(value)) 
	{
		return "<font color=#208FFF><u>" + "0.00" +"</u></font>";
	} 
	else 
	{
		value = (Math.round((value - 0) * 100)) / 100;
		value = (value == Math.floor(value)) ? value + ".00" : ((value * 10 == Math.floor(value
				* 10)) ? value + "0" : value);
		value = String(value);
		var ps = value.split(".");
		var whole = ps[0];
		var sub = ps[1] ? "." + ps[1] : ".00";
		var r = /(\d+)(\d{3})/;
		while (r.test(whole)) 
		{
			whole = whole.replace(r, "$1" + "," + "$2");
		}
		value = whole + sub;
		if (value.charAt(0) == "-")
		{
			return "<font color=#208FFF><u>"+"-" + value.substr(1)+"</u></font>";
		}
		return "<font color=#208FFF><u>"+"" + value+"</u></font>";
	}*/
};
