Ext.namespace("ssc.smcs.form.common");

/**
 * 表单界面操作公用处理过程
 */
ssc.smcs.form.common.FormOperationUtil = {};

FormOperationUtil = ssc.smcs.form.common.FormOperationUtil;

/**
 * 查看表单
 */
ssc.smcs.form.common.FormOperationUtil.viewFormInfo = function(strFormSerialNo)
{
	if (strFormSerialNo == null || strFormSerialNo == undefined || strFormSerialNo == "")
	{
		MsgUtil.alert("表单编号不可为空");
		return;
	}

	var strBasePath = Ext.get("basePath").dom.value;
	var strViewUrl = strBasePath + "SSC/billview.action?idtype=1&billid=" + strFormSerialNo;

	window.open(strViewUrl, "","menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
};

/**
 * 查看合同详细信息
 */
ssc.smcs.form.common.FormOperationUtil.viewContractInfo = function(strContractID)
{
	if (strContractID.trim().length <= 0)
	{
		return;
	}

	/**
	 * 修改合同信息
	 */
	function editFunc(){
		
		var updatestate = Ext.getCmp('updatestate').getValue();
		if(updatestate==1){
			MsgUtil.alert('合同已经修改,只能修改一次！');
			return;
		}
		
		editCtract = new ssc.smcs.form.common.ContractEditWin({
			xy_ParentObjHandle : this
		});
		
		var data = {
				contract_amount_account1 : Ext.getCmp('contract_amount_account').getValue(),
				contract_amount_invoice1 : Ext.getCmp('contract_amount_invoice').getValue(),
				contract_amount_payed1 : Ext.getCmp('contract_amount_payed').getValue(),
				contract_amount_receipt1 : Ext.getCmp('contract_amount_receipt').getValue()
				
		};  
		editCtract.initData(data);
		
		editCtract.show();

	}
	
	function initButtonConfig_Sub(){
		this.m_ButtonConfig = [ {
		        					text : "确定",
		        					handler : this.btn_OkEvent,
		        					scope : this
		        				}, 
		        				{
		        					text : "修改",
		        					handler : editFunc,
		        					scope : this
		        				} 
		];
	}
	
	
	winContract = new ssc.smcs.form.common.ContractViewWin(
	{
		xy_ContractID : strContractID,
		initButtonConfig_Sub : initButtonConfig_Sub
	});
	
	//winContract.on('xy_CancelClickEvent',function(){alert(1);});
	
	winContract.show();
	winContract.initData();
};

/**
 * 查看项目详细信息
 */
ssc.smcs.form.common.FormOperationUtil.viewItemInfo = function(strItemID)
{
	//MsgUtil.alert("弹出对话框，显示当前行项目的详情");
	if (strItemID.trim().length <= 0)
	{
		return;
	}

	winItem = new ssc.smcs.form.common.ItemViewWin(
	{
		xy_ItemID : strItemID
	});
	
	winItem.show();
};
/**
 * 查看发票详细信息
 */
ssc.smcs.form.common.FormOperationUtil.viewInvoiceInfo = function(strInvoiceID)
{

	if (strInvoiceID.trim().length <= 0)
	{
		return;
	}

	winInvoice = new ssc.smcs.form.common.InvoiceViewWin(
	{
		xy_InvoiceID : strInvoiceID
	});
	
	winInvoice.show();
};

/**
 * 查看发票包开票详细信息
 */
ssc.smcs.form.common.FormOperationUtil.viewInvoicePackInfo = function(strInvoicePackID)
{

	if (strInvoicePackID.trim().length <= 0)
	{
		return;
	}

	winInvoice = new ssc.smcs.form.common.InvoicePackListDialog(
	{
		xy_ParentObjHandle : this,
		prepareBaseParams : function()
		{
			var condition =
			{
				packid : strInvoicePackID
			};
			return condition;
		}.createDelegate(this)
	});
	
	winInvoice.show();
};

/**
 * 查看订单详细信息
 */
ssc.smcs.form.common.FormOperationUtil.viewOrderInfo = function(strOrderID)
{
	MsgUtil.alert("弹出对话框，显示当前行订单的详情");
};

/**
 * 查看资金付款单
 * 待删除
 */
ssc.smcs.form.common.FormOperationUtil.viewFundPayInfo = function(strOrderID)
{
	MsgUtil.alert("弹出对话框，显示当前行资金付款单的详情");
};

/**
 * 是否现金支付方式
 */
ssc.smcs.form.common.FormOperationUtil.isCashPayType = function(strPayTypeCode)
{
	return (strPayTypeCode == "SHCSPT1002");
};
/**
 * 是否银行支付方式
 */
ssc.smcs.form.common.FormOperationUtil.isBankPayType = function(strPayTypeCode)
{
	return (strPayTypeCode == "SHCSPT1003"
		|| strPayTypeCode == "SHCSPT1004"
		|| strPayTypeCode == "SHCSPT1005");
};

/**
 * 判断多个表格中是否有数据
 */
ssc.smcs.form.common.FormOperationUtil.check_PanelListHasData = function(/*Array*/ panelList)
{
	if (panelList == null || panelList == undefined)
	{
		/* 表格列表为空，忽略  */
		return;
	}

	if (! ssc.common.ArrayUtil.isArray(panelList))
	{
		/* 表格列表不是数组，忽略  */
		return false;
	}

	for (var i = 0; i < panelList.length; i++)
	{
		var gridPanel = panelList[i];

		if (gridPanel == null)
		{
			continue;
		}

		if (gridPanel.rendered == undefined)
		{
			continue;
		}

		/* 未加载的表格忽略 */
		if (! gridPanel.rendered)
		{
			continue;
		}

		if (gridPanel.grid.getStore().getCount() > 0)
		{
			return true;
		}
	}

	return false;
};

/**
 * 获取多个表格名称
 */
ssc.smcs.form.common.FormOperationUtil.get_PanelListHasDataName = function(/*Array*/ panelList)
{
	if (panelList == null || panelList == undefined)
	{
		/* 表格列表为空，忽略  */
		return;
	}

	if (! ssc.common.ArrayUtil.isArray(panelList))
	{
		/* 表格列表不是数组，忽略  */
		return false;
	}

	var strDataGridPanelTitle = "";
	for (var i = 0; i < panelList.length; i++)
	{
		var gridPanel = panelList[i];

		if (gridPanel == null)
		{
			continue;
		}

		if (gridPanel.rendered == undefined)
		{
			continue;
		}

		/* 未加载的表格忽略 */
		if (! gridPanel.rendered)
		{
			continue;
		}

		if (gridPanel.grid.getStore().getCount() <= 0)
		{
			continue;
		}

		if (gridPanel.xy_Title == undefined)
		{
			alert("FormOperationUtil.getPanelListHasDataName, GridPanel[" + gridPanel.id + "]中未设置xy_Title属性，无法获得表格的标题");
			continue;
		}

		if (strDataGridPanelTitle.trim().length > 0)
		{
			strDataGridPanelTitle += ", 【" + gridPanel.xy_Title + "】";
		}
		else
		{
			strDataGridPanelTitle = "【" + gridPanel.xy_Title + "】";
		}
	}

	return strDataGridPanelTitle;
};

/**
 * 清除多个表格中的数据
 * panelList	需要清除数据的面板数组，格式[panel1, panel2, ...]
 */
ssc.smcs.form.common.FormOperationUtil.clear_PanelListData = function(/*Array*/ panelList)
{
	if (panelList == null || panelList == undefined)
	{
		/* 表格列表为空，忽略  */
		return;
	}

	if (! ssc.common.ArrayUtil.isArray(panelList))
	{
		/* 表格列表不是数组，忽略  */
		return false;
	}

	for (var i = 0; i < panelList.length; i++)
	{
		var gridPanel = panelList[i];

		if (gridPanel == null)
		{
			continue;
		}

		if (gridPanel.rendered == undefined)
		{
			continue;
		}

		/* 未加载的表格忽略 */
		if (! gridPanel.rendered)
		{
			continue;
		}

		if (gridPanel.removeAllRecords == undefined)
		{
			continue;
		}
		else
		{
			gridPanel.removeAllRecords();
		}
	}
};

/**
 * 判断公司是否总部
 * 以后改从后台配置获取
 * @param {} unitid 公司ID
 * @return 0 不是总公司 ，1 总公司
 */
ssc.smcs.form.common.FormOperationUtil.isHeadOffice = function(unitid)
{
	var tag = 0 ;
	if(Ext.isEmpty(unitid))
	{
		MsgUtil.alert("判断公司ID是否总公司，公司ID参数为空！");
		return;
	}
	
	if(unitid == "6a9e229a-1cd4-b60a-d971-53cbc97b5118")
	{
		tag = 1 ;
	}
	return tag ;
};

/**
 * 在财务环节，自动把入账日期改为当天
 * 在分公司财务专员、总部财务初审、总部财务复核三个环节处理
 * 目前使用客户端时间
 */
ssc.smcs.form.common.FormOperationUtil.update_AccountDateAtFinStep = function()
{
	var fieldAccountDate = Ext.getCmp("accountdate");
	if (fieldAccountDate == null)
	{
		return;
	}

	if (fieldAccountDate.rendered == false
			|| fieldAccountDate.disabled == true
			|| fieldAccountDate.hidden == true)
	{
		return;
	}

	/* 不是待办状态则不处理 */
	if (! FormOperTypeUtil.isApprove())
	{
		return;
	}

	/* 财务环节 */
	if (FormStatusUtil.isPreCheckStep()
			|| FormStatusUtil.isFillStep()
			|| FormStatusUtil.isCheckStep)
	{
		var oldDate = Ext.getCmp("accountdate").getValue();
		
		var dtNow = ssc.common.DateUtil.getNow();
		//if(oldDate.getMonth()==dtNow.getMonth()&&oldDate.getFullYear()==dtNow.getFullYear())
		if(oldDate.getFullYear()==dtNow.getFullYear())
		{
			fieldAccountDate.setValue(dtNow);
		}
		else
		{
			fieldAccountDate.setValue(oldDate.getLastDateOfMonth());
		}
		
	}
};

/**
 * 红色冲销单入账日期
 * 在财务环节，自动把入账日期改为当天
 * 在分公司财务专员、总部财务初审、总部财务复核三个环节处理
 * 目前使用客户端时间
 */
ssc.smcs.form.common.FormOperationUtil.reverse_update_AccountDate = function()
{
	var fieldAccountDate = Ext.getCmp("accountdate");
	
	if (fieldAccountDate == null)
	{
		return;
	}

	if (fieldAccountDate.rendered == false
			|| fieldAccountDate.disabled == true
			|| fieldAccountDate.hidden == true)
	{
		return;
	}

	/* 不是待办状态则不处理 */
	/*if (! FormOperTypeUtil.isApprove())
	{
		return;
	}*/

	/* 财务环节 */
	if (FormStatusUtil.isPreCheckStep()
			|| FormStatusUtil.isFillStep()
			|| FormStatusUtil.isCheckStep)
	{
		var oldDate = Ext.getCmp("accountdate").getValue();
		var dtNow = ssc.common.DateUtil.getNow();
		//if(oldDate.getMonth()==dtNow.getMonth()&&oldDate.getFullYear()==dtNow.getFullYear())
		if(oldDate.getFullYear()==dtNow.getFullYear())
		{
			fieldAccountDate.setValue(dtNow);
		}
		else
		{
			fieldAccountDate.setValue(oldDate.getLastDateOfMonth());
		}
	}
	
	//业务日期改为当期日期

	var busidateDate = Ext.getCmp("busidate");
	if(busidateDate == null ){return;}
	if(busidateDate.rendered == false|| busidateDate.disabled == true
			|| busidateDate.hidden == true){return;}
	
			if (FormStatusUtil.isPreCheckStep()
					|| FormStatusUtil.isFillStep()
					|| FormStatusUtil.isCheckStep)
			{
				var oldDate1 = Ext.getCmp("busidate").getValue();
				var dtNow = new Date();
			
					busidateDate.setValue(dtNow);
				
			}
	
};
/**
 * 浮点数精度测试功能
 */
ssc.smcs.form.common.FormOperationUtil.testFloat = function()
{
	alert(RenderUtil.RenderMoney_ThirteenFont(0.145));
	return;
	for ( var i = 0; i <= 0; i++)
	{
		for ( var j = 0; j <= 1; j++)
		{
			var array = [];
			for ( var k = 0; k <= 9; k++)
			{
				for ( var m = 0; m <= 9; m++)
				{
					for ( var n = 0; n <= 9; n++)
					{
						var x = i.toString() + j.toString() + "." + k.toString() + m.toString() + n.toString();

						array.push(
						{
							econItemTypeCode : x,
/*							econItemTypeName : NumberUtil.toRound2(x)*/
							econItemTypeName : FormatUtil.Number_Money(x, 2)
/*							econItemTypeName : FormatUtil.MoneyFormat(x)*/
						});
					}
				}
			}

			ssc.smcs.form.common.FormOperationUtil.testFloat_Request(array);
		}
	}

	alert("testFloat end");
};
ssc.smcs.form.common.FormOperationUtil.testFloat_Request = function(array)
{
	Ext.Ajax.request(
	{
		url : "SSC/ssc_cup_EconItemTypeAction!testFloat.action",
		method : "post",
		params : 
		{
			jsonString : Ext.encode(array)
		},
		sync : true,
		success : function(response, options)
		{
			var data = Ext.decode(response.responseText);

			if (data.success)
			{
			}
			else
			{
				MsgUtil.alert(data.msg);
				return;
			}
		},
		failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
		scope : this
	});
};

/**
 * 获取本公司基本户
 * @param
 * strUnitID	公司ID
 * intYear		会计年份
 * intType		1仅支出户2仅收入户3仅收支两用户11所有可支出户12所有可收入户0所有账户
 * @return
 * 	{
 * 		success : true,
 * 		data : 
 * 		{
 * 			bankaccount : {},
 * 			ba_account : {}
 * 		}
 * 	}
 */
ssc.smcs.form.common.FormOperationUtil.get_BaseBankAccount = function(strUnitID, intYear, intType)
{
	if (! FormGlobalVariant.contains_Key("BASEBANKACCOUNT"))
	{
		Ext.Ajax.request(
		{
			url : "SSC/ssc_shcs_FormCommonAction!getBaseBankAccount.action",
			method : "post",
			sync : true,
			params :
			{
				jsonCondition : Ext.encode(
				{
					unitid : strUnitID,
					year : intYear,
					type : intType
				})
			},
			success : function(response, options)
			{
				var responseText = Ext.decode(response.responseText);
				if (responseText.success == true)
				{
					if (responseText.data != undefined && responseText.data != "")
					{
						var bankaccount = responseText.data.bankaccount;
						bankaccount.keyfield = "bankaccountid";
						bankaccount.displayfield = "bankaccountname";

						var ba_account = responseText.data.ba_account;
						ba_account.keyfield = "accountid";
						ba_account.displayfield = "accounttext";

						bankaccount["ba_account"] = ba_account;

						FormGlobalVariant.set_Object("BASEBANKACCOUNT", bankaccount);
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
	}

	return FormGlobalVariant.get_Object("BASEBANKACCOUNT");
};

/**
 * 获取本公司账户
 * @param
 * strUnitID	公司ID
 * intYear		会计年份
 * intType		1仅支出户2仅收入户3仅收支两用户11所有可支出户12所有可收入户0所有账户
 * intUse		用途
 * @return
 * 	{
 * 		success : true,
 * 		data : 
 * 		{
 * 			bankaccount : {},
 * 			ba_account : {}
 * 		}
 * 	}
 */
ssc.smcs.form.common.FormOperationUtil.get_BankAccount = function(strUnitID, intYear, intType, intUse)
{
	Ext.Ajax.request(
	{
		url : "SSC/ssc_shcs_FormCommonAction!getBaseBankAccount.action",
		method : "post",
		sync : true,
		params :
		{
			jsonCondition : Ext.encode(
			{
				unitid : strUnitID,
				year : intYear,
				type : intType,
				use : intUse
			})
		},
		success : function(response, options)
		{
			var responseText = Ext.decode(response.responseText);
			if (responseText.success == true)
			{
				if (responseText.data != undefined && responseText.data != "")
				{
					var bankaccount = responseText.data.bankaccount;
					bankaccount.keyfield = "bankaccountid";
					bankaccount.displayfield = "bankaccountname";

					var ba_account = responseText.data.ba_account;
					ba_account.keyfield = "accountid";
					ba_account.displayfield = "accounttext";

					bankaccount["ba_account"] = ba_account;
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

	return bankaccount;
};


/**
 * 读取合同执行金额
 * strContractID，strContractCode：必须要有一个值
 * type : 查询类型
 * 	不传，表示查询所有执行金额
 * 	amount_payed : --已付款金额
 * 	amount_account : --已列账金额
 * 	amount_receipt : --已收款金额
 * 	amount_invoice : --已开票金额
 */

ssc.smcs.form.common.FormOperationUtil.get_ContactExecAmount = function(strContractID, strContractCode, type)
{
	var loadMask = new Ext.LoadMask(Ext.getBody(),
	{
		msg : "读取合同执行金额....",
		removeMask : true
	});
	loadMask.show();

	var contractExecAmount = 
	{
		amount : 0,
		amount_payed : 0,
		amount_account : 0,
		amount_receipt : 0,
		amount_invoice : 0
	};

	try
	{
		var param =
		{
			contractid :strContractID,
			contractcode : strContractCode
		};
		if (type != undefined || type != "")
		{
			param.type = type;
		}

		Ext.Ajax.request(
		{
			url : "SSC/ssc_shcs_ContractAction!getContactExecAmount.action",
			method : "post",
			sync : true,
			params :
			{
				jsonCondition : Ext.encode(param)
			},
			success : function(response, options)
			{
				var responseText = Ext.decode(response.responseText);
				if (responseText.success == true)
				{
					contractExecAmount.amount = responseText.amount;
					contractExecAmount.amount_account = responseText.accountamount;
					contractExecAmount.amount_invoice = responseText.invoiceamount;
					contractExecAmount.amount_payed = responseText.payedamount;
					contractExecAmount.amount_receipt = responseText.receptedamount;
				}
				else
				{
					MsgUtil.alert(responseText.msg);
				}
			}.createDelegate(this),
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this,
			timeout : 0
		});

		return contractExecAmount;
	}
	finally
	{
		loadMask.hide();
	}
};