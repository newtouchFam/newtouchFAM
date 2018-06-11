Ext.namespace("sm.component");

/**
 * 公司field组件
 * @param
 * 	jsonCondition:
 * 		unitCode	公司编码，支持模糊匹配
 * 		unitName	公司名称，支持模糊匹配
 * 		unittext	公司编码或名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
sm.component.UnitListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "单位",
	emptyText : "请选择单位...",
	xy_WinTitle : "选择单位",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "sm/unit/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "unitid",
	xy_DisplayField : "unitname",
	xy_FieldList : [ "unitid", "unitcode", "unitname",
	                 "fullcode", "fullname",
	                 "parentid", "status", "isleaf", "level",
	                 "formattedcode", "formattedname" ],
	xy_ColumnConfig : [
	{
		header : "编码",
		dataIndex : "unitcode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "名称",
		dataIndex : "unitname",
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
		header : "是否末级",
		dataIndex : "isleaf",
		width : 50,
		renderer : ssc.common.RenderUtil.YesOrNo_FocusYes
	},
	{
		header : "级别",
		dataIndex : "level",
		width : 50
	},
	{
		header : "全编码",
		dataIndex : "fullcode",
		width : 150
	},
	{
		header : "全名称",
		dataIndex : "fullname",
		width : 150
	} ],
	getUnitID : function()
	{
		return this.getSelectedID();
	},
	getUnitCode : function()
	{
		return this.getSelectedAttr("unitcode");
	},
	getUnitName : function()
	{
		return this.getSelectedAttr("unitname");
	}
});
Ext.reg("sm.component.unitlistfield", sm.component.UnitListField);

/**
 * 权限公司field组件
 * @param
 * 	jsonCondition:
 * 		operationcode	操作权限编码
 * 		unitCode	公司编码，支持模糊匹配
 * 		unitName	公司名称，支持模糊匹配
 * 		unittext	公司编码或名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
sm.component.UnitPermissionListField = Ext.extend(sm.component.UnitListField,
{
	xy_DataActionURL : "sm/unit!getUnitListByPermission.action",
	prepareBaseParams : function()
	{
		var condition = new ssc.common.BaseCondition();
		condition.addInteger("status", this.status);
		condition.addString("unitcode", this.unitCode);
		condition.addString("unitname", this.unitName);
		condition.addString("operationcode", this.operationcode);

		return condition;
	}
});
Ext.reg("sm.component.unitlistpermissionfield", sm.component.UnitPermissionListField);

/**
 * 公司field组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		textfield	显示字段，格式"[,unitcode,],unitname"
 */
sm.component.UnitTreeField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "单位",
	emptyText : "请选择单位...",
	xy_WinTitle : "选择单位",
	xy_WinWidth : 400,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "sm/unit/tree",
	xy_RootTitle : "选择单位",
	xy_LeafOnly : false,
	xy_MultiSelectMode : false,
	getUnitID : function()
	{
		return this.getSelectedID();
	},
	getUnitCode : function()
	{
		return this.getSelectedAttr("unitcode");
	},
	getUnitName : function()
	{
		return this.getSelectedAttr("unitname");
	}
});
Ext.reg("sm.component.unittreefield", sm.component.UnitTreeField);