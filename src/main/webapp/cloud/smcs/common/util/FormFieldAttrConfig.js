Ext.namespace("ssc.smcs.common");

/* 组件属性配置Demo */
ssc.smcs.common.DemoFieldAttrConfig =
{
	field :
	{
		/* 名称、key、对齐、fieldtype、[color]
		 * 
		 * 名称：为空，不处理
		 * key：key、空或none
		 * align：left、center、right、none
		 * 
		 * fieldtype：text、date、time、integer、float、money、none
		 * 其中
		 * 文本类型，不处理
		 * 日期字段，标准日期格式，靠左对齐
		 * 时间字段，标准时间格式，靠左对齐
		 * 整数字段，靠右对齐，无小数位
		 * 小数字段，靠右对齐，有小数位
		 * 金额字段，靠右对齐，标准金额格式(千分位、2位小数)
		 */
		busidate : 		[ "业务日期", "key", "left", "date" ],
		accountdate : 	[ "入账日期", "key", "left", "date" ],
		budgetperiodid : [ "预算控制期", "key", "left", "date" ],
		currency : 		[ "币种", "key", "left", "text" ],
		varabstract : 	[ "报账事由", "key", "left", "text" ],
		affixnum : 		[ "附件张数", "key", "right", "text" ],
		contractno : 	[ "合同编号", "", "left", "text" ],
		ctname : 		[ "合同名称", "", "left", "text" ],
		itemid : 		[ "项目编号", "", "left", "text" ],
		itemname : 		[ "项目名称", "", "left", "text" ],
		suppliercode : 	[ "供应商", "", "left", "text" ],
		suppliername : 	[ "供应商名称", "", "left", "text" ],
		supplieraddresscode : [ "供应商地点", "", "left", "text" ]
	},
	gridlist : [
	{
		gridid : "estimateinfo",
		/* 名称、key、对齐、宽度、fieldtype、summarytype、sumfield、iscalconload、iscalconeditable、expression、valuechange、[color]
		 * 
		 * 名称：为空，不处理
		 * key：key、空或none
		 * align：left、center、right、none
		 * width：应当大于0的数字
		 * 
		 * fieldtype：text、date、time、integer、float、money、none
		 * 其中
		 * 文本类型，不处理
		 * 日期字段，居中
		 * 时间字段，居中
		 * 整数字段，靠右对齐
		 * 小数字段，靠右对齐
		 * 金额字段，靠右对齐，标准金额格式(千分位、2位小数)
		 * 
		 * summarytype：汇总类型，支持sum、count、max、min、average、none。====================summaryType
		 * sumfield：汇总值赋值到组件上。=======================XySumToCom
		 *
		 * iscalconload：加载时列值计算calc是否生效。true、false
		 * iscalconeditable：列可编辑时列值计算calc是否生效。true、false
		 * expression：计算公式
		 * 支持一元运算a；
		 * 二元运算a + b、a - b、a * b、a / b，其中a、b可以为字段名或者数字常量；（以后会增加金额四舍五入）
		 * 
		 * valuechange：字段值变化后是否触发值变化事件，即计算是否往下传递。true传递、false不传递，notdirty
		 */

		/* 名称、key、对齐、宽度、fieldtype、summarytype、sumfield、iscalconload、iscalconeditable, expression, valuechange */
		econitemid : 	[ "经济事项", "key", "left", 150, "text", "none", "", false, false, "", false ],
		abstract : 		[ "报销说明", "key", "left", 150, "text", "none", "", false, false, "", false ],
/*		currency : 		[ "币种", "", "left", 80, "text", "none", "", false, false, "", false ],*/
		estimateaccu : 	[ "已计提金额", "", "right", 90, "money", "none", "", false, false, "", false ],
		amount : 		[ "本次计提金额", "key", "right", 90, "money", "sum", "", false, false, "", false ],
		finamount : 	[ "核定金额", "key", "right", 90, "money", "sum", "", false, false, "amount", true ],
		deptid : 		[ "支出部门", "key", "left", 100, "text", "none", "", false, false, "", false ],
		respnid : 		[ "预算责任中心", "", "left", 100, "text", "none", "", false, false, "", false ],
		indexid : 		[ "预算科目", "", "left", 100, "text", "none", "", false, false, "", false ],
		accountcode : 			[ "本方科目", "key", "left", 150, "text", "none", "", false, false, "", false ],
		subaccountcode : 		[ "本方子目", "key", "left", 120, "text", "none", "", false, false, "", false ],
		accountcode_credit : 	[ "对方科目", "key", "left", 150, "text", "none", "", false, false, "", false ],
		subaccountcode_credit :	[ "对方子目", "key", "left", 120, "text", "none", "", false, false, "", false ],
		memo : 			[ "备注", "", "left", 100, "text", "none", "", false, false, "", false ],
/*		exchangerate : 	[ "汇率(本币)", "", "right", 90, "float", "none", "", false, false, "", false ],*/
		amount_bc : 	[ "报账金额(本币)", "", "right", 90, "money", "sum", "", false, false, "amount", true ],
		finamount_bc : 	[ "核定金额(本币)", "", "right", 90, "money", "sum", "", false, false, "finamount", true ]
	},
	{
/*			gridid : "budget_gridpanel",
			respnname : 		[ "hidden", "hidden", "hidden" ],
			indexname : 		[ "hidden", "hidden", "hidden" ],
			cotroltype : 		[ "hidden", "hidden", "hidden" ],
			budget_finished : 	[ "hidden", "hidden", "hidden" ],
			budget_unfinished :	[ "hidden", "hidden", "hidden" ],
			budget_amount : 	[ "hidden", "hidden", "hidden" ],
			budget_balance :	[ "hidden", "hidden", "hidden" ]*/
	} ]
};

