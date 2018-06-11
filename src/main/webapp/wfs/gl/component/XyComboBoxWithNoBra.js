Ext.namespace("Ext.app");
Ext.app.XyComboBoxWithNoBra = Ext.extend(Ext.app.XyComboBox, {
		initComponent : function() {
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
		}
		else
		{
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
		
		this.on('render', function(f) {
				this.onFirstLoad();
			}, this);
		this.init();
		Ext.app.XyComboBox.superclass.initComponent.call(this);
			this.tpl = '<tpl for="."><div ext:qtip="{' + this.displayField
					+ '}" class="x-combo-list-item">{' + this.displayField + '}</div></tpl>';
			this.addListener("valuechange", this.call);
		}
	});
function loadException(This, node, response) {
	showExtLoadException(This, node, response);
}

function selectSearch() {
	reload();
}
Ext.reg("xycombobox", Ext.app.XyComboBoxWithNoBra);
