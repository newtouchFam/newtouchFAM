Ext.app.ContractExecQuery = Ext.extend(Ext.form.TriggerField, {
	call : Ext.emptyFn,
	hiddenData : null,
	displayField : 'text',
	valueField : 'id',
	allowBlur : true,
	outterEditor : null,
	validationEvent : false,
	validateOnBlur : false,
	contractno : null,
	trigger1Class : 'x-form-search-trigger',
	trigger2Class : 'x-form-clear-trigger',
	readOnly : true,
	leafSelect : true,
	Width : 550,
	Height : 500,
	initComponent : function() {
		Ext.app.ContractExecQuery.superclass.initComponent.call(this);
		this.on('specialkey', function(f, e)
		{
			if (e.getKey() == e.ENTER) {
				this.onTrigger1Click();
			}
		}, this);
		this.on('render', function(f) {
			this.onLoad();
		}, this);
		this.triggerConfig =
		{
			tag : "span",
			cls : "x-form-twin-triggers",
			cn : [{
						tag : "img",
						src : Ext.BLANK_IMAGE_URL,
						cls : "x-form-trigger " + this.trigger1Class
					}]
		}
		this.blankText = this.rootTitle;
		this.emptyText = this.rootTitle;
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
				B.el.setWidth(G - B.trigger.getWidth())
			};
			D.show = function()
			{
				var G = B.wrap.getWidth();
				this.dom.style.display = "";
				B.el.setWidth(G - B.trigger.getWidth())
			};
			var E = "Trigger" + (C + 1);
			if (this["hide" + E])
			{
				D.dom.style.display = "none"
			}
			D.on("click", this["on" + E + "Click"], this,
			{
				preventDefault : true
			});
			D.addClassOnOver("x-form-trigger-over");
			D.addClassOnClick("x-form-trigger-click")
		}, this);
		this.triggers = A.elements
	},
	onLoad : function() {
		if (this.hiddenData != null) {
			this.setValue(A[this.displayField]);
		}
	},
	setXyValue : function(A)
	{
		if (A === undefined || A === null || A === "")
		{
			this.hiddenData = null;
			this.setValue("");
		}
		else
		{
			if (typeof A == "object")
			{
			}
			else
			{
				A = JSON.parse(A);
			}
			this.hiddenData = A;
			this.setValue(this.hiddenData.text);
		}
	},
	getXyValue : function()
	{
		if (this.hiddenData != null && this.hiddenData["id"] != null) 
		{
			return this.hiddenData["id"];
		}
		return "";
	},
	setValue : function(A)
	{
		if (this.rendered)
		{
			var s_value = "";
			if (A === undefined || A === null || A === "")
			{
				s_value = "";
				this.value = null;
			}
			else
			{
				if (typeof A == "object")
				{
				}
				else
				{
					A = JSON.parse(A);
				}
				this.value = A;
				s_value = A[this.displayField];
			}
			this.el.dom.value = s_value;
			this.validate();
		}
	},
	getValue : function()
	{
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
		this.hiddenData = null;
		if (this.outterEditor !== undefined && this.outterEditor != null)
		{
			this.outterEditor.completeEdit();
		}
	},
	onTrigger1Click : function()
	{
		if (this.disabled)
		{
			return;
		}
		var m_this = this;
		if(this.contractno == null || this.contractno == "")
		{
			Ext.MessageBox.alert("提示", "没有可供显示的合同");
			return;
		}
		
		var itemFliter =
		{
			m_ContractId : this.contractno
		};
		var contractwin = new ssc.component.ContractExecQueryDialog(itemFliter);
		contractwin.show();
	}
});
Ext.reg("contractexecquery", Ext.app.ContractExecQuery);
function loadexception(This, node, response, error)
{
	showExtLoadException(This, node, response, error);
}
Ext.app.TreeLoader = Ext.extend(Ext.tree.TreeLoader,
{
	typeCls : 'xy-class',
	// 重写TreeLoader的createNode方法，在创建node时，如果未报账类型，更改图标样式
	createNode : function(attr)
	{
		if (attr.typeid == attr.id) attr.iconCls = this.typeCls;
		return Ext.app.TreeLoader.superclass.createNode
				.call(this, attr);
	},
	initComponent : function()
	{
		Ext.app.TreeLoader.superclass.initComponent.call(this);
	}
});