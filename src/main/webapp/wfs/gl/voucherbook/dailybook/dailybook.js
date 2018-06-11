Ext.namespace("wfs.gl.voucherbook.dailybook");

wfs.gl.voucherbook.dailybook.QueryFormPanel = Ext.extend(Ext.FormPanel, 
{
	frame : true,
	labelWidth : 100,
	labelAlign : "right",
	width : 500,
	height : 400,
	xy_MainPanel : null,
	initComponent : function() 
	{
		
		this.startAccount = new gl.component.xychooseaccount(
		{
			id : 'startaccount',
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		codecondition : '5,6',
    		fieldLabel : '科目从'
		});
		
		//定义科目结束组件
		this.endAccount = new gl.component.xychooseaccount(
		{
			id : 'endaccount',
			anchor : '95%',
			codecondition : '5,6',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '到'
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
		    fields : ["column0", "column1", "column2", "column3", "column4", "column5"],
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
    		fields : ["column0", "column1", "column2", "column3", "column4", "column5"],
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
		
		//定义“显示科目级”组件
		this.accountLevel = new Ext.app.XyComboBoxCom(
    	{
    		id : 'accountlevel',
    		//width : 150,
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '显示科目级 ',
    		XyAllowDelete : false,
    		hiddenData : {column0 : 99, column1 : '末级科目'},
    		rootTitle :'',
    		fields : [ "column0", "column1"],
    		displayField :"column1",
    		valueField :"column0",
    		scriptPath :'wfs',
    		sqlFile :'selectaccountlevel'
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
			//fieldLabel : "无年初数，发生数的科目不显示",
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
			//fieldLabel : "逐笔显示余额",
			checked : false           //默认未选中
		});
		
    	//调整显示的样式
    	this.row2 =
		{
			layout : "column",
			border : false,
			items : [
			{
			    columnWidth : .33,
			    border : false,
			    height : 20
			},
			{
                columnWidth : .07,
                border : false,
                items : [this.isSeveral]
            }, {
                columnWidth : .57,
                border : false,
                items : [this.isSeverallabel]
            }]
		};
    	//调整显示的样式
    	this.row3 =
		{
			layout : "column",
			border : false,
			items : [
			{
			    columnWidth : .33,
			    border : false,
			    height : 20
			},
			{
                columnWidth : .07,
                border : false,
                items : [this.isAllDisplayed]
            }, {
                columnWidth : .57,
                border : false,
                items : [this.isAllDisplayedlabel]
            }]
		};
    	//定义items
    	this.items = [this.startAccount,this.endAccount,this.startPeriod,this.endPeriod,this.intStatus,
    	         this.accountLevel,this.row2,this.row3 ];

		wfs.gl.voucherbook.dailybook.QueryFormPanel.superclass.initComponent.call(this);
		this.getPeriod();
	},
	
	getPeriod : function()
	{
		var obj = {"flag":"1"};
		Ext.Ajax.request(
		{		  
			url : "voucherbook/aldetailbook/getPeriod",  //
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
	
	query : function() 
	{		
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
		var accountlevel = this.accountLevel.getXyValue();
		
		//获取显示的科目等级组件显示的值
		var accountleveldisplay = this.accountLevel.getDisplayValue();
		
		//获取“无年初数，发生数的科目不显示”复选框的值，当复选框被选中时，将 1 赋值给islastlevel，并传到后台
		var isseveral = this.isSeveral.getValue() ? 1 : 0;
		
		//获取“逐笔显示余额”复选框的值，当复选框被选中时，将 1 赋值给islastlevel，并传到后台
		var isalldisplayed = this.isAllDisplayed.getValue() ? 1 : 0;
		
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
		
		var obj = 
		{
			startaccountcode : startaccountcode,
			endaccountcode : endaccountcode,
			startperiod : startperiod,
			endperiod : endperiod,
			intstatus : intstatus,
			accountlevel : accountlevel,
			islastlevel : 0,
			isseveral : isseveral,
			isalldisplayed : isalldisplayed
		};
		
		Ext.Ajax.request(
		{
			url : "wfs/voucherbook/dailybook/gettableName",
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
					    accountleveldisplay : accountleveldisplay
					};
					
					this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
					{
						/**
						 * 报表jasper文件路径(非url)，从webapp/webRoot目录算起
						 */
						jasper : "/wfs/gl/voucherbook/dailybook/dailybook_see.jrxml",
						/**
						 * (导出)报表jasper文件路径(非url)，从webapp/webRoot目录算起
						 */
						jasper_export : "/wfs/gl/voucherbook/dailybook/dailybook.jrxml",
						/**
						 * 报表标题，必填
						 */
						title : "日记账",
						/**
						 * 导出/下载默认文件名
						 */
						fileName : "日记账",
						/**
						 * 报表查询参数
						 */
						jsonCondition : Ext.encode(params)
					},
					/**
					 * 报表查询url，与Action的@RequestMapping保持一致
					 */
					"/wfs/voucherbook/dailybook");
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
	var pnlMain = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : wfs.gl.voucherbook.dailybook.QueryFormPanel,
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