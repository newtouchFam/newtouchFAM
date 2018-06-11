package com.newtouch.cloud.demo.crud.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;

@Repository
public class DemoDAO extends CommonDAO
{
	public List<EntityMap> getList()
	{
		String strSql = "select ub.id, ub.varname, ub.displayname";
		strSql += " from tsys_userbase ub";
		return this.getMapList(strSql);
	}

	public PageData<EntityMap> getPage()
	{
		String strSql = "select ub.id, ub.varname, ub.displayname";
		strSql += " from tsys_userbase ub";
		return this.getMapPage(strSql, 1, 100);
	}

	public PageData<EntityMap> getPage2()
	{
		String strSql = "select * from test004.tsys_userbase";
		strSql += " order by varname";
		return this.getMapPage(strSql, 5, 10);
	}
}
