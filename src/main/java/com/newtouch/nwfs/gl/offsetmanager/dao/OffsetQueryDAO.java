package com.newtouch.nwfs.gl.offsetmanager.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;

@Repository
public class OffsetQueryDAO extends CommonDAO{

	public List<EntityMap> getOffsetInitDatas( ConditionMap cdtMap) {
		 String strSql = " select * ,t.inttype as inttype,t.offsetmoney as remainmoney from (SELECT   ai.iniid," +
	                "          '' as uqvoucherdetailid, " +
	                "          '' as voucherid , " +
	                "          ai.BUSDATE as accountdate ," +
	                "          concat('[',ac.varaccountcode,']',ac.VARACCOUNTNAME) as accountcode ," +
	                "          ai.UQACCOUNTID as uqaccountid," +
	                "          ai.uqledgetypeid as uqledgetypeid," +
	                "          ai.UQLEDGEID as uqledgeid," +
	                "          ai.UQCOMPANYID as uqcompanyid ," +
	                "          tlt.VARLEDGETYPENAME as accountledgertype, " +
	                "          tl.VARLEDGENAME as accountledger,  " +
	                "          ai.VARABSTRACT as varabstract  ," +
	                "          CASE WHEN (ai.MNYDEBIT = 0) THEN ai.MNYCREDIT" +
	                "               ELSE ai.MNYDEBIT END as offsetmoney ," +
	                "          0 as yetmoney ," +
	                "          '否' as isrelate ," +
	                "          '' as intvouchernum," +
	                "          ub.DISPLAYNAME as accountuser ," +
	                "          ai.INTTYPE as inttype" +
	                "          FROM TGL_AC_INI ai " +
	                "          INNER JOIN TGL_AC_INI_REL ir on ai.UQACCOUNTID = ir.UQACCOUNTID " +
	                "          INNER JOIN tgl_accounts ac on ac.UQACCOUNTID=ai.UQACCOUNTID " +
	                "          left JOIN tgl_ledger tl on tl.UQLEDGEID = ai.UQLEDGEID" +
	                "          left JOIN tgl_ledgetype tlt on tlt.UQLEDGETYPEID = tl.UQLEDGETYPEID" +
	                "          inner join tsys_userbase ub on ub.id = ir.UQUSERID  ) t " +
	                "          where t.inttype  " ;
		   Object type = cdtMap.getString("offsettype");
		   if("全部".equals(type) )
		   {	
			   strSql += " in(1,2)";
		   }
		   else
		   {	
			   if(cdtMap.getInteger("offsettype") == 0)
		       {
				   strSql += " in(1,2)";
		       }
			   if(cdtMap.getInteger("offsettype") == 1)
		       {
				   strSql += " = 2";
		       }
		       if(cdtMap.getInteger("offsettype") == 2)
		       {
		    	   strSql += " = 1";
		       }
		   }	
	        //根据查询条件拼接sql和参数
	        String account = cdtMap.getString("account");
	        String dtfilldatefrom = cdtMap.getString("dtfilldatefrom");
	        String dtfilldateto = cdtMap.getString("dtfilldateto");
	        String account_user = cdtMap.getString("account_user");
	        String varabstract = cdtMap.getString("varabstract");
	        Object obj_money_form = cdtMap.getString("money_form");
		    Object obj_money_to = cdtMap.getString("money_to");
		    String accountingperiodfrom = cdtMap.getString("accountingperiodfrom");
	        String accountingperiodto = cdtMap.getString("accountingperiodto");
		    double money_form = 0;
		    double money_to = 0;
		    if(!obj_money_form.equals(""))
		    {	money_form = cdtMap.getDouble("money_form");
		    }
		    if(!obj_money_to.equals(""))
		    {
		    	money_to = cdtMap.getDouble("money_to");
		    }
	        List<Object>  sqlParams = new ArrayList<>();        	   	 
	        if (!StringUtil.isNullString(account))
	        {
	            strSql += " and t.uqaccountid = ? ";
	            sqlParams.add(account);
	        }
	        if (!StringUtil.isNullString(dtfilldatefrom) && !StringUtil.isNullString(dtfilldateto))
	        {
	            strSql += " AND t.accountdate >= ? AND t.accountdate <= ? ";
	            sqlParams.add(dtfilldatefrom);
	            sqlParams.add(dtfilldateto);
	        }
	        if (!StringUtil.isNullString(account_user))
	        {
	            strSql += " AND t.accountuser  like '"+account_user+"%'" ;//容易发生sql注入风险
	        }
	        if (!StringUtil.isNullString(varabstract))
	        {
	        	strSql += " AND t.VARABSTRACT like '"+varabstract+"%' ";
	        }
	        if (!obj_money_form.equals("") && !obj_money_to.equals(""))
	        {
	            strSql += " AND t.offsetmoney >= ? AND t.offsetmoney <= ? ";
	            sqlParams.add(money_form);
	            sqlParams.add(money_to);
	        }
	        if (!obj_money_form.equals("") && obj_money_to.equals(""))
	        {
	            strSql += " AND t.offsetmoney >= ? ";
	            sqlParams.add(money_form);
	        }
	        if (obj_money_form.equals("") && !obj_money_to.equals(""))
	        {
	            strSql += " AND t.offsetmoney <= ? ";
	            sqlParams.add(money_to);
	        }
	        String ledgerIds = cdtMap.getString("ledger");
	        String ledgertypes = cdtMap.getString("ledgertypeid");
	        String ids = "" ;
	        if (!StringUtil.isNullString(ledgerIds))
	        {
	            ids = createLedgeParams(ledgerIds, 1);
	        }
	        if (!StringUtil.isNullString(ledgertypes))
	        {
	            if (StringUtil.isNullString(ledgerIds))
	            {
	                ids += createLedgeParams(ledgertypes, 2);
	            }
	            else 
	            {
	                ids += ","+createLedgeParams(ledgertypes, 2);
	            }
	        }
	        if (!ids.equals(""))
	        {
	            strSql += " and t.uqledgeid in ("+ids+") ";
	        }
	        if (!StringUtil.isNullString(accountingperiodfrom) && !StringUtil.isNullString(accountingperiodto))
	        {
	        	strSql += " AND accountdate >= ? AND accountdate <= ? " ;
	            sqlParams.add(accountingperiodfrom.replace("年", "-").replace("月", "-01"));
	            sqlParams.add(accountingperiodto.replace("年", "-").replace("月", "-31"));
	        }
	        strSql += " order by t.accountdate ";
	        List<EntityMap> maplist = this.getMapList(strSql, sqlParams);
	        return maplist;
	}
	/*
	 * 凭证表查数据
	 */
	public List<EntityMap> getDataByVoucher(ConditionMap cdtMap) {
		String sql = "select  '' as iniid ," +
	                "                             m.DTACCOUNTANT as accountdate," +
	                "                             tvd.VARABSTRACT as varabstract," +
	                "                             m.UQVOUCHERID as voucherid," +
	                "                             case when tvd.MNYDEBIT=0 THEN tvd.MNYCREDIT " +
	                "                                  else tvd.MNYDEBIT END as offsetmoney ,"+
	                "                             0 as yetmoney ," +
	                "                             case when tvd.MNYDEBIT=0 THEN tvd.MNYCREDIT " +
	                "                                  else tvd.MNYDEBIT END as remainmoney, " +
	                "                             tvd.UQACCOUNTID as uqaccountid, " +
	                "                             tc.CATEGORYNAME as vouchertype ," +
	                "                             m.INTCOMPANYSEQ as intcompanyseq, " +
	                "                             ac.intisledge , " +
	                "                             tvd.UQVOUCHERDETAILID as uqvoucherdetailid,  " +
	                "                             tvd.MNYDEBIT as mnydebit, " +
	                "                             tvd.MNYCREDIT as mnycredit, " +
	                "                             '是' as isrelate, " +
	                "                             concat(tvn.VARNAME,'-',m.INTVOUCHERNUM ) as intvouchernum, " +
	                "                             concat('[',ac.varaccountcode,']',ac.VARACCOUNTNAME) as accountcode , " +
	                "                             ac.UQTYPEID , " +
	                "                             ub.DISPLAYNAME as accountuser , " +
	                "                             tgp.VARNAME as accountingperiod, " +
	                "                             '' as accountledgertype ,  " +
	                "                             '' as accountledger, " +
	                "                             '' as uqledgeid , " +
	                "                             '' as uqledgertypeid, " +
	                "                              tc.CATEGORYNAME   " +
	                "                             from  tgl_voucher_details tvd  " +
	                "                             inner join tgl_voucher_mains m on m.UQVOUCHERID = tvd.UQVOUCHERID  " +
	                "							  inner join tgl_voucher_numberings tvn on m.UQNUMBERING = tvn.UQNUMBERINGID " +			
	                "                             inner join tgl_accounts ac on ac.UQACCOUNTID=tvd.UQACCOUNTID  " +
	                "                             inner join tsys_userbase ub on ub.id = m.UQFILLERID  " +
	                "                             inner join tob_category tc on tc.CATEGORYCODE = ac.UQTYPEID    " +
	                "                             inner join tgl_global_periods tgp on tgp.UQGLOBALPERIODID = m.UQGLOBALPERIODID  "+
	                "                             where tc.CATEGORYTYPE='10000002' "+
	                "                             and tc.CATEGORYCODE in (1,2,7,8)  " +
	                "                             and m.INTFLAG = 2  " ;
	        //根据查询条件拼接sql和参数
	        String account = cdtMap.getString("account");
	        String dtfilldatefrom = cdtMap.getString("dtfilldatefrom");
	        String dtfilldateto = cdtMap.getString("dtfilldateto");
	        String accountingperiodfrom = cdtMap.getString("accountingperiodfrom");
	        String accountingperiodto = cdtMap.getString("accountingperiodto");
	        String account_user = cdtMap.getString("account_user");
	        String varabstract = cdtMap.getString("varabstract");
	        List<Object>  sqlParams = new ArrayList<>();
	        if (!StringUtil.isNullString(account))
	        {
	            sql += " and tvd.UQACCOUNTID = ? " ;
	            sqlParams.add(account);
	        }
	        if (!StringUtil.isNullString(dtfilldatefrom) && !StringUtil.isNullString(dtfilldateto))
	        {
	            sql += " AND m.DTACCOUNTANT >= ? AND m.DTACCOUNTANT <= ? " ;
	            sqlParams.add(dtfilldatefrom);
	            sqlParams.add(dtfilldateto);
	        }
	        if (!StringUtil.isNullString(accountingperiodfrom) && !StringUtil.isNullString(accountingperiodto))
	        {
	            sql += " AND tgp.DTBEGIN >= ? AND tgp.DTEND <= ? " ;
	            sqlParams.add(accountingperiodfrom.replace("年", "-").replace("月", "-01"));
	            sqlParams.add(accountingperiodto.replace("年", "-").replace("月", "-31"));
	        }
	        if (!StringUtil.isNullString(account_user))
	        {
	            sql += " AND ub.DISPLAYNAME  like '" + account_user + "%'" ;//容易发生sql注入风险
	        }
	        if (!StringUtil.isNullString(varabstract))
	        {
	            sql += " AND tvd.VARABSTRACT like '" + varabstract + "%' ";
	        }
	        sql += " order by m.DTACCOUNTANT " ;
	        List<EntityMap> maplist = this.getMapList(sql, sqlParams);
	        return maplist ;
	    }

	

