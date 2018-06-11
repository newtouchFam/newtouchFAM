var m_winErrorInfo = null; // 错误信息对话框

function showExtLoadException(This, node, response)
{
	var status = response.status;
	var text = response.responseText;

	switch (status)
	{
		case 404 :
			Ext.MessageBox.alert("加载数据时发生以下错误", "请求url不可用");
			break;
		case 200 :
			if (text.length > 0)
			{
				top.Ext.MessageBox.alert("错误提示", text);
				//showErrorInfo(text);
			}
			break;
		default :
			top.Ext.MessageBox.alert("加载数据时发生以下错误", status + "," + text);
			//showErrorInfo(status + "," + text);
			break;
	}
}

/*错误信息对话框*/
function showErrorInfo(sErrorInfo, nWidth, nHeight)
{
	if (! nWidth) nWidth = 480;
	if (! nHeight) nHeight = 360;
	
	if (m_winErrorInfo == null)
	{
		var sHtml = "<DIV id='g_divErrorInfo' style='width:100%;height:100%;overflow:scroll'></DIV>";
		m_winErrorInfo = new Ext.Window({
							title: "错误提示",
							width : nWidth,
							height: nHeight,
							modal : true,
							closeAction : "hide",
							html: sHtml,
							frame: true,
							maskDisabled: false,
							resizable: true,
							buttons : [{text:"关闭", handler: showErrorInfoClose}]
						});	
	}
	
	m_winErrorInfo.show();
	
	window.document.getElementById("g_divErrorInfo").innerHTML = sErrorInfo;
}
function showErrorInfoClose()
{
	m_winErrorInfo.hide();
}
