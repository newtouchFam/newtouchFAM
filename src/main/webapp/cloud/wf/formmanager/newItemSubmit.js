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

	var pnlSplit1 = new Ext.Panel({html:"<div class='xy-wf-tb-top-pnl-spr'></div>", height:8, autoWidth:true, border:false});		

	var txtFormName = Ext.get("processName").dom.value;
	
	var htmToolBar = "<div class='xy-toolbar-wf-itemmgr' height='52px'>";
	htmToolBar += "<table cellspacing='0' unselectable=on><tr>";
	htmToolBar += "<td><div id='btnSubmit' class='xy-tb-wf-btn'><div></div><span>提交申请</span></div></td>";
	htmToolBar += "<td><div class='xy-tb-wf-spr'></div></td>";
	htmToolBar += "<td><div id='btnSave' class='xy-tb-wf-btn'><div></div><span>保存草稿</span></div></td>";
	htmToolBar += "<td><div class='xy-tb-wf-spr'></div></td>";
	htmToolBar +="<td><div id='btnProcinstimg' class='xy-tb-wf-btn'><div></div><span>流程图</span></div></</td>";

	htmToolBar += "<td style='width:100%'><div id='fqbx' class='xy-wf-title-txt'>业务流程 ：<span id='Title_formTypeName'>" + txtFormName + "</span></div></td>";

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

	var mainViewport = new Ext.Viewport(
	{
		id : "mainViewport",
		layout : "border",
		items : [ mainTop, mainCenter ]
	});			

	mainViewport.on("beforeremove", function fixIFrame(lr, cp) 
	{
         var sheetId = cp.getEl().id;
         var frameId = "frmFormInfo";
         Ext.get(frameId).dom.src = "javascript:false";
    }, mainViewport);

	initButtonEvent();
}

function initButtonEvent()
{
	var btnSubmit = Ext.get("btnSubmit");
	btnSubmit.addClassOnOver("xy-tb-wf-btn-over");
	btnSubmit.on("click", on_SubmitClick);

	var btnSave = Ext.get("btnSave");
	btnSave.addClassOnOver("xy-tb-wf-btn-over");
	btnSave.on("click", on_SaveClick);

	var btnProcinstimg = Ext.get("btnProcinstimg");
	btnProcinstimg.addClassOnOver("xy-tb-wf-btn-over");
	btnProcinstimg.on("click", on_ProcinstimgClick);
	
	var btnClose = Ext.get("btnClose");
	btnClose.addClassOnOver("xy-tb-wf-btn-over");
	btnClose.on("click", on_CloseClick);
}

/**
 * 按钮-提交
 */
function on_SubmitClick()
{
	/**
	 * 验证业务表单数据
	 */
	if (! frmFormInfo.validate("submit"))
	{
		return;
	}

	if (frmFormInfo.OnSubmit !== undefined
			&& typeof( frmFormInfo.OnSubmit) == "function") 
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
	var userID = Ext.get("userID").dom.value;
	var processID = Ext.get("processID").dom.value;
	var activityID = Ext.get("activityID").dom.value;
	var formID = Ext.get("formID").dom.value;
	var workItemID = Ext.get("workItemID").dom.value;
	var formSerialNo = Ext.get("formSerialNo").dom.value;
	var formDataJson = frmFormInfo.getFormData();
	var historyJson = Ext.util.JSON.encode(
	{
		SERIALNUM : formSerialNo,
		ISAGREE : "1",
		CHECKDESC : '请领导审阅'
	});

	var workDataJson = m_WorkData.getModifiedJson();

	wf.FormManagerUtil.showMask();

	/**
	 * 获取下一步审批人
	 */
	ApproveUserService.getSMANextActivityUser(userID, processID, activityID, workDataJson,
		function(response, options)
		{
			wf.FormManagerUtil.hideMask();
	
			var data = Ext.decode(response.responseText);
	
			if (data.success)
			{
				var activityUserXML = data.data;
				submitFormWithActivityUser(activityUserXML, formDataJson, workDataJson, userID, processID,
					activityID, formID, workItemID, historyJson);
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

/**
 * 获取审批人后提交 
 */
function submitFormWithActivityUser(activityUserXML, formDataJson, workDataJson, userID, processID,
	activityID, formID, workItemID, historyJson)
{
	if (activityUserXML == null || activityUserXML == "")
	{
		/**
		 * 无用户，自动提交
		 */
		submitForm("", formDataJson, workDataJson, userID, processID,
			activityID, formID, workItemID, historyJson);
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

				submitForm(approveUserXML, formDataJson, workDataJson, userID, processID,
					activityID, formID, workItemID, historyJson);
			},
		});
		dialog.setApproveUserData(activityUserXML);
		dialog.show();
	}
}

/**
 * 根据选择的参与者提交
 * 未传入参与者，表示为自动提交
 * @param approveUserXML	选择的参与者XML
 */
function submitForm(approveUserXML, formDataJson, workDataJson, userID, processID,
	activityID, formID, workItemID, historyJson)
{
	wf.FormManagerUtil.showMask();

	ActivitySubmitService.startEx(userID, processID, activityID, formID, workItemID,
		formDataJson, workDataJson, historyJson, approveUserXML,
		function(response, options)
		{
			wf.FormManagerUtil.hideMask();

			var data = Ext.decode(response.responseText);

			if (data.success)
			{
				MsgUtil.confirm("表单提交成功，是否打印?", function(btn, text)
				{
					/**
					 * 回调主界面
					 */
					wf.FormManagerUtil.callbackAfterOperation();

					if (btn == "yes")
					{
						printForm(formID, data.data);
					}
					else
					{
						window.close();
					}
				}, this);
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
 * 打印
 * @param formID
 * @param processInstID
 */
function printForm(formID, processInstID)
{
	var javaBean = frmFormInfo.getPrintJavaBeanName();

	wf.FormManagerUtil.printFormPDF(javaBean, formID, processInstID);
}

/**
 * 按钮-保存草稿
 */
function on_SaveClick()
{
	if (! frmFormInfo.validate("draft"))
	{
		return;
	}

	if (frmFormInfo.OnSave !== undefined
			&& typeof (frmFormInfo.OnSave) == "function")
	{
		frmFormInfo.OnSave();
	}

	saveForm();
}

/**
 * 保存草稿动作
 */
function saveForm()
{
	wf.FormManagerUtil.showMask();

	var formID = Ext.get("formID").dom.value;
	var formDataJson = frmFormInfo.getDraftFormData();

	ActivityDraftService.saveDraft(formID, formDataJson,
		function(response, options)
		{
			wf.FormManagerUtil.hideMask();
	
			var data = Ext.decode(response.responseText);
	
			if (data.success && data.data.length > 0)
			{
				MsgUtil.alert("表单草稿保存成功",
					function()
					{
						window.close();
					}, this);

				wf.FormManagerUtil.callbackAfterOperation();
			}
			else
			{
				MsgUtil.alert("保存表单草稿发生错误: " + data.msg);
			}
		},
		function(response, options)
		{
			wf.FormManagerUtil.hideMask();
	
			MsgUtil.alert("保存表单草稿发生错误");
		},
		this);
}

/**
 * 按钮-流程图
 */
function on_ProcinstimgClick()
{
	showTransImg(Ext.get("processID").dom.value);
}

/**
 * 按钮-关闭
 */
function on_CloseClick()
{
	window.close();
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(doInit, this, true);