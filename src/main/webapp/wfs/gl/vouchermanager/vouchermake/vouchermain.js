Ext.namespace('gl.vouchermanager.vouchermake');
gl.vouchermanager.vouchermake.vouchermain = Ext.extend(Ext.Panel,
{
	id : 'gl.vouchermanager.vouchermake.vouchermain',
	layout : 'border',
    frame : true,
    isView : false,
    border : false,
    vouchertag : null,
    voucherbooktag : null,
    voucherid : null,
    //新增标志位，判断是否已经打开凭证页面
    isOpenVoucher : true,
    //在voucherdetail.js设置isCanOffset的值，判断能否冲销
    isCanOffset : true,
    //所有改变了分摊金额的分户
    allChangeName : null,
    //所有分摊金额小于总的冲销金额的分户
    allOffsetName : null,
    isChangeMoney : false,
	initComponent : function ()
	{
		var voucherform = new gl.vouchermanager.vouchermake.voucherform({id : "voucherform", isView : this.isView, vouchertag : this.vouchertag, framevoucherid : this.voucherid});
		var voucherdetail = new gl.vouchermanager.vouchermake.voucherCenter({id : "voucherdetail", isView : this.isView, vouchertag : this.vouchertag, framevoucherid : this.voucherid, isOpenVoucher : this.isOpenVoucher});
		var lineUp =
	    {
	        html : "<hr style='background-color:orange;margin:0;height:5px;border-width:0;'>"
	    };
		
	    var lineDown =
	    {
	        html : "<hr style='background-color:orange;margin:0;height:5px;border-width:0;'>"
	    };
	    
	    var pnlSplit3 = new Ext.Panel(
	    {
	        html : "<div class='xy-wf-tb-bottom-pnl-spr'></div>",
	        height : 3,
	        border : false
	    });
	    
	    var htmCheckDesc = "<div class='xy-voucher-itemmgr-checkdesc' height='11px'>"
	            + "<table cellspacing='0' >"
	            + "<tr>"
	            + "<td width='16%'><span id='lab_AccountManager'>&nbsp;&nbsp;&nbsp;&nbsp;会计主管：</span></td>"
	            + "<td width='16%'><span id='lab_AccountName'>记账：</span></td>"
	            + "<td width='16%'><span id='lab_CashName'>出纳：</span></td>"
	            + "<td width='16%'><span id='lab_CheckName'>审核：</span></td>"
	            + "<td width='16%'><span id='lab_FillerName'>制单：</span></td>"
	            + "</table>" + "</div>";
	    
	    var pnlCheckDesc = new Ext.Panel(
	    {
	        html : htmCheckDesc,
	        height : 23,
	        border : false
	    });
	    
	    var pnlSplit4 = new Ext.Panel(
	    {
	        html : "<div class='xy-wf-tb-top-pnl-spr'></div>",
	        height : 6,
	        border : false
	    });
	    
	    var mainBottom =
	    {
	        id : "mainBottom",
	        region : "south",
	        height : 28,
	        items : [pnlSplit3, pnlCheckDesc, pnlSplit4],
	        border : false
	    };
	    
	    var saveButton =
		{
			text : '保存',
			iconCls : "xy-save",
			handler : this.saveHandler,
			scope : this
		};
	    
	    var editButton =
		{
			text : '保存',
			iconCls : "xy-save",
			handler : this.editHandler,
			scope : this
		};

		var printButton =
		{
			text : "打印",
			iconCls : "xy-print",
			handler : this.printHandler,
			scope : this
		};

	    var closeButton =
		{
			text : '关闭',
			iconCls : "xy-close",
			handler : this.closeHandler
		};
	    
	    var newButton =
		{
			text : '新建',
			iconCls : "xy-add",
			handler : this.newHandler,
			scope : this
		};
	    
	    if(this.vouchertag == '0')
	    {
	    	this.tbar = [ saveButton, newButton, "->", closeButton ];
	    }
	    else if(this.vouchertag == '1' && this.isView == false)
	    {

	    	this.tbar = [ editButton, printButton, "->", closeButton ];
	    }
	    else if(this.voucherbooktag == '1')
	    {
	    	this.tbar = [ printButton];
	    }
	    else
	    {
	    	this.tbar = [ printButton, "->", closeButton];
	    }
	    
		this.items = [
		{
	        region : "north",
	        height : 80,
	        items : [ voucherform, lineUp ]
	    },
	    voucherdetail,
	    {
	        region : "south",
	        layout : "form",
	        height : 40,
	        items : [ lineDown, mainBottom ]
	    }];
		gl.vouchermanager.vouchermake.vouchermain.superclass.initComponent.call(this);
	},
	newHandler : function()
	{
		Ext.MessageBox.confirm('提示', '请确认是否新建一张新凭证?', function(button, text)
        {
            if (button == 'yes')
            {	
            	var numberingnull = 
            	{
            		column0 : '',
            		column1 : ''
            	};
            	Ext.getCmp("uqnumbering").setXyValue(numberingnull);
            	Ext.getCmp("intaffix").setValue('');
            	Ext.getCmp("vouchergriddetail").getStore().removeAll();
            }
        }); 
	},
	closeHandler : function()
	{
    	Ext.getCmp("voucherwin").close();
	},
	editHandler : function ()
	{
		//1.校验数据
		var mainvalidate = Ext.getCmp("voucherform").validate();
		var detailvalidate = Ext.getCmp("voucherdetail").grid.validate();
		
		if(!mainvalidate)
		{
			return;
		}
		
		if(!detailvalidate)
		{
			return;
		}
		if(this.isChangeMoney)
    	{
    		Ext.Msg.alert("提示",this.allChangeName+"分录金额已修改，与原来需冲销金额不一致，不能核销");
    		return false;
    	}
    	if(!this.isCanOffset)
    	{
    		Ext.Msg.alert("提示",this.allOffsetName+"冲销总金额大于分录需冲销金额，不能保存");
    		return false;
    	}
		
		//2.获取main和detail的commitjson
		var jsonmain = Ext.getCmp("voucherform").getCommitData();
		var jsondetail = Ext.getCmp("voucherdetail").grid.getCommitData();
		//console.log(jsondetail);
		
		//3.ajax请求提交到服务端处理
		Ext.Ajax.request(
		{
			url : "vouchermanager/vouchermain/edit",
			params :
			{
				jsonmain : Ext.encode(jsonmain),
				jsondetail : Ext.encode(jsondetail)
          	},
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success)
				{
					Ext.Msg.alert("提示", "凭证修改成功");
					Ext.getCmp("vouchermakedetail").getStore().reload();
				}
				else
				{
					Ext.Msg.alert("错误", r.msg);
				}
			},
			failure : function(response)
			{
				Ext.Msg.alert("错误","保存失败！");
				return;
			},
			scope:this
		});
	},
	saveHandler : function ()
	{
		//1.校验数据
		var mainvalidate = Ext.getCmp("voucherform").validate();
		var detailvalidate = Ext.getCmp("voucherdetail").grid.validate();
		
		if(!mainvalidate)
		{
			return;
		}
		
		if(!detailvalidate)
		{
			return;
		}
		
		if(this.isChangeMoney)
    	{
    		Ext.Msg.alert("提示",this.allChangeName+"分录金额已修改，与原来需冲销金额不一致，不能核销");
    		return false;
    	}
    	if(!this.isCanOffset)
    	{
    		Ext.Msg.alert("提示",this.allOffsetName+"冲销总金额大于分录需冲销金额，不能保存");
    		return false;
    	}
		
		//2.获取main和detail的commitjson
		var jsonmain = Ext.getCmp("voucherform").getCommitData();
		var jsondetail = Ext.getCmp("voucherdetail").grid.getCommitData();
		//3.ajax请求提交到服务端处理
		Ext.Ajax.request(
		{
			url : "vouchermanager/vouchermain/save",
			params :
			{
				jsonmain : Ext.encode(jsonmain),
				jsondetail : Ext.encode(jsondetail)
          	},
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success)
				{
					Ext.Msg.alert("提示", "凭证保存成功",function()
					{
						Ext.getCmp("vouchermakedetail").getStore().reload();
						
						//作为新建处理
						var numberingnull = 
		            	{
		            		column0 : '',
		            		column1 : ''
		            	};
		            	Ext.getCmp("uqnumbering").setXyValue(numberingnull);
		            	Ext.getCmp("intaffix").setValue('');
		            	Ext.getCmp("vouchergriddetail").getStore().removeAll();
//		            	console.log("removeAll");
			        });
					
				}
				else
				{
					Ext.Msg.alert("错误", r.msg);
				}
			},
			failure : function(response)
			{
				Ext.Msg.alert("错误","保存失败！");
				return;
			},
			scope:this
		});
	},
	/**
	 * 凭证打印
	 */
	printHandler : function()
	{
		var fieldVoucherID = Ext.getCmp("uqvoucherid");
		if (fieldVoucherID == null)
		{
			return;
		}

		var voucherid = fieldVoucherID.getValue();

		VoucherPrintUtil.voucher_printPDF(voucherid);
	}
});