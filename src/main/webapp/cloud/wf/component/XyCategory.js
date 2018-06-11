Ext.namespace("Ext.app");
Ext.app.XyCategory = Ext.extend(Ext.form.TwinTriggerField, {
	call :Ext.emptyFn,
	complex : true,
	hiddenData :null,
	initComponent : function() {
		Ext.app.XyCategory.superclass.initComponent.call(this);
		this.on('specialkey', function(f, e) {
			if (e.getKey() == e.ENTER) {
				this.onTrigger1Click();
			}
		}, this);
		this.on('render', function(f) {
			this.onLoad();
		}, this);
		this.blankText = this.rootTitle;
		this.emptyText = this.rootTitle;
		this.addListener("valuechange", this.call);
	},
	validationEvent :false,
	validateOnBlur :false,
	trigger1Class :'x-form-search-trigger',
	trigger2Class :'x-form-clear-trigger',
	readOnly :true,
	allExpand : false,
	leafSelect :true,
	winWidth :350,
	winHeight :500,
	setXyValue : function(A){
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
	getXyValue : function() {
		if ( this.hiddenData != null && this.hiddenData["id"] != null )
		{
			return this.hiddenData["id"];
		}
		return "";
	},
	onLoad : function() {
		if (this.hiddenData != null) {
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
		if ( oldValue != null )
		{
			this.fireEvent("valuechange", oldValue, null);
		}
	},
	onTrigger1Click : function() {
		if (this.disabled) {
			return;
		}
		var m_this = this;
		var root = new Ext.tree.AsyncTreeNode( {
			id :"root",
			text :"请选择" + this.xyTypeName
		});
		var m_loader = new Ext.tree.TreeLoader( {
			dataUrl : "wf/CategoryAction.action?xyTypeCode=" + this.xyTypeCode
		});
		m_loader.on("loadexception", loadException);
		var m_tree = new Ext.tree.TreePanel( {
			root :root,
			loader :m_loader,
			height :this.winHeight,
			animate :true,
			enableDD :false,
			border :false,
			rootVisible :true
		});
		var m_window = new Ext.Window( {
			title :"请选择" + this.xyTypeName,
			modal :true,
			width :this.winWidth,
			height :this.winHeight,
			closeAction :'close',
			resizable :false,
			layout: "fit",
			items : [ m_tree ],
			buttons : [ {
				text :'确定',
				handler :submitCall
			}, {
				text :'取消',
				handler :closeCall
			} ]
		});
		root.expand(this.allExpand);
		m_window.show();
		m_tree.on("dblclick", tree_click);

		function submitCall() {
			var node = m_tree.getSelectionModel().getSelectedNode();
			if (node == null || node.id == 'root') {
				Ext.MessageBox.alert("警告", "不能选择根节点，请重新选择!");
				return;
			}
			if (m_this.leafSelect && !node.leaf) {
				return;
			}

			var oldValue = m_this.hiddenData;
			m_this.hiddenData = node;
			var newValue = m_this.hiddenData;
			m_this.setValue(node.text);
			m_loader.un("loadexception", loadException);
			m_window.close();
			if ( oldValue == null || oldValue.id != newValue.id )
			{
				m_this.fireEvent("valuechange", oldValue, newValue);
			}
		}

		function closeCall() {
			m_loader.un("loadexception", loadException);
			m_window.close();
		}

		function tree_click(node) {
			if (node.id == 'root') {
				return;
			}
			submitCall();
		}
	}
});

function loadException(This, node, response) {
	showExtLoadException(This, node, response);
}
Ext.reg("xycategory", Ext.app.XyCategory);