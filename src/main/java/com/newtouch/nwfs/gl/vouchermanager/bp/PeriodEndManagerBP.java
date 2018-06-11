package com.newtouch.nwfs.gl.vouchermanager.bp;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nwfs.gl.vouchermanager.dao.PeriodEndManagerDAO;
import com.newtouch.nwfs.gl.vouchermanager.dao.VoucherDetailDAO;
import com.newtouch.nwfs.gl.vouchermanager.dao.VoucherMainDAO;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherDetail;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherMain;

@Service
@Transactional
public class PeriodEndManagerBP 
{
	@Autowired
	private PeriodEndManagerDAO getdao ;

	@Autowired
	private VoucherMainDAO vouchermaindao;
	
	@Autowired
	private VoucherDetailDAO voucherdetaildao;
	
	
	/**
	 * 期末结转凭证处理
	 * @param map
	 * @throws Exception
	 */
	public void autoconvert(ConditionMap map) throws Exception
	{
		//获得收入的余额科目发生数及信息
		//	profitaccount	unprofitaccount	periodid
		BigDecimal incomedetail = new java.math.BigDecimal(0);
		List<EntityMap> incomelist = this.getAccountList(map,"10");
		if(incomelist.size()!=0)
		{
			incomedetail = addVoucherDetail(incomelist, map );
		}
		//获得费用的余额科目发生数及信息
		BigDecimal costdetail = new java.math.BigDecimal(0);
		List<EntityMap> costlist = this.getAccountList(map, "9");
		if(costlist.size()!=0)
		{
			costdetail = addVoucherDetail(costlist, map );
		}
		
		//处理 本年利润 与未分配利润
		BigDecimal decimal = add(incomedetail, costdetail);
		BigDecimal zero = new java.math.BigDecimal(0);
		
		if(decimal.compareTo(zero)!=0)
		{
			this.profitAccount(decimal,zero,map);
		}
		
		//设置记忆选择的科目信息
		this.addRemberAccount(map);
	}
	
	/**
	 * 处理 本年利润 与未分配利润
	 */
	public void profitAccount(BigDecimal decimal,BigDecimal zero ,ConditionMap map) throws Exception
	{
		List<VoucherDetail> details = new ArrayList<VoucherDetail>();
		String voucherMainID = UUID.randomUUID().toString().toUpperCase();
		
		VoucherDetail detail1 = new VoucherDetail();
		detail1.setUqvoucherdetailid(UUID.randomUUID().toString().toUpperCase());
		detail1.setUqvoucherid(voucherMainID);
		detail1.setIntseq(1);
		detail1.setUqaccountid(map.getString("profitaccount"));
		detail1.setVarabstract("本年利润期末结转");
		
		VoucherDetail detail2 = new VoucherDetail();
		detail2.setUqvoucherdetailid(UUID.randomUUID().toString().toUpperCase());
		detail2.setUqvoucherid(voucherMainID);
		detail2.setIntseq(2);
		detail2.setUqaccountid(map.getString("unprofitaccount"));
		detail2.setVarabstract("本年未分配利润结转");
		
		//本年利润中已做  借-贷 为负数  贷方数大 在本年利润记一笔借方 在未分配利润记一笔贷方
		if(decimal.compareTo(zero)==-1) 
		{
			//本年利润 记借方
			detail1.setMnydebit(decimal.abs());
			detail1.setMnycredit(new BigDecimal(0));
			//未分配 记贷方
			detail2.setMnydebit(new BigDecimal(0));
			detail2.setMnycredit(decimal.abs());
		}
		else if(decimal.compareTo(zero)==1)//借-贷 为正数  借方数大 在本年利润记一笔贷方 在未分配利润记一笔借方
		{
			//本年利润 记贷方
			detail1.setMnydebit(new BigDecimal(0));
			detail1.setMnycredit(decimal.abs());
			//未分配 记借方
			detail2.setMnydebit(decimal.abs());
			detail2.setMnycredit(new BigDecimal(0));
		}
		
		details.add(detail1);
		details.add(detail2);
		this.voucherdetaildao.saveVoucherDetail(details);
		
		map.put("mnydebitsum", decimal.abs());
		map.put("mnycreditsum", decimal.abs());
		map.put("uqvoucherid", voucherMainID);
		
		this.addVoucherMain(map);
		
	}
	
