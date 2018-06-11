Ext.namespace("wfs.gl.datamamager.initledgeperiod");
wfs.gl.datamamager.initledgeperiod.initLedgePeriodWin = Ext.extend(Ext.Window, 
{
	title : '分户期初余额设置',
	autoHeight : true,
	enableColumnMove : false,
	enableHdMenu : false,
	border : false,
	buttonAlign : 'right',
	width : 300,
	height : 260,
    layout : 'fit',
    modal : true,
    resizable : false,
    record : null,
  //初始化面板
	initComponent : function()
    {
		this.mnydebitperiod = new Freesky.Common.XyMoney(
    	{
    		id : 'mnydebitperiod',
    		fieldLabel : '年初借方余额',
    		anchor : '95%',
			labelStyle : 'text-align:right;',
    		allowBlank : false,
			msgTarget : 'qtip',
			renderer : Ext.app.XyFormat.cnMoneyEx
    	});
    	
		this.mnycreditperiod = new Freesky.Common.XyMoney(
    	{
    		id : 'mnycreditperiod',
    		fieldLabel : '年初贷方余额',
    		anchor : '95%',
			labelStyle : 'text-align:right;',
    		allowBlank : false,
    		allowNegative : true,
			msgTarget : 'qtip',
			renderer : Ext.app.XyFormat.cnMoneyEx
    	});
		
    	//声明的控件放到formPanel中
    	this.formPanel = new Ext.form.FormPanel(
		{
			frame : true,
			autoHeight : true,
			items : [this.mnydebitperiod, this.mnycreditperiod]
		});
    	//加入items
    	this.items = [this.formPanel];
    	//按钮
    	this.buttons = [
	    {	
	    	text : '保存',
	    	handler : this.saveHandler,
	    	scope : this
	    },
	    {
	    	text : '关闭',
			handler : function()
			{
			  this.close();
			},
			scope : this
		}];
    	
    	//渲染
    	wfs.gl.datamamager.initledgeperiod.initLedgePeriodWin.superclass.initComponent.call(this);
    	
    	//赋初值
    	if(this.record != null && this.record != '')
		{
			//父级id、父级名称
			this.mnydebitperiod.setValue(this.record.get("mnydebitperiod"));
			this.mnycreditperiod.setValue(this.record.get("mnycreditperiod"));
		}
    },
    //保存修改结果
    saveHandler : function()
    {
    	if(!this.validate())
		{
    		return;
		}
    	
    	var uqcompanyid = Ext.getCmp("company").getXyValue();
		var uqaccountid = Ext.getCmp("account").getXyValue();
		var uqledgeid = this.record.get("uqledgeid");
		//var mnydebitperiod = this.mnydebitperiod.getValue();
		//var mnycreditperiod = this.mnycreditperiod.getValue();
		
		if(this.mnydebitperiod.getValue()==null||this.mnydebitperiod.getValue()=="")
		{
			var mnydebitperiod = "0";
		}
		else
		{
			var mnydebitperiod = this.mnydebitperiod.getValue();
		}
		
		if(this.mnycreditperiod.getValue()==null||this.mnycreditperiod.getValue()=="")
		{
			var mnycreditperiod = "0";
		}
		else
		{
			var mnycreditperiod = this.mnycreditperiod.getValue();
		}
		
		var paramString = 
		{
			uqledgeid : uqledgeid,
			uqaccountid : uqaccountid,
			uqcompanyid : uqcompanyid,
			mnydebitperiod : mnydebitperiod+"",
			mnycreditperiod : mnycreditperiod+""
		}
		
		Ext.Ajax.request(
    	{
			url : "datamanager/initledgeperiod/editinitledgeperiod",
			method : "post",
			params :
			{
				paramString : Ext.encode(paramString)
			},
			success : function(response) 
			{
				var r = Ext.decode(response.responseText);
				if (r.success) 
				{
					this.close();
					//重新加载列表
					Ext.getCmp("initledgeperiod").store.reload();
					Ext.Msg.alert("成功","分户期初余额修改成功！");
				} 
				else 
				{
					this.close();
    				Ext.Msg.alert("提示", r.msg);        				
				}
			},
			failure : function(response)
			{
				Ext.Msg.alert("错误","修改分户期初余额错误！");
				return;
			},
			scope : this
		});
    },
    //设置数据验证
	validate : function()
	{
		var mnydebitperiod = this.mnydebitperiod.getValue();
		var mnycreditperiod = this.mnycreditperiod.getValue();
		if ((mnydebitperiod != "" && mnydebitperiod != null && mnydebitperiod != 0) 
			&& (mnycreditperiod != "" && mnycreditperiod != null && mnycreditperiod != 0) ) 
		{
			Ext.Msg.alert("提示", "年初借方余额和年初贷方余额不可同时设置！");
			return false;
		}
		return true;
	}
});