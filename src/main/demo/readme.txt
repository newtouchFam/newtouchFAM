一、普通增删改查
com.newtouch.cloud.demo.crud.*
webapp\demo\crud\*

二、报表（最佳实践）
com.newtouch.cloud.demo.report.action.JRSimpleAction
com.newtouch.cloud.demo.report.bp.JRSimpleDemoBP
com.newtouch.cloud.demo.report.dao.JRSimpleDemoDAO
webapp\demo\report\*

1.固定样式报表
2.查询报表（不分页）
3.查询报表（分页）
4.动态表格报表
5.多表格报表

三、报表（移植）
com.newtouch.cloud.demo.report.action.JRMigrationAction
com.newtouch.cloud.demo.report.bp.JRMigrationBP
com.newtouch.cloud.demo.report.dao.JRMigrationDAO

移植步骤
1.删除主报表/报表属性/More.../Scriptlet class
2.修改主报表/嵌套子报表/Subreport properties/Subreport Expression，改为$P{SUBREPORT_DIR
3.重新实现Action，从com.newtouch.cloud.common.jasperreports.JRClassicBaseAction，
	并实现以下这两个接口
	public String report(Model model, HttpServletRequest request)
	public Object count(HttpServletRequest request)
	注意接口report一定不能标注@ResponseBody
	接口count一定要标注@ResponseBody
4.移植Action层代码
5.配置report和count的url地址
7.修改js页面中的请求地址