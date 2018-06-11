Ext.app.XyComboBoxAc = Ext.extend(Ext.app.XyComboBoxAcExt,
        {
            valueField : 'code',
            displayField : 'name',
            dataFields : ['code', 'name'], // 数据的fields属性Trigger1
            jsonFilter : null,
            dir : '',
            dataUrl : null, // 数据的url地址
            fieldLabel : 'XXX',
            minChars : 1, // 指定触发自动完成的最小输入字数。大于等于这个值时会向远程服务器提交请求
            minListWidth : 200,// 设置下拉列表的宽度，如果不指定分页工具栏可能会显示不全
            mode : 'remote',// 指定数据加载方式，如果直接从客户端加载则为local，如果从服务器断加载则为remote.默认值为：remote
            pageSize : 6, // 分页最大数量
            // 当元素加载的时候，如果返回的数据为多页，则会在下拉列表框下面显示一个分页工具栏，该属性指定每页的大小
            // 在点击分页导航按钮时，将会作为start及limit参数传递给服务端，默认值为0，只有在mode='remote'的时候才能够使用

            initComponent : function()
            {
                this.trigger1Class = 'x-form-search-trigger';
                Ext.app.XyComboBoxAc.superclass.initComponent.call(this);

                this.store = new Ext.data.JsonStore(
                        {
                            url : this.dataUrl,
                            totalProperty : "total",
                            root : "data",
                            fields : this.dataFields
                        });
                this.store.on("loadexception", com.freesky.em8.gl.common.dataStoreLoadException);
                this.store.on('beforeload', this.beforeLoadHandler.createDelegate(this));
                this.store.on('load', this.loadHandler.createDelegate(this));

                this.tpl = new Ext.XTemplate(
                        '<tpl for="."><div class="search-item x-combo-list-item">',
                        '<div ext:qtip="{value}"  style="border:0 none">{' + this.displayField
                                + '}</div>', '</div></tpl>');

                Ext.apply(this,
                        {
                            editable : true,
                            typeAhead : false,// 这个如果设置成true，自动完成的功能就有点变扭了，因为这个是combobox的自动填充配置项
                            triggerAction : 'all',
                            selectOnFocus : true,
                            itemSelector : 'div.search-item'// 如果不加这个，下拉框中的选项不能选择
                        });
                this.addListener("beforeload", Ext.emptyFn)
            },
            initEvents : function()
            {
                Ext.form.ComboBox.superclass.initEvents.call(this);
                this.keyNav = new Ext.KeyNav(this.el,
                        {
                            "up" : function(A)
                            {
                                this.inKeyMode = true;
                                this.selectPrev()
                            },
                            "down" : function(A)
                            {
                                if (!this.isExpanded())
                                {
                                    this.onTriggerClick()
                                }
                                else
                                {
                                    this.inKeyMode = true;
                                    this.selectNext()
                                }
                            },
                            "enter" : function(A)
                            {
                                this.onViewClick(false);
                                return true
                            },
                            "esc" : function(A)
                            {
                                this.collapse()
                            },
                            "tab" : function(A)
                            {
                                this.onViewClick(false);
                                return true
                            },
                            scope : this,
                            doRelay : function(C, B, A)
                            {
                                if (A == "down" || this.scope.isExpanded())
                                {
                                    return Ext.KeyNav.prototype.doRelay.apply(this, arguments)
                                }
                                return true
                            },
                            forceKeyDown : true
                        });
                this.queryDelay = Math.max(this.queryDelay || 10, this.mode == "local" ? 10 : 250);
                this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
                if (this.typeAhead)
                {
                    this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this)
                }
                if (this.editable !== false)
                {
                    this.el.on("keyup", this.onKeyUp, this)
                }
                if (this.forceSelection)
                {
                    this.on("blur", this.doForce, this)
                }
            },
            beforeLoadHandler : function(store, options)
            {
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
            }
        });
Ext.reg("xycomboboxac", Ext.app.XyComboBoxAc);