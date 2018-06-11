Ext.namespace("ssc.smcs.form.common");

/**
 * 表单全局变量定义类
 */
ssc.smcs.form.common.FormGlobalVariant = {};

FormGlobalVariant = ssc.smcs.form.common.FormGlobalVariant;

/**
 * 是否调试模式
 */
ssc.smcs.form.common.FormGlobalVariant.isDebugMode = true;

/**
 * @private
 * 从Jsp页面中读取参数
 */
ssc.smcs.form.common.FormGlobalVariant.get_JSP_Hidden = function(key)
{
	var dom = Ext.get(key);
	if (dom == null)
	{
		alert("FormGlobalVariant.get_JSP_Hidden(" + key + ")，Ext.get(key) == null");

		return "";
	}
	return dom.getValue();
};

/**
 * @private
 * 从Jsp页面中读取参数并且不允许为空
 */
ssc.smcs.form.common.FormGlobalVariant.get_JSP_Hidden_CheckNull = function(key)
{
	var value = FormGlobalVariant.get_JSP_Hidden(key);
	if (StringUtil.isEmpty(value))
	{
		alert("页面参数[" + key + "]不允许为空值");
	}

	return value;
};

/**
 * @private
 * 从parent Jsp页面中读取参数
 */
ssc.smcs.form.common.FormGlobalVariant.get_Parent_JSP_Hidden = function(parentHandler, key)
{
	var dom = parentHandler.Ext.get(key);
	if (dom == null)
	{
		alert("FormGlobalVariant.get_JSP_Hidden_Parent(" + key + ")，parent.Ext.get(key) == null");

		return "";
	}
	return dom.getValue();
};

/**
 * @private
 * 从parent Jsp页面中读取参数并且不允许为空
 */
ssc.smcs.form.common.FormGlobalVariant.get_Parent_JSP_Hidden_CheckNull = function(parentHandler, key)
{
	var value = FormGlobalVariant.get_Parent_JSP_Hidden(parentHandler, key);
	if (StringUtil.isEmpty(value))
	{
		alert("父页面参数[" + key + "]不允许为空值");
	}

	return value;
};

/**
 * 全局变量
 */
/* from parent page */
ssc.smcs.form.common.FormGlobalVariant.userID = "";
ssc.smcs.form.common.FormGlobalVariant.formID = "";
ssc.smcs.form.common.FormGlobalVariant.processID = "";
ssc.smcs.form.common.FormGlobalVariant.processName = "";
ssc.smcs.form.common.FormGlobalVariant.processInstID = "";

ssc.smcs.form.common.FormGlobalVariant.activityID = "";
ssc.smcs.form.common.FormGlobalVariant.activityName = "";
ssc.smcs.form.common.FormGlobalVariant.activityInstID = "";

ssc.smcs.form.common.FormGlobalVariant.workItemID = "";
ssc.smcs.form.common.FormGlobalVariant.entityDataID = "";
ssc.smcs.form.common.FormGlobalVariant.formSerialNo = "";

ssc.smcs.form.common.FormGlobalVariant.activity_BusiType = "";
ssc.smcs.form.common.FormGlobalVariant.activity_Attachment = "";

/* from this page */
ssc.smcs.form.common.FormGlobalVariant.operType = "";
ssc.smcs.form.common.FormGlobalVariant.formStatus = "";
ssc.smcs.form.common.FormGlobalVariant.formTypeCode = "";
ssc.smcs.form.common.FormGlobalVariant.formTypeName = "";
ssc.smcs.form.common.FormGlobalVariant.busiClassCode = "";
ssc.smcs.form.common.FormGlobalVariant.busiClassName = "";

/**
 * 初始化全局变量
 */
