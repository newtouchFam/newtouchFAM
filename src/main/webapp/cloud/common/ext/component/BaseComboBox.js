Ext.namespace("ssc.component");

/**
 * @class 下拉框基类<br>
 * @extends Ext.form.ComboBox<br>
 *
 * 一、特性：<br>
 * 定义了以下标准的行为动作，部分功能由子类实现
 * 1.取数支持action、配置sql文件、配置procedure文件方式<br>
 * 2.支持外部传入固定查询参数<br>
 * 3.支持嵌入面板上独立使用，或嵌入XyEditorGridPanel作为编辑器<br>
 * 4.可以在构造时直接传入函数句柄，作为select和valuechange事件处理函数<br>
 * 4.允许同时显示选择和清除两个按钮，也可不显示清除按钮<br>
 * 5.对于列表选择，可自定义第一行为"全部"<br>
 * 6.允许传入ID或者数据作为已选择项，或默认选择第一项<br>
 * 7.支持重新加载数据<br>
 * 8.支持部分快捷键<br>
 * 9.支持部分新增加的读取数据和设置数据的方法<br>
 * 10.兼容Ext.app.XyComboBox和Ext.app.XyComboBoxEx组件，可以替换<br>
 *
 * 二、使用
 * 1.外观
 * fieldLabel、width、listWidth、xy_AllowClear
 * 2.数据
 * valueField、displayField、
 * xy_StoreFields、xy_DataActionURL、xy_SQLPath、xy_SQLFile、xy_SQLFile2、xy_ProcedurePath、xy_BaseParams、
 * 3.初始化
 * xy_InitLoadData、xy_InitDataID、xy_hasAll、xy_isInitSelect
 * 4.事件
 * xy_ParentObjHandle
 * xy_SelectEvent
 * xy_ValueChangeEvent
 * 实现abstract函数
 * prepareBaseParams	按照ssc.common.BaseCondition格式拼写查询条件，
 * 						以便在提交查询action参数时一起提交。
 * (未实现)baseBeforeClickValid	点“选择”按钮前，验证方法（不支持提示框）
 * 
 * (未实现)xy_beforeSelectValid			点击“选择”按钮前，验证方法。(支持提示框)
 * (未实现)xy_beforeSelectValidPass		xy_beforeSelectValid验证通过后，调用该方法
 * 
 * (未实现)xy_beforeClearValid			点击“清除”按钮前，验证方法。(支持提示框)
 * (未实现)xy_beforeClearValidPass		xy_beforeClearValid验证通过后，调用该方法
 * 
 * xy_beforeValueChangeValid		选择数据后值变化前验证方法。(支持提示框)
 * xy_beforeValueChangeValidPass	当xy_beforeValueChangeValid内验证通过后，调用该方法
 *
 * 5.方法
 * getValue、setValue、getXyValue、setXyValue、
 * getKeyValue、setKeyValue、getDisplayValue、getStore、
 * getItemCount、getSelected、getSelectedIndex、setSelectedIndex、
 * reload
 */
