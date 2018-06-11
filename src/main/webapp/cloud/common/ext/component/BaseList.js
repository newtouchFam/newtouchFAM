Ext.namespace("ssc.component");

ssc.component.BaseList = Ext.extend(Ext.grid.GridPanel,
{
	/**
	 * ==========默认值==========
	 */

	/**
	 * ==========外观与行为==========
	 */
	/* 分页模式 */
	xy_PageMode : true,
	/* 多选模式 */
	xy_MultiSelectMode : false,
	/* 列头 */
	xy_ColumnConfig : [],

	/**
	 * ==========数据加载==========
	 */
	/* 取数action */
	xy_DataActionURL : "",
	/* 取数SQL存放路径 */
	xy_SQLPath : "",
	/* 取数SQL脚本文件名*/
	xy_SQLFile : "",
	/* 取数存储过程脚本文件名 */
	xy_ProcFile : "",
	/* 是否采用新版本的存储过程读取方式 */
	xy_NewProcAction : false,

	/**
	 * 初始查询参数，支持数组和对象两种格式<br>
	 * 数组：[ {name : "status", value : "1"}, {name : "name", value : "杭州"} ]<br>
	 * 对象：{ status : "1", name : "杭州" }<br>
	 */
	xy_BaseParams : null,
	/* 查询参数是否序列化 */
	xy_ParamJsonSerialize : true,

	/* 字段列表 */
	xy_FieldList : [],
	/* 主键列名 */
	xy_KeyField : "",
	/* 显示字段 */
	xy_DisplayField : "",

	/**
	 * ==========初始化==========
	 */
	/* 初始已选择项 */
	xy_InitDataID : "",

	/**
	 * ==========内部成员==========
	 */
	m_Grid : null,
	m_GridStore : null,
	m_CheckboxSelectionModel : null,
	m_ColumnModel : null,
	m_PagingToolBar : null,
	m_FilterToolBar : null,
	/* 初始已选择项解析后数组 */
	m_InitIDList : [],
	/* 查询参数对象 */
	m_BaseParams : null,
	/* 上次查询参数对象 */
	m_PreBaseParams : null,

	initComponent : function()
	{
		this.initGrid();

		this.initFilterToolBar();

		this.fillItems();

		ssc.component.BaseListDialog.superclass.initComponent.call(this);

		this.loadStoreData(true);

		this.m_Grid.on("bodyresize", this.m_Grid.onBodyResize, this.m_Grid);
		this.m_Grid.on("rowdblclick", this.btn_OkEvent, this);
	},
	/**
	 * @private
	 */
	initGrid : function()
	{
		var dataURL = "";
		if (ssc.common.StringUtil.isEmpty(this.xy_DataActionURL))
		{
			if (this.xy_NewProcAction)
			{
				dataURL = "wf/CommonGridDataExAction.action";	
			}
			else
			{
				dataURL = "wf/CommonGridDataAction.action";	
			}			
		}
		else
		{
			dataURL = this.xy_DataActionURL;
		}

		/**
		 * 创建DataStore
		 */
		if (this.xy_PageMode === true)
		{
			this.m_GridStore = new Ext.data.JsonStore(
			{
				url : dataURL,
				root : "data",
				method : "post",
				totalProperty : "total",
				fields : this.xy_FieldList
			});
		}
		else
		{
			this.m_GridStore = new Ext.data.JsonStore(
			{
				url : dataURL,
				root : "data",
				method : "post",
				fields : this.xy_FieldList
			});
		}
		this.m_GridStore.on("loadexception", ssc.common.StoreLoadExcpetionEvent, this.m_GridStore);

		/**
		 * 创建多选框
		 */
		if (this.xy_MultiSelectMode === true)
		{
			/* 防止重复 */
			if(this.xy_ColumnConfig[0].xy_checkbox !== "xy_checkbox")
			{
				this.m_CheckboxSelectionModel = new Ext.grid.CheckboxSelectionModel(
				{
					xy_checkbox : "xy_checkbox",
					singleSelect : false,
					handleMouseDown : Ext.emptyFn
				});
				
				/**
				 * 把选择列作为第一列放入ColumnModel
				 */
				this.xy_ColumnConfig.unshift(this.m_CheckboxSelectionModel);
			}
		}
		
		this.m_ColumnModel = new Ext.grid.ColumnModel(this.xy_ColumnConfig);

		/**
		 * 创建分页工具栏
		 */
		if (this.xy_PageMode === true)
		{
			this.m_PagingToolBar = new ssc.component.BaseMultiPagingToolBar(
			{
				store : this.m_GridStore
			});
		}
		else
		{
			this.m_PagingToolBar = null;
		}

		/**
		 * 创建列表Grid
		 */
		this.m_Grid = new Ext.grid.GridPanel(
		{
			region : "center",
			anthor : "100%",
			border : false,
			stripeRows : true,
			autoWidth : true,
			autoScroll : true,
			loadMask : true,
			enableHdMenu : false,
			enableColumnMove : false,
			store : this.m_GridStore,
			sm : this.m_CheckboxSelectionModel,
			cm : this.m_ColumnModel,
			bbar : this.m_PagingToolBar !== null ? this.m_PagingToolBar : null
		});
	},
	/**
	 * 自定义按钮config，扩展了全选、全清、反选三个按钮
	 * @private
	 * @overirde	ssc.component.BaseDialog.initButtonConfig_Sub
	 */
	initButtonConfig_Sub : function()
	{
		if (this.xy_MultiSelectMode === false)
		{
			return;
		}

		if (this.xy_ButtonStyle === ssc.component.DialogButtonStyleEnum.ToolBar)
		{
			this.m_ButtonConfig.unshift(
			{
				text : "全选",
				width : 40,
				handler : null,
				scope : this
			},
			{
				text : "全清",
				width : 40,
				handler : null,
				scope : this
			},
			{
				text : "反选",
				width : 40,
				handler : null,
				scope : this
			});
		}
	},
	/**
	 * @private
	 */
	fillItems : function()
	{
		this.items = [ this.m_Grid ];
	},
	/**
	 * @private
	 * 初始化搜索工具栏
	 */
	initFilterToolBar : function()
	{
		var searchList = new Array();
		for ( var i = 0; i < this.m_ColumnModel.getColumnCount(); i++)
		{
			if (this.m_ColumnModel.config[i].xy_Searched === true)
			{
				searchList.push( [ "按 " + this.m_ColumnModel.config[i].header + " 搜索",
									this.m_ColumnModel.config[i].dataIndex ]);

				continue;
			}
			// 字段上设置searchField，向下兼容
			if (typeof (this.m_ColumnModel.config[i].searchField) != "undefined"
				&& this.m_ColumnModel.config[i].searchField != "")
			{
				searchList.push( [ "按 " + this.m_ColumnModel.config[i].header + " 搜索",
									this.m_ColumnModel.config[i].dataIndex ]);

				continue;
			}
		}

		//to-do需要取消已传入的条件

		var conditionStore = new Ext.data.SimpleStore(
		{
			fields : [ "text", "id" ],
			data : searchList
		});
		
        this.m_conditionComboBox = new Ext.form.ComboBox(
		{
			store : conditionStore,
			displayField : "text",
			valueField : "id",
			typeAhead : true,
			mode : "local",
			triggerAction : "all",
			selectOnFocus : true,
			width : 140,
			emptyText : "请选择过滤条件",			
			readOnly : true			
        });

        var m_this = this;

		this.m_searchField = new Ext.app.SearchField(
		{
			width : 200,
			readOnly : false,
			onTrigger1Click : function()
			{
				this.loadStoreData(true);
			}.createDelegate(this),
			onTrigger2Click : function()
			{
				this.setValue("");
			}
		});
		this.m_FilterToolBar = new Ext.Toolbar(
		{
			items : ["过滤条件: ", this.m_conditionComboBox, "-", this.m_searchField]
		});
		
		this.tbar = this.m_FilterToolBar;
	},
	/**
	 * @private 加载数据
	 * force	强制查询
	 */
	loadStoreData : function(/*boolean*/ force)
	{
		var params = null;

		/* 读取基础查询参数 */
		if (this.xy_BaseParams != null || this.xy_BaseParams != undefined)
		{
			params = this.xy_BaseParams;
		}
		else
		{
			if (this.prepareBaseParams != null && this.prepareBaseParams != undefined
					&& typeof (this.prepareBaseParams) == "function")
			{
				params = this.prepareBaseParams();
			}
		}

		if (params == null)
		{
			params = {};
		}

		/* 把数组格式转换为对象格式 */
		this.m_BaseParams = ssc.common.loadStoreParamConvert(params);

		/* 增加过滤条件参数 */		
		if (this.m_conditionComboBox != null
				&& this.m_searchField != null)
		{
			var searchField = this.m_conditionComboBox.getValue().trim();
			var searchValue = this.m_searchField.getValue();

			if (searchField != null && searchField != "" && searchValue != null && searchValue != "undefined" && searchValue != "")
			{
				this.m_BaseParams[searchField] = searchValue;
			}
		}

		if (force != true)
		{
			if (ssc.common.loadStoreParamCompare(this.m_PreBaseParams, this.m_BaseParams))
			{
				return;
			}
		}

		/* 设置到baseParams */
		ssc.common.loadStoreParserParam(this.m_GridStore, this.m_BaseParams, this.xy_ParamJsonSerialize);

		if (this.xy_PageMode === true)
		{
			/* 分页 */
			this.m_GridStore.load(
			{
				params :
				{
					start : this.m_Grid.getBottomToolbar().cursor,
					limit : this.m_Grid.getBottomToolbar().pageSize
				}
			});
		}
		else
		{
			/* 不分页 */
			this.m_GridStore.load( {});
		}

		this.m_PreBaseParams = this.m_BaseParams;
	},
	/**
	 * 在查询action提交之前，设置查询参数
	 * 由具体实现类实现
	 * @private
	 * @abstract
	 */
	prepareBaseParams : function()
	{
		return null;
	},
	/**
	 * 点击“确定”按钮后验证方法，加入了选择后校验是否已选择的过程
	 * @private
	 * @override	ssc.component.BaseDialog.baseConfirmValid
	 * @retrun boolean
	 */
	baseConfirmValid : function()
	{
		var recordList = this.m_Grid.getSelectionModel().getSelections();

		if (recordList.length <= 0)
		{
			var msg = "请先选择数据";			
			MsgUtil.alert(msg, this);

			return false;
		}

		return true;
	},
	/**
	 * @public
	 * 获取所有选择数据的ID<br>
	 * 如单选，则返回record.data.xy_KeyField<br>
	 * 如多选，则返回record.data.xy_KeyField的字符串，逗号分隔<br>
	 * 不会查找未加载的行<br>
	 */
	getSelectedID : function()
	{
		if (ssc.common.StringUtil.isEmpty(this.xy_KeyField))
		{
			return "";
		}

		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			var records = this.m_Grid.getSelectionModel().getSelections();

			var idList = new Array();
			for (var i = 0; i < records.length; i++)
			{
				var entity = records[i].data;
				idList.push(entity[this.xy_KeyField]);
			}

			return idList.toString();
		}
		else
		{
			/* 单选 */
			var record = this.m_Grid.getSelectionModel().getSelected();
			if (record == null)
			{
				return "";
			}

			var entity = {};
			Ext.apply(entity, record.data);
			
			return entity[this.xy_KeyField];
		}
	},
	/**
	 * @public
	 * 获取所有选择数据的文本<br>
	 * 如单选，则返回record.data.xy_DisplayField<br>
	 * 如多选，则返回record.data.xy_DisplayField的字符串，逗号分隔<br>
	 * 不会查找未加载的行<br>
	 */
	getSelectedText : function()
	{
		if (ssc.common.StringUtil.isEmpty(this.xy_DisplayField))
		{
			return "";
		}

		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			var records = this.m_Grid.getSelectionModel().getSelections();

			var idList = new Array();
			for (var i = 0; i < records.length; i++)
			{
				var entity = records[i].data;
				idList.push(entity[this.xy_DisplayField]);
			}

			return idList.toString();			
		}
		else
		{
			/* 单选 */
			var record = this.m_Grid.getSelectionModel().getSelected();
			if (record == null)
			{
				return "";
			}

			var entity = {};
			Ext.apply(entity, record.data);

			return entity[this.xy_DisplayField];
		}
	},
	/**
	 * @public
	 * 获取所有选择数据的行数据<br>
	 * 如单选，则返回record.data<br>
	 * 如多选，则返回record.data的Array<br>
	 * 不会查找未加载的行<br>
	 */
	getSelectedData : function()
	{
		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			var records = this.m_Grid.getSelectionModel().getSelections();

			var entityList = new Array();
			for (var i = 0; i < records.length; i++)
			{
				var entity = records[i].data;
				entityList.push(entity);
			}

			return entityList;
		}
		else
		{
			/* 单选 */
			var record = this.m_Grid.getSelectionModel().getSelected();
			if (record == null)
			{
				return null;
			}

			var entity = {};
			Ext.apply(entity, record.data);
			
			return entity;
		}
	},
	/**
	 * @public
	 * 获取选择项数量<br>
	 */
	getSelectedCount : function()
	{
		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			var recordList = this.m_Grid.getSelectionModel().getSelections();

			return recordList.length;
		}
		else
		{
			/* 单选 */
			var record = this.m_Grid.getSelectionModel().getSelected();
			if (record == null)
			{
				return 0;
			}
			else
			{
				return 1;
			}
		}

		return this.m_Tree.getSelectedCount();
	},
	/**
	 * @public
	 * 清除所有已选项<br>
	 * 不会查找未加载的节点<br>
	 */
	clearSelections : function()
	{
		if (this.m_Grid != null)
		{
			this.m_Grid.getSelectionModel().clearSelections();
		}
	},
	getCheckboxSelectionModel : function()
	{
		return this.m_CheckboxSelectionModel;
	},
	getColumnConfig : function()
	{
		return this.xy_ColumnConfig;
	},
	getColumnModel : function()
	{
		return this.m_ColumnModel;
	},
	getPagingToolBar : function()
	{
		return this.m_PagingToolBar;
	},
	getGrid : function()
	{
		return this.m_Grid;
	},
	getGridStore : function()
	{
		return this.m_GridStore;
	},
	getFilterToolBar : function()
	{
		return this.m_FilterToolBar;
	}
});
Ext.reg("ssc.component.baselistdialog", ssc.component.BaseListDialog);