var m_grdProcess = null;// GRID
var m_winFilter = null;// 过滤窗口
var m_userID = null;// 当前登陆用户ID
var m_compID = null;// 当前登陆人所在公司ID
var m_deptID = null;// 当前登陆人所在部门ID
var m_compName = null;// 当前登陆人所在公司名称
var m_deptName = null;// 当前登陆人所在部门名称
var m_userName = null;// 当前登陆用户名称
var m_dsItems = null;// 数据集
var m_barPage = null;// 分页条
var m_winSelComp = null;// 选择公司窗体
var m_winSelDept = null;// 选择部门窗体
var m_winSelUser = null;// 选择人员窗体

function init()
{
	m_userID = Ext.get("userID").dom.value;
	m_compID = Ext.get("compID").dom.value;
	m_deptID = Ext.get("deptID").dom.value;

	// 默认异步请求最长等待时间3分钟
	Ext.Ajax.timeout = 180000;

	var strUrl = "wf/ApproveItemGetByUserAction.action?userID=" + m_userID;
	loadData(strUrl, "", "", "", "", "", "");
}

function loadData(strUrl, beginDate, endDate, company, dept, applyUser, formSerialNum)
{
	m_dsItems = new Ext.data.Store(
	{
		url : strUrl,
		reader : new Ext.data.JsonReader(
		{
			root : 'data',
			totalProperty : "total"
		}, Ext.data.XyCalcRecord.create([ "workitemid",
		{
			name : 'action2',
			type : 'string',
			dependencies : [ 'action2' ],
			notDirty : true,
			calc : function(record)
			{
				if (record.data.isinstancy == "1")
				{
					return "xy-instancy_flag";
				}
				else
				{
					return "";
				}
			}
		},
		{
			name : 'action3',
			type : 'string',
			dependencies : [ 'action3' ],
			notDirty : true,
			calc : function(record)
			{
				if (record.data.status == "3")
				{
					return "wfmgr_suspend";
				}
				else
				{
					return "";
				}
			}
		}, "processinstname", "displayname", "vardescription",
		{
			name : 'createdate',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, "serialnum", "processinstid", "activityid", "activityname", "settype", "companyname", "formtypename",
		{
			name : "finamount",
			type : 'float'
		}, "memo",
		{
			name : "amount",
			type : 'float'
		}, "isinstancy", "opentype", "barstate", "status", "suspendreson", "barstate", "formstatus", "ifstatus", "busiclasscode", "busiclassname" ]))
	});
	m_dsItems.on("loadexception", loadException);

	var clnRowNum = new Ext.grid.RowNumberer();
	var clnWorkItemID =
	{
		header : "ID",
		dataIndex : "workitemid",
		hidden : true,
		fixed : false
	};
	var clnProcessName =
	{
		header : "流程名称",
		dataIndex : "processinstname",
		width : 180,
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			if (record.data.isinstancy == "1") return '<font color=red>' + value + '</font >';
			else return value;
		}
	};
	var clnDisplayName =
	{
		header : "报账人",
		dataIndex : "displayname",
		width : 60,
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			if (record.data.isinstancy == "1") return '<font color=red>' + value + '</font >';
			else return value;
		}
	};
	var clnDeptName =
	{
		header : "报账部门",
		dataIndex : "vardescription",
		width : 80,
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			if (record.data.isinstancy == "1") return '<font color=red>' + value + '</font >';
			else return value;
		}
	};
	var clnCreateDate =
	{
		header : "申请时间",
		dataIndex : "createdate",
		sortable : true,
		width : 120,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			var strDate = Ext.util.Format.date(value, 'Y-m-d H:i:s');
			if (record.data.isinstancy == "1") return '<font color=red>' + strDate + '</font >';
			else return strDate;
		}
	};
	var clnSerialNum =
	{
		header : "表单编号",
		width : 150,
		dataIndex : "serialnum",
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			if (record.data.isinstancy == "1") return '<font color=red>' + value + '</font >';
			else return value;
		}
	};
	var clncompanyname =
	{
		header : "报账公司",
		width : 160,
		dataIndex : "companyname",
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			if (record.data.isinstancy == "1") return '<font color=red>' + value + '</font >';
			else return value;
		}
	};
	var clnProcessinstID =
	{
		header : "流程实例ID",
		dataIndex : "processinstid",
		hidden : true
	};
	var clnActivityID =
	{
		header : "活动ID",
		dataIndex : "activityid",
		hidden : true
	};
	var clnActivityName =
	{
		header : "当前环节",
		width : 90,
		dataIndex : "activityname",
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			if (record.data.isinstancy == "1") return '<font color=red>' + value + '</font >';
			else return value;
		}
	};
	var clnFromtypeName =
	{
		header : "表单类型",
		width : 120,
		dataIndex : "formtypename",
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			if (record.data.isinstancy == "1") return '<font color=red>' + value + '</font >';
			else return value;
		}
	};
	var clnSettype =
	{
		header : "单位类型",
		hidden : true,
		dataIndex : "settype",
		sortable : true
	};
	var clnAmount =
	{
		header : "报账金额",
		width : 90,
		css : 'text-align:right;',
		dataIndex : "amount",
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{

			if (record.data.isinstancy == "1") return '<font color=red>' + Freesky.Common.XyFormat.cnMoney(value)
					+ '</font >';
			else return Freesky.Common.XyFormat.cnMoney(value);
		}
	};
	var clnFinamount =
	{
		header : "核定金额",
		width : 90,
		css : 'text-align:right;',
		dataIndex : "finamount",
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			if (record.data.isinstancy == "1") return '<font color=red>' + Freesky.Common.XyFormat.cnMoney(value)
					+ '</font >';
			else return Freesky.Common.XyFormat.cnMoney(value);
		}
	};
	var clnMemo =
	{
		header : "报账事由",
		width : 120,
		dataIndex : "memo",
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			if (record.data.isinstancy == "1") return '<font color=red>' + value + '</font >';
			else return value;
		}
	};

	var clnImageState =
	{
		header : "纸质状态",
		hidden : true,
		dataIndex : "barstate",
		sortable : true
	};

	var clnsuspendreson =
	{
		header : "审批备注",
		hidden : true,
		dataIndex : "suspendreson",
		sortable : true
	};

	var action = new Ext.ux.grid.RowActions(
	{
		header : '',
		actions : [
		{
			iconIndex : 'action2',
			qtipIndex : 'qtip2'
		},
		{
			iconIndex : 'action3',
			qtipIndex : 'qtip3'
		} ]
	});

	var clnstatus =
	{
		header : "流程状态",
		dataIndex : "status",
		sortable : true,
		width : 60,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			switch (value)
			{
				case '0' :
					if (record.data.isinstancy == "1") return '<font color=red>初始</font >';
					else return '初始';
				case '1' :
					if (record.data.isinstancy == "1") return '<font color=red>运行</font >';
					else return '运行';
				case '2' :
					if (record.data.isinstancy == "1") return '<font color=red>激活</font >';
					else return '激活';
				case '3' :
					if (record.data.isinstancy == "1") return '<font color=red>挂起</font >';
					else return '挂起';
				case '4' :
					if (record.data.isinstancy == "1") return '<font color=red>完成</font >';
					else return '完成';
				case '5' :
					if (record.data.isinstancy == "1") return '<font color=red>终止</font >';
					else return '终止';
				default :
					return '';
			}
		}
	};
	
	var formStatus = 
	{
        header:"表单状态",
        dataIndex:"formstatus",
        width:90,
        sortable:true
    };
    var ifStatus = {
        header:"接口传递状态",
        dataIndex:"ifstatus",
        width:150,
        sortable:true
    };

	var clnBusiClass =
	{
		header : "业务类型",
		width : 100,
		dataIndex : "busiclassname",
		sortable : true,
		renderer : function(value, metaData, record, rowIndex, colIndex, store)
		{
			if (record.data.isinstancy == "1") return '<font color=red>' + value + '</font >';
			else return value;
		}
	};

	var cm = new Ext.grid.ColumnModel([ clnRowNum, action, clnWorkItemID,
	        clnSerialNum, clncompanyname, clnDeptName, clnFromtypeName,
			clnActivityName, clnDisplayName, clnMemo, clnAmount, clnFinamount,
			clnCreateDate, clnProcessName, clnBusiClass,
			clnProcessinstID, clnActivityID, clnSettype, clnImageState, clnstatus,
			clnsuspendreson, formStatus, ifStatus ]);

	var sm = new Ext.grid.RowSelectionModel(
	{
		singleSelect : true
	});

	m_barPage = new Ext.PagingToolbar(
	{
		region : "south",
		border : true,
		pageSize : PER_PAGE_SIZE,
		store : m_dsItems,
		displayInfo : true,
		displayMsg : '当前显示第 {0} 条到 {1} 条记录，一共 {2} 条',
		emptyMsg : "没有记录"
	});

	var barFilter =
	{
		text : "筛选条件",
		handler : filterHandler,
		iconCls : "xy-filter"
	};
	var barApply =
	{
		text : "审批",
		handler : applyHandler,
		iconCls : "xy-wf-approve"
	};
	var barTranUser =
	{
		text : "转办",
		handler : tranUserHandler,
		iconCls : "xy-wf-transwith"
	};
	var barTranMit =
	{
		text : "转拟办",
		handler : tranMitHandler,
		iconCls : "xy-wf-transmit"
	};
	var barDelete =
	{
		id : "barDelete",
		text : "删除",
		handler : deleteHandler,
		iconCls : "xy-delete1"
	};
	var barSuspend =
	{
		id : 'barSuspend',
		text : '审批备注',
		handler : suspendHandler,
		iconCls : "wfmgr_suspend"
	};
	var barHistory =
	{
		text : "审批历史",
		handler : viewHisHandler,
		iconCls : "xy-wf-history"
	};
	var barProcessImg =
	{
		text : "流程图示",
		handler : btn_showTransImg,
		iconCls : "xy_wf_transimg"
	};
	var barEbsHistory =
	{
		text : "接口处理跟踪",
		handler : on_ebsHistoryClick,
		iconCls : "xy-wf-history"
	};

	var barTemplateImg =
	{
		id : "barTemplateImg",
		text : "保存为模板",
		handler : SaveTemplate,
		iconCls : "xy-template"
	};

	var barRefreshImg =
	{
		id : "barRefreshImg",
		width : 50,
		text : "刷新",
		handler : refreshGrid,
		iconCls : "xy-refresh"
	};
	var billNo = new Ext.form.TextField({
		id : 'billNo',
		fieldLabel : '单号',
		emptyText : "输入单号回车",
		labelStyle : "text-align: right;font-size:18px;font-weight:bold;",
		anchor : '100%',
		listeners : {  
        specialKey : function(field, e) {  
            	if (e.getKey() == Ext.EventObject.ENTER) {//响应回车  
            	viewCostSerial();//处理回车事件  
            	}  
        	}  
		} 
	});
	var barTop = [ "-", barFilter, "-", barApply, barTranUser, barTranMit, barDelete, "-", "-", barHistory, "-",
			barProcessImg,"-",barEbsHistory, "-", barRefreshImg, "-", billNo ];

	m_grdProcess = new Ext.grid.GridPanel(
	{
		region : "center",
		store : m_dsItems,
		border : false,
		colModel : cm,
		enableColumnMove : false,
		enableHdMenu : false,
		selModel : sm,
		iconCls : 'xy-grid',
		tbar : barTop,
		plugins : [ action ],
		viewConfig :
		{
/*			forceFit : true,*/
			getRowClass : function(record, rowIndex, rowParams, store)
			{
				if (record.data.isinstancy == "1")
				{
					return 'x-grid-record-instancy';
				}
				else
				{
					return '';
				}
			}
		},
		loadMask :
		{
			msg : "数据加载中，请稍等..."
		}
	});
	var viewport = new Ext.Viewport(
	{
		layout : "border",
		border : false,
		items : [ m_grdProcess, m_barPage ]
	});

	m_dsItems.baseParams.beginDate = beginDate;
	m_dsItems.baseParams.endDate = endDate;
	m_dsItems.baseParams.company = company;
	m_dsItems.baseParams.dept = dept;
	m_dsItems.baseParams.applyUser = applyUser;
	m_dsItems.baseParams.formSerialNum = formSerialNum;
	m_dsItems.load(
	{
		params :
		{
			start : 0,
			limit : PER_PAGE_SIZE
		}
	});

	m_grdProcess.on("dblclick", grid_dblclick);
	m_grdProcess.on("rowclick", grid_rowclick);
}	

