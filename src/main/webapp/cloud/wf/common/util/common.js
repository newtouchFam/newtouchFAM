/*
 * PCM Common Function
 * 
 * add by zhoupeng 2009-07-22
 * 
 */

/*根据type渲染为typename*/
function renderName(store,value, cellmeta, record,info) {
			// 通过匹配value取得ds索引
			var index = store.find(Ext.getCmp(info).valueField,
					value);
			// 通过索引取得记录ds中的记录集
			var record = store.getAt(index);
			// 返回记录集中的value字段的值
			var returnvalue = "";
			if (record) {
				returnvalue = record.data.typename;
			}
			return returnvalue;// 注意这个地方的value是上面displayField中的value
		}
/* 表格中单元格字符自适应行的显示--Begin */
function renderDesc(value, metadata, record) {
	metadata.attr = 'style="white-space:normal;"';
	return value;
}
/* 表格中单元格字符自适应行的显示--End */

/* 人民币自动添加.00--Begin */
function cnMoney(v) {
	v = (Math.round((v - 0) * 100)) / 100;
	v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v
			+ "0" : v);
	v = String(v);
	var ps = v.split(".");
	var whole = ps[0];
	var sub = ps[1] ? "." + ps[1] : ".00";
	var r = /(\d+)(\d{3})/;
	while (r.test(whole)) {
		whole = whole.replace(r, "$1" + "," + "$2");
	}
	v = whole + sub;
	if (v.charAt(0) == "-") {
		return "-" + v.substr(1);
	}
	return v;
}
/* 人民币自动添加.00--End */

/* 人民币数字转中文--Begin */
function convertCurrency(currencyDigits) {
	// Constants:
	var MAXIMUM_NUMBER = 99999999999.99;
	// Predefine the radix characters and currency symbols for output:
	var CN_ZERO = "零";
	var CN_ONE = "壹";
	var CN_TWO = "贰";
	var CN_THREE = "叁";
	var CN_FOUR = "肆";
	var CN_FIVE = "伍";
	var CN_SIX = "陆";
	var CN_SEVEN = "柒";
	var CN_EIGHT = "捌";
	var CN_NINE = "玖";
	var CN_TEN = "拾";
	var CN_HUNDRED = "佰";
	var CN_THOUSAND = "仟";
	var CN_TEN_THOUSAND = "万";
	var CN_HUNDRED_MILLION = "亿";
	var CN_SYMBOL = "人民币";
	var CN_DOLLAR = "元";
	var CN_TEN_CENT = "角";
	var CN_CENT = "分";
	var CN_INTEGER = "整";

	// Variables:
	var integral; // Represent integral part of digit number.
	var decimal; // Represent decimal part of digit number.
	var outputCharacters; // The output result.
	var parts;
	var digits, radices, bigRadices, decimals;
	var zeroCount;
	var i, p, d;
	var quotient, modulus;

	// Validate input string:
	currencyDigits = currencyDigits.toString();
	if (currencyDigits == "") {
		//alert("Empty input!");
		return "";
	}
	if (currencyDigits.match(/[^-,.\d]/) != null) {
		return "";
	}
/*	if ((currencyDigits)
			.match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
		alert("Illegal format of digit number!");
		return "";
	}*/

	// Normalize the format of input digits:
	currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma
	// delimiters.
	currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the
	// beginning.
	// Assert the number is not greater than the maximum number.
	if (Number(currencyDigits) > MAXIMUM_NUMBER) {
		return "金额超出最大限制...";
	}

	// Process the coversion from currency digits to characters:
	// Separate integral and decimal parts before processing coversion:
	parts = currencyDigits.split(".");
	if (parts.length > 1) {
		integral = parts[0];
		decimal = parts[1];
		// Cut down redundant decimal digits that are after the second.
		decimal = decimal.substr(0, 2);
	} else {
		integral = parts[0];
		decimal = "";
	}
	// Prepare the characters corresponding to the digits:
	digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE,
			CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
	radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
	bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
	decimals = new Array(CN_TEN_CENT, CN_CENT);
	// Start processing:
	outputCharacters = "";
	// Process integral part if it is larger than 0:
	if (Number(integral) > 0) {
		zeroCount = 0;
		for (i = 0; i < integral.length; i++) {
			p = integral.length - i - 1;
			d = integral.substr(i, 1);
			quotient = p / 4;
			modulus = p % 4;
			if (d == "0") {
				zeroCount++;
			} else {
				if (zeroCount > 0) {
					outputCharacters += digits[0];
				}
				zeroCount = 0;
				outputCharacters += digits[Number(d)] + radices[modulus];
			}
			if (modulus == 0 && zeroCount < 4) {
				outputCharacters += bigRadices[quotient];
			}
		}
		outputCharacters += CN_DOLLAR;
	}
	// Process decimal part if there is:
	if (decimal != "") {
		for (i = 0; i < decimal.length; i++) {
			d = decimal.substr(i, 1);
			if (d != "0") {
				outputCharacters += digits[Number(d)] + decimals[i];
			}
		}
	}
	// Confirm and return the final output string:
	if (outputCharacters == "") {
		outputCharacters = CN_ZERO + CN_DOLLAR;
	}
	if (decimal == "" || decimal == 0) {
		outputCharacters += CN_INTEGER;
	}
	outputCharacters = outputCharacters;
	return outputCharacters;
}
/* 人民币数字转中文--End */

