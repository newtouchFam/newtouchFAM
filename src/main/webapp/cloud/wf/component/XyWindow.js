Ext.XyWindow = Ext.extend(Ext.Window, {
			initComponent : function() {
				Ext.XyWindow.superclass.initComponent.call(this);
				this.addEvents("resize", "maximize", "minimize", "restore")
			},
			closeEx : function(fireEvents) {
				if (fireEvents) {
					this.close();
				} else {
					this.hide(null, function() {
								this.fireEvent("close", this);
								this.destroy()
							}, this);
				}
			}
		});