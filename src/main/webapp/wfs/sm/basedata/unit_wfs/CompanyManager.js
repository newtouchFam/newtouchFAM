Ext.namespace('companyeditchoose.companymanager');

companyeditchoose.companymanager.company = Ext.extend(Ext.FormPanel,
{
	frame : true,
	height : 120,
	
    border : false,
  
    getCompany : function()
	{	
		var id = document.getElementById("M8_COMPANYID").value;
		
		Ext.Ajax.request
		({
			url : "sm/unit/get",
		    method : "post",
    	    params :
    	    {
    	    	unitid : id
    	    },
    	    success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success)
				{
					Ext.getCmp("companycode").setValue(r.data.unitCode);
					Ext.getCmp("companyname").setValue(r.data.unitName);
					Ext.getCmp("address").setValue(r.data.address);
					Ext.getCmp("manProxy").setValue(r.data.corporation);
					Ext.getCmp("companyProperty").setValue(r.data.property);
					Ext.getCmp("fax").setValue(r.data.fax);
					Ext.getCmp("email").setValue(r.data.email);
					Ext.getCmp("comment").setValue(r.data.memo);
					Ext.getCmp("tel").setValue(r.data.tel);
					
					Ext.getCmp("unitID").setValue(r.data.unitID);
					Ext.getCmp("status").setValue(r.data.status);
					Ext.getCmp("attrStatus").setValue(r.data.attrStatus);
					Ext.getCmp("parentID").setValue(r.data.parentID);
					Ext.getCmp("isLeaf").setValue(r.data.isLeaf);
					Ext.getCmp("level").setValue(r.data.level);
					Ext.getCmp("fullCode").setValue(r.data.fullCode);
					Ext.getCmp("fullName").setValue(r.data.fullName);
					Ext.getCmp("formattedCode").setValue(r.data.formattedCode);
					Ext.getCmp("formattedName").setValue(r.data.formattedName);
				}
			}	
		});
	},  
    initComponent : function ()
	{
    	
    	this.companycode = new Ext.form.TextField(
    	{
    		id : 'companycode',
    		fieldLabel :'公司编号',
    		readOnly : false,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : false
    	});
    	
    	this.companyname = new Ext.form.TextField(
    	{
    		id : 'companyname',
    		fieldLabel :'公司名称',
    		readOnly : false,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : false
    	});		
    	
    	this.address = new Ext.form.TextField(
    	{
    		id : 'address',
    		fieldLabel :'公司地址',
    		readOnly : false,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : true
    	});	
    	
    	this.companyProperty = new Ext.form.TextField(
    	{
    		id : 'companyProperty',
    		fieldLabel :'单位性质',
    		readOnly : false,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : true
    	});	
    	
    	this.manProxy = new Ext.form.TextField(
    	{
    		id : 'manProxy',
    		fieldLabel :'法人代表',
    		readOnly : false,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : true
    	});
    	
    	this.fax = new Ext.form.TextField(
    	{
    		id : 'fax',
    		fieldLabel :'传真',
    		readOnly : false,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : true
    	});
    	
    	this.tel = new Ext.form.TextField(
    	{
    		id : 'tel',
    		fieldLabel :'电话',
    		readOnly : false,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : true
    	});
    	
    	this.email = new Ext.form.TextField(
    	{
    		id : 'email',
    		fieldLabel :'邮箱',
    		readOnly : false,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : true
    	});
    	
    	this.comment = new Ext.form.TextField(
    	{
    		id : 'comment',
    		fieldLabel :'公司备注',
    		readOnly : false,
     	    labelStyle : 'text-align:right;',
     	    allowBlank : true
    	});
    	
    	this.unitID = new Ext.form.Hidden(
		{
			id : 'unitID'
		});
    	
    	this.status = new Ext.form.Hidden(
		{
			id : 'status'
		});
    	
    	this.attrStatus = new Ext.form.Hidden(
		{
			id : 'attrStatus'
		});
    	
    	this.parentID = new Ext.form.Hidden(
		{
			id : 'parentID'
		});
    	
    	this.isLeaf = new Ext.form.Hidden(
		{
			id : 'isLeaf'
		});
    	
    	this.level = new Ext.form.Hidden(
		{
			id : 'level'
		});
    	
    	this.fullCode = new Ext.form.Hidden(
		{
			id : 'fullCode'
		});
    	
    	this.fullName = new Ext.form.Hidden(
		{
			id : 'fullName'
		});
    	
    	this.formattedCode = new Ext.form.Hidden(
		{
			id : 'formattedCode'
		});
    	
    	this.formattedName = new Ext.form.Hidden(
		{
			id : 'formattedName'
		});
    	
    	this.buttons = new Ext.Button(
    	{
    		id : "buttons",
    		text :'保存',
    		buttonAlign : 'center',
			handler : this.saveHandler,
			minWidth:70,
			scope : this
    	}); 
     	/*this.buttons = [
   	    {	
   	    	text : '保存',
   	    	handler : this.saveHandler,
   	    	scope : this
   	    }];
     	*/
     	/*var label = new Ext.form.Label
        ({
            id:"label",
            text:""
        });*/
     	
    	var row0=
     	{
 			layout : 'column',
            border : false,            
			height : 20	     	
		}
   		var row1 =
        {
			layout : 'column',
            border : false,
            height : 35,
            items :[
            {
			    columnWidth : .02,
			    border : false,
			    height : 20
			},
			{
                columnWidth : .30,
                layout : 'form',
                border : false,
                defaults : 
                {
                    width : 170,
                    height : 20
                },
               items : [this.companycode],
			    height : 20
            }
			,  
            {
	            columnWidth : .30,
	            layout : 'form',
	            border : false,
	            defaults : 
                {
                    width : 170,
    			    height : 20
                },
	             items : [this.companyname],
				 height : 20
	        },
	        {
			    columnWidth : .20,
			    border : false,
			    height : 20
			},
			 {
                columnWidth : .30,
                layout : 'form',
                border : false,
			    height : 20
	        }
	        
	        ]
//            ,
//	        {
//			    columnWidth : .25,
//			    border : false,
//			    defaults : {
//                    width : 170
//			    }
//			}
        };
    	
    	var row2 =
        {
            layout : 'column',
            border : false,
            height : 35,
            items : [
			{
			    columnWidth : .02,
			    border : false,
			    height : 20
			},
            {
                columnWidth : .30,
                layout : 'form',
                border : false,
                defaults : {
                    width : 170,
                    height : 20
	            },
	                items : [this.address],
				    height : 20
	        },
	        {
	            columnWidth : .30,
	            layout : 'form',
	            border : false,
	            defaults : {
	                width : 170,
	                height : 20
	            },    	
	              items : [this.companyProperty],
				  height : 20
	        },
	        {
			    columnWidth : .20,
			    border : false,
			    height : 20
			}]  	
		};
    	
    	var row3 =
        {
            layout : 'column',
            border : false,
            height : 35,
            items : [
            {
            	columnWidth : .02,
 			    border : false,
 			    height : 20
			},
			{
                columnWidth : .30,
                layout : 'form',
                border : false,
                defaults : {
                    width : 170,
                    height : 20
                },
                items : [this.manProxy],
			    height : 20
	        },
	        {
	            columnWidth : .30,
	            layout : 'form',
	            border : false,
	            defaults : {
	                width : 170,
	                height : 20
	            },    	
	            items : [this.fax],
			    height : 20
	        },
	        {
			    columnWidth : .20,
			    border : false,
			    defaults : {
                    width : 170,
                    border : false,
    			    height : 20
			    }
			}]  	
        };
    	
    	var row4 =
        {
            layout : 'column',
            border : false,
            height : 35,
            items : [
			{
			    columnWidth : .02,
			    border : false,
			    height : 20
			},
            {
                columnWidth : .30,
                layout : 'form',
                border : false,
                defaults : 
                {
                    width : 170,
                    height : 20
                },
                items : [this.comment],
			    height : 20
	        },
	        {
	            columnWidth : .30,
	            layout : 'form',
	            border : false,
	            defaults : 
	            {
	                width : 170,
	                height : 20
	            },    	
	            items : [this.email],
			    height : 20
	        },
	        {
			    columnWidth : .20,
			    border : false,
			    height : 20
			}]  	
		};
    	
    	var row5 =
        {
            layout : 'column',
            border : false,
            height : 35,
            items : [
			{
			    columnWidth : .02,
			    border : false,
			    height : 20
			},
            {
                columnWidth : .30,
                layout : 'form',
                border : false,
                defaults : 
                {
                    width : 170,
                    height : 20
                },
                items : [this.tel,this.buttons],
			    height : 20
	        }]
        };
    	
    	var row6 =
        {
            layout : 'column',
            border : false,
            labelAlign : "right",
            labelWidth : 100,
            style : 'margin-left:105px;',
            height : 35,
            items : [
 			{
 			    columnWidth : .022,
 			    border : false,
 			    height : 20
 			},
             {
                 columnWidth : .30,
                 layout : 'form',
                 border : false,
                 defaults : 
                 {
                     width : 170,
                     height : 20
                 },
                 items : [this.buttons],
 			    height : 20
 	        }]
           /* items : [this.buttons]*/
        };
   
    this.items=[row0,row1,row2,row3,row4,row5,row6];
    
  //  this.getCompany().on('load',this.loaded,this);
    
    companyeditchoose.companymanager.company.superclass.initComponent.call(this); 
    
    this.getCompany();
    
	},
	
	saveHandler : function()
	{
		var unitID = this.unitID.getValue();
		var unitCode = this.companycode.getValue();
		var unitName = this.companyname.getValue();
		var status = this.status.getValue();
		var attrStatus = this.attrStatus.getValue();
		var parentID = this.parentID.getValue();
		var isLeaf = this.isLeaf.getValue();
		var level = this.level.getValue();
		var fullCode = this.fullCode.getValue();
		var fullName = this.fullName.getValue();
		var formattedCode = this.formattedCode.getValue();
		var formattedName = this.formattedName.getValue();
		var memo = this.comment.getValue();
		var corporation = this.manProxy.getValue();
		var property = this.companyProperty.getValue();
		var address = this.address.getValue();
		var tel = this.tel.getValue();
		var fax = this.fax.getValue();
		var email = this.email.getValue();
		
		if(level == "" || level == null)
		{
			var level = '1';
		}
		if(unitCode == null || unitCode == "")
		{
			Ext.Msg.alert("提示", "公司编号不能为空");
			return ;
		}
		if(unitName == null || unitName == "")
		{
			Ext.Msg.alert("提示", "公司名字不能为空");
			return ;
		}
		
		var data = 
		{
			unitID: unitID,
			unitCode: unitCode,
			unitName: unitName,
			status: status,
			attrStatus: attrStatus,
			parentID: parentID,
			isLeaf: isLeaf,
			level: level,
			fullCode: fullCode,
			fullName: fullName,
			formattedCode: formattedCode,
			formattedName: formattedName,
			memo: memo,
			corporation: corporation,
			property: property,
			address: address,
			tel: tel,
			fax: fax,
			email: email
		};
		
		Ext.Ajax.request
		({
			url : "sm/unit/update",
		    method : "post",
    	    params :
    	    {
    	    	jsonString : Ext.encode(data)
    	    },
    	    success : function(response)
			{
    	    	Ext.Msg.alert("提示","保存成功");
			},
			failure : function(response)
			{
				Ext.Msg.alert('服务器处理数据出错',"错误信息为:"+data.errDesc);
			},
			scope:this
		});
	}
});

function init()
{
	new Ext.Viewport(
	{
		layout : 'fit',
		items : [ new companyeditchoose.companymanager.company ]
	});
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);