	public String createLedgeParams(String idstrs, int type) {
		String result = "";
	    if (StringUtil.isNullString(idstrs))
	    {
	    	return result ;
	    }
	    String[] strs = idstrs.split(",");
	    List<String> params = new ArrayList<>();
	    for (String str : strs)
	    {
	        if(type == 1)
	        {
	            if (str.contains("+"))
	            {//表示存在下级节点
	                str = str.substring(0,str.lastIndexOf("+"));
	                params.add(str);
	                List<EntityMap> ids = this.getLedgeByParentId(str);
	                for(EntityMap em : ids)
	                {
	                	params.add(em.getString("uqledgeid"));
	                }
	            }
	            else 
	            {
	                params.add(str);
	            }
	        }
	        else if (type == 2)
	        {
	            List<EntityMap> ids = this.getLedgeByledgeTypeId(str);
	            for(EntityMap em : ids)
	            {
	                params.add(em.getString("uqledgeid"));
	            }
	        }
	        else 
	        {
	            throw new IllegalArgumentException("type 必须为1或者2,当前为：" + type);
	        }
	    }
	    if (params.size()>0)
	    {
	        for (String id : params)
	        {
	            result += "'"+id +"'," ;
	        }
	        result = result.substring(0,result.length() - 1);
	    }
	    return result ;
	}
	/*
	 * 根据父节点ID获得分户
	 */
	private List<EntityMap> getLedgeByParentId(String ledgeParentId) {
		  String sql = "SELECT uqledgeid " +
                  "FROM tgl_ledger t " +
                  "where t.VARLEDGEFULLCODE LIKE " +
                  "(SELECT  CONCAT(tl.VARLEDGEFULLCODE,'%') " +
                  "FROM tgl_ledger tl " +
                  "WHERE tl.UQLEDGEID =?) " +
                  "AND t.UQLEDGEID <> ? " ;
		  return this.getMapList(sql,new Object[]{ledgeParentId,ledgeParentId});
	}
	
