Ext.namespace("gl.datamamager.cashflowmanager");
/**
 *右侧项目信息列表
 */ 
gl.datamamager.cashflowmanager.cashflowlist = Ext.extend(Ext.grid.GridPanel, 
{
	//定义变量、属性
	id : 'cashflowlist',
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
		    {name : 'uqflowitemid'},
		    {name : 'varitemcode'},
		    {name : 'varitemname'},
		    {name : 'vartypecode'},
		    {name : 'vartypename'},
		    {name : 'parentname' },
		    {name : 'uqparentid'},
		    {name : 'intislastlevel'},
		    {name : 'intstatus'}
	    ]);
		
		//2.创建JsonStore；
		this.store = new Ext.data.JsonStore(
		{	
			totalProperty : "total",
			root : "data",
			url : 'datamanager/cashflowmanager/getItemsGrid',
			fields : record
		});
		
		//3.组件变量；
		var clnRowNum = new Ext.grid.RowNumberer();
		
		var uqflowitemid = 
		{
			header : '类别ID',
			dataIndex : 'uqflowitemid',
			hidden : true
		};
		
		var varitemcode =
		{
			header : '项目编号',
			dataIndex : 'varitemcode'					 
		};
		var varitemname = 
		{
			header : '项目名称',
			dataIndex : 'varitemname'
		};
		var vartypecode = 
		{
			header : '所属分类编号',
			dataIndex : 'vartypecode'
		};
		var vartypename = 
		{
			header : '所属分类名称',
			dataIndex : 'vartypename'
		};
		
		var parentname = 
		{
			header : '上级类别',
			dataIndex : 'parentname',
			hidden : true
		};
		
		var uqparentid = 
		{
			header : '上级ID',
			dataIndex : 'uqparentid',
			hidden : true
		};
		
		var intislastlevel =
		{
			header : '是否末级',
			dataIndex : 'intislastlevel',					 
			hidden : true
		};
		
		var intstatus =
		{
			header : '状态',
			dataIndex : 'intstatus',					 
			width : 100,
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
		
		
		//4.创建ColumnModel加入声明的列变量;
		this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
		this.cm = new Ext.grid.ColumnModel(
	    [
		   this.sm,clnRowNum,uqflowitemid,varitemcode,varitemname,vartypecode,vartypename,
		   parentname,uqparentid,intislastlevel,intstatus
		]);
		
		//5.创建bbar放置PagingToolbar；
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
		gl.datamamager.cashflowmanager.cashflowlist.superclass.initComponent.call(this);
		this.on('click',this.rowlclick,this);
	},
	//单击时取消树节点选中
	rowlclick : function()
	{
		Ext.getCmp("cashflowtree").getSelectionModel().clearSelections();
	},
	//设置字体颜色
	viewConfig : 
	{
		getRowClass : function(record,rowIndex,rowParams,store)
		{
			if(record.get("intstatus")==0)
			{
				return 'color';
			}
		}
	}
});