	var extCSS = document.createElement("link");
	extCSS.setAttribute("rel","stylesheet");
	extCSS.setAttribute("type","text/css");
	extCSS.setAttribute("href","/XineM8/ext/resources/css/ext-all.css");
	document.getElementById("extHead").appendChild(extCSS);
	
	var extDocCSS = document.createElement("link");
	extDocCSS.setAttribute("rel","stylesheet");
	extDocCSS.setAttribute("type","text/css");
	extDocCSS.setAttribute("href","/XineM8/SMX/resources/css/docs.css");
	document.getElementById("extHead").appendChild(extDocCSS);
	
	var extLoadingCSS = document.createElement("link");
	extLoadingCSS.setAttribute("rel","stylesheet");
	extLoadingCSS.setAttribute("type","text/css");
	extLoadingCSS.setAttribute("href","/XineM8/SMX/resources/css/MSG.css");
	document.getElementById("extHead").appendChild(extLoadingCSS);
	
	var extBase = document.createElement("script");
	extBase.setAttribute("type","text/javascript");
	extBase.setAttribute("src","/XineM8/ext/adapter/ext/ext-base.js");
	document.getElementById("extHead").appendChild(extBase);
	
	var extAll = document.createElement("script");
	extAll.setAttribute("type","text/javascript");
	extAll.setAttribute("src","/XineM8/ext/ext-all-debug.js");
	document.getElementById("extHead").appendChild(extAll);
	
//	var extCH = document.createElement("script");
//	extCH.setAttribute("type","text/javascript");
//	extCH.setAttribute("src","/XineM8/ext/ext-lang-zh_CN.js");
//	document.getElementById("extHead").appendChild(extCH);
	
