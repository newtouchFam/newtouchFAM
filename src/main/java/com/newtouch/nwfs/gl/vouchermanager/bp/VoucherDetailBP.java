package com.newtouch.nwfs.gl.vouchermanager.bp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.xml.rpc.holders.StringHolder;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.nwfs.gl.offsetmanager.bp.CurrentoffsetBp;
import com.newtouch.nwfs.gl.vouchermanager.dao.VoucherDetailDAO;
import com.newtouch.nwfs.gl.vouchermanager.entity.NumberingEntity;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherDetail;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherMain;
import com.newtouch.nwfs.gl.vouchermanager.util.CommonHelper;

@Service
@Transactional
public class VoucherDetailBP
{
	@Autowired
	public VoucherDetailDAO voucherDetailDAO;
	@Autowired
    private CurrentoffsetBp currentoffsetBp;
	
	public List<VoucherDetail> parseVoucherDetail(String jsonVoucherDetail,String voucherid) throws Exception
	{
		JSONArray jsondetailinfo = JSONArray.fromObject(jsonVoucherDetail);
		
		List<VoucherDetail> details = new ArrayList<VoucherDetail>();
		
		for(int i = 0; i < jsondetailinfo.size(); i++)
		{
			JSONObject vouobj = jsondetailinfo.getJSONObject(i);
			VoucherDetail detail = new VoucherDetail();
			
			//查删改是传递主键过来的
			if(StringUtil.isNullString(vouobj.getString("uqvoucherdetailid")))
			{
				detail.setUqvoucherdetailid(UUID.randomUUID().toString().toUpperCase());
			}
			else
			{
				detail.setUqvoucherdetailid(vouobj.getString("uqvoucherdetailid"));
			}
			
			detail.setUqvoucherid(voucherid);
			detail.setIntseq(i+1);
			detail.setUqaccountid(vouobj.getString("uqaccountid"));
			detail.setVarabstract(vouobj.getString("varabstract"));
			if(vouobj.getString("mnydebit") == null|| vouobj.getString("mnydebit").equals(""))
			{
				detail.setMnydebit(new BigDecimal(0));
			}
			else
			{
				detail.setMnydebit(new BigDecimal(vouobj.getString("mnydebit")));
			}
			if(vouobj.getString("mnycredit") == null|| vouobj.getString("mnycredit").equals(""))
			{
				detail.setMnycredit(new BigDecimal(0));
			}
			else
			{
				detail.setMnycredit(new BigDecimal(vouobj.getString("mnycredit")));
			}
			details.add(detail);
			
			//处理分户信息
			String voudetailledgertype = vouobj.getString("accountledgertype");
			if(!StringUtil.isNullString(voudetailledgertype))
			{
				Map<String, BigDecimal> itemLedgerTypeMap = new HashMap<String, BigDecimal>();
				JSONArray jsonledgertype = JSONArray.fromObject(voudetailledgertype);
				
				for (int j = 0; j < jsonledgertype.size(); j++)
				{
					JSONObject jsonobjledgertype = jsonledgertype.getJSONObject(j);
					
					String uqledgertypeid = jsonobjledgertype.getString("ledgetypeid");
					
					int intseq = j + 1;
					
					String voudetailid = detail.getUqvoucherdetailid();
					String uqvoucherid = detail.getUqvoucherid();
					String uqvouledgertypeid = UUID.randomUUID().toString().toUpperCase();
					
					this.voucherDetailDAO.saveVoucherDetailLedgerType(uqvouledgertypeid, uqledgertypeid, uqvoucherid, voudetailid, intseq);
				}
				
				String voudetailledger = vouobj.getString("accountledger");
				JSONArray jsonledgerall = JSONArray.fromObject(voudetailledger);
				//分录分户明细处理
				for (int j = 0; j < jsonledgerall.size(); j++)
				{
					//save
					JSONObject jsonobjledgerall = jsonledgerall.getJSONObject(j);
					String uqledgertypeid = jsonobjledgerall.getString("ledgertypeid");
					
					JSONArray jsonledger = jsonobjledgerall.getJSONArray("ledgerdata");
					
					int intseq = 0;
					
					for(int k = 0; k < jsonledger.size(); k++)
					{
						JSONObject jsonobjledger = jsonledger.getJSONObject(k);
						
						BigDecimal money = null;
						
						if(jsonobjledger.getString("money") == null || jsonobjledger.getString("money").equals("")  
								|| jsonobjledger.getString("money").equals("0"))
						{
							continue;
						}
						else
						{
							money = new BigDecimal(jsonobjledger.getString("money"));
							intseq ++;
						}
						
						String uqledgerid = jsonobjledger.getString("uqledgerid");
						String voudetailid = detail.getUqvoucherdetailid();
						String uqvouledgerid = UUID.randomUUID().toString().toUpperCase();
						
						BigDecimal credit = null;
						BigDecimal debit = null;
						
						if(detail.getMnydebit().doubleValue() == 0)
						{
							debit = new BigDecimal(0);
							credit = money;
						}
						else
						{
							debit = money;
							credit = new BigDecimal(0);
						}
						
						if (itemLedgerTypeMap.containsKey(uqledgertypeid))
	                    {
	                    	itemLedgerTypeMap.put(uqledgertypeid, itemLedgerTypeMap.get(uqledgertypeid).add(money));
	                    }
	                    else
	                    {
	                    	itemLedgerTypeMap.put(uqledgertypeid, money);
	                    }
						
						this.voucherDetailDAO.saveVoucherDetailLedger(uqvouledgerid, uqledgertypeid, 
								uqledgerid, money, voudetailid, intseq, debit, credit);
						
						//保存分户明细分摊后 处理分户明细的往来数据
						String acdata = jsonobjledger.getString("acdata");
						if(!acdata.equals(""))
						{
							if(acdata.equals("\"null\""))
							{
								acdata = acdata.substring(1,acdata.length()-1);
							}
							//String acdata = acs.substring(1,acs.length()-1); 
							//凭证ID 凭证明细ID
							String uqvoucherid = voucherid;
							String uqvoudetailid = detail.getUqvoucherdetailid();
							
							if(!acdata.equals("null"))
							{
								JSONObject ledgerac = JSONObject.fromObject(acdata);
								JSONObject mainData = JSONObject.fromObject(ledgerac.getString("mainData"));
								JSONArray detaildatas = JSONArray.fromObject(ledgerac.getString("detailDatas"));
								/*if(detaildatas != null && detaildatas.size() > 0)
								{
									String intType = String.valueOf(detaildatas.getJSONObject(0).get("inttype"));
								
									if("1".equals(intType))
									{
										mainData.put("inttype", 2);
									}
									if("2".equals(intType))
									{
										mainData.put("inttype", 1);
									}
								}
								BigDecimal moneyBig= BigDecimal.valueOf(0-mainData.getDouble("money"));
								BigDecimal offsetmoneyBig = BigDecimal.valueOf(mainData.getDouble("remainmoney") - mainData.getDouble("money"));
								mainData.remove("money");
								mainData.put("money", moneyBig);
								mainData.remove("offsetmoney");
								mainData.put("offsetmoney", offsetmoneyBig);
								mainData.remove("yetmoney");
								mainData.put("yetmoney", moneyBig);*/
						
								//为往来数据添加凭证ID 凭证明细ID
								mainData.put("uqvoucherid",uqvoucherid);
								mainData.put("uqvoudetailid",uqvoudetailid);
	
								//mainDataStr = mainData.toString().replaceAll("\"yetmoney\":null", "\"yetmoney\":0");
								/*for(int n=0 ; n< detaildatas.size();n++)
							    {
						            JSONObject detail_data = detaildatas.getJSONObject(n);
						            detail_data.put("uqvoucherid",uqvoucherid);
						            detail_data.put("uqvoudetailid",uqvoudetailid);
							    }*/
								this.voucherDetailDAO.insertOffsetData
									(voucherid, uqvoudetailid, uqledgerid, mainData.toString(), detaildatas.toString());
							}
						}
					}
				}
				
				Iterator<String> it = itemLedgerTypeMap.keySet().iterator();
				
				if(jsonledgerall.size() != 0 && itemLedgerTypeMap.size() == 0)
				{
					throw new RuntimeException("第"+detail.getIntseq()+"分录请选择分摊记录，分摊分户金额");
				}
				
				BigDecimal detailmoney = null;
				DecimalFormat df = new DecimalFormat("#.00");
				
		        while (it.hasNext())
		        {
		            Object key = it.next();
		            BigDecimal value = itemLedgerTypeMap.get(key);
		            if(detail.getMnydebit().doubleValue() == 0)
					{
		            	detailmoney = detail.getMnycredit();
					}
					else
					{
						detailmoney = detail.getMnydebit();
					}
		            if (detailmoney.compareTo(CommonHelper.round(value, 2)) != 0)
		            {
		            	throw new RuntimeException("第"+detail.getIntseq()+"分录分户分摊金额合计"+value+"与分录金额" +  df.format(detailmoney)+"不一致！");
		            }
		        }
			}
			else
			{
				//科目没有分户 通过noledgerac字段检测科目是否有挂往来数据
				JSONObject noledgerac = null;
				if (!vouobj.getString("noledgerac").equals("")) 
				{
					noledgerac = JSONObject.fromObject(vouobj.getString("noledgerac"));
				}
				if(noledgerac != null)
				{
					if(!noledgerac.isNullObject())
					{
						//凭证ID 凭证明细ID
						String uqvoucherid = voucherid;
						String uqvoudetailid = detail.getUqvoucherdetailid();
						
						//科目所在分户明细分摊有往来数据 调用往来冲销人工匹配保存方法
						String mainDataStr = noledgerac.getString("mainData");
						
						JSONObject mainData = JSONObject.fromObject(mainDataStr);
						/*BigDecimal moneyBig= BigDecimal.valueOf(0-mainData.getDouble("money"));
						BigDecimal offsetmoneyBig = BigDecimal.valueOf(mainData.getDouble("remainmoney") - mainData.getDouble("money"));
						mainData.remove("money");
						mainData.put("money", moneyBig);
						mainData.remove("offsetmoney");
						mainData.put("offsetmoney", offsetmoneyBig);
						mainData.remove("yetmoney");
						mainData.put("yetmoney", moneyBig);*/
						JSONArray detaildatas = JSONArray.fromObject(noledgerac.getString("detailDatas"));
						/*if(detaildatas != null && detaildatas.size() > 0)
						{
							String intType = String.valueOf(detaildatas.getJSONObject(0).get("inttype"));
							if("1".equals(intType))
							{
								mainData.put("inttype", 2);
							}
							if("2".equals(intType))
							{
								mainData.put("inttype", 1);
							}
						}*/
						
						//为往来数据添加凭证ID 凭证明细ID
						mainData.put("uqvoucherid",uqvoucherid);
						mainData.put("uqvoudetailid",uqvoudetailid);
						
						//为往来明细添加凭证ID和凭证明细ID
						/*for(int n=0 ; n< detaildatas.size();n++)
						{
							JSONObject detail_data = detaildatas.getJSONObject(n);
							detail_data.put("uqvoucherid",uqvoucherid);
							detail_data.put("uqvoudetailid",uqvoudetailid);
						}*/
						//保存往来临时表
						this.voucherDetailDAO.insertOffsetData
							(voucherid, uqvoudetailid, "",mainData.toString(), detaildatas.toString());
					}
				}
			}
		}
		
		return details;
	}
	
