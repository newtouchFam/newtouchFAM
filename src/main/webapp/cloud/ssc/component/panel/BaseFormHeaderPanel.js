Ext.namespace("ssc.component");

/**
 * 表头面板基类
 */
ssc.component.BaseFormHeaderPanel = Ext.extend(ssc.component.BaseFormPanel,
{
	autoHeight : true,
	frame : true,
	border : false,
	labelAlign : "right",
	param : null,
	store : null,
	xy_StoreUrl : "",
	xy_StoreParams : null,
	/* 数据是否加载完成 */
	xy_StoreLoaded : false,

	initComponent : function()
	{
		ssc.component.BaseFormHeaderPanel.superclass.initComponent.call(this);
	},
	/**
	 * 公用创建store方法
	 */
	getStore : function()
	{
		if (this.store === undefined || this.store == null)
		{
			this.store = new Ext.data.Store(
			{
				baseParams : this.xy_StoreParams,
				url : this.xy_StoreUrl,
				reader : new Ext.data.JsonReader(
				{
					root : "data"
				}, this.getRecord())
			});

			this.store.on("load", function(store, records, options)
			{
				if (this.store.reader.jsonData.success == true)
				{
					this.xy_StoreLoaded = true;
				}
			}, this);
		}
		return this.store;
	},
	/**
	 * @public
	 * 数据是否已加载完成
	 */
	getStoreLoaded : function()
	{
		return this.xy_StoreLoaded;
	},

	/**
	 * @abstract
	 * 创建record接口，供store使用。子类实现
	 */
	getRecord : Ext.emptyFn,

	/**
	 * @abstract
	 * 界面布局接口，initComponent时调用。子类实现
	 */
	createControl : Ext.emptyFn,

	/**
	 * @abstract
	 * 界面加载前事件设置。子类实现
	 */
	initComponentEvents : function()
	{
	},

	/**
	 * 界面数据读取接口。
	 */
	loadFormData : function()
	{
		this.getStore().load();
	},

	/**
	 * 界面数据加载接口。
	 */
	setFormData : function(store)
	{
		if (store.getTotalCount() == 0)
		{
			return;
		}
		var record = store.getAt(0);
		for ( var key in record.data)
		{
			if (typeof record.data[key] != "function")
			{
				if (Ext.getCmp(key) != null)
				{
/*附件张数的0，0 == ""竟然为true，改为强类型比较
					if ((record.data[key] != null) && (record.data[key] != ""))
*/
					if ((record.data[key] != null) && (record.data[key] !== ""))
					{
						if ((Ext.getCmp(key).getXType().indexOf("xy") == 0 || Ext.getCmp(key).getXType().indexOf("ssc.smcs.component.xy") == 0) && typeof Ext.getCmp(key).setXyValue == "function")
						{
							Ext.getCmp(key).setXyValue(record.data[key]);
						}
						else
						{
							Ext.getCmp(key).setValue(record.data[key]);
						}
					}

				}
			}
		}
	},

	/**
	 * @abstract
	 * 数据加载后界面设置。子类实现
	 */
	initComponentStatus : Ext.emptyFn,

	/**
	 * @abstract
	 * 数据验证接口。子类实现
	 */
	validate : Ext.emptyFn,

	/**
	 * 获取表单数据接口。不使用
	 */
	getFormData : function()
	{
		DebugAssertUtil.alert("表头不应通过getFormData获得表头数据。应使用MainEntityControls、MainChildControls相关方法获取");
	},

	/**
	 * 获取打印数据接口。不使用
	 */
	getPrintData : function()
	{
		DebugAssertUtil.alert("表头不应通过getPrintData获得表头打印数据，应使用ssc.smcs.common.FormPrintDataUtil.getHeadPrintData方法获取");
	},

	/**
	 * @abstract
	 * 清除数据。子类实现
	 */
	clearFormData : Ext.emptyFn
});
Ext.reg("ssc_smcs_component_baseformheaderpanel", ssc.component.BaseFormHeaderPanel);