 Ext.override(top.Ext.menu.DateMenu, {
    autoWidth: function() {
		var el = this.el, ul = this.ul;
		if (!el) {
			return;
		}

		var w = this.width;
		if (w) {
			el.setWidth(w);
		 } else if (Ext.isIE && !Ext.isIE6 && !Ext.isIE7) {
			el.setWidth(this.minWidth);
			var t = el.dom.offsetWidth; // force recalc
			el.setWidth(ul.getWidth() + el.getFrameWidth("lr"));
		 }
     }
 });

