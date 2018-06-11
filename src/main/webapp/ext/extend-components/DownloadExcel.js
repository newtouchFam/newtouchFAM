/**
 * 构造函数
 * @param 1:序号
 * @param 2:列名
 * @param 3:列宽,默认100
 * @param 4:列对齐方式
 * @param 5:是否隐藏列
 */
function getColumnInfo(gird)
{
	var columnModel = gird.getColumnModel();
	
	var store = gird.getStore();
	
	if(columnModel == null||store == null)
	{
		return false;
	}
	
	var columnInfo = [];
	
	for(var i=0 ;i<=columnModel.getColumnCount();i++)
	{
		var columnLine = columnModel.getColumnById(i);
		if(columnLine == null||columnLine==undefined)
		{
			continue;
		}
		var column = [];
		column[0] = i-1;
		column[1] = columnLine.header!=null?columnLine.header:"";
		column[2] = columnLine.width!=null?columnLine.width:150;
		if(columnLine.align == null)
		{
			column[3] = 1;
		}
		else
		{
			if(columnLine.align.toUpperCase() == "LEFT")
			{
				column[3] = 1;
			}
			else if(columnLine.align.toUpperCase() == "CENTER")
			{
				column[3] = 2;
			}
			else if(columnLine.align.toUpperCase() == "RIGHT")
			{
				column[3] = 3;
			}
		}
		column[4] = columnLine.hidden!=null?columnLine.hidden:false;
		if(column[4] == true)
		{
			continue;
		}
		column[5] = columnLine.exportType!=null?columnLine.exportType:'';
		columnInfo.push(column);
		
	}
	if(columnInfo.length ==0)
	{
		return false;
	}
	
	return columnInfo;
}

function downloadExcel(url,gird)
{
	var columnInfo = this.getColumnInfo(gird);
	if(columnInfo == false)
	{
		return false;
	}
	var store = gird.getStore();
	store.baseParams["listColumnInfo"] = columnInfo;
	
	var box = Ext.MessageBox.show({
										msg :'导出中,请稍候...',
										progressText: '',
										width : 200,
										height:100,
										wait : true,
										waitConfig : {
											interval : 250
										}
					     		     });
					     		     
	Ext.Ajax.request(
	{
		url:url,
		params:store.baseParams,
		success:function(response){
				var fileAddress = Ext.util.JSON.decode(response.responseText);
			var newUrl = document.getElementById('basePath').value+"SSC/excelDownload.action";
			var form = new Ext.form.FormPanel({
			url: newUrl,
			hidden : true,
			hideMode: 'offsets',
			method: 'POST',
			standardSubmit : true,
			items: [{xtype: 'hidden', name : 'dummy', value: ''}]  // extJs required at least on field
		});
		
			form.render(document.body);
			// set the url and the target of the form
			form.getForm().getEl().dom.action = newUrl;
			form.getForm().getEl().dom.target = "_self"; // this is the trick!!!!
			form.add({
					xtype: 'hidden', 
					name : 'inputPath', 
					value: fileAddress.fileAddress
				});
	
			// render the fields
			form.doLayout();
			
			// form submit
			form.getForm().submit();
			
			// destroy form and garbage stuff
			form.destroy();
			delete form;
			box.hide();
			//返原这个参数
			store.baseParams["listColumnInfo"] = "";
		},
		failure:function(response,optional){
			
		}
		
	});
}
function downFile(filename) 
{	
    var newUrl = document.getElementById('basePath').value+"SSC/excelDownload.action";
	var oForm = document.createElement("form");
	oForm.id = "freesky-postForm";
	oForm.name = "freesky-postForm";
	oForm.method = "get";
	oForm.action = newUrl;
	oForm.target = '_blank';
	oForm.style.display = "none";
	
	var jsonObj = {
	    inputPath : filename
	};

	for(var prop in jsonObj)
	{
		var oInput = document.createElement("input");
		oInput.name = prop;
		oInput.value = jsonObj[prop]; 
		oForm.appendChild(oInput);
    }
	document.body.appendChild(oForm);
	oForm.submit();		
}

