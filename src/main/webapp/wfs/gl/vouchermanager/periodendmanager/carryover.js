/**
 * 期末结转
 */
Ext.namespace('gl.vouchermanager.periodendmanager');
gl.vouchermanager.periodendmanager.carryover = Ext.extend(Ext.FormPanel,
{
	frame : true,
	height : 120,
    border : false,
    data : "",
    undata : "",
    initComponent : function ()
	{
    	this.periodid = new Ext.app.XyComboBoxCom(
    	{
    		id : 'periodid',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '会计期',
    		XyAllowDelete : false,
    		rootTitle :'',
		    fields : ["column0", "column1", "column2", "column3", "column5"],
            displayField : "column3",
            valueField : "column0",
            othervalue : "column5",
            scriptPath : 'wfs',
            sqlFile : 'selectperiod'
    	});
    	
    	this.profitaccount = new gl.component.xychooseaccount(
		{
			id : 'profitaccount',
			anchor : '95%',
			codecondition  : "0,1,2,3,4,5,6,7,8,9,10",
    		labelStyle : 'text-align:right;',
    		isOnlyLastLevel : true ,
    		fieldLabel : '本年利润科目'
		});
    	
    	this.unprofitaccount = new gl.component.xychooseaccount(
		{
			id : 'unprofitaccount',
			anchor : '95%',
			codecondition  : "0,1,2,3,4,5,6,7,8,9,10",
    		labelStyle : 'text-align:right;',
    		isOnlyLastLevel : true ,
    		fieldLabel : '未分配利润科目'
		});
    	
    	this.buttons = new Ext.Button(
    	{
    		id : "buttons",
    		text :'生成结转凭证',
    		buttonAlign : 'center',
			handler : this.autoconvert,
			minWidth:70,
			scope : this
    	});
    	
    	var row0 =
        {
			layout : 'column',
            border : false,
            height : 35,
            items :[
            {
			    columnWidth : .02,
			    border : false,
			    height : 20
			},
			{
                columnWidth : .30,
                layout : 'form',
                border : false,
			    height : 20
            }
			,  
            {
	            columnWidth : .30,
	            layout : 'form',
	            border : false,
				height : 20
	        },
	        {
			    columnWidth : .20,
			    border : false,
			    height : 20
			},
			 {
                columnWidth : .30,
                layout : 'form',
                border : false,
			    height : 20
	        }
	        ]
        };
    	
    	var row1 =
        {
			layout : 'column',
            border : false,
            height : 35,
            items :[
            {
			    columnWidth : .02,
			    border : false,
			    height : 20
			},
			{
                columnWidth : .30,
                layout : 'form',
                border : false,
                defaults : 
                {
                    width : 170,
                    height : 20
                },
               items : [this.periodid],
			    height : 20
            }
			,  
            {
	            columnWidth : .30,
	            layout : 'form',
	            border : false,
				height : 20
	        },
	        {
			    columnWidth : .20,
			    border : false,
			    height : 20
			},
			 {
                columnWidth : .30,
                layout : 'form',
                border : false,
			    height : 20
	        }
	        ]
        };
    	var row2 =
        {
			layout : 'column',
            border : false,
            height : 35,
            items :[
            {
			    columnWidth : .02,
			    border : false,
			    height : 20
			},
			{
                columnWidth : .30,
                layout : 'form',
                border : false,
                defaults : 
                {
                    width : 170,
                    height : 20
                },
               items : [this.profitaccount],
			    height : 20
            }
			,  
            {
	            columnWidth : .30,
	            layout : 'form',
	            border : false,
				height : 20
	        },
	        {
			    columnWidth : .20,
			    border : false,
			    height : 20
			},
			 {
                columnWidth : .30,
                layout : 'form',
                border : false,
			    height : 20
	        }
	        ]
        };
    	
    	var row3 =
        {
			layout : 'column',
            border : false,
            height : 35,
            items :[
            {
			    columnWidth : .02,
			    border : false,
			    height : 20
			},
			{
                columnWidth : .30,
                layout : 'form',
                border : false,
                defaults : 
                {
                    width : 170,
                    height : 20
                },
               items : [this.unprofitaccount],
			    height : 20
            }
			,  
            {
	            columnWidth : .30,
	            layout : 'form',
	            border : false,
				height : 20
	        },
	        {
			    columnWidth : .20,
			    border : false,
			    height : 20
			},
			 {
                columnWidth : .30,
                layout : 'form',
                border : false,
			    height : 20
	        }
	        ]
        };
    	
    	var row4 =
        {
			layout : 'column',
            border : false,
            height : 35,
            items :[
            {
			    columnWidth : .11,
			    border : false,
			    height : 20
			},
			/*{
                columnWidth : .10,
                layout : 'form',
                border : false,
			    height : 20
            },
			 */ 
            {
	            columnWidth : .10,
	            layout : 'form',
	            border : false,
	            defaults : 
                {
                    width : 170,
                    height : 20
                },
                items : [this.buttons],
				height : 20
	        },
	        {
			    columnWidth : .20,
			    border : false,
			    height : 20
			},
			 {
                columnWidth : .30,
                layout : 'form',
                border : false,
			    height : 20
	        }
	        ]
        };
    	
    	this.items=[row0,row1,row2,row3,row4];
    	
    	gl.vouchermanager.periodendmanager.carryover.superclass.initComponent.call(this); 
    	
    	this.getPeriod();
    	this.getRemberAccount();
	},
	
	//获得历史的科目信息
	getRemberAccount : function()
	{
		Ext.Ajax.request(
		{		  
			url : "vouchermanager/periodendmanager/getRember", 
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success) 
				{
					 this.data = 
	    			{
						id : r.accountid,
						varaccountcode : r.accountcode,
						text : r.accountname
	    			}
					
					 this.undata = 
	    			{
						id : r.unaccountid,
						varaccountcode : r.unaccountcode,
						text : r.unaccountname
	    			}
					
					Ext.getCmp("profitaccount").hiddenData = data;
					Ext.getCmp("profitaccount").setXyValue(data);
					
					Ext.getCmp("unprofitaccount").hiddenData = undata;
					Ext.getCmp("unprofitaccount").setXyValue(undata);
				}
			}
		});
	},
	
	//默认会计期
	getPeriod : function()
	{
		var obj = {"flag":"1"};
		Ext.Ajax.request(
		{		  
			url : "voucherbook/aldetailbook/getPeriod", 
			params :
			{	
				jsonCondition : Ext.encode(obj)
          	},
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success) 
				{
					var data = 
	    			{
						column0 : r.uqglobalperiodid,
						column1 : r.intyearmonth,
						column2 : r.dtend,
	    				column3 : r.varname,
	    				column4 : r.dtbegin,
	    				column5 : r.dtend
	    			}
					Ext.getCmp("periodid").hiddenData = data;
					Ext.getCmp("periodid").setXyValue(data);
				}
			}
		});
	},
	//自动结转的 事件
	autoconvert : function ()
	{
		var profitaccount = this.profitaccount.getXyValue();
		var unprofitaccount = this.unprofitaccount.getXyValue();
		var uqglobalperiodid = this.periodid.getXyValue();
		var dtend = this.periodid.getOtherValue();
		
		var obj =
		{
			profitaccount : profitaccount,
			unprofitaccount : unprofitaccount,
			dtend	:	dtend,
			uqglobalperiodid  : uqglobalperiodid
		}
		
		Ext.Msg.confirm("提示", "将根据你所选的会计期、本年利润科目和未分配利润科目，" +"<br/>"+
				"&nbsp&nbsp&nbsp&nbsp&nbsp自动生成所有损益类科目的结转凭证，是否继续?", function(btn)
		{
			if (btn == "yes") 
			{				
				Ext.Ajax.request(
				{
					url : "vouchermanager/periodendmanager/autoconvert",
					method : "post",
					params :
					{
						jsonCondition : Ext.encode(obj)
	              	},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success) 
						{
							Ext.Msg.alert("提示", "已结转！请自行审核");
						}
						else
						{
							Ext.Msg.alert("错误", r.errDesc);
						}
					},
					failure : function(response)
        			{
        				Ext.Msg.alert("错误","操作失败！");
        				return;
        			},
					scope:this
				});
			}
		},this);
	}
});

function init()
{
	new Ext.Viewport(
	{
		layout : 'fit',
		items : [ new gl.vouchermanager.periodendmanager.carryover ]
	});
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);