	public void voucherrulecheck(VoucherMain main, List<VoucherDetail> list) throws Exception
	{
		StringHolder errMsg = new StringHolder();
		if(!this.ckNumberingRule(main, list, errMsg))
		{
			throw new RuntimeException(errMsg.value);
		}
	}
	
	/**
	 * 校验凭证编号的规则
	 * @param main
	 * @return
	 */
	private boolean ckNumberingRule(VoucherMain main,List<VoucherDetail> list, StringHolder errMsg) throws Exception
	{
		Boolean bResult = true;

        Boolean bVoucherHave = false;
        Boolean bVoucherNo = false;
        Boolean bDebitHave = false;
        Boolean bDebitNo = false;
        Boolean bCreditHave = false;
        Boolean bCreditNo = false;
        Boolean bHasDebit = false; // 凭证中是否包含借方金额
        Boolean bHasCredit = false; // 凭证中是否包含贷方金额

        BigDecimal bcPrecision = new BigDecimal("0.0005"); // 精度值
        
        NumberingEntity numEntity = this.voucherDetailDAO.findById(main.getUqnumbering(), false,
        		NumberingEntity.class);
        
        for (VoucherDetail voucherdetail : list)
        {
        	String accCode = this.voucherDetailDAO.getAccountCodeByID(voucherdetail.getUqaccountid());
        	String[] sTemp = null;

            // 科目必有检查
            if (!CommonHelper.isNullOrEmpty(numEntity.getVarvoucherhave())
                    && !"null".equals(numEntity.getVarvoucherhave()))
            {
                sTemp = numEntity.getVarvoucherhave().split(",");
                for (String strTemp : sTemp)
                {
                    if (accCode.startsWith(strTemp))
                    {
                        bVoucherHave = true;
                        break;
                    }
                }
            }
            else
            {
                bVoucherHave = true;
            }

            // 科目必无检查
            if (!CommonHelper.isNullOrEmpty(numEntity.getVarvoucherno())
                    && !"null".equals(numEntity.getVarvoucherno()))
            {
                sTemp = numEntity.getVarvoucherno().split(",");
                for (String strTemp : sTemp)
                {
                    if (accCode.startsWith(strTemp))
                    {
                        bVoucherNo = true;
                        break;
                    }
                }
            }

            if (voucherdetail.getMnydebit().abs().compareTo(bcPrecision) == 1)
            {
                bHasDebit = true;
                // 借方必有检查
                if (!CommonHelper.isNullOrEmpty(numEntity.getVardebithave())
                        && !"null".equals(numEntity.getVardebithave()))
                {
                    for (String strTemp : numEntity.getVardebithave().split(","))
                    {
                        if (accCode.startsWith(strTemp))
                        {
                            bDebitHave = true;
                            break;
                        }
                    }
                }
                else
                {
                    bDebitHave = true;
                }

                // 借方必无检查
                if (!CommonHelper.isNullOrEmpty(numEntity.getVardebitno())
                        && !"null".equals(numEntity.getVardebitno()))
                {
                    for (String strTemp : numEntity.getVardebitno().split(","))
                    {
                        if (accCode.startsWith(strTemp))
                        {
                            bDebitNo = true;
                            break;
                        }
                    }
                }
            }

            if (voucherdetail.getMnycredit().abs().compareTo(bcPrecision) == 1)
            {
                bHasCredit = true;
                // 贷方必有检查
                if (!CommonHelper.isNullOrEmpty(numEntity.getVarcredithave())
                        && !"null".equals(numEntity.getVarcredithave()))
                {
                    for (String strTemp : numEntity.getVarcredithave().split(","))
                    {
                        if (accCode.startsWith(strTemp))
                        {
                            bCreditHave = true;
                            break;
                        }
                    }
                }
                else
                {
                    bCreditHave = true;
                }

                // 贷方必无检查
                if (!CommonHelper.isNullOrEmpty(numEntity.getVarcreditno())
                        && !"null".equals(numEntity.getVarcreditno()))
                {
                    for (String strTemp : numEntity.getVarcreditno().split(","))
                    {
                        if (accCode.startsWith(strTemp))
                        {
                            bCreditNo = true;
                            break;
                        }
                    }
                }
            }
        }
        if (!bHasDebit)
        {
            bDebitHave = true;
            bDebitNo = false;
        }
        if (!bHasCredit)
        {
            bCreditHave = true;
            bCreditNo = false;
        }

        if (!bVoucherHave)
        {
            errMsg.value = "凭证按 " + numEntity.getVarname() + " 编号时，凭证必有" + numEntity.getVarvoucherhave()
                    + "类科目！";
            bResult = false;
        }
        if (bVoucherNo)
        {
        	errMsg.value = "凭证按“" + numEntity.getVarname() + "”编号时，凭证必无" + numEntity.getVarvoucherno()
                    + "类科目！";
            bResult = false;
        }
        if (!bDebitHave)
        {
        	errMsg.value = "凭证按“" + numEntity.getVarname() + "”编号时，借方必有" + numEntity.getVardebithave()
                    + "类科目！";
            bResult = false;
        }
        if (bDebitNo)
        {
        	errMsg.value = "凭证按“" + numEntity.getVarname() + "”编号时，借方必无" + numEntity.getVardebitno()
                    + "类科目！";
            bResult = false;
        }
        if (!bCreditHave)
        {
        	errMsg.value = "凭证按“" + numEntity.getVarname() + "”编号时，贷方必有" + numEntity.getVarcredithave()
                    + "类科目！";
            bResult = false;
        }
        if (bCreditNo)
        {
        	errMsg.value = "凭证按“" + numEntity.getVarname() + "”编号时，贷方必无" + numEntity.getVarcreditno()
                    + "类科目！";
            bResult = false;
        }
        
        return bResult;
	}
	
