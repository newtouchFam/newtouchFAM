var m_updatePwdForm1 = null;
var m_updatePwdForm2 = null;
var m_updatePwdWin1 = null;
var m_updatePwdWin2 = null;
var m_updatePwdLoadMask1 = null;

function hideUpdatePwdLoadMask()
{
	if (m_updatePwdLoadMask1 != null)
	{
		m_updatePwdLoadMask1.hide();
		m_updatePwdLoadMask1 = null;
	}
}

function doCloseUpdateWin()
{
	if (m_updatePwdWin1 != null)
	{
		AuthProxy.getPersonInfoByVarname( Ext.get("M8_USERCODE").dom.value,"001", {callback:setBaseInfo,async:true});
		top.Ext.getCmp("updatePwdWin1").hide();
	}
}
function doCloseUpdateWin2()
{
		top.Ext.getCmp("updatePwdWin2").close();

}
function doSelectAll(){
	top.Ext.getCmp("getpanel").getSelectionModel().selectAll();
}

function doDeleteAll(){
	top.Ext.getCmp("getpanel").getSelectionModel().clearSelections();
}
function dobackSelect(){
				var totalall =0;
				totalall=top.Ext.getCmp("getpanel").getStore().getCount();//数据行数
				for(var i=0;i<totalall;i++){
					if(!top.Ext.getCmp("getpanel").getSelectionModel().isSelected(i)){
					  		top.Ext.getCmp("getpanel").getSelectionModel().selectRow(i,true);
					}else{
						top.Ext.getCmp("getpanel").getSelectionModel().deselectRow(i);
					}
				}

}
function doDownUpdateWin2(){
	var addappaitem = [];
	var selections = top.Ext.getCmp("getpanel").getSelectionModel().getSelected();

	if(selections==null){
		top.Ext.MessageBox.alert("提示","请任意选择一条记录。");
		return false;
	}
//	for (var i = 0; i < selections.length; i++) {
//			addappaitem.push(selections[i].get("fileid"));
			var conn = Ext.lib.Ajax.getConnectionObject().conn;//得到一个同步的Ajax
			conn.open("POST", 'wf/FindFileById.action?serialNum=123&&fileID='+selections.get("fileid"),false);
			conn.send(null);
			var obj = Ext.decode(conn.responseText);
		    if(obj.isHave =='yes')//如果有文件就下载
		    {
		    	var dowloadFile = new com.freesky.ssc.form.reim.BZUpload();
//		    	dowloadFile.downLoadOnFrame(selections[i].get("fileid"));
		    	dowloadFile.downFile(selections.get("fileid"));
		    }
		    else
		    {
		    	alert("没有要下载的帮助文件！");
		    }
//		}
		top.Ext.getCmp("updatePwdWin2").close();
}
function processUpdatePasswordResult(result)
{
	hideUpdatePwdLoadMask();

	if (result.error == 0)
	{

		top.Ext.MessageBox.alert("信息","信息修改成功。");

	}
	else
	{

		top.Ext.MessageBox.alert("错误", result.errDesc);

	}
}

function setBaseInfo(result)
{
	m_updatePwdForm1.getComponent("mailvar").setValue(result.mail);

	m_updatePwdForm1.getComponent("phonevar").setValue(result.phone);

	m_updatePwdForm1.getComponent("eipuser").setValue(result.eipuser);

}

function doUpdatePassword()
{
	var varcode = m_updatePwdForm1.getComponent("varcode1").getValue().trim();
	if (varcode == "")
	{
		top.Ext.MessageBox.alert("提示","请输入账号。");
		return false;
	}

	var newPwd = m_updatePwdForm1.getComponent("newPwd1").getValue();
	var newsPwd2 = m_updatePwdForm1.getComponent("newsPwd21").getValue();
	if (newPwd != newsPwd2)
	{
		top.Ext.MessageBox.alert("提示","新密码和确认密码不一致。");
		return false;
	}

	var oldPwd = m_updatePwdForm1.getComponent("oldPwd1").getValue();

	var mail =  m_updatePwdForm1.getComponent("mailvar").getValue();

	var phone =  m_updatePwdForm1.getComponent("phonevar").getValue();

	var setid = "001";
	var eipuser =  m_updatePwdForm1.getComponent("eipuser").getValue();

	m_updatePwdLoadMask1 = new top.Ext.LoadMask("updatePwdWin1",{msg:"修改...",removeMask:true});
	m_updatePwdLoadMask1.show();

	try
	{
		AuthProxy.updatePersonInfo(varcode, oldPwd, newPwd, setid,phone,mail,eipuser,"",{callback:processUpdatePasswordResult,async:true});
	}
	catch(ex)
	{
		hideUpdatePwdLoadMask();

		top.Ext.MessageBox.alert("异常", ex);
	}

	return true;
}

