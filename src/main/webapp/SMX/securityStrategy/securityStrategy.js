function saveOK()
{
	if(Ext.get("edtUserDefaultPsw").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","用户默认密码不能为空");
		return ;
	}
	else if(Ext.get("edtPswLength").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","用户密码长度必须大于零且不能为空");
		return ;
	}
	else if(Ext.get("edtPswLength").dom.value != parseInt(Ext.get("edtPswLength").dom.value))
	{
		top.Ext.MessageBox.alert("提示","用户密码长度必须是整数");
		return ;
	}
	else if(Ext.get("edtUserPswErrorCount").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","用户密码错误允许数必须大于零且不能为空");
		return ;
	}
	else if(Ext.get("edtUserPswErrorCount").dom.value != parseInt(Ext.get("edtUserPswErrorCount").dom.value))
	{
		top.Ext.MessageBox.alert("提示","用户密码错误允许数必须是整数");
		return ;
	}
	else if(Ext.get("edtUserPswValidDays").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","用户密码有效天数必须大于零且不能为空");
		return ;
	}
	else if(Ext.get("edtUserPswValidDays").dom.value != parseInt(Ext.get("edtUserPswValidDays").dom.value))
	{
		top.Ext.MessageBox.alert("提示","用户密码有效天数必须是整数");
		return ;
	}
	else if(Ext.get("edtUserPswValidDaysHint").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","用户有效期提示天数必须大于零且不能为空");
		return ;
	}
	else if(Ext.get("edtUserPswValidDaysHint").dom.value != parseInt(Ext.get("edtUserPswValidDaysHint").dom.value))
	{
		top.Ext.MessageBox.alert("提示","用户有效期提示天数必须是整数");
		return ;
	}
	else if(Ext.get("edtUserOldPswMemoryCount").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","用户旧密码记忆数必须大于零且不能为空");
		return ;
	}
	else if(Ext.get("edtUserOldPswMemoryCount").dom.value != parseInt(Ext.get("edtUserOldPswMemoryCount").dom.value))
	{
		top.Ext.MessageBox.alert("提示","用户旧密码记忆数必须是整数");
		return ;
	}
	else if(Ext.get("edtBossPswLength").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","管理员密码长度必须大于零且不能为空");
		return ;
	}
	else if(Ext.get("edtBossPswLength").dom.value != parseInt(Ext.get("edtBossPswLength").dom.value))
	{
		top.Ext.MessageBox.alert("提示","管理员密码长度必须是整数");
		return ;
	}
	else if(Ext.get("edtBossPswErrorCount").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","管理员密码错误允许数必须大于零且不能为空");
		return ;
	}
	else if(Ext.get("edtBossPswErrorCount").dom.value != parseInt(Ext.get("edtBossPswErrorCount").dom.value))
	{
		top.Ext.MessageBox.alert("提示","管理员密码错误允许数必须是整数");
		return ;
	}
	else if(Ext.get("edtBossPswValidDays").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","管理员密码有效天数必须大于零且不能为空");
		return ;
	}
	else if(Ext.get("edtBossPswValidDays").dom.value != parseInt(Ext.get("edtBossPswValidDays").dom.value))
	{
		top.Ext.MessageBox.alert("提示","管理员密码有效天数必须是整数");
		return ;
	}
	else if(Ext.get("edtBossEffectDaysHint").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","管理员有效期提示天数必须大于零且不能为空");
		return ;
	}
	else if(Ext.get("edtBossEffectDaysHint").dom.value != parseInt(Ext.get("edtBossEffectDaysHint").dom.value))
	{
		top.Ext.MessageBox.alert("提示","管理员有效期提示天数必须是整数");
		return ;
	}
	else if(Ext.get("edtBossOldPswHint").dom.value.length == 0)
	{
		top.Ext.MessageBox.alert("提示","管理员旧密码记忆数必须大于零且不能为空");
		return ;
	}
	else if(Ext.get("edtBossOldPswHint").dom.value != parseInt(Ext.get("edtBossOldPswHint").dom.value))
	{
		top.Ext.MessageBox.alert("提示","管理员旧密码记忆数必须是整数");
		return ;
	}
	else if(Ext.get("edtUserDefaultPsw").dom.value.realLength() < Ext.get("edtPswLength").dom.value.realLength())
	{
		top.Ext.MessageBox.alert("提示","默认密码长度不能小于密码长度！");
		return ;
	}
	else if(Ext.get("edtUserPswValidDays").dom.value < Ext.get("edtUserPswValidDaysHint").dom.value)
	{
		top.Ext.MessageBox.alert("提示","用户密码有效天数不能小于用户有效期提示天数！");
		return ;
	}
	else if(Ext.get("edtBossPswValidDays").dom.value < Ext.get("edtBossEffectDaysHint").dom.value)
	{
		top.Ext.MessageBox.alert("提示","管理员密码有效天数不能小于用户有效期提示天数！");
		return ;
	}
	else
	{
		var secArray = new Array();
	
    	secArray[0] = {
    		VALUE : Ext.get("edtUserDefaultPsw").dom.value,
    		ENABLE : '1',
    		NO : 'USER_PASSWORD_DEFAULT' 
    	};
    	if(Ext.getCmp("chbUserPswLength").getValue()===true)
    	{
    		secArray[1] = {
        		VALUE : Ext.get("edtPswLength").dom.value,
        		ENABLE : '1',
        		NO : 'USER_PASSWORD_LONG' 
        	};
    	}
    	else
    	{
    		secArray[1] = {
        		VALUE : Ext.get("edtPswLength").dom.value,
        		ENABLE : '0',
        		NO : 'USER_PASSWORD_LONG' 
        	};
    	}
    	if(Ext.getCmp("chbUserPswErrorCount").getValue() === true)
    	{
    		secArray[2] = {
        		VALUE : Ext.get("edtUserPswErrorCount").dom.value,
        		ENABLE : '1',
        		NO : 'USER_PASSWORD_COUNT' 
        	};
    	}
    	else
    	{
    		secArray[2] = {
        		VALUE : Ext.get("edtUserPswErrorCount").dom.value,
        		ENABLE : '0',
        		NO : 'USER_PASSWORD_COUNT' 
        	};
    	}
    	if(Ext.getCmp("chbUserPswValidDays").getValue() === true)
    	{
    		secArray[3] = {
        		VALUE : Ext.get("edtUserPswValidDays").dom.value,
        		ENABLE : '1',
        		NO : 'USER_PASSWORD_VALIDDAYS' 
        	};
    	}
    	else
    	{
    		secArray[3] = {
        		VALUE : Ext.get("edtUserPswValidDays").dom.value,
        		ENABLE : '0',
        		NO : 'USER_PASSWORD_VALIDDAYS' 
        	};
    	}
    	if(Ext.getCmp("chbUserPswValidDaysHint").getValue() === true)
    	{
    		secArray[4] = {
        		VALUE : Ext.get("edtUserPswValidDaysHint").dom.value,
        		ENABLE : '1',
        		NO : 'USER_PASSWORD_VALIDDAYS_HINT' 
        	};
    	}
    	else
    	{
    		secArray[4] = {
        		VALUE : Ext.get("edtUserPswValidDaysHint").dom.value,
        		ENABLE : '0',
        		NO : 'USER_PASSWORD_VALIDDAYS_HINT' 
        	};
    	}
    	if(Ext.getCmp("chbUserOldPswMemoryCount").getValue() === true)
    	{
    		secArray[5] = {
        		VALUE : Ext.get("edtUserOldPswMemoryCount").dom.value,
        		ENABLE : '1',
        		NO : 'USER_PASSWORD_REMEMBER' 
        	};
    	}
    	else
    	{
    		secArray[5] = {
        		VALUE : Ext.get("edtUserOldPswMemoryCount").dom.value,
        		ENABLE : '0',
        		NO : 'USER_PASSWORD_REMEMBER' 
        	};
    	}
    	if(Ext.getCmp("chbUserPswComplexity").getValue() === true)
    	{
    		secArray[6] = {
        		VALUE : "",
        		ENABLE : '1',
        		NO : 'USER_PASSWORD_COMPLEXITY' 
        	};
    	}
    	else
    	{
    		secArray[6] = {
        		VALUE : "",
        		ENABLE : '0',
        		NO : 'USER_PASSWORD_COMPLEXITY' 
        	};
    	}
    	if(Ext.getCmp("chbUserPwdEndNumber").getValue() === true)
    	{
    		secArray[7] = {
        		VALUE : "",
        		ENABLE : '1',
        		NO : 'USER_PASSWORD_ENDNUMBER' 
        	};
    	}
    	else
    	{
    		secArray[7] = {
        		VALUE : "",
        		ENABLE : '0',
        		NO : 'USER_PASSWORD_ENDNUMBER' 
        	};
    	}
    	if(Ext.getCmp("chbValidLowerCase").getValue() === true)
    	{
    		secArray[8] = {
        		VALUE : "",
        		ENABLE : '1',
        		NO : 'USERNAME_VALID_LOWERCASE' 
        	};
    	}
    	else
    	{
    		secArray[8] = {
        		VALUE : "",
        		ENABLE : '0',
        		NO : 'USERNAME_VALID_LOWERCASE' 
        	};
    	}
    	if(Ext.getCmp("chbBossPswErrLock").getValue() === true)
    	{
    		secArray[9] = {
        		VALUE : "",
        		ENABLE : '1',
        		NO : 'BOSS_PASSWORD_ERROR_LOCK' 
        	};
    	}
    	else
    	{
    		secArray[9] = {
        		VALUE : "",
        		ENABLE : '0',
        		NO : 'BOSS_PASSWORD_ERROR_LOCK' 
        	};
    	}
    	if(Ext.getCmp("chbBossPswOvertimeLock").getValue() === true)
    	{
    		secArray[10] = {
        		VALUE : "",
        		ENABLE : '1',
        		NO : 'BOSS_PASSWORD_OVERTIME_LOCK' 
        	};
    	}
    	else
    	{
    		secArray[10] = {
        		VALUE : "",
        		ENABLE : '0',
        		NO : 'BOSS_PASSWORD_OVERTIME_LOCK' 
        	};
    	}
    	if(Ext.getCmp("chbBossPswLength").getValue() === true)
    	{
    		secArray[11] = {
        		VALUE : Ext.get("edtBossPswLength").dom.value,
        		ENABLE : '1',
        		NO : 'BOSS_PASSWORD_LONG' 
        	};
    	}
    	else
    	{
    		secArray[11] = {
        		VALUE : Ext.get("edtBossPswLength").dom.value,
        		ENABLE : '0',
        		NO : 'BOSS_PASSWORD_LONG' 
        	};
    	}
    	if(Ext.getCmp("chbBossPswErrorCount").getValue() === true)
    	{
    		secArray[12] = {
        		VALUE : Ext.get("edtBossPswErrorCount").dom.value,
        		ENABLE : '1',
        		NO : 'BOSS_PASSWORD_COUNT' 
        	};
    	}
    	else
    	{
    		secArray[12] = {
        		VALUE : Ext.get("edtBossPswErrorCount").dom.value,
        		ENABLE : '0',
        		NO : 'BOSS_PASSWORD_COUNT' 
        	};
    	}
    	if(Ext.getCmp("chbBossPswValidDays").getValue() === true)
    	{
    		secArray[13] = {
        		VALUE : Ext.get("edtBossPswValidDays").dom.value,
        		ENABLE : '1',
        		NO : 'BOSS_PASSWORD_VALIDDAYS' 
        	};
    	}
    	else
    	{
    		secArray[13] = {
        		VALUE : Ext.get("edtBossPswValidDays").dom.value,
        		ENABLE : '0',
        		NO : 'BOSS_PASSWORD_VALIDDAYS' 
        	};
    	}
    	if(Ext.getCmp("chbBossPswValidDaysHint").getValue() === true)
    	{
    		secArray[14] = {
        		VALUE : Ext.get("edtBossEffectDaysHint").dom.value,
        		ENABLE : '1',
        		NO : 'BOSS_PASSWORD_VALIDDAYS_HINT' 
        	};
    	}
    	else
    	{
    		secArray[14] = {
        		VALUE : Ext.get("edtBossEffectDaysHint").dom.value,
        		ENABLE : '0',
        		NO : 'BOSS_PASSWORD_VALIDDAYS_HINT' 
        	};
    	}
    	if(Ext.getCmp("chbBossOldPswMemoryCount").getValue() === true)
    	{
    		secArray[15] = {
        		VALUE : Ext.get("edtBossOldPswHint").dom.value,
        		ENABLE : '1',
        		NO : 'BOSS_PASSWORD_REMEMBER' 
        	};
    	}
    	else
    	{
    		secArray[15] = {
        		VALUE : Ext.get("edtBossOldPswHint").dom.value,
        		ENABLE : '0',
        		NO : 'BOSS_PASSWORD_REMEMBER' 
        	};
    	}
    	if(Ext.getCmp("chbBossPswComplexity").getValue() === true)
    	{
    		secArray[16] = {
        		VALUE : "",
        		ENABLE : '1',
        		NO : 'BOSS_PASSWORD_COMPLEXITY' 
        	};
    	}
    	else
    	{
    		secArray[16] = {
        		VALUE : "",
        		ENABLE : '0',
        		NO : 'BOSS_PASSWORD_COMPLEXITY' 
        	};
    	}
    	if(Ext.getCmp("chbBossPwdEndNumber").getValue() === true)
    	{
    		secArray[17] = {
        		VALUE : "",
        		ENABLE : '1',
        		NO : 'BOSS_PASSWORD_ENDNUMBER' 
        	};
    	}
    	else
    	{
    		secArray[17] = {
        		VALUE : "",
        		ENABLE : '0',
        		NO : 'BOSS_PASSWORD_ENDNUMBER' 
        	};
    	}
    	if(Ext.getCmp("chbMoreErrInfo").getValue() === true)
    	{
    		secArray[18] = {
        		VALUE : "",
        		ENABLE : '1',
        		NO : 'SHOW_MORE_ERRINFORMATION' 
        	};
    	}
    	else
    	{
    		secArray[18] = {
        		VALUE : "",
        		ENABLE : '0',
        		NO : 'SHOW_MORE_ERRINFORMATION' 
        	};
    	}
    	if(Ext.getCmp("chbUpdatePasswordSendEMail").getValue() === true)
    	{
    		secArray[18] = {
        		VALUE : "",
        		ENABLE : '1',
        		NO : 'SEND_EMAIL_UPDATE_PASSWORD' 
        	};
    	}
    	else
    	{
    		secArray[18] = {
        		VALUE : "",
        		ENABLE : '0',
        		NO : 'SEND_EMAIL_UPDATE_PASSWORD' 
        	};
    	}
	    SecurityProxy.BulkUpdate(Ext.util.JSON.encode(secArray),{callback:saveResponse, async:false});
	}
}