ssc.component.BaseComboBox = Ext.extend(Ext.form.ComboBox,
{
	/**
	 * ==========默认值==========
	 */
	fieldLabel : "",
	width : 200,
	mode : "remote",
	triggerAction : "all",
	validationEvent : false,	/* 不校验 */
	validateOnBlur : false, 	/* 不校验 */
	editable : false, 			/* 只读 */
	forceSelection : true,		/*必选不可输入*/
	blankText : "请选择...",
	emptyText : "请选择...",
	loadingText : "正在加载数据...",

	/**
	 * ==========外观与行为==========
	 */
	/**
	 * 组件支持的表格类型
	 * extgrid - Ext.grid.EditorGridPanel;
	 * xygrid - Ext.grid.XyEditorGridPanel
	 */
	xy_GridType : "extgrid",

	/* 是否显示清除按钮 */
	xy_AllowClear : true,

	/**
	 * ==========数据加载==========
	 */
	/**
	 * key字段名称和显示字段名称
	 * @inherit from Ext.form.ComboBox
	 */
	valueField : "",
	displayField : "",
	/* 字段列表 */
	xy_StoreFields : [],
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
	/**
	 * 初始选项参数
	 * {
	 * 	field : "year"
	 * 	value : 2011
	 * }
	 */
	xy_InitDataFieldValue : null,

	/**
	 * ==========事件==========
	 */
	/* 调用方对象 */
	xy_ParentObjHandle : null,
	/* 选择后触发事件(可能值没有改变) */
	xy_SelectEvent : Ext.emptyFn,
	/* 值改变后触发事件 */
	xy_ValueChangeEvent : Ext.emptyFn,
	
	/**
	 * ==========内部成员==========
	 */
	/* 外部编辑器，支持XyGridPanel体系 */
	outterEditor : null,
	/* 初始化值成员对象 */
	m_InitObj : {},

	/**
	 * 向下兼容
	 */
	/* @deprecated ssc.component.BaseComboBox.xy_AllowClear */
	XyAllowDelete : null,
	/* @deprecated ssc.component.BaseComboBox.xy_Fields*/
	fields : null,
	/* @deprecated ssc.component.BaseComboBox.xy_DataActionURL */
	dataUrl : null,
	/* @deprecated ssc.component.BaseComboBox.xy_SQLPath */
	scriptPath : null,
	/* @deprecated ssc.component.BaseComboBox.xy_SQLFile */
	sqlFile : null,	
	/* @deprecated ssc.component.BaseComboBox.xy_SQLFile */
	firstSqlFile : null,
	/* @deprecated ssc.component.BaseComboBox.xy_SQLFile2 */
	otherSqlFile : null,
	/* @deprecated ssc.component.BaseComboBox.xy_ProcFile */
	sqlProcFile : null,
	/* @deprecated ssc.component.BaseComboBox.xy_BaseParams */
	param : null,

	initComponent : function()
	{
		/* 参数向下兼容 */
		this.initArguCompatible();

		ssc.component.BaseComboBox.superclass.initComponent.call(this);
		
		/* 初始化按钮 */
		this.initButton();

		/* 初始化数据源 */
		this.initStore();

		/* 绑定选择事件 */
		this.initEvent();
	},
	/**
	 * @private
	 * 参数向下兼容
	 */
	initArguCompatible : function()
	{
		if (this.XyAllowDelete != null)
		{
			this.xy_AllowClear = this.XyAllowDelete;
		}
		if (this.fields != null)
		{
			this.xy_StoreFields = this.fields;
		}
		if (! ssc.common.StringUtil.isEmpty(this.dataUrl))
		{
			this.xy_DataActionURL = this.dataUrl;
		}
		if (this.param != null)
		{
			this.xy_BaseParams = this.param;
		}
		if (! ssc.common.StringUtil.isEmpty(this.scriptPath))
		{
			this.xy_SQLPath = this.scriptPath;
		}
		if (! ssc.common.StringUtil.isEmpty(this.sqlFile))
		{
			this.xy_SQLFile = this.sqlFile;
		}
		if (! ssc.common.StringUtil.isEmpty(this.firstSqlFile))
		{
			this.xy_SQLFile = this.firstSqlFile;
		}
		if (! ssc.common.StringUtil.isEmpty(this.otherSqlFile))
		{
			this.xy_SQLFile2 = this.otherSqlFile;
		}
		if (! ssc.common.StringUtil.isEmpty(this.sqlProcFile))
		{
			this.xy_ProcFile = this.sqlProcFile;
		}
	},
	/**
	 * @private 初始化按钮
	 */
	initButton : function()
	{
		if (this.xy_AllowClear)
		{
			this.triggerConfig =
			{
				tag : "span",
				cls : "x-form-twin-triggers",
				cn : [
				{
					tag : "img",
					src : Ext.BLANK_IMAGE_URL,
					cls : "x-form-trigger x-form-arrow-trigger"
				},
				{
					tag : "img",
					src : Ext.BLANK_IMAGE_URL,
					cls : "x-form-trigger x-form-clear-trigger"
				} ]
			};
		}
		else
		{
			this.triggerConfig =
			{
				tag : "span",
				cls : "x-form-twin-triggers",
				cn : [
				{
					tag : "img",
					src : Ext.BLANK_IMAGE_URL,
					cls : "x-form-trigger x-form-arrow-trigger"
				} ]
			};
		}
	},
	/**
	 * @private
	 * @override	Ext.form.TriggerField.initTrigger
	 * copy from 	Ext.form.TwinTriggerField.initTrigger
	 */
    initTrigger : function()
	{
		var ts = this.trigger.select('.x-form-trigger', true);
		this.wrap.setStyle('overflow', 'hidden');
		var triggerField = this;
		ts.each(function(t, all, index)
		{
			t.hide = function()
			{
				var w = triggerField.wrap.getWidth();
				this.dom.style.display = 'none';
				triggerField.el.setWidth(w - triggerField.trigger.getWidth());
			};
			t.show = function()
			{
				var w = triggerField.wrap.getWidth();
				this.dom.style.display = '';
				triggerField.el.setWidth(w - triggerField.trigger.getWidth());
			};
			var triggerIndex = 'Trigger' + (index + 1);

			if (this['hide' + triggerIndex])
			{
				t.dom.style.display = 'none';
			}
			t.on("click", this['on' + triggerIndex + 'Click'], this,
			{
				preventDefault : true
			});
			t.addClassOnOver('x-form-trigger-over');
			t.addClassOnClick('x-form-trigger-click');
		}, this);
		this.triggers = ts.elements;
	},
	onTrigger1Click : function()
	{
		this.onTriggerClick();
	},
	onTrigger2Click : function()
	{
		if (this.disabled)
		{
			return;
		}

		var oldValue = this.getValue();
		this.setValue(null);
		if (oldValue != null)
		{
			this.fireEvent("valuechange", this, oldValue, null);
		}
	},
	/**
	 * @private
	 * @abstract	在子类中实现
	 * 初始化store
	 */
	initStore : function()
	{
	},
	/**
	 * @private
	 * @abstract	在子类中实现
	 * Store准备查询参数
	 */
	onStoreBeforeLoadEvent : function(/* Store this*/ store, /*Object options*/ options)
	{
	},
	/**
	 * @private
	 * @abstract	在子类中实现
	 * 构造查询参数
	 */
	prepareBaseParams : function()
	{
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
	xy_beforeValueChangeValidPass : function(newValue, oldValue, _this, record, index)
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

		if (_this == null || _this == undefined)
		{
			alert("xy_beforeValueChangeValidPass方法未获得_this参数");
			return;
		}
		
		if (record == null || record == undefined)
		{
	        record = _this.store.getAt(index);
		}

		if (record == null || record == undefined)
		{
	        index = _this.view.getSelectedIndexes()[0];
		}

		this.valueChangeProcess(newValue, oldValue, _this, record, index);
	},
	/**
	 * 初始化事件
	 */
	initEvent : function()
	{
		/* 绑定选择事件 */
		this.on("select", this.xy_SelectEvent, this.xy_ParentObjHandle);

		/* 绑定值变更事件 */
		this.on("valuechange", this.onValueChangeEvent, this);
		this.on("valuechange", this.xy_ValueChangeEvent, this.xy_ParentObjHandle);

		/* 初始化刷新 */
		this.on("render", this.onRenderEvent, this);

		/* 快捷键 */
		this.on("specialkey", this.onSpecialKeyEvent, this);
	},
	/**
	 * @override Ext.form.ComboBox.onSelect
	 */
	onSelect : function(record, index)
	{
		if (record == null)
		{
			return;
		}
		if (this.fireEvent("beforeselect", this, record, index) === false)
		{
			return;
		}

		var oldValue = this.value;
		var newValue = record.data;
		if (! this.compareValue(newValue, oldValue))
		{
			/* 2013-02-25 增加变化前值判断  */
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

		this.valueChangeProcess(newValue, oldValue, this, record, index);
	},
	/**
	 * 比较前值与后值是否相同
	 * @private
	 */
	compareValue : function(newValue, oldValue)
	{
		return ! (oldValue == null || oldValue[this.valueField] != newValue[this.valueField]);
	},
	/**
	 * 值变化后实际的处理过程
	 */
	valueChangeProcess : function(newValue, oldValue, _this, record, index)
	{
		if (! this.compareValue(newValue, oldValue))
		{
			this.fireEvent("valuechange", this, oldValue, newValue);
		}

		this.collapse();

		if (this.outterEditor !== undefined && this.outterEditor != null)
		{
			this.outterEditor.completeEdit();
		}

		this.fireEvent("select", _this, record, index);
	},
	/**
	 * @private
	 * 值变动后内置处理过程
	 */
	onValueChangeEvent : function(_this, oldValue, newValue)
	{
		this.setValue(newValue);
	},
	/**
	 * @private
	 * 不可override Ext.form.ComboBox.onRender
	 */
	onRenderEvent : function()
	{
		if (this.value != null)
		{
			this.setValue(this.value);
		}
	},
	/**
	 * @private
	 * 快捷键事件
	 */
	onSpecialKeyEvent : function(/* Ext.form.Field */_this, /* Ext.EventObject */e)
	{
		if (e.getKey() == e.ENTER)
		{
			this.onTrigger1Click();
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
			if (this.rendered)
			{
				return ssc.component.BaseComboBox.superclass.getValue.call(this);
			}
			else
			{
				return this.m_InitObj;
			}
		}
		else if (this.xy_GridType == "xygrid")
		{
			if (this.rendered)
			{
				return this.value;
			}
			else
			{
				return this.m_InitObj;
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
			ssc.component.BaseComboBox.superclass.setValue.call(this, object);
		}
		else if (typeof (object) == "object")
		{
/* 2015-06-19支持设置对象
			if (this.rendered)
			{
*/
			var text = "";
			if (object === undefined || object === null || object === "")
			{
				text = "";
				this.value = null;
			}
			else
			{
				if (typeof(object) != "object")
				{
					object = JSON.parse(object);
				}

				this.value = object;
				text = object[this.displayField];
			}
			this.lastSelectionText = text;

			if (this.rendered)
			{
				this.setRawValue(text);
			}
			this.validate();
/* 2015-06-19支持设置对象
			}
*/
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
	/**
	 * @public
	 * 返回选择项的valueField，即ID
	 */
	getKeyValue : function()
	{
		var v = this.getValue();
		if (v != null && v[this.valueField] != null)
		{
			return v[this.valueField];
		}
		else
		{
			return "";
		}
	},
	/**
	 * @public
	 * @abstract
	 * 设置选择项的valueField定位
	 */
	setKeyValue : function(key)
	{
	},
	/**
	 * @public
	 * 按照其他字段定位，可用其他关键字段
	 */
	setFieldValue : function(fieldname, value)
	{
	},
	/**
	 * @public
	 * 返回选择项的displayField，即显示名称
	 */
	getDisplayValue : function()
	{
		var v = this.getValue();
		if (v != null && v[this.displayField] != null)
		{
			return v[this.displayField];
		}
		return "";
	},
	/**
	 * @public
	 * 获取数据Store
	 */
	getStore : function()
	{
		return this.store;
	},
	/**
	 * @public
	 * 获取选择项数量
	 */
	getItemCount : function()
	{
		return this.store.getCount();
	},
	/**
	 * @public
	 * 是否选定
	 */
	getSelected : function()
	{
		return (this.getValue() != null
				&& this.getValue() != ""
				&& this.getKeyValue() != "");
	},
	/**
	 * @public 获取选择项索引号
	 */
	getSelectedIndex : function()
	{
		return this.selectedIndex;
	},
	/**
	 * @public
	 * @abstract	BaseComboBox和BaseSimpleComboBox的实现方式不同，在子类实现
	 * 按照索引号定位选择项
	 */
	setSelectedIndex : function(index)
	{
	},
	/**
	 * @puvlic
	 * 设置初始值<br>
	 * 在初始化数据之前设置初始值<br>
	 */
	setInitValue : function(key, display)
	{
		var initValue = {};
		initValue[this.valueField] = key;
		initValue[this.displayField] = display;

		if (this.rendered)
		{
			this.setValue(initValue);
		}
		else
		{
			this.m_InitObj = initValue;

			this.on("render", this.onInitObj, this);
		}
	},
	onInitObj : function()
	{
		this.setValue(this.m_InitObj);
		this.un("render", this.onInitObj, this);
	},
	getSelectedID : function()
	{
		return this.getKeyValue();
	},
	getSelectedText : function()
	{
		return this.getSelectedAttr(this.displayField);
	},
	getSelectedData : function()
	{
		if (! this.getSelected())
		{
			return null;
		}

		return this.getValue();
	},
	getSelectedAttr : function(attrname)
	{
		var object = this.getValue();
		if (object != null && object != undefined && attrname != "")
		{
			if (object[attrname] != undefined)
			{
				return object[attrname];
			}
		}

		return "";
	},
	/**
	 * @public
	 * 清除所有已选项<br>
	 * 不会查找未加载的节点<br>
	 */
	clearSelections : function()
	{
		this.onTrigger2Click();

		this.reload();
	},
	/**
	 * @public
	 * 重新加载数据并清除选择项
	 */
	reload : function()
	{
		var oldValue = this.getValue();
		this.setValue(null);
		if (oldValue != null)
		{
			this.fireEvent("valuechange", this, oldValue, null);
		}
		this.lastQuery = "xyz";
	}
});
Ext.reg("ssc.component.basecombobox", ssc.component.BaseComboBox);