var ds = null;//数据
var addWin = null;
var uploadWin = null;
var panel = null;
var m_budgetGrid = null;
//var combCaseCode = null;cmbCase
//var uploadFileName = null;//上传的文件名
var filePath = null;//服务端传回的文件路径
var uploadFileName=null;
var m_respnChooseTree = null;//责任中心选择树
var m_respnChooseWin = null;//责任中心选择窗口
//var m_respnID = null;//选择的责任中心
var importButton = null;//导入按钮
var center=null;
function createForm(method,action){
	
	var form=document.createElement('form');
	form.method='post';
	form.action=action;
	form.targer='_blank';
    form.enctype = form.encoding = 'multipart/form-data';
	
	return form;
}
function createHidden(name,value,form){
	
	var hidden=document.createElement('input');
	hidden.type='hidden';
	hidden.name=name;
	hidden.value=value;
	
	if(form){
		form.appendChild(hidden);
	}
	
	return hidden;
}


function openFile()
{
	if(uploadWin == null)
	{
		createUploadWin();
	}
	uploadWin.show();
}

function createUploadWin()
{
	var row1 =
	{
		layout : 'column',
		items : [
		{
			layout : 'form',
			items : [
			{
				fieldLabel : '选择文件',
				width : 300,
				id : "upload",
				xtype : 'fileuploadfield',
				emptyText : "请选择导入文件..."
			} ],
			name : 'upload'
		} ]
	};

	var row2 =
	{
		layout : 'column',
		items : [
		{
			items : [
			{
				text : "提示：必须按照下载的模板格式导入",
				width : 300,
				xtype : "label"
			} ]
		} ]
	};

	var row3 =
	{
		layout : 'column',
		items : [
		{
			items : [
			{
				html : "<a href='" + Ext.get('basePath').dom.value + "BCM/exportBudgetModel.action?yearID="
//						+ Ext.getCmp('combCaseCode').getValue()
						+ Ext.getCmp("cmbCase").getSelectedData().caseYear
						+ "'><font color = 'red'>模板下载</font></a>"
			} ]
		} ]
	};
						
	panel = new Ext.FormPanel({
            frame : true,
            fileUpload : true,
            labelWidth:60,
            collapsible : true,
			autoHeight : true,
			labelAlign : 'right',
			autoWidth : true,  
            items : [row1,row2,row3]
        });
        
	uploadWin = new Ext.Window({
                //el : 'htupload',
                title : '文件上传',
                closable : false,
                width :400,
                items : [panel],
                buttons : [{
                    text : '上传',
                    handler : function() {
                    	
                        panel.getForm().submit({
                        	method : "POST",
                        	scope : this,
                            url : 'BCM/upload.action',
                            action: '',
                			waitTitle : "请稍候",
                            waitMsg: '正在上传文件, 请稍候...',
                            success : function(form, action){
                            	
                            	uploadWin.close();
                            	uploadWin = null;
                            	importButton.enable();
                            	
                            	var newdata = {
                                   data : action.result.data,
                                   total : action.result.data.length
                                }
                                m_budgetGrid.getStore().loadData(newdata);
                                filePath = action.result.filepath;
                       			
                            },
                            failure : function(form, action) {
                            	//uploadWin.close();
                                //uploadWin = null;
                                Ext.Msg.alert("警告","数据传递失败,请检查文件类型");
                                return;
                            }
                        });
                    }

                }, {
                    text : '取消',
                    handler : function() {
                       uploadWin.close();
                       uploadWin = null;
                    }
                }]
            });
}
/*
function browseRespn()
{
	var m_root = new Ext.tree.AsyncTreeNode({id:"root",text:"责任中心"});
	
/*	var m_loader = new Ext.tree.TreeLoader({dataUrl:"BCM/getCuurentRespnInfo.action"});
 */
/*	var m_loader = new Ext.tree.TreeLoader({dataUrl:"BCM/getCurrentRespnInfoByYear.action"});
	m_loader.baseParams.casecode = combCaseCode.value;
	
	m_respnChooseTree = new Ext.tree.TreePanel
	({
		    loader:m_loader, 
		    root:m_root, 
		    animate:false, 
		    enableDD:false, 
		    border:false, 
		    rootVisible:true,
		    autoScroll:true
	});
	
	m_respnChooseWin = new Ext.Window({
		title : '选择责任中心',
	    width: 400,
		height: 400,
		plain: true,
		border: false,
		resizable: false,   
		autoScroll:true,
		layout:'fit',
		modal: true,
		buttons:[
			{text:"确定",handler:Select},
			{text:"取消",handler:Cancel}
			],
		items:[m_respnChooseTree]
	});
	m_respnChooseWin.show();
	
	m_root.expand();
    m_respnChooseTree.render();	
    
    m_respnChooseTree.on('dblclick',Select);
}*/

