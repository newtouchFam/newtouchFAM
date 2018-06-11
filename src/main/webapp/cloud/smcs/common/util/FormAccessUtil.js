Ext.namespace("ssc.smcs.common");

/**
 * 表单访问控制属性设置工具类
 */
ssc.smcs.common.FormAccessUtil = {};

FormAccessUtil = ssc.smcs.common.FormAccessUtil;

/**
 * 表单整体访问控制属性设置接口
 * accessConfig	访问控制参数配置
 * tag			当前环节标志
 * arrayGridPanelID，为空表示配置全部表格
 */
ssc.smcs.common.FormAccessUtil.setFormAccess = function(/* jsonString */ accessConfig, /* String */ tag, /* array<string> */ arrayGridPanelID)
{
	var config = new ssc.smcs.common.FormAccessConfig(accessConfig, tag);

	/* 设置表头的组件访问控制属性 */
	for (var i = 0; i < config.getFieldIDList().length; i++)
	{
		var strFieldID = config.getFieldIDList()[i];

		var strFieldAccessProperty = config.getFieldAccessProperty(strFieldID);

		ssc.smcs.common.FormAccessUtil.setFieldAccess(strFieldID, strFieldAccessProperty);
	}

	/* 表格列的读写性 */
	for (var i = 0; i < config.getGridPanelIDList().length; i++)
	{
		var strGridPanelID = config.getGridPanelIDList()[i];

		if (arrayGridPanelID != null && ArrayUtil.isArray(arrayGridPanelID)
				&& arrayGridPanelID.indexOf(strGridPanelID) < 0)
		{
			continue;
		}

		ssc.smcs.common.FormAccessUtil.setGridAccess(config, strGridPanelID);
	}
};

/**
 * 设置组件访问控制属性
 * param：
 * strFieldID				组件ID
 * strFieldAccessProperty	组件访问控制属性
 */
ssc.smcs.common.FormAccessUtil.setFieldAccess = function(strFieldID, strFieldAccessProperty)
{
	var field = Ext.getCmp(strFieldID);
	if (field == null)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormAccessUtil, field中组件[" + strFieldID + "]未找到，忽略该配置");

		return;
	}

	if (! field.isDerive("field"))
	{
		/* 断言 */
		DebugAssertUtil.alert("FormAccessUtil, field中组件[" + strFieldID + "]不是从Field派生，忽略该配置");

		return;
	}

	if (strFieldAccessProperty == ssc.smcs.common.AccessPropertyEnum.Editable)
	{
		ssc.smcs.common.FormAccessUtil.setFieldEditable(field, true);
/*		field.disabled = false;*/
	}
	else if (strFieldAccessProperty == ssc.smcs.common.AccessPropertyEnum.ReadOnly)
	{
		ssc.smcs.common.FormAccessUtil.setFieldEditable(field, false);
/*		field.disabled = true;*/	
	}
	else if (strFieldAccessProperty == ssc.smcs.common.AccessPropertyEnum.Hidden)
	{
		ssc.smcs.common.FormAccessUtil.setFieldHidden(field, true);
/*		if (field.isDerive("textfield"))
		{
			field.hidden = true;
			field.hideLabel = true;
		}
		else
		{
			field.disabled = true;
		}*/
	}
	else
	{
		/* 其他配置属性不做处理 */		
	}
};

ssc.smcs.common.FormAccessUtil.setFieldEditable = function(field, blEditable)
{
/*	if (field.rendered)
	{
		if (blEditable)
		{
			field.enable();
		}
		else
		{
			field.disable();
		}
	}
	else
	{*/
		field.disabled = ! blEditable;
/*	}*/
};
ssc.smcs.common.FormAccessUtil.setFieldHidden = function(field, blHidden)
{
	if (field.rendered)
	{
		if (field.isDerive("textfield"))
		{
			if (blHidden)
			{
				field.hideLabel = true;
				field.hide();
			}
			else
			{
				field.hideLabel = false;
				field.show();
			}
		}
		else
		{
			if (blHidden)
			{
				field.hide();
			}
			else
			{
				field.show();
			}
		}
	}
	else
	{
		if (field.isDerive("textfield"))
		{
			field.hidden = blHidden;
			field.hideLabel = blHidden;
		}
		else
		{
			field.disabled = blHidden;
		}
	}
};
ssc.smcs.common.FormAccessUtil.setFieldHiddenEx = function(field, blHidden)
{
	if (blHidden)
	{
		field.getEl().up('.x-form-item').setDisplayed(false);
	}
	else
	{
		field.getEl().up('.x-form-item').setDisplayed(true);
	}
};

/**
 * 设置表格列访问控制属性
 * param：
 * config			访问控制配置
 * strGridPanelID	表格ID
 */
