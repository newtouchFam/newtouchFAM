package com.newtouch.test.em.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.test.em.dao.Test1CommonEMDAO;
import com.newtouch.test.em.dao.Test1HibernateEMDAO;
import com.newtouch.test.em.dao.Test2CommonEMDAO;
import com.newtouch.test.em.dao.Test2HibernateEMDAO;
import com.newtouch.test.entity.Test1Entity;

@Service
@Transactional
public class Test1EMBP
{
	@Autowired
	private Test1CommonEMDAO test1CommonEMDAO;
	@Autowired
	private Test2CommonEMDAO test2CommonEMDAO;

	@Autowired
	private Test1HibernateEMDAO test1HibernateEMDAO;
	@Autowired
	private Test2HibernateEMDAO test2HibernateEMDAO;

	public void test1()
	{
		System.out.println("查询数量1");
		this.printCount();

		this.test1CommonEMDAO.add(StringUtil.getGUID());

		System.out.println("查询数量2");
		this.printCount();

		this.test2CommonEMDAO.add(StringUtil.getGUID());

		System.out.println("查询数量3");
		this.printCount();

		Test1Entity entity1 = new Test1Entity();
		entity1.setCode(StringUtil.getGUID());
		this.test1HibernateEMDAO.save(entity1);

		System.out.println("查询数量4");
		this.printCount();

		Test1Entity entity2 = new Test1Entity();
		entity2.setCode(StringUtil.getGUID());
		this.test1HibernateEMDAO.save(entity2);

		System.out.println("查询数量5");
		this.printCount();
	}

	private void printCount()
	{
		System.out.println("test1CommonEMDAO.getDialect()=" + this.test1CommonEMDAO.getDialect());

		System.out.println("test1CommonEMDAO.getEntityList().size()=" + this.test1CommonEMDAO.getEntityList().size());
		System.out.println("test1CommonEMDAO.getEntityPage().getTotal()=" + this.test1CommonEMDAO.getEntityPage(5, 10).getTotal());
		System.out.println("test1CommonEMDAO.getMapList().size()=" + this.test1CommonEMDAO.getMapList().size());
		System.out.println("test1CommonEMDAO.getMapPage().getTotal()=" + this.test1CommonEMDAO.getMapPage(5, 10).getTotal());
		System.out.println("test1CommonEMDAO.getTotal=" + this.test1CommonEMDAO.getTotal("select * from test_1"));
		System.out.println("test1CommonEMDAO.querySingleInteger=" + this.test1CommonEMDAO.querySingleInteger("select count(*) from test_1"));

		System.out.println("test2CommonEMDAO.getEntityList().size()=" + this.test2CommonEMDAO.getEntityList().size());
		System.out.println("test2CommonEMDAO.getEntityPage().getTotal()=" + this.test2CommonEMDAO.getEntityPage(5, 10).getTotal());
		System.out.println("test2CommonEMDAO.getMapList().size()=" + this.test2CommonEMDAO.getMapList().size());
		System.out.println("test2CommonEMDAO.getMapPage().getTotal()=" + this.test2CommonEMDAO.getMapPage(5, 10).getTotal());
		System.out.println("test2CommonEMDAO.getTotal=" + this.test2CommonEMDAO.getTotal("select * from test_1"));
		System.out.println("test2CommonEMDAO.querySingleInteger=" + this.test2CommonEMDAO.querySingleInteger("select count(*) from test_1"));

		System.out.println("test1HibernateEMDAO.getEntityList().size()=" + this.test1HibernateEMDAO.getEntityList().size());
		System.out.println("test1HibernateEMDAO.getEntityPage().getTotal()=" + this.test1HibernateEMDAO.getEntityPage(5, 10).getTotal());
		System.out.println("test2HibernateEMDAO.getEntityList().size()=" + this.test2HibernateEMDAO.getEntityList().size());
		System.out.println("test2HibernateEMDAO.getEntityPage().getTotal()=" + this.test2HibernateEMDAO.getEntityPage(5, 10).getTotal());
	}
}