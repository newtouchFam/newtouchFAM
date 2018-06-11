Ext.namespace("wfs.gl.voucherbook.aldetailperiodbook");

wfs.gl.voucherbook.aldetailperiodbook.QueryFormPanel = Ext.extend(Ext.FormPanel, 
{
	frame : true,
	labelWidth : 100,
	labelAlign : "right",
	width : 500,
	height : 300,
	xy_MainPanel : null,
	loadMask : true,
	
	initComponent : function() 
	{
		//选择科目组件   根据选择科目决定 选择分户显示的类别
    	this.Account = new gl.component.xychooseaccountle(
		{
			id : 'account',
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '科目'
		});
    	
    	//选择分户组件 根据选择的科目决定 分户显示的类别
    	this.Ledger = new Ext.app.xyledgertree(
    	{
    		id : 'ledgertree',
    		anchor : '95%',
    		labelStyle : 'text-align:right:',
    		fieldLabel : '分户',
    		ischeckaccount : true ,
    		issinglechecked : false
    	});
    		
		//会计期开始组件
		this.startPeriod = new Ext.app.XyComboBoxCom(
    	{
    		id : 'startperiod',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '会计期从',
    		XyAllowDelete : false,
    		rootTitle :'',
		    fields : ["column0", "column1", "column2", "column3"],
            displayField : "column3",
            valueField : "column1",
            scriptPath : 'wfs',
            sqlFile : 'selectperiod'
    	});

		//会计期结束组件
		this.endPeriod = new Ext.app.XyComboBoxCom(
    	{
    		id : 'endperiod',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '到',
    		XyAllowDelete : false,
    		rootTitle :'',
    		fields : ["column0", "column1", "column2", "column3"],
            displayField : "column3",
            valueField : "column1",
            scriptPath : 'wfs',
            sqlFile : 'selectperiod'
    	});
		
		//凭证状态组件
		this.intStatus = new Ext.app.XyComboBoxCom(
    	{
    		id : 'intstatus',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '凭证状态',
    		XyAllowDelete : false,
    		rootTitle :'',
    		fields : [ "column0" , "column1"],
    		displayField :"column1",
    		valueField :"column0",
    		scriptPath :'wfs',
    		hiddenData : {column0 : 0, column1 : '全部'},
    		sqlFile :'selectbookstatus'
    	});
		
		//选择显示的分户级别 组件
		this.LedgerLevel = new Ext.app.XyComboBoxCom(
    	{
    		id : 'LedgerLevel',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '显示分户级 ',
    		XyAllowDelete : false,
    		rootTitle :'',
    		fields : [ "column0" , "column1"],
    		displayField :"column1",
    		valueField :"column0",
    		scriptPath :'wfs',
    		hiddenData : {column0 : 99, column1 : '末级分户'},//默认为末级分户
    		sqlFile :'selectaccountlevel'
    	});
		
		//定义lable，调整显示的样式
		this.isSeverallabel = new Ext.form.Label(
        {
            id:"isseverallabel",
            text:"无年初数，发生数不显示"
        }); 
		
		//"无年初数，发生数不显示"复选框组件
		this.isSeveral = new Ext.form.Checkbox(
		{
			id : "isseveral",
			width : 20,
			checked : false           //默认未选中
		});
		
		this.isAllDisplayedlabel = new Ext.form.Label(
	    {
	          id:"isalldisplayed",
	          text:"逐笔显示余额"
	    });
	
		//"逐笔显示余额"复选框组件
		this.isAllDisplayed = new Ext.form.Checkbox(
		{
			id : "isalldisplayed",
			width : 20,
			checked : false           //默认未选中
		});
		
    	// 是否 无年初数,发生数不显示
    	this.row1 =
		{
			layout : "column",
			border : false,
			items : [
			{
			    columnWidth : .34,
			    border : false,
			    height : 20
			},
			{
                columnWidth : .07,
                border : false,
                items : [this.isSeveral]
            }, 
            {
                columnWidth : .57,
                border : false,
                items : [this.isSeverallabel]
            }]
		};
    	
    	// 是否逐笔显示余额
    	this.row2 =
		{
			layout : "column",
			border : false,
			items : [
			{
			    columnWidth : .34,
			    border : false,
			    height : 20
			},
			{
                columnWidth : .07,
                border : false,
                items : [this.isAllDisplayed]
            }, 
            {
                columnWidth : .57,
                border : false,
                items : [this.isAllDisplayedlabel]
            }]
		};
    	
    	//items接收组件
    	this.items = [this.Account,this.Ledger,this.startPeriod,this.endPeriod,this.intStatus,
 	    	         this.LedgerLevel,this.row1,this.row2];
    	
    	this.Account.on("valuechange",this.getledgerparams.createDelegate(this));
    	//调用构造器
    	wfs.gl.voucherbook.aldetailperiodbook.QueryFormPanel.superclass.initComponent.call(this);
    	
    	this.getPeriod();
	
	},
	
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
					Ext.getCmp("startperiod").hiddenData = data;
					Ext.getCmp("endperiod").hiddenData = data;
					Ext.getCmp("startperiod").setXyValue(data);
					Ext.getCmp("endperiod").setXyValue(data);
				}
			}
		});
		
	},
	
	getledgerparams : function(oldvalue,newvalue)
	{
    	var data = 
		{
			id :'',
			text : ''
		};
		Ext.getCmp("ledgertree").hiddenData = data;
		Ext.getCmp("ledgertree").setXyValue(data);
		
		var accountcode = this.Account.getCodeValue();

    	Ext.getCmp("ledgertree").param = 
    	[{
			name :'accountcode',
			value :accountcode
		}];
    	
    	Ext.getCmp("ledgertree").reload();
	},

	//query方法
	query : function() 
	{
		
		var account = this.Account.getCodeValue();	//开始科目code
		var ledgerdetailid = this.Ledger.ledgerdetailid ; //分户明细ID 1,2,3
		var ledgertypeid = this.Ledger.ledgertypeid ; //分户类别ID 1,2,3
		var beginyearmonth = this.startPeriod.getXyValue();		//开始会计期
		var endyearmonth = this.endPeriod.getXyValue();			//结束会计期
		var intstatus = this.intStatus.getXyValue();			//凭证状态
		var ledgerlevel = this.LedgerLevel.getXyValue();		//显示到分户级别
		var startperiod = this.startPeriod.getDisplayValue();	//获得开始会计期名称
		var endperiod = this.endPeriod.getDisplayValue();		//获得结束会计期名称
		var disledgerlevel = this.LedgerLevel.getDisplayValue(); //获得显示分户级别
		var accountname = this.Account.getValue(); //获得显示科目名称
		
		//判断是否为空 必选的条件是否为空  给出提示
		if(account == null || account == "")
		{
			Ext.Msg.alert('提示','请选择科目!');	
			return;
		}
		
		if((ledgerdetailid == null || ledgerdetailid =="")&&(ledgertypeid == null || ledgertypeid==""))
		{
			Ext.Msg.alert("提示", "请选择分户");
			return ;
		}
		
		if(beginyearmonth == null || beginyearmonth == "")
		{
			Ext.Msg.alert('提示','请选择开始会计期!');  
			return;
		}
		
		if(endyearmonth == null || endyearmonth == "")
		{
			Ext.Msg.alert('提示','请选择结束会计期!');  
			return;
		}
		
		if(beginyearmonth > endyearmonth)
		{
			Ext.Msg.alert('提示','会计期顺序有误!');  
			return;
		}
		
		if(ledgerdetailid == null && ledgerdetailid == "")
		{
			ledgerdetailid = '';
		}
		
		if(ledgertypeid == null && ledgertypeid == "")
		{
			ledgertypeid = aa ;
		}
		
		var isallzerodata = this.isSeveral.checked ? 1 : 0;			//是否无年初数不显示
		var isallbalance = this.isAllDisplayed.checked ? 1 : 0; 	//是否逐笔显示余额
		
		var param =
		{
				account : account ,					//科目code
				ledgerdetailid : ledgerdetailid,	//分户明细id
				ledgertypeid : ledgertypeid,		//分户类别id
				beginyearmonth : beginyearmonth ,	//会计期开始
				endyearmonth : endyearmonth ,		//结束会计期
				intstatus	: intstatus ,			//凭证状态
				ledgerlevel : ledgerlevel ,			//分户等级
				isallzerodata : isallzerodata,		//物期初数,发生数不显示
				isallbalance : isallbalance 		//逐笔显示余额
		};
		
		Ext.Ajax.request(
		{
			url : "voucherbook/aldetailbook/getTableName",
			params :
			{
				jsonCondition : Ext.encode(param)
          	},
          	timeout:1800000,
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success) 
				{
					var params = 
					{
							accountname : accountname ,
							startperiod : startperiod ,
							endperiod : endperiod ,
							disledgerlevel : disledgerlevel,
							tablename : r.tablename
					};
					
					this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
					{
						/**
						 * 报表jasper文件路径(非url)，从webapp/webRoot目录算起	period
						 */
						jasper : "wfs/gl/voucherbook/aldetailperiodbook/aldetailperiodbook.jasper",
						
						jasper_export : "wfs/gl/voucherbook/aldetailperiodbook/aldetailbook.jasper",
						/**
						 * 报表标题，必填
						 */
						title : "科目分户明细账",
						/**
						 * 导出/下载默认文件名
						 */
						fileName : "科目分户明细账",
						/**
						 * 报表查询参数
						 */
						jsonCondition : Ext.encode(params)
					}, 
					/**
					 * 报表查询url，与Action的@RequestMapping保持一致
					 */
					"/voucherbook/aldetailbook");
				}
				else
				{
					Ext.Msg.alert("错误", r.errDesc);
				}
			},
			failure : function(response)
			{
				Ext.Msg.alert("错误","失败！");
				return;
			},
			scope:this
		});
	}
});

function init() 
{
	var pnlMain = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : wfs.gl.voucherbook.aldetailperiodbook.QueryFormPanel,
		xy_QueryWindowWidth : 330,
		xy_QueryWindowHeight : 350,
		xy_Limit : 300,
		xy_MaxLimit : 1500,
		abovelimitconfirm : true
	});

	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [pnlMain]
	});
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);