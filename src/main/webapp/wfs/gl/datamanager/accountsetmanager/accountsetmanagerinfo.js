/**
 * 列表界面gridpanel
 */
Ext.namespace("gl.datamanager.accountsetmanager");
//new 一个gridpanel
gl.datamanager.accountsetmanager.AccountConfigPanel = Ext.extend(Ext.grid.GridPanel,
{
	//属性 loadMask true啥的 
	id : 'accountconfigpanel',
	frame : false,
	enableColumnMove : false,
	enableHdMenu : false,
	autoHeight : false,
	height : 200,
	border : false,
	autoWidth : true,
	autoScroll : true,
	loadMask : true,

	//initComponent
	initComponent : function() 
	{	
		//Record
		var record = Ext.data.Record.create([
   		      {name : 'uqaccountsetid'},
   		      {name : 'varaccountsetcode'},
   		      {name : 'varaccountsetname'},
   		      {name : 'intflag'}
   		]);
		//JsonStore
		this.store = new Ext.data.JsonStore(
		{
			totalProperty : "total",
			root : "data",
			url : '/datamanager/accountsetmanager/accountsetlist',
			fields : record
		});
		//声明列 
		//RowNumberer 行序号
		var clnRowNum = new Ext.grid.RowNumberer();
		
		//uqaccountsetid	隐藏
		var uqaccountsetid =
		{
			header : '帐套ID',
			dataIndex : 'uqaccountsetid',					 
			width : 200	 ,
			hidden : true	
		};
		//varaccountsetcode
		var varaccountsetcode = 
		{
			header : '帐套编码',
			dataIndex : 'varaccountsetcode',					 
			width : 200	 ,
			hidden : false	
		};
		//varaccountsetname
		var varaccountsetname = 
		{
			header : '帐套名称',
			dataIndex : 'varaccountsetname',					 
			width : 200	 ,
			hidden : false
		};
		//intflag 0新建 1启用  2关闭
		var intflag =
		{
			header : '状态',
			dataIndex : 'intflag',
			width : 100,					
			renderer : function (val)				//渲染方法
			{
				switch(val)
				{
					case 2:
						return '启用';
						break;
					case 1:
						return '新建';
						break;
					case 0 :
						return '<span style="color:red;">停用</span>';
				}
			}
		};
		
		//sm: CheckboxSelectionModel
		this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect : false /*,handleMouseDown : Ext.emptyFn*/ });
		//cm: ColumnModel
		this.cm = new Ext.grid.ColumnModel([this.sm, uqaccountsetid, clnRowNum, varaccountsetcode, varaccountsetname, intflag]);
		
		//PagingToolbar分页显示
		this.bbar = new Ext.PagingToolbar(
		{
			border : true,
			pageSize : 20,
			store : this.store,
			displayInfo : true,
			displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
			emptyMsg : "没有记录"
		});
		//loadMask
		this.loadMask = 
		{
			msg : "数据加载中,请稍等...",
			removeMask : true
		};
		
		//调用构造器
		gl.datamanager.accountsetmanager.AccountConfigPanel.superclass.initComponent.call(this);
	
		//load()方法
		this.store.load(
		{
			params : 
			{
				start : 0,
				limit : 20
			}
		});
	},
	//设置停用状态的字体颜色
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