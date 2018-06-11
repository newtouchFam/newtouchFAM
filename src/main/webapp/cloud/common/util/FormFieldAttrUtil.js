Ext.namespace("ssc.core.common");

/**
 * 表单组件属性设置工具类
 */
ssc.core.common.FormFieldAttrUtil = {};

FormFieldAttrUtil = ssc.core.common.FormFieldAttrUtil;

/**
 * 表单整体组件属性设置入口
 * fieldAttrConfig	表单组件通用属性配置
 * arrayGridPanelID 需要配置的表格列表，为空表示配置全部表格
 */
ssc.core.common.FormFieldAttrUtil.setFormAttr = function(/* jsonString */ fieldAttrConfig, /* array<string> */ arrayGridPanelID)
{
	if (fieldAttrConfig == undefined || fieldAttrConfig == null)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil.setFormAttr, fieldAttrConfig == null，忽略该配置");

		return;
	}
	var config = new ssc.core.common.FormFieldAttrConfig(fieldAttrConfig);

	/* 设置表头的组件属性设置 */
	for (var i = 0; i < config.getFieldIDList().length; i++)
	{
		var strFieldID = config.getFieldIDList()[i];

		ssc.core.common.FormFieldAttrUtil.setFieldAttr(config, strFieldID);
	}

	/* 表格列的属性设置 */
	for (var i = 0; i < config.getGridPanelIDList().length; i++)
	{
		var strGridPanelID = config.getGridPanelIDList()[i];

		if (arrayGridPanelID != null && ArrayUtil.isArray(arrayGridPanelID)
				&& arrayGridPanelID.indexOf(strGridPanelID) < 0)
		{
			continue;
		}

		ssc.core.common.FormFieldAttrUtil.setGridAttr(config, strGridPanelID);
	}
};

/**
 * 计算表头或列头文本，包括必填标志
 */
ssc.core.common.FormFieldAttrUtil.getLabelByKey = function(label, key)
{
	if (label == undefined || label == null || typeof(label) != "string")
	{
		return "";
	}

	if (key == "key" || key == true)
	{
		label = label.replace("<font color='red'>*</font>", "");
		label += "<font color='red'>*</font>";
	}
	else
	{
		label = label.replace("<font color='red'>*</font>", "");
	}

	return label;
};

/**
 * 设置表头字段显示必填样式
 */
ssc.core.common.FormFieldAttrUtil.setFieldLabelKey = function(field, key)
{
	if (field == undefined || field == null)
	{
		return;
	}

	var label = ssc.core.common.FormFieldAttrUtil.getLabelByKey(field.fieldLabel, key);

	if (field.rendered)
	{
		if (field.setFieldLabel != undefined && typeof(field.setFieldLabel) == "function")
		{
			field.setFieldLabel(label);
		}
	}
	else
	{
		if (field.fieldLabel != undefined && typeof(field.fieldLabel) == "string")
		{
			field.fieldLabel = label;
		}
	}
};

/**
 * 设置组件属性
 * param：
 * config					组件属性设置
 * strFieldID				组件ID
 */
