Ext.namespace("sm.component");

/**
 * 部门下拉框组件
 * @param
 * 	jsonCondition:
 * 		unitid		所属公司ID，支持多个，格式：id1, id2, id3
 * 		deptcode	部门编码，支持模糊匹配
 * 		deptname	部门名称，支持模糊匹配
 * 		depttext	部门编码或名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
sm.component.DeptListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "选择部门",
	width : 200,
	xy_AllowClear : true,
	xy_DataActionURL : "sm/dept/list",
	valueField : "deptid",
	displayField : "deptname",
	xy_StoreFields : [ "deptid", "deptcode", "deptname",
	                   "parentid", "parentcode", "parentname",
	                   "unitid", "unitcode", "unitname",
	                   "status", "isleaf", "level",
	                   "fullcode", "fullname", "formattedcode", "formattedname" ],
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
Ext.reg("sm.component.deptlistcombobox", sm.component.DeptListComboBox);

/**
 * 部门下拉框组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		unitid		所属公司ID，支持多个，格式：id1, id2, id3
 * 		textfield	显示字段，格式"[,deptCode,],deptName"
 */
sm.component.DeptTreeComboBox = Ext.extend(ssc.component.BaseTreeComboBox,
{
	fieldLabel : "选择部门",
	emptyText : "请选择部门...",
	width : 200,
	listWidth : 350,
	xy_RootTitle : "选择部门",
	xy_AllowClear : true,
	xy_DataActionURL : "sm/dept/tree",
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
Ext.reg("sm.component.depttreecombobox", sm.component.DeptTreeComboBox);