	public void handlerAccountPeriodNoJZ(String voucherid)
	{
		List<Object[]> list = this.voucherDetailDAO.getAccountPeriodInfo(voucherid);
		
		for(int i = 0; i < list.size(); i++)
		{
			//1.获取余额表所需信息
			Object[] obj = (Object[]) list.get(i);
			String uqaccountid = obj[0].toString();
			String uqglobalperiodid = obj[1].toString();
			String uqcompanyid = obj[2].toString();
			BigDecimal accdebitsum = new BigDecimal(obj[3].toString());
			BigDecimal acccreditsum = new BigDecimal(obj[4].toString());
			BigDecimal accfdebitsum = new BigDecimal(obj[5].toString());
			BigDecimal accfcreditsum = new BigDecimal(obj[6].toString());
			
			//2.锁掉余额表
			List<EntityMap> lockList = this.voucherDetailDAO.lockAccountPeriodNoJZ(uqaccountid, uqglobalperiodid, uqcompanyid);
			int lockline = lockList.size();
			
			//3.更新余额表
			this.voucherDetailDAO.updateAccountPeriodNoJZ(lockline, uqaccountid, uqglobalperiodid, uqcompanyid, 
					accdebitsum, acccreditsum, accfdebitsum, accfcreditsum);
		}
	}
	
