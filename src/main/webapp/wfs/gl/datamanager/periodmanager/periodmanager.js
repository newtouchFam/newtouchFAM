//---------------------主界面---------------
Ext.namespace("wfs.gl.datamanager.periodmanager");
wfs.gl.datamanager.periodmanager.MainPeriodmanagerPanel = Ext.extend(Ext.Panel,
{
	frame : false,
	border : false,
	layout : 'fit',

	initComponent : function() 
	{
		//定义添加按钮
		var addButton =
		{
			text : '新增',
			iconCls : "xy-add",
			handler : this.addHandler,
			scope : this
		};
		
		//定义修改按钮
		var editButton =
		{
			text : '修改',
			iconCls : "xy-edit",
			handler : this.editHandler,
			scope : this
		};
		
		//定义删除按钮
		var deleteButton =
		{
			text : '删除',
			iconCls : "xy-delete",
			handler : this.deleteHandler,
			scope : this
		};
		
		//定义启用按钮
		var openButton =
		{
			text : '启用',
			iconCls : "xy-act-post",
			handler : this.openHandler,
			scope : this
		};
		
		//定义关闭按钮
		var closeButton =
		{
			text : '关闭',
			iconCls : "xy-stop",
			handler : this.closeHandler,
			scope : this
		};
		
		var barTop = ['-', addButton, '-', editButton, '-', deleteButton ,'-', openButton, '-', closeButton];
		
		//定义tbar
		this.tbar = barTop;
		
        this.periodmanager = new wfs.gl.datamanager.periodmanagerinfo.PeriodManagerInfoPanel({});
		
        //定义items
		this.items = [this.periodmanager];
		
		wfs.gl.datamanager.periodmanager.MainPeriodmanagerPanel.superclass.initComponent.call(this);
		
		this.periodmanager.on("rowdblclick",this.editHandler,this);
	},
	
	
	//增加按钮事件
	addHandler : function()
	{
		//打开一个新增window界面
		var editPeriodWin = new wfs.gl.datamanager.editperiod.EditPeriodWin(
		{
			title : '新增',
			periodmanagerPanel : this.periodmanager
		});
		editPeriodWin.show();
	}, 
	
	//修改按钮事件
	editHandler : function(uqglobalperiodid)
	{
		//获取选择的行记录,records是一个数组
		var records = this.periodmanager.getSelectionModel().getSelections();
		//判断是否选择了数据
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要修改的记录");
			return;
		};
		//判断是否选择了单行
		if (records.length>1)
		{
			Ext.Msg.alert("提示", "只能选择一行");
			return;
		};
		var record = records[0];
		//打开一个修改的window界面
		var editPeriodWin = new wfs.gl.datamanager.editperiod.EditPeriodWin(
		{
			title : '修改',
			record : record,
			periodmanagerPanel : this.periodmanager
		});
		editPeriodWin.show();
		
	},
	//删除按钮事件
	deleteHandler : function(uqglobalperiodid)
	{
		//获取选择的行记录
		var records = this.periodmanager.getSelectionModel().getSelections();
		//判断是否选择了数据
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要删除的记录");
			return;
		};
		var uqglobalperiodids = "";
		//对选中的数据进行循环
		for(var i = 0; i<records.length; i++)
		{
			var record = records[i];
			var tempstatus = record.get("intstatus");
			//判断是否为新增状态（0  停用，1新增，2启用）
			if(tempstatus!=1)
			{
			//	Ext.Msg.alert("提示", "选择的第"+(i+1)+"条数据的状态不为'新增',不能删除");
				Ext.Msg.alert("提示", "选择的第"+(i+1)+"条数据不是'未启用'状态,不能删除");
				return;
			}else
			{
				//第一条为开启的会计期，不加‘,’,加入引号只是为了传入sql语句时方便
				if(uqglobalperiodids.length==0)
				{
					uqglobalperiodids = record.get("uqglobalperiodid");
				}else if(uqglobalperiodids.length>0)
				{
					uqglobalperiodids = uqglobalperiodids+ "," + record.get("uqglobalperiodid");
				}
			}
		};
		Ext.Msg.confirm("提示", "请确认是否要删除所选记录？", function(btn) 
		{
			if (btn == "yes") 
			{				
				Ext.Ajax.request(
				{
					url : "datamanager/periodmanager/del",
					params :
					{
						uqglobalperiodids : uqglobalperiodids
	              	},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success)
						{
							Ext.Msg.alert("提示", "已删除！");
							this.periodmanager.getStore().reload();
						}
						else
						{
							Ext.Msg.alert("错误", r.msg);
						}
					},
					failure : function(response)
        			{
        				Ext.Msg.alert("错误","会计期删除失败！");
        				return;
        			},
					scope:this
				});
			}
		},this);
		
	},
	
	//打开按钮事件
	openHandler : function(uqglobalperiodid)
	{
		//获取选择的行记录
		var records = this.periodmanager.getSelectionModel().getSelections();
		//判断是否选择了数据
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要启用的会计期");
			return;
		};
		var uqglobalperiodids = "";
		//对选中的数据进行循环
		for(var i = 0; i<records.length; i++)
		{
			var record = records[i];
			var tempstatus = record.get("intstatus");
			
			//第一条为开启的会计期，不加‘,’,加入引号只是为了传入sql语句时方便
			if(uqglobalperiodids.length==0)
			{
				uqglobalperiodids = record.get("uqglobalperiodid");
			}else if(uqglobalperiodids.length>0)
			{
				uqglobalperiodids =uqglobalperiodids+ "," + record.get("uqglobalperiodid");
			}
			
		};
		Ext.Msg.confirm("提示", "请确认是否要启用所选会计期？", function(btn) 
		{
			if (btn == "yes") 
			{				
				Ext.Ajax.request(
				{
					url : "datamanager/periodmanager/openorclose",
					params :
					{
						status : 2,
						uqglobalperiodids : uqglobalperiodids
	              	},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success)
						{
							Ext.Msg.alert("提示", "会计期启用成功！");
							this.periodmanager.store.reload();
						}
						else
						{
							Ext.Msg.alert("错误",r.msg);
						}
					},
					failure : function(response)
        			{
        				Ext.Msg.alert("错误","会计期启用失败！");
        				return;
        			},
					scope:this
				});
			}
		},this);
		
	},
	
	//停用按钮事件
	closeHandler : function(uqglobalperiodid)
	{
		//获取选择的行记录
		var records = this.periodmanager.getSelectionModel().getSelections();
		//判断是否选择了数据
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要关闭的会计期");
			return;
		};
		var uqglobalperiodids = "";
		//对选中的数据进行循环
		for(var i = 0; i<records.length; i++)
		{
			var record = records[i];
			var tempstatus = record.get("intstatus");
			//判断是否为新增状态（0  停用，1新增，2启用）
			if(tempstatus == 1)
			{
				Ext.Msg.alert("提示", "选择的第"+(i+1)+"条的会计期为'未启用'状态，不能关闭");
				return;
			}else
			{
				//第一条为开启的会计期，不加‘,’,加入引号只是为了传入sql语句时方便
				if(uqglobalperiodids.length==0)
				{
					uqglobalperiodids = record.get("uqglobalperiodid");
				}else if(uqglobalperiodids.length>0)
				{
					uqglobalperiodids = uqglobalperiodids + "," + record.get("uqglobalperiodid");
				}
			}
		};
		Ext.Msg.confirm("提示", "请确认是否要关闭所选会计期？", function(btn) 
		{
			if (btn == "yes") 
			{				
				Ext.Ajax.request(
				{
					//判断会计期是否有未记账的凭证
					url : "datamanager/periodmanager/flag",
					params :
					{
						uqglobalperiodids : uqglobalperiodids
	              	},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.errormsg.length>0)
						{
							Ext.Msg.confirm("提示", r.errormsg+"是否继续关闭？", function(btn) 
							{
								if (btn == "yes")
								{
									Ext.Ajax.request(
									{
										url : "datamanager/periodmanager/openorclose",
										params :
										{
											status : 0,
											uqglobalperiodids : uqglobalperiodids
						              	},
										success : function(response)
										{
											var r = Ext.decode(response.responseText);
											if (r.success)
											{
												Ext.Msg.alert("提示", "会计期关闭成功！");
												this.periodmanager.store.reload();
											}
											else
											{
												Ext.Msg.alert("错误", r.msg);
											}
										},
										failure : function(response)
					        			{
					        				Ext.Msg.alert("错误","会计期关闭失败！");
					        				return;
					        			},
										scope:this
									});
								} 
							},this)
						}
						else
						{
							Ext.Ajax.request(
							{
								url : "datamanager/periodmanager/openorclose",
								params :
								{
									status : 0,
									uqglobalperiodids : uqglobalperiodids
				              	},
								success : function(response)
								{
									var r = Ext.decode(response.responseText);
									if (r.success)
									{
										Ext.Msg.alert("提示", "会计期关闭成功！");
										this.periodmanager.store.reload();
									}
									else
									{
										Ext.Msg.alert("错误", r.msg);
									}
								},
								failure : function(response)
			        			{
			        				Ext.Msg.alert("错误","会计期关闭失败！");
			        				return;
			        			},
								scope:this
							});
						}
					},
					failure : function(response)
        			{
        				Ext.Msg.alert("错误","会计期关闭失败！");
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
		items : [ new wfs.gl.datamanager.periodmanager.MainPeriodmanagerPanel ]
	});
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);