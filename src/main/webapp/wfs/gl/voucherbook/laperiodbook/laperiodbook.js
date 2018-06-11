Ext.namespace("wfs.gl.voucherbook.laperiodbook");

wfs.gl.voucherbook.laperiodbook.QueryFormPanel = Ext.extend(Ext.FormPanel, 
{
	frame : true,
	labelWidth : 100,
	labelAlign : "right",
	width : 500,
	height : 300,
	xy_MainPanel : null,
	//定义组件
	initComponent : function() 
	{
		//分户查询组件xyledgertree
		this.ledger = new Ext.app.xyledgertree(
		{
			id : 'ledger',
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '分户类型',
    		leafSelect : false, //支持中间级选择
    		issinglechecked : true //仅单选
		});
		
		//科目查询开始组件xychooseaccount
		this.startAccount = new gl.component.xychooseaccount(
		{
			id : 'startaccount',
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '科目从'
		});
		
		//科目查询结束组件xychooseaccount
		this.endAccount = new gl.component.xychooseaccount(
		{
			id : 'endaccount',
			anchor : '95%',
			labelStyle : 'text-align:right;',
			fieldLabel : '到'
		});
		
		//会计期开始组件XyComboBoxCom
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
		
		//会计期结束组件XyComboBoxCom
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
		
		//定义凭证状态组件XyComboBoxCom
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
		
		//定义显示科目级组件XyComboBoxCom
		this.accountlevel = new Ext.app.XyComboBoxCom(
    	{
    		id : 'accountlevel',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '显示科目级 ',
    		XyAllowDelete : false,
    		rootTitle :'',
    		fields : [ "column0" , "column1"],
    		displayField :"column1",
    		valueField :"column0",
    		scriptPath :'wfs',
    		hiddenData : {column0 : 99, column1 : '末级科目'},
    		sqlFile :'selectaccountlevel'
    	});
		
		//items添加组件 
		this.items = [this.ledger,this.startAccount,this.endAccount,this.startPeriod,this.endPeriod,
    	              this.intStatus,this.accountlevel];
		
		//调用父类构造器
		wfs.gl.voucherbook.laperiodbook.QueryFormPanel.superclass.initComponent.call(this);
		
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
	//获取用户的选择值 封装
	query : function() 
	{
		//获取分户明细ID
		var ledgerdetailid = this.ledger.ledgerdetailid;
		
		//获取分户类型ID
		var ledgertypeid = this.ledger.ledgertypeid;
		
		//获取所选分户的文本值
		var ledgername = this.ledger.getDisplayValue() ;
		
		//获取开始科目编码
		var startaccountcode = this.startAccount.getCodeValue();
		
		//获取结束科目编码
		var endaccountcode = this.endAccount.getCodeValue();
		
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
		
		//获取显示到的科目等级
		var accountlevel = this.accountlevel.getXyValue();
		
		//获取显示的科目等级组件显示的值
		var accountleveldisplay = this.accountlevel.getDisplayValue();
		
		//对用户的选择信息进行校验
		if((ledgerdetailid==null||ledgerdetailid==undefined||ledgerdetailid.length<=0)
				&&(ledgertypeid==null||ledgertypeid==undefined||ledgertypeid.length<=0))
		{
			Ext.Msg.alert("提示", "请选择分户");
			return false;
		};
		if(startaccountcode==null||startaccountcode==undefined||startaccountcode.length<=0)
		{
			Ext.Msg.alert("提示", "请选择开始科目");
			return false;
		};
		if(endaccountcode==null||endaccountcode==undefined||endaccountcode.length<=0)
		{
			Ext.Msg.alert("提示", "请选择结束科目");
			return false;
		};
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
		if(endaccountcode<startaccountcode)
		{
			Ext.Msg.alert("提示", "结束科目不应小于开始科目");
			return false;
		};
		if(endperiod<startperiod)
		{
			Ext.Msg.alert("提示", "结束会计期不应小于开始会计期");
			return false;
		};
		//封装信息
		var obj = 
		{
			//封装用户的选择值
			ledgerdetailid : ledgerdetailid,
			ledgertypeid : ledgertypeid,
			beginaccount : startaccountcode,
			endaccount : endaccountcode,
			beginyearmonth : startperiod,
			endyearmonth : endperiod,
			intstatus : intstatus,
			accountlevel : accountlevel
		};
		
		//将用户数据添加到JSON中，发送请求
		Ext.Ajax.request(
		{
			url : "voucherbook/labook/getTableName",
			params :
			{
				jsonCondition : Ext.encode(obj)
			},
			timeout:1800000,
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success)
				{
					var params = 
					{ 
						tablename : r.tablename,
						ledgername : ledgername,
						startperioddisplay : startperioddisplay, 
						endperioddisplay :  endperioddisplay,
						accountlevel : accountleveldisplay
					};
					
					this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
					{
						/**
						 * 报表jasper文件路径(非url)，从webapp/webRoot目录算起	period
						 */
						jasper : "wfs/gl/voucherbook/laperiodbook/laperiodbookes.jasper",
						jasper_export : "wfs/gl/voucherbook/laperiodbook/laperiodbooks.jasper",
						/**
						 * 报表标题，必填
						 */
						title : "分户科目余额表",
						/**
						 * 导出/下载默认文件名
						 */
						fileName : "分户科目余额表",
						/**
						 * 报表查询参数
						 */
						jsonCondition : Ext.encode(params)
					}, 
					/**
					 * 报表查询url，与Action的@RequestMapping保持一致
					 */
					"/voucherbook/labook");
					
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

function init() 
{
	//new过滤条件弹出框，并设置属性
	var pnlMain = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : wfs.gl.voucherbook.laperiodbook.QueryFormPanel,
		xy_QueryWindowWidth : 330,
		xy_QueryWindowHeight : 350,
		xy_Limit : 300,
		xy_MaxLimit : 1500,
		abovelimitconfirm : true
	});
	
	//初始化面板 设置布局 添加过滤条件弹出框
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [pnlMain]
	});
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);