Ext.namespace("Ext.app");
Ext.app.XyGridEx = Ext.extend(Ext.form.TwinTriggerField, {
	call : Ext.emptyFn,
	m_window : null,
	shadow : "sides",
	allowBlur : true,
	displayField : 'column0',
	valueField : null,
	outterEditor : null,
	validationEvent : false,
	validateOnBlur : false,
	editable : false,
	readOnly : true,
	trigger1Class : 'x-form-search-trigger',
	trigger2Class : 'x-form-clear-trigger',
	rootTitle : '请选择',
	dataUrl : null,
	winWidth : 600,
	winHeight : 400,
	param : null,
	columnModel : null,
	scriptPath : null,
	sqlFile : null,
	sqlProcFile : "",
	returnFields : "",
	initComponent : function() {
		Ext.app.XyGridEx.superclass.initComponent.call(this);
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
	},
	setXyValue : function(A) {
		if (A === undefined || A === null || A === "") {
			s_value = "";
			this.value = null;
		} else {
			if (typeof A == "object") {
			} else {
				A = JSON.parse(A);
			}
			this.value = A;
			s_value = A[this.displayField];
		}
		this.el.dom.value = s_value;
	},
	setValue : function(A) {
		if (this.rendered) {
			var s_value = "";
			if (A === undefined || A === null || A === "") {
				s_value = "";
				this.value = null;
			} else {
				if (typeof A == "object") {
				} else {
					A = JSON.parse(A);
				}
				this.value = A;
				s_value = A[this.displayField];
			}
			this.el.dom.value = s_value;
			this.validate();
		}
	},
	onRender : function(B, A) {
		Ext.app.XyGridEx.superclass.onRender.call(this, B, A);
		if (this.disabled) {
			this.el.dom.disabled = true;
			this.getActionEl().addClass(this.disabledClass);
		}
	},
	getValue : function() {
		return this.value;
	},
	getXyValue : function() {
		return this.getValue();
	},
	onTrigger2Click : function() {
		if (this.disabled) {
			return;
		}
		this.setValue(null);
		if (this.outterEditor !== undefined && this.outterEditor != null) {
			this.outterEditor.completeEdit();
		}
		this.fireEvent("afterset");
	},
	onTrigger1Click : function() {
		if (this.disabled) {
			return;
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
		var ds = new Ext.data.SimpleStore({
					fields : ['text', 'id'],
					data : searchArr
				});
		var m_comb = new Ext.form.ComboBox({
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

		var m_loader = new Ext.data.JsonStore({
					url : url,
					root : 'data',
					totalProperty : "totalcount",
					fields : dataIndexArr
				});
		m_loader.on("beforeload", function(GridLoader, node) {
			GridLoader.baseParams.scriptPath = m_this.scriptPath;
			if ( m_this.sqlProcFile == '' )
			{
				GridLoader.baseParams.sqlFile = m_this.sqlFile;
			}
			else
			{
				GridLoader.baseParams.sqlProcFile = m_this.sqlProcFile;
			}
			GridLoader.baseParams.totalCount = m_loader.getTotalCount();
			if (m_this.param != null) {
				for (var i = 0; i < m_this.param.length; i++) {
					GridLoader.baseParams[m_this.param[i].name] = m_this.param[i].value;
				}
			}
		});
		m_loader.on("loadexception", showExtLoadException);

		var barPage = new Ext.PagingToolbar({
					border : true,
					pageSize : WINDOW_PER_PAGE_SIZE,
					store : m_loader,
					displayInfo : true,
					displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
					emptyMsg : "没有记录"
				});

		var m_btnSearch = new Ext.app.SearchField({
			width : 140,
			readOnly : false,
			onTrigger2Click : function() {
				m_btnSearch.el.dom.value = '';
			},
			onTrigger1Click : function() {
				m_loader.totalLength = 0;
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

				m_loader.baseParams.searchField = searchField;
				m_loader.baseParams.searchValue = searchValue;

				m_loader.baseParams.scriptPath = m_this.scriptPath;
				m_loader.baseParams.sqlFile = m_this.sqlFile;
				m_loader.baseParams.totalCount = m_loader.getTotalCount();
				if (m_this.param != null) {
					for (var i = 0; i < m_this.param.length; i++) {
						m_loader.baseParams[m_this.param[i].name] = m_this.param[i].value;
					}
				}
				m_loader.load({
							params : {
								start : 0,
								limit : WINDOW_PER_PAGE_SIZE
							}
						});
			}
		});

		var tbar = ['搜索: ', ' ', m_comb, ' ', m_btnSearch];

		var m_Grid = new Ext.grid.GridPanel({
					store : m_loader,
					border : false,
					colModel : this.columnModel,
					enableColumnMove : false,
					enableHdMenu : false,
					height : this.winHeight - 70,
					selModel : new Ext.grid.RowSelectionModel({
								singleSelect : true
							}),
					iconCls : 'icon-grid',
					loadMask : {
						msg : "数据加载中，请稍等..."
					},
					tbar : tbar,
					bbar : barPage
				});
//		if (!this.m_window) {
			this.m_window = new Ext.Window({
						title : this.rootTitle,
						modal : true,
						width : this.winWidth,
						maximizable : true,
						autoScroll : true,
						layout : 'fit',
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
//		}
		this.outterEditor.el.hide();
		this.m_window.show();

		var m_params = {
			start : 0,
			limit : WINDOW_PER_PAGE_SIZE,
			totalCount : -1
		};
		m_loader.load({
					params : m_params
				});

		m_Grid.on("dblclick", submitCall);

		function submitCall() {
			var rc = m_Grid.getSelectionModel().getSelected();
			if (rc == null) {
				Ext.MessageBox.alert("警告", "您还没有选择任何记录!");
				return;
			}
			m_this.setValue(rc.data);
			m_loader.un("loadexception", showExtLoadException);
			m_this.m_window.hide();
			if (m_this.outterEditor !== undefined
					&& m_this.outterEditor != null) {
				m_this.outterEditor.completeEdit();
			}
			m_this.fireEvent("afterset");
		}

		function closeCall() {
			m_loader.un("loadexception", showExtLoadException);
			m_this.m_window.hide();
		}
	}
});
Ext.reg('xygridex', Ext.app.XyGridEx);