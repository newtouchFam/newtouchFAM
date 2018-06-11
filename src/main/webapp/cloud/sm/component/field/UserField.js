Ext.namespace("sm.component");

/**
 * 用户field组件
 * @param
 * 	jsonCondition:
 * 		unitid		所属公司ID，支持多个，格式：id1, id2, id3
 * 		deptid		所属部门ID，支持多个，格式：id1, id2, id3
 * 		usercode	用户登录名，支持模糊匹配
 * 		username	用户姓名，支持模糊匹配
 * 		usertext	用户登录名或姓名，支持模糊匹配
 * 		status		状态
 */
sm.component.UserListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "用户",
	emptyText : "请选择...",
	xy_WinTitle : "选择用户",
	xy_WinWidth : 500,
	xy_WinHeight : 300,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "sm/user/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "userid",
	xy_DisplayField : "username",
	xy_FieldList : [ "userid", "usercode", "username",
	                 "unitid", "unitcode", "unitname",
	                 "deptid", "deptcode", "deptname", "status" ],
 	xy_ColumnConfig : [
  	{
  		header : "姓名",
  		dataIndex : "username",
  		width : 80
  	},
  	{
  		header : "登录名",
  		dataIndex : "usercode",
  		width : 70
  	},
  	{
  		header : "单位",
  		dataIndex : "unitname",
  		width : 150
  	},
  	{
  		header : "部门",
  		dataIndex : "deptname",
  		width : 120
  	} ],
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
Ext.reg("sm.component.userlistfield", sm.component.UserListField);


/**
 * 切换公司的用户field组件
 */
sm.component.UserListUnitField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "用户",
	emptyText : "请选择...",
	/**
	 * @override ssc.component.BaseListField.createDialog
	 */
	createDialog : function()
	{
		this.m_Dialog = new sm.component.UserUnitDialog(
		{
			closeAction : "hide",
			xy_PageMode : this.xy_PageMode,
			xy_MultiSelectMode : this.xy_MultiSelectMode,
			xy_ParentObjHandle : this.xy_ParentObjHandle,
			xy_OKClickEvent : this.xy_OKClickEvent,
			xy_BaseParams : this.xy_BaseParams,
			prepareBaseParams : this.prepareBaseParams
		});
	},
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
Ext.reg("sm.component.userlistunitfield", sm.component.UserListUnitField);

/**
 * 代理用户选择
 * condition:
 * 必填
 * xy_BaseParams.userid
 * xy_BaseParams.teamid
 * 可填
 * xy_BaseParams.unitid
 * xy_BaseParams.username
 */
sm.component.UserTPTeamAgentField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "代理人",
	emptyText : "请选择...",
	/**
	 * @override ssc.component.BaseListField.createDialog
	 */
	createDialog : function()
	{
		this.m_Dialog = new sm.component.UserTPTeamAgentDialog(
		{
			closeAction : "hide",
			xy_ParentObjHandle : this.xy_ParentObjHandle,
			xy_OKClickEvent : this.xy_OKClickEvent,
			xy_BaseParams : this.xy_BaseParams,
			prepareBaseParams : this.prepareBaseParams
		});
	}
});
Ext.reg("sm.component.usertpteamagentfield", sm.component.UserTPTeamAgentField);

/**
 * 组员列表
 */
sm.component.TeamMemberListField = Ext.extend(ssc.component.BaseListField,
{
	fieldLabel : "组员选择",
	emptyText : "请选择...",
	xy_WinTitle : "组员选择",
	xy_WinWidth : 500,
	xy_WinHeight : 350,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_DataActionURL : "SSC/ssc_TeamUserAction!getPageTeamMember.action",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	xy_KeyField : "userid",
	xy_DisplayField : "username",
	xy_FieldList : [ "userid", "usercode", "username",
	                 "unitid", "unitcode", "unitname",
	                 "deptid", "deptcode", "deptname", "status" ],
	xy_ColumnConfig : [
	{
		header : "姓名",
		dataIndex : "username",
		width : 80
	},
	{
		header : "登录名",
		dataIndex : "usercode",
		width : 70
	},
	{
		header : "单位",
		dataIndex : "unitname",
		width : 150
	},
	{
		header : "部门",
		dataIndex : "deptname",
		width : 120
	} ]
});
Ext.reg("sm.component.teammemberlistfield", sm.component.TeamMemberListField);