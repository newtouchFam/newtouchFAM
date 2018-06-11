package com.newtouch.nwfs.gl.voucherbook.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.voucherbook.dao.AlPeriodBookDAO;

@Service
@Transactional
public class AlPeriodBookBP
{
	@Autowired
	private AlPeriodBookDAO alperiodbookdao;
	
	/*
	 * 通过查询条件调用存储过程，返回查询数据临时表的表名
	 */
	public String getTableName(ConditionMap cdt) throws Exception
	{
		return this.alperiodbookdao.getTableName(cdt);
	}

	/*
	 * 查询临时表的数据
	 */
	public PageData<EntityMap> getPageData(int start, int limit,ConditionMap cdt) throws Exception
	{
		return this.alperiodbookdao.getPageData(start,limit,cdt);
	}
}
