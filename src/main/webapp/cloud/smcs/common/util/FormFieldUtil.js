Ext.namespace("ssc.shcs.common");

/**
 * 表单字段数据获取工具类
 */
ssc.shcs.common.FormFieldUtil = {};

FormFieldUtil = ssc.shcs.common.FormFieldUtil;

ssc.shcs.common.FormFieldUtil.is_ComplexField = function(field)
{
	if (field == null)
	{
		return false;
	}

	if (field.isDerive("ssc.component.basecombobox")
			|| field.isDerive("ssc.component.basesimplecombobox")
			|| field.isDerive("ssc.component.baselisttgfield")
			|| field.isDerive("ssc.component.basetreetgfield"))
	{
		return true;
	}

	if (field.getXType() == "xymoneyfield" || field.isDerive("xymoneyfield"))
	{
		return false;
	}

	if (field.getXyValue != undefined && typeof (field.getXyValue) == "function")
	{
		return true;
	}

	return false;
};

/**
 * 读取字段实际值
 */
ssc.shcs.common.FormFieldUtil.getFieldValue = function(field)
{
	if (field == null)
	{
		return "";
	}

	if (field.getXType() == "datefield" || field.isDerive("datefield"))
	{
		/* 日期字段 */
		if (field.getValue() == "" || field.getValue() == null)
		{
			return "";
		}
		else
		{
			return field.getValue().format("Y-m-d");
		}
	}
	else if (field.getXType() == "xymoneyfield" || field.isDerive("xymoneyfield"))
	{
		/* 金额字段 */
		return field.getValue();
	}
	else if (field.isDerive("ssc.component.basecombobox") || field.isDerive("ssc.component.basesimplecombobox"))
	{
		/* combobox字段 */
		if (field.getKeyValue != undefined && typeof (field.getKeyValue) == "function")
		{
			return field.getKeyValue();
		}
	}
	else if (field.isDerive("ssc.component.baselisttgfield") || field.isDerive("ssc.component.basetreetgfield"))
	{
		/* trigger字段 */
		if (field.getSelectedID != undefined && typeof (field.getSelectedID) == "function")
		{
			return field.getSelectedID();
		}
	}

	/* 其他xy字段 */
	if (field.getXType().indexOf("xy") == 0 || field.getXType().indexOf("ssc.component.") == 0
			|| field.getXType().indexOf("ssc.shcs.component.xy") == 0)
	{
		if (field.getXyValue != undefined && typeof (field.getXyValue) == "function")
		{
			return field.getXyValue() == null ? "" : field.getXyValue();
		}
	}

	/* 普通文本字段 */
	return field.getValue();
};

/**
 * 读取字段显示值
 */
ssc.shcs.common.FormFieldUtil.getFieldDisplay = function(field)
{
	if (field == null)
	{
		return "";
	}

	if (field.getXType() == "datefield" || field.isDerive("datefield"))
	{
		/* 日期字段 */
		if (field.getValue() == "" || field.getValue() == null)
		{
			return "";
		}
		else
		{
			return field.getValue().format("Y-m-d");
		}
	}
	else if (field.getXType() == "xymoneyfield" || field.isDerive("xymoneyfield"))
	{
		/* 金额字段 */
		return field.getValue();
	}
	else if (field.isDerive("ssc.component.basecombobox") || field.isDerive("ssc.component.basesimplecombobox"))
	{
		/* combobox字段 */
		if (field.getDisplayValue != undefined && typeof (field.getDisplayValue) == "function")
		{
			return field.getDisplayValue();
		}
	}
	else if (field.isDerive("ssc.component.baselisttgfield") || field.isDerive("ssc.component.basetreetgfield"))
	{
		/* trigger字段 */
		if (field.getSelectedText != undefined && typeof (field.getSelectedText) == "function")
		{
			return field.getSelectedText();
		}
	}

	/* 其他xy字段 */
	if (field.getXType().indexOf("xy") == 0 || field.getXType().indexOf("ssc.component.") == 0
			|| field.getXType().indexOf("ssc.shcs.component.xy") == 0)
	{
		if (field.getDisplayValue != undefined && typeof (field.getDisplayValue) == "function")
		{
			return field.getDisplayValue() == null ? "" : field.getDisplayValue();
		}
	}

	/* 普通文本字段 */
	return field.getRawValue();
};

/*Ext.data.Record.prototype.contains_FieldName = function(strFieldName)
{
	for (var i = 0; i < this.fields.keys.length; i++)
	{
		var key = this.fields.keys[i];

		if (key == strFieldName)
		{
			return true;
		}
	}

	return false;
};*/