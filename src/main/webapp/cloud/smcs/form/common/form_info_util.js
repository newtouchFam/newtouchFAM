Ext.namespace("ssc.smcs.form.common");

/**
 * 表单界面字段值获取工具类
 * 分为获取表头和获取表格两类
 */
ssc.smcs.form.common.FormInfoUtil = {};

FormInfoUtil = ssc.smcs.form.common.FormInfoUtil;

/**
 * 获取表头信息 - field - triggerfield
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_Field = function(strFieldName)
{
	var field = Ext.getCmp(strFieldName);
	if (field == null)
	{
		DebugAssertUtil.alert("FormInfoUtil.get_Header_Field(" + strFieldName + ")，field == null");
	}

	return field;
};

/**
 * 获取表头信息 - 文本 - textfield
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_String = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);
	if (field != null)
	{
		return field.getValue();
	}
	else
	{
		return "";
	}
};

/**
 * 获取表头信息 - 日期 - datefield
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_Date = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);
	if (field != null)
	{
		return field.getValue();
	}
	else
	{
		return null;
	}
};

/**
 * 获取表头信息 - 日期文本 - datefield
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_DateString = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);
	if (field != null)
	{
		var date = field.getValue();
		if (date == null || date == "")
		{
			return "";
		}
		else
		{
			return date.format("Y-m-d");
		}
	}
	else
	{
		return "";
	}
};

/**
 * 获取表头信息 - 金额 - moneyfield
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_Money = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);
	if (field != null)
	{
		return field.getValue();
	}
	else
	{
		return 0;
	}
};

/**
 * 获取表头信息 - fieldID - triggerfield
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_FieldID = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);
	if (field != null)
	{
		return field.getSelectedID();
	}
	else
	{
		return "";
	}
};

/**
 * 获取表头信息 - fieldData - triggerfield
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_FieldData = function(strFieldName)
{
	var field = FormInfoUtil.get_Header_Field(strFieldName);
	if (field != null)
	{
		return field.getSelectedData();
	}
	else
	{
		return null;
	}
};

/**
 * 获取表头信息 - 表单实体ID
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_FormMainID = function()
{
	return FormInfoUtil.get_Header_String("id");
};

/**
 * 获取表头信息 - 表单编号
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_SerialNo = function()
{
	return FormInfoUtil.get_Header_String("serialno");
};

/**
 * 获取表头信息 - 表单类型
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_FormTypeField = function()
{
	return FormInfoUtil.get_Header_Field("formtypecode");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_FormTypeCode = function()
{
	return FormInfoUtil.get_Header_FieldID("formtypecode");
};

/**
 * 获取表头信息 - 业务类型
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_BusiClassField = function()
{
	return FormInfoUtil.get_Header_Field("busiclasscode");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_BusiClassCode = function()
{
	return FormInfoUtil.get_Header_FieldID("busiclasscode");
};
/** 
 * 获取表头信息 - 业务类型
 * 获取表头信息 - 表单类型
 * 获取表头信息 - 是否紧急
 */

/**
 * 获取表头信息 - 报账公司
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_UnitField = function()
{
	return FormInfoUtil.get_Header_Field("unitid");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_UnitID = function()
{
	return FormInfoUtil.get_Header_FieldID("unitid");
};

/**
 * 获取表头信息 - 报账部门
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_DeptField = function()
{
	return FormInfoUtil.get_Header_Field("deptid");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_DeptID = function()
{
	return FormInfoUtil.get_Header_FieldID("deptid");
};

/**
 * 获取表头信息 - 报账人
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_UserField = function()
{
	return FormInfoUtil.get_Header_Field("userid");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_UserID = function()
{
	return FormInfoUtil.get_Header_FieldID("userid");
};

/** 
 * 获取表头信息 - 业务日期
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_BusiDateField = function()
{
	return FormInfoUtil.get_Header_Field("busidate");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_BusiDate = function()
{
	return FormInfoUtil.get_Header_Date("busidate");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_BusiDateString = function()
{
	return FormInfoUtil.get_Header_DateString("busidate");
};

/** 
 * 获取表头信息 - 预算年份
 */
//ssc.smcs.form.common.FormInfoUtil.get_Header_BudgetYearField = function()
//{
//	return FormInfoUtil.get_Header_Field("budgetyear");
//};
//ssc.smcs.form.common.FormInfoUtil.get_Header_BudgetYear = function()
//{
//	return FormInfoUtil.get_Header_FieldID("budgetyear");
//};

