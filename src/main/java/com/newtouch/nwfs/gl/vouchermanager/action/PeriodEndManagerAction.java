package com.newtouch.nwfs.gl.vouchermanager.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.nwfs.gl.vouchermanager.bp.PeriodEndManagerBP;

@Controller
@Scope("prototype")
@RequestMapping("/vouchermanager/periodendmanager")
public class PeriodEndManagerAction 
{
	@Autowired
	private PeriodEndManagerBP bp ;
	
	/**
	 * 自动结转凭证
	 */
	@RequestMapping("/autoconvert")
	@ResponseBody
	public Object autoconvert(@RequestParam String jsonCondition)
	{
		ConditionMap map = new ConditionMap(jsonCondition);
		try 
		{
			this.bp.autoconvert(map);
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
	
	/**
	 * 获得记忆选择的	本年利润科目		本年未分配利润科目
	 * @return
	 */
	@RequestMapping("/getRember")
	@ResponseBody
	public Object getRemberAccount()
	{
		ActionResult result = new ActionResult();
		try
		{
			EntityMap map = this.bp.getRemberAccount();
			if(map!=null)
			{
				result.put("success", true);
				result.put("accountid", map.get("accountid"));
				result.put("accountcode", map.get("accountcode"));
				result.put("accountname", "["+map.get("accountcode")+"]"+map.get("accountname"));
				result.put("unaccountid", map.get("unaccountid"));
				result.put("unaccountcode", map.get("unaccountcode"));
				result.put("unaccountname", "["+map.get("unaccountcode")+"]"+map.get("unaccountname"));
			}
			else
			{
				result.put("success", false);
			}
		}
		catch (Exception e) 
    	{
			result.put("success", false);
			result.put("msg", e.getMessage());
		}
		return result;
	}
	
}
