Ext.namespace("ssc.component");

/**
 * 通用查询条件对话框
 * 需要把各查询的查询条件Panel传入
 */
ssc.component.JRReportWindow = Ext.extend(Ext.Window,
{
	layout : "fit",
	title : "过滤条件",
	closeAction : "hide",
	modal : true,
	/**
	 * 查询条件面板句柄，各查询界面自行实现并传入
	 */
	xy_QueryPanel : null,
	/**
	 * 查询主界面Panel句柄，主界面传入
	 */
	xy_MainPanel : null,
	initComponent : function()
	{
		this.m_QueryPanel = new this.xy_QueryPanel(
		{
			xy_MainPanel : this.xy_MainPanel
		});

		this.items = [ this.m_QueryPanel ];
		this.buttons = [
		{
			text : "确定",
			handler : this.m_QueryPanel.query,
			scope : this.m_QueryPanel
		},
		{
			text : "取消",
			handler : function()
			{
				this.hide();
			},
			scope : this
		} ];

		ssc.component.JRReportWindow.superclass.initComponent.call(this);
	}
});


/**
 * 查询主界面Panel
 * this.xy_QueryPanel	查询条件面板句柄，各查询界面自行实现并传入
 * this.xy_QueryWindowWidth		查询条件窗口宽度
 * this.xy_QueryWindowHeight	查询条件窗口高度
 * this.xy_Limit 		分页行数
 * this.xy_MaxLimit 	导出行数上限
 * this.abovelimitcallback 超出导出上限时的回调函数,调用后返回true则继续导出
 * this.abovelimitconfirm 超过导出上限给出提示,但允许继续导出
 */
