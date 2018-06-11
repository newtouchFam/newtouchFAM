package com.newtouch.cloud.demo.report.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;

@Repository
public class UnitReportDAO extends CommonDAO
{
	public List<EntityMap> getReportData(ConditionMap cdtMap)
	{
		List<Object> params = new ArrayList<Object>();
		String strSql = "select unit.uqattrid as unitid, unit.varno as unitcode, unit.vardescription as unitname,";
		strSql += " (select count(1) from tsys_userbase u where u.uqcompanyid = unit.uqattrid) as usercount";
		strSql += " from tsys_companybase unit";
		strSql += " where unit.intattrstate = 1";

		if (cdtMap.containsCondition("unittext"))
		{
			strSql += " and (unit.varno like ? or unit.vardescription like ?)";
			params.add("%" + cdtMap.getString("unittext") + "%");
			params.add("%" + cdtMap.getString("unittext") + "%");
		}

		strSql += " order by unit.varno";

		return super.getMapList(strSql, params);
	}
}
