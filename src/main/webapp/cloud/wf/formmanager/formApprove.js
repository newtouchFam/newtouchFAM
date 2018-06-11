var m_LoadMask = null;
var m_WorkData = null;
var m_ProcData = null;

/**
 * @public 获取初始化数据接口<br>
 *         对业务表单开放<br>
 * @returns
 */
function getInitData()
{
	if (m_WorkData == null)
	{
		m_WorkData = new WfWorkData(Ext.get("workDataState").dom.value);
	}

	m_ProcData = new WfProcData(Ext.get("processInstState").dom.value);
	var info =
	{
		formCode : Ext.get("formSerialNo").dom.value,
		processinstState : Ext.get("processInstState").dom.value,
		workDataState : Ext.get("workDataState").dom.value
	};
	return info;
}

/**
 * @public 获取流程变量接口<br>
 *         对业务表单开放<br>
 * @returns
 */
function getWorkData()
{
	return m_WorkData;
}

/**
 * @public 获取流程变量接口<br>
 *         对业务表单开放<br>
 * @returns
 */
function getProcData()
{
	return m_ProcData;
}

function doInit()
{
	if (window.opener == this)
	{
		MsgUtil.alert("警告", "错误的打开方式");
		closeWindow();
	}

	if (m_WorkData == null)
	{
		m_WorkData = new WfWorkData(Ext.get("workDataState").dom.value);
	}
	var txtFormName = Ext.get("processName").dom.value;

	var pnlSplit1 = new Ext.Panel(
	{
		html : "<div class='xy-wf-tb-top-pnl-spr'></div>",
		height : 8,
		autoWidth : true,
		border : false
	});

	var formType = m_WorkData.getValue("FORMTYPE");

	/**
	 * 按钮：
	 * 发起环节：提交申请，打印，流程图
	 * 中间审批环节：同意，退回，转发，转拟办，不同意，打印，流程图
	 */
	var htmToolBar = "<div class='xy-toolbar-wf-itemmgr' height='52px'>";
	htmToolBar += "<table cellspacing='0' unselectable=on><tr>";
	
	if (isStartActivity())
	{
		htmToolBar += "<td><div id='btnSubmit' class='xy-tb-wf-btn'><div></div><span>提交申请</span></div></td>";
	}
	else
	{
		htmToolBar += "<td><div id='btnSubmit' class='xy-tb-wf-btn'><div></div><span>同意</span></div></td>";
		htmToolBar += "<td><div id='btnRollback' class='xy-tb-wf-btn'><div></div><span>退回</span></div></td>";
		htmToolBar += "<td><div class='xy-tb-wf-spr'></div></td>";
		htmToolBar += "<td><div id='btnTranswith' class='xy-tb-wf-btn'><div></div><span>转办</span></div></td>";
		htmToolBar += "<td><div id='btnTransmit' class='xy-tb-wf-btn'><div></div><span>转拟办</span></div></td>";
		htmToolBar += "<td><div class='xy-tb-wf-spr'></div></td>";
		htmToolBar += "<td><div id='btnReject' class='xy-tb-wf-btn'><div></div><span>不同意</span></div></td>";
	}

	htmToolBar += "<td><div class='xy-tb-wf-spr'></div></td>";
	htmToolBar += "<td><div id='btnPrint' class='xy-tb-wf-btn'><div></div><span>打印</span></div></td>";
	htmToolBar += "<td><div class='xy-tb-wf-spr'></div></td>";
	htmToolBar += "<td><div id='btnProcinstimg' class='xy-tb-wf-btn'><div></div><span>流程图</span></div></</td>";

	htmToolBar += "<td style='width:100%'><div id='fqbx' class='xy-wf-title-txt'>待办审批:<span id='Title_formTypeName'>" + txtFormName + "</span></div></td>";

	htmToolBar += "<td><div id='btnClose' class='xy-tb-wf-btn'><div></div><span>关闭</span></div></</td>";
	htmToolBar += "</tr></table></div>";

	var pnlToolBar = new Ext.Panel(
	{
		html : htmToolBar,
		height : 52,
		autoWidth : true,
		border : false
	});

	var pnlSplit2 = new Ext.Panel(
	{
		html : "<div class='xy-wf-tb-top-pnl-spr'></div>",
		height : 8,
		autoWidth : true,
		border : false
	});

	var mainTop =
	{
		id : "mainTop",
		region : "north",
		height : 68,
		items : [ pnlSplit1, pnlToolBar, pnlSplit2 ],
		border : false
	};
	var mainCenter =
	{
		id : "mainCenter",
		region : "center",
		contentEl : "frmFormInfo",
		border : false
	};

	var pnlSplit3 = new Ext.Panel(
	{
		html : "<div class='xy-wf-tb-bottom-pnl-spr'></div>",
		height : 8,
		autoWidth : true,
		border : false
	});

	var htmCheckDesc = "<div class='xy-wf-itemmgr-checkdesc'>";
	htmCheckDesc += "<table cellspacing='0'>";
	htmCheckDesc += "<tr>";
	htmCheckDesc += "<td valign=top></td>";
	htmCheckDesc += "<td valign=top>";
	if (isStartActivity())
	{
		htmCheckDesc += "<input type='button' id='btnCheckOK' value='提交申请'/>";
	}
	else
	{
		htmCheckDesc += "<input type='button' id='btnCheckOK' value='同意'/>";
		htmCheckDesc += "<input type='button' id='btnCheckNotOK' value='不同意'/>";
	}

	htmCheckDesc += "<input type='button' id='btnIdioms' value='习惯用语'/>";
	htmCheckDesc += "</td><td valign=top></td></tr><tr>";

	htmCheckDesc += "<td valign=top><span>&nbsp;&nbsp审批意见：</span></td>";
	htmCheckDesc += "<td style='width:100%;align:left'>";
	htmCheckDesc += "<textArea id='txtCheckDesc' style='width:99%;height:50px'></textArea></td>";
	htmCheckDesc += "<td>&#160;</td></tr></table></div>";

	var pnlCheckDesc = new Ext.Panel(
	{
		html : htmCheckDesc,
		height : 75,
		autoWidth : true,
		border : false
	});

	var pnlSplit4 = new Ext.Panel(
	{
		html : "<div class='xy-wf-tb-top-pnl-spr'></div>",
		height : 8,
		autoWidth : true,
		border : false
	});

	var mainBottom =
	{
		id : "mainBottom",
		region : "south",
		height : 90,
		items : [ pnlSplit3, pnlCheckDesc, pnlSplit4 ],
		border : false
	};

	var mainViewport = new Ext.Viewport(
	{
		id : "mainViewport",
		layout : "border",
		items : [ mainBottom, mainTop, mainCenter ]
	});

	mainViewport.on("beforeremove", function fixIFrame(lr, cp)
	{
		var sheetId = cp.getEl().id;
		var frameId = "frmFormInfo";
		Ext.get(frameId).dom.src = "javascript:false";
	}, mainViewport);

	initButtonEvent();
}

