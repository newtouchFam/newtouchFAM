Ext.namespace("ssc.common");


/**
 * Ext.form类的工具类，包括各类Field、Trigge等
 */
ssc.common.FormUtil = {};

/**
 * 缩写定义
 */
FormUtil = ssc.common.FormUtil;

/**
 * 设置只读并设置为灰色底色风格
 * @param readOnly
 * @return
 */
Ext.form.TextField.prototype.setReadOnly = function(readOnly)
{
	if (readOnly)
	{
		this.readOnly = readOnly;
		this.addClass("x-textfield-readonly");
		this.disable();
	}
	else
	{
		this.readOnly = readOnly;
		this.removeClass("x-textfield-readonly");
		this.enable();
	}
};

/**
 * 隐藏标签
 * @return
 */
Ext.form.TextField.prototype.hideFieldLabel  = function()
{
	this.hideLabel = true;
	this.getEl().up(".x-form-item").setDisplayed(false);
};

/**
 * 显示标签
 * @return
 */
Ext.form.TextField.prototype.showFieldLabel  = function()
{
	this.hideLabel = false;
	this.getEl().up(".x-form-item").setDisplayed(true);
};

/**
 * 动态设置fieldLabel
 * @param label
 * @return
 */
Ext.form.Field.prototype.setFieldLabel = function(label)
{
	if (this.rendered)
	{
		if (this.id == undefined || this.id == null || typeof(this.id) != "string")
		{
			return;
		}

		try
		{
			var labelSeparator = this.labelSeparator ? this.labelSeparator : ":";
			Ext.query("*[for=" + this.id + "]")[0].innerHTML = label + labelSeparator;
		}
		catch(ex)
		{
			return;
		}
	}
	else
	{
		this.fieldLabel = label;
	}
};

/**
 * 日期字段获得日期字符串值
 * @return
 */
Ext.form.DateField.prototype.getDateString = function()
{
	if (this.getValue() != "" && this.getValue() != null)
	{
		return this.getValue().format("Y-m-d");
	}
	else
	{
		return "";
	}
};

/**
 * 根据列的dataindex查找列索引
 * @param dataindex
 * @return	未找到返回-1
 */
Ext.grid.ColumnModel.prototype.getColumnIndexByDataIndex = function(strDataIndex)
{
	for (var i = 0; i < this.getColumnCount(); i++)
	{
		if (this.getDataIndex(i) == strDataIndex)
		{
			return i;
		}
	}

	return -1;
};

/**
 * 补充Ext.form.TwinTriggerField的类型注册
 * 否则Ext.form.TwinTriggerField派生的组件，使用getXTypes()将无法得到完整的继承树
 */
Ext.reg("twintrigger", Ext.form.TwinTriggerField);

/**
 * 检查组件是否未某一类型派生(含自身)
 * @param strSuperClassName
 * @return
 */
Ext.Component.prototype.isDerive = function(strSuperClassName)
{
	var strSuperClassPath = this.getXTypes();
	if (strSuperClassPath.indexOf("/" + strSuperClassName + "/") > 0)
	{
		return true;
	}

	if (strSuperClassPath.indexOf(strSuperClassName + "/") == 0)
	{
		return true;
	}

	if (strSuperClassPath.indexOf("/" + strSuperClassName) >= 0
			&& (strSuperClassPath.indexOf("/" + strSuperClassName) == (strSuperClassPath.length - strSuperClassName.length - 1)))
	{
		return true;
	}

	return false;
};