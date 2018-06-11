
		MonthCombo = function(config) {
			Ext.applyIf(this, config);
			this.initUIComponents();
			MonthCombo.superclass.constructor.call(this);
		};
Ext.extend(MonthCombo, Ext.form.ComboBox, {
initUIComponents : function() {
		var currMonth = new Date().getMonth() + 1;
		
		var store1 = new Ext.data.SimpleStore({
		     fields: [
		    	{name:'index',type: 'string'}, 
		    	{name:'month',type: 'string'}],
		   		 data:[['1', '01'], ['2', '02'], ['3', '03'], ['4', '04'], ['5', '05'], ['6', '06'], ['7', '07'], ['8', '08'], ['9', '09'], ['10', '10'], ['11', '11'], ['12', '12']]
			});
		
		Ext.apply(this, {
		    fieldLabel: this.fieldLabel || '查询月份',
		    store: store1,
		    displayField:'month',
		    valueField:'index',
		    mode: 'local',
		    forceSelection : true, 
		    triggerAction:'all',
		    value:this.value||currMonth,
		    relValue :this.relValue||currMonth,
		    width : this.width || 150,
		    readOnly:true,
		    listeners:{
			    'select':function(v){
			    	this.relValue = v.getValue();
			    }
		    }
		});
	}
});

Ext.reg('monthcombo', MonthCombo); 