function showMask()
{
	if (m_LoadMask == null)
	{
		m_LoadMask = new Ext.LoadMask(document.body,
		{
			msg : "正在处理，请稍候...",
			removeMask : true
		});

		m_LoadMask.show();
	}
}

function hideMask()
{
	if (m_LoadMask)
	{
		m_LoadMask.hide();
		m_LoadMask = null;
	}
}

function initButtonEvent()
{
	var btnSubmit = Ext.get("btnSubmit");
	btnSubmit.addClassOnOver("xy-tb-wf-btn-over");
	btnSubmit.on("click", on_SubmitClick);

	var btnRollback = Ext.get("btnRollback");
	if (btnRollback != null)
	{
		btnRollback.addClassOnOver("xy-tb-wf-btn-over");
		btnRollback.on("click", on_RollbackClick);
	}

	var btnTranswith = Ext.get("btnTranswith");
	if (btnTranswith != null)
	{
		btnTranswith.addClassOnOver("xy-tb-wf-btn-over");
		btnTranswith.on("click", on_TranswithClick);
	}

	var btnTransmit = Ext.get("btnTransmit");
	if (btnTransmit != null)
	{
		btnTransmit.addClassOnOver("xy-tb-wf-btn-over");
		btnTransmit.on("click", on_TransmitClick);
	}

	var btnReject = Ext.get("btnReject");
	if (btnReject != null)
	{
		btnReject.addClassOnOver("xy-tb-wf-btn-over");
		btnReject.on("click", on_RejectClick);
	}

	var btnPrint = Ext.get("btnPrint");
	btnPrint.addClassOnOver("xy-tb-wf-btn-over");
	btnPrint.on("click", on_PrintClick);

	var btnProcinstimg = Ext.get("btnProcinstimg");
	btnProcinstimg.addClassOnOver("xy-tb-wf-btn-over");
	btnProcinstimg.on("click", on_ProcinstimgClick);

	var btnClose = Ext.get("btnClose");
	btnClose.addClassOnOver("xy-tb-wf-btn-over");
	btnClose.on("click", on_CloseClick);

	var btnCheckOK = Ext.get("btnCheckOK");
	btnCheckOK.addClassOnOver("xy-tb-wf-btn-over");
	btnCheckOK.on("click", on_SubmitClick);

	var btnCheckNotOK = Ext.get("btnCheckNotOK");
	if (btnCheckNotOK != null)
	{
		btnCheckNotOK.addClassOnOver("xy-tb-wf-btn-over");
		btnCheckNotOK.on("click", on_RejectClick);
	}

	var btnIdioms = Ext.get("btnIdioms");
	btnIdioms.addClassOnOver("xy-tb-wf-btn-over");
	btnIdioms.on("click", on_IdiomsClick);
}


