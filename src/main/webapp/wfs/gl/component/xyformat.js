Ext.app.XyFormat = function() {
	var trimRe = /^\s+|\s+$/g;
	return {
		ellipsis : function(value, len) {
			if (value && value.length > len) {
				return value.substr(0, len - 3) + "..."
			}
			return value
		},
		undef : function(value) {
			return value !== undefined ? value : ""
		},
		defaultValue : function(value, defaultValue) {
			return value !== undefined && value !== "" ? value : defaultValue
		},
		htmlEncode : function(value) {
			return !value ? value : String(value).replace(/&/g, "&amp;")
					.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g,
							"&quot;")
		},
		htmlDecode : function(value) {
			return !value ? value : String(value).replace(/&amp;/g, "&")
					.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(
							/&quot;/g, "\"")
		},
		trim : function(value) {
			return String(value).replace(trimRe, "")
		},
		substr : function(value, start, length) {
			return String(value).substr(start, length)
		},
		lowercase : function(value) {
			return String(value).toLowerCase()
		},
		uppercase : function(value) {
			return String(value).toUpperCase()
		},
		capitalize : function(value) {
			return !value ? value : value.charAt(0).toUpperCase()
					+ value.substr(1).toLowerCase()
		},
		call : function(value, fn) {
			if (arguments.length > 2) {
				var args = Array.prototype.slice.call(arguments, 2);
				args.unshift(value);
				return eval(fn).apply(window, args)
			} else {
				return eval(fn).call(window, value)
			}
		},
		cnPercent : function(v) {
			if (isNaN(v)) {
				return "0%";
			} else {
				
				v = (Math.round((v - 0) * 100)) / 100;
				v = (v == Math.floor(v)) ? v  : ((v * 10 == Math.floor(v
						* 10)) ? v + "0" : v);
				if (v > 100)
				{
					v = 100;
				}
				v = String(v);
				v = v + "%";
				return "" + v
			}
		},
		cnMoney : function(v) {
			if (isNaN(v)) {
				return "0.00";
			} else {
				v = (Math.round((v - 0) * 100)) / 100;
				v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v
						* 10)) ? v + "0" : v);
				v = String(v);
				var ps = v.split(".");
				var whole = ps[0];
				var sub = ps[1] ? "." + ps[1] : ".00";
				var r = /(\d+)(\d{3})/;
				while (r.test(whole)) {
					whole = whole.replace(r, "$1" + "," + "$2")
				}
				v = whole + sub;
				if (v.charAt(0) == "-") {
					return "<font color=red>" + v.substr(1)+"</font>";
				}
				return "" + v
				//return Number(v).toFixed(2);
			}
		},
		gridMoney : function(v) {
			if (isNaN(v)) {
				return "";
			} else if (v == null) {
				return "";
			} else {
				v = (Math.round((v - 0) * 100)) / 100;
				v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v
						* 10)) ? v + "0" : v);
				v = String(v);
				var ps = v.split(".");
				var whole = ps[0];
				var sub = ps[1] ? "." + ps[1] : ".00";
				var r = /(\d+)(\d{3})/;
				while (r.test(whole)) {
					whole = whole.replace(r, "$1" + "," + "$2")
				}
				v = whole + sub;
				if (v.charAt(0) == "-") {
					return "<font color=red>" + v.substr(1)+"</font>";
				}
				return "" + v
				//return Number(v).toFixed(2);
			}
		},
		/**
		 * 0值不显示
		 */
		cnMoneyEx : function(v)
		{
			if (isNaN(v) || v == 0) 
				return "";
			return Ext.app.XyFormat.cnMoney(v);
		},
		overFlowTip : function(val) {
			return "<span stype='display:table;width:100%;' title='" + val
					+ "'>" + val + "</span>";
		},
		date : function(v, format) {
			if (!v) {
				return ""
			}
			if (!Ext.isDate(v)) {
				v = v.replace(/-/g, "/");
				v = new Date(Date.parse(v))
			}
			return v.dateFormat(format || "m/d/Y")
		},
		dateRenderer : function(format) {
			return function(v) {
				return Ext.app.XyFormat.date(v, format)
			}
		},
		stripTagsRE : /<\/?[^>]+>/gi,
		stripTags : function(v) {
			return !v ? v : String(v).replace(this.stripTagsRE, "")
		},
		stripScriptsRe : /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,
		stripScripts : function(v) {
			return !v ? v : String(v).replace(this.stripScriptsRe, "")
		},
		fileSize : function(size) {
			if (size < 1024) {
				return size + " bytes"
			} else {
				if (size < 1048576) {
					return (Math.round(((size * 10) / 1024)) / 10) + " KB"
				} else {
					return (Math.round(((size * 10) / 1048576)) / 10) + " MB"
				}
			}
		},
		math : function() {
			var fns = {};
			return function(v, a) {
				if (!fns[a]) {
					fns[a] = new Function("v", "return v " + a + ";")
				}
				return fns[a](v)
			}
		}()
	}
}();