/*add by menghuan 2010-02-10 for disabled style*/	
Ext.override(Ext.form.TriggerField, {
    afterRender: function() {
        Ext.form.TriggerField.superclass.afterRender.call(this);
        
        var ua = navigator.userAgent.toLowerCase();
        var isOpera = ua.indexOf("opera") > -1;
        var isIE8 = !isOpera && ua.indexOf("msie 8") > -1;
        if (isIE8 && !this.hideTrigger) {
            this.el.position();  
            this.el.applyStyles("top: 1px;");
        } 
    }
});
Ext.override(Ext.form.TextField, {
	onDisable : function()
    {
    	Ext.form.TextField.superclass.onDisable.call(this);
	    if(this.el)
	    {
	        this.el.dom.readOnly = true;
	        this.el.dom.disabled = false;
	        
	        this.el.addClass('x-item-readonly');
	    }
    }
});
Ext.override(Ext.form.TextField, {
	onEnable : function()
    {
    	Ext.form.TextField.superclass.onEnable.call(this);
	    if(this.el)
	    {
	        this.el.dom.readOnly = false;
	        this.el.dom.disabled = false;
	        this.el.removeClass('x-item-readonly');
	    }
    }
});
Ext.override(Ext.form.TriggerField, {
	onEnable : function()
    {
    	Ext.form.TriggerField.superclass.onDisable.call(this);
	    if(this.wrap)
	    {
	        this.el.dom.readOnly = false;
	        this.el.dom.disabled = false;
	        this.el.removeClass('x-item-readonly');
	    }
    }
});
Ext.override(Ext.form.TriggerField, {
	onDisable : function()
    {
    	Ext.form.TriggerField.superclass.onDisable.call(this);
	    if(this.wrap)
	    {
	        this.el.dom.readOnly = true;
	        this.el.dom.disabled = false;
	        
	        this.el.addClass('x-item-readonly');
	    }
    }
});