function passinit()
{
	if (m_updatePwdForm1 == null)
	{
		var items = new Array();
		items[0] = new top.Ext.form.TextField({
		      fieldLabel:"账号",id:"varcode1", value: Ext.get("M8_USERCODE").dom.value,
		      disabled : true
		});
		items[1] = new top.Ext.form.TextField({
		      fieldLabel:"原密码",id:"oldPwd1",inputType:"password"
		});
		items[2] = new top.Ext.form.TextField({
		      fieldLabel:"新密码",id:"newPwd1" ,inputType:"password"
		});
		items[3] = new top.Ext.form.TextField({
		      fieldLabel:"确认密码",id:"newsPwd21" ,inputType:"password"
		});

		items[4] = new top.Ext.form.TextField({
		      fieldLabel:"手机",id:"phonevar" ,inputType:"text"
		});

		items[5] = new top.Ext.form.TextField({
		      fieldLabel:"邮件",id:"mailvar" ,inputType:"text"
		});
		items[6] = new top.Ext.form.TextField({
		      fieldLabel:"EIP用户",id:"eipuser" ,inputType:"text"
		});
		AuthProxy.getPersonInfoByVarname( Ext.get("M8_USERCODE").dom.value,"001", {callback:setBaseInfo,async:true});

		var buttons = new Array();
		buttons[0] = {text:"确定",handler:doUpdatePassword};
		buttons[1] = {text:"关闭",handler:doCloseUpdateWin};

		m_updatePwdForm1 = new top.Ext.form.FormPanel({
									  		frame:true,
									  		labelAlign:"right",
									  		labelWidth:80,
									  		items:items,
									  		buttons:buttons
											}
											);
	}

	if (m_updatePwdWin1 == null)
	{
		m_updatePwdWin1 = new top.Ext.Window({
									id:"updatePwdWin1",
									title:"修改个人信息",
									width:350,autoHeight:true,
									draggable:false,resizable:false,
									//modal:true,
									plain:true,
									border:false,
									modal:true,
									closable:false,
									items:m_updatePwdForm1
								});
	}
	m_updatePwdWin1.show();
}

function getperiod()
{
	$.getJSON("/datamanager/periodmanager/getperiod","",function(data){
    	if(data.success)
    	{
    		$("#period").html(data.msg);
    	}
    });
}

function init()
{
	Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
	var isie = document.all?true:false;
	if(isie)
	{
	    document.getElementById('setId').innerText = Ext.get("M8_SETID").dom.value;
	    document.getElementById('compName').innerText = Ext.get("M8_COMPANYNAME").dom.value;
	    document.getElementById('userName').innerText = Ext.get("M8_USERNAME").dom.value;
	}
	else
	{
	    document.getElementById('setId').textContent = Ext.get("M8_SETID").dom.value;
	    document.getElementById('compName').textContent = Ext.get("M8_COMPANYNAME").dom.value;
	    document.getElementById('userName').textContent= Ext.get("M8_USERNAME").dom.value;
	}
	
	getperiod();
}

