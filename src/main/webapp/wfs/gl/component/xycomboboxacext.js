Ext.namespace('gl.component');
gl.component.xycomboboxacext = Ext.extend(Ext.form.ComboBox,
{
	typeAhead : true,
	allowBlur : true,
	outterEditor : null,
	validationEvent : false,
	validateOnBlur : false,
	trigger1Class : 'x-form-search-trigger',
	trigger2Class : 'x-form-clear-trigger',
    selectOnFocus : true,
    loaded : false,
    mode : 'remote',
    triggerAction : "all",
    editable : false,
    hiddenData : null,
    dataUrl : null,
    param : null,
    scriptPath : null,
    sqlFile : null,
    initComponent : function()
    {
        gl.component.xycomboboxacext.superclass.initComponent.call(this);
        this.triggerConfig =
        {
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
            }]
        };
        this.on('render', function(f)
                {
                    this.onFirstLoad();
                }, this);
        this.init();
        this.tpl = '<tpl for="."><div ext:qtip="{' + this.displayField
                + '}" class="x-combo-list-item">{' + this.displayField + '}({'
                + this.valueField + '})</div></tpl>';
        this.addListener("valuechange", this.call);
    },
    onFirstLoad : function()
    {
        if (this.hiddenData != null)
        {
            this.setValue(this.hiddenData[this.valueField]);
        }
    },
    getTrigger : function(A)
    {
        return this.triggers[A];
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
                        B.el.setWidth(G - B.trigger.getWidth());
                    };
                    D.show = function()
                    {
                        var G = B.wrap.getWidth();
                        this.dom.style.display = "";
                        B.el.setWidth(G - B.trigger.getWidth());
                    };
                    var E = "Trigger" + (C + 1);
                    if (this["hide" + E])
                    {
                        D.dom.style.display = "none";
                    }
                    D.on("click", this["on" + E + "Click"], this,
                            {
                                preventDefault : true
                            });
                    D.addClassOnOver("x-form-trigger-over");
                    D.addClassOnClick("x-form-trigger-click");
                }, this);
        this.triggers = A.elements;
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
	getXyValue : function() {
		if (this.hiddenData != null && this.hiddenData["id"] != null) {
			return this.hiddenData["id"];
		}
		return "";
	},
	setValue : function(A) {
		if (this.rendered) {
			var s_value = "";
			if (A === undefined || A === null || A === "") {
				s_value = "";
				this.value = null;
			} else {
				if (typeof A == "object") {
					this.value = A;
    				s_value = A[this.displayField];
				} 
				else if (typeof A == "string") {
					A = A;
					this.value = A;
    				s_value = A;
				}
				else {
					A = JSON.parse(A);
					this.value = A;
    				s_value = A[this.displayField];
				}
			}
			this.el.dom.value = s_value;
			this.validate();
		}
	},
	getValue : function() {
		return this.value;
	},
    onTrigger2Click : function()
    {
        if (this.disabled)
        {
            return;
        }
        var oldValue = this.hiddenData;
        this.setValue("");
        this.setRawValue("");
        this.hiddenData = null;
        if (oldValue !=null)
        {
            this.fireEvent("valuechange", oldValue, null);
        }
    },
    onTrigger1Click : function()
    {
    	if (this.disabled)
        {
            return;
        }
        this.onTriggerClick();
    },
    onSelect : function(A, B)
    {
        if (this.fireEvent("beforeselect", this, A, B) !== false)
        {
            this.setValue(A.json);
            this.setRawValue(A.json.text);

            var oldValue = this.hiddenData;
            var newValue = A.data;
            this.hiddenData = A.data;

            this.collapse();
            this.fireEvent("select", this, A, B);
        }
    },
    init : function()
    {
        var m_this = this;

        var url = this.dataUrl;
        if (url == null || url == "")
        {
            url = "wf/CommonComboxDataAction.action";
        }

        var m_loader = new Ext.data.JsonStore(
                {
                    url : url,
                    fields : this.fields,
                    root : 'data'
                });
        m_loader.on("beforeload", function(GridLoader, node)
                {
                    GridLoader.baseParams.scriptPath = m_this.scriptPath;
                    GridLoader.baseParams.sqlFile = m_this.sqlFile;
                    if (m_this.param != null)
                    {
                        for (var i = 0; i < m_this.param.length; i++)
                        {
                            GridLoader.baseParams[m_this.param[i].name] = m_this.param[i].value;
                        }
                    }
                });
        m_loader.on("loadexception", loadException);
        this.store = m_loader;
    },
    reload : function()
    {
        var oldValue = this.hiddenData;
        this.setValue("");
        this.setRawValue("");
        this.hiddenData = null;
        if (oldValue != null)
        {
            this.fireEvent("valuechange", oldValue, null);
        }
        this.store.load();
    },
    onSpecialKey : function(f, e)
    {
        if (e.getKey() == e.ENTER)
        {
            this.onTrigger1Click();
        }
    }
});

function loadException(This, node, response)
{
    showExtLoadException(This, node, response);
}

function selectSearch()
{
    reload();
}
Ext.reg("xycomboboxacext", gl.component.xycomboboxacext);
