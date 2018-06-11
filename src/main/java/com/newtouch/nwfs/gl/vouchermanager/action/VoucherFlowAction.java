package com.newtouch.nwfs.gl.vouchermanager.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.vouchermanager.bp.VoucherFlowBP;

/**
 * 现金流量编制action
 * @author feng
 *
 */
@Controller
@Scope("prototype")
@RequestMapping("/vouchermanager/voucherflow")
public class VoucherFlowAction 
{
	@Autowired
	private VoucherFlowBP bp;
	
	@RequestMapping("/getVoucherFlowInfo")
	@ResponseBody
	public Object getVoucherFlowInfo(@RequestParam(required=false, defaultValue="{}") String jsonCondition,
			@RequestParam Integer start,
			@RequestParam Integer limit)
	{
		PageData<EntityMap> page = null;
		try 
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			page = this.bp.getVoucherFlowInfo(cdtMap, start, limit);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
		return ActionResultUtil.toPageData(page);
	}
	
	@RequestMapping("/noUseHandler")
	@ResponseBody
	public Object noUseHandler(@RequestParam String jsonVoucherDetailid)
	{
		try 
		{
			this.bp.noUseHandler(jsonVoucherDetailid);
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		}
		catch (Exception e) 
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	
	@RequestMapping("/useHandler")
	@ResponseBody
	public Object useHandler(@RequestParam String jsonVoucherDetailid,@RequestParam String uqflowitemid)
	{
		try 
		{
			this.bp.useHandler(jsonVoucherDetailid, uqflowitemid);
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		}
		catch (Exception e) 
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	
}
