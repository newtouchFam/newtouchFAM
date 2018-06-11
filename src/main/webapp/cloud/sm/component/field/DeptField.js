Ext.namespace("sm.component");

/**
 * 部门field组件
 * @param
 * 	jsonCondition:
 * 		unitid		所属公司ID，支持多个，格式：id1, id2, id3
 * 		deptcode	部门编码，支持模糊匹配
 * 		deptname	部门名称，支持模糊匹配
 * 		depttext	部门编码或名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
sm.component.DeptListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "部门",
	emptyText : "请选择部门...",
	xy_WinTitle : "选择部门",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "sm/dept/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "deptid",
	xy_DisplayField : "deptname",
	xy_FieldList : [ "deptid", "deptcode", "deptname",
	                 "parentid", "parentcode", "parentname",
	                 "unitid", "unitcode", "unitname",
	                 "status", "isleaf", "level",
	                 "fullcode", "fullname", "formattedcode", "formattedname" ],
	xy_ColumnConfig : [
	{
		header : "编码",
		dataIndex : "deptcode",
		width : 80,
		xy_Searched : true
	},
	{
		header : "名称",
		dataIndex : "deptname",
		width : 150,
		xy_DefaultSearched : true
	},
	{
		header : "单位",
		dataIndex : "unitname",
		width : 120
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
	getDeptID : function()
	{
		return this.getSelectedID();
	},
	getDeptCode : function()
	{
		return this.getSelectedAttr("deptcode");
	},
	getDeptName : function()
	{
		return this.getSelectedAttr("deptname");
	},
	getUnit : function()
	{
		var unit =
		{
			keyfield : "unitid",
			displayfield : "unitname",
			unitid : this.getUnitID(),
			unitcode : this.getUnitCode(),
			unitname : this.getUnitName()
		};

		return unit;
	},
	getUnitID : function()
	{
		return this.getSelectedAttr("unitid");
	},
	getUnitCode : function()
	{
		return this.getSelectedAttr("unitcode");
	},
	getUnitName : function()
	{
		return this.getSelectedAttr("unitName");
	}
});
Ext.reg("sm.component.deptlistfield", sm.component.DeptListField);

/**
 * 部门field组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		unitid		所属公司ID，支持多个，格式：id1, id2, id3
 * 		textfield	显示字段，格式"[,deptcode,],deptname"
 */
sm.component.DeptTreeField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "部门",
	emptyText : "请选择部门...",
	xy_WinTitle : "选择部门",
	xy_WinWidth : 400,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "sm/dept/tree",
	xy_RootTitle : "选择部门",
	xy_LeafOnly : false,
	xy_MultiSelectMode : false,
	getDeptID : function()
	{
		return this.getSelectedID();
	},
	getDeptCode : function()
	{
		return this.getSelectedAttr("deptcode");
	},
	getDeptName : function()
	{
		return this.getSelectedAttr("deptname");
	},
	getUnit : function()
	{
		var unit =
		{
			keyfield : "unitid",
			displayfield : "unitname",
			unitid : this.getUnitID(),
			unitcode : this.getUnitCode(),
			unitname : this.getUnitName()
		};

		return unit;
	},
	getUnitID : function()
	{
		return this.getSelectedAttr("unitid");
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
Ext.reg("sm.component.depttreetgfield", sm.component.DeptTreeField);

/**
 * 切换公司的部门field组件
 * @param
 * xy_UnitID	默认单位ID,
 * xy_UnitText 	默认单位名称
 */
sm.component.DeptTreeByUnitField = Ext.extend(ssc.component.BaseTreeField,
{
	fieldLabel : "部门",
	emptyText : "请选择...",
	/* 默认单位ID */
	xy_UnitID : "",
	/* 默认单位名称 */
	xy_UnitText : "",
	/**
	 * @override ssc.component.BaseTreeField.createDialog
	 */
	createDialog : function()
	{
		this.m_Dialog = new sm.component.DeptTreeByUnitDialog(
		{
			closeAction : "hide",
			xy_UnitID : this.xy_UnitID,
			xy_UnitText : this.xy_UnitText,
			xy_ParentObjHandle : this.xy_ParentObjHandle,
			xy_OKClickEvent : this.xy_OKClickEvent,
			xy_LeafOnly : this.xy_LeafOnly,
			xy_MultiSelectMode : this.xy_MultiSelectMode
		});
	},
	getDeptID : function()
	{
		return this.getSelectedID();
	},
	getDeptCode : function()
	{
		return this.getSelectedAttr("deptcode");
	},
	getDeptName : function()
	{
		return this.getSelectedAttr("deptname");
	},
	getUnit : function()
	{
		var unit =
		{
			keyfield : "unitid",
			displayfield : "unitname",
			unitid : this.getUnitID(),
			unitcode : this.getUnitCode(),
			unitname : this.getUnitName()
		};

		return unit;
	},
	getUnitID : function()
	{
		return this.getSelectedAttr("unitid");
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
Ext.reg("sm.component.depttreebyunitfield", sm.component.DeptTreeByUnitField);