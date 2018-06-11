//引用这个js的jsp，必须满足：
//有basePath域，
//有iePrinterCARoot，frmFormPrint，frmFormDiv 框架（iframe）

var m_bIePrintLoaded = false;
function jasperPrintCall(printUrl, jsonParam, isCover, callback, localMask) {
	
	var basPath = Ext.get("basePath").dom.value;
	
//	if (Ext.isIE) {
//		
//		if( !m_bIePrintLoaded )
//		{// 打印组件，先栽入	
//			//document.getElementById("iePrinter").src = "SSC/component/iePrinterDll.jsp";
//			//m_bIePrintLoaded = true;
//		}
//		
//		Ext.Ajax.request({
//			url : basPath + printUrl,
//			params : jsonParam,
//			success : function(responseObj) {
//				var printIframe = Ext.get("frmFormPrint").dom.contentWindow;
//				var html = responseObj.responseText;
//				printIframe.document.write(html);
//				document.getElementById('frmFormDiv').innerHTML = printIframe.document.body.innerHTML;
//				printIframe.document.clear();
//				printIframe.document.close();
//								
//				if( document.getElementById('mainBottom') ){
//					document.getElementById('mainBottom').style.display = "none";
//				}
//				document.getElementById('mainTop').style.display = "none";
//				document.getElementById('mainCenter').style.display = "none";
//				document.body.style.backgroundColor = "white";
//				document.getElementById('frmFormDiv').height = "100%";
//				document.getElementById('frmFormDiv').width = "100%";
//				if( localMask !== undefined && localMask ){		
//					if(typeof(localMask.hide)!="undefined")
//					{
//						localMask.hide();
//					}
//				}	
//				
//				formPrintTimeout.defer(50, null, [callback]);
//
//			},			
//			failure : function( responseObj ) {
//				Ext.Msg.alert("提示", "打印出现异常，请尝试在已审批完成中打印该表单！<br>" + responseObj.responseText );
//				if (typeof callback == 'function')
//					callback();
//			},
//			
//			timeout : 360000
//		});
//	} else {
		if( localMask !== undefined && localMask ){					
			localMask.hide();
		}		
		
		var url = basPath + printUrl;
		formPost(url, jsonParam, "_blank");
		
		if (typeof callback == 'function'){
			callback();
		}
//	}
	
	//嵌套函数
	var installDll = true;
	function formPrintTimeout(callback) {
		function localCallBack(button, text){
			if( button=='yes' ){							
				if( opener )  opener.top.close();					
				window.close();	
			}
			else{
				formPrintTimeout( callback );
			}
		}
				
		try {				
			iePrinter.webPrintSet.IsErrHandle = 0;
			if( isCover )
			{				
				iePrinter.webPrintSet.header = "&b&b&b";
				iePrinter.webPrintSet.footer = "&b&b&b";
			}
			else
			{						
				iePrinter.webPrintSet.header = "&w&b第&p共&P页";	
				iePrinter.webPrintSet.footer = "&b&b&D";
			}
			iePrinter.webPrintSet.marginTop = 10;
			iePrinter.webPrintSet.marginBottom = 10;
			iePrinter.webPrintSet.printA4 = 1;
							
			if ( getCookie("formPrint_preview")!="0" && (typeof callback != 'function') ){
				iePrinter.webPrintSet.PreviewWithTemplate("../SSC/Print/printtemplate.htm");
			}
			else{
				iePrinter.webPrintSet.PrintWithTemplate("../SSC/Print/printtemplate.htm", "false");
			}
			
			if( Ext.isIE6 ){
				formContextRevert.defer(2000, null, [callback]);
			}
			else{
				formContextRevert.defer(100, null, [callback]);
			}		
			
		} catch (e) {			
			if( !installDll ){	//先尝试CAB
				document.getElementById("iePrinterCARoot").src = "SSC/component/iePrinterCARoot.jsp";
				
				installDll = true;
				
				localCallBack.defer(100);
			}
			else{
				if( typeof callback == 'function' ){
					if( ! isCover ){
						alert( "还未下载打印组件, 提交后不支持打印;\n请在”我的已审批“中打印该表单或封面。");
					}
					setTimeout(callback, 1);
				}
				else{
					var url = basPath + "SSC/downloadfile.action";
//					jsonParam = "{fileDirectory:\"SSC/component/iePrint.exe\"}";
					jsonParam = "{fileDirectory:\"SSC/component/sscprint.rar\"}";
					Ext.MessageBox.show({title:"<font size='5' color='#0000FF'>请仔细阅读</font>", 
										 msg: "打印插件iePrint.CAB还没有下载完全，请稍后安装。<br>请等待2-3分钟..." + e.message 
										 		+ "<br>请点击<a href='javascript:formPost(\""+ url +"\", "+ jsonParam +", \"_self\" )'><font size='6' color='#FF0000'>下载打印组件</font></a>，并安装后关闭所有浏览器，重新登录系统。",
										 fn: localCallBack,
										 buttons : {
												yes : '关闭窗口，重新登录',
												no : '确认设置完成'},
										 icon : Ext.MessageBox.INFO	});
					installDll = false;
				}
			}			
		}		
	}
		
	function formContextRevert( callback ){
		if( document.getElementById('mainBottom') ){
			document.getElementById('mainBottom').style.display = "";
		}
		document.getElementById('mainTop').style.display = "";
		document.getElementById('mainCenter').style.display = "";
		document.body.style.backgroundColor = "#DFE8F6";
		
		document.getElementById('frmFormDiv').height = "0"; 
		document.getElementById('frmFormDiv').width = "0"; 
		document.getElementById('frmFormDiv').innerHTML = "";		
		if ( (typeof callback != 'function') && getCookie("formPrint_preview")!="0" && isIE7orIE8() ){
			if(typeof callback != 'undefined'){
				setTimeout(callback, 1);
			}			
		}else if (typeof callback == 'function')
			Ext.Msg.show({
				title : '提示',
				msg : '请确认已经打印完成（未打印完成，请不要点“确定”）。',
				buttons : Ext.Msg.OK,
				fn : callback,
				icon : Ext.MessageBox.QUESTION
			});	    
	}
}

function formPost(url, jsonObj, target) {	
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

function isIE7orIE8(){
	return ! Ext.isIE6;
}	

function closeWindow() {
	// 要加上这个，要不然，打印后，关不了窗口
	if (Ext.isIE) {
		try { //防止还没有打印完成，就关闭窗口了，会引起错误提示			
			if( iePrinter.webPrintSet.printOver==0 && getCookie("formPrint_preview")=="0"){
				top.Ext.XyMessageBox.alert("提示", "打印还未完成，请确认打印完成后再关闭窗口。");				
				return;
			}				
			iePrinter.webPrintSet.ForceClose();
			if (this.opener)   //OA关闭窗口，关不了
				this.opener = null;
			window.close();
		} catch (e) {
			if (this.opener)
				this.opener = null;			
			window.close();
		}
	} else {
		if (this.opener)
			this.opener = null;
		window.close();
	}
}
