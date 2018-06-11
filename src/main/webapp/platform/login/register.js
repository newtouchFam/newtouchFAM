 $(function () {
	 $('select').searchableSelect();
 })
 
 function check()
{
	var CompanyName = $("#CompanyName").val();
	var CompanyEmail = $("#CompanyEmail").val();
	var AdminID = $("#AdminID").val();
	var AdminPWD = $("#AdminPWD").val();
	var AdminPhone = $("#AdminPhone").val();
	var RegistrationName = $("#RegistrationName").val();
	var FdbNumber = document.getElementById("FdbNumber").value;
	if(CompanyName == "" || CompanyName == null)
	{
		layer.alert("请输入公司名称！");
		return ;
	}
	if(CompanyEmail == "" || CompanyEmail == null)
	{
		layer.alert("请输入公司邮箱！");
		return ;
	}
	if(AdminID == "" || AdminID == null)
	{
		layer.alert("请输入账号！");
		return ;
	}
	if(AdminPWD == "" || AdminPWD == null)
	{
		layer.alert("请输入密码！");
		return ;
	}
	if(RegistrationName == "" || RegistrationName == null)
	{
		layer.alert("请输入姓名！");
		return ;
	}
	if(AdminPhone == "" || AdminPhone == null)
	{
		layer.alert("请输入手机号码!");
		return ;
	}
	if(FdbNumber == "" || FdbNumber == null)
	{
		layer.alert("请选择账套数！");
		return ;
	}
	
	var param = 
	{
		CompanyName : CompanyName,
		CompanyEmail : CompanyEmail,
		AdminID : AdminID,
		AdminPWD : AdminPWD,
		AdminPhone : AdminPhone,
		FdbNumber : FdbNumber,
		RegistrationName : RegistrationName
	}
	
	$.ajax(
	{
		url : "csmanager/companyregister/getInfo",
	    type : "post",
	    dataType : 'json',
	    data: 
	    {
	    	"jsonString" : JSON.stringify(param)
	    },
	    
	    
		success : function(data)
		{
			//layer.alert(data.msg.toString());
			//if(data.msg.length > 0 )
			if(data.success)
			{
				layer.alert("试用申请提交成功,稍后我们会发送试用信息到您的公司邮箱");	
			}
			else
			{
				layer.alert(data.msg.toString());
			}
			
		},
		error:function(data)
		{
			layer.alert(data.msg.toString());
        }
	});
	
	/*
	Ext.Ajax.request(
	{
		type : "post",
		url : "csmanager/companyregister/getInfo",
		params :
		{
			jsonString : Ext.encode(param)
      	},
      	async:false,
		success : function(response)
		{
			layer.alert("试用申请提交成功,稍后我们会发送试用信息到您的公司邮箱");
		},
		failure : function(response)
		{      
			layer.alert(response.responseText);
		},
		scope:this
	});
	*/
	
}