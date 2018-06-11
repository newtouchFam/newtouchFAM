package com.newtouch.nwfs.gl.voucherbook.nsr;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.newtouch.cloud.common.dao.CommonJDBCDAO;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nsreport.calculator.cell.ifx.INSRCellCalculator;
import com.newtouch.nsreport.config.NSRAccount;

/**
 * 期末
 */
public class QMCellCalculator implements INSRCellCalculator
{
	/**
	 * 单科目取数
	 * @param conn			数据库连接(带事务)
	 * @param unitID		公司ID
	 * @param year			年份
	 * @param month			月份
	 * @param accountCode	科目代码
	 * @param direct		科目余额方向。1: 借方-贷方, -1: 贷方-借方
	 * @param attachParam	附加参数
	 * @return				取数结果
	 */
	@Override
	public double calEq(Connection conn, String unitID, int year, int month,
			String accountCode, int direct, Map<String, Object> attachParam)
	{
		CommonJDBCDAO dao = new CommonJDBCDAO(conn);

		//处理会计期年月
		String strYearMonth = "";
		
		if(month >0 && month < 10)
		{
			strYearMonth = year +"0"+ month;
		}
		else
		{
//			strYearMonth = year + month + "";
			strYearMonth = "" + year + month;
		}
		
		//科目套ID
		M8Session session = new M8Session();
		String accountsetid = session.getAttribute("ACCOUNTSETID") == null? "" : session.getAttribute("ACCOUNTSETID").toString();
		
		List<Object> paras = new ArrayList<Object>();
		
		String strSql = "";
		
		if(direct == 1)
		{
			strSql = "SELECT IFNULL(SUM(tpa.MNYDEBITPERIOD),0) - IFNULL(SUM(tpa.MNYCREDITPERIOD),0) ";
		}
		else
		{
			strSql = "SELECT IFNULL(SUM(tpa.MNYCREDITPERIOD),0)-IFNULL(SUM(tpa.MNYDEBITPERIOD),0)  ";
		}
		
        strSql += "     FROM tgl_period_accounts tpa ";
        strSql += "    INNER JOIN tgl_global_periods tgp ON tgp.UQGLOBALPERIODID=tpa.UQGLOBALPERIODID";
        strSql += "    INNER JOIN tgl_accounts ta ON ta.UQACCOUNTID=tpa.UQACCOUNTID ";
        strSql += "    WHERE tpa.UQCOMPANYID = ? ";
        strSql += "      AND ta.VARACCOUNTCODE LIKE ?";
        strSql += "      AND ta.intislastlevel = 1";
        strSql += "      AND tgp.INTYEARMONTH <= ?";
        strSql += "      AND ta.UQACCOUNTSETID = ?";
        
        paras.add(unitID);
        paras.add(accountCode + "%");
        paras.add(strYearMonth);
        paras.add(accountsetid);
		
		return dao.querySingleDouble(strSql, paras);
	}

	/**
	 * 多科目取数
	 * @param conn			数据库连接(带事务)
	 * @param unitID		公司ID
	 * @param year			年份
	 * @param month			月份
	 * @param accountList	多科目列表
	 * @param direct		科目余额方向。1: 借方-贷方, -1: 贷方-借方
	 * @param attachParam	附加参数
	 * @return				取数结果
	 */
	@Override
	public double calIn(Connection conn, String unitID, int year, int month,
			List<NSRAccount> accountList, int direct, Map<String, Object> attachParam)
	{
		double calsum = 0;
		
		for(int i = 0; i < accountList.size(); i++)
		{
			NSRAccount accountinfo = accountList.get(i);
			double calaccount = this.calEq(conn, unitID, year, month, accountinfo.getAccount(), direct, attachParam);
			
			if("-".equals(accountinfo.getSign()))
			{
				calsum = calsum + (-1) * calaccount;
			}
			else
			{
				calsum = calsum + calaccount;
			}
		}
		
		return calsum;
	}

	/**
	 * 科目范围取数据
	 * @param conn				数据库连接(带事务)
	 * @param unitID			公司ID
	 * @param year				年份
	 * @param month				月份
	 * @param beginAccountCode	开始科目
	 * @param endAccountCode	结束科目
	 * @param direct			科目余额方向。1: 借方-贷方, -1: 贷方-借方
	 * @param attachParam		附加参数
	 * @return					取数结果
	 */
	@Override
	public double calBetween(Connection conn, String unitID, int year, int month,
			String beginAccountCode, String endAccountCode, int direct, Map<String, Object> attachParam)
	{
		CommonJDBCDAO dao = new CommonJDBCDAO(conn);

		//处理会计期年月
		String strYearMonth = "";
		
		if(month >0 && month < 10)
		{
			strYearMonth = year +"0"+ month;
		}
		else
		{
//			strYearMonth = year + month + "";
			strYearMonth = "" + year + month;
		}
		
		//科目套ID
		M8Session session = new M8Session();
		String accountsetid = session.getAttribute("ACCOUNTSETID") == null? "" : session.getAttribute("ACCOUNTSETID").toString();
		
		List<Object> paras = new ArrayList<Object>();
		
		String strSql = "";
		
		if(direct == 1)
		{
			strSql = "SELECT IFNULL(SUM(tpa.MNYDEBITPERIOD),0) - IFNULL(SUM(tpa.MNYCREDITPERIOD),0) ";
		}
		else
		{
			strSql = "SELECT IFNULL(SUM(tpa.MNYCREDITPERIOD),0)-IFNULL(SUM(tpa.MNYDEBITPERIOD),0)  ";
		}
		
        strSql += "     FROM tgl_period_accounts tpa ";
		strSql += "    INNER JOIN tgl_accounts ta ON ta.UQACCOUNTID=tpa.UQACCOUNTID ";
		strSql += "    INNER JOIN tgl_global_periods tgp ON tgp.UQGLOBALPERIODID=tpa.UQGLOBALPERIODID";
		strSql += "    WHERE ";
		strSql += "          tpa.UQCOMPANYID = ? ";
		strSql += "      AND tgp.INTYEARMONTH <= ? ";
		strSql += "      AND ta.VARACCOUNTCODE >= ? ";
		strSql += "      AND ta.VARACCOUNTCODE <= ?";
		strSql += "      AND ta.UQACCOUNTSETID = ?";
        
        paras.add(unitID);
        paras.add(strYearMonth);
        paras.add(beginAccountCode);
        paras.add(endAccountCode);
        paras.add(accountsetid);
		
		return dao.querySingleDouble(strSql, paras);
	}
}