Ext.namespace("ssc.component");

/**
 * 表单Panel基类
 * 定义了行为模式
 * 对外接口
 * getStore
 * getRecord
 * createControl
 * initComponentEvents
 * loadFormData
 * setFormData
 * initComponentStatus
 * getFormData
 * getPrintData
 * validate
 */
ssc.component.BaseFormPanel = Ext.extend(Ext.Panel,
{
	param : null,
	store : null,
	xy_StoreUrl : "",
	xy_StoreParams : null,

	listeners :
	{
		activate : function()
		{
			this.doLayout();
		}
	},

	initComponent : function()
	{
		ssc.component.BaseFormPanel.superclass.initComponent.call(this);
	},

	/**
	 * @abstract
	 * 创建Store接口
	 */
	getStore : Ext.emptyFn,

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
	initComponentEvents : Ext.emptyFn,

	/**
	 * @abstract
	 * 界面数据读取接口。子类实现
	 */
	loadFormData : Ext.emptyFn,

	/**
	 * @abstract
	 * 界面数据加载接口。子类实现
	 */
	setFormData : Ext.emptyFn,

	/**
	 * @abstract
	 * 数据验证接口。子类实现
	 */
	validate : Ext.emptyFn,

	/**
	 * @abstract
	 * 数据加载后界面设置。子类实现
	 */
	initComponentStatus : Ext.emptyFn,

	/**
	 * @abstract
	 * 获取表单数据接口。子类实现
	 */
	getFormData : Ext.emptyFn,

	/**
	 * @abstract
	 * 获取打印数据接口。子类实现
	 */
	getPrintData : Ext.emptyFn,

	/**
	 * @abstract
	 * 清除数据。子类实现
	 */
	clearFormData : Ext.emptyFn
});
Ext.reg("ssc_smcs_component_baseformpanel", ssc.component.BaseFormPanel);