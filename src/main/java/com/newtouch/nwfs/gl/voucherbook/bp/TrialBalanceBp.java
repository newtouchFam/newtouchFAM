package com.newtouch.nwfs.gl.voucherbook.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.voucherbook.dao.TrialBalanceDao;

@Service
@Transactional
public class TrialBalanceBp 
{
	@Autowired
	private TrialBalanceDao trialBalanceDao;
	
	/**
	 * 获取临时表名
	 * @param cdtMap
	 * @return
	 * @throws Exception
	 */
	public String getTableName(ConditionMap cdtMap) throws Exception 
	{
		return this.trialBalanceDao.getTableName(cdtMap);
	}
	
	public PageData<EntityMap> getPageData(ConditionMap cdt) throws Exception
	{
		PageData<EntityMap> pageData = this.trialBalanceDao.getPageData(cdt);
		return pageData;
	}
}
