package com.newtouch.nwfs.gl.vouchermanager.bp;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.xml.rpc.holders.StringHolder;

import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nwfs.gl.vouchermanager.dao.VoucherMainDAO;
import com.newtouch.nwfs.gl.vouchermanager.entity.InitVoucherCashEntity;
import com.newtouch.nwfs.gl.vouchermanager.entity.InitVoucherCheckEntity;
import com.newtouch.nwfs.gl.vouchermanager.entity.InitVoucherEndEntity;
import com.newtouch.nwfs.gl.vouchermanager.entity.InitVoucherQueryEntity;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherDetail;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherMain;
import com.newtouch.workflow.ssc.util.GlobalParamUtil;

@Service
@Transactional
public class VoucherMainBP
{
	@Autowired
	private VoucherMainDAO voucherMainDAO;
	@Autowired
	private VoucherDetailBP voucherDetailBP;
	
	public VoucherMain getVoucherMain(String voucherid, String vouchertag) 
	{
		VoucherMain main = new VoucherMain();
		if("0".equals(vouchertag))
		{
			//初始化获取凭证头信息
			String strDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			int nowyearmonth = Integer.parseInt(strDate.substring(0, 4) + strDate.substring(5, 7));
			
			//按照当前年月获取启用的会计期
			Object[] period = voucherMainDAO.getPeriodInfo(nowyearmonth);
			
			if(period != null)
			{
				main.setUqglobalperiodid(period[0] == ""? "" : period[0].toString());
				main.setPeriodname(period[1] == ""? "" : period[1].toString());
				main.setIntyearmonth(period[2] == ""? "" : period[2].toString());
				main.setDtbegin(period[3] == ""? "" : period[3].toString());
				
				main.setDtdate(strDate);
			}
			
			M8Session session = new M8Session();
			main.setUqcompanyid(session.getCompanyID());
			main.setUqfillerid(session.getUserID());
			
		}
		else
		{
			//凭证保存后查询凭证头
			List<VoucherMain> mainlst = this.voucherMainDAO.getVoucherMainInfo(voucherid);
			
			if(mainlst.size() <= 0)
			{
				throw new RuntimeException("异常，没有取到凭证头，请联系管理员!");
			}
			
			main = mainlst.get(0);
		}
		return main;
	}
	
	public InitVoucherCashEntity getInitVoucherCash()
	{
		InitVoucherCashEntity init = new InitVoucherCashEntity();
		//初始化获取凭证头信息
		String strDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		int nowyearmonth = Integer.parseInt(strDate.substring(0, 4) + strDate.substring(5, 7));
		
		//按照当前年月获取启用的会计期
		Object[] period = voucherMainDAO.getCurrentPeriodInfo(nowyearmonth);
		
		if(period != null)
		{
			init.setUqglobalperiodid(period[0] == ""? "" : period[0].toString());
			init.setPeriodname(period[1] == ""? "" : period[1].toString());
			init.setIntyearmonth(period[2] == ""? "" : period[2].toString());
			init.setDtbegin(period[3] == ""? "" : period[3].toString());
			
			init.setCashdate(strDate);
			
			init.setDtfilldatefrom(period[3] == ""? "" : period[3].toString());
			init.setDtfilldateto(period[4] == ""? "" : period[4].toString());
		}
		
		return init;
	}
	
	public InitVoucherEndEntity getInitVoucherEnd()
	{
		InitVoucherEndEntity init = new InitVoucherEndEntity();
		//初始化获取凭证头信息
		String strDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		int nowyearmonth = Integer.parseInt(strDate.substring(0, 4) + strDate.substring(5, 7));
		
		//按照当前年月获取启用的会计期
		Object[] period = voucherMainDAO.getCurrentPeriodInfo(nowyearmonth);
		
		if(period != null)
		{
			init.setUqglobalperiodid(period[0] == ""? "" : period[0].toString());
			init.setPeriodname(period[1] == ""? "" : period[1].toString());
			init.setIntyearmonth(period[2] == ""? "" : period[2].toString());
			init.setDtbegin(period[3] == ""? "" : period[3].toString());
			
			init.setEnddate(strDate);
			
			init.setDtfilldatefrom(period[3] == ""? "" : period[3].toString());
			init.setDtfilldateto(period[4] == ""? "" : period[4].toString());
		}
		
		return init;
	}
	