ssc.core.common.FormFieldAttrUtil.setFieldAttr = function(config, strFieldID)
{
	var field = Ext.getCmp(strFieldID);
	if (field == null)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil, field中组件[" + strFieldID + "]未找到，忽略该配置");

		return;
	}

	if (! field.isDerive("field"))
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil, field中组件[" + strFieldID + "]不是从Field派生，忽略该配置");

		return;
	}

	/* 表头字段默认设置 */
	field.labelStyle = "text-align : right";
	field.anchor = "100%";

	/* 设置标签 */
	var fieldLabelAttr = config.getFieldLabel(strFieldID);
	if (fieldLabelAttr != "none")
	{
		field.fieldLabel = ssc.core.common.FormFieldAttrUtil.getLabelByKey(fieldLabelAttr, config.getFieldKey(strFieldID));
	
/*		if (config.getFieldKey(strFieldID))
		{
			field.fieldLabel = fieldLabelAttr + "<font color='red'>*</font>";
		}
		else
		{
			field.fieldLabel = fieldLabelAttr;
		}*/
	}

	/* 设置文本对齐 */
	var fieldAlignAttr = config.getFieldAlign(strFieldID);
	if (fieldAlignAttr == ssc.core.common.FieldAlignEnum.Left)
	{
		field.style = "text-align:left;";
	}
	else if (fieldAlignAttr == ssc.core.common.FieldAlignEnum.Center)
	{
		field.style = "text-align:center;";
	}
	else if (fieldAlignAttr == ssc.core.common.FieldAlignEnum.Right)
	{
		field.style = "text-align:right;";
	}
	else
	{
		/* 其他不处理 */
	}

	/* 设置数据类型 */
	var fieldTypeAttr = config.getFieldType(strFieldID);
	if (fieldTypeAttr == ssc.core.common.FieldTypeEnum.Text)
	{
		/* 文本类型，不处理 */
	}
	else if (fieldTypeAttr == ssc.core.common.FieldTypeEnum.Date)
	{
		/* 日期字段，标准日期格式，靠左对齐 */
		field.style = "text-align:left";
		field.format = "Y-m-d";
		field.invalidText = "【{0}】是无效的日期格式，请采用如下格式输入：2013-01-01";
	}
	else if (fieldTypeAttr == ssc.core.common.FieldTypeEnum.Time)
	{
		/* 时间字段，标准时间格式，靠左对齐 */
		field.style = "text-align:left";
		field.format = "H:i:s";
		field.invalidText = "【{0}】是无效的时间格式，请采用如下格式输入：18:05:05";
	}
	else if (fieldTypeAttr == ssc.core.common.FieldTypeEnum.Integer)
	{
		/* 整数字段，靠右对齐，无小数位 */
		field.style = "text-align:right";
		field.allowDecimals = false;
	}
	else if (fieldTypeAttr == ssc.core.common.FieldTypeEnum.Float)
	{
		/* 小数字段，靠右对齐，有小数位 */
		field.style = "text-align:right";
		field.allowDecimals = true;
	}
	else if (fieldTypeAttr == ssc.core.common.FieldTypeEnum.Money)
	{
		/* 金额字段，靠右对齐，标准金额格式(千分位、2位小数) */
		field.style = "text-align:right";
		field.renderer = ssc.common.RenderUtil.RenderMoney_ThirteenFont;
	}
	else
	{
		/* 其他不处理 */
	}
};

/**
 * 设置表格列访问控制属性
 * param：
 * config			配置
 * strGridPanelID	表格ID
 */
ssc.core.common.FormFieldAttrUtil.setGridAttr = function(config, strGridPanelID)
{
	var gridPanel = Ext.getCmp(strGridPanelID);
	if (gridPanel == null || gridPanel == undefined)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil, gridPanel[" + strGridPanelID + "]不存在，忽略该配置");

		return;
	}

	if (gridPanel.getColumnModel == undefined && typeof(gridPanel.getColumnModel) != "function")
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil, gridPanel[" + strGridPanelID + "]中grid.getColumnModel不是正确的function，忽略该配置");

		return;
	}

	for (var i = 0; i < config.getColumnDataIndexList(strGridPanelID).length; i++)
	{
		var strColumnDataIndex = config.getColumnDataIndexList(strGridPanelID)[i];

		ssc.core.common.FormFieldAttrUtil.setColumnAttr(config, gridPanel, strColumnDataIndex);
	}
};

/**
 * 设置表格列头文字
 */
ssc.core.common.FormFieldAttrUtil.setColumnHeader = function(gridPanel, strDataIndex, header, key)
{
	if (gridPanel == null || gridPanel == undefined || gridPanel.getColumnModel == undefined)
	{
		return;
	}

	var columnModel = gridPanel.getColumnModel();
	if (columnModel == null)
	{
		return;
	}

	var intColumnIndex = columnModel.getColumnIndexByDataIndex(strDataIndex);
	if (intColumnIndex < 0)
	{
		return;
	}

	var label = "";
	if (key != undefined && key != null && key != "")
	{
		label = ssc.core.common.FormFieldAttrUtil.getLabelByKey(header, key);
	}
	else
	{
		label = header;
	}

	columnModel.setColumnHeader(intColumnIndex, label);
};

/**
 * 设置表格列头显示必填样式
 */
