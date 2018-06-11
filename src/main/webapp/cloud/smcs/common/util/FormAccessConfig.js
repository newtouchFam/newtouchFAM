Ext.namespace("ssc.smcs.common");

/* 访问控制参数配置Demo */
ssc.smcs.common.DemoAccessConfig =
{
	/* tag对应流程配置属性环节，后面为当前环节缺省配置（未生效）。应当有NORMAL环节，作为其他环节的缺省配置 */
	tag : [ [ "START", "none" ], [ "SSC_VC_FILL", "none" ], [ "SSC_VC_CHECK", "none" ], ["NORMAL", "readonly"] ],
	/* field对应表单头上组件配置 */
	field :
	{
		/* 属性名称为组件id，配置取值必须为"editable", "readonly", "hidden"，"none" 其他不处理
		 * 属性配置与对应tag中环节顺序一致。如采用当前环节认缺省配置，则空缺，例如下面的accountdate */
		busidate : 		[ "editable", "readonly", "readonly" ],
		accountdate :	[ "readonly", "editable", "editable" ],
		budgetperiodid : [ "hidden", "hidden", "hidden" ],
		varabstract :	[ "editable", "readonly", "readonly" ],
		affixnum : 		[ "editable", "readonly", "readonly" ],
		currency : 		[ "editable", "readonly", "readonly" ],
		contractno : 	[ "editable", "readonly", "readonly" ],
		contractname : 	[ "readonly", "readonly", "readonly" ],
		itemid : 		[ "editable", "readonly", "readonly" ],
		itemname : 		[ "readonly", "readonly", "readonly" ],
		suppliercode : 	[ "editable", "readonly", "readonly" ],
		suppliername : 	[ "readonly", "readonly", "readonly" ],
		supplieraddresscode : [ "editable", "readonly", "readonly" ]
	},
	/* gridlist对应表格，一般为XyGridPanel */
	gridlist : [
	{
		/* 必要属性，表示XyGridPanel的id，无该属性则忽略 */
		gridid : "estimateinfo",
		/* 以下对应列的dataindex */
		abstract : 	[ "editable", "readonly", "readonly" ],
		econitemid : [ "editable", "readonly", "readonly" ],
		amount : 	[ "editable", "readonly", "readonly" ],
		finamount : [ "hidden",	"editable", "editable" ],
		deptid : 	[ "editable", "readonly", "readonly" ],
		respnid : 	[ "editable", "readonly", "readonly" ],
		indexid : 	[ "readonly", "readonly", "readonly" ]
	},
	{
		gridid : "budget_gridpanel",
		deptid : 	[ "hidden", "hidden", "hidden" ],
		econitemid : [ "hidden", "hidden", "hidden" ],
		respnid : 	[ "hidden", "hidden", "hidden" ],
		indexid : 	[ "hidden", "hidden", "hidden" ],
		amount : 	[ "hidden", "hidden", "hidden" ],
		finamount : [ "hidden", "hidden", "hidden" ]
	} ]
};

/**
 * 访问控制配置属性枚举
 */
ssc.smcs.common.AccessPropertyEnum = {};
/* 显示并允许编辑 */
ssc.smcs.common.AccessPropertyEnum.Editable = "editable";
/* 显示但只读 */
ssc.smcs.common.AccessPropertyEnum.ReadOnly = "readonly";
/* 隐藏(不允许编辑) */
ssc.smcs.common.AccessPropertyEnum.Hidden = "hidden";
/* 忽略不做处理 */
ssc.smcs.common.AccessPropertyEnum.None = "none";

/**
 * 表单访问控制参数类
 * param:
 * accessConfig	访问控制参数配置
 * tag			当前环节标签
 */
