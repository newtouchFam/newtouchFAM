Ext.namespace("ssc.component");

/**
 * 表格面板基类
 */
ssc.component.BaseFormGridPanel = Ext.extend(Ext.grid.XyEditorGridPanel,
{
	frame : true,
	border : true,
	height : 200,
	autoHeight : false,
	autoScroll : true,
/*	iconCls : "xy-grid",*/
	enableColumnMove : false,
	enableHdMenu : false,
	clicksToEdit : 1,
	loadMask :
	{
		msg : "数据加载中，请稍等..."
	},
	listeners :
	{
		activate : function()
		{
			this.doLayout();
		}
	},

	xy_Title : "",

	store : null,
	xy_StoreUrl : "",
	xy_StoreParams : null,

	/* 打印数据最少行数，缺少增加空行 */
	xy_MinPrintDataRecordCount : 0,
	/* 打印时金额字段转为金额格式字符串 */
	xy_IsMoneyFormatString : false,
	xy_isPage : false,
	xy_pageBbar : null,
	xy_PageSizeList : null,
	xy_isPageSave : false,
	xy_StoreLoaded : false,

	/**
	 * 标准增、删、复制行、导入按钮
	 */
	btnAdd : null,
	btnCopy : null,
	btnDelete : null,
	btnImport : null,
	btnNone : null,

	initComponent : function()
	{
		ssc.component.BaseFormGridPanel.superclass.initComponent.call(this);
	},
	/**
	 * @public
	 */
	setStore : function(store)
	{
		this.store = store;
	},

	/**
	 * @protected
	 * 公用创建Grid的Store方法
	 */
	createStore : function()
	{
		if (this.store === undefined || this.store == null)
		{
			if (this.xy_StoreUrl == undefined || this.xy_StoreUrl == null || Ext.isEmpty(this.xy_StoreUrl))
			{
				/* 断言 */
				DebugAssertUtil.alert("ssc.smcs.component.FormBaseGridPanel[" + this.id + "], this.xy_StoreUrl属性未赋值，不能创建Store");
			}

			this.store = new Ext.data.Store(
			{
				baseParams : this.xy_StoreParams,
				url : this.xy_StoreUrl,
				reader : new Ext.data.JsonReader(
				{
					root : "data",
					totalProperty:"total"
				}, this.createInitCalcRecord())
			});
			/*this.store.on("beforeload", function(store, options)
			{
				
				this.xy_StoreLoading = true;
			});*/

			this.store.on("load", function(store, records, options)
			{
				for ( var i = 0; i < records.length; i++)
				{
					var record = records[i];
					record.xy_isCreateState = false;
				}
				if(this.store.reader.jsonData.success == true)
				{
					this.xy_StoreLoaded = true;
				}

			},this);
			/*this.store.proxy.on("load", function( params, reader, callback, scope, arg)
			{
				 alert(this.store.reader.jsonData.success);
			},this);*/
		}

		return this.store;
	},
	getStoreLoaded : function()
	{
		return this.xy_StoreLoaded;
	},
	/**
	 * @private
	 */
	createInitCalcRecord : function()
	{
		var record = this.createCalcRecord();
		record.prototype.xy_isCreateState = true;

		return record;
	},
	/**
	 * @abstract
	 * 创建record，供store使用。子类实现
	 */
	createCalcRecord : Ext.emptyFn,

	/**
	 * @abstract
	 * 创建工具栏
	 * 子类实现
	 */
	createToolbar : Ext.emptyFn,

	/**
	 * @protected
	 * 创建按钮
	 */
	createToolbarButton : function()
	{
		this.btnAdd = new Ext.Toolbar.Button(
		{
			text : "新增",
			iconCls : "xy-add",
			handler : this.addRowEvent,
			scope : this
		});
		this.btnCopy = new Ext.Toolbar.Button(
		{
			text : "复制",
			iconCls : "xy-copy",
			handler : this.copyRowEvent,
			scope : this
		});
		this.btnDelete = new Ext.Toolbar.Button(
		{
			text : "删除",
			iconCls : "xy-delete",
			handler : this.delRowEvent,
			scope : this
		});
		this.btnImport = new Ext.Toolbar.Button(
		{
			text : "导入",
			iconCls : "xy-import",
			handler : this.importEvent,
			scope : this
		});
		this.btnNone = new Ext.Toolbar.Button(
		{
			text : "&nbsp ",
			iconCls : "xy-none",
			disabled : true
		});
	},
	createBBar : function()
	{
		if (this.xy_isPage)
		{
			this.xy_pageBbar = new ssc.component.BaseMultiPagingToolBar(
			{
				store : this.store,
				xy_PageSizeList : this.xy_PageSizeList == null ? [ 10, 50, 100, 200, 500 ]
						: this.xy_PageSizeList
			});

			return this.xy_pageBbar;
		} 
	},

	/**
	 * @abstract
	 * 创建空行
	 * 子类实现
	 */
	newRecord : Ext.emptyFn,

	/**
	 * @protected
	 * 增加行
	 */
	addRowEvent : function()
	{
		var record = this.newRecord();
		if (record == null || record == undefined)
		{
			return;
		}

		Freesky.Common.XyGridUtil.add(this, record, this.getSelectedIndex() + 1);
		Freesky.Common.XyGridUtil.refreshRowNum(this, 0);
	},
	/**
	 * @protected
	 * 复制行
	 */
	copyRowEvent : function()
	{
		this.stopEditing();

		var record = this.newRecord();
		if (record == null || record == undefined)
		{
			return;
		}

		var config = this.getCopyConfig(record);

		if (config == null)
		{
			Freesky.Common.XyGridUtil.copy(this, record, this.getSelectedIndex() + 1);
		}
		else
		{
			Freesky.Common.XyGridUtil.copy(this, record, this.getSelectedIndex() + 1, config);
		}
		Freesky.Common.XyGridUtil.refreshRowNum(this, 0);
	},
	getCopyConfig : function(record)
	{
		return null;
	},
	getReverseConfig : function()
	{
	     return null;
	},
	/**
	 * @protected
	 * 删除行
	 */
	delRowEvent : function()
	{
		Freesky.Common.XyGridUtil.del(this);
		Freesky.Common.XyGridUtil.refreshRowNum(this, 0);
	},
	/**
	 * @abstract
	 * 导入按钮处理事件。子类实现
	 */
	importEvent : Ext.emptyFn,

	/**
	 * @abstract
	 * 界面加载前事件设置。子类实现
	 */
	initComponentEvents : Ext.emptyFn,

	/**
	 * 界面数据读取接口
	 */
	loadFormData : function()
	{
		if (this.getStore != null && typeof(this.getStore) == "function")
		{
			this.getStore().load();
		}
	},

	/**
	 * @abstract
	 * 数据加载后界面设置。子类实现
	 */
	initComponentStatus : Ext.emptyFn,

	/**
	 * @abstract
	 * 数据验证接口。子类实现
	 */
	validate : Ext.emptyFn,

	/**
	 * 获取表单数据公用方法
	 */
	getFormData : function()
	{
		var schema =
		{
			entities : this.entities,
			keyColumns : this.keycolumns
		};
		var detailData = new Array();
		var notSaveColumnIndex = new Array();
		detailData[0] = new Array();
		this.stopEditing();
		for ( var i = 1, j = this.colModel.getColumnCount(); i < j; i++)
		{
			if (this.colModel.config[i].XyNotSave === true)
			{
				notSaveColumnIndex.push(i);
			}
			else
			{
				var key = this.colModel.config[i]["XySaveField"] ? this.colModel.config[i]["XySaveField"]
						: this.colModel.getDataIndex(i);
				detailData[0].push(key);
			}
		}
		for ( var i = 0, j = this.getStore().data.length; i < j; i++)
		{
			detailData[i + 1] = new Array();
			for ( var m = 1, n = this.colModel.getColumnCount(); m < n; m++)
			{
				if (notSaveColumnIndex.indexOf(m) == -1)
				{
					if (this.colModel.config[m].XySaveType == "datefield")
					{
						if (typeof this.getStore().getAt(i).get(this.colModel.getDataIndex(m)).format == "undefined")
						{
							detailData[i + 1].push(this.getStore().getAt(i).get(
								this.colModel.getDataIndex(m)));
						}
						else
						{
							detailData[i + 1].push(this.getStore().getAt(i).get(
								this.colModel.getDataIndex(m)).format("Y-m-d"));
						}
					}
					else
					{
						if (this.colModel.config[m].XySaveType == "moneyfield")
						{
							detailData[i + 1].push(this.getStore().getAt(i).getXyValue(
								this.colModel.getDataIndex(m)).toFixed(2));
						}
						else
						{
							if(this.colModel.config[m]["dataIndex"] == "seq")
							{
								detailData[i + 1].push(i+1);
							}
							else
							{
								var _val = this.getStore().getAt(i).getXyValue(this.colModel.getDataIndex(m));
								detailData[i + 1].push(_val == null ? "" : _val);
							}
						}

					}
				}
			}
		}
		var envelope = [ schema, detailData ];
		return envelope;
	},
	/**
	 * 获取打印数据公用方法
	 */
	getPrintData : function()
	{
		var data = new Array();
		for ( var i = 0, j = this.getStore().data.length; i < j; i++)
		{
			var json = {};
			for ( var m = 1, n = this.colModel.getColumnCount(); m < n; m++)
			{
				var key = this.colModel.getDataIndex(m);
				if (this.colModel.config[m].complex == true)
				{
					json[key] = this.getStore().getAt(i).getXyValue(key);
					json[key + "_text"] = this.getStore().getAt(i).getDisplayValue(key);
				}
				else
				{
					if (this.colModel.config[m].XySaveType == "datefield")
					{
						if (typeof (this.getStore().getAt(i).get(key).format) == "undefined")
						{
							json[key] = this.getStore().getAt(i).get(key);
						}
						else
						{
							json[key] = this.getStore().getAt(i).get(key).format("Y-m-d");
						}
					}
					else
					{
						json[key] = this.getStore().getAt(i).get(key);
					}

					if (this.xy_IsMoneyFormatString == true && this.colModel.config[m].xy_PrintDataFormat == "money")
					{
						json[key] = ssc.common.FormatUtil.Money(this.getStore().getAt(i).get(key));
					}
				}

/*
				if (this.colModel.config[m].XySaveType == "datefield")
				{
					if (typeof this.getStore().getAt(i).get(this.colModel.getDataIndex(m)).format == "undefined")
					{
						json[key] = this.getStore().getAt(i).get(this.colModel.getDataIndex(m));
					}
					else
					{
						json[key] = this.getStore().getAt(i).get(this.colModel.getDataIndex(m))
								.format("Y-m-d");
					}
				}
				else
				{
					json[key] = this.getStore().getAt(i).getDisplayValue(
						this.colModel.getDataIndex(m));
				}*/
			}

			if (this.update_PrintDataRecord != undefined
					&& typeof(this.update_PrintDataRecord) == "function")
			{
				json = this.update_PrintDataRecord(i, this.getStore().getAt(i), json);
			}

			data.push(json);
		}

		data = this.add_NullPrintData(data);

		return data;
	},

	update_PrintDataRecord : function(index, record, data)
	{
		return data;
	},

	add_NullPrintData : function(data)
	{
		if (this.add_NullPrintDataRecord != undefined
				&& typeof(this.add_NullPrintDataRecord) == "function"
				&& this.xy_MinPrintDataRecordCount != undefined
				&& data.length < this.xy_MinPrintDataRecordCount)
		{
			var dataCount = data.length;

			for (var k = 0; k < this.xy_MinPrintDataRecordCount - dataCount; k++)
			{
				var json = this.add_NullPrintDataRecord();

				data.push(json);
			}
		}

		return data;
	},

	add_NullPrintDataRecord : function()
	{
		var json = {};
		for ( var m = 1, n = this.colModel.getColumnCount(); m < n; m++)
		{
			var key = this.colModel.getDataIndex(m);
			if (this.colModel.config[m].complex == true)
			{
				json[key] = "";
				json[key + "_text"] = "";
			}
			else
			{
				if (this.colModel.config[m].XySaveType == "datefield")
				{
					json[key] = "";
				}
				else
				{
					json[key] = "";
				}
			}
		}

		return json;
	},

	newRecordByConditions : function(array)
	{
		var newR = this.newRecord();
		for ( var i = 0; i < array.length; i++)
		{
			if(array[i]["columnID"])
			{
				newR.set(array[i]["columnName"], array[i]["columnValue"], array[i]["columnID"], array[i]["columnText"]);
			}
			else
			{
				newR.set(array[i]["columnName"], array[i]["columnValue"]);
			}
		}
		return newR;
	},
	addItemByConditions : function(array)
	{
		Freesky.Common.XyGridUtil.add(this, this.newRecordByConditions(array), this.getSelectedIndex() + 1);
		Freesky.Common.XyGridUtil.refreshRowNum(this, 0);
	},
	getSelectedIndex : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (record != null)
		{
			return this.getStore().indexOf(record);
		}
		return -1;
	},

	loadexception : function(This, node, response, error)
	{
		showExtLoadException(This, node, response, error);
	},
	getColumnIndexByDataIndex : function(C)
	{
		for ( var i = 0, size = this.colModel.getColumnCount(); i < size; i++)
		{
			if (this.colModel.getDataIndex(i) == C)
			{
				return i;
			}
		}
		return -1;
	},
	formPost : function(url, jsonObj, target)
	{
		var oForm = document.createElement("form");
		oForm.id = "freesky-postForm";
		oForm.name = "freesky-postForm";
		oForm.method = "post";
		oForm.action = url;
		oForm.target = target;
		oForm.style.display = "none";

		for ( var prop in jsonObj)
		{
			var oInput = document.createElement("input");
			oInput.name = prop;
			oInput.value = jsonObj[prop];
			oForm.appendChild(oInput);
		}
		document.body.appendChild(oForm);
		oForm.submit();
	},
	/**
	 * 获取表格中数据行数
	 */
	getRecordCount : function()
	{
		if (this == null || this == undefined)
		{
			return;
		}

		if (this.getStore() == null || this.getStore() == undefined)
		{
			return;
		}

		var store = this.getStore();
		if (store.getTotalCount == undefined)
		{
			return;
		}

		return store.getCount();
	},
	/**
	 * 清除表格中所有数据
	 */
	removeAllRecords : function()
	{
		if (this == null || this == undefined)
		{
			return;
		}

		if (this.getStore() == null || this.getStore() == undefined)
		{
			return;
		}

		var store = this.getStore();
		if (store.removeAll == undefined)
		{
			return;
		}

		this.stopEditing();
		store.removeAll();
	},
	/**
	 * 计算合计金额
	 */
	getSumMoney : function(strFieldName)
	{
		var mnySumMoney = 0;
		for ( var i = 0; i < this.getStore().getCount(); i++)
		{
			var record = this.getStore().getAt(i);
			var money = record.get(strFieldName);
			if (NumberUtil.isNumber(money))
			{
				mnySumMoney = FormMoneyUtil.add(mnySumMoney, money);
			}
		}

		return mnySumMoney;
	},
	getSumAmount : function()
	{
		return this.getSumMoney("amount");
	},
	getSumFinAmount : function()
	{
		return this.getSumMoney("finamount");
	},
	getSumAmount_BC : function()
	{
		return this.getSumMoney("amount_bc");
	},
	getSumFinAmount_BC : function()
	{
		return this.getSumMoney("finamount_bc");
	}
});
Ext.reg("ssc_smcs_component_baseformgridpanel", ssc.component.BaseFormGridPanel);