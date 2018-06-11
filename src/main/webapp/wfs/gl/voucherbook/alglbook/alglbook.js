Ext.namespace("gl.voucherbook.alglbook");
var framename = this.name;

gl.voucherbook.alglbook.QueryFormPanel = Ext.extend(Ext.FormPanel,
{	
	frame : true,
	labelWidth : 100,
	labelAlign : "right",
	width : 500,
	height : 400,
	xy_MainPanel : null,
	initComponent : function()
	{
		//定义科目编码组件
		this.accountCode = new gl.component.xychooseaccount(
		{
			id : 'startaccount',
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '科目'
		});
		
		//定义分户组件,必需先选择科目
		this.ledger = new Ext.app.xyledgertree(
		{
		    		id : 'ledgertree',
		    		anchor : '95%',
		    		labelStyle : 'text-align:right:',
		    		fieldLabel : '分户',
		    		issinglechecked : false,
		    		ischeckaccount : true
		 });
		
		//定义会计期开始组件
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

		//定义会计期结束组件
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
		
		//定义凭证状态组件
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
    		hiddenData : {column0 : 0, column1 : '全部'},
    		scriptPath :'wfs',
    		sqlFile :'selectbookstatus'
    	});
	    //监听事件
		this.accountCode.on("valuechange",this.getledgerparams.createDelegate(this));
		
		this.items = [this.accountCode,this.ledger,this.startPeriod,this.endPeriod,this.intStatus];
		 
		gl.voucherbook.alglbook .QueryFormPanel.superclass.initComponent.call(this);
		
		this.getPeriod();
		
	},
	
	getPeriod : function()
	{
		var obj = {"flag":"1"};
		Ext.Ajax.request(
		{		  
			url : "voucherbook/aldetailbook/getPeriod", //
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
	
	//监听的方法
	getledgerparams : function(oldvalue,newvalue)
	{
    	var data = 
		{
			id :'',
			text : ''
		};
		Ext.getCmp("ledgertree").hiddenData = data;
		Ext.getCmp("ledgertree").setXyValue(data);
		
		var accountcode = this.accountCode.getCodeValue();

    	Ext.getCmp("ledgertree").param = 
    	[{
			name :'accountcode',
			value :accountcode
		}];
    	Ext.getCmp("ledgertree").reload();
	},
	
	query : function ()
	{
		
	
		 var accountname  = this.accountCode.getValue(); //科目名称
		//查询之前,做科目是否为空的判断
		var accountcode = this.accountCode.getCodeValue();
		if(accountcode == '' || accountcode == null)
		{
			Ext.Msg.alert("提示","请先选择科目");
			return;
		}
		
		//查询之前,做分户是否为空的判断,分户类别和分户项目的判断   this.ledger.ledgerdetailid;
		var ledgerdetailid = this.ledger.ledgerdetailid;
		var ledgertypeid = this.ledger.ledgertypeid;
		if((ledgerdetailid == '' || ledgerdetailid == null) && (ledgertypeid == ''|| ledgertypeid == null ))
		{
			Ext.Msg.alert("提示","请先选择分户");
			return;
		}
		
		//查询之前,做会计期校验判断	
		var startPeriod = this.startPeriod.getXyValue();
		var endPeriod = this.endPeriod.getXyValue();
		
		if((null != startPeriod && startPeriod != ""
			&& null != endPeriod && endPeriod != "")
		&&(startPeriod>endPeriod))
		{
			Ext.MessageBox.alert("提示","起始会计期不能大于结束会计期!");
			return;
		}
		
		if(startPeriod == '' || startPeriod == null)
		{
			Ext.Msg.alert("提示","请先选择开始会计期");
			return;
		}
		
		if(endPeriod == '' || endPeriod == null)
		{
			Ext.Msg.alert("提示","请先选择结束会计期");
			return;
		}
		
		var intstatus = this.intStatus.getXyValue();
		
		if(ledgerdetailid == null && ledgerdetailid == "")
		{
			ledgerdetailid = '';
		}
		
		if(ledgertypeid == null && ledgertypeid == "")
		{
			ledgertypeid = '';
		}
		
		if(intstatus == null || intstatus == "")
		{
			intstatus = 0 ;
		}
		
		var param =
		{
			accountcode       : this.accountCode.getCodeValue(),  //开始科目
			ledgertypeid      : this.ledger.ledgertypeid,  //分户类别id
			ledgerdetailid    : this.ledger.ledgerdetailid,  //分户项目id
			beginyearmonth    : this.startPeriod.getXyValue(),  //开始会计期
			endyearmonth      : this.endPeriod.getXyValue(),//结束会计期
			intstatus         : intstatus //凭证状态
			
		};					
		
		//先通过调用存储过程获取需要查询的表名
		Ext.Ajax.request(
		{
			url : "voucherbook/alglbook/getTableName", //action中的存储过程的方法获取的表名
			params :
			{
				jsonCondition : Ext.encode(param)
          	},
          	timeout:180000,
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success) 
				{
					var startperiod = this.startPeriod.getDisplayValue();	//获得开始会计期名称
					var endperiod = this.endPeriod.getDisplayValue();		//获得结束会计期名称
					var params =
					{
						accountname       : this.accountCode.getValue(),  
						ledgertypeid      : this.ledger.ledgertypeid,  //分户类别id
						ledgerdetailid    : this.ledger.ledgerdetailid,  //分户项目id
						startperiod    : startperiod,  //开始会计期
						endperiod      : endperiod,//结束会计期
					    tablename         : r.tablename
					};	
					
					this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
					{
						/**
						 * 报表jasper文件路径(非url)，从webapp/webRoot目录算起	period
						 */
						jasper : "wfs/gl/voucherbook/alglbook/alglbook.jasper",
						
						jasper_export : "wfs/gl/voucherbook/alglbook/alglbooks.jasper",
						/**
						 * 报表标题，必填
						 */
						title : "科目分户总账",
						/**
						 * 导出/下载默认文件名
						 */
						fileName : "科目分户总账",
						/**
						 * 报表查询参数
						 */
						jsonCondition : Ext.encode(params)
					}, 
					/**
					 * 报表查询url，与Action的@RequestMapping保持一致
					 */
					"/voucherbook/alglbook");
				}
				else
				{
					Ext.Msg.alert("错误", r.msg);
				}
			},
			failure : function(response)
			{
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
		xy_QueryPanel : gl.voucherbook.alglbook.QueryFormPanel,
		xy_QueryWindowWidth : 330,
		xy_QueryWindowHeight : 260,
		xy_Limit : 300,
		xy_MaxLimit : 1500,
		abovelimitconfirm : true
	});

	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ pnlMain ]
	});
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);