	public InitVoucherQueryEntity getInitVoucherQuery()
	{
		InitVoucherQueryEntity init = new InitVoucherQueryEntity();
		//初始化获取凭证头信息
		String strDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		int nowyearmonth = Integer.parseInt(strDate.substring(0, 4) + strDate.substring(5, 7));
		
		//按照当前年月获取启用的会计期
		Object[] period = voucherMainDAO.getCurrentPeriodInfoAll(nowyearmonth);
		
		if(period != null)
		{
			init.setFromperiodid(period[0] == ""? "" : period[0].toString());
			init.setFromperiodname(period[1] == ""? "" : period[1].toString());
			init.setFromintyearmonth(period[2] == ""? "" : period[2].toString());
			init.setFromdtbegin(period[3] == ""? "" : period[3].toString());
			
			init.setToperiodid(period[0] == ""? "" : period[0].toString());
			init.setToperiodname(period[1] == ""? "" : period[1].toString());
			init.setTointyearmonth(period[2] == ""? "" : period[2].toString());
			init.setTodtbegin(period[3] == ""? "" : period[3].toString());
			
			init.setDtfilldatefrom(period[3] == ""? "" : period[3].toString());
			init.setDtfilldateto(period[4] == ""? "" : period[4].toString());
		}
		
		return init;
	}
	
	public InitVoucherCheckEntity getInitVoucherCheck()
	{
		InitVoucherCheckEntity init = new InitVoucherCheckEntity();
		//初始化获取凭证头信息
		String strDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		int nowyearmonth = Integer.parseInt(strDate.substring(0, 4) + strDate.substring(5, 7));
		
		//按照当前年月获取启用的会计期
		Object[] period = voucherMainDAO.getCurrentPeriodInfo(nowyearmonth);
		
		if(period != null)
		{
			init.setUqglobalperiodid(period[0] == ""? "" : period[0].toString());
			init.setPeriodname(period[1] == ""? "" : period[1].toString());
			init.setIntyearmonth(period[2] == ""? "" : period[2].toString());
			init.setDtbegin(period[3] == ""? "" : period[3].toString());
			
			init.setCheckdate(strDate);
			
			init.setDtfilldatefrom(period[3] == ""? "" : period[3].toString());
			init.setDtfilldateto(period[4] == ""? "" : period[4].toString());
		}
		
		return init;
	}
	
	public void vouchersave(String jsonVoucherMain, String jsonVoucherDetail) throws Exception
	{
		//解析凭证主json
		VoucherMain main = this.parseVoucherMain(jsonVoucherMain);
		
		//解析凭证明细json
		List<VoucherDetail> voudetaillst = voucherDetailBP.parseVoucherDetail(jsonVoucherDetail, main.getUqvoucherid());
		
		//保存凭证主信息
		this.saveVoucherMain(main);
		
		//保存凭证明细
		voucherDetailBP.saveVoucherDetail(voudetaillst);
		
		//凭证主信息校验--todo
		this.voucherrulecheck(main, voudetaillst);
		
		//凭证明细信息校验--todo
		voucherDetailBP.voucherrulecheck(main, voudetaillst);
		
		M8Session session =  new M8Session();
		
		boolean iscash = this.voucherMainDAO.isCash(main.getUqvoucherid());
		
		String intiscash = "0";
		if(iscash)
		{
			intiscash = "1";
		}
		
		this.voucherMainDAO.updateVoucherState("0", intiscash, main.getUqvoucherid(), session.getUserID(), main.getDtfiller(),  "");
		
		//更新流水号
		this.voucherMainDAO.updateVoucherCompanySeq(main.getUqvoucherid(), main.getUqcompanyid(), main.getUqglobalperiodid());
		
		this.voucherDetailBP.handlerAccountPeriod(main.getUqvoucherid(), 1, 1);
		
		this.voucherDetailBP.handlerLedgerPeriod(main.getUqvoucherid(), 1, 1);
	}

