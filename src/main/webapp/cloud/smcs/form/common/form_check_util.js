Ext.namespace("ssc.smcs.form.common");

/**
 * 表单界面检查工具类
 * 基本行为模式为：检查值，有问题抛出提示信息，并返回false，由调用的表单决定是否停止或继续检查
 * 
 * 分为检查表头字段和检查表格字段值两类
 * 表头字段值的错误提示信息，包括：字段Label(不要包括*号)，以及具体错误内容
 * 表格字段值的错误提示信息，包括：表格名称、行号、列头(不要包括*号)，以及具体错误内容
 * 
 * 表格属性要有xy_Title的名称
 */
ssc.smcs.form.common.FormCheckUtil = {};

FormCheckUtil = ssc.smcs.form.common.FormCheckUtil;

/**
 * 获取Field标签名称，去掉*号
 */
ssc.smcs.form.common.FormCheckUtil.get_Header_FieldLabel = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);

	return FormCheckUtil.get_Header_FieldLabel2(field);
};

/**
 * 获取Field标签名称，去掉*号
 */
ssc.smcs.form.common.FormCheckUtil.get_Header_FieldLabel2 = function(/*Field*/ field)
{
	return field.fieldLabel.replace("*", "");
};

/**
 * 检查表头字段 - 字符串 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_String_Null = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);

	if (StringUtil.isEmpty(field.getValue().trim()))
	{
		MsgUtil.alert("请先填写表单上的【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】");
		return false;
	}
	else
	{
		return true;
	}
};
/**
 * 检查表头字段 - 字符串 - 长度
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_String_Length = function(strFieldName, intLength)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);

	if (field.getValue().trim().length > intLength)
	{
		MsgUtil.alert("表单上的【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】填写的内容不可超过" + intLength.toString() + "个字符");
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表头字段 - 字符串 - 字符安全性
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_String_Safety = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);

	var strFieldValue = field.getValue().trim();

	if (strFieldValue.length <= 0)
	{
		return true;
	}

	if (StringUtil.hasLimitedChar(strFieldValue))
	{
		MsgUtil.alert("表单上的【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】填写内容不能包含字符【" + StringUtil.getFirstLimitedChar(strFieldValue) + "】");
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表头字段 - 日期 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Date_Null = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);

	if (field.getValue() == null || field.getValue() == "")
	{
		MsgUtil.alert("请先填写表单上的【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】");
		return false;
	}
	else
	{
		return true;
	}
};
/**
 * 检查表头字段 - 日期 - 格式
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Date_Format = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);

	if (! field.validate())
	{
		MsgUtil.alert("表单上的【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】格式不正确，" + String.format(field.invalidText, field.getRawValue(), field.format));
		return false;
	}
	else
	{
		return true;
	}
};
/**
 * 检查表头字段 - 金额 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Money_Null = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);
	var money = FormInfoUtil.get_Header_Money(strFieldName);

	if (! NumberUtil.isNumber(money))
	{
		MsgUtil.alert("表单上的【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】未填写金额");
		return false;
	}

	if (FormMoneyUtil.equal(money, 0))
	{
		MsgUtil.alert("表单上的【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】未填写金额");
		return false;
	}
	else
	{
		return true;
	}
};
/**
 * 检查表头字段 - 金额 - 正数
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Money_Positive = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);
	var money = FormInfoUtil.get_Header_Money(strFieldName);

	if (money <= 0)
	{
		MsgUtil.alert("表单上的【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】应当大于0");
		return false;
	}
	else
	{
		return true;
	}
};
/**
 * 检查表头字段 - 金额 - 负数
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Money_Negative = function(strFieldName)
{
	var money = FormInfoUtil.get_Header_Money(strFieldName);

	if (money >= 0)
	{
		MsgUtil.alert("表单上的【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】应当小于0");
		return false;
	}
	else
	{
		return true;
	}
};
/**
 * 检查表头字段 - 对象 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Object_Null = function(strFieldName, strFieldLabel)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);

	if (field != null)
	{
		if(! field.getSelected())
		{
			var strLabel = "";
			if (strFieldLabel == undefined || strFieldLabel == null || strFieldLabel.trim() == "")
			{
				strLabel = FormCheckUtil.get_Header_FieldLabel2(field);
			}
			else
			{
				strLabel = strFieldLabel;
			}

			MsgUtil.alert("请先选择表单上的【" + strLabel + "】");
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return true;
	}
};

/**
 * 按照检查条件列表，检查表格所有数据
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Data = function(/* array */ funArray, scope)
{
	if (funArray == null)
	{
		DebugAssertUtil.alert("FormCheckUtil.check_Header_Data，funArray == null");

		return true;
	}

	if (! ArrayUtil.isArray(funArray))
	{
		DebugAssertUtil.alert("FormCheckUtil.check_Header_Data，funArray is not a array");

		return true;
	}

	for (var i = 0; i < funArray.length; i++)
	{
		var fun = funArray[i];
		if (fun == null || typeof(fun) != "function")
		{
			DebugAssertUtil.alert("FormCheckUtil.check_Header_Data，funArray[" + i.toString() + "] is null or is not function");
			
			continue;
		}

		if (fun.call(scope || this) != true)
		{
			return false;
		}
	}

	return true;
};

