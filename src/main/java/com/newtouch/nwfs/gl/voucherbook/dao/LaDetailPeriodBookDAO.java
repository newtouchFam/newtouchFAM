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
public class LaDetailPeriodBookDAO extends CommonDAO
{
	public PageData<EntityMap> getReportData(ConditionMap cdtMap)
	{
		//调用获得临时表明的方法
		String  strsql = "";
		strsql += " select td.ROW_NUM,td.VARSOURCENAME UQNUMBERING ,td.INTCOMPANYSEQ  INTCOMPANYSEQ,td.VARNUMBERNAME INTVOUCHERNUM,";
		strsql += " DATE_FORMAT(td.DTACCOUNTDATE,'%Y-%m-%d') as DTFILLER,";
		strsql += " td.VARABSTRACT VARABSTRACT, td.UQVOUCHERID, cast(td.MNYDEBIT as DECIMAL(18,2)) as MNYDEBIT,";
		strsql += " cast(td.MNYCREDIT as DECIMAL(18,2)) as MNYCREDIT ,td.VARFLAG INTDCFLAG, ";
		strsql += " cast(td.MNYAMOUNT as DECIMAL(18,2))as BALANCE";
		strsql += " from ";
		strsql += cdtMap.getString("tablename") + " td ";
		return this.getMapPage(strsql, cdtMap.getStart(), cdtMap.getLimit());
	}
	
	public String getTableName(ConditionMap cdtMap)  
	{
		//获得组件的值 准备传参 调用存储过程
        M8Session m8session = new M8Session();
        String uqaccountsetid = ObjectUtils.toString(m8session.getAttribute("ACCOUNTSETID")); //科目套ID
        String uqcompanyid = ObjectUtils.toString(m8session.getCompanyID());			//单位ID	
        String ledgerdeid = cdtMap.getString("ledgerdetailid");
        String ledgertype = cdtMap.getString("ledgertypeid");
        String beginaccount = cdtMap.getString("beginaccount");		//起始科目
		String endaccount = cdtMap.getString("endaccount");			//结束科目
		int accountlevel = cdtMap.getInteger("accountlevel");		//级次
		int beginyearmonth = cdtMap.getInteger("beginyearmonth");	//起始会计期
		int endyearmonth = cdtMap.getInteger("endyearmonth");		//结束会计期
		int intstatus = cdtMap.getInteger("intstatus");				//凭证状态（0：全部，1：未记账，2：已记账）
		int isallzerodata = cdtMap.getInteger("isallzerodata");		//无年初数、发生数科目不显示（1：是，0：否）
		int isallbalance = cdtMap.getInteger("isallbalance");		//逐笔显示余额（1：是，0：否）
		
		CallableStatement proc = null;
        ResultSet rs = null;
        try
        {
        	Connection conn = this.getConnection();
			//调用明细账的存储过程
			proc = conn.prepareCall(" { CALL PROC_LEDGER_MXZ(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?, ?) } ");
			//传参
			proc.setString(1,uqcompanyid);	
			proc.setString(2, uqaccountsetid);
			proc.setString(3, ledgerdeid);
			proc.setString(4, ledgertype);
			proc.setString(5, beginaccount);
			proc.setString(6, endaccount);
			proc.setInt(7, accountlevel);
			proc.setInt(8, beginyearmonth);
			proc.setInt(9, endyearmonth);
			proc.setInt(10, intstatus);
			proc.setInt(11, isallzerodata);
			proc.setInt(12, isallbalance);
			proc.registerOutParameter(13, Types.VARCHAR);
			proc.registerOutParameter(14, Types.VARCHAR);
			
			//执行sql
			proc.executeQuery();
			
			//获得返回的表名
			rs = (ResultSet) proc.getObject(proc.getParameterMetaData().getParameterCount());
			String tablename = proc.getString(13);
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
