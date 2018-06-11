package com.newtouch.nwfs.gl.voucherbook.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.session.M8Session;

@Repository
public class AlDetailBookDAO extends CommonDAO
{
	public PageData<EntityMap> getReportData(ConditionMap cdtMap)
	{
		String strsql = "";
		strsql += " select td.ROW_NUM,td.VARSOURCENAME UQNUMBERING ,td.INTCOMPANYSEQ  INTCOMPANYSEQ,td.VARNUMBERNAME INTVOUCHERNUM,";
		strsql += " DATE_FORMAT(td.DTACCOUNTDATE,'%Y-%m-%d') as DTFILLER,";
		strsql += " td.VARABSTRACT VARABSTRACT, UQVOUCHERID, cast(td.MNYDEBIT as DECIMAL(18,2)) as MNYDEBIT,";
		strsql += " cast(td.MNYCREDIT as DECIMAL(18,2)) as MNYCREDIT ,td.VARFLAG INTDCFLAG, ";
		strsql += " cast(td.MNYAMOUNT as DECIMAL(18,2)) as BALANCE ";
		strsql += " from ";
		strsql += cdtMap.getString("tablename") +" td ";
		return super.getMapPage(strsql, cdtMap.getStart(), cdtMap.getLimit());
	}

	public String getTableName(ConditionMap cdtMap) 
	{
		//2.解析ids插入临时表
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
    		
    		this.execute(strsql, new String[]{bulkid,"ledgertype",ledgertypeid[i]});
    	}

		
		//获得组件的值 准备传参 调用存储过程
        M8Session m8session = new M8Session();
        String uqaccountsetid = ObjectUtils.toString(m8session.getAttribute("ACCOUNTSETID")); //科目套ID
        String uqcompanyid = ObjectUtils.toString(m8session.getCompanyID());			//单位ID		
		String account = cdtMap.getString("account");		//科目code
		int ledgerlevel = cdtMap.getInteger("ledgerlevel");		//级次
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
			proc = conn.prepareCall(" { CALL PROC_ALMXZ(?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,?) } ");
			//传参
			proc.setString(1,uqcompanyid);	
			proc.setString(2, uqaccountsetid);
			proc.setString(3, account);
			proc.setString(4, bulkid);
			proc.setInt(5, ledgerlevel);
			proc.setInt(6, beginyearmonth);
			proc.setInt(7, endyearmonth);
			proc.setInt(8, intstatus);
			proc.setInt(9, isallzerodata);
			proc.setInt(10, isallbalance);
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
	
	public Object[] getCurrentPeriodInfo(int intyearmonth)
	{
		String strSql = " select gp.uqglobalperiodid,gp.varname,gp.intyearmonth,date_format(str_to_date(gp.dtbegin, '%Y-%m-%d'), '%Y-%m-%d') dtbegin,date_format(str_to_date(gp.dtend, '%Y-%m-%d'), '%Y-%m-%d') dtend ";
		strSql += " from tgl_global_periods gp ";
		strSql += " where ? -gp.intyearmonth =( ";
		strSql += " select MIN( ? - gp1.intyearmonth) ";
		strSql += " from tgl_global_periods gp1 ";
		strSql += " where gp1.intyearmonth <= ? ";
		strSql += " and gp1.intstatus = 2 ) ";
		
		List<EntityMap> maplist =  this.getMapList(strSql, new Object[]{intyearmonth,intyearmonth,intyearmonth});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqglobalperiodid"),
					entity.get("varname"),
					entity.get("intyearmonth"),
					entity.get("dtbegin"),
					entity.get("dtend")
				});
		}
		if(list.size() > 0)
		{
			return list.get(0);
		}
		else
		{
			return null;
		}
	}
	
	public Object[] getCurrentPeriodInfoAll(int intyearmonth)
	{
		String strSql = " select gp.uqglobalperiodid,gp.varname,gp.intyearmonth,date_format(str_to_date(gp.dtbegin, '%Y-%m-%d'), '%Y-%m-%d') dtbegin,date_format(str_to_date(gp.dtend, '%Y-%m-%d'), '%Y-%m-%d') dtend ";
		strSql += " from tgl_global_periods gp ";
		strSql += " where ? -gp.intyearmonth =( ";
		strSql += " select MIN( ? - gp1.intyearmonth) ";
		strSql += " from tgl_global_periods gp1 ";
		strSql += " where gp1.intyearmonth <= ? ";
		strSql += " and gp1.INTSTATUS in (0,2)) ";
		
		List<EntityMap> maplist =  this.getMapList(strSql, new Object[]{intyearmonth,intyearmonth,intyearmonth});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqglobalperiodid"),
					entity.get("varname"),
					entity.get("intyearmonth"),
					entity.get("dtbegin"),
					entity.get("dtend")
				});
		}
		if(list.size() > 0)
		{
			return list.get(0);
		}
		else
		{
			return null;
		}
	}
	
}