function Select()
{
	var treenode = m_respnChooseTree.getSelectionModel()
			.getSelectedNode();
	if (treenode.id == 'root')
	{
		MsgUtil.alert("警告", "根节点不能选择");
		return;
	}
	Ext.getCmp("respnBrows").setValue(treenode.text);
	Ext.getCmp("respnID").setValue(treenode.id);
	m_respnChooseWin.close();
}

function Cancel()
{
	m_respnChooseWin.close();
}

function importData()
{
//	var respnID = Ext.getCmp("respnID").getValue();
//	if(respnID == "")
//	{
//		MsgUtil.alert("提示","请选择导入的责任中心!",browseRespn);
//		
//		return;
//	}
//	
//	var yearID = combCaseCode.value;
//	if(yearID == null)
//	{
//		MsgUtil.alert("提示","请选择导入年份!");
//		return;
//	}
	if (! Ext.getCmp("cmbCase").getSelected())
	{
		MsgUtil.alert("请先选择预算年份");
		return;
	};
	var yearID = Ext.getCmp("cmbCase").getSelectedData().caseYear;

	if (! Ext.getCmp("tgfieldRespn").getSelected())
	{
		MsgUtil.alert("请先选择导入的责任中心");
		return;
	}
	var respnID = Ext.getCmp("tgfieldRespn").getSelectedID();
	
	var service = new com.freesky.ssc.bcm.budget.BudgetImport.BudgetImportService();
//	service.BudgetImportAction(respnID, yearID, filePath, importCallBack, this);
	
	var recordss = [];
	var records = [];
	var i=0;
	var j=0;
	for(size=m_budgetGrid.store.getCount();i<size;i++){
		var rd = m_budgetGrid.store.getAt(i);
		if(Ext.isEmpty(rd.get('Name'))
			||Ext.isEmpty(rd.get('Code'))){
			continue;
		}
		records.push({
			strIndexName:rd.get('Name'),
			strIndexCode:rd.get('Code'),
			dataValue1:rd.get('dataValue1'),
			dataValue2:rd.get('dataValue2'),
			dataValue3:rd.get('dataValue3'),
			dataValue4:rd.get('dataValue4'),
			dataValue5:rd.get('dataValue5'),
			dataValue6:rd.get('dataValue6'),
			dataValue7:rd.get('dataValue7'),
			dataValue8:rd.get('dataValue8'),
			dataValue9:rd.get('dataValue9'),
			dataValue10:rd.get('dataValue10'),
			dataValue11:rd.get('dataValue11'),
			dataValue12:rd.get('dataValue12')
		});
		
		}
		
		recordss.push({
			start:j+1,
			end:i,
			records:records
		});
		
		service.BudgetImportGridActionBySubmit(respnID,yearID,recordss,importCallBack, this);
		
}

function importCallBackNull(response){
	var data = Ext.decode(response.responseText);
	if(data.success != true){
		MsgUtil.alert("提示",data.msg);
		return;
	}
}

function importCallBack(response)
{
	var data = Ext.decode(response.responseText);
	if(data.success == true)
	{
		//this.importSuccess(null);
		MsgUtil.alert("提示","数据全部导入成功！");
	}
	else
	{
		MsgUtil.alert("提示",data.msg);
		return;
	}

}

function importSuccess(param)
{
	this.afterAdd();
}
	
function afterAdd()
{
	this.rootReloader();
}

