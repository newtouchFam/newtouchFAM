package com.newtouch.nwfs.gl.offsetmanager.bp;

import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.offsetmanager.dao.AccountCurrentDao;
import jxl.Sheet;
import jxl.Workbook;
import org.apache.commons.lang.ObjectUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.rpc.holders.StringHolder;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class AccountCurrentBp {

    @Autowired
    private AccountCurrentDao accountCurrentDao;

    /**
     * 查询主界面的数据
     *
     * @author Administrator
     */
    public PageData<EntityMap> getInitAccountBp(String varAccountCode, String varAccountName, int start, int limit) throws Exception {
        PageData<EntityMap> pageList = accountCurrentDao.getInitAccountData(varAccountCode, varAccountName, start, limit);

        return pageList;
    }

    /**
     * 查询初始化明细数据
     *
     * @author Administrator
     */
    public PageData<EntityMap> getInitDetailData(String uqaccountid, int start, int limit) throws Exception {
        PageData<EntityMap> pageList = accountCurrentDao.getInitDetailData(uqaccountid, start, limit);

        return pageList;
    }

    /**
     * 导入初始化数据
     *
     * @author Administrator
     */
    public void uploadIniFile(InputStream is, StringHolder errormsg) throws Exception {
        Workbook wk = Workbook.getWorkbook(is);
        Sheet st = wk.getSheet(0);
        int rowlength = st.getRows();
        if (rowlength <= 1) {
            throw new Exception("表格中没有数据!");
        } else {
            if (rowlength > 1) {
                this.validateUploadFile(st);
                List<EntityMap> list = new ArrayList<EntityMap>();
                for (int row = 1; row < rowlength; row++) {
                    String busdate = ObjectUtils.toString(st.getCell(0, row).getContents().trim());
                    String varabstract = ObjectUtils.toString(st.getCell(1, row).getContents().trim());
                    String varaccountcode = ObjectUtils.toString(st.getCell(2, row).getContents().trim());
                    String varledgecode = ObjectUtils.toString(st.getCell(3, row).getContents().trim());
                    String mnydebit = ObjectUtils.toString(st.getCell(4, row).getContents().trim());
                    String mnycredit = ObjectUtils.toString(st.getCell(5, row).getContents().trim());

                    EntityMap entity = new EntityMap();
                    entity.put("busdate", busdate);
                    entity.put("varabstract", varabstract);
                    entity.put("varaccountcode", varaccountcode);
                    entity.put("varledgecode", varledgecode);
                    entity.put("mnydebit", mnydebit);
                    entity.put("mnycredit", mnycredit);
                    entity.put("inttype", this.changeType(varaccountcode,mnydebit,mnycredit));
                    list.add(entity);
                }
                //检查数据是否符合规定
                this.checkInitInfo(list, errormsg);
                //如果文件的数据都正确，则保存数据
                if ("".equals(errormsg.value)) {
                    for (int i = 0; i < list.size(); i++) {
                        //将数据插入表
                        this.accountCurrentDao.importXLSInitData(list.get(i));
                    }
                }
            }
        }
    }

    /**
     * 验证导入的初始化数据的列头的正确性
     *
     * @author Administrator
     */
    public void validateUploadFile(Sheet st) throws Exception {
        if ("业务日期".equals(st.getCell(0, 0).getContents())
                && "摘要".equals(st.getCell(1, 0).getContents())
                && "科目编号".equals(st.getCell(2, 0).getContents())
                && "分户项目编号".equals(st.getCell(3, 0).getContents())
                && "借方金额".equals(st.getCell(4, 0).getContents())
                && "贷方金额".equals(st.getCell(5, 0).getContents())) {
        } else {
            throw new Exception("模版表不正确,请重新选择!");
        }
    }

    /**
     * 验证导入的初始化主数据的正确性
     *
     * @author Administrator
     */
    public void checkInitInfo(List<EntityMap> list, StringHolder errormsg) throws Exception {
        //1.检验各项非空字段；
        Map<String, Integer> map = new HashMap<String, Integer>();
        boolean hasnull = true;
        boolean dateIsRight = true;
        for (int i = 0; i < list.size(); i++) {
            int j = i + 2;
            EntityMap entity = list.get(i);
            String busdate = entity.getString("busdate");
            String varabstract = entity.getString("varabstract");
            String varaccountcode = entity.getString("varaccountcode");
            String varledgecode = entity.getString("varledgecode");
            String mnydebit = entity.getString("mnydebit");
            String mnycredit = entity.getString("mnycredit");

            //1.检验各项非空字段；
            if (hasnull) {
                if (busdate == null || "".equals(busdate)) {
                    errormsg.value += "表中第 " + j + " 行[业务日期]为空|";
                    hasnull = false;
                }
            }
            if (hasnull) {
                if (!(busdate == null || "".equals(busdate))) {
//                        String pat = "\\d{4}-\\d{2}-\\d{2}" ;    // 指定好正则表达式
//                        Pattern p = Pattern.compile(pat) ;
//                        String pat1 = "\\d{4}/\\d{2}/\\d{2}" ;    // 指定好正则表达式
//                        Pattern p1 = Pattern.compile(pat1) ;// 实例化Pattern类
//                        Matcher m = p.matcher(busdate) ;
//                        Matcher m1 = p1.matcher(busdate) ; // 实例化Matcher类

                    SimpleDateFormat format1 = new SimpleDateFormat("yyyy/MM/dd");
                            try {

                                   format1.setLenient(false);
                                   format1.parse(busdate);
                                } catch (ParseException e) {
                            try {
                                SimpleDateFormat format2 = new SimpleDateFormat("yyyy-MM-dd");
                                format2.setLenient(false);
                                format2.parse(busdate);
                                } catch (ParseException e2) {
                                    errormsg.value += "表中第 " + j + " 行[业务日期]格式应为(yyyy-MM-dd)或(yyyy/MM/dd)|";
                                    dateIsRight = false;
                                }
                                }

                }
            }
            if (hasnull) {
                if (varaccountcode == null || "".equals(varaccountcode)) {
                    errormsg.value += "表中第" + j + " 行[科目编号]为空|";
                    hasnull = false;
                }
            }
            if (hasnull) {
                String checkNameList = accountCurrentDao.checkIsInitDate(varaccountcode);
                if (!("0".equals(checkNameList))) {
                    errormsg.value += "表中第" + j + "条数据科目编号为" + varaccountcode + "已经发生过初始化不能导入|";
                    hasnull = false;
                }
            }
            if (hasnull) {
                String checkNameList = accountCurrentDao.checkImportAccountcodeIsExist(varaccountcode);
                if ("0".equals(checkNameList)) {
                    errormsg.value += "表中第" + j + "条数据的[科目编号]在科目表中不存在|";
                    hasnull = false;
                }
            }
            if (hasnull) {
                String checkNameList = accountCurrentDao.checkImportIsNeedType(varaccountcode);
                if ("".equals(checkNameList)) {
                    errormsg.value += "表中第" + j + "条数据的[科目编号]不是“应收，应付，预付，预收”类型的末级科|";
                    hasnull = false;
                }
            }
            String ppt = accountCurrentDao.importcheckDateIsExistFh(varaccountcode);
            if (ppt.equals("1")) {
                if (hasnull) {
                    String checkNameList = accountCurrentDao.checkImportFHIsExist(varaccountcode, varledgecode);
                    if ("0".equals(checkNameList)) {
                        errormsg.value += "表中第" + j + "条数据的[科目编号]下没有该[分户项目编号]|";
                        hasnull = false;
                    }
                }
                if (hasnull && dateIsRight) {
                    String checkNameList = accountCurrentDao.checkImportInitDateIsExist(varaccountcode, busdate, varledgecode);
                    if (!"0".equals(checkNameList)) {
                        errormsg.value += "表中第" + j + "条数据的[业务日期][分户项目编号]在初始化表中已存在|";
                        hasnull = false;
                    }
                }
            } else {
                if (hasnull) {

                    if (!"".equals(varledgecode)) {
                        errormsg.value += "表中第" + j + "条数据的[科目编号]下没有设置分户|";
                        hasnull = false;
                    }
                }
                if (hasnull && dateIsRight) {
                    String checkNameList = accountCurrentDao.checkImportInitDateIsExist(varaccountcode, busdate, "全部");
                    if (!"0".equals(checkNameList)) {
                        errormsg.value += "表中第" + j + "条数据的[业务日期]在初始化表中已存在|";
                        hasnull = false;
                    }
                }
            }
            if (hasnull) {
                if ((mnydebit == null || "".equals(mnydebit) || "0".equals(mnydebit) || "0.00".equals(mnydebit)) && (mnycredit == null || "0".equals(mnycredit) || "".equals(mnycredit) || "0.00".equals(mnycredit))) {
                    errormsg.value += "表中第" + j + " 行[借方金额]和[贷方金额]都未填写|";
                    hasnull = false;
                }
                if (!(mnydebit == null || "".equals(mnydebit) || "0".equals(mnydebit) || "0.00".equals(mnydebit)) && !(mnycredit == null || "0".equals(mnycredit) || "".equals(mnycredit) || "0.00".equals(mnycredit))) {
                    errormsg.value += "表中第" + j + " 行[借方金额]和[贷方金额]都有填写|";
                    hasnull = false;
                }
            }

            if (hasnull) {
                for (int t = i + 1; t < list.size(); t++) {
                    EntityMap entity3 = list.get(t);
                    String busdate13 = entity3.getString("busdate");
                    String varaccountcode3 = entity3.getString("varaccountcode");
                    String varledgecode3 = entity3.getString("varledgecode");
                    if (hasnull) {
                        if ((busdate.equals(busdate13)) && (varledgecode.equals(varledgecode3)) && (varaccountcode.equals(varaccountcode3))) {
                            errormsg.value += "表中第" + (i + 2) + " 行[业务日期],[科目编号],[分户项目编号]和" + (t + 2) + "行相同|";
                            hasnull = false;
                        }
                    }
                }

            }
        }
    }

    /**
     * 保存初始化数据
     *
     * @author Administrator
     */
    public String saveDataIni(String jsonStringAdd, String jsonStringUpdate, String jsonStringDelete) throws Exception {

        //增加数据-----------------
        String message = "";
        JSONArray jsonArray = new JSONArray(jsonStringAdd);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject cdtMap1 = jsonArray.getJSONObject(i);
            EntityMap entityAdd = new EntityMap();
            entityAdd.put("uqaccountid", cdtMap1.get("uqaccountid"));
            entityAdd.put("uqledgetypeid", cdtMap1.get("uqledgetypeid"));
            entityAdd.put("uqledgeid", cdtMap1.get("uqledgeid"));
            entityAdd.put("varabstract", cdtMap1.get("varabstract"));
            entityAdd.put("mnydebit", cdtMap1.get("mnydebit"));
            entityAdd.put("mnycredit", cdtMap1.get("mnycredit"));
            entityAdd.put("busdate", cdtMap1.get("busdate"));
            entityAdd.put("inttype", cdtMap1.get("inttype"));
            cdtMap1.get("num");

            String checkNameList = accountCurrentDao.checkInitDateIsExist(entityAdd.get("uqaccountid").toString(),
                    entityAdd.get("busdate").toString(), entityAdd.get("uqledgeid").toString());
            if (!"0".equals(checkNameList)) {
                message = message + "第" + cdtMap1.get("num") + "条数据已存在 \n";
                continue;
            } else {
                accountCurrentDao.importInitData(entityAdd);
            }
        }

        //修改数据---------------------------
        JSONArray jsonArray2 = new JSONArray(jsonStringUpdate);
        for (int i = 0; i < jsonArray2.length(); i++) {
            JSONObject cdtMap2 = jsonArray2.getJSONObject(i);
            String bs = accountCurrentDao.checkIsHX(cdtMap2.get("iniid").toString());
            if (!"0".equals(bs)) {
                message = message + "第" + cdtMap2.get("num") + "条数据已核销不能修改 \n";
            } else {
                if(cdtMap2.get("updateflag").equals("1")) {

                    String checkNameList2 = accountCurrentDao.checkInitDateIsExist(cdtMap2.get("uqaccountid").toString(),
                            cdtMap2.get("busdate").toString(), cdtMap2.get("uqledgeid").toString());
                    if (!"0".equals(checkNameList2)) {
                        message = message + "第" + cdtMap2.get("num") + "条数据已存在 \n";
                        continue;
                    }
                }
                    accountCurrentDao.updateIni(cdtMap2);

            }
        }
        //删除操作-------------------------
        JSONArray jsonArray3 = new JSONArray(jsonStringDelete);
        for (int l = 0; l < jsonArray3.length(); l++) {
            JSONObject delateData = jsonArray3.getJSONObject(l);
            String[] deleteid = (delateData.get("iniid").toString()).split(",");
            String uqaccountid = delateData.get("uqaccountid").toString();

            for (int k = 0; k < deleteid.length; k++) {
                if (deleteid[k].equals("")) continue;
                String bs = accountCurrentDao.checkIsHX(deleteid[k]);
                if (!"0".equals(bs)) {
                    message = message + "在您删除的数据中第" + k + "条已核销不能删除 \n";
                    continue;
                } else {
                    accountCurrentDao.deleteIni(deleteid[k], uqaccountid);
                }
            }
        }
        return message;
    }

    /**
     * 清除该科目下的所有初始化数据
     *
     * @author Administrator
     */
    public String clearDetailData(String uqaccountid) throws Exception {

        String[] strSplit = uqaccountid.split(",");
        String message = "";
        for (int l = 0; l < strSplit.length; l++) {
            if (strSplit[l].equals("")) continue;
            String check = accountCurrentDao.clearCheckIsHX(strSplit[l]);
            if (!"0".equals(check)) {
                message = message + "," + l;
                continue;
            }
            accountCurrentDao.clearDetailData(strSplit[l]);
        }
        if (message.equals("")) {
            return "清除成功！";
        } else {
            return "在您选择的数据中第" + message.substring(1, message.length() ) + "条已做核销，不能清除！";
        }

    }

    /**
     * 查询该科目是否设有分户
     *
     * @author Administrator
     */
    public String checkDateIsExistFh(String uqaccountid) throws Exception {
        return accountCurrentDao.checkDateIsExistFh(uqaccountid);
    }

    /**
     * 导出
     *
     * @author Administrator
     */
    public List<Object[]> exportInitInfo(String varAccountCode, String varAccountName) throws Exception {
        return accountCurrentDao.exportInitInfo(varAccountCode, varAccountName);
    }

    /**
     * 转换
     *
     * @author Administrator
     */
    public String changeType(String code, String mne1, String mne2) throws Exception {
        String rr=accountCurrentDao.checkDateType(code);
        if(!(mne1.equals("")||mne1.equals("0")||mne1.equals("0.00"))){
            if(rr.equals("应付")||rr.equals("预收")){
                if(Integer.valueOf(mne1)>0){
                    return "2";
                }
                if(Integer.valueOf(mne1)<0){
                    return "1";
                }
            }
            if(rr.equals("应收")||rr.equals("预付")) {
                if (Integer.valueOf(mne1) > 0) {
                    return "1";
                }
                if (Integer.valueOf(mne1) < 0) {
                    return "2";
                }
            }
        }else{
            if(rr.equals("应付")||rr.equals("预收")){
                if(Integer.valueOf(mne2)>0){
                    return "1";
                }
                if(Integer.valueOf(mne2)<0){
                    return "2";
                }
            }
            if(rr.equals("应收")||rr.equals("预付")){
                if(Integer.valueOf(mne2)>0){
                    return "2";
                }
                if(Integer.valueOf(mne2)<0){
                    return "1";
                }

            }
        }
        return "1";
    }
}