	public void vouchercheck(String jsonVoucherid, String vouchercheckdate, StringHolder errMsg) throws Exception 
	{
		M8Session session = new M8Session();
		String checkeruserid = session.getUserID();
		String voucherid = jsonVoucherid;
		boolean ischeck = this.vouchercheckrulecheck(checkeruserid, voucherid, vouchercheckdate, errMsg);
		
		if(ischeck)
		{
			SimpleDateFormat simpleformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			java.util.Date date = new java.util.Date();  
			String dtcheckersrv = simpleformat.format(date); 
			
			this.voucherMainDAO.updateVoucherState("1", "0", voucherid, checkeruserid, vouchercheckdate, dtcheckersrv);
		}
	}

	public void vouchercash(String jsonVoucherid, String vouchercashdate, StringHolder errMsg) throws Exception 
	{
		M8Session session = new M8Session();
		String cashuserid = session.getUserID();
		
		String voucherid = jsonVoucherid;
		
		boolean iscash = this.vouchercheckrulecash(cashuserid, voucherid, vouchercashdate, errMsg);
		
		if(iscash)
		{
			SimpleDateFormat simpleformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			java.util.Date date = new java.util.Date();  
			String dtcashersrv = simpleformat.format(date); 
			
			this.voucherMainDAO.updateVoucherState("2", "1", voucherid, cashuserid, vouchercashdate, dtcashersrv);
			
			this.voucherDetailBP.handlerAccountPeriod(voucherid, 2, 1);
			
			this.voucherDetailBP.handlerLedgerPeriod(voucherid, 2, 1);
		}
	}

	public void voucherend(String jsonVoucherid, String voucherenddate, StringHolder errMsg) throws Exception
	{
		M8Session session = new M8Session();
		String cashuserid = session.getUserID();
		
		String voucherid = jsonVoucherid;
		
		List<VoucherMain> mainlist = this.voucherMainDAO.getVoucherMainInfo(voucherid);
		
		if(mainlist.size() <= 0)
		{
			throw new RuntimeException("没有找到凭证，请联系管理员！");
		}
		
		VoucherMain main = mainlist.get(0);
		
		boolean isend = this.vouchercheckruleend(main, cashuserid, voucherid, voucherenddate, errMsg);
		
		if(isend)
		{
			SimpleDateFormat simpleformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			java.util.Date date = new java.util.Date();  
			String dtcashersrv = simpleformat.format(date); 
			
			this.voucherMainDAO.updateVoucherState("3", "", voucherid, cashuserid, voucherenddate, dtcashersrv);
			
			this.voucherMainDAO.updateVouchernum(main.getUqvoucherid(), main.getUqcompanyid(), main.getUqglobalperiodid(), main.getUqnumbering());
		
			this.voucherDetailBP.handlerAccountPeriod(voucherid, 3, 1);
			
			this.voucherDetailBP.handlerLedgerPeriod(voucherid, 3, 1);
			
			String periodaccountjz = GlobalParamUtil.getParamString("periodaccountjz");
			
			/**
			 * 处理非结转凭证余额计算
			 */
			if(!StringUtil.isNullString(periodaccountjz))
			{
				if(!main.getUqnumbering().equals(periodaccountjz))
				{
					this.voucherDetailBP.handlerAccountPeriodNoJZ(voucherid);
				}
			}
		}
		
	}
	
