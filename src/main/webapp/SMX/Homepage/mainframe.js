// 业务功能区
var m_funcAreaTabs = null;
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
	var topTab = Ext.getCmp('topTab');
	
	topTab.activate(0);
}

function loadTree(type)
{
	var tree = Ext.getCmp('lefttree');
	var root = tree.getRootNode();
	root.id = type;
	tree.loader.load(root);
	//tree.root.expand();

//	obj.getLoader().load(obj.root);
	
}

function createMainFrame()
{
	var passStr = getGUID();
	var root = new Ext.tree.AsyncTreeNode({id:"", text:"菜单"});
	 	
//	var loader = new Ext.tree.TreeLoader({dataUrl:"SMX/GetChildrenMenuAction.action"});
	var loader = new Ext.tree.TreeLoader({dataUrl:"menu/menutree"});
	loader.on("loadexception", loadException);
	var tree = new Ext.tree.TreePanel({id:"lefttree",loader:loader, root:root, animate:true, enableDD:false, border:false, rootVisible:false});

//	tree.getRootNode().expand(true);
	
	var welcomeUrl = "<iframe id='welcomeFrame' name='welcomeFrame' src='SMX/Homepage/welcome.jsp' width='100%' height='100%' frameborder=0>";
	var funcAreaTabsOpts = {id:"topTab", enableTabScroll : true, plain:false, activeTab:0, items :[{title:"欢迎", closable:false, html:welcomeUrl}]};
	m_funcAreaTabs = new Ext.TabPanel(funcAreaTabsOpts);
 
    m_funcAreaTabs.on("beforeremove", fixIFrame, m_funcAreaTabs);
    function fixIFrame(lr, cp) {
         var sheetId = cp.getEl().id;
         var frameId = sheetId.substring(10);
         Ext.get(frameId).dom.src = "javascript:false";
    }
	
	var w_items = [{title:"菜单",autoScroll:true,border:false,items:[tree]}];
		
	var topUrl = null;
	if( this.loginSSO )
		topUrl= "<iframe id='topFrame' name='topFrame' src='SMX/Homepage/topSSO.jsp?passStr='"+passStr+"' width='100%' height='100%' frameborder=0>";
	else
		topUrl= "<iframe id='topFrame' name='topFrame' src='SMX/Homepage/top.jsp?passStr='"+passStr+"' width='100%' height='100%' frameborder=0>";
	var bottomUrl = "<iframe id='bottomFrame' name='bottomFrame' src='SMX/Homepage/bottom.jsp?passStr='"+passStr+"' width='100%' height='100%' frameborder=0>";
	
	//var north = {region:"north",height:70,collapsible:true,minSize:70,border:false,html:"<img src='resources/images/logo.png' width='100%' height='100%'>"};
	var north = {region:"north",height:90,collapsible:true,minSize:90,border:false,html:topUrl};
	//var south = {region:"south",height:20,collapsible:true,minSize:20,border:false,html:"<img src='resources/images/bottom.jpg' width='100%' height='100%'>"};
	var south = {region:"south",height:30,collapsible:true,minSize:30,border:false,html:bottomUrl};
	var west = {region:"west",title:"新致财务核算专家",split:true,width:200,collapsible:true,items:w_items,layout:"accordion"};
	var center = {region:"center",split:true,border:false,items:[m_funcAreaTabs],layout:"fit"};
	
	var viewport = new Ext.Viewport({layout:"border",items:[north,south,west,center]});
//	root.expand();
			
	tree.on("click", tree_click);

}

function tree_click(node)
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
		m_funcAreaTabs.add({id:sheetId, title:node.text, closable:true, html:sframe});
	}
	else
	{
		oframe.dom.src = pageUrl;
	}
	
	var sheet = m_funcAreaTabs.getItem(sheetId);
	m_funcAreaTabs.setActiveTab(sheet);
}

function loadException(This,node,response)
{
  	var status = response.status;
  	var text = response.responseText;
  	
  	switch(status)
  	{
  		case 404:
  			alert("请求url不可用。");
  			break;
  		case 200:
  			if (text.length > 0)
  			{
  				Ext.MessageBox.alert("错误", text);
  			}
  			break;
  		default:
  			Ext.MessageBox.alert("错误", status + "," + text);
  			break;
  	}
 }
  