/**
 * 操作前检查表单数据加载是否完成
 */
function checkFormDataLoaded()
{
	if (frmFormInfo.checkFormDataLoaded != undefined)
	{
		if (typeof(frmFormInfo.checkFormDataLoaded) == "function")
		{
			if (! frmFormInfo.checkFormDataLoaded())
			{
				Ext.XyMessageBox.alert("提示", "表单数据未加载完成，请等待完成后再操作");
				return false;			
			}
		}
	}

	return true;
}

/**
 * 按钮 - 提交
 */
function on_SubmitClick()
{
	/**
	 * 校验表单数据加载是否完成
	 */
	if (! checkFormDataLoaded())
	{
		return;
	}

	/**
	 * 验证业务表单数据
	 */
	if (! frmFormInfo.validate("submit"))
	{
		return;
	}

	if (frmFormInfo.OnSubmit !== undefined
			&& typeof (frmFormInfo.OnSubmit) == "function")
	{
		frmFormInfo.OnSubmit();
	}

	goOnSubmit();
}

/**
 * 提交动作
 */
function goOnSubmit()
{
	/**
	 * 加入默认审批意见
	 */
	var checkDesc = Ext.get("txtCheckDesc").dom.value;
	if (checkDesc.length == 0)
	{
		if (isStartActivity())
		{
			checkDesc = "请领导审阅";
		}
		else
		{
			checkDesc = "同意";
		}
		Ext.get("txtCheckDesc").dom.value = checkDesc;
	}
	else if (checkDesc.realLength() > 2048)
	{
		MsgUtil.alert("审批意见不能超过2048个字节");
		return;
	}

	var processInstID = Ext.get("processInstID").dom.value;
	var activityInstID = Ext.get("activityInstID").dom.value;
	var workItemID = Ext.get("workItemID").dom.value;
	var formSerialNo = Ext.get("formSerialNo").dom.value;

	/**
	 * 获取业务表单数据
	 */
	var formDataJson = frmFormInfo.getFormData();

	/**
	 * 创建审批历史
	 */
	var historyJson = Ext.util.JSON.encode(
	{
		SERIALNUM : formSerialNo,
		ISAGREE : "1",
		CHECKDESC : checkDesc
	});

	var workDataJson = m_WorkData.getModifiedJson();

	/**
	 * 判断转拟办工作项
	 */
	if (workItemID.indexOf("#-") != 0)
	{
		/**
		 * 普通待办工作项
		 */

		wf.FormManagerUtil.showMask();

		ApproveUserService.getNextActivityUser(processInstID, activityInstID, workDataJson,
			function(response, options)
			{
				wf.FormManagerUtil.hideMask();
		
				var data = Ext.decode(response.responseText);
		
				if (data.success)
				{
					var activityUserXML = data.data;

					submitFormWithActivityUser(activityUserXML, formDataJson, workDataJson, workItemID, historyJson);
				}
				else
				{
					MsgUtil.alert("获取下一步审批人发生错误: " + data.msg);
				}
			},
			function(response, options)
			{
				wf.FormManagerUtil.hideMask();
		
				MsgUtil.alert("获取下一步审批人发生错误");
			},
			this);
	}
	else
	{
		/**
		 * 转拟办工作项
		 */
		MsgUtil.confirm("确认", "该单据为其他人交由您转拟办，会自动提交给该人，确认要继续么？", function(btn, text)
		{
			if (btn == "yes")
			{
				submitForm("", formDataJson, workDataJson, workItemID, historyJson);
			}
		}, this);
	}
}

