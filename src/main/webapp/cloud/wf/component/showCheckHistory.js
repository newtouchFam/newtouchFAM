/**
 * 审批历史组件
 * @param processInstID
 */
function showCheckHistoryWin(processInstID)
{
	var dsItems = new top.Ext.data.JsonStore({
				url : "wf/checkhistory/list",
				root : "data",
				sortInfo: {field: "checkstep", direction: "DESC"} ,
				fields : ["checkid", "checkstep", "activityname", "displayname", "checktime", "isagree", "checkdesc"]
			});
	dsItems.on("loadexception", loadException);
	
	var clnExpander = new Ext.grid.RowExpander({tpl : new top.Ext.Template("<p><b>详细信息:</b><br><br>{checkdesc}</p><br>")});
	var clnCheckID = {header: "ID", dataIndex: "checkid", hidden: true};
	var clnStep = {header: "审批步骤", dataIndex: "checkstep", width:65, resizable: false, sortable: true};
	var clnAc = {header: "审批环节", dataIndex: "activityname", width:100, sortable: true};
	var clnUser = {header: "审批者", dataIndex: "displayname", width:70, sortable: true};
	var clnDesc = {header: "审批意见", dataIndex: "checkdesc", width:120, sortable: true};
	var clnTime = {header: "审批时间", dataIndex: "checktime", width:125, sortable: true};
	var clnType = {header: "类型", dataIndex: "isagree", width:80,resizable: false, renderer: onTypeRender, hidden : true};

	var cm = new top.Ext.grid.ColumnModel([clnExpander,clnCheckID, clnStep, clnAc, clnUser, clnDesc, clnTime, clnType]);

	var sm = new top.Ext.grid.RowSelectionModel({singleSelect : true});
	
	var grdChk = new top.Ext.grid.GridPanel({
				store: dsItems,
				border: false,
				colModel: cm,
				enableColumnMove: false,
				enableHdMenu: false,
				selModel: sm,
				plugins: clnExpander,
				iconCls: 'xy-grid',
				loadMask: {msg: "数据加载中，请稍等..."}
			});
	
	
	var winChk = new top.Ext.Window({
			title : "审批历史",
			width : 520,
			height : 320,
			modal : true,
			layout: "fit",
			closeAction : 'close',
			resizable: true,
			items: [grdChk],
			buttons : [{text: "关闭",handler : function(){winChk.close();}}]
		});
	winChk.show();
	
	dsItems.load({params: {processInstID: processInstID}});

	function onTypeRender(s)
	{
		switch(s)
		{
			case 0:
				return "拒绝";
			case 1:
				return "同意";
			case 2:
				return "转发";
			case 3:
				return "转拟办";
			case 4:
				return "修改数据";
			default:
				return "其他";
		}
	}
	
	function loadException(This, node, response)
	{
		var status = response.status;
		var text = response.responseText;
	
		switch (status)
		{
			case 404 :
				top.Ext.MessageBox.alert("加载数据时发生以下错误", "请求url不可用");
				break;
			case 200 :
				if (text.length > 0)
				{
					top.Ext.MessageBox.alert("加载数据时发生以下错误", text);
				}
				break;
			default :
				top.Ext.MessageBox.alert("加载数据时发生以下错误", status + "," + text);
				break;
		}
	}	
}