/**
 * 获取表头信息 - 报账事由
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_AbstractField = function()
{
	return FormInfoUtil.get_Header_Field("abstract");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_Abstract = function()
{
	return FormInfoUtil.get_Header_String("abstract");
};

/** 
 * 获取表头信息 - 附件张数
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_AffixNum = function()
{
	return FormInfoUtil.get_Header_Field("affixnum").getValue();
};

/** 
 * 获取表头信息 - 经济事项
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_EconItemField = function()
{
	return FormInfoUtil.get_Header_Field("econitemid");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_EconItemID= function()
{
	return FormInfoUtil.get_Header_FieldID("econitemid");
};

/** 
 * 获取表头信息 - 合同
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_ContractField = function()
{
	return FormInfoUtil.get_Header_Field("contractno");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_ContractNo = function()
{
	return FormInfoUtil.get_Header_FieldID("contractno");
};

/** 
 * 获取表头信息 - 供应商
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_SupplierField = function()
{
	return FormInfoUtil.get_Header_Field("supplierid");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_SupplierID = function()
{
	return FormInfoUtil.get_Header_FieldID("supplierid");
};

/** 
 * 获取表头信息 - 客户
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_CustomerField = function()
{
	return FormInfoUtil.get_Header_Field("customerid");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_CustomerID = function()
{
	return FormInfoUtil.get_Header_FieldID("customerid");
};

/** 
 * 获取表头信息 - 结算方式
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_SettleTypeField = function()
{
	return FormInfoUtil.get_Header_Field("settletype");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_SettleTypeCode = function()
{
	return FormInfoUtil.get_Header_FieldID("settletype");
};
/** 
 * 获取表头信息 - 支付对象类型方式
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_PayObjectTypeField = function()
{
	return FormInfoUtil.get_Header_Field("payobjecttype");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_PayObjectTypeCode = function()
{
	return FormInfoUtil.get_Header_FieldID("payobjecttype");
};
/** 
 * 获取表头信息 - 支付方式
 */
ssc.smcs.form.common.FormInfoUtil.get_Header_PayTypeField = function()
{
	return FormInfoUtil.get_Header_Field("paytypecode");
};
ssc.smcs.form.common.FormInfoUtil.get_Header_PayTypeCode = function()
{
	return FormInfoUtil.get_Header_FieldID("paytypecode");
};

/**
 * 获取表格字段值 - 文本
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_String = function(record, strFieldName)
{
	if (record == null || record == undefined || typeof(record) != "object")
	{
		DebugAssertUtil.alert("FormInfoUtil.get_Record_String(" + strFieldName + ")，record is null or record is not object");
	}

	var value = record.get(strFieldName);
	if (typeof(value) != "string")
	{
		DebugAssertUtil.alert("FormInfoUtil.get_Record_String(" + strFieldName + ")，value is not a string");
	}

	return value;
};
/**
 * 获取表格字段值 - 数值
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Number = function(record, strFieldName)
{
	if (record == null || record == undefined || typeof(record) != "object")
	{
		DebugAssertUtil.alert("FormInfoUtil.get_Record_Number(" + strFieldName + ")，record is null or record is not object");
	}

	var value = record.get(strFieldName);

	return value;
};
/**
 * 获取表格字段值 - 金额
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Money = function(record, strFieldName)
{
	if (record == null || record == undefined || typeof(record) != "object")
	{
		DebugAssertUtil.alert("FormInfoUtil.get_Record_Money(" + strFieldName + ")，record is null or record is not object");
	}

	var money = record.get(strFieldName);
	if (! NumberUtil.isNumber(money))
	{
		DebugAssertUtil.alert("FormInfoUtil.get_Record_Money(" + strFieldName + ")，value is not a float");
	}

	return money;
};
/**
 * 获取表格字段值 - 对象
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Object = function(record, strFieldName)
{
	if (record == null || record == undefined || typeof(record) != "object")
	{
		DebugAssertUtil.alert("FormInfoUtil.get_Record_Object(" + strFieldName + ")，record is null or record is not object");
	}

	var value = record.getComplex(strFieldName);
	if (typeof(value) != "object" || value == undefined || value == null)
	{
		return null;
	}

	return value;
};
/**
 * 获取表格字段值 - 对象
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_ObjectKeyValue = function(record, strFieldName)
{
	if (record == null || record == undefined || typeof(record) != "object")
	{
		DebugAssertUtil.alert("FormInfoUtil.get_Record_ObjectKeyValue(" + strFieldName + ")，record is null or record is not object");
	}

	var value = record.getComplex(strFieldName);
	if (typeof(value) != "object" || value == undefined || value == null)
	{
		return "";
	}

	var value = record.getXyValue(strFieldName);
	return value;
};

/**
 * 获取表格字段值 - 对象
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_ObjectDisplayValue = function(record, strFieldName)
{
	if (record == null || record == undefined || typeof(record) != "object")
	{
		DebugAssertUtil.alert("FormInfoUtil.get_Record_ObjectKeyValue(" + strFieldName + ")，record is null or record is not object");
	}

	var value = record.getComplex(strFieldName);
	if (typeof(value) != "object" || value == undefined || value == null)
	{
		return "";
	}

	var value = record.getDisplayValue(strFieldName);
	return value;
};

/**
 * 获取表格字段值 - 公司
 */

