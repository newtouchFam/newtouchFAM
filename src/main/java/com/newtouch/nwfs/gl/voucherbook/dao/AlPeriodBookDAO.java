package com.newtouch.nwfs.gl.voucherbook.dao;

/**
 * 科目分户余额表
 */
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.session.M8Session;

@Repository
public class AlPeriodBookDAO extends CommonDAO
{

	/*
	 * 通过查询条件调用存储过程，返回查询数据临时表的表名
	 */
	public String getTableName(ConditionMap cdt) throws Exception
	{
		
		
		//分户明细id
		String ledgerids = cdt.getString("ledgerdetailid");
		//分户明细id
		String ledgertypeids = cdt.getString("ledgertypeid");
		String[] ledgerdetailid = ledgerids.split(",");
    	String[] ledgertypeid = ledgertypeids.split(",");
    	
    	String bulkid = UUID.randomUUID().toString().toUpperCase();
    	
    	for(int i = 0; i < ledgerdetailid.length; i++)
    	{
    		String strsql = "";
    		strsql = "insert into TGL_TMP_IDLIST(bulkid, typename, id)";
    		strsql += "values (?, ?, ?)";
    		this.execute(strsql, new String []{bulkid,"ledgerdetail",ledgerdetailid[i]});
    	}
    	
    	for(int i = 0; i < ledgertypeid.length; i++)
    	{
    		String strsql = "";
    		strsql = "insert into TGL_TMP_IDLIST(bulkid, typename, id)";
    		strsql += "values (?, ?, ?)";
    		this.execute(strsql, new String []{bulkid,"ledgertype",ledgertypeid[i]});
    	}
		
		M8Session m8session = new M8Session();
		//公司id
		String companyid = ObjectUtils.toString(m8session.getCompanyID());
		//科目套id
		String uqaccountsetid = ObjectUtils.toString(m8session.getAttribute("ACCOUNTSETID"));
		//科目编码
		String accountcode = cdt.getString("accountcode");
		//起始会计期
		int startperiod = cdt.getInteger("startperiod");
		//结束会计期
		int endperiod = cdt.getInteger("endperiod");
		//凭证状态
		int intstatus = cdt.getInteger("intstatus");
				
		CallableStatement proc = null;
        ResultSet rs = null;
        try
        {
			Connection conn =  this.getConnection();
			proc = conn.prepareCall(" { CALL PROC_KMFH_BALANCE(?, ?, ?, ?, ?, ?, ?, ?, ?) } ");
			proc.setString(1, companyid);
			proc.setString(2, uqaccountsetid);
			proc.setString(3, accountcode);
			proc.setString(4, bulkid);
			proc.setInt(5, startperiod);
			proc.setInt(6, endperiod);
			proc.setInt(7, intstatus);
			proc.registerOutParameter(8, oracle.jdbc.OracleTypes.VARCHAR);
			proc.registerOutParameter(9, oracle.jdbc.OracleTypes.VARCHAR);
			proc.execute();
			
			rs = (ResultSet) proc.getObject(proc.getParameterMetaData().getParameterCount());
			String  gettablename =  proc.getString(8);
			return gettablename;
        }catch(Exception e)
        {
        	e.printStackTrace();
        	return null;
        }finally
        {
        	if (rs != null)
            {
                try {
					rs.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
            }
            if (proc != null)
            {
                try {
					proc.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
            }
        }
	}

	/*
	 * 查询临时表的数据
	 */
	public PageData<EntityMap> getPageData(int start, int limit, ConditionMap cdt) throws Exception
	{
		String strsql = new String();
		strsql += " select tmp.ROW_NUM,tmp.LEDGERCODE,tmp.LEDGERNAME,tmp.BEGINDEBIT,  ";
		strsql += " tmp.BEGINCREDIT, tmp.PERIODDEBIT,tmp.PERIODCREDIT, ";
		strsql += " tmp.ENDDEBITREST,tmp.ENDCREDITREST from ";
		strsql += cdt.getString("tablename");
		strsql += "  tmp ";
		
		return this.getMapPage(strsql, start, limit);
	}
}
