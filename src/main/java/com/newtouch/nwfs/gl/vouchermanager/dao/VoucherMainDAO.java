package com.newtouch.nwfs.gl.vouchermanager.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherMain;

@Repository
public class VoucherMainDAO extends CommonDAO
{
	public void saveVoucherMain(VoucherMain main)
	{
		String strSql = "select IFNULL(MAX(nm.intvouchernum),-999999) + 1 ";
		strSql += " from tgl_voucher_mains nm ";
		strSql += " where nm.uqcompanyid = ? AND nm.intvouchernum < 0 ";
		strSql += " and nm.uqglobalperiodid = ? ";
		strSql += " and nm.uqnumbering = ? ";
		
		int intvouchernum = this.querySingleInteger(strSql,
				new Object[]{main.getUqcompanyid(),main.getUqglobalperiodid(),main.getUqnumbering()});
		
		strSql = " ";
		strSql += " insert into tgl_voucher_mains(uqvoucherid,intvouchernum,uqnumbering,uqcompanyid,";
		strSql += " intaffix,uqglobalperiodid,mnydebitsum,";
		strSql += " mnycreditsum,uqaccountantid,uqcasherid,";
		strSql += " uqcheckerid,uqfillerid,dtaccountant,dtcasher,";
		strSql += " dtchecker,dtfiller,dtaccountantsrv,dtcashersrv,";
		strSql += " dtcheckersrv,dtfillersrv,intdeleteflag)";
		strSql += " values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,";
		strSql += " DATE_FORMAT(?,'%Y-%m-%d'),DATE_FORMAT(?,'%Y-%m-%d'),";
		strSql += " DATE_FORMAT(?,'%Y-%m-%d'),DATE_FORMAT(?,'%Y-%m-%d'),";
		strSql += " DATE_FORMAT(?,'%Y-%m-%d %H:%i:%S'),DATE_FORMAT(?,'%Y-%m-%d %H:%i:%S'),";
		strSql += " DATE_FORMAT(?,'%Y-%m-%d %H:%i:%S'),DATE_FORMAT(?,'%Y-%m-%d %H:%i:%S'),0)";
		
		List<Object> paras = new ArrayList<Object>();
		paras.add(main.getUqvoucherid());
		paras.add(intvouchernum);
		paras.add(main.getUqnumbering());
	    paras.add(main.getUqcompanyid());
	    paras.add(main.getIntaffix());
	    paras.add(main.getUqglobalperiodid());
	    paras.add(main.getMnydebitsum());
		paras.add(main.getMnycreditsum());
	    paras.add(main.getUqaccountantid());
	    paras.add(main.getUqcasherid());
	    paras.add(main.getUqcheckerid());
	    paras.add(main.getUqfillerid());
	    paras.add(main.getDtfiller() == null|| main.getDtfiller().equals("")? "2999-09-09" : main.getDtfiller());
	    paras.add(main.getDtfiller() == null|| main.getDtfiller().equals("")? "2999-09-09" : main.getDtfiller());
	    paras.add(main.getDtfiller() == null|| main.getDtfiller().equals("")? "2999-09-09" : main.getDtfiller());
	    paras.add(main.getDtfiller() == null|| main.getDtfiller().equals("")? "2999-09-09" : main.getDtfiller());
		paras.add(main.getDtfillersrv() == null|| main.getDtfillersrv().equals("")? "2999-09-09 00:00:00" : main.getDtfillersrv());
	    paras.add(main.getDtfillersrv() == null|| main.getDtfillersrv().equals("")? "2999-09-09 00:00:00" : main.getDtfillersrv());
	    paras.add(main.getDtfillersrv() == null || main.getDtfillersrv().equals("")? "2999-09-09 00:00:00" : main.getDtfillersrv());
	    paras.add(main.getDtfillersrv() == null || main.getDtfillersrv().equals("")? "2999-09-09 00:00:00" : main.getDtfillersrv());
	    
	    this.execute(strSql, paras);
	}
	
	/**
	 * 更新流水号
	 * @param uqvoucherid
	 * @param uqcompanyid
	 * @param uqglobalperiodid
	 */
	public synchronized void updateVoucherCompanySeq(String uqvoucherid, String uqcompanyid, String uqglobalperiodid)
	{
		String strSql = "select IFNULL(MAX(nm.INTCOMPANYSEQ),0) + 1 ";
		strSql += " from tgl_voucher_mains nm ";
		strSql += " where nm.uqcompanyid = ? ";
		strSql += " and nm.uqglobalperiodid = ?";
		int vouchercomseq = this.querySingleInteger(strSql, 
				new Object[]{uqcompanyid,uqglobalperiodid});
		
		strSql = "update tgl_voucher_mains m set m.intcompanyseq = ? where m.uqvoucherid=?";
		this.execute(strSql, new Object[]{vouchercomseq,uqvoucherid});
	}
	
	/**
	 * 更新凭证编号
	 * @param uqvoucherid
	 * @param uqcompanyid
	 * @param uqglobalperiodid
	 */
	public synchronized void updateVouchernum(String uqvoucherid, String uqcompanyid, String uqglobalperiodid, String uqnumbering)
	{
		String strSql = "select IFNULL(MAX(nm.intvouchernum),0) + 1 ";
		strSql += " from tgl_voucher_mains nm ";
		strSql += " where nm.uqcompanyid = ? AND nm.intvouchernum > 0";
		strSql += " and nm.uqglobalperiodid = ? ";
		strSql += " and nm.uqnumbering = ? ";
		
		int intvouchernum = this.querySingleInteger(strSql, 
				new Object[]{uqcompanyid,uqglobalperiodid,uqnumbering});
		
		strSql = "update tgl_voucher_mains m set m.intvouchernum = ? where m.uqvoucherid=? ";
		this.execute(strSql, new Object[]{intvouchernum,uqvoucherid});
	}
	
