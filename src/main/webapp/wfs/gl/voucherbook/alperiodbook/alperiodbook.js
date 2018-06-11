Ext.namespace("gl.voucherbook.alperiodbook");

gl.voucherbook.alperiodbook.QueryFormPanel = Ext.extend(Ext.FormPanel, 
{
	frame : true,
	labelWidth : 100,
	labelAlign : "right",
	width : 500,
	height : 300,
	xy_MainPanel : null,
	initComponent : function() 
	{
		
		this.account = new gl.component.xychooseaccountle(
		{
			id : 'account',
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		//codecondition : '5,6',
    		fieldLabel : '科目'
		});
		
		this.ledger = new Ext.app.xyledgertree(
		{
			id : 'ledgertree',
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '分户',
    		issinglechecked : false, //判断是否单选
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
    		//width : 100,
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '凭证状态',
    		XyAllowDelete : false,
    		hiddenData : {column0 : 0, column1 : '全部'},
    		rootTitle :'',
    		fields : [ "column0", "column1"],
    		displayField :"column1",
    		valueField :"column0",
    		scriptPath :'wfs',
    		sqlFile :'selectbookstatus'
    	});
		
		
    	//定义items
    	this.items = [this.account,this.ledger,this.startPeriod,this.endPeriod,this.intStatus ];

    	//给科目添加监听，当科目的值改变时，分户能选择的值也要从新选择
    	this.account.on("valuechange",this.getledgerparams,this);
    	
    	gl.voucherbook.alperiodbook.QueryFormPanel.superclass.initComponent.call(this);
    	
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
	
	//给分户组件传参
	getledgerparams : function(oldvalue,newvalue)
	{
    	var data = 
		{
			id :'',
			text : ''
		};
		Ext.getCmp("ledgertree").hiddenData = data;
		Ext.getCmp("ledgertree").setXyValue(data);
		
		var accountcode = this.account.getCodeValue();

    	Ext.getCmp("ledgertree").param = 
    	[{
			name :'accountcode',
			value :accountcode
		}];
    	Ext.getCmp("ledgertree").reload();
	},
	
	query : function() 
	{	
		//分户明细id，是一个连接的字符串，如aaa,bbb,ccc
		var ledgerdetailid = this.ledger.ledgerdetailid;
		
		//分户类别id,是一个连接的字符串，如aaa,bbb,ccc
		var ledgertypeid = this.ledger.ledgertypeid;
		
		//获取开始科目编码
		var accountcode = this.account.getCodeValue();
		
		//获取科目名称
		var accountname = this.account.getValue();
		
		//获取开始会计期年月
		var startperiod = this.startPeriod.getXyValue();
		
		//获取开始会计期年月组件显示的值
		var startperioddisplay = this.startPeriod.getDisplayValue();
		
		//获取结束会计期年月
		var endperiod =	this.endPeriod.getXyValue();
		
		//获取结束会计期年月组件显示的值
		var endperioddisplay =	this.endPeriod.getDisplayValue();
		
		//获取凭证状态
		var intstatus = this.intStatus.getXyValue();
//test
		
		if(accountcode==null||accountcode==undefined||accountcode=="")
		{
			Ext.Msg.alert("提示", "请选择科目");
			return false;
		};
		
		//accountcode = "7001";
		//accountname = "分户科目测试aaa";

//test
				
		if((ledgerdetailid==null||ledgerdetailid==undefined||ledgerdetailid=="")&&
				(ledgertypeid==null||ledgertypeid==undefined||ledgertypeid==""))
		{
			Ext.Msg.alert("提示", "请选择分户");
			return false;
		}
		
		//ledgertypeid = "A5EF1F96-0555-4449-BDCA-6EDD9086399C";
		//ledgerdetailid = "5760d6a4-41ef-11e7-b2fe-00188b72b4cf";
		
		if(startperiod==null||startperiod==undefined||startperiod=="")
		{
			Ext.Msg.alert("提示", "请选择开始会计期");
			return false;
		};
		if(endperiod==null||endperiod==undefined||endperiod=="")
		{
			Ext.Msg.alert("提示", "请选择结束会计期");
			return false;
		};
		
		if(endperiod<startperiod)
		{
			Ext.Msg.alert("提示", "结束会计期不应小于开始会计期");
			return false;
		};
		
		var obj = 
		{
			accountcode : accountcode,
			ledgerdetailid : ledgerdetailid,
			ledgertypeid : ledgertypeid,
			startperiod : startperiod,
			endperiod : endperiod,
			intstatus : intstatus
		};
		
		Ext.Ajax.request(
		{
			url : "voucherbook/alperiodbook/gettablename",
			params :
			{
				jsonCondition : Ext.encode(obj)
          	},
          	timeout:180000,
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success)
				{
					var params = 
					{ 
						tablename : r.tablename,
						startperioddisplay : startperioddisplay, 
						endperioddisplay :  endperioddisplay,
						accountname: accountname
					};
					
					this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
					{
						/**
						 * 报表jasper文件路径(非url)，从webapp/webRoot目录算起
						 */
						jasper : "/wfs/gl/voucherbook/alperiodbook/alperiodbook_look.jasper",
						/**
						 * (导出)报表jasper文件路径(非url)，从webapp/webRoot目录算起
						 */
						jasper_export : "/wfs/gl/voucherbook/alperiodbook/alperiodbook.jasper",
						/**
						 * 报表标题，必填
						 */
						title : "科目分户余额表",
						/**
						 * 导出/下载默认文件名
						 */
						fileName : "科目分户余额表",
						/**
						 * 报表查询参数
						 */
						jsonCondition : Ext.encode(params)
					},
					/**
					 * 报表查询url，与Action的@RequestMapping保持一致
					 */
					"/voucherbook/alperiodbook");
				}
				else
				{
					Ext.Msg.alert("错误", r.msg);
				}
			},
			failure : function(response)
			{
				Ext.Msg.alert("错误","查询失败！");
				return;
			},
			scope:this
		});	
		
	}
});

function init() {
	var pnlReportMain = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : gl.voucherbook.alperiodbook.QueryFormPanel,
		xy_QueryWindowWidth : 330,
		xy_QueryWindowHeight : 300,
		xy_Limit : 300,
		xy_MaxLimit : 1500,
		abovelimitconfirm : true
	});

	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [pnlReportMain]
	});
	
};

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);