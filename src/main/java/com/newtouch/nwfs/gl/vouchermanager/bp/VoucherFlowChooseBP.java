package com.newtouch.nwfs.gl.vouchermanager.bp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.vouchermanager.dao.VoucherFlowChooseDAO;
import com.newtouch.nwfs.gl.vouchermanager.entity.BaseTreeData2Entity;

@Service
@Transactional
public class VoucherFlowChooseBP 
{
	@Autowired
	private VoucherFlowChooseDAO dao;
	
	public PageData<EntityMap> findAccountByFilter(String code, String node, String codecondition, ConditionMap cdtMap, int start, int limit)
	{
		return dao.findFlowByFilter(node, codecondition, cdtMap, start, limit);
	}
	
	public List<BaseTreeData2Entity> findFlowGroup(String node) 
	{
		return dao.findFlowGroup(node);
	}

}
