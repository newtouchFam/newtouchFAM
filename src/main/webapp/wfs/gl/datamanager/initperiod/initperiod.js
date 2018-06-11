//---------------------主界面---------------
Ext.namespace("wfs.gl.datamamager.initperiod");
wfs.gl.datamamager.initperiod.initPeriodPanel = Ext.extend(Ext.grid.GridPanel, 
{
	//定义变量、属性
	id : 'initperiod',
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
		//1.声明record;
		var record = Ext.data.Record.create([
            { name : 'uqcompanyid'}, 
            { name : 'uqaccountid'},
  			{ name : 'varaccountcode'}, 
  			{ name : 'varaccountname'},
  			{ name : 'mnydebitperiod'},
  			{ name : 'mnycreditperiod'},
  			{ name : 'intislastlevel'}
          ]);
		
		//2.创建JsonStore；
		this.store = new Ext.data.JsonStore(
		{	
			totalProperty : "total",
			root : "data",
			url : 'datamanager/initperiod/getinitperiodlist',
			fields : record,
			baseParams : {uqcompanyid : Ext.getDom('companyid').value }
		});
		
		//3.组件变量；
		var clnRowNum = new Ext.grid.RowNumberer();
		var uqcompanyid =
		{
			header : '公司id',
			dataIndex : 'uqcompanyid',
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
		var varaccountcode =
		{
			header : '科目编码',
			dataIndex : 'varaccountcode',
			width : 120
		};
		var varaccountname =
		{
			header : '科目名称',
			dataIndex : 'varaccountname',
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
		
		var intislastlevel =
		{
			header : '是否末级',
			dataIndex : 'intislastlevel',
			width : 100,
			hidden : true
		};
		
		this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
		
		//4.创建ColumnModel加入声明的列变量;
		this.cm = new Ext.grid.ColumnModel(
				[ this.sm,clnRowNum, uqcompanyid, uqaccountid, varaccountcode, varaccountname,
				  mnydebitperiod, mnycreditperiod, intislastlevel ]);
		
		//给公司组件一个默认值
		var data = 
		{
			id : Ext.getDom('companyid').value,
			text : Ext.getDom('companyname').value
		};
		this.varcompanyname = new Ext.app.XyComboBoxTree(
		{
			id : 'company',
			width :200,
			fieldLabel : '公司',
			leafSelect :false,
			XyAllowDelete : false,
			hiddenData :data,
			rootTitle :'请选择公司',
			winHeight :500,
			scriptPath :'wfs',
			firstSqlFile :'selectcompanytree0',
			otherSqlFile :'selectcompanytree1'
		});

		this.varaccountcode_text = new Ext.form.TextField(
		{
			id : 'varaccountcode',
			name : 'varaccountcode_text',
			fieldLabel : '科目编号',
			labelStyle : 'text-align:right;'
		});
		this.varaccountname_text = new Ext.form.TextField(
		{
			id : 'varaccountname',
			name : 'varaccountname_text',
			fieldLabel : '科目名称',
			labelStyle : 'text-align:right;'
		});
		var searchButton =
		{
			text : '查询',
			iconCls : "xy-view-select",
			handler : this.searchHandler,
			scope : this
		};
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
		//声明tbar
		this.tbar = ['-','公司:',this.varcompanyname,'-','科目编号:',this.varaccountcode_text, '-' ,'科目名称:', this.varaccountname_text, '-', searchButton,
		             '-',addButton,'-',editButton,'-',deleteButton,'-',importButton,'-',exportButton,'-',downloadButton];
		
		//6.创建bbar放置PagingToolbar；
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
		//7.渲染
		wfs.gl.datamamager.initperiod.initPeriodPanel.superclass.initComponent.call(this);
		
		this.on("rowdblclick",this.editHandler,this);
		
	},
	
	//给数据加背景色
	viewConfig : 
	{ 
	    getRowClass : function(record,rowIndex,rowParams,store)
	    {
		    //科目不是末级科目时，改变其背景颜色，'color'定义在initperiod.jsp中，这是一个css样式
		     if(record.get("intislastlevel")==0)
		     {
		    	  return 'color';
		     }
	    }
	},
	/*
	 * 按条件模糊查找科目信息
	 */
	searchHandler : function()
	{
		//获取参数
		var varcompanyid =  this.varcompanyname.getXyValue();
		var varaccountcode = this.varaccountcode_text.getValue();
		var varaccountname = this.varaccountname_text.getValue();
		
		if(varcompanyid==null||varcompanyid==undefined||varcompanyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		
		var paramstring = 
		{
			varaccountcode : varaccountcode,
			varaccountname : varaccountname,
			uqcompanyid  : varcompanyid
		}
		//设置store参数
		this.store.baseParams.paramString = Ext.encode(paramstring);
		this.store.load(
		{
		    params : 
		    {
		    	start:0,
				limit:20
		    }
		});
	},
	
	//增加按钮事件
	addHandler : function()
	{
		var varcompanyid =  this.varcompanyname.getXyValue();
		if(varcompanyid==null||varcompanyid==undefined||varcompanyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		//打开一个新增window界面
		var editInitPeriodWin = new wfs.gl.datamanager.editinitperiod.EditInitPeriodWin(
		{
			title : '新增',
			initPeriodPanel : this
		});
		editInitPeriodWin.show();
	}, 
	
	//修改按钮事件
	editHandler : function()
	{
		var varcompanyid =  this.varcompanyname.getXyValue();
		if(varcompanyid==null||varcompanyid==undefined||varcompanyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		//获取选择的行记录,records是一个数组
		var records = this.getSelectionModel().getSelections();
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
		if(record.get("intislastlevel")==0)
		{
			Ext.Msg.alert("提示", "只能修改末级科目的期初余额");
			return;
		}
		//打开一个修改的window界面
		var editInitPeriodWin = new wfs.gl.datamanager.editinitperiod.EditInitPeriodWin(
		{
			title : '修改',
			record : record,
			initPeriodPanel : this
		});
		editInitPeriodWin.show();
		
	},
	//删除按钮事件
	deleteHandler : function()
	{
		var varcompanyid =  this.varcompanyname.getXyValue();
		if(varcompanyid==null||varcompanyid==undefined||varcompanyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		//获取选择的行记录
		var records = this.getSelectionModel().getSelections();
		//判断是否选择了数据
		if (records==null||records==''||records.length==0)
		{
			Ext.Msg.alert("提示", "请选择要删除的记录");
			return;
		};
		var tempvaraccountcodes = "";
		var tempaccountids = "";
		//对选中的数据进行循环
		for(var i = 0; i<records.length; i++)
		{
			var record = records[i];
			var intislastlevel = record.get("intislastlevel")
			var tempvaraccountcode = record.get("varaccountcode");
			var tempaccountid = record.get("uqaccountid");
			//判断是否为新增状态（0  停用，1新增，2启用）
			if(intislastlevel==0)
			{
				Ext.Msg.alert("提示", "选择的第"+(i+1)+"条数据的科目不是末级,不能删除");
				return;
			}
			else
			{
				//将科目编码拼成 AAA,BBB,CCC 的格式
				if(tempvaraccountcodes.length==0)
				{
					tempvaraccountcodes = tempvaraccountcode;
					tempaccountids = tempaccountid;
				}
				else if(tempvaraccountcodes.length>0)
				{
					tempvaraccountcodes = tempvaraccountcodes + "," + tempvaraccountcode;
					tempaccountids = tempaccountids + "," + tempaccountid;
				}
				
				var paramString = 
				{
					uqcompanyid : varcompanyid,
					varaccountcodes : tempvaraccountcodes,
					accountids : tempaccountids
				}
			}
		};
		Ext.Msg.confirm("提示", "请确认是否要删除所选记录？", function(btn) 
		{
			if (btn == "yes") 
			{				
				Ext.Ajax.request(
				{
					url : "datamanager/initperiod/deleteinitperiod",
					params :
	    			{
	    				paramString : Ext.encode(paramString)
	    			},
					success : function(response)
					{
						var r = Ext.decode(response.responseText);
						if (r.success)
						{
							Ext.Msg.alert("提示", "科目期初余额已删除！");
							this.getStore().reload();
						}
						else
						{
							Ext.Msg.alert("错误", r.msg);
						}
					},
					failure : function(response)
        			{
        				Ext.Msg.alert("错误","科目期初余额删除失败！");
        				return;
        			},
					scope:this
				});
			}
		},this);
		
	},
	
	//导入信息
	importHandler : function()
	{
		var companyid =  this.varcompanyname.getXyValue();
		if(companyid==null||companyid==undefined||companyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		var param = {"companyid" : companyid};
		
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
				 _this.store.baseParams.uqcompanyid = companyid;
				 _this.store.baseParams.varaccountcode = "";
				 _this.store.baseParams.varaccountname = "";
    			 _this.store.load(
				 {
				     params : 
				     {
				    	start:0,
						limit:20
				     }
				 });
			},
			xy_UploadAction : "datamanager/initperiod/importinitperiod",
			xy_BaseParams : postparam,
			xy_DownloadAction : "wfs/gl/datamanager/initperiod/initperiodImportModel.xls",
			xy_FileAccept : "application/msexcel",
			xy_FileExt : "xls"
		});
		this.m_FileUploadDialog.show();
	},
	
	/* 
	 * 导出
     */
	exportHandler : function()
	{
		var varaccountcode = this.varaccountcode_text.getValue();
		var varaccountname = this.varaccountname_text.getValue();
		var companyid =  this.varcompanyname.getXyValue();
		if(companyid==null||companyid==undefined||companyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		var url = "datamanager/initperiod/exportinitperiod";
		var param = {"companyid" : companyid,"varaccountcode" : varaccountcode,"varaccountname" : varaccountname};
		
		var postparam =
		{
			jsonCondition : Ext.encode(param)
		};
		
		ssc.common.PostSubmit(url, postparam);
	},
	/* 
	 * 获取路径，这样ie和火狐都能运行，否则ie不能运行 
	 */
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
		//必须先选择公司才能进行操作
		var varcompanyid =  this.varcompanyname.getXyValue();
		if(varcompanyid==null||varcompanyid==undefined||varcompanyid=="")
		{
			Ext.Msg.alert("提示", "请选择公司");
			return;
		}
		var url = '';
		url = "datamanager/initperiod/downloadimportmodel";	
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
	}
});
function init()
{
	new Ext.Viewport(
	{
		layout : 'fit',
		items : [ new wfs.gl.datamamager.initperiod.initPeriodPanel ]
	});
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);