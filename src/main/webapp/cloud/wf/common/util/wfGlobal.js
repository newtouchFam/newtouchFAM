Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
var PER_PAGE_SIZE = 20;//分页时每页显示的记录条数
var WINDOW_PER_PAGE_SIZE = 10;//弹出窗体分页时每页显示的记录条数
function getParamValue(value)
{
	if (value == null || value == "undefined")
	{
		return "";
	}
	return value;
}