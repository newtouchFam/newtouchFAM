package com.newtouch.nwfs.gl.voucherbook.dao;
/**
 * 总分类账
 */

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
public class GlBookDao extends CommonDAO
{
	/**
	 * 从临时表中获得前台展现的数据 
	 */
	public PageData<EntityMap> getPageData(ConditionMap cdtMap) throws Exception 
	{
		
		String strsql = "";
		strsql += " select tb.ROW_NUM ROW_NUM,tb.DTACCOUNTDATE DTFILLER,";
		strsql += "case when tb.MNYDEBIT = '0.00' then '' else tb.MNYDEBIT end as MNYDEBIT,";
		strsql += "case when tb.MNYCREDIT = '0.00' then '' else tb.MNYCREDIT end as MNYCREDIT,";
		strsql += "tb.VARFLAG INTDCFLAG,";
		strsql += "case when tb.MNYAMOUNT = '0.00' then '' else tb.MNYAMOUNT end as BALANCE";
		strsql += " from ";
		strsql += cdtMap.getString("tablename")+" tb ";
		
		return this.getMapPage(strsql,cdtMap.getStart(), cdtMap.getLimit());
	}
	/**
	 * 调用存储过程,获得临时表名
	 */
	public String getglbooktableName(ConditionMap cdtMap) throws Exception
	{
		//获取需要调用存储过程传入的参数
        M8Session M8session = new M8Session();
        String UQACCOUNTSETID = ObjectUtils.toString(M8session.getAttribute("ACCOUNTSETID"));
        String UQCOMPANYID = ObjectUtils.toString(M8session.getCompanyID());
    	String BeginAccount = cdtMap.getString("startAccount");		//起始科目
		String EndAccount = cdtMap.getString("endAccount");			//结束科目
		int accountLevel = cdtMap.getInteger("accountLevel");		//级次
		int beginyearmonth = cdtMap.getInteger("beginyearmonth");	//起始会计期
		int endyearmonth = cdtMap.getInteger("endyearmonth");		//结束会计期
		int intstatus = cdtMap.getInteger("intstatus");				//凭证状态（0：全部，1：未记账，2：已记账）
		int isLastLevel = cdtMap.getInteger("isLastLevel");	//是否末级（1：是，0：否）
		
		CallableStatement proc = null;
        ResultSet rs = null;
        try
        {
        	Connection conn = this.getConnection();
			
			//调用总分类的存储过程
			proc = conn.prepareCall(" { CALL PROC_ZFL(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) } ");
			//传参
			proc.setString(1,UQCOMPANYID);	   //公司id
			proc.setString(2, UQACCOUNTSETID);  //科目套id
			proc.setString(3, BeginAccount);    //开始科目  
			proc.setString(4, EndAccount);      //结束科目
			proc.setInt(5, accountLevel);     //级次
			proc.setInt(6, beginyearmonth);      //开始会计期 
			proc.setInt(7, endyearmonth);         //结束会计期 
			proc.setInt(8, intstatus);      //凭证状态
			proc.setInt(9, isLastLevel);    //是否末级
			proc.registerOutParameter(10, Types.VARCHAR);
			proc.registerOutParameter(11, Types.VARCHAR);
			
			//执行sql
			proc.executeQuery();
			
			//获得返回的表名
			rs = (ResultSet) proc.getObject(proc.getParameterMetaData().getParameterCount());
			String  tablename =  proc.getString(10);
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