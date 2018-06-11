package com.newtouch.nwfs.gl.vouchermanager.dao;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;

/**
 * 现金流量编制dao
 * @author feng
 *
 */
@Repository
public class VoucherFlowDAO extends CommonDAO 
{
	/**
	 * 获取凭证和现金流量的明细信息
	 * @param cdtMap
	 * @param start
	 * @param limit
	 * @return
	 */
	public PageData<EntityMap> getVoucherFlowInfo(ConditionMap cdtMap, int start, int limit)
	{
		String periodid = "";
		String intstatus = "";
		
		if(cdtMap != null)
		{
			periodid = cdtMap.getString("periodid");
			intstatus = cdtMap.getString("intstatus");
		}
		
		List<Object> paras = new ArrayList<Object>();
		
		String strSql = "select ";
		strSql +=" 	T.flowitemcode,T.flowitemname,T.dtaccountant,T.dtfiller,";
		strSql +=" 	T.numberingname,T.intvouchernum,T.uqaccountid,T.varabstract,";
		strSql +=" 	T.mnydebit,T.mnycredit,T.dtvoucherflow,T.intstatus,";
		strSql +="   T.voucherid,T.voucherdetailid,T.uqflowitemid ";
		strSql +="  from ( ";
		strSql +="    select  ";
		strSql +="    	'' as flowitemcode,'' as flowitemname,m.dtaccountant,m.dtfiller,";
		strSql +="    	n.VARNAME as numberingname,m.intvouchernum,concat('[',gl.varaccountcode,']',gl.VARACCOUNTNAME)  as uqaccountid,de.varabstract,";
		strSql +="    	de.mnydebit,de.mnycredit,'' as dtvoucherflow,'未编' as intstatus,0 as intstatusvalue,";
		strSql +="    	m.uqvoucherid as voucherid,de.uqvoucherdetailid as voucherdetailid,'' as uqflowitemid ";
		strSql +="    from ";
		strSql +="    tgl_voucher_details de ";
		strSql +="    inner join tgl_voucher_mains m on m.UQVOUCHERID=de.UQVOUCHERID ";
		strSql +="    inner join tgl_voucher_numberings n on n.UQNUMBERINGID=m.UQNUMBERING ";
		strSql +="    inner join tgl_accounts gl on gl.UQACCOUNTID=de.UQACCOUNTID ";
		strSql +="    where gl.intisflow in (1,2) and not EXISTS ";
		strSql +="    ( ";
		strSql +="    	select 1 from tgl_voucher_detail_flow d where d.uqvoucherdetailid=de.UQVOUCHERDETAILID ";
		strSql +="    ) and m.INTFLAG = 2 ";
		
		if(!StringUtil.isNullString(periodid))
		{
			strSql += " and m.UQGLOBALPERIODID = ?";
			paras.add(periodid);
		}
		
		strSql +="  union ALL ";
		strSql +="    select ";
		strSql +="    	fi.varcode as flowitemcode,fi.varname as flowitemname,m.dtaccountant,m.dtfiller, ";
		strSql +="    	n.VARNAME as numberingname,m.intvouchernum,concat('[',gl.varaccountcode,']',gl.VARACCOUNTNAME)  as uqaccountid,de.varabstract, ";
		strSql +="    	de.mnydebit,de.mnycredit,d.dtvoucherflow,case WHEN(d.intstatus=1) then '不用' else '已编' end as intstatus, ";
		strSql +="      case WHEN(d.intstatus=1) then 1 else 2 end as intstatusvalue, ";
		strSql +="    	m.uqvoucherid as voucherid,de.uqvoucherdetailid as voucherdetailid,fi.uqflowitemid ";
		strSql +="    from ";
		strSql +="    tgl_voucher_detail_flow d ";
		strSql +="    inner join tgl_voucher_details de on de.UQVOUCHERDETAILID= d.uqvoucherdetailid ";
		strSql +="    inner join tgl_voucher_mains m on m.UQVOUCHERID=de.UQVOUCHERID ";
		strSql +="    inner join tgl_voucher_numberings n on n.UQNUMBERINGID=m.UQNUMBERING ";
		strSql +="    inner join tgl_accounts gl on gl.UQACCOUNTID=de.UQACCOUNTID ";
		strSql +="    left join tgl_flowitems fi on fi.uqflowitemid=d.uqflowitemid ";
		strSql +="    where m.INTFLAG = 2 ";
		
		if(!StringUtil.isNullString(periodid))
		{
			strSql += " and m.UQGLOBALPERIODID = ?";
			paras.add(periodid);
		}
		
		strSql +=" ) T ";
		strSql +=" where 1=1 ";
		
		if(!StringUtil.isNullString(intstatus))
		{
			if("2".equals(intstatus))
			{
				strSql +=" and T.intstatusvalue in(1,2) ";
			}
			else if("3".equals(intstatus))
			{
				
			}
			else
			{
				strSql +=" and T.intstatusvalue = ? ";
				paras.add(intstatus);
			}
			
		}
		
		strSql +="   ORDER BY T.dtaccountant,T.dtfiller,T.intvouchernum,T.dtvoucherflow";
		
		return this.getMapPage(strSql, paras, start, limit);
	}
	
