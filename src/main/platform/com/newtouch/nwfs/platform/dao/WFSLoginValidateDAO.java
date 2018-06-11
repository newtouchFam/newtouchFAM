package com.newtouch.nwfs.platform.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;

@Repository
public class WFSLoginValidateDAO extends CommonDAO
{
	public EntityMap getLoginInfo(String strUserID)
	{
		String strSql = "select company.uqattrid as companyid,";
		strSql += " company.varno as companycode, company.vardescription as companyname";
		strSql += " from tsys_userbase ub";
		strSql += " 	inner join tsys_companybase company on company.uqattrid = ub.uqcompanyid";
		strSql += " where ub.id = ?";

		List<EntityMap> list = this.getMapList(strSql, new String[] { strUserID });
		if (list.size() > 0)
		{
			return list.get(0);
		}
		else
		{
			return null;
		}
	}
}