ssc.smcs.common.FormAccessUtil.setGridAccess = function(config, strGridPanelID)
{
	var gridPanel = Ext.getCmp(strGridPanelID);
	if (gridPanel == null || gridPanel == undefined)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormAccessUtil, gridPanel[" + strGridPanelID + "]不存在，忽略该配置");

		return;
	}

	if (gridPanel.getColumnModel == undefined && typeof(gridPanel.getColumnModel) != "function")
	{
		/* 断言 */
		DebugAssertUtil.alert("FormAccessUtil, gridPanel[" + strGridPanelID + "]中getColumnModel不是正确的function，忽略该配置");

		return;
	}
/*
	if (! gridPanel.isDerive("grid"))
	{
		return;
	}*/

	for (var i = 0; i < config.getColumnDataIndexList(strGridPanelID).length; i++)
	{
		var strColumnDataIndex = config.getColumnDataIndexList(strGridPanelID)[i];

		var strColumnAccessProperty = config.getColumnAccessProperty(strGridPanelID, strColumnDataIndex);

		ssc.smcs.common.FormAccessUtil.setColumnAccess(gridPanel, strColumnDataIndex, strColumnAccessProperty);
	}
};

/**
 * 设置表格列访问控制属性
 * param：
 * gridPanel				表格对象
 * strDataIndex				表格列字段名称
 * strColunnAccessProperty	表格列访问控制属性
 */
ssc.smcs.common.FormAccessUtil.setColumnAccess = function(gridPanel, strDataIndex, strColunnAccessProperty)
{
	var columnModel = gridPanel.getColumnModel();

	var intColumnIndex = columnModel.getColumnIndexByDataIndex(strDataIndex);

	if (intColumnIndex < 0)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormAccessUtil, gridPanel[" + gridPanel.id + "]中列[" + strDataIndex + "]未找到，忽略该配置");

		return;
	}

	var cellEditor = columnModel.getCellEditor(intColumnIndex);
	if (strColunnAccessProperty == ssc.smcs.common.AccessPropertyEnum.Editable)
	{
		ssc.smcs.common.FormAccessUtil.setColumnEditable(columnModel, strDataIndex, true);
	}
	else if (strColunnAccessProperty == ssc.smcs.common.AccessPropertyEnum.ReadOnly)
	{
		/* readonly 要保证显示 */
		columnModel.setHidden(intColumnIndex, false);

		ssc.smcs.common.FormAccessUtil.setColumnEditable(columnModel, strDataIndex, false);
	}
	else if (strColunnAccessProperty == ssc.smcs.common.AccessPropertyEnum.Hidden)
	{
		columnModel.setHidden(intColumnIndex, true);
	}
	else
	{
		/* 其他配置属性不做处理 */
	}
};

/**
 * 设置表格列是否可以编辑
 * 可编辑，会显示，并设置columnModel的editable，以及cellEditor的disable
 * 不可编辑，设置columnModel的editable，以及cellEditor的disable
 * param：
 * columnModel		表格列
 * strDataIndex		表格列索引
 * blEditable		可否编辑
 */
ssc.smcs.common.FormAccessUtil.setColumnEditable = function(columnModel, strDataIndex, blEditable)
{
	var intColumnIndex = columnModel.getColumnIndexByDataIndex(strDataIndex);

	if (intColumnIndex < 0)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormAccessUtil, 列[" + strDataIndex + "]未找到，忽略该配置");

		return;
	}

	var cellEditor = columnModel.getCellEditor(intColumnIndex);
	if (blEditable === true)
	{
		columnModel.setHidden(intColumnIndex, false);

		columnModel.setEditable(intColumnIndex, true);

		if (cellEditor != null && cellEditor.field != null && cellEditor.field != undefined)
		{
			var field = cellEditor.field;

			field.disabled = false;
		}
		else
		{
			/* 断言 */
			DebugAssertUtil.alert("FormAccessUtil, 列[" + strDataIndex + "]上editor未设置，该列不能设置为可编辑状态");
		}
	}
	else if (blEditable === false)
	{
		columnModel.setEditable(intColumnIndex, false);

		if (cellEditor != null && cellEditor.field != null && cellEditor.field != undefined)
		{
			var field = cellEditor.field;

			field.disabled = true;
		}
	}
};

/**
 * 设置表格列是否隐藏
 * param：
 * columnModel		表格列
 * strDataIndex		表格列索引
 * blHidden			可否隐藏
 */
ssc.smcs.common.FormAccessUtil.setColumnHidden = function(columnModel, strDataIndex, blHidden)
{
	var intColumnIndex = columnModel.getColumnIndexByDataIndex(strDataIndex);

	if (intColumnIndex < 0)
	{
		/* 断言 */
		DebugAssertUtil.alert("FormAccessUtil,列[" + strDataIndex + "]未找到，忽略该配置");

		return;
	}

	columnModel.setHidden(intColumnIndex, blHidden);
};

/**
 * TODO 根据流程操作设置表单整体读写性
 * 如表单不是新建(1)、待办(2)、草稿(6)中打开，则表单完全只读。
 * 所有界面组件都disable，所有字段都不能输入
 */
ssc.smcs.common.FormAccessUtil.disableFormByOperType = function(panelBase, panelBaseEx, arraySubGridPanel)
{
};