Ext.namespace("ssc.component");

/**
 * 分类型流程选择
 */
ssc.component.WFProcessTGField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "流程",
	emptyText : "请选择...",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "processID",
	xy_DisplayField : "processName",
	/**
	 * @override ssc.component.BaseListField.createDialog
	 */
	createDialog : function()
	{
		this.m_Dialog = new ssc.component.WFProcessDialog(
		{
			closeAction : "hide",
			xy_PageMode : this.xy_PageMode,
			xy_MultiSelectMode : this.xy_MultiSelectMode,
			xy_ParentObjHandle : this.xy_ParentObjHandle,
			xy_OKClickEvent : this.xy_OKClickEvent,
			xy_BaseParams : this.xy_BaseParams,
			prepareBaseParams : this.prepareBaseParams
		});
	}
});
Ext.reg("ssc.component.wfprocesstgfield", ssc.component.WFProcessTGField);