/**
 * 获取审批人后提交 
 */
function submitFormWithActivityUser(activityUserXML, formDataJson, workDataJson, workItemID, historyJson)
{
	if (activityUserXML == null || activityUserXML == "")
	{
		/**
		 * 无用户，自动提交
		 */
		submitForm("", formDataJson, workDataJson, workItemID, historyJson);
	}
	else
	{
		/**
		 * 选择用户后提交
		 */
		var dialog = new wf.component.ApproveUserDialog(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : function(_Dialog)
			{
				/**
				 * 选择用户后提交
				 */
				var approveUserXML = _Dialog.getSelectedApproveUserXML();

				submitForm(approveUserXML, formDataJson, workDataJson, workItemID, historyJson);
			},
		});
		dialog.setApproveUserData(activityUserXML);
		dialog.show();
	}
}

/**
 * 根据选择的参与者提交
 * 未传入参与者，表示为自动提交
 * @param activityUserIDXml	选择的参与者XML
 */
function submitForm(approveUserXML, formDataJson, workDataJson, workItemID, historyJson)
{
	wf.FormManagerUtil.showMask();

	ActivitySubmitService.submit(workItemID, formDataJson, workDataJson, historyJson, approveUserXML,
		function(response, options)
		{
			wf.FormManagerUtil.hideMask();

			var data = Ext.decode(response.responseText);

			if (data.success)
			{
				/**
				 * 发起环节才允许打印
				 */
				if (isStartActivity())
				{
					MsgUtil.confirm("表单提交成功，是否打印?", function(btn, text)
					{
						/**
						 * 回调主界面
						 */
						wf.FormManagerUtil.callbackAfterOperation();
	
						if (btn == "yes")
						{
							on_PrintClick();
						}
						else
						{
							window.close();
						}
					}, this);
				}
				else
				{
					MsgUtil.alert("表单提交成功", function(btn, text)
					{
						/**
						 * 回调主界面
						 */
						wf.FormManagerUtil.callbackAfterOperation();

						window.close();
					}, this);
				}
			}
			else
			{
				MsgUtil.alert("表单提交发生错误: " + data.msg);
			}
		},
		function(response, options)
		{
			wf.FormManagerUtil.hideMask();

			MsgUtil.alert("表单提交发生错误");
		},
		this);
}


/**
 * 按钮 - 回退
 */
function on_RollbackClick()
{
	MsgUtil.alert("尚未移植");
	return;

	/**
	 * 校验表单数据加载是否完成
	 */
	if (! checkFormDataLoaded())
	{
		return;
	}

	/**
	 * 验证业务表单数据
	 */
	if (! frmFormInfo.validate("rollback"))
	{
		return;
	}

	var workItemID = Ext.get("workItemID").dom.value;
	var formSerialNo = Ext.get("formSerialNo").dom.value;
	var checkDesc = Ext.get("txtCheckDesc").dom.value;
	if (checkDesc.length == 0) 
	{
		checkDesc = "退回";
	}
	else if (checkDesc.realLength() > 2048) 
	{
		MsgUtil.alert("审批意见不能超过2048个字节");
		return;
	}

	var historyJson = Ext.util.JSON.encode(
	{
		SERIALNUM : formSerialNo,
		ISAGREE : "0",
		CHECKDESC : checkDesc
	});

	this.rollbackwin = new Ext.app.XyChooseRollback({
		width : 320,
		height : 480,
		noImage : 0,
		buttons : [{
			text : '确定',
			handler : rollbackok_handler.createDelegate(this)
		}, {
			text : "关闭",
			handler : function() {
			    this.rollbackwin.close();
			}.createDelegate(this)
		}]
	});
	this.rollbackwin.show();
	
	function rollbackok_handler() {
		var activityID = this.rollbackwin.getActivity();
		if (activityID.length == 0) { return; }
		var userIdJson = this.rollbackwin.getUser();
		if (userIdJson.length == 0) { return; }
		
		if (activityID == null || activityID == "" || userIdJson == null
				|| userIdJson == "") 
		{
			MsgUtil.alert("提示", "请选择退回目标活动及用户");
			return;
		}

		if ((frmFormInfo.OnRollback !== undefined)
				&& (typeof frmFormInfo.OnRollback == "function")) {
			frmFormInfo.OnRollback(activityID);
		}

		var formDataJson = frmFormInfo.getFormData();
		var workDataJson = m_WorkData.getModifiedJson();

		var smLoadMask = new Ext.LoadMask(document.body, {
			msg : "正在处理，请稍候...",
			removeMask : true
		});
		smLoadMask.show();

		ActivityRollbackService.submit(workItemID, activityID, userIdJson, formDataJson, workDataJson, historyJson,
		{
			callback : rollBackCallback,
			async : false
		});

		function rollBackCallback(result)
		{
			if (smLoadMask)
			{
				smLoadMask.hide();
				smLoadMask = null;
			}

			if (result == null || result == "")
			{
				top.Ext.XyMessageBox.alert("提示", "成功退回", alertCallBack_Close);
			}
			else
			{
				top.Ext.XyMessageBox.alert("错误", result);
			}
		}
	}
}

