package com.newtouch.nwfs.gl.datamanger.dao;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;

@Repository
public class AccountSetManagerDAO extends CommonDAO 
{
	/**
	 * 获得帐套列表
	 */
	public PageData<EntityMap> getAccounSetList(int start, int limit) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" select a.uqaccountsetid , a.varaccountsetcode ,a.varaccountsetname ,a.intflag");
		strSQL.append(" from tgl_accountsets a order by a.accountsetdate desc");
		return this.getMapPage(strSQL.toString(), start, limit);
	}
	
	/**
	 * 增加帐套
	 */
	public void addAccountSet(String varaccountsetcode, String varaccountsetname) throws Exception 
	{
		//获得当前创建的日期时间
	//	SimpleDateFormat myFmt2=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//等价于now.toLocaleString()
		Date date=new Date();
	//	DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	//	String time=format.format(date);
		
		StringBuilder strSQL = new StringBuilder();
		String uqaccountsetid = UUID.randomUUID().toString().toUpperCase();
		strSQL.append(" insert into tgl_accountsets (uqaccountsetid,varaccountsetcode,varaccountsetname,intflag,accountsetdate)");
		strSQL.append(" values( ?, ?, ?, 1, ?)");
		this.execute(strSQL.toString(), new Object []{uqaccountsetid,varaccountsetcode,varaccountsetname,date});
	}

	/**
	 * 修改帐套
	 */
	public void editAccountSet(String uqaccountsetid, String varaccountsetcode,String varaccountsetname) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
	    strSQL.append(" update tgl_accountsets set ");
	    strSQL.append(" varaccountsetcode= ? ,");
	    strSQL.append(" varaccountsetname= ? ");
	    strSQL.append(" where uqaccountsetid= ?");
	    this.execute(strSQL.toString(), new String[]
	    		{varaccountsetcode,varaccountsetname,uqaccountsetid});
	}

	/**
	 * 仅删除新建的帐套
	 */
	public void delAccountSet(String accountid) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" delete from tgl_accountsets ");
		strSQL.append(" where intflag = 1 and uqaccountsetid = ?");
		this.execute(strSQL.toString(), new String[]{accountid});	    
	}

	/**
	 * 启用帐套
	 */
	public void startAccountSet(String accountid,int intflag) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
	    strSQL.append(" update tgl_accountsets set ");
	    strSQL.append(" intflag = ? ");
	    strSQL.append(" where uqaccountsetid = ?");
	    this.execute(strSQL.toString(), new Object[]{intflag,accountid});
	}

	/**
	 * 关闭帐套
	 */
	public void closeAccountSet(String accountid,int intflag) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" update tgl_accountsets set ");
	    strSQL.append(" intflag = ? ");
	    strSQL.append(" where uqaccountsetid = ?");
	    this.execute(strSQL.toString(), new Object[]{intflag,accountid});
	}
	
	/**
	 * 判断code,name是否存在重复的
	 * 且重复的数据ID不是自己的ID
	 */
	public boolean exitAccountSetCodeAndName(String code, String name ,String uqaccountsetid) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" select count(1) ");
		strSQL.append(" from tgl_accountsets ");
		strSQL.append(" where uqaccountsetid <> ?  ");
		strSQL.append(" and ( varaccountsetcode= ? ");
		strSQL.append(" or varaccountsetname= ? )");
		int result = this.querySingleInteger(strSQL.toString(), new String[]{code,uqaccountsetid,name});
		
		//int result = Integer.parseInt(query.getSingleResult().toString());
		if( result > 0 )
		{
			return true;//code存在
		}
		else
		{
			return false;
		}
	}
	
	/**
	 * 获取开启的科目套
	 * @return
	 * @throws Exception
	 */
	public EntityMap getStartAccountSetId() throws Exception 
	{
		String sql = " select s.uqaccountsetid as accountsetid from tgl_accountsets s where s.intflag=2 ";
		List<EntityMap> list = this.getMapList(sql);
		if (list.size()>0)
		{
			return list.get(0);
		} 
		else
		{
			return null;
		}
	}
}
