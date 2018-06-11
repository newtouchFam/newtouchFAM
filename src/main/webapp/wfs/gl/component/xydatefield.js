Ext.app.XyDateField = Ext.extend(Ext.form.DateField, {
	format : "m/d/y",
	altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d",
	disabledDays : null,
	disabledDaysText : "Disabled",
	disabledDates : null,
	disabledDatesText : "Disabled",
	minValue : null,
	call : Ext.emptyFn,
	maxValue : null,
	minText : "The date in this field must be equal to or after {0}",
	maxText : "The date in this field must be equal to or before {0}",
	invalidText : "{0} is not a valid date - it must be in the format {1}",
	triggerClass : "x-form-date-trigger",
	defaultAutoCreate : {
		tag : "input",
		type : "text",
		size : "10",
		autocomplete : "off"
	},
	initComponent : function() {
		Ext.app.XyDateField.superclass.initComponent.call(this);
		if (typeof this.minValue == "string") {
			this.minValue = this.parseDate(this.minValue)
		}
		if (typeof this.maxValue == "string") {
			this.maxValue = this.parseDate(this.maxValue)
		}
		this.ddMatch = null;
		if (this.disabledDates) {
			var A = this.disabledDates;
			var C = "(?:";
			for (var B = 0; B < A.length; B++) {
				C += A[B];
				if (B != A.length - 1) {
					C += "|"
				}
			}
			this.ddMatch = new RegExp(C + ")")
		}
		this.addListener("valuechange", this.call);
	},
	validateValue : function(E) {
//		E = this.formatDate(E);
		return true;
	},
	validateBlur : function() {
		return true;
	},
	getValue : function() {
		return this
				.parseDate(Ext.app.XyDateField.superclass.getValue.call(this))
				|| ""
	},
	setValue : function(A) {
		Ext.app.XyDateField.superclass.setValue.call(this, this.formatDate(this
				.parseDate(A)))
	},
	parseDate : function(D) {
		if (!D || Ext.isDate(D)) {
			return D
		}
		var B = Date.parseDate(D, this.format);
		if (!B && this.altFormats) {
			if (!this.altFormatsArray) {
				this.altFormatsArray = this.altFormats.split("|")
			}
			for (var C = 0, A = this.altFormatsArray.length; C < A && !B; C++) {
				B = Date.parseDate(D, this.altFormatsArray[C])
			}
		}
		return B
	},
	onDestroy : function() {
		if (this.menu) {
			this.menu.destroy()
		}
		if (this.wrap) {
			this.wrap.remove()
		}
		Ext.app.XyDateField.superclass.onDestroy.call(this)
	},
	formatDate : function(A) {
		return Ext.isDate(A) ? A.dateFormat(this.format) : A
	},
	menuListeners : {
		select : function(A, B) {
			this.setValue(B);
			this.fireEvent("valuechange", this);
		},
		show : function() {
			this.onFocus()
		},
		hide : function() {
			this.focus.defer(10, this);
			var A = this.menuListeners;
			this.menu.un("select", A.select, this);
			this.menu.un("show", A.show, this);
			this.menu.un("hide", A.hide, this)
		}
	},
	onSelect : function(A, B) {
		alert(A);
		alert(B);
//		if (this.fireEvent("beforeselect", this, A, B) !== false) {
//			this.setValue(A.data[this.valueField]);
//			this.setRawValue(A.data[this.displayField]);
//
//			var oldValue = this.hiddenData;
//			var newValue = A.data;
//			this.hiddenData = A.data;
//			if (oldValue == null
//					|| oldValue[this.valueField] != newValue[this.valueField]) {
//				this.fireEvent("valuechange", oldValue, newValue);
//			}
//
//			this.collapse();
//			this.fireEvent("select", this, A, B)
//			
//		}
	},
	onTriggerClick : function() {
		if (this.disabled) {
			return
		}
		if (this.menu == null) {
			this.menu = new Ext.menu.DateMenu()
		}
		Ext.apply(this.menu.picker, {
			minDate : this.minValue,
			maxDate : this.maxValue,
			disabledDatesRE : this.ddMatch,
			disabledDatesText : this.disabledDatesText,
			disabledDays : this.disabledDays,
			disabledDaysText : this.disabledDaysText,
			format : this.format,
			minText : String.format(this.minText, this
					.formatDate(this.minValue)),
			maxText : String.format(this.maxText, this
					.formatDate(this.maxValue))
		});
		this.menu.on(Ext.apply({}, this.menuListeners, {
			scope : this
		}));
		this.menu.picker.setValue(this.getValue() || new Date());
		this.menu.show(this.el, "tl-bl?")
	},
	beforeBlur : function() {
		var A = this.parseDate(this.getRawValue());
		if (A) {
			this.setValue(A)
		}
	}
});
Ext.reg("datefieldxx", Ext.app.XyDateField);