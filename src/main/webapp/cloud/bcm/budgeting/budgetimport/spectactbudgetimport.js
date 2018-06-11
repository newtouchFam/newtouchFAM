var ds = null;//数据
var addWin = null;
var uploadWin = null;
var panel = null;
var m_budgetGrid = null;
var combCaseCode = null;
var filePath = null;//服务端传回的文件路径
var importButton = null;//导入按钮

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
        var row1 = {layout:'column',
					items:[{layout : 'form',
							items:[{fieldLabel : '选择文件',
			                        width:300,
			                        id:"upload",
					                xtype : "fileuploadfield",
					                emptyText:"请选择导入文件..."}],
					        name : 'upload'
							}]};

		var row2 = {layout:'column',
					items:[{items:[{text:"提示：必须按照下载的模板格式导入",
				                    width:300,
				                    xtype:"label"}]
						}]};
		var row3 = {layout:'column',
						items:[{items:[{html:"<a href='"+Ext.get('basePath').dom.value+"BCM/exportSpectactModel.action?yearID="+Ext.getCmp('combCaseCode').getValue()+"'><font color = 'red'>模板下载</font></a>"}]
					}]};
		
	panel = new Ext.FormPanel({
            frame : true,
            fileUpload : true,
            labelWidth:60,
            collapsible : true,
			autoHeight : true,
			labelAlign : 'right',
			autoWidth : true,  
            items : [row1,row2, row3]
        });
        
//    panel2 = new Ext.FormPanel({
//            frame : true,
//            fileUpload : true,
//            labelWidth:60,
//            collapsible : true,
//			autoHeight : true,
//			labelAlign : 'right',
//			autoWidth : true,  
//            items : [row3]
//        });
        
	uploadWin = new Ext.Window({
                //el : 'htupload',
                title : '文件上传',
                closable : false,
                width : 400,
                height : '100%',
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
                            success : function(form, action) 
                            {
                            	uploadWin.close();
                            	uploadWin = null;
                            	importButton.enable();
                            	
                            	var newdata = {
                                   data : action.result.data
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
    
function importData()
{
	var yearID = combCaseCode.value;
	if(yearID == null)
	{
		MsgUtil.alert("提示","请选择导入年份!");
		return;
	}

	var service = new com.freesky.ssc.bcm.budget.BudgetImport.BudgetImportService();

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
			strSpecactName:rd.get('Name'),
			strSpecactCode:rd.get('Code'),
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
				
		service.SpecActBudgetImportGridActionBySumbit(yearID,recordss,spectactCallBack, this);
}

function spectactCallBack(response)
{
	var data = Ext.decode(response.responseText);
	if(data.success == true)
	{
		MsgUtil.alert("提示","数据全部导入成功！");
	}
	else
	{
		MsgUtil.alert("提示",data.msg);
		return;
	}

}

function init()
{
	Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
	var m_RowNum = new Ext.grid.RowNumberer();
	var m_spectactName = {header:"专项活动名称",dataIndex:"Name",width:250};
  	var m_spectactCode = {header:"专项活动代码",dataIndex:"Code",width:100};
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
	var cm = new Ext.grid.ColumnModel([m_RowNum,m_spectactName,m_spectactCode,m_dataValue01,m_dataValue02,m_dataValue03,m_dataValue04,m_dataValue05,m_dataValue06,m_dataValue07,m_dataValue08,m_dataValue09,m_dataValue10,m_dataValue11,m_dataValue12]);

	var now = new Date();
	var vYear = now.getFullYear();
	
	var yearRanges = [['2010', '2010年'], ['2011', '2011年'], ['2012', '2012年'],['2013', '2013年'],['2014', '2014年']];
	var yearValue = new Ext.data.SimpleStore({fields: ["yearID", "yearName"],data: yearRanges});
	
	combCaseCode = new Ext.form.ComboBox({  		
  						id:"combCaseCode",
  						fieldLabel:"选择年份",
  						displayField:"yearName",
  						valueField:"yearID",
  						value:vYear,
  						editable:false,
  						triggerAction:"all",
  						store: yearValue,   
  						mode:"local",
  						width:100, 
  						hiddenName:"yearID"
  					});
		
  	importButton = new Ext.Button({text:"导入",iconCls:"import",handler:importData,disabled:true});
  	
  	
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
		tbar : [ "选择年份:", combCaseCode, '-',
		{
			text : "打开",
			iconCls : "browser",
			handler : openFile
		}, '-', importButton,
		"->", "当前预算导入单位：[" + Ext.get("m8_companycode").dom.value + "]" + Ext.get("m8_companyname").dom.value ],
		enableColumnMove : false,
		enableHdMenu : false
	});
	var center = {region:"center",layout:'fit',border:false,items:[	m_budgetGrid]};		
	
    var vpAll = new Ext.Viewport({layout:'border',items:[center]});
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);