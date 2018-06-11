Ext.namespace("ssc.common");

/**
 * 缩写定义
 */
CallbackUtil = ssc.common.CallbackUtil;

/**
 * 回调工具类
 */
ssc.common.CallbackUtil = {};

ssc.common.CallbackUtil.ajaxRequestCallbackEvent = function(response, options)
{
    var text = response.responseText.substr(0, 50).trim();
    
    if (response.status == 500)
    {
    	MsgUtil.warning("错误号：" + response.status.toString() + ", 错误信息：无法访问服务");
    }
    else
    {
    	MsgUtil.warning("错误号：" + response.status.toString() + ", 错误信息：" + text);
    }
};

ssc.common.StoreLoadExcpetionEvent = function(This, node, response)
{
	try
	{
		var data = Ext.decode(response.responseText);

		MsgUtil.warning("数据加载出现问题，错误信息：" + data.msg);
	}
	catch(ex)
	{
		MsgUtil.warning("数据加载出现问题，返回信息格式错误");
	}
	
};

/**
 * 支持同步提交
 */
Ext.lib.Ajax.request = function(method, uri, cb, data, options)
{
	if (options)
	{
		var hs = options.headers;
		if (hs)
		{
			for ( var h in hs)
			{
				if (hs.hasOwnProperty(h))
				{
					this.initHeader(h, hs[h], false);
				}
			}
		}
		if (options.xmlData)
		{
			if (!hs || !hs['Content-Type'])
			{
				this.initHeader('Content-Type', 'text/xml', false);
			}
			method = (method ? method : (options.method ? options.method : 'POST'));
			data = options.xmlData;
		}
		else if (options.jsonData)
		{
			if (!hs || !hs['Content-Type'])
			{
				this.initHeader('Content-Type', 'application/json', false);
			}
			method = (method ? method : (options.method ? options.method : 'POST'));
			data = typeof options.jsonData == 'object' ? Ext.encode(options.jsonData) : options.jsonData;
		}
	}
	
	return this["sync" in options ? "syncRequest" : "asyncRequest"](method, uri, cb, data);
};

/**
 * 支持同步提交
 */
Ext.lib.Ajax.syncRequest = function(method, uri, callback, postData)
{
	var o = this.getConnectionObject();

	if (!o)
	{
		return null;
	}
	else
	{
		o.conn.open(method, uri, false);

		if (this.useDefaultXhrHeader)
		{
			if (!this.defaultHeaders['X-Requested-With'])
			{
				this.initHeader('X-Requested-With', this.defaultXhrHeader, true);
			}
		}

		if (postData && this.useDefaultHeader && (!this.hasHeaders || !this.headers['Content-Type']))
		{
			this.initHeader('Content-Type', this.defaultPostHeader);
		}

		if (this.hasDefaultHeaders || this.hasHeaders)
		{
			this.setHeader(o);
		}

		o.conn.send(postData || null);
		this.handleTransactionResponse(o, callback);
		return o;
	}
};

/**
 * WfCommonAction参数装载通用过程
 * Sql优先，存储过程其次，最后是树的两条
 */
ssc.common.loadStoreWfCommonParam = function(/*Store or TreeLoader*/ store,
	sqlPath,
	sqlFile,		/*sqlFile, firstSqlFile*/
	sqlFile2,		/*otherSqlFile*/
	sqlProcFile)
{
	store.baseParams.scriptPath = sqlPath;

	if ((! ssc.common.StringUtil.isEmpty(sqlFile))
			&& ssc.common.StringUtil.isEmpty(sqlFile2)
			&& ssc.common.StringUtil.isEmpty(sqlProcFile))
	{
		store.baseParams.sqlFile = sqlFile;
		return;
	}

	if ((! ssc.common.StringUtil.isEmpty(sqlFile))
			&& (! ssc.common.StringUtil.isEmpty(sqlFile2))
			&& ssc.common.StringUtil.isEmpty(sqlProcFile))
	{
		store.baseParams.firstSqlFile = sqlFile;
		store.baseParams.otherSqlFile = sqlFile2;
		return;
	}

	if (ssc.common.StringUtil.isEmpty(sqlFile)
			&& ssc.common.StringUtil.isEmpty(sqlFile2)
			&& (! ssc.common.StringUtil.isEmpty(sqlProcFile)))
	{
		store.baseParams.sqlProcFile = sqlProcFile;
	}
};