	public void handlerAccountPeriod(String voucherid, int tag, int flag)
	{
		//1.获取凭证分录的分组信息，按照科目，单位，会计期
		List<Object[]> list = null;
		
		if(tag == 2)
		{
			list = this.voucherDetailDAO.getAccountPeriodCashInfo(voucherid);
		}
		else
		{
			list = this.voucherDetailDAO.getAccountPeriodInfo(voucherid);
		}
		
		for(int i = 0; i < list.size(); i++)
		{
			//1.获取余额表所需信息
			Object[] obj = (Object[]) list.get(i);
			String uqaccountid = obj[0].toString();
			String uqglobalperiodid = obj[1].toString();
			String uqcompanyid = obj[2].toString();
			BigDecimal accdebitsum = new BigDecimal(obj[3].toString());
			BigDecimal acccreditsum = new BigDecimal(obj[4].toString());
			BigDecimal accfdebitsum = new BigDecimal(obj[5].toString());
			BigDecimal accfcreditsum = new BigDecimal(obj[6].toString());
			
			//2.锁掉余额表
			List<EntityMap> lockList = this.voucherDetailDAO.lockAccountPeriod(uqaccountid, uqglobalperiodid, uqcompanyid);
			int lockline = lockList.size();
			
			//3.更新余额表
			this.voucherDetailDAO.updateAccountPeriod(lockline, uqaccountid, uqglobalperiodid, uqcompanyid, 
					accdebitsum, acccreditsum, accfdebitsum, accfcreditsum, tag, flag);
		}
	}
	
