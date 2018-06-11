Ext.namespace("Ext.app");
Ext.app.XyComboBoxEx = Ext.extend(Ext.form.ComboBox, {
	displayField :null,
	valueField :null,
	typeAhead: true,
	winHeight:300,
	selectOnFocus:true,
	loaded :false,
	mode :'remote',
	triggerAction:"all",
	validationEvent :false,
	validateOnBlur :false,
	trigger1Class :'x-form-arrow-trigger',
	trigger2Class :'x-form-clear-trigger',
	editable :false,
	dataUrl :null,
	param :null,
	scriptPath :null,
	sqlFile :null,
	outterEditor : null,
	initComponent : function() {
		Ext.app.XyComboBoxEx.superclass.initComponent.call(this);
		this.on('specialkey', function(f, e) {
			if (e.getKey() == e.ENTER) {
				this.onTrigger1Click();
			}
		}, this);
		this.triggerConfig = {
			tag :"span",
			cls :"x-form-twin-triggers",
			cn : [ {
				tag :"img",
				src :Ext.BLANK_IMAGE_URL,
				cls :"x-form-trigger " + this.trigger1Class
			}, {
				tag :"img",
				src :Ext.BLANK_IMAGE_URL,
				cls :"x-form-trigger " + this.trigger2Class
			} ]
		};
		this.init();
		this.tpl = '<tpl for="."><div ext:qtip="{'+this.displayField+'}" class="x-combo-list-item">{'+this.displayField+'}({'+this.valueField+'})</div></tpl>';
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
	getValue : function() {
		return this.value;
	},
	getTrigger : function(A) {
		return this.triggers[A]
	},
	initTrigger : function() {
		var A = this.trigger.select(".x-form-trigger", true);
		this.wrap.setStyle("overflow", "hidden");
		var B = this;
		A.each( function(D, F, C) {
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
				preventDefault :true
			});
			D.addClassOnOver("x-form-trigger-over");
			D.addClassOnClick("x-form-trigger-click")
		}, this);
		this.triggers = A.elements
	},
	onTrigger2Click : function() {
		if (this.disabled) {
			return;
		}
		var oldValue = this.getValue();
		this.setValue("");
		this.setRawValue("");
	},
	onTrigger1Click : function() {
		this.onTriggerClick();
	},
	onSelect : function(A, B) {
		if (this.fireEvent("beforeselect", this, A, B) !== false) {
			this.setValue(A.data);
			if ( this.outterEditor !== undefined && this.outterEditor != null)
			{
				this.outterEditor.completeEdit();
			}
			this.collapse();
			this.fireEvent("select", this, A, B)
		}
	},
	init : function() {
		var m_this = this;
		var url = this.dataUrl;
		if (url == null || url == "") {
			url = "wf/CommonComboxDataAction.action";
		}

		var m_loader = new Ext.data.JsonStore( {
			url :url,
			fields :this.fields,
			root :'data'
		});
		m_loader.on("beforeload", function(GridLoader, node) {
							GridLoader.baseParams.scriptPath = m_this.scriptPath;
							GridLoader.baseParams.sqlFile = m_this.sqlFile;
							if (m_this.param != null) {
								for ( var i = 0; i < m_this.param.length; i++) {
									GridLoader.baseParams[m_this.param[i].name] = m_this.param[i].value;
								}
							}
						});
		m_loader.on("loadexception", loadException);
		this.store = m_loader;
	},
	reload :function()
	{
		this.setValue("");
		this.setRawValue("");
		this.store.load();
	}
});

function loadException(This, node, response) {
	showExtLoadException(This, node, response);
}
Ext.reg("xycomboboxex", Ext.app.XyComboBoxEx);