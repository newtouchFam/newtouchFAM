package com.newtouch.nwfs.gl.voucherbook.bp;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.voucherbook.dao.AccountperiodDao;

@Service
@Transactional
public class AccountperiodBp
{
	@Autowired
	private AccountperiodDao acccountperiodDao;
	
	public String getTableName(ConditionMap cdtMap) throws Exception 
	{
		return this.acccountperiodDao.getTableName(cdtMap);
	}

	public PageData<EntityMap> getPageData(ConditionMap cdt) throws Exception
	{
		PageData<EntityMap> pageData = this.acccountperiodDao.getPageData(cdt);
		List<EntityMap> data = pageData.getData();
		for (int i = 0; i < data.size(); i++) 
		{
			data.get(i).put("BEGINDEBIT", Double.parseDouble(data.get(i).getString("BEGINDEBIT")));
			data.get(i).put("BEGINCREDIT", Double.parseDouble(data.get(i).getString("BEGINCREDIT")));
			data.get(i).put("PERIODDEBIT", Double.parseDouble(data.get(i).getString("PERIODDEBIT")));
			data.get(i).put("PERIODCREDIT", Double.parseDouble(data.get(i).getString("PERIODCREDIT")));
			data.get(i).put("PERIODDEBITREST", Double.parseDouble(data.get(i).getString("PERIODDEBITREST")));
			data.get(i).put("PERIODCREDITREST", Double.parseDouble(data.get(i).getString("PERIODCREDITREST")));
			data.get(i).put("ENDDEBITREST", Double.parseDouble(data.get(i).getString("ENDDEBITREST")));
			data.get(i).put("ENDCREDITREST", Double.parseDouble(data.get(i).getString("ENDCREDITREST")));
		}
		pageData.setData(data);
		return pageData;
//		return this.acccountperiodDao.getPageData(tablename, start, limit);
	}
}
