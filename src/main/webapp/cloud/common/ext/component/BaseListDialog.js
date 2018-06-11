Ext.namespace("ssc.component");

/**
 * @class
 * 基础列表选择对话框<br>
 * @extends ssc.component.BaseDialog
 * 一、支持特性：<br>
 * 1.支持action、配置sql文件、配置procedure文件方式取数<br>
 * 2.支持单选和多选<br>
 * 3.支持分页和不分页<br>
 * 4.支持传入自定义列头<br>
 * 5.支持传入后台查询条件，需要实现prepareBaseParams()<br>
 * 6.支持页面上多个过滤条件，但只有一个生效。也允许传入自定义过滤条件面板。<br>
 * 7.显示全选、全清、反选按钮。（暂时只有按钮为ToolBar风格时才显示）<br>
 * 8.支持传入已选择内容（暂未实现）<br>
 *
 * 二、使用方式
 * 1.确定界面样式和风格
 * 构造时传入参数
 * title、height、width等Ext.Window自带参数
 * xy_ButtonType		对话框按钮样式
 * xy_ButtonStyle		按钮布局模式
 * xy_MultiSelectMode	是否多选模式
 * xy_PageMode			分页模式
 * xy_PageSizeList		分页数量数组
 * xy_ColumnConfig		表格列头数组
 * xy_KeyField			主键字段
 * xy_DisplayField		显示字段
 *
 * 2.数据
 * 构造时传入参数
 * xy_DataActionURL		取数Action地址
 * xy_SQLPath			取数SQL存放路径
 * xy_SQLFile			取数SQL脚本文件名
 * xy_ProcFile			取数存储过程脚本文件名
 * xy_NewProcAction		是否采用新版本的存储过程读取方式
 * xy_FieldList			JsonStore字段列表
 *
 * 3.事件
 * 构造时传入参数
 * xy_ParentObjHandle	parent调用方句柄;
 * xy_OKClickEvent		点击“确定”按钮后的回调函数句柄。
 * 						一般为点击“确定”按钮，选择窗体关闭后，调用方的后续处理。
 * 实现abstract函数
 * prepareBaseParams		按照ssc.common.BaseCondition格式拼写查询条件，
 * 						以便在提交查询action参数时一起提交。
 *
 * 4.获取返回值
 * 一般在回调函数（即xy_OKClickEvent所指向的函数）中，调用public方法
 * getSelectedID
 * getSelectedData
 * 分别获取选择的ID和数据对象，单选或多选都支持
 *
 * 5.界面查询条件
 * 在传入的列头配置xy_ColumnConfig参数中允许传入自定义属性：
 * xy_DefaultSearched, xy_Searched、xy_DataType、searchField
 * 如果该字段在传入的后台查询条件中已经存在，则该查询条件无效，不显示在界面上。
 * xy_Searched	该列是否作为界面查询条件，设置为true或fasle
 * xy_DataType	该列数据类型，作为界面查询条件的比较操作符，取值"string"、"number"（暂未实现）
 * searchField	以前版本的字段，为向下兼容保留。设置字段名。
 * 例如：
 * 	{
		header : "编码",
		dataIndex : "unitCode",
		width : 80,
		sortable : true,
		xy_Searched : true,
		xy_DataType : "string"
	}
 */
