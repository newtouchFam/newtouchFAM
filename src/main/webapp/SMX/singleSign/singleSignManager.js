var m_singleds = null;
var m_singleTbar = [{text:"删除",iconCls:"xy-delete",handler:deleteSingle}, '-',{text:"导出",iconCls:"xy-export",handler:exportExcel}];
var m_singleGrid = null;

function getSingleSign()
{
	var m_singleSign = m_singleGrid.getSelectionModel().getSelections();
	var jsonData = "";
	var p = 0;
	for (var i = 0, len = m_singleSign.length;i < len; i++)
 	{
 		var ss = m_singleSign[i].get("tokenId");
 		if (i == 0) 
	 	{
			jsonData = jsonData + ss;
	 	}
	 	else
	 	{
	 		jsonData = jsonData + "," + ss;
	 	}
	}
	return jsonData;
}

function exportExcel()
{
	var basPath = Ext.get("basePath").dom.value;
	
	window.location.href = basPath + "/SM/singleSignExport.action";
	//window.open(basPath + "/SM/singleSignExport.action",'文件下载','height=300,width=400,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
}

function deleteSingle()
{
	var ids = getSingleSign();
	var question = top.Ext.MessageBox.confirm('提示框', '是否删除当前选中的条目  ?',onQuery);
	function onQuery(btn){ 
	    if(btn == 'yes'){ 
	        SingleSignProxy.Delete(ids,{callback:deleteSingleResponse ,async:false});
	    } 
	}
}

function deleteSingleResponse(data)
{
	if(data.error == 0)
	{
		top.Ext.MessageBox.alert("提示","操作成功");
		m_singleds.reload();
	}
	else
	{
		top.Ext.MessageBox.alert("错误",data.errDesc);
	}
}

function loadException(This, node, response) 
{
	showExtLoadException(This, node, response);
}

function init()
{
	Ext.BLANK_IMAGE_URL = "ext/resources/images/default/s.gif";
	var m_RowNum = new Ext.grid.RowNumberer();
	var m_tokenId = {header:"令牌标识",dataIndex:"tokenId",hidden:true,fixed:true};
	var m_userId = {header:"用户标识",dataIndex:"userId",hidden:true,fixed:true};
	var m_dtcurrent = {header:"生成时间",dataIndex:"dtcurrent",sortable:true,width:150};
	var m_varipaddress = {header:"客户端",dataIndex:"varipaddress",sortable:true,width:150};
	var m_varname = {header:"登录用户",dataIndex:"varname",sortable:true,width:100};
	var m_displayName = {header:"姓名",dataIndex:"displayName",sortable:true,width:100};
	var m_userstatus = {header:"用户状态",dataIndex:"userstatus",hidden:true,fixed:true};
	var m_companyId = {header:"公司标识",dataIndex:"companyId",hidden:true,fixed:true};
	var m_companyno = {header:"公司编号",dataIndex:"companyno",sortable:true,width:100};
	var m_companydescription = {header:"公司名称",dataIndex:"companydescription",sortable:true,width:150};
	var m_unionId = {header:"组织标识",dataIndex:"unionId",hidden:true,fixed:true};
	var m_unionno = {header:"组织编号",dataIndex:"unionno",sortable:true,width:100};
  	var m_uniondescription = {header:"组织名称",dataIndex:"uniondescription",sortable:true,width:150};
  	var sm=new Ext.grid.CheckboxSelectionModel({handleMouseDown:Ext.emptyFn});
  	m_singleds = new  Ext.data.JsonStore({url:"SM/getSingleSignInfo.action", totalProperty:"total", root:"data", fields:["tokenId","userId","dtcurrent","varipaddress","varname","displayName","userstatus","companyId","companyno","companydescription","unionId","unionno","uniondescription"]});
  	m_singleds.on("loadexception", loadException);
  	var singlecm = new Ext.grid.ColumnModel([m_RowNum,sm,m_tokenId,m_userId,m_dtcurrent,m_varipaddress,m_varname,m_displayName,m_userstatus,m_companyId,m_companyno,m_companydescription,m_unionId,m_unionno,m_uniondescription]);
  	var pagesinglebar = new Ext.PagingToolbar({region:'south',displayInfo:true,store:m_singleds,pageSize:20,displayMsg:"显示第 {0} 条到 {1} 条记录，一共 {2} 条",emptyMsg:"没有记录"});
  	m_singleGrid = new Ext.grid.GridPanel({
  		                                            region : 'center',
			  		                                store:m_singleds,
											  		selModel: sm,
											  		colModel:singlecm, 
											  		loadMask : true,
											  		tbar:m_singleTbar,
											  		autoWidth: true,
									  		        autoScroll:true,
											  		enableColumnMove:false,
											  		enableHdMenu:false
											  		//bbar:pagesinglebar
								         });
	
    var vpAll = new Ext.Viewport({layout:'border',items:[m_singleGrid,pagesinglebar]});
    
    m_singleds.load({
					   params : {start:0,limit:20}
		         });
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);