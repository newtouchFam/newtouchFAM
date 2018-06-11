gl.component.xychooseaccountex = Ext.extend(gl.component.xycomboboxacext,
{
    dir : 'code',
    dataUrl : 'vouchermanager/voucheraccount/filter',
    dataFields : ['varaccountcode', 'varaccountname', 'varaccountfullname', 'uqaccountid', 'intproperty', 'uqtypeid',
                  'uqforeigncurrid', 'intisledge', 'varmeasure', 'intflag', 'intislastlevel'],
    minChars : 2,// 指定触发自动完成的最小输入字数。大于等于这个值时会向远程服务器提交请求
    minListWidth : 600,// 设置下拉列表的宽度，如果不指定分页工具栏可能会显示不全
    pageSize : 8, // 分页最大数量
    jsonFilter : null,
    acteditor : null,
    dir : '',
    dataUrl : null, // 数据的url地址
    grid : null,
    fieldLabel : 'XXX',
    year : null,
    accountsetid : null,
    companyID : null,
    accountType : null,
    mode : 'remote',// 指定数据加载方式，如果直接从客户端加载则为local，如果从服务器断加载则为remote.默认值为：remote
    // 当元素加载的时候，如果返回的数据为多页，则会在下拉列表框下面显示一个分页工具栏，该属性指定每页的大小
    // 在点击分页导航按钮时，将会作为start及limit参数传递给服务端，默认值为0，只有在mode='remote'的时候才能够使用
    initComponent : function()
    {
        this.trigger1Class = 'x-form-search-trigger';
        gl.component.xychooseaccountex.superclass.initComponent.call(this);

        this.dir = 'code';
        this.dataUrl = 'vouchermanager/voucheraccount/filter';
        this.dataFields = ['varaccountcode', 'varaccountname', 'varaccountfullname', 'uqaccountid', 'intproperty', 'uqtypeid',
                           'uqforeigncurrid', 'intisledge', 'varmeasure', 'intflag', 'intislastlevel'];
        this.minChars = 2;
        this.minListWidth = 600;
        this.pageSize = 8;
        this.displayField = 'text';
        this.valueField = 'id';
        this.readOnly = false;
        
        this.store = new Ext.data.JsonStore(
        {
            url : this.dataUrl,
            totalProperty : "total",
            root : "data",
            fields : this.dataFields
        });
        this.store.on('beforeload', this.beforeLoadHandler.createDelegate(this));
        this.store.on('load', this.loadHandler.createDelegate(this));
        
        this.tpl = new Ext.XTemplate(
                '<tpl for="."><div class="search-item x-combo-list-item">',
                '<div ext:qtip="{value}"  style="border:0 none">{' + "varaccountcode"
                		+ '}{' + "varaccountfullname"
                        + '}</div>', '</div></tpl>');

        Ext.apply(this,
                {
                    editable : true,
                    typeAhead : false,// 这个如果设置成true，自动完成的功能就有点变扭了，因为这个是combobox的自动填充配置项
                    triggerAction : 'all',
                    selectOnFocus : true,
                    itemSelector : 'div.search-item'// 如果不加这个，下拉框中的选项不能选择
                });
        this.addListener("beforeload", Ext.emptyFn);
        this.on("select", this.getLoadAccountData, this);
    },
//    onViewClick : function(B) 
//    {
//		var A = this.view.getSelectedIndexes()[0];
//		var C = this.store.getAt(A);
//		if (C) {
//			this.onSelect(C, A);
//		}
//		if (B !== false) {
//			this.el.focus();
//		}
//	},
//	onSelect : function(A, B)
//	{
//		if (this.fireEvent("beforeselect", this, A, B) !== false) {
//			this.setValue(A.data[this.valueField || this.displayField]);
//			this.collapse();
//			this.fireEvent("select", this, A, B);
//		}
//	},
//	select : function(A, C)
//	{
//		this.selectedIndex = A;
//		this.view.select(A);
//		if (C !== false) {
//			var B = this.view.getNode(A);
//			if (B) {
//				this.innerList.scrollChildIntoView(B, false);
//			}
//		}
//	},
    initEvents : function()
    {
        Ext.form.ComboBox.superclass.initEvents.call(this);

        /**
         * 限制输入，只允许输入数字
         */
		this.stripCharsRe = new RegExp("[^0123456789]", "gi");
		var B = "0123456789";
		var A = function(D) {
			var C = D.getKey();
			if (!Ext.isIE
					&& (D.isSpecialKey() || C == D.BACKSPACE || C == D.DELETE)) {
				return
			}
			var E = D.getCharCode();
			if (B.indexOf(String.fromCharCode(E)) === -1) {
				D.stopEvent()
			}
		};
		this.el.on("keypress", A, this)

		this.keyNav = new Ext.KeyNav(this.el,
        {
            "up" : function(A)
            {
                this.inKeyMode = true;
                this.selectPrev();
            },
            "down" : function(A)
            {
                if (!this.isExpanded())
                {
                    this.onTriggerClick();
                }
                else
                {
                    this.inKeyMode = true;
                    this.selectNext();
                }
            },
            "enter" : function(A)
            {
                this.onViewClick(false);
                if(this.grid != null)
                {
                    if(this.acteditor != null)
                    {
                    	this.grid.accountcomafterset.createDelegate(this);
                    	this.grid.startEditing(this.acteditor.r,this.acteditor.c);
                    }
                }
                return true;
            },
            "esc" : function(A)
            {
                this.collapse();
            },
            "tab" : function(A)
            {
                this.onViewClick(false);
                return true;
            },
            scope : this,
            doRelay : function(C, B, A)
            {
                if (A == "down" || this.scope.isExpanded())
                {
                    return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                }
                return true;
            },
            forceKeyDown : true
        });

        this.queryDelay = Math.max(this.queryDelay || 10, this.mode == "local" ? 10 : 250);
        this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
        if (this.typeAhead)
        {
            this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
        }
        if (this.editable !== false)
        {
            this.el.on("keyup", this.onKeyUp, this);
        }
        if (this.forceSelection)
        {
            this.on("blur", this.doForce, this);
        }

        this.on("specialkey", this.onSpecialKeyEvent, this);
    },
    beforeLoadHandler : function(store, options)
    {
    	this.jsonFilter = 
    	{
    		isleaf : 1	/* 只查询末级科目 */
		};
        this.inQuery = true;
        if (this.fireEvent("beforeload") !== false)
        {
            // store.baseParams.start = 0;
            store.baseParams.limit = this.pageSize;
            this.jsonFilter[this.dir] = this.el.dom.value;
            if (this.el) store.baseParams.jsonFilter = Ext.encode(this.jsonFilter);
        }
    },
    loadHandler : function(store, records, options)
    {
        this.inQuery = false;
        this.recordCount = records.length;
        /*
         * if ( records.length == 0 ) { }
         */
    },
    onTrigger2Click : function() {
		if (this.disabled) {
			return;
		}
		var oldValue = this.hiddenData;
		this.setValue("");
		this.hiddenData = null;
		if (this.outterEditor !== undefined && this.outterEditor != null) {
			this.outterEditor.completeEdit();
		}
	},
	onTrigger1Click : function() {
		if (this.disabled) {
			return;
		}
		var m_this = this;
		
		var itemFliter = {
		};
		
		var accwin = new gl.component.accountsel(itemFliter);
		accwin.on('selected', function(e) {
			if(e.intislastlevel == 0)
			{
				Ext.Msg.alert("提示","请选择末级科目!");
				return;
			}
			var account = {
				id : e.uqaccountid,
				text : '['+e.varaccountcode+']'+e.varaccountfullname
			};
			m_this.setValue(account);
			var oldValue = m_this.hiddenData;
			m_this.hiddenData = e;
			var newValue = m_this.hiddenData;
			if (m_this.outterEditor !== undefined
					&& m_this.outterEditor != null) {
				m_this.outterEditor.completeEdit();
			}
			m_this.fireEvent("afterset", oldValue, newValue);
			accwin.close();
			}, this);
		accwin.show();
	},
	getLoadAccountData : function(A,B)
	{
		this.getAccountData(B.data);
	},
	getAccountData : function (jsonData) {
		if(jsonData.intislastlevel == 0)
		{
			Ext.Msg.alert("提示","请选择末级科目!");
			return;
		}
		
		var contract = {
			id : jsonData.uqaccountid,
			text : '['+jsonData.varaccountcode+']'+jsonData.varaccountfullname
		};
		var oldValue = this.hiddenData;
		this.hiddenData = jsonData;
		var newValue = this.hiddenData;
		if(oldValue!=null && oldValue["column0"] != jsonData.uqaccountid)
		{
			this.setValue(contract);
		}
		if (this.outterEditor !== undefined
				&& this.outterEditor != null) {
			this.outterEditor.completeEdit();
		}
		this.fireEvent("afterset", oldValue, newValue);
	},
	/**
	 * 回车后把当前输入科目代码后台查询
	 * 并触发后续写入当前单元格的事件
	 */
	onSpecialKeyEvent : function(field, e)
	{
		var m_this = this;

		if (e.getKey() == Ext.EventObject.ENTER)
		{
			var accountcode = this.getRawValue();
			var param =
			{
				code : accountcode,
				isleaf : 1
			};

    		Ext.Ajax.request(
        	{
    			url : this.dataUrl,
    			method : "post",
    			params :
    			{
    				jsonFilter : Ext.encode(param),
    				start : 0,
    				limit : 8
    			},
    			success : function(response) 
    			{
    				var responseText = Ext.decode(response.responseText);
    				if (responseText.success) 
    				{		
    					if (responseText.data == undefined || typeof(responseText.data) != "object")
    					{
    						return;
    					}

    					if (Object.prototype.toString.call(responseText.data) !== '[object Array]')
						{
    						return;
						}

    					if (responseText.data.length <= 0)
    					{
    						return;
    					}
    					var accountdata = responseText.data[0];

						var account =
						{
							"id" : accountdata.uqaccountid,
							"text" : "[" + accountdata.varaccountcode + "]" + accountdata.varaccountfullname
						};

						m_this.fireEvent("inputend", m_this, account);
    				}
    			},
    			failure : function(response)
    			{
    			},
    			scope : this
    		});
       }
	}
});
Ext.reg("xychooseaccountex", gl.component.xychooseaccountex);
Ext.app.TreeLoader = Ext.extend(Ext.tree.TreeLoader, {
	typeCls : 'xy-class',
	// 重写TreeLoader的createNode方法，在创建node时，如果未报账类型，更改图标样式
	createNode : function(attr) {
		if (attr.typeid == attr.id) attr.iconCls = this.typeCls;
		return Ext.app.TreeLoader.superclass.createNode
				.call(this, attr);
	},
	initComponent : function() {
		Ext.app.TreeLoader.superclass.initComponent.call(this);
	}

});