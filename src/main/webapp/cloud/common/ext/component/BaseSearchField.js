Ext.namespace("ssc.component");

/**
 * @class
 * 带查询与清除按钮的文本框<br>
 * 用作输入查询条件<br>
 */
Ext.namespace("ssc.component");

ssc.component.BaseSearchField = Ext.extend(Ext.form.TwinTriggerField,
{
	/* 关键属性，必须保留 */
	allowBlur : true,

	/**
	 * ==========默认值==========
	 */
	readOnly : false,
	trigger1Class : "x-form-search-trigger",
	trigger2Class : "x-form-clear-trigger",
	emptyText : "请选择...",

	onTrigger1Click : Ext.emptyFn,
	onTrigger2Click : Ext.emptyFn,

	/**
	 * ==========事件==========
	 */

	/* 调用方对象 */
	xy_ParentObjHandle : null,
	/* 点击“查询”按钮后的回调函数 */
	xy_QueryClickEvent : Ext.emptyFn,
	/* 点击“清除”按钮后的回调函数 */
	xy_ClearClickEvent : Ext.emptyFn,

	initComponent : function()
	{
		ssc.component.BaseSearchField.superclass.initComponent.call(this);
	}
});
Ext.reg("ssc.component.basesearchfield", ssc.component.BaseSearchField);