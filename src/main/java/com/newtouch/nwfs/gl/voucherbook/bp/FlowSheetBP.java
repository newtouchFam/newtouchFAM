package com.newtouch.nwfs.gl.voucherbook.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.voucherbook.dao.FlowSheetDAO;

@Service
@Transactional
public class FlowSheetBP
{
	@Autowired
	private FlowSheetDAO dao;
	
	public PageData<EntityMap> getPageData(int start, int limit, ConditionMap cdt) throws Exception
	{
		PageData<EntityMap> pageData = this.dao.getReportData(start,limit,cdt);
		return pageData;
	}

}