function init()
{
	var m_RowNum = new Ext.grid.RowNumberer();
	var m_indexName = {header:"预算项目名称",dataIndex:"Name",width:250};
  	var m_indexCode = {header:"预算项目代码",dataIndex:"Code",width:100};
  	var m_dataValue01 = {header:"一月",dataIndex:"dataValue1",width:80,align:'right'};
  	var m_dataValue02 = {header:"二月",dataIndex:"dataValue2",width:80,align:'right'};
  	var m_dataValue03 = {header:"三月",dataIndex:"dataValue3",width:80,align:'right'};
  	var m_dataValue04 = {header:"四月",dataIndex:"dataValue4",width:80,align:'right'};
  	var m_dataValue05 = {header:"五月",dataIndex:"dataValue5",width:80,align:'right'};
  	var m_dataValue06 = {header:"六月",dataIndex:"dataValue6",width:80,align:'right'};
  	var m_dataValue07 = {header:"七月",dataIndex:"dataValue7",width:80,align:'right'};
  	var m_dataValue08 = {header:"八月",dataIndex:"dataValue8",width:80,align:'right'};
  	var m_dataValue09 = {header:"九月",dataIndex:"dataValue9",width:80,align:'right'};
  	var m_dataValue10 = {header:"十月",dataIndex:"dataValue10",width:80,align:'right'};
  	var m_dataValue11 = {header:"十一月",dataIndex:"dataValue11",width:80,align:'right'};
  	var m_dataValue12 = {header:"十二月",dataIndex:"dataValue12",width:80,align:'right'};

	ds = new  Ext.data.JsonStore({root:"data", fields:["Name","Code","dataValue1","dataValue2","dataValue3","dataValue4","dataValue5","dataValue6","dataValue7","dataValue8","dataValue9","dataValue10","dataValue11","dataValue12"]});
	var cm = new Ext.grid.ColumnModel([m_RowNum,m_indexName,m_indexCode,m_dataValue01,m_dataValue02,m_dataValue03,m_dataValue04,m_dataValue05,m_dataValue06,m_dataValue07,m_dataValue08,m_dataValue09,m_dataValue10,m_dataValue11,m_dataValue12]);
	//var pagebar = new Ext.PagingToolbar({region:'south',displayInfo:true,store:ds,pageSize:20,displayMsg:"显示第 {0} 条到 {1} 条记录，一共 {2} 条",emptyMsg:"没有记录"});
//	var browser = new Ext.form.TriggerField({id:"respnBrows",readOnly:true,width:200,emptyText:"请选择责任中心...",triggerClass:"x-form-search-trigger"});
//	browser.onTriggerClick = browseRespn;
	//browser.applyToMarkup('my-field');

	var now = new Date();
	var vYear = now.getFullYear();
	
//	var yearRanges = [['2010', '2010年'], ['2011', '2011年'], ['2012', '2012年'],['2013', '2013年'],['2014', '2014年']];
//	var yearValue = new Ext.data.SimpleStore({fields: ["yearID", "yearName"],data: yearRanges});

	
//	combCaseCode = new Ext.form.ComboBox({  		
//  						id:"combCaseCode",
//  						fieldLabel:"选择年份",
//  						displayField:"yearName",
//  						valueField:"yearID",
//  						value:vYear,
//  						editable:false,
//  						triggerAction:"all",
//  						store: yearValue,   
//  						mode:"local",
//  						width:100, 
//  						hiddenName:"yearID"
//  					});
	var cmbCase = new bcm.component.CaseListComboBox(
	{
		id : "cmbCase",
		width : 120,
		xy_InitLoadData : true,
		xy_InitDataID : this.m_CurrentCode,
		xy_ParentObjHandle : this,
		xy_ValueChangeEvent : function()
		{
			tgfieldRespn.clearSelections();
		}
	});

	var tgfieldRespn = new bcm.component.RespnTreeField(
	{
		id : "tgfieldRespn",
		width : 200,
		emptyText : "请选择或输入",
		xy_LeafOnly : false,
		xy_MultiSelectMode : false,
		xy_ParentObjHandle : this,
		xy_AllowInput : true,
		baseBeforeClickValid : function()
		{
			if (! cmbCase.getSelected())
			{
				MsgUtil.alert("请先选择预算年份");
				return false;
			};

			if (ssc.common.StringUtil.isEmpty(Ext.get("m8_companyid").dom.value))
			{
				MsgUtil.alert("单位参数不确定");
				return false;
			}

			return true;
		}.createDelegate(this),
		prepareBaseParams : function()
		{
			var param =
			{
				casecode : cmbCase.getKeyValue(),
				unitid : Ext.get("m8_companyid").dom.value,
				textfield : "[,respnCode,],respnName"
			};
			return param;
		}.createDelegate(this)
	});

  	importButton = new Ext.Button(
	{
		text : "导入",
		iconCls : "import",
		handler : importData,
		disabled : true
	});

  	m_budgetGrid = new Ext.grid.GridPanel(
	{
		id : "budgetGrid",
		region : 'center',
		store : ds,
		selModel : new Ext.grid.RowSelectionModel(
		{
			singleSelect : true
		}),
		colModel : cm,
		loadMask : true,
		tbar : [ "预算方案:", cmbCase, "-",
		         "选择责任中心:", tgfieldRespn, "-",
		{
			text : "打开",
			iconCls : "browser",
			handler : openFile
		}, '-',
		importButton,
		"->", "当前预算导入单位：[" + Ext.get("m8_companycode").dom.value + "]" + Ext.get("m8_companyname").dom.value],
		enableColumnMove : false,
		enableHdMenu : false
	});

	center = {xtype:'panel',region:"center",layout:'fit',border:false,items:[m_budgetGrid]};		
    var vpAll = new Ext.Viewport({layout:'border',items:[center]});

//    combCaseCode.on("select", this.combYearSelect, this)
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);