function initNumberField() {
	if (Ext.form.NumberField) {		
		Ext.apply(Ext.form.NumberField.prototype, {
			decimalPrecision : 2,
			// allowNegative :false,
			allowDecimals : true
			// allowBlank : false
			,
			cls : 'numReadOnly'
			// private
			,
			FormatComma : true
			// private
			,
			initEvents : function() {
				Ext.form.NumberField.superclass.initEvents.call(this);
				var allowed = this.baseChars + '';
				if (this.allowDecimals) {
					allowed += this.decimalSeparator;
				}
				if (this.FormatComma) {
					allowed += ",";
				}
				if (this.allowNegative) {
					allowed += "-";
				}
				this.stripCharsRe = new RegExp('[^' + allowed + ']', 'gi');
				var keyPress = function(e) {
					var k = e.getKey();
					if (!Ext.isIE
							&& (e.isSpecialKey() || k == e.BACKSPACE || k == e.DELETE)) {
						return;
					}
					var c = e.getCharCode();
					if (allowed.indexOf(String.fromCharCode(c)) === -1) {
						e.stopEvent();
					}
				};
				this.el.on("keypress", keyPress, this);
			},
			// private
			validateValue : function(value) {
				if (!Ext.form.NumberField.superclass.validateValue.call(this,
						value)) {
					return false;
				}
				if (value.length < 1) { // if it's blank
					// and textfield
					// didn't flag
					// it then it's
					// valid
					return true;
				}
				if (this.FormatComma) {
					value = this.removeCommas(String(value));
				}
				value = String(value).replace(this.decimalSeparator, ".");
				if (isNaN(value)) {
					this.markInvalid(String.format(this.nanText, value));
					return false;
				}
				var num = this.parseValue(value);
				if (num < this.minValue) {
					this.markInvalid(String.format(this.minText,
									this.minValue));
					return false;
				}
				if (num > this.maxValue) {
					this.markInvalid(String.format(this.maxText,
									this.maxValue));
					return false;
				}
				return true;
			},
			fixPrecision : function(value) {
				var nan = isNaN(value);
				if (!this.allowDecimals || this.decimalPrecision == -1 || nan
						|| !value) {
					return nan?'' : value;
				}
				return parseFloat(parseFloat(value).toFixed(this.decimalPrecision));
			},
			setValue : function(v) {
				v = typeof v == 'number' ? v : (String(this.removeCommas(v))
						.replace(this.decimalSeparator, "."));
				v = isNaN(v) ? '' : String(v).replace(".",
						this.decimalSeparator);
				if (String(v).length > 0)
					v = parseFloat(v).toFixed(this.decimalPrecision);
				// if(this.FormatComma)
				// v=this.formatCommaStyle(v);
				Ext.form.NumberField.superclass.setValue.call(this, v);
				if (this.FormatComma && String(v).length > 0) {
					v = this.addCommas(v);
					Ext.form.NumberField.superclass.setRawValue.call(this, v);
				}
			},
			parseValue : function(value) {
				if (this.FormatComma)
					value = this.removeCommas(String(value));
				value = parseFloat(String(value).replace(this.decimalSeparator,
						"."));

				return isNaN(value) ? '' : value;
			},
			beforeBlur : function() {
				var v = this.parseValue(this.getRawValue());
				if (String(v).trim().length > 0) {
					this.setValue(this.fixPrecision(v));
				}
			},
			addCommas : function(nStr) {
				nStr += '';
				if (nStr.length == 0)
					return '';
				x = nStr.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? '.' + x[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
				}
				return x1 + x2;

			},
			removeCommas : function(nStr) {

				nStr = nStr + '';
				var r = /(\,)/;
				while (r.test(nStr)) {
					nStr = nStr.replace(r, '');
				}
				return nStr;

			}
		});
	}

}