	public void unVoucherEdit(String jsonVoucherMain, String jsonVoucherDetail, StringHolder errMsg) throws Exception
	{
		//查询凭证分录，删除余额，删除分录
		//解析凭证主json
		VoucherMain main = this.parseVoucherMain(jsonVoucherMain);
		
		M8Session session = new M8Session();
		String edituserid = session.getUserID();
		
		SimpleDateFormat simpleformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		java.util.Date date = new java.util.Date();  
		String dtfillersrv = simpleformat.format(date); 
		main.setDtfillersrv(dtfillersrv);
		boolean isedit = this.vouchercheckruleedit(main.getDtfiller(), edituserid, main.getUqvoucherid(), errMsg);
		
		if(isedit)
		{
			//删除老凭证的余额
			this.voucherDetailBP.handlerAccountPeriod(main.getUqvoucherid(), 1, -1);
			
			//删除老凭证的余额
			this.voucherDetailBP.handlerLedgerPeriod(main.getUqvoucherid(), 1, -1);
			
			//删除凭证分录
			this.voucherDetailBP.deleteVoucherDetail(main.getUqvoucherid());
			
			//删除该凭证往来信息
			this.voucherMainDAO.deleteAc(main.getUqvoucherid());
			
			//update主表的制证日期，凭证字，会计期
			this.voucherMainDAO.editVoucher(main);
			
			//解析凭证明细json
			List<VoucherDetail> voudetaillst = voucherDetailBP.parseVoucherDetail(jsonVoucherDetail, main.getUqvoucherid());
			
			//再次插入凭证明细
			voucherDetailBP.saveVoucherDetail(voudetaillst);
			
			this.voucherrulecheck(main, voudetaillst);
			
			//再次插入余额
			this.voucherDetailBP.handlerAccountPeriod(main.getUqvoucherid(), 1, 1);
			
			//删除老凭证的余额
			this.voucherDetailBP.handlerLedgerPeriod(main.getUqvoucherid(), 1, 1);
		}
	}

	public void unvouchersave(String voucherid, StringHolder errMsg) throws Exception 
	{
		//查询凭证分录，删除余额
		M8Session session = new M8Session();
		String unvouchersaveuserid = session.getUserID();
		
		boolean isunsave = this.vouchercheckruleunsave(unvouchersaveuserid, voucherid, errMsg);
		if(isunsave)
		{
			//删除老凭证的余额
			this.voucherDetailBP.handlerAccountPeriod(voucherid, 1, -1);
			
			this.voucherDetailBP.handlerLedgerPeriod(voucherid, 1, -1);
			
			//update主表的删除标志
			this.voucherMainDAO.delVoucher(voucherid);
			
			//删除该凭证往来信息
			this.voucherMainDAO.deleteAc(voucherid);
		}
	}

	public void unvouchercheck(String voucherid, StringHolder errMsg) 
	{
		M8Session session = new M8Session();
		String uncheckeruserid = session.getUserID();
		this.vouchercheckruleuncheck(uncheckeruserid, voucherid, errMsg);
	}
	
	public void unvouchercash(String voucherid, StringHolder errMsg) throws Exception 
	{
		M8Session session = new M8Session();
		String cashuserid = session.getUserID();
		
		boolean iscash = this.vouchercheckruleuncash(cashuserid, voucherid, errMsg);
		
		if(iscash)
		{
			this.voucherDetailBP.handlerAccountPeriod(voucherid, 2, -1);
			
			this.voucherDetailBP.handlerLedgerPeriod(voucherid, 2, -1);
		}
	}
	
	private boolean vouchercheckruleedit(String dtfiller, String userid, String voucherid,StringHolder errMsg) throws Exception
	{
		//1.锁表，查询状态
		boolean isedit = this.voucherMainDAO.lockVoucher(voucherid, "1");
		
		List<VoucherMain> mainlist = this.voucherMainDAO.getVoucherMainInfo(voucherid);
		
		if(mainlist.size() <= 0)
		{
			throw new RuntimeException("没有找到凭证，请联系管理员！");
		}
		
		VoucherMain main = mainlist.get(0);
		
		main.setDtfiller(dtfiller);
		
		if(!isedit)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证不能修改!";
			return false;
		}
		
		//按照当前年月获取启用的会计期
		Object[] period = voucherMainDAO.getPeriodInfoByID(main.getUqglobalperiodid());
		
		if(period != null)
		{
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date date = sdf.parse(main.getDtfiller());
			
			if(!(date.compareTo(sdf.parse(period[4].toString())) <= 0 && date.compareTo(sdf.parse(period[3].toString())) >= 0))
			{
				errMsg.value += "该凭证的制证日期必须在会计期起止时间内!";
				return false;
			}
		}
		