	/**
	 * 更新凭证编号
	 * @param uqvoucherid
	 * @param uqcompanyid
	 * @param uqglobalperiodid
	 */
	public synchronized void updateSaveVouchernum(String uqvoucherid, String uqcompanyid, String uqglobalperiodid, String uqnumbering)
	{
		String strSql = "select IFNULL(MAX(nm.intvouchernum),-999999) + 1 ";
		strSql += " from tgl_voucher_mains nm ";
		strSql += " where nm.uqcompanyid = ? AND nm.intvouchernum < 0";
		strSql += " and nm.uqglobalperiodid = ?";
		strSql += " and nm.uqnumbering = ? ";
		
		int intvouchernum = this.querySingleInteger(strSql,
				new Object[]{uqcompanyid,uqglobalperiodid,uqnumbering});
		
		strSql = "update tgl_voucher_mains m set m.intvouchernum = ? where m.uqvoucherid=?";
		this.execute(strSql, new Object[]{intvouchernum,uqvoucherid});
	}

	/**
	 * intflag 0-保存凭证，1-审核，2-记账
	 * intcashflag 0-不出纳，1-要出纳，2-已出纳
	 * tag 0-保存凭证，1-审核，2-出纳，3-记账 4-反审核 5-反出纳
	 * cashflag 0-不要出纳，1-要出纳
	 */
	public void updateVoucherState(String tag, String cashtag, String voucherid, String userid,
			String dtdate, String dtdatesrv) 
	{
		List<Object> paras = new ArrayList<Object>();
		String strSql = " ";
		strSql += " update tgl_voucher_mains set ";
		if("0".equals(tag))
		{
			strSql += " uqfillerid = ?, dtfiller = DATE_FORMAT(?,'%Y-%m-%d'), intflag=0 ";
			
			if("1".equals(cashtag))
			{
				strSql += ", intcashflag = 1 ";
			}
			else
			{
				strSql += ", intcashflag = 0 ";
			}
			
			strSql += " where uqvoucherid = ?";
			paras.add(userid);
			paras.add(dtdate);
			paras.add(voucherid);
		}
		else if("1".equals(tag))
		{
			strSql += " uqcheckerid = ?, dtchecker = DATE_FORMAT(?,'%Y-%m-%d'), dtcheckersrv = DATE_FORMAT(?,'%Y-%m-%d %H:%i:%S'), intflag=1 ";
			strSql += " where uqvoucherid = ?";
			paras.add(userid);
			paras.add(dtdate);
			paras.add(dtdatesrv);
			paras.add(voucherid);
		}
		else if("2".equals(tag))
		{
			strSql += " uqcasherid = ?, dtcasher = DATE_FORMAT(?,'%Y-%m-%d'), dtcashersrv = DATE_FORMAT(?,'%Y-%m-%d %H:%i:%S'), intflag=1 ";
			if("1".equals(cashtag))
			{
				strSql += ", intcashflag = 2 ";
			}
			strSql += " where uqvoucherid = ?";
			paras.add(userid);
			paras.add(dtdate);
			paras.add(dtdatesrv);
			paras.add(voucherid);
		}
		else if("3".equals(tag))
		{
			
			strSql += " uqaccountantid = ?, dtaccountant = DATE_FORMAT(?,'%Y-%m-%d'), dtaccountantsrv = DATE_FORMAT(?,'%Y-%m-%d %H:%i:%S'), intflag=2 ";
			strSql += " where uqvoucherid = ?";
			paras.add(userid);
			paras.add(dtdate);
			paras.add(dtdatesrv);
			paras.add(voucherid);
		}
		else if("4".equals(tag))
		{
			
			strSql += " uqcheckerid = ?, dtchecker = DATE_FORMAT(?,'%Y-%m-%d'), dtcheckersrv = DATE_FORMAT(?,'%Y-%m-%d %H:%i:%S'), intflag=0 ";
			strSql += " where uqvoucherid = ?";
			paras.add("");
			paras.add(dtdate);
			paras.add(dtdatesrv);
			paras.add(voucherid);
		}
		else if("5".equals(tag))
		{
			
			strSql += " uqcasherid = ?, dtcasher = DATE_FORMAT(?,'%Y-%m-%d'), dtcashersrv = DATE_FORMAT(?,'%Y-%m-%d %H:%i:%S'), intflag=1 ";
			if("1".equals(cashtag))
			{
				strSql += ", intcashflag = 1 ";
			}
			strSql += " where uqvoucherid = ?";
			paras.add("");
			paras.add(dtdate);
			paras.add(dtdatesrv);
			paras.add(voucherid);
		}
		
		this.execute(strSql, paras);
	}

