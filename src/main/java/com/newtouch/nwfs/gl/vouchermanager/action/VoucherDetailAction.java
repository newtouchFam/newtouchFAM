package com.newtouch.nwfs.gl.vouchermanager.action;

import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ComplexPattern;
import com.newtouch.cloud.common.JSONUtils;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.nwfs.gl.vouchermanager.bp.VoucherDetailBP;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherDetail;

@Controller
@Scope("prototype")
@RequestMapping("/vouchermanager/voucherdetail")
public class VoucherDetailAction
{
	@Autowired
	private VoucherDetailBP voucherDetailBP;

//	private String uqvoucherid;
//	private String jsonString;
//	private String uqaccountid;
	
	/**
	 * 获取凭证明细信息
	 * 
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping("/detailinfo")
	@ResponseBody
	public Object getVoucherDetailInfo(@RequestParam String uqvoucherid) throws Exception
	{
		List<VoucherDetail> detailslst = this.voucherDetailBP.getVoucherDetailInfo(uqvoucherid);
		JSONArray array = new JSONArray();
		for(int i = 0; i < detailslst.size(); i ++)
		{
			VoucherDetail detail = (VoucherDetail)detailslst.get(i);
			ComplexPattern pattern = new ComplexPattern();
			pattern.add("*");
			JSONObject json = JSONUtils.JasonFromComplexData(detail, pattern);
			JSONObject complex = new JSONObject();
			complex.put("id", detail.getUqaccountid());
			complex.put("text", "[" + detail.getAccountcode() + "]" + detail.getAccountname());
            json.put("uqaccountid", "\"" + complex.toString() + "\"");
            
            //处理界面定义错误问题
            json.put("intisledger", detail.getIntisledge());
            
            if(detail.getIntisledge() == 1)
            {
            	json.put("accountledgertype", this.voucherDetailBP.getVouDetailLedgerType(detail.getUqvoucherdetailid()));
            	json.put("accountledger", this.voucherDetailBP.getVouDetailLedger(detail.getUqvoucherdetailid(), detail.getMnycredit().add(detail.getMnydebit())));
            }
            else
            {
            	json.put("accountledgertype", "");
            	json.put("accountledger", "");
            	
            	//通过凭证IDuqvoucherid 和 分录IDdetail.getUqvoucherdetailid() 去临时表获取数据
                List<EntityMap> offsetData = this.voucherDetailBP.getOffsetData(uqvoucherid, detail.getUqvoucherdetailid(), "");
                if(offsetData.size()>0)
                {
                	json.put("noledgerac", offsetData.get(0).toJsonString());
                }
                else
                {
                	json.put("noledgerac", "");
                }
            }
            
            
            array.add(json);
		}
		JSONObject rtn = new JSONObject();
		rtn.put("data", array);
		return rtn;
	}
	
	/**
	 * 凭证分录按照科目带出分户信息
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/ledgerinfo")
	@ResponseBody
	public Object getLedgerInfoByAccountID(@RequestParam String uqaccountid) throws Exception
	{
		JSONObject rtn = this.voucherDetailBP.getLedgerInfoByAccountID(uqaccountid);
		return rtn;
	}
	
	/**
	 * 检测科目是否符合电信核销科目
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/acinfo")
	@ResponseBody
	public Object getACInfoByAccountID(@RequestParam String uqaccountid) throws Exception
	{
		JSONObject rtn = this.voucherDetailBP.getACInfoByAccountID(uqaccountid);
		return rtn;
	}
}
