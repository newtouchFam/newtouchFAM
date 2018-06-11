package com.newtouch.nwfs.gl.vouchermanager.bp;

import java.math.BigDecimal;
import java.util.List;

import javax.xml.rpc.holders.StringHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.sm.basedata.bp.UnitBP;
import com.newtouch.cloud.sm.basedata.entity.UnitEntity;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherDetail;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherMain;

/**
 * 
 * @author mboat 2017年5月25日
 */
@Service
@Transactional
public class VoucherPrintBP
{
	@Autowired
	private VoucherMainBP voucherMainBP;

	@Autowired
	private VoucherDetailBP voucherDetailBP;

	@Autowired
	private UnitBP unitBP;

	/**
	 * 获取凭证报表数据
	 * @param cdtMap
	 * @param paramHeader	表头数据
	 * @param paramDetail	明细数据
	 * @param fileName		默认下载文件名
	 * @throws Exception 
	 */
	public void getVoucherPrintData(ConditionMap cdtMap,
			EntityMap paramHeader, List<EntityMap> paramDetailList,
			StringHolder fileName) throws Exception
	{
		String voucherID = cdtMap.getString("voucherid");

		VoucherMain voucherMain = this.voucherMainBP.getVoucherMain(voucherID, "");
	
		List<VoucherDetail> listVoucherDetail = this.voucherDetailBP.getVoucherDetailInfo(voucherID);

		paramHeader.put("numbering", voucherMain.getUqnumberingname());
		paramHeader.put("companyseq", voucherMain.getIntcompanyseq());
		paramHeader.put("vouchernum", voucherMain.getIntvouchernum());
		paramHeader.put("period", voucherMain.getPeriodname());
		paramHeader.put("filldate", voucherMain.getDtfiller());
		paramHeader.put("affix", voucherMain.getIntaffix());

		/* 会计号，记账以后才有 */
		String accountNum = (voucherMain.getIntflag() == 2)
				? voucherMain.getUqnumberingname() + "-" + String.valueOf(voucherMain.getIntvouchernum())
						: "";
		paramHeader.put("accountnum", accountNum);

//		CompanyProxyBP companyBP = new CompanyProxyBP();	
//		COMPANY company = companyBP.RetrieveById(SessionCertification.getUserAuth(), voucherMain.getUqcompanyid());
//		paramHeader.put("companyname", company.DESCRIPTION);
		UnitEntity unitEntity = this.unitBP.getUnitEntityByID(voucherMain.getUqcompanyid());
		paramHeader.put("companyname", unitEntity.getUnitName());

		paramHeader.put("filler", voucherMain.getUqfillername());
		paramHeader.put("checker", voucherMain.getUqcheckername());
		paramHeader.put("casher", voucherMain.getUqcashername());
		paramHeader.put("accountant", voucherMain.getUqaccountantname());

		paramHeader.put("uppermoney", this.digitUppercase(Double.valueOf(voucherMain.getMnycreditsum().toString())));
		paramHeader.put("debitsum", voucherMain.getMnydebitsum());
		paramHeader.put("creditsum", voucherMain.getMnycreditsum());

		fileName.value = "会计凭证-" + voucherMain.getPeriodname() + "-" + String.valueOf(voucherMain.getIntcompanyseq());

		for (VoucherDetail voucherDetail : listVoucherDetail)
		{
			EntityMap paramDetail = new EntityMap();
			paramDetail.put("seq", voucherDetail.getIntseq());
			paramDetail.put("abstract", voucherDetail.getVarabstract());
			paramDetail.put("account", voucherDetail.getAccountcode() + " : " + voucherDetail.getAccountname());
			paramDetail.put("debit", (voucherDetail.getMnydebit().compareTo(BigDecimal.ZERO) == 0) ? null : voucherDetail.getMnydebit());
			paramDetail.put("credit", (voucherDetail.getMnycredit().compareTo(BigDecimal.ZERO) == 0) ? null : voucherDetail.getMnycredit());
			paramDetailList.add(paramDetail);
		}
	}

	public String digitUppercase(double n)
	{
		String fraction[] = { "角", "分" };
		String digit[] = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };
		String unit[][] = { { "元", "万", "亿" }, { "", "拾", "佰", "仟" } };

		String head = n < 0 ? "负" : "";
		n = Math.abs(n);

		String s = "";
		for (int i = 0; i < fraction.length; i++)
		{
			s += (digit[(int) (Math.floor(n * 10 * Math.pow(10, i)) % 10)] + fraction[i]).replaceAll("(零.)+", "");
		}
		if (s.length() < 1)
		{
			s = "整";
		}
		int integerPart = (int) Math.floor(n);

		for (int i = 0; i < unit[0].length && integerPart > 0; i++)
		{
			String p = "";
			for (int j = 0; j < unit[1].length && n > 0; j++)
			{
				p = digit[integerPart % 10] + unit[1][j] + p;
				integerPart = integerPart / 10;
			}
			s = p.replaceAll("(零.)*零$", "").replaceAll("^$", "零") + unit[0][i] + s;
		}
		return head + s.replaceAll("(零.)*零元", "元").replaceFirst("(零.)+", "").replaceAll("(零.)+", "零").replaceAll("^整$", "零元整");
	}
}
