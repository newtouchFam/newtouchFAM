Ext.namespace("gl.voucherbook.glbook");
var framename = this.name;

gl.voucherbook.glbook.QueryFormPanel = Ext.extend(Ext.FormPanel,
{	
	frame : true,
	labelWidth : 100,
	labelAlign : "right",
	width : 500,
	height : 400,
	xy_MainPanel : null,
	initComponent : function()
	{
		//定义开始科目组件
		this.startAccount = new gl.component.xyaccountinput(
		{
			id : 'startaccount',
			anchor : '95%',
			cashbank : "0",
    		labelStyle : 'text-align:right;',
    		fieldLabel : '科目从'
		});
		
		//定义科目结束组件
		this.endAccount = new gl.component.xyaccountinput(
		{
			id : 'endaccount',
			anchor : '95%',
			cashbank : "0",
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
		
		//定义“显示到科目级”组件
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
    		hiddenData : {column0 : 99, column1 : '末级科目'},
    		scriptPath :'wfs',
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
			checked : true           //默认选中
		});
		
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
                border : false
            }, 
            {
                columnWidth : .50,
                border : false
            }]
		};
		this.items = [this.startAccount,this.endAccount,this.startPeriod,this.endPeriod,this.intStatus,
		    	         this.accountLevel,this.row1];
		 
		gl.voucherbook.glbook .QueryFormPanel.superclass.initComponent.call(this);
		
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
	query : function ()
	{	
		//定义最终的变量
		var startAccount = null ;
		var endAccount = null ;
		//定义输入的
		
		startAccount = this.startAccount.getAccountValue();
		if(""==startAccount)
		{
			Ext.Msg.alert('提示','请选择开始科目!');  
	        return;
		}
		if("输入的编号格式有误"==startAccount)
		{
			Ext.Msg.alert('提示','输入的开始科目编号格式不是全数字!');  
	        return;
		}
		
		endAccount = this.endAccount.getAccountValue();
		
		if(""==endAccount)
		{
			Ext.Msg.alert('提示','请选择结束科目!');  
	        return;
		}
		if("输入的编号格式有误"==endAccount)
		{
			Ext.Msg.alert('提示','输入的结束科目编号格式不是全数字!');  
	        return;
		}
		
		if(endAccount+"" < startAccount+"")
		{
			Ext.Msg.alert('提示','科目范围有误!');  
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
		
		var accountLevel = this.accountLevel.getXyValue();
		
		if(intstatus == null || intstatus == "")
		{
			intstatus = 0 ;
		}
		
		if(accountLevel == null || accountLevel == "")
		{
			accountLevel = 99 ;
		}
		
		var param =
		{
			startAccount     : startAccount,  //开始科目
			endAccount       : endAccount,  //结束科目
			beginyearmonth     : this.startPeriod.getXyValue(),  //开始会计期
			endyearmonth      : this.endPeriod.getXyValue(),//结束会计期
			intstatus       : intstatus, //凭证状态
			accountLevel     : accountLevel,  //显示到科目级
		    isLastLevel      : this.isLastLevel.checked ? 1 : 0 //是否只显示末级科目
		};	
		
		//先通过调用存储过程获取需要查询的表名
		Ext.Ajax.request(
		{
			url : "wfs/voucherbook/glbook/gettableName", //action中的存储过程的方法获取的表名
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
					var params =
					{
						startAccount     : this.startAccount.getCodeValue(),  //开始科目
						endAccount       : this.endAccount.getCodeValue(),  //结束科目
						beginyearmonth   : this.startPeriod.getXyValue(),  //开始会计期
						endyearmonth     : this.endPeriod.getXyValue(),//结束会计期
						accountLevel     : this.accountLevel.getDisplayValue(),  //显示到科目级
					    tablename        : r.tablename
					};	
					
					
					this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
					{
						/**
						 * 报表jasper文件路径(非url)，从webapp/webRoot目录算起
						 */
						jasper : "/wfs/gl/voucherbook/glbook/glbook_see.jrxml",
						/**
						 * (导出)报表jasper文件路径(非url)，从webapp/webRoot目录算起
						 */
						jasper_export : "/wfs/gl/voucherbook/glbook/glbook.jrxml",
						/**
						 * 报表标题，必填
						 */
						title : "总分类账",
						/**
						 * 导出/下载默认文件名
						 */
						fileName : "总分类账",
						/**
						 * 报表查询参数
						 */
						jsonCondition : Ext.encode(params)
					},
					/**
					 * 报表查询url，与Action的@RequestMapping保持一致
					 */
					"/wfs/voucherbook/glbook");
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
		xy_QueryPanel : gl.voucherbook.glbook.QueryFormPanel,
		xy_QueryWindowWidth : 330,
		xy_QueryWindowHeight : 350,
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