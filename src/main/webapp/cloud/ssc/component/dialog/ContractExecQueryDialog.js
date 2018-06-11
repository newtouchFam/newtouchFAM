Ext.namespace("ssc.component");

ContractExecQueryDialog = ssc.component.ContractExecQueryDialog;

ssc.component.ContractExecQueryDialog = Ext.extend(ssc.component.BaseDialog,
{
	title : "合同执行查看",
	height  : 525,
	width : 955,
	params : null,
	layout : 'form',
	plain: true,
	modal: true,
	m_ContractId : "",
	xy_PageMode : true,
	buttonAlign : "right",
	getGridRecord : function()
    {
        return Ext.data.Record.create([{
            name : "supplierid"		//供应商
        }, {
            name : "itemcode"		//项目编号
        }, {		
            name : "itemname"		//项目名称
        },{
        	name : "amount"			//合同金额
        },{
            name : "accountedamount"//已挂账金额
        }, {
        	name : "accountingamount"//未挂账金额
        },{
            name : "payedamount"	//已支付金额
        }, {
            name : "payingamount"	//未支付金额 
        },{
            name : "voicedamount"	//已开票金额
        },{
        	name : "accye"			//往来余额
        }]);
    },
    getFormRecord : function()
    {
        return Ext.data.Record.create([{
            name : "contractno"		//合同编号
        }, {
            name : "contractname"	//合同名称
        }, {
            name : "contracttype"	//合同类型
        },{
        	name : "companyname"	//签订单位
        },{
        	name : "deptname"		//责任部门
        },{
        	name : "username"		//发起人
        },{
            name : "contractamount"			//合同金额
        },{		
            name : "remark"			//合同说明
        },{
            name : "contractdate"	//签订日期
        },{
        	name : "relaidentifycode"//关联交易标识
        },{
        	name : "attachurl"		//文本附件
        },{
        	name : "mnyinvoice"		//已开票金额
        },{
        	name : "accmoney"		//已挂账金额
        },{
        	name : "haspay"			//已支付金额
        },{
        	name : "accye"			//余额		
        }]);
    },
    getGridStore : function()
    {
        if (this.m_GridStore === undefined || this.m_GridStore == null)
        {
            this.m_GridStore = new Ext.data.Store({
                url : 'SSC/getContractExecById.action',
                reader : new Ext.data.JsonReader({
                    root : 'data'
                }, this.getGridRecord())
            });
        }
        return this.m_GridStore;
    },
    getFormStore : function()
    {
        if (this.m_FormStore === undefined || this.m_FormStore == null)
        {
            this.m_FormStore = new Ext.data.Store({
                url : 'SSC/getContractById.action',
                reader : new Ext.data.JsonReader({
                    root : 'data'
                }, this.getFormRecord())
            });
        }
        return this.m_FormStore;
    },
    getGridCM : function()
    {
    	var clnRowNum = new Ext.grid.RowNumberer();
    	var supplierid = 
    	{
    		header : "供应商",
    		dataIndex : "supplierid"
    	};
    	var itemcode = 
    	{
    		header : "项目编号",
    		dataIndex : "itemcode"
    	};
    	var itemname = 
    	{
    		header : "项目名称",
    		dataIndex : "itemname"
    	};
    	var amount = 
    	{
    		header : "行项目金额",
    		width : 80,
    		css : 'text-align:right;',
    		dataIndex : "amount"
    	};
    	var accountedamount =
    	{
    		header : "累计挂账金额",
    		width : 80,
    		css : 'text-align:right;',
    		dataIndex : "accountedamount"
    	};
    	var accountingamount =
    	{
    		header : "未挂账余额",
    		width : 80,
    		css : 'text-align:right;',
    		dataIndex : "accountingamount"
    	};
    	var payedamount =
    	{
    		header : "累计付款金额",
    		width : 80,
    		css : 'text-align:right;',
    		dataIndex : "payedamount"
    	};
    	var payingamount =
    	{
    		header : "未付款金额 ",
    		width : 80,
    		css : 'text-align:right;',
    		dataIndex : "payingamount"
    	};
    	var voicedamount =
    	{
    		header : "已开票金额",
    		width : 80,
    		css : 'text-align:right;',
    		dataIndex : "voicedamount"
    	};
    	var accye = 
    	{
    		header : "行项目往来余额",
    		width : 80,
    		css : 'text-align:right;',
    		dataIndex : "accye"
    	};
    	this.m_GridColModel = new Ext.grid.ColumnModel(
    	[	clnRowNum, supplierid,itemcode, itemname,
    		amount, voicedamount, accountedamount,payedamount,
            accye, accountingamount, payingamount
        ])
		return this.m_GridColModel;                           
    },
    getGYGridRecord : function()
	{
		 return Ext.data.Record.create([{
            name : "suppliercode"			//供应商编号
        }, {
            name : "suppliername"			//供应商名称
        }, {		
            name : "industrytype"			//关联供应商类型
        },{
        	name : "relaidentifycode"		//关联交易识别码
        },{
            name : "relativeitem"			//关联交易类型
        },{
        	name : "relativeamount"			//关联交易金额
        },{
        	name : "mnyoccur"				//关联交易发生额
        }]);
	},
	getGYGridStore : function()
	{
		if (this.m_GYGridStore === undefined || this.m_GYGridStore == null)
        {
            this.m_GYGridStore = new Ext.data.Store({
                url : 'SSC/getSupplierApportion.action',
                reader : new Ext.data.JsonReader({
                    root : 'data'
                }, this.getGYGridRecord())
            });
        }
        return this.m_GYGridStore;
	},
	getGYGridCM : function()
	{
		var clnRowNum = new Ext.grid.RowNumberer();
		var suppliercode= 
		{
			header : "供应商编号",
			dataIndex : "suppliercode",
			sortable : true
		};
		var suppliername =
		{
			header : "供应商名称",
			dataIndex : "suppliername",
			sortable : true
		};
		var industrytype = 
		{
			header : "关联供应商类型",
			dataIndex : "industrytype",
			sortable : true
		};
		var relaidentifycode = 
		{
			header : "关联交易识别码",
			dataIndex : "relaidentifycode",
			sortable : true
		};
		var relativeitem = 
		{
			header : "关联交易类型",
			dataIndex : "relativeitem",
			sortable : true
		};
		var relativeamount= 
		{
			header : "关联交易金额",
			dataIndex : "relativeamount",
			css : 'text-align:right;',
			sortable : true
		};
		var mnyoccur= 
		{
			header : "关联交易发生额",
			dataIndex : "mnyoccur",
			css : 'text-align:right;',
			sortable : true
		};
		this.m_GYGridColModel = new Ext.grid.ColumnModel(
    	[	clnRowNum, suppliercode,suppliername,industrytype,
    	 	relaidentifycode,relativeitem,relativeamount,mnyoccur
        ]);
		return this.m_GYGridColModel;
	},
	initComponent : function()
	{
		this.initButtons();
		this.initForm();
		this.initGrid();
		this.fillItems();
		this.getFormStore().on("load", this.formLoaded, this);
		ssc.component.ContractExecQueryDialog.superclass.initComponent.call(this);
		
		this.loadFormData();
	},
	initForm : function()
	{
		this.contractno = new Ext.form.TextField(
		{
			fieldLabel : "合同编号",
			id : "contractno",
			anchor : "100%",
			readOnly : true
		});
		this.contractname = new Ext.form.TextField(
		{
			fieldLabel : "合同名称",
			id : "contractname",
			anchor : "100%",
			readOnly : true
		});
		this.contracttype = new Ext.form.TextField(
		{
			fieldLabel : "合同类别",
			id : "contracttype",
			anchor : "100%",
			readOnly : true
		});
		this.companyname = new Ext.form.TextField(
		{
			fieldLabel : "签订单位",
			id : "companyname",
			anchor : "100%",
			readOnly : true
		});
		this.deptartname = new Ext.form.TextField(
		{
			fieldLabel : "责任部门",
			id : "deptartname",
			anchor : "100%",
			readOnly : true
		});
		this.username = new Ext.form.TextField(
		{
			fieldLabel : "发起人",
			id : "username",
			anchor : "100%",
			readOnly : true
		});
		this.contractamount = new Ext.form.TextField(
		{
			fieldLabel : "合同金额",
			id : "contractamount",
			anchor : "100%",
			style : 'text-align:right;',
			readOnly : true
		});
		this.contractdate = new Ext.form.TextField(
		{
			fieldLabel : "签订日期",
			id : "contractdate",
			anchor : "100%",
			readOnly : true
		});
		this.relaidentifycode = new Ext.form.TextField(
		{
			fieldLabel : "关联交易标识",
			id : "relaidentifycode",
			anchor : "100%",
			readOnly : true
		});
		this.remark = new Ext.form.TextField(
		{
			fieldLabel : "合同说明",
			id : "remark",
			anchor : "100%",
			readOnly : true
		});
		this.attachurl = new Ext.form.TextField(
		{
			fieldLabel : "文本附件",
			id : "attachurl",
			anchor : "100%",
			readOnly : true
		});
		this.mnyinvoice = new Ext.form.TextField(
		{
			fieldLabel : "已开票金额",
			id : "mnyinvoice",
			style : 'text-align:right;',
			anchor : "100%",
			readOnly : true
		});
		this.accmoney = new Ext.form.TextField(
		{
			fieldLabel : "已挂账金额",
			style : 'text-align:right;',
			id : "accmoney",
			anchor : "100%",
			readOnly : true
		});
		this.haspay = new Ext.form.TextField(
		{
			fieldLabel : "已支付金额",
			id : "haspay",
			style : 'text-align:right;',
			anchor : "100%",
			readOnly : true
		});
		this.accye = new Ext.form.TextField(
		{
			fieldLabel : "余额",
			id : "accye",
			style : 'text-align:right;',
			anchor : "100%",
			disabled : true
		}); 
		this.m_Form = new Ext.form.FormPanel(
		{
			labelSeparator : ':',
			labelAlign : 'right',
			labelWidth : 75,
			frame:true,
			border : false,
			bodyStyle:'padding:5px 5px 0',
			items : [{
				layout : 'column',
				border : false,
				items : [{
					columnWidth : .3,
					layout : 'form',
					border : false,
					items : [this.contractno]
				},{
					columnWidth : .3,
					layout : 'form',
					border : false,
					items : [this.contractname]
				},{
					columnWidth : .4,
					layout : 'form',
					border : false,
					items : [this.contracttype]
				},{
					columnWidth : .3,
					layout : 'form',
					border : false,
					items : [this.companyname]
				},{
					columnWidth : .3,
					layout : 'form',
					border : false,
					items : [this.deptartname]
				},{
					columnWidth : .4,
					layout : 'form',
					border : false,
					items : [this.username]
				},{
					columnWidth : .3,
					layout : 'form',
					border : false,
					items : [this.contractamount]
				},{
					columnWidth : .3,
					layout : 'form',
					border : false,
					items : [this.contractdate]
				},{
					columnWidth : .4,
					layout : 'form',
					border : false,
					items : [this.relaidentifycode]
				},{
					columnWidth : .6,
					layout : 'form',
					border : false,
					items : [this.remark]
				},{
					columnWidth : .4,
					layout : 'form',
					border : false,
					items : [this.attachurl]
				},{
					columnWidth : .3,
					layout : 'form',
					border : false,
					items : [this.mnyinvoice]
				},{
					columnWidth : .3,
					layout : 'form',
					border : false,
					items : [this.accmoney]
				},{
					columnWidth : .4,
					layout : 'form',
					border : false,
					items : [this.haspay]
				},{
					columnWidth : .3,
					layout : 'form',
					border : false,
					items : [this.accye]
				}]
			}]
		});
	},
	initGrid : function()
	{
		if (this.xy_PageMode === true)
		{
			this.m_PagingToolBar = new ssc.component.BaseMultiPagingToolBar(
			{
				store : this.getGridStore()
			});
			this.m_GYPagingToolBar = new ssc.component.BaseMultiPagingToolBar(
			{
				store : this.getGYGridStore()
			});
		}
		else
		{
			this.m_PagingToolBar = null;
			this.m_GYPagingToolBar = null;
		}
		this.m_Grid = new Ext.grid.GridPanel(
		{
			frame : true,
			border : false,
			autoScroll : true,
			enableColumnMove : false,
			enableHdMenu : false,
			height : 200,
			store : this.getGridStore(),
			cm : this.getGridCM(),
			bbar : this.m_PagingToolBar !== null ? this.m_PagingToolBar : null,
            loadMask : {
                msg : "数据加载中，请稍等..."
            }
		});
		this.m_supplier = new Ext.grid.GridPanel(
		{
			frame : true,
			border : false,
			autoScroll : true,
			enableColumnMove : false,
			enableHdMenu : false,
			height : 200,
			store : this.getGYGridStore(),
			cm : this.getGYGridCM(),
			bbar : this.m_GYPagingToolBar !== null ? this.m_GYPagingToolBar : null,
            loadMask : {
                msg : "数据加载中，请稍等..."
            }
		});
	},
	fillItems : function()
	{
		this.mainInfo = new Ext.form.FieldSet(
		{
			title : '合同主信息',
			autoHeight : true,
			items : [this.m_Form]
		});
		this.detailInfo = new Ext.form.FieldSet(
		{
			title : '合同执行信息',
			autoHeight : true,
			items : [new Ext.TabPanel({
				plain : false,
				height : 210,
				activeTab : 0,
				items : [
					{
						title : "关联交易信息&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
						id : 'supplierdetail',
						closable : false,
						layout : "fit",
						autoScroll : true,
						items : [this.m_supplier]
					},
					{
						title : "项目信息&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
						id : 'itemdetail',
						closable : false,
						layout : "fit",
						autoScroll : true,
						items : [this.m_Grid]
					}
				]
			})]
		});
		this.items = [this.mainInfo,this.detailInfo];
//		{
//			layout : "fit",
//			border : false,
//			autoScroll : true,
//			items :[this.mainInfo,this.detailInfo] 
//		}];
	},
	initButtons : function()
	{
		this.btn_CloseEvent = this.closeWindow;
		this.xy_ButtonType = ssc.component.DialogButtonTypeEnum.Close;
//		this.xy_ButtonStyle = ssc.component.DialogButtonStyleEnum.Default;
	},
	closeWindow : function()
	{
		this.close();
	},
	loadFormData : function()
	{
		if(this.getFormStore())
		{
			this.setStoreParams(this.params,this.m_FormStore);
			this.m_FormStore.load();
			this.loadGridData();
		}
	},
	formLoaded : function(store, records, options)
	{
		this.setFormData(store);
	},
	setStoreParams : function(params,store)
	{
		for (var key in params)
		{
			if (key === "jsonCondition" && params.jsonCondition !== undefined)
			{
				this.m_GridStore.baseParams.jsonCondition = Ext.encode(params.jsonCondition);
			}
			else
			{
				this.m_GridStore.baseParams[key] = params[key];
			}
		}
		if(this.m_ContractId)
		{
			store.baseParams.contractno = this.m_ContractId;
		}
	},
	setFormData : function(store)
	{
		if (store.getTotalCount() == 0)
		{
			return;
		}
		var record = store.getAt(0);
		for (key in record.data)
		{
			if (typeof record.data[key] != "function")
			{
				if (Ext.getCmp(key) != null)
				{
					if (record.data[key] != null && record.data[key] != '') {
						if (Ext.getCmp(key).getXType().indexOf('xy') == 0 && typeof Ext.getCmp(key).setXyValue == 'function')
						{
							Ext.getCmp(key).setXyValue(record.data[key]);
						}
						else
						{
							Ext.getCmp(key).setValue(record.data[key]);
						}
					}
				}
			}
		}
	},
	loadGridData : function()
	{
		//设置基础查询参数
		this.setStoreParams(this.params,this.m_GridStore);
		this.setStoreParams(this.params,this.m_GYGridStore);
		// 分页
		if (this.xy_PageMode === true)
		{
			this.m_GridStore.load(
			{
				params :
				{
					start : 0,
					limit : this.m_Grid.getBottomToolbar().pageSize
				}
			});
			this.m_GYGridStore.load(
			{
				params :
				{
					start : 0,
					limit : this.m_supplier.getBottomToolbar().pageSize
				}
			});
		}
		// 不分页
		else
		{
			this.m_GridStore.load({});
			this.m_GYGridStore.load({});
		}
	}
});
Ext.reg("ssc.component.contractExecQueryDialog",ssc.component.ContractExecQueryDialog);