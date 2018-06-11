package com.newtouch.nwfs.gl.voucherbook.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.voucherbook.dao.GlBookDao;



@Service
@Transactional
public class GlBookBp
{
	@Autowired
	private GlBookDao glbookdao;

	public PageData<EntityMap> getPageData(ConditionMap cdtMap) throws Exception
	{

		return this.glbookdao.getPageData(cdtMap);
	}

	public String getglbooktableName(ConditionMap cdtMap)  throws Exception
	{
		
		return glbookdao.getglbooktableName(cdtMap);
	}
}
