Ext.namespace("wfs.gl.voucherbook.trialtalance");

wfs.gl.voucherbook.trialtalance.QueryFormPanel = Ext.extend(Ext.FormPanel, 
{
	frame : true,
	labelWidth : 100,
	labelAlign : "right",
	width : 500,
	height : 300,
	xy_MainPanel : null,
	
	initComponent : function() 
	{
		//定义会计期开始组件
		this.period = new Ext.app.XyComboBoxCom(
    	{
    		id : 'startperiod',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '会计期',
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
    		scriptPath :'wfs',
    		hiddenData : {column0 : 0, column1 : '全部'},
    		sqlFile :'selectbookstatus'
    	});
		
    	//items接收组件
		this.items = [this.period,this.intStatus];
    	//调用构造器
		wfs.gl.voucherbook.trialtalance.QueryFormPanel.superclass.initComponent.call(this);
		
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
					Ext.getCmp("startperiod").setXyValue(data);
				}
			}
		});
		
	},
	
	//query方法
	query : function() 
	{
		//获取开始会计期年月
		var period = this.period.getXyValue();
		//获取会计期年月组件显示的值
		var perioddisplay = this.period.getDisplayValue();
		//获取凭证状态
		var intstatus = this.intStatus.getXyValue();
		
		if(period==null||period==undefined||period=="")
		{
			Ext.Msg.alert("提示", "请选择会计期!");
			return false;
		};
		
		var obj = 
		{
			yearmonth : period,
			intstatus : intstatus
		};
		
		Ext.Ajax.request(
		{
			url : "wfs/voucherbook/trialbalance/gettableName",
			params :
			{
				jsonCondition : Ext.encode(obj)
			},
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success)
				{
					var params = 
					{ 
						tablename : r.tablename,
						yearmonth : perioddisplay
					};
					
					this.xy_MainPanel.QueryPageEvent.call(this.xy_MainPanel,
					{
						/**
						 * 报表jasper文件路径(非url)，从webapp/webRoot目录算起
						 */
						jasper : "/wfs/gl/voucherbook/trialbalancebook/trialbalance_see.jrxml",
						/**
						 * (导出)报表jasper文件路径(非url)，从webapp/webRoot目录算起
						 */
						jasper_export : "/wfs/gl/voucherbook/trialbalancebook/trialbalance.jrxml",
						/**
						 * 报表标题，必填
						 */
						title : "试算平衡表",
						/**
						 * 导出/下载默认文件名
						 */
						fileName : "试算平衡表",
						/**
						 * 报表查询参数
						 */
						jsonCondition : Ext.encode(params)
					},
					/**
					 * 报表查询url，与Action的@RequestMapping保持一致
					 */
					"/wfs/voucherbook/trialbalance");
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
	var pnlMain = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : wfs.gl.voucherbook.trialtalance.QueryFormPanel,
		xy_QueryWindowWidth : 260,
		xy_QueryWindowHeight : 150,
		xy_Limit : 100,
		xy_MaxLimit : 1000,
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