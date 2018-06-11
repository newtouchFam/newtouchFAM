Ext.namespace("sm.component");

/**
 * 用户下拉框组件
 * @param
 * 	jsonCondition:
 * 		unitid		所属公司ID，支持多个，格式：id1, id2, id3
 * 		deptid		所属部门ID，支持多个，格式：id1, id2, id3
 * 		usercode	用户登录名，支持模糊匹配
 * 		username	用户姓名，支持模糊匹配
 * 		usertext	用户登录名或姓名，支持模糊匹配
 * 		status		状态
 */
sm.component.UserListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "用户",
	width : 200,
	xy_AllowClear : true,
	xy_DataActionURL : "sm/user/list",
	valueField : "userid",
	displayField : "username",
	xy_StoreFields : [ "userid", "usercode", "username",
  	                 "unitid", "unitcode", "unitname",
	                 "deptid", "deptcode", "deptname", "status" ],
 	getUserID : function()
	{
		return this.getSelectedID();
	},
	getUserCode : function()
	{
		return this.getSelectedAttr("usercode");
	},
	getUserName : function()
	{
		return this.getSelectedAttr("username");
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
	},
	getDept : function()
	{
		var dept =
		{
			keyfield : "deptid",
			displayfield : "deptname",
			deptid : this.getDeptID(),
			deptcode : this.getDeptCode(),
			deptname : this.getDeptName()
		};

		return dept;
	},
	getDeptID : function()
	{
		return this.getSelectedAttr("deptid");
	},
	getDeptCode : function()
	{
		return this.getSelectedAttr("deptcode");
	},
	getDeptName : function()
	{
		return this.getSelectedAttr("deptname");
	}
});
Ext.reg("sm.component.userlistcombobox", sm.component.UserListComboBox);