/**
 * 获取表格字段值 - 经济事项
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_EconItem = function(record)
{
	return FormInfoUtil.get_Record_Object(record, "econitemid");
};
ssc.smcs.form.common.FormInfoUtil.get_Record_EconItemID = function(record)
{
	return FormInfoUtil.get_Record_ObjectKeyValue(record, "econitemid");
};
/**
 * 获取表格字段值 - 报销说明
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Memo = function(record)
{
	return FormInfoUtil.get_Record_String(record, "memo");
};
/**
 * 获取表格字段值 - 会计摘要
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Abstract = function(record)
{
	return FormInfoUtil.get_Record_String(record, "abstract");
};
/**
 * 获取表格字段值 - 报账金额
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Amount = function(record)
{
	return FormInfoUtil.get_Record_Money(record, "amount");
};
/**
 * 获取表格字段值 - 核定金额
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_FinAmount = function(record)
{
	return FormInfoUtil.get_Record_Money(record, "finamount");
};

/**
 * 获取表格字段值 - 部门
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Dept = function(record)
{
	return FormInfoUtil.get_Record_Object(record, "deptid");
};
ssc.smcs.form.common.FormInfoUtil.get_Record_DeptID = function(record)
{
	return FormInfoUtil.get_Record_ObjectKeyValue(record, "deptid");
};

/**
 * 获取表格字段值 - 预算责任中心
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Respn = function(record)
{
	return FormInfoUtil.get_Record_Object(record, "respnid");
};
ssc.smcs.form.common.FormInfoUtil.get_Record_RespnID = function(record)
{
	return FormInfoUtil.get_Record_ObjectKeyValue(record, "respnid");
};

/**
 * 获取表格字段值 - 预算项目
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Index = function(record)
{
	return FormInfoUtil.get_Record_Object(record, "indexid");
};
ssc.smcs.form.common.FormInfoUtil.get_Record_IndexID = function(record)
{
	return FormInfoUtil.get_Record_ObjectKeyValue(record, "indexid");
};

/**
 * 获取表格字段值 - 关联交易类型
 * 获取表格字段值 - 银行账户
 * 获取表格字段值 - 开户银行
 * 获取表格字段值 - 银行账号
 */

/**
 * 获取表格字段值 - 合同
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Contract = function(record)
{
	return FormInfoUtil.get_Record_Object(record, "contractid");
};
ssc.smcs.form.common.FormInfoUtil.get_Record_ContractID = function(record)
{
	return FormInfoUtil.get_Record_ObjectKeyValue(record, "contractid");
};

/**
 * 获取表格字段值 - 供应商
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Supplier = function(record)
{
	return FormInfoUtil.get_Record_Object(record, "supplierid");
};
ssc.smcs.form.common.FormInfoUtil.get_Record_SupplierID = function(record)
{
	return FormInfoUtil.get_Record_ObjectKeyValue(record, "supplierid");
};
/**
 * 获取表格字段值 - 客户
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_Customer = function(record)
{
	return FormInfoUtil.get_Record_Object(record, "customerid");
};
ssc.smcs.form.common.FormInfoUtil.get_Record_CustomerID = function(record)
{
	return FormInfoUtil.get_Record_ObjectKeyValue(record, "customerid");
};

/**
 * 获取表格字段值 - 支付方式
 */
ssc.smcs.form.common.FormInfoUtil.get_Record_PayType = function(record)
{
	return FormInfoUtil.get_Record_Object(record, "paytypecode");
};
ssc.smcs.form.common.FormInfoUtil.get_Record_PayTypeCode = function(record)
{
	return FormInfoUtil.get_Record_ObjectKeyValue(record, "paytypecode");
};