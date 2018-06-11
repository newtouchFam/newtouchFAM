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
public class TrialBalanceDao extends CommonDAO
{
	
	public String getTableName(ConditionMap cdtMap) throws Exception 
	{
		CallableStatement proc = null;
        ResultSet rs = null;
        try
        {
        	Connection conn = this.getConnection();
    		//调用存储过程
			proc = conn.prepareCall(" { CALL PROC_TrialBalance(?, ?, ?, ?, ?, ? ) } ");
			proc.setString(1, cdtMap.getString("uqcompanyid"));
			proc.setString(2, cdtMap.getString("uqaccountsetid"));
			proc.setString(3, cdtMap.getString("yearmonth"));
			proc.setString(4, cdtMap.getString("intstatus"));
			proc.registerOutParameter(5, Types.VARCHAR);
			proc.registerOutParameter(6, Types.VARCHAR);
			//执行sql
			proc.executeQuery();
			//获得返回的表名
			rs = (ResultSet) proc.getObject(proc.getParameterMetaData().getParameterCount());
			String  tableName =  proc.getString(5);
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
	
	public PageData<EntityMap> getPageData(ConditionMap cdt) throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tmp.ROW_NUM,  ");
		sb.append(" tmp.VARCODE, tmp.VARNAME, ");
		sb.append(" tmp.NCJFYE, tmp.NCDFYE, ");
		sb.append(" tmp.SQJFYE, tmp.SQDFYE, ");
		sb.append(" tmp.BQJF, tmp.BQDF, ");
		sb.append(" tmp.BQJFYE, tmp.BQDFYE, ");
		sb.append(" tmp.QMJFYE, tmp.QMDFYE, ");
		sb.append(" tmp.BQLJJFYE, tmp.BQLJDFYE ");
		sb.append(" FROM ").append(cdt.getString("tablename")).append(" tmp ");
		sb.append(" ORDER BY tmp.ROW_NUM ");
		return this.getMapPage(sb.toString(), cdt.getStart(), cdt.getLimit());
	}
}
