var m_WorkData = null;
var m_ProcData = null;

/**
 * @public 获取初始化数据接口<br>
 *         对业务表单开放<br>
 * @returns
 */
function getInitData()
{
	m_WorkData = new WfWorkData(Ext.get("workDataState").dom.value);
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
	if (opener == this)
	{
		MsgUtil.alert("警告", "错误的打开方式");
		closeWindow();
	}

	var txtFormName = Ext.get("processName").dom.value;

	var pnlSplit1 = new Ext.Panel(
	{
		html : "<div class='xy-wf-tb-top-pnl-spr'></div>",
		height : 8,
		autoWidth : true,
		border : false
	});

	var htmToolBar = "<div class='xy-toolbar-wf-itemmgr' height='52px'>";
	htmToolBar += "<table cellspacing='0' unselectable=on><tr>";
	htmToolBar += "<td><div id='btnRollback' class='xy-tb-wf-btn'><div></div><span>撤回</span></div></td>";
	htmToolBar += "<td><div class='xy-tb-wf-spr'></div></td>";
	htmToolBar += "<td><div id='btnPrint' class='xy-tb-wf-btn'><div></div><span>打印</span></div></td>";
	htmToolBar += "<td><div class='xy-tb-wf-spr'></div></td>";
/*
	htmToolBar += "<td><div id='btnAttach' class='xy-tb-wf-btn'><div></div><span>附件</span></div></td>"
	htmToolBar += "<td><div class='xy-tb-wf-spr'></div></td>";
*/
	htmToolBar += "<td><div id='btnProcinstimg' class='xy-tb-wf-btn'><div></div><span>流程图</span></div></</td>";
	htmToolBar += "<td style='width:100%'><div class='xy-wf-title-txt'>审批处理中 ：";
	htmToolBar += "<span id='Title_formTypeName'>" + txtFormName + "</span></div></td>";
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
		height : 8,
		items : [ pnlSplit4 ],
		border : false
	};

	var mainViewport = new Ext.Viewport(
	{
		id : "mainViewport",
		layout : "border",
		items : [ mainBottom, mainTop, mainCenter ]
	});

	initButtonEvent();
}

function initButtonEvent()
{
	var btnRollback = Ext.get("btnRollback");
	btnRollback.addClassOnOver("xy-tb-wf-btn-over");
	btnRollback.on("click", on_RollbackClick);

	var btnPrint = Ext.get("btnPrint");
	btnPrint.addClassOnOver("xy-tb-wf-btn-over");
	btnPrint.on("click", on_PrintClick);

	var btnProcinstimg = Ext.get("btnProcinstimg");
	btnProcinstimg.addClassOnOver("xy-tb-wf-btn-over");
	btnProcinstimg.on("click", on_ProcinstimgClick);

	var btnClose = Ext.get("btnClose");
	btnClose.addClassOnOver("xy-tb-wf-btn-over");
	btnClose.on("click", on_CloseClick);
}

/**
 * 按钮-撤回
 */
function on_RollbackClick()
{
	/**
	 * 验证业务表单数据
	 */
	if (! frmFormInfo.validate("rollback"))
	{
		return;
	}

	if (frmFormInfo.OnRollback !== undefined
			&& typeof( frmFormInfo.OnRollback) == "function") 
	{
		frmFormInfo.OnRollback();
	}

	var userID = Ext.get("userID").dom.value;
	var processInstID = Ext.get("processInstID").dom.value;

	wf.FormManagerUtil.showMask();

	ActivityRollbackService.undo(userID, processInstID,
		function(response, options)
		{
			wf.FormManagerUtil.hideMask();

			var data = Ext.decode(response.responseText);
			if (data.success)
			{
				/**
				 * 回调主界面
				 */
				wf.FormManagerUtil.callbackAfterOperation();

				MsgUtil.alert("成功撤回，请到您的待审批报账单中删除或修改提交",
					function()
					{
						window.close();
					}, this);
			}
			else
			{
				MsgUtil.alert("撤回发生错误: " + data.msg);
			}
		},
		function(response, options)
		{
			wf.FormManagerUtil.hideMask();

			MsgUtil.alert("撤回发生错误");
		},
		this);
}

/**
 * 按钮-打印
 */
function on_PrintClick()
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
 * 按钮-关闭
 */
function on_CloseClick()
{
	window.close();
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(doInit, this, true);