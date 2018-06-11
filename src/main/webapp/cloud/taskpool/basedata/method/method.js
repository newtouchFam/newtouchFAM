Ext.namespace("com.freesky.ssc.core.taskpool.Method");

Method = com.freesky.ssc.core.taskpool.Method;

Method.MethodList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	initComponent : function()
	{	
		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_MethodAction!getPageAll.action",		
			root : "data",
			method : "post",
			totalProperty : 'total',
			fields : [ "methodID", "methodCode", "methodName", "remark",
			           "monitorType", "monitorDays", "monitorHours", "maxTaskCount",
			           "isCustom", "className"]
		});
		
		this.sm = new Ext.grid.CheckboxSelectionModel(
		{
			singleSelect : true
		});
		this.cm = new Ext.grid.ColumnModel( [
		{
			header : "算法编码",
			dataIndex : "methodCode",
			width : 150,
			sortable : true
		},
		{
			header : "算法名称",
			dataIndex : "methodName",
			width : 150,
			sortable : true
		},
		{
			header : "备注",
			dataIndex : "remark",
			width : 100,
			sortable : true
		},
		{
			header : "监控方式",
			dataIndex : "monitorType",
			renderer : this.typeRender,
			width : 60,
			sortable : true
		},
		{
			header : "天数",
			dataIndex : "monitorDays",
			width : 50,
			sortable : true
		},
		{
			header : "小时数",
			dataIndex : "monitorHours",
			width : 50,
			sortable : true
		},
		{
			header : "最大任务数",
			dataIndex : "maxTaskCount",
			width : 50,
			sortable : true
		},
		{
			header : "是否自定义接口",
			dataIndex : "isCustom",
			renderer : yesno,
			width : 80,
			sortable : true
		},
		{
			header : "自定义接口类名",
			dataIndex : "className",
			width : 350,
			sortable : true
		}]);
		
		this.bbar = new Ext.PagingToolbar(
		{
			store : this.store,
			pageSize : 20
		});

		Method.MethodList.superclass.initComponent.call(this);
	},
	load : function()
	{
		this.store.load(
		{
			params :
			{
				start : 0,
				limit : 20
			}
		});
	},
	typeRender : function(value, metaData, record)
	{
		if (Ext.isEmpty(value))
		{
			return "";
		}
		
		if (value == 0)
		{
			return "剩余待办数";
		}
		else
		{
			return "总接收任务数";
		}
	}	
})

Method.AddTacheWindow = Ext.extend(Ext.Window,
{
	title : '新增算法',
	resizable : false,
	modal : true,
	buttonAlign : "center",
	layout : 'fit',
	initComponent : function()
	{
		this.tacheCode = new Ext.form.TextField(
		{
			fieldLabel : "算法编码<font color='red'>*</font>"

		});
		this.tacheName = new Ext.form.TextField(
		{
			fieldLabel : "算法名称<font color='red'>*</font>"

		});
		if (this.update)
		{
			this.tacheCode.setValue(this.tacheCodeValue);
			this.tacheName.setValue(this.tacheNameValue);
		}

		Ext.apply(this,
		{
			layout : 'form',
			labelAlign : 'right',
			defaults :
			{
				width : 230
			},
			items : [ this.tacheCode, this.tacheName ],
			buttons : [
					{
						text : '确定',
						handler : this.update ? this.main.updateItTeam
								: this.main.addItTeam,
						scope : this.main
					},
					{
						text : '关闭',
						handler : this.close,
						scope : this
					} ]

		});

		Method.AddTacheWindow.superclass.initComponent.call(this);
	}
})

