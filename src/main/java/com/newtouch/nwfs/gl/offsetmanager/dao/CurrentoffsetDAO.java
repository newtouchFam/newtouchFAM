package com.newtouch.nwfs.gl.offsetmanager.dao;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.session.M8Session;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhaodongchao on 2017/10/12.
 */
@Repository
public class CurrentoffsetDAO extends CommonDAO {


    public List<EntityMap> getDataByVoucher(ConditionMap params){
        String sql = "select  '' as iniid ," +
                "                             m.DTACCOUNTANT as accountdate," +
                "                             tvd.VARABSTRACT as varabstract," +
                "                             m.UQVOUCHERID as voucherid," +
              //  "                             m.MNYDEBITSUM as offsetmoney ,"+
                "                             case when tvd.MNYDEBIT=0 THEN tvd.MNYCREDIT " +
                "                                  else tvd.MNYDEBIT END as offsetmoney ,"+
                "                             0 as yetmoney ," +
              //  "                             m.MNYDEBITSUM as remainmoney," +
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
                "                             inner join tob_category tc on tc.CATEGORYCODE=ac.UQTYPEID    " +
                "                             where tc.CATEGORYTYPE='10000002' "+
                "                             and tc.CATEGORYCODE in (1,2,7,8)  " +
                "                             AND m.INTFLAG = 2  " ;
        //根据查询条件拼接sql和参数
        String account = params.getString("account");
        String dtfilldatefrom = params.getString("dtfilldatefrom");
        String dtfilldateto = params.getString("dtfilldateto");
        String account_user = params.getString("account_user");

        String remark = params.getString("remark");//用于人工匹配时查询

        List<Object>  sqlParams = new ArrayList<>();
        if (!StringUtil.isNullString(account)){
            sql += " and tvd.UQACCOUNTID = ? " ;
            sqlParams.add(account);
        }
        if (!StringUtil.isNullString(dtfilldatefrom) && !StringUtil.isNullString(dtfilldateto)){
            sql += " AND m.DTACCOUNTANT >= ? AND m.DTACCOUNTANT <= ? " ;
            sqlParams.add(dtfilldatefrom);
            sqlParams.add(dtfilldateto);
        }
        if (!StringUtil.isNullString(account_user)){
            sql += " AND ub.DISPLAYNAME  like '"+account_user+"%'"  ;//TODO 容易发生sql注入风险
        }

        if (!StringUtil.isNullString(remark)){
            sql += " AND tvd.VARABSTRACT like '"+remark+"%' " ;
        }
        sql += " order by m.DTACCOUNTANT " ;
        List<EntityMap> maplist = this.getMapList(sql, sqlParams);
        return maplist ;
    }


