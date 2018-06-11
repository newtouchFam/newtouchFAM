package com.newtouch.nwfs.gl.offsetmanager.dao;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.session.M8Session;
import org.apache.commons.lang.ObjectUtils;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * 往来初始化Dao
 * @author Administrator
 *
 */
@Repository
public class AccountCurrentDao extends CommonDAO {
    /**
     * 往来初始化主数据查询
     * @author Administrator
     *
     */
    public PageData<EntityMap> getInitAccountData(String varAccountCode, String varAccountName, int start, int limit) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("  select dd.uqaccountid,dd.varaccountcode,dd.varaccountname,dd.uqparentid,dd.intproperty,dd.uqtypeid,dd.intislastlevel ,p.inidate from    ");
        sb.append("  (select t.INTFLAG,t.uqaccountid,t.varaccountcode,t.varaccountname,h.varaccountname as uqparentid,n.categoryname as intproperty,y.categorycode as uqtypeid,t.intislastlevel ");
        sb.append("   from tgl_accounts t,(select p.uqaccountid,p.varaccountname from tgl_accounts p ) h ,tob_category n, tob_category y  ");
        sb.append("   where   h.uqaccountid=t.uqparentid and n.categorycode=t.intproperty and n.CATEGORYTYPE='10000001' and y.categorycode=t.uqtypeid and y.CATEGORYTYPE='10000002')  dd ");
        sb.append("  LEFT JOIN (select g.inidate,g.uqaccountid  from  tgl_ac_ini_rel g ) p on dd.uqaccountid=p.uqaccountid  ");
        sb.append("   where  dd.intislastlevel=1 and dd.INTFLAG = 2 ");
        sb.append("   and    dd.uqtypeid in ('1','2','7','8')  ");
        sb.append("   and   dd.varaccountcode like   ?  ");
        sb.append("   and   dd.varaccountname  like   ? ");
        sb.append("   ORDER BY dd.varaccountcode asc");

