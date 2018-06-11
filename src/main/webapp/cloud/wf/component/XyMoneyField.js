Ext.namespace('Freesky.Common');

Freesky.Common.XyMoneyField = Ext.extend(Ext.form.TextField, {
	fieldClass : "x-form-field x-form-num-field",
	allowDecimals : true,
	decimalSeparator : ".",
	decimalPrecision : 2,
	allowNegative : true,
	minValue : Number.NEGATIVE_INFINITY,
	maxValue : Number.MAX_VALUE,
	minText : "The minimum value for this field is {0}",
	maxText : "The maximum value for this field is {0}",
	nanText : "{0} is not a valid number",
	baseChars : "0123456789,",
	style : 'text-align:right',
	initEvents : function() {
		Freesky.Common.XyMoneyField.superclass.initEvents.call(this);
		var B = this.baseChars + "";
		if (this.allowDecimals) {
			B += this.decimalSeparator
		}
		if (this.allowNegative) {
			B += "-"
		}
		this.stripCharsRe = new RegExp("[^" + B + "]", "gi");
		var A = function(D) {
			var C = D.getKey();
			if (!Ext.isIE
					&& (D.isSpecialKey() || C == D.BACKSPACE || C == D.DELETE)) {
				return
			}
			var E = D.getCharCode();
			if (B.indexOf(String.fromCharCode(E)) === -1) {
				D.stopEvent()
			}
		};
		this.el.on("keypress", A, this);
	},
	validateValue : function(B) {
		B = this.returnNum(B);
		if (!Freesky.Common.XyMoneyField.superclass.validateValue.call(this, B)) {
			return false
		}
		if (B.length < 1) {
			return true
		}
		B = String(B).replace(this.decimalSeparator, ".");
		if (isNaN(B)) {
			this.markInvalid(String.format(this.nanText, B));
			return false
		}
		var A = this.parseValue(B);
		if (A < this.minValue) {
			this.markInvalid(String.format(this.minText, this.minValue));
			return false
		}
		if (A > this.maxValue) {
			this.markInvalid(String.format(this.maxText, this.maxValue));
			return false
		}
		return true
	},
	getValue : function() {
		var value = Freesky.Common.XyMoneyField.superclass.getValue.call(this);
		value = this.returnNum(value);
		return this.fixPrecision(this.parseValue(value));
	},
	getDisplayValue : function() {
		return this.getValue();
	},
	getXyValue : function() {
		return this.getValue();
	},
	setValue : function(A) {
		A = this.returnNum(String(A));
		A = parseFloat(A);
		A = isNaN(A) ? "" : String(A).replace(".", this.decimalSeparator);
		A = this.cnMoney(A);
		
		/**
		 * 浙江SSC改进，当金额项输入，应先清空，而不是修改0.0
		 */
		if (this.xy_DefaultZero != true)
		{
			if (A.toString() === "0.00")
			{
				A = "";
			}
		}
		Freesky.Common.XyMoneyField.superclass.setValue.call(this, A)
	},
	parseValue : function(A) {
		A = parseFloat(String(A).replace(this.decimalSeparator, "."));
		return isNaN(A) ? "" : A;
	},
	fixPrecision : function(B) {
		var A = isNaN(B);
		if (!this.allowDecimals || this.decimalPrecision == -1 || A || !B) {
			return A ? "" : B;
		}
/*四舍五入不精确
		return parseFloat(parseFloat(B).toFixed(this.decimalPrecision))
*/
		return ssc.common.NumberUtil.toRound(B, this.decimalPrecision);
	},
	beforeBlur : function() {
		var A = this.parseValue(this.returnNum(this.getRawValue()));
		if (A) {
			this.setValue(this.fixPrecision(A))
		} else {
			this.setValue("");
		}
	},
	returnNum : function(v) {
/* XXX
		if(Ext.isEmpty(v))
		{
			return 0;
		}
*/
		var r, re;
		re = /,/g;
		r = v.replace(re, "");
		return (r);
	},
	cnMoney : function(v) {
		v = this.returnNum(v);
		if (isNaN(v)) {
			var value = 0;
			return value.toFixed(this.decimalPrecision);
		} else {
			v = Number(v).toFixed(this.decimalPrecision);
			v = String(v);
			var ps = v.split(".");
			var whole = ps[0];
			var sub = "." + ps[1];
			var r = /(\d+)(\d{3})/;
			while (r.test(whole)) {
				whole = whole.replace(r, "$1" + "," + "$2");
			}
			v = whole + sub;
			if (v.charAt(0) == "-") {
				return "-" + v.substr(1)
			}
			return "" + v
		}
	}
});
Ext.reg("xymoneyfield", Freesky.Common.XyMoneyField);