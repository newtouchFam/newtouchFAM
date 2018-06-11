Ext.namespace("ssc.component");

ssc.component.ReportWindow = Ext.extend(Ext.Window,
{
	layout : "fit",
	title : "过滤条件",
	closeAction : "hide",
	modal : true,
	xy_QueryPanel : null,
	xy_MainPanel : null,
	initComponent : function()
	{
		this.panel = new this.xy_QueryPanel(
		{
			xy_MainPanel : this.xy_MainPanel
		});

		Ext.apply(this,
		{
			items : this.panel,
			buttons : [
			{
				text : "确定",
				handler : this.panel.query,
				scope : this.panel
			},
			{
				text : "取消",
				handler : function()
				{
					this.hide();
				},
				scope : this
			} ]
		});

		ssc.component.ReportWindow.superclass.initComponent.call(this);
	}
});


/**
 * this.xy_Limit 分页数量
 * this.xy_MaxLimit 导出上限
 * this.abovelimitcallback 超出导出上限时的回调函数,调用后返回true则继续导出
 * this.abovelimitconfirm 超过导出上限给出提示,但允许继续导出
 */
ssc.component.ReportMainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	xy_QueryPanel : null,
	xy_QueryWindowWidth : 400,
	xy_QueryWindowHeight : 300,
	xy_Limit : null,
	xy_MaxLimit : 2000,
	initComponent : function()
	{
		if (this.xy_Limit)
		{
			this.pageToolbar = new Ext.PagingToolbarEx(
			{
				pageSize : this.xy_Limit,
				url : "",
				load : this.postByPage,
				scope : this
			});

			this.bbar = this.pageToolbar;

			this.tbar = [
			{
				text : "查询条件",
				iconCls : "xy-filter",
				handler : this.showQueryWindow,
				scope : this
			}, "-",
			{
				text : "导出当前页为EXCEL",
				iconCls : "xy-export",
				handler : function()
				{
					this.query("XLSX");
				},
				scope : this
			}, "-",
			{
				text : "导出全部为EXCEL",
				iconCls : "xy-export",
				handler : function()
				{
					this.queryAll("XLSX");
				},
				scope : this
			}, "-",
			{
				text : "刷新",
				iconCls : "xy-toolbar_refresh",
				handler : function()
				{
					this.query("HTML");
				},
				scope : this
			} ];
		}
		else
		{
			this.tbar = [
			{
				text : "查询条件",
				iconCls : "xy-filter",
				handler : this.showQueryWindow,
				scope : this
			}, "-",
			{
				text : "导出为EXCEL",
				iconCls : "xy-export",
				handler : function()
				{
					this.queryAll("XLSX");
				},
				scope : this
			}, "-",
			{
				text : "刷新",
				iconCls : "xy-toolbar_refresh",
				handler : function()
				{
					this.queryAll("HTML");
				},
				scope : this
			} ];
		}
			
		Ext.apply(this,
		{
			html : "<iframe name='reportpanel' id='reportpanel' width='100%' height='100%'  frameborder='0'></iframe>"
		});
		
		if(this.xy_QueryPanel)
		{
			this.showQueryWindow();
		}
		
		ssc.component.ReportMainPanel.superclass.initComponent.call(this);
	},
	postByPage : function(target, start, limit)
	{
		limit = this.xy_Limit;
		var oForm = document.createElement("form");
		oForm.method = "post";
		oForm.action = this.reporturl;
		oForm.target = target ? target : "reportpanel";
		
		if (oForm.target == "reportpanel")
		{
			this.jso.format = "HTML";
		}
		
		var jsonObj = this.jso;
		for ( var prop in jsonObj)
		{
			var oInput = document.createElement("input");
			oInput.name = prop;
			oInput.value = jsonObj[prop];
			oForm.appendChild(oInput);
		}

		if (limit)
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
		oForm.submit();
	},
	count : function(jsonObj, counturl, callback, scope)
	{
    	if(this.xy_Limit)
    	{
			var params={};
			this.countjso=jsonObj;
			this.counturl=counturl;
			for (var prop in this.countjso)
			{
			  params[prop]=this.countjso[prop];
			}
			this.pageToolbar.url=this.counturl;
			this.pageToolbar.baseParams=params;
			this.pageToolbar.count(callback,scope);
    	}
    	else
    	{
			callback.call(scope);
    	}
	},
	showQueryWindow : function()
	{
		if(! this.queryWindow)
		{
			this.queryWindow = new ssc.component.ReportWindow(
			{
				xy_QueryPanel : this.xy_QueryPanel,
				width : this.xy_QueryWindowWidth,
				height : this.xy_QueryWindowHeight,
				xy_MainPanel : this
			});

			this.queryWindow.show();	
		}
		else
		{
			this.queryWindow.show();	
		}
	},
	QueryEvent : function(jsonObj, reporturl)
	{
		if(this.queryWindow&&this.queryWindow.isVisible())
		{
			this.queryWindow.hide();
		}
		
		this.jso = jsonObj;
		this.reporturl = reporturl;
		this.postByPage(false, 0, this.xy_Limit);
	},
	queryAll : function(format)
	{
		if (this.xy_Limit)
		{
			var totalCount = this.pageToolbar.totalCount;

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
								if (!this.jso)
								{
									return;
								}
								this.jso.format = format;
								this.postByPage(format == "HTML" ? false : "_blank", 0, totalCount);
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
		}

		if (!this.jso)
		{
			return;
		}

		this.jso.format = format;
		this.postByPage(format == "HTML" ? false : "_blank", 0, totalCount);
	},
	query : function(format)
	{
		if(!this.jso)
		{
			return;
		}
		this.jso.format=format;

		var start=this.pageToolbar.cursor;
		var totalCount=this.pageToolbar.totalCount;
		this.postByPage(format=="HTML"?false:"_blank",start,(totalCount<(start+this.xy_Limit))?totalCount:(start+this.xy_Limit));
	}
});
Ext.reg("reportmainpanel", ssc.component.ReportMainPanel);