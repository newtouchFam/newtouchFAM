function showExtLoadException(This, node, response)
{
	var status = response.status;
	var text = response.responseText;

	switch (status)
	{
		case 404 :
			top.Ext.MessageBox.alert("加载数据时发生以下错误", "请求url不可用");
			break;
		case 200 :
			if (text.length > 0)
			{
				top.Ext.MessageBox.alert("加载数据时发生以下错误", text);
			}
			break;
		default :
			top.Ext.MessageBox.alert("加载数据时发生以下错误", status + "," + text);
			break;
	}
}