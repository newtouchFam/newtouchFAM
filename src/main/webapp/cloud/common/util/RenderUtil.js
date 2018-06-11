/**
 * Render工具类
 */
ssc.common.RenderUtil = {};

/**
 * 缩写定义
 */
RenderUtil = ssc.common.RenderUtil;

/**
 * 启用停用状态Render
 */
ssc.common.RenderUtil.EnableStatus = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "启用" : "停用");
};

/**
 * 启用停用状态Render
 * 停用为红色
 */
ssc.common.RenderUtil.EnableStatus_Color = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "启用" : "<font color='red'>停用</font>");
};
/**
 * 启用停用状态Render
 * 强调启用，隐藏停用
 */
ssc.common.RenderUtil.EnableStatus_FocusEnable = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "启用" : "");
};
/**
 * 启用停用状态Render
 * 强调停用，隐藏启用
 */
ssc.common.RenderUtil.EnableStatus_FocusDisable = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "" : "停用");
};

/**
 * 是否Render
 */
ssc.common.RenderUtil.YesOrNo = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "是" : "否");
};
/**
 * 是否Render
 * 强调是，隐藏否
 */
ssc.common.RenderUtil.YesOrNo_FocusYes = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "是" : "");
};
/**
 * 是否Render
 * 强调否，隐藏是
 */
ssc.common.RenderUtil.YesOrNo_FocusNo = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "" : "否");
};
/**
 * 是否Render
 * 是为红色
 */
ssc.common.RenderUtil.YesOrNo_RedYes = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "<font color='red'>是</font>" : "否");
};
/**
 * 是否Render
 * 否为红色
 */
ssc.common.RenderUtil.YesOrNo_RedNo = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "是" : "<font color='red'>否</font>");
};
/**
 * 是否Render
 * 是为红色，隐藏否
 */
ssc.common.RenderUtil.YesOrNo_FocusRedYes = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "<font color='red'>是</font>" : "");
};
/**
 * 是否Render
 * 否为红色，隐藏是
 */
ssc.common.RenderUtil.YesOrNo_FocusRedNo = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "" : "<font color='red'>否</font>");
};

/**
 * 开启关闭
 */
ssc.common.RenderUtil.OpenClose = function(value, metadata, record, rowindex, colindex, store)
{
	return ssc.common.RenderUtil.MapRender(value, RenderMapData.OpenClose);
};
ssc.common.RenderUtil.OpenClose_ColorOpen = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "<font color='red'>开启</font>" : "关闭");
};
ssc.common.RenderUtil.OpenClose_ColorClose = function(value, metadata, record, rowindex, colindex, store)
{
	return (value == "1" ? "开启" : "<font color='red'>关闭</font>");
};

/**
 * 超链接格式，支持：
 * abcdef
 * 1.23
 * "1.23"
 */
ssc.common.RenderUtil.RenderURLStyle = function(value)
{
	var blConvert = false;
	
	if (typeof(value) === "string")
	{
		if (ssc.common.NumberUtil.isNumber(value))
		{
			blConvert = true;
		}
		else
		{
			blConvert = false;
		}
	}
	else if (typeof(value) === "number")
	{
		blConvert = true;
	}
	else
	{
		return value;
	}
	
	if (blConvert)
	{
		return ssc.common.StringUtil.setURLStyle(Freesky.Common.XyFormat.cnMoney(value));
	}
	else
	{
		return ssc.common.StringUtil.setURLStyle(value);
	}
};

/**
 * 超链接格式，支持：
 * abcdef
 * 1.23
 * "1.23"
 * 容错，其他情况显示为空
 */
ssc.common.RenderUtil.RenderURLStyle_NoError = function(value)
{
	var blConvert = false;
	
	if (typeof(value) === "string")
	{
		if (ssc.common.NumberUtil.isNumber(value))
		{
			blConvert = true;
		}
		else
		{
			blConvert = false;
		}
	}
	else if (typeof(value) === "number")
	{
		blConvert = true;
	}
	else
	{
		return "0";
	}
	
	if (blConvert)
	{
		return ssc.common.StringUtil.setURLStyle(ssc.common.FormatUtil.MoneyFormat(value));
	}
	else
	{
		return ssc.common.StringUtil.setURLStyle(value);
	}
};
/**
 * 金额格式，字体大小13px：
 * 1.23
 * "1.23"
 */