	/*
	 * 通过分户类别id获得分户
	 */
	private List<EntityMap> getLedgeByledgeTypeId(String ledgeTypeId) {
		 String sql = "SELECT t.uqledgeid " +
                 "FROM tgl_ledger t " +
                 "INNER JOIN tgl_ledgetype tlt ON t.UQLEDGETYPEID = tlt.UQLEDGETYPEID " +
                 "WHERE t.UQLEDGETYPEID = ? " ;
		 return this.getMapList(sql,new Object[]{ledgeTypeId});
	}
	public List<EntityMap> getRushData(String voucherDetailId, String ledgeId, String initId, Object type) 
	{
		 String strSql = "SELECT tam.uqmainid, tam.totalmoney,tam.notrushedmoney,tam.rushedmoney FROM TGL_AC_OFFSET_MAIN tam WHERE tam.INTTYPE in (";
		 if(type.equals("全部") || type.equals("0"))
		 {
			 strSql += "1,2)";
		 }
		 else
		 {
			 strSql += type +")";
		 }
		 Object[] params ;
	     if("".equals(initId))
	     {//表示关联凭证
	    	 if (!"".equals(ledgeId))
	    	 {
	             strSql += " and tam.UQLEDGEID=? and tam.UQVOUDETAILID=?  " ;
	             params = new Object[]{ledgeId,voucherDetailId};
	         }else{
	                strSql += " and tam.UQVOUDETAILID=?  ";
	                params = new Object[]{voucherDetailId};
	            }
	        }else {
	            strSql += " and tam.INIID=?  " ;
	            params = new Object[]{initId} ;
	        }
	        return this.getMapList(strSql, params);
	}
	
