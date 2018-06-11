package com.newtouch.nwfs.gl.datamanger.dao;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.session.M8Session;

@Repository
public class InitPeriodDAO extends CommonDAO
{
	/*
	 * 根据条件查询数据 
	 */
	public PageData<EntityMap> getInitPeriodList(String uqcompanyid,
					String varaccountcode, String varaccountname, int start, int limit) throws Exception
	{
		M8Session m8session = new M8Session();
		//科目套id
		String uqaccountsetid = ObjectUtils.toString(m8session.getAttribute("ACCOUNTSETID"));
		
		StringBuilder sb = new StringBuilder();
		sb.append(" select ta.UQACCOUNTID as uqaccountid, ");
		sb.append(" ta.VARACCOUNTCODE as varaccountcode, ");
		sb.append(" ta.VARACCOUNTNAME as varaccountname, ");
		sb.append(" pa.uqcompanyid, ");
		sb.append(" sum(pa.mnydebitperiod) as mnydebitperiod, ");
		sb.append(" sum(pa.mnycreditperiod) as mnycreditperiod, ");
		sb.append(" ta.intislastlevel ");
		sb.append(" FROM tgl_accounts ta, tgl_account_group tag ");
		sb.append(" LEFT JOIN tgl_period_accounts pa ON pa.uqaccountid = tag.uqaccountid  ");
		sb.append(" and pa.uqglobalperiodid = '00000000-0000-0000-0000-000000000000' ");
		sb.append(" and pa.uqcompanyid = ? ");
		sb.append(" where ta.varaccountcode = tag.vargroupcode ");
		sb.append(" and ta.uqaccountsetid = ? ");
		
		ArrayList<Object> params = new ArrayList<Object>();
		params.add( uqcompanyid );
		params.add( uqaccountsetid );
		if(varaccountcode != null && !"".equals(varaccountcode))
		{
			sb.append(" and ta.VARACCOUNTCODE like ? ");
			params.add("%"+varaccountcode+"%");
		}
		if(varaccountname != null && !"".equals(varaccountname))
		{
			sb.append(" and ta.VARACCOUNTNAME like ? ");
			params.add("%"+varaccountname+"%");
		}
		sb.append(" group by ta.VARACCOUNTCODE order by ta.VARACCOUNTCODE ");
		return this.getMapPage(sb.toString(), params, start, limit);
		
	}
	
