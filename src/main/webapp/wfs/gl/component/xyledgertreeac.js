Ext.namespace("Ext.app");
Ext.app.xyledgertreeac = Ext.extend(Ext.form.TwinTriggerField, {
    call : Ext.emptyFn,
    initComponent : function()
    {
        Ext.app.xyledgertreeac.superclass.initComponent.call(this);
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
		this.on('render', function(f) {
					this.onLoad();
				}, this);
		this.addListener("valuechange", this.call);
		
	},
	loaded : false,
	m_window : null,
	m_tree : null,
	validationEvent : false,
	validateOnBlur : false,
	trigger1Class : 'x-form-search-trigger',
	trigger2Class : 'x-form-clear-trigger',
	readOnly : true,
	leafSelect : true,
	rootTitle : '请选择',
	hiddenData : null,
	allExpand : false,
	dataUrl : null,
	param : null,
	winWidth : 350,
	winHeight : 400,
	scriptPath : null,
	sqlProcFile : "",
	firstSqlFile : null,
	otherSqlFile : null,
	ledgerdetailid : "", //分户明细id
	ledgertypeid : "", //分户类别id
	issinglechecked : true, //是否单选 
	ischeckaccount : false, //是否需要选择科目，仅适合多选,选择了科目，传进来的参数名称必须为‘accountcode’，否则报错
	XyCache : true,
	//往来相关标志位
	accurrent : false,
	acin : false,
	
	
	onLoad : function() {
        if (this.hiddenData != null) {
            this.setXyValue(this.hiddenData);
		}
	},
	loadException : function(This, node, response) {
		showExtLoadException(This, node, response);
	},
	reload : function() {
		this.loaded = false;
	},
	setValue : function(A) {
		this.value = A;
		if (this.rendered) {
			this.el.dom.value = (A === null || A === undefined || A == ""
					? ""
					: A.text);
			this.validate()
		}
	},
	setXyValue : function(A) {
		if (A === undefined || A === null || A === "") {
			this.hiddenData = null;
			this.setValue("");
		} else {
			if (typeof A == "object") {
			} else {
				A = JSON.parse(A);
			}
			this.hiddenData = A;
			this.setValue(A);
		}
	},
	getXyValue : function() {
		if (this.hiddenData != null && this.hiddenData["id"] != null) {
			return this.hiddenData["id"];
		}
		return "";
	},
	getDisplayValue : function() {
		if (this.hiddenData != null
				&& this.hiddenData["text"] != null) {
			return this.hiddenData["text"];
		}
		return "";
	},
	
	onTrigger2Click : function() {
		if (this.disabled) {
			return;
		}
		var oldValue = this.hiddenData;
		this.setValue("");
		this.ledgerdetailid = "";
		this.ledgertypeid = "";
		this.hiddenData = null;
		if (oldValue != null) {
			this.fireEvent("valuechange", oldValue, null);
		}
	},
	onTrigger1Click : function() {
		if (this.disabled) {
			return;
		}
		//往来冲销标志位判断  (添加else 冲销查全部分户  if内容为改变)
		if(this.accurrent == false)
		{
			if(this.ischeckaccount)
			{
				var index = 0;
				var flag = false;
				if(this.param == null||this.param==undefined)
				{
					Ext.MessageBox.alert("警告", "请选择科目");
	                return;
				}
				else
				{
					for(var i = 0; i < this.param.length; i++)
					{
						if(this.param[i].name=='accountcode')
						{
							flag = true;
							index = i;
						}
					}
					if(flag)
					{
						if(this.param[index].value==null || 
								this.param[index].value==undefined || this.param[index].value=='')
						{
							Ext.MessageBox.alert("警告", "请选择科目");
			                return;
						}
					}
					else
					{
						Ext.MessageBox.alert("警告", "请选择科目");
		                return;
					}
				}
			}
		}
		else
		{
			this.param = 
	    	[{
				name :'accountcode',
				value :null
			}];
		}
		if (this.m_window != null) {
			if (this.loaded) {
				this.m_window.show();
				return;
			} else {
				this.m_tree.loader.load(this.m_tree.root);
				this.m_window.show();
				this.m_tree.root.expand(this.allExpand);
				this.loaded = true;
				return;
			}
		}
		var m_this = this;
		var root = new Ext.tree.AsyncTreeNode({
					id : "root",
					text : this.rootTitle
				});

        var url = this.dataUrl;
        if (url == null || url == "")
        {
            url = "component/xyledgertree/ledgertree";// 为空的话调用默认action地址,否则调用用户传入的地址
        }

        var m_loader = new Ext.tree.TreeLoader({
            dataUrl : url
        });
        m_loader.on("beforeload", function(treeLoader, node)
        {
            treeLoader.baseParams.scriptPath = m_this.scriptPath;
            if(typeof(node.attributes.tag) != undefined)
            {
            	treeLoader.baseParams.tag = node.attributes.tag;
            }
            if(typeof(node.id) != undefined)
            {
            	treeLoader.baseParams.id = node.id;
            }
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
            //往来初始化标志位(新增)
            treeLoader.baseParams.acin = m_this.acin;
        });
        m_loader.on("loadexception", showExtLoadException);

        this.m_tree = new Ext.tree.TreePanel({
            root : root,
            loader : m_loader,
            height : this.winHeight,
            animate : true,
            enableDD : false,
            border : false,
            rootVisible : true,
            autoScroll : true
        });

        this.m_window = new Ext.Window({
            title : this.rootTitle,
            modal : true,
            width : this.winWidth,
            height : this.winHeight,
            autoScroll : true,
            closeAction : 'hide',
            resizable : false,
            layout : 'fit',
            items : [this.m_tree],
            buttons : [
                {
                    text : '确定',
                    handler : submitCall
                },
                {
                    text : '取消',
                    handler : closeCall
                }
            ]
        });
        var newid = "";
    	var newtext = "";
    	var getledgerdetailid = "";
    	var getledgertypeid = "";
        this.m_window.show();
        root.expand();
        this.loaded = true;
        this.m_tree.on("dblclick", tree_click);
        this.m_tree.on("checkchange", checkchange);

        function submitCall()
        {
           if(m_this.issinglechecked)
	       {
        	   m_this.ledgertypeid = "";
        	   m_this.ledgerdetailid = "";
        	   var node = m_this.m_tree.getSelectionModel().getSelectedNode();
        	   //往来初始化 只允许选择末级分户(新增判断)
        	   if(m_this.acin == true)
        	   {
        		   if(node.attributes.leaf != 1)
        		   {
        			   Ext.MessageBox.alert("警告", "请选择末级分户信息");
        			   return;
        		   }
        	   }
	           if (node == null || node.id == 'root')
	            {
	                Ext.MessageBox.alert("警告", "不能选择根节点，请重新选择!");
	                return;
	            }
	            if (m_this.leafSelect && !node.leaf)
	            {
	                return;
	            }
	            if(node.attributes.tag=="0")
	            {
	            	m_this.ledgertypeid = node.id;
	            }
	            else
	            {
	            	m_this.ledgerdetailid = node.id;
	            }
	            var oldValue = m_this.hiddenData;
	            m_this.hiddenData = node;
	            var newValue = m_this.hiddenData;
	            m_this.setValue(node);
	            m_loader.un("loadexception", showExtLoadException);
	            m_this.m_window.hide();
           }
           else
           {
        	
        	   	newid = "";
           	 	newtext = "";
           	 	getledgerdetailid = "";
           		getledgertypeid = "";
	        	//遍历所有节点
	        	getChild(root);
	        	
	        	//去掉最后的“,”
	        	if(newid.length > 0)
	        	{
	        		newid = newid.substring(0,newid.length-1);
	        	}
	        	if(newtext.length > 0)
	        	{
	        		newtext = newtext.substring(0,newtext.length-1);
	        	}
	        	if(getledgerdetailid.length > 0)
	        	{
	        		getledgerdetailid = getledgerdetailid.substring(0,getledgerdetailid.length-1);
	        	}
	        	if(getledgertypeid.length > 0)
	        	{
	        		getledgertypeid = getledgertypeid.substring(0,getledgertypeid.length-1);
	        	}
	        	
	        	m_this.ledgerdetailid = getledgerdetailid;
	        	m_this.ledgertypeid = getledgertypeid;
	        	var newnode = new Ext.tree.AsyncTreeNode(
	        	{
					id : newid,
					text : newtext
				});
	        	
	        	
	        	
	            var oldValue = m_this.hiddenData;
	            m_this.hiddenData = newnode;
	            var newValue = m_this.hiddenData;
	            m_this.setValue(newnode);
	            m_loader.un("loadexception", showExtLoadException);
	            m_this.m_window.hide();
	            
            }
            if (oldValue == null || oldValue.id != newValue.id)
            {
                m_this.fireEvent("valuechange", oldValue, newValue);
            }
        }

        function closeCall()
        {
            m_loader.un("loadexception", showExtLoadException);
            m_this.m_window.hide();
        }
        var nodeflag = null;
        var flag = null;
        //字符节点联动
        function checkchange(node)
        {
        	if(node.attributes.leaf == 0)
        	{
        		//非末级节点 清除下级
        		childcheckchange(node);
        		if(nodeflag != null)
        		{
        			nodeflag.ui.checkbox.checked = true; 
        			nodeflag.attributes.checked = true; 
        			if(!flag)
        			{
        				nodeflag.ui.checkbox.checked = false; 
            			nodeflag.attributes.checked = false; 
        			}
            		flag = null;
        			nodeflag = null;
        		}
        	}
        	else
        	{
    			//末级节点 清除上级选择
    			parentcheckchange(node);
        	}
        }
        function parentcheckchange(node)
        {
        	if(node.parentNode.id != 'root')//判断是否是root节点  
        	{
                //如果该节点的父节点和子节点被选中继续选中  
                node.parentNode.ui.checkbox.checked = false;  
                node.parentNode.attributes.checked = false;  
                if(node.parentNode.id != 'root')
                {
                	parentcheckchange(node.parentNode);
                }
        	}
        }
        
        function childcheckchange(node)
        {
    		for(var i = 0;i < node.childNodes.length;i++)
    		{
    			if(node.childNodes[i].attributes.leaf == 0)
        		{
        			if(nodeflag == null)
        			{
        				nodeflag = node;
        				flag = node.ui.checkbox.checked;
        			}
        		}
    			node.childNodes[i].ui.checkbox.checked = false;
    			node.childNodes[i].attributes.checked = false;
    			if(node.childNodes[i].hasChildNodes())
    			{
    				childcheckchange(node.childNodes[i]);
    			}
    		}
    		parentcheckchange(node);
    		node.collapse();
        }
        function tree_click(node)
        {
            if (node.id == 'root')
            {
                return;
            }
            
            if(m_this.issinglechecked)
            {
            	//往来初始化 双击监控 仅末级可以双击选中(修改逻辑)
            	if(m_this.acin == true)
            	{
            		if(node.attributes.leaf == 1)
            		{
            			submitCall();
            		}
            	}
            	else
            	{
            		submitCall();
            	}
//            	submitCall();
            }
            else
            {
            	//往来冲销 双击仅展开 不选中(新增if内容)
            	if(m_this.accurrent)
            	{
            		if(node.attributes.leaf == 0)
            		{
            			if(node.ui.checkbox.checked)
            			{
            				node.ui.checkbox.checked = false;
            			}
            			else
            			{
            				node.ui.checkbox.checked = true;
            			}
            		}
            	}
            	else
            	{
            		var a = node.attributes.checked;
            		if(a != undefined)
            		{
            			node.attributes.checked = !a;
            		}
            	}
            }
        }
        function getChild(node)
        {
        	node.eachChild(function(child)
        	{
        		var ischecked = child.attributes.checked;
        		//如果是选中的则拼接newnode的id和text
        		if(ischecked)
    			{
        			newid += child.id + ",";
        			newtext += child.text + ",";
        			if(child.attributes.tag=="0")
        			{
        				getledgertypeid += child.id + ",";
        			}
        			else
        			{
        				if(m_this.accurrent)
        				{
        					if(child.attributes.leaf == 1)
        					{
        						//末级节点 直接凭借
        						getledgerdetailid += child.id + ",";
        					}
        					else
        					{
        						//非末级节点 拼接+号
        						getledgerdetailid += child.id + "+"+ ",";
        					}
        				}
        				else
        				{
        					getledgerdetailid += child.id + ",";
        				}
        			}
    			}
        		if(!child.leaf)
        		{
        			getChild(child);
        		}
        	});
        }
    }
});
Ext.reg("xyledgertreeac", Ext.app.xyledgertreeac);