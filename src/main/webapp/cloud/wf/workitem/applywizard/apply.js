Ext.namespace("ssc.smcs.bz.workitem.BZApply");

function showHowdo()
{

	var strBasePath = Ext.get("basePath").dom.value;
	var strViewUrl = strBasePath + "SSC/smcs/bz/workitem/bzapply/howto.htm";

	window.open(strViewUrl, "", "");

	return false;
};
ssc.smcs.bz.workitem.BZApply.MainPanel = Ext.extend(Ext.Panel,
{
	screenWidth : screen.width,
	layout : "border",
	border : false,
/*	m_ProcessID : "",*/
	m_dsBusiClass : null,
	m_dsProcess : null,
	m_dataViewBusiClass : null,
	m_ProcessListMenu : null,
	m_BusiClassTipPanel : null,
	m_TopPanel : null,
	m_CenterPanel : null,
	m_BottomToolbar : null,
	initComponent : function()
	{
		this.m_ProcessListMenu = new Ext.menu.Menu(
		{
			items : []
		});

		this.m_TopPanel = new Ext.Panel(
		{
			html : "<a id='howto_help' href='javascript:void(0);' onclick='showHowdo()' style='color:red;'>不知道选择哪个类别报账？请点击</a>",
			id : "xy_ssc_unionpay_newitem_buslist_howto",
			height : 50,
			autoWidth : true,
			style : "border: none;background-color:#ffffff;",
			border : false
		});

		this.getProcessType();

		this.m_dsBusiClass = new Ext.data.JsonStore(
		{
			data :
			{
				busiclassdata : [],
				processdata : []
			},
			root : "busiclassdata",
			fields : [
			{
				name : "busiclasscode"
			},
			{
				name : "busiclassname"
			} ]
		});
		this.m_dataViewBusiClass = new ssc.smcs.bz.workitem.BZApply.BusiClassView(
		{
			border : false,
			bodyStyle : "background:#ff0000; padding:10px;",
			store : this.m_dsBusiClass
		});
		this.m_dataViewBusiClass.store.loadData(this.m_Data);
		this.m_dataViewBusiClass.on("click", this.onBusiClassCilck, this);

		this.m_dsProcess = new Ext.data.JsonStore(
		{
			data :
			{
				busiclassdata : [],
				processdata : []
			},
			root : "processdata",
			fields : [
			{
				name : "busiclasscode"
			},
			{
				name : "busiclassname"
			},
			{
				name : "processid"
			},
			{
				name : "processname"
			} ]
		});
		this.m_dsProcess.loadData(this.m_Data);

		this.m_BusiClassTipPanel = new Ext.Panel(
		{
/*			autoHeight : true,*/
			autoWidth : true,
			border : false,
			bodyStyle : "background:#ffffff; margin: 0px; width:auto;",
			items : [
			this.m_TopPanel,
			{
				html : "<div style='background-color:#ffffff;width:auto;'>报账类别:</div>",
				autoHeight : true,
				autoWidth : true,
				border : false
			},
			this.m_dataViewBusiClass ]
		});

		var varframe = "<iframe id='wf_ssc_wizard_form' name='wf_ssc_wizard_form' frameborder=0 src='about:blank' height=100% width=100% scrolling='no'></iframe>";

		this.m_CenterPanel = new Ext.TabPanel(
		{
			id : "wf_ssc_wizard_main",
			region : "center",
			activeTab : 0,
			border : false,
			deferredRender : false,
			items : [ this.m_BusiClassTipPanel,
			{
				border : false,
				html : varframe
			} ]
		});

		this.btnShowProcImg = new Ext.XyStepBottomButton(
		{
			text : "流程图",
			handler : this.btn_ShowProcImgEvent,
			scope : this,
			disabled : true
		});
		this.btnSaveDraft = new Ext.XyStepBottomButton(
		{
			text : "保存草稿",
			handler : this.btn_SaveDraftEvent,
			scope : this,
			disabled : true
		});
		this.btnSubmit = new Ext.XyStepBottomButton(
		{
			text : "提交申请",
			handler : this.btn_SubmitEvent,
			scope : this,
			disabled : true
		});

		this.m_BottomToolbar = new Ext.Toolbar(
		{
			region : "south",
			height : 32,
			items : [
				"<span class='xy-step-bm-btn-infotext' id='bustypeinfo'>请选择报账类别...</span>", "->",
				this.btnShowProcImg,
				this.btnSaveDraft,
				this.btnSubmit ]
		});

		this.items = [ this.m_CenterPanel, this.m_BottomToolbar ];

		ssc.smcs.bz.workitem.BZApply.MainPanel.superclass.initComponent.call(this);
	},
	getProcessType : function()
	{
		var loadMask = new Ext.LoadMask(Ext.getBody(),
		{
			msg : "读取报账类型",
			removeMask : true
		});
		loadMask.show();

		try
		{
			var _ThisResponseText;

			Ext.Ajax.request(
			{
				url : "workitem/apply/getprocessdata",
				method : "post",
				sync : true,
				params :
				{
				},
				success : function(response, options)
				{
					var responseText = Ext.decode(response.responseText);
					if (responseText.success == true)
					{
						if (responseText.busiclassdata != undefined && responseText.busiclassdata != ""
							&& responseText.processdata != undefined && responseText.processdata != "")
						{
							_ThisResponseText = responseText;
						}
						else
						{
							alert("未找到");
							/* 未找到则忽略 */
						}
					}
					else
					{
						MsgUtil.alert(responseText.msg);
					}

					this.m_Data = _ThisResponseText;
				},
				failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
				scope : this,
				timeout : 0
			});
		}
		finally
		{
			loadMask.hide();
		}
	},
	onBusiClassCilck : function(_this, index, node, e)
	{
		this.m_dsProcess.filter("busiclasscode", this.m_dsBusiClass.getAt(index).get("busiclasscode"));
		
		var intCount = this.m_dsProcess.getCount();
		if (intCount <= 0)
		{
			return;
		}
		else if (intCount == 1)
		{
			var strBusiClassCode = this.m_dsProcess.getAt(0).get("busiclasscode");
			var strBusiClassName = this.m_dsProcess.getAt(0).get("busiclassname");
			var strProcessID = this.m_dsProcess.getAt(0).get("processid");

			this.launchProcess(this, strProcessID, strBusiClassCode, strBusiClassName, index, node);
		}
		else if (intCount > 1)
		{
			var strBusiClassCode = this.m_dsProcess.getAt(0).get("busiclasscode");
			var strBusiClassName = this.m_dsProcess.getAt(0).get("busiclassname");

			this.m_ProcessListMenu.removeAll();

			for (var i = 0; i < intCount; i++)
			{
				this.m_ProcessListMenu.addMenuItem(
				{
					text : this.m_dsProcess.getAt(i).get("processname"),
					processid : this.m_dsProcess.getAt(i).get("processid"),
					busiclasscode : strBusiClassCode,
					busiclassname : strBusiClassName,
					dataindex : index,
					datanode : node,
					scope : this,
					handler : this.doProcessListMenuClick
				});
			}
			
			this.m_ProcessListMenu.show(node);
		}
	},
	doProcessListMenuClick : function(item, e)
	{
		/* 取消默认动作，非常重要！！！ */
		e.preventDefault();

		this.m_ProcessListMenu.hide();

		this.launchProcess(this, item.processid, item.busiclasscode, item.busiclassname, item.dataindex, item.datanode);
	},
    launchProcess : function(_This, strProcessID, strBusiClassCode, strBusiClassName, index, node)
	{
/*		this.m_ProcessID = strProcessID;*/

		var mask = new Ext.LoadMask(Ext.getBody(), Ext.apply(
		{
			store : null,
			msg : "正在处理，请稍候...",
			removeMask : true
		}));
		mask.show();

		try
		{
			var busTypeInfo = Ext.getDom("bustypeinfo");
			if (busTypeInfo)
			{
				busTypeInfo.innerHTML = "报账类别：" + strBusiClassName;
			}

			var url = "wf/formmgr/wizardSubmit?processid=" + strProcessID;
			var oframe = Ext.get("wf_ssc_wizard_form");
			oframe.dom.src = url;

			this.m_CenterPanel.setActiveTab(1);
			this.btnShowProcImg.setDisabled(false);
			this.btnSaveDraft.setDisabled(false);
			this.btnSubmit.setDisabled(false);
		}
		finally
		{
			mask.hide();
		}
	},
	btn_ShowProcImgEvent : function()
	{
		if (wf_ssc_wizard_form != undefined && wf_ssc_wizard_form != null
				&& wf_ssc_wizard_form.frmFormInfo != undefined && wf_ssc_wizard_form.frmFormInfo != null
				&& wf_ssc_wizard_form.frmFormInfo.getProcessID != undefined && wf_ssc_wizard_form.frmFormInfo.getProcessID != null
				&& typeof(wf_ssc_wizard_form.frmFormInfo.getProcessID) == "function")
		{
			var strProcessID = wf_ssc_wizard_form.frmFormInfo.getProcessID();

			if (strProcessID != "")
			{
				var basePath = Ext.getDom("basePath").value;
				var win = new freesky.ssc.wfmgr.processinstMgr.processChartWin(
				{
					basePath : basePath,
					processid : strProcessID
				});

				win.show();
			}
		}
	},
	btn_SaveDraftEvent : function()
	{
		if (wf_ssc_wizard_form != undefined && wf_ssc_wizard_form != null
				&& wf_ssc_wizard_form.frmFormInfo != undefined && wf_ssc_wizard_form.frmFormInfo != null
				&& wf_ssc_wizard_form.frmFormInfo.getProcessID != undefined && wf_ssc_wizard_form.frmFormInfo.getProcessID != null
				&& typeof(wf_ssc_wizard_form.frmFormInfo.getProcessID) == "function")
		{
			wf_ssc_wizard_form.frmFormInfo.getProcessID();
		}

		if (wf_ssc_wizard_form && (wf_ssc_wizard_form.on_SaveClick !== undefined)
				&& (typeof (wf_ssc_wizard_form.on_SaveClick) == "function"))
		{
			wf_ssc_wizard_form.on_SaveClick();
		}
	},
    afterSubmitSuccessCallBack: function(This)
    {
		/* 仅仅成功才调用 */
    	This.isFirstRender = true;
    		
		if (This.m_CenterPanel.setActiveTab(0))
		{
			This.btnShowProcImg.setDisabled(true);
			This.btnSaveDraft.setDisabled(true);
			This.btnSubmit.setDisabled(true);

			This.isFirstRender = false;
		}
    },
	btn_SubmitEvent : function()
	{
		if (wf_ssc_wizard_form && (wf_ssc_wizard_form !== undefined)
				&& (typeof (wf_ssc_wizard_form.on_SubmitClick) == "function"))
		{
			wf_ssc_wizard_form.on_SubmitClick(this.afterSubmitSuccessCallBack, this);
		}
	}
});
Ext.reg("ssc_scms_bz_workitem_bzapply_mainpanel", ssc.smcs.bz.workitem.BZApply.MainPanel);

function init()
{
	Ext.QuickTips.init(); 

	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "ssc_scms_bz_workitem_bzapply_mainpanel",
			xtype : "ssc_scms_bz_workitem_bzapply_mainpanel"
		} ]
	});
};

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);