	/*
	 * 判断科目编码在科目表中是否存在且是末级 
	 */
	public String isExistAccountcode(String varaccountcode) throws Exception
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" select ta.uqaccountid from tgl_accounts ta  ");	
		strSQL.append(" where ta.varaccountcode = ? and ta.intislastlevel = 1 ");
		
		List<EntityMap> list = this.getMapList(strSQL.toString(), new String[]{varaccountcode});
		String uqaccountid = "";
		if(list.size()>0)
		{
			uqaccountid = list.get(0)==null ? "" : list.get(0).getString("uqaccountid").toString();
		}
		return uqaccountid;
	}
	
	/*
	 * 判断余额表中是否存在科目编码一样且会计期为全0
	 */
	public boolean isExistSame(String varaccountcode, String uqcompanyid) throws Exception
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" select  count(1) from tgl_accounts ta ");
		strSQL.append(" inner join tgl_period_accounts tp on ta.uqaccountid = tp.uqaccountid ");
		strSQL.append(" where tp.uqglobalperiodid = '00000000-0000-0000-0000-000000000000' ");
		strSQL.append(" and ta.varaccountcode = ? and tp.uqcompanyid = ? ");
		
		int num = this.querySingleInteger(strSQL.toString(),new Object[]{varaccountcode,uqcompanyid});
	    if(num >0)
	    {
	    	return true;
	    }
	    else
	    {
	    	return false;
	    }
	}
	
	/*
	 * 判断科目在余额表中是否存在且有发生数
	 */
	public boolean isHasSeveral(String varaccountcode, String uqcompanyid) throws Exception
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" select  count(1) from tgl_accounts ta ");
		strSQL.append(" inner join tgl_period_accounts tp on ta.uqaccountid = tp.uqaccountid ");
		strSQL.append(" where tp.uqglobalperiodid <> '00000000-0000-0000-0000-000000000000' ");
	    strSQL.append(" and ta.varaccountcode = ? and tp.uqcompanyid = ? ");
	    int num = this.querySingleInteger(strSQL.toString(),new Object[]{varaccountcode,uqcompanyid});
	    if(num >0)
	    {
	    	return true;
	    }
	    else
	    {
	    	return false;
	    }
	}
	
	/*
	 * 将数据插入余额表中
	 */
	public void insertInitPeriod(EntityMap entity, String uqcompanyid) throws Exception
	{
		String strsql = new String();
		strsql += " insert into tgl_period_accounts(uqcompanyid,uqaccountid,uqglobalperiodid,mnydebitperiodall,mnydebitperiod, ";
		strsql += " mnycreditperiodall,mnycreditperiod) values(?,?,'00000000-0000-0000-0000-000000000000', ";
		strsql += " ?,?,?,?) ";
		this.execute(strsql, new Object[]
				{
					uqcompanyid,
					entity.getString("uqaccountid"),
					entity.getDouble("mnydebitperiod"),
					entity.getDouble("mnydebitperiod"), 
					entity.getDouble("mnycreditperiod"),
					entity.getDouble("mnycreditperiod")
				});
	}
	/*
	 * 导出数据
	 */
	public List<Object[]> exportInitPeriod(String uqcompanyid, String varaccountcode, String varaccountname) throws Exception
	{
		M8Session m8session = new M8Session();
		//科目套id
		String uqaccountsetid = ObjectUtils.toString(m8session.getAttribute("ACCOUNTSETID"));
		
		StringBuilder sb = new StringBuilder();
		sb.append(" select ta.UQACCOUNTID as uqaccountid, ");
		sb.append(" ta.VARACCOUNTCODE as varaccountcode, ");
		sb.append(" ta.VARACCOUNTNAME as varaccountname, ");
		sb.append(" pa.uqcompanyid, ");
		sb.append(" sum(pa.mnydebitperiod) as mnydebitperiod, ");
		sb.append(" sum(pa.mnycreditperiod) as mnycreditperiod, ");
		sb.append(" ta.intislastlevel ");
		sb.append(" FROM tgl_accounts ta, tgl_account_group tag ");
		sb.append(" LEFT JOIN tgl_period_accounts pa ON pa.uqaccountid = tag.uqaccountid  ");
		sb.append(" and pa.uqglobalperiodid = '00000000-0000-0000-0000-000000000000' ");
		sb.append(" and pa.uqcompanyid = ? ");
		sb.append(" where ta.varaccountcode = tag.vargroupcode ");
		sb.append(" and ta.uqaccountsetid = ? ");
		
		ArrayList<Object> params = new ArrayList<Object>();
		params.add( uqcompanyid );
		params.add( uqaccountsetid );
		if(varaccountcode != null && !"".equals(varaccountcode))
		{
			sb.append(" and ta.VARACCOUNTCODE like ? ");
			params.add("%"+varaccountcode+"%");
		}
		if(varaccountname != null && !"".equals(varaccountname))
		{
			sb.append(" and ta.VARACCOUNTNAME like ? ");
			params.add("%"+varaccountname+"%");
		}
		sb.append(" group by ta.VARACCOUNTCODE order by ta.VARACCOUNTCODE ");
		
		ArrayList<Object[]> list = new ArrayList<Object[]>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), params);
		for(int i = 0; i<mapList.size();i++ ){
			list.add(new Object[]{
					mapList.get(i).getString("varaccountcode"),
					mapList.get(i).getString("varaccountname"),
					mapList.get(i).getString("mnydebitperiod"),
					mapList.get(i).getString("mnycreditperiod")
			});
		}
		return list;
		
	}

	/*
	 * 新增科目期初余额
	 */
	public void addInitPeriod(String uqcompanyid, String accountid, double mnydebitperiod, double mnycreditperiod) throws Exception
	{
		String strsql = new String();
		strsql += " insert into tgl_period_accounts(uqcompanyid,uqaccountid,uqglobalperiodid,mnydebitperiodall,mnydebitperiod, ";
		strsql += " mnycreditperiodall,mnycreditperiod) values(?,?,'00000000-0000-0000-0000-000000000000', ";
		strsql += " ?,?,?,?) ";
		this.execute(strsql, new Object[]{uqcompanyid,accountid,mnydebitperiod,mnydebitperiod,mnycreditperiod,mnycreditperiod});
	}

	/*
	 * 修改科目期初余额
	 */
	public void editInitPeriod(String uqcompanyid, String accountid, double mnydebitperiod, double mnycreditperiod) throws Exception
	{
		String sql = "";
		sql += " update tgl_period_accounts ta set ta.mnydebitperiodall = ? ,";
		sql += " ta.mnydebitperiod = ? , ta.mnycreditperiodall = ?, ";
		sql += " ta.mnycreditperiod = ? ";
		sql += " where ta.uqglobalperiodid = '00000000-0000-0000-0000-000000000000' ";
		sql += " and ta.uqcompanyid = ? ";
		sql += " and ta.uqaccountid = ? ";
		
		this.execute(sql, new Object[]{mnydebitperiod,mnydebitperiod,mnycreditperiod,mnycreditperiod,uqcompanyid,accountid});
	}

	/*
	 * 删除科目期初余额
	 */
	public void delInitPeriod(String uqcompanyid, String accountid) throws Exception
	{
		String sql = "";
		sql += " delete from tgl_period_accounts ";
		sql += " where uqglobalperiodid = '00000000-0000-0000-0000-000000000000' ";
		sql += " and uqcompanyid = ? ";
		sql += " and uqaccountid = ? ";
		this.execute(sql, new Object[]{uqcompanyid,accountid});
	}
}
