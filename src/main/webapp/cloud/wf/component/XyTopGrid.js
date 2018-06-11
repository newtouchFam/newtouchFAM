top.Ext.app.XyGrid = Ext.extend(top.Ext.form.TwinTriggerField, {
	call : top.Ext.emptyFn,
	initComponent : function() {
		top.Ext.app.XyGrid.superclass.initComponent.call(this);
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
	m_window : null,
	m_loader : null,
	loaded : false,
	validationEvent : false,
	validateOnBlur : false,
	trigger1Class : 'x-form-search-trigger',
	trigger2Class : 'x-form-clear-trigger',
	readOnly : true,
	loaded : false,
	rootTitle : '请选择',
	hiddenData : null,
	dataUrl : null,
	displayField : 'column0',
	winWidth : 600,
	winHeight : 400,
	valueField : null,
	param : null,
	columnModel : null,
	scriptPath : null,
	sqlFile : null,
	reload : function() {
		this.loaded = false;
	},
	onLoad : function() {
		if (this.hiddenData != null) {
			this.setValue(this.hiddenData[this.displayField]);
		}
	},
	loadException : function(This, node, response) {
		showExtLoadException(This, node, response);
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
	getXyValue : function() {
		if (this.hiddenData != null && this.hiddenData[this.valueField] != null) {
			return this.hiddenData[this.valueField];
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
			this.setValue(this.hiddenData[this.displayField]);
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
				this.m_loader.load({
							params : {
								start : 0,
								limit : WINDOW_PER_PAGE_SIZE,
								totalCount : -1
							}
						});
				this.m_window.show();
				this.loaded = true;
				return;
			}
		}
		var m_this = this;

		var url = this.dataUrl;
		if (url == null || url == "") {
			url = "wf/CommonGridDataAction.action";
		}

		var dataIndexArr = new Array();
		var searchArr = new Array();
		var j = 0;
		var k = 0;
		for (var i = 0; i < this.columnModel.getColumnCount(); i++) {
			if (typeof(this.columnModel.config[i].searchField) == 'undefined'
					|| this.columnModel.config[i].searchField == '') {
			} else {
				searchArr[k] = [
						"按 " + this.columnModel.config[i].header + " 搜索",
						this.columnModel.config[i].searchField];
				k++;
			}
			if (typeof(this.columnModel.getDataIndex(i)) == 'undefined'
					|| this.columnModel.getDataIndex(i) == '') {
			} else {
				dataIndexArr[j] = this.columnModel.getDataIndex(i);
				j++;
			}
		}
		var ds = new top.Ext.data.SimpleStore({
					fields : ['text', 'id'],
					data : searchArr
				});
		var m_comb = new top.Ext.form.ComboBox({
					store : ds,
					displayField : 'text',
					valueField : "id",
					typeAhead : true,
					mode : 'local',
					triggerAction : 'all',
					selectOnFocus : true,
					width : 140,
					readOnly : true
				});

		this.m_loader = new top.Ext.data.JsonStore({
					url : url,
					root : 'data',
					totalProperty : "totalcount",
					fields : dataIndexArr
				});
		this.m_loader.on("beforeload", function(GridLoader, node) {
			GridLoader.baseParams.scriptPath = m_this.scriptPath;
			GridLoader.baseParams.sqlFile = m_this.sqlFile;
			if (m_this.param != null) {
				for (var i = 0; i < m_this.param.length; i++) {
					GridLoader.baseParams[m_this.param[i].name] = m_this.param[i].value;
				}
			}
		});
		this.m_loader.on("loadexception", this.loadException);

		var barPage = new top.Ext.PagingToolbar({
					border : true,
					pageSize : WINDOW_PER_PAGE_SIZE,
					store : this.m_loader,
					displayInfo : true,
					displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
					emptyMsg : "没有记录"
				});

		var m_btnSearch = new top.Ext.app.SearchField({
			width : 140,
			readOnly : false,
			onTrigger2Click : function() {
				m_btnSearch.el.dom.value = '';
			},
			onTrigger1Click : function() {
				m_this.m_loader.totalLength = 0;
				var selectValue = m_comb.getValue();
				var searchField = selectValue.trim();
				var searchValue = m_btnSearch.el.dom.value.trim();
				if (selectValue == null || selectValue == "") {
					searchField = "";
					searchValue = "";
				}
				if (m_btnSearch.el.dom.value == null
						|| m_btnSearch.el.dom.value.trim() == "") {
					searchField = "";
					searchValue = "";
				}

				m_this.m_loader.baseParams.searchField = searchField;
				m_this.m_loader.baseParams.searchValue = searchValue;

				m_this.m_loader.baseParams.scriptPath = m_this.scriptPath;
				m_this.m_loader.baseParams.sqlFile = m_this.sqlFile;
				m_this.m_loader.baseParams.totalCount = m_this.m_loader
						.getTotalCount();
				if (m_this.param != null) {
					for (var i = 0; i < m_this.param.length; i++) {
						m_this.m_loader.baseParams[m_this.param[i].name] = m_this.param[i].value;
					}
				}
				m_this.m_loader.load({
							params : {
								start : 0,
								limit : WINDOW_PER_PAGE_SIZE
							}
						});
			}
		});

		var tbar = ['搜索: ', ' ', m_comb, ' ', m_btnSearch];

		var m_Grid = new top.Ext.grid.GridPanel({
					store : this.m_loader,
					border : false,
					colModel : this.columnModel,
					enableColumnMove : false,
					enableHdMenu : false,
					height : this.winHeight - 70,
					selModel : new top.Ext.grid.RowSelectionModel({
								singleSelect : true
							}),
					iconCls : 'icon-grid',
					loadMask : {
						msg : "数据加载中，请稍等..."
					},
					tbar : tbar,
					bbar : barPage
				});

		this.m_window = new top.Ext.Window({
					title : this.rootTitle,
					modal : true,
					width : this.winWidth,
					height : this.winHeight,
					closeAction : 'hide',
					resizable : false,
					items : [m_Grid],
					buttons : [{
								text : '确定',
								handler : submitCall
							}, {
								text : '取消',
								handler : closeCall
							}]
				});
		this.m_window.show();

		var m_params = {
			start : 0,
			limit : WINDOW_PER_PAGE_SIZE,
			totalCount : -1
		};
		this.m_loader.load({
					params : m_params
				});
		this.loaded = true;
		m_Grid.on("dblclick", submitCall);

		function submitCall() {
			var rc = m_Grid.getSelectionModel().getSelected();
			if (rc == null) {
				top.Ext.MessageBox.alert("警告", "您还没有选择任何记录!");
				return;
			}

			var oldValue = m_this.hiddenData;
			m_this.hiddenData = rc.data;
			var newValue = m_this.hiddenData;
			m_this.setValue(rc.get(m_this.displayField));
			m_this.m_loader.un("loadexception", m_this.loadException);
			m_this.m_window.hide();
			if (oldValue == null
					|| oldValue[m_this.valueField] != newValue[m_this.valueField]) {
				m_this.fireEvent("valuechange", oldValue, newValue);
			}
		}

		function closeCall() {
			m_this.m_loader.un("loadexception", m_this.loadException);
			m_this.m_window.hide();
		}
	}
});

