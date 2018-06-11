package com.newtouch.cloud.demo.report.bp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.demo.report.dao.UnitReportDAO;

@Service
@Transactional
public class UnitReportBP
{
	@Autowired
	private UnitReportDAO dao;

	public List<EntityMap> getReportData(ConditionMap cdtMap)
	{
		return this.dao.getReportData(cdtMap);
	}
}
