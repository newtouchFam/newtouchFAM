Ext.namespace("ssc.component");

ssc.component.ReportTriggerField = Ext.extend(Ext.form.TwinTriggerField,
{
	width : 200,
	readOnly : true,
	trigger1Class : "x-form-search-trigger",
	trigger2Class : "x-form-clear-trigger",
	queryWindowWidth : 400,
	queryWindowHeight : 300,
	singleSel : false,
	treeWindow : null,
	initComponent : function()
	{
		Ext.apply(this,
		{
			onTrigger1Click : this.showWindow,
			onTrigger2Click : this.clearWindow
		});

		ssc.component.ReportTriggerField.superclass.initComponent.call(this);

	},
	showWindow : function()
	{
		if (this.disabled)
		{
			return;
		}

		if (!this.treeWindow)
		{
			this.treeWindow = new Ext.Window(
			{
				closeAction : 'hide',
				width : this.queryWindowWidth,
				height : this.queryWindowHeight,
				modal : true,
				items : [ this.tree ],
				buttons : [
				{
					text : "确定",
					handler : this.closeWindow,
					scope : this
				},
				{
					text : "取消",
					handler : this.hideWindow,
					scope : this
				} ]
			});
			this.treeWindow.on('show', function()
			{
				if (this.needLoad())
				{
					this.tree.load();
				}
			}, this);
			this.treeWindow.show();
		} else
		{
			this.treeWindow.show();
		}
	},
	closeWindow : function()
	{
		this.hideWindow();

		//dsfsdf
		if (this.singleSel == true)
		{
			var chooseCompanyNode = this.tree.getSelectionModel()
					.getSelectedNode();
			if (chooseCompanyNode == null)
			{
				top.Ext.MessageBox.alert("提示", "请选择一个节点");
			} else
			{
				this.setValue(chooseCompanyNode.text);
			}
		} else
		{
			var str = [];

			var nodes = this.tree.getChecked();
			for ( var i = 0; i < nodes.length; i++)
			{
				str.push(nodes[i].text);
			}

			this.setValue(str.toString());
		}

		this.fireEvent("valueChange");
	},
	clearWindow : function()
	{
		if (this.disabled)
		{
			return;
		}
		if (this.tree)
		{
			this.tree.clear();
		}
		this.reset();

		this.fireEvent("valueChange");

	},
	getValues : function()
	{
		var str = [];
		var nodes = this.tree.getChecked();
		for ( var i = 0; i < nodes.length; i++)
		{
			if (nodes[i].id != this.tree.root.id)
			{
				str.push(nodes[i].id);
			}
		}
		return str;
	},
	getChecked : function()
	{
		var value = "";
		var nodes = this.tree.getChecked();
		for ( var i = 0; i < nodes.length; i++)
		{
			if (nodes[i].id != this.tree.root.id)
			{
				if (value.trim().length > 0)
				{
					value += ",";
				}
				value += nodes[i].id;
			}
		}
		
		return value;
	},
	hideWindow : function()
	{
		if (this.treeWindow)
		{
			this.treeWindow.hide();
		}
	},
	needLoad : function()
	{
		if (this.tree.root.childNodes.length <= 0)
		{
			return true;
		}

		var baseParams = this.tree.treeloader.baseParams;
		var newBaseParams = this.tree.getBaseParams();
		var needLoad = false;

		for ( var j in baseParams)
		{
			if (baseParams[j] != newBaseParams[j])
			{
				needLoad = true;
			}
		}
		for ( var j in newBaseParams)
		{
			if (baseParams[j] != newBaseParams[j])
			{
				needLoad = true;
			}
		}

		if (needLoad)
		{
			this.reset();
		}
		return needLoad;
	}
});