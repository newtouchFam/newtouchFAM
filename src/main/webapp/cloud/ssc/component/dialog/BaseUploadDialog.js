Ext.namespace("ssc.component");

/**
 * 标准上传对话框
 */
ssc.component.BaseUploadDialog = Ext.extend(ssc.component.BaseDialog,
{
	title : "文件上传",
    closable : false,
    maximizable : false,
	autoHeight : true,
    width : 400,
	layout : "fit",
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,
	xy_EditMode : ssc.component.DialogEditModeEnum.None,
	xy_Entity : {},

	/* 上传Action */
	xy_UploadAction : "",
	/* 上传Action接收文件的参数，默认为uploadFile。Action使用BaseAction派生，就有该参数 */
	xy_UploadActionParam : "uploadFile",
	/* 提交时一同上传的参数 */
	xy_BaseParams : {},

	/* 下载模板Action */
	xy_DownloadAction : "SSC/baseDownloadTemplate.action",
	/* 下载模板文件全路径 "/SSC/core/fund/basedata/fundrespnorgmap/fundrespnorgmap.xls"*/
	xy_DownloadFullFilePath : "",

	/* 上传文件成功后续处理事件 */
	xy_UploadSuccessEvent : Ext.emptyFn,
	/* 上传文件失败后续处理事件 */
	xy_UploadFailureEvent : Ext.emptyFn,

	/* 读取文件类型过滤 html5中input file支持 */
	xy_FileAccept : "",
	/* 读取文件扩展名检查，格式："doc,xls" */
	xy_FileExt : "",

	/* 文件类型不正确提示信息 */
	xy_FileExtErrorMsg : "选择的文件类型不正确，请重新选择",

	m_FileName : "",
	m_FileExt : "",
	initComponent : function()
	{
		this.initUI();

		this.initData();
			
		ssc.component.BaseUploadDialog.superclass.initComponent.call(this);
	},
	initUI : function()
	{
		this.fieldFileUpload = new Ext.ux.form.FileUploadField(
		{
			id : this.xy_UploadActionParam,
			fieldLabel : "选择文件",
			width : 240,
			emptyText : "请选择导入文件...",
			xy_FileAccept : this.xy_FileAccept
		});
		this.fieldFileUpload.on("fileselected", this.onFieldSelectedEvent, this);

		this.btnDownloadTemplate = new Ext.Button(
		{
			text : "模板下载",
			handler : this.btn_DownloadTemplateEvent,
			scope : this
		});

		this.mainFormPanel = new Ext.form.FormPanel(
		{
	        frame : true,
			autoWidth : true,
			autoHeight : true,
			fileUpload : true,
			collapsible : true,
			labelAlign : "right",
			labelWidth : 60,
			items : [
			{
				layout : "column",
				items : [
				{
					columnWidth : .8,
					layout : "form",
					name : this.xy_UploadActionParam,
					items : [ this.fieldFileUpload ]
				},
				{
					columnWidth : .2,
					layout : "form",
					items : [ this.btnDownloadTemplate ]
				} ]
			},
			{
				layout : "column",
				items : [
				{
					layout : "form",
					items : [ new Ext.form.Label(
					{
						text : "提示：必须按照下载的模板格式导入",
						width : 300
					}) ]
				} ]
			} ]
		});

		this.items = [ this.mainFormPanel ];		
	},
	onFieldSelectedEvent : function(/*fileField*/ field, strFileName)
	{
		this.m_FileName = strFileName;
		this.m_FileExt = "";

		for (var index = strFileName.length - 1; index >= 0; index--)
		{
			if (strFileName.charAt(index) == ".")
			{
				this.m_FileExt = strFileName.substr(index + 1);
				break;
			}
		}

		if (this.xy_FileExt == null || this.xy_FileExt.trim() == "")
		{
			return;
		}
		
		if (this.m_FileExt == "")
		{
			MsgUtil.alert(this.xy_FileExtErrorMsg);
			this.fieldFileUpload.reset();
		}

		var arrayFileExt = this.xy_FileExt.split(",");
		for (var i = 0; i < arrayFileExt.length; i++)
		{
			var strFileExt = arrayFileExt[i].trim();

			if (strFileExt.toLowerCase() === this.m_FileExt.toLowerCase())
			{
				return;
			}
		}

		MsgUtil.alert(this.xy_FileExtErrorMsg);
		this.fieldFileUpload.reset();
	},
	initData : function()
	{
		
	},
	baseConfirmValid : function()
	{
		if (!this.validData())
		{
			return false;
		}

		MsgUtil.confirm("确认要导入数据吗？", function(btn, text)
		{
			if (btn == "yes")
			{
				this.uploadFile();
			}
		}, this);
	},
	validData : function()
	{
		if (this.fieldFileUpload == null
				|| this.fieldFileUpload.getValue() == null
				|| this.fieldFileUpload.getValue() == "")
		{
			MsgUtil.alert("请先选择上传文件.");
			return false;
		}

		return true;
	},
	uploadFile : function()
	{
		if (this.xy_BaseParams == undefined
				|| this.xy_BaseParams == null)
		{
			this.xy_BaseParams = {};
		}

		this.xy_BaseParams.filename = this.fieldFileUpload.getValue();
		this.xy_BaseParams.fileext = SecurityUtil.Encode(this.m_FileExt, "newtouch", "ssc", "baseuploaddialog");

		this.mainFormPanel.getForm().submit(
		{
			url : this.xy_UploadAction,
			method : "post",
			waitTitle : "请稍候",
			waitMsg : "正在上传文件, 请稍候...",
			action : "",
			sync : true,
			params :
			{
				jsonCondition : Ext.encode(this.xy_BaseParams)
			},
			success : this.xy_UploadSuccessEvent,
			failure : this.xy_UploadFailureEvent,
			scope : this
		});
	},
	xy_UploadSuccessEvent : function(form, action)
	{
		var data = Ext.decode(action.response.responseText);
		if (data.success)
		{
			if (data.msg != undefined)
			{
				if (! ssc.common.StringUtil.isEmpty(data.msg))
				{
					MsgUtil.alert(data.msg);
				}
			}

			if (this.hasListener("result_ok"))
			{
				this.fireEvent("result_ok", this, data);
			}

			this.closeDialog();
		}
		else
		{
			MsgUtil.alert(data.msg);
		}
	},
	xy_UploadFailureEvent : function(form, action)
	{
		var data = Ext.decode(action.response.responseText);
		MsgUtil.alert(data.msg);
	},
	btn_DownloadTemplateEvent : function()
	{
		var url = "SSC/baseDownloadTemplate.action";
		var qryCondition =
		{
			downloadSourcePath : this.xy_DownloadFullFilePath
		};
		this.formPost(this.xy_DownloadAction, qryCondition, "_blank");
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
	}
});