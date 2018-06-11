var m_listWin = null;
var m_formcode = null;
var m_basPath = null;
var m_uploadWin = null;
var m_grdProcess = null;
var m_dsItems = null;
var m_uploadFileID = null;

function loadAttachment(formcode, basPath, viewOnly) {
	m_basPath = basPath;
	
	m_formcode = formcode;

	var strUrl = "wf/uploadfile/list?serialNum=" + m_formcode;

	var clnRowNum = new top.Ext.grid.RowNumberer();
	var clnFileID = {
		header :"ID",
		dataIndex :"fileid",
		hidden :true,
		fixed :false
	};
	var clnFileName = {
		header :"文件名称",
		dataIndex :"filename",
		width :230,
		sortable :true
	};
	var clnFileSize = {
		header :"文件大小(字节)",
		dataIndex :"filesize",
		width :100,
		align: "right",
		renderer: fileSizeRend,
		sortable :true
	};
	var clnCreateDate = {
		header :"上传时间",
		dataIndex :"createdate",
		width :200,
		sortable :true,
		renderer :top.Ext.util.Format.dateRenderer('Y年m月d日 H:i:s')
	};

	var cm = new top.Ext.grid.ColumnModel( [ clnRowNum, clnFileID, clnFileName,
			clnFileSize, clnCreateDate ]);

	var sm = new top.Ext.grid.RowSelectionModel( {
		singleSelect :true
	});

	m_dsItems = new top.Ext.data.JsonStore( {
		url :strUrl,
		totalProperty :"total",
		root :"data",
		fields : [ "fileid", "filename", "filesize", {
			name :'createdate',
			type :'date',
			dateFormat :'Y-m-d H:i:s'
		} ]
	});
	m_dsItems.on("loadexception", loadException);

	var m_barPage = new top.Ext.PagingToolbar( {
		border :true,
		pageSize :10000,
		store :m_dsItems,
		displayInfo :true,
		displayMsg :'该表单一共上传了 {2}个附件',
		emptyMsg :"该表单没有关联附件"
	});

	m_grdProcess = new top.Ext.grid.GridPanel( {
		region :"center",
		store :m_dsItems,
		colModel :cm,
		enableColumnMove :false,
		enableHdMenu :false,
		selModel :sm,
		iconCls :'xy-grid',
		bbar :m_barPage,
		loadMask : {
			msg :"数据加载中，请稍等..."
		}
	});
	
	var btn = [{text :'下载',handler :btnDown_handler},
				{text :'添加',handler :add_handler},
				{text :'删除',handler :del_handler},
				{text :"关闭",handler : function(){m_listWin.close();}}];
	if (viewOnly)
	{
		btn = [{text :'下载',handler :btnDown_handler},
				{text :"关闭",handler : function(){m_listWin.close();}}];		
	}

	m_listWin = new top.Ext.Window( {
		title :"附件查看",
		height :400,
		width :600,
		layout :"border",
		modal :true,
		closeAction :'close',
		resizable :true,
		items : [ m_grdProcess ],
		buttons : btn
	});
	m_listWin.show();
	m_listWin.on("beforeclose",listWinClosing_handler);

	m_dsItems.load();
	m_grdProcess.on("dblclick", grid_dblclick);
	
	function fileSizeRend(fileSize)
	{
		return Ext.util.Format.fileSize(fileSize);
	}
}

function listWinClosing_handler()
{
	if ( m_uploadWin != null )
	{
		m_uploadWin.close();
	}
}

function add_handler() 
{
	var url = m_basPath + "wf/UploadAction.action?serialNum=" + m_formcode;
	var pnl = "<DIV id='wf_upload_div' name='wf_upload_div' class='x-window-bc' style='overflow:hidden;height:100%;width:100%;background-color:#FFFFFF'></DIV>";
	var	addWin = new top.Ext.Window({
			title : "附件上传",
			width : 436,
			height : 352,
			modal : true,
			closeAction : 'close',
			resizable: false,
			html : pnl
		});
	addWin.show();
	
	addWin.on("beforeclose", on_beforeClose);
	
	function closeWin()
	{
		addWin.close();
	}
	
	preLoadImages();
	
    var vault = new xyUploadFileObject(m_formcode, closeWin);
    vault.setServerHandlers(m_basPath + "wf/uploadfile/upload",
    	m_basPath + "wf/uploadfile/getinfo",
    	m_basPath + "wf/uploadfile/getid");
    vault.create("wf_upload_div");	

    top.Ext.get("wf_upload_file_UploadAll").addClassOnOver("x-btn-over");
    top.Ext.get("wf_upload_file_ClearAll").addClassOnOver("x-btn-over");
    top.Ext.get("wf_upload_file_closewin").addClassOnOver("x-btn-over");
    
    function on_beforeClose()
    {
    	if (vault)
    	{
    		if (vault.uploaded)
    		{
    			m_dsItems.reload();
    		}
    	}
    }

    function preLoadImages()
	{
		var imSrcAr = new Array("btn_addFile.gif","btn_clean.gif","ico_file.png","ico_image.png","ico_sound.png","ico_video.png","ico_zip.png", "pb_demoUload.gif");
		var imAr = new Array(0);
		for(var i=0;i<imSrcAr.length;i++)
		{
			imAr[imAr.length] = new Image();
			imAr[imAr.length-1].src = "WfApp/upload/imgs/"+imSrcAr[i];
		}
	}
}

function del_handler() {
	var rc = m_grdProcess.getSelectionModel().getSelected();
	if (rc == null) {
		top.Ext.MessageBox.alert("错误", "请选择要删除的附件");
		return;
	}
	top.Ext.MessageBox.confirm('询问', '确认要删除您选择的附件么?', delCallBack);

	function delCallBack(result) {
		if (result == "yes") {
			top.Ext.Ajax.request( {
				url :'wf/uploadfile/delete?fileID=' + rc.get("fileid"),
				waitMsg :'正在删除附件...',
				success :success_handler,
				failure :failure_handler
			});
		}
	}
}
function success_handler(action) 
{
	var obj = top.JSON.parse(action.responseText);
	if (obj.success || obj.success == 'true') 
	{
		m_dsItems.reload();
	} 
	else 
	{
		top.Ext.MessageBox.alert("失败", obj.msg);
	}
}

function failure_handler(action) 
{
	top.Ext.MessageBox.alert("失败", "未能成功调用附件删除服务");
}

function btnDown_handler()
{
	var rc = m_grdProcess.getSelectionModel().getSelected();
	if (rc == null) {
		top.Ext.MessageBox.alert("错误", "请选择要下载的附件");
		return;
	}
	downFile(rc.get("fileid"));
}

function grid_dblclick() {
	var rc = m_grdProcess.getSelectionModel().getSelected();
	if (rc == null) {
		return "";
	}
	downFile(rc.get("fileid"));
}

formPost = function(url, jsonObj, target) {	
	var oForm = document.createElement("form");
	oForm.id = "freesky-postForm";
	oForm.name = "freesky-postForm";
	oForm.method = "post";
	oForm.action = url;
	oForm.target = target;
	for(var prop in jsonObj){
		var oInput = document.createElement("input");
		oInput.name = prop;
		oInput.value = jsonObj[prop]; 
		oForm.appendChild(oInput);
    }
	document.body.appendChild(oForm);
	oForm.submit();
};

function downFile(fileid)
{
	
	var url = "wf/uploadfile/download";	
	var qryCondition = {fileID:fileid};	
	formPost(url, qryCondition, "_self" );
}

function loadException(This, node, response) {
	showExtLoadException(This, node, response);
}
