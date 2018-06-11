Ext.namespace("Ext.app");
Ext.app.XyComboBoxTreeEx = Ext.extend(Ext.form.ComboBox, {
    displayField : 'text',
    valueField : 'id',
    openModel : true,
    outterEditor : null,
    divid : null,
    m_tree : null,
    leafSelect : true,
    winHeight : 300,
    loaded : false,
    isLocation : false,
    layout : "fit",
    store : new top.Ext.data.SimpleStore({
        fields : [],
        data : [
            []
        ]
    }),
    mode : "local",
    validationEvent : false,
    validateOnBlur : false,
    trigger1Class : 'x-form-arrow-trigger',
    trigger2Class : 'x-form-clear-trigger',
    editable : false,
    forceSelection : true,
    rootTitle : '请选择',
    hiddenData : null,
    dataUrl : null,
    param : null,
    scriptPath : null,
    autoScroll : true,
    sqlProcFile : "",
    firstSqlFile : null,
    otherSqlFile : null,
    originvalue : "",
    XyCache : true,
    initComponent : function()
    {
        this.on('specialkey', function(f, e)
        {
            if (e.getKey() == e.ENTER)
            {
                this.onTrigger1Click();
            }
        }, this);
        if (this.XyAllowDelete === false)
        {
            this.triggerConfig = {
                tag : "span",
                cls : "x-form-twin-triggers",
                cn : [
                    {
                        tag : "img",
                        src : Ext.BLANK_IMAGE_URL,
                        cls : "x-form-trigger " + this.trigger1Class
                    }
                ]
            };
        } else
        {
            this.triggerConfig = {
                tag : "span",
                cls : "x-form-twin-triggers",
                cn : [
                    {
                        tag : "img",
                        src : Ext.BLANK_IMAGE_URL,
                        cls : "x-form-trigger " + this.trigger1Class
                    },
                    {
                        tag : "img",
                        src : Ext.BLANK_IMAGE_URL,
                        cls : "x-form-trigger " + this.trigger2Class
                    }
                ]
            };
        }
        this.divid = Ext.id();
        this.tpl = "<div id='" + this.divid + "' style='height:"
                + this.winHeight + "px'></div>";
        this.on('render', function(f)
        {
            this.onLoad();
        }, this);
        this.on("expand", function(f)
        {
            this.onExpand();
        }, this);
        this.addListener("afterset", this.call);
        Ext.app.XyComboBoxTreeEx.superclass.initComponent.call(this);
    },
    setValue : function(A)
    {
        if (this.rendered)
        {
            var s_value = "";
            if (A === undefined || A === null || A === "")
            {
                s_value = "";
                this.value = null;
            } else
            {
                if (typeof A == "object")
                {
                } else
                {
                    A = JSON.parse(A);
                }
                this.value = A;
                s_value = A[this.displayField];
            }
            this.el.dom.value = s_value;
            this.validate();
        }
    },

    setXyValue : function(A)
    {
        if (this.rendered)
        {
            var s_value = "";
            if (A === undefined || A === null || A === "")
            {
                s_value = "";
                this.value = null;
            } else
            {
                if (typeof A == "object")
                {
                } else
                {
                    A = JSON.parse(A);
                }
                this.value = A;
                s_value = A[this.displayField];
            }
            this.el.dom.value = s_value;
        }
    },

    getValue : function()
    {
        return this.value;
    },
    getXyValue : function()
    {
        return this.getValue();
    },
    getTrigger : function(A)
    {
        return this.triggers[A]
    },
    initTrigger : function()
    {
        var A = this.trigger.select(".x-form-trigger", true);
        this.wrap.setStyle("overflow", "hidden");
        var B = this;
        A.each(function(D, F, C)
        {
            D.hide = function()
            {
                var G = B.wrap.getWidth();
                this.dom.style.display = "none";
                B.el.setWidth(G - B.trigger.getWidth())
            };
            D.show = function()
            {
                var G = B.wrap.getWidth();
                this.dom.style.display = "";
                B.el.setWidth(G - B.trigger.getWidth())
            };
            var E = "Trigger" + (C + 1);
            if (this["hide" + E])
            {
                D.dom.style.display = "none"
            }
            D.on("click", this["on" + E + "Click"], this, {
                preventDefault : true
            });
            D.addClassOnOver("x-form-trigger-over");
            D.addClassOnClick("x-form-trigger-click")
        }, this);
        this.triggers = A.elements
    },
    onLoad : function()
    {
        if (this.hiddenData != null)
        {
            this.setValue(this.hiddenData);
        }
    },
    reload : function()
    {
        this.loaded = false;
    },
    onExpand : function()
    {
        if (this.m_tree != null)
        {
            if (this.loaded && this.XyCache)
            {
                return;
            } else
            {
                this.m_tree.loader.load(this.m_tree.root);
                this.m_tree.root.expand();
                this.loaded = true;
                return;
            }
        }
        var m_this = this;
        var root = new Ext.tree.AsyncTreeNode({
            id : "root",
            text : m_this.rootTitle
        });

		var url = this.dataUrl;
		if (url == null || url == "") {
			url = "wf/CommonTreeDataAction.action";// 为空的话调用默认action地址,否则调用用户传入的地址
		}

        var m_loader = new Ext.tree.TreeLoader({
            dataUrl : url
        });
        m_loader.on("beforeload", function(treeLoader, node)
        {
            treeLoader.baseParams.scriptPath = m_this.scriptPath;
            if (m_this.sqlProcFile == '')
            {
                treeLoader.baseParams.firstSqlFile = m_this.firstSqlFile;
                treeLoader.baseParams.otherSqlFile = m_this.otherSqlFile;
            }
            else
            {
                treeLoader.baseParams.sqlProcFile = m_this.sqlProcFile;
            }
            if (m_this.param != null)
            {
                for (var i = 0; i < m_this.param.length; i++)
                {
                    treeLoader.baseParams[m_this.param[i].name] = m_this.param[i].value;
                }
            }
        });
        m_loader.on("loadexception", showExtLoadException);

        this.m_tree = new Ext.tree.TreePanel({
            root : root,
            loader : m_loader,
            animate : true,
            enableDD : false,
            border : false,
            autoScroll : true,
            height : m_this.winHeight,
            rootVisible : true
        });
        this.m_tree.render(this.divid);
        var mtree = this.m_tree;
        var mloc = this.isLocation;
        
		root.expand();
		this.loaded = true;
		this.m_tree.getLoader().on("load",function ( This,  node,  response )
		{
			var child = node.childNodes;
			var clength = 0;
			var treelength = 0;
			var maxchild = 0; 
			for(var i = 0; i < child.length; i ++ )
			{
				if( i == 0 )
				{
					maxchild = child[0];
					clength = child[0].text.length;
				}
				else if(child[i].text.length > clength)
				{
					maxchild = child[i];
					clength = child[i].text.length;
				}
			} 
			if( clength < this.m_tree.getInnerWidth() )
			{
				clength = this.m_tree.getInnerWidth() + 17;
			}
			this.listLayerEl = Ext.query('.x-combo-list').pop();
			this.innerListEl = Ext.query('.x-combo-list-inner').pop();
			this.treeEl = Ext.query('.x-tree').pop();
			this.treeEl.style.width = clength + "px";
			this.innerListEl.style.width = clength  + "px";
			this.listLayerEl.style.width = clength  + "px";
		}.createDelegate(this));
		this.m_tree.on("click", function(node) {
					if (node == null) {
						return;
					}
					if (node.id == "root") {
						return;
					}
					if (m_this.leafSelect && !node.leaf) {
						return;
					}
					
					var oldValue = m_this.getValue();
					m_this.collapse();
					
					if(mloc)
					{
					    m_this.originvalue = node.text;	
					    node.setText(getFullDisplay(node));
					}
					
					m_this.setValue(node);
					if (m_this.outterEditor !== undefined
							&& m_this.outterEditor != null) {
						m_this.outterEditor.completeEdit();
					}
					m_this.fireEvent("afterset", oldValue, node);
				});
				
		function getFullDisplay(node) 
		{
			if(node == null)
			{
				return;
			}
	
		    var nodearr = node.getPath().split("/");
		   
		    var fulldisplay = "";
		    
		    for(var i = 1; i < nodearr.length; i ++)
		    {
		    	if(nodearr[i].toString() != "root")
		    	{
		    	    fulldisplay += mtree.getNodeById(nodearr[i].toString()).text;	
		    	}
		    }
	
		    return fulldisplay;
		}
	},

	call : function(oldValue, node)
	{
		if(this.isLocation)
		{
			node.setText(this.originvalue);
		}
	},
	
	onTrigger2Click : function() {
		if (this.disabled) {
			return;
		}
		this.setValue(null);
		this.fireEvent("afterset");
	},
	onTriggerClick : function() {
		if (this.disabled) {
			return
		}
		if (this.isExpanded()) {
			this.collapse();
			this.el.focus()
		} else {
			this.onFocus({});
			this.expand();
			this.el.focus()
		}
	},
	onTrigger1Click : function() {
		this.onTriggerClick();
	}
});
Ext.reg('xycomboboxtreeex', Ext.app.XyComboBoxTreeEx);