	/*
	 * 查询关联凭证的分户记录
	 */
	public List<EntityMap> getLedgerVouDetail(String uqvoucherdetailid,String ledgeIds) {
		String strSql = "select le.uqledgeid,tlt.varledgetypename,le.varledgecode,le.varledgename,l.mnyamount,l.uqledgertypeid from tgl_voucher_detail_ledger l " +
                " inner join tgl_ledger le on le.uqledgeid=l.uqledgerid and le.uqledgetypeid=l.uqledgertypeid " +
                "    inner join tgl_ledgetype tlt on tlt.UQLEDGETYPEID = l.uqledgertypeid " +
                " where  l.uqvoucherdetailid= ? " ;

        Object[] params ;
        if (!StringUtil.isNullString(ledgeIds)){
            strSql += " and l.uqledgerid in ("+ledgeIds+")  ";
        }
        params =  new Object[]{uqvoucherdetailid};
        strSql += " order by tlt.VARLEDGETYPENAME";
        List<EntityMap> maplist = this.getMapList(strSql, params);
        return maplist;
	}
	
	/*
	 * 查询批次号
	 */
	public List<EntityMap> getbatchids (ConditionMap cdtMap) {
		String strSql = " select UQBATCHID as batchid" +
        " from TGL_AC_OFFSET_DETAIL " +
	    " where UQMAINID = ? ";
		return this.getMapList(strSql, new Object[]{cdtMap.getString("uqmainid")});
	}
	/*
	 * 查询往来明细
	 */
	public List<EntityMap> getdetail(ConditionMap cdtMap, String id){
		String strSql = " select od.UQDETAILID as detailid, od.UQBATCHID as batchid, od.UQMAINID as mainid, od.UQVOUCHERID as voucherid, od.UQVOUDETAILID as voucherdetailid, od.INIID as initid, od.UQACCOUNTID accountid, tlt.VARLEDGETYPENAME as ledgetype, " +
	    " tl.VARLEDGENAME as ledge , od.MONEY as money , ub.DISPLAYNAME as offsetuser, date_format(od.INSERTTIME, '%Y-%m-%d %H:%i:%s') as offsetdate, ABS(od.MONEY) as absmny" +
		" from TGL_AC_OFFSET_DETAIL od" +
	    " inner join tsys_userbase ub on ub.id = od.UQUSERID  " +
	    " left join tgl_ledger tl on tl.UQLEDGEID = od.UQLEDGEID " +
	    " LEFT JOIN tgl_ledgetype tlt on tl.UQLEDGETYPEID = tlt.UQLEDGETYPEID " +
		" where UQBATCHID = ? ";
		List<Object>  sqlParams = new ArrayList<>();
		sqlParams.add(id);
		String offsetuser = cdtMap.getString("offsetuser");
		if (!StringUtil.isNullString(offsetuser))
		{
			strSql += " and ub.DISPLAYNAME like '"+offsetuser+"%'" ;
	    }
		String offsetdatefrom = cdtMap.getString("offsetdatefrom");
		String offsetdateto = cdtMap.getString("offsetdateto");
		if(!StringUtil.isNullString(offsetdatefrom) && !StringUtil.isNullString(offsetdateto))
		{
			strSql += "and od.INSERTTIME >= ? and od.INSERTTIME <= ? ";
			sqlParams.add(offsetdatefrom);
			sqlParams.add(offsetdateto);
		}
		if(!StringUtil.isNullString(offsetdatefrom) && StringUtil.isNullString(offsetdateto))
		{
			strSql += "and od.INSERTTIME >= ? ";
			sqlParams.add(offsetdatefrom);
		}
		if(!StringUtil.isNullString(offsetdateto) && StringUtil.isNullString(offsetdatefrom))
		{
			strSql += "and od.INSERTTIME <= ? ";
			sqlParams.add(offsetdateto);
		}
		strSql += " order by ABS(od.MONEY) DESC";
		return this.getMapList(strSql, sqlParams);
	}
	