ssc.core.common.FormFieldAttrUtil.setColumnHeaderKey = function(gridPanel, strDataIndex, key)
{
	if (gridPanel == null || gridPanel == undefined || gridPanel.getColumnModel == undefined)
	{
		return;
	}

	var columnModel = gridPanel.getColumnModel();
	if (columnModel == null)
	{
		return;
	}

	var intColumnIndex = columnModel.getColumnIndexByDataIndex(strDataIndex);
	if (intColumnIndex < 0)
	{
		return;
	}

	var label = ssc.core.common.FormFieldAttrUtil.getLabelByKey(columnModel.getColumnHeader(intColumnIndex), key);

	columnModel.setColumnHeader(intColumnIndex, label);
};

/**
 * 设置表格列访问控制属性
 * param：
 * config			配置
 * gridPanel		表格对象
 * strDataIndex		表格列索引
 */
ssc.core.common.FormFieldAttrUtil.setColumnAttr = function(config, gridPanel, strDataIndex)
{
	var columnModel = gridPanel.getColumnModel();

	var intColumnIndex = columnModel.getColumnIndexByDataIndex(strDataIndex);

	if (intColumnIndex < 0)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil, gridPanel[" + gridPanel.id + "]中列[" + strDataIndex + "]未找到，忽略该配置");

		return;
	}

	var cellEditor = columnModel.getCellEditor(intColumnIndex);

	/* 设置标签 */
	var columnLabelAttr = config.getColumnLabel(gridPanel.id, strDataIndex);
	if (columnLabelAttr != "none")
	{
		if (config.getColumnKey(gridPanel.id, strDataIndex))
		{
			columnModel.setColumnHeader(intColumnIndex, columnLabelAttr + "<font color='red'>*</font>");
		}
		else
		{
			columnModel.setColumnHeader(intColumnIndex, columnLabelAttr);
		}
	}

	/* 设置文本对齐 */
	var columnAlignAttr = config.getColumnAlign(gridPanel.id, strDataIndex);
	if (columnAlignAttr == ssc.core.common.FieldAlignEnum.Left)
	{
		columnModel.config[intColumnIndex].css = "text-align:left;";
	}
	else if (columnAlignAttr == ssc.core.common.FieldAlignEnum.Center)
	{
		columnModel.config[intColumnIndex].css = "text-align:center;";
	}
	else if (columnAlignAttr == ssc.core.common.FieldAlignEnum.Right)
	{
		columnModel.config[intColumnIndex].css = "text-align:right;";
	}
	else
	{
		/* 其他不处理 */
	}

	/* 设置宽度 */
	columnModel.setColumnWidth(intColumnIndex, config.getColumnWidth(gridPanel.id, strDataIndex));

	/* 设置数据类型 */
	var columnTypeAttr = config.getColumnType(gridPanel.id, strDataIndex);
	if (columnTypeAttr == ssc.core.common.FieldTypeEnum.Text)
	{
		/* 文本类型，不处理 */
	}
	else if (columnTypeAttr == ssc.core.common.FieldTypeEnum.Date)
	{
		/* 日期字段，标准日期格式，居中 */
		columnModel.config[intColumnIndex].css = "text-align:center;";
		if (cellEditor != null && cellEditor.field != null && cellEditor.field != undefined)
		{
			var field = cellEditor.field;

			field.style = "text-align:left";
			field.format = "Y-m-d";
			field.invalidText = "【{0}】是无效的日期格式，请采用如下格式输入：2013-01-01";
		}
	}
	else if (columnTypeAttr == ssc.core.common.FieldTypeEnum.Time)
	{
		/* 时间字段，标准时间格式，居中 */
		columnModel.config[intColumnIndex].css = "text-align:center;";
		if (cellEditor != null && cellEditor.field != null && cellEditor.field != undefined)
		{
			var field = cellEditor.field;

			field.format = "H:i:s";
			field.invalidText = "【{0}】是无效的时间格式，请采用如下格式输入：18:05:05";
		}
	}
	else if (columnTypeAttr == ssc.core.common.FieldTypeEnum.Integer)
	{
		/* 整数字段，靠右对齐，无小数位 */
		columnModel.config[intColumnIndex].css = "text-align:right;";
	}
	else if (columnTypeAttr == ssc.core.common.FieldTypeEnum.Float)
	{
		/* 小数字段，靠右对齐，有小数位 */
		columnModel.config[intColumnIndex].css = "text-align:right;";
	}
	else if (columnTypeAttr == ssc.core.common.FieldTypeEnum.Money)
	{
		/* 金额字段，靠右对齐，标准金额格式(千分位、2位小数) */
		columnModel.config[intColumnIndex].css = "text-align:right;";
		columnModel.config[intColumnIndex].renderer = ssc.common.RenderUtil.RenderMoney_ThirteenFont;

		columnModel.config[intColumnIndex].xy_PrintDataFormat = "money";
	}
	else if (columnTypeAttr == ssc.core.common.FieldTypeEnum.Percent)
	{
		/* 百分比(千分位、2位小数、百分号) */
		columnModel.config[intColumnIndex].css = "text-align:right;";
		columnModel.config[intColumnIndex].renderer = ssc.common.RenderUtil.Percent100;
	}
	else
	{
		/* 其他不处理 */
	}

	/* 设置汇总类型 */
	var columnSumTypeAttr = config.getColumnSumType(gridPanel.id, strDataIndex);
	if (columnSumTypeAttr == ssc.core.common.SummaryTypeEnum.None)
	{
		columnModel.config[intColumnIndex].summaryType = "";
	}
	else
	{
		columnModel.config[intColumnIndex].summaryType = columnSumTypeAttr;
	}

	/* 设置汇总字段 */
	var columnSumFieldAttr = config.getColumnSumField(gridPanel.id, strDataIndex);
	if (columnSumFieldAttr != "")
	{
		columnModel.config[intColumnIndex].XySumToCom = columnSumFieldAttr;
	}
};


