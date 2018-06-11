package com.newtouch.nwfs.gl.vouchermanager.bp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.vouchermanager.dao.VoucherAccountDAO;
import com.newtouch.nwfs.gl.vouchermanager.entity.BaseTreeData2Entity;

@Service
@Transactional
public class VoucherAccountBP
{
	@Autowired
	public VoucherAccountDAO voucherAccountDAO;
	
	public List<BaseTreeData2Entity> findAccountGroup(String uqaccountsetid, String node)
	{
		return voucherAccountDAO.findAccountGroup(uqaccountsetid, node);
	}
	
	public PageData<EntityMap> findAccountByFilter(String uqaccountsetid, String code, String node, String codecondition, ConditionMap cdtMap, int start, int limit)
	{
		int tag = 0;
		if(!StringUtil.isNullString(code))
		{
			node = code;
			tag = 1;
		}
		return voucherAccountDAO.findAccountByFilter(uqaccountsetid, node, codecondition, cdtMap, tag, start, limit);
	}
}