	/**
	 * 不用
	 * @param voucherdetailid
	 * @param voucherid
	 */
	public void noUseHandler(String voucherdetailid, String voucherid)
	{
		String strSql = "select count(1) from tgl_voucher_detail_flow d where d.uqvoucherdetailid = ?";
		
		List<Object> paras = new ArrayList<Object>();
		paras.add(voucherdetailid);
		
		int line = this.querySingleInteger(strSql, paras);
		
		if(line > 0)
		{
			strSql = "update tgl_voucher_detail_flow d set d.uqflowitemid='',d.intstatus=1 where d.uqvoucherdetailid=?";
			List<Object> paras1 = new ArrayList<Object>();
			paras1.add(voucherdetailid);
			
			this.execute(strSql, paras1);
		}
		else
		{
			strSql = "insert into tgl_voucher_detail_flow( ";
			strSql += " uqvoudetailflowid,uqvoucherdetailid,uqvoucherid, ";
			strSql += " dtvoucherflow,intstatus) ";
			strSql += " VALUES ";
			strSql += " (?,?,?,DATE_FORMAT(?,'%Y-%m-%d'),?)";
			
			List<Object> paras1 = new ArrayList<Object>();
			String uqvoudetailflowid = UUID.randomUUID().toString().toUpperCase();
			String strDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			paras1.add(uqvoudetailflowid);
			paras1.add(voucherdetailid);
			paras1.add(voucherid);
			paras1.add(strDate);
			paras1.add(1);
			
			this.execute(strSql, paras1);
		}
	}
	
	/**
	 * 指定
	 * @param voucherdetailid
	 * @param voucherid
	 * @param uqflowitemid
	 */
	public void useHandler(String voucherdetailid, String voucherid, String uqflowitemid)
	{
		String strSql = "select count(1) from tgl_voucher_detail_flow d where d.uqvoucherdetailid = ?";
		
		List<Object> paras = new ArrayList<Object>();
		paras.add(voucherdetailid);
		
		int line = this.querySingleInteger(strSql, paras);
		
		if(line > 0)
		{
			strSql = "update tgl_voucher_detail_flow d set d.uqflowitemid=?,d.intstatus=2 where d.uqvoucherdetailid=?";
			List<Object> paras1 = new ArrayList<Object>();
			paras1.add(uqflowitemid);
			paras1.add(voucherdetailid);
			
			this.execute(strSql, paras1);
		}
		else
		{
			strSql = "insert into tgl_voucher_detail_flow( ";
			strSql += " uqvoudetailflowid,uqvoucherdetailid,uqvoucherid, ";
			strSql += " uqflowitemid, dtvoucherflow,intstatus) ";
			strSql += " VALUES ";
			strSql += " (?,?,?,?,DATE_FORMAT(?,'%Y-%m-%d'),?)";
			
			List<Object> paras1 = new ArrayList<Object>();
			String uqvoudetailflowid = UUID.randomUUID().toString().toUpperCase();
			String strDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			paras1.add(uqvoudetailflowid);
			paras1.add(voucherdetailid);
			paras1.add(voucherid);
			paras1.add(uqflowitemid);
			paras1.add(strDate);
			paras1.add(2);
			
			this.execute(strSql, paras1);
		}
	}

}