/**
 * 检查表头 - 表单编号 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_SerialNo_Null = function()
{
	return FormCheckUtil.check_Header_String_Null("serialno");
};
/**
 * 检查表头 - 业务类型 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_BusiClass_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("busiclasscode");
};
/**
 * 检查表头 - 表单类型 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_FormType_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("formtypecode");
};

/**
 * 检查表头 - 报账公司 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Unit_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("unitid");
};

/**
 * 检查表头 - 报账部门 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Dept_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("deptid");
};

/**
 * 检查表头 - 报账人 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_User_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("userid");
};

/**
 * 检查表头 - 报账日期 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_BusiDate_Null = function()
{
	return FormCheckUtil.check_Header_Date_Null("busidate");
};
/**
 * 检查表头 - 报账日期 - 格式
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_BusiDate_Format = function()
{
	return FormCheckUtil.check_Header_Date_Format("busidate");
};

/**
 * 检查表头 - 预算年份 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_BudgetYear_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("budgetyear");
};

/**
 * 检查表头 - 报账事由 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Abstract_Null = function()
{
	return FormCheckUtil.check_Header_String_Null("abstract");
};
/**
 * 检查表头 - 报账事由 - 文本长度
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Abstract_Length = function()
{
	return FormCheckUtil.check_Header_String_Length("abstract", 50);
};
/**
 * 检查表头 - 报账事由 - 安全字符
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Abstract_Safety = function()
{
	return FormCheckUtil.check_Header_String_Safety("abstract");
};

/**
 * 检查表头 - 附件张数 - 必填并不小于0
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Affix_NullAndPositive = function()
{
	var field = FormInfoUtil.get_Header_Field("affixnum");

	var value = field.getValue();
	if (typeof(value) != "number")
	{
		MsgUtil.alert("请先填写表单上的【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】");
		return false;		
	}

	if (value <= 0)
	{
		MsgUtil.alert("表单上【" + FormCheckUtil.get_Header_FieldLabel2(field) + "】应当为正整数");
		return false;
	}

/*	if (value < 0)
	{
		MsgUtil.alert("表单上【" + field.fieldLabel + "】不可小于0");
		return false;
	}
*/
	return true;
};

/**
 * 检查表头 - 经济事项 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_EconItem_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("econitemid");
};

/**
 * 检查表头 - 合同 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Contract_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("contractno", "合同");
};

/**
 * 检查表头 - 供应商 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Supplier_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("supplierid", "供应商");
};
/**
 * 检查表头 - 客户 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_Customer_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("customerid", "客户");
};

/**
 * 检查表头 - 结算方式 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_SettleType_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("settletype");
};
/**
 * 检查表头 - 支付方式 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Header_PayType_Null = function()
{
	return FormCheckUtil.check_Header_Object_Null("paytypecode");
};

/**
 * 获得表格标题
 */
ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle = function(panel)
{
	if (panel.xy_Title == undefined || panel.xy_Title == null)
	{
		DebugAssertUtil.alert("FormCheckUtil.get_GridPanelTitle，panel.xy_Title未设置");

		return panel.id;				
	}
	else
	{
		return panel.xy_Title.trim();
	}
};

/**
 * 根据字段，获取表格列头名称(，去掉*号)
 */
ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader = function(panel, strFieldName)
{
	if (StringUtil.isEmpty(strFieldName))
	{
		DebugAssertUtil.alert("FormCheckUtil.get_ColumnHeader(" + strFieldName + ")，fieldname == \"\"");

		return "";
	}

	if (panel == null)
	{
		DebugAssertUtil.alert("FormCheckUtil.get_ColumnHeader(" + strFieldName + ")，panel == null");

		return "";
	}

	if (panel.getColumnModel == undefined && typeof(panel.getColumnModel) != "function")
	{
		DebugAssertUtil.alert("FormCheckUtil.get_ColumnHeader(" + strFieldName + ")，panel.getColumnModel不是正确的function");

		return "";
	}

	var columnModel = panel.getColumnModel();

	var index = columnModel.getColumnIndexByDataIndex(strFieldName);
	if (index < 0)
	{
		DebugAssertUtil.alert("FormCheckUtil.get_ColumnHeader(" + strFieldName + ")，未找到该列");

		return "";		
	}

	var title = columnModel.getColumnHeader(index);

	return title.replace("*", "");
};

