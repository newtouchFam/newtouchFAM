package com.newtouch.nwfs.gl.voucherbook.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.voucherbook.dao.DailyBookDAO;

@Service
@Transactional
public class DailyBookBP
{
	@Autowired
	private DailyBookDAO dailybookdao;

	/* 查询日记账 */
	public PageData<EntityMap> getPageData(ConditionMap cdt) throws Exception
	{
		PageData<EntityMap> pageData = this.dailybookdao.getPageData(cdt);
		return pageData;
	}
	
	public String  getTableName(ConditionMap cdt)throws Exception
	{
		return this.dailybookdao.getTableName(cdt);
		
	}
	
}
