Ext.namespace("ssc.component");

/**
 * 缩写定义
 */
pPageSize = ssc.component.pPageSize;

ssc.component.pPageSize = function(config)
{
	Ext.apply(this, config);
};

Ext.extend(ssc.component.pPageSize, Ext.util.Observable,
{
	beforeText : '按',
	afterText : '页',
	addBefore : '-',
	addAfter : null,
	dynamic : false,
	variations : [ 10, 30, 60, 70, 80, 90 ],
	comboCfg : undefined,
	init : function(pagingToolbar)
	{
		this.pagingToolbar = pagingToolbar;
		this.pagingToolbar.pageSizeCombo = this;
		this.pagingToolbar.setPageSize = this.setPageSize.createDelegate(this);
		this.pagingToolbar.getPageSize = function()
		{

			return this.pageSize;
		};
		this.pagingToolbar.on('render', this.onRender, this);
	},
	addSize : function(value)
	{
		if (value > 0)
		{
			this.sizes.push( [ value ]);
		}
	},
	updateStore : function()
	{
		if (this.dynamic)
		{
			var middleValue = this.pagingToolbar.pageSize, start;
			middleValue = (middleValue > 0) ? middleValue : 1;
			this.sizes = [];
			var v = this.variations;
			for ( var i = 0, len = v.length; i < len; i++)
			{
				this.addSize(middleValue - v[v.length - 1 - i]);
			}
			this.addToStore(middleValue);
			for ( var i = 0, len = v.length; i < len; i++)
			{
				this.addSize(middleValue + v[i]);
			}
		}
		else
		{
			if (!this.staticSizes)
			{
				this.sizes = [];
				var v = this.variations;
				var middleValue = 0;
				for ( var i = 0, len = v.length; i < len; i++)
				{
					this.addSize(middleValue + v[i]);
				}
				this.staticSizes = this.sizes.slice(0);
			}
			else
			{
				this.sizes = this.staticSizes.slice(0);
			}
		}
		this.combo.store.loadData(this.sizes);
		this.combo.collapse();
		this.combo.setValue(this.pagingToolbar.pageSize);
	},

	setPageSize : function(value, forced)
	{
		var pt = this.pagingToolbar;
		this.combo.collapse();
		value = parseInt(value) || parseInt(this.combo.getValue());
		value = (value > 0) ? value : 1;
		if (value == pt.pageSize)
		{
			return;
		}
		else if (value < pt.pageSize)
		{
			pt.pageSize = value;
			var ap = Math.round(pt.cursor / value) + 1;
			var cursor = (ap - 1) * value;
			var store = pt.store;
			if (cursor > store.getTotalCount())
			{
				this.pagingToolbar.pageSize = value;
				this.pagingToolbar.doLoad(cursor - value);
			}
			else
			{
				this.pagingToolbar.pageSize = value;
				this.pagingToolbar.doLoad(Math.floor(this.pagingToolbar.cursor
						/ this.pagingToolbar.pageSize)
						* this.pagingToolbar.pageSize);
			}
		}
		else
		{
			this.pagingToolbar.pageSize = value;
			this.pagingToolbar.doLoad(Math.floor(this.pagingToolbar.cursor
					/ this.pagingToolbar.pageSize)
					* this.pagingToolbar.pageSize);
		}
		this.updateStore();
	},
	onRender : function()
	{
		this.combo = Ext.ComponentMgr.create(Ext.applyIf(this.comboCfg || {},
		{
			store : new Ext.data.SimpleStore(
			{
				fields : [ 'pageSize' ],
				data : []
			}),
			displayField : 'pageSize',
			valueField : 'pageSize',
			mode : 'local',
			triggerAction : 'all',
			width : 50,
			xtype : 'combo'
		}));
		this.combo.on('select', this.setPageSize, this);
		this.updateStore();
		if (this.addBefore)
		{
			this.pagingToolbar.add(this.addBefore);
		}
		if (this.beforeText)
		{
			this.pagingToolbar.add(this.beforeText);
		}
		this.pagingToolbar.add(this.combo);
		if (this.afterText)
		{
			this.pagingToolbar.add(this.afterText);
		}
		if (this.addAfter)
		{
			this.pagingToolbar.add(this.addAfter);
		}
	}
});
Ext.reg("ssc.component.ppagesize", ssc.component.pPageSize);