Ext.namespace('gl.component');
gl.component.basegridselect = Ext.extend(Ext.Window,
{
    width : 620,
    height : 400,
    pageSize : 20,
    colModel : null,//grid列头定义，可以为数组或者ColumnModel对象
    fields : null,//grid数据字段定义
    dataRoot : 'data',
    totalProperty : 'total',
    gridUrl : 'xx/xxxxx.action',//grid取数URL
    conditionField : ['fieldName', 'fieldDesc'],
    plain : true,
    layout : 'border',
    modal : true,
    onEsc : Ext.emptyFn,
    plugins : [new Ext.ux.CenterWindowPlugin()],//居中插件
    visibleFilter : true,//是否显示最底部工具栏中过滤条件(默认显示)
    bbarArray : null,//扩展最底部工具栏中过滤条件控件数组
    northToolBar : null,//顶部工具栏插件
    southToolBar : null,//底部工具栏插件(在最底部工具栏上面)
    getDataFilter : Ext.emptyFn,//grid数据过滤条件函数
    getTreeDataFilter : Ext.emptyFn,//tree数据过滤条件函数
    conditionData : null,//最底部工具栏过滤条件数据源
    defaultConditionIndex : 0, //默认过滤条件
	getCm : Ext.emptyFn, //兼容旧版本保留方法,获取列头定义
	leftPnl : null, //左边面板
	centerPnl : null,//居中面板
	autoLoadGrid : true, //是否自动加载grid
	codecondition : "",

    getGrid : function()
    {
        if (Ext.isEmpty(this.grid))
        {
        	if(this.colModel && Ext.isArray(this.colModel))
        	{
        		this.colModel = new Ext.grid.ColumnModel(this.colModel);
        	}
            this.grid = new Ext.grid.GridPanel(
            {
                region : "center",
                anthor : '100%',
                autoWidth : true,
                store : this.getGridStore(),
                cm : this.colModel || this.getCm(),
                loadMask : true,
                enableHdMenu : false,
//                enableColumnMove : false,
                border : false
            });
        }
        return this.grid;
    },
    initComponent : function()
    {
        this.pageBar = new Ext.PagingToolbar(
        {
            region : "south",
            plugins : new Ext.app.PageTool(),
            pageSize : this.pageSize,
            store : this.getGridStore(),
            displayInfo : true,
            displayMsg : "第 {0}条到{1}条,共 {2}条",
            emptyMsg : "没有数据"
        });
        this.centerPnl = new Ext.Panel(
        {
            border : false,
            region : "center",
            layout : 'border',
            items : [this.getGrid(), this.pageBar]
        });
        this.cboCondition = new Ext.form.ComboBox(
        {
            labelStyle : 'text-align:right',
            width : 100,
            editale : false,
            displayField : 'fieldDesc',
            valueField : 'fieldName',
            mode : 'local',
            triggerAction : 'all',
            emptyText : '请选择',
            readOnly : true,
            store : this.getConditionStore()
        });
                
		if(!Ext.isEmpty(this.defaultConditionIndex))
        {
        	this.cboCondition.setValue(this.getConditionStore().getAt(this.defaultConditionIndex).data.fieldName);
        }                        
        this.edtCondition = new Ext.form.TextField(
        {
            width : 120,
            emptyText : ''
        });

        this.filterArray = this.visibleFilter ? ["过滤条件：", this.cboCondition, "-",
                this.edtCondition, "-",
                {
                    text : "过滤",
                    iconCls : 'xy-find',
                    handler : this.filterDate,
                    scope : this
                }] : [];

        this.winbarArray = ["->",
        {
            text : "刷新",
            iconCls : 'xy-toolbar_refresh',
            handler : this.loadData,
            scope : this
        }, "-",
        {
            text : "确定",
            iconCls : 'xy-ok',
            handler : this.onSelected,
            scope : this
        }, "-",
        {
            text : "取消",
            iconCls : 'xy-close',
            handler : this.onClose,
            scope : this
        }];

        this.bbarArray = !this.bbarArray ? this.filterArray : this.bbarArray;
		this.bbarArray = !Ext.isArray(this.bbarArray) ? [] : this.bbarArray;

        var winbar = new Ext.Toolbar(
        {                	
            items : this.bbarArray.concat(this.winbarArray)            	
        });                                                               

        if (this.northToolBar)
        {
            this.northToolBar = new Ext.Panel(
            {
                height : 28,
                region : "north",
                items : this.northToolBar
            });
        }
        if (this.southToolBar)
        {
            this.southToolBar = new Ext.Panel(
            {
                height : 28,
                region : "south",
                items : this.southToolBar
            });
        };

        this.bbar = winbar;
        
        if (this.leftPnl)
        {
            if (this.northToolBar && this.southToolBar)
	        	this.items = [this.leftPnl, this.centerPnl, this.northToolBar, this.southToolBar];
	        else if (this.northToolBar)
				this.items = [this.leftPnl, this.centerPnl, this.northToolBar];
			else if (this.southToolBar)
				this.items = [this.leftPnl, this.centerPnl, this.southToolBar];
			else
				this.items = [this.leftPnl, this.centerPnl];
        }
        else
        {
	       	if (this.northToolBar && this.southToolBar)
    			this.items = [this.getGrid(), this.pageBar, this.northToolBar, this.southToolBar];
    		else if (this.northToolBar)
				this.items = [this.getGrid(), this.pageBar, this.northToolBar];
			else if (this.southToolBar)
				this.items = [this.centerPnl, this.southToolBar];
			else
				this.items = [this.getGrid(), this.pageBar];
        }

        gl.component.basegridselect.superclass.initComponent.call(this);

        this.getGrid().on("rowdblclick", this.onSelected, this);
        this.getGridStore().on("beforeload", this.onBeforeLoad.createDelegate(this));
        this.edtCondition.on("specialkey", this.onConditionSpecialkey, this);
        this.addListener("selected", Ext.emptyFn);
        if (this.autoLoadGrid)
        {
        	this.loadData();
        }
    },
    onConditionSpecialkey : function(_this, e)
    {
    	if (e.getKey() == e.ENTER)
    	{
    		this.filterDate();
    	}
    },
    filterDate : function()
    {
        if (Ext.isEmpty(this.cboCondition.getValue()))
        {
            com.freesky.em8.gl.common.showMessage("请选择过滤条件");
            return;
        }
        else
        {
            this.loadData();
        }
    },
    getGridStore : function()
    {
    	if(!this.gridStore)
    	{
	    	this.gridStore = new Ext.data.JsonStore(
	    	{
	    		url : this.gridUrl,
				root : this.dataRoot,
				totalProperty : this.totalProperty,
				fields : this.fields
			});
    	}
    	return this.gridStore;
    },
    getConditionStore : function()
    {
        if (!this.conditionStore)
        {
            this.conditionStore = new Ext.data.SimpleStore(
            {
                fields : this.conditionField,
                data : this.conditionData || [['code', '编号']]
            });
        }
        return this.conditionStore;
    },
    onBeforeLoad : function()
    {
        this.filter = this.getDataFilter() || {};

        var conditionFilter = [];
        var key = this.cboCondition.getValue();
        var val = this.edtCondition.getValue();
        if (!Ext.isEmpty(key) && !Ext.isEmpty(val))
        {
            conditionFilter[key] = val;
            Ext.apply(this.filter, conditionFilter);
        }

        this.getGridStore().baseParams.jsonFilter = Ext.encode(this.filter);
    },
    loadData : function()
    {
        this.getGridStore().load(
        {
            params :
            {
                start : 0,
                limit : this.pageBar.pageSize
            }
        });
    },
    onSelected : function()
    {
        var record = this.getGrid().getSelectionModel().getSelected();
        if (Ext.isEmpty(record))
        {
            return;
        }
        this.fireEvent("selected", record.data);
    },
    onClose : function()
    {
  		if (this.closeAction == 'hide')
  		{
        	this.hide();
  		}
       	else
       	{
       		this.close();
       	}
    }
});
