Ext.namespace('gl.component');
gl.component.cashflowtreegridselect = Ext.extend(gl.component.basegridselect,
{
	width : 750,
    height : 450,
    leftPnlTitle : 'xxxxx',// 左边面板标题
    nodeId : 'name',// tree节点id名称,默认值:groupid
    nodeCode : 'code',// tree节点code名称,默认值:groupcode
    rootText : 'xxxxx',// 根节点文本内容
    rootVisible : true,// 是否显示根节点
    treeUrl : 'xx/xxxxx.action',// tree取数据URL
    codecondition : "",
    getTreeDataFilter : Ext.emptyFn,// tree数据过滤条件函数
    autoLoadGrid : true, //是否自动加载grid
    getTree : function()
    {
        if (!this.tree)
        {
            var loader = new Ext.tree.TreeLoader(
            {
                dataUrl : this.treeUrl,
                preloadChildren : true,
                loadMask : true,
                waitMsg : "请等待"
            });
                    
            loader.on("beforeload", function(This, node)
        	{
        		This.baseParams.jsonFilter = Ext.encode(this.getTreeDataFilter() || {});
        	}.createDelegate(this));

            var root = new Ext.tree.AsyncTreeNode(
            {
                text : this.rootText,
                id : 'root',  
                expanded : true
            });
            this.tree = new Ext.tree.TreePanel(
            {
                loader : loader,
                root : root,
                animate : true,
                autoScroll : true,
                enableDD : false,
                border : false,
                rootVisible : this.rootVisible
            });
            root.expand();
        }
        return this.tree;
    },
    getCurrTreeNode : function()
    {
        return this.currNode;
    },
    setCurrTreeNode : function(node)
    {
        this.currNode = node;
    },
    initComponent : function()
    {
        this.leftPnl = new Ext.Panel(
        {
            title : this.leftPnlTitle,
            region : 'west',
            layout : 'fit',
            split : true,
            width : 200,
            collapsible : true,
            autoScroll : true,
            items : [this.getTree()]
        });
        
        gl.component.cashflowtreegridselect.superclass.initComponent.call(this);

        //this.on("render", this.initGrid, this);
        this.leftPnl.on("collapse", this.leftPnlOnCollapse, this);
        this.leftPnl.on("expand", this.leftPnlOnExpand, this);
        this.getTree().on("click", this.treeClick, this);
    },
    onBeforeLoad : function()
    {
        this.filter = this.getDataFilter() || {};
        var nodeFilter = [];
        if (this.leftPnl.collapsed == false && this.getCurrTreeNode() != null)
        {
            if (this.filter.code) this.filter.code = undefined;
            nodeFilter[this.nodeId] = this.getCurrTreeNode().attributes.id;
            nodeFilter[this.nodeCode] = this.getCurrTreeNode().attributes.code;
            Ext.apply(this.filter, nodeFilter);
        }

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
    leftPnlOnCollapse : function()
    {
        this.loadData();
    },
    leftPnlOnExpand : function()
    {
        this.loadData();
    },
	treeClick : function(node, e)
    {
    	this.getGridStore().baseParams.node = node.attributes.id;
        this.loadData();
    }
});