var m_barComp = null;// 公司选择
var m_barDept = null;// 部门选择
var m_barUser = null;// 人员选择
var m_beginDT = null;
var m_endDT = null;
var edtSerialNum = null;

function getConditions(applyBegin, applyEnd) {
	m_beginDT = new top.Ext.form.DateField({
				fieldLabel : "提交时间从",
				width : 200,
				id : "applyBeginDT",
				format : "Y-m-d",
				readOnly : true,
				value : applyBegin
			});
	m_endDT = new top.Ext.form.DateField({
				fieldLabel : "到",
				width : 200,
				id : "applyEndDT",
				format : "Y-m-d",
				readOnly : true,
				value : applyEnd
			});
	var params = [{
				name : 'compID',
				value : ''
			}];

	m_barComp = new top.Ext.app.XyTree({
				width : 200,
				fieldLabel : "申请人公司",
				leafSelect : false,
				rootTitle : '请选择公司',
				scriptPath : 'wf',
				firstSqlFile : 'selectCompanyTree0',
				otherSqlFile : 'selectCompanyTree1'
			});
	m_barComp.on("valuechange", company_callback_handler);

	m_barDept = new top.Ext.app.XyTree({
				width : 200,
				fieldLabel : "申请人部门",
				leafSelect : false,
				rootTitle : '请选择部门',
				scriptPath : 'wf',
				firstSqlFile : 'selectDeptTree0',
				otherSqlFile : 'selectDeptTree1',
				param : params
			});
	m_barDept.on("valuechange", dept_callback_handler);

	var clnRowNum = new top.Ext.grid.RowNumberer();
	var clnUserID = {
		header : "ID",
		hidden : true,
		fixed : false,
		dataIndex : "column0"
	};
	var clnUserName = {
		header : "姓名",
		sortable : true,
		dataIndex : "column1",
		searchField : 'displayname'
	};
	var clnLoginName = {
		header : "登陆名",
		sortable : true,
		dataIndex : "column2",
		searchField : 'varname'
	};

	var cm = new top.Ext.grid.ColumnModel([clnRowNum, clnUserID, clnUserName,
			clnLoginName]);

	m_barUser = new top.Ext.app.XyGrid({
				width : 200,
				fieldLabel : "申请人",
				rootTitle : '请选择人员',
				scriptPath : 'wf',
				sqlFile : 'selectUser',
				columnModel : cm,
				displayField : 'column1',
				valueField : 'column0'
			});

	edtSerialNum = new top.Ext.form.TextField({
				fieldLabel : "表单编号",
				allowBlank : true,
				layout : "form",
				width : 200,
				listeners : {
					specialKey : function(field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							on_Enter();
						}
					}
				}
			});

	var pnlProcess = new top.Ext.Panel({
				id : "wf_pnlProcess",
				layout : "form",
				bodyStyle : "padding:5px 5px",
				autoHeight : true,
				labelAlign : "right",
				labelWidth : 70,
				autoWidth : true,
				items : [m_beginDT, m_endDT, m_barComp, m_barDept, m_barUser,
						edtSerialNum]
			});

	var winFilter = new top.Ext.Window({
				title : "待办工作项——过滤条件",
				width : 320,
				height : 230,
				modal : true,
				layout : "form",
				closeAction : "close",
				resizable : false,
				items : [pnlProcess],
				buttons : [{
							text : "确定",
							handler : on_OkClick
						}, {
							text : "关闭",
							handler : function() {
								winFilter.close();
							}
						}]
			});
	winFilter.show();
	function on_Enter() {
		var serialNum = edtSerialNum.getValue();
		var data = {
			beginDate : "",
			endDate : "",
			company : "",
			dept : "",
			applyUser : "",
			formSerialNum : serialNum
		};
		getApproveItemByConditions(data);
		winFilter.close();
	};
	function on_OkClick() {
		if (m_beginDT.getValue() == null) {
			top.Ext.MessageBox.alert("提示", "请选择申请时间的开始范围。");
			return;
		}
		if (m_endDT.getValue() == null) {
			top.Ext.MessageBox.alert("提示", "请选择申请时间的结束范围。");
			return;
		}
		if (m_beginDT.getValue() > m_endDT.getValue()) {
			top.Ext.MessageBox.alert("提示", "申请时间的开始范围不能大于结束范围。");
			return;
		}

		var serialNum = edtSerialNum.getValue();
		var data = {
			beginDate : m_beginDT.getValue().format('Y-m-d'),
			endDate : m_endDT.getValue().format('Y-m-d'),
			company : m_barComp.hiddenData == null
					? ""
					: m_barComp.hiddenData.id,
			dept : m_barDept.hiddenData == null ? "" : m_barDept.hiddenData.id,
			applyUser : m_barUser.hiddenData == null
					? ""
					: m_barUser.hiddenData["column0"],
			formSerialNum : serialNum
		};
		getApproveItemByConditions(data);
		winFilter.close();
	}

	function loadException(This, node, response) {
		var status = response.status;
		var text = response.responseText;

		switch (status) {
			case 404 :
				top.Ext.MessageBox.alert("错误", "请求url不可用。");
				break;
			case 200 :
				if (text.length > 0) {
					top.Ext.MessageBox.alert("错误", text);
				}
				break;
			default :
				top.Ext.MessageBox.alert("错误", status + "," + text);
				break;
		}
	}
}

function company_callback_handler(oldValue, newValue) {
	m_barDept.param = [{
				name : 'compID',
				value : newValue == null ? "" : newValue.id
			}];
	m_barDept.reload();
	m_barDept.setValue("");
	setUserParam();
}
function dept_callback_handler(oldValue, newValue) {
	setUserParam();
}
function setUserParam() {
	if (m_barComp.hiddenData != null && m_barDept.hiddenData != null) {
		m_barUser.param = [{
					name : 'compid',
					value : m_barComp.hiddenData.id
				}, {
					name : 'deptid',
					value : m_barDept.hiddenData.id
				}];
		m_barUser.sqlFile = 'selectUserByCompAndDept';
	} else if (m_barComp.hiddenData != null) {
		m_barUser.param = [{
					name : 'compid',
					value : m_barComp.hiddenData.id
				}];
		m_barUser.sqlFile = 'selectUserByComp';
	} else if (m_barDept.hiddenData != null) {
		m_barUser.param = [{
					name : 'deptid',
					value : m_barDept.hiddenData.id
				}];
		m_barUser.sqlFile = 'selectUserByDept';
	} else {
		m_barUser.sqlFile = 'selectUser';
	}
	// m_barUser.reload();
}
