Ext.namespace("ssc.shcs.common");

/**
 * 
 */
ssc.shcs.common.FormNewIDUtil = {};

FormNewIDUtil = ssc.shcs.common.FormNewIDUtil;

ssc.shcs.common.FormNewIDUtil.MaxCount = 10;
ssc.shcs.common.FormNewIDUtil.arrayNewID = new Array();

ssc.shcs.common.FormNewIDUtil.getNewID = function()
{
	if (ssc.shcs.common.FormNewIDUtil.arrayNewID.length <= 0)
	{
		ssc.shcs.common.FormNewIDUtil.initNewIDArray();
	}

	return ssc.shcs.common.FormNewIDUtil.arrayNewID.shift();
};

ssc.shcs.common.FormNewIDUtil.initNewIDArray = function()
{
	var loadMask = new Ext.LoadMask(Ext.getBody(),
	{
		msg : "读取新ID....",
		removeMask : true
	});
	loadMask.show();

	try
	{
		Ext.Ajax.request(
		{
			url : "ssc/smcs/formcommon/getnewid",
			method : "post",
			sync : true,
			params :
			{
				jsonCondition : Ext.encode(
				{
					maxcount : FormNewIDUtil.MaxCount
				})
			},
			success : function(response, options)
			{
				var responseText = Ext.decode(response.responseText);
				if (responseText.success == true)
				{
					if (responseText.data != undefined && responseText.data != "")
					{
						var arrayResult = responseText.data;

						ssc.shcs.common.FormNewIDUtil.arrayNewID = ssc.shcs.common.FormNewIDUtil.arrayNewID.concat(arrayResult);
					}
					else
					{
						/* 未找到则忽略 */
					}
				}
				else
				{
					MsgUtil.alert(responseText.msg);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this,
			timeout : 0
		});
	}
	catch(ex)
	{
		MsgUtil.alert("读取新ID发生错误, 错误信息：" + ex);
	}
	finally
	{
		loadMask.hide();
	}
};