	/*
	 * 获取主表中相关信息
	 */
	public List<VoucherMain> getVoucherMainInfo(String uqvoucherid)
	{
		try
		{
			String strSql = "";
			strSql += " select gl.uqvoucherid,gl.intvouchernum,gl.uqnumbering,";
			strSql += "	vn.VARNAME as uqnumberingname,gl.uqcompanyid,gl.intcompanyseq,";
			strSql += "	gl.intaffix,gl.uqglobalperiodid,gp.VARNAME as periodname,";
			strSql += "	gp.INTYEARMONTH as intyearmonth,gp.DTBEGIN as dtbegin,gp.dtend as dtend,";
			strSql += "	gl.mnydebitsum,gl.mnycreditsum,'' as uqfinacialmanagerid,";
			strSql += "	gl.uqaccountantid,gl.uqcasherid,gl.uqcheckerid,";
			strSql += "	gl.uqfillerid,acuser.DISPLAYNAME as uqaccountantname,cashub.DISPLAYNAME as uqcashername,";
			strSql += "	chkub.DISPLAYNAME as uqcheckername,fillub.DISPLAYNAME as uqfillername,gl.dtaccountant,";
			strSql += "	gl.dtcasher,gl.dtchecker,gl.dtfiller,";
			strSql += "	gl.dtaccountantsrv,gl.dtcashersrv,gl.dtcheckersrv,";
			strSql += "	gl.dtfillersrv,gl.dtfiller as dtdate,'' as dtdatesrv,";
			strSql += "	gl.intflag,gl.intcashflag,ifnull(gl.intdeleteflag,'') as intdeleteflag,";
			strSql += "	ifnull(gl.uqcancelid,'') as uqcancelid";
			strSql += " from tgl_voucher_mains gl ";
			strSql += " inner join tgl_voucher_numberings vn on vn.UQNUMBERINGID = gl.UQNUMBERING ";
			strSql += " inner join tgl_global_periods gp on gp.UQGLOBALPERIODID=gl.UQGLOBALPERIODID";
			strSql += " left join tsys_userbase fillub on fillub.id = gl.UQFILLERID";
			strSql += " left join tsys_userbase chkub on chkub.id = gl.UQCHECKERID";
			strSql += " left join tsys_userbase cashub on cashub.id = gl.UQCASHERID ";
			strSql += " left join tsys_userbase acuser on acuser.id = gl.UQACCOUNTANTID";
			strSql += " where gl.uqvoucherid = ? ";
			List<VoucherMain> list = this.getEntityList(strSql, new Object[]{uqvoucherid}, VoucherMain.class);
			return list;
		}
		catch(Exception ex)
		{
			throw new RuntimeException(ex.getMessage());
		}
	}
	
