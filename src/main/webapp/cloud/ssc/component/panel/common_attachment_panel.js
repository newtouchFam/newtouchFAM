Ext.namespace("ssc.form.common");

/**
 * 附件面板
 */
ssc.form.common.AttachmentInfoPanel = Ext.extend(ssc.component.BaseFormGridPanel,
{
	id : "attachmentinfo",
	xy_Title : "附件",
	xy_StoreUrl : "wf/uploadfile/list",
	xy_StoreParams : null,

	iconCls : "xy-attach",
	bodyStyle : "width:100%",
	xy_StoreLoaded : false,

	/* 读取文件类型过滤 html5中input file支持 */
	xy_FileAccept : "",
	/* 读取文件扩展名检查，格式："doc,xls" */
	xy_FileExt : "",
	/* 文件类型不正确提示信息 */
	xy_FileExtErrorMsg : "选择的文件类型不正确，请重新选择",

	initComponent : function()
	{
		this.store = this.createStore();
		this.getStore().on("load", this.onStoreLoaded, this);

		this.createToolbar();

		this.selModel = new Ext.grid.RowSelectionModel(
		{
			singleSelect : true
		});

		this.colModel = this.createColumnModel();

		ssc.form.common.AttachmentInfoPanel.superclass.initComponent.call(this);

		this.on("dblclick", this.grid_dblclick);
	},
	/**
	 * @extneds
	 * 创建CalcRecord
	 */
	createCalcRecord : function()
	{
		return Ext.data.XyCalcRecord.create( [
		{
			name : "fileid"
		},
		{
			name : "filename"
		},
		{
			name : "filesize"
		},
		{
			name : "createdate",
			type : "date",
			dateFormat : "Y-m-d H:i:s"
		},
		{
			name : "action2",
			type : "string",
			dependencies : [ "action2" ],
			notDirty : true,
			calc : function(record)
			{
				return "xy-open";
			}
		},
		{
			name : "action3",
			type : "string",
			dependencies : [ "action3" ],
			notDirty : true,
			calc : function(record)
			{
				return "xy-delete";
			}
		},
		{
			name : "qtip2",
			type : "string",
			dependencies : [ "qtip2" ],
			notDirty : true,
			calc : function(record)
			{
				return "打开";
			}
		},
		{
			name : "qtip3",
			type : "string",
			dependencies : [ "qtip3" ],
			notDirty : true,
			calc : function(record)
			{
				return "删除";
			}
		} ]);
	},
	/**
	 * 创建工具栏
	 * 发起环节才允许添加附件
	 */
	createToolbar : function()
	{
		if (attachmentEnable() || FormStatusUtil.isStart())
		{
			this.btnAdd = new Ext.Toolbar.Button(
			{
				text : "添加",
				iconCls : "xy-add",
				handler : this.addAttachementEvent,
				scope : this
			});
			var toolbarTop = [ "-", this.btnAdd, "-", "提示:附件上传每次最大为10M" ];

			this.tbar = new Ext.Toolbar(
			{
				items : toolbarTop,
				height : 28
			});
		}
	},
	/**
	 * 表格列
	 */
	createColumnModel : function()
	{
		var clnRowNum = new Ext.grid.RowNumberer();
		var clnFileID =
		{
			header : "ID",
			dataIndex : "fileid",
			hidden : true,
			fixed : false
		};
		var clnFileName =
		{
			header : "文件名称",
			dataIndex : "filename",
			width : 230,
		};
		var clnFileSize =
		{
			header : "文件大小(字节)",
			dataIndex : "filesize",
			width : 120,
			align : "right",
			renderer : this.fileSizeRend,
		};
		var clnCreateDate =
		{
			header : "上传时间",
			dataIndex : "createdate",
			width : 200
		};

		/* 在发起环节允许删除附件，其他环节允许下载附件（后续考虑附件权限）*/
		var cm = null;
		var startstate = "";
		if (typeof (FormGlobalVariant.get_Activity_BusiType()) != "undefined")
		{
			startstate = FormGlobalVariant.get_Activity_BusiType();
		}

		if (attachmentEnable() || FormGlobalVariant.get_OperType() == 6 || startstate == "START")
		{
			/**
			 * 发起环节，允许删除和下载
			 */
			var action = new Ext.ux.grid.RowActions(
			{
				header : "操作",
				autoWidth : false,
				width : 100,
				actions : [
				{
					iconIndex : "action2",
					qtipIndex : "qtip2"
				},
				{
					iconIndex : "action3",
					qtipIndex : "qtip3"
				} ]
			});
			action.on(
			{
				action : function(grid, record, action, row, col)
				{
					if (action == "xy-open")
					{
						this.downloadAttachmentEvent();
					}
					else if (action == "xy-delete")
					{
						this.deleteAttachmentEvent();
					}
				}.createDelegate(this)
			});

			this.plugins = [ action ];
			cm = new Ext.grid.ColumnModel( [ clnRowNum, clnFileID, clnFileName, clnFileSize,
					clnCreateDate, action ]);
		}
		else
		{
			/**
			 * 非发起环节，只允许下载
			 */
			var action = new Ext.ux.grid.RowActions(
			{
				header : "操作",
				autoWidth : false,
				width : 100,
				actions : [
				{
					iconIndex : "action2",
					qtipIndex : "qtip2"
				} ]
			});
			action.on(
			{
				action : function(grid, record, action, row, col)
				{
					if (action == "xy-open")
					{
						this.downloadAttachmentEvent();
					}
				}.createDelegate(this)
			});

			this.plugins = [ action ];
			cm = new Ext.grid.ColumnModel( [ clnRowNum, clnFileID, clnFileName, clnFileSize,
					clnCreateDate, action ]);
		}

		return cm;
	},
	initComponentEvents : function(){},
	initComponentStatus : function(){},
	onStoreLoaded : function(store, records, options)
	{
		var tab = Ext.getCmp("attachmentinfo_tab");
		if (tab != null)
		{
			tab.setTitle("附件信息" + "(<font color='red'>" + store.getCount() + "</font>)条");
		}
	},
	grid_dblclick : function()
	{
		var rc = this.getSelectionModel().getSelected();
		if (rc == null)
		{
			return "";
			;
		}
		this.downFile(rc.get("fileid"));
	},
	fileSizeRend : function(fileSize)
	{
		return Ext.util.Format.fileSize(fileSize);
	},

	/**
	 * 删除附件
	 */
	deleteAttachmentEvent : function()
	{
		var rc = this.getSelectionModel().getSelected();
		if (rc == null)
		{
			Ext.XyMessageBox.alert("错误", "请选择要删除的附件");
			return;
		}
		var newArray = new Array();
		Ext.MessageBox
				.confirm("询问", "确认要删除您选择的附件么?", this.delCallBack.createDelegate(this, newArray, true));
	},
	delCallBack : function(result)
	{
		var rc = this.getSelectionModel().getSelected();
		if (result == "yes")
		{
			var service = new com.ssc.smcs.form.CallbackService();
			service.delAttachInfo(rc.get("fileid"), this.delInfoCallBack, this);
		}
	},
	delInfoCallBack : function(action)
	{
		var obj = JSON.parse(action.responseText);
		if (obj.success || obj.success == "true")
		{
			this.getStore().reload();
		}
		else
		{
			MsgUtil.alert("失败", obj.msg);
		}
	},
	/**
	 * 下载附件
	 */
	downloadAttachmentEvent : function()
	{
		var m_basPath = Ext.get("basePath").dom.value;
		var rc = this.getSelectionModel().getSelected();
		if (rc == null)
		{
			Ext.XyMessageBox.alert("错误", "请选择要下载的附件");
			return;
		}
		this.downFile(rc.get("fileid"));
	},
	downFile : function(fileid)
	{
		var url = "wf/uploadfile/download";
		var qryCondition =
		{
			fileID : fileid
		};
		this.formPost(url, qryCondition, "_blank");
	},
	formPost : function(url, jsonObj, target)
	{
		var oForm = document.createElement("form");
		oForm.id = "freesky-postForm";
		oForm.name = "freesky-postForm";
		oForm.method = "post";
		oForm.action = url;
		oForm.target = target;
		oForm.style.display = "none";

		for ( var prop in jsonObj)
		{
			var oInput = document.createElement("input");
			oInput.name = prop;
			oInput.value = jsonObj[prop];
			oForm.appendChild(oInput);
		}
		document.body.appendChild(oForm);
		oForm.submit();
	},
	/**
	 * 添加附件按钮事件
	 */
	addAttachementEvent : function()
	{
		var m_basPath = Ext.get("basePath").dom.value;
		var url = m_basPath + "wf/UploadAction.action?serialNum=" + Ext.getCmp("serialno").getValue();
		
		var pnl = "<DIV id='wf_upload_div' name='wf_upload_div' class='x-window-bc' style='overflow:hidden;height:100%;width:100%;background-color:#FFFFFF'></DIV>";
		var addWin = new Ext.Window(
		{
			title : "附件上传",
			width : 436,
			height : 352,
			modal : true,
			closeAction : "close",
			resizable : false,
			html : pnl
		});
		addWin.show();

		function closeWin()
		{
			addWin.close();
		}

		preLoadImages();

		var vault = new xyUploadFileObject(this.xy_StoreParams.processInstID,
			this.xy_StoreParams.entityDataID,
			this.xy_StoreParams.formSerialNo,
			closeWin, this.xy_FileAccept,
			this.xy_FileExt, this.xy_FileExtErrorMsg);

		vault.setServerHandlers(m_basPath + "wf/uploadfile/upload", 
			m_basPath + "wf/uploadfile/getinfo",
			m_basPath + "wf/uploadfile/getid");
		vault.create("wf_upload_div");

		Ext.get("wf_upload_file_UploadAll").addClassOnOver("x-btn-over");
		Ext.get("wf_upload_file_ClearAll").addClassOnOver("x-btn-over");
		Ext.get("wf_upload_file_closewin").addClassOnOver("x-btn-over");

		var newArray = new Array();
		newArray[0] = vault;
		addWin.on("beforeclose", this.on_beforeClose.createDelegate(this, newArray, true));

		function preLoadImages()
		{
			var imSrcAr = new Array("btn_addFile.gif", "btn_clean.gif", "ico_file.png", "ico_image.png",
				"ico_sound.png", "ico_video.png", "ico_zip.png", "pb_demoUload.gif");
			var imAr = new Array(0);
			for ( var i = 0; i < imSrcAr.length; i++)
			{
				imAr[imAr.length] = new Image();
/*				imAr[imAr.length - 1].src = "WfApp/upload/imgs/" + imSrcAr[i];*/
				imAr[imAr.length - 1].src = "wf/resources/images/upload/" + imSrcAr[i];
			}
		}
	},
	on_beforeClose : function(scope, vault)
	{
		if (vault)
		{
			if (vault.uploaded)
			{
				this.store.baseParams.serialNum = Ext.getCmp("serialno").getValue();
				this.store.reload();
				Ext.getCmp("attachmentinfo_tab").setTitle(
					"附件信息" + "(<font color='red'>" + this.getStore().getCount() + "</font>)条");
			}
		}
	}//,
/*	loadFormData : function()
	{
		if (this.getStore != null && typeof(this.getStore) == "function")
		{
			this.getStore().load(
			{
				params :
				{
					serialNum : Ext.getCmp("serialno").getValue()
				}
			});
		}
	}*/
	
});