Method.layout = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	initComponent : function()
	{
		this.methodList = new Method.MethodList({})

		Ext.apply(this,
		{
			layout : 'border',
			tbar : [
			{
				text : '新增算法',
				iconCls : 'xy-add',
				handler : this.btn_addTache,
				scope : this
			}, '-',
			{
				text : '修改算法',
				iconCls : 'xy-edit',
				handler : this.btn_updateTache,
				scope : this
			}, '-',
			{
				text : '删除算法',
				iconCls : 'xy-delete',
				handler : this.btn_deleteTache,
				scope : this
			}],
			items : [
			{
				region : 'center',
				layout : 'fit',
				width : 400,
				split : true,
				items : this.methodList
			}]
		});

		this.methodList.load();

		Method.layout.superclass.initComponent.call(this);
	},
	btn_addTache : function()
	{
		this.tacheWindow = new Method.AddTacheWindow(
		{
			width : 400,
			height : 150,
			main : this
		});
		this.tacheWindow.setTitle("新增任务池");
		this.tacheWindow.show();

	},
	addItTeam : function()
	{
		var tachecode = this.tacheWindow.tacheCode.getValue().trim();
		var tachename = this.tacheWindow.tacheName.getValue().trim();

		if (Ext.isEmpty(tachecode))
		{
			Ext.Msg.alert('提示', '请填写任务池编码!');
			return;
		}

		if (Ext.isEmpty(tachename))
		{
			Ext.Msg.alert('提示', '请填写任务池名称!');
			return;
		}

		Ext.Ajax.request(
		{
			url : 'SSC/ssc_MethodAction!addMethod.action',
			method : 'post',
			params :
			{
				methodCode : tachecode,
				methodName : tachename
			},
			success : function(response)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.methodList.store.reload();
					this.tacheWindow.close();
				} else
				{
					Ext.Msg.alert("提示", data.msg, function()
					{
						this.methodList.store.reload();
					}, this);
				}
			},
			failure : function(response)
			{
				var data = Ext.decode(response.responseText);
				Ext.Msg.alert(data.msg);
				this.methodList.store.reload();
			},
			scope : this
		})
	},
	btn_updateTache : function()
	{
		var record = this.methodList.getSelectionModel().getSelected();

		if (null == record)
		{
			Ext.Msg.alert('提示', '请先选择需要修改的任务池!');
			return;
		}
		this.tacheWindow = new Method.AddTacheWindow(
		{
			width : 400,
			height : 150,
			update : true,
			tacheIDValue : record.get('methodID'),
			tacheCodeValue : record.get('methodCode'),
			tacheNameValue : record.get('methodName'),
			main : this
		});
		this.tacheWindow.setTitle("修改任务池");
		this.tacheWindow.show();
	},
	updateItTeam : function()
	{
		var tacheid = this.tacheWindow.tacheIDValue;
		var tachecode = this.tacheWindow.tacheCode.getValue().trim();
		var tachename = this.tacheWindow.tacheName.getValue().trim();

		if (Ext.isEmpty(tachecode))
		{
			Ext.Msg.alert('提示', '请填写任务池编码!');
			return;
		}

		if (Ext.isEmpty(tachename))
		{
			Ext.Msg.alert('提示', '请填写任务池名称!');
			return;
		}

		Ext.Ajax.request(
		{
			url : 'SSC/ssc_MethodAction!updateMethod.action',
			method : 'post',
			params :
			{
				methodID : tacheid,
				methodCode : tachecode,
				methodName : tachename
			},
			success : function(response)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.methodList.store.reload();
					this.tacheWindow.close();
				}
				else
				{
					Ext.Msg.alert("提示", data.msg, function()
					{
						this.methodList.store.reload();
					}, this);
				}
			},
			failure : function(response)
			{
				var data = Ext.decode(response.responseText);
				Ext.Msg.alert(data.msg);
				this.methodList.store.reload();
			},scope : this
		})
	},
	btn_deleteTache : function()
	{
		var record = this.methodList.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}

		Ext.Msg.show(
		{
			title : '提示',
			msg : '是否删除所选任务池?',
			buttons : Ext.Msg.YESNO,
			scope : this,
			fn : function(btn, text)
			{
				if (btn == 'no')
				{
					return;
				} 
				else if (btn == "yes")
				{
					this.deleteTeam();
				}
			}
		});

	},
	deleteTeam : function()
	{
		var record = this.methodList.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}

		var tacheid = record.get('methodID');

		Ext.Ajax.request(
		{
			url : 'SSC/ssc_MethodAction!deleteMethod.action',
			method : 'post',
			params :
			{
				methodID : tacheid
			},
			success : function(response)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.methodList.store.reload();
				}
				else
				{
					Ext.Msg.alert("提示", data.msg, function()
					{
						this.methodList.store.reload();
					}, this);
				}
			},
			failure : function(response)
			{
				var data = Ext.decode(response.responseText);
				Ext.Msg.alert(data.msg);
				this.methodList.store.reload();
			},
			scope : this
		})
	}
})
Ext.reg("tachemanager_layout", Method.layout);

function init()
{
	var m_view = new Ext.Viewport({
				layout: 'fit',
				items: [{
					    id:'tachemanager_layout',
						xtype: 'tachemanager_layout'
				}]
			});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);