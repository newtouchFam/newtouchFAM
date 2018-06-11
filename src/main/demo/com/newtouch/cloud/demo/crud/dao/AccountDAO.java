package com.newtouch.cloud.demo.crud.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.demo.crud.entity.AccountEntity;

@Repository
public class AccountDAO extends CommonDAO
{
	private String getSQL(ConditionMap cdtMap, List<Object> params)
	{
		params.clear();

		String strSql = "select acc.uqaccountid as accountid,";
		strSql += " acc.varaccountcode as accountcode, acc.varaccountname as accountname";
		strSql += " from tgl_accounts acc";
		strSql += " where 1 = 1";

		if (cdtMap.containsCondition("accountcode"))
		{
			strSql += " and acc.varaccountcode = ?";
			params.add(cdtMap.getString("accountcode"));
		}

		if (cdtMap.containsCondition("accountname"))
		{
			strSql += " and acc.varaccountname like ?";
			params.add("%" + cdtMap.getString("accountname") + "%");
		}

		if (cdtMap.containsCondition("userid"))
		{
			/* 增加userid相关条件 */
		}

		strSql += " order by acc.varaccountcode";

		return strSql;
	}

	public List<AccountEntity> getList(ConditionMap cdtMap)
	{	
		List<Object> params = new ArrayList<Object>();
		String strSql = this.getSQL(cdtMap, params);

		return this.getEntityList(strSql, params, AccountEntity.class);
	}

	public List<EntityMap> getList2(ConditionMap cdtMap)
	{
		List<Object> params = new ArrayList<Object>();
		String strSql = this.getSQL(cdtMap, params);

		return this.getMapList(strSql, params);
	}

	public PageData<AccountEntity> getPage(ConditionMap cdtMap)
	{
		String strSql = "select acc.uqaccountid as accountid,";
		strSql += " acc.varaccountcode as accountcode, acc.varaccountname as accountname";
		strSql += " from tgl_accounts acc";
		strSql += " where 1 = 1";

		List<Object> params = new ArrayList<Object>();
		if (cdtMap.containsCondition("accountcode"))
		{
			strSql += " and acc.varaccountcode = ?";
			params.add(cdtMap.getString("accountcode"));
		}

		if (cdtMap.containsCondition("accountname"))
		{
			strSql += " and acc.varaccountname like ?";
			params.add("%" + cdtMap.getString("accountname") + "%");
		}

		if (cdtMap.containsCondition("userid"))
		{
			/* 增加userid相关条件 */
		}

		strSql += " order by acc.varaccountcode";
		return this.getEntityPage(strSql, params, AccountEntity.class,
				cdtMap.getStart(), cdtMap.getLimit());
	}

	public PageData<EntityMap> getPage2(ConditionMap cdtMap)
	{
		List<Object> params = new ArrayList<Object>();
		String strSql = this.getSQL(cdtMap, params);

		return this.getMapPage(strSql, params, cdtMap.getStart(), cdtMap.getLimit());
	}

	public AccountEntity getAccountByCode(String accountCode)
	{
		ConditionMap cdtMap = new ConditionMap();
		cdtMap.put("accountcode", accountCode);

		List<AccountEntity> list = this.getList(cdtMap);
		if (list.size() > 0)
		{
			return list.get(0);
		}
		else
		{
			return null;
		}
	}

	/**
	 * 根据会计科目代码检查科目是否存在
	 * @param accountCode
	 * @return
	 */
	public boolean existsByCode(String accountCode)
	{
		AccountEntity entity = this.getAccountByCode(accountCode);

		return (entity != null);
	}

	public void add(AccountEntity account)
	{
		/*不实际执行
		String strSql = "insert into tgl_accounts (uqaccountid, varaccountcode, varaccountname)";
		strSql += " values (?, ?, ?)";

 		this.execute(strSql, new String[] { account.getAccountID(),
				account.getAccountCode(),
				account.getAccountName() });*/

		throw new RuntimeException("影响行数=1");
	}
}
