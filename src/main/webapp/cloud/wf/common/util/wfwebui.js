/* 提交 */

var m_xmlString = null;
top.Ext.MessageBox.confirm = function(a, b, c) {
	top.Ext.Msg.show({
				title : a,
				msg : b,
				fn: c,
				buttons : {
					yes : '是',
					no : '否'
				},
				icon : Ext.MessageBox.INFO				
			});

};
function wfapprove(xmlString, callback) {
	m_xmlString = xmlString;
	var approveWin = new Ext.Window({
		title : "请选择要提交的人",
		width : 320,
		height : 320,//480,
		modal : true,
		closeAction : 'close',
		resizable : false,
		html : "<IFRAME width='100%' height='100%' id='approve_frame' name='approve_frame' frameborder=0 src='WfApp/scripts/wfengine/submit.jsp' /> ",
		buttons : [{
					text : '确定',
					handler : ok_handler
				}, {
					text : "关闭",
					handler : function() {
						approveWin.close();
					}
				}]
	});
	approveWin.show();

	function ok_handler() {
		var activityUserXml = "";
		activityUserXml = Ext.get("approve_frame").dom.contentWindow
				.wf_getSelections();
		if (activityUserXml.length == 0) { return; }

		callback(activityUserXml);

		approveWin.close();
	}
}

function getXml() {
	return m_xmlString;
}

/* 转发、转拟办 */
function showTransform(userId, callback) {
	var winTran = new Ext.Window({
		title : "请选择要转发的人",
		width : 500,
		height : 500,
		modal : true,
		closeAction : 'close',
		resizable : false,
		html : "<IFRAME width='100%' height='100%' id='wf_transform_frame' name='wf_transform_frame' frameborder=0 src='WfApp/scripts/wfengine/transform.jsp?userid="
				+ userId + "' />",
		buttons : [{
					text : '确定',
					handler : ok_handler
				}, {
					text : "关闭",
					handler : function() {
						winTran.close();
					}
				}]
	});
	winTran.show();

	function ok_handler() {
		var iframeTrans = Ext.get("wf_transform_frame").dom.contentWindow;
		var transformId = iframeTrans.wf_getSelected();
		if (transformId.length == 0) { return; }

		if (transformId == userId) {
			top.Ext.MessageBox.alert("提示", "不能选择自己");
			return;
		}

		callback(transformId);

		winTran.close();
	}
}

function wftransform(userId, callback) {
	top.Ext.MessageBox.confirm("请确认",
			"转发后将由您指定的其他人员代替您进行审批处理。<br>确认请按“是”，取消请按“否”。", confirmCallBak);

	function confirmCallBak(q) {
		
		if (q == "yes") {
			showTransform(userId, callback);
		}
	}
}

function wftransmit(userId, callback) {
	top.Ext.MessageBox.confirm("请确认",
			"本操作是向您指定的人员收集意见，其处理完成后还需要您再次提交。<br>确认请按“是”，取消请按“否”。",
			confirmCallBak);

	function confirmCallBak(q) {
		
		if (q == "yes") {
			showTransform(userId, callback);
		}
	}
	// var question =
	// confirm("本操作是向您指定的人员收集意见，其处理完成后还需要您再次提交。确认请按“是”，取消请按“否”。");
	//
	// if (question != "0") {
	// showTransform(userId, callback);
	// }
}

/* 退回 */
function wfrollback(workItemId, callback) {
	var rollbackWin = new Ext.Window({
		title : "请选择要退到的节点和审批人",
		width : 430,
		height : 390,
		modal : true,
		closeAction : 'close',
		html : "<IFRAME width='100%' height='100%' id='wf_rollbackFrm' name='wf_rollbackFrm' frameborder=0 src='WfApp/scripts/wfengine/rollback.jsp?workItemId="
				+ workItemId + "' />",
		buttons : [{
					text : '确定',
					handler : ok_handler
				}, {
					text : '关闭',
					handler : function() {
						rollbackWin.close();
					}
				}]
	});
	rollbackWin.show();

	function ok_handler() {
		var iframeAct = Ext.get("wf_rollbackFrm").dom.contentWindow;
		var activityID = iframeAct.wf_getActivityID();
		if (activityID.length == 0) { return; }
		var userIdJson = iframeAct.wf_getUserJson();
		if (userIdJson.length == 0) { return; }

		callback(activityID, userIdJson);

		rollbackWin.close();
	}
}

function wfprocessprint(processInstID) {
	var s = window
			.showModalDialog("processPrint.jsp?processInstID=" + processInstID,
					null,
					"dialogWidth:800px;dialogHeight:600px;center:1;scroll:yes;help:0;status:0");
}