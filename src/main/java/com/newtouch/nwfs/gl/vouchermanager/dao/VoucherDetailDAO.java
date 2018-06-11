package com.newtouch.nwfs.gl.vouchermanager.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONObject;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.EntityUtil;
import com.newtouch.cloud.common.ParaList;
import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherDetail;

@Repository
public class VoucherDetailDAO extends CommonDAO
{
	public void saveVoucherDetail(List<VoucherDetail> list)
	{
		for(int i = 0; i < list.size(); i++)
		{
			VoucherDetail voudetail = list.get(i);
			String strSql = " insert into tgl_voucher_details(";
			strSql += " uqvoucherdetailid,uqvoucherid,intseq,uqaccountid,";
			strSql += " varabstract,mnydebit,mnycredit)";
			strSql += " values( ?, ?, ?, ?, ?, ?, ? )";
			
			List<Object> paras = new ArrayList<Object>();
			paras.add(voudetail.getUqvoucherdetailid());
			paras.add(voudetail.getUqvoucherid());
			paras.add(voudetail.getIntseq());
			paras.add(voudetail.getUqaccountid());
			paras.add(voudetail.getVarabstract());
			paras.add(voudetail.getMnydebit()== null || voudetail.getMnydebit().equals("")? 0.00 :  voudetail.getMnydebit());
			paras.add(voudetail.getMnycredit()== null || voudetail.getMnycredit().equals("")? 0.00 :  voudetail.getMnycredit());
			this.execute(strSql, paras);
		}	
	}

	/*
	 * 获得凭证明细表中的相关数据
	 */
	public List<VoucherDetail> getVoucherDetailInfo(String uqvoucherid)
	{
		try
		{
			StringBuilder strSQL = new StringBuilder();
			strSQL.append(" select tgl.uqvoucherdetailid,tgl.uqvoucherid,tgl.intseq,tgl.varabstract,tgl.uqcgsid,");
			strSQL.append(" tgl.uqaccountid,ac.VARACCOUNTCODE accountcode,ac.VARACCOUNTFULLNAME accountname,");
			strSQL.append(" tgl.mnydebit,tgl.mnycredit,tgl.uqpaytypeid,tgl.vartypeno,tgl.decnumber,");
			strSQL.append(" tgl.mnyprice,tgl.mnyforeigncurr,tgl.decexchagerate,ac.intisledge");
			strSQL.append(" from tgl_voucher_details tgl ");
			strSQL.append(" inner join tgl_accounts ac on ac.UQACCOUNTID=tgl.UQACCOUNTID");
			strSQL.append(" where tgl.uqvoucherid = ? ");
			strSQL.append(" order by tgl.intseq asc");
			
			List<Object> paras = new ArrayList<Object>();
			paras.add(uqvoucherid);
			List<VoucherDetail> list = this.getEntityList(strSQL.toString(), paras, VoucherDetail.class);
			return list;
		}
		catch(Exception ex)
		{
			throw new RuntimeException(ex.getMessage());
		}
	}
	
	public void deleteVoucherDetail(String voucherid)
	{
		String strSql = " delete from tgl_voucher_details where uqvoucherid = ? ";
		this.execute(strSql, new Object[]{voucherid});
		
		strSql = "delete from tgl_voucher_detail_ledger where ";
		strSql += " exists(select 1 from tgl_voucher_details d";
		strSql += " where uqvoucherdetailid=d.uqvoucherdetailid and d.uqvoucherid = ? )";
		this.execute(strSql, new Object[]{voucherid});
		
		strSql = "delete from tgl_voucher_detail_ledgertype where ";
		strSql += " exists(select 1 from tgl_voucher_details d";
		strSql += " where uqvoucherdetailid=d.uqvoucherdetailid and d.uqvoucherid = ? )";
		this.execute(strSql, new Object[]{voucherid});
	}
	
	public String getAccountCodeByID(String strAccountID) 
    {       
		M8Session session = new M8Session();
        String accountsetid = ObjectUtils.toString(session.getAttribute("ACCOUNTSETID"));
        
        String strSql = "SELECT varaccountcode FROM tgl_accounts "
        		+ "WHERE uqaccountid= ? and uqaccountsetid = ? ";
        Object val = this.querySingleObject(strSql, new Object[]{strAccountID,accountsetid});
        return val == null ? null : val.toString();
    }
	
	@SuppressWarnings("deprecation")
	public <T, ID extends Serializable> T findById(String id, boolean lock,
			Class<T> entityType) 
	{
		T entity = getEntityManager().find(entityType, id);
        return entity;
	}
	
