package com.newtouch.nwfs.gl.voucherbook.dao;

import java.io.File;
import java.util.HashMap;
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
public class BalanceSheetDAO extends CommonDAO
{
	public List<Map<String, Object>> getReportData(ConditionMap cdtMap) throws Exception
	{
		/**
		 * 根据全局参数读取报表配置文件名称
		 */
		String reportConfigFile = GlobalParamUtil.getParamString("balance_sheet_xmlpath");

		String webAppRoot = cdtMap.getString("webapproot");

		String reportConfigFilePath = webAppRoot + File.separator + "wfs";
		reportConfigFilePath += File.separator + "gl";
		reportConfigFilePath += File.separator + "voucherbook";
		reportConfigFilePath += File.separator + "balancesheet";
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

		EntityMap attachParam = this.getData(calculator, year, month);

		/**
		 * 传入参数，根据规则计算得到报表数据
		 */
		M8Session session = new M8Session();

		List<Map<String, Object>> list = calculator.calculateReportData(session.getCompanyID(), year, month, attachParam);

		return list;
	}

	private EntityMap getData(NSRCalculator calculator, int year, int month)
	{
		String strSqlIn = "";
		for (String accountCode : calculator.getConfiguration().getAccountCodeList())
		{
			if (strSqlIn.length() > 0)
			{
				strSqlIn += ", ";
			}
			strSqlIn += "'" + accountCode + "'";
		}

		M8Session session = new M8Session();

		String strYearMonth_qm = "";
		if(month > 0 && month < 10)
		{
			strYearMonth_qm = String.valueOf(year) + "0" + String.valueOf(month);
		}
		else
		{
			strYearMonth_qm = String.valueOf(year) + String.valueOf(month);
		}

		String strYearMonth_nc = "";
		strYearMonth_nc = year + "00";

		String strSql = "select acc2.varaccountcode, acc2.varaccountfullname,";
		strSql += " ifnull((";
		strSql += "     select ifnull(sum(ifnull(pa.mnydebitperiod, 0) - ifnull(pa.mnycreditperiod, 0)), 0)";
		strSql += "     from tgl_period_accounts pa";
		strSql += "     	inner join tgl_accounts acc1 on acc1.uqaccountid = pa.uqaccountid";
		strSql += "     	inner join tgl_global_periods gp on gp.uqglobalperiodid = pa.uqglobalperiodid";
		strSql += "     where pa.uqcompanyid = ? ";
		strSql += "         and acc1.intislastlevel = 1";
		strSql += "         and gp.intyearmonth <= ?";
		strSql += "         and acc1.varaccountcode like concat(acc2.varaccountcode, '%')";
		strSql += " ), 0) as amount_qm,";
		strSql += " ifnull((";
		strSql += "     select ifnull(sum(ifnull(pa.mnydebitperiod, 0) - ifnull(pa.mnycreditperiod, 0)), 0)";
		strSql += "     from tgl_period_accounts pa";
		strSql += "     	inner join tgl_accounts acc1 on acc1.uqaccountid = pa.uqaccountid";
		strSql += "     	inner join tgl_global_periods gp on gp.uqglobalperiodid = pa.uqglobalperiodid";
		strSql += "     where pa.uqcompanyid = ? ";
		strSql += "         and acc1.intislastlevel = 1";
		strSql += "         and gp.intyearmonth <= ?";
		strSql += "         and acc1.varaccountcode like concat(acc2.varaccountcode, '%')";
		strSql += " ), 0) as amount_nc";
		strSql += " from tgl_accounts acc2";
		strSql += " where acc2.varaccountcode in (" + strSqlIn + ")";
		strSql += " order by acc2.varaccountcode";
		List<EntityMap> list_qm = super.getMapList(strSql, new String[] {session.getCompanyID(),
				strYearMonth_qm, session.getCompanyID(), strYearMonth_nc });

		HashMap<String, Object> hashMap_qm = new HashMap<String, Object>();
		HashMap<String, Object> hashMap_nc = new HashMap<String, Object>();
		for(EntityMap row : list_qm)
		{
			hashMap_qm.put(row.getString("varaccountcode"), row.getDouble("amount_qm"));
			hashMap_nc.put(row.getString("varaccountcode"), row.getDouble("amount_nc"));
		}

		EntityMap attachParam = new EntityMap();
		attachParam.put("qm", hashMap_qm);
		attachParam.put("nc", hashMap_nc);

		return attachParam;
	}
}