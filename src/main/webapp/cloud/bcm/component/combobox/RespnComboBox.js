Ext.namespace("bcm.component");

/**
 * 责任中心下拉框组件
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
bcm.component.RespnListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "责任中心",
	emptyText : "请选择责任中心...",
	width : 200,
	xy_AllowClear : true,
	xy_DataActionURL : "bcm/respn/list",
	valueField : "respnID",
	displayField : "respnName",
	xy_StoreFields : [ "respnID", "respnCode", "respnName",
	                 "level", "isLeaf", "fullCode", "fullName",
	                 "status", "remark",
	                 "caseCode", "caseName",
	                 "unitID", "unitCode", "unitName",
	                 "parentID", "parentCode", "parentName",
	                 "respnTypeID", "respnTypeCode", "respnTypeName" ],
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
Ext.reg("bcm.component.respnlistcombobox", bcm.component.RespnListComboBox);

/**
 * 责任中心下拉框组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		casecode	预算方案编码
 * 		year		预算年份
 * 		unitid		所属公司ID，支持多个，格式：id1, id2, id3
 * 		textfield	显示字段，格式"[,indexCode,],indexName"
 */
bcm.component.RespnTreeComboBox = Ext.extend(ssc.component.BaseTreeComboBox,
{
	fieldLabel : "责任中心",
	emptyText : "请选择责任中心...",
	width : 200,
	listWidth : 350,
	xy_RootTitle : "责任中心",
	xy_AllowClear : true,
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
Ext.reg("bcm.component.respntreecombobox", bcm.component.RespnTreeComboBox);