/**
 * 初始查询参数转换，把数组格式转换为对象格式<br>
 * 数组：[ {name : "status", value : "1"}, {name : "name", value : "杭州"} ]<br>
 * 对象：{ status : "1", name : "杭州" }<br>
 */
ssc.common.loadStoreParamConvert = function(/* array */ params)
{
	if (params == null || params == undefined)
	{
		return {};
	};

	var newParams = {};

	if (ssc.common.ArrayUtil.isArray(params))
	{
		/* 数组格式参数 */
		for ( var i = 0; i < params.length; i++)
		{
			var param = params[i];
			if (param.name != undefined && param.value != undefined)
			{
				newParams[param.name] = param.value;
			}
		}
	}
	else
	{
		newParams = params;
	};

	return newParams;
};

/**
 * 查询参数比较
 */
ssc.common.loadStoreParamCompare = function(/* object */ preParams,
	/* object */ params)
{
	if (preParams == null || preParams == undefined
			|| params == null || params == undefined)
	{
		return false;
	}

	if (ssc.common.ArrayUtil.isArray(params))
	{
		/* 数组格式参数 */
		return false;
	}
	else
	{
		/* 对象格式参数 */
		for (var field in preParams)
		{
			if (params[field] == null || params[field] == undefined)
			{
				return false;
			}

			if (preParams[field] != params[field])
			{
				return false;
			}
		}		

		for (var field in params)
		{
			if (preParams[field] == null || preParams[field] == undefined)
			{
				return false;
			}

			if (params[field] != preParams[field])
			{
				return false;
			}
		}		
	}

	return true;
};

/**
 * 初始查询参数设置，支持对象格式
 * 对象：{ status : "1", name : "杭州" }
 */
ssc.common.loadStoreParserParam = function(/*Store or TreeLoader*/ store,
	/* array or object */ params,
	/* boolean */ paramJsonSerialize)
{
	if (params == null || params == undefined)
	{
		return;
	}

	if (paramJsonSerialize == true)
	{
		store.baseParams["jsonCondition"] = Ext.encode(params);
	}
	else
	{
		for (var field in params)
		{
			store.baseParams[field] = params[field];
		}
	}
};

/**
 * 根据当前页最大行号，调整行号列宽序
 * 会使用Store.xy_PagingToolBar的自定义属性
 * scope必须为GridPanel
 */
ssc.common.NumberColumnWidthAdjust = function(/*Store*/ _This, /*Ext.data.Record[]*/ records, /*Object*/ options)
{
	if (_This.xy_PagingToolBar == undefined)
	{
		return;
	}

	var pagingbar = _This.xy_PagingToolBar;
	var pageMaxCount = pagingbar.xy_Current + pagingbar.pageSize;
	if (pageMaxCount < 100)
	{
		this.getColumnModel().setColumnWidth(0, 23);
	}
	else if (pageMaxCount >= 100 && pageMaxCount < 1000)
	{
		this.getColumnModel().setColumnWidth(0, 28);
	}
	else if (pageMaxCount >= 1000 && pageMaxCount < 10000)
	{
		this.getColumnModel().setColumnWidth(0, 33);
	}
	else if (pageMaxCount >= 10000 && pageMaxCount < 100000)
	{
		this.getColumnModel().setColumnWidth(0, 38);
	}
	else if (pageMaxCount >= 100000)
	{
		this.getColumnModel().setColumnWidth(0, 43);
	}
};

/**
 * Post提交
 */
ssc.common.PostSubmit = function(/*String*/ url, /*Object[]*/ param)
{
	var oForm = document.createElement("form");
    oForm.id = "freesky-postForm";
    oForm.name = "freesky-postForm";
    oForm.method = "post";
    oForm.action = url;
    oForm.target = "_blank";
    oForm.style.display = "none";

	for ( var prop in param)
	{
		var oInput = document.createElement("input");
		oInput.name = prop;
		oInput.value = param[prop];
		oForm.appendChild(oInput);
	}

    document.body.appendChild(oForm);
    oForm.submit();
};