ssc.smcs.form.common.FormGlobalVariant.init_GlobalVariant = function(parentHandler)
{
	/* from parent page */
	FormGlobalVariant.userID = FormGlobalVariant.get_Parent_JSP_Hidden_CheckNull(parentHandler, "userID");
	FormGlobalVariant.formID = FormGlobalVariant.get_Parent_JSP_Hidden_CheckNull(parentHandler, "formID");
	FormGlobalVariant.processID = FormGlobalVariant.get_Parent_JSP_Hidden_CheckNull(parentHandler, "processID");
	FormGlobalVariant.processName = FormGlobalVariant.get_Parent_JSP_Hidden_CheckNull(parentHandler, "processName");
	FormGlobalVariant.processInstID = FormGlobalVariant.get_Parent_JSP_Hidden(parentHandler, "processInstID");

	FormGlobalVariant.activityID = FormGlobalVariant.get_Parent_JSP_Hidden_CheckNull(parentHandler, "activityID");
	FormGlobalVariant.activityName = FormGlobalVariant.get_Parent_JSP_Hidden_CheckNull(parentHandler, "activityName");
	FormGlobalVariant.activityInstID = FormGlobalVariant.get_Parent_JSP_Hidden(parentHandler, "activityInstID");

	FormGlobalVariant.workItemID = FormGlobalVariant.get_Parent_JSP_Hidden(parentHandler, "workItemID");
	FormGlobalVariant.entityDataID = FormGlobalVariant.get_Parent_JSP_Hidden(parentHandler, "entityDataID");
	FormGlobalVariant.formSerialNo = FormGlobalVariant.get_Parent_JSP_Hidden(parentHandler, "formSerialNo");

	FormGlobalVariant.activity_BusiType = FormGlobalVariant.get_Parent_JSP_Hidden(parentHandler, "activity_BusiType");
	FormGlobalVariant.activity_Attachment = FormGlobalVariant.get_Parent_JSP_Hidden(parentHandler, "activity_Attachment");

	/* from this page */
	FormGlobalVariant.operType = FormGlobalVariant.get_JSP_Hidden_CheckNull("operType");
	FormGlobalVariant.formStatus = FormGlobalVariant.get_JSP_Hidden("formStatus");
	FormGlobalVariant.formTypeCode = FormGlobalVariant.get_JSP_Hidden_CheckNull("formTypeCode");
	FormGlobalVariant.formTypeName = FormGlobalVariant.get_JSP_Hidden_CheckNull("formTypeName");
	FormGlobalVariant.busiClassCode = FormGlobalVariant.get_JSP_Hidden("busiClassCode");
	FormGlobalVariant.busiClassName = FormGlobalVariant.get_JSP_Hidden("busiClassName");

	var jsonString = FormGlobalVariant.get_JSP_Hidden("jsonString");
	if (! StringUtil.isEmpty(jsonString))
	{
		var jsonObject = Ext.decode(jsonString);
		if (jsonObject.success != true)
		{
			alert("globalparam init failure");
			return;
		}

		for (var i = 0; i < jsonObject.data.length; i++)
		{
			var param = jsonObject.data[i];
			FormGlobalVariant.set_String(param.code, param.paramString);
			FormGlobalVariant.set_Integer(param.code, param.paramInt);
			FormGlobalVariant.set_Number(param.code, param.paramNumber);
			FormGlobalVariant.set_Boolean(param.code, param.status);
		}
	}
};

/**
 * 创建表单面板参数params
 */
ssc.smcs.form.common.FormGlobalVariant.create_PanelParams = function()
{
    var params =
	{
		MainEntityControls : 	FormGlobalVariant.get_MainEntityControls(),
		MainChildControls : 	FormGlobalVariant.get_MainChildControls(),
		operType : 			FormGlobalVariant.get_OperType(),
		userID : 			FormGlobalVariant.get_UserID(),
		processID : 		FormGlobalVariant.get_ProcessID(),
		processInstID : 	FormGlobalVariant.get_ProcessInstID(),
		activityID : 		FormGlobalVariant.get_ActivityID(),
		activityInstID : 	FormGlobalVariant.get_ActivityInstID(),
		workItemID : 		FormGlobalVariant.get_WorkItemID(),
		formSerialNo : 		FormGlobalVariant.get_FormSerialNo(),
		entityDataID : 		FormGlobalVariant.get_EntityDataID(),
		formTypeCode : 		FormGlobalVariant.get_FormTypeCode(),
		busiClassCode : 	FormGlobalVariant.get_BusiClassCode(),
	};

    return params;
};

