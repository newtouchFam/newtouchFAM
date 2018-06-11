Ext.namespace("demo.form.cost");

demo.form.cost.CostInfoPanel = Ext.extend(ssc.component.BaseFormGridPanel,
{
	id : "costinfo",
	entities : [ "SMCSFM_COST_INFO" ],
	keycolumns : [ "DETAILID" ],
	xy_StoreUrl : "demo/form/cost/costinfo/list",
	xy_StoreParams : null,
	initComponent : function()
	{
		this.store = this.createStore();

		this.tbar = this.createToolbar();

		this.selModel = new Ext.grid.RowSelectionModel(
		{
			singleSelect : true
		});

		this.colModel = this.createColumnModel();

		demo.form.cost.CostInfoPanel.superclass.initComponent.call(this);
	},
	/**
	 * @extneds
	 * 创建CalcRecord
	 */
	createCalcRecord : function()
	{
		var arrayRecordConfig = [
		{
			name : "detailid"
		},
		{
			name : "mainid"
		},
		{
			name : "status"
		},
		{
			name : "seq"
		},
		{
			name : "abstract"
		},
		{
			name : "amount"
		} ];

		var record = Ext.data.XyCalcRecord.create(arrayRecordConfig);

		/* XyCalcRecord属性设置 */
		FormFieldAttrUtil.setXyCalcRecordAttr(demo.form.cost.FieldAttrConfig, this.id, record);

		return record;
	},
	/**
	 * @extneds
	 * 创建空行
	 */
	newRecord : function()
	{
		var record = this.createCalcRecord();

		var initRecordData =
		{
			detailid : FormNewIDUtil.getNewID(),
			mainid : "",
			status : 0,
			seq : 0,
			"abstract" : "",
			amount : 0
		};

		return new record(initRecordData);
	},
	getCopyConfig : function(record)
	{
		var config =
		{
			detailid : FormNewIDUtil.getNewID()
		};

		return config;
	},
	/**
	 * 创建工具栏
	 */
//	createToolbar : function()
//	{
//		this.createToolbarButton();
//
//		var toolbarTop = [];
//
//		this.btnDel = new Ext.Toolbar.Button(
//		{
//			text : "删除",
//			iconCls : "xy-delete1",
//			handler : this.btn_DeleteEvent,
//			scope : this
//		});
//		this.btnMod = new Ext.Toolbar.Button(
//		{
//			text : "修改",
//			iconCls : "xy-edit",
//			handler : this.editRowEvent,
//			scope : this
//		});

//		if (FormStatusUtil.isStart())
//		{
//			toolbarTop = [ this.btnAdd, "-",this.btnMod, "-", this.btnCopy, "-", this.btnDel];
//		}
//		else
//		{
//			toolbarTop = [ "-" ];
//		}
//
//		return new Ext.Toolbar(
//		{
//			items : toolbarTop,
//			height : 28
//		});
//	},
	/**
	 * 表格列
	 */
	createColumnModel : function()
	{
		var colRowNum = new Ext.grid.RowNumberer(
		{
			summaryType : "合计",
			width : 30
		});
		var colDetailID =
		{
			header : "实体ID",
			dataIndex : "detailid",
			hidden : true
		};
		var colMainID =
		{
			header : "表单ID",
			dataIndex : "mainid",
			hidden : true
		};
		var colSeq =
		{
			dataIndex : "seq",
			hidden : true
		};

		this.edtAbstract = new Ext.form.TextField(
		{
			fieldLabel : "摘要",
			maxLength : 50
		});
		var colAbstract =
		{
			header : "摘要",
			dataIndex : "abstract",
			editor : this.edtAbstract
		};

		this.fieldAmount = new Freesky.Common.XyMoneyField(
		{
			fieldLabel : "报账总金额",
			allowBlank : false,
			allowNegative : true,
			maxValue : ssc.smcs.common.MoneyMaxValue
		});
		var colAmount =
		{
			header : "报账总金额",
			dataIndex : "amount",
			editor : this.fieldAmount
		};

		return new Ext.grid.XyColumnModel([ colRowNum, colDetailID, colMainID, 
		                                    colSeq, 
		                                    colAbstract, colAmount ]);
	},
	initComponentEvents : function(){},
	initComponentStatus : function(){},	
	validate : function(submittype)
	{
		return true;
	},
	check_Record : function(record, index, length)
	{
		this.xy_CheckResult = true;
		return true;
	},
    getStoreLoaded : function()
    {
		return this.xy_StoreLoaded;
	}
});
