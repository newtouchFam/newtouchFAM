package com.newtouch.nwfs.gl.voucherbook.bp;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.nwfs.gl.voucherbook.dao.ProfitSheetDAO;
@Service
@Transactional
public class ProfitSheetBP 
{
	@Autowired
	private ProfitSheetDAO dao;

	public List<Map<String, Object>> getReportData(ConditionMap cdtMap) throws Exception
	{
		return this.dao.getReportData(cdtMap);
	}

}
