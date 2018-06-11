Ext.namespace("ssc.component");

/**
 * 缩写定义
 */
BasePagingToolBar = ssc.component.BasePagingToolBar;
BaseMultiPagingToolBar = ssc.component.BaseMultiPagingToolBar;

/**
 * @function
 * 为Panel增加BodyResize事件函数
 * @param _this
 * @param width
 * @param height
 * @return
 */
Ext.Panel.prototype.onBodyResize = function(_this, width, height)
{
	if (this.getInnerWidth() === null)
	{
		return;
	}
	
	var bbar = this.getBottomToolbar();

	if (bbar === null || bbar === undefined)
	{
		return;
	}
	
	if (bbar.getXType() !== "ssc.component.basepagingtoolbar"
		&& bbar.getXType() !== "ssc.component.basemultipagingtoolbar")
	{
		return;
	}

	if (this.getInnerWidth() >= bbar.get_LeftWidth())
	{
		bbar.xy_RecoverMsg();
	}
	else
	{
		bbar.xy_ClearMsg();
	}
};

/**
 * @class BasePagingToolBar
 * 基本分页工具栏，提供默认的分页行数、扩展信息文本，简化使用，只需传入store参数即可使用。<br>
 * 根据宽度自适应显示扩展信息。<br>
 * 但不支持分页数量切换。如要切换，请使用ssc.component.BaseMultiPagingToolBar<br>
 * @example
 * demo:
 *
 *1.最简单应用，分页行数默认20，扩展信息并自适应宽度显示
 *	this.bbar = new ssc.component.BasePagingToolBar(
 *	{
 *		store : this.store
 *	});
 *  this.on("bodyresize", this.onBodyResize);
 *	
 *2.分页行数默认20，无扩展信息（即使表格宽度足够也不显示）
 *	this.bbar = new ssc.component.BasePagingToolBar(
 *	{
 *		store : this.store,
 *		displayInfo : false
 *	});
 *  this.on("bodyresize", this.onBodyResize);
 *	
 *3.自定义分页行数为30
 *	this.bbar = new ssc.component.BasePagingToolBar(
 *	{
 *		store : this.store,
 *		pageSize : 30
 *	});
 *  this.on("bodyresize", this.onBodyResize);
 */
ssc.component.BasePagingToolBar = Ext.extend(Ext.PagingToolbar,
{
	/**
	 * @field
	 * @private
	 * 数据集容器
	 */
	store : null,

	/**
	 * @field
	 * @private
	 * 页面行数
	 */
	pageSize : 20,

	/**
	 * 是否显示扩展信息
	 */
	displayInfo : true,

	/**
	 * 扩展信息
	 */
	displayMsg : "显示第 {0} 条到 {1} 条记录，一共 {2} 条 ",

	/**
	 * 无数据时显示扩展信息
	 */
	emptyMsg : "没有记录",

	border : true,

	/**
	 * 内部成员
	 */
	m_strDisplayMsg_Origin : null,
	
	m_strEmptyMsg_Origin : null,
	
	m_intLeftWidth : 400,

	initComponent : function()
	{
		ssc.component.BasePagingToolBar.superclass.initComponent.call(this);

		this.m_strDisplayMsg_Origin = this.displayMsg;		
		this.m_strEmptyMsg_Origin = this.emptyMsg;
	},
	restoreFirstPage : function()
	{
		this.cursor = 0;
		this.xy_Current = 0;
	},
	get_DisplayMsg_Origin : function()
	{
		return this.m_strDisplayMsg_Origin;
	},
	get_EmptyMsg_Origin : function()
	{
		return this.m_strEmptyMsg_Origin;
	},
	get_LeftWidth : function()
	{
		return this.m_intLeftWidth;
	},
	xy_ClearMsg : function()
	{
		this.displayMsg = "";
		this.emptyMsg = "";
		this.updateInfo();
	},
	xy_RecoverMsg : function()
	{
		if (this.displayInfo === false)
		{
			return;
		}

		this.displayMsg = this.m_strDisplayMsg_Origin;		
		this.emptyMsg = this.m_strEmptyMsg_Origin;
		this.updateInfo();
	}
});
Ext.reg("ssc.component.basepagingtoolbar",
	ssc.component.BasePagingToolBar);

/**
 * BaseMultiPagingToolBar
 * 在BasePagingToolBar基础上，增加分页数量切换。
 * demo:
 *1.最简单应用，分页行数默认[ 20, 40, 60, 80, 100 ]这5个，初始化分页数量为列表第一项20
 *	this.bbar = new ssc.component.BaseMultiPagingToolBar(
 *	{
 *		store : this.store
 *	});
 *  this.on("bodyresize", this.onBodyResize);
 *
 *2.自定义分页行数，初始化分页数量为列表第一项2
 *	this.bbar = new ssc.component.BaseMultiPagingToolBar(
 *	{
 *		store : this.store,
 *		xy_PageSizeList : [2, 9, 33]
 *	});
 *  this.on("bodyresize", this.onBodyResize);
 *
 *3.自定义分页行数，设置初始化分页数量33
 *	this.bbar = new ssc.component.BaseMultiPagingToolBar(
 *	{
 *		store : this.store,
 *		xy_PageSizeList : [2, 9, 33],
 *		xy_InitPageSize : 33
 *	});
 *  this.on("bodyresize", this.onBodyResize);
 */
ssc.component.BaseMultiPagingToolBar = Ext.extend(ssc.component.BasePagingToolBar,
{
	/**
	 * 可选分页数量列表
	 */
	xy_PageSizeList : [ 20, 40, 60, 80, 100 ],

	/**
	 * 初始化分页数量
	 */
	xy_InitPageSize : null,

	m_intLeftWidth : 500,

	/* 开始行 */
	xy_Current : 0,

	initComponent : function()
	{
		ssc.component.BaseMultiPagingToolBar.superclass.initComponent.call(this);

		this.plugins = new ssc.component.pPageSize(
		{
			variations : this.xy_PageSizeList
		});

		if (this.xy_InitPageSize != null)
		{
			this.pageSize = this.xy_InitPageSize;
		}
		else
		{
			if (this.xy_PageSizeList.length > 0)
			{
				this.pageSize = this.xy_PageSizeList[0];
			}
		}
	}
});
Ext.reg("ssc.component.basemultipagingtoolbar", ssc.component.BaseMultiPagingToolBar);

/**
 * 重载PagingToolBar的doLoad方法，在数据加载完成之前，把开始行记录下来，以便序号列Render中使用
 * @param start
 * @return
 */
ssc.component.BaseMultiPagingToolBar.prototype.doLoad = function(start)
{
	this.xy_Current = start;

	var o = {}, pn = this.paramNames;
	o[pn.start] = start;
	o[pn.limit] = this.pageSize;
	this.store.load(
	{
		params : o
	});
};

/**
 * 序号列获取PagingToolBar的开始行，更新为总序号
 * 会使用Store.xy_PagingToolBar的自定义属性
 * @param value
 * @param cellmeta
 * @param record
 * @param rowIndex
 * @param columnIndex
 * @param store
 * @return
 */
Ext.grid.RowNumberer.prototype.renderer = function(value, cellmeta, record, rowIndex, columnIndex, store)
{
	if (this.rowspan)
	{
		cellmeta.cellAttr = 'rowspan="' + this.rowspan + '"';
	}

	if (store.xy_PagingToolBar == undefined)
	{
		return rowIndex + 1;
	}
	else
	{
		return store.xy_PagingToolBar.xy_Current + rowIndex + 1;
	}
};
