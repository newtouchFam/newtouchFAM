/**
 * 流程图组件
 */
Ext.ns("freesky.ssc.wfmgr.processinstMgr");

freesky.ssc.wfmgr.processinstMgr.processChartWin = Ext.extend(Ext.Window,
{
	title : "流程图",
	width : 480,
	height : 480,
	modal : true,
	layout: "fit",
	resizable: true,
	maximizable : true,
	autoScroll: true,
	buttonAlign: "right",
	initComponent : function()
	{
		if (this.basePath == null || this.basePath == undefined)
		{
			var basePath = "";
			var localObj = window.location;
			basePath = localObj.protocol + "//" + localObj.host + "/";
			this.basePath = basePath;
		}

		this.html = "<DIV style='overflow:auto;height:100%;width:100%;background-color:#FFFFFF'>"
			+ "<img id='xy.ssc.wfmgr.processchartimg' border='0' src='" + this.basePath + "resources/images/s.gif'/></DIV>";
	
  		var buttons = [{text:"关闭", handler:this.close_Click, scope:this}];
		this.buttons = buttons;

		freesky.ssc.wfmgr.processinstMgr.processChartWin.superclass.initComponent.call(this);
	},
	show: function(animateTarget, callback, scope)
	{
		freesky.ssc.wfmgr.processinstMgr.processChartWin.superclass.show.call(this,animateTarget,callback,scope);

		this.loadImg();
	},
	loadImg: function()
	{
		var img = document.getElementById("xy.ssc.wfmgr.processchartimg");
		if (img)
		{
			var url = "";
			if (this.showInstChart)
			{
				if (! this.processinstid)
				{
					Ext.Msg.alert("提示", "缺少processinstid值");
					return;
				}
				url = this.basePath + "wf/processchart/getProcessInstChart?processinstid=" + this.processinstid;
			}
			else
			{
				if (! this.processid)
				{
					Ext.Msg.alert("提示", "缺少processid值");
					return;
				}
				url = this.basePath + "wf/processchart/getProcessChart?processid=" + this.processid;
			}
			
			var loadMask = new Ext.LoadMask(document.body, {
				msg : "正在加载验证码图片...",
				removeMask : true
			});
			loadMask.show();
			
			Ext.get("xy.ssc.wfmgr.processchartimg").on("load", function(){if(loadMask){loadMask.hide(); loadMask = null;} });

			img.src = url;
		}
		
	},
	close_Click: function()
	{
		this.close();
	}
});
