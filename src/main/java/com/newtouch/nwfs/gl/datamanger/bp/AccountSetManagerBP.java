package com.newtouch.nwfs.gl.datamanger.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.dao.AccountSetManagerDAO;

@Service
@Transactional
public class AccountSetManagerBP 
{
	@Autowired
	private AccountSetManagerDAO accountsetmanagerdao;
	
	public PageData<EntityMap> getAccountSetList(int start, int limit) throws Exception 
	{
		return accountsetmanagerdao.getAccounSetList(start, limit);
	}

	/**
	 * 增加时  判断code name  是否存在了 增加时 判断时不用考虑到是否与自己数据重复
	 */
	public void addAccountSet(String varaccountsetcode, String varaccountsetname) throws Exception 
	{
		if(accountsetmanagerdao.exitAccountSetCodeAndName(varaccountsetcode, varaccountsetname,"null"))
		{
			throw new Exception();
		}
		else
		{
			accountsetmanagerdao.addAccountSet(varaccountsetcode, varaccountsetname);
		}
	}

	/**
	 * 	修改时  判断code name 是否存在  需要考虑是否与自己的数据重复  是可以与自己重复的
	 */
	public void editAccountSet(String uqaccountsetid, String varaccountsetcode,String varaccountsetname) throws Exception 
	{
		if(accountsetmanagerdao.exitAccountSetCodeAndName(varaccountsetcode, varaccountsetname,uqaccountsetid))
		{
			throw new Exception();
		}
		else
		{
			accountsetmanagerdao.editAccountSet(uqaccountsetid, varaccountsetcode, varaccountsetname);
		}
	}

	/**
	 * 删除   遍历传入的ID数组 循环调用dao执行update
	 */
	public void delAccountSet(String[] idarray) throws Exception 
	{
		for(int i=0;i<idarray.length;i++)
		{
			accountsetmanagerdao.delAccountSet(idarray[i]);
		}
	}

	/**
	 * 启用,关闭   遍历传入的ID数组 循环调用dao执行update
	 */
	public void startAccountSet(String[] idarray,int intflag) throws Exception 
	{
		for(int i=0;i<idarray.length;i++)
		{
			accountsetmanagerdao.startAccountSet(idarray[i],intflag);
		}
	}
	
	/**
	 * 获取当前开启的科目套
	 * @return
	 * @throws Exception
	 */
	public EntityMap getStartAccountSetId() throws Exception
	{
		return this.accountsetmanagerdao.getStartAccountSetId();
	}
}
