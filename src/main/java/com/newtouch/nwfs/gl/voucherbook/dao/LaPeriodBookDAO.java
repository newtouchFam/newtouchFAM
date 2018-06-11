package com.newtouch.nwfs.gl.voucherbook.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;

@Repository
public class LaPeriodBookDAO extends CommonDAO
{
	public String getTableName(ConditionMap cdtMap)
	{
		CallableStatement proc = null;
        ResultSet rs = null;
        try
        {
    		Connection conn = this.getConnection();
    		//调用存储过程
    		proc = conn.prepareCall(" { CALL PROC_LEDGER_ACCREST(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) } ");
		    proc.setString(1, cdtMap.getString("uqcompanyid"));
		    proc.setString(2, cdtMap.getString("uqaccountsetid"));
		    proc.setString(3, cdtMap.getString("ledgerde"));
		    proc.setString(4, cdtMap.getString("ledgerTypeID"));
		    proc.setString(5, cdtMap.getString("beginaccount"));
		    proc.setString(6, cdtMap.getString("endaccount"));
		    proc.setInt(7, cdtMap.getInteger("accountlevel"));
		    proc.setInt(8, cdtMap.getInteger("beginyearmonth"));
		    proc.setInt(9, cdtMap.getInteger("endyearmonth"));
		    proc.setInt(10, cdtMap.getInteger("intstatus"));
		    proc.registerOutParameter(11, Types.VARCHAR);
		    proc.registerOutParameter(12, Types.VARCHAR);
    		//执行sql
			proc.executeQuery();
    		//获得返回的表名
			rs = (ResultSet) proc.getObject(proc.getParameterMetaData().getParameterCount());
    		String  tableName =  proc.getString(11);
    		return tableName;
        }
        catch (Exception e) 
        {
        	e.printStackTrace();
        	return null;
		}
        finally
        {
        	try 
            {
		    	if (rs != null)
		        {
					rs.close();
		        }
		        if (proc != null)
		        {
		        	proc.close();
		        }
            } 
            catch (SQLException e) 
            {
				e.printStackTrace();
			}
        }
	}
	
	public PageData<EntityMap> getReportData(ConditionMap cdtMap)
	{
		StringBuilder sb = new StringBuilder();
	  sb.append(" SELECT ROW_NUM, ");
	  sb.append(" tmp.VARACCOUNTCODE, ");
	  sb.append(" tmp.VARACCOUNTNAME, ");
	  sb.append(" tmp.BEGINDEBIT, ");
	  sb.append(" tmp.BEGINCREDIT, ");
	  sb.append(" tmp.PERIODDEBIT, ");
	  sb.append(" tmp.PERIODCREDIT, ");
	  sb.append(" tmp.ENDDEBITREST, ");
	  sb.append(" tmp.ENDCREDITREST ");
	  sb.append(" FROM ").append(cdtMap.get("tablename")).append(" tmp ");
	  sb.append(" LEFT JOIN tgl_accounts ta ON ta.VARACCOUNTCODE = tmp.VARACCOUNTCODE ");
	  sb.append(" ORDER BY VARACCOUNTCODE ");
  //  return this.getMapPage(strsql,start,limit);
		return super.getMapPage(sb.toString(), cdtMap.getStart(), cdtMap.getLimit());
	}
}
