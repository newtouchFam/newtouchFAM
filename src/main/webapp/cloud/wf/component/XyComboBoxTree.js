Ext.namespace("Ext.app");
Ext.app.XyComboBoxTree = Ext.extend(Ext.form.ComboBox, {
	divid : null,
	m_tree : null,
	leafSelect : true,
	call : Ext.emptyFn,
	winHeight : 300,
	loaded : false,
	readOnly : true,
	selectOnFocus : true,
	layout : "from",
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
	allExpand : false,
	scriptPath : null,
	sqlProcFile : "",
	firstSqlFile : null,
	otherSqlFile : null,
    XyCache :true,
	initComponent : function() {
		Ext.app.XyComboBoxTree.superclass.initComponent.call(this);
		this.on('specialkey', function(f, e) {
					if (e.getKey() == e.ENTER) {
						this.onTrigger1Click();
					}
				}, this);
		if (this.XyAllowDelete === false) {
			this.triggerConfig = {
				tag : "span",
				cls : "x-form-twin-triggers",
				cn : [{
							tag : "img",
							src : Ext.BLANK_IMAGE_URL,
							cls : "x-form-trigger " + this.trigger1Class
						}]
			};
		} else {
			this.triggerConfig = {
				tag : "span",
				cls : "x-form-twin-triggers",
				cn : [{
							tag : "img",
							src : Ext.BLANK_IMAGE_URL,
							cls : "x-form-trigger " + this.trigger1Class
						}, {
							tag : "img",
							src : Ext.BLANK_IMAGE_URL,
							cls : "x-form-trigger " + this.trigger2Class
						}]
			};
		}
		this.divid = Ext.id();
		this.tpl = "<div id='" + this.divid + "' style='height:"
				+ this.winHeight + "px;scorll:auto;'></div>";
		this.on('render', function(f) {
					this.onLoad();
				}, this);
		this.on("expand", function(f) {
					this.onExpand();
				}, this);
		this.addListener("valuechange", this.call);
	},
	getTrigger : function(A) {
		return this.triggers[A]
	},
	initTrigger : function() {
		var A = this.trigger.select(".x-form-trigger", true);
		this.wrap.setStyle("overflow", "hidden");
		var B = this;
		A.each(function(D, F, C) {
					D.hide = function() {
						var G = B.wrap.getWidth();
						this.dom.style.display = "none";
						B.el.setWidth(G - B.trigger.getWidth())
					};
					D.show = function() {
						var G = B.wrap.getWidth();
						this.dom.style.display = "";
						B.el.setWidth(G - B.trigger.getWidth())
					};
					var E = "Trigger" + (C + 1);
					if (this["hide" + E]) {
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
	store : new top.Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			}),
	onLoad : function() {
		if (this.hiddenData != null) {
			this.setValue(this.hiddenData.text);
		}
	},
	onExpand : function() {
		if (this.m_tree != null) {
			if (this.loaded && this.XyCache) {
				return;
			} else {
				this.m_tree.loader.load(this.m_tree.root);
				this.m_tree.root.expand(this.allExpand);
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
		m_loader.on("beforeload", function(treeLoader, node) {
			treeLoader.baseParams.scriptPath = m_this.scriptPath;
			if ( m_this.sqlProcFile == '' )
			{
				treeLoader.baseParams.firstSqlFile = m_this.firstSqlFile;
				treeLoader.baseParams.otherSqlFile = m_this.otherSqlFile;
			}
			else
			{
				treeLoader.baseParams.sqlProcFile = m_this.sqlProcFile;
			}
			if (m_this.param != null) {
				for (var i = 0; i < m_this.param.length; i++) {
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
		root.expand(this.allExpand);
		this.m_tree.render(this.divid);
		this.loaded = true;
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
					m_this.collapse();
					var oldValue = m_this.hiddenData;
					m_this.setValue(node.text);
					m_this.hiddenData = node;
					if (oldValue == null || oldValue.id != node.id) {
						m_this.fireEvent("valuechange", oldValue, node);
					}
				});
	},
	getXyValue : function() {
		if (this.hiddenData != null && this.hiddenData["id"] != null) {
			return this.hiddenData["id"];
		}
		return "";
	},
	getDisplayValue : function() {
		if (this.hiddenData != null && this.hiddenData["text"] != null) {
			return this.hiddenData["text"];
		}
		return "";
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
			this.setValue(this.hiddenData.text);
		}
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
Ext.reg('xycomboboxtree', Ext.app.XyComboBoxTree);