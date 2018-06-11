package com.newtouch.nwfs.gl.voucherbook.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.voucherbook.dao.LaPeriodBookDAO;

@Service
@Transactional
public class LaPeriodBookBP 
{
	@Autowired
	private LaPeriodBookDAO dao;
	
	public PageData<EntityMap> getReportData(ConditionMap cdtMap)
	{
		return this.dao.getReportData(cdtMap);
	}

	public String getTableName(ConditionMap cdtMap) {
		return this.dao.getTableName(cdtMap);
	}
	
}