var m_LoadMask = null;
var m_WorkData = null;
var m_ProcData = null;

var m_SubmitCallBack = null;
var m_SubmitCallBackScorpe = null;

function getInitData()
{
	if( m_WorkData==null)
	{
		m_WorkData = new WfWorkData(Ext.get("workDataState").dom.value);
	}

	m_ProcData = new WfProcData(Ext.get("processInstState").dom.value);
	var info = {formCode:Ext.get("formSerialNo").dom.value, 
				processinstState:Ext.get("processInstState").dom.value, 
				workDataState:Ext.get("workDataState").dom.value};
	
	return info;
}
function hideMask()
{
	if (m_LoadMask)
	{
		m_LoadMask.hide();
		m_LoadMask = null;
	}
	try
	{
		showStep(4);//默认显示所有发起模块
		parent.Ext.getBody().unmask(true);
	}
	catch(ex){};
}

function doInit()
{
	m_SubmitCallBack = null;
	m_SubmitCallBackScorpe = null;
	
	var txtFormName = Ext.get("processName").dom.value;	
		
	//流程变量要计算一下
	if( m_WorkData == null)
	{
		m_WorkData = new WfWorkData(Ext.get("workDataState").dom.value);
	}
	
	showStep(4);//默认显示所有发起模块
}

function showStep(step)
{
	if (typeof(frmFormInfo.showStep) == 'function'){
		return frmFormInfo.showStep(step);
	}
	
	return -1;
}

function validateStep(step)
{
	if (typeof(frmFormInfo.validateStep) == 'function'){
		return frmFormInfo.validateStep(step);
	}
	
	return true;
}

function saveFormInfo() {
	if ((typeof(frmFormInfo.g_formType) == 'undefined'
		|| frmFormInfo.g_formType == null || frmFormInfo.g_formType == '') && frmFormInfo.Form_Class_Code == 'BZ') 
	{
		MsgUtil.alert("提示", "请先选择报账费用类型!");
		return;
	}
	else if((typeof(frmFormInfo.g_formType) == 'undefined'
		|| frmFormInfo.g_formType == null || frmFormInfo.g_formType == '') && frmFormInfo.Form_Class_Code == 'SQ')
	{
		MsgUtil.alert("提示", "请先选择申请事项类型!");
		return;
	}
	
	var formID = Ext.get("formID").dom.value;
	var formDataJson = frmFormInfo.getDraftFormData();

	var smLoadMask = new Ext.LoadMask(document.body, {
				msg : "正在保存，请稍候...",
				removeMask : true
			});
	smLoadMask.show();
	
	// 保存草稿
	ActivityDraftService.saveDraft(formID, formDataJson, {
				callback : savecallback,
				async : true
			});

	function savecallback(result) {
		if (smLoadMask) {
			smLoadMask.hide();
			smLoadMask = null;
		}
		if (result.indexOf("=") != -1) {
			var iObj = document.getElementById("frmFormInfo").contentWindow;
			iObj.document.getElementById("id").value = result.substr(result.indexOf("=")+1,result.length);
			Ext.XyMessageBox.alert("提示", "单据保存成功", function() {
							});
		} else {
			Ext.XyMessageBox.alert("发生异常", result);
		}
	}
}

function on_SaveClick() {

	if ((frmFormInfo.OnSave !== undefined) && (typeof frmFormInfo.OnSave == "function")) {
		frmFormInfo.OnSave(saveFormInfo);
	}
	else
	{
		saveFormInfo();
	}
}
function on_SubmitClick(cb, scr)
{
	var vd = frmFormInfo.validate("submit");
	if (vd === false)
	{
		m_SubmitCallBack = null;
		m_SubmitCallBackScorpe = null;
		return;
	}
	
	m_SubmitCallBack = cb;
	m_SubmitCallBackScorpe = scr;
	
	if ((frmFormInfo.OnSubmit !== undefined)
			&& (typeof frmFormInfo.OnSubmit == "function")) 
	{
		frmFormInfo.OnSubmit(goOnSubmit);
		/*var newArray = new Array();
		newArray[0] = cb;
		frmFormInfo.OnSubmit({callback:goOnSubmit.createDelegate(this, newArray, true), async:false});
		*/
	}
	else
	{
		goOnSubmit();
	}
}

