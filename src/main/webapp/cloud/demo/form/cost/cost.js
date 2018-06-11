/* 公用表头信息 */
var CommonHeaderPanel = null;
/* 报销业务明细信息 */
var BusinessPanel = null;
/* 审批历史信息 */
var CheckHistoryInfo = null;

var MainEntityControls = [];
var MainChildControls = [];

function init()
{
	/**
	 * 创建面板
	 */
	CommonHeaderPanel = new demo.form.cost.CostHeaderPanel();
	BusinessPanel = new demo.form.cost.CostInfoPanel();

	/* 表单整体组件属性和访问控制属性设置 */
	initFieldAttr();

	var fieldSets = null;
	if (FormOperTypeUtil.isCreateNew() || FormOperTypeUtil.isDraft())
	{
		fieldSets = [ CommonHeaderPanel, BusinessPanel ];
	}
	else
	{
		CheckHistoryInfo = new ssc.form.common.CheckHistoryPanel();
		fieldSets = [ CommonHeaderPanel, BusinessPanel, CheckHistoryInfo ];
	}

	var tabs = new Ext.Panel(
	{
		bodyStyle : "padding:5px 5px 5px 5px",
		autoHeight : true,
		frame : true,
		layout : "fit",
		labelWidth : 10,
		id : "maindiv",
		renderTo : "maindiv",
		items : fieldSets
	});
}

/**
 * 表单整体组件属性和访问控制属性设置
 * @return
 */
function initFieldAttr()
{

	/* 表单字段属性设置 */
	FormFieldAttrUtil.setFormAttr(demo.form.cost.FieldAttrConfig);
}
/**
 * 检查表单数据加载是否完成
 * @return
 * true: 已加载完成
 * false : 未加载完成
 */
function checkFormDataLoaded()
{
	if (! CommonHeaderPanel.getStoreLoaded())
	{
		return false;
	}

	if (! ExpandHeaderPanel.getStoreLoaded())
	{
		return false;
	}

	if (! BusinessPanel.getStoreLoaded())
	{
		return false;
	}

	return true;
};

/**
 * 表单提交
 * @param callback
 * @return
 */
function OnSubmit(callback)
{
}

/**
 * 表单提交验证
 * @param submittype:
 * 枚举值
 * submit		提交
 * rollback		回退
 * reject		拒绝
 * transwith	转发
 * transmit		转拟办
 * draft		草稿
 * @return: true验证通过, false验证不通过
 */
function validate(submittype)
{
	//test
	return true;
}

/**
 * 表单提交构造表单数据
 * @return
 */
function getFormData()
{
	var schema =
	{
		javaBean : "com.freesky.ssc.interfaceWf.sscWfEx.FormSaveCall",
		method : "execute",
		mainEntity : "SMCSFM_MAIN"
	};

	return getFormDataCommon(schema);
}

/**
 * 保存草稿构造表单数据
 * @return
 */
function getDraftFormData()
{
	var schema =
	{
		javaBean : "com.freesky.ssc.interfaceWf.sscWfEx.WfDraftSaveProxy",
		method : "saveDraft",
		mainEntity : "SMCSFM_MAIN"
	};

	return getFormDataCommon(schema);
}

/**
 * 构造表单数据
 * @param schema
 * @return
 */
function getFormDataCommon(schema)
{
	var envelope = [ schema, getMainEntityInfo(), getChildEntityInfo() ];
	envelope = envelope.concat(BusinessPanel.getFormData());
	var strFormData = envelope.toJSONString();

	return strFormData;
}

/**
 * 获取表单打印JavaBeanName
 * @return
 */
function getPrintJavaBeanName()
{
	var javaBean = "demoCostFormBP";
	return javaBean;
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);