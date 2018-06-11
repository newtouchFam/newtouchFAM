Ext.namespace("sm.component");

/**
 * 单位列表选择对话框
 * 全部单位
 * 查询参数：
 * status、unitCode、unitName
 */
sm.component.UnitListDialog = Ext.extend(ssc.component.BaseListDialog,
{
	/**
	 * 默认值
	 */
	title : "单位选择",
	width : 500,
	height : 300,
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
		xy_Searched : true
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
	prepareBaseParams : function()
	{
		var condition = new ssc.common.BaseCondition();
		condition.addInteger("status", this.status);
		condition.addString("unitcode", this.unitCode);
		condition.addString("unitname", this.unitName);

		return condition;
	}
});
Ext.reg("sm.component.unitlistdialog", sm.component.UnitListDialog);

/**
 * 带权限的单位
 * 查询参数：
 * status、unitCode、unitName
 * operationcode权限编码
 */
sm.component.UnitPermissionListDialog = Ext.extend(sm.component.UnitListDialog,
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
Ext.reg("sm.component.unitpermissionlistdialog", sm.component.UnitPermissionListDialog);