/**
 * 按钮 - 转发
 * @returns {Boolean}
 */
function on_TranswithClick()
{
	MsgUtil.alert("尚未移植");
	return;

	/**
	 * 2014-07-31
	 * 增加操作前表单数据加载是否完成校验
	 */
	if (! checkFormDataLoaded())
	{
		return;
	}

	var vd = frmFormInfo.validate("transwith");
	if (vd === false) {
		return;
	}

	var checkDesc = Ext.get("txtCheckDesc").dom.value;
	if (checkDesc.length == 0) {
		checkDesc = "转办";
	}
	if (checkDesc.realLength() > 2048) {
		Ext.XyMessageBox.alert("信息", "审批意见不能超过2048个字节");
		return false;
	}

	var userID = Ext.get("UserID").dom.value;

	wftransform(userID, callBack);

	function callBack(transformId) {
		if ((frmFormInfo.OnTransfer !== undefined)
				&& (typeof frmFormInfo.OnTransfer == "function")) {
			frmFormInfo.OnTransfer(transformId);
		}

		var workItemID = Ext.get("workItemID").dom.value;
		var formDataJson = frmFormInfo.getFormData();
		var workDataJson = m_WorkData.getModifiedJson();

		WorkItemTransformService.transform(workItemID, transformId,
				formDataJson, workDataJson, checkDesc, {
					callback : transFormCallback,
					async : false
				});

		function transFormCallback(result) {
			if (result == null || result == "") {
				top.Ext.XyMessageBox.alert("提示", "处理完成", alertCallBack_Close);
			} else {
				top.Ext.XyMessageBox.alert("错误", result);
			}
		}
	}
}

/**
 * 按钮 - 转拟办
 * @returns {Boolean}
 */
function on_TransmitClick()
{
	MsgUtil.alert("尚未移植");
	return;

	/**
	 * 2014-07-31
	 * 增加操作前表单数据加载是否完成校验
	 */
	if (! checkFormDataLoaded())
	{
		return;
	}

	var vd = frmFormInfo.validate("transmit");
	if (vd === false) {
		return;
	}

	var checkDesc = Ext.get("txtCheckDesc").dom.value;
	if (checkDesc.length == 0) {
		checkDesc = "转拟办";
	}
	if (checkDesc.realLength() > 2048) {
		Ext.XyMessageBox.alert("信息", "审批意见不能超过2048个字节");
		return false;
	}

	var userID = Ext.get("UserID").dom.value;

	wftransmit(userID, callBack);

	function callBack(transformId) {
		if ((frmFormInfo.OnTransmit !== undefined)
				&& (typeof frmFormInfo.OnTransmit == "function")) {
			frmFormInfo.OnTransmit(transformId);
		}

		var workItemID = Ext.get("workItemID").dom.value;
		var formDataJson = frmFormInfo.getFormData();
		var workDataJson = m_WorkData.getModifiedJson();

		WorkItemTransmitService.transmit(workItemID, transformId, formDataJson,
				workDataJson, checkDesc, {
					callback : transFormCallback,
					async : false
				});

		function transFormCallback(result) {
			if (result == null || result == "") {
				top.Ext.XyMessageBox.alert("提示", "处理完成", alertCallBack_Close);
			} else {
				top.Ext.XyMessageBox.alert("错误", result);
			}
		}
	}
}

