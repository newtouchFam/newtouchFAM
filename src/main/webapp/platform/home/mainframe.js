function S4() 
{
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function getGUID() 
{
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/*点击首页返回首页*/
function addmain()
{
	var topTab = Ext.getCmp('m_FuncAreaTabs');
	topTab.activate(0);
}

function loadTree(type)
{
	var tree = Ext.getCmp('m_MenuTree');
	var root = tree.getRootNode();
	root.id = type;
	tree.loader.load(root);
}

Ext.namespace("platform.mainframe");

platform.mainframe.MainFramePanel = Ext.extend(Ext.Panel,
{
	layout : "border",
	border : false,
	/* 顶部区域 */
	m_NorthRegion : null,
	/* 底部区域 */
	m_SouthRegion : null,
	/* 左侧菜单栏 */
	m_WestRegion : null,
	/* 中央区域 */
	m_CenterRegion : null,
	/* 业务功能区 */
	m_FuncAreaTabs : null,
	initComponent : function()
	{
		var passStr = getGUID();

		/**
		 * 顶部区域
		 */
		var topUrl = "<iframe id='topFrame' name='topFrame' src='platform/home/top.jsp";
		topUrl += "?passStr='" + passStr + "' width='100%' height='100%' frameborder=0>";

		this.m_NorthRegion =
		{
			region : "north",
			height : 90,
			collapsible : true,
			minSize : 90,
			border : false,
			html : topUrl
		};

		/**
		 * 底部区域
		 */
		var bottomUrl = "<iframe id='bottomFrame' name='bottomFrame' src='SMX/Homepage/bottom.jsp";
		bottomUrl +=	"?passStr='"+passStr+"' width='100%' height='100%' frameborder=0>";
		
		this.m_SouthRegion =
		{
			region : "south",
			height : 30,
			collapsible : true,
			minSize : 30,
			border : false,
			html : "<p align=\"center\" valign=\"middle\" style=\"color:#333;line-height:20px;font-size:15px\">上海新致软件股份有限公司 版权所有©2014-2018 Newtouch.com</p>"
		};

		/**
		 * 左侧菜单栏
		 */
		var root = new Ext.tree.AsyncTreeNode(
		{
			id : "",
			text : "",
			expanded : false
		});

		var treeLoader = new Ext.tree.TreeLoader(
		{
			dataUrl : "menu/menutree"
		});
		treeLoader.on("loadexception", this.onTreeLoadException);

		this.m_MenuTree = new Ext.tree.TreePanel(
		{
			id : 'm_MenuTree',
			loader : treeLoader,
			root : root,
			animate : true,
			enableDD : false,
			border : false,
			rootVisible : false
		});
		this.m_MenuTree.on("click", onClickExpand, this);
		
		var menuPanel = [
   		{
   			title : "菜单",
   			autoScroll : true,
   			border : false,
   			items : [ this.m_MenuTree ]
   		} ];

		this.m_WestRegion =
		{
			region : "west",
			title : " ",
			split : true,
			width : 200,
			collapsible : true,
			items : menuPanel,
			layout : "accordion"
		};

		/**
		 * 中央区域
		 */
		var welcomeUrl = "<iframe id='welcomeFrame' name='welcomeFrame' src='platform/home/welcome.jsp'";
		welcomeUrl += " width='100%' height='100%' frameborder=0>";

		this.m_FuncAreaTabs = new Ext.TabPanel(
		{
			id : 'm_FuncAreaTabs',
			border:0,
			enableTabScroll : true,
			cellpadding:0,
			plain : false,
			activeTab : 0,
			items : [
			{
				title : "欢迎",
				closable : false,
				html : welcomeUrl
			} ]
		});
	 
		this.m_FuncAreaTabs.on("beforeremove", this.onFunAreaTabsBeforeMove, this.m_FuncAreaTabs);

		this.m_CenterRegion =
		{
			region : "center",
			split : true,
			border : false,
			items : [ this.m_FuncAreaTabs ],
			layout : "fit"
		};

		this.items = [ this.m_NorthRegion,
		               this.m_SouthRegion,
		               this.m_WestRegion,
		               this.m_CenterRegion ]

		platform.mainframe.MainFramePanel.superclass.initComponent.call(this);

//		this.m_MenuTree.getRootNode().expand(false);

		this.m_MenuTree.on("click", this.onTreeClick, this);	
	},
	onTreeLoadException : function(This, node, response)
	{
		try
		{
			var data = Ext.decode(response.responseText);

			if (data.msg != undefined)
			{
				Ext.MessageBox.alert("错误", "菜单数据加载失败: " + data.msg);
			}
		}
		catch(ex)
		{
			Ext.MessageBox.alert("错误", "菜单数据加载失败");
		}
	},
	onFunAreaTabsBeforeMove : function(lr, cp)
	{
        var sheetId = cp.getEl().id;
        var frameId = sheetId.substring(10);
        Ext.get(frameId).dom.src = "javascript:false";
	},
	onTreeClick : function(node)
	{
		var pageUrl = node.attributes.page;
		if (pageUrl == undefined)
		{
			return;
		}
		if (pageUrl == "")
		{
			return;
		}
		
		var frameId = "frame_" + node.id;
		var sheetId = "ext_sheet_" + frameId;
		
		var oframe = Ext.get(frameId);		
		if (oframe == null)
		{
			var sframe = "<iframe id='" + frameId + "' name='" + frameId + "' src='" + pageUrl + "' width='100%' height='100%' frameborder=0>";
			this.m_FuncAreaTabs.add(
			{
				id : sheetId,
				title : node.text,
				closable : true,
				html : sframe
			});
		}
		else
		{
			oframe.dom.src = pageUrl;
		}
		
		var sheet = this.m_FuncAreaTabs.getItem(sheetId);
		this.m_FuncAreaTabs.setActiveTab(sheet);
	}
});


function init()
{
	var view = new Ext.Viewport(
	{
		layout : "fit",
		items : [ new platform.mainframe.MainFramePanel({}) ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);