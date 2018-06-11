Ext.namespace("wf.component");

wf.component.ApproveUserDialog = Ext.extend(ssc.component.BaseListDialog,
{
	title : "请选择要提交的人",
	height : 320,
	width : 600,
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.ToolBar,
	xy_EditMode : ssc.component.DialogEditModeEnum.None,
/*	xy_DataActionURL : "wf/ssc_TeamUserAction!getPageTeamMemberAssign.action",*/
	xy_PageMode : false,
	xy_MultiSelectMode : true,
	xy_RemoteDataMode : false,
	xy_InitLoadData : false,
	xy_KeyField : "userID",
	xy_DisplayField : "userName",
	xy_FieldList : [ "activityID", "activityName",
	                 "userID", "userCode", "userName",
	                 "deptID", "deptCode", "deptName" ],
	xy_ColumnConfig : [
	{
		header : "审批环节",
		dataIndex : "activityName",
		width : 120
	},
	{
		header : "姓名",
		dataIndex : "userName",
		width : 90
	},
	{
		header : "登录名",
		dataIndex : "userCode",
		width : 90
	},
	{
		header : "部门编码",
		dataIndex : "deptCode",
		width : 100
	},
	{
		header : "部门名称",
		dataIndex : "deptName",
		width : 100
	} ],
	setApproveUserData : function(data)
	{
		this.m_GridStore.loadData(data, false);
	},
	getSelectedApproveUserXML : function()
	{
		/**
		 * 应当判断每个活动都选择了人
		 */
		var list = this.getSelectedData();

		/**
		 * [
		 * {
		 * 		activityID : "",
		 * 		users : ["", ""]
		 * },
		 * {
		 * }
		 * ]
		 */
		var result = [];
		for (var i = 0; i < list.length; i++)
		{
			var record = list[i];
			var activityID = record.activityID;
			var userID = record.userID;

			var findActivityID = false
			for (var j = 0; j < result.length; j++)
			{
				var activity = result[j]

				if (activity.activityID == activityID)
				{
					findActivityID = true;

					var findUserID = false
					for (var k = 0; k < activity.users.length; k++)
					{
						if (activity.users[k] == userID)
						{
							findUserID = true;
							break;
						}
					}

					if (! findUserID)
					{
						activity.users.push(userID);
					}

					break;
				}
			}

			if (! findActivityID)
			{
				var activity = 
				{
					activityID : activityID,
					users : [userID]
				};
				result.push(activity);
			}
		}


		var xml = "<rows>";
		for (var i = 0; i < result.length; i++)
		{
			var activity = result[i];

			xml += "<activity id=\"" + activity.activityID + "\">";

			for (var j = 0; j < activity.users.length; j++)
			{
				xml += "<user id=\"" + activity.users[j] + "\"/>";
			}
			xml += "</activity>";
		}
		xml += "</rows>";

		return xml;
	}
});