<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
    <title>试用申请</title>
	<%@ include file="/cloud/common/common_meta_basepath.jspf" %>	
	<%@ include file="/cloud/common/common_css_jquery.jspf" %>
	<%@ include file="/cloud/common/common_js_jquery.jspf" %>
	
	<link rel="stylesheet" type="text/css" href="platform/resources/css/content-style.css" />
	<link rel="stylesheet" type="text/css" href="platform/resources/css/style-base.css" />
	<link rel="stylesheet" type="text/css" href="platform/resources/css/register.css" />
	
	<script type="text/javascript" src="platform/login/jplaceholder.js"></script>
    <script type="text/javascript" src="jquery/jquery.searchableSelect.js"></script>
    <script type="text/javascript" src="platform/login/register.js"></script>
</head>
<body class="" style="background: #fff;">
<div class="" style="background: url(platform/resources/images/reg_bg.jpg) no-repeat; width: 100%;height: 100%;background-size: cover;-webkit-background-size: cover; overflow-y: auto\9;">
    <div class="lg_header">
        <div class="lg_header_box">
            <img class="fleft" src="img/lg_logo.png" alt=""/>
            <h2 class="fleft">财务核算</h2>
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
                   </dd>
                   <dd class="mes">
                       <div class="tips"><span>请填写管理员手机号</span></div>
                   </dd>
               </dl>

               <dl style="overflow: inherit">
                   <dt>账套数量<i>*</i></dt>
                   <dd class="ipt_box">
                       <select name="" id="FdbNumber">
                           <option value="1">1</option>
                           <option value="2">2</option>
                           <option value="3">3</option>
                       </select>
                       <span class="clear"></span>
                   </dd>
                   <dd class="mes">
                       <div class="tips"><span>请填写账套数量</span></div>
                   </dd>
                   <div class="clearfix"></div>
               </dl>
               <dl>
                   <dt></dt>
                   <dd class="ipt_box">
                       <input class="regBtn" type="button" value="立即申请" onclick="check()"/>
                   </dd>
               </dl>

           </form>
       </div>
    </div>
</div>
</body>
</html>