	public Object[] getPeriodInfo(int intyearmonth)
	{
		String strSql = "select gp.uqglobalperiodid,gp.varname,gp.intyearmonth,date_format(str_to_date(gp.dtbegin, '%Y-%m-%d'), '%Y-%m-%d') dtbegin,date_format(str_to_date(gp.dtend, '%Y-%m-%d'), '%Y-%m-%d') dtend ";
		strSql += "  from tgl_global_periods gp";
		strSql += "  where gp.intyearmonth=? and gp.intstatus=2";
		
		List<EntityMap> maplist =  this.getMapList(strSql, new Object[]{intyearmonth});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqglobalperiodid"),
					entity.get("varname"),
					entity.get("intyearmonth"),
					entity.get("dtbegin"),
					entity.get("dtend")
				});
		}
		if(list.size() > 0)
		{
			return list.get(0);
		}
		else
		{
			return null;
		}
	}
	
	public Object[] getPeriodInfoByID(String periodid)
	{
		String strSql = "select gp.uqglobalperiodid,gp.varname,gp.intyearmonth,date_format(str_to_date(gp.dtbegin, '%Y-%m-%d'), '%Y-%m-%d') dtbegin,date_format(str_to_date(gp.dtend, '%Y-%m-%d'), '%Y-%m-%d') dtend ";
		strSql += "  from tgl_global_periods gp";
		strSql += "  where gp.uqglobalperiodid=?";
		
		List<EntityMap> maplist =  this.getMapList(strSql, new Object[]{periodid});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqglobalperiodid"),
					entity.get("varname"),
					entity.get("intyearmonth"),
					entity.get("dtbegin"),
					entity.get("dtend")
				});
		}
		if(list.size() > 0)
		{
			return list.get(0);
		}
		else
		{
			return null;
		}
	}
	
	public boolean getPeriodInfo(String periodid)
	{
		String strSql = "select count(1) ";
		strSql += "  from tgl_global_periods gp";
		strSql += "  where gp.uqglobalperiodid= ? and gp.intstatus=2";
		
		int periodnum = this.querySingleInteger(strSql, new Object[]{periodid});
		
		if(periodnum > 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	public PageData<EntityMap> getVoucherMakeInfo(int start, int limit)
	{
		//根据条件拼接sql
		String strSql = "select ";
		strSql += " m.UQVOUCHERID as voucherid,";
		strSql += " n.VARNAME as uqnumbering,";
		strSql += " m.INTCOMPANYSEQ as intcompanyseq,";
		strSql += " m.INTVOUCHERNUM as intvouchernum,";
		strSql += " m.DTFILLER as dtfiller,";
		strSql += " m.MNYDEBITSUM as mnydebitsum,";
		strSql += " m.intaffix as linenumber";
		strSql += " from ";
		strSql += " tgl_voucher_mains m ";
		strSql += " INNER JOIN tgl_voucher_numberings n on n.UQNUMBERINGID=m.UQNUMBERING ";
		strSql += " inner join tsys_userbase ub on ub.id = m.UQFILLERID";
		strSql += " where 1=1";
		
		strSql += " and m.intflag = 0 ";
		
		List<Object> paras = new ArrayList<Object>();
		
		M8Session session = new M8Session();
		strSql += " and m.UQCOMPANYID = ?";
		paras.add(session.getCompanyID());
		
		strSql += " and m.UQFILLERID = ?";
		paras.add(session.getUserID());
		
		strSql += " and m.intdeleteflag=0 order by m.intcompanyseq";
		
		return this.getMapPage(strSql, paras, start, limit);
	}
	
	public PageData<EntityMap> getVoucherQueryInfo(ConditionMap cdtMap, int start, int limit)
	{
		//解析条件
		String status = cdtMap.getString("intstatus");
		String numberid = cdtMap.getString("numberid");
		String dtfilldatefrom = cdtMap.getString("dtfilldatefrom");
		String dtfilldateto = cdtMap.getString("dtfilldateto");
		String fromperiodid = cdtMap.getString("fromperiodid");
		String toperiodid = cdtMap.getString("toperiodid");
		String compseq = cdtMap.getString("compseq");
		String vouchernum = cdtMap.getString("vouchernum");
		
		//根据条件拼接sql
		String strSql = "select ";
		strSql += " m.UQVOUCHERID as voucherid,";
		strSql += " n.VARNAME as uqnumbering,";
		strSql += " m.INTCOMPANYSEQ as intcompanyseq,";
		strSql += " m.INTVOUCHERNUM as intvouchernum,";
		strSql += " m.DTFILLER as dtfiller,";
		strSql += " m.MNYDEBITSUM as mnydebitsum,";
		strSql += " m.intaffix as linenumber,";
		strSql += " ub.DISPLAYNAME as uqfillerid";
		
		if("1001".equals(status))
		{
			
			strSql += ", '' as dtchecker,";
			strSql += " IFNULL(chuser.DISPLAYNAME,'') as uqcheckerid,";
			strSql += " '' as dtcasher,";
			strSql += " IFNULL(causer.DISPLAYNAME,'') as uqcasherid,";
			strSql += " '' as dtaccountant,";
			strSql += " IFNULL(acuser.DISPLAYNAME,'') as uqaccountantid,";
			strSql += " '待审核' as intstatus";
		}
		else if("1002".equals(status))
		{
			strSql += ", CONCAT(m.DTCHECKER,'') dtchecker,";
			strSql += " IFNULL(chuser.DISPLAYNAME,'') as uqcheckerid,";
			strSql += " '' as dtcasher,";
			strSql += " IFNULL(causer.DISPLAYNAME,'') as uqcasherid,";
			strSql += " '' as dtaccountant,";
			strSql += " IFNULL(acuser.DISPLAYNAME,'') as uqaccountantid,";
			strSql += " '待出纳' as intstatus";
		}
		else if("1003".equals(status))
		{
			strSql += ", CONCAT(m.DTCHECKER,'') dtchecker,";
			strSql += " IFNULL(chuser.DISPLAYNAME,'') as uqcheckerid,";
			strSql += " case when (m.INTCASHFLAG=2) then CONCAT(m.DTCASHER,'') else '' end as dtcasher,";
			strSql += " IFNULL(causer.DISPLAYNAME,'') as uqcasherid,";
			strSql += " '' as dtaccountant,";
			strSql += " IFNULL(acuser.DISPLAYNAME,'') as uqaccountantid,";
			strSql += " '待记账' as intstatus";
		}
		else if("1006".equals(status))
		{
			strSql += ", CONCAT(m.DTCHECKER,'') dtchecker,";
			strSql += " IFNULL(chuser.DISPLAYNAME,'') as uqcheckerid,";
			strSql += " case when (m.INTCASHFLAG=2) then CONCAT(m.DTCASHER,'') else '' end as dtcasher,";
			strSql += " IFNULL(causer.DISPLAYNAME,'') as uqcasherid,";
			strSql += " CONCAT(m.DTACCOUNTANT,'') dtaccountant,";
			strSql += " IFNULL(acuser.DISPLAYNAME,'') as uqaccountantid,";
			strSql += " '已记账' as intstatus";
		}
		else if("1000".equals(status))
		{
		// 审核日期
		strSql += ",case when (m.INTFLAG!=0) THEN CONCAT(m.DTCHECKER,'') ELSE '' END as dtchecker,";
		// 审核人 
		strSql += " IFNULL(chuser.DISPLAYNAME,'') as uqcheckerid,";
		//出纳日期
		strSql += " case when (m.INTCASHFLAG=2) then CONCAT(m.DTCASHER,'') else '' end as dtcasher,";
		//出纳人
		strSql += " IFNULL(causer.DISPLAYNAME,'') as uqcasherid,";
		//记账日期
		strSql += " case when (m.INTFLAG=2) then CONCAT(m.DTACCOUNTANT, '') else '' end as dtaccountant,";
		//记账人
		strSql += " IFNULL(acuser.DISPLAYNAME,'') as uqaccountantid,";
		// 状态
		strSql += " case when (m.INTFLAG=0) THEN '待审核'";
		strSql += " when (m.INTFLAG=1 and m.INTCASHFLAG=1 ) THEN '待出纳'";
		strSql += " when (m.INTFLAG=1 and m.INTCASHFLAG in(0,2)) THEN '待记账'";
		strSql += " when (m.INTFLAG=2) THEN '已记账'";
		strSql += " END as intstatus";
		}
		
		strSql += " from ";
		strSql += " tgl_voucher_mains m ";
		strSql += " INNER JOIN tgl_voucher_numberings n on n.UQNUMBERINGID=m.UQNUMBERING ";
		strSql += " inner join tsys_userbase ub on ub.id = m.UQFILLERID";
		
		if(!StringUtil.isNullString(fromperiodid) || !StringUtil.isNullString(toperiodid))
		{
			strSql += " inner join tgl_global_periods gp on gp.UQGLOBALPERIODID=m.UQGLOBALPERIODID ";
		}
		
		strSql += " left join tsys_userbase chuser on chuser.id = m.UQCHECKERID";
		strSql += " left join tsys_userbase causer on causer.id = m.UQCASHERID";
		strSql += " left join tsys_userbase acuser on acuser.id = m.UQACCOUNTANTID";
		strSql += " where 1=1";
		
		// 1000表示全部
		if("1001".equals(status))
		{
			strSql += " and m.intflag = 0";
		}
		else if("1002".equals(status))
		{
			strSql += " and m.intflag = 1 and m.intcashflag = 1";
		}
		else if("1003".equals(status))
		{
			strSql += " and m.intflag = 1 and m.intcashflag in (0,2)";
		}
		else if("1006".equals(status))
		{
			strSql += " and m.intflag = 2";
		}
		
		List<Object> paras = new ArrayList<Object>();
		
		M8Session session = new M8Session();
		strSql += " and m.UQCOMPANYID = ?";
		paras.add(session.getCompanyID());
		
		if(!StringUtil.isNullString(numberid) && !"00000000-0000-0000-0000-000000000000".equals(numberid))
		{
			strSql += " and m.uqnumbering = ? ";
			paras.add(cdtMap.getString("numberid"));
		}
		
		if(!StringUtil.isNullString(dtfilldatefrom) && !StringUtil.isNullString(dtfilldateto))
		{
			strSql += " and m.dtfiller >= ? and m.dtfiller <= ? ";
			paras.add(cdtMap.getString("dtfilldatefrom"));
			paras.add(cdtMap.getString("dtfilldateto"));
		}
		
		if(!StringUtil.isNullString(fromperiodid))
		{
			strSql += " and gp.INTYEARMONTH>=? ";
			paras.add(cdtMap.getString("fromperiodid"));
		}
		
		if(!StringUtil.isNullString(toperiodid))
		{
			strSql += " and gp.INTYEARMONTH<=? ";
			paras.add(cdtMap.getString("toperiodid"));
		}
		
		if(!StringUtil.isNullString(compseq))
		{
			strSql += " and m.intcompanyseq = ? ";
			paras.add(cdtMap.getString("compseq"));
		}
		
		if(!StringUtil.isNullString(vouchernum))
		{
			strSql += " and m.intvouchernum = ? ";
			paras.add(cdtMap.getString("vouchernum"));
		}
		
		strSql += " and m.intdeleteflag=0 order by m.dtfiller desc,m.intcompanyseq";
		
		return this.getMapPage(strSql, paras, start, limit);
	}

	public PageData<EntityMap> getVoucherCheckInfo(ConditionMap cdtMap, int start, int limit)
	{
		String status = cdtMap.getString("intstatus");
		String strSql = "select ";
		strSql += " m.UQVOUCHERID as voucherid,";
		strSql += " n.VARNAME as uqnumbering,";
		strSql += " m.INTCOMPANYSEQ as intcompanyseq,";
		strSql += " m.INTVOUCHERNUM as intvouchernum,";
		strSql += " m.DTFILLER as dtfiller,";
		strSql += " m.MNYDEBITSUM as mnydebitsum,";
		strSql += " m.intaffix as linenumber,";
		strSql += " ub.DISPLAYNAME as uqfillerid";
		if("1004".equals(status))
		{
			strSql += ", CONCAT(m.DTCHECKER,'') dtchecker,";
			strSql += " IFNULL(chuser.DISPLAYNAME,'') as uqcheckerid,";
			strSql += " '' as dtcasher,";
			strSql += " IFNULL(causer.DISPLAYNAME,'') as uqcasherid,";
			strSql += " '' as dtaccountant,";
			strSql += " IFNULL(acuser.DISPLAYNAME,'') as uqaccountantid,";
			strSql += " '已审核' as intstatus";
		}
		//全部
		else if("1000".equals(status))
		{
			strSql += ",case when (m.INTFLAG!=0) THEN CONCAT(m.DTCHECKER,'') ELSE '' END as dtchecker,";
			strSql += " IFNULL(chuser.DISPLAYNAME,'') as uqcheckerid,";
			strSql += " case when (m.INTFLAG=0) THEN '待审核'";
			strSql += " else '已审核' end as intstatus";
		}
		else if("1001".equals(status))
		{
			strSql += ", '' as dtchecker,";
			strSql += " IFNULL(chuser.DISPLAYNAME,'') as uqcheckerid,";
			strSql += " '' as dtcasher,";
			strSql += " IFNULL(causer.DISPLAYNAME,'') as uqcasherid,";
			strSql += " '' as dtaccountant,";
			strSql += " IFNULL(acuser.DISPLAYNAME,'') as uqaccountantid,";
			strSql += " '待审核' as intstatus";
		}
		strSql += " from ";
		strSql += " tgl_voucher_mains m ";
		strSql += " INNER JOIN tgl_voucher_numberings n on n.UQNUMBERINGID=m.UQNUMBERING ";
		strSql += " inner join tsys_userbase ub on ub.id = m.UQFILLERID";
		strSql += " left join tsys_userbase chuser on chuser.id = m.UQCHECKERID";
		strSql += " left join tsys_userbase causer on causer.id = m.UQCASHERID";
		strSql += " left join tsys_userbase acuser on acuser.id = m.UQACCOUNTANTID";
		strSql += " where 1=1"; 
		if("1004".equals(status))
		{
			//已经审核
			strSql += " and m.intflag = 1 and m.intcashflag in(0,1)";
		}
		else if("1001".equals(status))
		{
			// 未审核
			strSql += " and m.intflag = 0";
		}
		
		String numberid = cdtMap.getString("numberid");
		String dtfilldatefrom = cdtMap.getString("dtfilldatefrom");
		String dtfilldateto = cdtMap.getString("dtfilldateto");
		String periodid = cdtMap.getString("periodid");
		String compseq = cdtMap.getString("compseq");
		String vouchernum = cdtMap.getString("vouchernum");
		
		List<Object> paras = new ArrayList<Object>();
		
		M8Session session = new M8Session();
		strSql += " and m.UQCOMPANYID = ?";
		paras.add(session.getCompanyID());
		
		if(!StringUtil.isNullString(numberid) && !"00000000-0000-0000-0000-000000000000".equals(numberid))
		{
			strSql += " and m.uqnumbering = ? ";
			paras.add(cdtMap.getString("numberid"));
		}
		
		if(!StringUtil.isNullString(dtfilldatefrom) && !StringUtil.isNullString(dtfilldateto))
		{
			strSql += " and m.dtfiller >= ? and m.dtfiller <= ? ";
			paras.add(cdtMap.getString("dtfilldatefrom"));
			paras.add(cdtMap.getString("dtfilldateto"));
		}
		
		if(!StringUtil.isNullString(periodid))
		{
			strSql += " and m.uqglobalperiodid = ? ";
			paras.add(cdtMap.getString("periodid"));
		}
		
		if(!StringUtil.isNullString(compseq))
		{
			strSql += " and m.intcompanyseq = ? ";
			paras.add(cdtMap.getString("compseq"));
		}
		
		if(!StringUtil.isNullString(vouchernum))
		{
			strSql += " and m.intvouchernum = ? ";
			paras.add(cdtMap.getString("vouchernum"));
		}
		
		strSql += " and m.intdeleteflag=0 order by m.intcompanyseq";
		
		return this.getMapPage(strSql, paras, start, limit);
	}
	
	public PageData<EntityMap> getVoucherCashInfo(ConditionMap cdtMap, int start, int limit)
	{
		String status = cdtMap.getString("intstatus");
		String strSql = "select ";
		strSql += " m.UQVOUCHERID as voucherid,";
		strSql += " n.VARNAME as uqnumbering,";
		strSql += " m.INTCOMPANYSEQ as intcompanyseq,";
		strSql += " m.INTVOUCHERNUM as intvouchernum,";
		strSql += " m.DTFILLER as dtfiller,";
		strSql += " m.MNYDEBITSUM as mnydebitsum,";
		strSql += " m.intaffix as linenumber,";
		strSql += " ub.DISPLAYNAME as uqfillerid,";
		strSql += " CONCAT(m.DTCHECKER,'') dtchecker,";
		strSql += " IFNULL(chuser.DISPLAYNAME,'') as uqcheckerid,";
		
		if("1005".equals(status))
		{
			strSql += " CONCAT(m.DTCASHER,'') dtcasher,";
			strSql += " IFNULL(causer.DISPLAYNAME,'') as uqcasherid,";
			strSql += " '' as dtaccountant,";
			strSql += " IFNULL(acuser.DISPLAYNAME,'') as uqaccountantid,";
			strSql += " '已出纳' as intstatus";
		}
		else
		{
			strSql += " '' as dtcasher,";
			strSql += " IFNULL(causer.DISPLAYNAME,'') as uqcasherid,";
			strSql += " '' as dtaccountant,";
			strSql += " IFNULL(acuser.DISPLAYNAME,'') as uqaccountantid,";
			strSql += " '待出纳' as intstatus";
		}
		strSql += " from ";
		strSql += " tgl_voucher_mains m ";
		strSql += " INNER JOIN tgl_voucher_numberings n on n.UQNUMBERINGID=m.UQNUMBERING ";
		strSql += " inner join tsys_userbase ub on ub.id = m.UQFILLERID";
		strSql += " left join tsys_userbase chuser on chuser.id = m.UQCHECKERID";
		strSql += " left join tsys_userbase causer on causer.id = m.UQCASHERID";
		strSql += " left join tsys_userbase acuser on acuser.id = m.UQACCOUNTANTID";
		
		if("1005".equals(status))
		{
			//已经出纳
			strSql += " where m.intflag = 1 and m.intcashflag = 2";
		}
		else
		{
			strSql += " where m.intflag = 1 and m.intcashflag = 1";
		}
		
		String numberid = cdtMap.getString("numberid");
		String dtfilldatefrom = cdtMap.getString("dtfilldatefrom");
		String dtfilldateto = cdtMap.getString("dtfilldateto");
		String periodid = cdtMap.getString("periodid");
		String compseq = cdtMap.getString("compseq");
		String vouchernum = cdtMap.getString("vouchernum");
		
		List<Object> paras = new ArrayList<Object>();
		
		M8Session session = new M8Session();
		strSql += " and m.UQCOMPANYID = ?";
		paras.add(session.getCompanyID());
		
		if(!StringUtil.isNullString(numberid) && !"00000000-0000-0000-0000-000000000000".equals(numberid))
		{
			strSql += " and m.uqnumbering = ? ";
			paras.add(cdtMap.getString("numberid"));
		}
		
		if(!StringUtil.isNullString(dtfilldatefrom) && !StringUtil.isNullString(dtfilldateto))
		{
			strSql += " and m.dtfiller >= ? and m.dtfiller <= ? ";
			paras.add(cdtMap.getString("dtfilldatefrom"));
			paras.add(cdtMap.getString("dtfilldateto"));
		}
		
		if(!StringUtil.isNullString(periodid))
		{
			strSql += " and m.uqglobalperiodid = ? ";
			paras.add(cdtMap.getString("periodid"));
		}
		
		if(!StringUtil.isNullString(compseq))
		{
			strSql += " and m.intcompanyseq = ? ";
			paras.add(cdtMap.getString("compseq"));
		}
		
		if(!StringUtil.isNullString(vouchernum))
		{
			strSql += " and m.intvouchernum = ? ";
			paras.add(cdtMap.getString("vouchernum"));
		}
		
		strSql += " and m.intdeleteflag=0 order by m.intcompanyseq";
		
		return this.getMapPage(strSql, paras, start, limit);
	}
	
	public PageData<EntityMap> getVoucherEndInfo(ConditionMap cdtMap, int start, int limit)
	{
		String strSql = "select ";
		strSql += " m.UQVOUCHERID as voucherid,";
		strSql += " n.VARNAME as uqnumbering,";
		strSql += " m.INTCOMPANYSEQ as intcompanyseq,";
		strSql += " m.INTVOUCHERNUM as intvouchernum,";
		strSql += " m.DTFILLER as dtfiller,";
		strSql += " m.MNYDEBITSUM as mnydebitsum,";
		strSql += " m.intaffix as linenumber,";
		strSql += " ub.DISPLAYNAME as uqfillerid,";
		strSql += " CONCAT(m.DTCHECKER,'') dtchecker,";
		strSql += " IFNULL(chuser.DISPLAYNAME,'') as uqcheckerid,";
		strSql += "  case when (m.INTCASHFLAG=2) then CONCAT(m.DTCASHER,'') else '' end as dtcasher,";
		strSql += " IFNULL(causer.DISPLAYNAME,'') as uqcasherid,";
		strSql += " '' as dtaccountant,";
		strSql += " IFNULL(acuser.DISPLAYNAME,'') as uqaccountantid";
		strSql += " from ";
		strSql += " tgl_voucher_mains m ";
		strSql += " INNER JOIN tgl_voucher_numberings n on n.UQNUMBERINGID=m.UQNUMBERING ";
		strSql += " inner join tsys_userbase ub on ub.id = m.UQFILLERID";
		strSql += " left join tsys_userbase chuser on chuser.id = m.UQCHECKERID";
		strSql += " left join tsys_userbase causer on causer.id = m.UQCASHERID";
		strSql += " left join tsys_userbase acuser on acuser.id = m.UQACCOUNTANTID";
		strSql += " where m.intflag = 1 and m.intcashflag in (0,2)";
		
		String numberid = cdtMap.getString("numberid");
		String dtfilldatefrom = cdtMap.getString("dtfilldatefrom");
		String dtfilldateto = cdtMap.getString("dtfilldateto");
		String periodid = cdtMap.getString("periodid");
		String compseq = cdtMap.getString("compseq");
		String vouchernum = cdtMap.getString("vouchernum");
		
		List<Object> paras = new ArrayList<Object>();
		
		M8Session session = new M8Session();
		strSql += " and m.UQCOMPANYID = ?";
		paras.add(session.getCompanyID());
		
		if(!StringUtil.isNullString(numberid) && !"00000000-0000-0000-0000-000000000000".equals(numberid))
		{
			strSql += " and m.uqnumbering = ? ";
			paras.add(cdtMap.getString("numberid"));
		}
		
		if(!StringUtil.isNullString(dtfilldatefrom) && !StringUtil.isNullString(dtfilldateto))
		{
			strSql += " and m.dtfiller >= ? and m.dtfiller <= ? ";
			paras.add(cdtMap.getString("dtfilldatefrom"));
			paras.add(cdtMap.getString("dtfilldateto"));
		}
		
		if(!StringUtil.isNullString(periodid))
		{
			strSql += " and m.uqglobalperiodid = ? ";
			paras.add(cdtMap.getString("periodid"));
		}
		
		if(!StringUtil.isNullString(compseq))
		{
			strSql += " and m.intcompanyseq = ? ";
			paras.add(cdtMap.getString("compseq"));
		}
		
		if(!StringUtil.isNullString(vouchernum))
		{
			strSql += " and m.intvouchernum = ? ";
			paras.add(cdtMap.getString("vouchernum"));
		}
		
		strSql += " and m.intdeleteflag=0 order by m.intcompanyseq";
		
		return this.getMapPage(strSql, paras, start, limit);
	}
	
	public boolean isCash(String uqvoucherid)
	{
		String strSql = "select count(1) from ";
		strSql += " tgl_voucher_details de ";
		strSql += " inner join tgl_accounts ac on ac.UQACCOUNTID=de.UQACCOUNTID ";
		strSql += " where de.UQVOUCHERID=? ";
		strSql += " and ac.UQTYPEID in(5,6)";
		
		int iscash = this.querySingleInteger(strSql, new Object[]{uqvoucherid});
		
		if(iscash > 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	public boolean lockVoucher(String voucherid, String tag)
	{
		String strSql = "select vm.intflag,vm.intcashflag,vm.intdeleteflag from tgl_voucher_mains vm where vm.uqvoucherid = ? for update";
		
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{voucherid});
		List<Object[]> lst = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			lst.add(new Object[]{
					entity.get("intflag"),
					entity.get("intcashflag"),
					entity.get("intdeleteflag")
				});
		}
		
		if(lst.size() > 0)
		{
			Object[] oResult = (Object[])lst.get(0);
			
			String intflag = oResult[0].toString();
			String intcashflag = oResult[1].toString();
			String intdeleteflag = oResult[2].toString();
			
			if("1".equals(tag) && "0".equals(intflag) && "0".equals(intdeleteflag))
			{
				//审核
				return true;
			}
			else if("2".equals(tag) && "1".equals(intcashflag))
			{
				//出纳
				return true;
			}
			else if("3".equals(tag) && "1".equals(intflag))
			{
				//记账
				return true;
			}
			else if("4".equals(tag) && "1".equals(intflag) && !"2".equals(intcashflag))
			{
				//反审核
				return true;
			}
			else if("5".equals(tag) && "1".equals(intflag) && "2".equals(intcashflag))
			{
				//反出纳
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}
	
	public String getAccountManager(String filldate)
    {
		String strSql = "select m.accountmanager from tgl_config_accountmanager m";
		List<EntityMap> maplist = this.getMapList(strSql);
		List<String> lst = new ArrayList<String>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			lst.add(entity.get("accountmanager").toString());
		}
		String accountmanager = "";
		
		if(lst.size() > 0)
		{
			accountmanager = lst.get(0)==null ? "" : lst.get(0).toString();
		}
		return accountmanager;
    }
	
	public void editVoucher(VoucherMain main)
	{
		String strSql = "update tgl_voucher_mains m set m.dtfiller = DATE_FORMAT(?,'%Y-%m-%d'), ";
		strSql += " m.uqnumbering = ?, m.uqglobalperiodid = ?, ";
		strSql += " m.dtfillersrv=DATE_FORMAT(?,'%Y-%m-%d %H:%i:%S'),m.INTAFFIX = ?,mnydebitsum = ?,";
		strSql += " mnycreditsum = ? where m.uqvoucherid=?";
		List<Object> paras = new ArrayList<Object>();
		paras.add(main.getDtfiller());
		paras.add(main.getUqnumbering());
		paras.add(main.getUqglobalperiodid());
		paras.add(main.getDtfillersrv() == null || main.getDtfillersrv().equals("")? "2999-09-09 00:00:00" : main.getDtfillersrv());
		paras.add(main.getIntaffix());
		paras.add(main.getMnydebitsum());
		paras.add(main.getMnycreditsum());
		paras.add(main.getUqvoucherid());
		this.execute(strSql, paras);
	}
	
	public void delVoucher(String voucherid)
	{
		String strSql = "update tgl_voucher_mains m set m.intdeleteflag=1 where m.uqvoucherid=?";
		
		this.execute(strSql, new Object[]{voucherid});
	}
	
	public Object[] getCurrentPeriodInfo(int intyearmonth)
	{
		String strSql = " select gp.uqglobalperiodid,gp.varname,gp.intyearmonth,date_format(str_to_date(gp.dtbegin, '%Y-%m-%d'), '%Y-%m-%d') dtbegin,date_format(str_to_date(gp.dtend, '%Y-%m-%d'), '%Y-%m-%d') dtend ";
		strSql += " from tgl_global_periods gp ";
		strSql += " where ? -gp.intyearmonth =( ";
		strSql += " select MIN( ? - gp1.intyearmonth) ";
		strSql += " from tgl_global_periods gp1 ";
		strSql += " where gp1.intyearmonth <= ? ";
		strSql += " and gp1.intstatus = 2 ) ";
		
		List<EntityMap> maplist =  this.getMapList(strSql, new Object[]{intyearmonth,intyearmonth,intyearmonth});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqglobalperiodid"),
					entity.get("varname"),
					entity.get("intyearmonth"),
					entity.get("dtbegin"),
					entity.get("dtend")
				});
		}
		if(list.size() > 0)
		{
			return list.get(0);
		}
		else
		{
			return null;
		}
	}
	
	public Object[] getCurrentPeriodInfoAll(int intyearmonth)
	{
		String strSql = " select gp.uqglobalperiodid,gp.varname,gp.intyearmonth,date_format(str_to_date(gp.dtbegin, '%Y-%m-%d'), '%Y-%m-%d') dtbegin,date_format(str_to_date(gp.dtend, '%Y-%m-%d'), '%Y-%m-%d') dtend ";
		strSql += " from tgl_global_periods gp ";
		strSql += " where ? -gp.intyearmonth =( ";
		strSql += " select MIN( ? - gp1.intyearmonth) ";
		strSql += " from tgl_global_periods gp1 ";
		strSql += " where gp1.intyearmonth <= ? ";
		strSql += " and gp1.INTSTATUS in (0,2)) ";
		
		List<EntityMap> maplist =  this.getMapList(strSql, new Object[]{intyearmonth,intyearmonth,intyearmonth});
		List<Object[]> list = new ArrayList<Object[]>();
		for (int i = 0; i < maplist.size(); i++) 
		{
			EntityMap entity = maplist.get(i);
			list.add(new Object[]{
					entity.get("uqglobalperiodid"),
					entity.get("varname"),
					entity.get("intyearmonth"),
					entity.get("dtbegin"),
					entity.get("dtend")
				});
		}
		if(list.size() > 0)
		{
			return list.get(0);
		}
		else
		{
			return null;
		}
	}
	
	//删除往来冲销临时表中 该凭证的往来数据
	public void deleteAc(String uqvoucherid)
	{
        String sql= "delete from tgl_ac_offset_temp where uqvoucherid =? " ;
        this.execute(sql,new Object[]{uqvoucherid});
    }
	
	//新增 2017-12-12
	//Created by wuzehua on 2017/10/12.
	//获取凭证记账前核销所存的临时表是否有数据
	public boolean isTemoData(String voucherid)
	{
		StringBuilder sql = new StringBuilder();
		sql.append(" select count(1) from tgl_ac_offset_temp tgl");
		sql.append(" where tgl.uqvoucherid =?");
		int nums = this.querySingleInteger(sql.toString(), new Object[]{voucherid});
		if(nums < 1)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	
	//新增 2017-12-12
	//Created by wuzehua on 2017/10/12.
	//获取凭证记账前核销所存的临时表的数据
	public List<EntityMap> getTempData(String voucherid)
	{
		StringBuilder sql = new StringBuilder();
		sql.append(" select tgl.uqvoucherdetailid, tgl.uqledgeid, tgl.main_data,");
		sql.append(" tgl.detail_datas from tgl_ac_offset_temp tgl");
		sql.append(" where tgl.uqvoucherid = ?");
		List<EntityMap> list =  this.getMapList(sql.toString(), new Object[]{voucherid});
		return list;
	}
}