	public void saveVoucherDetail(List<VoucherDetail> list)
	{
		this.voucherDetailDAO.saveVoucherDetail(list);
	}
	
	public void deleteVoucherDetail(String voucherid)
	{
		try
		{
			this.voucherDetailDAO.deleteVoucherDetail(voucherid);
		}
		catch(Exception e)
		{
			throw new RuntimeException(e.getMessage());
		}
	}
	
	/**
	 * 通过科目获取分户信息
	 * @param uqaccountid
	 * @return
	 */
	public JSONObject getLedgerInfoByAccountID(String uqaccountid)
	{
		JSONObject map = new JSONObject();
		int intisledger = this.isAccountLedger(uqaccountid);
		if( intisledger == 1)
		{
			map.put("success", true);
			map.put("intisledger", intisledger);
			map.put("accountledgertype", this.getLedgerTypeByAccountID(uqaccountid));
			map.put("accountledger", this.getLedgerByAccountID(uqaccountid));
		}
		else
		{
			map.put("success", true);
			map.put("intisledger", 0);
			map.put("accountledgertype", "");
			map.put("accountledger", "");
		}
		return map;
	}
	
	/**
	 * 检测科目是否符合电信核销科目 和 科目类型
	 * @param uqaccountid
	 * @return
	 */
	public JSONObject getACInfoByAccountID(String uqaccountid)
	{
		JSONObject map = new JSONObject();
		boolean intisac = this.voucherDetailDAO.getACInfoByAccountID(uqaccountid);
		List<EntityMap> acType = this.voucherDetailDAO.getACTypeByAccountID(uqaccountid);
		map.put("success", true);
		if (intisac) 
		{
			map.put("intisac", "1");
		}
		else 
		{
			map.put("intisac", "0");
		}
		if(acType != null)
		{
			int INTPROPERTY = acType.get(0).getInteger("INTPROPERTY");
			int UQTYPEID = acType.get(0).getInteger("UQTYPEID");
			if(INTPROPERTY == 1 && (UQTYPEID == 7||UQTYPEID == 1))
			{
				map.put("intacflag", "1");
			}
			else if(INTPROPERTY == 2 && (UQTYPEID == 8||UQTYPEID == 2))
			{
				map.put("intacflag", "0");
			}
		}
		return map;
	}
	