/**
 * 检查表格数据必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Grid_Store_Null = function(panel, store)
{
	if (panel == undefined || panel == null)
	{
		DebugAssertUtil.alert("FormCheckUtil.check_Grid_Store_Null，panel == undefined || panel == null");

		return true;
	}

	if (store == undefined || store == null)
	{
		DebugAssertUtil.alert("FormCheckUtil.check_Grid_Store_Null，store == undefined || store == null");

		return true;
	}

	if (store.getCount() <= 0)
	{
		var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);

		MsgUtil.alert("请填写【" + strGridPanelTitle + "】表格");

		return false;		
	}
	else
	{
		return true;
	}
};

/**
 * 按照检查条件列表，检查表格所有数据
 */
ssc.smcs.form.common.FormCheckUtil.check_Grid_Store_Data = function(panel, store, /* array */ funArray)
{
	if (panel == undefined || panel == null)
	{
		DebugAssertUtil.alert("FormCheckUtil.check_Grid_Store_Data，panel == undefined || panel == null");

		return true;
	}

	if (store == undefined || store == null)
	{
		DebugAssertUtil.alert("FormCheckUtil.check_Grid_Store_Data，store == undefined || store == null");

		return true;
	}

	if (funArray == null)
	{
		DebugAssertUtil.alert("FormCheckUtil.check_Grid_Store_Data，funArray == null");

		return true;
	}

	if (! ArrayUtil.isArray(funArray))
	{
		DebugAssertUtil.alert("FormCheckUtil.check_Grid_Store_Data，funArray is not a array");

		return true;
	}

	for (var i = 0; i < funArray.length; i++)
	{
		var fun = funArray[i];
		if (fun == null || typeof(fun) != "function")
		{
			DebugAssertUtil.alert("FormCheckUtil.check_Grid_Store_Data，funArray[" + i.toString() + "] is null or is not function");

			continue;
		}

		panel.xy_CheckResult = true;
		store.each(fun, panel);
		if (! panel.xy_CheckResult)
		{
			return false;
		}
	}

	return true;
};

/**
 * 检查表格行字段 - 字符串 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_String_Null = function(record, index, length, panel, strFieldName)
{
	var string = record.get(strFieldName);

	if (StringUtil.isEmpty(string))
	{
		var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
		var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);

		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】不可为空");
		panel.xy_CheckResult = false;
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表格行字段 - 字符串 - 长度
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_String_Length = function(record, index, length, panel, strFieldName, intLength)
{
	var string = record.get(strFieldName);

	if (string.trim().length > intLength)
	{
		var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
		var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);

		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】填写的内容不可超过" + intLength.toString() + "个字符");
		panel.xy_CheckResult = false;
		return false;		
	}
	else
	{
		return true;
	}
};

/**
 * 检查表格行字段 - 数值 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Number_Null = function(record, index, length, panel, strFieldName)
{
	var number = record.get(strFieldName);

	var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
	var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);
	if (! NumberUtil.isNumber(number))
	{
		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】未填写数值");
		panel.xy_CheckResult = false;
		return false;
	}

	if (FormMoneyUtil.equal(number, 0))
	{
		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】不能为0");
		panel.xy_CheckResult = false;
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表格行字段 - 数值 - 正数
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Number_Positive = function(record, index, length, panel, strFieldName)
{
	var number = record.get(strFieldName);

	if (number <= 0)
	{
		var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
		var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);

		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】应当大于0");
		panel.xy_CheckResult = false;
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表格行字段 - 数值 - 负数
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Number_Negative = function(panel, record, index, strFieldName)
{
	var number = record.get(strFieldName);

	if (number >= 0)
	{
		var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
		var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);

		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】应当小于0");
		panel.xy_CheckResult = false;
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表格行字段 - 金额 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Money_Null = function(record, index, length, panel, strFieldName)
{
	var money = record.get(strFieldName);

	var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
	var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);
	if (! NumberUtil.isNumber(money))
	{
		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】未填写金额");
		panel.xy_CheckResult = false;
		return false;
	}

	if (FormMoneyUtil.equal(money, 0))
	{
		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】未填写金额");
		panel.xy_CheckResult = false;
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表格行字段 - 金额 - 必须为正数
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Money_Positive = function(record, index, length, panel, strFieldName)
{
	var money = record.get(strFieldName);

	if (money <= 0)
	{
		var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
		var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);

		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】应当大于0");
		panel.xy_CheckResult = false;
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表格行字段 - 金额 - 必须非正数
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Money_NotPositive = function(record, index, length, panel, strFieldName)
{
	var money = record.get(strFieldName);

	if (money > 0)
	{
		var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
		var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);

		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】不应大于0");
		panel.xy_CheckResult = false;
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表格行字段 - 金额 - 必须为负数
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Money_Negative = function(record, index, length, panel, strFieldName)
{
	var money = record.get(strFieldName);

	if (money >= 0)
	{
		var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
		var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);

		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】应当小于0");
		panel.xy_CheckResult = false;
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表格行字段 - 金额 - 必须非负数
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Money_NotNegative = function(record, index, length, panel, strFieldName)
{
	var money = record.get(strFieldName);

	if (money < 0)
	{
		var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
		var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);

		MsgUtil.alert("表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】不应小于0");
		panel.xy_CheckResult = false;
		return false;
	}
	else
	{
		return true;
	}
};

ssc.smcs.form.common.FormCheckUtil.is_Record_Object_Null = function(record, strFieldName, object)
{
	var object = record.get(strFieldName);

	if (typeof(object) != "object" || object == "" || object == undefined || object == null
			|| record.getXyValue(strFieldName) == "")
	{
		return true;
	}
	else
	{
		return false;
	}
};

/**
 * 检查表格行字段 - 对象 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Object_Null = function(record, index, length, panel, strFieldName)
{
/*	var object = record.get(strFieldName);*/

	if (ssc.smcs.form.common.FormCheckUtil.is_Record_Object_Null(record, strFieldName))
