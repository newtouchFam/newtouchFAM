 Ext.ux.CenterWindowPlugin = function(){
	        this.init = function(win) {
	            Ext.EventManager.onWindowResize(function(){
	                win.center();
	            });
	        }
	    }; 