	/**
	 * 通过科目获取是否需要
	 * @param uqaccountid
	 * @return
	 */
	private int isAccountLedger(String uqaccountid)
	{
		int isaccountledger = this.voucherDetailDAO.isAccountLedger(uqaccountid);
		return isaccountledger;
	}
	
	/**
	 * 通过科目获取分户类别
	 * @param uqaccountid
	 * @return
	 */
	private JSONArray getLedgerTypeByAccountID(String uqaccountid)
	{
		List<Object[]> list = this.voucherDetailDAO.getLedgerTypeByAccountID(uqaccountid);
		
		JSONArray array = new JSONArray();
		
		for (int i = 0; i < list.size(); i++)
		{
			Object[] listobj = (Object[])list.get(i);
			JSONObject obj = new JSONObject();
			obj.put("ledgetypeid",listobj[0].toString());
			obj.put("varledgetypename",listobj[1].toString());
			array.add(obj);
		}
		return array;
	}
	
	/**
	 * 通过科目获取分户类别获取单位分户信息
	 * @param uqaccountid
	 * @return
	 */
	private JSONArray getLedgerByAccountID(String uqaccountid)
	{
		List<Object[]> list = this.voucherDetailDAO.getLedgerTypeByAccountID(uqaccountid);
		
		JSONArray array = new JSONArray();
		
		for (int i = 0; i < list.size(); i++)
		{
			Object[] listobj = list.get(i);
			
			String ledgertypeid = listobj[0].toString();
			String varledgetypename = listobj[1].toString();
			List<Object[]> ledgerlist = this.voucherDetailDAO.getLedgerByAccountID(ledgertypeid);
			
			JSONArray ledgerdata = new JSONArray();
			
			for (int j = 0; j < ledgerlist.size(); j++)
			{
				Object[] ledgerobj = ledgerlist.get(j);
				JSONObject obj = new JSONObject();
				obj.put("voudetailid", "");
				obj.put("uqledgerid", ledgerobj[0] == null ? "" : ledgerobj[0].toString());
				obj.put("varledgercode", ledgerobj[1] == null ? "" : ledgerobj[1].toString());
				obj.put("varledgername", ledgerobj[2] == null ? "" : ledgerobj[2].toString());
				obj.put("percent", 0);
				obj.put("money", 0);
				obj.put("intseq", j + 1);
				obj.put("isfirst", true);
				ledgerdata.add(obj);
			}
			
			JSONObject ledgerobj = new JSONObject();
			
			ledgerobj.put("ledgertypeid", ledgertypeid);
			ledgerobj.put("varledgetypename", varledgetypename);
			ledgerobj.put("ledgerdata", ledgerdata);
			
			array.add(ledgerobj);
		}
		return array;
	}
	
	public JSONArray getVouDetailLedgerType(String uqvoucherdetailid)
	{
		List<Object[]> ledgertypelst = this.voucherDetailDAO.getVouDetailLedgerType(uqvoucherdetailid);
		JSONArray array = new JSONArray();
		
		for(int i = 0; i < ledgertypelst.size(); i++)
		{
			Object[] lobj = (Object[])ledgertypelst.get(i);
			JSONObject obj = new JSONObject();
			obj.put("ledgetypeid",lobj[0].toString());
			obj.put("varledgetypename",lobj[1].toString());
			array.add(obj);
		}
		return array;
	}
	
