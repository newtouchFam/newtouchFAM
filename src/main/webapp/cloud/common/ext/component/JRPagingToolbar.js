Ext.namespace("ssc.component");

/**
 * 经典查询分页栏，取消store加载数据事件
 * @class Ext.PagingToolbar
 * @extends Ext.Toolbar
 * A specialized toolbar that is bound to a {@link Ext.data.Store} and provides automatic paging controls.
 * @constructor
 * Create a new PagingToolbar
 * @param {Object} config The config object
 */
ssc.component.JRPagingToolbar = Ext.extend(Ext.Toolbar,
{	
    /**
     * @cfg {Ext.data.Store} store The {@link Ext.data.Store} the paging toolbar should use as its data source (required).
     */
    /**
     * @cfg {Boolean} displayInfo
     * True to display the displayMsg (defaults to false)
     */
    /**
     * @cfg {Number} pageSize
     * The number of records to display per page (defaults to 20)
     */
	pageSize: 20,
    /**
     * @cfg {String} displayMsg
     * The paging status message to display (defaults to "Displaying {0} - {1} of {2}").  Note that this string is
     * formatted using the braced numbers 0-2 as tokens that are replaced by the values for start, end and total
     * respectively. These tokens should be preserved when overriding this string if showing those values is desired.
     */
	displayMsg : 'Displaying {0} - {1} of {2}',
    /**
     * @cfg {String} emptyMsg
     * The message to display when no records are found (defaults to "No data to display")
     */
	emptyMsg : 'No data to display',
    /**
     * Customizable piece of the default paging text (defaults to "Page")
     * @type String
     */
	beforePageText : "Page",
    /**
     * Customizable piece of the default paging text (defaults to "of %0")
     * @type String
     */
	afterPageText : "of {0}",
    /**
     * Customizable piece of the default paging text (defaults to "First Page")
     * @type String
     */
	firstText : "First Page",
    /**
     * Customizable piece of the default paging text (defaults to "Previous Page")
     * @type String
     */
	prevText : "Previous Page",
    /**
     * Customizable piece of the default paging text (defaults to "Next Page")
     * @type String
     */
	nextText : "Next Page",
    /**
     * Customizable piece of the default paging text (defaults to "Last Page")
     * @type String
     */
	lastText : "Last Page",
    /**
     * Customizable piece of the default paging text (defaults to "Refresh")
     * @type String
     */
	refreshText : "Refresh",

    /**
     * Object mapping of parameter names for load calls (defaults to {start: 'start', limit: 'limit'})
     */
    paramNames :
	{
		start : 'start',
		limit : 'limit'
	},

	initComponent : function()
	{
		ssc.component.JRPagingToolbar.superclass.initComponent.call(this);
		this.cursor = 0;
	},

    // private
	onRender : function(ct, position)
	{
		ssc.component.JRPagingToolbar.superclass.onRender.call(this, ct, position);
		this.first = this.addButton(
		{
			tooltip : this.firstText,
			iconCls : "x-tbar-page-first",
			disabled : true,
			handler : this.onClick.createDelegate(this, [ "first" ])
		});
		this.prev = this.addButton(
		{
			tooltip : this.prevText,
			iconCls : "x-tbar-page-prev",
			disabled : true,
			handler : this.onClick.createDelegate(this, [ "prev" ])
		});
		this.addSeparator();
		this.add(this.beforePageText);
		this.field = Ext.get(this.addDom(
		{
			tag : "input",
			type : "text",
			size : "3",
			value : "1",
			cls : "x-tbar-page-number"
		}).el);
		this.field.on("keydown", this.onPagingKeydown, this);
		this.field.on("focus", function()
		{
			this.dom.select();
		});
		this.afterTextEl = this.addText(String.format(this.afterPageText, 1));
		this.field.setHeight(18);
		this.addSeparator();
		this.next = this.addButton(
		{
			tooltip : this.nextText,
			iconCls : "x-tbar-page-next",
			disabled : true,
			handler : this.onClick.createDelegate(this, [ "next" ])
		});
		this.last = this.addButton(
		{
			tooltip : this.lastText,
			iconCls : "x-tbar-page-last",
			disabled : true,
			handler : this.onClick.createDelegate(this, [ "last" ])
		});
		this.addSeparator();
		this.loading = this.addButton(
		{
			tooltip : this.refreshText,
			iconCls : "x-tbar-loading",
			handler : this.onClick.createDelegate(this, [ "refresh" ])
		});

		if (this.displayInfo)
		{
			this.displayEl = Ext.fly(this.el.dom).createChild(
			{
				cls : 'x-paging-info'
			});
		}
		if (this.dsLoaded)
		{
			this.onLoad.apply(this, this.dsLoaded);
		}
	},
	
    // private
	updateInfo : function()
	{
		if (this.displayEl)
		{
			var count = this.pageSize;
			var activePage = this.getPageData().activePage;

			var msg = count == 0 ? this.emptyMsg : String.format(this.displayMsg, this.cursor + 1,
				this.totalCount < (this.cursor + this.pageSize) ? this.totalCount : (this.cursor + this.pageSize),
				this.totalCount);
			this.displayEl.update(msg);
		}
	},

	// private
	onLoad : function(start)
	{

		this.cursor = start ? start : 0;
		var d = this.getPageData(), ap = d.activePage, ps = d.pages;

		this.afterTextEl.el.innerHTML = String.format(this.afterPageText, d.pages);
		this.field.dom.value = ap;
		this.first.setDisabled(ap == 1);
		this.prev.setDisabled(ap == 1);
		this.next.setDisabled(ap == ps);
		this.last.setDisabled(ap == ps);
		this.loading.enable();
		this.updateInfo();
	},

	doLoad : function(start)
	{

		this.load.call(this.scope, "view", false, "html", start, this.pageSize);

		this.onLoad(start);
	},

	// private
	getPageData : function()
	{
		var total = this.totalCount;

		var ret =
		{
			total : total,
			activePage : Math.ceil((this.cursor + this.pageSize) / this.pageSize),
			pages : total < this.pageSize ? 1 : Math.ceil(total / this.pageSize)
		};

		return ret;
	},
	
    readPage : function(d)
	{
		var v = this.field.dom.value, pageNum;
		if (!v || isNaN(pageNum = parseInt(v, 10)))
		{
			this.field.dom.value = d.activePage;
			return false;
		}
		return pageNum;
	},
	
    // private
	onPagingKeydown : function(e)
	{
		var k = e.getKey(), d = this.getPageData(), pageNum;
		if (k == e.RETURN)
		{
			e.stopEvent();
			if (pageNum = this.readPage(d))
			{
				pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
				this.doLoad(pageNum * this.pageSize);
			}
		}
		else if (k == e.HOME || k == e.END)
		{
			e.stopEvent();
			pageNum = k == e.HOME ? 1 : d.pages;
			this.field.dom.value = pageNum;
		}
		else if (k == e.UP || k == e.PAGEUP || k == e.DOWN || k == e.PAGEDOWN)
		{
			e.stopEvent();
			if (pageNum = this.readPage(d))
			{
				var increment = e.shiftKey ? 10 : 1;
				if (k == e.DOWN || k == e.PAGEDOWN)
				{
					increment *= -1;
				}
				pageNum += increment;
				if (pageNum >= 1 & pageNum <= d.pages)
				{
					this.field.dom.value = pageNum;
				}
			}
		}
	},
	onClick : function(which)
	{
		switch (which)
		{
			case "first" :
				this.doLoad(0);
				break;
			case "prev" :
				this.doLoad(Math.max(0, this.cursor - this.pageSize));
				break;
			case "next" :
				this.doLoad(this.cursor + this.pageSize);
				break;
			case "last" :
				var total = this.totalCount;
				var extra = total % this.pageSize;
				var lastStart = extra ? (total - extra) : total - this.pageSize;
				this.doLoad(lastStart);
				break;
			case "refresh" :
				this.doLoad(this.cursor);
				break;
		}
	}
});
Ext.reg("ssc_component_jrpagingtoolbar", ssc.component.JRPagingToolbar);


if (ssc.component.JRPagingToolbar)
{
	Ext.apply(ssc.component.JRPagingToolbar.prototype,
	{
		displayInfo : true,
		displayMsg : '第{0}条到{1}条,共{2}条',
		emptyMsg : "无记录!",
		beforePageText : '第',
		afterPageText : '页 共{0}页',
		firstText : '首页',
		prevText : '上一页',
		nextText : '下一页',
		lastText : '尾页',
		refreshText : '刷新'
	});
}