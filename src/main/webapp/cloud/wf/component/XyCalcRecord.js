Ext.namespace("Ext.data");
Ext.data.XyCalcRecord = function(data, id) {
	Ext.data.XyCalcRecord.superclass.constructor.call(this, data, id);
	this.displayData = {};
	this.primaryData = {};
	this.calcFields();
};

Ext.data.XyCalcRecord.create = function(o) {
	var f = Ext.extend(Ext.data.XyCalcRecord, {});
	var p = f.prototype;
	p.fields = new Ext.util.MixedCollection(false, function(field) {
				return field.name;
			});
	for (var i = 0, len = o.length; i < len; i++) {
		p.fields.add(new Ext.data.Field(o[i]));
	}
	f.getField = function(name) {
		return p.fields.get(name);
	};
	return f;
};
Ext.extend(Ext.data.XyCalcRecord, Ext.data.Record, {
	set : function(name, value, displayValue, primaryValue) {
		if (primaryValue !== undefined) {
//			if (String(this.primaryData[name] || "") == String(primaryValue)) {
//				return;
//			}
		} else if(typeof value === "object"){
			if (Ext.urlEncode(this.data[name]) == Ext.urlEncode(value)) {
				return;
			}
		} else {
			if (String(this.data[name] || "") == String(value)) {
				return;
			}
		}
		this.dirty = true;
		if (!this.modified) {
			this.modified = {};
		}
		if (typeof this.modified[name] == 'undefined') {
			this.modified[name] = this.data[name];
		}
		this.data[name] = value;
		if (displayValue !== undefined) {
			this.displayData[name] = displayValue;
		}
		if (primaryValue !== undefined) {
			this.primaryData[name] = primaryValue;
		}
		this.calcFields(name);
		if (!this.editing && this.store) {
			this.store.afterEdit(this);
		}
	},
	getComplex : function(A) {
		if (this.data[A] === undefined || this.data[A] === null
				|| this.data[A] === "") {
			return null;
		}
		if (typeof this.data[A] == "object") {
			return this.data[A];
		} else if (typeof(this.data[A]) == "string") {
			return JSON.parse(this.data[A]);
		} else {
			return this.data[A];
		}
	},
	getXyValue : function(A) {
		var value = this.primaryData[A] == null
				? this.get(A)
				: this.primaryData[A];
		return value;
	},
	getDisplayValue : function(A) {
		var value = this.displayData[A] == null
				? this.get(A)
				: this.displayData[A];
		return value;
	},
	calcFields : function(name) {
		if (typeof this.fields == 'undefined') {
			return;
		}
		if (this.xy_CalcEnabled != undefined && this.xy_CalcEnabled != true)
		{
			return;
		}
		this.fields.each(function(field) {
					if ((field.name != name)
							&& (typeof field.calc == 'function')
							&& (!name || (!field.dependencies || field.dependencies
									.indexOf(name) != -1))) {
						/* 2013-04-16 load record not calc */
						if ((this.xy_isCreateState != undefined && this.xy_isCreateState)
								&& (field.xy_isCalcOnLoad != undefined && !field.xy_isCalcOnLoad)){
							return;
						}
						var value = field.calc(this);
						if (!name || field.notDirty) {
							this.data[field.name] = value;
						} else {
							this.set(field.name, value);
						}
					}
				}, this);
	},
	setEx : function(name, value, displayValue, primaryValue)
	{
		this.beginEdit();
		this.setEx2(name, value, displayValue, primaryValue);
		this.endEdit();
		this.commit();
	},
	setEx2 : function(name, value, displayValue, primaryValue)
	{
		if (displayValue == undefined || displayValue == null || displayValue == "")
		{
			var strDisplayField = value["displayfield"];
			if (strDisplayField != undefined && strDisplayField != null && strDisplayField != "")
			{
				var strDisplayValue = value[strDisplayField];
				if (strDisplayValue != undefined)
				{
					displayValue = strDisplayValue;
				}
			}
		}

		if (primaryValue == undefined || primaryValue == null || primaryValue == "")
		{
			var strKeyField = value["keyfield"];
			if (strKeyField != undefined && strKeyField != null && strKeyField != "")
			{
				var strKeyValue = value[strKeyField];
				if (strKeyValue != undefined)
				{
					primaryValue = strKeyValue;
				}
			}
		}

		this.set(name, value, displayValue, primaryValue);
	},
	clearComplex : function (name)
	{
		this.beginEdit();
		this.set(name, "", "", "");
		this.endEdit();
		this.commit();
	},
	disableCalc : function()
	{
		this.xy_CalcEnabled = false;
	},
	enalbeCalc : function()
	{
		this.xy_CalcEnabled = true;
	}
});