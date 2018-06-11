package com.newtouch.test.sf.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.test.entity.Test1Entity;
import com.newtouch.test.sf.dao.Test1CommonSFDAO;
import com.newtouch.test.sf.dao.Test1HibernateSFDAO;
import com.newtouch.test.sf.dao.Test2CommonSFDAO;
import com.newtouch.test.sf.dao.Test2HibernateSFDAO;

@Service
@Transactional
public class Test1SFBP
{
	@Autowired
	private Test1CommonSFDAO test1CommonSFDAO;
	@Autowired
	private Test2CommonSFDAO test2CommonSFDAO;

	@Autowired
	private Test1HibernateSFDAO test1HibernateSFDAO;
	@Autowired
	private Test2HibernateSFDAO test2HibernateSFDAO;

	public void test1()
	{
		System.out.println("查询数量1");
		this.printCount();

		this.test1CommonSFDAO.add(StringUtil.getGUID());

		System.out.println("查询数量2");
		this.printCount();

		this.test2CommonSFDAO.add(StringUtil.getGUID());

		System.out.println("查询数量3");
		this.printCount();

		Test1Entity entity1 = new Test1Entity();
		entity1.setCode(StringUtil.getGUID());
		this.test1HibernateSFDAO.save(entity1);

		System.out.println("查询数量4");
		this.printCount();

		Test1Entity entity2 = new Test1Entity();
		entity2.setCode(StringUtil.getGUID());
		this.test1HibernateSFDAO.save(entity2);

		System.out.println("查询数量5");
		this.printCount();
	}

	private void printCount()
	{
		System.out.println("test1CommonSFDAO.getEntityList().size()=" + this.test1CommonSFDAO.getEntityList().size());
		System.out.println("test1CommonSFDAO.getEntityPage().getTotal()=" + this.test1CommonSFDAO.getEntityPage(5, 10).getTotal());
		System.out.println("test1CommonSFDAO.getMapList().size()=" + this.test1CommonSFDAO.getMapList().size());
		System.out.println("test1CommonSFDAO.getMapPage().getTotal()=" + this.test1CommonSFDAO.getMapPage(5, 10).getTotal());
		System.out.println("test1CommonSFDAO.getTotal=" + this.test1CommonSFDAO.getTotal("select * from test_1"));
		System.out.println("test1CommonSFDAO.querySingleInteger=" + this.test1CommonSFDAO.querySingleInteger("select count(*) from test_1"));

		System.out.println("test2CommonSFDAO.getEntityList().size()=" + this.test2CommonSFDAO.getEntityList().size());
		System.out.println("test2CommonSFDAO.getEntityPage().getTotal()=" + this.test2CommonSFDAO.getEntityPage(5, 10).getTotal());
		System.out.println("test2CommonSFDAO.getMapList().size()=" + this.test2CommonSFDAO.getMapList().size());
		System.out.println("test2CommonSFDAO.getMapPage().getTotal()=" + this.test2CommonSFDAO.getMapPage(5, 10).getTotal());
		System.out.println("test2CommonSFDAO.getTotal=" + this.test2CommonSFDAO.getTotal("select * from test_1"));
		System.out.println("test2CommonSFDAO.querySingleInteger=" + this.test2CommonSFDAO.querySingleInteger("select count(*) from test_1"));

		System.out.println("test1HibernateSFDAO.getEntityList().size()=" + this.test1HibernateSFDAO.getEntityList().size());
		System.out.println("test1HibernateSFDAO.getEntityPage().getTotal()=" + this.test1HibernateSFDAO.getEntityPage(5, 10).getTotal());
		System.out.println("test2HibernateSFDAO.getEntityList().size()=" + this.test2HibernateSFDAO.getEntityList().size());
		System.out.println("test2HibernateSFDAO.getEntityPage().getTotal()=" + this.test2HibernateSFDAO.getEntityPage(5, 10).getTotal());
	}
}