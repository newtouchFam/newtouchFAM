function searchNewBulletSuccessHandler(response)
{
	var data = Ext.decode(response.responseText);
	if(data.resultint != '0')
	{
	}
}

function getTimeIntervalSuccessHandler(response)
{
}

function init()
{
	try
	{
	    Ext.get("basePath").dom.value = Ext.query('base')[0].href;

		Ext.Ajax.timeout = 0;
	}
	catch(e)
	{
	}
	
	var basePath = Ext.get("basePath").dom.value;
	
	var viewport = new Ext.Viewport({layout:"fit",items:[{
		xtype:'portal',
		bodyStyle:'background:url('+basePath+'resources/images/welcome.jpg) no-repeat center top;' +
        'background-size:100%;-webkit-background-size:100%;' +
        'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+basePath+'resources/images/welcome.jpg,  sizingMethod="scale")',
        margins:'35 5 5 0'
	}]});
}

function browserBullet(id)
{
	if(id == null){
		return;
	}
}


function getBulletInfoNewSuccessHandler(response)
{
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);