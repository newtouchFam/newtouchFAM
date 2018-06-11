package com.newtouch.nwfs.gl.component.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;

@Repository
public class XyLedgerTreeDAO extends CommonDAO
{

	/*
	 * 查询分户类型
	 */
	public List<EntityMap> getLedgerType(String accountcode) throws Exception
	{
		String sql = "";
		sql += " select distinct l.uqledgetypeid as id,l.varledgetypecode, ";
		sql += " l.varledgetypename as text,0 as leaf ,'0' as tag, '' as uqcompanyid ";
		sql += " from tgl_ledgetype l ";
		sql += " where exists ( ";
		sql += " select 1 from tgl_account_ledgetype t ";
		sql += " where  1=1 ";
		if(!StringUtil.isNullString(accountcode))
		{
			sql += " and t.uqaccountid in ( select gl.uqaccountid from tgl_accounts gl  ";
			sql += " inner join tgl_account_ledgetype p on p.uqaccountid = gl.uqaccountid ";
			sql += " where gl.varaccountcode like '"+accountcode+"%' ";
			sql += " and gl.intislastlevel = 1 ) ";
		}
		sql += " and t.uqledgetypeid = l.uqledgetypeid) and l.intstatus=2 ";
		sql += " order by l.varledgetypename ";
		return getMapList(sql);
	}

	/*
	 * 查询分户类型下的一级分户明细
	 */
	public List<EntityMap> getLedgerDetial(String id)throws Exception
	{
		
		String sql = "";
		sql += " select l.uqledgeid  as id,l.varledgecode,concat('[',l.varledgecode,']',l.varledgename) as text, ";
		sql += " l.intislastlevel as leaf,'1' as tag, lc.uqcompanyid ";
		sql += " from tgl_ledger l ";
		sql += " left join tgl_ledger_company lc on lc.uqledgeid=l.uqledgeid ";
		sql += " where l.uqparentid = l.uqledgeid ";
		sql += " and l.uqledgetypeid = '" + id +"' ";
		sql += " order by varledgecode ";
		return getMapList(sql);
	}

	/*
	 * 查询查询大于一级的分户明细
	 */
	public List<EntityMap> getLedgerDetialinfo(String id)throws Exception
	{ 
		String sql = "";
		sql += " select l.uqledgeid as id,l.varledgecode, concat('[',l.varledgecode,']',l.varledgename)  as text, ";
		sql += " l.intislastlevel as leaf,'2' as tag, lc.uqcompanyid ";
		sql += " from tgl_ledger l ";
		sql += " left join tgl_ledger_company lc on lc.uqledgeid=l.uqledgeid  ";
		sql += " where l.uqparentid = '" + id + "' ";
		sql += " and l.uqparentid <> l.uqledgeid ";
		sql += " order by varledgecode ";
		return getMapList(sql);
	}
}
