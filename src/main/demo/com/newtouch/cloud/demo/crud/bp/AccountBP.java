package com.newtouch.cloud.demo.crud.bp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.demo.crud.dao.AccountDAO;
import com.newtouch.cloud.demo.crud.entity.AccountEntity;

@Service
@Transactional
public class AccountBP
{
	@Autowired
	private AccountDAO dao;

	public List<AccountEntity> getList(ConditionMap cdtMap)
	{
		return this.dao.getList(cdtMap);
	}

	public List<EntityMap> getList2(ConditionMap cdtMap)
	{
		return this.dao.getList2(cdtMap);
	}

	public PageData<AccountEntity> getPage(ConditionMap cdtMap)
	{
		return this.dao.getPage(cdtMap);
	}

	public PageData<EntityMap> getPage2(ConditionMap cdtMap)
	{
		return this.dao.getPage2(cdtMap);
	}

	public void add(AccountEntity account)
	{
		if (account.getAccountID() == null || account.getAccountID().equals(""))
		{
			account.setAccountID(StringUtil.getGUID());
		}

		if (account.getAccountCode() == null || account.getAccountCode().equals(""))
		{
			throw new RuntimeException("会计科目代码不可为空");
		}

		if (account.getAccountName() == null || account.getAccountName().equals(""))
		{
			throw new RuntimeException("会计科目名称不可为空");
		}

		if (this.dao.existsByCode(account.getAccountCode()))
		{
			throw new RuntimeException("会计科目代码【" + account.getAccountCode() + "】在系统内已存在");
		}

		this.dao.add(account);
	}
}