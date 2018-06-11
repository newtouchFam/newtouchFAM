package com.newtouch.nwfs.gl.vouchermanager.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;

@Repository
public class PeriodEndManagerDAO  extends CommonDAO
{
	/**
	 * 根据所选的会计期,想要查询的科目(损益-收入/损益-费用) 查询出当期的发生数
	 */
	public List<EntityMap> getAccountPeriod(ConditionMap map) throws Exception
	{
		String uqglobalperiodid = map.getString("uqglobalperiodid");
		String uqtypeid = map.getString("uqtypeid");
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT  ");
		sb.append(" tpa.mnydebitperiod - tpa.mnycreditperiod AS balance , ");
		sb.append(" ta.varaccountcode, ");
		sb.append(" ta.varaccountfullname, ");
		sb.append(" ta.uqaccountid ");
		sb.append(" FROM tgl_period_accounts tpa ");
		sb.append(" INNER JOIN tgl_accounts ta ON tpa.uqaccountid = ta.uqaccountid ");
		sb.append(" WHERE tpa.uqglobalperiodid = ? ");
		sb.append(" AND ta.intproperty = 5 ");
		sb.append(" AND ta.uqtypeid = ? ");
		List<EntityMap> maplist = this.getMapList(sb.toString(), new String[]{ uqglobalperiodid ,uqtypeid });
		return maplist;
	}
	
	/**
	 * 判断该科目之前在余额表是否有数据
	 * @param uqaccountid
	 * @return
	 */
	public boolean exitAccountInfo(String uqaccountid)
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT count(1) ");
		sb.append(" FROM tgl_period_accounts tpa");
		sb.append(" WHERE tpa.uqaccountid = ?");
		int result = this.querySingleInteger(sb.toString(), new String[]{uqaccountid});
		if( result > 0 )
		{
			return false;//存在
		}
		else
		{
			return true; //不存在 
		}
	}
	
	
	/**
	 * 添加科目的ID
	 * @param accountid
	 * @param id
	 * @throws Exception
	 */
	public void addRemberAccount(String accountid,String idflag) throws Exception
	{	
		//判断 表中是否已经存在 记忆科目的信息
		if(this.exitAccountID(idflag))
		{
			//存在 使用update
			StringBuilder sb = new StringBuilder();
			sb.append(" UPDATE tgl_tmp_idlist set bulkid = ? WHERE id = ? ");
			this.execute(sb.toString(), new String[]{ accountid ,idflag });
		}
		else
		{
			//不存在 使用insetrt 一般是第一次
			StringBuilder sb = new StringBuilder();
			sb.append(" INSERT INTO tgl_tmp_idlist(bulkid,typename,id) ");
			sb.append(" VALUES(?,'记录科目ID',?) ");
			this.execute(sb.toString(), new String[]{ accountid ,idflag });
		}
	}
	
	/**
	 *	判断是否存在 记录的ID
	 * @param uqaccountid
	 * @return true 存在 false 不存在
	 */
	public boolean exitAccountID(String uqaccountid)
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT count(1) ");
		sb.append(" FROM tgl_tmp_idlist t ");
		sb.append(" WHERE t.id = ? ");
		int result = this.querySingleInteger(sb.toString(), new String[]{uqaccountid});
		if( result > 0 )
		{
			return true;//存在
		}
		else
		{
			return false; //不存在 
		}
	}
	
	/**
	 * 获得记录的科目信息
	 * @throws Exception
	 */
	public EntityMap getRemeberAccount() throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT t.bulkid , t.id ,ta.varaccountcode ,ta.varaccountname  ");
		sb.append(" FROM tgl_tmp_idlist t ");
		sb.append(" INNER JOIN tgl_accounts ta ON t.bulkid = ta.UQACCOUNTID ");
		sb.append(" WHERE t.typename = '记录科目ID' ");
		List<EntityMap> maplist = this.getMapList(sb.toString());
		if(maplist.size()==0)
		{
			return null;
		}
		EntityMap map = new EntityMap();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			if("PROFITACCOUNT".equals(entity.get("id")))
			{
				map.put("accountid", entity.get("bulkid"));
				map.put("accountcode", entity.get("varaccountcode"));
				map.put("accountname", entity.get("varaccountname"));
			}
			else if("UNPROFITACCOUNT".equals(entity.get("id")))
			{
				map.put("unaccountid", entity.get("bulkid"));
				map.put("unaccountcode", entity.get("varaccountcode"));
				map.put("unaccountname", entity.get("varaccountname"));
			}
			
		}
		return map;
	}

}