	public List<Object[]> getAccountPeriodInfo(String uqvoucherid)
	{
		String strSql = "";
		strSql += " select d.uqaccountid,m.uqglobalperiodid,m.uqcompanyid,";
		strSql += " sum(d.mnydebit) as accdebitsum,sum(d.mnycredit) as acccreditsum,";
		strSql += " sum(ifnull(d.mnyfdebit,0)) as accfdebitsum,sum(ifnull(d.mnyfcredit,0)) as accfcreditsum";
		strSql += "  from tgl_voucher_details d";
		strSql += " inner join tgl_voucher_mains m on m.uqvoucherid=d.uqvoucherid"; 
		strSql += " inner join tgl_accounts gl on gl.uqaccountid = d.uqaccountid";
		strSql += " where m.uqvoucherid= ? ";
		strSql += " group by d.uqaccountid,m.uqglobalperiodid,m.uqcompanyid ";
		strSql += " order by gl.varaccountcode";
		
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{uqvoucherid});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqaccountid"),
					entity.get("uqglobalperiodid"),
					entity.get("uqcompanyid"),
					entity.get("accdebitsum"),
					entity.get("acccreditsum"),
					entity.get("accfdebitsum"),
					entity.get("accfcreditsum")
				});
		}
		return list;
	}
	
	public List<Object[]> getAccountPeriodCashInfo(String uqvoucherid)
	{
		String strSql = "";
		strSql += " select d.uqaccountid,m.uqglobalperiodid,m.uqcompanyid,";
		strSql += " sum(d.mnydebit) as accdebitsum,sum(d.mnycredit) as acccreditsum,";
		strSql += " sum(ifnull(d.mnyfdebit,0)) as accfdebitsum,sum(ifnull(d.mnyfcredit,0)) as accfcreditsum";
		strSql += "  from tgl_voucher_details d";
		strSql += " inner join tgl_voucher_mains m on m.uqvoucherid=d.uqvoucherid"; 
		strSql += " inner join tgl_accounts gl on gl.uqaccountid = d.uqaccountid";
		strSql += " where m.uqvoucherid= ? and gl.UQTYPEID in(5,6)";
		strSql += " group by d.uqaccountid,m.uqglobalperiodid,m.uqcompanyid ";
		strSql += " order by gl.varaccountcode";
		
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{uqvoucherid});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqaccountid"),
					entity.get("uqglobalperiodid"),
					entity.get("uqcompanyid"),
					entity.get("accdebitsum"),
					entity.get("acccreditsum"),
					entity.get("accfdebitsum"),
					entity.get("accfcreditsum")
				});
		}
		return list;
	}
	
	public List<EntityMap> lockAccountPeriod(String uqaccountid, String uqglobalperiodid, String uqcompanyid)
	{
		String strSql = "select * from tgl_period_accounts pa ";
		strSql += " where pa.UQACCOUNTID= ? and pa.UQGLOBALPERIODID= ? ";
		strSql += " and pa.UQCOMPANYID= ? for update";
		
		List<Object> paras = new ArrayList<Object>();
		paras.add(uqaccountid);
		paras.add(uqglobalperiodid);
		paras.add(uqcompanyid);
		List<EntityMap> list = this.getMapList(strSql, paras);
		return list;
	}
	
	public List<EntityMap> lockAccountPeriodNoJZ(String uqaccountid, String uqglobalperiodid, String uqcompanyid)
	{
		String strSql = "select * from tgl_period_accounts_notjz pa ";
		strSql += " where pa.UQACCOUNTID= ? and pa.UQGLOBALPERIODID= ? ";
		strSql += " and pa.UQCOMPANYID= ? for update";
		
		List<Object> paras = new ArrayList<Object>();
		paras.add(uqaccountid);
		paras.add(uqglobalperiodid);
		paras.add(uqcompanyid);
		List<EntityMap> list = this.getMapList(strSql, paras);
		return list;
	}
	
	/**
	 * 
	 * @param lockline
	 * @param uqaccountid
	 * @param uqglobalperiodid
	 * @param uqcompanyid
	 * @param accdebitsum
	 * @param acccreditsum
	 * @param accfdebitsum外币
	 * @param accfcreditsum外币
	 * @param tag 1-制证,2-出纳，3-记账
	 * @param flag 传递正负1
	 * 制证传递tag1,flag1,查删改删除凭证传递tag1,flag-1,出纳tag2,flag1,反出纳tag2,flag-1,记账tag3,flag1
	 */
	public void updateAccountPeriodNoJZ(int lockline, String uqaccountid, String uqglobalperiodid, 
			String uqcompanyid, BigDecimal accdebitsum, BigDecimal acccreditsum, 
			BigDecimal accfdebitsum, BigDecimal accfcreditsum)
	{
		String strSql = " ";
		
		if(lockline <= 0)
		{
			//不存在科目余额数据
			strSql += " insert into tgl_period_accounts_notjz(";
			strSql += " uqcompanyid,uqglobalperiodid,uqaccountid,";
			strSql += " mnydebitperiod,mnycreditperiod)";
			strSql += " values(?, ?, ?, ?, ? ) ";
			
			List<Object> paras = new ArrayList<Object>();
			paras.add(uqcompanyid);
			paras.add(uqglobalperiodid);
			paras.add(uqaccountid);
			paras.add(accdebitsum);
			paras.add(acccreditsum);
			this.execute(strSql, paras);
		}
		else
		{
			strSql = "";
			strSql += " UPDATE tgl_period_accounts_notjz SET ";
	        strSql += " MNYDEBITPERIOD = MNYDEBITPERIOD + ?, ";
	        strSql += " MNYCREDITPERIOD = MNYCREDITPERIOD + ?, ";
	        strSql += " MNYFDEBITPERIOD = MNYFDEBITPERIOD + ?, ";
	        strSql += " MNYFCREDITPERIOD = MNYFCREDITPERIOD + ? ";
	        strSql += " WHERE UQGLOBALPERIODID = ? AND UQACCOUNTID = ? AND UQCOMPANYID = ? ";
	        List<Object> paras = new ArrayList<Object>();
        	paras.add(accdebitsum);
        	paras.add(acccreditsum);
        	paras.add(accfdebitsum);
        	paras.add(accfcreditsum);
        	paras.add(uqglobalperiodid);
        	paras.add(uqaccountid);
        	paras.add(uqcompanyid);
	        this.execute(strSql, paras);
		}
	}
	
	/**
	 * 
	 * @param lockline
	 * @param uqaccountid
	 * @param uqglobalperiodid
	 * @param uqcompanyid
	 * @param accdebitsum
	 * @param acccreditsum
	 * @param accfdebitsum外币
	 * @param accfcreditsum外币
	 * @param tag 1-制证,2-出纳，3-记账
	 * @param flag 传递正负1
	 * 制证传递tag1,flag1,查删改删除凭证传递tag1,flag-1,出纳tag2,flag1,反出纳tag2,flag-1,记账tag3,flag1
	 */
	public void updateAccountPeriod(int lockline, String uqaccountid, String uqglobalperiodid, 
			String uqcompanyid, BigDecimal accdebitsum, BigDecimal acccreditsum, 
			BigDecimal accfdebitsum, BigDecimal accfcreditsum, int tag, int flag)
	{
		String strSql = " ";
		
		accdebitsum = accdebitsum.multiply(new BigDecimal(flag));
		acccreditsum = acccreditsum.multiply(new BigDecimal(flag));
		accfdebitsum = accfdebitsum.multiply(new BigDecimal(flag));
		accfcreditsum = accfcreditsum.multiply(new BigDecimal(flag));
		
		if(lockline <= 0)
		{
			//不存在科目余额数据
			strSql += " insert into tgl_period_accounts(";
			strSql += " uqcompanyid,uqglobalperiodid,uqaccountid,";
			strSql += " mnydebitperiodall,mnycreditperiodall,mnyfdebitperiodall,";
			strSql += " mnyfcreditperiodall,mnydebitperiod,mnycreditperiod,";
			strSql += " mnyfdebitperiod,mnyfcreditperiod,mnydebitcashed,";
			strSql += " mnycreditcashed,mnyfdebitcashed,mnyfcreditcashed)";
			strSql += " values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) ";

			List<Object> paras = new ArrayList<Object>();
			paras.add(uqcompanyid);
			paras.add(uqglobalperiodid);
			paras.add(uqaccountid);
			paras.add(accdebitsum);
			paras.add(acccreditsum);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			this.execute(strSql, paras);
		}
		else
		{
			strSql = "";
			strSql += " UPDATE tgl_period_accounts SET ";
	        strSql += " MNYDEBITPERIODALL = MNYDEBITPERIODALL + ?, ";
	        strSql += " MNYCREDITPERIODALL = MNYCREDITPERIODALL + ?, ";
	        strSql += " MNYFDEBITPERIODALL = MNYFDEBITPERIODALL + ?, ";
	        strSql += " MNYFCREDITPERIODALL = MNYFCREDITPERIODALL + ?, ";
	        strSql += " MNYDEBITPERIOD = MNYDEBITPERIOD + ?, ";
	        strSql += " MNYCREDITPERIOD = MNYCREDITPERIOD + ?, ";
	        strSql += " MNYFDEBITPERIOD = MNYFDEBITPERIOD + ?, ";
	        strSql += " MNYFCREDITPERIOD = MNYFCREDITPERIOD + ?, ";
	        strSql += " MNYDEBITCASHED = MNYDEBITCASHED + ?, ";
	        strSql += " MNYCREDITCASHED = MNYCREDITCASHED + ?, ";
	        strSql += " MNYFDEBITCASHED = MNYFDEBITCASHED + ?, ";
	        strSql += " MNYFCREDITCASHED = MNYFCREDITCASHED + ? ";
	        strSql += " WHERE UQGLOBALPERIODID = ? AND UQACCOUNTID = ? AND UQCOMPANYID = ? ";
	        
	        List<Object> paras = new ArrayList<Object>();
	        if(tag == 1)
	        {
	        	paras.add(accdebitsum);
	        	paras.add(acccreditsum);
	        	paras.add(accfdebitsum);
	        	paras.add(accfcreditsum);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(uqglobalperiodid);
	        	paras.add(uqaccountid);
	        	paras.add(uqcompanyid);
	        }
	        else if(tag == 2)
	        {
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(accdebitsum);
	        	paras.add(acccreditsum);
	        	paras.add(accfdebitsum);
	        	paras.add(accfcreditsum);
	        	paras.add(uqglobalperiodid);
	        	paras.add(uqaccountid);
	        	paras.add(uqcompanyid);
	        }
	        else if(tag == 3)
	        {
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(accdebitsum);
	        	paras.add(acccreditsum);
	        	paras.add(accfdebitsum);
	        	paras.add(accfcreditsum);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(0);
	        	paras.add(uqglobalperiodid);
	        	paras.add(uqaccountid);
	        	paras.add(uqcompanyid);
	        }
	        this.execute(strSql, paras);
		}
	}
	
	/**
	 * 通过科目获取是否需要
	 * @param uqaccountid
	 * @return
	 */
	public int isAccountLedger(String uqaccountid)
	{
		String strSql = "select ifnull(gl.intisledge,0) from tgl_accounts gl where gl.UQACCOUNTID= ? ";
		
		int isAccountLedger = this.querySingleInteger(strSql, new Object[]{uqaccountid});
		return isAccountLedger;
	}
	
	/**
	 * 通过科目获取分户类别
	 * @param uqaccountid
	 * @return
	 */
	public List<Object[]> getLedgerTypeByAccountID(String uqaccountid)
	{
		String strSql = "select lt.uqledgetypeid,lt.varledgetypename from tgl_account_ledgetype al ";
		strSql += " inner join tgl_ledgetype lt on lt.uqledgetypeid=al.uqledgetypeid ";
		strSql += " where al.uqaccountid= ? ";
		
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{uqaccountid});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqledgetypeid"),
					entity.get("varledgetypename")
				});
		}
		return list;
	}
	
	/**
	 * 通过分户类别获取单位分户信息
	 * @param uqaccountid
	 * @return
	 */
	public List<Object[]> getLedgerByAccountID(String ledgertypeid)
	{
		String strSql = "select l.uqledgeid,l.varledgecode,l.varledgename from tgl_ledger l ";
		strSql += " inner join tgl_ledgetype lt on l.uqledgetypeid=lt.uqledgetypeid ";
		strSql += " inner join tgl_ledger_company lc on lc.uqledgeid=l.uqledgeid ";
		strSql += " where lt.uqledgetypeid= ? and lc.uqcompanyid= ? and l.intislastlevel=1 "; 
		strSql += " order by l.varledgecode asc";
		M8Session session = new M8Session();
		
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{ledgertypeid, session.getCompanyID()});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqledgeid"),
					entity.get("varledgecode"),
					entity.get("varledgename")
				});
		}
		return list;
	}
	
	public void saveVoucherDetailLedgerType(String uqvouledgertypeid, String ledgertypeid, 
			String voucherid, String voucherdetailid, int intseq)
	{
		String strSql = "insert into tgl_voucher_detail_ledgertype(uqvouledgertypeid,uqledgertypeid,";
		strSql += " uqvoucherdetailid,uqvoucherid,intseq)";
		strSql += " values(?, ?, ?, ?, ?) ";
		List<Object> paras = new ArrayList<Object>();
		paras.add(uqvouledgertypeid);
		paras.add(ledgertypeid);
		paras.add(voucherdetailid);
		paras.add(voucherid);
		paras.add(intseq);
		this.execute(strSql, paras);
	}
	
	public void saveVoucherDetailLedger(String uqvouledgerid, String ledgertypeid, String ledgerid, 
			BigDecimal mnyamount, String voucherdetailid, int intseq, BigDecimal mnydebit, BigDecimal mnycredit)
	{
		String strSql = "insert into tgl_voucher_detail_ledger(uqvouledgerid,uqledgerid,";
		strSql += " uqvoucherdetailid,uqledgertypeid,mnyamount,intseq,mnydebit,mnycredit)";
		strSql += " values(?, ?, ?, ?, ?, ?, ?, ? ) ";
		List<Object> paras = new ArrayList<Object>();
		paras.add(uqvouledgerid);
		paras.add(ledgerid);
		paras.add(voucherdetailid);
		paras.add(ledgertypeid);
		paras.add(mnyamount);
		paras.add(intseq);
		paras.add(mnydebit);
		paras.add(mnycredit);
		this.execute(strSql, paras);
	}
	
	public List<Object[]> getVouDetailLedgerType(String uqvoucherdetailid)
	{
		String strSql = "select t.uqledgertypeid,lt.varledgetypename from ";
		strSql += " tgl_voucher_detail_ledgertype t";
		strSql += " inner join tgl_ledgetype lt on lt.uqledgetypeid=t.uqledgertypeid";
		strSql += " where t.uqvoucherdetailid= ? ";
		strSql += " order by t.intseq";
		
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{uqvoucherdetailid});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqledgertypeid"),
					entity.get("varledgetypename")
				});
		}
		return list;
	}
	
	public List<Object[]> getLedgerVouDetail(String uqvoucherdetailid, String typeid)
	{
		String strSql = "select '' voudetailid,le.uqledgeid,le.varledgecode,le.varledgename,l.mnyamount from tgl_voucher_detail_ledger l ";
		strSql += " inner join tgl_ledger le on le.uqledgeid=l.uqledgerid and le.uqledgetypeid=l.uqledgertypeid";
		strSql += " where  l.uqvoucherdetailid= ? and l.uqledgertypeid= ? ";
		strSql += " order by l.intseq";
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{uqvoucherdetailid, typeid});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("voudetailid"),
					entity.get("uqledgeid"),
					entity.get("varledgecode"),
					entity.get("varledgename"),
					entity.get("mnyamount")
				});
		}
		return list;
	}
	
	public List<Object[]> getLedgerNotVouDetail(String uqvoucherdetailid, String typeid)
	{
		String strSql = "select '' voudetailid, le.uqledgeid,le.varledgecode,le.varledgename,0 as mnyamount from tgl_ledger le  ";
		strSql += " where le.uqledgetypeid= ? and le.INTISLASTLEVEL=1 and not exists(select 1 from tgl_voucher_detail_ledger dl where dl.uqledgerid=le.uqledgeid ";
		strSql += " and dl.uqvoucherdetailid= ? and dl.uqledgertypeid= ?) ";
		strSql += " order by le.varledgecode";
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{typeid, uqvoucherdetailid, typeid});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("voudetailid"),
					entity.get("uqledgeid"),
					entity.get("varledgecode"),
					entity.get("varledgename"),
					entity.get("mnyamount")
				});
		}
		return list;
	}
	
	public List<Object[]> getLedgerPeriodInfo(String uqvoucherid)
	{
		String strSql = "";
		strSql += " select d.uqaccountid,m.uqglobalperiodid,m.uqcompanyid,dl.uqledgerid,";
		strSql += " sum(dl.mnydebit) as accdebitsum,sum(dl.mnycredit) as acccreditsum,";
		strSql += " 0 as accfdebitsum,0 as accfcreditsum";
		strSql += "  from tgl_voucher_detail_ledger dl";
		strSql += " inner join tgl_voucher_details d on d.UQVOUCHERDETAILID=dl.UQVOUCHERDETAILID";
		strSql += " inner join tgl_voucher_mains m on m.uqvoucherid=d.uqvoucherid";
		strSql += " inner join tgl_accounts gl on gl.uqaccountid = d.uqaccountid";
		strSql += " where m.uqvoucherid= ? ";
		strSql += " group by d.uqaccountid,m.uqglobalperiodid,m.uqcompanyid,dl.uqledgerid ";
		strSql += " order by gl.varaccountcode";
		
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{uqvoucherid});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqaccountid"),
					entity.get("uqglobalperiodid"),
					entity.get("uqcompanyid"),
					entity.get("uqledgerid"),
					entity.get("accdebitsum"),
					entity.get("acccreditsum"),
					entity.get("accfdebitsum"),
					entity.get("accfcreditsum")
				});
		}
		return list;
	}
	
	public List<Object[]> getLedgerPeriodCashInfo(String uqvoucherid)
	{
		String strSql = "";
		strSql += " select d.uqaccountid,m.uqglobalperiodid,m.uqcompanyid,dl.uqledgerid,";
		strSql += "  sum(dl.mnydebit) as accdebitsum,sum(dl.mnycredit) as acccreditsum,";
		strSql += "  0 as accfdebitsum,0 as accfcreditsum";
		strSql += "   from tgl_voucher_detail_ledger dl";
		strSql += "  inner join tgl_voucher_details d on d.UQVOUCHERDETAILID=dl.UQVOUCHERDETAILID";
		strSql += "  inner join tgl_voucher_mains m on m.uqvoucherid=d.uqvoucherid";
		strSql += "  inner join tgl_accounts gl on gl.uqaccountid = d.uqaccountid";
		strSql += "  where m.uqvoucherid= ? and gl.UQTYPEID in(5,6)";
		strSql += "  group by d.uqaccountid,m.uqglobalperiodid,m.uqcompanyid,dl.uqledgerid ";
		strSql += "  order by gl.varaccountcode";
		
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{uqvoucherid});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqaccountid"),
					entity.get("uqglobalperiodid"),
					entity.get("uqcompanyid"),
					entity.get("uqledgerid"),
					entity.get("accdebitsum"),
					entity.get("acccreditsum"),
					entity.get("accfdebitsum"),
					entity.get("accfcreditsum")
				});
		}
		return list;
	}
	
	public List<EntityMap> lockLedgerPeriod(String uqaccountid, String uqglobalperiodid, String uqcompanyid, String uqledgerid)
	{
		String strSql = "select * from tgl_company_ledger_periods pa ";
		strSql += " where pa.UQACCOUNTID= ? and pa.UQGLOBALPERIODID= ? ";
		strSql += " and pa.UQCOMPANYID= ? and pa.uqledgeid = ? for update";
		
		List<Object> paras = new ArrayList<Object>();
		paras.add(uqaccountid);
		paras.add(uqglobalperiodid);
		paras.add(uqcompanyid);
		paras.add(uqledgerid);
		List<EntityMap> list = this.getMapList(strSql, paras);
		return list;
		
	}
	
	/**
	 * 
	 * @param lockline
	 * @param uqaccountid
	 * @param uqglobalperiodid
	 * @param uqcompanyid
	 * @param accdebitsum
	 * @param acccreditsum
	 * @param accfdebitsum外币
	 * @param accfcreditsum外币
	 * @param tag 1-制证,2-出纳，3-记账
	 * @param flag 传递正负1
	 * 制证传递tag1,flag1,查删改删除凭证传递tag1,flag-1,出纳tag2,flag1,反出纳tag2,flag-1,记账tag3,flag1
	 */
	public void updateLedgerPeriod(int lockline, String uqaccountid, String uqglobalperiodid, 
			String uqcompanyid, String uqledgeid, BigDecimal accdebitsum, BigDecimal acccreditsum, 
			BigDecimal accfdebitsum, BigDecimal accfcreditsum, int tag, int flag)
	{
		String strSql = " ";
		
		accdebitsum = accdebitsum.multiply(new BigDecimal(flag));
		acccreditsum = acccreditsum.multiply(new BigDecimal(flag));
		accfdebitsum = accfdebitsum.multiply(new BigDecimal(flag));
		accfcreditsum = accfcreditsum.multiply(new BigDecimal(flag));
		
		if(lockline <= 0)
		{
			//不存在科目余额数据
			strSql += " insert into tgl_company_ledger_periods(";
			strSql += " uqcompanyid,uqglobalperiodid,uqaccountid,uqledgeid,";
			strSql += " mnydebitperiodall,mnycreditperiodall,mnyfdebitperiodall,";
			strSql += " mnyfcreditperiodall,mnydebitperiod,mnycreditperiod,";
			strSql += " mnyfdebitperiod,mnyfcreditperiod,mnydebitcashed,";
			strSql += " mnycreditcashed,mnyfdebitcashed,mnyfcreditcashed)";
			strSql += " values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";
			
			List<Object> paras = new ArrayList<Object>();
			paras.add(uqcompanyid);
			paras.add(uqglobalperiodid);
			paras.add(uqaccountid);
			paras.add(uqledgeid);
			paras.add(accdebitsum);
			paras.add(acccreditsum);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			paras.add(0);
			this.execute(strSql, paras);
		}
		else
		{
			strSql = "";
			strSql += " UPDATE tgl_company_ledger_periods SET ";
			strSql += " MNYDEBITPERIODALL = MNYDEBITPERIODALL + ?,";
	        strSql += " MNYCREDITPERIODALL = MNYCREDITPERIODALL + ?,";
	        strSql += " MNYFDEBITPERIODALL = MNYFDEBITPERIODALL + ?,";
	        strSql += " MNYFCREDITPERIODALL = MNYFCREDITPERIODALL + ?, ";
	        strSql += " MNYDEBITPERIOD = MNYDEBITPERIOD + ?,";
	        strSql += " MNYCREDITPERIOD = MNYCREDITPERIOD + ?,";
	        strSql += " MNYFDEBITPERIOD = MNYFDEBITPERIOD + ?,";
	        strSql += " MNYFCREDITPERIOD = MNYFCREDITPERIOD + ?, ";
	        strSql += " MNYDEBITCASHED = MNYDEBITCASHED + ?,";
	        strSql += " MNYCREDITCASHED = MNYCREDITCASHED + ?,";
	        strSql += " MNYFDEBITCASHED = MNYFDEBITCASHED + ?,";
	        strSql += " MNYFCREDITCASHED = MNYFCREDITCASHED + ?";
	        strSql += " WHERE UQGLOBALPERIODID = ? AND UQACCOUNTID = ? AND UQCOMPANYID = ? AND uqledgeid = ?";
	        List<Object> paras = new ArrayList<Object>();
	        if(tag == 1)
	        {
	        	paras.add(accdebitsum);
				paras.add(acccreditsum);
				paras.add(accfdebitsum);
				paras.add(accfcreditsum);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(uqglobalperiodid);
				paras.add(uqaccountid);
				paras.add(uqcompanyid);
				paras.add(uqledgeid);
	        }
	        else if(tag == 2)
	        {
	        	paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(accdebitsum);
				paras.add(acccreditsum);
				paras.add(accfdebitsum);
				paras.add(accfcreditsum);
				paras.add(uqglobalperiodid);
				paras.add(uqaccountid);
				paras.add(uqcompanyid);
				paras.add(uqledgeid);
	        }
	        else if(tag == 3)
	        {
	        	paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(accdebitsum);
				paras.add(acccreditsum);
				paras.add(accfdebitsum);
				paras.add(accfcreditsum);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(0);
				paras.add(uqglobalperiodid);
				paras.add(uqaccountid);
				paras.add(uqcompanyid);
				paras.add(uqledgeid);
	        }
	        this.execute(strSql, paras);
		}
	}
	
	public boolean getACInfoByAccountID(String uqaccountid)
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT count(1)");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" WHERE ((ta.INTPROPERTY = 1 AND (ta.UQTYPEID=7 OR ta.UQTYPEID = 1)) ");
		sb.append(" OR (ta.INTPROPERTY = 2 AND (ta.UQTYPEID=8 OR ta.UQTYPEID = 2))) ");
		sb.append(" AND ta.UQACCOUNTID = ? ");
		int result = this.querySingleInteger(sb.toString(), new String[]{uqaccountid});
		if( result > 0 )
		{
			return true;//是 电信核销科目
		}
		else
		{
			return false; //不是 电信核销科目
		}

	}
	
	public List<EntityMap> getACTypeByAccountID(String uqaccountid)
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT ta.INTPROPERTY,ta.UQTYPEID ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" WHERE ta.UQACCOUNTID = ? ");
		List<EntityMap> list = this.getMapList(sb.toString(), new Object[]{uqaccountid});
		return list;
	}
	
	/**
     * 往来信息临时表，插入数据
     * @param voucherid 凭证ID
     * @param voucherdetailid 明细ID
     * @param vouledgerid 凭证分录分户主键ID
     * @param main_data 分录对应往来主数据
     * @param detail_datas 分录对应往来明细
     */
	public void insertOffsetData(String voucherid,String voucherdetailid, String vouledgerid,String main_data, String detail_datas)
	{
		StringBuilder sb = new StringBuilder();
		List<Object> sqlParams = new ArrayList<>();
		sb.append(" INSERT INTO TGL_AC_OFFSET_TEMP ");
		if(vouledgerid.equals(""))
		{
			sb.append(" (uqvoucherid,uqvoucherdetailid,main_data,detail_datas) ");
			sb.append("  VALUES (?,?,?,?) ");
			sqlParams.add(voucherid);//凭证ID
			sqlParams.add(voucherdetailid);//明细ID
			sqlParams.add(main_data);//往来主数据
			sqlParams.add(detail_datas);//往来明细数据
		}
		else
		{
			sb.append(" (uqvoucherid,uqvoucherdetailid,uqledgeid,main_data,detail_datas) ");
			sb.append("  VALUES (?,?,?,?,?) ");
			sqlParams.add(voucherid);//凭证ID
			sqlParams.add(voucherdetailid);//明细ID
			sqlParams.add(vouledgerid);//凭证分录分户主键ID
			sqlParams.add(main_data);//往来主数据
			sqlParams.add(detail_datas);//往来明细数据
		}

        this.execute(sb.toString(),sqlParams);
	}
	
	/**
	 * 读取往来临时表数据往来信息临时表
	 * @param voucherid 凭证ID
	 * @param main_data 分录对应往来主数据
	 * @param detail_datas 分录对应往来明细
	 */
	/*public List<EntityMap> getOffsetData(String voucherid, String voucherdetailid, String vouledgerid)
	{
		StringBuilder sb = new StringBuilder();
		List<EntityMap> list = new ArrayList<EntityMap>();
		sb.append(" SELECT act.main_data,act.detail_datas,act.uqvoucherid ");
		//sb.append(" SELECT * ");
		sb.append(" FROM tgl_ac_offset_temp act ");
		sb.append(" WHERE 1=1 ");
		
		if(vouledgerid.equals(""))
		{
			sb.append(" AND act.uqvoucherid = ? ");
			sb.append(" AND act.uqvoucherdetailid = ? ");
			list = this.getMapList(sb.toString(), new Object[]{voucherid,voucherdetailid});
		}
		else if(voucherid.equals(""))
		{
			sb.append(" AND act.uqvoucherdetailid = ? ");
			sb.append(" AND act.uqvouledgerid = ? ");
			list = this.getMapList(sb.toString(), new Object[]{voucherdetailid,vouledgerid});
		}
		//System.out.println(list.get(0).getString("uqvouledgerid"));
		return list;
	}*/
	public List<EntityMap> getOffsetData(String voucherid, String voucherdetailid, String vouledgerid)
	{
		StringBuilder sb = new StringBuilder();
		List<EntityMap> list = new ArrayList<EntityMap>();
		sb.append(" SELECT act.main_data as mainData,act.detail_datas as detailDatas");
		sb.append(" FROM tgl_ac_offset_temp act ");
		sb.append(" WHERE 1=1 ");
		
		if(vouledgerid.equals(""))
		{
			sb.append(" AND act.uqvoucherid = ? ");
			sb.append(" AND act.uqvoucherdetailid = ? ");
			list = getMapList(sb.toString(), new Object[]{voucherid,voucherdetailid});
		}
		else if(voucherid.equals(""))
		{
			sb.append(" AND act.uqvoucherdetailid = ? ");
			sb.append(" AND act.uqledgeid = ? ");
			list = getMapList(sb.toString(), new Object[]{voucherdetailid,vouledgerid});
		}
		return list;
	}

	public List<EntityMap> getMapList(String strSql, Object[] paras)
	{
		try
		{	
			PreparedStatement ps = null;
			ResultSet rs = null;
			try
			{
				ps = this.getConnection().prepareStatement(strSql);
				
				this.setParasToStatement(ps, new ParaList(paras));

				rs = ps.executeQuery();
				
				List<EntityMap> list = EntityUtil.MapListFromRS(rs, false);
				
				return list;
			}
			finally
			{
				if (ps != null)
				{
					ps.close();
					ps = null;
				}
				if (rs != null)
				{
					rs.close();
					rs = null;
				}
			}
		}
		catch(Exception ex)
		{
			throw new RuntimeException(ex);
		}
	}

}