ssc.smcs.form.common.FormGlobalVariant.create_StoreParams = function()
{
    var params =
	{
		operType : 			FormGlobalVariant.get_OperType(),
		userID : 			FormGlobalVariant.get_UserID(),
		processID : 		FormGlobalVariant.get_ProcessID(),
		processInstID : 	FormGlobalVariant.get_ProcessInstID(),
		activityID : 		FormGlobalVariant.get_ActivityID(),
		activityInstID : 	FormGlobalVariant.get_ActivityInstID(),
		workItemID : 		FormGlobalVariant.get_WorkItemID(),
		formSerialNo : 		FormGlobalVariant.get_FormSerialNo(),
		entityDataID : 		FormGlobalVariant.get_EntityDataID(),
		formTypeCode : 		FormGlobalVariant.get_FormTypeCode(),
		busiClassCode : 	FormGlobalVariant.get_BusiClassCode(),
	};

    return params;
};

ssc.smcs.form.common.FormGlobalVariant.set_BusiClassCode = function(strBusiClassCode)
{
	ssc.smcs.form.common.FormGlobalVariant.busiClassCode = strBusiClassCode;
};
ssc.smcs.form.common.FormGlobalVariant.set_BusiClassName = function(strBusiClassName)
{
	ssc.smcs.form.common.FormGlobalVariant.busiClassName = strBusiClassName;
};

/**
 * 获取全局变量
 */
ssc.smcs.form.common.FormGlobalVariant.get_MainEntityControls = function()
{
	if (MainEntityControls == undefined || MainEntityControls == null)
	{
		alert("MainEntityControls == null");
		return null;
	}
	return MainEntityControls;
};
ssc.smcs.form.common.FormGlobalVariant.get_MainChildControls = function()
{
	if (MainChildControls == undefined || MainChildControls == null)
	{
		alert("MainChildControls == null");
		return null;
	}
	return MainChildControls;
};

/* from parent page */
ssc.smcs.form.common.FormGlobalVariant.get_UserID = function()
{
	return FormGlobalVariant.userID;
};
ssc.smcs.form.common.FormGlobalVariant.get_FormID = function()
{
	return FormGlobalVariant.formID;
};
ssc.smcs.form.common.FormGlobalVariant.get_ProcessID = function()
{
	return FormGlobalVariant.processID;
};
ssc.smcs.form.common.FormGlobalVariant.get_ProcessName = function()
{
	return FormGlobalVariant.processName;
};
ssc.smcs.form.common.FormGlobalVariant.get_ProcessInstID = function()
{
	return FormGlobalVariant.processInstID;
};

ssc.smcs.form.common.FormGlobalVariant.get_ActivityID = function()
{
	return FormGlobalVariant.activityID;
};
ssc.smcs.form.common.FormGlobalVariant.get_ActivityName = function()
{
	return FormGlobalVariant.activityName;
};
ssc.smcs.form.common.FormGlobalVariant.get_ActivityInstID = function()
{
	return FormGlobalVariant.activityInstID;
};

ssc.smcs.form.common.FormGlobalVariant.get_WorkItemID = function()
{
	return FormGlobalVariant.workItemID;
};
ssc.smcs.form.common.FormGlobalVariant.get_EntityDataID = function()
{
	return FormGlobalVariant.entityDataID;
};
ssc.smcs.form.common.FormGlobalVariant.get_FormSerialNo = function()
{
	return FormGlobalVariant.formSerialNo;
};
ssc.smcs.form.common.FormGlobalVariant.get_Activity_BusiType = function()
{
	return FormGlobalVariant.activity_BusiType;
};
ssc.smcs.form.common.FormGlobalVariant.get_Activity_AttachmentEnable = function()
{
	return FormGlobalVariant.activity_Attachment;
};

/* from this page */
ssc.smcs.form.common.FormGlobalVariant.get_OperType = function()
{
	return FormGlobalVariant.operType;
};
ssc.smcs.form.common.FormGlobalVariant.get_FormStatus = function()
{
	return FormGlobalVariant.formStatus;
};

