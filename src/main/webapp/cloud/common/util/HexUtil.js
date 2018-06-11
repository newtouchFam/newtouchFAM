/**
 * 密码加密工具类
 * 用作传输层加密
 */
ssc.common.HexUtil = {};

HexUtil = ssc.common.HexUtil;

ssc.common.HexUtil.toHex = function(str, salt)
{
	str = salt + str;
	var val = "";
	for (var i = 0; i < str.length; i++)
	{
		if (val == "") val = str.charCodeAt(i).toString(16);
		else val += str.charCodeAt(i).toString(16);
	}
	return val;

};