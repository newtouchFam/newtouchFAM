Ext.namespace("bcm.component");

/**
 * 责任中心field组件
 * @param
 * 	jsonCondition:
 * 		casecode	预算方案编码
 * 		year		预算年份
 * 		unitid		所属公司ID，支持多个，格式：id1, id2, id3
 * 		respncode	责任中心编码，支持模糊匹配
 * 		respnname	责任中心名称，支持模糊匹配
 * 		respntext	责任中心编码或名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
bcm.component.RespnListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "责任中心",
	emptyText : "请选择责任中心...",
	xy_WinTitle : "责任中心",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "bcm/respn/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "respnID",
	xy_DisplayField : "respnName",
	xy_FieldList : [ "respnID", "respnCode", "respnName",
	                 "level", "isLeaf", "fullCode", "fullName",
	                 "status", "remark",
	                 "caseCode", "caseName",
	                 "unitID", "unitCode", "unitName",
	                 "parentID", "parentCode", "parentName",
	                 "respnTypeID", "respnTypeCode", "respnTypeName" ],
	xy_ColumnConfig : [
	{
		header : "责任中心编码",
		dataIndex : "respnCode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "责任中心名称",
		dataIndex : "respnName",
		width : 150,
		xy_DefaultSearched : true
	},
	{
		header : "状态",
		dataIndex : "status",
		width : 50,
		renderer : ssc.common.RenderUtil.EnableStatus_Color
	},
	{
		header : "所属单位编码",
		dataIndex : "unitCode",
		width : 150
	},
	{
		header : "所属单位名称",
		dataIndex : "unitName",
		width : 150
	} ],
	getRespnID : function()
	{
		return this.getSelectedID();
	},
	getRespnCode : function()
	{
		return this.getSelectedAttr("respnCode");
	},
	getRespnName : function()
	{
		return this.getSelectedAttr("respnName");
	},
	getCaseCode : function()
	{
		return this.getSelectedAttr("caseCode");
	},
	getCaseName : function()
	{
		return this.getSelectedAttr("caseName");
	},
	getUnit : function()
	{
		var unit =
		{
			keyfield : "unitID",
			displayfield : "unitName",
			unitID : this.getUnitID(),
			unitCode : this.getUnitCode(),
			unitName : this.getUnitName()
		};

		return unit;
	},
	getUnitID : function()
	{
		return this.getSelectedAttr("unitID");
	},
	getUnitCode : function()
	{
		return this.getSelectedAttr("unitCode");
	},
	getUnitName : function()
	{
		return this.getSelectedAttr("unitName");
	}
});
Ext.reg("bcm.component.respnlistfield", bcm.component.RespnListField);

/**
 * 责任中心field组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		casecode	预算方案编码
 * 		year		预算年份
 * 		unitid		所属公司ID，支持多个，格式：id1, id2, id3
 * 		textfield	显示字段，格式"[,indexCode,],indexName"
 */
bcm.component.RespnTreeField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "责任中心",
	emptyText : "请选择责任中心...",
	xy_WinTitle : "责任中心",
	xy_RootTitle : "责任中心",
	xy_LeafOnly : false,
	xy_DataActionURL : "bcm/respn/tree",
	getRespnID : function()
	{
		return this.getSelectedID();
	},
	getRespnCode : function()
	{
		return this.getSelectedAttr("respnCode");
	},
	getRespnName : function()
	{
		return this.getSelectedAttr("respnName");
	},
	getCaseCode : function()
	{
		return this.getSelectedAttr("caseCode");
	},
	getCaseName : function()
	{
		return this.getSelectedAttr("caseName");
	},
	getUnit : function()
	{
		var unit =
		{
			keyfield : "unitID",
			displayfield : "unitName",
			unitID : this.getUnitID(),
			unitCode : this.getUnitCode(),
			unitName : this.getUnitName()
		};

		return unit;
	},
	getUnitID : function()
	{
		return this.getSelectedAttr("unitID");
	},
	getUnitCode : function()
	{
		return this.getSelectedAttr("unitCode");
	},
	getUnitName : function()
	{
		return this.getSelectedAttr("unitName");
	}
});
Ext.reg("bcm.component.respntreefield", bcm.component.RespnTreeField);

/**
 * 责任中心field组件(树)，可关联下级
 * @param
 * 	root
 * 	jsonCondition:
 * 		casecode	预算方案编码
 * 		year		预算年份
 * 		unitid		所属公司ID，支持多个，格式：id1, id2, id3
 * 		textfield	显示字段，格式"[,indexCode,],indexName"
 */
bcm.component.RespnTreeLinkField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "责任中心",
	emptyText : "请选择责任中心...",
	xy_WinTitle : "责任中心",
	xy_RootTitle : "责任中心",
	xy_LeafOnly : false,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "bcm/respn/tree",
	/**
	 * @override ssc.component.BaseListField.createDialog
	 */
	createDialog : function()
	{
		this.m_Dialog = new bcm.component.RespnTreeDialogLink(
		{
			title : this.xy_WinTitle,
			width : this.xy_WinWidth,
			height : this.xy_WinHeight,
			closeAction : "hide",

			xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
			xy_ButtonStyle : this.xy_ButtonStyle,
			xy_EditMode : ssc.component.DialogEditModeEnum.None,
			xy_RootTitle : this.xy_RootTitle,
			xy_LeafOnly : this.xy_LeafOnly,
			xy_MultiSelectMode : this.xy_MultiSelectMode,
			xy_ShowContextMenu : this.xy_ShowContextMenu,
			xy_ClickSelectMode : this.xy_ClickSelectMode,

			xy_DataActionURL : this.xy_DataActionURL,
			xy_SQLPath : this.xy_SQLPath,
			xy_SQLFile : this.xy_SQLFile,
			xy_SQLFile2 : this.xy_SQLFile2,
			xy_ProcFile : this.xy_ProcFile,
			xy_BaseParams : this.xy_BaseParams,
			xy_ParamJsonSerialize : this.xy_ParamJsonSerialize,
			prepareBaseParams : ((this.prepareBaseParams !== undefined) ? this.prepareBaseParams.createDelegate(this) : undefined),

			xy_InitDataID : this.xy_InitDataID,
			xy_InitExpand : this.xy_InitExpand,
			xy_InitExpandAll : this.xy_InitExpandAll,
			xy_InitExpandLevel : this.xy_InitExpandLevel,

			xy_ParentObjHandle : this.xy_ParentObjHandle,
			xy_OKClickEvent : this.xy_OKClickEvent
		});
	},
	getRespnID : function()
	{
		return this.getSelectedID();
	},
	getRespnCode : function()
	{
		return this.getSelectedAttr("respnCode");
	},
	getRespnName : function()
	{
		return this.getSelectedAttr("respnName");
	},
	getCaseCode : function()
	{
		return this.getSelectedAttr("caseCode");
	},
	getCaseName : function()
	{
		return this.getSelectedAttr("caseName");
	},
	getUnit : function()
	{
		var unit =
		{
			keyfield : "unitID",
			displayfield : "unitName",
			unitID : this.getUnitID(),
			unitCode : this.getUnitCode(),
			unitName : this.getUnitName()
		};

		return unit;
	},
	getUnitID : function()
	{
		return this.getSelectedAttr("unitID");
	},
	getUnitCode : function()
	{
		return this.getSelectedAttr("unitCode");
	},
	getUnitName : function()
	{
		return this.getSelectedAttr("unitName");
	}
});
Ext.reg("bcm.component.respntreelinkfield", bcm.component.RespnTreeLinkField);