	public JSONArray getVouDetailLedger(String uqvoucherdetailid, BigDecimal recordmoney)
	{
		List<Object[]> ledgertypelst = this.voucherDetailDAO.getVouDetailLedgerType(uqvoucherdetailid);
		
		JSONArray array = new JSONArray();
		
		for (int i = 0; i < ledgertypelst.size(); i++)
		{
			Object[] listobj = (Object[])ledgertypelst.get(i);
			
			String ledgertypeid = listobj[0].toString();
			String varledgetypename = listobj[1].toString();
			
			List<Object[]> ledgerlst = this.voucherDetailDAO.getLedgerVouDetail(uqvoucherdetailid, ledgertypeid);
			List<Object[]> ledgerNotlst = this.voucherDetailDAO.getLedgerNotVouDetail(uqvoucherdetailid, ledgertypeid);
			ledgerlst.addAll(ledgerNotlst);
			JSONArray ledgerdata = new JSONArray();
			
			for (int j = 0; j < ledgerlst.size(); j++)
			{
				Object[] ledgerobj = (Object[])ledgerlst.get(j);
				JSONObject obj = new JSONObject();
				//'' voudetailid,le.uqledgeid,le.varledgecode,le.varledgename,l.mnyamount
				obj.put("voudetailid", uqvoucherdetailid);
				obj.put("uqledgerid", ledgerobj[1] == null ? "" : ledgerobj[1].toString());
				obj.put("varledgercode", ledgerobj[2] == null ? "" : ledgerobj[2].toString());
				obj.put("varledgername", ledgerobj[3] == null ? "" : ledgerobj[3].toString());
				if(!StringUtil.isNullString(ledgerobj[4].toString()))
				{
					BigDecimal money = new BigDecimal(ledgerobj[4].toString());
					obj.put("percent", money.divide(recordmoney, 2, RoundingMode.HALF_UP));
				}
				else
				{
					obj.put("percent", 0);
				}
				obj.put("money", ledgerobj[4] == null ? "" : ledgerobj[4].toString());
				obj.put("intseq", j + 1);
				obj.put("isfirst", true);
				//通过凭证ID 分录ID 分录分户ID查往来数据
				List<EntityMap> offsetData = getOffsetData("", uqvoucherdetailid, ledgerobj[1] == null ? "" : ledgerobj[1].toString());
				if(offsetData.size()>0)
	            {
					obj.put("acdata", offsetData.get(0));
	            }
	            else
	            {
	            	obj.put("acdata", "");
	            }
				
				ledgerdata.add(obj);
			}
			
			JSONObject ledgerobj = new JSONObject();
			ledgerobj.put("ledgertypeid", ledgertypeid);
			ledgerobj.put("varledgetypename", varledgetypename);
			ledgerobj.put("ledgerdata", ledgerdata);
			
			array.add(ledgerobj);
		}
		
		return array;
	}
	
	public void handlerLedgerPeriod(String voucherid, int tag, int flag)
	{
		//1.获取凭证分录的分组信息，按照科目，单位，会计期
		List<Object[]> list = null;
		
		if(tag == 2)
		{
			list = this.voucherDetailDAO.getLedgerPeriodCashInfo(voucherid);
		}
		else
		{
			list = this.voucherDetailDAO.getLedgerPeriodInfo(voucherid);
		}
		
		for(int i = 0; i < list.size(); i++)
		{
			//1.获取余额表所需信息
			Object[] obj = (Object[]) list.get(i);
			String uqaccountid = obj[0].toString();
			String uqglobalperiodid = obj[1].toString();
			String uqcompanyid = obj[2].toString();
			String uqledgerid = obj[3].toString();
			BigDecimal accdebitsum = new BigDecimal(obj[4].toString());
			BigDecimal acccreditsum = new BigDecimal(obj[5].toString());
			BigDecimal accfdebitsum = new BigDecimal(obj[6].toString());
			BigDecimal accfcreditsum = new BigDecimal(obj[7].toString());
			
			//2.锁掉余额表
			List<EntityMap> lockList = this.voucherDetailDAO.lockLedgerPeriod(uqaccountid, uqglobalperiodid, uqcompanyid, uqledgerid);
			int lockline = lockList.size();
			
			//3.更新余额表
			this.voucherDetailDAO.updateLedgerPeriod(lockline, uqaccountid, uqglobalperiodid, uqcompanyid, uqledgerid,
					accdebitsum, acccreditsum, accfdebitsum, accfcreditsum, tag, flag);
		}
	}

	public List<VoucherDetail>  getVoucherDetailInfo(String uqvoucherid) 
	{		
		return voucherDetailDAO.getVoucherDetailInfo(uqvoucherid);
	}
	
	public List<EntityMap>  getOffsetData(String voucherid,String voucherdetailid, String vouledgerid)
	{		
		return voucherDetailDAO.getOffsetData(voucherid, voucherdetailid, vouledgerid);
	}
}
