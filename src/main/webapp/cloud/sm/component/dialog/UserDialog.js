Ext.namespace("sm.component");

/**
 * 用户选择
 * 全部用户
 */
sm.component.UserBaseDialog = Ext.extend(ssc.component.BaseListDialog,
{
	/* 默认值 */
	title : "用户选择",
	width : 500,
	height : 350,
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
	} ]
});
Ext.reg("sm.component.userbasedialog", sm.component.UserBaseDialog);

/**
 * 分单位选择用户
 */
sm.component.UserUnitDialog = Ext.extend(sm.component.UserBaseDialog,
{
	title : "用户选择",
	xy_InitLoadData : false,
	xy_DataActionURL : "sm/user/list",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	initComponent : function()
	{
		this.cmbUnit = new sm.component.UnitTreeComboBox(
		{
			width : 200,
			emptyText : "不选即全部单位"
		});
		this.edtName = new Ext.form.TextField(
		{
			width : 150,
			emptyText : "请输入姓名或登录名"
		});
		this.tbar = new Ext.Toolbar(
		{
			items : [ "单位：", this.cmbUnit, "-", "姓名：", this.edtName, "-",
			{
				text : "查询",
				iconCls : "xy-view-select",
				handler : this.btn_QueryEvent,
				scope : this
			}, "-" ]
		});
		sm.component.UserUnitDialog.superclass.initComponent.call(this);
	},
	btn_QueryEvent : function()
	{
		var condition = new ssc.common.BaseCondition();

		if (this.cmbUnit.getSelected())
		{
			condition.addString("unitid", this.cmbUnit.getKeyValue());
		}

		if (this.edtName.getValue().trim().length > 0)
		{
			condition.addString("usertext", this.edtName.getValue().trim());
		}

		this.xy_BaseParams = condition;

		this.loadStoreData(true);
	}
});
Ext.reg("sm.component.userunitdialog", sm.component.UserUnitDialog);

/**
 * 未设置用户组的用户选择
 * condition:
 * xy_BaseParams.teamid
 */
sm.component.TPTeamUnSetUserDialog = Ext.extend(sm.component.UserBaseDialog,
{
	title : "组员选择",
	xy_InitLoadData : false,
	xy_DataActionURL : "SSC/ssc_TeamUserAction!getPageUnSetTeam.action",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	initComponent : function()
	{
		this.cmbUnit = new sm.component.UnitTreeComboBox(
		{
			width : 200,
			emptyText : "不选即全部单位"
		});
		this.edtName = new Ext.form.TextField(
		{
			width : 150,
			emptyText : "请输入姓名或登录名"
		});
		this.tbar = new Ext.Toolbar(
		{
			items : [ "单位：", this.cmbUnit, "-", "姓名：", this.edtName, "-",
			{
				text : "查询",
				iconCls : "xy-view-select",
				handler : this.btn_QueryEvent,
				scope : this
			}, "-" ]
		});
		sm.component.TPTeamUnSetUserDialog.superclass.initComponent.call(this);
	},
	btn_QueryEvent : function()
	{
		var condition = new ssc.common.BaseCondition();
		condition.addString("teamid", this.xy_BaseParams.teamid);

		if (this.cmbUnit.getSelected())
		{
			condition.addString("unitid", this.cmbUnit.getKeyValue());
		}

		if (this.edtName.getValue().trim().length > 0)
		{
			condition.addString("usertext", this.edtName.getValue().trim());
		}

		this.xy_BaseParams = condition;

		this.loadStoreData(true);
	}
});
Ext.reg("sm.component.tpteamunsetuserdialog", sm.component.TPTeamUnSetUserDialog);

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
sm.component.UserTPTeamAgentDialog = Ext.extend(sm.component.UserBaseDialog,
{
	title : "选择代理人",
	xy_InitLoadData : false,
	xy_DataActionURL : "SSC/ssc_TeamUserAction!getPageAgent.action",
	xy_PageMode : true,
	xy_MultiSelectMode : false,
	initComponent : function()
	{
		this.cmbUnit = new sm.component.UnitTreeComboBox(
		{
			width : 200,
			emptyText : "不选即全部单位"
		});
		this.edtName = new Ext.form.TextField(
		{
			width : 150,
			emptyText : "请输入姓名或登录名"
		});
		this.tbar = new Ext.Toolbar(
		{
			items : [ "单位：", this.cmbUnit, "-", "姓名：", this.edtName, "-",
			{
				text : "查询",
				iconCls : "xy-view-select",
				handler : this.btn_QueryEvent,
				scope : this
			}, "-" ]
		});
		sm.component.TPTeamUnSetUserDialog.superclass.initComponent.call(this);
	},
	btn_QueryEvent : function()
	{
		var condition = new ssc.common.BaseCondition();
		condition.addString("userid", this.xy_BaseParams.userid);
		condition.addString("teamid", this.xy_BaseParams.teamid);

		if (this.cmbUnit.getSelected())
		{
			condition.addString("unitid", this.cmbUnit.getKeyValue());
		}

		if (this.edtName.getValue().trim().length > 0)
		{
			condition.addString("usertext", this.edtName.getValue().trim());
		}

		this.xy_BaseParams = condition;

		this.loadStoreData(true);
	}
});
Ext.reg("sm.component.usertpteamagentdialog", sm.component.UserTPTeamAgentDialog);