/**
 * 按钮 - 不同意/拒绝
 */
function on_RejectClick()
{
	/**
	 * 校验表单数据加载是否完成
	 */
	if (! checkFormDataLoaded())
	{
		return;
	}

	/**
	 * 验证业务表单数据
	 */
	if (! frmFormInfo.validate("reject"))
	{
		return;
	}

	var checkDesc = Ext.get("txtCheckDesc").dom.value.trim();
	if (checkDesc.length == 0)
	{
		MsgUtil.alert("请在下方【审批意见】栏中填写不同意理由",
			function()
			{
				Ext.get("txtCheckDesc").dom.focus();
			},
			this);

		return;
	}
	
	if (StringUtil.hasLimitedChar(checkDesc))
	{
		MsgUtil.alert("下方【审批意见】栏中填写不同意理由 填写内容不能包含字符【" + StringUtil.getFirstLimitedChar(checkDesc) + "】",
			function()
			{
				Ext.get("txtCheckDesc").dom.focus();
			},
			this);
		return;
	}
		
	MsgUtil.confirm("你点击了【不同意】的操作，表单将直接退回发起人，是否继续?", 
		function(button, text)
		{
			if (button == "yes") 
			{
				doReject();
			}
		});
}

function doReject()
{
	var workItemID = Ext.get("workItemID").dom.value;
	var formSerialNo = Ext.get("formSerialNo").dom.value;
	var checkDesc = Ext.get("txtCheckDesc").dom.value;

	if (checkDesc.length == 0)
	{
		checkDesc = "不同意";
	}
	else if (checkDesc.realLength() > 2048)
	{
		Ext.XyMessageBox.alert("信息", "审批意见不能超过2048个字节");
		return;
	}

	var historyJson = Ext.util.JSON.encode(
	{
		SERIALNUM : formSerialNo,
		ISAGREE : "0",
		CHECKDESC : checkDesc
	});

	if (frmFormInfo.OnReject !== undefined
			&& typeof frmFormInfo.OnReject == "function")
	{
		frmFormInfo.OnReject();
	}

	var formDataJson = frmFormInfo.getFormData();
	var workDataJson = m_WorkData.getModifiedJson();

	wf.FormManagerUtil.showMask();

	ActivityRefuseService.refuse(workItemID, formDataJson, workDataJson, historyJson,
		function(response, options)
		{
			wf.FormManagerUtil.hideMask();
	
			var data = Ext.decode(response.responseText);
	
			if (data.success)
			{
				MsgUtil.alert("不同意成功，表单已退回到发起人", function(btn, text)
					{
						/**
						 * 回调主界面
						 */
						wf.FormManagerUtil.callbackAfterOperation();

						window.close();
					}, this);
			}
			else
			{
				MsgUtil.alert("不同意发生错误: " + data.msg);
			}
		},
		function(response, options)
		{
			wf.FormManagerUtil.hideMask();
	
			MsgUtil.alert("不同意发生错误");
		},
		this);
}

/**
 * 按钮-打印
 */
function on_PrintClick( )
{
	var formID = Ext.get("formID").dom.value;
	var processInstID = Ext.get("processInstID").dom.value;
	var javaBean = frmFormInfo.getPrintJavaBeanName();

	wf.FormManagerUtil.printFormPDF(javaBean, formID, processInstID);
}


/**
 * 按钮-流程图
 */
function on_ProcinstimgClick()
{
	showTransInstImg(Ext.get("processInstID").dom.value);
}

/**
 * 按钮-习惯用语
 */
function on_IdiomsClick()
{
	showIdiomsWin(setCheckDesc);
	function setCheckDesc(s)
	{
		var txtCheckDesc = Ext.get("txtCheckDesc");

		if (txtCheckDesc)
		{
			txtCheckDesc.dom.value = s;
		}
	}
}

/**
 * 按钮-关闭
 */
function on_CloseClick()
{
	window.close();
}

/**
 * 判断当前是否为开始环节
 * @returns {Boolean}
 */
function isStartActivity()
{
	return (Ext.get("activity_BusiType").dom.value == 'START');
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(doInit, this, true);