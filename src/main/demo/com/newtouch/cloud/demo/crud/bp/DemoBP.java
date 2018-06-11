package com.newtouch.cloud.demo.crud.bp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.demo.crud.dao.DemoDAO;

@Service
@Transactional
public class DemoBP
{
	@Autowired
	private DemoDAO dao;

	public List<EntityMap> getList()
	{
		return this.dao.getList();
	}

	public PageData<EntityMap> getPage()
	{
		return this.dao.getPage();
	}

	public PageData<EntityMap> getPage2()
	{
		return this.dao.getPage2();
	}
}