package com.newtouch.test.em.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.test.entity.Test1Entity;

@Repository
public class Test2CommonEMDAO extends CommonDAO
{
	public List<Test1Entity> getEntityList()
	{
		String strSql = "select * from test_1";
		return this.getEntityList(strSql, Test1Entity.class);
	}

	public PageData<Test1Entity> getEntityPage(int start, int limit)
	{
		String strSql = "select * from test_1";
		return this.getEntityPage(strSql, Test1Entity.class, start, limit);
	}

	public List<EntityMap> getMapList()
	{
		String strSql = "select * from test_1";
		return this.getMapList(strSql); 		
	}

	public PageData<EntityMap> getMapPage(int start, int limit)
	{
		String strSql = "select * from test_1";
		return this.getMapPage(strSql, start, limit);
	}

	public String add(String code)
	{
		String strSql = "insert into test_1 values (?)";

		return String.valueOf(this.execute(strSql, new String[] { code }));
	}
}