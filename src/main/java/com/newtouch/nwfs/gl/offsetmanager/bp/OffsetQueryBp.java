package com.newtouch.nwfs.gl.offsetmanager.bp;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.offsetmanager.dao.OffsetQueryDAO;
/**
 * 往来查询业务层
 * @author xtc
 * date: 2017/12/22
 */
@Service
@Transactional
public class OffsetQueryBp {
	
	/*
	 * 根据条件查询往来数据
	 */
	@Autowired
	private OffsetQueryDAO offsetqueryDao;
	public PageData<EntityMap> getDataPage(ConditionMap cdtMap, Integer start, Integer limit) 
	{	
		 List<EntityMap> datas = this.getOffsetData(cdtMap);
	     int end = start + limit ;
	     if (end > datas.size())
	     {
	         end = datas.size();
	     }
	     return new PageData<>(datas.subList(start, end), datas.size());
	}
	private List<EntityMap> getOffsetData(ConditionMap cdtMap) {
	     //获取凭证中的冲销数据
	     List<EntityMap> datas_voucher = getVoucherData(cdtMap);
	     // 获取往来初始化中的冲销数据
	     List<EntityMap> datas_init = offsetqueryDao.getOffsetInitDatas(cdtMap);
	     List<EntityMap> list = new ArrayList<>();
	     list.addAll(datas_voucher);
	     list.addAll(datas_init);	     
	     //对数据按照记账日期重新进行排序
	     for(int i = 1; i < list.size(); i++){
	    	 EntityMap temp = list.get(i);
             int j = i - 1;
             while (j >= 0 && Integer.valueOf(list.get(j).getString("accountdate").replaceAll("-", "")) > Integer.valueOf(temp.getString("accountdate").replaceAll("-", "")))
             {
                 list.set(j + 1, list.get(j));
                 j--;
             }
             list.set(j + 1, temp);
     }		     
	     // 取往来表中冲销记录。对比后排除掉余额为0的数据,并且计算已冲金额和余额
	     return filterData(list, cdtMap);
	}
	/*
	 * 获取凭证数据
	 */
	private List<EntityMap> getVoucherData(ConditionMap cdtMap){
		List<EntityMap> datas = new ArrayList<>();
	    List<EntityMap> datas_voucher = offsetqueryDao.getDataByVoucher(cdtMap);
	    Object obj_money_form = cdtMap.getString("money_form");
	    Object obj_money_to = cdtMap.getString("money_to");
	    double money_form = 0;
	    double money_to = 0;
	    if(!obj_money_form.equals(""))
	    {	
	    	money_form = cdtMap.getDouble("money_form");
	    }
	    if(!obj_money_to.equals(""))
	    {
	    	money_to = cdtMap.getDouble("money_to");
	    }
        Object dataType = cdtMap.getString("offsettype");
        String ledgerIds = cdtMap.getString("ledger");
        String ledgertypes = cdtMap.getString("ledgertypeid");
	    for(EntityMap em : datas_voucher)
	    {	
	    	String isledge = em.getString("intisledge");
	        String voucherType = em.getString("vouchertype");
	        double debitMoney = em.getDouble("mnydebit");
	        double creditMoney = em.getDouble("mnycredit");
	        String accountingperiod = em.getString("accountingperiod");
	        boolean isoffset = isOffset(voucherType,debitMoney,creditMoney);
	        if ("1".equals(dataType) && !isoffset)
	        {
	        	continue;
	        }
	        if ("2".equals(dataType) && isoffset)
	        {
	            continue;
	        }
	        if ("1".equals(isledge))
	        {
	        	//表示存在分户，需要查询出分户分摊的所有记录
	            String voucherDetailId = em.getString("uqvoucherdetailid");
	            String newledgerIds = offsetqueryDao.createLedgeParams(ledgerIds,1);
	            String newledgertypes = offsetqueryDao.createLedgeParams(ledgertypes,2);
	            String ledgerParams = newledgerIds;
	            if(!newledgerIds.equals(""))
	            {
	            	ledgerParams = newledgerIds ;
	            }
	            if (!ledgerParams.equals("")&& !newledgertypes.equals(""))
	            {
	                ledgerParams += ","+newledgertypes ;
	            }
	            else 
	            {
	                ledgerParams += newledgertypes ;
	            }
	            List<EntityMap> ledgeVouchers = offsetqueryDao.getLedgerVouDetail(voucherDetailId,ledgerParams);
	            for (EntityMap ledgeVoucher : ledgeVouchers)
	            {
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
	                ledge_voucher.put("accountledgertype", ledgeVoucher.getString("varledgetypename"));
	                ledge_voucher.put("accountledger", ledgeVoucher.getString("varledgename"));
	                ledge_voucher.put("offsetmoney", ledgeMoney);
	                ledge_voucher.put("remainmoney", ledgeMoney);
	                ledge_voucher.put("accountingperiod", accountingperiod);
	                ledge_voucher.put("uqledgeid", ledgeVoucher.getString("uqledgeid"));
	                ledge_voucher.put("uqledgetypeid", ledgeVoucher.getString("uqledgertypeid"));
	                datas.add(ledge_voucher);
	            }
	        }
	        else
	        {
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
	            if(!StringUtil.isNullString(ledgerIds) || !StringUtil.isNullString(ledgertypes) )
	            {
	                continue;
	            }
	             datas.add(em);
	        }
	    }
	    return datas;
	}
	private List<EntityMap> filterData(List<EntityMap> data, ConditionMap cdtMap) {
		if (data.size() == 0)
		{
	        return data ;
	    }
	    List<EntityMap> results = new ArrayList<>();
	    //根据状态过滤，0全部，1未冲销，2已经冲销（包含全部冲销和部分冲销）
	    String status = cdtMap.getString("intstatus");
	    //判断是主界面请求数据还是窗口
	    int isWindow = cdtMap.getInteger("iswindow");
	    Object type = cdtMap.getString("offsettype");
	    for (EntityMap entityMap : data)
	    {
	    	if(!"".equals(entityMap.getString("voucherType")) && entityMap.getString("voucherType") != null)
	    	{
	    		String voucherType = entityMap.getString("vouchertype");
		        double debitMoney = entityMap.getDouble("mnydebit");
		        double creditMoney = entityMap.getDouble("mnycredit");
	    		boolean isoffset = isOffset(voucherType, debitMoney, creditMoney);
	    		if(isoffset)
	    		{
	    			entityMap.put("offsettype", "冲销");
	    		}
	    		else
	    		{
	    			entityMap.put("offsettype", "挂账");
	    		}
	    	}
	    	if(!"".equals(entityMap.getString("inttype")) && entityMap.getString("inttype") != null)
	    	{
	    		if("1".equals(entityMap.getString("inttype")))
	    		{
	    			entityMap.put("offsettype", "挂账");
	    		}
	    		else
	    		{
	    			entityMap.put("offsettype", "冲销");
	    		}
	    	}
	    	if("全部".equals(type))
	    	{
	    		entityMap.put("inttype", 0);
	    	}
	    	else
	    	{
	    		entityMap.put("inttype", type);//添加数据类型字段，区分改条记录是冲销数据还是挂账数据 
	        }	
	        String voucherDetailId = entityMap.getString("uqvoucherdetailid");
	        String initId = entityMap.getString("iniid");
	        String ledgeId = entityMap.getString("uqledgeid");
	        List<EntityMap> rushData = offsetqueryDao.getRushData(voucherDetailId, ledgeId, initId, type);
	        if (rushData.size() == 0)
	        {
	            double yetmoney = entityMap.getDouble("yetmoney");
	            if (status.equals("1"))
	            {
	                if (yetmoney != 0 )
	                {
	                	//已冲金额不等于0，表示发生过冲销，过滤掉
	                    continue;
	                }
	            }
	            if (status.equals("2"))
	            {
	                if (yetmoney == 0)
	                {
	                    continue;
	                }
	            }
	            if (isWindow == 1 && entityMap.getDouble("remainmoney") == 0)
	            {
	                continue;
	            }
	                entityMap.put("uqmainid","");
	                results.add(entityMap);
	            }
	        	else
	        	{
	                //正常情况如果存在数据，有且只有一条
	                String uqmainid = rushData.get(0).getString("uqmainid");
	                double rushedmoney = rushData.get(0).getDouble("rushedmoney");
	                double notRushedMoney = rushData.get(0).getDouble("notrushedmoney");
	                if (status.equals("1"))
	                {
	                    if (rushedmoney != 0)
	                    {
	                        continue;//过滤掉
	                    }
	                }
	                if (status.equals("2"))
	                {
	                    if (rushedmoney == 0)
	                    {
	                        continue;
	                    }
	                }
	                if (isWindow == 1 && notRushedMoney == 0)
	                {
	                    continue;
	                }
	                entityMap.put("yetmoney", rushedmoney);
	                entityMap.put("remainmoney", notRushedMoney);
	                entityMap.put("uqmainid", uqmainid);
	                results.add(entityMap);
	            }
	    }
	    TreeMap<Object, List<EntityMap>> map = new TreeMap<Object, List<EntityMap>>();
	     for(EntityMap em : results)
	     {
	    	 String date = em.getString("accountdate");
	    	 if(map.containsKey(date))
	    	 {	
	    		 List<EntityMap> addlist = map.get(date);
	    		 addlist.add(em);
	    		 map.put(date, addlist);
	    		 continue;
	    	 }
	    	 else
	    	 {	
	    		 List<EntityMap> newlist = new ArrayList<EntityMap>();
	    		 newlist.add(em);
	    		 map.put(date, newlist);
	    	 }
	     }		
	     List<EntityMap> finallist = new ArrayList<EntityMap>();
	     for(Entry<Object, List<EntityMap>> en : map.entrySet())
	     {
	    	 List<EntityMap> maplist = en.getValue();
	    	 TreeMap<Object, List<EntityMap>> secmap = new TreeMap<Object, List<EntityMap>>();
	    	 for(EntityMap secem : maplist)
	    	 {
	    		 if(secmap.containsKey(secem.getString("offsettype")))	    			 
	    		 {
	    			 List<EntityMap> llist = secmap.get(secem.getString("offsettype"));
	    			 llist.add(secem);
	    			 secmap.put(secem.getString("offsettype"), llist);
	    		 }
	    		 else
	    		 {
	    			 List<EntityMap> nlist = new ArrayList<EntityMap>();
	    			 nlist.add(secem);
	    			 secmap.put(secem.getString("offsettype"), nlist);
	    		 }
	    	 }	
	    	
	    	 for(Entry<Object, List<EntityMap>> ens : secmap.entrySet())
	    	 {	
	    		 
	    		 finallist.addAll(ens.getValue());
	    	 }
	     }
	     return  finallist;
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
    
    /*
     * 查询往来明细
     */
	public PageData<EntityMap> getdetail(ConditionMap cdtMap, Integer start, Integer limit) throws NumberFormatException, ParseException 
	{	
		//获取相关批次号
		List<EntityMap> batchid_list = new ArrayList<EntityMap>();
		batchid_list = offsetqueryDao.getbatchids(cdtMap);
		List<EntityMap> datas = new ArrayList<EntityMap>();
		//根据批次号查询相关往来数据
		for(EntityMap em : batchid_list)
		{			
			String id = em.getString("batchid");
			//该批次号的关联数据
			List<EntityMap> datalist = new ArrayList<EntityMap>();
			datalist = offsetqueryDao.getdetail(cdtMap, id);
			if(datalist.size() == 2)
			{
				EntityMap data = new EntityMap();
				for(EntityMap entitymap : datalist)
				{		
					if(entitymap.getString("mainid").equals(cdtMap.getString("uqmainid")))
					{
						data.put("yetmoney", entitymap.getDouble("money"));
						continue;
					}
					if(!data.containsKey("yetmoney"))
					{
						data.put("yetmoney", entitymap.getDouble("money"));
					}
					//找到数据，查询数据其他信息						
					data.put("offsetuser", entitymap.getString("offsetuser"));
					data.put("offsetdate", datalist.get(0).getString("offsetdate"));
					data.put("accountledgertype", entitymap.getString("ledgetype"));
					data.put("accountledger", entitymap.getString("ledge"));
					datas.add(this.getotherdata(entitymap.getString("initid"), data, entitymap));
				}
			}
			else if(datalist.size() > 2)
			{	
				//最大数值是本身,对应数据多条
				if(datalist.get(0).getString("mainid").equals(cdtMap.getString("uqmainid")))
				{
					boolean isplus = false;
					for(EntityMap entitymap : datalist)
					{
						EntityMap data = new EntityMap();
						//把自己过滤掉
						if(entitymap.getString("mainid").equals(cdtMap.getString("uqmainid")))
						{
							if(entitymap.getDouble("money") > 0)
							{
								isplus = true;
							}
							continue;
						}
						if(isplus)
						{
							data.put("yetmoney", Math.abs(entitymap.getDouble("money")));
						}
						else
						{
							data.put("yetmoney", - Math.abs(entitymap.getDouble("money")));
						}
						
						data.put("offsetuser", entitymap.getString("offsetuser"));
						data.put("offsetdate", datalist.get(0).getString("offsetdate"));
						data.put("accountledgertype", entitymap.getString("ledgetype"));
						data.put("accountledger", entitymap.getString("ledge"));
						datas.add(this.getotherdata(entitymap.getString("initid"), data, entitymap));
					}
				}
				//最大数值不是本身,对应数据一条(datalist.get(0)),冲销金额为本身
				else
				{	
					EntityMap data = new EntityMap();
					for(EntityMap entitymap : datalist)
					{			
						if(entitymap.getString("mainid").equals(cdtMap.getString("uqmainid")))
						{
							data.put("yetmoney", entitymap.getDouble("money"));
						}
					}
					data.put("offsetuser", datalist.get(0).getString("offsetuser"));
					data.put("offsetdate", datalist.get(0).getString("offsetdate"));
					data.put("accountledgertype", datalist.get(0).getString("ledgetype"));
					data.put("accountledger", datalist.get(0).getString("ledge"));
					datas.add(this.getotherdata(datalist.get(0).getString("initid"), data, datalist.get(0)));
				}
			}
		}
	    //对数据按照冲销日期重新进行排序
		SimpleDateFormat sdf = new SimpleDateFormat("YYYYMMDDHHmmss");
		SimpleDateFormat sdft = new SimpleDateFormat("YYYY-MM-DD HH:mm:ss");
	     for(int i = 1; i < datas.size(); i++){
	    	 EntityMap temp = datas.get(i);
            int j = i - 1;
            while (j >= 0 && Long.valueOf(sdf.format(sdft.parse(datas.get(j).getString("offsetdate"))))< Long.valueOf(sdf.format(sdft.parse(temp.getString("offsetdate")))))
            {
            	datas.set(j + 1, datas.get(j));
                j--;
            }
            datas.set(j + 1, temp);
    }	
	    int end = start + limit ;
	    if (end > datas.size())
	    {
	        end = datas.size();
	    }
	    return new PageData<>(datas.subList(start, end), datas.size());
	}
	
	public EntityMap getotherdata(String initid, EntityMap data, EntityMap entitymap){
		if(entitymap.getString("initid").equals(""))
		{
			//凭证数据
			data.put("isrelate", "是");
			List<EntityMap> thisdata = new ArrayList<EntityMap>();
			thisdata = offsetqueryDao.getvoucherdata(entitymap.getString("voucherid"), entitymap.getString("voucherdetailid"));
			data.put("voucherid", thisdata.get(0).getString("voucherid"));
			data.put("uqaccountid", thisdata.get(0).getString("uqaccountid"));
			data.put("accountcode", thisdata.get(0).getString("accountcode"));
			data.put("perioddate", thisdata.get(0).getString("perioddate"));
			data.put("accountdate", thisdata.get(0).getString("accountdate"));
			data.put("intvouchernum", thisdata.get(0).getString("intvouchernum"));
			data.put("accountuser", thisdata.get(0).getString("accountuser"));
			data.put("varabstract", thisdata.get(0).getString("varabstract"));
		}
		//初始化数据
		else
		{
			data.put("isrelate", "否");
			List<EntityMap> thisdata = new ArrayList<EntityMap>();
			thisdata = offsetqueryDao.getinitdata(entitymap.getString("initid"));
			data.put("voucherid", "");
			data.put("uqaccountid", thisdata.get(0).getString("uqaccountid"));
			data.put("accountcode", thisdata.get(0).getString("accountcode"));
			data.put("accountdate", thisdata.get(0).getString("accountdate"));
			data.put("accountuser", thisdata.get(0).getString("accountuser"));
			data.put("varabstract", thisdata.get(0).getString("varabstract"));
		}	
		return data;
	}
			
}