function saveResponse(data)
{
	if(data.error == 0)
    {
    	top.Ext.MessageBox.buttonText={
			ok:'完成'
		}
		top.Ext.MessageBox.show({
			title:'操作提示',
			msg:'您的操作成功',
			modal:true,
			buttons:Ext.Msg.OK
		});
    }
    else
    {
    	top.Ext.MessageBox.alert("错误",data.errDesc);
    }
}

function init()
{
	Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
	//用户设置
	var edtUserDefaultPsw = new Ext.form.TextField({
	   fieldLabel:"默认密码", id: "edtUserDefaultPsw",name:"edtUserDefaultPsw"
	});
	var edtPswLength = new Ext.form.TextField({
	   fieldLabel:"密码长度", id: "edtPswLength",name:"edtPswLength"
	});
	var edtUserPswErrorCount = new Ext.form.TextField({
	   fieldLabel:"密码错误允许数", id: "edtUserPswErrorCount",name:"edtUserPswErrorCount"
	});
	var edtUserPswValidDays = new Ext.form.TextField({
	   fieldLabel:"密码有效天数", id: "edtUserPswValidDays",name:"edtUserPswValidDays"
	});
	var edtUserPswValidDaysHint = new Ext.form.TextField({
	   fieldLabel:"有效期提示天数", id: "edtUserPswValidDaysHint",name:"edtUserPswValidDaysHint"
	});
	var edtUserOldPswMemoryCount = new Ext.form.TextField({
	   fieldLabel:"旧密码记忆数", id: "edtUserOldPswMemoryCount",name:"edtUserOldPswMemoryCount"
	});
	var Label1 = new Ext.form.Label({
	   id:"Label1",text:"密码复杂度"
	});
	var Label2 = new Ext.form.Label({
	   id:"Label2",text:"密码允许数字结尾"
	});
	var Label5 = new Ext.form.Label({
	   id:"Label5",text:"登录名大小写敏感"
	});
	var Label6 = new Ext.form.Label({
	   id:"Label6",text:"管理员多次输入错误密码锁定"
	});
	var Label7 = new Ext.form.Label({
	   id:"Label7",text:"管理员密码有效天数超过锁定"
	});
	
	var chbUserPswLength = new Ext.form.Checkbox({
                name:'chbUserPswLength', 
                id:"chbUserPswLength",
                labelSeparator:'', 
                boxLabel :'', 
                checked:false
    });
    
    //以下是使用checkbox控制textfield
    var chbUserPswLengthchk = Ext.getCmp("chbUserPswLength");
	var edtPswLengthtag =Ext.getCmp("edtPswLength");
	edtPswLengthtag.disable();
	function chbUserPswLengthCheck()
	{
		
	    if(chbUserPswLengthchk.getValue() == false)
	    {
	       edtPswLengthtag.disable();
	    }
	    else if(chbUserPswLengthchk.getValue() == true)
	    {
	       edtPswLengthtag.enable();
	    }
	}
	chbUserPswLengthchk.on("check",chbUserPswLengthCheck); 
	
    var chbUserPswErrorCount = new Ext.form.Checkbox({
                name:'chbUserPswErrorCount', 
                id:"chbUserPswErrorCount",
                labelSeparator:'', 
                checked:false
    });
    
    var chbUserPswErrorCountchk = Ext.getCmp("chbUserPswErrorCount");
	var edtUserPswErrorCounttag =Ext.getCmp("edtUserPswErrorCount");
	edtUserPswErrorCounttag.disable();
	function chbUserPswErrorCountCheck()
	{
		
	    if(chbUserPswErrorCountchk.getValue() == false)
	    {
	       edtUserPswErrorCounttag.disable();
	    }
	    else if(chbUserPswErrorCountchk.getValue() == true)
	    {
	       edtUserPswErrorCounttag.enable();
	    }
	}
	chbUserPswErrorCountchk.on("check",chbUserPswErrorCountCheck); 
	
    var chbUserPswValidDays = new Ext.form.Checkbox({
                name:'chbUserPswValidDays', 
                id:"chbUserPswValidDays",
                labelSeparator:'', 
                checked:false
    });
    
    var chbUserPswValidDayschk = Ext.getCmp("chbUserPswValidDays");
	var edtUserPswValidDaystag =Ext.getCmp("edtUserPswValidDays");
	edtUserPswValidDaystag.disable();
	function chbUserPswValidDaysCheck()
	{
		
	    if(chbUserPswValidDayschk.getValue() == false)
	    {
	       edtUserPswValidDaystag.disable();
	    }
	    else if(chbUserPswValidDayschk.getValue() == true)
	    {
	       edtUserPswValidDaystag.enable();
	    }
	}
	chbUserPswValidDayschk.on("check",chbUserPswValidDaysCheck); 
    
    var chbUserPswValidDaysHint = new Ext.form.Checkbox({
                name:'chbUserPswValidDaysHint', 
                id:"chbUserPswValidDaysHint",
                labelSeparator:'', 
                checked:false
    });
    
    var chbUserPswValidDaysHintchk = Ext.getCmp("chbUserPswValidDaysHint");
	var edtUserPswValidDaysHinttag =Ext.getCmp("edtUserPswValidDaysHint");
	edtUserPswValidDaysHinttag.disable();
	function chbUserPswValidDaysHintCheck()
	{
		
	    if(chbUserPswValidDaysHintchk.getValue() == false)
	    {
	       edtUserPswValidDaysHinttag.disable();
	    }
	    else if(chbUserPswValidDaysHintchk.getValue() == true)
	    {
	       edtUserPswValidDaysHinttag.enable();
	    }
	}
	chbUserPswValidDaysHintchk.on("check",chbUserPswValidDaysHintCheck);
    
    var chbUserOldPswMemoryCount = new Ext.form.Checkbox({
                name:'chbUserOldPswMemoryCount', 
                id:"chbUserOldPswMemoryCount",
                labelSeparator:'', 
                checked:false
    });
    
    var chbUserOldPswMemoryCountchk = Ext.getCmp("chbUserOldPswMemoryCount");
	var edtUserOldPswMemoryCounttag =Ext.getCmp("edtUserOldPswMemoryCount");
	edtUserOldPswMemoryCounttag.disable();
	function chbUserOldPswMemoryCountCheck()
	{
		
	    if(chbUserOldPswMemoryCountchk.getValue() == false)
	    {
	       edtUserOldPswMemoryCounttag.disable();
	    }
	    else if(chbUserOldPswMemoryCountchk.getValue() == true)
	    {
	       edtUserOldPswMemoryCounttag.enable();
	    }
	}
	chbUserOldPswMemoryCountchk.on("check",chbUserOldPswMemoryCountCheck); 
    
    var chbUserPswComplexity = new Ext.form.Checkbox({
                name:'chbUserPswComplexity', 
                id:"chbUserPswComplexity",
                labelSeparator:'', 
                checked:false
    });
    var chbUserPwdEndNumber = new Ext.form.Checkbox({
                name:'chbUserPwdEndNumber', 
                id:"chbUserPwdEndNumber",
                labelSeparator:'', 
                checked:false
    });
    var chbValidLowerCase = new Ext.form.Checkbox({
                name:'chbValidLowerCase', 
                id:"chbValidLowerCase",
                labelSeparator:'', 
                checked:false
    });
    var chbBossPswErrLock = new Ext.form.Checkbox({
                name:'chbBossPswErrLock', 
                id:"chbBossPswErrLock",
                labelSeparator:'', 
                checked:false
    });
    var chbBossPswOvertimeLock = new Ext.form.Checkbox({
                name:'chbBossPswOvertimeLock', 
                id:"chbBossPswOvertimeLock",
                labelSeparator:'', 
                checked:false
    });
    
    
	//管理员设置
	var edtBossPswLength = new Ext.form.TextField({
	   fieldLabel:"密码长度", id: "edtBossPswLength",name:"edtBossPswLength"
	});
	var edtBossPswErrorCount = new Ext.form.TextField({
	   fieldLabel:"密码错误允许数", id: "edtBossPswErrorCount",name:"edtBossPswErrorCount"
	});
	var edtBossPswValidDays = new Ext.form.TextField({
	   fieldLabel:"密码有效天数", id: "edtBossPswValidDays",name:"edtBossPswValidDays"
	});
	var edtBossEffectDaysHint = new Ext.form.TextField({
	   fieldLabel:"有效期提示天数", id: "edtBossEffectDaysHint",name:"edtBossEffectDaysHint"
	});
	var edtBossOldPswHint = new Ext.form.TextField({
	   fieldLabel:"旧密码记忆数", id: "edtBossOldPswHint",name:"edtBossOldPswHint"
	});
	var Label3 = new Ext.form.Label({
	   id:"Label3",text:"密码复杂度"
	});
	var Label4 = new Ext.form.Label({
	   id:"Label4",text:"密码允许数字结尾"
	});
	var Label8 = new Ext.form.Label({
	   id:"Label8",text:"密码错误时显示详细错误信息"
	});
	var Label9 = new Ext.form.Label({
	   id:"Label9",text:"当修改密码后发送邮件"
	});
	
	var chbBossPswLength = new Ext.form.Checkbox({
                name:'chbBossPswLength', 
                id:"chbBossPswLength",
                labelSeparator:'', 
                boxLabel :'', 
                checked:false
    });
    
    var chbBossPswLengthchk = Ext.getCmp("chbBossPswLength");
	var edtBossPswLengthtag =Ext.getCmp("edtBossPswLength");
	edtBossPswLengthtag.disable();
	function chbBossPswLengthCheck()
	{
		
	    if(chbBossPswLengthchk.getValue() == false)
	    {
	       edtBossPswLengthtag.disable();
	    }
	    else if(chbBossPswLengthchk.getValue() == true)
	    {
	       edtBossPswLengthtag.enable();
	    }
	}
	chbBossPswLengthchk.on("check",chbBossPswLengthCheck);
    
    var chbBossPswErrorCount = new Ext.form.Checkbox({
                name:'chbBossPswErrorCount', 
                id:"chbBossPswErrorCount",
                labelSeparator:'', 
                checked:false
    });
    
    var chbBossPswErrorCountchk = Ext.getCmp("chbBossPswErrorCount");
	var edtBossPswErrorCounttag =Ext.getCmp("edtBossPswErrorCount");
	edtBossPswErrorCounttag.disable();
	function chbBossPswErrorCountCheck()
	{
		
	    if(chbBossPswErrorCountchk.getValue() == false)
	    {
	       edtBossPswErrorCounttag.disable();
	    }
	    else if(chbBossPswErrorCountchk.getValue() == true)
	    {
	       edtBossPswErrorCounttag.enable();
	    }
	}
	chbBossPswErrorCountchk.on("check",chbBossPswErrorCountCheck);
    
    var chbBossPswValidDays = new Ext.form.Checkbox({
                name:'chbBossPswValidDays', 
                id:"chbBossPswValidDays",
                labelSeparator:'', 
                checked:false
    });
    
    var chbBossPswValidDayschk = Ext.getCmp("chbBossPswValidDays");
	var edtBossPswValidDaystag =Ext.getCmp("edtBossPswValidDays");
	edtBossPswValidDaystag.disable();
	function chbBossPswValidDaysCheck()
	{
		
	    if(chbBossPswValidDayschk.getValue() == false)
	    {
	       edtBossPswValidDaystag.disable();
	    }
	    else if(chbBossPswValidDayschk.getValue() == true)
	    {
	       edtBossPswValidDaystag.enable();
	    }
	}
	chbBossPswValidDayschk.on("check",chbBossPswValidDaysCheck);
    
    var chbBossPswValidDaysHint = new Ext.form.Checkbox({
                name:'chbBossPswValidDaysHint', 
                id:"chbBossPswValidDaysHint",
                labelSeparator:'', 
                checked:false
    });
    
    var chbBossPswValidDaysHintchk = Ext.getCmp("chbBossPswValidDaysHint");
	var edtBossEffectDaysHinttag =Ext.getCmp("edtBossEffectDaysHint");
	edtBossEffectDaysHinttag.disable();
	function chbBossPswValidDaysHintCheck()
	{
		
	    if(chbBossPswValidDaysHintchk.getValue() == false)
	    {
	       edtBossEffectDaysHinttag.disable();
	    }
	    else if(chbBossPswValidDaysHintchk.getValue() == true)
	    {
	       edtBossEffectDaysHinttag.enable();
	    }
	}
	chbBossPswValidDaysHintchk.on("check",chbBossPswValidDaysHintCheck);
    
    var chbBossOldPswMemoryCount = new Ext.form.Checkbox({
                name:'chbBossOldPswMemoryCount', 
                id:"chbBossOldPswMemoryCount",
                labelSeparator:'', 
                checked:false
    });
    
    var chbBossOldPswMemoryCountchk = Ext.getCmp("chbBossOldPswMemoryCount");
	var edtBossOldPswHinttag =Ext.getCmp("edtBossOldPswHint");
	edtBossOldPswHinttag.disable();
	function chbBossOldPswMemoryCountCheck()
	{
		
	    if(chbBossOldPswMemoryCountchk.getValue() == false)
	    {
	       edtBossOldPswHinttag.disable();
	    }
	    else if(chbBossOldPswMemoryCountchk.getValue() == true)
	    {
	       edtBossOldPswHinttag.enable();
	    }
	}
	chbBossOldPswMemoryCountchk.on("check",chbBossOldPswMemoryCountCheck);
	
    var chbBossPswComplexity = new Ext.form.Checkbox({
                name:'chbBossPswComplexity', 
                id:"chbBossPswComplexity",
                labelSeparator:'', 
                checked:false
    });
    var chbBossPwdEndNumber = new Ext.form.Checkbox({
                name:'chbBossPwdEndNumber', 
                id:"chbBossPwdEndNumber",
                labelSeparator:'', 
                checked:false
    });
    var chbMoreErrInfo = new Ext.form.Checkbox({
                name:'chbMoreErrInfo', 
                id:"chbMoreErrInfo",
                labelSeparator:'', 
                checked:false
    });
    var chbUpdatePasswordSendEMail = new Ext.form.Checkbox({
                name:'chbUpdatePasswordSendEMail', 
                id:"chbUpdatePasswordSendEMail",
                labelSeparator:'', 
                checked:false
    });
    
    var userSet = new Ext.form.FieldSet({
        title:'用户', 
        height:260,
        items: [{
	                columnWidth:.100,
	                layout:'column',
	                items:[
	                
	                {columnWidth:.80,layout:'form',items:[edtUserDefaultPsw]}
	                
	                ]
	                                      
               },{
	                columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[edtPswLength]},
	                {columnWidth:.2,items:[chbUserPswLength]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[edtUserPswErrorCount]},
	                {columnWidth:.2,items:[chbUserPswErrorCount]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[edtUserPswValidDays]},
	                {columnWidth:.2,items:[chbUserPswValidDays]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[edtUserPswValidDaysHint]},
	                {columnWidth:.2,items:[chbUserPswValidDaysHint]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[edtUserOldPswMemoryCount]},
	                {columnWidth:.2,items:[chbUserOldPswMemoryCount]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[Label1]},
	                {columnWidth:.2,items:[chbUserPswComplexity]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[Label2]},
	                {columnWidth:.2,items:[chbUserPwdEndNumber]}
	                ]
               }]
    	
    });
	
	var form1 = new Ext.FormPanel({
										id: "form1",
										header: false,
										isFormField:true,
								        labelWidth: 100, 
								        frame:true,
								        autoWidth:true,
								        items: [
								            userSet,
								            {
								            	columnWidth:.100,
								                layout:'column',
								                items:[
									                {columnWidth:.80,layout:'form',items:[Label5]},
									                {columnWidth:.2,items:[chbValidLowerCase]}
									            ]
								            },
								            {
								            	columnWidth:.100,
								                layout:'column',
								                items:[
									                {columnWidth:.80,layout:'form',items:[Label6]},
									                {columnWidth:.2,items:[chbBossPswErrLock]}
									            ]
								            },
								            {
								            	columnWidth:.100,
								                layout:'column',
								                items:[
									                {columnWidth:.80,layout:'form',items:[Label7]},
									                {columnWidth:.2,items:[chbBossPswOvertimeLock]}
									            ]
								            }
								        ]
								    });
	
	var managerSet = new Ext.form.FieldSet({
        title:'管理员', 
        height:260,
		items: [{
	                columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[edtBossPswLength]},
	                {columnWidth:.2,items:[chbBossPswLength]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[edtBossPswErrorCount]},
	                {columnWidth:.2,items:[chbBossPswErrorCount]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[edtBossPswValidDays]},
	                {columnWidth:.2,items:[chbBossPswValidDays]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[edtBossEffectDaysHint]},
	                {columnWidth:.2,items:[chbBossPswValidDaysHint]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[edtBossOldPswHint]},
	                {columnWidth:.2,items:[chbBossOldPswMemoryCount]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[Label3]},
	                {columnWidth:.2,items:[chbBossPswComplexity]}
	                ]
               },{
               	    columnWidth:.100,
	                layout:'column',
	                items:[
	                {columnWidth:.80,layout:'form',items:[Label4]},
	                {columnWidth:.2,items:[chbBossPwdEndNumber]}
	                ]
               }]
	});
	var form2 = new Ext.FormPanel({
										id: "form2",
										header: false,
										//columnHeight:1.0,
										isFormField:true,
								        labelWidth: 100, 
								        frame:true,
								        autoWidth:true,
								        items: [
								            managerSet,
								            {
								            	columnWidth:.100,
								                layout:'column',
								                items:[
									                {columnWidth:.80,layout:'form',items:[Label8]},
									                {columnWidth:.2,items:[chbMoreErrInfo]}
									            ]
								            },
								            {
								            	columnWidth:.100,
								                layout:'column',
								                items:[
									                {columnWidth:.80,layout:'form',items:[Label9]},
									                {columnWidth:.2,items:[chbUpdatePasswordSendEMail]}
									            ]
								            }
								        
								        ]
								    });
								    
	var panel = new Ext.Panel({
	    layout : 'column',
	    region : 'center',
	    autoScroll : true,
	    frame : true,
	    buttons:[{
	        text:'保存',
	        handler:saveOK
	    }],
		items:[
			{
			    columnWidth:.50,
			    columnHeight:1.0,
			    items:[form1]
			},{
			    columnWidth:.50,
			    columnHeight:1.0,
			    items:[form2]
			}]
	    
	});
								    
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [panel]

	});
	
	SecurityProxy.getSecurityInfo({
	    callback:function(data){
	        if(data.error == 0)
			{
				Ext.get("edtUserDefaultPsw").dom.value = data.strSecurityUserPasswordDefault;
				Ext.get("edtPswLength").dom.value = data.strSecurityUserPasswordLong;
				if(data.strSecurityUserPasswordLongchk === '1')
				{
					Ext.getCmp("chbUserPswLength").setValue(true);
				}
				Ext.get("edtUserPswErrorCount").dom.value = data.strSecurityUserPasswordCount;
				if(data.strSecurityUserPasswordCountchk === '1')
				{
					Ext.getCmp("chbUserPswErrorCount").setValue(true);
				}
				Ext.get("edtUserPswValidDays").dom.value = data.strSecurityUserPasswordValidDays;
				if(data.strSecurityUserPasswordValidDayschk === '1')
				{
					Ext.getCmp("chbUserPswValidDays").setValue(true);
				}
				Ext.get("edtUserPswValidDaysHint").dom.value = data.strSecurityUserPasswordValidDaysHint;
				if(data.strSecurityUserPasswordValidDaysHintchk === '1')
				{
					Ext.getCmp("chbUserPswValidDaysHint").setValue(true);
				}
				Ext.get("edtUserOldPswMemoryCount").dom.value = data.strSecurityUserPasswordRemember;
				if(data.strSecurityUserPasswordRememberchk === '1')
				{
					Ext.getCmp("chbUserOldPswMemoryCount").setValue(true);
				}
				if(data.strSecurityUserPasswordComplexitychk === '1')
				{
					Ext.getCmp("chbUserPswComplexity").setValue(true);
				}
				if(data.strSecurityUserPasswordEndNumberchk === '1')
				{
					Ext.getCmp("chbUserPwdEndNumber").setValue(true);
				}
				if(data.strSecurityUserNameValidLowerCasechk === '1')
				{
					Ext.getCmp("chbValidLowerCase").setValue(true);
				}
				if(data.strSecurityBossPasswordErrorLockchk === '1')
				{
					Ext.getCmp("chbBossPswErrLock").setValue(true);
				}
				if(data.strSecurityBossPasswordOverTimeLockchk === '1')
				{
					Ext.getCmp("chbBossPswOvertimeLock").setValue(true);
				}
				Ext.get("edtBossPswLength").dom.value = data.strSecurityBossPasswordLong;
				if(data.strSecurityBossPasswordLongchk === '1')
				{
					Ext.getCmp("chbBossPswLength").setValue(true);
				}
				Ext.get("edtBossPswErrorCount").dom.value = data.strSecurityBossPasswordCount;
				if(data.strSecurityBossPasswordCountchk === '1')
				{
					Ext.getCmp("chbBossPswErrorCount").setValue(true);
				}
				Ext.get("edtBossPswValidDays").dom.value = data.strSecurityBossPasswordValidDays;
				if(data.strSecurityBossPasswordValidDayschk === '1')
				{
					Ext.getCmp("chbBossPswValidDays").setValue(true);
				}
				Ext.get("edtBossEffectDaysHint").dom.value = data.strSecurityBossPasswordValidDaysHint;
				if(data.strSecurityBossPasswordValidDaysHintchk === '1')
				{
					Ext.getCmp("chbBossPswValidDaysHint").setValue(true);
				}
				Ext.get("edtBossOldPswHint").dom.value = data.strSecurityBossPasswordRemember;
				if(data.strSecurityBossPasswordRememberchk === '1')
				{
					Ext.getCmp("chbBossOldPswMemoryCount").setValue(true);
				}
				if(data.strSecurityBossPasswordComplexitychk === '1')
				{
					Ext.getCmp("chbBossPswComplexity").setValue(true);
				}
				if(data.strSecurityBossPasswordEndNumberchk === '1')
				{
					Ext.getCmp("chbBossPwdEndNumber").setValue(true);
				}
				if(data.strSecurityMoreErrInformationchk === '1')
				{
					Ext.getCmp("chbMoreErrInfo").setValue(true);
				}
				if(data.strSecurityUpdatePasswordSendEMailchk === '1')
				{
					Ext.getCmp("chbUpdatePasswordSendEMail").setValue(true);
				}
			}
			else
			{
				Ext.MessageBox.alert("错误",data.errDesc);
			}
	    } ,
	    async:false
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);