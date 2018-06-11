package com.newtouch.nwfs.gl.voucherbook.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.session.M8Session;

@Repository
public class LedgerGLBookDAO extends CommonDAO
{
	public PageData<EntityMap> getReportData(ConditionMap cdtMap)
	{
		String strsql = "";
		strsql += " select tb.ROW_NUM ROW_NUM,tb.DTACCOUNTDATE DTFILLER,";
		strsql += " cast(tb.MNYDEBIT as DECIMAL(18,2)) as MNYDEBIT,";
		strsql += " cast(tb.MNYCREDIT as DECIMAL(18,2)) as MNYCREDIT,";
		strsql += " tb.VARFLAG INTDCFLAG,";
		strsql += " cast(tb.MNYAMOUNT as DECIMAL(18,2)) as BALANCE";
		strsql += " from ";
		strsql += cdtMap.getString("tablename") + " tb ";
		return super.getMapPage(strsql, cdtMap.getStart(), cdtMap.getLimit());
	}
	
	public String getglbooktableName(ConditionMap cdtMap) 
	{
		//获取需要调用存储过程传入的参数
		M8Session M8session = new M8Session();
		String UQACCOUNTSETID = ObjectUtils.toString(M8session.getAttribute("ACCOUNTSETID"));
	    String UQCOMPANYID = ObjectUtils.toString(M8session.getCompanyID());
	    String ledgerde = cdtMap.getString("ledgerdetailid");          //分户ID
	    String ledgerType = cdtMap.getString("ledgertypeid");      //分户类型
	    String BeginAccount = cdtMap.getString("beginaccount");		//起始科目
	    String EndAccount = cdtMap.getString("endAccount");			//结束科目
	    int accountLevel = cdtMap.getInteger("accountLevel");		//级次
		int beginyearmonth = cdtMap.getInteger("beginyearmonth");	//起始会计期
		int endyearmonth = cdtMap.getInteger("endyearmonth");		//结束会计期
		int intstatus = cdtMap.getInteger("intstatus");				//凭证状态（0：全部，1：未记账，2：已记账）
			
		CallableStatement proc = null;
	    ResultSet rs = null;
	    try 
	    {
			Connection conn = this.getConnection();
			
			proc = conn.prepareCall(" { CALL PROC_LEDGER_ZFL(?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,?) } ");
			
			proc.setString(1,UQCOMPANYID);	
			proc.setString(2, UQACCOUNTSETID);
			proc.setString(3, ledgerde);
			proc.setString(4, ledgerType);
			proc.setString(5, BeginAccount);
			proc.setString(6, EndAccount);
			proc.setInt(7, accountLevel);
			proc.setInt(8, beginyearmonth);
			proc.setInt(9, endyearmonth);
			proc.setInt(10, intstatus);
			proc.registerOutParameter(11, Types.VARCHAR);
			proc.registerOutParameter(12, Types.VARCHAR);
			
			//执行sql
			proc.executeQuery();
			//获得返回的表名
			rs = (ResultSet) proc.getObject(proc.getParameterMetaData().getParameterCount());
			String  tablename =  proc.getString(11);
			return tablename;
	    } 
	    catch(Exception e)
        {
        	e.printStackTrace();
        	return null;
        }
        finally
        {
        	if (rs != null)
            {
                try 
                {
					rs.close();
				}
                catch (SQLException e) 
                {
					e.printStackTrace();
				}
            }
            if (proc != null)
            {
                try 
                {
					proc.close();
				} 
                catch (SQLException e) 
                {
					e.printStackTrace();
				}
            }
        }
	}
}