/*	if (typeof(object) != "object" || object == "" || object == undefined || object == null
			|| record.getXyValue(strFieldName) == "")*/
	{
		var strGridPanelTitle = ssc.smcs.form.common.FormCheckUtil.get_GridPanelTitle(panel);
		var strColumnHeader = ssc.smcs.form.common.FormCheckUtil.get_ColumnHeader(panel, strFieldName);

		var strMsg = "";
		if (index == undefined || index == null)
		{
			strMsg = "请先选择当前行的【" + strColumnHeader + "】";
		}
		else
		{
			strMsg = "表格【" + strGridPanelTitle + "】上第" + (index + 1).toString() + "行【" + strColumnHeader + "】未选择";
		}
		MsgUtil.alert(strMsg);
		panel.xy_CheckResult = false;
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * 检查表格列 - 公司 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Unit_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Object_Null(record, index, length, panel, "unitid");
};

/**
 * 检查表格列 - 经济事项 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_EconItem_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Object_Null(record, index, length, panel, "econitemid");
};

/**
 * 检查表格列 - 报销说明 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Memo_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_String_Null(record, index, length, panel, "memo");
};
/**
 * 检查表格列 - 报销说明 - 文本长度
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Memo_Length = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_String_Length(record, index, length, panel, "memo", 100);
};
/**
 * 检查表格列 - 会计摘要 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Abstract_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_String_Null(record, index, length, panel, "abstract");
};
/**
 * 检查表格列 - 会计摘要 - 文本长度
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Abstract_Length = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_String_Length(record, index, length, panel, "abstract", 100);
};
/**
 * 检查表格列 - 报账金额 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Amount_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Money_Null(record, index, length, panel, "amount");
};
/**
 * 检查表格列 - 报账金额 - 正数
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Amount_Positive = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Money_Positive(record, index, length, panel, "amount");
};
/**
 * 检查表格列 - 核定金额 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_FinAmount_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Money_Null(record, index, length, panel, "finamount");
};
/**
 * 检查表格列 - 核定金额 - 正数
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_FinAmount_Positive = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Money_Positive(record, index, length, panel, "finamount");
};
/**
 * 检查表格列 - 支出部门 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Dept_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Object_Null(record, index, length, panel, "deptid");
};

/**
 * 检查表格列 - 预算责任中心 - 必填
 * 检查表格列 - 预算科目 - 必填
 */

/**
 * 检查表格列 - 合同 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Contract_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Object_Null(record, index, length, panel, "contractid");
};

/**
 * 检查表格列 - 供应商 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Supplier_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Object_Null(record, index, length, panel, "supplierid");
};
/**
 * 检查表格列 - 客户 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_Customer_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Object_Null(record, index, length, panel, "customerid");
};

/**
 * 检查表格列 - 支付/收款方式 - 必填
 */
ssc.smcs.form.common.FormCheckUtil.check_Record_PayType_Null = function(record, index, length, panel)
{
	if (panel == undefined || panel == null)
	{
		panel = this;
	}
	return ssc.smcs.form.common.FormCheckUtil.check_Record_Object_Null(record, index, length, panel, "paytypecode");
};