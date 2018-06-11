Ext.namespace("ssc.smcs.form.common");

/**
 * 表单环节工具类
 */
ssc.smcs.form.common.FormStatusUtil = {};

FormStatusUtil = ssc.smcs.form.common.FormStatusUtil;

/**
 * 是否允许填写业务信息
 * 包括发起、草稿、未发起、异常处理
 */
ssc.smcs.form.common.FormStatusUtil.isStart = function()
{
	return (ssc.smcs.form.common.FormStatusUtil.isStartStep()
			|| ssc.smcs.form.common.FormStatusUtil.isExceptionStep());
};
ssc.smcs.form.common.FormStatusUtil.isNotStart = function()
{
	return ! ssc.smcs.form.common.FormStatusUtil.isStart();
};

/**
 * 是否允许填写财务信息
 * 包括财务受理、财务初审、异常处理
 */
ssc.smcs.form.common.FormStatusUtil.isFin = function()
{
	return (ssc.smcs.form.common.FormStatusUtil.isPreCheckStep()
			|| ssc.smcs.form.common.FormStatusUtil.isFillStep()
			|| ssc.smcs.form.common.FormStatusUtil.isCheckStep()
			|| ssc.smcs.form.common.FormStatusUtil.isExceptionStep());
};
ssc.smcs.form.common.FormStatusUtil.isNotFin = function()
{
	return ! ssc.smcs.form.common.FormStatusUtil.isFin();
};

/**
 * 业务信息和财务信息都允许
 * 包括发起、草稿、未发起、财务受理、财务初审、异常处理
 */
ssc.smcs.form.common.FormStatusUtil.isStartAndFin = function()
{
	return (ssc.smcs.form.common.FormStatusUtil.isStart()
			|| ssc.smcs.form.common.FormStatusUtil.isFin());
};
ssc.smcs.form.common.FormStatusUtil.isNotStartAndFin = function()
{
	return ! ssc.smcs.form.common.FormStatusUtil.isStartAndFin();
};

/* 是否发起环节 */
ssc.smcs.form.common.FormStatusUtil.isStartStep = function()
{
	return (FormGlobalVariant.get_Activity_BusiType() == "START");
};

/* 是否财务受理环节 */
ssc.smcs.form.common.FormStatusUtil.isPreCheckStep = function()
{
	return (FormGlobalVariant.get_Activity_BusiType() == "PRE_CHECK");
};

/* 是否影像扫描环节 */
ssc.smcs.form.common.FormStatusUtil.isScanStep = function()
{
	return (FormGlobalVariant.get_Activity_BusiType() == "SCAN");
};

/* 是否财务初审环节 */
ssc.smcs.form.common.FormStatusUtil.isFillStep = function()
{
	return (FormGlobalVariant.get_Activity_BusiType() == "SSC_VC_FILL");
};

/* 是否财务复核环节 */
ssc.smcs.form.common.FormStatusUtil.isCheckStep = function()
{
	return (FormGlobalVariant.get_Activity_BusiType() == "SSC_VC_CHECK");
};

/* 是否等待支付环节 */
ssc.smcs.form.common.FormStatusUtil.isPayStep = function()
{
	return (FormGlobalVariant.get_Activity_BusiType() == "SSC_VC_UNION_WAIT");
};

/* 是否异常处理环节 */
ssc.smcs.form.common.FormStatusUtil.isExceptionStep = function()
{
	return (FormGlobalVariant.get_Activity_BusiType() == "SSC_VC_TRY_AGAIN");
};


/**
 * 表单操作状态工具类
 * 1新建
 * 2待办审批
 * 3个人跟踪
 * 4我已审批
 * 5审批完成
 * 6草稿
 */
ssc.smcs.form.common.FormOperTypeUtil = {};

FormOperTypeUtil = ssc.smcs.form.common.FormOperTypeUtil;

/* 是否新建操作 */
ssc.smcs.form.common.FormOperTypeUtil.isCreateNew = function()
{
	return (FormGlobalVariant.get_OperType() == "1");
};
/* 是否待办审批操作 */
ssc.smcs.form.common.FormOperTypeUtil.isApprove = function()
{
	return (FormGlobalVariant.get_OperType() == "2");
};
/* 是否个人跟踪操作 */
ssc.smcs.form.common.FormOperTypeUtil.isInTransit = function()
{
	return (FormGlobalVariant.get_OperType() == "3");
};
/* 是否我已审批操作 */
ssc.smcs.form.common.FormOperTypeUtil.isFinishedByMe = function()
{
	return (FormGlobalVariant.get_OperType() == "4");
};
/* 是否审批完成操作 */
ssc.smcs.form.common.FormOperTypeUtil.isFinished = function()
{
	return (FormGlobalVariant.get_OperType() == "5");
};
/* 是否草稿操作 */
ssc.smcs.form.common.FormOperTypeUtil.isDraft = function()
{
	return (FormGlobalVariant.get_OperType() == "6");
};