package com.newtouch.nwfs.gl.voucherbook.bp;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.voucherbook.dao.AlDetailBookDAO;

@Service
@Transactional
public class AlDetailBookBP 
{
	@Autowired
	private AlDetailBookDAO dao;
	
	public PageData<EntityMap> getReportData(ConditionMap cdtMap)
	{
		return this.dao.getReportData(cdtMap);
	}

	public String getTableName(ConditionMap cdtMap) {
		return this.dao.getTableName(cdtMap);
	}
	
	public Object[] getCurrentPeriodInfo(ConditionMap cdtMap)
	{
		String strDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		int nowyearmonth = Integer.parseInt(strDate.substring(0, 4) + strDate.substring(5, 7));
		Object[] period = null;
		String flag = cdtMap.getString("flag");
		//按照当前年月获取启用的会计期
		if ("0".equals(flag)) 
		{
			period = dao.getCurrentPeriodInfo(nowyearmonth);
		}
		else 
		{
			period = dao.getCurrentPeriodInfoAll(nowyearmonth);
		}
		return period;
	}
}
