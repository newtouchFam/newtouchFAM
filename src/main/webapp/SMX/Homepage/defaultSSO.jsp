<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	String contextPath = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ contextPath;

	//如果是https协议，则去掉端口号
	if ( request.getScheme().equalsIgnoreCase("https") ) 
		basePath = request.getScheme() + "://" + request.getServerName() + request.getContextPath()+"/";

	response.sendRedirect(basePath + "/loginsso.action");
%>

<HTML>
<HEAD>
<base href="<%=basePath%>">
</HEAD>
<body>
跳转，避免单点登录url带参数
</body>
</HTML>