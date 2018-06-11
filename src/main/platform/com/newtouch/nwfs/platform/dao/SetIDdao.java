package com.newtouch.nwfs.platform.dao;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;

@Repository
public class SetIDdao extends CommonDAO
{
	public List<EntityMap> checkSetID(String SetID) 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT d.AccountSetID, d.DataBaseID, d.InsertDate, ");
		sb.append(" d.Status, d.ValidDateEnd, d.ValidDateStart ");
		sb.append(" FROM m_fdb d WHERE d.AccountSetID = ? ");
		List<EntityMap> list = this.getMapList(sb.toString(), new String[]{SetID});
		return list;
	}
}
