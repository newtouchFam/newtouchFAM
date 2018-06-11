/**
 * 习惯用语组件
 * @param callback
 */
function showIdiomsWin(callback)
{
	var dsIdioms = new Ext.data.JsonStore(
		{
			url : "wf/idioms/list",
			totalProperty : "total",
			root : "data",
			fields : ["idiomsID", "idioms"]
		});
	dsIdioms.on("loadexception", showExtLoadException);
	dsIdioms.load({params: {start : 0, limit : 12} });

	var clnRowNum = new Ext.grid.RowNumberer();
	var clnIdiomsID = {header:"ID", dataIndex:"idiomsID", hidden:true, fixed:false };
	var clnIdioms = {header:"习惯用语", dataIndex:"idioms", width:360, resizable: false, sortable:true };
	
	var cm = new Ext.grid.ColumnModel([clnRowNum, clnIdiomsID, clnIdioms]);
	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});
	
	barPageIdioms = new Ext.PagingToolbar({
				pageSize: 12,//PER_PAGE_SIZE,
				store: dsIdioms,
				displayInfo: true,
				displayMsg: "当前第{0}条到{1}条，共 {2}条",
				emptyMsg: "没有记录"
			});

	var barAdd = {text:"增加", handler:addClick, iconCls:"xy-add"};
	var barDelete = {text:"删除", handler:delClick, iconCls:"xy-delete1"};
	
	var barTop = ["-", "<INPUT TYPE='TEXT' STYLE='width:200px;' ID='txtIdioms' NAME='txtIdioms' VALUE=''/>", barAdd, "-", barDelete];
	
	grdIdioms = new Ext.grid.GridPanel({
				id: "grdIdioms",
	            height: 305,
	            width: 385,
				store: dsIdioms,
				border: false,
				plain: true,
				colModel: cm,
				enableColumnMove: false,
				enableHdMenu: false,
				selModel: sm,
				iconCls: "xy-grid",
				tbar: barTop,
				loadMask : {msg : "数据加载中，请稍侯..."	}
			});
	
	var	winIdioms = new Ext.Window({
		id: "idiomsWin",
		title: "习惯用语",
		width: 400,
		height: 400,
		modal: true,
		closeAction: "close",
		items: [grdIdioms, barPageIdioms],
		plain: true,
		maskDisabled: false,
		resizable: false,
		buttons: [{text:"确定", handler: selIdioms},
			{text:"关闭", handler: function(){winIdioms.close();}}]
       });
	winIdioms.show();
	
	function addClick()
	{
		var txtDom = Ext.get("txtIdioms").dom;
		if (txtDom)
		{
			var s = txtDom.value;
			if (s.realLength() == 0 || s.realLength() > 255)
			{
				alert("习惯用语不能为空或超过255字节");				
				return;
			}

			Ext.Ajax.request(
			{
				url : "wf/idioms/add",
				method : "post",
				params :
				{
					idiomsValue : s
				},
				sync : true,
				success : addResponse,
				failure : baseFailureCallbackFun,
				scope : this
			});

		}
	}
	function addResponse(response, options)
	{
		var data = Ext.decode(response.responseText);

		if (data.success)
		{
			//数据重新刷新
			dsIdioms.reload();
		}
		else
		{
			Ext.MessageBox.alert("错误", data.msg);
		}
	}

	function baseFailureCallbackFun(response, options)
	{
		var data = Ext.decode(response.responseText);
		Ext.MessageBox.alert("错误", data.msg);
	}

	function delClick()
	{
		var rc = grdIdioms.getSelectionModel().getSelected();
		if (rc == null)
		{
			Ext.MessageBox.alert("提示", "请选择一条习惯用语");
			return;
		}
		var strMsg = '你确认删除【' +  rc.get("idioms")  + '】习惯用语吗';
		Ext.MessageBox.confirm('删除确认', strMsg, delCallBack);
	}
	function delCallBack(btn, text)
	{
		if (btn == "yes")
		{
			// 提交删除
			var rc = grdIdioms.getSelectionModel().getSelected();
			if (rc == null)
			{
				Ext.MessageBox.alert("提示", "请先选择一条习惯用语");
				return;
			}
			
			winIdioms.setDisabled(true);
			
			var sID = rc.get("idiomsID");
			
			Ext.Ajax.request(
			{
				url : "wf/idioms/delete",
				method : "post",
				params :
				{
					idiomsID : sID
				},
				sync : true,
				success : deleteResponse,
				failure : baseFailureCallbackFun,
				scope : this
			});
		}
	}
	function deleteResponse(response, options)
	{
		var data = Ext.decode(response.responseText);

		if (data.success)
		{
			//数据重新刷新
			dsIdioms.reload();
		}
		else
		{
			Ext.MessageBox.alert("错误", data.msg);
		}

		winIdioms.setDisabled(false);
	}
	function selIdioms()
	{
		var rc = grdIdioms.getSelectionModel().getSelected();
		if (rc == null)
		{
			Ext.MessageBox.alert("提示", "请选择一条习惯用语");
			return;
		}
		
		var sRet = rc.get("idioms");
		callback(sRet);
		
		winIdioms.close();
	}
}
