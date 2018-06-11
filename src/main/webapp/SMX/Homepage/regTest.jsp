<%@ page language="java" contentType="text/html; Utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>试用申请</title>
    <link rel="stylesheet" href="css/style-base.css"/>
    <link rel="stylesheet" href="css/content-style.css"/>
    <script type="text/javascript" src="js/jquery-1.11.2.min.js"></script>
    <script type="text/javascript" src="js/jquery.searchableSelect.js"></script>
    <script type="text/javascript" src="js/layer.js"></script>
    
    <script>
        /*
         * jQuery placeholder, fix for IE6,7,8,9
         * @author JENA
         * @since 20131115.1504
         * @website ishere.cn
         */
        var JPlaceHolder = {
            //检测
            _check : function(){
                return 'placeholder' in document.createElement('input');
            },
            //初始化
            init : function(){
                if(!this._check()){
                    this.fix();
                }
            },
            //修复
            fix : function(){
                jQuery(':input[placeholder]').each(function(index, element) {
                    var self = $(this), txt = self.attr('placeholder');
                    self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
                    var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
                    var holder = $('<span></span>').text(txt).css({position:'absolute','line-height':h + 'px', left:pos.left, top:pos.top, height:h,  paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
                    self.focusin(function(e) {
                        holder.hide();
                    }).focusout(function(e) {
                        if(!self.val()){
                            holder.show();
                        }
                    });
                    holder.click(function(e) {
                        holder.hide();
                        self.focus();
                    });
                });
            }
        };
        //执行
        jQuery(function(){
            JPlaceHolder.init();
        });
        $(function () {
            //select
            $('select').searchableSelect();
        })
    </script>
    <style>

          *{
            margin:0;
            padding:0;
            font-family:Arial, "宋体";
            font-size:14px;
        }

        input{outline:0 none;}

        .reg{
            width:580px;
            margin:0 auto;
            padding: 22px 0 0 0;
        }

        dl{
            overflow: hidden;
            /*padding-left: 100px;*/
            margin-bottom: 15px;
        }

        dt{
            float:left;
            width:100px;
            margin-right:10px;
            height:42px;
            font-weight:bold;
            color:#666;
            line-height:42px;
            text-align:right;
        }

        dl i{color: #f00;}
        .ipt_box{
            float:left;
            position:relative;
        }

        .ipt_box input[type=text],.ipt_box input[type=password]{
            display: block;
            /*height: 16px;*/
            height: 40px;
            line-height: 40px;
            /*padding: 11px 10px 11px 10px;*/
            padding: 0 10px;
            border: 1px solid #ddd;
            color: #666;
            width:290px;
            margin-right:10px;
            border-radius:1px;
            -moz-transition: border 0.3s;
            -webkit-transition: border 0.3s;
            -o-transition: border 0.3s;
            transition: border 0.3s;
        }
        .ipt_box select{
            width: 312px;height: 40px;line-height: 40px;
            border: 1px solid #ddd;
            padding: 10px 0;
            margin-right: 10px;
        }
        .ipt_box input:focus,.ipt_box select:focus{border-color: #147bf0;}
        .mes{
            height:42px;
            float:left;
            width:140px;
        }

        .tips{color: #f00;}
        .tips span{display: none;}
        .mes .tips{
            color:#aaa;
            font-size:12px;
            line-height:18px;
            /*display:none;*/
        }
        .mes .tips{
            line-height:42px;
            /*display:none;*/

        }
        .mes .tips img{
            line-height:42px;
        }
        .mes .tips span{
            color:#ccc;
            font-size:12px;
        }
        .mes .tips.error span{color: #f00;}
        .mes .tips .error_icon{
            margin-top:8px;
            margin-right:1px;
            display:block;
            width:24px;
            height:24px;
            background:url(error.png) no-repeat center;
        }

        .mes .tips .ok_icon{
            margin-top:8px;
            margin-right:1px;
            display:block;
            width:24px;
            height:24px;
            background:url(ok.png) no-repeat center;
        }

        .reg .ipt_box .clear{
            position:absolute;
            top:10px;
            right:15px;
            font-size:12px;
            width:20px;
            height:20px;
            display:block;
            background:url(clear.png) no-repeat center;
            filter:alpha(opacity=50);
            -moz-opacity:0.5;
            -khtml-opacity: 0.5;
            opacity: 0.5;
            cursor:pointer;
            display:none;
        }

        .reg .ipt_box .clear:hover{
            filter:alpha(opacity=80);
            -moz-opacity:0.8;
            -khtml-opacity: 0.8;
            opacity: 0.8;
        }

        .mes ul{
            width:232px;
            height:72px;
            background:url(pwd_tip.png) no-repeat center;
            list-style:none;
            display:none;
        }

        .mes ul li{
            line-height:24px;
            height:24px;
            list-style:none;
            margin-left:8px;
        }

        .mes ul li span{
            color:#999;
            font-size:12px;
            display:block;
            float:left;
        }

        .mes ul li .pwd_icon{
            color:#ccc;
            width:24px;
            height:24px;
            text-align:center;
            line-height:24px;
        }

        .pwdok{background:url() no-repeat center;}

        .pwdno{background:url() no-repeat center;}

        .reg .yzm_box{
            height:38px;
            width:100px;
            border:1px solid #DDD;
            float:left;
            overflow:hidden;
        }

        .reg .change_another{
            width:65px;
            height:40px;
            float:left;
            line-height:42px;
            text-align:center;
        }

        .reg .change_another a{
            font-size:12px;
            color:#3F89EC;
            text-decoration:none;
        }

        .reg .change_another a:hover{
            text-decoration:underline;
        }

        .protocol span,.protocol label{
            color:#666;
            font-size:12px;
        }

        .protocol span a{
            color:#3F89EC;
            font-size:12px;
            text-decoration:none;
        }

        .protocol input{
            position:relative;
            top:2px;
        }

        .regBtn{
            height:50px;
            width:312px;
            border:0 none;
            background:#3F89EC;
            border-radius:3px;
            color:#fff;
            font-size:16px;
            font-weight:bold;
            cursor:pointer;
        }
        .regBtn:hover{
            background:#4490f7
        }
	/*下拉选择框*/
        .searchable-select-hide {
            display: none;
        }

        .searchable-select {
            display: inline-block;
            min-width: 159px;
            min-width: 165px\9;
            font-size: 14px;
            color: #555;
            vertical-align: middle;
            position: relative;
            outline: none;
        }

        .searchable-select-holder{
            width: 306px;
            height: 36px;
            line-height: 36px;
            padding: 2px;
            background-color: #fff;
            background-image: none;
            border: 1px solid #ddd;
            border-radius: 2px;
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            /*min-height: 25px;*/
            -moz-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
            -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
            box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
            -webkit-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
            transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
        }
        .searchable-select-holder:active{
            border-color: #003eff;
            -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);
            -moz-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);
        }

        .searchable-select-caret {
            position: absolute;
            width: 0;
            height: 0;
            box-sizing: border-box;
            border-color: black transparent transparent transparent;
            top: 3px;
            bottom: 0;
            border-style: solid;
            border-width: 5px;
            margin: auto;
            right: 10px;
        }

        .searchable-select-dropdown {
            position: absolute;
            background-color: #fff;
            border: 1px solid #ccc;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            padding: 4px;
            border-top: none;
            top: 26px;
            left: 0;
            right: 0;
            box-shadow: 0 5px 5px rgba(0,0,0,0.075);
            -webkit-box-shadow: 0 5px 5px rgba(0,0,0,0.075);
            z-index: 2;
        }

        .searchable-select-input {
            border: 1px solid #ccc;
            display: none!important;
            outline: none;
            padding: 4px;
            margin: 0!important;
            height: 36px;
            line-height: 36px;
            width: 100%!important;
            box-sizing: border-box;
            -moz-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
            -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
            box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
        }
        .base-select .searchable-select-input{display: none!important;}
        .searchable-scroll {
            margin-top: 4px;
            position: relative;
        }

        .searchable-scroll.has-privious {
            padding-top: 16px;
        }

        .searchable-scroll.has-next {
            padding-bottom: 16px;
        }

        .searchable-has-privious {
            top: 0;
        }

        .searchable-has-next {
            bottom: 0;
        }

        .searchable-has-privious, .searchable-has-next {
            height: 16px;
            left: 0;
            right: 0;
            position: absolute;
            text-align: center;
            z-index: 10;
            background-color: white;
            line-height: 8px;
            cursor: pointer;
        }

        .searchable-select-items {
            max-height: 400px;
            overflow-y: auto;
            position: relative;
        }

        .searchable-select-items::-webkit-scrollbar {
            display: none;
        }

        .searchable-select-item {
            padding: 5px 5px;
            cursor: pointer;
            /*min-height: 30px;*/
            box-sizing: border-box;
            transition: all 1s ease 0s;
            background: #f0f0f0;
            border-bottom: 1px solid #fff;
        }

        .searchable-select-item.hover {

            background: #4490f7;
            color: white;
        }

        .searchable-select-item.selected {
            background: #4490f7;
            color: white;
        }
    </style>
</head>
<body class="" style="background: #fff;">

<div class="" style="background: url(img/reg_bg.jpg) no-repeat;width: 100%;height: 100%;background-size: cover;-webkit-background-size: cover;
overflow-y: auto\9;
">
    <!--<div class="lg_bg"></div>-->
    <div class="lg_header">
        <div class="lg_header_box">
            <img class="fleft" src="img/lg_logo.png" alt=""/>
            <h2 class="fleft">新致财务核算专家</h2>

            <div class="fright test_btn_box">
                <a href="JavaScript:history.back(-1);" class="">返回登录</a>
            </div>
        </div>
    </div>
    <div class="lg_content clearfix" style="background: #fff;width: 750px;margin-top:10px;">
        <div style="height: 70px;line-height: 70px;text-align: center;font-size: 18px;border-bottom: 1px solid #ddd;">
            完善以下信息，您将免费获取30天的产品试用
        </div>
       <div class="reg">
           <form action="http://www.baidu.com" method="get">
               <dl>
                   <dt>公司名称<i>*</i></dt>
                   <dd class="ipt_box">
                       <input id="CompanyName" name="" type="text" placeholder="公司名称" />
                       <span class="clear"></span>
                       <!-- <div class="tips"><span>请正确填写公司名称</span></div> -->
                   </dd>
                   <dd class="mes">
                       <div class="tips"><span>请正确填写公司名称</span></div>
                   </dd>
               </dl>

               <dl>
                   <dt>公司邮箱<i>*</i></dt>
                   <dd class="ipt_box">
                       <input id="CompanyEmail" name="" type="text" placeholder="用于接收试用信息的邮箱" />
                       <span class="clear"></span>
                       <!-- <div class="tips error"><span>请正确填写公司邮箱</span></div> -->
                   </dd>
                   <dd class="mes">
                       <div class="tips error"><span>请正确填写公司邮箱</span></div>
                   </dd>
               </dl>

               <dl>
                   <dt>账号<i>*</i></dt>
                   <dd class="ipt_box">
                       <input id="AdminID" name="" type="text" placeholder="系统管理员账号，用于配置操作用户及权限" />
                       <span class="clear"></span>
                       <!-- <div class="tips"><span>请填写管理员账号</span></div> -->
                   </dd>
                   <dd class="mes">
                       <div class="tips"><span>请填写管理员</span></div>
                   </dd>
               </dl>

               <dl>
                   <dt>密码<i>*</i></dt>
                   <dd class="ipt_box">
                       <input id="AdminPWD" name="" type="password" placeholder="系统管理员密码" />
                       <span class="clear"></span>
                       <!-- <div class="tips"><span>请填写管理员密码</span></div> -->
                   </dd>
                   <dd class="mes">
                       <div class="tips"><span>请填写管理员密码</span></div>
                   </dd>
               </dl>
               
               <dl>
                   <dt>姓名<i>*</i></dt>
                   <dd class="ipt_box">
                       <input id="RegistrationName" name="" type="text" placeholder="您的姓名" />
                       <span class="clear"></span>
                       <!--<div class="tips"><span>请填写管理员手机号</span></div>-->
                   </dd>
                   <dd class="mes">
                       <div class="tips"><span>请填写管理员姓名</span></div>
                   </dd>
               </dl>

               <dl>
                   <dt>手机号<i>*</i></dt>
                   <dd class="ipt_box">
                       <input id="AdminPhone" name="" type="text" placeholder="用于服务人员与您联系" />
                       <span class="clear"></span>
                       <!-- <div class="tips"><span>请填写管理员手机号</span></div> -->
                   </dd>
                   <dd class="mes">
                       <div class="tips"><span>请填写管理员手机号</span></div>
                   </dd>
               </dl>

               <dl style="overflow: inherit">
                   <dt>账套数量<i>*</i></dt>
                   <dd class="ipt_box">
                       <!--<input id="" name="" type="text" placeholder="购买账套数量" />-->
                       <select name="" id="FdbNumber">
                           <option value="1">1</option>
                           <option value="2">2</option>
                           <option value="3">3</option>
                       </select>
                       <span class="clear"></span>
                       <!-- <div class="tips"><span>请填写购买账套数量</span></div> -->
                   </dd>
                   <dd class="mes">
                       <div class="tips"><span>请填写账套数量</span></div>
                   </dd>
                   <div class="clearfix"></div>
               </dl>
               <!--<dl style="height:40px;overflow:hidden;">
                   <dt></dt>
                   <dd class="ipt_box protocol">
                       <input id="agree" type="checkbox" checked />
                       <span><label for="agree">我已阅读并接受</label><a href="#">《XXXX用户协议》</a></span>
                   </dd>
               </dl>-->
               <dl>
                   <dt></dt>
                   <dd class="ipt_box">
                       <input class="regBtn" type="button" value="立即申请" onclick="check()"/>
                   </dd>
                   <!--<dd class="mes">
                       <div class="error"><span class="error_icon"></span><span>你还未同意协议</span></div>
                   </dd>-->
               </dl>

           </form>
       </div>
    </div>
    <!--<div class="lg_bottom">
        <div class="lg_footer" style="background: none;">
            <p>© 2014-2018 Newtouch.com</p>
        </div>
    </div>-->
</div>

</body>
</html>
<script  type="text/javascript">
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
	/*  $.ajax(
	{
	    type : "post",
		url : "../../CSMANAGER/getInfo.action",
		data : {"CompanyName" : CompanyName, "CompanyEmail" : CompanyEmail,
				"AdminID" : AdminID, "AdminPWD" : AdminPWD,
				"AdminPhone" : AdminPhone,"RegistrationName": RegistrationName,"FdbNumber" : FdbNumber},
		dataType : "json",
		async:false,
		success : function(data)
		{
			layer.alert("试用申请提交成功,稍后我们会发送试用信息到您的公司邮箱");
		},
		error:function (XMLHttpRequest, textStatus, errorThrown) 
		{      
			layer.alert(XMLHttpRequest.responseText);
		}
	});  */
}

</script>
