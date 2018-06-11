Ext.namespace("ssc.component");

/**
 * @class 下拉框(列表)基类<br>
 * @extends ssc.component.BaseComboBox<br>
 *
 * 二、使用
 * 1.外观
 * fieldLabel、width、listWidth、xy_AllowClear
 * 2.数据
 * valueField、displayField、
 * xy_StoreFields、xy_DataActionURL、xy_SQLPath、xy_SQLFile、xy_SQLFile2、xy_ProcedurePath、xy_BaseParams、
 * 3.初始化
 * xy_hasAll、xy_isInitSelect、xy_InitDataID
 * 4.事件
 * xy_ParentObjHandle、xy_SelectEvent、xy_ValueChangeEvent
 * 5.方法
 * getValue、setValue、getXyValue、setXyValue、
 * getKeyValue、setKeyValue、getDisplayValue、getStore、
 * getItemCount、getSelected、getSelectedIndex、setSelectedIndex、
 * reload
 */
ssc.component.BaseListComboBox = Ext.extend(ssc.component.BaseComboBox,
{
	/**
	 * ==========初始化==========
	 */
	/* 是否初始化加载数据 */
	xy_InitLoadData : false,
	/* 是否在第一行显示“全部”选项 */
	xy_hasAll : false,
	/* 是否初始选择第一项 */
	xy_IsInitSelectFirst : false,

	/* 查询参数对象 */
	m_BaseParams : null,
	/* 上次查询参数对象 */
	m_PreBaseParams : null,

	initComponent : function()
	{
		ssc.component.BaseListComboBox.superclass.initComponent.call(this);
	},
	/**
	 * @private
	 * @override	Ext.form.ComboBox.initStore()
	 * @abstract	在子类中实现
	 * 初始化store
	 */
	initStore : function()
	{
		var url = this.xy_DataActionURL;
		if (ssc.common.StringUtil.isEmpty(url))
		{
			url = "wf/CommonComboxDataAction.action";
		}

		if (this.xy_InitLoadData)
		{
			this.store = new Ext.data.JsonStore(
			{
				url : url,
				autoLoad : true,
				fields : this.xy_StoreFields,
				root : "data"
			});
			
			this.mode = "local";
		}
		else
		{
			this.store = new Ext.data.JsonStore(
			{
				url : url,
				fields : this.xy_StoreFields,
				root : "data"
			});
		}

		this.store.on("beforeload", this.onStoreBeforeLoadEvent, this);
		this.store.on("loadexception", ssc.common.StoreLoadExcpetionEvent);
		this.store.on("load", this.onStoreLoadEvent, this);
	},
	/**
	 * @private
	 * @override	Ext.form.ComboBox.onStoreBeforeLoadEvent()
	 * @abstract	在子类中实现
	 * Store准备查询参数
	 */
	onStoreBeforeLoadEvent : function(/* Store this*/ store, /*Object options*/ options)
	{
/*2015-06-04 支持重新加载数据
		if (this.xy_BaseParams == null || this.xy_BaseParams == undefined)
		{
			this.xy_BaseParams = this.prepareBaseParams();
		}*/
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
		
		/* 把数组格式转换为对象格式 */
		this.m_BaseParams = ssc.common.loadStoreParamConvert(params);

		if (!ssc.common.StringUtil.isEmpty(this.xy_SQLPath)
				|| !ssc.common.StringUtil.isEmpty(this.xy_SQLFile)
				|| !ssc.common.StringUtil.isEmpty(this.xy_ProcFile))
		{
			ssc.common.loadStoreWfCommonParam(store,
				this.xy_SQLPath,
				this.xy_SQLFile,
				"",
				this.xy_ProcFile);
		}

		/* 设置到baseParams */
		ssc.common.loadStoreParserParam(store, this.m_BaseParams, this.xy_ParamJsonSerialize);

		this.m_PreBaseParams = this.m_BaseParams;
	},
	/**
	 * @private 加载数据后处理，定位、设置下拉列表宽度
	 */
	onStoreLoadEvent : function(/*Store*/ _this, /*Ext.data.Record[]*/ records, /*Object*/ options)
	{
		this.initSelectedItem();
	},
	/**
	 * @private
	 */
	initSelectedItem : function()
	{
		if (! this.xy_InitLoadData)
		{
			return;
		}

		if (this.store.getCount() > 0)
		{
			if (this.xy_InitDataID != null && this.xy_InitDataID != undefined)
			{
				this.setKeyValue(this.xy_InitDataID);
			}
			else if (this.xy_InitDataFieldValue != null && this.xy_InitDataFieldValue != undefined)
			{
				this.setFieldValue(this.xy_InitDataFieldValue.field, this.xy_InitDataFieldValue.value);
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
			if (object[this.valueField] == key)
			{
				this.setValue(object);
				this.selectedIndex = index;
				return;
			}
		}
	},
	/**
	 * @public
	 * 按照其他字段定位，可用其他关键字段
	 */
	setFieldValue : function(fieldname, value)
	{
		for (var index = 0; index < this.getStore().getCount(); index++)
		{
			var object = this.getStore().getAt(index).data;

			if (object[fieldname] == value)
			{
				this.setValue(object);
				this.selectedIndex = index;
				return;
			}
		}
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

		this.setValue(object);
	},
	/**
	 * @public
	 * 当前选择的是否为"全部选项"
	 */
	getIsAllItem : function()
	{
		/*暂未实现*/
		return false;
	}
});
Ext.reg("ssc.component.basecomboboxlist", ssc.component.BaseListComboBox);