	/**
	 * 处理科目余额表的数据
	 */
	public void handlerAccountPeriod(String voucherid, int tag, int flag)
	{
		//1.获取凭证分录的分组信息，按照科目，单位，会计期
		List<Object[]> list = null;
		
		if(tag == 2)
		{
			list = this.voucherdetaildao.getAccountPeriodCashInfo(voucherid);
		}
		else
		{
			list = this.voucherdetaildao.getAccountPeriodInfo(voucherid);
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
			@SuppressWarnings("rawtypes")
			List lockList = this.voucherdetaildao.lockAccountPeriod(uqaccountid, uqglobalperiodid, uqcompanyid);
			int lockline = lockList.size();
			
			//3.更新余额表
			this.voucherdetaildao.updateAccountPeriod(lockline, uqaccountid, uqglobalperiodid, uqcompanyid, 
					accdebitsum, acccreditsum, accfdebitsum, accfcreditsum, tag, flag);
		}
	}
	
	/**
	 * BigDecimal相加运算
	 * @param v1
	 * @param v2
	 * @return
	 */
	public static BigDecimal add(BigDecimal v1, BigDecimal v2)
	{
		 return v1.add(v2);
	}
	
	/**
	 * 处理凭证明细
	 * @param list
	 * @param map
	 * @param profit
	 * @throws Exception
	 */
	public BigDecimal addVoucherDetail(List<EntityMap> list ,ConditionMap map) throws Exception
	{
		List<VoucherDetail> details = new ArrayList<VoucherDetail>();
		String voucherMainID = UUID.randomUUID().toString().toUpperCase();
		BigDecimal zero = new java.math.BigDecimal(0);
		BigDecimal money = new java.math.BigDecimal(0);
		int tol = 0 ;
		for(int i = 0 ;i<list.size();i++)
		{
			tol = i+1;
			String balance = list.get(i).getString("balance");
			if(balance!=null && !balance.equals("0.00") && !balance.equals("0"))
			{
				VoucherDetail detail = new VoucherDetail();
				BigDecimal mny = new java.math.BigDecimal(balance);//借-贷
				money = add(money,mny);// 累加数据
				String uqaccountid = list.get(i).getString("uqaccountid");
				detail.setUqvoucherdetailid(UUID.randomUUID().toString().toUpperCase());
				detail.setUqvoucherid(voucherMainID);
				detail.setIntseq(tol);
				detail.setUqaccountid(uqaccountid);
				detail.setVarabstract("期末结转");
				
				if(mny.compareTo(zero)==-1)//小于0	借-贷
				{
					//贷方数据大  要在该科目 做一笔借方的 数据
					detail.setMnydebit(mny.abs());
					detail.setMnycredit(new BigDecimal(0));
				}
				else if(mny.compareTo(zero)==1)//大于0	借-贷
				{
					//借方数据大		要在该科目 做一笔贷方的 数据
					detail.setMnydebit(new BigDecimal(0));
					detail.setMnycredit(mny.abs());
				}
				details.add(detail);
			}
		}
		//处理本年利润科目的明细
		if(money.compareTo(zero)!=0)
		{
			VoucherDetail detail = new VoucherDetail();
			if(money.compareTo(zero)==-1)//小于0  总计	借-贷
			{
				//贷方数据大  要在该科目 做一笔借方的 数据 再累计科目中记录一笔 贷方的
				detail.setMnydebit(new BigDecimal(0));
				detail.setMnycredit(money.abs());
			}
			else if(money.compareTo(zero)==1)//大于0  总计	借-贷
			{
				//借方数据大		要在该科目 做一笔贷方的 数据  再累计科目中记录一笔 借方的
				detail.setMnydebit(money.abs());
				detail.setMnycredit(new BigDecimal(0));
			}
			detail.setUqvoucherdetailid(UUID.randomUUID().toString().toUpperCase());
			detail.setUqvoucherid(voucherMainID);
			detail.setIntseq(tol+1);
			detail.setUqaccountid(map.getString("profitaccount"));
			detail.setVarabstract("本年利润期末结转");
			details.add(detail);
			
			//新增凭证明细数据
			this.voucherdetaildao.saveVoucherDetail(details);
			
			map.put("mnydebitsum", money.abs());
			map.put("mnycreditsum", money.abs());
			map.put("uqvoucherid", voucherMainID);
			
			//新增凭证主表数据
			this.addVoucherMain(map);
		}
		
		return money;
	}
	
