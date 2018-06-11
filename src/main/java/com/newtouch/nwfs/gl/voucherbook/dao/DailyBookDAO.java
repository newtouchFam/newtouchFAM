package com.newtouch.nwfs.gl.voucherbook.dao;
/**
 * 日记账
 */
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.session.M8Session;

@Repository
public class DailyBookDAO extends CommonDAO
{
	/* 查询日记账 */
	public PageData<EntityMap> getPageData(ConditionMap cdt) throws Exception
	{	
		String strsql = new String();
		strsql += " select tb.ROW_NUM,tb.VARSOURCENAME as UQNUMBERING,tb.INTCOMPANYSEQ, tb.VARNUMBERNAME as INTVOUCHERNUM, ";
		strsql += " DATE_FORMAT(tb.DTACCOUNTDATE,'%Y-%m-%d') as DTFILLER, ";
		strsql += " tb.VARABSTRACT,case when  tb.MNYDEBIT = '0.00' then '' else  tb.MNYDEBIT end as MNYDEBIT, ";
		strsql += " case when tb.MNYCREDIT = '0.00' then '' else tb.MNYCREDIT end as MNYCREDIT,tb.VARFLAG as DIRECFLAG, ";
		strsql += " case when tb.MNYAMOUNT = '0.00' then '' else tb.MNYAMOUNT end as  BALANCE,  tb.UQVOUCHERID, ";
		strsql += " tb.VARGROUPCODE, tb.UQACCOUNTID, tb.VARACCOUNTCODE from ";
		strsql += cdt.getString("tablename");
		strsql += "  tb ";
		
		return this.getMapPage(strsql,cdt.getStart(), cdt.getLimit());
	}
	
	//通过条件查询数据，最后生成临时表，将数据插入临时表中，输出的第一个参数就是表名
	public String getTableName(ConditionMap cdt) throws Exception
	{
		M8Session m8session = new M8Session();
		
		//公司id
		String companyid = ObjectUtils.toString(m8session.getCompanyID());
		//科目套id
		String uqaccountsetid = ObjectUtils.toString(m8session.getAttribute("ACCOUNTSETID"));
		//开始科目编码
		String startaccountcode = cdt.getString("startaccountcode");
		//结束科目编码
		String endaccountcode = cdt.getString("endaccountcode");
		//科目等级
		int accountlevel = cdt.getInteger("accountlevel");
		//起始会计期
		int startperiod = cdt.getInteger("startperiod");
		//结束会计期
		int endperiod = cdt.getInteger("endperiod");
		//凭证状态
		int intstatus = cdt.getInteger("intstatus");
		//是否末级（1：是，0：否）
		int islastlevel = cdt.getInteger("islastlevel");
		//无年初数、发生数科目不显示（1：是，0：否）
		int isseveral = cdt.getInteger("isseveral");
		//逐笔显示余额
		int isalldisplayed = cdt.getInteger("isalldisplayed");
		
		CallableStatement proc = null;
        ResultSet rs = null;
        try
        {
        	Connection conn = this.getConnection();
        	
			proc = conn.prepareCall(" { CALL PROC_RJZ(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) } ");
			proc.setString(1, companyid);
			proc.setString(2, uqaccountsetid);
			proc.setString(3, startaccountcode);
			proc.setString(4, endaccountcode);
			proc.setInt(5, accountlevel);
			proc.setInt(6, startperiod);
			proc.setInt(7, endperiod);
			proc.setInt(8, intstatus);
			proc.setInt(9, islastlevel);
			proc.setInt(10, isseveral);
			proc.setInt(11, isalldisplayed);
			proc.registerOutParameter(12, oracle.jdbc.OracleTypes.VARCHAR);
			proc.registerOutParameter(13, oracle.jdbc.OracleTypes.VARCHAR);
			proc.execute();
			
			rs = (ResultSet) proc.getObject(proc.getParameterMetaData().getParameterCount());
			String  gettablename =  proc.getString(12);
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
}
