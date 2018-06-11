Ext.namespace("Ext.grid");
Ext.grid.XyGridEditor = function(B, A) {
	Ext.grid.XyGridEditor.superclass.constructor.call(this, B, A);
	B.monitorTab = false
};
Ext.extend(Ext.grid.XyGridEditor, Ext.XyEditor, {
			alignment : "tl-tl",
			autoSize : "width",
			hideEl : false,
			cls : "x-small-editor x-grid-editor",
			shim : false,
			shadow : false
		});