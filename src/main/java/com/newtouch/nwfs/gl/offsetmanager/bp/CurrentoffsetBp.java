package com.newtouch.nwfs.gl.offsetmanager.bp;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.offsetmanager.dao.CurrentoffsetDAO;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Created by zhaodongchao on 2017/10/12.
 */
@Service
@Transactional
public class CurrentoffsetBp {

    @Autowired
    private CurrentoffsetDAO currentoffsetDAO;

    /**
     * 取凭证中的冲销挂账数据
     * @param jsonParams 查询数据时要用的参数的json封装
     * @param dataType 去数据类型，dataType=offset表示取冲销数据，dataType=onaccount表示取挂账数据
     * @return
     */
    public List<EntityMap> getVoucherData(ConditionMap jsonParams,String dataType){
        List<EntityMap> datas = new ArrayList<>();
        List<EntityMap> datas_voucher = currentoffsetDAO.getDataByVoucher(jsonParams);

        Object obj_money_form = jsonParams.getString("money_form");
	    Object obj_money_to = jsonParams.getString("money_to");
	    double money_form = 0;
	    double money_to = 0;
	    if(!obj_money_form.equals(""))
	    {	
	    	money_form = jsonParams.getDouble("money_form");
	    }
	    if(!obj_money_to.equals(""))
	    {
	    	money_to = jsonParams.getDouble("money_to");
	    }
        for(EntityMap em : datas_voucher){
            String isledge = em.getString("intisledge");
            String voucherType = em.getString("vouchertype");
            double debitMoney = em.getDouble("mnydebit");
            double creditMoney = em.getDouble("mnycredit");
            boolean isoffset = isOffset(voucherType,debitMoney,creditMoney);

            String ledgerIds = jsonParams.getString("ledger");
            String ledgertypes = jsonParams.getString("ledgertypeid");

            if ("offset".equals(dataType) && !isoffset){
                continue;
            }
            if ("onaccount".equals(dataType) && isoffset){
                continue;
            }
            if ("1".equals(isledge)){
                //表示存在分户，需要查询出分户分摊的所有记录
                String voucherDetailId = em.getString("uqvoucherdetailid");
                ledgerIds = currentoffsetDAO.createLedgeParams(ledgerIds,1);
                ledgertypes = currentoffsetDAO.createLedgeParams(ledgertypes,2);
                String ledgerParams = ledgerIds;
                if(!ledgerIds.equals("")){
                    ledgerParams = ledgerIds ;
                }
                if (!ledgerParams.equals("")&& !ledgertypes.equals("")){
                    ledgerParams += ","+ledgertypes ;
                }else {
                    ledgerParams += ledgertypes ;
                }
                List<EntityMap> ledgeVouchers = currentoffsetDAO.getLedgerVouDetail(voucherDetailId,ledgerParams);
                for (EntityMap ledgeVoucher : ledgeVouchers){
                    EntityMap ledge_voucher = new EntityMap() ;
                    double ledgeMoney = ledgeVoucher.getDouble("mnyamount") ;
                    if(!obj_money_form.equals("") && !obj_money_to.equals(""))
	                {
	                    if (money_form > ledgeMoney || ledgeMoney > money_to)
	                    {
	                        continue;
	                    }
	                }
	                if(!obj_money_form.equals("") && obj_money_to.equals(""))
	                {
	                    if (money_form > ledgeMoney)
	                    {
	                        continue;
	                    }
	                }
	                if(obj_money_form.equals("") && !obj_money_to.equals(""))
	                {
	                    if (ledgeMoney > money_to)
	                    {
	                        continue;
	                    }
	                }
                    ledge_voucher.putAll(em);
                    ledge_voucher.put("accountledgertype",ledgeVoucher.getString("varledgetypename"));
                    ledge_voucher.put("accountledger",ledgeVoucher.getString("varledgename"));
                    ledge_voucher.put("offsetmoney",ledgeMoney);
                    ledge_voucher.put("remainmoney",ledgeMoney);
                    ledge_voucher.put("uqledgeid",ledgeVoucher.getString("uqledgeid"));
                    ledge_voucher.put("uqledgetypeid",ledgeVoucher.getString("uqledgertypeid"));
                    datas.add(ledge_voucher);
                }
            }else{
                //增加金额过滤，由于在sql中添加金额过滤会导致有分户时的金额过滤无效，所以再java代码中实现过滤
                double offsetmoney = em.getDouble("offsetmoney") ;
                if(!obj_money_form.equals("") && !obj_money_to.equals(""))
                {
                    if (money_form > offsetmoney || offsetmoney > money_to)
                    {
                        continue;
                    }
                }
                if(!obj_money_form.equals("") && obj_money_to.equals(""))
                {
                    if (money_form > offsetmoney)
                    {
                        continue;
                    }
                }
                if(obj_money_form.equals("") && !obj_money_to.equals(""))
                {
                    if (offsetmoney > money_to)
                    {
                        continue;
                    }
                }
                if (!StringUtil.isNullString(ledgerIds) || !StringUtil.isNullString(ledgertypes) ){
                    continue;
                }
                datas.add(em);
            }


        }
        return datas;
    }