/**
 * 组件文本对齐属性枚举
 */
ssc.smcs.common.FieldAlignEnum = {};
ssc.smcs.common.FieldAlignEnum.Left = "left";
ssc.smcs.common.FieldAlignEnum.Center = "center";
ssc.smcs.common.FieldAlignEnum.Right = "right";
/*不做处理*/
ssc.smcs.common.FieldAlignEnum.None = "none";

/**
 * 组件字段类型枚举
 */
ssc.smcs.common.FieldTypeEnum = {};
ssc.smcs.common.FieldTypeEnum.Text = "text";
ssc.smcs.common.FieldTypeEnum.Date = "date";
ssc.smcs.common.FieldTypeEnum.Time = "time";
ssc.smcs.common.FieldTypeEnum.Integer = "integer";
ssc.smcs.common.FieldTypeEnum.Float = "float";
ssc.smcs.common.FieldTypeEnum.Money = "money";
ssc.smcs.common.FieldTypeEnum.Percent = "percent";
/*不做处理*/
ssc.smcs.common.FieldTypeEnum.None = "none";

/**
 * 汇总类型枚举
 */
ssc.smcs.common.SummaryTypeEnum = {};
ssc.smcs.common.SummaryTypeEnum.Sum = "sum";
ssc.smcs.common.SummaryTypeEnum.Count = "count";
ssc.smcs.common.SummaryTypeEnum.Max = "max";
ssc.smcs.common.SummaryTypeEnum.Min = "min";
ssc.smcs.common.SummaryTypeEnum.Average = "average";
/*不汇总*/
ssc.smcs.common.SummaryTypeEnum.None = "none";

/**
 * 字段组件配置属性参数对象
 */
ssc.smcs.common.FormFieldAttrParam = function()
{
	this.label = "none";
	this.key = "";
	this.align = "left";
	this.fieldtype = "text";
	this.color = "black";
};
/**
 * 表格列配置属性参数对象
 */
ssc.smcs.common.FormColumnAttrParam = function()
{
	this.label = "none";
	this.key = "";
	this.align = "left";
	this.width = 100;
	this.fieldtype = "text";
	this.sumtype = "";
	this.sumfield = "";
	this.isCalcOnLoad = false;
	this.isCalcOnEditable = false;
	this.expression = null;
	this.isValueChange = false;
};

/**
 * 表单组件属性配置参数类
 * param: fieldAttrConfig 组件属性配置
 */