ssc.component.BaseListDialog = Ext.extend(ssc.component.BaseDialog,
{
	/**
	 * ==========默认值==========
	 */
	closeAction : "close",

	xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.None,

	/**
	 * ==========外观与行为==========
	 */
	/* 分页模式 */
	xy_PageMode : true,
	/* 分页模式 */
	xy_PageSizeList : [ 20, 40, 60, 80, 100 ],
	/* 多选模式 */
	xy_MultiSelectMode : false,
	/* 远程数据模式 */
	xy_RemoteDataMode : true,
	/* 列头 */
	xy_ColumnConfig : [],
	/* 过滤条件对象 */
	xy_Filter : [],

	/**
	 * ==========数据加载==========
	 */
	/* 取数action */
	xy_DataActionURL : "",
	/* 取数SQL存放路径 */
	xy_SQLPath : "",
	/* 取数SQL脚本文件名 */
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
	/* 是否初始化加载数据 */
	xy_InitLoadData : true,

	/**
	 * ==========内部成员==========
	 */
	m_Grid : null,
	m_GridStore : null,
	m_RowNumberer : null,
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

		if (this.xy_InitLoadData)
		{
			this.loadStoreData(true);
		}

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
		if (this.xy_RemoteDataMode == true)
		{		
			if (this.xy_PageMode === true)
			{
				var strTotalCountTag = "total";
				if (ssc.common.StringUtil.isEmpty(this.xy_DataActionURL))
				{
					strTotalCountTag = "totalcount";
				}
	
				this.m_GridStore = new Ext.data.JsonStore(
				{
					url : dataURL,
					root : "data",
					method : "post",
					totalProperty : strTotalCountTag, /* 如果使用wfCommon的Action，标签使用totalcount */
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
		}
		else
		{
			this.m_GridStore = new Ext.data.JsonStore(
			{
				data : [],
				fields : this.xy_FieldList
			});
		}

		/* 数据加载后，根据当前页最大行号调整行号列宽 */
		this.m_GridStore.on("load", ssc.common.NumberColumnWidthAdjust, this);
		this.m_GridStore.on("loadexception", ssc.common.StoreLoadExcpetionEvent, this.m_GridStore);

		/*在第1列创建序号列*/
		if (this.m_RowNumberer == null)
		{
			this.m_RowNumberer = new Ext.grid.RowNumberer();
		}
		if (this.xy_ColumnConfig[0].id !== "numberer")
		{
			this.xy_ColumnConfig.unshift(this.m_RowNumberer);
		}

		/* 在第2列创建多选框 */
		if (this.xy_MultiSelectMode === true)
		{
			if (this.m_CheckboxSelectionModel == null)
			{
				this.m_CheckboxSelectionModel = new Ext.grid.CheckboxSelectionModel(
				{
					singleSelect : false,
					handleMouseDown : Ext.emptyFn
				});
			}

			/* 防止重复 */
			if(this.xy_ColumnConfig[1].id !== "checker")
			{
				var array = [this.m_RowNumberer, this.m_CheckboxSelectionModel ];

				for (var i = 1; i < this.xy_ColumnConfig.length; i++)
				{
					var vv = this.xy_ColumnConfig[i];
					array.push(this.xy_ColumnConfig[i]);
				}

				this.xy_ColumnConfig = array;
			}
		}

		this.m_ColumnModel = new Ext.grid.ColumnModel(this.xy_ColumnConfig);

		/**
		 * 创建分页工具栏
		 */
		if (this.xy_PageMode === true)
		{
			if (this.xy_PageSizeList == undefined || Ext.isArray(this.xy_PageSizeList))
			{
				this.m_PagingToolBar = new ssc.component.BaseMultiPagingToolBar(
				{
					store : this.m_GridStore
				});
			}
			else
			{
				this.m_PagingToolBar = new ssc.component.BaseMultiPagingToolBar(
				{
					store : this.m_GridStore,
					xy_PageSizeList : this.xy_PageSizeList
				});				
			}
			this.m_GridStore.xy_PagingToolBar = this.m_PagingToolBar;
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
				handler : this.selectAll,
				scope : this
			},
			{
				text : "全清",
				width : 40,
				handler : this.clearAllSelections,
				scope : this
			},
			{
				text : "反选",
				width : 40,
				handler : this.shfitAllSelections,
				scope : this
			});
		}
	},
	selectAll : function()
	{
		this.m_Grid.getSelectionModel().selectAll();
	},
	clearAllSelections : function()
	{
		this.m_Grid.getSelectionModel().clearSelections();
	},
	shfitAllSelections : function()
	{
		for (var i = 0; i < this.m_GridStore.getCount(); i++)
		{
			if (this.m_Grid.getSelectionModel().isSelected(i))
			{
				this.m_Grid.getSelectionModel().deselectRow(i);
			}
			else
			{
				this.m_Grid.getSelectionModel().selectRow(i, true);
			}
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
			if (this.m_ColumnModel.config[i].xy_DefaultSearched === true)
			{
				searchList.push( [ "按 " + this.m_ColumnModel.config[i].header + " 搜索",
									this.m_ColumnModel.config[i].dataIndex ]);

				continue;
			}
		}

		for ( var i = 0; i < this.m_ColumnModel.getColumnCount(); i++)
		{
			if (this.m_ColumnModel.config[i].xy_Searched === true)
			{
				searchList.push( [ "按 " + this.m_ColumnModel.config[i].header + " 搜索",
									this.m_ColumnModel.config[i].dataIndex ]);

				continue;
			}

			/* 字段上设置searchField，向下兼容 */
			if (typeof (this.m_ColumnModel.config[i].searchField) != "undefined"
				&& this.m_ColumnModel.config[i].searchField != "")
			{
				searchList.push( [ "按 " + this.m_ColumnModel.config[i].header + " 搜索",
									this.m_ColumnModel.config[i].dataIndex ]);
				continue;
			}
		}

		if (searchList.length > 0)
		{
			/*to-do需要取消已传入的条件*/
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
					m_this.m_GridStore.baseParams["SearchValue"] = "";
				}
			});

			if (this.m_conditionComboBox.store.getCount() > 0)
			{
				this.m_conditionComboBox.selectedIndex = 0;
				var object = this.m_conditionComboBox.store.getAt(0).data;
				this.m_conditionComboBox.setValue(object[this.m_conditionComboBox.valueField]);
			}

			this.m_FilterToolBar = new Ext.Toolbar(
			{
				items : ["过滤条件: ", this.m_conditionComboBox, "-", this.m_searchField]
			});

			this.tbar = this.m_FilterToolBar;
		}
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

			if (searchField != "undefined" && searchValue != "undefined" )
			{
				if(searchField != null && searchField != "")
				{
					
				}
				else
				{
					searchField = "Default";
				}
				this.m_BaseParams[searchField] = searchValue;

				if (! this.xy_ParamJsonSerialize)
				{
					this.m_GridStore.baseParams["SearchField"] = searchField;
					this.m_GridStore.baseParams["SearchValue"] = searchValue;
				}
			}
		}

		if (force != true)
		{
			if (ssc.common.loadStoreParamCompare(this.m_PreBaseParams, this.m_BaseParams))
			{
				return;
			}
		}

		if (!ssc.common.StringUtil.isEmpty(this.xy_SQLPath)
				|| !ssc.common.StringUtil.isEmpty(this.xy_SQLFile)
				|| !ssc.common.StringUtil.isEmpty(this.xy_ProcFile))
		{
			ssc.common.loadStoreWfCommonParam(this.m_GridStore,
				this.xy_SQLPath,
				this.xy_SQLFile,
				"",
				this.xy_ProcFile);
		}

		/* 设置到baseParams */
		ssc.common.loadStoreParserParam(this.m_GridStore, this.m_BaseParams, this.xy_ParamJsonSerialize);

		if (this.xy_PageMode === true)
		{
			/* 分页 */

			/* 分页栏恢复到第一页 */
			this.m_Grid.getBottomToolbar().restoreFirstPage();
			this.m_GridStore.load(
			{
				params :
				{
					/* 强制查询时，应恢复到第一页
					start : this.m_Grid.getBottomToolbar().cursor,*/
					start : 0,
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
	 * 是否选定
	 */
	getSelected : function()
	{
		return (this.getSelectedCount() > 0);
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
	 * 获取所有选择数据的特定属性<br>
	 * 如单选，则返回record.data.attrname<br>
	 * 如多选，则返回record.data.attrname的字符串，逗号分隔<br>
	 * 不会查找未加载的行<br>
	 */
	getSelectedAttr : function(attrname)
	{
		if (this.xy_MultiSelectMode)
		{
			/* 多选 */
			var entityList = this.getSelectedData();
			
			var attrList = new Array();
			for (var i = 0; i < entityList.length; i++)
			{
				var entity = entityList[i];

				if (entity != null && entity[attrname] != undefined)
				{
					attrList.push(entity[attrname]);
				}
			}

			return attrList.toString();
		}
		else
		{
			/* 单选 */
			var entity = this.getSelectedData();

			if (entity != null && entity[attrname] != undefined)
			{
				return entity[attrname].toString();
			}
			else
			{
				return "";
			}
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