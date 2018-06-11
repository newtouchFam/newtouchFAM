Ext.namespace("ssc.smcs.common");

/**
 * 令牌工具类
 */
ssc.smcs.common.TokenUtil = {};

TokenUtil = ssc.smcs.common.TokenUtil;

/**
 * 令牌创建
 * @return 0成功-1失败
 */
ssc.smcs.common.TokenUtil.createNewToken = function(/* string */ strUserCode, /**/ strIP)
{
	try
	{
		if (strUserCode == undefined)
		{
			if (Ext.get("usercode") != null)
			{
				strUserCode = Ext.get("usercode").getValue();
			}
			else
			{
				strUserCode = "";
			}
		}

		if (strIP == undefined)
		{
			if (Ext.get("baseip") != null)
			{
				strIP = Ext.get("baseip").getValue();
			}
			else
			{
				strIP = "";
			}
		}

		var intRet = 0;

		SingleSignProxy.CreateTokenNewtouch(strUserCode, "<SSO><IC>OA</IC><IP>" + strIP + "</IP></SSO>",
		{
			callback : function(result)
			{
				if (result.error == 0)
				{
					intRet = 0;
				}
				else
				{
					MsgUtil.alert(result.errDesc);
					intRet = -1;
				}
			}
		});

		return intRet;
	}
	catch (ex)
	{
		MsgUtil.alert("发生错误:" + ex);
		return -1;
	}
};