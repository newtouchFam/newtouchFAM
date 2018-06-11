Ext.namespace("wfs.gl.datamamager.initledgeperiod");
wfs.gl.datamamager.initledgeperiod.initLedgePeriodPanel = Ext.extend(Ext.grid.GridPanel, 
{
	//定义变量、属性
	id : 'initledgeperiod',
	//region : 'center',
	//列是否能移动
	enableColumnMove : false,
	//是否显示列菜单
	enableHdMenu : false,
	//是否隐藏滚动条
	autoHeight : false,
	border : true,
	autoWidth : true,
	autoScroll : true,
	loadMask : true,
	//构造面板内容
	initComponent : function()
	{
		this.labAccountPeriod = new Ext.form.Label(
		{
			text : "科目: 借/贷"
		});
		
		//1.声明record;
		var record = Ext.data.Record.create([
	        { name : 'uqledgeid'},
	        { name : 'uqaccountid'},
	        { name : 'uqcompanyid'},
	        { name : 'uqglobalperiodid'},
			{ name : 'varledgecode'}, 
			{ name : 'varledgename'},
			{ name : 'mnydebitperiod'},
			{ name : 'mnycreditperiod'}
	    ]);
		
		//2.创建JsonStore；
		this.store = new Ext.data.JsonStore(
		{	
			totalProperty : "total",
			root : "data",
			url : 'datamanager/initledgeperiod/getinitledgeperiod',
			fields : record
		});
		
		//3.声明各项组件，公司组件添加默认值；
		//给公司组件一个默认值
		var data = 
		{
			id : Ext.getDom('companyid').value,
			text : Ext.getDom('companyname').value
		};
		this.company = new Ext.app.XyComboBoxTree(
		{
			id : 'company',
			width :200,
			fieldLabel : '公司<span style="color:red;">*</span>',
			leafSelect :false,
			XyAllowDelete : false,
			hiddenData :data,
			rootTitle :'请选择公司',
			winHeight :500,
			scriptPath :'wfs',
			firstSqlFile :'selectcompanytree0',
			otherSqlFile :'selectcompanytree1'
		});
		this.company.on("valuechange", this.companyValuechange, this);
		
		this.account = new gl.component.xychooseaccountle(
		{
			id : 'account',
			width :150,
			anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '科目<span style="color:red;">*</span>',
    		isOnlyLastLevel : true
		});
		//添加事件 将科目id传入分户组件
		this.account.on("valuechange", this.accountValuechange, this);
		
		this.ledgetype = new Ext.app.XyComboBoxCom(
		{
			id : 'ledgetype',
			width :150,
			loaded : false,
            leafSelect : true,
            emptyText : '请选择分户类别...',
            rootTitle : '分户类别',
            fieldLabel : '分户类别<span style="color:red;">*</span>',
            labelStyle : "text-align: right;",
            fields : ["column0", "column1"],
            editable : false,
            valueField : 'column0',
            displayField : 'column1',
            scriptPath : 'wfs',
            sqlFile : 'selectledgetypebyaccount'
        });
		//添加beforeshow事件
		this.ledgetype.on("beforequery", this.ledgeTypeBeforeQuery.createDelegate(this));
		//添加事件 选完分户直接加载数据
		this.ledgetype.on("valuechange", this.searchInfo, this);
		
		var editButton =
		{
			text : '修改',
			iconCls : "xy-edit",
			handler : this.editHandler,
			scope : this
		};
		var importButton =
		{
			text : '导入',
			iconCls : "xy-import",
			handler : this.importHandler,
			scope : this
		};
		var exportButton =
		{
			text : '导出',
			iconCls : "xy-export",
			handler : this.exportHandler.createDelegate(this),
			scope : this
		};
		var downloadButton =
		{
			text : '导入模板下载',
			iconCls : "xy-import",
			handler : this.downloadHandler,
			scope : this
		}; 
		
		//4.声明record列变量；
		var clnRowNum = new Ext.grid.RowNumberer();
		var uqledgeid =
		{
			header : '分户项目id',
			dataIndex : 'uqledgeid',
			width : 100,
			hidden : true
		};
		var uqaccountid =
		{
			header : '科目id',
			dataIndex : 'uqaccountid',
			width : 100,
			hidden : true
		};
		var uqcompanyid =
		{
			header : '公司id',
			dataIndex : 'uqcompanyid',
			width : 100,
			hidden : true
		};
		var uqglobalperiodid =
		{
			header : '全局会计期id',
			dataIndex : 'uqglobalperiodid',
			width : 100,
			hidden : true
		};
		var varledgecode =
		{
			header : '分户项目编码',
			dataIndex : 'varledgecode',
			width : 150
		};
		var varledgename =
		{
			header : '分户项目名称',
			dataIndex : 'varledgename',
			width : 150
		};
		var mnydebitperiod =
		{
			header : '年初借方余额',
			dataIndex : 'mnydebitperiod',
			css : 'text-align:right;',
			width : 100,
			renderer : Ext.app.XyFormat.gridMoney
		};
		var mnycreditperiod =
		{
			header : '年初贷方余额',
			dataIndex : 'mnycreditperiod',
			css : 'text-align:right;',
			width : 100,
			renderer : Ext.app.XyFormat.gridMoney
		};
		
		//5.创建ColumnModel加入声明的列变量；
		this.cm = new Ext.grid.ColumnModel(
			[ clnRowNum, uqledgeid, uqaccountid, uqcompanyid, uqglobalperiodid,
			  varledgecode, varledgename, mnydebitperiod, mnycreditperiod ]);
		
		//6.声明tbar放入组件，创建bbar放置PagingToolbar；
		this.tbar = ['公司：', this.company, '-', '科目：', this.account, '-', '分户类别：' ,this.ledgetype, '-',
		             this.labAccountPeriod, '-', editButton, '-',importButton,'-',exportButton,'-',downloadButton];
		
		this.bbar = new Ext.PagingToolbar(
		{
			border : true,
			pageSize : 20,
			store : this.store,
			displayInfo : true,
			displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
			emptyMsg : "没有记录"
		});
		this.loadMask = 
		{
			msg : "数据加载中,请稍等...",
			removeMask : true
		};
		
		//加一个双击监听
		this.addListener('rowdblclick',this.editHandler,this);
		//7.渲染。
		wfs.gl.datamamager.initledgeperiod.initLedgePeriodPanel.superclass.initComponent.call(this);
	},
	//分户类别组件展现之前 检查是否选择科目
	ledgeTypeBeforeQuery : function()
	{
		var uqaccountid = this.account.getXyValue();
		if(uqaccountid == null || uqaccountid == '' || uqaccountid == undefined)
		{
			Ext.Msg.alert("提示", "请先选择科目！");
			return false;
		}
		else
		{
			return true;
		}
	},
	//公司改变时
	companyValuechange : function(oldvalue, newvalue)
	{
		var data1 = 
		{
			id :'',
			text : ''
		};
		this.account.hiddenData = data1;
		this.account.setXyValue(data1);
		
		var data2 = 
		{
			id :'',
			text : ''
		};
		this.ledgetype.hiddenData = data2;
		this.ledgetype.setXyValue(data2);
		this.store.removeAll();
	},
	//将科目id传入分户组件
	accountValuechange : function(oldvalue, newvalue)
	{
		var data = 
		{
			id :'',
			text : ''
		};
		this.ledgetype.hiddenData = data;
		this.ledgetype.setXyValue(data);
		this.store.removeAll();
		
		var value = (newvalue!=null && newvalue!='')? newvalue["id"] : '';
		this.ledgetype.param = 
    	[{
			name :'accountid',
			value : value
		}];
		this.ledgetype.store.load();
		
		var uqcompanyid = this.company.getXyValue();
		
		var paramString = 
		{
			uqaccountid : value,
			uqcompanyid : uqcompanyid
		}
		
		//ajax 获取科目 期初值
		Ext.Ajax.request(
    	{
			url : "datamanager/initledgeperiod/getaccountperiod",
			method : "post",
			params :
			{
				paramString : Ext.encode(paramString)
			},
			success : function(response) 
			{
				//获取科目年初数
				var r = Ext.decode(response.responseText);
				if(r.success)
				{
					this.labAccountPeriod.getEl().update("科目：" + r.type +" "+ r.amount );
				}
			},
			failure : function(response)
			{
				Ext.Msg.alert("错误","获取科目年初数失败");
				return;
			},
			scope : this
		});
	},
	//根据选择的信息获取数据 
	searchInfo : function(oldvalue,newvalue)
	{
		//1.获取组件参数；
		var uqcompanyid = this.company.getXyValue();
		if(uqcompanyid==null||uqcompanyid==undefined||uqcompanyid=="")
		{
			Ext.Msg.alert("提示", "请先选择公司！");
			return;
		}
		var uqaccountid = this.account.getXyValue();
		var uqledgetypeid = (newvalue!=null && newvalue!='')? newvalue["column0"] : '';
		
		var paramstring = 
		{
			uqledgetypeid : uqledgetypeid,
			uqcompanyid : uqcompanyid,
			uqaccountid  : uqaccountid
		}
		
		//2.设置store参数并加载。
		this.store.baseParams.paramString = Ext.encode(paramstring);
		//this.store.baseParams.uqledgetypeid = uqledgetypeid;
		//this.store.baseParams.uqcompanyid = uqcompanyid;
		//this.store.baseParams.uqaccountid = uqaccountid;
		this.store.load(
		{
		    params : 
		    {
		    	start:0,
				limit:20
		    }
		});
	},
	//修改按钮绑定方法
	editHandler : function()
	{
		//1.获取选中记录；
		var record = this.getSelectionModel().getSelected();
		if(record != null && record != '')
		{
			//2.声明修改窗体，传入选中数据；
			var editwin = new wfs.gl.datamamager.initledgeperiod.initLedgePeriodWin(
			{
				title : '['+record.get("varledgecode")+']'+record.get("varledgename"),
				record : record
			});
			//3.打开窗体。
			editwin.show();
		}
		else
		{
			Ext.Msg.alert("提示", "请先选择一条记录！");
			return;
		}
	},
	
	//导入按钮绑定方法，导入数据
	importHandler : function()
	{
		//1.验证是否选择；
		var uqcompanyid =  this.company.getXyValue();
		if(uqcompanyid==null || uqcompanyid==undefined || uqcompanyid=="")
		{
			Ext.Msg.alert("提示", "请先选择公司！");
			return;
		}
		if (this.account.getXyValue() == "" || this.account.getXyValue() == null) 
		{
			Ext.Msg.alert("提示", "请先选择科目！");
			return false;
		}
		if (this.ledgetype.getXyValue() == "" || this.ledgetype.getXyValue() == null) 
		{
			Ext.Msg.alert("提示", "请先选择分户类别！");
			return false;
		}
		
		var param = {"companyid" : uqcompanyid};
		
		var postparam =
		{
			jsonCondition : Ext.encode(param)
		};
		
		var _this = this;
		this.m_FileUploadDialog = new ssc.component.BaseUploadDialog(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : function()
			{
				this.m_FileUploadDialog.close();
				this.m_FileUploadDialog = null;
				var uqcompanyid = this.company.getXyValue();
				var uqaccountid = this.account.getXyValue();
				var uqledgetypeid = this.ledgetype.getXyValue();
				/*
				if(this.company.getXyValue()==null||this.company.getXyValue()=="")
				{
					var uqcompanyid = "";
				}
				else
				{
					var uqcompanyid = this.company.getXyValue();
				}
				if(this.account.getXyValue()==null||this.account.getXyValue()=="")
				{
					var uqaccountid = "";
				}
				else
				{
					var uqaccountid = this.account.getXyValue();
				}
				if(this.ledgetype.getXyValue()==null||this.ledgetype.getXyValue()=="")
				{
					var uqledgetypeid = "";
				}
				else
				{
					var uqledgetypeid = this.ledgetype.getXyValue();
				}
				*/
				_this.store.baseParams.uqledgetypeid = uqledgetypeid;
				_this.store.baseParams.uqcompanyid = uqcompanyid;
				_this.store.baseParams.uqaccountid = uqaccountid;
				_this.store.load(
				{
				     params : 
				     {
				    	start:0,
						limit:20
				     }
				});
			},
			xy_UploadAction : "datamanager/initledgeperiod/importledgeperiod",
			xy_BaseParams : postparam,
			xy_DownloadAction : "wfs/gl/datamanager/initledgeperiod/initledgeperiodImportModel.xls",
			xy_FileAccept : "application/msexcel",
			xy_FileExt : "xls"
		});
		this.m_FileUploadDialog.show();
	},
	
	//导出按钮绑定方法，导出数据
	exportHandler : function()
	{
		//验证非空
    	if(!this.validate())
		{
    		return;
		}
    	//1.获取组件参数；
		var uqledgetypeid = this.ledgetype.getXyValue();
		var uqcompanyid = this.company.getXyValue();
		var uqaccountid = this.account.getXyValue();
		
		var url = "datamanager/initledgeperiod/exportledgeperiod";
		var param = {"companyid" : uqcompanyid,"accountid" : uqaccountid,"ledgetypeid" : uqledgetypeid};
		
		var postparam =
		{
			jsonCondition : Ext.encode(param)
		};
		
		ssc.common.PostSubmit(url, postparam);
	},
	// 获取路径，这样ie和火狐都能运行，否则ie不能运行 
	getContextPath : function() 
	{
	    var pathName = document.location.pathname;
	    var index = pathName.substr(1).indexOf("/");
	    var result = pathName.substr(0,index+1);
	    return result;
	},
	//导入模板下载
	downloadHandler : function()
	{
		var url = '';
		url = "datamanager/initledgeperiod/downloadinitledgeperiodimportmodel";	
		var qryCondition = {fileID:""};	
		
		var oForm = document.createElement("form");
		oForm.id = "freesky-postForm";
		oForm.name = "freesky-postForm";
		oForm.method = "post";
		oForm.action = url;
		oForm.target = "_blank";
		oForm.style.display = "none";
		
		for(var prop in qryCondition)
		{
			var oInput = document.createElement("input");
			oInput.name = prop;
			oInput.value = qryCondition[prop]; 
			oForm.appendChild(oInput);
	    }
		document.body.appendChild(oForm);
		oForm.submit();
	},
	//设置各组件非空验证
	validate : function()
	{
		if (this.company.getXyValue() == "" || this.company.getXyValue() == null) 
		{
			Ext.Msg.alert("提示", "请先选择公司！");
			return false;
		}
		if (this.account.getXyValue() == "" || this.account.getXyValue() == null) 
		{
			Ext.Msg.alert("提示", "请先选择科目！");
			return false;
		}
		if (this.ledgetype.getXyValue() == "" || this.ledgetype.getXyValue() == null) 
		{
			Ext.Msg.alert("提示", "请先选择分户类别！");
			return false;
		}
		return true;
	}
});

function init()
{
	new Ext.Viewport(
	{
		layout : 'fit',
		items : [ new wfs.gl.datamamager.initledgeperiod.initLedgePeriodPanel ]
	});
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);