ssc.common.RenderUtil.RenderMoney_ThirteenFont = function(value)
{
	return ssc.common.FormatUtil.FontSizeMoneyFormat(value, 13);
};

/**
 * 百分比Render
 * 格式化字符串，保留两位小数，多余位数四舍五入，缺少位数补0
 * 针对已经除以100的小数，ssc.common.RenderUtil.Percent(0.8) = 80%
 */
ssc.common.RenderUtil.Percent = function(value)
{
	var v = ssc.common.FormatUtil.Number_Money(value * 100, 2);
	
	return v + "%";
};
/**
 * 百分比Render
 * 格式化字符串，保留两位小数，多余位数四舍五入，缺少位数补0
 * 针对未除以100的数，ssc.common.RenderUtil.Percent100(80) = 80%
 */
ssc.common.RenderUtil.Percent100 = function(value)
{
	var v = ssc.common.FormatUtil.Number_Money(value, 2);
	
	return v + "%";
};

/**
 * 字符串保留空格
 */
ssc.common.RenderUtil.StringWithBlank = function(value)
{
	return value.replace(" ", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
};

/**
 * 根据render map data，进行render
 */
ssc.common.RenderUtil.MapRender = function(value, rmd)
{
	var rm = new Map();
	rm.putAll(rmd);

	var retValue = rm.get(value);
	if (ssc.common.StringUtil.isNull(retValue))
	{
		return "";
	}
	else
	{
		return retValue;
	}
};

/**
 * render map data
 * 显示render数据map
 */
RenderMapData = {};
RenderMapData.Status = [ [ 0, "无效" ], [ 1, "有效" ] ]; 
RenderMapData.Enable = [ [ 0, "停用" ], [ 1, "启用" ] ];
RenderMapData.YesNo = [ [ 0, "否" ], [ 1, "是" ] ];
RenderMapData.OpenClose = [ [ 0, "关闭" ], [ 1, "开启" ] ];
RenderMapData.Month = [ [ 1, "1月份" ], [ 2, "2月份" ], [ 3, "3月份" ], [ 4, "4月份" ], [ 5, "5月份" ], [ 6, "6月份" ],
                        [ 7, "7月份" ], [ 8, "8月份" ], [ 9, "9月份" ], [ 10, "10月份" ], [ 11, "11月份" ], [ 12, "12月份" ] ];

/**
 * SSC RenderMapData
 */
RenderMapData.SSC = {};
RenderMapData.SSC.TacheType = [ [ 0, "未定义" ], [ 1, "扫描" ], [ 2, "制证" ], [ 3, "复核" ], [ 4, "出纳" ] ];
RenderMapData.SSC.RuleType = [ [ 0, "配置数据" ], [ 1, "自定义接口" ] ];
RenderMapData.SSC.AssignMode = [ [ 0, "待办工作量平衡" ], [ 1, "总工作量平衡" ] ];
RenderMapData.SSC.AssignType = [ [ 0, "自动分配" ], [ 1, "定时分配" ], [ 2, "组长手动分配" ] ];
RenderMapData.SSC.AgentType = [ [ 0, "未代理" ], [ 1, "组内代理(不接收新任务)" ], [ 2, "组外代理(他人代处理)" ] ];
RenderMapData.SSC.TaskStatus = [ [ -1, "已注销" ], [ 0, "未分配" ], [ 1, "已分配" ], [ 2, "已完成" ] ];
RenderMapData.SSC.FundRespnOrgMapType = [ [ 0, "对应到部门(县公司)" ], [ 1, "对应单位(包含下属所有部门)" ] ];
RenderMapData.SSC.IfDirectType = [ [ 0, "接收反馈结果" ], [ 1, "传输数据" ] ];
RenderMapData.SSC.IfFeedbackStatus = [ [ 0, "未传输(0)" ], [ 1, "传输成功(1)" ], [-1, "传输失败(-1)"] ];
