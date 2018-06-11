Ext.namespace('com.freesky.ssc.form.system');
com.freesky.ssc.form.system.FirstPageApprove = Ext.extend(Ext.grid.GridPanel, {
	border : false,
	enableColumnMove : false,
	enableHdMenu : false,
	iconCls : 'xy-grid',
	getStore : function () {
		if (this.store === undefined || this.store == null) {
			this.store = new Ext.data.Store( {
				url :"wf/ApproveItemGetByUserAction.action",
				reader : new Ext.data.JsonReader({
					root : 'data',
					totalProperty :"total"
				}, 
				Ext.data.XyCalcRecord.create(["workitemid", 
					{
						name : 'action2',
						type : 'string',
						dependencies : ['action2'],
						notDirty : true,
						calc : function(record) {
							 if(record.data.ifpay=="1")
				             {
				            	 return "xy-star_wj";
				             }
							 if(record.data.ifpay=="1" && record.data.isinstancy=="1")
				             {
				            	 return "xy-star_wj";
				             }
				             if(record.data.isinstancy=="1")
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
						dependencies : ['action3'],
						notDirty : true,
						calc : function(record) {
				             if(record.data.status=="3")
				             {
				            	 return "wfmgr_suspend";
				             }
				             else
				             {
				            	 return "";
				             }
						}
					},
					"processinstname", 
					"displayname",
					"vardescription", 
					{
						name : 'createdate',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, 
					"serialnum", 
					"processinstid", 
					"activityid",
					"activityname", 
					"settype", 
					"companyname",
					"formtypename", 
					{
						name : "finamount",
						type : 'float'
					}, 
					"memo", 
					{
						name : "amount",
						type : 'float'
					},
					"isinstancy",
					"opentype",
					"barstate",
					"status",
					"suspendusername",//挂起人
					"suspenduser",//挂起人ID
					"formtype",
					"varfullno",
					"ifpay"]
				))
			});
		}
		return this.store;
    },
	initComponent : function() {
    	var clnRowNum = new Ext.grid.RowNumberer();
    	var clnWorkItemID = {
    		header : "ID",
    		dataIndex : "workitemid",
    		hidden : true,
    		fixed : false
    	};
    	var clnProcessName = {
    		header : "流程名称",
    		dataIndex : "processinstname",
    		width : 130,
    		sortable : true,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    						//根据条件 确定记录行颜色
							return showDiffColor(value,record);
    				  } 
    	};
    	var clnDisplayName = {
    		header : "申请者",
    		dataIndex : "displayname",
    		width : 60,
    		sortable : true,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    						//根据条件 确定记录行颜色
							return showDiffColor(value,record);
    				  } 
    	};
    	var clnVardescription = {
    		header : "申请部门",
    		dataIndex : "vardescription",
    		width : 110,
    		sortable : true,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    						//根据条件 确定记录行颜色
							return showDiffColor(value,record);
    				  } 
    	};
    	var clnCreateDate = {
    		header : "提交时间",
    		dataIndex : "createdate",
    		sortable : true,
    		width : 100,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    					    var strDate =  Ext.util.Format.date(value, 'Y-m-d H:i:s');
    					  //根据条件 确定记录行颜色
    						return showDiffColor(strDate,record);
    				  } 	
    	};
    	var clnSerialNum = {
    		header : "单据编号",
    		width : 130,
    		dataIndex : "serialnum",
    		sortable : true,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    						//根据条件 确定记录行颜色
							return showDiffColor(value,record);
    				  } 
    	};
    	var clnProcessinstID = {
    		header : "流程实例ID",
    		dataIndex : "processinstid",
    		hidden : true
    	};
    	var clnActivityID = {
    		header : "活动ID",
    		dataIndex : "activityid",
    		hidden : true
    	};
    	var clnActivityName = {
    		header : "流程环节",
    		width : 90,
    		dataIndex : "activityname",
    		sortable : true,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    						//根据条件 确定记录行颜色
							return showDiffColor(value,record);
    				  } 
    	};
    	var clncompanyname = {
			header : "报账单位",
			width : 130,
			dataIndex : "companyname",
			sortable : true,
			renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    						//根据条件 确定记录行颜色
							return showDiffColor(value,record);
					  } 
		};
    	var clnFromtypeName = {
    		header : "单据类型",
    		width : 90,
    		dataIndex : "formtypename",
    		sortable : true,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    						//根据条件 确定记录行颜色
							return showDiffColor(value,record);
    				  } 
    	};
    	var clnSettype = {
    		header : "单位类型",
    		hidden : true,
    		dataIndex : "settype",
    		sortable : true
    	};
    	var clnformtype = {
    		header : "表单类型",
    		hidden : true,
    		dataIndex : "formtype",
    		sortable : true
    	};
    	var clnAmount = {
    		header : "报账金额",
    		width : 70,
    		css : 'text-align:right;',
    		dataIndex : "amount",
    		sortable : true,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    						//根据条件 确定记录行颜色
							return showDiffColor(Freesky.Common.XyFormat.cnMoney(value),record);
//    				  		if(record.data.isinstancy=="1")
//    				  			return '<font color=red>' + Freesky.Common.XyFormat.cnMoney(value) + '</font >';
//    				  		else
//    				  			return Freesky.Common.XyFormat.cnMoney(value);
    				  } 
    	};
    	var clnFinamount = {
    		header : "核定金额",
    		width : 70,
    		css : 'text-align:right;',
    		dataIndex : "finamount",
    		sortable : true,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    						//根据条件 确定记录行颜色
							return showDiffColor(Freesky.Common.XyFormat.cnMoney(value),record);
//    				  		if(record.data.isinstancy=="1")
//    				  			return '<font color=red>' + Freesky.Common.XyFormat.cnMoney(value) + '</font >';
//    				  		else
//    				  			return Freesky.Common.XyFormat.cnMoney(value);
    				  } 
    	};
    	var clnMemo = {
    		header : "事项描述",
    		width : 100,
    		dataIndex : "memo",
    		sortable : true,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) { 
    						//根据条件 确定记录行颜色
							return showDiffColor(value,record);
    				  } 
    	};
    	
    	var clnImageState = {
    		header : "纸质状态",
//    		hidden : true,
    		dataIndex : "barstate",
    		sortable : true
    	};
    	
    	var clnstatus=
    	{
    		header : "状态",
    		dataIndex : "status",
    		sortable : true,
    		width : 50,
    		renderer: function(value, metaData, record, rowIndex, colIndex, store) 
    		{
    	  		switch(value)
    			{
    			case '0':
    				//根据条件 确定记录行颜色
					return showDiffColor("初始",record);
    			case '1':
    				//根据条件 确定记录行颜色
					return showDiffColor("运行",record);
    			case '2':
    				//根据条件 确定记录行颜色
					return showDiffColor("激活",record);
    			case '3':
    				//根据条件 确定记录行颜色
					return showDiffColor("挂起",record);
    			case '4':
    				//根据条件 确定记录行颜色
					return showDiffColor("完成",record);
    			case '5':
    				//根据条件 确定记录行颜色
					return showDiffColor("终止",record);
    			default:
    				return '';
    			}
    	    }
    	};
    	
    	var action=new Ext.ux.grid.RowActions({
    		header:'',
    		actions:[
    			{
    				 iconIndex:'action2',
    				 qtipIndex:'qtip2'
    			},
    			{
    				 iconIndex:'action3',
    				 qtipIndex:'qtip3'
    			}
    		]
    	});
    	
    	var cm = new Ext.grid.ColumnModel([clnRowNum, action ,clnWorkItemID,
    	                                   clnSerialNum,clnFromtypeName, clnDisplayName, clncompanyname, clnVardescription, clnCreateDate,
    	                                   clnProcessinstID, clnActivityID, clnAmount, clnFinamount, clnMemo,
    	                                   clnProcessName,  clnActivityName, clnSettype, clnImageState, clnstatus,clnformtype]);

    	var sm = new Ext.grid.RowSelectionModel({
    				singleSelect : true
    			});
    	this.colModel = cm;
    	this.selModel = sm;
    	this.bbar =  new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.getStore()
		});
    	var barRefreshImg = {
			id:"barRefreshImg",
			width : 50,
			text : "刷新",
			handler : this.refreshGrid.createDelegate(this),
			iconCls : "xy-refresh"
		};
    	this.tbar = [barRefreshImg];
    	this.plugins = [action];
    	this.store = this.getStore();
    	this.store.on("loadexception", this.loadException);
    	this.on("dblclick", this.grid_dblclick.createCallback(this));
	    com.freesky.ssc.form.system.FirstPageApprove.superclass.initComponent.call(this);
	    this.store.baseParams.beginDate = "";
	    this.store.baseParams.endDate = "";
	    this.store.baseParams.company = "";
	    this.store.baseParams.dept = "";
	    this.store.baseParams.applyUser = "";
		this.store.baseParams.formSerialNum = "";
	    this.store.load(
		{
			params : 
			{
				start : 0,
				limit : this.getBottomToolbar().pageSize
			}
		});
    },
    refreshGrid : function ()
    {
    	this.store.reload();
    },
    loadException : function(This, node, response) {
    	showExtLoadException(This, node, response);
    },
    grid_dblclick : function(scope) {
    	scope.applyHandler();
    },
    applyHandler : function () {
		var userID = Ext.get("M8_USERID").dom.value;
    	var rc = this.getSelectionModel().getSelected();
    	
    	if (rc == null) { return; }
    	
    	if('3'==rc.get('status'))
    	{
			if(rc.data.suspenduser == userID) {
				Ext.Msg.buttonText={
					yes:'是',
					no:'否'
				};
				Ext.Msg.confirm('提示', '该工作项目前处于挂起状态，是否继续审批?', function (btn) {
					if (btn == 'yes') {
						if (rc.get("status") != '3') {
							Ext.Msg.alert("提示", "该待办流程不是挂起状态，不能继续");
							return;
						}

						var data = {processinstid: rc.get("processinstid")};
						var jsonString = Ext.encode(data);

						var service = new freesky.ssc.wfmgr.common.services();
						service.doRequest('wfmgr/resum.action', jsonString, function () {
							rc.set("status", '1');
							rc.commit(false);
							var basPath = Ext.get("basePath").dom.value;
							window.open(basPath + "wf/formApproveAction.action?formtype=" + rc.get("formtype") + "&workItemID="
								+ escape(rc.get("workitemid")), "",
								"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
							this.getStore().reload();
						}.createDelegate(this), this);
					}
					else {
						var basPath = Ext.get("basePath").dom.value;
						window.open(
							basPath
							+ "SSC/billview.action?idtype=1&billid="
							+ rc.get("serialnum"), "",
							"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
					}
				}.createDelegate(this));
			}
			else
			{
				Ext.Msg.buttonText={
					yes:'查看表单',
					no:'关闭'
				};
				Ext.Msg.confirm('提示','表单已由'+ rc.data.suspendusername +'挂起，请联系其解挂后操作，或者查看表单?',function(btn)
				{
					if(btn=='yes')
					{
						var basPath = Ext.get("basePath").dom.value;
						window.open(
							basPath
							+ "SSC/billview.action?idtype=1&billid="
							+ rc.get("serialnum"), "",
							"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
					}
					else
					{
						this.close();
					}
				});
			}
    	}
    	else
    	{
    		var basPath = Ext.get("basePath").dom.value;

        	var openType = rc.get("opentype");
        	if (openType == "1")  //是凭证
            {  // 打开凭证
                var voucher ={
                    workitemid : rc.get("workitemid"),
                    processinstid : rc.get("processinstid"),
                    opentype : '2'
                };
                // 表单准备凭证Json对象，在服务端完成
                var voucherObj = new com.freesky.em8.gl.core.voucherprocess.proxy.VoucherOpen({
                        											});
                voucherObj.on("close", vouWinClose, this);
                
                voucherObj.openProcessVoucher(voucher);        
                        
            }
        	else {
        		window.open(basPath + "wf/formApproveAction.action?formtype="+rc.get("formtype")+"&workItemID="
        								+ escape(rc.get("workitemid")), "",
        						"menubar=0,scrollbar=0,resizable=1,channelmode=1,location=0,status=1");
        	}
        	
        	//凭证制证回调
        	function vouWinClose(_this, voucherInfo) {// 各表单自己处理
        		if (voucherInfo.modalresult == "2" || voucherInfo.modalresult=="-1" ) // 过账完或者回退后，重新刷新代办
        		{
        			this.getStore().reload();
        		}
        	}
    	}
    }
    
});
//根据条件将记录显示不同的颜色
function showDiffColor(value,record)
{
	//加急流程
  	if(record.data.isinstancy=="1")
  	{
  		//得到公司编码 3300有限公司  3400网资  3350存续  此处其他类型的皆算是有限
  		var varfullno = record.data.varfullno;
  		if(varfullno!=null&&varfullno.substring(0,4)=="3400")
  		{
  			return '<font color=green>' + value + '</font >';
  		}
  		if(varfullno!=null&&varfullno.substring(0,4)=="3350")
  		{
  			return '<font color=#F15A21>' + value + '</font >';
  		}
  		else
  		{
  			return '<font color=blue>' + value + '</font >';
  		}
  	}else
  		return value;
}