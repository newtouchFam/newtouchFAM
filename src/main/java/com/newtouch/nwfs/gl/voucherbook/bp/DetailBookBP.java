package com.newtouch.nwfs.gl.voucherbook.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.voucherbook.dao.DetailBookDAO;

@Service
@Transactional
public class DetailBookBP
{
	@Autowired
	private DetailBookDAO detailbookdao;
	
	public PageData<EntityMap> getPageData(ConditionMap cdt) throws Exception 
	{
		return detailbookdao.getPageData(cdt);
		
	}
	
	//获得表名
	public String getTableName(ConditionMap cdtMap) throws Exception 
	{
		return detailbookdao.getTableName(cdtMap);
	}
	
}
