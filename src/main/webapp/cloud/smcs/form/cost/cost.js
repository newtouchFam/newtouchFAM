/* 公用表头信息 */
var CommonHeaderPanel = null;
/* 扩展表头信息 */
var ExpandHeaderPanel = null;
/* 报销业务明细信息 */
var BusinessPanel = null;
/* 审批历史信息 */
var CheckHistoryInfo = null;

var MainEntityControls = [];
var MainChildControls = [];

var m_ProcessID = "";

function init()
{
	if (this != parent)
	{
		var info = parent.getInitData();
	}
	else
	{
		MsgUtil.alert("信息", "加载流程相关信息失败，请确认表单打开方式是否正确!");
		return;
	}

	/**
	 * 初始化全局变量
	 */
	FormGlobalVariant.init_GlobalVariant(parent);

/*	m_ProcessID = Ext.get("processID").dom.value;*/

	/**
	 * 创建表单面板参数params
	 */
	var params = FormGlobalVariant.create_PanelParams();

	/**
	 * 创建面板
	 */
	CommonHeaderPanel = new ssc.smcs.form.common.CommonHeaderPanel(params);
	ExpandHeaderPanel = new ssc.smcs.form.cost.CostHeaderPanel(params);
	BusinessPanel = new ssc.smcs.form.cost.CostBusinessPanel(params);
	
	/* 表单整体组件属性和访问控制属性设置 */
	initFieldAttr();

	var fieldSets = null;
	if (FormOperTypeUtil.isCreateNew() || FormOperTypeUtil.isDraft())
	{
		fieldSets = [ CommonHeaderPanel, ExpandHeaderPanel, BusinessPanel ];
	}
	else
	{
		CheckHistoryInfo = new ssc.form.common.CheckHistoryPanel(params);
		fieldSets = [ CommonHeaderPanel, ExpandHeaderPanel, BusinessPanel, 
		CheckHistoryInfo ];
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
	resizeWin();

	initEvents();

	initLoads(params);

	initState();
}

/**
 * 表单整体组件属性和访问控制属性设置
 * @return
 */
function initFieldAttr()
{

	/* 表单字段属性设置 */
	FormFieldAttrUtil.setFormAttr(ssc.smcs.form.cost.FieldAttrConfig);
	
	/* 表单字段访问控制设置 */
	
	FormAccessUtil.setFormAccess(ssc.smcs.form.cost.AccessConfig, FormGlobalVariant.get_Activity_BusiType());

	
}

/**
 * 初始化事件
 * @return
 */
function initEvents()
{
	CommonHeaderPanel.initComponentEvents();

	ExpandHeaderPanel.initComponentEvents();

	BusinessPanel.initComponentEvents();
}

/**
 * 初始化数据加载
 * @param params
 * @return
 */
function initLoads(params)
{
	var loadMask = new Ext.LoadMask(Ext.getBody(),
	{
		msg : "表单数据加载中....",
		removeMask : true
	});
	loadMask.show();

	try
	{
		CommonHeaderPanel.loadFormData();

		if (! FormOperTypeUtil.isCreateNew() || FormOperTypeUtil.isDraft())
		{
			ExpandHeaderPanel.loadFormData();

			BusinessPanel.loadFormData();
		}
	}
	catch(ex)
	{
		MsgUtil.alert(ex);
	}
	finally
	{
		loadMask.hide();
	}
}

/**
 * 初始化组件状态
 * @return
 */
function initState()
{
	CommonHeaderPanel.initComponentStatus();

	ExpandHeaderPanel.initComponentStatus();

	BusinessPanel.initComponentStatus();
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
	var retObject = BusinessPanel.getCostInfoPanel().getMaxRowAmountAndEconItemID();

	parent.m_WorkData.setValue("G_SSC_SMCS_MAXROWAMOUNT", retObject.maxrowamount);
	parent.m_WorkData.setValue("G_SSC_SMCS_ECONITEMID", retObject.econitemid);
	parent.m_WorkData.setValue("G_SSC_SUBMITTYPE", "0");

	if (FormOperTypeUtil.isCreateNew() || FormOperTypeUtil.isDraft())
	{
		updateProcessInfo(retObject.econitemid);
	}

	if (callback != null && callback != undefined)
	{
		callback();
	}
}

/**
 * 查看流程图时调用，获得最新流程ID
 * @return
 */
function getProcessID()
{
	var retObject = BusinessPanel.getCostInfoPanel().getMaxRowAmountAndEconItemID();

	updateProcessInfo(retObject.econitemid);

	return m_ProcessID;
}

/**
 * 更新配置规则更新最新流程参数
 * @param strEconItemID
 * @return
 */
function updateProcessInfo(strEconItemID)
{
	var loadMask = new Ext.LoadMask(Ext.getBody(),
	{
		msg : "更改流程配置....",
		removeMask : true
	});
	loadMask.show();

	try
	{
		Ext.Ajax.request(
		{
			url : "SSC/ssc_smcs_CostFormAction!getProcessInfo.action",
//			url : "/smcs/form/cost/getprocessinfo",
			method : "post",
			sync : true,
			params :
			{
				jsonCondition : Ext.encode(
				{
					econitemid : strEconItemID
				})
			},
			success : function(response, options)
			{
				var responseText = Ext.decode(response.responseText);
				if (responseText.success == true)
				{
					var strProcessID = responseText.processid;
					var strActivityID = responseText.activityid;

					if (strProcessID != null && strProcessID != "")
					{
						parent.Ext.getDom("processID").value = strProcessID;
						parent.Ext.getDom("activityID").value = strActivityID;
						parent.Ext.getDom("processID").value = strProcessID;

						CommonHeaderPanel.xy_StoreParams.processID = strProcessID;
						ExpandHeaderPanel.xy_StoreParams.processID = strProcessID;
						BusinessPanel.getCostInfoPanel().xy_StoreParams.processID = strProcessID;

						FormInfoUtil.get_Header_Field("processid").setValue(strProcessID);

						m_ProcessID = strProcessID;
					}
				}
				else
				{
					MsgUtil.alert(responseText.msg);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this,
			timeout : 0
		});
	}
	finally
	{
		loadMask.hide();
	}
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
	if(submittype != "submit")
	{
		return true;
	}

	if (! CommonHeaderPanel.validate(submittype))
	{
		return false;
	}

	if (! ExpandHeaderPanel.validate(submittype))
	{
		return false;
	}

	if (! BusinessPanel.validate(submittype))
	{
		return false;
	}

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
 * 表单打印构造表单数据
 * @return
 */
function getPrintData()
{
	var jsonPrintData = {};

	jsonPrintData["title"] = "";

	jsonPrintData = ssc.smcs.common.FormPrintDataUtil.getHeadPrintData(MainEntityControls, MainChildControls);
	jsonPrintData["deptid_name"] = FormInfoUtil.get_Header_DeptField("deptid").getDeptName();

	/* 支付对象 */
	if (ExpandHeaderPanel.cmbPayObjectType.isSupplier())
	{
		jsonPrintData["code"] = ExpandHeaderPanel.fieldSupplier.getSupplierCode();
		jsonPrintData["name"] = ExpandHeaderPanel.edtSupplierName.getValue();
	}
	
	else if(ExpandHeaderPanel.cmbPayObjectType.isCustomer())
	{
		jsonPrintData["code"] = ExpandHeaderPanel.fieldCustomer.getCustomerCode();
		jsonPrintData["name"] = ExpandHeaderPanel.edtCustomerName.getValue();
	}

	jsonPrintData["amount_sum_string"] = "¥" + FormatUtil.Money(jsonPrintData["amount"]);
	jsonPrintData["finamount_chn"] = FormMoneyUtil.MoneyToCHN(jsonPrintData["amount"]);
	jsonPrintData["cost_info"] = BusinessPanel.getCostInfoPanel().getPrintData();
    jsonPrintData["applyamount"]=FormatUtil.Money(jsonPrintData["applyamount"]);
    
    jsonPrintData["settletype"] = ExpandHeaderPanel.cmbSettleType.getDisplayValue();
    jsonPrintData["payobjecttype"] = ExpandHeaderPanel.cmbPayObjectType.getDisplayValue();
    jsonPrintData["paytype"] = ExpandHeaderPanel.cmbPayType.getDisplayValue();
    jsonPrintData["invoicetype"] = ExpandHeaderPanel.cmbCheckType.getDisplayValue();
    jsonPrintData["ispay"] = ExpandHeaderPanel.cmbIsPay.getDisplayValue();
    if (ExpandHeaderPanel.cmbPayObjectType.isStaff())
	{
		if(ExpandHeaderPanel.cmbSettleType.getKeyValue()=="ST01")
		{
			jsonPrintData.subdir = "SSC\\smcs\\form\\cost\\";
			jsonPrintData.jasper = "costStuff.jasper";
			return jsonPrintData;
		}
		else
		{
			jsonPrintData["code"] = ExpandHeaderPanel.fieldPayUser.getUserCode();
			jsonPrintData["name"] = ExpandHeaderPanel.edtPayUserName.getValue();
			jsonPrintData.subdir = "SSC\\smcs\\form\\cost\\";
			jsonPrintData.jasper = "cost.jasper";
			return jsonPrintData;
		}
	}
    jsonPrintData.subdir = "SSC\\smcs\\form\\cost\\";
	jsonPrintData.jasper = "cost.jasper";

	return jsonPrintData;
}

/**
 * 获取表单打印JavaBeanName
 * @return
 */
function getPrintJavaBeanName()
{
	var javaBean = "costFormBP";
	return javaBean;
}

/**
 * 分布式填单显示面板
 * @step: 传入参数，值限定为1..4,1表示基本信息，2表示报账明细，3表示支付明细，4表示全部显示
 * @return：默认或当某部分信息不存在时返回-1，其他情况返回传入值。
 */
function showStep(step)
{
	if (! FormOperTypeUtil.isCreateNew())
	{
		return;
	}

	switch(step)
	{
		case 1: /* 基本信息 */
		{
			CommonHeaderPanel.setVisible(true);
			ExpandHeaderPanel.setVisible(true);
			BusinessPanel.setVisible(false);
			break;
		}
		case 2: /* 报销明细 */
		{
			CommonHeaderPanel.setVisible(false);
			ExpandHeaderPanel.setVisible(false);
			BusinessPanel.setVisible(true);
			break;
		}
		case 3: /* 支付明细 */
		{
			
			return -1;
			break;
			
		}
		case 4: /* 整体预览 */
		{
			CommonHeaderPanel.setVisible(true);
			ExpandHeaderPanel.setVisible(true);
			BusinessPanel.setVisible(true);
			break;
		}
		default:
		return -1;
	}
	return step;
}

/**
 * 分布式填单验证
 * @step: 传入参数，值限定为1..4,1表示验证基本信息，2表示验证报账明细，3表示验证支付明细，4表示验证全部显示
 * @return：默认或当某部分信息不存在时返回true，1..3根据实际验证结果返回，4不需要处理，提交时直接调用原先的验证接口。
 */
function validateStep(step)
{
	if (! FormOperTypeUtil.isCreateNew())
	{
		return;
	}

	switch(step)
	{
		case 1: /* 基本信息 */
		{
			if (! CommonHeaderPanel.validate("submit"))
			{
				return false;
			}

			if (! ExpandHeaderPanel.validate("submit"))
			{
				return false;
			}

			return true;
			break;
		}
		case 2: /* 报销明细 */
		{
			return BusinessPanel.validate("submit");
			break;
		}
		case 3: /* 支付明细 */
		{
			break;
		}
		case 4: /* 整体预览，不需要校验 */
			break;
		default:
			return true;
	}
	return true;
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);