ssc.component.JRReportMainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	/**
	 * 查询条件面板句柄，各查询界面自行实现并传入
	 */
	xy_QueryPanel : null,
	/**
	 * 查询条件窗口宽度
	 */
	xy_QueryWindowWidth : 400,
	/**
	 * 查询条件窗口高度
	 */
	xy_QueryWindowHeight : 300,
	/**
	 * 分页行数
	 */
	xy_Limit : null,
	/**
	 * 导出行数上限
	 */
	xy_MaxLimit : 2000,

	/**
	 * 查询窗体
	 */
	m_QueryWindow : null,

	/**
	 * 分页栏
	 */
	m_PageToolbar : null,

	/**
	 * 查询参数
	 */
	m_Param : null,

	/**
	 * 查询地址
	 */
	m_ReportUrl : "",

	/**
	 * 查询批次ID
	 * 每次提交查询之前生成一个新的GUIDID
	 */
	m_ReportBulkID : "",

	/**
	 * 首次查询标志
	 */
	m_isFirstQuery : false,

	initComponent : function()
	{
		this.createButton();

		this.createPagingToolbar();

		/**
		 * html报表展现区域
		 */
		var html = "<iframe name='reportpanel' id='reportpanel' width='100%' height='100%'  frameborder='0'></iframe>";

		Ext.apply(this,
		{
			html : html
		});
		
		if(this.xy_QueryPanel)
		{
			this.showQueryWindow();
		}
		
		ssc.component.JRReportMainPanel.superclass.initComponent.call(this);
	},
	/**
	 * 判断是否分页查询
	 */
	isPageMode : function()
	{
		if (this.xy_Limit == undefined || this.xy_Limit == null)
		{
			return false;
		}

		if (this.xy_Limit <= 0)
		{
			return false;
		}

		return true;
	},
	/**
	 * 创建工具栏按钮
	 */
	createButton : function()
	{
		if (this.isPageMode())
		{
			/**
			 * 分页模式
			 */

			this.btnExportPage = new Ext.Toolbar.SplitButton(
			{
				text : "导出当页",
				iconCls : "xy-export",
				scope : this,
				menu :
				{
					items : [
					{
						text : "Excel",
						iconCls : "xy-excel",
						handler : function()
						{
							this.btn_ExportPageEvent("xlsx");
						},
						scope : this
					},
					{
						text : "PDF",
						iconCls : "xy-pdf",
						handler : function()
						{
							this.btn_ExportPageEvent("pdf");
						},
						scope : this
					} ]
				}
			});
			this.btnExportPage.on("click", function(_This, e)
			{
				if (_This.menu && !_This.menu.isVisible() && !_This.ignoreNextClick)
				{
					_This.showMenu();
				}
				_This.fireEvent("arrowclick", _This, e);
				if (_This.arrowHandler)
				{
					_This.arrowHandler.call(_This.scope || _This, _This, e);
				}
			}, this);

			this.btnExportAll = new Ext.Toolbar.SplitButton(
			{
				text : "导出全部",
				iconCls : "xy-export",
				scope : this,
				menu :
				{
					items : [
					{
						text : "Excel",
						iconCls : "xy-excel",
						handler : function()
						{
							this.btn_ExportAllEvent("xlsx");
						},
						scope : this
					},
					{
						text : "PDF",
						iconCls : "xy-pdf",
						handler : function()
						{
							this.btn_ExportAllEvent("pdf");
						},
						scope : this
					} ]
				}
			});
			this.btnExportAll.on("click", function(_This, e)
			{
				if (_This.menu && !_This.menu.isVisible() && !_This.ignoreNextClick)
				{
					_This.showMenu();
				}
				_This.fireEvent("arrowclick", _This, e);
				if (_This.arrowHandler)
				{
					_This.arrowHandler.call(_This.scope || _This, _This, e);
				}
			}, this);

			this.tbar = [
			{
				text : "查询条件",
				iconCls : "xy-filter",
				handler : this.showQueryWindow,
				scope : this
			}, "-",
			this.btnExportPage, "-",
			this.btnExportAll, "-",
			{
				text : "刷新",
				iconCls : "xy-toolbar_refresh",
				handler : function()
				{
					this.btn_RefreshEvent();
				},
				scope : this
			} ];
		}
		else
		{
			this.btnExport = new Ext.Toolbar.SplitButton(
			{
				text : "导出",
				iconCls : "xy-export",
				scope : this,
				menu :
				{
					items : [
					{
						text : "Excel",
						iconCls : "xy-excel",
						handler : function()
						{
							this.btn_ExportAllEvent("xlsx");
						},
						scope : this
					},
					{
						text : "PDF",
						iconCls : "xy-pdf",
						handler : function()
						{
							this.btn_ExportAllEvent("pdf");
						},
						scope : this
					} ]
				}
			});
			this.btnExport.on("click", function(_This, e)
			{
				if (_This.menu && !_This.menu.isVisible() && !_This.ignoreNextClick)
				{
					_This.showMenu();
				}
				_This.fireEvent("arrowclick", _This, e);
				if (_This.arrowHandler)
				{
					_This.arrowHandler.call(_This.scope || _This, _This, e);
				}
			}, this);

			/**
			 * 非分页
			 */
			this.tbar = [
			{
				text : "查询条件",
				iconCls : "xy-filter",
				handler : this.showQueryWindow,
				scope : this
			}, "-",
			this.btnExport, "-",
			{
				text : "刷新",
				iconCls : "xy-toolbar_refresh",
				handler : function()
				{
					this.btn_RefreshEvent();
				},
				scope : this
			} ];
		}
	},
	/**
	 * 创建分页栏
	 */
	createPagingToolbar : function()
	{
		if (this.isPageMode())
		{
			/**
			 * 分页模式
			 */
			this.m_PageToolbar = new ssc.component.JRPagingToolbar(
			{
				pageSize : this.xy_Limit,
				url : "",
				load : this.queryReportData,
				scope : this
			});

			this.bbar = this.m_PageToolbar;
		}
	},
	/**
	 * 显示窗体
	 */
	showQueryWindow : function()
	{
		if (this.m_QueryWindow == null)
		{
			this.m_QueryWindow = new ssc.component.JRReportWindow(
			{
				xy_QueryPanel : this.xy_QueryPanel,
				width : this.xy_QueryWindowWidth,
				height : this.xy_QueryWindowHeight,
				xy_MainPanel : this
			});

			this.m_QueryWindow.show();
		}
		else
		{
			this.m_QueryWindow.show();
		}
	},
	/**
	 * 报表初次查询入口(不分页查询)
	 * @param jsonObj	查询参数对象
	 * @param reporturl	查询url
	 */
	QueryEvent : function(jsonObj, reporturl)
	{
		if(this.m_QueryWindow && this.m_QueryWindow.isVisible())
		{
			this.m_QueryWindow.hide();
		}
		
		if (reporturl[0] === "/")
		{
			reporturl = reporturl.substr(1);
		}

		this.m_Param = jsonObj;
		this.m_ReportUrl = reporturl + "/report";
		this.queryReportData("view", false, "html", 0, this.xy_Limit);
	},


	/**
	 * 报表初次查询入口(分页查询)
	 * @param jsonObj	查询参数对象
	 * @param reporturl	查询url
	 * @param counturl	查询counturl
	 */
	QueryPageEvent : function(jsonObj, reporturl)
	{
		if(this.m_QueryWindow && this.m_QueryWindow.isVisible())
		{
			this.m_QueryWindow.hide();
		}

		if (reporturl[0] === "/")
		{
			reporturl = reporturl.substr(1);
		}

		if (this.isPageMode())
		{
    		this.m_Param = jsonObj;
    		this.m_ReportUrl = reporturl + "/report";
    		this.m_ReportCountUrl = reporturl + "/count";

    		this.m_isFirstQuery = true;
			this.m_PageToolbar.url = this.m_ReportUrl;
			this.m_PageToolbar.baseParams = jsonObj;
			
			this.queryReportData("view", false, "html", 0, this.xy_Limit);
    	}
    	else
    	{
    		this.QueryEvent(jsonObj, reporturl);
    	}
	},
	/**
	 * 查询核心方法
	 * @opertype 操作类型	view为内嵌查询，export为导出/下载
	 * @target	false		内嵌查询
	 * 			"_blank"	下载
	 * @format	返回格式，内嵌查询为html，导出/下载为xls/xlsx/pdf等
	 * @start	分页参数
	 * @limit	分页参数
	 */
	queryReportData : function(opertype, target, format, start, limit)
	{
		this.m_ReportBulkID = GuidUtil.getNewID(10);

		var oForm = document.createElement("form");
		oForm.method = "post";
		oForm.action = this.m_ReportUrl;

		/**
		 * target默认嵌入页面展现，否则按target下载
		 */
		oForm.target = target ? target : "reportpanel";

		/**
		 * 准备查询参数
		 */
		for ( var prop in this.m_Param)
		{
			var oInput = document.createElement("input");
			oInput.name = prop;
			oInput.value = this.m_Param[prop];
			oForm.appendChild(oInput);
		}

		/**
		 * 查询批次ID
		 */
		var oInput = document.createElement("input");
		oInput.name = "opertype";
		oInput.value = opertype;
		oForm.appendChild(oInput);

		/**
		 * 查询批次ID
		 */
		var oInput = document.createElement("input");
		oInput.name = "reportbulkid";
		oInput.value = this.m_ReportBulkID;
		oForm.appendChild(oInput);

		/**
		 * 导出格式参数
		 */
		var oInput = document.createElement("input");
		oInput.name = "format";
		oInput.value = format;
		oForm.appendChild(oInput);

		/**
		 * 分页参数
		 */
		if (limit != undefined && limit != null && limit > 0)
		{
			var oInput = document.createElement("input");
			oInput.name = "start";
			oInput.value = start;
			oForm.appendChild(oInput);

			oInput = document.createElement("input");
			oInput.name = "limit";
			oInput.value = limit;
			oForm.appendChild(oInput);
		}

		document.body.appendChild(oForm);

		oForm.submit(this.loadMask());
	},
	loadMask : function()
	{
		var mask = new Ext.LoadMask(Ext.getBody(), Ext.apply(
		{
			store : null,
			msg : "正在查询数据，请稍候...",
			removeMask : true
		}));
		mask.show();
		var timer = setInterval(function()
		{
			var formIframe = document.getElementById("reportpanel");
			var innerBd = formIframe.contentWindow.document.body;
			if (innerBd != null && innerBd.getElementsByTagName("table").length != 0)
			{
				this.getReportCount();

				mask.hide();
				clearInterval(timer);
			}
		}.createDelegate(this), 500)
	},
	/**
	 * 获取总行数
	 */
	getReportCount : function()
	{
		if (! this.isPageMode())
		{
			return;
		}

		if (! this.m_isFirstQuery)
		{
			return;
		}

		Ext.Ajax.request(
		{
			url : this.m_ReportCountUrl,
			method : "post",
			params :
			{
				reportbulkid : this.m_ReportBulkID
			},
			sync : true,
			success : function(response)
			{
				var responseData = Ext.decode(response.responseText);
				if (responseData.success) 
				{
					var count = responseData.msg;

					this.m_PageToolbar.totalCount = count;
					this.m_PageToolbar.onLoad(0);
					this.m_isFirstQuery = false;
				}
				else
				{
					Ext.Msg.alert("错误", r.errDesc);
				}
			},
			failure : function()
			{
				Ext.Msg.alert("failure");
			},
			scope : this
		});
	},
	/**
	 * 刷新当前页面
	 * 按照默认条件重新查询
	 */
	btn_RefreshEvent : function()
	{
		if (this.m_Param == null)
		{
			return;
		}

		if (this.isPageMode())
		{
			var start = this.m_PageToolbar.cursor;
			this.queryReportData("view", false, "html", start, this.xy_Limit);
		}
		else
		{
			this.queryReportData("view", false, "html", 0, 0);
		}
		
	},
	/**
	 * 导出/下载当前页面
	 */
	btn_ExportPageEvent : function(format)
	{
		if (this.m_Param == null)
		{
			return;
		}

		var start = this.m_PageToolbar.cursor;
		this.queryReportData("export", "_blank", format, start, this.xy_Limit);
	},
	/**
	 * 导出/下载所有数据
	 */
	btn_ExportAllEvent : function(format)
	{
		if (this.m_Param == null)
		{
			return;
		}

		if (this.isPageMode())
		{
			var totalCount = this.m_PageToolbar.totalCount;

			if (this.xy_MaxLimit < totalCount)
			{
				if (this.abovelimitcallback)
				{
					var bo = this.abovelimitcallback.call(this.abovelimitcallbackscope, this.xy_MaxLimit, totalCount);
					if (!bo)
					{
						return;
					}
				}
				else
				{
					if (this.abovelimitconfirm)
					{
						Ext.Msg.confirm("提示", "总记录数超过" + this.xy_MaxLimit + "条的上限,数据量过大,是否继续?", function(btn)
						{
							if (btn == "yes")
							{
								if (this.m_Param == null)
								{
									return;
								}
								this.m_Param.format = format;
								this.queryReportData("export", "_blank", 0, totalCount);
							}
						}, this);
						return;
					}
					else
					{
						Ext.Msg.alert("提示", "总记录数超过" + this.xy_MaxLimit + "条的上限,数据量过大,不提供全部导出或打印!");
						return;
					}
				}
			}
			else
			{
				this.queryReportData("export", "_blank", format, 0, this.xy_MaxLimit);
			}
		}
		else
		{
			this.queryReportData("export", "_blank", format, 0, this.xy_MaxLimit);
		}
	}
});
Ext.reg("reportmainpanel", ssc.component.JRReportMainPanel);