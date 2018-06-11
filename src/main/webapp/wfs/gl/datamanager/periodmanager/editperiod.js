//---------------------弹出框界面---------------
Ext.namespace("wfs.gl.datamanager.editperiod");
wfs.gl.datamanager.editperiod.EditPeriodWin = Ext.extend(Ext.Window,
{
	title : '',
	enableColumnMove : false,
	enableHdMenu : false,
	border : false,
	buttonAlign : 'right',
	width : 600,
	height : 180,
    layout : 'fit',
    modal : true,
    record : null,
    resizable : false,
    periodmanagerPanel : null,
    
    initComponent : function()
    {
    	//会计期名称
    	this.edtVarName = new Ext.form.TextField(
    	{
    		id : 'varname',
    		fieldLabel : '会计期名称',
    		anchor : '97%',
			labelStyle : 'text-align:right;',
    		allowBlank : false,
			msgTarget : 'qtip'
    	});
    	//会计期年份
    	this.intYear = new Ext.app.XyComboBoxCom(
    	{
    		id : 'intyear',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '会计期年份',
    		XyAllowDelete : false,
    		rootTitle :'',
    		fields : [ "column0"],
    		displayField :"column0",
    		valueField :"column0",
    		scriptPath :'wfs',
    		sqlFile :'selectintyear'
    	});
    	//会计期月份
    	this.intMonth = new Ext.app.XyComboBoxCom(
    	{
    		id : 'intmonth',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '会计期月份',
    		XyAllowDelete : false,
    		rootTitle :'',
    		fields : [ "column0"],
    		displayField :"column0",
    		valueField :"column0",
    		scriptPath :'wfs',
    		sqlFile :'selectintmonth'
    	});
    	//给会计期月份加监听，根据所选月份来设置有效开始日期和有效结束日期
    	this.intMonth.on("valuechange",function()
		{
    		//当是新增时，会计期月份选在了1到12月，则有效开始日期和有效结束日期设置为所选月份的第一天和最后一天
    		if(this.title == "新增"&&this.intMonth.getXyValue()>0&&this.intMonth.getXyValue()<13)
    		{
    			//拼接日期，格式一定要是      月/日/年，这样才能用Date的方法
    			var tempDate = this.intMonth.getValue()+'/01/'+this.intYear.getValue();
    			var dt = new Date(tempDate);
    			this.dtBegin.setValue(dt.getFirstDateOfMonth().format('Y-m-d'));
    			this.dtEnd.setValue(dt.getLastDateOfMonth().format('Y-m-d'));
    		};
		},this);
    	//有效开始日期
    	this.dtBegin = new Ext.form.DateField(
    	{
    		id : "dtbegin",
    		fieldLabel : "有效开始日期", 
			labelStyle : 'text-align:right;',
    		anchor:'95%',
    		readOnly : true, 
			format : 'Y-m-d',
			value : new Date()
    	});
    	//有效结束日期
    	this.dtEnd = new Ext.form.DateField(
    	{
    		id : "dtend",
    		fieldLabel : "有效结束日期",
    		anchor : '95%',
			labelStyle : 'text-align:right;',
			readOnly : true, 
			format : 'Y-m-d',
			value : new Date()
    	});
    	
    	this.row1 =
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .50,
				layout : "form",
				border : false,
				items : [ this.intYear ]
			},
			{
				columnWidth : .50,
				layout : "form",
				border : false,
				items : [ this.intMonth ]
			}]
		};
    	this.row2 =
		{
			layout : "column",
			border : false,
			items : [
			{
				columnWidth : .50,
				layout : "form",
				border : false,
				items : [ this.dtBegin ]
			},
			{
				columnWidth : .50,
				layout : "form",
				border : false,
				items : [ this.dtEnd ]
			}]
		};
    	//定义FormPanel
    	this.formPanel = new Ext.form.FormPanel(
	    {
	    	width : 150,
	    	hight : 250,
	    	frame : true,
	    	items : [this.edtVarName, this.row1, this.row2]
	    	/*items : [this.edtVarName,this.intYear,this.intMonth,this.dtBegin,this.dtEnd]*/
	    });
    	this.items = [this.formPanel];
    	
    	//定义保存和取消两个按钮
    	this.buttons = [
    	{	
    	    text : '保存',
    	    handler : this.saveHandler,
    	    scope : this
    	 },
    	 {
    	    text : '取消',
    	    handler : function()
			{
			  this.close();
			},
    	    scope : this
    	 }];
    	wfs.gl.datamanager.editperiod.EditPeriodWin.superclass.initComponent.call(this);
    	//当window页面打开时，如果为修改，则给组件赋值
    	this.on("show",this.isEdit,this);
    },
	//保存按钮事件，根据点击主页面按钮的类型来判断调用的方法
	saveHandler : function()
	{
		
		//验证会计期名称是否为空
		if(this.edtVarName.getValue()==null||this.edtVarName.getValue()==undefined||this.edtVarName.getValue()=="")
		{
			Ext.Msg.alert("提示", "会计期名称不能为空");
			return false;
		};
		
		//验证会计期年份是否为空
		if(this.intYear.getXyValue()==null||this.intYear.getXyValue()==undefined||this.intYear.getXyValue()=="")
		{
			Ext.Msg.alert("提示", "会计期年份不能为空");
			return false;
		};
		//验证会计期月份是否为空,由于组件是数字类型的，当选择0时，默认为false,""也是false,所以最后加上一个字符窜来将数字转换成字符类型判断长度
		if(this.intMonth.getXyValue()==null||this.intMonth.getXyValue()==undefined||(this.intMonth.getXyValue()+'xx').length<=2)
		{
			Ext.Msg.alert("提示", "会计期月份不能为空");
			return false;
		};
		//验证有效开始日期是否为空
		if(this.dtBegin.getValue()==null||this.dtBegin.getValue()==undefined||this.dtBegin.getValue()=="")
		{
			Ext.Msg.alert("提示", "有效开始日期不能为空");
			return false;
		};
		//验证有效结束日期是否为空
		if(this.dtEnd.getValue()==null||this.dtEnd.getValue()==undefined||this.dtEnd.getValue()=="")
		{
			Ext.Msg.alert("提示", "有效结束日期不能为空");
			return false;
		};
		//验证有效开始日期是否大于有效结束日期
		if(this.dtEnd.getValue().format('Y-m-d') < this.dtBegin.getValue().format('Y-m-d'))
		{
			Ext.Msg.alert("提示", "有效开始日期不能大于有效结束日期");
			return false;
		};
		
		//给日期类对象添加日期差方法，返回日期与diff参数日期的时间差，单位为天(目前不用判断)
		/*Date.prototype.diff = function(date){
			return (this.getTime() - date.getTime())/(24 * 60 * 60 * 1000);
		};
		if(this.dtEnd.getValue().diff(this.dtBegin.getValue())>31)
		{
			return false;
		};*/
		
		if(this.title == "新增")
		{	
			var param = 
			{
				varname : this.edtVarName.getValue(),
				intyear : this.intYear.getXyValue(),
				intmonth : this.intMonth.getXyValue(),
				dtbegin : this.dtBegin.getValue().format('Y-m-d'),
				dtend : this.dtEnd.getValue().format('Y-m-d')
			}
			
			Ext.Ajax.request(
			{
				url : "datamanager/periodmanager/add",
				params :
				{
					jsonString : Ext.encode(param)
              	},
				success : function(response)
				{
					var r = Ext.decode(response.responseText);
					if (r.success)
					{
						Ext.Msg.alert("提示", "新增会计期成功！");
						this.close();
						this.periodmanagerPanel.store.reload();
					}
					else
					{
						Ext.Msg.alert("错误", r.msg);
					}
				},
				failure : function(response)
    			{
    				Ext.Msg.alert("错误","新增会计期失败！");
    				return;
    			},
				scope:this
			});
		}else
		{
			var param = 
			{
				uqglobalperiodids : this.record.get("uqglobalperiodid"),
				varname : this.edtVarName.getValue(),
				intyear : this.intYear.getValue(),
				intmonth : this.intMonth.getValue(),
				dtbegin : this.dtBegin.getValue().format('Y-m-d'),
				dtend : this.dtEnd.getValue().format('Y-m-d'),
				status : this.record.get("intstatus")
			}
			
			Ext.Ajax.request(
			{
				url : "datamanager/periodmanager/edit",
				params :
				{
					jsonString : Ext.encode(param)
              	},
				success : function(response)
				{
					var r = Ext.decode(response.responseText);
					if (r.success)
					{
						Ext.Msg.alert("提示", "修改会计期成功！");
						this.close();
						this.periodmanagerPanel.store.reload();
					}
					else
					{
						Ext.Msg.alert("错误", r.msg);
					}
				},
				failure : function(response)
    			{
    				Ext.Msg.alert("错误","修改会计期失败！");
    				return;
    			},
				scope:this
			});
		}	
	},
	//根据状态来判断组件的值是否能够被修改
	isEdit : function()
	{	
		
		if(this.title == "修改")
		{
			//如果时修改，则给组件赋值
			this.edtVarName.setValue(this.record.get("varname"));
			this.intYear.setXyValue(this.setYearMonthValue(this.record.get("intyear")));
			this.intMonth.setXyValue(this.setYearMonthValue(this.record.get("intmonth")));
			this.dtBegin.setValue(this.record.get("dtbegin"));
			this.dtEnd.setValue(this.record.get("dtend"));
			//当状态不为新增时，只有会计期名称能够修改
			if(this.record.get("intstatus") != 1 )
			{
				this.intYear.disable();
				this.intMonth.disable();
				this.dtBegin.disable();
				this.dtEnd.disable();
			}
		}else
		{
			//新增时，将当前年月给会计期年月，当前日期所在月的第一天和最后一天给有效开始日期和有效结束日期
			this.dtBegin.setValue(this.dtBegin.getValue().getFirstDateOfMonth().format('Y-m-d'));
			this.dtEnd.setValue(this.dtEnd.getValue().getLastDateOfMonth().format('Y-m-d'));
			this.intYear.setXyValue(this.setYearMonthValue(this.dtBegin.getValue().format('Y')));
			this.intMonth.setXyValue(this.setYearMonthValue(this.dtBegin.getValue().format('m')));
		}
	},
	//给下拉框组件赋值，需要传入一个对象
	setYearMonthValue : function(X)
	{
		var tempValue=
		{
			displayField :"column0",
	    	valueField :"column0",
	    	column0 : X
		};
		return tempValue;
	}   
});