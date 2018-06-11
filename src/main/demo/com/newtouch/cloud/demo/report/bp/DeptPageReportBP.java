package com.newtouch.cloud.demo.report.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.demo.report.dao.DeptPageReportDAO;

@Service
@Transactional
public class DeptPageReportBP
{
	@Autowired
	private DeptPageReportDAO dao;

	public PageData<EntityMap> getReportData(ConditionMap cdtMap)
	{
		return this.dao.getReportData(cdtMap);
	}
}