ssc.smcs.form.common.FormGlobalVariant.get_FormTypeCode = function()
{
	return FormGlobalVariant.formTypeCode;
};
ssc.smcs.form.common.FormGlobalVariant.get_FormTypeName = function()
{
	return FormGlobalVariant.formTypeName;
};
ssc.smcs.form.common.FormGlobalVariant.get_FormTypeObject = function()
{
	var value =
	{
		formtypecode : FormGlobalVariant.get_FormTypeCode(),
		formtypename : FormGlobalVariant.get_FormTypeName()
	};
	return value;
};
ssc.smcs.form.common.FormGlobalVariant.get_BusiClassCode = function()
{
	return FormGlobalVariant.busiClassCode;
};
ssc.smcs.form.common.FormGlobalVariant.get_BusiClassName = function()
{
	return FormGlobalVariant.busiClassName;
};
ssc.smcs.form.common.FormGlobalVariant.get_BusiClassObject = function()
{
	var value =
	{
		busiclasscode : FormGlobalVariant.get_BusiClassCode(),
		busiclassname : FormGlobalVariant.get_BusiClassName()
	};
	return value;
};

/**
 * 自定义全局变量Map
 * 内部使用
 * @BASECURRENCY		单位本位币对象(未实现)
 * @PREPAY_ACCOUNT		预付款科目对象
 * @PREPAY_SUBACCOUNT	预付款子目对象
 * @TRAVEL_ECONITEMID			差旅费长途交通经济事项ID
 * @TRAVEL_ECONITEMCODE			差旅费长途交通经济事项编码
 * @TRAVEL_ECONITEM				差旅费长途交通经济事项(对象)
 * @TRAVELSUBSIDY_ECONITEMID	差旅费出差补贴经济事项ID
 * @TRAVELSUBSIDY_ECONITEMCODE	差旅费出差补贴经济事项编码
 * @TRAVELSUBSIDY_ECONITEM		差旅费出差补贴经济事项(对象)
 */
ssc.smcs.form.common.FormGlobalVariant.ValueMap = new ssc.common.BaseCondition();

ssc.smcs.form.common.FormGlobalVariant.set_String = function(key, value)
{
	ssc.smcs.form.common.FormGlobalVariant.ValueMap.addString(key, value);
};
ssc.smcs.form.common.FormGlobalVariant.set_Integer = function(key, value)
{
	ssc.smcs.form.common.FormGlobalVariant.ValueMap.addInteger(key, value);
};
ssc.smcs.form.common.FormGlobalVariant.set_Number = function(key, value)
{
	ssc.smcs.form.common.FormGlobalVariant.ValueMap.addNumber(key, value);
};
ssc.smcs.form.common.FormGlobalVariant.set_Boolean = function(key, value)
{
	ssc.smcs.form.common.FormGlobalVariant.ValueMap.addBoolean(key, value);
};
ssc.smcs.form.common.FormGlobalVariant.set_Object = function(key, value)
{
	ssc.smcs.form.common.FormGlobalVariant.ValueMap.addObject(key, value);
};

ssc.smcs.form.common.FormGlobalVariant.get_String = function(key)
{
	return ssc.smcs.form.common.FormGlobalVariant.ValueMap.getString(key);
};
ssc.smcs.form.common.FormGlobalVariant.get_Integer = function(key)
{
	return ssc.smcs.form.common.FormGlobalVariant.ValueMap.getInteger(key);
};
ssc.smcs.form.common.FormGlobalVariant.get_Number = function(key)
{
	return ssc.smcs.form.common.FormGlobalVariant.ValueMap.getNumber(key);
};
ssc.smcs.form.common.FormGlobalVariant.get_Boolean = function(key)
{
	return ssc.smcs.form.common.FormGlobalVariant.ValueMap.getBoolean(key);
};
ssc.smcs.form.common.FormGlobalVariant.get_Object = function(key)
{
	return ssc.smcs.form.common.FormGlobalVariant.ValueMap.getObject(key);
};

ssc.smcs.form.common.FormGlobalVariant.contains_Key = function(key)
{
	return ssc.smcs.form.common.FormGlobalVariant.ValueMap.hasProperty(key);
};

/**
 * 初始化全局参数
 */
