Ext.namespace('com.ssc.smcs.form');
com.ssc.smcs.form.CallbackService = Ext.extend(Ext.util.Observable, {
	delAttachInfo:function(fileid,callback, scope)
	{
		Ext.Ajax.request( {
					url :'wf/uploadfile/delete?fileID=' + fileid,
					waitMsg :'正在删除附件...',
					success: function(response)
					{
						callback.call(scope,response);
					},
					failure: this.failureHandle,
					timeout: 0
				});
	},
	getDetailGUID : function(callback,scope)
	{
		Ext.Ajax.request( {
			url :'SSC/getDetailGUID.action',
			
			success: function(response)
			{
				callback.call(scope,response);
			},
			failure: this.failureHandle,
			timeout: 0
		});
	},
	failureHandle : function(response)
	{
		if (response.result == null || response.result == "") 
		{
			Ext.XyMessageBox.alert("失败", "不能访问用户服务");
		} else {
			Ext.MessageBox.alert("失败", response.result.msg);
		}
	}
});
Ext.reg("com.ssc.smcs.form.CallbackService",com.ssc.smcs.form.CallbackService);
