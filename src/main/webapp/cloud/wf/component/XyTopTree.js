top.Ext.app.XyTree = Ext.extend(top.Ext.form.TwinTriggerField, {
	call : top.Ext.emptyFn,
	initComponent : function() {
		top.Ext.app.XyTree.superclass.initComponent.call(this);
		this.on('specialkey', function(f, e) {
					if (e.getKey() == e.ENTER) {
						this.onTrigger1Click();
					}
				}, this);
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
	dataUrl : null,
	param : null,
	winWidth : 350,
	winHeight : 500,
	scriptPath : null,
	firstSqlFile : null,
	otherSqlFile : null,
	onLoad : function() {
		if (this.hiddenData != null) {
			this.setValue(this.hiddenData);
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
	getXyValue : function() {
		if (this.hiddenData != null && this.hiddenData["id"] != null) {
			return this.hiddenData["id"];
		}
		return "";
	},
	onTrigger2Click : function() {
		if (this.disabled) {
			return;
		}
		var oldValue = this.hiddenData;
		this.setValue("");
		this.hiddenData = null;
		if (oldValue != null) {
			this.fireEvent("valuechange", oldValue, null);
		}
	},
	onTrigger1Click : function() {
		if (this.disabled) {
			return;
		}
		if (this.m_window != null) {
			if (this.loaded) {
				this.m_window.show();
				return;
			} else {
				this.m_tree.loader.load(this.m_tree.root);
				this.m_window.show();
				this.m_tree.root.expand();
				this.loaded = true;
				return;
			}
		}
		var m_this = this;
		var root = new top.Ext.tree.AsyncTreeNode({
					id : "root",
					text : this.rootTitle
				});

		var url = this.dataUrl;
		if (url == null || url == "") {
			url = "wf/CommonTreeDataAction.action";// 为空的话调用默认action地址,否则调用用户传入的地址
		}

		var m_loader = new top.Ext.tree.TreeLoader({
					dataUrl : url
				});
		m_loader.on("beforeload", function(treeLoader, node) {
			treeLoader.baseParams.scriptPath = m_this.scriptPath;
			treeLoader.baseParams.firstSqlFile = m_this.firstSqlFile;
			treeLoader.baseParams.otherSqlFile = m_this.otherSqlFile;
			if (m_this.param != null) {
				for (var i = 0; i < m_this.param.length; i++) {
					treeLoader.baseParams[m_this.param[i].name] = m_this.param[i].value;
				}
			}
		});
		m_loader.on("loadexception", this.loadException);

		
		this.m_tree = new top.Ext.tree.TreePanel({
					root : root,
					loader : m_loader,
					height : this.winHeight-100,
					animate : true,
					enableDD : false,
					border : false,
					rootVisible : true,
					autoScroll : true
				});

		this.m_window = new top.Ext.Window({
					title : this.rootTitle,
					modal : true,
					width : this.winWidth,
					height : this.winHeight,
					closeAction : 'hide',
					layout : "fit",
					resizable : false,
					items : [this.m_tree],
					buttons : [{
								text : '确定',
								handler : submitCall
							}, {
								text : '取消',
								handler : closeCall
							}]
				});
		this.m_window.show();
		root.expand();
		this.loaded = true;
		this.m_tree.on("dblclick", tree_click);

		function submitCall() {
			var node = m_this.m_tree.getSelectionModel().getSelectedNode();
			if (node == null || node.id == 'root') {
				top.Ext.MessageBox.alert("警告", "不能选择根节点，请重新选择!");
				return;
			}
			if (m_this.leafSelect && !node.leaf) {
				return;
			}

			var oldValue = m_this.hiddenData;
			m_this.hiddenData = node;
			var newValue = m_this.hiddenData;
			m_this.setValue(node);
			m_loader.un("loadexception", m_this.loadException);
			m_this.m_window.hide();
			if (oldValue == null || oldValue.id != newValue.id) {
				m_this.fireEvent("valuechange", oldValue, newValue);
			}
		}

		function closeCall() {
			m_loader.un("loadexception", m_this.loadException);
			m_this.m_window.hide();
		}

		function tree_click(node) {
			if (node.id == 'root') {
				return;
			}
			submitCall();
		}
	}
});
