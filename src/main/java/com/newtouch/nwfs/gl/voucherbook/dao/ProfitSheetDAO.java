package com.newtouch.nwfs.gl.voucherbook.dao;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nsreport.calculator.NSRCalculator;
import com.newtouch.workflow.ssc.util.GlobalParamUtil;

@Repository
public class ProfitSheetDAO extends CommonDAO
{
	public List<Map<String, Object>> getReportData(ConditionMap cdtMap) throws Exception
	{
		/**
		 * 根据全局参数读取报表配置文件名称
		 */
		String reportConfigFile = GlobalParamUtil.getParamString("income_statement_xmlpath");

		String webAppRoot = cdtMap.getString("webapproot");

		String reportConfigFilePath = webAppRoot + File.separator + "wfs";
		reportConfigFilePath += File.separator + "gl";
		reportConfigFilePath += File.separator + "voucherbook";
		reportConfigFilePath += File.separator + "profitsheet";
		reportConfigFilePath += File.separator + reportConfigFile;
		
		String intyearmonth = cdtMap.getString("comperiod");
		
		String yearstr = intyearmonth.substring(0, 4);
//		String monthstr = intyearmonth.substring(5, 6);
		String monthstr = intyearmonth.substring(4, 6);
		
		int year = Integer.parseInt(yearstr);
		int month = Integer.parseInt(monthstr);

		/**
		 * 创建报表计算类
		 */
		NSRCalculator calculator = new NSRCalculator(super.getConnection());

		/**
		 * 解析报表规则XML配置文件
		 */
		calculator.parseConfigurationFile(reportConfigFilePath);

		M8Session session = new M8Session();
		EntityMap attachParam = new EntityMap();
		List<Map<String, Object>> list = calculator.calculateReportData(session.getCompanyID(), year, month, attachParam);

		return list;
	}
}