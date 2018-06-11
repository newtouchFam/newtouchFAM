Ext.namespace("ssc.shcs.common");

ssc.shcs.common.ExpressionOperatorEnum = {};
ssc.shcs.common.ExpressionOperatorEnum.Add = "+";
ssc.shcs.common.ExpressionOperatorEnum.Sub = "-";
ssc.shcs.common.ExpressionOperatorEnum.Mul = "*";
ssc.shcs.common.ExpressionOperatorEnum.Div = "/";
ssc.shcs.common.ExpressionOperatorEnum.None = "none";

ssc.shcs.common.Expression = function(strExpression)
{
	this.expression = strExpression;
	this.blOperatorFind = false;
	this.operator = "";
	this.param1 = "";
	this.param2 = "";

	/**
	 * @private
	 */
	this.findOperator = function(operator)
	{
		var intIndex = this.expression.indexOf(operator);
		var intLastIndex = this.expression.lastIndexOf(operator);

		if (intIndex < 0 || intLastIndex < 0)
		{
			return;
		}

		if (intIndex != intLastIndex)
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[expression]参数不正确：配置值[" + this.expression + "]中找到多个[" + operator + "]运算符");

			return;
		}

		if (this.blOperatorFind)
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[expression]参数不正确：配置值[" + this.expression + "]中找到多个不同的运算符");

			return;			
		}
		this.blOperatorFind = true;

		this.operator = operator;
	};

	this.findOperator(ssc.shcs.common.ExpressionOperatorEnum.Add);
	this.findOperator(ssc.shcs.common.ExpressionOperatorEnum.Sub);
	this.findOperator(ssc.shcs.common.ExpressionOperatorEnum.Mul);
	this.findOperator(ssc.shcs.common.ExpressionOperatorEnum.Div);

	if (! this.blOperatorFind)
	{
		/* 一元运算 */
		this.operator = ssc.shcs.common.ExpressionOperatorEnum.None;

		this.param1 = this.expression.trim();
		this.param2 = "";
	}
	else
	{
		/* 二元运算 */
		var intIndexOperator = this.expression.indexOf(this.operator);
		this.param1 = this.expression.substring(0, intIndexOperator).trim();
		this.param2 = this.expression.substring(intIndexOperator + 1, this.expression.length).trim();
	}

	this.getParamValue = function(param, r)
	{
		if (ssc.common.NumberUtil.isNumber(param))
		{
			return Number(param);
		}
		else
		{
			if (ssc.common.NumberUtil.isNumber(r.get(param)))
			{
				return Number(r.get(param));
			}
			else
			{
				return 0;
			}
		}
	};

	this.createFunction = function()
	{
		if (this.operator == ssc.shcs.common.ExpressionOperatorEnum.Add)
		{
			return function(record)
			{
				return FormMoneyUtil.add(this.getParamValue(this.param1, record),
					this.getParamValue(this.param2, record));
			};
		}
		else if (this.operator == ssc.shcs.common.ExpressionOperatorEnum.Sub)
		{
			return function(record)
			{
				return FormMoneyUtil.sub(this.getParamValue(this.param1, record),
					this.getParamValue(this.param2, record));
			};
		}
		else if (this.operator == ssc.shcs.common.ExpressionOperatorEnum.Mul)
		{
			return function(record)
			{
				return FormMoneyUtil.multi(this.getParamValue(this.param1, record),
					this.getParamValue(this.param2, record));
			};
		}
		else if (this.operator == ssc.shcs.common.ExpressionOperatorEnum.Div)
		{
			return function(record)
			{
				return FormMoneyUtil.div(this.getParamValue(this.param1, record),
					this.getParamValue(this.param2, record));
			};
		}
		else if (this.operator == ssc.shcs.common.ExpressionOperatorEnum.None)
		{
			return function(record)
			{
				return this.getParamValue(this.param1, record);
			};
		}
		else
		{
			return Ext.EmptyFn;			
		}
	};
	this.createDependencies = function()
	{
		var arrayDependencies = [];
		if (this.param1 != "" && ! ssc.common.NumberUtil.isNumber(this.param1))
		{
			arrayDependencies.push(this.param1);
		}

		if (this.param2 != "" && ! ssc.common.NumberUtil.isNumber(this.param2))
		{
			arrayDependencies.push(this.param2);
		}

		return arrayDependencies;
	};
};