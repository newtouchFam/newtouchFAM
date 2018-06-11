Ext.namespace("ssc.smcs.bz.workitem.BZApply");

ssc.smcs.bz.workitem.BZApply.BusiClassView = Ext.extend(Ext.DataView,
{
	tpl : new Ext.XTemplate('<tpl for=".">',
		'<div class="xy-view-wrap" busiclasscode="{buciclasscode}">',
		'<span class="xy-view-text">{busiclassname}</span></div>',
		'</tpl>',
		'<div class="x-clear"></div>'),
	autoHeight : true,
	multiSelect : false,
	singleSelect : true,
	overClass : "xy-view-over",
	selectedClass : "xy-view-selected",
	itemSelector : "div.xy-view-wrap",
	emptyText : ""
});