function on_billNotify(cb, scr)
{
	getConditions(1);
}

function wfselectnextactWizard(activityid,userID, processID, activityID,formDataJson,workDataJson,formID,workItemID,historyJson, callback) 
{
	var m_UserRowNum = new Ext.grid.RowNumberer();
	var m_activityid = {header:"环节id",dataIndex:"activityid",hidden:true,fixed:true};
	var m_activityname = {header:"环节名称",dataIndex:"activityname",sortable:true,width:200};
	var wfselectdsnew = new  Ext.data.JsonStore({
					                          url:"SSC/getNextActivityInfoForNew.action", 
					                          root:"rowacts", 
					                          fields:["activityid","activityname"]
				                          });
	var wfselectcmnew = new Ext.grid.ColumnModel([m_UserRowNum,m_activityid,m_activityname]);
	
	var m_wfselectGridNew = new Ext.grid.GridPanel({
		                                            id:'wfselectGridNew',
			  		                                store:wfselectdsnew,
											  		selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
											  		colModel:wfselectcmnew, 
									  		        autoScroll:true,
											  		loadMask : true,
											  		enableColumnMove:false,
											  		enableHdMenu:false
								        });
	
	var	wfselectWinNew = new top.Ext.Window({
			title : "请选择要提交的下一环节",
			width : 300,
			height : 250,
			modal : true,
			layout:'fit',
			closeAction : 'close',
			items:[m_wfselectGridNew],
			resizable: false,
			buttons : [{text : '确定', handler : ok_handlenew},
					{text: "关闭", handler: function(){wfselectWinNew.close();}}]
		});
	wfselectWinNew.show();
    wfselectdsnew.load({
	    params:{
	        activityid:activityid
	    }
	});
	function ok_handlenew() 
	{
		var selectinfo = Ext.getCmp("wfselectGridNew").getSelectionModel().getSelected();
		if(selectinfo==null)
        {
        	MsgUtil.alert("警告","请先选择一个环节");
        	return ;
        }
        else
        {
	        var activityinfos = selectinfo.get("activityname");
			callback(activityinfos,userID, processID, activityID,formDataJson,formID,workItemID,historyJson,workDataJson);
        }

		wfselectWinNew.close();
	}
}

function goOnSubmit()
{
	var userID = Ext.get("userID").dom.value;
	var processID = Ext.get("processID").dom.value;
	var activityID = Ext.get("activityID").dom.value;
	var formID = Ext.get("formID").dom.value;
	var workItemID = Ext.get("workItemID").dom.value;
	var formSerialNo = Ext.get("formSerialNo").dom.value;
		
	
	var formDataJson = frmFormInfo.getFormData();
	
	var historyJson = Ext.util.JSON.encode({SERIALNUM:formSerialNo, ISAGREE:"1", CHECKDESC:'请领导审阅'});
	Ext.Ajax.request({
		url:"SSC/getNextActivityNumForNew.action",
		sync :true,
		params: {
			activityid:activityID
		},
		success : newSelActivityNumSuccess,
		failure : newSelActivityNumfailureHandle,
		timeout : 0
	});
					
	function newSelActivityNumfailureHandle(response)
	{
		if (response.result == null || response.result == "") 
		{
			top.Ext.XyMessageBox.alert("失败", "不能访问用户服务");
		} else {
			top.Ext.XyMessageBox.alert("失败", response.result.msg);
		}
	}
    function newSelActivityNumSuccess(response)
    {
    	var data = Ext.decode(response.responseText);
		if(data.success == true)
		{			
			var workDataJson = m_WorkData.getModifiedJson();
			
			if(data.num == 0)
			{				
				var newArray = new Array();
				newArray[0]=formDataJson;
				newArray[1]=workDataJson;
				newArray[2]=userID;
				newArray[3]=processID;
				newArray[4]=activityID;
				newArray[5]=formID;
				newArray[6]=workItemID;
				newArray[7]=historyJson;

				ApproveUserService.getSMANextActivityUser(userID, processID, activityID, workDataJson, {callback:getAllUser.createDelegate(this, newArray, true), async:false});
				
			}
			else
			{
				wfselectnextactnew(activityID,userID, processID, activityID,formDataJson,workDataJson,formID,workItemID,historyJson,getActInfoCallBack);
			}
			
		}
		else
		{
			if (smLoadMask)
			{
				smLoadMask.hide();
				smLoadMask = null;
			}
			top.Ext.XyMessageBox.alert("错误",data.msg);
			return;
		}
    }
}

