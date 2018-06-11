package com.newtouch.nwfs.gl.voucherbook.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.UUID;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.session.M8Session;

@Repository
public class AlGlBookDAO extends CommonDAO
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
		return this.getMapPage(strsql, cdtMap.getStart(), cdtMap.getLimit());
	}

	public String getTableName(ConditionMap cdtMap) 
	{
		//1.解析ids插入临时表
    	String ledgerdetailids = cdtMap.getString("ledgerdetailid");
    	String ledgertypeids = cdtMap.getString("ledgertypeid");
    	
    	String[] ledgerdetailid = ledgerdetailids.split(",");
    	String[] ledgertypeid = ledgertypeids.split(",");
    	
    	String bulkid = UUID.randomUUID().toString().toUpperCase();
    	
    	for(int i = 0; i < ledgerdetailid.length; i++)
    	{
    		String strsql = "";
    		strsql = "insert into TGL_TMP_IDLIST(bulkid, typename, id)";
    		strsql += "values (?, ?, ?)";
    		this.execute(strsql, new String[]{bulkid,"ledgerdetail",ledgerdetailid[i]});
    	}
    	
    	for(int i = 0; i < ledgertypeid.length; i++)
    	{
    		String strsql = "";
    		strsql = "insert into TGL_TMP_IDLIST(bulkid, typename, id)";
    		strsql += "values (?, ?, ?)";
    		this.execute(strsql, new String []{bulkid,"ledgertype",ledgertypeid[i]});
    	}
		
		//获取需要调用存储过程传入的参数
        M8Session M8session = new M8Session();
        String companyid = ObjectUtils.toString(M8session.getCompanyID());
        String accountsetid = ObjectUtils.toString(M8session.getAttribute("ACCOUNTSETID"));
		String accountcode = cdtMap.getString("accountcode");		//科目编码
		int beginyearmonth = cdtMap.getInteger("beginyearmonth");   //开始会计期
		int endyearmonth = cdtMap.getInteger("endyearmonth");       //结束会计期
		int intstatus = cdtMap.getInteger("intstatus");				//凭证状态（0：全部，1：未记账，2：已记账）
	
		CallableStatement proc = null;
        ResultSet rs = null;
        try
        {
			Connection conn = this.getConnection();
			
			//调用科目分户总分类的存储过程
			proc = conn.prepareCall(" { CALL PROC_ALZFL(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) } ");
			//传参
			proc.setString(1,companyid);	   //公司id
			proc.setString(2, accountsetid);  //科目套id
			proc.setString(3, bulkid);    //批次号
			proc.setString(4, accountcode);     //科目编码
			proc.setInt(5, 99);     //级次
			proc.setInt(6, beginyearmonth);      //开始会计期 
			proc.setInt(7, endyearmonth);         //结束会计期 
			proc.setInt(8, intstatus);      //凭证状态
			proc.registerOutParameter(9, Types.VARCHAR);
			proc.registerOutParameter(10, Types.VARCHAR);
			
			//执行sql
			proc.executeQuery();
			
			//获得返回的表名
			rs = (ResultSet) proc.getObject(proc.getParameterMetaData().getParameterCount());
			String  tablename =  proc.getString(9);
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
