package com.newtouch.nwfs.gl.datamanger.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.entity.AccountsEntity;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerItemEntity;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerTypeEntity;

@Repository
public class InitLedgePeriodDao extends CommonDAO
{

	public PageData<EntityMap> getInitLedgePeriod(String uqcompanyid, String uqaccountid, String uqledgetypeid, int start, int limit) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tl.uqledgeid, ");
		sb.append(" tcl.uqaccountid, ");
		sb.append(" tcl.uqcompanyid, ");
		sb.append(" tcl.uqglobalperiodid, ");
		sb.append(" tl.varledgecode, ");
		sb.append(" tl.varledgename, ");
		sb.append(" tcl.mnydebitperiod, ");
		sb.append(" tcl.mnycreditperiod ");
		sb.append(" FROM tgl_ledger tl ");
		sb.append(" LEFT JOIN tgl_company_ledger_periods tcl ON tcl.uqledgeid = tl.uqledgeid");
		sb.append(" AND tcl.uqcompanyid = ? ");
		sb.append(" AND tcl.uqaccountid = ? ");
		sb.append(" AND tcl.uqglobalperiodid = '00000000-0000-0000-0000-000000000000' ");
		sb.append(" WHERE tl.uqledgetypeid = ? ");
		sb.append(" AND tl.intislastlevel = 1 ");
		sb.append(" ORDER BY tl.varledgecode ");
		String [] fields = new String[]
				{
					uqcompanyid,uqaccountid,uqledgetypeid
				};
		return this.getMapPage(sb.toString(), fields, start, limit);
		
	}

	public void editInitLedgePeriod(EntityMap entity) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_company_ledger_periods SET ");
		sb.append(" mnydebitperiodall = ?, ");
		sb.append(" mnycreditperiodall = ?, ");
		sb.append(" mnydebitperiod = ?, ");
		sb.append(" mnycreditperiod = ? ");
		sb.append(" WHERE uqaccountid = ? ");
		sb.append(" AND uqcompanyid = ? ");
		sb.append(" AND uqglobalperiodid = ? ");
		sb.append(" AND uqledgeid = ? ");
		
		this.execute(sb.toString(), new Object[]
				{
					entity.getDouble("mnydebitperiod"),
					entity.getDouble("mnycreditperiod"),
					entity.getDouble("mnydebitperiod"),
					entity.getDouble("mnycreditperiod"),
					entity.getString("uqaccountid"),
					entity.getString("uqcompanyid"),
					entity.getString("uqglobalperiodid"),
					entity.getString("uqledgeid")
				});
		
	}

	public void saveInitLedgePeriod(EntityMap entity) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_company_ledger_periods (  ");
		sb.append(" uqcompanyid, uqglobalperiodid, uqaccountid, uqledgeid, ");
		sb.append(" mnydebitperiodall, mnycreditperiodall, mnyfdebitperiodall, mnyfcreditperiodall, ");
		sb.append(" mnydebitperiod, mnycreditperiod, mnyfdebitperiod, mnyfcreditperiod, ");
		sb.append(" mnydebitcashed, mnycreditcashed, mnyfdebitcashed, mnyfcreditcashed ");
		sb.append(" ) VALUES (?, ?, ?, ?,");
		sb.append(" ?, ?, 0, 0, ?, ?, 0, 0, 0, 0, 0, 0) ");
		
		this.execute(sb.toString(), new Object[]
				{
					entity.getString("uqcompanyid"),
					entity.getString("uqglobalperiodid"),
					entity.getString("uqaccountid"),
					entity.getString("uqledgeid"),
					entity.getDouble("mnydebitperiod"),
					entity.getDouble("mnycreditperiod"),
					entity.getDouble("mnydebitperiod"),
					entity.getDouble("mnycreditperiod")
				});
	}
	
	public List<Object[]> exportLedgePeriod(String uqcompanyid, String uqaccountid, String uqledgetypeid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT ta.varaccountcode, ");
		sb.append(" ta.varaccountname, ");
		sb.append(" tlt.varledgetypename, ");
		sb.append(" tl.varledgecode, ");
		sb.append(" tl.varledgename, ");
		sb.append(" tll.varledgename AS parentname, ");
		sb.append(" tcl.mnydebitperiod, ");
		sb.append(" tcl.mnycreditperiod ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" INNER JOIN tgl_account_ledgetype tal ON tal.uqaccountid = ta.uqaccountid ");
		sb.append(" INNER JOIN tgl_ledgetype tlt ON tlt.uqledgetypeid = tal.uqledgetypeid ");
		sb.append(" INNER JOIN tgl_ledger tl ON tl.uqledgetypeid = tlt.uqledgetypeid ");
		sb.append(" INNER JOIN tgl_ledger tll ON tll.uqledgeid = tl.uqparentid ");
		sb.append(" LEFT JOIN tgl_company_ledger_periods tcl ON tcl.uqaccountid = ta.uqaccountid ");
		sb.append(" AND tcl.uqcompanyid = ? ");
	//	sb.append(" AND tcl.uqcompanyid = :uqcompanyid ");
		sb.append(" AND tcl.uqglobalperiodid = '00000000-0000-0000-0000-000000000000' ");
		sb.append(" AND tcl.uqledgeid = tl.uqledgeid ");
		sb.append(" WHERE ta.intisledge = 1 ");
		sb.append(" AND tl.intislastlevel = 1 ");
		sb.append(" ORDER BY ta.varaccountcode,tl.varledgecode ");
		ArrayList<Object[]> list = new ArrayList<Object[]>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new Object[]{uqcompanyid});
		for(int i =0;i<mapList.size();i++)
		{
			list.add(new Object[]
					{
						mapList.get(i).getString("varaccountcode"),
						mapList.get(i).getString("varaccountname"),
						mapList.get(i).getString("varledgetypename"),
						mapList.get(i).getString("varledgecode"),
						mapList.get(i).getString("varledgename"),
						mapList.get(i).getString("parentname"),
						mapList.get(i).getString("mnydebitperiod"),
						mapList.get(i).getString("mnycreditperiod"),
					});
		}
		return list;
	}

	public List<AccountsEntity> getAccountByCode(String accountCode, String uqaccountsetid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	ta.* ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" WHERE ta.uqaccountsetid = ? ");
		sb.append(" AND ta.varaccountcode = ? ");
		return this.getEntityList(sb.toString(),new Object[]{uqaccountsetid,accountCode}, AccountsEntity.class);
	}

	public List<LedgerTypeEntity> getLedgerTypeEntityByName(String uqaccountid, String ledgerTypeName) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tl.* ");
		sb.append(" FROM tgl_ledgetype tl ");
		sb.append(" LEFT JOIN tgl_account_ledgetype tal ");
		sb.append(" ON tal.uqledgetypeid = tl.uqledgetypeid ");
		sb.append(" WHERE tl.varledgetypename = ? ");
		sb.append(" AND tal.uqaccountid = ? ");
		return this.getEntityList(sb.toString(), new Object[]{ledgerTypeName,uqaccountid}, LedgerTypeEntity.class);
	}

	public List<LedgerItemEntity> getLedgerItemEntityByCode(String varledgecode, String uqledgetypeid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tl.* ");
		sb.append(" FROM tgl_ledger tl ");
		sb.append(" LEFT JOIN tgl_ledgetype tlt ");
		sb.append(" ON tlt.uqledgetypeid = tl.uqledgetypeid ");
		sb.append(" WHERE tl.varledgecode = ? ");
		sb.append(" AND tlt.uqledgetypeid = ? ");
		return this.getEntityList(sb.toString(), new Object[]{varledgecode,uqledgetypeid}, LedgerItemEntity.class);
	}

	public List<String> getLedgePeriod(EntityMap entity) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_company_ledger_periods tcl ");
		sb.append(" WHERE tcl.uqaccountid = ? ");
		sb.append(" AND tcl.uqcompanyid = ? ");
		sb.append(" AND tcl.uqglobalperiodid = ? ");
		sb.append(" AND tcl.uqledgeid = ? ");
		ArrayList<String> list = new ArrayList<String>();
		List<EntityMap> mapList = this.getMapList(sb.toString(),new Object[]
				{
					entity.get("uqaccountid"),
					entity.get("uqcompanyid"),
					entity.get("uqglobalperiodid"),
					entity.get("uqledgeid")
				});
		for(int i =0;i<mapList.size();i++)
		{
			list.add(mapList.get(i).getString("COUNT(0)"));
		}
		return list;
	}

	public List<Object> getAccountPeriod(EntityMap entity) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tpa.mnydebitperiod, ");
		sb.append(" tpa.mnycreditperiod ");
		sb.append(" FROM tgl_period_accounts tpa ");
		sb.append(" WHERE tpa.uqaccountid = ? ");
		sb.append(" AND tpa.uqcompanyid = ? ");
		sb.append(" AND tpa.uqglobalperiodid = ? ");
		ArrayList<Object> list = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new Object[]
				{
					entity.get("uqaccountid"),
					entity.get("uqcompanyid"),
					entity.get("uqglobalperiodid")
				});
		for (int i = 0;i<mapList.size();i++)
		{
			list.add(new Object[]
					{
						mapList.get(i).getString("mnydebitperiod"),
						mapList.get(i).getString("mnycreditperiod")
					});
		}
		return list;
	}
}
