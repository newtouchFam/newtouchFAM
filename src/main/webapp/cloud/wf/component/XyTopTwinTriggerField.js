top.Ext.form.XyTopTwinTriggerField = Ext.extend(top.Ext.form.TriggerField, {
			initComponent : function() {
				top.Ext.form.XyTopTwinTriggerField.superclass.initComponent
						.call(this);
				this.triggerConfig = {
					tag : "span",
					cls : "x-form-twin-triggers",
					cn : [{
								tag : "img",
								src : top.Ext.BLANK_IMAGE_URL,
								cls : "x-form-trigger " + this.trigger1Class
							}, {
								tag : "img",
								src : top.Ext.BLANK_IMAGE_URL,
								cls : "x-form-trigger " + this.trigger2Class
							}]
				}
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
			trigger1Class : 'x-form-search-trigger',
			trigger2Class : 'x-form-clear-trigger',
			onTrigger1Click : top.Ext.emptyFn,
			onTrigger2Click : top.Ext.emptyFn
		});