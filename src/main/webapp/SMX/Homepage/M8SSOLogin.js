function initSuccessHandler(response)
{
	createMainFrame();
}

function init()
{
//	Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
//	Ext.Ajax.request({
//		url:Ext.get("basePath").dom.value+"SSOLoginServlet?UserCode="+Ext.get("UserCode").dom.value+"&PW="+Ext.get("PW").dom.value,
//            success: function(responseObj) 
//			{
//				var backJson = Ext.decode(responseObj.responseText);
//				if(backJson.success == true)
//				{
//					createMainFrame();
//				}
//				else
//				{
//					Ext.MessageBox.alert("提示", backJson.msg);
//				}
//				
//            }, 
//            failure: function(resp,opts) { 
//                    var respText = Ext.util.JSON.decode(resp.responseText); 
//                    top.Ext.Msg.alert('错误', respText.error ); 
//            } 
//});
	Ext.Ajax.request({
		url:"DATAMANAGER/SSOLogin.action",
		params : 
		{
			code : Ext.get("UserCode").dom.value
	    },
		success: function(responseObj) 
		{
			var backJson = Ext.util.JSON.decode(responseObj.responseText);
			var message = eval('('+backJson+')');
			if(message.success)
			{
				createMainFrame();
			}
			else
			{
				Ext.Msg.alert("提示", message.msg);
			}
	    }, 
	    failure: function(resp,opts) 
	    { 
	        var respText = Ext.util.JSON.decode(resp.responseText); 
	        top.Ext.Msg.alert('错误', respText.error ); 
	    } 
	});
//	createMainFrame();
}
Ext.onReady(init);
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";