Ext.namespace('com.freesky.ssc.form.system');
var forgetPassWordWindow = null;
var delaedtask = null;//定时器
var startdate = null; //点击发送验证码开始时间
var endDate = null;//点击提交的时间
var flag = false;//判断验证码是否正确
var sendCaptchabutton = null;//廷时定时器
var taskrunner = null;//定时器
var config = null;
var totalMinu =60;
var Y = document.documentElement.clientHeight/2;
com.freesky.ssc.form.system.forgetPassWordWindow=Ext.extend(Ext.Window, {/*
    height: 230,
    id: 'forgetPWwindow',
    width: 380,
    title: '密码找回',
    y: Y-115,
    closeAction : 'destroy',
    resizable: false,
    initComponent: function() 
    {
         var me = this;
         var forgetPassWordpanel =  new Ext.form.FormPanel(
         {
          id:'forgetPassWordpanel',	
          height: 612,
          labelAlign : "right",
          width: 390,
          frame: true,
          height: 200,
          width: 380,
          bodyPadding: 10,
          preventHeader: true,
          method: 'post',
          items : [
                   {
				    xtype: 'label',
				    html: '&nbsp&nbsp注意：带<font color=\'red\'>*</font>为必填<br><br>',
				    text: ''
				  },
				  {
		    		   xtype:'textfield', 
		    		   fieldLabel: '<font color=\'red\'>*</font>用户名',
		    		   id: 'wUsername',
		    		   blankText: '不能为空'
		    		 
                 },
                 {
        	       layout:'column',
            	   items:[{
            	   
                       columnWidth:0.65,
                       layout: 'form',
                       items: [{
                                id: 'captcha',
                            	xtype: 'textfield',
                   				name: 'emNickName',
                   				fieldLabel: '<font color=\'red\'>*</font>输入验证码',
                   				hideLabel: false,
                   				allowBlank: false,
                   				blankText: '不能为空'
                              }]
                  },
                  {
                      columnWidth:0.35,
                      layout: 'form',
                      items: [{
                    	        id:'sendCaptchaButton',
                           	    xtype: 'button',
                           	    height:20,
                           	    width:300,
                  			    text : '发送验证码',
                  			    listeners:
                  			    {
                                    click: 
                                    {
                                        fn: me.sendCaptcha,
                                        scope: me
                                    }
                                }
                           }]
                 }]
               },
               {
            	   layout:'column',
            	   items:[{
                       columnWidth:0.65,
                       layout: 'form',
                       items: [{
                        	   xtype: 'textfield',
                               id: 'passWordfield',
                               inputType: 'password',
                               name: 'emPassWord',
                               fieldLabel: '<font color=\'red\'>*</font>输入新密码',
                               allowBlank: false,
                               blankText: '不能为空',
                               vtype: 'alphanum'
                               
                          }]
                  },
                  {
                      columnWidth:0.35,
                      layout: 'form',
                      items: [{}]
                 }
           ]},
               {
            	   xtype: 'textfield',
                   id: 'RePassWordfield',
                   inputType: 'password',
                   name: 'emRePassWord',
                   submitValue: false,
                   fieldLabel: '<font color=\'red\'>*</font>重复密码',
                   allowBlank: false,
                   blankText: '不能为空',
                   vtype: 'alphanum'
                   
               },
               {
        		   xtype:'textfield', 
        		   hidden : true,
        		   id: 'oldPassWord',
        		   hideLabel:true,
        		   name:'oldPassWord', 
        		   value:'1Z2w4Rt' 
               }
	          ],
	          buttons:[{
		        	    text:"确定",
		        	    handler : this.submit
		        	},
		        	{
		        	    text:"取消",
		        	    handler:function()
		        	    {
		        		  forgetPassWordWindow.close();
		        		  forgetPassWordWindow = null;
		        	    }
		          }] 
        });
        this.items = [forgetPassWordpanel],
        com.freesky.ssc.form.system.forgetPassWordWindow.superclass.initComponent.call(this);
        this.on('close',this.windowClose,this);
        sendCaptchabutton = Ext.getCmp('sendCaptchaButton');
//        delaedtask = new Ext.util.DelayedTask(
//       		 function ()
//       		 {
//       			 sendCaptchabutton.setDisabled(false);
//       		 });
//         taskrunner = new Ext.util.TaskRunner({id : 'taskrunnerid'});
//        var cpUsername = Ext.getCmp("usercode").getValue().trim();
//    	if(cpUsername == null)
//    	{
//    		cpUsername = '';
//    	}
//    	Ext.getCmp("wUsername").setValue(cpUsername);
//    	Ext.getCmp("setid").setValue("001");
//        forgetPassWordWindow = this;
//        forgetPassWordWindow.show();
    },
    
    windowClose : function()
    {
    	//Ext.TaskMgr.stop(config);
    },
    submit: function(button, e, options)//如果验证码是正确的，就可以修改密码了。
    {
        
        endDate = new Date();
        var endTime = endDate.getTime();
        if(startdate !=null)
        {
        	var startTime = startdate.getTime();
        
        ForgetPW.updateEndTime(Ext.util.Format.date(startdate, "Y-m-d H:i:s"), Ext.util.Format.date(endDate, "Y-m-d H:i:s"), {
				callback : Ext.emptyFn,
				async : false//表示同步
			});
        }
        if(endTime - startTime > 180000)
        {
            Ext.Msg.alert('提示','验证码3分钟之内有效！');
        	return;
        }
        var formPanel = Ext.getCmp('forgetPassWordpanel');
        var form = formPanel.getForm();//得到这个表单
        var captcha = Ext.getCmp('captcha').getValue().trim();//验证码
        var newPwd = Ext.getCmp('passWordfield').getValue().trim();//新密码
        var repassWord  = Ext.getCmp('RePassWordfield').getValue().trim();//重复密码
        var oldPwd = Ext.getCmp('oldPassWord').getValue().trim();//旧密码
        var varcode = Ext.getCmp('wUsername').getValue().trim();//用户名
        var setid = Ext.getCmp('setid').getValue().trim();//帐套
        if(form.isValid())//如果表单验证通过
        {
        	ForgetPW.findRandomNum(varcode, Ext.util.Format.date(startTime, "Y-m-d H:i:s"), captcha, {
				callback : function setFlag(_flag){ flag = _flag;},
				async : false//表示同步
			});
        	if(!flag)
        	{
        		Ext.Msg.alert('提示','验证码不正确！');
        		return;
        	}
        	if(newPwd != repassWord)
            {
            	Ext.Msg.alert('提示','两次输入的密码不一致');
            	return;
            }	
        	
        	m_updatePwdLoadMask = new Ext.LoadMask("forgetPWwindow", 
        	{
					msg : "正在修改密码...",
					removeMask : true
			});
		   m_updatePwdLoadMask.show();//打开遮罩层
		   ForgetPW.updateIntSate(varcode,{
				callback : function voidfunction(){},
				async : false//表示同步
			});
		   try 
		      {
		            AuthProxy.updatePassword(varcode, oldPwd, newPwd, setid, "", {
					callback : function(result)
					{
		            	hideUpdatePwdLoadMask();
		            	if (result.error == 0)
		            	{
		            		Ext.MessageBox.alert("信息", "恭喜密码修改成功。");
		            		forgetPassWordWindow.close();
		            	}
		            	else 
		            	{
		            		Ext.MessageBox.alert("错误", result.errDesc);
		            	}	
		            },
					async : true});//修改密码
		      }
		   catch (ex) 
		      {
			            hideUpdatePwdLoadMask();
			            Ext.MessageBox.alert("异常", ex);
		      }
        }
        
    },
    
    sendCaptcha : function()//发送并保存验证码
    {
    	 var i=0;
    	 totalMinu = 60;//重新发送所需要的时间60秒
    	 var ip = Ext.get('hostIp').dom.value;//获得客户端的ip地址
    	 var varName = Ext.getCmp('wUsername').getValue().trim();//用户名
    	 var flag = 0;
    	 ForgetPW.checkUserExist(varName, 
		 {
    		 callback : function(data)
    		 {
    		 	//返回true，表明查询有数据
    		 	if(data)
    		 	{
    		 		flag = 1;//设置标志位
    		 		like = window.confirm("用户被锁定，请联系管理员！");
    		 		if(like == true || like == false)
    		 		{
//    		 			window.location.reload();
    		 		}
//    		 		Ext.Msg.alert('提示','用户被锁定，请联系管理员！');
    		 		
//    		 		Ext.MessageBox.confirm('提示', '用户被锁定，请联系管理员！', function(button, text)
//        		    {
//    		 			if (button == 'yes')
//		                {
//    		 				window.location.reload();
//		                }
//        		    });
    		 	}
    		 }
		 });
    	 //在用户被锁定的情况下，结束下面的代码段
    	 if(flag == 1)
    	 {
    		 return;
    	 }
         config = 
    	 {
    		 run: function () 
    		 {
    		    sendCaptchabutton.setText( '重发所剩:<font style="size:1;color:red">'+totalMinu-- +'</font>秒') ;
    		    if(totalMinu <0 )
    		    {
    		    	totalMinu =60;
    		    	sendCaptchabutton.setText( '发送验证码') ;
    		    	sendCaptchabutton.setDisabled( false );
    		    	Ext.TaskMgr.stop(config);
    		    }
    		    else
    		    {
    		    	sendCaptchabutton.setDisabled( true );//让铵钮暂时失效一定时间
    		    }
             },
             interval: 1000
    			 
    	 };
         
         startdate = new Date();//产生一个开始时间
    	 var username = Ext.getCmp('wUsername').getValue().trim();//取得用户名
    	 var RandomNum = this.generateRandomNum();//调用函数产生随机数
    	 ForgetPW.saveRandomNum(RandomNum, Ext.util.Format.date(startdate, "Y-m-d H:i:s"), new Date(), username, ip,
    	 {
				callback : function() 
				{
    		 	   Ext.TaskMgr.start(config);
    		       Ext.Msg.alert('提示','验证码已发送注意查收！');
				},
				async : true
    	 });
         
    	
    	
    },
    
    generateRandomNum: function()//产生一个六位随机数
    {
    	var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    	var res = "";
        for(var i = 0; i < 6 ; i ++) {
            var id = Math.ceil(Math.random()*35);
            res += chars[id];
        }
        return res;
    }
  
*/});