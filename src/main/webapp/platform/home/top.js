
function init()
{
	var isie = document.all ? true : false;
	if(isie)
	{
		document.getElementById('setId').innerText = Ext.get("M8_SETID").dom.value;
	    document.getElementById('compName').innerText = Ext.get("M8_COMPANYNAME").dom.value;
	    document.getElementById('userName').innerText = Ext.get("M8_USERNAME").dom.value;
	}
	else
	{
	    document.getElementById('compName').textContent = Ext.get("M8_COMPANYNAME").dom.value;
		document.getElementById('userName').textContent = Ext.get("M8_USERNAME").dom.value;
		document.getElementById('setId').textContent = Ext.get("M8_SETID").dom.value;
	}
	
	getTitltMenu();
	
	getperiod();
}

function getperiod()
{
	Ext.Ajax.request(
	{
		url : "datamanager/periodmanager/curperiod",
		method : "post",
		params :"",
		success : function(response) 
		{
			var obj = Ext.decode(response.responseText);
			if(obj.success)
	    	{
				var period = document.getElementById("period")
				period.innerHTML=obj.period;
	    	}
		}
	});
}

function getTitltMenu()
{
	Ext.Ajax.request(
	{
		url : "menu/menutree",
		method : "post",
		params :
		{
			node :"LeftButton_M8"
		},
		success : function(response) 
		{
			var r = Ext.decode(response.responseText);
			
			var str = "";
			str += "<a href='javascript:button()' class='easyui-linkbutton l-btn l-btn-small' data-options='' style='width:70px'><span class='l-btn-left' style=\"margin-top: 0px;\"><span class=\"l-btn-text\">首页</span></span></a>";
			for(var i = 0; i<r.length; i++)
			{
				var obj = r[i];
				str+= "<a href='javascript:click(\""+obj.id+"\")' class='easyui-linkbutton l-btn l-btn-small' data-options='' style='width:70px'><span class='l-btn-left' style=\"margin-top: 0px;\"><span class=\"l-btn-text\">"+obj.text+"</span></span></a> "
			}
			var tool = document.getElementById("tool");
			tool.innerHTML=str.toString();
			$("#tool a").click(function(){
				$(this).addClass("l-btn-focus").siblings().removeClass("l-btn-focus");
			})
		}
	});
}

function logout()
{
	Ext.Ajax.request(
	{
		url : "platform/security/logout",
		method : "post",
		sync : true,
		success :  function(response)
		{
			var data = Ext.decode(response.responseText);
			if (data.success)
			{
				var path = getContextPath();
				top.location = path+"/platform/login/login.jsp";
			}
			else
			{
				Ext.Msg.alert("提示", data.error);
			}
		},
		failure : this.baseFailureCallbackFun,
		scope : this
	});
}
function getContextPath() 
{
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0,index+1);
    return result;
 }

function click(node) 
{			
	window.parent.loadTree(node);
}

function button() 
{
	window.parent.addmain();
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);