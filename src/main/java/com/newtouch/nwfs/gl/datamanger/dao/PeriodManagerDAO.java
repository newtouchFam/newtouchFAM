package com.newtouch.nwfs.gl.datamanger.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;

@Repository
public class PeriodManagerDAO extends CommonDAO {

	/*
	 * 新增会计期
	 */
	public void addGlobalPeriod(String varname, int intyear, int intmonth, Date dtbegin, Date dtend) throws Exception
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" insert into tgl_global_periods(uqglobalperiodid, ");
		strSQL.append(" intyear, intmonth, varname, intstatus, dtbegin, dtend, intyearmonth) ");
		strSQL.append(" values(?, ?, ?, ?, 1, ?, ?, ?) ");
		String teamid = UUID.randomUUID().toString().toUpperCase();
		String strYearmonth = "";
		//将会计期年月合并成字符串,如果会计期月份小于10，要在月份前加个0
		
		//将合并的会计期年月转换成int
		if(intmonth<10)
		{
			strYearmonth = String.valueOf(intyear) + "0" +String.valueOf(intmonth);
		}else
		{
			strYearmonth = String.valueOf(intyear) + String.valueOf(intmonth);
		}
//		int intYearmonth = Integer.parseInt(strYearmonth);
		this.execute(strSQL.toString(),new Object[]{teamid,intyear,intmonth,varname,dtbegin,dtend,strYearmonth});
	}

	/*
	 * 修改会计期
	 */
	public void editGlobalPeriod(String uqglobalperiodids,String varname, int intyear, int intmonth, Date dtbegin, Date dtend) throws Exception
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" update tgl_global_periods gp set ");
		strSQL.append(" gp.intyear = ?, gp.intmonth = ?, ");
		strSQL.append(" gp.varname = ?, gp.dtbegin =?, ");
		strSQL.append(" gp.dtend = ?, gp.intyearmonth = ? ");
		strSQL.append(" where gp.uqglobalperiodid = ? ");
		String strYearmonth = "";
		//将会计期年月合并成字符串,如果会计期月份小于10，要在月份前加个0
		if(intmonth<10)
		{
			strYearmonth = String.valueOf(intyear) + "0" +String.valueOf(intmonth);
		}else
		{
			strYearmonth = String.valueOf(intyear) + String.valueOf(intmonth);
		}
		//将合并的会计期年月转换成int
		int intYearmonth = Integer.parseInt(strYearmonth);
		this.execute(strSQL.toString(), new Object[]{intyear,intmonth,varname,dtbegin,
					dtend,intYearmonth,uqglobalperiodids});
	}

	/*
	 * 删除会计期
	 */
	public void delGlobalPeriod(String uqglobalperiodid) throws Exception
	{
		String strSQL = "";
		strSQL += " delete from tgl_global_periods where uqglobalperiodid = ? ";
		this.execute(strSQL, new Object[]{uqglobalperiodid});
		
	}
	/*
	 * 查询所有会计期数据
	 */
	public PageData<EntityMap> getGlobalPeriodList(int start, int limit) throws Exception
	{
		String strSQL = new String();
		strSQL += " select gp.uqglobalperiodid,gp.varname,gp.intstatus,gp.intyear,gp.intmonth, ";
		strSQL += " DATE_FORMAT(gp.dtbegin,'%Y-%m-%d') as dtbegin,DATE_FORMAT(gp.dtend,'%Y-%m-%d') as dtend,gp.intyearmonth ";
		strSQL += " from tgl_global_periods gp "; 
		strSQL += " where gp.uqglobalperiodid <> '00000000-0000-0000-0000-000000000000' ";
		strSQL += " order by gp.intyearmonth desc ";
		
		return this.getMapPage(strSQL, start, limit);
	}

	/*
	 * 开启或关闭会计期
	 */
	public void openOrCloseGlobalPeriod(String uqglobalperiodid,int status) throws Exception
	{
		String strSQL = new String();
		strSQL += " update tgl_global_periods gp set gp.intstatus = ? ";	
		strSQL += " where gp.uqglobalperiodid = ? ";
		
		this.execute(strSQL, new Object[]{status,uqglobalperiodid});
		
	}

	//判断新增或修改的会计期年月是否存在相同
	public boolean isExistSamePeriod(String uqglobalperiodid,int intyear, int intmonth) throws Exception
	{
		StringBuilder strSQL = new StringBuilder();
		//当为修改时且状态不为新增，将intyear和intmonth的值都定义为-1
		strSQL.append(" select count(1) from tgl_global_periods gp ");	
		strSQL.append(" where gp.intyear = ? and  gp.intmonth = ? ");
		strSQL.append(" and gp.uqglobalperiodid <> ? ");
		
		int num = this.querySingleInteger(strSQL.toString(),new Object[]{intyear,intmonth,uqglobalperiodid});
		if( num > 0 )
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	//判断新增或修改的会计期名称是否存在相同
	public boolean isExistSameName(String uqglobalperiodid,String varname)
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" select count(1) from tgl_global_periods gp ");	
		strSQL.append(" where gp.varname = ? and gp.uqglobalperiodid <> ?");
		int num = this.querySingleInteger(strSQL.toString(), new Object[]{varname,uqglobalperiodid});
		if( num > 0 )
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	/*
	 * 查询需要关闭的会计期是否有未记账的凭证
	 */
	public String voucherIntFlag(String uqglobalperiodid) throws Exception
	{
		
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" select distinct(gp.varname) as varname from tgl_voucher_mains tm ");	
		strSQL.append(" inner join tgl_global_periods gp on gp.uqglobalperiodid = tm.uqglobalperiodid ");
		strSQL.append("where tm.intflag<>2 and tm.intdeleteflag<>1");
		
		strSQL.append(" and tm.uqglobalperiodid = ?");
		List<EntityMap> list = this.getMapList(strSQL.toString(), new Object[]{uqglobalperiodid});
		
		strSQL.append(" and tm.uqglobalperiodid = :uqglobalperiodid");
		String globalperiodname = "";
		if(list.size()>0)
		{
			globalperiodname = list.get(0)==null ? "" : list.get(0).toString();
		}
		return globalperiodname;
	}

	public String getPeriod(int year,int month) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" select VARNAME from tgl_global_periods ");
		strSQL.append(" where INTYEAR= ? AND  INTMONTH= ? ");
		List<EntityMap> list = this.getMapList(strSQL.toString(), new Object[]{year,month});
		String period = "";
		if(list.size()>0)
		{
			period = list.get(0).getString("VARNAME");
		}
		return period;
	}

	public void importToPeriod(EntityMap entity) throws Exception {
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_global_periods ");
		sb.append(" (UQGLOBALPERIODID, INTYEAR, INTMONTH, VARNAME, INTSTATUS, INTPROPERTY, DTBEGIN, DTEND, INTYEARMONTH) ");
		sb.append(" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		
		this.execute(sb.toString(), new Object[]
			{
			entity.get("periodid"),
			entity.get("year"),
			entity.get("month"),
			entity.get("name"),
			entity.get("status"),
			entity.get("property"),
			entity.get("dtbegin"),
			entity.get("dtend"),
			entity.get("yearmonth")
			}
		);
	}

	public List<String> getPeriodCountByParameter(int nType, String param) throws Exception {
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_global_periods tgp ");
		
		if(0 == nType)
		{
			sb.append(" WHERE tgp.VARNAME = ? ");
		}
		else
		{
			sb.append(" WHERE tgp.INTYEARMONTH = ? ");
		}
		
		List<String> resultList = new ArrayList<String>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{param});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList;
	}
}
