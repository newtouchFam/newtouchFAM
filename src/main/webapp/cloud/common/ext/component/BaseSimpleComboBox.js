Ext.namespace("ssc.component");
/**
 * @class 固定数据下拉框基类<br>
 * @extends Ext.form.ComboBox<br>
 *
 * 一、支持特性：<br>
 * 1.固定数据组合框组件，根据RenderMapData数据初始化
 * 2.仅能用在普通编辑器，以及EditorGridPanel，不能用在XyEditorGridPanel中
 * 二、使用
 * 1.外观
 * fieldLabel、width、xy_AllowClear、
 * 2.数据
 * valueField、displayField、
 * xy_DataArray
 * 3.初始化
 * xy_hasAll、xy_isInitSelectFirst、xy_InitDataID
 * 4.事件
 * xy_ParentObjHandle、xy_SelectEvent、xy_ValueChangeEvent
 * 5.方法
 * getValue、setValue、
 * getKeyValue、setKeyValue、getDisplayValue、getStore、
 * getItemCount、getSelected、getSelectedIndex、setSelectedIndex、
 * reload
 */
ssc.component.BaseSimpleComboBox = Ext.extend(Ext.form.ComboBox,
{
	/**
	 * 默认值
	 */
	fieldLabel : "",
	width : 200,
	mode : "local",			/*本地数据固定值*/
	triggerAction : "all",
	validationEvent : false,	/* 不校验 */
	validateOnBlur : false, 	/* 不校验 */
	editable : false, 			/* 只读 */
	forceSelection : true,		/*必选不可输入*/
	blankText : "请选择...",
	emptyText : "请选择...",
	loadingText : "正在加载数据...",

	/**
	 * 是否显示清除按钮
	 */
	xy_AllowClear : false,

	/**
	 * key字段名称和显示字段名称
	 * @inherit from Ext.form.ComboBox
	 */
	valueField : "value",
	displayField : "label",
	hiddenName : "value",

	/**
	 * 列表数据
	 */
	xy_DataArray : null,

	/**
	 * 是否在第一行显示“全部”选项
	 */
	xy_hasAll : false,
	/**
	 * 是否初始选择第一项
	 */
	xy_IsInitSelectFirst : false,
	/**
	 * 初始选项
	 */
	xy_InitDataID : null,

	/**
	 * 调用方对象
	 */
	xy_ParentObjHandle : null,
	/**
	 * 选择后触发事件(可能值没有改变)
	 */
	xy_SelectEvent : Ext.emptyFn,
	/**
	 * 值改变后触发事件
	 */
	xy_ValueChangeEvent : Ext.emptyFn,

	initComponent : function()
	{
		ssc.component.BaseSimpleComboBox.superclass.initComponent.call(this);
		
		/* 初始化按钮 */
		this.initButton();

		/* 初始化数据源 */
		this.initStore();

		/* 绑定选择事件 */
		this.initEvent();
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
	 * @override ssc.component.BaseComboBox.initStore 初始化store
	 */
	initStore : function()
	{
		this.store = new Ext.data.SimpleStore(
		{
			fields : [ "value", "label" ],
			data : this.xy_DataArray
		});

		if (this.xy_hasAll == true && this.xy_hasAll != null && this.xy_hasAll != undefined)
		{
			this.store.insert(0, new Ext.data.Record(
			{
				label : "全部",
				value : "--"
			}));
		}		

		this.initSelectedItem();

		/*下拉框宽度自适应特性还未实现*/
		this.autoListWidth();
	},
	/**
	 * @private
	 */
	initSelectedItem : function()
	{
		if (this.store.getCount() > 0)
		{
			if (this.xy_InitDataID != null)
			{
				this.setKeyValue(this.xy_InitDataID);
			}
			else
			{
				if (this.xy_IsInitSelectFirst)
				{
					this.setSelectedIndex(0);
				}
			}
		}
	},
	autoListWidth : function()
	{
		if (this.xy_AutoWidth == false || this.xy_AutoWidth == null || this.xy_AutoWidth == undefined)
		{
			return;
		}

		var metrics = Ext.util.TextMetrics.createInstance(this.getEl());
		
		var maxLength = 0;
		var maxLengthRecord = null;
		for (var i = 0; i < records.length; i++)
		{
			var record = records[i];
			var length = metrics.getWidth(record.data[this.displayField]);
			
			if (length > maxLength)
			{
				maxLength = length;
				maxLengthRecord = record;
			}
		}
		
		if (this.xy_MaxWidth < maxLength && this.xy_MaxWidth != null && this.xy_MaxWidth != undefined)
		{
			maxLength = this.xy_MaxWidth;
		}

		this.listWidth = maxLength;
	},
	/**
	 * 初始化事件
	 */
	initEvent : function()
	{
		/* 绑定选择事件 */
		this.on("beforeselect", this.onBeforeSelectEvent, this);
		this.on("select", this.xy_SelectEvent, this.xy_ParentObjHandle);

		/* 绑定值变更事件 */
		this.on("valuechange", this.onValueChangeEvent, this);
		this.on("valuechange", this.xy_ValueChangeEvent, this.xy_ParentObjHandle);

		/* 初始化刷新 */
		this.on("render", this.onRenderEvent, this);

		/* 快捷键 */
		this.on("specialkey", this.onSpecialKeyEvent, this);
	},
	onBeforeSelectEvent : function(/* Ext.form.ComboBox */combo, /* Ext.data.Record */record, /* Number */index)
	{		
		var oldValue = this.getKeyValue();
		var newValue = record.data[this.valueField];

		if (oldValue != newValue)
		{
			this.fireEvent("valuechange", combo, oldValue, newValue);
		}
		
		return true;
	},
	/**
	 * @private 值变动后内置处理过程
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
	 * 返回选择项的对象
	 * 支持XyGridPanel体系
	 */
	getXyValue : function()
	{
		if(this.selectedIndex == -1)
		{
			return "";
		}
		return this.getStore().getAt(this.selectedIndex).data;
	},
	/**
	 * @public
	 * 返回选择项的valueField，即ID
	 */
	getKeyValue : function()
	{
		if (this.getValue() != null)
		{
			return this.getValue();
		}
		else
		{
			return "";
		}
	},
	/**
	 * @public
	 * @override	ssc.component.BaseComboBox.setKeyValue
	 * 设置选择项的valueField定位
	 */
	setKeyValue : function(key)
	{
		for (var index = 0; index < this.getStore().getCount(); index++)
		{
			var object = this.getStore().getAt(index).data;
			if (object[this.valueField] === key)
			{
				this.setValue(key);
				this.selectedIndex = index;
				return;
			}
		}
	},
	/**
	 * @public
	 * 返回选择项的displayField，即显示名称
	 */
	getDisplayValue : function()
	{
		var key = this.getKeyValue();

		for (var index = 0; index < this.getStore().getCount(); index++)
		{
			var object = this.getStore().getAt(index).data;
			if (object[this.valueField] === key)
			{
				return object[this.displayField];
			}
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
		return (this.getValue() !== null && this.getValue() !== "");
	},
	/**
	 * @public
	 * 获取选择项索引号
	 */
	getSelectedIndex : function()
	{
		return this.selectedIndex;
	},
	/**
	 * @public
	 * @override	ssc.component.BaseComboBox.setSelectedIndex
	 * 按照索引号定位选择项
	 */
	setSelectedIndex : function(index)
	{
		if (index < 0
				|| index > (this.store.getCount() - 1))
		{
			return;
		}

		this.selectedIndex = index;
		var object = this.getStore().getAt(index).data;

		this.setValue(object[this.valueField]);
	},
	getSelectedID : function()
	{
		return this.getKeyValue();
	},
	getSelectedText : function()
	{
		return this.getDisplayValue();
	},
	getSelectedData : function()
	{
		if (! this.getSelected())
		{
			return null;
		}

		var obj = {};
		obj[this.valueField] = this.getKeyValue();
		obj[this.displayField] = this.getDisplayValue();

		return obj;
	},
	getSelectedAttr : function(attrname)
	{
		if (attrname == this.valueField)
		{
			return this.getKeyValue();
		}
		else if (attrname == this.displayField)
		{
			this.getDisplayValue();
		}
		else
		{
			return "";
		}
	},
	/**
	 * @public
	 * 当前选择的是否为"全部选项"
	 */
	isAllItem : function()
	{
		return (this.getKeyValue() == "--");
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
		this.store.load();
	}
});
Ext.reg("ssc.component.basesimplecombobox", ssc.component.BaseSimpleComboBox);