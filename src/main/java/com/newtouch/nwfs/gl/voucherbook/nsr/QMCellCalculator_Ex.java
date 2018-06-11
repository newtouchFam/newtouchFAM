package com.newtouch.nwfs.gl.voucherbook.nsr;

import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.newtouch.nsreport.calculator.cell.ifx.INSRCellCalculator;
import com.newtouch.nsreport.config.NSRAccount;

/**
 * 期末
 */
public class QMCellCalculator_Ex implements INSRCellCalculator
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
	@SuppressWarnings("unchecked")
	@Override
	public double calEq(Connection conn, String unitID, int year, int month,
			String accountCode, int direct, Map<String, Object> attachParam)
	{
		HashMap<String, Object> hashMap = (HashMap<String, Object>)(attachParam.get("qm"));

		if (hashMap.containsKey(accountCode))
		{
			if (direct == 1)
			{
				return Double.valueOf(hashMap.get(accountCode).toString()) + 0.0;
			}
			else
			{
				return - Double.valueOf(hashMap.get(accountCode).toString()) + 0.0;
			}
		}
		else
		{
			return 0;
		}
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
		return 0;
	}
}