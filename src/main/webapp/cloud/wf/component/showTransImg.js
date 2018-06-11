/**
 * 显示流程图公用函数
 * @param serialNum
 */

//重庆模式
function showInvoiceImg_old( serialNum )
{
	var urlPath = "http://136.5.75.10/image/ImageSearch/External.aspx";	
	var htmImgUrl = "<IFRAME width='100%' height='100%' id='invoiceWin' name='serialNum' "
				  + "frameborder=0 src='"
				  + urlPath + "?scanid=" +  serialNum  + "' />"
				  //+ urlPath + "?scanid=EG187333554CN' />"
	var clientHeight = top.document.body.clientHeight - 20;
	var clientWidth = top.document.body.clientWidth - 40;
	var	imgWin = new top.Ext.Window({
			title : "发票快照",
			width : clientWidth,
			height : clientHeight,
			modal : false,		
			resizable: true,
			html : htmImgUrl,
			maximizable : true,
			resizable : true
		});
	imgWin.show();
}

//新接口模式
function showInvoiceImg( serialNum )
{	
	Ext.Ajax.request({
		url : 'SSC/getImageUrl.action',
		params : {			
			serialno : serialNum
		},
		success : function( response ) {
			var obj = JSON.parse( response.responseText );
			if (obj.status == "0") {
				window.open( obj.imageurl, "",
						"menubar=0,scrollbar=0,resizable=1,channelmode=0,height=768,width=1024,location=0,status=1");				
			} else if (obj.status == "-9999") {
				top.Ext.MessageBox.alert("提示",  obj.IfError);
			} else {
				top.Ext.MessageBox.alert("提示", "该表单没有影像信息，请确认后再次尝试。<br>错误信息：" + obj.IfError);
			}

		},
		failure : function( response ) {
			top.Ext.MessageBox.alert("提示", "在获取该表单影像时出现异常，请与管理员联系。");		
		}		
	});
	
}


function showTransImg(processID)
{
//	var urlPath = Ext.get("path").dom.value;
//	var url = urlPath + "/WfController/getProcessPrint?processID=" + processID;
//	var	imgWin = new top.Ext.Window({
//			title : "流程图",
//			width : 640,
//			height : 480,
//			modal : true,
//			closeAction : 'close',
//			resizable: true,
//			html : "<DIV style='overflow:auto;height:100%;width:100%;background-color:#FFFFFF'><img border='0' src='" + url + "' /> </DIV>",
//			buttons : [{text: "关闭",handler : function(){imgWin.close();}}]
//		});
//	imgWin.show();
	
	var win = new freesky.ssc.wfmgr.processinstMgr.processChartWin(
	{
		basePath : Ext.get("basePath").dom.value,
		showInstChart : false,
		processid : processID
	});
	win.show();
}

function showTransInstImg(processInstID)
{
//	var urlPath = Ext.get("path").dom.value;
//	var url = urlPath + "/WfController/getProcessPrint?processInstID=" + processInstID;
//	var	imgWin = new top.Ext.Window({
//			title : "流程图",
//			width : 640,
//			height : 480,
//			modal : true,
//			closeAction : 'close',
//			resizable: true,
//			html : "<DIV style='overflow:auto;height:100%;width:100%;background-color:#FFFFFF'><img border='0' src='" + url + "' /> </DIV>",
//			buttons : [{text: "关闭",handler : function(){imgWin.close();}}]
//		});
//	imgWin.show();
	var win = new freesky.ssc.wfmgr.processinstMgr.processChartWin(
	{
		basePath : Ext.get("basePath").dom.value,
		showInstChart : true,
		processinstid : processInstID
	});
	win.show();
}