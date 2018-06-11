package com.newtouch.test.sf.dao;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.HibernateDAO;
import com.newtouch.test.entity.Test1Entity;

@Repository
public class Test1HibernateSFDAO extends HibernateDAO<Test1Entity, String>
{
}