		//2.校验制证人是不是自己
		if(main.getUqfillerid().compareTo(userid) != 0)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证只能由制证人修改!";
			return false;
		}
		
		return true;
	}
	
	private boolean vouchercheckruleunsave(String userid, String voucherid,StringHolder errMsg) throws Exception
	{
		//1.锁表，查询状态
		boolean isedit = this.voucherMainDAO.lockVoucher(voucherid, "1");
		
		List<VoucherMain> mainlist = this.voucherMainDAO.getVoucherMainInfo(voucherid);
		
		if(mainlist.size() <= 0)
		{
			throw new RuntimeException("没有找到凭证，请联系管理员！");
		}
		
		VoucherMain main = mainlist.get(0);
		
		if(!isedit)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证不能删除!";
			return false;
		}
		
		//2.校验制证人是不是自己
		if(main.getUqfillerid().compareTo(userid) != 0)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证只能由制证人删除!";
			return false;
		}
		
		return true;
	}
	
	private boolean vouchercheckruleuncash(String userid, String voucherid,StringHolder errMsg) throws Exception
	{
		boolean isuncash = this.voucherMainDAO.lockVoucher(voucherid, "5");
		
		List<VoucherMain> mainlist = this.voucherMainDAO.getVoucherMainInfo(voucherid);
		
		if(mainlist.size() <= 0)
		{
			throw new RuntimeException("没有找到凭证，请联系管理员！");
		}
		
		VoucherMain main = mainlist.get(0);
		
		if(!isuncash)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证已经反出纳过了!";
			return false;
		}
		
		//1.检查制证人和审核人和出纳人是不是同一个人
		if(main.getUqcasherid().compareTo(userid) != 0)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证的反出纳人和出纳人不是同一个人!";
			return false;
		}
		
		this.voucherMainDAO.updateVoucherState("5", "1", voucherid, "", main.getDtfiller(), main.getDtfillersrv());
		
		return true;
	}
	
	private boolean vouchercheckruleuncheck(String userid, String voucherid, StringHolder errMsg)
	{
		boolean isuncheck = this.voucherMainDAO.lockVoucher(voucherid, "4");
		
		List<VoucherMain> mainlist = this.voucherMainDAO.getVoucherMainInfo(voucherid);
		
		if(mainlist.size() <= 0)
		{
			throw new RuntimeException("没有找到凭证，请联系管理员！");
		}
		
		VoucherMain main = mainlist.get(0);
		
		if(!isuncheck)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证已经反审核过了!";
			return false;
		}
		
		//审核人和反审核人必须是同一个人
		if(main.getUqcheckerid().compareTo(userid) != 0)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证的反审核人和审核人不是同一个人!";
			return false;
		}
		
		this.voucherMainDAO.updateVoucherState("4", "0", voucherid, "", main.getDtfiller(), main.getDtfillersrv());
		return true;
	}
	
	private void voucherrulecheck(VoucherMain main,List<VoucherDetail> list)
	{
		boolean period = this.voucherMainDAO.getPeriodInfo(main.getUqglobalperiodid());
		if(!period)
		{
			throw new RuntimeException("会计期没有启用！");
		}
		
		if(!this.checkVouBusinessLogic(main, list))
		{
			throw new RuntimeException("借贷金额合计不平！");
		}
		
	}
	
	private boolean vouchercheckrulecheck(String userid, String voucherid, String vouchercheckdate, StringHolder errMsg) throws Exception
	{
		boolean iscash = this.voucherMainDAO.lockVoucher(voucherid, "1");
		
		List<VoucherMain> mainlist = this.voucherMainDAO.getVoucherMainInfo(voucherid);
		
		if(mainlist.size() <= 0)
		{
			throw new RuntimeException("没有找到凭证，请联系管理员！");
		}
		
		VoucherMain main = mainlist.get(0);
		
		if(!iscash)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证已经审核过了!";
			return false;
		}
		
		//1.检查制证人和审核人是不是同一个人
		if(main.getUqfillerid().compareTo(userid) == 0)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证的制证人和审核人是同一个人!";
			return false;
		}
		
		//2。检查审核时间是不是在会计期起止时间内
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = sdf.parse(vouchercheckdate);
		
		if(!(date.compareTo(sdf.parse(main.getDtend())) <= 0 && date.compareTo(sdf.parse(main.getDtbegin())) >= 0))
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证审核时间不在会计期起止时间内!";
			return false;
		}
		
		//3.检查审核时间要晚于制证时间
		Date filldate = sdf.parse(main.getDtfiller());
		if(!(date.compareTo(filldate) >= 0))
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证审核日期不能早于制证日期!";
			return false;
		}
		
		return true;
	}
	
	private boolean vouchercheckrulecash(String userid, String voucherid, String vouchercashdate, StringHolder errMsg) throws Exception
	{
		boolean iscash = this.voucherMainDAO.lockVoucher(voucherid, "2");
		
		List<VoucherMain> mainlist = this.voucherMainDAO.getVoucherMainInfo(voucherid);
		
		if(mainlist.size() <= 0)
		{
			throw new RuntimeException("没有找到凭证，请联系管理员！");
		}
		
		VoucherMain main = mainlist.get(0);
		
		if(!iscash)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证已经出纳过了!";
			return false;
		}
		
		//1.检查制证人和审核人和出纳人是不是同一个人
		if(main.getUqfillerid().compareTo(userid) == 0)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证的制证人和出纳人是同一个人!";
			return false;
		}
		
		if(main.getUqcheckerid().compareTo(userid) == 0)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证的审核人和出纳人是同一个人!";
			return false;
		}
		
		//2。检查审核时间是不是在会计期起止时间内
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = sdf.parse(vouchercashdate);
		
		if(!(date.compareTo(sdf.parse(main.getDtend())) <= 0 && date.compareTo(sdf.parse(main.getDtbegin())) >= 0))
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证出纳时间不在会计期起止时间内!";
			return false;
		}
		
		//3.检查出纳时间要晚于审核时间
		Date filldate = sdf.parse(main.getDtchecker());
		if(!(date.compareTo(filldate) >= 0))
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证出纳日期不能早于审核日期!";
			return false;
		}
		
		return true;
	}
	
	private boolean vouchercheckruleend(VoucherMain main, String userid, String voucherid, String voucherenddate, StringHolder errMsg) throws Exception
	{
		boolean iscash = this.voucherMainDAO.lockVoucher(voucherid, "3");
		
		if(!iscash)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证已经记账过了!";
			return false;
		}
		
		//1.检查制证人和审核人和出纳人是不是同一个人
		if(main.getUqfillerid().compareTo(userid) == 0)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证的制证人和记账人是同一个人!";
			return false;
		}
		
		if(main.getUqcheckerid().compareTo(userid) == 0)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证的审核人和记账人是同一个人!";
			return false;
		}
		
		if(main.getUqcasherid().compareTo(userid) == 0)
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证的出纳人和记账人是同一个人!";
			return false;
		}
		
		//2。检查记账时间是不是在会计期起止时间内
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = sdf.parse(voucherenddate);
		
		if(!(date.compareTo(sdf.parse(main.getDtend())) <= 0 && date.compareTo(sdf.parse(main.getDtbegin())) >= 0))
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证记账时间不在会计期起止时间内!";
			return false;
		}
		
		//3.检查记账时间要晚于审核时间
		Date filldate = sdf.parse(main.getDtchecker());
		if(!(date.compareTo(filldate) >= 0))
		{
			errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证记账日期不能早于审核日期!";
			return false;
		}
		
		if("2".equals(main.getIntcashflag()))
		{
			//已出纳
			filldate = sdf.parse(main.getDtcasher());
			if(!(date.compareTo(filldate) >= 0))
			{
				errMsg.value += "流水号为"+main.getIntcompanyseq()+"的凭证记账日期不能早于出纳日期!";
				return false;
			}
		}
		
		return true;
	}
	
	/**
	 * 借贷金额合计不平
	 * @param main
	 * @param list
	 * @return
	 */
	private boolean checkVouBusinessLogic(VoucherMain main,List<VoucherDetail> list)
	{
		if(main.getMnydebitsum().compareTo(main.getMnycreditsum()) != 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	
	private VoucherMain parseVoucherMain(String jsonVoucherMain)
	{
		JSONObject jsonmaininfo = JSONObject.fromObject(jsonVoucherMain);
		
		VoucherMain main =  new VoucherMain();
		//查删改是传递主键过来的
		if(StringUtil.isNullString(jsonmaininfo.getString("uqvoucherid")))
		{
			main.setUqvoucherid(UUID.randomUUID().toString().toUpperCase());
		}
		else
		{
			main.setUqvoucherid(jsonmaininfo.getString("uqvoucherid"));
		}
		
		main.setIntvouchernum(-999999);
		main.setUqnumbering(jsonmaininfo.getString("uqnumbering"));
		main.setUqcompanyid(jsonmaininfo.getString("uqcompanyid"));
		main.setIntaffix(new Integer(jsonmaininfo.getString("intaffix")));
		main.setUqglobalperiodid(jsonmaininfo.getString("uqglobalperiodid"));
		main.setMnydebitsum(new java.math.BigDecimal(jsonmaininfo.getString("mnydebitsum")));
		main.setMnycreditsum(new java.math.BigDecimal(jsonmaininfo.getString("mnycreditsum")));
		main.setUqaccountantid(jsonmaininfo.getString("uqaccountantid"));
		main.setUqcasherid(jsonmaininfo.getString("uqcasherid"));
		main.setUqcheckerid(jsonmaininfo.getString("uqcheckerid"));
		main.setUqfillerid(jsonmaininfo.getString("uqfillerid"));
		main.setDtfiller(jsonmaininfo.getString("dtdate"));
		//修改凭证状态
		SimpleDateFormat simpleformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		java.util.Date date = new java.util.Date();  
		String dtfillersrv = simpleformat.format(date); 
		main.setDtfillersrv(dtfillersrv);
		
		return main;
	}
	
	public Object[] getCurrentPeriodInfo(ConditionMap cdtMap)
	{
		String strDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		int nowyearmonth = Integer.parseInt(strDate.substring(0, 4) + strDate.substring(5, 7));
		Object[] period = null;
		String flag = cdtMap.getString("flag");
		//按照当前年月获取启用的会计期
		if ("0".equals(flag)) 
		{
			period = voucherMainDAO.getCurrentPeriodInfo(nowyearmonth);
		}
		else 
		{
			period = voucherMainDAO.getCurrentPeriodInfoAll(nowyearmonth);
		}
		return period;
	}
	
	
	private void saveVoucherMain(VoucherMain main)
	{
		this.voucherMainDAO.saveVoucherMain(main);
	}
	
	public PageData<EntityMap> getVoucherMakeInfo(
			int start, int limit)
	{
		return this.voucherMainDAO.getVoucherMakeInfo(start, limit);
	}
	
	public PageData<EntityMap> getVoucherQueryInfo(ConditionMap cdtMap, 
			int start, int limit)
	{
		return this.voucherMainDAO.getVoucherQueryInfo(cdtMap, start, limit);
	}
	
	public PageData<EntityMap> getVoucherCheckInfo(ConditionMap cdtMap,
			int start, int limit) throws Exception 
	{
		return this.voucherMainDAO.getVoucherCheckInfo(cdtMap, start, limit);
	}
	
	public PageData<EntityMap> getVoucherCashInfo(ConditionMap cdtMap,
			int start, int limit) throws Exception 
	{
		return this.voucherMainDAO.getVoucherCashInfo(cdtMap, start, limit);
	}
	
	public PageData<EntityMap> getVoucherEndInfo(ConditionMap cdtMap,
			int start, int limit) throws Exception
	{
		return this.voucherMainDAO.getVoucherEndInfo(cdtMap, start, limit);
	}
	
	public String getAccountManager(String filldate)
	{
		return this.voucherMainDAO.getAccountManager(filldate);
	}
	
	//新增  2017-12-12
	//Created by wuzehua on 2017/10/12.
	//从临时表中，根据voucherid查询数据
	public List<EntityMap> getTempData(String voucherid)
	{
		boolean isData = this.voucherMainDAO.isTemoData(voucherid);
		if(isData)
		{
			return this.voucherMainDAO.getTempData(voucherid);
		}
		else
		{
			return null;
		}
		
	}
	
	//新增  2017-12-12
	//Created by wuzehua on 2017/10/12.
	//记账完成后，从临时表中，根据uqvoucherid删除数据
	public void deleteTempData(String voucherid)
	{
		this.voucherMainDAO.deleteAc(voucherid);
	}
}