function getActInfoCallBack(activityname,userID, processID, activityID,formDataJson,formID,workItemID,historyJson,workDataJson)
{
	m_WorkData.setValue("NEXTACTIVE",activityname);
	var workDataJson = m_WorkData.getModifiedJson();
	var newArray = new Array();
	newArray[0]=formDataJson;
	newArray[1]=workDataJson;
	newArray[2]=userID;
	newArray[3]=processID;
	newArray[4]=activityID;
	newArray[5]=formID;
	newArray[6]=workItemID;
	newArray[7]=historyJson;
	ApproveUserService.getSMANextActivityUser(userID, processID, activityID, workDataJson, {callback:getAllUser.createDelegate(this, newArray, true), async:false});

}

function getAllUser(alluser, formData, workData,userID, processID, activityID, formID,workItemID,historyJson)
{
	var smLoadMask = new Ext.LoadMask(document.body, {msg:"正在处理，请稍候...", removeMask:true});
	if (alluser == null || alluser == "") {
		getUserCallBack("");
	} else 	if (alluser.search(/^</) != 0){
		submitcallback(alluser);
		return;
	}else{
		wfapprove(alluser, getUserCallBack);
	}

	function getUserCallBack(selectUser)
	{

		smLoadMask.show();
		ActivitySubmitService.startEx(userID, processID, activityID, formID,
				workItemID, formData, workData, historyJson, selectUser, 
				{callback : submitcallback, async:true});
	}
	
	function submitCallBack_Close(button) {
		if (button == "yes")
		{
			var localMask = new Ext.LoadMask(document.body, {
				msg : "正在准备打印封面，请稍候...",
					removeMask : true
				});
			localMask.show();
			PrintFace( m_SubmitCallBack, localMask);
		}
		else
		{
			if (m_SubmitCallBack !== undefined && typeof(m_SubmitCallBack) == "function"){
				m_SubmitCallBack(m_SubmitCallBackScorpe);
			}
		}
	}
	
	function submitcallback(result) 
	{
		if (smLoadMask)
		{
			smLoadMask.hide();
			smLoadMask = null;
		}
		
		if(result.success == true){
			Ext.XyMessageBox.confirm("提示", "表单已提交审批，是否需要打印？", submitCallBack_Close);
/*			Ext.XyMessageBox.alert("提示", "单据提交成功", submitCallBack_Close);*/
		} else {
			/*去掉异常信息中的 不友好提示，例如： java.lang.Exceptioin*/
			var errMsgDispose = result.errMsg;
			var positioin = errMsgDispose.indexOf("Exception");
			if(positioin >= 0){
				var positiontmp = errMsgDispose.indexOf(":");
				errMsgDispose = errMsgDispose.substr(positiontmp + 1);
			}
			Ext.XyMessageBox.alert("提示", errMsgDispose);
		}
	}
}

/** 封面打印* */
function PrintFace( callback, localMask) {
    var jsonObject = frmFormInfo.getPrintData();
	var jsonParam = {
		formID : Ext.get("formID").dom.value,
		processinstID : Ext.get("processInstID") == null ? "" : Ext.get("processInstID").dom.value,
		format : "HTML",
		dataJson : Ext.encode(jsonObject)
	};
	function printCallBack(){
		m_SubmitCallBack(m_SubmitCallBackScorpe);
	}
	//这个方法定义在formPrintFun.js里面
	jasperPrintCall( "SMCSSSC/formPrint_HTML.action", jsonParam, false, printCallBack, localMask );
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(doInit, this, true);
