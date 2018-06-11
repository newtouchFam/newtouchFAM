Ext.namespace("Freesky.BBM");
/**
 * 
 * @author qinde
 * @class Freesky.BBM.CommonWindow
 * @extends Ext.Window
 * 
 * 使用例子代码 treeWindow = new Freesky.BBM.CommonWindow({ title: "小熊猫", width: 400,
 * heigth: 300, treeUrl: "BBM/loadCompanyTree.action", treeText: "大熊猫",
 * allowChooseRoot: true, returnComId: "typeAdminId", buttons: [{ text: "保存",
 * handler: getData }, { text: "关闭", handler: closeWindow }] });
 * treeWindow.show();
 */
Freesky.BBM.CommonWindow = Ext.extend(Ext.Window,
{
	title: "CommonWindow",
	width: 650,
	height: 500,
	collapsible: true,
	closable: true,
	modal: true,
	treeUrl: '',
	treeText: 'noName',
	treeRootId: 'root',
	returnComId: '',
	closeAction: 'hide',
	allowChooseRoot: false,
	defaults:
	{
		border: false
	},
	buttonAlign: 'center',
	createTreePanel: function()
	{
		return new Ext.tree.TreePanel(
				{
					region: 'center',
					renderTo: Ext.getBody(),
					loader: new Ext.tree.TreeLoader(
							{
								dataUrl: this.treeUrl,
								listeners:
								{
									"beforeload": function(treeLoader, node)
									{
										treeLoader.baseParams.id = (node.id != "root"
												? node.id
												: "");
									}
								}
							}),
					root: new Ext.tree.AsyncTreeNode(
							{
								id: this.treeRootId,
								text: this.treeText
							}),
					animate: true,
					enableDD: false,
					border: false,
					rootVisible: true,
					autoScroll: true,
					height: this.height - 70
				});
	},
	getValue: function()
	{
		var treenode = this.treePanel.getSelectionModel().getSelectedNode();
		if (!treenode)
		{
			Ext.MessageBox.alert("提示", "您未作选择,请先选择");
			return;
		}
		if (treenode.id == this.treeRootId && !this.allowChooseRoot)
		{
			Ext.MessageBox.alert("错误", "根节点不能选择");
			return;
		}
		else
		{
			var data = new Array();
			data[0] = treenode.id;
			data[1] = treenode.text;
			return data;
		}
	},
	initComponent: function()
	{
		Freesky.BBM.CommonWindow.superclass.initComponent.call(this);
		this.treePanel = this.createTreePanel();
		this.add(this.treePanel);
	}

});
Ext.reg("commonwindow", Freesky.BBM.CommonWindow);