Ext.namespace("gl.datamamager.accountmamager");
/**
 * 右侧科目信息列表
 */
gl.datamamager.accountmamager.AccountList = Ext.extend(Ext.grid.GridPanel, 
{
	//定义变量、属性
	id : 'accountlist',
	region : 'center',
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
            { name : 'uqaccountid'},                               
  			{ name : 'varaccountcode'}, 
  			{ name : 'varaccountfullcode'},
  			{ name : 'varaccountname'},
  			{ name : 'varaccountfullname'},
  			{ name : 'uqparentid'},
  			{ name : 'parentname'},
  			{ name : 'intpropertyno'},
  			{ name : 'intproperty'},
  			{ name : 'uqtypeidno'},
  			{ name : 'uqtypeid'},
  			{ name : 'intisflowno'},
  			{ name : 'intisflow'},
  			{ name : 'uqforeigncurridno'},
  			{ name : 'uqforeigncurrid'},
  			{ name : 'varmeasureno'},
  			{ name : 'varmeasure'},
  			{ name : 'intisledge'},
  			{ name : 'intislastlevel'},
  			{ name : 'intflag'},
  			{ name : 'uqledgetypeids'},
  			{ name : 'varledgetypenames'}
          ]);
		
		//2.创建JsonStore；
		this.store = new Ext.data.JsonStore(
		{	
			totalProperty : "total",
			root : "data",
			url : 'datamanager/accountmanager/list',
			fields : record
		});
		
		//3.组件变量；
		var clnRowNum = new Ext.grid.RowNumberer();
		var uqaccountid =
		{
			header : '科目id',
			dataIndex : 'uqaccountid',					 
			hidden : true
		};
		var uqparentid =
		{
			header : '父级科目id',
			dataIndex : 'uqparentid',					 
			hidden : true
		};
		var parentname =
		{
			header : '<div style="text-align:center">父级科目</div>',
			dataIndex : 'parentname',
			width : 100
		};
		var varaccountcode =
		{
			header : '<div style="text-align:center">科目编号</div>',
			dataIndex : 'varaccountcode',
			width : 90
		};
		var varaccountfullcode =
		{
			header : '科目全编号',
			dataIndex : 'varaccountfullcode',					 
			hidden : true
		};
		var varaccountname =
		{
			header : '<div style="text-align:center">科目名称</div>',
			dataIndex : 'varaccountname',					 
			width : 100
		};
		var varaccountfullname =
		{
			header : '<div style="text-align:center">科目全名称</div>',
			dataIndex : 'varaccountfullname',					 
			width : 120
		};
		var intpropertyno =
		{
			header : '性质编号',
			dataIndex : 'intpropertyno',					 
			hidden : true
		};
		var intproperty =
		{
			header : '<div style="text-align:center">科目性质</div>',
			dataIndex : 'intproperty',
			width : 70
		};
		var uqtypeidno =
		{
			header : '类别编号',
			dataIndex : 'uqtypeidno',
			hidden : true
		};
		var uqtypeid =
		{
			header : '<div style="text-align:center">科目类别</div>',
			dataIndex : 'uqtypeid',
			width : 70				 
		};
		var intisflowno =
		{
			header : '现金流量编号',
			dataIndex : 'intisflowno',
			hidden : true
		};
		var intisflow =
		{
			header : '<div style="text-align:center">现金流量</div>',
			dataIndex : 'intisflow',
			width : 70			 
		};
		var uqforeigncurridno =
		{
			header : '外币编号',
			dataIndex : 'uqforeigncurridno',
			hidden : true
		};
		var uqforeigncurrid =
		{
			header : '<div style="text-align:center">外币</div>',
			dataIndex : 'uqforeigncurrid',
			width : 70			 
		};
		var intisledge =
		{
			header : '<div style="text-align:center">分户</div>',
			dataIndex : 'intisledge',					 
			width : 65,
			align:'center',
			renderer : function (val)
			{
				switch(val)
				{
					case 1:
						return '是';
						break;
					default :
						return '否';
				}
			}
		};
		var varmeasureno =
		{
			header : '计量单位编号',
			dataIndex : 'varmeasureno',					 
			hidden : true
		};
		var varmeasure =
		{
			header : '<div style="text-align:center">计量单位</div>',
			dataIndex : 'varmeasure',
			width : 70
		};
		var intflag =
		{
			header : '<div style="text-align:center">状态</div>',
			dataIndex : 'intflag',					 
			width : 65,
			align:'center',
			renderer : function (val)
			{
				switch(val)
				{
					case 1:
						return '新增';
					case 2:
						return '<span style="color:green;">启用</span>';
						break;
					default :
						return '<span style="color:red;">停用</span>';
				}
			}
		};
		var intislastlevel =
		{
			header : '是否末级',
			dataIndex : 'intislastlevel',					 
			hidden : true
		};
		var uqledgetypeids =
		{
			header : '分户类型id',
			dataIndex : 'uqledgetypeids',					 
			hidden : true
		};
		var varledgetypenames =
		{
			header : '分户类型名称',
			dataIndex : 'varledgetypenames',					 
			hidden : true
		};
		
		//4.创建ColumnModel加入声明的列变量;
		this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
		this.cm = new Ext.grid.ColumnModel(
				[ this.sm, clnRowNum, uqaccountid, uqparentid, varaccountcode,
				  varaccountfullcode, varaccountname, varaccountfullname, parentname, 
				  intpropertyno, intproperty, uqtypeidno, uqtypeid, intisflowno, intisflow,
				  uqforeigncurridno, uqforeigncurrid, intisledge, varmeasureno, varmeasure, 
				  intflag, intislastlevel, uqledgetypeids, varledgetypenames]);
		
		//5.创建tbar放置上部模糊查询的组件；
		this.varaccoundcode_text = new Ext.form.TextField(
		{
			name : 'varaccoundcode_text',
			fieldLabel : '科目编号',
			labelStyle : 'text-align:right;'
		});
		this.varaccoundcode_text.on('specialkey',this.searchHandler.createDelegate(this), this);
		
		this.varaccountname_text = new Ext.form.TextField(
		{
			name : 'varaccountname_text',
			fieldLabel : '科目名称',
			labelStyle : 'text-align:right;'
		});
		this.varaccountname_text.on('specialkey',this.searchHandler.createDelegate(this), this)
		
		var searchButton =
		{
			text : '查询',
			iconCls : "xy-view-select",
			handler : this.searchHandler,
			scope : this
		};
		this.tbar = ['科目编号:',this.varaccoundcode_text, '   科目名称:', this.varaccountname_text, '   ', searchButton];
		
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
		gl.datamamager.accountmamager.AccountList.superclass.initComponent.call(this);
		this.on('click',this.rowlclick,this);
	},
	//单击时取消树节点选中
	rowlclick : function()
	{
		Ext.getCmp("accounttree").getSelectionModel().clearSelections();
	},
	//按条件模糊查找科目信息
	searchHandler : function()
	{
		//获取参数
		var varaccoundcode = this.varaccoundcode_text.getValue();
		var varaccountname = this.varaccountname_text.getValue();
		if(varaccoundcode!="" && varaccoundcode!=null)
		{
			var regu =/^\d+$/;
			if (!regu.test(varaccoundcode))
			{
				Ext.Msg.alert("提示", "请输入正确的科目编号格式!");
				return;
			}
		}
		else if((varaccoundcode=="" || varaccoundcode==null) && (varaccountname=="" || varaccountname==null))
		{
			Ext.Msg.alert("提示", "请输入查询条件!");
			return;
		}
		//设置store参数
		var paramstring = 
		{
			varaccoundcode : varaccoundcode,
			varaccountname : varaccountname,
			fullCode : ""
		}
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
	//设置字体颜色
	viewConfig : 
	{
		getRowClass : function(record,rowIndex,rowParams,store)
		{
			if(record.get("intflag")==0)
			{
				return 'color';
			}
		}
	}
});