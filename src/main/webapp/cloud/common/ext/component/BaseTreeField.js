Ext.namespace("ssc.component");

ssc.component.BaseTreeField = Ext.extend(Ext.form.TwinTriggerField,
{
	/* 关键属性，必须保留 */
	allowBlur : true,

	/**
	 * ==========默认值==========
	 */
	readOnly : true,
	trigger1Class : "x-form-search-trigger",
	trigger2Class : "x-form-clear-trigger",
	emptyText : "请选择...",

	/**
	 * ==========外观与行为==========
	 */
	/* 选择窗体宽度 */
	xy_WinWidth : 400,
	/* 选择窗体高度 */
	xy_WinHeight : 320,

	/* 是否显示根节点 */
	xy_RootVisible : true,
	/* 根节点名称 */
	xy_RootTitle : "请选择",
	/**
	 * 是否只允许选择末级<br>
	 * 单选模式下，不能点击或双击中间级来选择<br>
	 * 多选模式下，中间级没有选择框<br>
	 */
	xy_LeafOnly : true,
	/* 多选模式 */
	xy_MultiSelectMode : false,
	/* 是否展现默认右键菜单 */
	xy_ShowContextMenu : true,
	/**
	 * 点击即选定模式<br>
	 * 在部分组件(例如BaseTreeComboBox)，点击后即选定，不需要展开下级
	 */
	xy_ClickSelectMode : false,
	/* 是否关联下级 */
	xy_LinkLower : false,
	/* 是否允许输入 */
	xy_AllowInput : false,

	/**
	 * 组件支持的表格类型
	 * extgrid - Ext.grid.EditorGridPanel;
	 * xygrid - Ext.grid.XyEditorGridPanel
	 */
	xy_GridType : "extgrid",

	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	/**
	 * ==========数据加载==========
	 */
	/* 取数action */
	xy_DataActionURL : "",
	/* 取数SQL存放路径 */
	xy_SQLPath : "",
	/* 取数SQL脚本文件名(根节点) */
	xy_SQLFile : "",
	/* 取数SQL脚本文件名(非根节点) */
	xy_SQLFile2 : "",
	/* 取数存储过程脚本文件名 */
	xy_ProcFile : "",
	/* 是否采用新版本的存储过程读取方式 */
	xy_NewProcAction : false,

	/**
	 * 初始查询参数，支持数组和对象两种格式<br>
	 * 数组：[ {name : "status", value : "1"}, {name : "name", value : "杭州"} ]<br>
	 * 对象：{ status : "1", name : "杭州" }<br>
	 */
	xy_BaseParams : null,
	/* 查询参数是否序列化 */
	xy_ParamJsonSerialize : true,

	/**
	 * ==========初始化==========
	 */
	/* 初始已选择项 */
	xy_InitDataID : "",
	/* 初始是否展开 */
	xy_InitExpand : true,
	/* 初始全部展开 */
	xy_InitExpandAll : false,
	/* 初始展开级别 */
	xy_InitExpandLevel : 0,

	/**
	 * ==========事件==========
	 */
	/* 调用方对象 */
	xy_ParentObjHandle : null,
	/* 点击“清除”按钮后的回调函数 */
	xy_ClearClickEvent : Ext.emptyFn,

	/**
	 * ==========内部成员==========
	 */
	/* 窗体 */
	m_Dialog : null,
	m_ID : "",
	m_Data : null,

	/* 上次查询参数 */
	m_PreBaseParams : {},

	/* 是否第一次查询数据 */
	m_blFirst : false,
	/* 是否从对话框中选择了数据 */
	m_blDialogSelected : false,
	/* 是否手工输入了数据 */
	m_blInputed : false,
	/**
	 * 外部编辑器，支持XyGridPanel体系
	 */
	outterEditor : null,

	initComponent : function()
	{
		this.xy_KeyField = "id";
		this.xy_DisplayField = "text";

		this.valueField = this.xy_KeyField;
		this.displayField = this.xy_DisplayField;

		this.m_ID = this.xy_InitDataID;

		this.onTrigger1Click = this.btn_OpenWinEvent;
		this.onTrigger2Click = this.btn_ClearWinEvent;

		this.readOnly = ! this.xy_AllowInput;

		ssc.component.BaseTreeField.superclass.initComponent.call(this);

		if (this.xy_ParentObjHandle !== null && typeof (this.xy_ParentObjHandle) === "object")
		{
			if (this.xy_ClearClickEvent !== null && this.xy_ClearClickEvent !== undefined)
			{
				this.on("btn_clear", this.xy_ClearClickEvent, this.xy_ParentObjHandle);
			}
			if (this.xy_ValueChangeEvent !== null && this.xy_ValueChangeEvent !== undefined)
			{
				this.on("valuechange", this.xy_ValueChangeEvent, this.xy_ParentObjHandle);
			}
			if (this.xy_AllowInput)
			{
				this.on("change", this.onChangeEvent, this);
			}
		}
	},
	/**
	 * @private
	 * 输入值后处理
	 */	
	onChangeEvent : function(/*Ext.form.Field*/ _This, /*Mixed*/ newValue, /*Mixed*/ oldValue)
	{
		if (! ssc.common.StringUtil.isEmpty(newValue.toString().trim()))
		{
			this.m_blInputed = true;
			this.m_blDialogSelected = false;
			
			this.m_ID = "";
		}
		else
		{
			this.m_blInputed = false;
			this.m_blDialogSelected = true;
		}
	},
	btn_OpenWinEvent : function()
	{
		if (this.disabled)
		{
			return;
		}

		/* 点“选择”按钮前，验证方法（不支持提示框） */
		if (this.baseBeforeClickValid() !== true)
		{
			return;
		}

		/* 点“选择”按钮前，验证方法（支持提示框） */
		if (this.xy_beforeSelectValid != null
				&& this.xy_beforeSelectValid != undefined
				&& this.xy_beforeSelectValid != Ext.emptyFn
				&& typeof(this.xy_beforeSelectValid) == "function")
		{
			this.xy_beforeSelectValid();

			return;
		}

		/* 实际处理过程  */
		this.clickSelectButtonProcess();
	},
	/**
	 * 点击“选择”按钮前，验证方法。(不支持提示框)
	 * @private
	 * @abstract
	 */
	baseBeforeClickValid : function()
	{
		return true;
	},
	/**
	 * 点击“选择”按钮前，验证方法。(支持提示框)
	 * 由子类实现
	 * @private
	 * @abstract
	 * @param
	 */
	xy_beforeSelectValid : Ext.emptyFn,
	/**
	 * 验证通过
	 */
	xy_beforeSelectValidPass : function()
	{
		this.clickSelectButtonProcess();
	},
	/**
	 * 点击“选择”按钮后，实际的处理过程
	 */
	clickSelectButtonProcess : function()
	{
		this.m_blDialogSelected = false;

		if (this.m_Dialog == null)
		{
			this.m_blFirst = true;

			this.createDialog();

			Ext.apply(this.m_Dialog, this.xy_WinParams);
		}
		this.m_Dialog.on("result_ok", this.onOKClickEvent, this);

		if (this.outterEditor != null)
		{
			this.outterEditor.el.hide();
		}
		
		this.m_Dialog.show();

		/* 传入查询参数与上次不同，则重新查询并加载数据
		 * 第一次打开，不会重新查询
		 */
		var params = this.getBaseParams();

		if (! ssc.common.loadStoreParamCompare(this.m_PreBaseParams, params)
				&& !this.m_blFirst)
		{
			this.m_Dialog.loadStoreData(false);
		}

		this.m_PreBaseParams = params;
		this.m_blFirst = false;
	},
	/**
	 * @private
	 * @abstruct
	 * 创建对话框
	 */
	createDialog : function()
	{
		this.m_Dialog = new ssc.component.BaseTreeDialog(
		{
			title : this.xy_WinTitle,
			width : this.xy_WinWidth,
			height : this.xy_WinHeight,
			closeAction : "hide",

			xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
			xy_ButtonStyle : this.xy_ButtonStyle,
			xy_EditMode : ssc.component.DialogEditModeEnum.None,
			xy_RootVisible : this.xy_RootVisible,
			xy_RootTitle : this.xy_RootTitle,
			xy_LeafOnly : this.xy_LeafOnly,
			xy_MultiSelectMode : this.xy_MultiSelectMode,
			xy_ShowContextMenu : this.xy_ShowContextMenu,
			xy_ClickSelectMode : this.xy_ClickSelectMode,
			xy_LinkLower : this.xy_LinkLower,

			xy_DataActionURL : this.xy_DataActionURL,
			xy_SQLPath : this.xy_SQLPath,
			xy_SQLFile : this.xy_SQLFile,
			xy_SQLFile2 : this.xy_SQLFile2,
			xy_ProcFile : this.xy_ProcFile,
			xy_NewProcAction : this.xy_NewProcAction,
			xy_BaseParams : this.xy_BaseParams,
			xy_ParamJsonSerialize : this.xy_ParamJsonSerialize,
			prepareBaseParams : ((this.prepareBaseParams !== undefined) ? this.prepareBaseParams.createDelegate(this) : undefined),

			xy_InitDataID : this.xy_InitDataID,
			xy_InitExpand : this.xy_InitExpand,
			xy_InitExpandAll : this.xy_InitExpandAll,
			xy_InitExpandLevel : this.xy_InitExpandLevel,

			xy_ParentObjHandle : this.xy_ParentObjHandle,
			xy_OKClickEvent : this.xy_OKClickEvent
		});
	},
	getBaseParams : function()
	{
		var params = null;

		/* 读取基础查询参数 */
		if (this.xy_BaseParams != null || this.xy_BaseParams != undefined)
		{
			params = this.xy_BaseParams;
		}
		else
		{
			if (this.prepareBaseParams != null && this.prepareBaseParams != undefined
					&& typeof (this.prepareBaseParams) == "function")
			{
				params = this.prepareBaseParams();
			}
		}

		if (params == null)
		{
			params = {};
		}
		
		return params;
	},
	btn_ClearWinEvent : function()
	{
		if (this.disabled)
		{
			return;
		}

		/* 点“选择”按钮前，验证方法（支持提示框） */
		if (this.xy_beforeClearValid != null
				&& this.xy_beforeClearValid != undefined
				&& this.xy_beforeClearValid != Ext.emptyFn
				&& typeof(this.xy_beforeClearValid) == "function"
				&& this.xy_ParentObjHandle != null
				&& typeof(this.xy_ParentObjHandle) == "object")
		{
			this.xy_beforeClearValid.call(this.xy_ParentObjHandle, this);

			return;
		}

		this.clickClearButtonProcess();
	},
	/**
	 * 点击“清除”按钮前，验证方法。(支持提示框)
	 * 由子类实现
	 * @private
	 * @abstract
	 * @param
	 */
	 xy_beforeClearValid : Ext.emptyFn,
	/**
	 * 验证通过
	 */
	 xy_beforeClearValidPass : function()
	{
		this.clickClearButtonProcess();
	},
	clickClearButtonProcess : function()
	{
		this.clearSelections();

		this.setValue(null);

		if (this.outterEditor !== undefined && this.outterEditor != null)
		{
			this.outterEditor.completeEdit();
		}

		this.fireEvent("btn_clear", this);
	},
	onOKClickEvent : function()
	{
		this.m_blDialogSelected = true;
		this.m_blInputed = false;

		var oldValue = this.m_Data;
		var newValue = this.m_Dialog.getSelectedData();

		/* 2013-02-25 增加变化前值判断  */
		if (! this.compareValue(newValue, oldValue))
		{
			/* 验证未通过则取消变化动作 */
			if (this.xy_beforeValueChangeValid != null
					&& this.xy_beforeValueChangeValid != undefined
					&& this.xy_beforeValueChangeValid != Ext.emptyFn
					&& typeof(this.xy_beforeValueChangeValid) == "function"
					&& this.xy_ParentObjHandle != null
					&& typeof(this.xy_ParentObjHandle) == "object")
			{
				this.xy_beforeValueChangeValid.call(this.xy_ParentObjHandle, newValue, oldValue, this);

				return;
			}
		}

		this.valueChangeProcess(newValue, oldValue);
	},
	/**
	 * 比较前值与后值是否相同
	 * @private
	 */
	compareValue : function(newValue, oldValue)
	{
		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			return ssc.common.ArrayUtil.compareByAttr(newValue, oldValue, this.xy_KeyField);
		}
		else
		{
			/* 单选 */
			var newKey = "";
			if (newValue == null || newValue[this.xy_KeyField] == undefined)
			{
				newKey = "";
			}
			else
			{
				newKey = newValue[this.xy_KeyField];
			}

			var oldKey = "";
			if (oldValue == null || oldValue[this.xy_KeyField] == undefined)
			{
				oldKey = "";
			}
			else
			{
				oldKey = oldValue[this.xy_KeyField];
			}

			/* 单选 */
			return (newKey == oldKey);
		}
	},
	/**
	 * 选择数据后值变化前验证方法
	 * 由子类实现
	 * @private
	 * @abstract
	 * @param
	 * newValue	新值
	 * oldValue	旧值
	 */
	xy_beforeValueChangeValid : Ext.emptyFn,
	/**
	 * 验证通过
	 */
	xy_beforeValueChangeValidPass : function(newValue, oldValue)
	{
		if (newValue == null || newValue == undefined)
		{
			alert("xy_beforeValueChangeValidPass方法未获得newValue参数");
			return;
		}

		if (newValue == null || newValue == undefined)
		{
			alert("xy_beforeValueChangeValidPass方法未获得oldValue参数");
			return;
		}

		this.valueChangeProcess(newValue, oldValue);
	},
	/**
	 * 值变化后实际的处理过程
	 */
	valueChangeProcess : function(newValue, oldValue)
	{
		this.setValue(this.m_Dialog.getSelectedData());
		this.m_ID = this.m_Dialog.getSelectedID();
		this.m_Data = this.m_Dialog.getSelectedData();

		if (this.outterEditor == undefined || this.outterEditor == null)
		{
			this.setRawValue(this.m_Dialog.getSelectedText());
		}

		if (this.m_Dialog != null)
		{
			this.m_Dialog.hide();
		}

		if (this.outterEditor !== undefined && this.outterEditor != null)
		{
			this.outterEditor.completeEdit();
		}

/* 2013-02-25 判断值是否有变化
		if (oldValue != this.getValue())*/
		if (! this.compareValue(newValue, oldValue))
		{
			this.fireEvent("valuechange", newValue, oldValue, this);
		}
	},
	/**
	 * @public
	 * @override	Ext.form.ComboBox.getValue()
	 * 支持XyGridPanel体系
	 */
	getValue : function()
	{
		if (this.xy_GridType == "extgrid")
		{
			return ssc.component.BaseTreeField.superclass.getValue.call(this);
		}
		else if (this.xy_GridType == "xygrid")
		{
			if (this.rendered)
			{
				return this.getSelectedData();
			}
			else
			{
				return this.m_ID;
			}
		}
	},
	/**
	 * @public
	 * @override	Ext.form.ComboBox.setValue()
	 * setValue		支持XyGridPanel体系
	 */
	setValue : function(object)
	{
		if (typeof (object) == "string")
		{
			this.value = object;
			if (this.rendered)
			{
				this.setRawValue(object);
			}

			this.m_ID = object;
			this.m_Data = null;
		}
		else if (typeof (object) == "object")
		{
			var text = "";
			if (object === undefined || object === null || object === "")
			{
				text = "";
				this.value = null;

				this.m_ID = "";
				this.m_Data = null;
			}
			else
			{
				if (typeof(object) != "object")
				{
					object = JSON.parse(object);
				}

				this.value = object;
				if (object[this.displayField] != undefined)
				{
					text = object[this.displayField];
				}
				else
				{
					text = "";
				}

				if (object[this.valueField] != undefined)
				{
					this.m_ID = object[this.valueField];
				}
				else
				{
					this.m_ID = "";
				}

				if (this.xy_MultiSelectMode)
				{
					/* 多选 */
					if (ssc.common.ArrayUtil.isArray(object))
					{
						this.m_Data = object;
					}
					else
					{
						this.m_Data = new Array(object);
					}
				}
				else
				{
					/* 单选 */
					this.m_Data = object;
				}
			}
			this.lastSelectionText = text;

			if (this.rendered)
			{
				this.setRawValue(text);
			}
			this.validate();
		}
	},
	/**
	 * @public
	 * 返回选择项的valueField。
	 * 支持XyGridPanel体系
	 */
	getXyValue : function()
	{
		return this.getValue();
	},
	/**
	 * @public
	 * 设置对象定位。
	 * 支持XyGridPanel体系
	 */
	setXyValue : function(object)
	{
		this.setValue(object);
	},
/* ==================== */
	/**
	 * @public
	 * 获取选择项数量<br>
	 */
	getSelectedCount : function()
	{
		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			if ("" == this.m_ID.trim() || this.m_Data == null)
			{
				return 0;
			}
			else
			{
				return this.m_Data.length;
			}
		}
		else
		{
			/* 单选 */
			if ("" == this.m_ID.trim() || this.m_Data == null)
			{
				return 0;
			}
			else
			{
				return 1;
			}
		}
	},
	/**
	 * @public
	 * 是否选定
	 */
	getSelected : function()
	{
		return (this.getSelectedCount() > 0);
	},
	/**
	 * @public
	 * 是否输入
	 */
	getInputed : function()
	{
		return this.m_blInputed;
	},
	/**
	 * @public
	 * 获取所有选择数据的ID<br>
	 * 如单选，则返回TreeNode.id<br>
	 * 如多选，则返回TreeNode.id的字符串，逗号分隔<br>
	 * 不会查找未加载的节点<br>
	 */
	getSelectedID : function()
	{
		/* 如果对话框已创建，并且从中选择了数据 */
		return this.m_ID;
	},
	/**
	 * @public
	 * 获取所有选择数据的文本<br>
	 * 如单选，则返回TreeNode.text<br>
	 * 如多选，则返回TreeNode.text的字符串，逗号分隔<br>
	 * 不会查找未加载的节点<br>
	 */
	getSelectedText : function()
	{
		if (this.xy_DisplayField != undefined)
		{
			return this.getSelectedAttr(this.xy_DisplayField);
		}
	},
	/**
	 * @public
	 * 获取所有选择数据的数据<br>
	 * 如单选，则返回TreeNode.attributes<br>
	 * 如多选，则返回TreeNode.attributes的Array<br>
	 * 不会查找未加载的节点<br>
	 */
	getSelectedData : function()
	{
		return this.m_Data;
	},
	getSelectedAttr : function(attrname)
	{
		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			if (this.m_Data == null)
			{
				return "";
			}

			var attrList = new Array();
			for (var i = 0; i < this.m_Data.length; i++)
			{
				var entity = this.m_Data[i];

				if (entity != null && entity[attrname] != undefined)
				{
					attrList.push(entity[attrname]);
				}
			}

			return attrList.toString();
		}
		else
		{
			/* 单选 */
			if (this.m_Data != null && this.m_Data[attrname] != undefined)
			{
				return this.m_Data[attrname].toString();
			}
			else
			{
				return "";
			}
		}
	},
	/**
	 * @public
	 * 清除所有已选项<br>
	 * 不会查找未加载的节点<br>
	 */
	clearSelections : function()
	{
		if (this.m_Dialog != null)
		{
			this.m_Dialog.clearSelections();
		}

		this.m_blInputed = false;
		this.m_blDialogSelected = false;

		var oldID = this.m_ID;
		var oldvalue = this.getValue();

		if (this.rendered)
		{
			this.setRawValue("");
		}
		this.setValue(null);

		this.m_ID = "";

		if (oldID != "")
		{
			this.fireEvent("valuechange", "", oldvalue, this);
		}
	},
	/**
	 * @puvlic
	 * 设置初始值<br>
	 * 在初始化数据之前设置初始值<br>
	 */
	setInitValue : function(key, display)
	{
		var oldvalue = this.getValue();

		this.m_ID = key;

		/* this.setValue(display); */

		var value = {};
		value[this.valueField] = key;
		value[this.displayField] = display;
		this.setValue(value);

/* 2013-02-25 设值不触发
		if (this.rendered)
		{
			this.fireEvent("valuechange", this.m_ID, oldvalue, this);
		}*/
	}
});
Ext.reg("ssc.component.basetreetgfield", ssc.component.BaseTreeField);