    /**
     * 根据凭证类型，借贷金额判断这种凭证是冲销或者是挂账
     * 应付、预收：借正（冲销），借负（挂账），贷正（挂账），贷负（冲销）
     * 应收、预付：借正（挂账），借负（冲销），贷正（冲销），贷负（挂账）
     * @param voucherType
     * @param debitMoney
     * @param creditMoney
     * @return true 表示冲销，false 表示挂账
     */
    private boolean isOffset(String voucherType,double debitMoney,double creditMoney){
        if (("应付".equals(voucherType) || "预收".equals(voucherType)) && debitMoney < 0){
            //挂账
            return false ;
        }
        if (("应付".equals(voucherType) || "预收".equals(voucherType)) && creditMoney > 0){
            //挂账
            return false ;
        }
        if (("应付".equals(voucherType) || "预收".equals(voucherType)) && debitMoney > 0){
            //冲销
            return true ;
        }
        if (("应付".equals(voucherType) || "预收".equals(voucherType)) && creditMoney < 0){
            //冲销
            return true ;
        }

        if (("应收".equals(voucherType) || "预付".equals(voucherType)) && debitMoney > 0){
            //挂账
            return false ;
        }
        if (("应收".equals(voucherType) || "预付".equals(voucherType)) && creditMoney < 0){
            //挂账
            return false ;
        }
        if (("应收".equals(voucherType) || "预付".equals(voucherType)) && debitMoney < 0){
            //冲销
            return true ;
        }
        if (("应收".equals(voucherType) || "预付".equals(voucherType)) && creditMoney > 0){
            //冲销
            return true ;
        }

        return true ;

    }
    public PageData<EntityMap> getOffsetDataPage(ConditionMap params, Integer start, Integer limit){
        List<EntityMap> datas = this.getOffsetData(params);
        this.sortData(datas);
        int end = start+limit ;
        if (end>datas.size()){
            end = datas.size();
        }
        return new PageData<>(datas.subList(start,end), datas.size());
    }
    public PageData<EntityMap> getOnaccountDataPage(ConditionMap params, Integer start, Integer limit){
    	List<EntityMap> datas = this.getOnaccountData(params);
        this.sortData(datas);
        int end = start+limit ;
        if (end>datas.size()){
            end = datas.size();
        }
        return new PageData<>(datas.subList(start,end), datas.size());
    }
    private void sortData(List<EntityMap> datas){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        EntityMap tmp = null ;
        int length = datas.size() ;
        for (int i = 0; i < length - 1; i++) {
            for (int j = 0; j < length - 1 - i; j++) {//内层循环控制每一趟排序多少次
                try {
                    long la = sdf.parse(datas.get(j).getString("accountdate")).getTime() ;
                    long lb = sdf.parse(datas.get(j + 1).getString("accountdate")).getTime() ;
                    if (la > lb)
                    {
                        tmp = datas.get(j);
                        datas.set(j,datas.get(j+1));
                        datas.set(j+1,tmp);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    public List<EntityMap> getOffsetData(ConditionMap params){
        List<EntityMap> datas = new ArrayList<>();
        //获取凭证中的冲销数据
        filterParams(params);
        List<EntityMap> datas_voucher = getVoucherData(params,"offset");
        datas.addAll(datas_voucher);
        // 获取往来初始化中的冲销数据
        List<EntityMap> datas_init = currentoffsetDAO.getOffsetInitDatas(2,params);
        datas.addAll(datas_init);
        // 取往来表中冲销记录。对比后排除掉余额为0的数据,并且计算已冲金额和余额
        return filterData(datas,1,params);
    }
    public List<EntityMap> getOnaccountData(ConditionMap params){
        List<EntityMap> datas = new ArrayList<>();
        //获取凭证中的挂账数据
        filterParams(params);
        List<EntityMap> datas_voucher = getVoucherData(params,"onaccount");
        datas.addAll(datas_voucher);
        // 获取往来初始化中的挂账数据
        List<EntityMap> datas_init = currentoffsetDAO.getOffsetInitDatas(1,params);
        datas.addAll(datas_init);
        //取往来表挂账记录。对比后排除掉余额为0的数据，并且计算已冲金额和余额
        return filterData(datas,2,params);
    }

    public void doOffset(String offsetDatas,String onaccountDatas)throws Exception{
        JSONArray offset_datas = JSONArray.fromObject(offsetDatas);
        JSONArray onaccount_datas = JSONArray.fromObject(onaccountDatas);
        this.dataCheck(offset_datas,onaccount_datas);
        //开始冲销
        for (int i=0 ; i<offset_datas.size() ; i++)
        {
            doRush(offset_datas.getJSONObject(i),onaccount_datas);
        }
    }
    private void doRush(JSONObject mainRecord,JSONArray detailRecords){
        //生成批次号，对一笔冲销记录进行冲销时，所有被冲销的挂账明细记录，以及这笔冲销记录对应的明细记录的批次号相同
        //一次操作主记录在往来信息记录主表中只会有一条记录，明细表也只有一条，
        String uqbatchid = UUID.randomUUID().toString().toUpperCase();
        mainRecord.put("uqbatchid",uqbatchid);

        //生成主记录ID
        String uqmainid = UUID.randomUUID().toString().toUpperCase();
        mainRecord.put("uqmainid",uqmainid);

        //直接先插入一条初始化的主记录对应的核销金额为0明细记录
        mainRecord.put("money",0);
        //生成明细记录的主键
        String main_uqdetailid = UUID.randomUUID().toString();
        mainRecord.put("uqdetailid",main_uqdetailid);
        currentoffsetDAO.insertOffsetDetail(mainRecord,uqmainid);

        boolean mainFlag = true ; //主记录付款金额正负的标识，默认为true表示正，false表示负
        boolean detailFlag = true ;//待冲销详细记录付款金额正负的标识，默认为true表示正，false表示负


        for(int n=0 ; n< detailRecords.size();n++) {

            double main_yetMoney = parseToNumber(mainRecord.getDouble("yetmoney"));//已冲金额
            double main_remainMoney =parseToNumber(mainRecord.getDouble("remainmoney")) ;//未冲金额

            //如果主记录被冲销完，则结束此过程,正常情况未冲金额等于0
            if (main_remainMoney == 0){
                return ;
            }
            double detail_yetmoney = parseToNumber(detailRecords.getJSONObject(n).getDouble("yetmoney"));//已冲金额
            double detail_remainmoney = parseToNumber(detailRecords.getJSONObject(n).getDouble("remainmoney"));//未冲金额
            if (detail_remainmoney == 0){
                //未冲金额需要大于0,否则冲下一条
                continue;
            }

            double main_offsetMoney = mainRecord.getDouble("offsetmoney");
            double detail_offsetMoney = detailRecords.getJSONObject(n).getDouble("offsetmoney");

            if (main_offsetMoney < 0){
                mainFlag = false ;
            }
            if (detail_offsetMoney < 0 ){
                detailFlag = false ;
            }

            if (main_remainMoney >= detail_remainmoney){
                //直接冲销,已冲金额为：ac_remainMoney ，未冲金额为remain=os_remainMoney-ac_remainMoney
                mainRecord.put("yetmoney",formatMoney(main_yetMoney + detail_remainmoney,mainFlag));
                mainRecord.put("remainmoney",formatMoney(main_remainMoney - detail_remainmoney,mainFlag));
                mainRecord.put("money",formatMoney(detail_remainmoney,mainFlag));

                detailRecords.getJSONObject(n).put("yetmoney",formatMoney(detail_yetmoney + detail_remainmoney,detailFlag));
                detailRecords.getJSONObject(n).put("remainmoney",0);//此时挂账记录被冲销完，余额为0
                detailRecords.getJSONObject(n).put("money",formatMoney(detail_remainmoney,detailFlag));//money为本次核销的金额
            }else{
                //冲销记录的未冲金额小于挂账记录的挂账余额
                //此时，冲销记录的未冲金额变为0
                mainRecord.put("yetmoney",formatMoney(main_yetMoney + main_remainMoney,mainFlag));//已冲金额为自己的未冲金额
                mainRecord.put("remainmoney",0);//此时冲销记录已经被冲销完成，未冲金额为0
                mainRecord.put("money",formatMoney(main_remainMoney,mainFlag));//此次核销的金额为冲销记录的未冲金额

                detailRecords.getJSONObject(n).put("yetmoney",formatMoney(detail_yetmoney + main_remainMoney,detailFlag));
                detailRecords.getJSONObject(n).put("remainmoney",formatMoney(detail_remainmoney-main_remainMoney,detailFlag));//此时挂账记录没有被冲销完，余额为ac_remainMoney-os_remainMoney
                detailRecords.getJSONObject(n).put("money",formatMoney(main_remainMoney,detailFlag));//money为本次核销的金额
            }
            //查询往来表中是否已经存在这条记录的冲销记录信息
            List<EntityMap> main_existrecords = currentoffsetDAO.getExistInMain(mainRecord) ;
            if (main_existrecords.size() > 0){
                //冲销操作时，正常情况对于这笔冲销记录，如果存在主表中，那么也只有一条类型为冲销的此记录,此时更新往来主表冲销记录
                uqmainid = main_existrecords.get(0).getString("uqmainid");
                mainRecord.put("uqmainid",uqmainid);
                currentoffsetDAO.updateMaindata(mainRecord,uqmainid);
            }else {
                //添加主表新冲销记录
                currentoffsetDAO.insertOffsetData(mainRecord,uqmainid);
            }
            //更新主记录对应的明细记录
            currentoffsetDAO.updateOffsetDetail(main_uqdetailid,mainRecord.getDouble("money"),mainRecord.getString("uqmainid"));

            List<EntityMap>  onaccount_existrecords = currentoffsetDAO.getExistInMain(detailRecords.getJSONObject(n)) ;

            String detail_mainid = UUID.randomUUID().toString().toUpperCase();
            if(onaccount_existrecords.size()>0){
                //冲销操作时，对于这笔挂账记录，如果在主表中存在。那么也只有一条类型为挂账的此记录，此时更新这条主记录
                detail_mainid = onaccount_existrecords.get(0).getString("uqmainid") ;
                detailRecords.getJSONObject(n).put("uqmainid",detail_mainid);
                currentoffsetDAO.updateMaindata(detailRecords.getJSONObject(n),detail_mainid);
            }else{
                //添加主表挂账记录
                currentoffsetDAO.insertOffsetData(detailRecords.getJSONObject(n),detail_mainid);
            }
            detailRecords.getJSONObject(n).put("uqdetailid",UUID.randomUUID().toString());
            detailRecords.getJSONObject(n).put("uqbatchid",uqbatchid);
            currentoffsetDAO.insertOffsetDetail(detailRecords.getJSONObject(n),detail_mainid);

        }
    }
    private  void dataCheck(JSONArray mainRecords,JSONArray detailRecords) throws Exception{
        String rush_flag = getSystemConfig("rush_flag");
        for (int i=0 ; i<mainRecords.size() ; i++)
        {
            String main_accountId = mainRecords.getJSONObject(i).getString("uqaccountid");
            String main_ledgeTypeId = mainRecords.getJSONObject(i).getString("uqledgetypeid");
            String main_ledgeId = mainRecords.getJSONObject(i).getString("uqledgeid");
            for (int j=0 ; j<detailRecords.size();j++)
            {
                String detail_accountId = detailRecords.getJSONObject(j).getString("uqaccountid");
                String detail_ledgeTypeId = detailRecords.getJSONObject(j).getString("uqledgetypeid");
                String detail_ledgeId = detailRecords.getJSONObject(j).getString("uqledgeid");

                if ("T".equals(rush_flag))
                {
                    if (main_accountId.equals(detail_accountId)&&main_ledgeTypeId.equals(detail_ledgeTypeId)&&main_ledgeId.equals(detail_ledgeId)){
                        continue;
                    }else {
                        throw new IllegalAccessException("科目及分户不同，不能冲销");
                    }
                }else {
                    if (main_accountId.equals(detail_accountId)){
                        continue;
                    }else {
                        throw new IllegalAccessException("科目不同，不能冲销");
                    }
                }
            }
        }
    }
    private double parseToNumber(double value){
        if (value >=0){
            return value;
        }else {
            return (0-value) ;
        }
    }
    private double formatMoney(double value, boolean type){
        if (type){
            return value ;
        }else {
            return 0-value;
        }
    }
    private String getSystemConfig(String paramCode){
        String rush_flag ="T";//默认为T
        try {
            rush_flag = currentoffsetDAO.getSystemConfig(paramCode);
        } catch (Exception e) {
        }

        return rush_flag ;
    }
    private List<EntityMap> filterData(List<EntityMap> data ,int type,ConditionMap params){
    	if (data.size() == 0){
            return data ;
        }
        List<EntityMap> results = new ArrayList<>();
        //根据状态过滤，0全部，1未冲销，2已经冲销（包含全部冲销和部分冲销）
        String status = params.getString("intstatus");
        //判断是主界面请求数据还是窗口
        int isWindow = params.getInteger("iswindow");
        for (EntityMap entityMap : data){
            entityMap.put("inttype",type);//添加数据类型字段，区分改条记录是冲销数据还是挂账数据
            String voucherDetailId = entityMap.getString("uqvoucherdetailid");
            String initId = entityMap.getString("iniid");
            String ledgeId = entityMap.getString("uqledgeid");

            List<EntityMap> rushData = currentoffsetDAO.getRushData(voucherDetailId,ledgeId,initId,type);
            if (rushData.size() == 0){
                double yetmoney = entityMap.getDouble("yetmoney");
                if (status.equals("1")){
                    if (yetmoney != 0 ){//已冲金额不等于0，表示发生过冲销，过滤掉
                        continue;
                    }
                }
                if (status.equals("2")){
                    if (yetmoney == 0){
                        continue;
                    }
                }
                if (isWindow == 1 && entityMap.getDouble("remainmoney") == 0){
                    continue;
                }
                entityMap.put("uqmainid","");
                results.add(entityMap);
            }else {
                //正常情况如果存在数据，有且只有一条
                String uqmainid = rushData.get(0).getString("uqmainid");
                double rushedmoney = rushData.get(0).getDouble("rushedmoney");
                double notRushedMoney = rushData.get(0).getDouble("notrushedmoney");
                if (status.equals("1")){
                    if (rushedmoney != 0){
                        continue;//过滤掉
                    }
                }
                if (status.equals("2")){
                    if (rushedmoney == 0){
                        continue;
                    }
                }
                if (isWindow == 1 && notRushedMoney == 0){
                    continue;
                }
                entityMap.put("yetmoney",rushedmoney);
                entityMap.put("remainmoney",notRushedMoney);
                entityMap.put("uqmainid",uqmainid);
                results.add(entityMap);
            }
        }
        return  results ;
    }
    private void filterParams(ConditionMap params){
        int isWindow = params.getInteger("iswindow");
        if(isWindow == 1){
            String rush_flag = getSystemConfig("rush_flag");
            if (rush_flag.equals("F")){
                params.put("ledger","");
                params.put("ledgertypeid","");
            }
        }
    }
    /**
     * 人工匹配
     * @param mainData 封装主记录信息的JSONObject的字符串形式
     * @param detaildatas 封装详细记录信息集合的JSONArray的字符串形式
     */
    public void doManualRush(String mainData, String detaildatas) {
        JSONObject main_data = JSONObject.fromObject(mainData);
        JSONArray detail_datas = JSONArray.fromObject(detaildatas);
        //生成批次号
        String uqbatchid = UUID.randomUUID().toString().toUpperCase();//生成批次号
        main_data.put("uqbatchid",uqbatchid);
        //保存主记录
        List<EntityMap> existRecords = currentoffsetDAO.getExistInMain(main_data);

        String mainId = UUID.randomUUID().toString() ;
        if (existRecords.size() > 0){
            mainId = existRecords.get(0).getString("uqmainid");
            currentoffsetDAO.updateMaindata(main_data,mainId);
        }else{
            currentoffsetDAO.insertOffsetData(main_data,mainId);
        }
        main_data.put("uqdetailid",UUID.randomUUID().toString());
        currentoffsetDAO.insertOffsetDetail(main_data,mainId);

        for(int n=0 ; n< detail_datas.size();n++)
        {
            JSONObject detail_data = detail_datas.getJSONObject(n);
            detail_data.put("uqbatchid",uqbatchid);
            List<EntityMap> existDetailRecords = currentoffsetDAO.getExistInMain(detail_data);
            String detail_mainid = UUID.randomUUID().toString();
            if (existDetailRecords.size() > 0){
                detail_mainid = existDetailRecords.get(0).getString("uqmainid") ;
                currentoffsetDAO.updateMaindata(detail_data,detail_mainid);
            }else {
                currentoffsetDAO.insertOffsetData(detail_data,detail_mainid);
            }
            detail_data.put("uqdetailid",UUID.randomUUID().toString());
            currentoffsetDAO.insertOffsetDetail(detail_data,detail_mainid);
        }
    }

    /**
     * 还原冲销
     * @param revertRecords 要还原的记录集合的字符串形式
     */
    public void revertRush(String revertRecords) {
        JSONArray records = JSONArray.fromObject(revertRecords);
        for (int i=0 ; i< records.size() ; i++){
            String uqmainid = records.getJSONObject(i).getString("uqmainid");
            int inttype = records.getJSONObject(i).getInt("inttype");
            //找出对应的详细记录
            List<EntityMap> opDetails = currentoffsetDAO.queryAllOpDetails(uqmainid,inttype,this.getOppType(inttype));
            //删除本方明细记录
            currentoffsetDAO.deleteAllDetails(uqmainid,inttype);
            //删除本方主数据
            currentoffsetDAO.deleteMainRecord(uqmainid);

            //更新对应的详细记录对应的主记录
            for (EntityMap opDetail :opDetails){
                String opMainId = opDetail.getString("uqmainid");
                String opdetailId = opDetail.getString("uqdetailid");
                double opmoney = opDetail.getDouble("opmoney");
                double money = opDetail.getDouble("money"); //选中的这条要撤销记录明细记录中的冲销

                boolean opFlag = true ;

                if (opmoney<0){
                    opFlag = false ;
                }

                opmoney = this.parseToNumber(opmoney);
                money = this.parseToNumber(money);

                List<EntityMap> opMain = currentoffsetDAO.getMain(opMainId);//要撤销的明细记录对应的主记录

                double rushedmoney = this.parseToNumber(opMain.get(0).getDouble("rushedmoney"));
                double notrushedmoney = this.parseToNumber(opMain.get(0).getDouble("notrushedmoney"));

                double update_rushedmoney_main  ;
                double update_norushedmoney_main ;

                double update_money_detail ;
                if (opmoney <= money){
                    //删除此条明细
                    currentoffsetDAO.deleteDetail(opdetailId);
                    //判断此条明细对应的主记录是否存在其他冲销明细
                    if(rushedmoney > opmoney){
                        update_rushedmoney_main = this.formatMoney(rushedmoney - opmoney ,opFlag);
                        update_norushedmoney_main = this.formatMoney(notrushedmoney + opmoney,opFlag) ;
                        currentoffsetDAO.updateMain(opMainId,update_rushedmoney_main,update_norushedmoney_main);
                    }else {
                        currentoffsetDAO.deleteMainRecord(opMainId);
                    }
                }else{
                    update_money_detail = this.formatMoney(opmoney - money,opFlag) ;
                    update_rushedmoney_main = this.formatMoney(rushedmoney - money,opFlag) ;
                    update_norushedmoney_main = this.formatMoney(notrushedmoney + money,opFlag) ;
                    currentoffsetDAO.updateDetail(opdetailId,update_money_detail);
                    currentoffsetDAO.updateMain(opMainId,update_rushedmoney_main,update_norushedmoney_main);

                }
            }
            //删除掉本次冲销金额为0的明细数据
            currentoffsetDAO.deleteDetailForEmpty();

        }

    }
    private int getOppType(int type){
        if (type == 1){
            return 2 ;
        }else if (type == 2){
            return 1 ;
        }else {
            throw new IllegalArgumentException("getOppType方法的参数值必须是1或者2");
        }
    }
}
