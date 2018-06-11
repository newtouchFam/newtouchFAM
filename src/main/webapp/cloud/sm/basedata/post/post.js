Ext.namespace("ssc.core.basedata.Post");

ssc.basedata.Post.PostList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_PostEditWin : null,
	initComponent : function()
	{
		this.tbar = [
		{
			text : "新增",
			iconCls : "xy-add",
			handler : this.btn_AddEvent,
			scope : this
		}, "-",
		{
			text : "修改",
			iconCls : "xy-edit",
			handler : this.btn_UpdateEvent,
			scope : this
		}, "-",
		{
			text : "删除",
			iconCls : "xy-delete",
			handler : this.btn_DeleteEvent,
			scope : this
		} ];

		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_PostAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "postid", "postcode", "postname", "postdesc" ]
		});
		this.store.on("loadexception", showExtLoadException);

		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(),
		{
			header : "岗位编码",
			dataIndex : "postcode",
			width : 100
		},
		{
			header : "岗位名称",
			dataIndex : "postname",
			width : 120
		},
		{
			header : "岗位描述",
			dataIndex : "postdesc",
			width : 200
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);
		this.on("dblclick", this.btn_UpdateEvent, this);

		ssc.basedata.Post.PostList.superclass.initComponent.call(this);
	},
	loadStoreData : function()
	{
		this.store.load(
		{
			params :
			{
				start : this.getBottomToolbar().cursor,
				limit : this.getBottomToolbar().pageSize
			}
		});
	},
	getPostID : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			return "";
		}

		return record.get("postid");
	},
	getPostName : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			return "";
		}

		return record.get("postname");
	},
	btn_AddEvent : function()
	{
		this.m_PostEditWin = new ssc.basedata.Post.PostEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_PostEditWin.show();
	},
	btn_UpdateEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择需要修改的岗位");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		this.m_PostEditWin = new ssc.basedata.Post.PostEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_PostEditWin.show();
	},
	btn_DeleteEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择需要删除的岗位");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		MsgUtil.confirm("是否删除所选岗位【" + entity.postcode + "/" + entity.postname + "】?", function(btn, text)
		{
			if (btn == "yes")
			{
				this.doDelete(entity);
			}
		}, this);
	},
	doDelete : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "SSC/ssc_PostAction!del.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(entity)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.loadStoreData();
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	}
});

ssc.basedata.Post.UserPostList = Ext.extend(Ext.grid.GridPanel,
{
	stripeRows : true,
	autoWidth : true,
	autoScroll : true,
	enableColumnMove : false,
	enableHdMenu : false,
	autoScroll : true,
	loadMask : true,
	m_PostID : "",
	m_UserPostEditWin : null,
	initComponent : function()
	{
		this.tbar = [
		{
			text : "分配",
			iconCls : "xy-add",
			handler : this.btn_AddEvent,
			scope : this
		}, "-",
		{
			text : "取消分配",
			iconCls : "xy-delete",
			handler : this.btn_DeleteEvent,
			scope : this
		} ];

		this.store = new Ext.data.JsonStore(
		{
			url : "SSC/ssc_UserPostAction!getPage.action",
			root : "data",
			method : "post",
			totalProperty : "total",
			fields : [ "dicttypecode", "dicttypename", "status", "remark", "istree", "viewname" ]
		});
		this.store.on("loadexception", showExtLoadException);

		this.cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(),
		{
			header : "登录名",
			dataIndex : "usercode",
			width : 100
		},
		{
			header : "姓名",
			dataIndex : "username",
			width : 120
		},
		{
			header : "工号",
			dataIndex : "workno",
			width : 100
		},
		{
			header : "公司编码",
			dataIndex : "unitcode",
			width : 100
		},
		{
			header : "公司名称",
			dataIndex : "unitname",
			width : 100
		},
		{
			header : "部门编码",
			dataIndex : "deptcode",
			width : 100
		},
		{
			header : "部门名称",
			dataIndex : "deptname",
			width : 100
		} ]);

		this.bbar = new ssc.component.BaseMultiPagingToolBar(
		{
			store : this.store
		});
		this.on("bodyresize", this.onBodyResize);

		ssc.basedata.Post.UserPostList.superclass.initComponent.call(this);
	},
	loadStoreData : function()
	{
		this.loader.baseParams.jsonCondition = Ext.encode(
		{
			postid : this.m_PostID
		});

		this.store.load(
		{
			params :
			{
				start : this.getBottomToolbar().cursor,
				limit : this.getBottomToolbar().pageSize
			}
		});
	},
	btn_AddEvent : function()
	{
		this.m_PostEditWin = new ssc.basedata.Post.PostEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.loadStoreData,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_PostEditWin.show();
	},
	btn_DeleteEvent : function()
	{
		var record = this.getSelectionModel().getSelected();
		if (null == record)
		{
			MsgUtil.alert("请选择需要删除的岗位");
			return;
		}
		var entity = {};
		Ext.apply(entity, record.data);

		MsgUtil.confirm("是否删除所选岗位【" + entity.postcode + "/" + entity.postname + "】?", function(btn, text)
		{
			if (btn == "yes")
			{
				this.doDelete(entity);
			}
		}, this);
	},
	doDelete : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "SSC/ssc_UserPostAction!del.action",
			method : "post",
			params :
			{
				jsonString : Ext.encode(entity)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.loadStoreData();
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	}
});

ssc.basedata.Post.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "border",
	m_PostList : null,
	m_UserPostList : null,
	initComponent : function()
	{
		this.m_PostList = new ssc.basedata.Post.PostList({});
		this.m_PostList.on("rowclick", this.onPostListClick, this);
	
		this.m_UserPostList = new ssc.basedata.Post.UserPostList(
		{
			m_PostList : this.m_PostList
		});

		this.items = [
		{
			region : "west",
			layout : "fit",
			width : 400,
			split : true,
			items : this.m_PostList
		},
		{
			region : "center",
			layout : "fit",
			items : [ this.m_UserPostList ]
		} ];

		this.m_PostList.loadStoreData();

		ssc.basedata.Post.MainPanel.superclass.initComponent.call(this);
	},
	onPostListClick : function(_ThisGrid, _RowIndex, e)
	{
		var record = _ThisGrid.getSelectionModel().getSelected();
		if (null == record)
		{
			return;
		}

		this.m_UserPostList.loadStoreData();
	}
});
Ext.reg("ssc_basedata_post_mainpanel", ssc.basedata.Post.MainPanel);

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "ssc_basedata_post_mainpanel",
			xtype : "ssc_basedata_post_mainpanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);