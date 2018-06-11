package com.newtouch.nwfs.platform.bp;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.nwfs.platform.dao.MenuDAO;

@Service
@Transactional
public class MenuBP
{
	@Autowired
	private MenuDAO dao;

	public List<EntityMap> getTree(String node, ConditionMap cdtMap)
	{
		return this.dao.getTree(node, cdtMap);
	}
	
	public List<EntityMap> getMenuTree(String node, String userid, String companyid) throws Exception
	{
		String batchId = UUID.randomUUID().toString();
		return this.dao.getMenuTree(userid, companyid, node, batchId);
	}
}
