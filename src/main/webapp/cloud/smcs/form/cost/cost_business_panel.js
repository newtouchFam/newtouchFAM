Ext.namespace("ssc.smcs.form.cost");

/**
 * 日常费用报账单业务区域面板
 */
ssc.smcs.form.cost.CostBusinessPanel = Ext.extend(ssc.component.BaseFormHeaderPanel,
{
	m_CostInfoPanel : null,
	m_AttachmentInfoPanel : null,
	initComponent : function()
	{
		this.m_CostInfoPanel = new ssc.smcs.form.cost.CostInfoPanel(
		{
			autoWidth : true,
			height : 300,
			xy_StoreParams : FormGlobalVariant.create_StoreParams(),
			xy_flag : true
		});

		/* 2015-06-26 支持文件类型限制 */
		var strFileAccept = "application/msword,.docx";
		strFileAccept += ",application/msexcel,.xlsx";
		strFileAccept += ",application/vnd.ms-powerpoint";
		strFileAccept += ",text/plain";
		strFileAccept += ",application/pdf";
		strFileAccept += ",.zip,.rar";
		strFileAccept += ",image/*";

		var strFileExt = "doc,docx";
		strFileExt += ",xls,xlsx";
		strFileExt += ",ppt";
		strFileExt += ",txt,pdf";
		strFileExt += ",zip,rar";
		strFileExt += ",jpeg,jpe,jpg,bmp,png,gif,tif,tiff";

		this.m_AttachmentInfoPanel = new ssc.form.common.AttachmentInfoPanel(
		{
			autoWidth : true,
			height : 300,
			xy_StoreParams : FormGlobalVariant.create_StoreParams(),
			xy_FileAccept : strFileAccept,
			xy_FileExt : strFileExt,
			xy_FileExtErrorMsg : "不允许上传此类文件"
		});

		this.row1 = new Ext.TabPanel(
		{
			plain : true,
			activeTab : 0,
			/*延迟加载是否会造成数据加载不完全？
			 * deferredRender : true,*/
			layoutOnTabChange : true,
			items : [ 
			{
				autoHeight : true,
				layout : "fit",
				items : [ this.m_CostInfoPanel ]
			},
			{
				id : "attachmentinfo_tab",
				autoHeight : true,
				layout : "fit",
				items : [ this.m_AttachmentInfoPanel ]
			} ]
		});

		for (var i = 0; i < this.row1.items.getCount(); i++)
		{
			var tab = this.row1.getItem(i);
			var grid = tab.items.get(0);
			if (grid.xy_Title != undefined && grid.xy_Title != null)
			{
				tab.title = grid.xy_Title;
			}
		}

		this.row1.on("render", function(tabPanel)
		{
			for (var i = 0; i < tabPanel.items.getCount(); i++)
			{
				tabPanel.setActiveTab(i);
			}
			tabPanel.setActiveTab(0);
		}, this);
		
		this.m_CostInfoPanel.on("dblclick",function()
		{
			var record = this.m_CostInfoPanel.getSelectionModel().getSelected();
			var rowIndex = this.m_CostInfoPanel.getSelectionModel().lastActive;
			this.m_CostInfoPanel.editRowEvent(record,rowIndex);
			
		},this);

		this.items = [ this.row1 ];

		ssc.smcs.form.cost.CostBusinessPanel.superclass.initComponent.call(this);
	},
	initComponentEvents : function()
	{
		this.getCostInfoPanel().initComponentEvents();
	},
	initComponentStatus : function()
	{
		this.getCostInfoPanel().initComponentStatus();
	},
	loadFormData : function()
	{
		this.getCostInfoPanel().loadFormData();

		this.getAttachmentInfoPanel().loadFormData();
	},
	getStoreLoaded : function()
	{
		if (! this.getCostInfoPanel().getStoreLoaded())
		{
			return false;
		}
		
		if(! this.getAttachmentInfoPanel().getStoreLoaded())
		{
			return false;
		}
	
		return true;
	},
	validate : function(submittype)
	{
		if (submittype != "submit")
		{
			return true;
		}

		if (! this.getCostInfoPanel().validate(submittype))
		{
			return false;
		}

		return true;
	},
	getFormData : function()
	{
		return [ this.getCostInfoPanel().getFormData() ];
	},
	getPrintData : function()
	{
		return [ this.getCostInfoPanel().getPrintData() ];
	},
	clearFormData : function()
	{
		this.getCostInfoPanel().removeAllRecords();
	},
	getCostInfoPanel : function()
	{
		return this.m_CostInfoPanel;
	},
	getAttachmentInfoPanel : function()
	{
		return this.m_AttachmentInfoPanel;
	},
	getBusinessAmount : function()
	{
		return this.getCostInfoPanel().getBusinessAmount();
	},
	
	hide_Tab : function(tabid)
	{
		var activeTab = this.row1.getActiveTab();
		if (activeTab.id == tabid)
		{
			this.row1.setActiveTab(0);
		}

		this.row1.hideTabStripItem(tabid);
	}
});