	/*
	 * 根据凭证号查数据信息
	 */
	public List<EntityMap> getvoucherdata(String voucherid, String voucherdetailid){
		String strSql = " select tvm.UQVOUCHERID as voucherid, ac.VARACCOUNTCODE as uqaccountid, ac.VARACCOUNTNAME as accountcode, tgp.VARNAME as perioddate, tvm.DTACCOUNTANT as accountdate, ub.DISPLAYNAME as accountuser, tvd.VARABSTRACT as varabstract, " +
		" concat(tvn.VARNAME,'-',tvm.INTVOUCHERNUM ) as intvouchernum " +
		" from tgl_voucher_mains tvm " +
		" inner join tgl_voucher_details tvd on tvm.UQVOUCHERID = tvd.UQVOUCHERID " +
		" inner join tsys_userbase ub on ub.id = tvm.UQFILLERID " +
		" inner join tgl_accounts ac on ac.UQACCOUNTID = tvd.UQACCOUNTID " +
		" inner join tob_category tc on tc.CATEGORYCODE = ac.UQTYPEID " +
		" inner join tgl_voucher_numberings tvn on tvm.UQNUMBERING = tvn.UQNUMBERINGID " +
		" inner join tgl_global_periods tgp on tgp.UQGLOBALPERIODID = tvm.UQGLOBALPERIODID " +
        " where tc.CATEGORYTYPE='10000002' " +
        " and tc.CATEGORYCODE in (1,2,7,8)  " +
        " and tvm.UQVOUCHERID = '" + voucherid + "'" +
        " and tvd.UQVOUCHERDETAILID = '" + voucherdetailid + "'";
		return this.getMapList(strSql);
	}
	
	/*
	 * 根据初始号查数据信息
	 */
	public List<EntityMap> getinitdata(String initid){
		String strSql = " select ai.BUSDATE as accountdate, ub.DISPLAYNAME as accountuser, ac.UQACCOUNTID as uqaccountid, ac.VARACCOUNTNAME as accountcode, ai.VARABSTRACT " +
		" from tgl_ac_ini ai " +
		" inner join tsys_userbase ub on ub.id = ai.UQUSERID " +
		" inner join tgl_accounts ac on ac.UQACCOUNTID = ai.UQACCOUNTID " +
		" where ai.INIID = '" + initid + "'";
		return this.getMapList(strSql);
	}
}