ssc.smcs.common.FormFieldAttrConfig = function(fieldAttrConfig)
{
	if (fieldAttrConfig == undefined || fieldAttrConfig == null)
	{
		alert("FormFieldAttrConfig, 配置参数fieldAttrConfig == null");
		return;
	}

	/* 原始配置参数 */
	this._config = fieldAttrConfig;

	/* 表头的字段id列表 */
	this._fieldIDList = new Array();
	/* 表格面板的id列表 */
	this._gridPanelIDList = new Array();
	/* 表格列的dataindex列表 */
	this._gridPanelColumnDataIndexList = new Array();

	/* 初始化表单字段配置 */
	if (this._config.field == undefined)
	{
		alert("FormFieldAttrConfig, 组件属性参数缺少field属性");
		return;
	}

	if (this._config.gridlist == undefined)
	{
		alert("FormFieldAttrConfig, 组件属性参数缺少gridlist属性");
		return;
	}	

	if (! ssc.common.ArrayUtil.isArray(this._config.gridlist))
	{
		alert("FormFieldAttrConfig, 组件属性参数gridlist属性值格式不正确：不是数组");
		return;
	}

	for (var strFieldID in this._config.field)
	{
		if (typeof(this._config.field[strFieldID]) != "function")
		{
			this._fieldIDList.push(strFieldID);
		}
	}

	/* 初始化表格字段配置 */
	for (var i = 0; i < this._config.gridlist.length; i++)
	{
		var grid = this._config.gridlist[i];

		if (grid.gridid != undefined)
		{
			this._gridPanelIDList.push(grid.gridid);

			var columnDataIndexList = new Array();
			for (var strDataIndex in grid)
			{
				if (strDataIndex == "gridid")
				{
					continue;
				}

				if (typeof(grid[strDataIndex]) != "function")
				{
					columnDataIndexList.push(strDataIndex);
				}
			}

			this._gridPanelColumnDataIndexList.push(columnDataIndexList);
		}
	}

	/**
	 * 获得所有组件id列表
	 * return：	array
	 */
	this.getFieldIDList = function()
	{
		return this._fieldIDList;
	};

	/**
	 * 根据组件id，读取表头组件的访问属性
	 * param:
	 * strFieldID	表头组件字段
	 * return：		fieldAttrParam
	 */
	this.getFieldAttrParam = function(strFieldID)
	{
		var fieldAttrParam = new ssc.smcs.common.FormFieldAttrParam();

		if (this._config.field[strFieldID] == undefined)
		{
			return fieldAttrParam;
		}

		var field = this._config.field[strFieldID];
		if (! ssc.common.ArrayUtil.isArray(field))
		{
			alert("FormFieldAttrConfig, field中属性[" + strFieldID + "]配置参数不正确：不是数组");
			return fieldAttrParam;
		}

		if (field.length < 4)
		{
			alert("FormFieldAttrConfig, field中属性[" + strFieldID + "]配置参数不正确：没有足够的值");
			return fieldAttrParam;
		}

		fieldAttrParam.label = field[0];
		fieldAttrParam.key = field[1];
		fieldAttrParam.align = field[2];
		fieldAttrParam.fieldtype = field[3];

		return fieldAttrParam;
	};

	this.getFieldLabel = function(strFieldID)
	{
		var fieldAttrParam = this.getFieldAttrParam(strFieldID);

		if (fieldAttrParam.label.trim() == "none" || fieldAttrParam.label.trim() == "")
		{
			return "none";
		}
		else
		{
			return fieldAttrParam.label.trim();
		}
	};
	this.getFieldKey = function(strFieldID)
	{
		var fieldAttrParam = this.getFieldAttrParam(strFieldID);

		var strKeyAttr = fieldAttrParam.key.trim();
		if (strKeyAttr != "key" && strKeyAttr != "" && strKeyAttr != "none")
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, field中属性[" + strFieldID + "]的[key]参数不正确：配置值[" + strKeyAttr + "]不允许，只允许key或空");

			strKeyAttr = "";
		}

		if (strKeyAttr == "none")
		{
			strKeyAttr = "";
		}

		return strKeyAttr;
	};
	this.getFieldAlign = function(strFieldID)
	{
		var fieldAttrParam = this.getFieldAttrParam(strFieldID);

		var strAlignAttr = fieldAttrParam.align.trim();
		if (strAlignAttr != ssc.smcs.common.FieldAlignEnum.Left
				&& strAlignAttr != ssc.smcs.common.FieldAlignEnum.Center
				&& strAlignAttr != ssc.smcs.common.FieldAlignEnum.Right
				&& strAlignAttr != ssc.smcs.common.FieldAlignEnum.None)
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, field中属性[" + strFieldID + "]的[align]参数不正确：配置值[" + strAlignAttr + "]不允许，只允许left、center、right或none");

			strAlignAttr = ssc.smcs.common.AccessPropertyEnum.None;
		}

		return strAlignAttr;
	};
	this.getFieldType = function(strFieldID)
	{
		var fieldAttrParam = this.getFieldAttrParam(strFieldID);

		var strFieldTypeAttr = fieldAttrParam.fieldtype.trim();
		if (strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Text
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Date
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Time
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Integer
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Float
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Money
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Percent
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.None )
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, field中属性[" + strFieldID + "]的[align]参数不正确：配置值[" + strFieldTypeAttr + "]不允许，只允许text、date、time、integer、float、money或none");

			strFieldTypeAttr = ssc.smcs.common.AccessPropertyEnum.None;
		}

		return strFieldTypeAttr;
	};

	/**
	 * 获得所有表格面板id列表
	 * return：		array
	 */
	this.getGridPanelIDList = function()
	{
		return this._gridPanelIDList;
	};

	/**
	 * 根据表格面板id，获得所有列的dataIndex
	 * param：
	 * strGridPanelID	表格面板id
	 * return：		array
	 */
	this.getColumnDataIndexList = function(strGridPanelID)
	{
		var intIndex = this._gridPanelIDList.indexOf(strGridPanelID);

		if (intIndex >= 0 && intIndex < this._gridPanelColumnDataIndexList.length)
		{
			return this._gridPanelColumnDataIndexList[intIndex];
		}
		else
		{
			return [];
		}
	};

	/**
	 * 根据表格面板id和列dataindex，读取表格列的访问属性
	 * param：
	 * strGridPanelID		表格面板id
	 * strColumnDataIndex	列dataindex
	 * return：	FormColumnAttrParam
	 */
	this.getColumnAttrParam = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = new ssc.smcs.common.FormColumnAttrParam();
		if (this._config.gridlist == undefined)
		{
			return columnAttrParam;
		}

		if (! ssc.common.ArrayUtil.isArray(this._config.gridlist))
		{
			return columnAttrParam;
		}

		for (var i = 0; i < this._config.gridlist.length; i++)
		{
			var grid = this._config.gridlist[i];
			columnAttrParam = new ssc.smcs.common.FormColumnAttrParam();

			if (grid.gridid == undefined)
			{
				continue;
			}

			if (grid.gridid !== strGridPanelID)
			{
				continue;
			}

			if (grid[strColumnDataIndex] == undefined)
			{
				return columnAttrParam;
			}
			
			var column = grid[strColumnDataIndex];

			if (! ssc.common.ArrayUtil.isArray(column))
			{
				alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]配置参数不正确：不是数组");
				return columnAttrParam;
			}

			if (column.length < 11)
			{
				alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]配置参数不正确：没有足够的值");
				return columnAttrParam;
			}

			columnAttrParam.label = column[0];
			columnAttrParam.key = column[1];
			columnAttrParam.align = column[2];
			columnAttrParam.width = column[3];
			columnAttrParam.fieldtype = column[4];
			columnAttrParam.sumtype = column[5];
			columnAttrParam.sumfield = column[6];
			columnAttrParam.isCalcOnLoad = column[7];
			columnAttrParam.isCalcOnEditable = column[8];
			columnAttrParam.expression = column[9];
			columnAttrParam.isValueChange = column[10];
			return columnAttrParam;
		}
	};

	this.getColumnLabel = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		if (columnAttrParam.label.trim() == "none" || columnAttrParam.label.trim() == "")
		{
			return "none";
		}
		else
		{
			return columnAttrParam.label.trim();
		}
	};
	this.getColumnKey = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		var strKeyAttr = columnAttrParam.key.trim();
		if (strKeyAttr != "key" && strKeyAttr != "" && strKeyAttr != "none")
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[key]参数不正确：配置值[" + strKeyAttr + "]不允许，只允许key或空");

			strKeyAttr = "";
		}

		if (strKeyAttr == "none")
		{
			strKeyAttr = "";
		}

		return strKeyAttr;		
	};
	this.getColumnAlign = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		var strAlignAttr = columnAttrParam.align.trim();
		if (strAlignAttr != ssc.smcs.common.FieldAlignEnum.Left
				&& strAlignAttr != ssc.smcs.common.FieldAlignEnum.Center
				&& strAlignAttr != ssc.smcs.common.FieldAlignEnum.Right
				&& strAlignAttr != ssc.smcs.common.FieldAlignEnum.None)
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[align]参数不正确：配置值[" + strAlignAttr + "]不允许，只允许left、center、right或none");

			strAlignAttr = ssc.smcs.common.AccessPropertyEnum.None;
		}

		return strAlignAttr;
	};
	this.getColumnType = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		var strFieldTypeAttr = columnAttrParam.fieldtype.trim();
		if (strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Text
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Date
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Time
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Integer
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Float 
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Money 
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.Percent
				&& strFieldTypeAttr != ssc.smcs.common.FieldTypeEnum.None )
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[align]参数不正确：配置值[" + strFieldTypeAttr + "]不允许，只允许text、date、time、integer、float、money或none");

			strFieldTypeAttr = ssc.smcs.common.AccessPropertyEnum.None;
		}

		return strFieldTypeAttr;
	};
	this.getColumnWidth = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		var strFieldWidthAttr = columnAttrParam.width;
		if (! ssc.common.NumberUtil.isNumber(strFieldWidthAttr))
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[width]参数不正确：配置值[" + strFieldWidthAttr.toString() + "]不是数字");
			
			strFieldWidthAttr = 100;
		}

		if (strFieldWidthAttr <= 0)
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[width]参数不正确：配置值[" + strFieldWidthAttr.toString() + "]应当大于0");
			
			strFieldWidthAttr = 100;		
		}

		return strFieldWidthAttr;
	};
	this.getColumnSumType = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		var strFieldSumTypeAttr = columnAttrParam.sumtype.trim();
		if (strFieldSumTypeAttr == ssc.smcs.common.SummaryTypeEnum.Count
				|| strFieldSumTypeAttr == ssc.smcs.common.SummaryTypeEnum.Max
				|| strFieldSumTypeAttr == ssc.smcs.common.SummaryTypeEnum.Min
				|| strFieldSumTypeAttr == ssc.smcs.common.SummaryTypeEnum.Average)
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[sumtype]参数不正确：配置值[" + strFieldSumTypeAttr + "]不允许，count、max、min、average暂时不支持，只允许sum、none");

			strFieldSumTypeAttr = ssc.smcs.common.SummaryTypeEnum.None;
		}

		if (strFieldSumTypeAttr != ssc.smcs.common.SummaryTypeEnum.Sum
				&& strFieldSumTypeAttr != ssc.smcs.common.SummaryTypeEnum.None )
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[sumtype]参数不正确：配置值[" + strFieldSumTypeAttr + "]不允许，count、max、min、average暂时不支持，只允许sum、none");

			strFieldSumTypeAttr = ssc.smcs.common.AccessPropertyEnum.None;
		}

		return strFieldSumTypeAttr;
	};
	this.getColumnSumField = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		var strFieldSumTypeAttr = this.getColumnSumType(strGridPanelID, strColumnDataIndex);

		var strFieldSumFieldAttr = columnAttrParam.sumfield.trim();

		if (strFieldSumTypeAttr == ssc.smcs.common.SummaryTypeEnum.None
				&& strFieldSumFieldAttr != "" )
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[sumfield]参数不正确：未设置汇总类型[sumtype]，因此设置的汇总字段[" + strFieldSumFieldAttr + "]无效");

			strFieldSumFieldAttr = "";
		}

		return strFieldSumFieldAttr;
	};
	this.getColumnIsCalcOnLoad = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		var strFieldIsCalcOnLoad = columnAttrParam.isCalcOnLoad;
		if (strFieldIsCalcOnLoad != true && strFieldIsCalcOnLoad != false)
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[isCalcOnLoad]参数不正确：配置值[" + strFieldIsCalcOnLoad + "]不允许，不是一个正确的boolean值");

			strFieldIsCalcOnLoad = false;
		}

		return strFieldIsCalcOnLoad;
	};
	this.getColumnIsCalcOnEditable = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		var strFieldIsCalcOnEditable = columnAttrParam.isCalcOnEditable;
		if (strFieldIsCalcOnEditable != true && strFieldIsCalcOnEditable != false)
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[isCalcOnEditable]参数不正确：配置值[" + strFieldIsCalcOnEditable + "]不允许，不是一个正确的boolean值");

			strFieldIsCalcOnEditable = false;
		}

		return strFieldIsCalcOnEditable;
	};
	this.getColumnExpression = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		var strFieldExpression = columnAttrParam.expression.trim();
		if (strFieldExpression == "")
		{
			return null;
		}

		var expression = new ssc.smcs.common.Expression(strFieldExpression);

		return expression;
	};
	this.getColumnIsValueChange = function(strGridPanelID, strColumnDataIndex)
	{
		var columnAttrParam = this.getColumnAttrParam(strGridPanelID, strColumnDataIndex);

		var strFieldIsValueChange = columnAttrParam.isValueChange;
		if (strFieldIsValueChange != true && strFieldIsValueChange != false)
		{
			/* 断言 */
			DebugAssertUtil.alert("FormFieldAttrConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]的[isValueChange]参数不正确：配置值[" + strFieldIsValueChange + "]不允许，不是一个正确的boolean值");

			strFieldIsValueChange = false;
		}

		return strFieldIsValueChange;
	};
};