function downLoad()
{

		var record = top.Ext.data.Record.create([
    	        {name:'fileid',mapping:'fileid'},
				{name : 'filename',mapping : 'filename'},
				{name : 'filesize',mapping : 'filesize'},
				{name : 'createdate',mapping : 'createdate'}]);

				//	var store1 = new top.Ext.data.Store({
//		baseParams : {
//			serialNum:'123'
//			},
    	 var store1 = new top.Ext.data.JsonStore(
		{
			baseParams : {
			serialNum:'123'
			},
			totalProperty :"total",
			id : "id",
			root : 'data',
			url :'wf/GetFileListAction.action',
			fields : record
		});
		var clnRowNum = new top.Ext.grid.RowNumberer();

		var fileid =
		{
			header : '主键ID',
			dataIndex : 'fileid',
			width : 150
		};
		var filename =
		{
			header : '文件名称',
			dataIndex : 'filename',
			width : 150
		};
		var filesize =
		{
			header : '文件大小(字节)',
			dataIndex : 'filesize',
			align		:	'Right',
			width : 80
		};
		var createdate =
		{
			header : '上传时间',
			dataIndex : 'createdate',
//			renderer:function(value){
//				return value.substring(0,10)
//			},
			width : 130
		};

		var cm = new top.Ext.grid.ColumnModel([clnRowNum, filename,
		                                   filesize, createdate]);
		var sm = new top.Ext.grid.RowSelectionModel({singleSelect : true});

//		var bbar = new ssc.component.BaseMultiPagingToolBar(
//		{
//			store : store1
//		});

		 var gridPanel1 = new top.Ext.grid.GridPanel(
		{
			id:'getpanel',
			store : store1,
			border : false,
			height:300,
			colModel : cm,
			selModel : sm,
			iconCls : 'xy-grid',
			autoScroll : true,
			enableColumnMove : false,
			enableColumnResize :  true,
			enableHdMenu  : false,
			autoWidth : true,
			autoScroll : true,
//			tbar : tbar,
//			bbar : bbar,
			loadMask :
			{
				msg : "数据加载中，请稍等..."
			}
		});
		store1.reload();
//		this.grid.on('bodyresize', this.grid.onBodyResize);
//		this.layout = 'fit';
//		this.items = [this.grid];
//	var store1 = new top.Ext.data.Store({
//		baseParams : {
//			serialNum:'123'
//			},
//		timeout:88888888,
//		reader : new top.Ext.data.JsonReader({
//				totalProperty :"total",
//				id : "id",
//				root : 'data'
//			}, [
//			{name:'fileid',mapping:'fileid'},
//			{name : 'filename',mapping : 'filename'},
//			{name : 'filesize',mapping : 'filesize'},
//			{name : 'createdate',mapping : 'createdate'}]),
//		proxy : this.proxy||new top.Ext.data.HttpProxy({url :'wf/GetFileListAction.action'})
//	});
//		 var sm = new top.Ext.grid.CheckboxSelectionModel(
//		{
//			singleSelect : true
//		});
////		sm.handleMouseDown = top.Ext.emptyFn;
//		var gridPanel1 = new top.Ext.grid.GridPanel({
//			id:'getpanel',
//			loadMask:true ,
//			region:'center',
//			store : store1,
//			height:300,
//			selModel : new top.Ext.grid.RowSelectionModel({}),
//			autoWidth:true,
//			loadMask: {msg:'正在取数,请稍等！'},
//			stripeRows:true,
//			columns : [
//					sm,
//					new top.Ext.grid.RowNumberer(),
//
////					{
////						width 		: 	0,
////						header 		: 	'主键',
////						hidden		: 	 true,
////						dataIndex 	: 	'fileid',
////						hidden		:	true
////					},
//					{
//						width 		: 	110,
//						header 		: 	'文件名称',
//						dataIndex 	: 	'filename'
//					},
//					{
//						width 		: 	110,
//						header 		: 	'文件大小(字节)',
//						dataIndex 	: 	'filesize',
//						align		:	'Right'
//					},{
//						width 		: 	150,
//						header 		: 	'上传时间',
//						dataIndex 	: 	'createdate'
//					}
//	        ]
//		});
//		store1.reload();
		var buttons = new Array();
//		buttons[0] = {text:"全选",handler:doSelectAll};
//		buttons[1] = {text:"全清",handler:doDeleteAll};
//		buttons[2] = {text:"反选",handler:dobackSelect};
		buttons[0] = {text:"下载",handler:doDownUpdateWin2};
		buttons[1] = {text:"取消",handler:doCloseUpdateWin2};

		m_updatePwdForm2 = new top.Ext.form.FormPanel({
									  		frame:true,
									  		labelAlign:"right",
									  		labelWidth:80,
									  		width:450,
											hight:500,
									  		items:[gridPanel1],
									  		buttons:buttons
											}
											);


		m_updatePwdWin2 = new top.Ext.Window({
									id:"updatePwdWin2",
									title:"帮助文档",
									width:450,
//									height:400,
									autoHeight:true,
									draggable:false,resizable:false,
									//modal:true,
									plain:true,
									border:false,
									modal:true,
									closable:false,
									items:m_updatePwdForm2
								});

	m_updatePwdWin2.show();



//	var conn = Ext.lib.Ajax.getConnectionObject().conn;//得到一个同步的Ajax
//	conn.open("POST", 'wf/FindFileById.action?serialNum=123&&fileID=fileid123',false);
//	conn.send(null);
//	var obj = Ext.decode(conn.responseText);
//    if(obj.isHave =='yes')//如果有文件就下载
//    {
//    	var dowloadFile = new com.freesky.ssc.form.reim.BZUpload();
//    	dowloadFile.downLoadOnFrame();
//    }
//    else
//    {
//    	alert("没有要下载的帮助文件！");
//    }
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);