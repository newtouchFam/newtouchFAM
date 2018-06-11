Ext.namespace('gl.vouchermanager.vouchermake');
gl.vouchermanager.vouchermake.ledgerinfo = Ext.extend(Ext.Window,
{
	id : 'gl.vouchermanager.vouchermake.ledgerinfo',
    title : "分户分摊",
    width : 500,
    height : 428,
    resizable : false,
    modal : true,
    isView : false,
    isOpenVoucher : false,
    isOffset : false,
    //在ledgergroupbase设置isCanOffset的值，判断能否冲销
//  isCanOffset : true,
    //所有改变了分摊金额的分户
    allChangeName : null,
    //所有分摊金额小于总的冲销金额的分户
    allOffsetName : null,
//  isChangeMoney : false,
    //获取当前ledgergroupbase的id
    currentId : "",
    vouchergrid : null,
    frame : true,
    accountledgertype : null,
    accountledger : null,
    detailrecord : null,
    initComponent : function()
    {
        this.createControl();
        gl.vouchermanager.vouchermake.ledgerinfo.superclass.initComponent.call(this);
    },
    getConfig : function()
    {
		var _config = 
		{
			accountledgertype : this.accountledgertype,
			accountledger : this.accountledger,
			detailrecord : this.detailrecord,
			debit : this.detailrecord.get("mnydebit"),
			credit : this.detailrecord.get("mnycredit"),
			isView : this.isView,
			isOpenVoucher : this.isOpenVoucher,
			acflag : this.acflag,
			isOffset : this.isOffset
		};
        return _config;
    },
    createControl : function()
    {
        var _config = this.getConfig();
        
        this.pnlDetail = new gl.vouchermanager.vouchermake.detail(_config);

        this.tabCommon = new gl.vouchermanager.vouchermake.ledge(_config);
        
        this.funcAreaTabs = new Ext.Panel(
        {
            region : 'center',
            autoHeight : true,
            frame : false,
            border : false,
            items : [this.tabCommon]
        });

        this.items = [{hidden:false, items:[this.pnlDetail]}, this.funcAreaTabs];
        
        if(this.isView == false)
        {
        	this.buttons = [
            {
                text : '保存',
                handler : this.save,
                scope : this
            },
            {
                text : '关闭',
                handler : this.winClose,
                scope : this
            }];
        }
        else
        {
        	this.buttons = [
            {
                text : '关闭',
                handler : this.winClose,
                scope : this
            }];
        }
        
        this.addListener("getJsonData", Ext.emptyFn);
    },
    save : function()
    {
    	if(!this.tabCommon.validate())
    	{
    		return false;
    	}
    	
    	
    	//获取其他分户类别的冲销信息
    	var otherId = [];
    	var groupTabs = Ext.getCmp("ledger").groupTabs;
    	var keys = groupTabs.items.keys;
        var length = keys.length;
        for (var i = 0; i < length; i++)
        {
        	otherId.push(groupTabs.items.keys[i]);
        }
		if(otherId != undefined && otherId != [] && otherId != null) 
		{
			var changeName = "";
			for( var j = 0; j < otherId.length; j++)
			{
				if(Ext.getCmp(otherId[j]).grid.allChangeName != null && Ext.getCmp(otherId[j]).grid.allChangeName != "")
				{
					if(j == 0)
					{
						changeName = Ext.getCmp(otherId[j]).grid.allChangeName;
					}
					else
					{
						changeName += "," + Ext.getCmp(otherId[j]).grid.allChangeName;
					}
				}
			}
		}
		else
		{
			var changeName = "";
		}
    	/*//判断是否用 "," 连接字符串
		if(otherChangeName != "" && this.allChangeName != ""  && otherChangeName != undefined && this.allChangeName != otherChangeName)
		{
			var changeName = this.allChangeName + "," + otherChangeName;
		}
		else 
		{
			if(otherChangeName == "" || otherChangeName == undefined || this.allChangeName == otherChangeName)
			{
				var changeName = this.allChangeName;
			}
			else
			{
				var changeName = otherChangeName;
			}
		}*/
		if(changeName != "" && changeName != null)
    	{
    		Ext.Msg.alert("提示",changeName+"分户分摊金额已修改，与原来需冲销金额不一致，不能核销");
    		return false;
    	}
		
		if(otherId != undefined && otherId != [] && otherId != null) 
		{   
			var offsetName = "";
			for( var j = 0; j < otherId.length; j++)
			{
				if(Ext.getCmp(otherId[j]).grid.allOffsetName != null && Ext.getCmp(otherId[j]).grid.allOffsetName != "")
				{
					if(j == 0)
					{
						offsetName = Ext.getCmp(otherId[j]).grid.allOffsetName;
					}
					else
					{
						offsetName += "," + Ext.getCmp(otherId[j]).grid.allOffsetName;
					}
				}
			}
		}
		else
		{
			var offsetName = "";
		}
		/*//判断是否用 "," 连接字符串
		if(otherOffsetName != "" && this.allOffsetName != "" && otherOffsetName != undefined && this.allOffsetName != otherOffsetName)
		{
			var offsetName = this.allOffsetName + "," + otherOffsetName;
		}
		else 
		{
			if(otherOffsetName == "" || otherOffsetName == undefined || this.allOffsetName == otherOffsetName)
			{
				var offsetName = this.allOffsetName;
			}
			else
			{
				var offsetName = otherOffsetName;
			}
		}*/
    	if(offsetName != "" && offsetName != null)
    	{
    		Ext.Msg.alert("提示",offsetName+"冲销总金额大于分户分摊金额，不能保存");
    		return false;
    	}
    	var sm = this.vouchergrid.getSelectionModel();
		var record = sm.getSelected();
		record.beginEdit();
		record.set("accountledger",Ext.util.JSON.encode(this.getJsonData()));
		record.commit();
		record.endEdit();
		
		/*//新增 在分户保存时， 给detailrecord设置一个参数，判断是借还是贷
		if(this.detailrecord.get("mnydebit") != 0 && this.detailrecord.get("mnydebit") != null && this.detailrecord.get("mnydebit") != undefined)
		{
			this.detailrecord.set("moneytype", "mnydebit");
		}
		if(this.detailrecord.get("mnycredit") != 0 && this.detailrecord.get("mnycredit") != null && this.detailrecord.get("mnycredit") != undefined)
		{
			this.detailrecord.set("moneytype", "mnycredit");
		}*/
		this.close();
    },
    winClose : function()
    {
    	this.close();
    },
    getJsonData : function()
    {
        var data = this.tabCommon.getCommitData();
        return data;
    }
});