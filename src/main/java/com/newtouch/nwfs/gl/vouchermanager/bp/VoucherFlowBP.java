package com.newtouch.nwfs.gl.vouchermanager.bp;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.vouchermanager.dao.VoucherFlowDAO;

@Service
@Transactional
public class VoucherFlowBP 
{
	@Autowired
	private VoucherFlowDAO dao;
	
	public PageData<EntityMap> getVoucherFlowInfo(ConditionMap cdtMap,
			int start, int limit) throws Exception
	{
		return this.dao.getVoucherFlowInfo(cdtMap, start, limit);
	}
	
	public void noUseHandler(String jsonVoucherDetailId)
	{
		JSONArray arrayVoucherDetailId = JSONArray.fromObject(jsonVoucherDetailId);
		for(int i = 0; i < arrayVoucherDetailId.size(); i++)
		{
			JSONObject vouobj = arrayVoucherDetailId.getJSONObject(i);
			
			String voucherdetailid = vouobj.getString("voucherdetailid");
			String voucherid = vouobj.getString("voucherid");
			
			this.dao.noUseHandler(voucherdetailid, voucherid);
		}
	}
	
	public void useHandler(String jsonVoucherDetailId, String uqflowitemid)
	{
		JSONArray arrayVoucherDetailId = JSONArray.fromObject(jsonVoucherDetailId);
		for(int i = 0; i < arrayVoucherDetailId.size(); i++)
		{
			JSONObject vouobj = arrayVoucherDetailId.getJSONObject(i);
			
			String voucherdetailid = vouobj.getString("voucherdetailid");
			String voucherid = vouobj.getString("voucherid");
			
			this.dao.useHandler(voucherdetailid, voucherid, uqflowitemid);
		}
	}

}
