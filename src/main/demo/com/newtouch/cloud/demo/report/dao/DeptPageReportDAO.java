package com.newtouch.cloud.demo.report.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;

@Repository
public class DeptPageReportDAO extends CommonDAO
{
	private String getSql(ConditionMap cdtMap, List<Object> params)
	{
		String strSql = "select unit.uqattrid as unitid, unit.varno as unitcode, unit.vardescription as unitname,";
		strSql += "     dept.uqattrid as deptid, dept.varno as deptcode, dept.vardescription as deptname,";
		strSql += "     (select count(1) from tsys_userbase u where u.uqcompanyid = unit.uqattrid and u.uqdeptid = dept.uqattrid) as usercount";
		strSql += " from tsys_companybase unit";
		strSql += "     inner join tsys_departmentbase dept on dept.uqunitid = unit.uqattrid";
		strSql += " where unit.intattrstate = 1";
		strSql += "     and dept.intattrstate = 1";

		if (cdtMap.containsCondition("unittext"))
		{
			strSql += " and (unit.varno like ? or unit.vardescription like ?)";
			params.add("%" + cdtMap.getString("unittext") + "%");
			params.add("%" + cdtMap.getString("unittext") + "%");
		}

		if (cdtMap.containsCondition("depttext"))
		{
			strSql += " and (dept.varno like ? or dept.vardescription like ?)";
			params.add("%" + cdtMap.getString("depttext") + "%");
			params.add("%" + cdtMap.getString("depttext") + "%");
		}

		strSql += " order by unit.varno, dept.varno";

		return strSql;
	}

	public PageData<EntityMap> getReportData(ConditionMap cdtMap)
	{
		List<Object> params = new ArrayList<Object>();
		String strSql = this.getSql(cdtMap, params);

		return super.getMapPage(strSql, params, cdtMap.getStart(), cdtMap.getLimit());
	}
}