    /**
     * 根据明细凭证ID查询该条明细凭证的所有分摊户
     * @param uqvoucherdetailid 凭证明细id
     * @param ledgeIds 分户ID
     * @return
     */
    public List<EntityMap> getLedgerVouDetail(String uqvoucherdetailid,String ledgeIds)
    {
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

    public List<EntityMap> getOffsetInitDatas(int dataType,ConditionMap params){
        String strSql = " select * ,t.offsetmoney as remainmoney from (SELECT   ai.iniid," +
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
                "          where t.inttype = ?  " ;
        //根据查询条件拼接sql和参数
        String account = params.getString("account");
        String dtfilldatefrom = params.getString("dtfilldatefrom");
        String dtfilldateto = params.getString("dtfilldateto");
        String account_user = params.getString("account_user");
        Object obj_money_form = params.getString("money_form");
	    Object obj_money_to = params.getString("money_to");
	    double money_form = 0;
	    double money_to = 0;
	    if(!obj_money_form.equals(""))
	    {	money_form = params.getDouble("money_form");
	    }
	    if(!obj_money_to.equals(""))
	    {
	    	money_to = params.getDouble("money_to");
	    }
        List<Object>  sqlParams = new ArrayList<>();
        sqlParams.add(dataType);
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

        if (!StringUtil.isNullString(account)){
            strSql += " and t.uqaccountid = ? " ;
            sqlParams.add(account);
        }
        if (!StringUtil.isNullString(dtfilldatefrom) && !StringUtil.isNullString(dtfilldateto)){
            strSql += " AND t.accountdate >= ? AND t.accountdate <= ? " ;
            sqlParams.add(dtfilldatefrom);
            sqlParams.add(dtfilldateto);
        }
        if (!StringUtil.isNullString(account_user)){
            strSql += " AND t.accountuser  like '"+account_user+"%'"  ;//TODO 容易发生sql注入风险
        }
 
        String ledgerIds = params.getString("ledger");
        String ledgertypes = params.getString("ledgertypeid");

        String ids = "" ;
        if (!StringUtil.isNullString(ledgerIds)){
            ids = createLedgeParams(ledgerIds,1);
        }
        if (!StringUtil.isNullString(ledgertypes)){
            if (StringUtil.isNullString(ledgerIds)){
                ids += createLedgeParams(ledgertypes,2);
            }else {
                ids += ","+createLedgeParams(ledgertypes,2);
            }
        }
        if (!ids.equals("")){
            strSql += " and t.uqledgeid in ("+ids+") " ;
        }
        strSql += " order by t.accountdate " ;
        List<EntityMap> maplist = this.getMapList(strSql, sqlParams);
        return maplist;
    }
    public String createLedgeParams(String idstrs, int type){
        String result = "";
        if (StringUtil.isNullString(idstrs)){
            return result ;
        }
        String[] strs = idstrs.split(",");
        List<String> params = new ArrayList<>();
        for (String str : strs){
            if(type == 1){
                if (str.contains("+")){//表示存在下级节点
                    str = str.substring(0,str.lastIndexOf("+"));
                    params.add(str);
                    List<EntityMap> ids = this.getLedgeByParentId(str);
                    for(EntityMap em : ids){
                        params.add(em.getString("uqledgeid"));
                    }
                }else {
                    params.add(str);
                }
            }else if (type == 2){
                List<EntityMap> ids = this.getLedgeByledgeTypeId(str);
                for(EntityMap em : ids){
                    params.add(em.getString("uqledgeid"));
                }
            }else {
                throw new IllegalArgumentException("type 必须为1或者2,当前为："+type);
            }


        }
        if (params.size()>0){
            for (String id : params){
                result += "'"+id +"'," ;
            }
            result = result.substring(0,result.length() - 1);
        }
        return result ;
    }

    /**
     * 往来信息记录主表，子表中插入数据
     * @param params 参数包
     */
    public void insertOffsetData(JSONObject params,String mainId){
        String sql_main = "INSERT INTO TGL_AC_OFFSET_MAIN(UQMAINID,UQCOMPANYID,UQVOUCHERID," +
                "                               UQVOUDETAILID,INIID,UQACCOUNTID," +
                "                               UQLEDGETYPEID,UQLEDGEID,TOTALMONEY," +
                "                               RUSHEDMONEY,NOTRUSHEDMONEY,UQUSERID," +
                "                               INSERTTIME,UPDATETIME,INTTYPE)" +
                "       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?) " ;

        List<Object> sqlParams_main = new ArrayList<>();

        M8Session session = new M8Session();
        String companyId = session.getCompanyID();
        String userId = session.getUserID();

        sqlParams_main.add(mainId);//主键ID
        sqlParams_main.add(companyId);//公司ID
        sqlParams_main.add(params.getString("uqvoucherid"));//凭证主表ID
        sqlParams_main.add(params.getString("uqvoudetailid"));
        sqlParams_main.add(params.getString("iniid"));
        sqlParams_main.add(params.getString("uqaccountid"));
        sqlParams_main.add(params.getString("uqledgetypeid"));
        sqlParams_main.add(params.getString("uqledgeid"));
        sqlParams_main.add(params.getDouble("offsetmoney"));//总金额
        sqlParams_main.add(params.getString("yetmoney")); //已冲金额
        sqlParams_main.add(params.getString("remainmoney"));//未冲金额
        sqlParams_main.add(userId);
        sqlParams_main.add(params.getInt("inttype"));//类型 1冲销 2挂账
        this.execute(sql_main,sqlParams_main);
    }


    /**
     * 根据凭证明细Id，分户ID，类型判断来往主表中是否存在该记录
     * @param params　参数集
     * @return
     */
    public List<EntityMap> getExistInMain(JSONObject params){
        String sql = "select aom.uqmainid,aom.totalmoney,aom.notrushedmoney,aom.rushedmoney from TGL_AC_OFFSET_MAIN aom where aom.INTTYPE=? " ;
        String voucherDetailId = params.getString("uqvoudetailid") ; //凭证明细ID
        String ledgeId = params.getString("uqledgeid") ; //分户Id
        String initId = params.getString("iniid") ; //初始化ID
        int intType = params.getInt("inttype"); // 类型 1冲销 2挂账

        List<Object> sqlParams = new ArrayList<>();
        sqlParams.add(intType);

        if("".equals(initId)){
            sql += " and aom.UQVOUDETAILID = ? " ;
            sqlParams.add(voucherDetailId);
            if (!"".equals(ledgeId)){
                //表示此凭证记录存在分户
                sql += " and aom.UQLEDGEID=? ";
                sqlParams.add(ledgeId);
            }
        }else {
            sql += " and aom.INIID = ? ";
            sqlParams.add(initId);
        }

        return this.getMapList(sql,sqlParams);
    }
    public void updateMaindata(JSONObject record,String mainId){
        String sql = "update TGL_AC_OFFSET_MAIN aom set aom.RUSHEDMONEY=? ,aom.NOTRUSHEDMONEY=? where aom.UQMAINID=? ";
        List<Object> sqlPrams_update = new ArrayList<>();

        sqlPrams_update.add(record.getDouble("yetmoney"));
        sqlPrams_update.add(record.getDouble("remainmoney"));
        sqlPrams_update.add(mainId);
        this.execute(sql,sqlPrams_update);
    }

    /**
     * 向往来明细表中添加一条数据
     * @param params 明细表中需要存的数据
     */
    public void insertOffsetDetail(JSONObject params,String mainId){
        String sql_detail = "INSERT into TGL_AC_OFFSET_DETAIL(UQDETAILID,UQBATCHID,UQMAINID," +
                "                                 UQCOMPANYID,UQVOUCHERID,UQVOUDETAILID," +
                "                                 INIID,UQACCOUNTID,UQLEDGETYPEID," +
                "                                 UQLEDGEID,MONEY,UQUSERID," +
                "                                 INSERTTIME,UPDATETIME,INTTYPE)" +
                "            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?)  " ;
        List<Object> sqlParams_detail = new ArrayList<>();

        M8Session session = new M8Session();
        String companyId = session.getCompanyID();
        String userId = session.getUserID();

        sqlParams_detail.add(params.getString("uqdetailid"));//主键ID
        sqlParams_detail.add(params.getString("uqbatchid"));//批次号，一次冲销中，冲销明细记录与挂账明细记录的批次号相同
        sqlParams_detail.add(mainId);//往来冲销主表ID
        sqlParams_detail.add(companyId);//公司ID
        sqlParams_detail.add(params.getString("uqvoucherid"));
        sqlParams_detail.add(params.getString("uqvoudetailid"));
        sqlParams_detail.add(params.getString("iniid"));
        sqlParams_detail.add(params.getString("uqaccountid"));
        sqlParams_detail.add(params.getString("uqledgetypeid"));
        sqlParams_detail.add(params.getString("uqledgeid"));
        sqlParams_detail.add(params.getDouble("money"));//本次核销的金额
        sqlParams_detail.add(userId);
        sqlParams_detail.add(params.getInt("inttype"));//类型 1冲销 2挂账
        this.execute(sql_detail,sqlParams_detail);
    }
    public int updateOffsetDetail(String detailId,double money,String uqmainid){
        String sql = "update TGL_AC_OFFSET_DETAIL set money= money+? , uqmainid=?,updatetime=now() where uqdetailid=? ";
        return this.execute(sql,new Object[]{money,uqmainid,detailId});
    }
    public List<EntityMap> getOffsetDetail(String uqbatchid,int type){
        String sql = " select * from TGL_AC_OFFSET_DETAIL where uqbatchid=? and inttype=? ";
        return this.getMapList(sql,new Object[]{uqbatchid,type});
    }
    public List<EntityMap> getRushData(String voucherDetailId,String ledgeId,String initId,int type)
    {
        String strSql = "SELECT tam.uqmainid, tam.totalmoney,tam.notrushedmoney,tam.rushedmoney FROM TGL_AC_OFFSET_MAIN tam WHERE tam.INTTYPE=? " ;

        Object[] params ;
        if("".equals(initId)){//表示关联凭证
            if (!"".equals(ledgeId)){
                strSql += " and tam.UQLEDGEID=? and tam.UQVOUDETAILID=?  " ;
                params = new Object[]{type,ledgeId,voucherDetailId};
            }else{
                strSql += " and tam.UQVOUDETAILID=?  ";
                params = new Object[]{type,voucherDetailId};
            }
        }else {
            strSql += " and tam.INIID=?  " ;
            params = new Object[]{type,initId} ;
        }
        return this.getMapList(strSql, params);
    }

    public int deleteMainRecord(String mainId){
        String sql= "delete from TGL_AC_OFFSET_MAIN where UQMAINID =? " ;
        return this.execute(sql,new Object[]{mainId});
    }

    public int deleteAllDetails(String mainId,int inttype){
        String sql = " delete from TGL_AC_OFFSET_DETAIL  where UQMAINID=? and INTTYPE = ? ";
        return this.execute(sql,new Object[]{mainId,inttype});
    }
    public int deleteDetailForEmpty(){
        String sql = " delete from TGL_AC_OFFSET_DETAIL  where money=0 ";
        return this.execute(sql);
    }
    public List<EntityMap> queryAllOpDetails(String mainId,int inttype ,int opinttype){
        String sql = "select od.uqdetailid , od.uqmainid ,od.money as opmoney ,od1.money as money" +
                    "        from TGL_AC_OFFSET_DETAIL od" +
                    "        inner join  TGL_AC_OFFSET_DETAIL od1 on od1.UQBATCHID = od.UQBATCHID" +
                    "        where od.INTTYPE= ? " +
                    "        AND od1.INTTYPE=? " +
                    "        and od1.UQMAINID=? " +
                    "        and od.UQBATCHID IN (select tod.UQBATCHID from TGL_AC_OFFSET_DETAIL tod where tod.UQMAINID= ? and tod.INTTYPE = ? ) " ;
        return this.getMapList(sql,new Object[]{opinttype,inttype,mainId,mainId,inttype});
    }
    public int deleteDetail(String detailId){
        String sql = "delete from TGL_AC_OFFSET_DETAIL where uqdetailid=? " ;
        return this.execute(sql,new Object[]{detailId});
    }
    public List<EntityMap> getMain(String mainId){
        String sql = "select totalmoney,rushedmoney,notrushedmoney from TGL_AC_OFFSET_MAIN where UQMAINID=? " ;
        return this.getMapList(sql,new Object[]{mainId});
    }
    public int updateMain(String mainId,double rushedmoney,double notrushedmoney){
        String sql = "update TGL_AC_OFFSET_MAIN set rushedmoney=? ,notrushedmoney=? where uqmainid=? ";
        return this.execute(sql,new Object[]{rushedmoney,notrushedmoney,mainId});
    }
    public int updateDetail(String detailId,double money){
        String sql = " update TGL_AC_OFFSET_DETAIL set money= ? where uqdetailid=? ";
        return this.execute(sql,new Object[]{money,detailId});
    }
    public String getSystemConfig(String paramCode){
        String sql = "select PARAMSTRING as rush_flag from tssc_configparam where PARAMCODE=? AND STATUS=1 ";
        return this.querySingleString(sql,new Object[]{paramCode});
    }
    public List<EntityMap> getLedgeByParentId(String ledgeParentId){
        String sql = "SELECT uqledgeid " +
                            "FROM tgl_ledger t " +
                            "where t.VARLEDGEFULLCODE LIKE " +
                            "(SELECT  CONCAT(tl.VARLEDGEFULLCODE,'%') " +
                            "FROM tgl_ledger tl " +
                            "WHERE tl.UQLEDGEID =?) " +
                            "AND t.UQLEDGEID <> ? " ;
        return this.getMapList(sql,new Object[]{ledgeParentId,ledgeParentId});

    }
    public List<EntityMap> getLedgeByledgeTypeId(String ledgeTypeId){
        String sql = "SELECT t.uqledgeid " +
                            "FROM tgl_ledger t " +
                            "INNER JOIN tgl_ledgetype tlt ON t.UQLEDGETYPEID = tlt.UQLEDGETYPEID " +
                            "WHERE t.UQLEDGETYPEID = ? " ;
        return this.getMapList(sql,new Object[]{ledgeTypeId});
    }

}