function viewCostSerial() {
	var serialNum = Ext.getCmp("billNo").getValue();
	if (serialNum == null || serialNum=="") {
		top.Ext.MessageBox.alert("提示", "请输入需要查询的表单编号!");
		return;
	}
	Ext.Ajax.request({
		url : "wf/ApproveItemGetByUserAction.action",
		method : "post",
		params : 
		{	
			start : 0,
			limit : 1,
			formSerialNum : serialNum,
			userID : Ext.get("userID").dom.value
		},
		success : function(response)
		{
			var obj = JSON.parse( response.responseText );
			if (obj.total == "1") {
				var basPath = Ext.get("basePath").dom.value;
				var viewUrl = basPath
						+ "wf/formApproveForm?workItemID=" + obj.data[0].workitemid;
				window.open(viewUrl, "","menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
			} else if (obj.total == "0") {
				top.Ext.MessageBox.alert("提示", "表单不在当前工作项或您无权查看!");
			}
		},
		failure : function(response, options)
		{
			Ext.MessageBox.alert("提示", "打开表单失败,服务器连接中断");
		},
		timeout : 0
	});
}

function suspendHandler()
{
	suspendClick.call(m_grdProcess.getSelectionModel());
	/* 挂起 */
	function suspendClick()
	{

		var rc = this.getSelected();

		if (rc == null)
		{
			Ext.MessageBox.alert("提示", "请先选择一条记录!");
			return;
		}

		if (rc.get("status") == '3')
		{
			Ext.MessageBox.alert("提示", "该工作项已经挂起!");
			return;
		}

		var win = new freesky.ssc.wfmgr.processinstMgr.reasonWin();
		win.on("afterConfirm", on_suspendConfirm, this);
		win.show();
	}

	function on_suspendConfirm(v)
	{
		var rc = this.getSelected();

		var data =
		{
			processinstid : rc.get("processinstid"),
			reason : v
		};
		var jsonString = Ext.encode(data);

		var service = new freesky.ssc.wfmgr.common.services();
		service.doRequest('SSC/processsuspend.action', jsonString, suspend_callback, this);
	}

	function suspend_callback()
	{
		var rc = this.getSelected();
		rc.set("status", '3');
		rc.commit(false);
		m_grdProcess.getStore().reload();
	}
	/* 继续 */
}

function refreshGrid()
{
	m_grdProcess.getStore().reload();
}

function loadException(This, node, response)
{
	showExtLoadException(This, node, response);
}

function grid_dblclick()
{
	applyHandler();
}

// 事件响应函数
function filterHandler()// 过滤
{
	var dt = new Date();
	getConditions(dt.getFirstDateOfMonth(), dt);
}
function applyHandler()// 审批提交
{t
	var rc = m_grdProcess.getSelectionModel().getSelected();

	if (rc == null)
	{
		return;
	}

	if ('3' == rc.get('status'))
	{
		Ext.Msg.confirm('提示', '该工作项目前处于挂起状态，是否继续审批?', function(btn)
		{
			if (btn == 'yes')
			{
				resumApplyClic.call(m_grdProcess.getSelectionModel());
			}
			else
			{
				on_viewFormClick();
			}
		});
	}
	else
	{
		var basPath = Ext.get("basePath").dom.value;

		window.open(basPath + "wf/formApproveForm?workItemID=" + escape(rc.get("workitemid")), "",
			"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");

	}
}

function resumApplyClic()
{
	var rc = this.getSelected();

	if (rc == null)
	{
		return;
	}

	if (rc.get("status") != '3')
	{
		Ext.Msg.alert("提示", "该待办流程不是挂起状态，不能继续");
		return;
	}

	var data =
	{
		processinstid : rc.get("processinstid")
	};
	var jsonString = Ext.encode(data);

	var service = new freesky.ssc.wfmgr.common.services();
	service.doRequest('wfmgr/resum.action', jsonString, resum_applycallback, this);
}

function resum_applycallback()
{
	var rc = this.getSelected();

	// rc.beginEdit();
	rc.set("status", '1');
	rc.commit(false);
	var basPath = Ext.get("basePath").dom.value;
	window.open(basPath + "wf/formApproveForm?workItemID=" + escape(rc.get("workitemid")), "",
		"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
	// 凭证制证回调
	function vouWinClose(_this, voucherInfo)
	{// 各表单自己处理
		m_dsItems.reload();
	}
	m_dsItems.reload();
}

/* 查看表单 */
function on_viewFormClick()
{
	var rc = m_grdProcess.getSelectionModel().getSelected();
	if (rc == null)
	{
		return;
	}

	var basPath = Ext.get("basePath").dom.value;
	window.open(basPath + "SSC/billview.action?idtype=1&billid=" + rc.get("serialnum"), "",
		"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
}

function tranUserHandler()// 转发
{
	var rc = m_grdProcess.getSelectionModel().getSelected();
	if (rc == null)
	{
		return;
	}

	if ('3' == rc.get('status'))
	{
		Ext.Msg.confirm('提示', '该工作项目前处于挂起状态，是否继续审批?', function(btn)
		{
			if (btn == 'yes')
			{
				resumTranClic.call(m_grdProcess.getSelectionModel());

				function resumTranClic()
				{
					var rc = this.getSelected();

					if (rc == null)
					{
						return;
					}

					if (rc.get("status") != '3')
					{
						Ext.Msg.alert("提示", "该待办流程不是挂起状态，不能继续");
						return;
					}

					var data =
					{
						processinstid : rc.get("processinstid")
					};
					var jsonString = Ext.encode(data);

					var service = new freesky.ssc.wfmgr.common.services();
					service.doRequest('wfmgr/resum.action', jsonString, resum_trancallback, this);
				}

				function resum_trancallback()
				{
					var rc = this.getSelected();

					// rc.beginEdit();
					rc.set("status", '1');
					rc.commit(false);

					var userID = Ext.get("userID").dom.value;

					wftransform(userID, callBack);

					function callBack(transformId)
					{
						var workItemID = rc.get("workitemid");
						var formDataJson = "";
						var workDataJson = "";
						var history = "";

						WorkItemTransformService.transform(workItemID, transformId, formDataJson, workDataJson, history,
						{
							callback : transFormCallback,
							async : false
						});

						function transFormCallback(result)
						{
							if (result == null || result == "")
							{
								top.Ext.MessageBox.alert("提示", "处理完成");
								m_dsItems.reload();
							}
							else
							{
								top.Ext.MessageBox.alert("错误", result);
							}
						}
					}

					m_dsItems.reload();
					// rc.endEdit();
				}
			}
			else
			{
				on_viewFormClick();
			}
		});
	}
	else
	{
		var userID = Ext.get("userID").dom.value;

		wftransform(userID, callBack);

		function callBack(transformId)
		{
			var workItemID = rc.get("workitemid");
			var formDataJson = "";
			var workDataJson = "";
			var history = "";

			WorkItemTransformService.transform(workItemID, transformId, formDataJson, workDataJson, history,
			{
				callback : transFormCallback,
				async : false
			});

			function transFormCallback(result)
			{
				if (result == null || result == "")
				{
					top.Ext.MessageBox.alert("提示", "处理完成");
					m_dsItems.reload();
				}
				else
				{
					top.Ext.MessageBox.alert("错误", result);
				}
			}
		}
	}
}
function tranMitHandler()// 转拟办
{
	var rc = m_grdProcess.getSelectionModel().getSelected();
	if (rc == null)
	{
		return;
	}

	if ('3' == rc.get('status'))
	{
		Ext.Msg.confirm('提示', '该工作项目前处于挂起状态，是否继续审批?', function(btn)
		{
			if (btn == 'yes')
			{
				resumTranMitClic.call(m_grdProcess.getSelectionModel());

				function resumTranMitClic()
				{
					var rc = this.getSelected();

					if (rc == null)
					{
						return;
					}

					if (rc.get("status") != '3')
					{
						Ext.Msg.alert("提示", "该待办流程不是挂起状态，不能继续");
						return;
					}

					var data =
					{
						processinstid : rc.get("processinstid")
					};
					var jsonString = Ext.encode(data);

					var service = new freesky.ssc.wfmgr.common.services();
					service.doRequest('wfmgr/resum.action', jsonString, resum_tranmitcallback, this);
				}

				function resum_tranmitcallback()
				{
					var rc = this.getSelected();

					// rc.beginEdit();
					rc.set("status", '1');
					rc.commit(false);

					var userID = Ext.get("userID").dom.value;

					wftransmit(userID, callBack);

					function callBack(transformId)
					{
						var workItemID = rc.get("workitemid");
						var formDataJson = "";
						var workDataJson = "";
						var history = "";

						WorkItemTransmitService.transmit(workItemID, transformId, formDataJson, workDataJson, history,
						{
							callback : transFormCallback,
							async : false
						});

						function transFormCallback(result)
						{
							if (result == null || result == "")
							{
								top.Ext.MessageBox.alert("提示", "处理完成");
								m_dsItems.reload();
							}
							else
							{
								top.Ext.MessageBox.alert("错误", result);
							}
						}
					}

					m_dsItems.reload();
					// rc.endEdit();
				}
			}
			else
			{
				on_viewFormClick();
			}
		});
	}
	else
	{
		var userID = Ext.get("userID").dom.value;

		wftransmit(userID, callBack);

		function callBack(transformId)
		{
			var workItemID = rc.get("workitemid");
			var formDataJson = "";
			var workDataJson = "";
			var history = "";

			WorkItemTransmitService.transmit(workItemID, transformId, formDataJson, workDataJson, history,
			{
				callback : transFormCallback,
				async : false
			});

			function transFormCallback(result)
			{
				if (result == null || result == "")
				{
					top.Ext.MessageBox.alert("提示", "处理完成");
					m_dsItems.reload();
				}
				else
				{
					top.Ext.MessageBox.alert("错误", result);
				}
			}
		}
	}
}
function deleteHandler()// 删除
{

	var question = top.Ext.MessageBox.confirm('提示框', '你确定要删除吗？', onClear);

	function onClear(btn)
	{
		if (btn == 'yes')
		{
			var rc = m_grdProcess.getSelectionModel().getSelected();
			if (rc == null)
			{
				return;
			}

			if ('3' == rc.get('status'))
			{
				Ext.Msg.confirm('提示', '该工作项目前处于挂起状态，是否继续审批?', function(btn)
				{
					if (btn == 'yes')
					{
						resumDelClic.call(m_grdProcess.getSelectionModel());

						function resumDelClic()
						{
							var rc = this.getSelected();

							if (rc == null)
							{
								return;
							}

							if (rc.get("status") != '3')
							{
								Ext.Msg.alert("提示", "该待办流程不是挂起状态，不能继续");
								return;
							}

							var data =
							{
								processinstid : rc.get("processinstid")
							};
							var jsonString = Ext.encode(data);

							var service = new freesky.ssc.wfmgr.common.services();
							service.doRequest('wfmgr/resum.action', jsonString, resum_delcallback, this);
						}

						function resum_delcallback()
						{
							var rc = this.getSelected();

							// rc.beginEdit();
							rc.set("status", '1');
							rc.commit(false);

							var userID = Ext.get("userID").dom.value;
							var processInstID = rc.get("processinstid");

							var smLoadMask = new Ext.LoadMask(document.body,
							{
								msg : "正在处理，请稍候...",
								removeMask : true
							});
							smLoadMask.show();

							function deleteCallback(result)
							{
								if (smLoadMask)
								{
									smLoadMask.hide();
									smLoadMask = null;
								}
								if (result == null || result == "")
								{
									Ext.MessageBox.alert("提示", "处理完成");
									m_dsItems.reload();
								}
								else
								{
									Ext.MessageBox.alert("错误", result);
								}
							}

							WorkItemDeleteService.deleteOwnerProcessinst(processInstID, userID,
							{
								callback : deleteCallback,
								errorHandler : function(errorString, exception)
								{
									if (smLoadMask)
									{
										smLoadMask.hide();
										smLoadMask = null;
									}
									Ext.MessageBox.alert("错误", errorString);
								},
								async : false
							});

							m_dsItems.reload();
							// rc.endEdit();
						}
					}
					else
					{

					}
				});
			}
			else
			{
				var userID = Ext.get("userID").dom.value;
				var processInstID = rc.get("processinstid");

				var smLoadMask = new Ext.LoadMask(document.body,
				{
					msg : "正在处理，请稍候...",
					removeMask : true
				});
				smLoadMask.show();

				function deleteCallback(result)
				{
					if (smLoadMask)
					{
						smLoadMask.hide();
						smLoadMask = null;
					}
					if (result == null || result == "")
					{
						Ext.MessageBox.alert("提示", "处理完成");
						m_dsItems.reload();
					}
					else
					{
						Ext.MessageBox.alert("错误", result);
					}
				}

				WorkItemDeleteService.deleteOwnerProcessinst(processInstID, userID,
				{
					callback : deleteCallback,
					errorHandler : function(errorString, exception)
					{
						if (smLoadMask)
						{
							smLoadMask.hide();
							smLoadMask = null;
						}
						Ext.MessageBox.alert("错误", errorString);
					},
					async : false
				});
			}
		}
	}
}
function viewHisHandler()// 审批历史
{
	var rc = m_grdProcess.getSelectionModel().getSelected();
	if (rc == null)
	{
		return;
	}

	showCheckHistoryWin(rc.get("processinstid"));
}
/* EBS审批跟踪 */
function on_ebsHistoryClick() {
    var select_data = m_grdProcess.getSelectionModel().getSelected();
    if (select_data == null) {
        return;
    }
    showEbsHistory(select_data.get("serialnum"));
}
// 流转图示
function btn_showTransImg()
{
	var rc = m_grdProcess.getSelectionModel().getSelected();
	if (rc == null)
	{
		return;
	}

	showTransInstImg(rc.get("processinstid"));
}

// 保存为模板
function SaveTemplate()
{
	var rc = m_grdProcess.getSelectionModel().getSelected();
	if (rc != null)
	{
		Ext.Ajax.request(
		{
			url : "SSC/getFormTypeByWorkItem.action",
			params :
			{
				jsonString : rc.get("processinstid")
			},
			success : function(response)
			{
				var data = Ext.decode(response.responseText);
				if (!data.state || data.formType == '222' || data.formType == '219' || data.formType == '220'
						|| data.formType == '224' || data.formType == '225') Ext.MessageBox.alert("提示信息", "只有日常报账单和事前申请单有草稿模板功能！");
				else
				{
					var formAddTemplate = new Freesky.SSC.DraftTemplate.AddTemplateForm(
					{
						argument : data
					});
					formAddTemplate.show();
				}

			},
			failure : function(response)
			{
				if (response.result == null || response.result == "")
				{
					Ext.MessageBox.alert("失败", "不能访问模板操作相关服务！");
				}
				else
				{
					Ext.MessageBox.alert("失败", response.result.msg);
				}
			},
			timeout : 0
		});
	}
}

function getApproveItemByConditions(data)
{
	var strUrl = "wf/ApproveItemGetByConditionsAction.action?userID=" + m_userID;
	var strCompany = data.company;
	var strDept = data.dept;
	var strApplyUser = data.applyUser;

	m_dsItems.baseParams.beginDate = getParamValue(data.beginDate);
	m_dsItems.baseParams.endDate = getParamValue(data.endDate);
	m_dsItems.baseParams.company = getParamValue(strCompany);
	m_dsItems.baseParams.dept = getParamValue(strDept);
	m_dsItems.baseParams.applyUser = getParamValue(strApplyUser);
	m_dsItems.baseParams.formSerialNum = getParamValue(data.formSerialNum);

	m_dsItems.load(
	{
		params :
		{
			start : 0,
			limit : PER_PAGE_SIZE
		}
	});
}

function grid_rowclick(grid, rowIndex)
{
	var rc = m_dsItems.getAt(rowIndex);
	if (rc != null)
	{
		if (rc.get("formtypename") == "凭证")
		{
			// Ext.getCmp("barTemplateImg").disable();
			Ext.getCmp("barDelete").disable();
		}
		else
		{
			// Ext.getCmp("barTemplateImg").enable();
			Ext.getCmp("barDelete").enable();
		}
	}
}

function getDefaultInfo()
{
	var data =
	{
		userID : m_userID,
		compID : m_compID,
		deptID : m_deptID,
		compName : m_compName,
		deptName : m_deptName,
		userName : m_userName
	};
	return data;
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);