ssc.smcs.form.common.FormGlobalVariant.init_SrvGlobalVariant = function(intAccountYear)
{
	Ext.Ajax.request(
	{
		url : "SSC/ssc_shcs_FormCommonAction!getSrvGlobalVariant.action",
		method : "post",
		sync : true,
		params :
		{
			jsonCondition : Ext.encode(
			{
				account_year : intAccountYear
			})
		},
		success : function(response, options)
		{
			var responseText = Ext.decode(response.responseText);
			if (responseText.success == true)
			{
				if (responseText.data != undefined && responseText.data != "")
				{
					var account_cash = responseText.data.account_cash;
					account_cash.keyfield = "accountid";
					account_cash.displayfield = "accounttext";
					FormGlobalVariant.set_Object("ACCOUNT_CASH", account_cash);

					var supplier_person = responseText.data.supplier_person;
					supplier_person.keyfield = "supplierid";
					supplier_person.displayfield = "suppliername";
					FormGlobalVariant.set_Object("SUPPLIER_PERSON", supplier_person);

					var customer_person = responseText.data.customer_person;
					customer_person.keyfield = "customerid";
					customer_person.displayfield = "customername";
					FormGlobalVariant.set_Object("CUSTOMER_PERSON", customer_person);

					var relativeitem = responseText.data.relativeitem;
					relativeitem.keyfield = "relativeitemid";
					relativeitem.displayfield = "relativeitemname";
					FormGlobalVariant.set_Object("RELATIVEITEM_NOTRELATION", relativeitem);

					var intAccFactorCount = responseText.data.accfactor_count;
					FormGlobalVariant.set_Integer("ACCFACTOR_COUNT", intAccFactorCount);

					var intExpAttrCount = responseText.data.expattr_count;
					FormGlobalVariant.set_Integer("EXPATTR_COUNT", intExpAttrCount);
				}
				else
				{
					/* 未找到则忽略 */
				}
			}
			else
			{
				MsgUtil.alert(responseText.msg);
			}
		},
		failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
		timeout : 0
	});
};

ssc.smcs.form.common.FormGlobalVariant.get_Account_Cash = function(intAccountYear)
{
	if (! FormGlobalVariant.contains_Key("ACCOUNT_CASH"))
	{
		ssc.smcs.form.common.FormGlobalVariant.init_SrvGlobalVariant(intAccountYear);
	}

	return FormGlobalVariant.get_Object("ACCOUNT_CASH");
};

ssc.smcs.form.common.FormGlobalVariant.get_Supplier_Person = function(intAccountYear)
{
	if (! FormGlobalVariant.contains_Key("SUPPLIER_PERSON"))
	{
		ssc.smcs.form.common.FormGlobalVariant.init_SrvGlobalVariant(intAccountYear);
	}

	return FormGlobalVariant.get_Object("SUPPLIER_PERSON");
};

ssc.smcs.form.common.FormGlobalVariant.get_Customer_Person = function(intAccountYear)
{
	if (! FormGlobalVariant.contains_Key("CUSTOMER_PERSON"))
	{
		ssc.smcs.form.common.FormGlobalVariant.init_SrvGlobalVariant(intAccountYear);
	}

	return FormGlobalVariant.get_Object("CUSTOMER_PERSON");
};

ssc.smcs.form.common.FormGlobalVariant.get_RelativeItem_NotRelation = function(intAccountYear)
{
	if (! FormGlobalVariant.contains_Key("RELATIVEITEM_NOTRELATION"))
	{
		ssc.smcs.form.common.FormGlobalVariant.init_SrvGlobalVariant(intAccountYear);
	}

	return FormGlobalVariant.get_Object("RELATIVEITEM_NOTRELATION");
};

ssc.smcs.form.common.FormGlobalVariant.get_AccFactor_Count = function(intAccountYear)
{
	if (! FormGlobalVariant.contains_Key("ACCFACTOR_COUNT"))
	{
		ssc.smcs.form.common.FormGlobalVariant.init_SrvGlobalVariant(intAccountYear);
	}

	return FormGlobalVariant.get_Integer("ACCFACTOR_COUNT");
};

ssc.smcs.form.common.FormGlobalVariant.get_ExpAttr_Count = function(intAccountYear)
{
	if (! FormGlobalVariant.contains_Key("EXPATTR_COUNT"))
	{
		ssc.smcs.form.common.FormGlobalVariant.init_SrvGlobalVariant(intAccountYear);
	}

	return FormGlobalVariant.get_Integer("EXPATTR_COUNT");
};