        String[] fields = new String[]{ varAccountCode + "%", "%" + varAccountName + "%"};
        return this.getMapPage(sb.toString(), fields, start, limit);
    }
    /**
     * 往来初始化明细数据查询
     * @author Administrator
     *
     */
    public PageData<EntityMap> getInitDetailData(String uqaccountid, int start, int limit) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("   select t.iniid,t.busdate,t.varabstract,concat('[',bb.varledgecode,']',bb.varledgename) as uqledgeid,t.mnydebit,t.mnycredit,t.inttype,t.uqledgetypeid, t.uqledgeid as ledgerdetailid ,concat('[',bb.varledgecode,']',bb.varledgename) as ledgertext   ");
        sb.append("   from tgl_ac_ini t LEFT JOIN tgl_ledger bb  on t.uqledgeid = bb.uqledgeid ");
        sb.append("   where    t.uqaccountid= ? ");
        sb.append("   ORDER BY t.busdate desc");

        String[] fields = new String[]{ uqaccountid };
        return this.getMapPage(sb.toString(), fields, start, limit);
    }
    /**
     * 查询该科目下，该科目和分户是否存在
     * @author Administrator
     *
     */
    public String checkInitDateIsExist(String uqaccountid, String date,String uqledgeid) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("  select COUNT(0) from tgl_ac_ini t where t.busdate = ? and t.uqledgeid=? and t.uqaccountid=?  ");


        List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{date,uqledgeid,uqaccountid});

        return  mapList.size()!=0?mapList.get(0).getString("COUNT(0)"):"0";
    }
    /**
     * 查询该科目是否设有分户
     * @author Administrator
     *
     */
    public String checkDateIsExistFh(String uqaccountid) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("  select t.INTISLEDGE as INTISLEDGE from tgl_accounts t where t.UQACCOUNTID=?  ");


        List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{uqaccountid});

        return  mapList.size()!=0?mapList.get(0).getString("INTISLEDGE"):"0";
    }
    /**
     * 导入查询该科目是否设有分户
     * @author Administrator
     *
     */
    public String importcheckDateIsExistFh(String uqaccountcode) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("  select t.INTISLEDGE as INTISLEDGE from tgl_accounts t where t.VARACCOUNTCODE=? ");


        List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{uqaccountcode});

        return  mapList.size()!=0?mapList.get(0).getString("INTISLEDGE"):"0";
    }
    /**
     * 导入时查询该科目下，是否发生了初始化
     * @author Administrator
     *
     */
    public String checkIsInitDate(String uqaccountcode) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("  select t.inidate from tgl_ac_ini_rel t where  t.uqaccountid = (select k.uqaccountid from tgl_accounts k where k.varaccountcode = ? )   ");


        List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{uqaccountcode});

        return  mapList.size()!=0?mapList.get(0).getString("inidate"):"0";
    }
    /**
     * 导入时查询该科目类型
     * @author Administrator
     *
     */
    public String checkDateType(String uqaccountcode) throws Exception {

        String sql=" select dd.uqtypeid from    " +
                "        (select t.INTFLAG,t.uqaccountid,t.varaccountcode,t.varaccountname,h.varaccountname as uqparentid,n.categoryname as intproperty,y.categorycode,y.categoryname as uqtypeid,t.intislastlevel " +
                "           from tgl_accounts t,(select p.uqaccountid,p.varaccountname from tgl_accounts p ) h ,tob_category n, tob_category y  " +
                "          where   h.uqaccountid=t.uqparentid and n.categorycode=t.intproperty and n.CATEGORYTYPE='10000001' and y.categorycode=t.uqtypeid and y.CATEGORYTYPE='10000002')  dd " +
                "          LEFT JOIN (select g.inidate,g.uqaccountid  from  tgl_ac_ini_rel g ) p on dd.uqaccountid=p.uqaccountid  " +
                "           where  dd.intislastlevel=1 and dd.INTFLAG = 2" +
                "           and     dd.categorycode in ('1','2','7','8')   " +
                "           and   dd.varaccountcode =  ? " +
                "          ORDER BY dd.varaccountcode asc";


        List<EntityMap> mapList = this.getMapList(sql, new String[]{uqaccountcode});

        return  mapList.size()!=0?mapList.get(0).getString("uqtypeid"):"0";
    }

    /**
     * 导入时查询该科目编号下，该业务日期和分户是否存在
     * @author Administrator
     *
     */
    public String checkImportInitDateIsExist(String varaccountcode, String date,String varledgecode) throws Exception {
        StringBuilder sb = new StringBuilder();
        if(varledgecode.equals("全部")){
        sb.append("  select COUNT(0) from tgl_ac_ini t where t.busdate = ?   and t.uqaccountid=( select k.uqaccountid from tgl_accounts k where k.varaccountcode = ? )  ");
            List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{date,varaccountcode});

            return  mapList.size()!=0?mapList.get(0).getString("COUNT(0)"):"0";
        }else{
            sb.append("  select COUNT(0) from tgl_ac_ini t where t.busdate = ? and t.uqledgeid=(select l.uqledgeid from tgl_ledger l where l.varledgecode = ?)  and t.uqaccountid=( select k.uqaccountid from tgl_accounts k where k.varaccountcode = ? )  ");
            List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{date,varledgecode,varaccountcode});

            return  mapList.size()!=0?mapList.get(0).getString("COUNT(0)"):"0";
        }


    }
    /**
     * .导入时判断是否是“应收，应付，预付，预收”类型的末级科目
     * @author Administrator
     *
     */
    public String checkImportIsNeedType(String varaccountcode) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("  select t.VARACCOUNTCODE as varaccountcode  from tob_category k , tgl_accounts t WHERE  k.categorycode in ('1','2','7','8')   ");
        sb.append("  and k.categorycode=t.uqtypeid and t.VARACCOUNTCODE = ? and t.INTISLASTLEVEL=1 ");

        List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{varaccountcode});

        return  (mapList!=null&&mapList.size()!=0)?mapList.get(0).getString("varaccountcode"):"";
    }
    /**
     * 导入时查询该科目编号是否存在
     * @author Administrator
     *
     */
    public String checkImportAccountcodeIsExist(String varaccountcode) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("  select COUNT(0) from tgl_accounts t where  t.varaccountcode = ?   ");


        List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{varaccountcode});

        return mapList.size()!=0?mapList.get(0).getString("COUNT(0)"):"0";
    }
    /**
     * 导入时查询分户是否存在
     * @author Administrator
     *
     */
    public String checkImportFHIsExist(String varaccountcode,String varledgecode) throws Exception {
       String sb=" select count(y.VARLEDGECODE) as  varledgecode from tgl_ledger y where y.UQLEDGETYPEID in (" +
               "   select f.UQLEDGETYPEID from tgl_ledgetype f where f.UQLEDGETYPEID in (" +
               "    select t.uqledgetypeid from tgl_account_ledgetype t where t.uqaccountid=" +
               "   (select s.uqaccountid from tgl_accounts s where s.VARACCOUNTCODE= ? )))" +
               "   and y.INTISLASTLEVEL=1" +
               "    and y.VARLEDGECODE=?";


        List<EntityMap> mapList = this.getMapList(sb, new String[]{varaccountcode,varledgecode});

        return  mapList.size()!=0?mapList.get(0).getString("varledgecode"):"0";
    }
    /**
     * 界面插入时查询是否发生了核销
     * @author Administrator
     *
     */
    public String checkIsHX(String iniid) throws Exception{
        StringBuilder sb = new StringBuilder();
        sb.append("  select count(r.iniid) as iniid from tgl_ac_offset_main r  where  r.iniid = ?  ");

        List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{iniid});


        return (mapList.size()!=0&&mapList!=null)?mapList.get(0).getString("iniid"):"0";
    }
    /**
     * 清除初始化时查询是否发生了核销
     * @author Administrator
     *
     */
    public String clearCheckIsHX(String uqaccountid) throws Exception{
        StringBuilder sb = new StringBuilder();
        sb.append("  select count(r.iniid) as iniid from tgl_ac_offset_main r  where  r.uqaccountid = ?  ");

        List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{uqaccountid});


        return (mapList.size()!=0&&mapList!=null)?mapList.get(0).getString("iniid"):"0";
    }
    /**
     * 导入初始化数据
     * @author Administrator
     *
     */
    public void importXLSInitData(EntityMap entity) throws Exception
    {
        StringBuilder sb = new StringBuilder();
        sb.append(" INSERT INTO tgl_ac_ini ");
        sb.append(" (iniid,uqaccountid,uqcompanyid,uqledgetypeid,uqledgeid,varabstract,mnydebit,mnycredit,uquserid,busdate,inttype)");
        sb.append(" VALUES ( uuid(), (select t.uqaccountid from tgl_accounts t where t.varaccountcode = ? ), ?, ");
        sb.append(" (select b.uqledgetypeid  from tgl_ledger b where   b.varledgecode = ? ),");
        sb.append(" (select c.uqledgeid  from tgl_ledger c where   c.varledgecode = ? ),");
        sb.append("   ?, ?, ?, ?, ?, ?)");
        //公司id
        M8Session m8session = new M8Session();
        String uqcompanyid = ObjectUtils.toString(m8session.getCompanyID());
        String userid = ObjectUtils.toString(m8session.getUserID());
        this.execute(sb.toString(), new Object[]
                {
                        entity.get("varaccountcode").toString(),
                        uqcompanyid,
                        entity.get("varledgecode"),
                        entity.get("varledgecode"),
                        entity.get("varabstract"),
                        Double.parseDouble(entity.get("mnydebit").toString().equals("")?"0":entity.get("mnydebit").toString()),
                        Double.parseDouble(entity.get("mnycredit").toString().equals("")?"0":entity.get("mnycredit").toString()),
                        userid,
                        entity.get("busdate"),
                        entity.get("inttype")

                });
        StringBuilder sp = new StringBuilder();
        sp.append(" INSERT INTO tgl_ac_ini_rel ");
        sp.append(" (uqaccountid,uqcompanyid,uquserid,inidate)");
        sp.append(" SELECT  (select t.uqaccountid from tgl_accounts t where t.varaccountcode = ? ), ?, ?,SYSDATE()  FROM DUAL WHERE NOT EXISTS ");
        sp.append( " (SELECT inidate FROM tgl_ac_ini_rel WHERE uqaccountid = (select k.uqaccountid from tgl_accounts k where k.varaccountcode = ? ))");

        this.execute(sp.toString(), new Object[]
                {
                        entity.get("varaccountcode"),
                        uqcompanyid,
                        userid,
                        entity.get("varaccountcode")
                });

        StringBuilder sx = new StringBuilder();
        sx.append(" UPDATE tgl_ac_ini_rel ta SET ");
        sx.append(" ta.uqcompanyid = ?,ta.uquserid = ?,ta.inidate = SYSDATE()");
        sx.append(" WHERE ta.uqaccountid = (select t.uqaccountid from tgl_accounts t where t.varaccountcode = ? )");
        this.execute(sx.toString(), new  Object[]
                {
                        uqcompanyid,
                        userid,
                        entity.get("varaccountcode")
                });
    }
    /**
     * 插入初始化数据
     * @author Administrator
     *
     */
    public void importInitData(EntityMap entity) throws Exception
    {
        //公司id
        M8Session m8session = new M8Session();
        String uqcompanyid = ObjectUtils.toString(m8session.getCompanyID());
        String userid = ObjectUtils.toString(m8session.getUserID());
        if(entity.get("uqledgetypeid").equals("")||entity.get("uqledgetypeid")==null){
            StringBuilder sd = new StringBuilder();
            sd.append(" INSERT INTO tgl_ac_ini ");
            sd.append(" (iniid,uqaccountid,uqcompanyid,uqledgetypeid,uqledgeid,varabstract,mnydebit,mnycredit,uquserid,busdate,inttype)");
            sd.append(" VALUES ( uuid(), ?, ?, ");
            sd.append("(select b.uqledgetypeid  from tgl_ledger b where   b.UQLEDGEID = ? ),");
            sd.append(" ?, ?, ?, ?, ?, ?, ?)");

            this.execute(sd.toString(), new Object[]
                    {
                            entity.get("uqaccountid").toString(),
                            uqcompanyid,
                            entity.get("uqledgeid"),
                            entity.get("uqledgeid"),
                            entity.get("varabstract"),
                            Double.parseDouble(entity.get("mnydebit").toString().equals("")?"0":entity.get("mnydebit").toString()),
                            Double.parseDouble(entity.get("mnycredit").toString().equals("")?"0":entity.get("mnycredit").toString()),
                            userid,
                            entity.get("busdate"),
                            entity.get("inttype")

                    });

        }else{
            StringBuilder sb = new StringBuilder();
            sb.append(" INSERT INTO tgl_ac_ini ");
            sb.append(" (iniid,uqaccountid,uqcompanyid,uqledgetypeid,uqledgeid,varabstract,mnydebit,mnycredit,uquserid,busdate,inttype)");
            sb.append(" VALUES ( uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            sb.append(" VALUES ( uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            this.execute(sb.toString(), new Object[]
                    {
                            entity.get("uqaccountid").toString(),
                            uqcompanyid,
                            entity.get("uqledgetypeid"),
                            entity.get("uqledgeid"),
                            entity.get("varabstract"),
                            Double.parseDouble(entity.get("mnydebit").toString().equals("")?"0":entity.get("mnydebit").toString()),
                            Double.parseDouble(entity.get("mnycredit").toString().equals("")?"0":entity.get("mnycredit").toString()),
                            userid,
                            entity.get("busdate"),
                            entity.get("inttype")

                    });

        }

        StringBuilder sp = new StringBuilder();
        sp.append(" INSERT INTO tgl_ac_ini_rel ");
        sp.append(" (uqaccountid,uqcompanyid,uquserid,inidate)");
        sp.append(" SELECT  ?, ?, ?,SYSDATE()  FROM DUAL WHERE NOT EXISTS ");
        sp.append( " (SELECT inidate FROM tgl_ac_ini_rel WHERE uqaccountid = ?)");

        this.execute(sp.toString(), new Object[]
                {
                        entity.get("uqaccountid"),
                        uqcompanyid,
                        userid,
                        entity.get("uqaccountid")
                });

        StringBuilder sx = new StringBuilder();
        sx.append(" UPDATE tgl_ac_ini_rel ta SET ");
        sx.append(" ta.uqcompanyid = ?,ta.uquserid = ?,ta.inidate = SYSDATE()");
        sx.append(" WHERE ta.uqaccountid = ? ");
        this.execute(sx.toString(), new  Object[]
                {
                        uqcompanyid,
                        userid,
                        entity.get("uqaccountid")
                });
    }
    /**
     * 修改初始化数据
     * @author Administrator
     *
     */
    public void updateIni(JSONObject entity) throws Exception
    {
        M8Session m8session = new M8Session();
        String uqcompanyid = ObjectUtils.toString(m8session.getCompanyID());
        String userid = ObjectUtils.toString(m8session.getUserID());

        if (entity.get("uqledgetypeid").equals("")||entity.get("uqledgetypeid")==null){
        StringBuilder st = new StringBuilder();
            st.append(" UPDATE tgl_ac_ini ta SET ");
            st.append("  ta.uqledgetypeid=(select b.uqledgetypeid  from tgl_ledger b where   b.UQLEDGEID = ? ),ta.uqcompanyid=?,");
            st.append("  ta.uqledgeid=?,ta.varabstract=?,ta.mnydebit=?,ta.mnycredit=?,");
            st.append("  ta.uquserid=?,ta.busdate=?,ta.inttype=?  ");
            st.append(" WHERE ta.iniid = ? ");

            this.execute(st.toString(), new  Object[]
                {
                        entity.get("uqledgeid"),
                        uqcompanyid,
                        entity.get("uqledgeid"),
                        entity.get("varabstract"),
                        Double.parseDouble(entity.get("mnydebit").toString().equals("")?"0":entity.get("mnydebit").toString()),
                        Double.parseDouble(entity.get("mnycredit").toString().equals("")?"0":entity.get("mnycredit").toString()),
                        userid,
                        entity.get("busdate"),
                        entity.get("inttype"),
                        entity.get("iniid")
                });
        }else{
            StringBuilder sj = new StringBuilder();
            sj.append(" UPDATE tgl_ac_ini ta SET ");
            sj.append("  ta.uqledgetypeid=?,ta.uqcompanyid=?,");
            sj.append("  ta.uqledgeid=?,ta.varabstract=?,ta.mnydebit=?,ta.mnycredit=?,");
            sj.append("  ta.uquserid=?,ta.busdate=?,ta.inttype=?  ");
            sj.append(" WHERE ta.iniid = ? ");


            this.execute(sj.toString(), new  Object[]
                    {
                            entity.get("uqledgetypeid"),
                            uqcompanyid,
                            entity.get("uqledgeid"),
                            entity.get("varabstract"),
                            Double.parseDouble(entity.get("mnydebit").toString().equals("")?"0":entity.get("mnydebit").toString()),
                            Double.parseDouble(entity.get("mnycredit").toString().equals("")?"0":entity.get("mnycredit").toString()),
                            userid,
                            entity.get("busdate"),
                            entity.get("inttype"),
                            entity.get("iniid")
                    }); }
        StringBuilder sp = new StringBuilder();
        sp.append(" UPDATE tgl_ac_ini_rel ta SET ");
        sp.append(" ta.uqcompanyid = ?,ta.uquserid = ?,ta.inidate = SYSDATE()");
        sp.append(" WHERE ta.uqaccountid = ? ");
        this.execute(sp.toString(), new  Object[]
                {
                        uqcompanyid,
                        userid,
                        entity.get("uqaccountid")
                });
    }
    /**
     * 删除初始化数据
     * @author Administrator
     *
     */
    public void deleteIni(String iniid,String uqaccountid) throws Exception
    {
        String sql = " DELETE FROM tgl_ac_ini  WHERE iniid = ? ";
        this.execute(sql, new  String []{iniid});

        String sql2 = " UPDATE tgl_ac_ini_rel ta SET ta.inidate = SYSDATE() WHERE ta.uqaccountid = ? ";
        this.execute(sql2, new  String[]{uqaccountid});


        String sql3 = " DELETE FROM tgl_ac_ini_rel  WHERE uqaccountid = ? and not EXISTS " +
                "   (select t.INIID from  tgl_ac_ini t  WHERE t.uqaccountid = ?) ";

        this.execute(sql3, new  String[]{ uqaccountid,uqaccountid});
    }
    /**
     * 清除该科目下的所有初始化数据
     * @author Administrator
     *
     */
    public void clearDetailData(String uqaccountid)throws Exception{

        String sql = " DELETE FROM tgl_ac_ini  WHERE uqaccountid = ? ";
        this.execute(sql, new  String []{uqaccountid});

        String sql3 = " DELETE FROM tgl_ac_ini_rel  WHERE uqaccountid = ? " ;

        this.execute(sql3, new  String[]{uqaccountid});

    }
    /**
     * 导出初始化数据
     * @author Administrator
     *
     */
    public List<Object[]> exportInitInfo(String varAccountCode, String varAccountName){

        StringBuilder sb = new StringBuilder();
        sb.append(" select (case t.inttype when 1 then '挂账'  else '冲销' end) as inttype,   ");
        sb.append("   t.busdate,g.inidate,t.varabstract,h.varaccountcode,h.varaccountname,pb.varledgecode,concat('[',pb.varledgecode,']',pb.varledgename)  as varledgename,t.mnydebit,t.mnycredit ");
        sb.append("   from tgl_ac_ini t LEFT JOIN tgl_ledger pb on  t.uqledgeid=pb.uqledgeid  ,tgl_ac_ini_rel g,(select s.uqaccountid,s.varaccountname,s.varaccountcode,s.intislastlevel,s.uqtypeid from tgl_accounts s ) h,tob_category y  ");
        sb.append("   where t.uqaccountid=g.uqaccountid ");
        sb.append("   and t.uqaccountid=h.uqaccountid");
        sb.append("   and  h.intislastlevel = 1  ");
        sb.append("   and   h.varaccountcode like   ?  ");
        sb.append("   and   h.varaccountname  like   ? ");
        sb.append("   and y.categorycode = h.uqtypeid  ");
        sb.append("   and y.CATEGORYTYPE='10000002' and y.categorycode in ('1','2','7','8') ");
        sb.append("   ORDER BY h.varaccountcode asc");

        List<Object[]> resultList = new ArrayList<Object[]>();
        List<EntityMap> mapList = this.getMapList(sb.toString(), new Object[]{ varAccountCode + "%", "%" + varAccountName + "%"});
        for (int i = 0; i < mapList.size(); i++)
        {
            resultList.add(new Object[]{
                    mapList.get(i).getString("inttype"),
                    mapList.get(i).getString("busdate"),
                    mapList.get(i).getString("inidate"),
                    mapList.get(i).getString("varabstract"),
                    mapList.get(i).getString("varaccountcode"),
                    mapList.get(i).getString("varaccountname"),
                    mapList.get(i).getString("varledgecode"),
                    mapList.get(i).getString("varledgename"),
                    mapList.get(i).getString("mnydebit"),
                    mapList.get(i).getString("mnycredit")
            });
        }
        return resultList ;
    }
}