/**
 * XyCalcRecord记录属性设置入口
 * fieldAttrConfig	表单组件通用属性配置
 */
ssc.core.common.FormFieldAttrUtil.setXyCalcRecordAttr = function(/* jsonString */ fieldAttrConfig, strGridPanelID, /* Ext.data.XyCalcRecord */record)
{
	if (fieldAttrConfig == undefined || fieldAttrConfig == null)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil.setXyCalcRecordAttr, fieldAttrConfig == null，忽略该配置");

		return;
	}
	var config = new ssc.core.common.FormFieldAttrConfig(fieldAttrConfig);

	var gridPanel = Ext.getCmp(strGridPanelID);
	if (gridPanel == null)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil.setXyCalcRecordAttr, gridPanel[" + strGridPanelID + "]不存在，忽略该配置");

		return;
	}

	var intIndex = config.getGridPanelIDList().indexOf(strGridPanelID);
	if (intIndex < 0)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil.setXyCalcRecordAttr, gridPanel[" + strGridPanelID + "]的配置不存在");

		return;		
	}

	if (record == undefined || record == null)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil.setXyCalcRecordAttr, record == null，忽略该配置");

		return;
	}

	for (var i = 0; i < config.getColumnDataIndexList(strGridPanelID).length; i++)
	{
		var strColumnDataIndex = config.getColumnDataIndexList(strGridPanelID)[i];

		ssc.core.common.FormFieldAttrUtil.setXyCalcRecordFieldAttr(config, strGridPanelID, strColumnDataIndex, record);
	}
};

/**
 * 设置表格列访问控制属性
 * param：
 * config			配置
 * strGridPanelID	表格ID
 */
ssc.core.common.FormFieldAttrUtil.setXyCalcRecordFieldAttr = function(config, strGridPanelID, strDataIndex, /* Ext.data.XyCalcRecord */record)
{
	var field = record.getField(strDataIndex);
	if (field == null)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormFieldAttrUtil, gridPanel[" + strGridPanelID + "]中的XyCalcRecord中字段[" + strDataIndex + "]未找到，忽略该配置");

		return;
	}

	/* 设置isCalcOnLoad */
	field.xy_isCalcOnLoad = config.getColumnIsCalcOnLoad(strGridPanelID, strDataIndex);

	/* 设置isCalcOnEditable */
	field.xy_isCalcOnEditable = config.getColumnIsCalcOnEditable(strGridPanelID, strDataIndex);

	/* 设置expression */
	var expression = config.getColumnExpression(strGridPanelID, strDataIndex);
	if (expression != null)
	{
		field.calc = expression.createFunction().createDelegate(expression);
		field.dependencies = expression.createDependencies();
	}

	/* 设置isValueChange */
	field.notDirty = ! config.getColumnIsValueChange(strGridPanelID, strDataIndex);
};