	/**
	 * 新增凭证主表数据
	 */
	public void addVoucherMain(ConditionMap map) throws Exception
	{
		VoucherMain main =  new VoucherMain();
		//查删改是传递主键过来的
		main.setUqvoucherid(map.getString("uqvoucherid"));
		main.setIntvouchernum(-999999);
		main.setUqnumbering("CF10100D-ED35-4B1D-AAC7-235F68DFB117");
		M8Session m8session = new M8Session();
		String uqcompanyid = ObjectUtils.toString(m8session.getCompanyID());	
		main.setUqcompanyid(uqcompanyid);
		main.setIntaffix(2);
		String uqglobalperiodid = map.getString("uqglobalperiodid");
		main.setUqglobalperiodid(uqglobalperiodid);
		main.setMnydebitsum(new java.math.BigDecimal(map.getString("mnydebitsum")));
		main.setMnycreditsum(new java.math.BigDecimal(map.getString("mnycreditsum")));
		main.setUqaccountantid("");
		main.setUqcasherid("");
		main.setUqcheckerid("");
		String userid = ObjectUtils.toString(m8session.getUserID());
		main.setUqfillerid(userid);

		String lastDayOfMonth = map.getString("dtend");
		
		if(lastDayOfMonth.length()<=2)
		{
			Calendar cal = Calendar.getInstance();  
			int year = cal.get(Calendar.YEAR);
	        //设置年份  
	        cal.set(Calendar.YEAR,year);  
	        //设置月份  
	        cal.set(Calendar.MONTH, Integer.parseInt(lastDayOfMonth)-1);  
	        //获取某月最大天数  
	        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);  
	        //设置日历中月份的最大天数  
	        cal.set(Calendar.DAY_OF_MONTH, lastDay);  
	        //格式化日期  
	        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");  
	        lastDayOfMonth = sdf.format(cal.getTime()); 
		}
		
		//显示用制证时间(即月末)
		main.setDtfiller(lastDayOfMonth);
		//修改凭证状态
		SimpleDateFormat simpleformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		java.util.Date date = new java.util.Date();  
		String dtfillersrv = simpleformat.format(date); 
		main.setDtfillersrv(dtfillersrv);
		
		vouchermaindao.saveVoucherMain(main);
		
		boolean iscash = this.vouchermaindao.isCash(main.getUqvoucherid());
		
		String intiscash = "0";
		if(iscash)
		{
			intiscash = "1";
		}
		
		//更新主表中标志字段(主要维护是否出纳字段)   main.getDtfiller()真实制证时间，0保存凭证
		this.vouchermaindao.updateVoucherState("0", intiscash, main.getUqvoucherid(), m8session.getUserID(), main.getDtfiller(),  "");
		
		//流水号更新，初始值为-999999 每条主信息都递增一下流水号
		this.vouchermaindao.updateVoucherCompanySeq(main.getUqvoucherid(), main.getUqcompanyid(), main.getUqglobalperiodid());
		
		//处理科目余额表的数据 主要用于结转后 平掉余额表金额
		this.handlerAccountPeriod(map.getString("uqvoucherid"),1,1);
	}
	
	/**
	 * 获得发生数的科目数据
	 * @param map
	 * @param uqtypeid
	 * @return
	 * @throws Exception
	 */
	public List<EntityMap> getAccountList(ConditionMap map , String uqtypeid) throws Exception
	{
		map.put("uqtypeid", uqtypeid);
		List<EntityMap> list = this.getdao.getAccountPeriod(map);
		return list;
	}
	
	/**
	 * 获得记忆选择的科目 信息
	 * @return
	 * @throws Exception
	 */
	public EntityMap getRemberAccount() throws Exception
	{
		EntityMap map = this.getdao.getRemeberAccount();
		return map ;
	}
	
	/**
	 * 保存记忆选择的科目信息
	 * @param map
	 * @throws Exception
	 */
	public void addRemberAccount(ConditionMap map) throws Exception
	{
		//profitaccount 本年利润科目
		//unprofitaccount 未分配本年利润科目
		String profitaccount = map.getString("profitaccount");
		String unprofitaccount = map.getString("unprofitaccount");
		if(profitaccount!=null&&!"".equals(profitaccount))
		{
			this.getdao.addRemberAccount(profitaccount,"PROFITACCOUNT");
		}
		if(unprofitaccount!=null&&!"".equals(unprofitaccount))
		{
			this.getdao.addRemberAccount(unprofitaccount,"UNPROFITACCOUNT");
		}
		
	}
	
}
