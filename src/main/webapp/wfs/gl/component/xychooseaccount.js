gl.component.xychooseaccount = Ext.extend(Ext.form.TwinTriggerField, {
	call :Ext.emptyFn,
	hiddenData :null,
    m_alert:false,
    codecondition : "",
    m_alert_msg:"",
	initEvent : function() {
	    gl.component.xychooseaccount.superclass.initEvent.call(this);
	},
	initComponent : function() {
	    gl.component.xychooseaccount.superclass.initComponent.call(this);
		this.on('specialkey', function(f, e) {
			if (e.getKey() == e.ENTER) {
				this.onTrigger1Click();
			}
		}, this);
		this.on('render', function(f) {
			this.onLoad();
		}, this);
		this.blankText = this.rootTitle;
		this.emptyText = this.rootTitle;
		this.addListener("valuechange", this.call);
	},
	validationEvent :false,
	validateOnBlur :false,
	trigger1Class :'x-form-search-trigger',
	trigger2Class :'x-form-clear-trigger',
	readOnly :true,
	leafSelect :true,
	isOnlyLastLevel :false, //是否只能选择末级 true是  false否
	Width :550,
	Height :500,
	onLoad : function() {
		if (this.hiddenData != null) {
			this.setValue(this.hiddenData.text);
		}
	},
	getXyValue : function() {
		if (this.hiddenData != null && this.hiddenData["id"] != null) {
			return this.hiddenData["id"];
		}
		if (this.hiddenData != null && this.hiddenData["uqaccountid"] != null) {
			return this.hiddenData["uqaccountid"];
		}
		return "";
	},
	getCodeValue : function() {
		if (this.hiddenData != null && this.hiddenData["varaccountcode"] != null) {
			return this.hiddenData["varaccountcode"];
		}
		return "";
	},
	getDisplayValue : function() {
		if (this.hiddenData != null && this.hiddenData["text"] != null) {
			return this.hiddenData["text"];
		}
		return "";
	},
	setXyValue : function(A) {
		if (A === undefined || A === null || A === "") {
			this.hiddenData = null;
			this.setValue("");
		} else {
			if (typeof A == "object") {
			} else {
				A = JSON.parse(A);
			}
			this.hiddenData = A;
			this.setValue(this.hiddenData.text);
		}
	},
	onTrigger2Click : function() {
		if (this.disabled) {
			return;
		}
		var oldValue = this.hiddenData;
		this.setValue("");
		this.hiddenData = null;
		if ( oldValue != null )
		{
			this.fireEvent("valuechange", oldValue, null);
		}
	},
	onTrigger1Click : function() {
		if (this.disabled) {
			return;
		}
		if(this.m_alert){
            Ext.MessageBox.alert("提示",this.m_alert_msg);
            return;
        }
		var m_this = this;
		var itemFliter = {
		};
		var accwin = new gl.component.accountsel({codecondition : this.codecondition});
		accwin.on('selected', function(e) 
		{
			if(m_this.isOnlyLastLevel && e.intislastlevel == 0)
			{
				Ext.Msg.alert("提示","请选择末级科目!");
				return;
			}
		    var account = {
				id : e.uqaccountid,
				code : e.varaccountcode,
				text : '['+e.varaccountcode+']'+e.varaccountname
			};
			m_this.setValue(account.text);
			var oldValue = m_this.hiddenData;
			m_this.hiddenData = e;
			var newValue = m_this.hiddenData;
			m_this.fireEvent("valuechange", oldValue, newValue);
			accwin.close();
			}, this);
		accwin.show();
	}
});
Ext.reg("xychooseaccount", gl.component.xychooseaccount);