ssc.smcs.common.FormAccessConfig = function(accessConfig, tag)
{
	if (accessConfig == undefined || accessConfig == null)
	{
		alert("FormAccessConfig, 配置参数accessConfig == null");
		return;
	}

	/* 原始配置参数 */
	this._config = accessConfig;
	/* 环节标志 */
	this._tag = tag;		
	/* 环节在配置中的顺序索引 */
	this._tagIndex = -1;
	/* 环节是否为NORMAL */
	this._isNormalTag = false;
	/* NORMAL环节在配置中的顺序索引 */
	this._tagNormalIndex = -1;
	/* NORMAL环节的缺省访问控制属性 */
	this._tagNormalDefaultAccessProperty = "none";
	/* 环节配置的缺省访问控制属性 */
	this._tagDefaultAccessProperty = "none";

	/* 表头的字段id列表 */
	this._fieldIDList = new Array();
	/* 表格面板的id列表 */
	this._gridPanelIDList = new Array();
	/* 表格列的dataindex列表 */
	this._gridPanelColumnDataIndexList = new Array();

	/* 初始化环节配置 */
	if (this._config.tag == undefined)
	{
		alert("FormAccessConfig, 访问控制参数缺少tag属性");
		return;
	}

	if (! ssc.common.ArrayUtil.isArray(this._config.tag))
	{
		alert("FormAccessConfig, 访问控制参数tag属性值格式不正确：不是数组");
		return;
	}

	/* 当前未配置环节标志，作为普通其他环节 */
	if (this._tag == "" || this._tag == null)
	{
		this._tag = "NORMAL";
	}

	/* 如果不是发起、待办、草稿中打开，同样认为普通环节，不能修改 */
	if (! (FormOperTypeUtil.isCreateNew()
			|| FormOperTypeUtil.isApprove()
			|| FormOperTypeUtil.isDraft()))
	{
		this._tag = "NORMAL";
	}

	if (this._tag == "NORMAL")
	{
		this._isNormalTag = true;
	}

	/* 检查是否有Normal环节配置 */
	var blfind = false;
	for (var i = 0; i < this._config.tag.length; i++)
	{
		if (this._config.tag[i][0] == "NORMAL")
		{
			blfind = true;
			this._tagNormalIndex = i;
			this._tagNormalDefaultAccessProperty = this._config.tag[i][1];
			break;
		}
	}
	if (! blfind)
	{
		alert("FormAccessConfig, 访问控制参数tag中缺少NORMAL的配置");
		return;
	}

	/* 读取环节默认配置 */
	for (var i = 0; i < this._config.tag.length; i++)
	{
		if (this._config.tag[i][0] == this._tag)
		{
			this._tagIndex = i;

			if (this._config.tag[i].length > 1)
			{
				this._tagDefaultAccessProperty = this._config.tag[i][1];
			}
			break;
		}
	}

	/*  未找到当做Normal处理 */
	if (this._tagIndex < 0)
	{
		this._tag = "NORMAL";
		this._isNormalTag = true;
		this._tagIndex = this._tagNormalIndex;
		this._tagDefaultAccessProperty = this._tagNormalDefaultAccessProperty;
	}
/*	if (this._tagIndex < 0)
	{
		 断言 
		DebugAssertUtil.alert("FormAccessConfig, 访问控制参数tag属性值配置不正确：缺少环节[" + this._tag + "]的配置");
	}*/

	/* 初始化表单字段配置 */
	if (this._config.field == undefined)
	{
		alert("FormAccessConfig, 访问控制参数缺少field属性");
		return;
	}

	if (this._config.gridlist == undefined)
	{
		alert("FormAccessConfig, 访问控制参数缺少gridlist属性");
		return;
	}	
	
	if (! ssc.common.ArrayUtil.isArray(this._config.gridlist))
	{
		alert("FormAccessConfig, 访问控制参数gridlist属性值格式不正确：不是数组");
		return;
	}

	for (var strFieldID in this._config.field)
	{
		if (typeof(this._config.field[strFieldID]) != "function")
		{
			this._fieldIDList.push(strFieldID);
		}
	}

	/* 初始化表格字段配置 */
	for (var i = 0; i < this._config.gridlist.length; i++)
	{
		var grid = this._config.gridlist[i];

		if (grid.gridid != undefined)
		{
			this._gridPanelIDList.push(grid.gridid);

			var columnDataIndexList = new Array();
			for (var strDataIndex in grid)
			{
				if (strDataIndex == "gridid")
				{
					continue;
				}

				if (typeof(grid[strDataIndex]) != "function")
				{
					columnDataIndexList.push(strDataIndex);
				}
			}

			this._gridPanelColumnDataIndexList.push(columnDataIndexList);
		}
	}

	/**
	 * 获取当前环节缺省访问控制属性
	 */
	this.getDefaultAccessProperty = function()
	{
		return this._tagDefaultAccessProperty;
	};

	/**
	 * 获得所有组件id列表
	 * return：	array
	 */
	this.getFieldIDList = function()
	{
		return this._fieldIDList;
	};

	/**
	 * 根据组件id，读取表头组件的访问属性
	 * param:
	 * strFieldID	表头组件字段
	 * return：		accessProperty
	 */
	this.getFieldAccessProperty = function(strFieldID)
	{
		if (this._tagIndex < 0)
		{
			return "none";
		}

		if (this._config.field[strFieldID] == undefined)
		{
			return "none";
		}

		var field = this._config.field[strFieldID];
		if (! ssc.common.ArrayUtil.isArray(field))
		{
			alert("FormAccessConfig, field中属性[" + strFieldID + "]配置参数不正确：不是数组");
			return "none";
		}

		if (this._tagIndex > field.length - 1)
		{
			if (this._isNormalTag)
			{
				return this._tagDefaultAccessProperty;
			}

			alert("FormAccessConfig, field中属性[" + strFieldID + "]配置参数不正确：没有足够的值");
			return ssc.smcs.common.AccessPropertyEnum.None;
		}

		var accessProperty = field[this._tagIndex];

		if (accessProperty != ssc.smcs.common.AccessPropertyEnum.Editable
				&& accessProperty != ssc.smcs.common.AccessPropertyEnum.ReadOnly
				&& accessProperty != ssc.smcs.common.AccessPropertyEnum.Hidden
				&& accessProperty != ssc.smcs.common.AccessPropertyEnum.None)
		{
			/* 断言 */
			var strMsg = "FormAccessConfig, field中属性[" + strFieldID + "]配置参数不正确：";
			strMsg += "配置值[" + accessProperty + "]不允许，只允许editable、readonly、hidden、none";
			DebugAssertUtil.alert(strMsg);

			return ssc.smcs.common.AccessPropertyEnum.None;
		}

		return accessProperty;
	};

	/**
	 * 获得所有表格面板id列表
	 * return：		array
	 */
	this.getGridPanelIDList = function()
	{
		return this._gridPanelIDList;
	};

	/**
	 * 根据表格面板id，获得所有列的dataIndex
	 * param：
	 * strGridPanelID	表格面板id
	 * return：		array
	 */
	this.getColumnDataIndexList = function(strGridPanelID)
	{
		var intIndex = this._gridPanelIDList.indexOf(strGridPanelID);

		if (intIndex >= 0 && intIndex < this._gridPanelColumnDataIndexList.length)
		{
			return this._gridPanelColumnDataIndexList[intIndex];
		}
		else
		{
			return [];
		}
	};

	/**
	 * 根据表格面板id和列dataindex，读取表格列的访问属性
	 * param：
	 * strGridPanelID		表格面板id
	 * strColumnDataIndex	列dataindex
	 * 
	 * return：	accessProperty
	 */
	this.getColumnAccessProperty = function(strGridPanelID, strColumnDataIndex)
	{
		if (this._tagIndex < 0)
		{
			return "none";
		}

		if (this._tag == "NORMAL")
		{
			
		};

		if (this._config.gridlist == undefined)
		{
			return "none";
		}

		if (! ssc.common.ArrayUtil.isArray(this._config.gridlist))
		{
			return "none";
		}

		for (var i = 0; i < this._config.gridlist.length; i++)
		{
			var grid = this._config.gridlist[i];

			if (grid.gridid == undefined)
			{
				continue;
			}

			if (grid.gridid !== strGridPanelID)
			{
				continue;
			}

			if (grid[strColumnDataIndex] == undefined)
			{
				return "none";
			}
			
			var column = grid[strColumnDataIndex];

			if (! ssc.common.ArrayUtil.isArray(column))
			{
				alert("FormAccessConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]配置参数不正确：不是数组");
				return "none";
			}

			if (this._tagIndex > column.length - 1)
			{
				if (this._isNormalTag)
				{
					return this._tagDefaultAccessProperty;
				}

				alert("FormAccessConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]配置参数不正确：没有足够的值");
				return "none";
			}

			var accessProperty = column[this._tagIndex];
			if (accessProperty != ssc.smcs.common.AccessPropertyEnum.Editable
					&& accessProperty != ssc.smcs.common.AccessPropertyEnum.ReadOnly
					&& accessProperty != ssc.smcs.common.AccessPropertyEnum.Hidden
					&& accessProperty != ssc.smcs.common.AccessPropertyEnum.None)
			{
				/* 断言 */
				var strMsg = "FormAccessConfig, 表格[" + strGridPanelID + "]中列[" + strColumnDataIndex + "]配置参数不正确：";
				strMsg += "配置值[" + accessProperty + "]不允许，只允许editable、readonly、hidden、none";
				DebugAssertUtil.alert(strMsg);

				return ssc.smcs.common.AccessPropertyEnum.None;
			}

			return accessProperty;
		}
	};
};
