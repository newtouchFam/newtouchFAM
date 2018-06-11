Ext.namespace("wfs.gl.voucherbook.ladetailperiodbook");

wfs.gl.voucherbook.ladetailperiodbook.QueryFormPanel = Ext.extend(Ext.FormPanel, 
{
	frame : true,
	labelWidth : 100,
	labelAlign : "right",
	width : 500,
	height : 300,
	xy_MainPanel : null,
	
	initComponent : function() 
	{	
		//分户组件
		this.ledger = new Ext.app.xyledgertree(
		{
			id : 'ledger',
			anchor : '95%',
		    labelStyle : 'text-align:right;',
		    fieldLabel : '分户',
		    leafSelect : false, //支持中间级选择
		    issinglechecked : true //仅单选
		});
		
		//科目开始组件
    	this.beginaccount = new gl.component.xychooseaccount(
		{
			id : 'startAccount',
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '科目从'
		});
    			
		//定义科目结束组件
		this.endAccount = new gl.component.xychooseaccount(
		{
			id : 'endaccount',
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '到'
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
		
		//“显示科目级”组件
		this.accountLevel = new Ext.app.XyComboBoxCom(
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
    		hiddenData : {column0 : 99, column1 : '末级科目'},//默认为末级科目
    		sqlFile :'selectaccountlevel'
    	});
		
		//定义lable，调整显示的样式
		this.isLastLevellabel = new Ext.form.Label(
        {
              id:"islastlevellabel",
              text:"是否只显示末级科目"
        }); 
		
		//"是否只显示末级科目"复选框组件
		this.isLastLevel = new Ext.form.Checkbox(
		{
			id : "islastlevel",
			width : 20,
			checked : false           //默认未选中
		});
		
		//定义lable，调整显示的样式
		this.isSeverallabel = new Ext.form.Label(
        {
            id:"isseverallabel",
            text:"无年初数，发生数的科目不显示"
        }); 
		
		//"无年初数，发生数的科目不显示"复选框组件
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
		
		// 是否只显示末级科目 复选框 
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
                items : [this.isLastLevel]
            }, 
            {
                columnWidth : .50,
                border : false,
                items : [this.isLastLevellabel]
            }]
		};
    	
    	// 是否 无年初数,发生数不显示
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
                items : [this.isSeveral]
            }, 
            {
                columnWidth : .57,
                border : false,
                items : [this.isSeverallabel]
            }]
		};
    	
    	// 是否逐笔显示余额
    	this.row3 =
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
    	this.items = [this.ledger, this.beginaccount, this.endAccount,
    	              this.startPeriod, this.endPeriod, this.accountLevel, 
    	              this.intStatus, this.row2, this.row3];
	
    	//调用构造器
    	wfs.gl.voucherbook.ladetailperiodbook.QueryFormPanel.superclass.initComponent.call(this);
    	
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
	//query方法
	query : function() 
	{
		
		var ledgerdetailid = this.ledger.ledgerdetailid;	    //分户ID
		var ledgertypeid = this.ledger.ledgertypeid;			//分户类型
		var beginaccount = this.beginaccount.getCodeValue();	//开始科目code
		var endaccount = this.endAccount.getCodeValue();		//结束科目code
		var beginyearmonth = this.startPeriod.getXyValue();		//开始会计期
		var endyearmonth = this.endPeriod.getXyValue();			//结束会计期
		var intstatus = this.intStatus.getXyValue();			//凭证状态
		var accountlevel = this.accountLevel.getXyValue();		//显示到科目级别
		var startperiod = this.startPeriod.getDisplayValue();	//获得开始会计期名称
		var endperiod = this.endPeriod.getDisplayValue();		//获得结束会计期名称
		var disaccountlevel = this.accountLevel.getDisplayValue(); //获得显示科目级别
		var ledgername = this.ledger.getDisplayValue();
		
		
		//判断是否为空 必选的条件是否为空  给出提示
		if((ledgerdetailid == null || ledgerdetailid =="" || ledgerdetailid== undefined)
				&& (ledgertypeid == null || ledgertypeid=="" || ledgertypeid== undefined))
		{
			Ext.Msg.alert("提示", "请选择分户");
			return ;
		}
		
		if(beginaccount == null || beginaccount == "")
		{
			Ext.Msg.alert('提示','请选择开始科目!');	
			return;
		}
		
		if(endaccount == null || endaccount == "")
        {
            Ext.Msg.alert('提示','请选择结束科目!');  
            return;
        }
		
		if(beginaccount > endaccount)
		{
			 Ext.Msg.alert('提示','科目范围有误!');  
	         return;
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
		
		var intislastlevel = this.isLastLevel.checked ? 1 : 0;		//是否只显示末级
		var isallzerodata = this.isSeveral.checked ? 1 : 0;			//是否无年初数不显示
		var isallbalance = this.isAllDisplayed.checked ? 1 : 0; 	//是否逐笔显示余额
		
		var param =
		{		
			ledgerdetailid 	 : ledgerdetailid,
			ledgertypeid : ledgertypeid,
			beginaccount : beginaccount ,
			endaccount 	 : endaccount ,
			beginyearmonth : beginyearmonth ,
			endyearmonth : endyearmonth ,
			intstatus	: intstatus ,
			accountlevel : accountlevel ,
			intislastlevel : intislastlevel,
			isallzerodata : isallzerodata,
			isallbalance : isallbalance 
		};
		
		Ext.Ajax.request(
		{
			url : "voucherbook/ladetailbook/getTableName",
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
						 ledgername  : ledgername,
					     startperiod : startperiod,
						 endperiod : endperiod,
						 disaccountlevel : disaccountlevel,
						 tablename : r.tablename
					};
					this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
					{
						/**
						 * 报表jasper文件路径(非url)，从webapp/webRoot目录算起	period
						 */
						jasper : "wfs/gl/voucherbook/ladetailperiodbook/ladetailbooks.jasper",
						jasper_export : "wfs/gl/voucherbook/ladetailperiodbook/ladetailbook.jasper",
						/**
						 * 报表标题，必填
						 */
						title : "分户科目明细账",
						/**
						 * 导出/下载默认文件名
						 */
						fileName : "分户科目明细账",
						/**
						 * 报表查询参数
						 */
						jsonCondition : Ext.encode(params)
					}, 
					/**
					 * 报表查询url，与Action的@RequestMapping保持一致
					 */
					"/voucherbook/ladetailbook");
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
		xy_QueryPanel : wfs.gl.voucherbook.ladetailperiodbook.QueryFormPanel,
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