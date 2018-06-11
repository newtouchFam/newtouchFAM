package com.newtouch.nwfs.platform.action;

import javax.servlet.http.HttpSession;
import javax.xml.rpc.holders.StringHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.nwfs.platform.bp.SetIDbp;
import com.newtouch.nwfs.platform.interceptor.DynamicDataSourceUtil;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/platform/security")
public class SetIDAction
{
	@Autowired
	private SetIDbp setIDbp;
	
	@RequestMapping("/checksetid")
	@ResponseBody
	public ActionResult checkSetID( HttpSession httpSession,
			@RequestParam(value = "setid") String setID
			) {
		try 
		{
			//切换到管理库
			DynamicDataSourceUtil.changeSet(httpSession,"manage");
			StringHolder errormsg = new StringHolder();
			setIDbp.checkSetID(setID, errormsg);
			ActionResult actionResult = new ActionResult();
			if(errormsg.value == null)
			{
				actionResult.setSuccess(true);
			}
			else
			{
				actionResult.setSuccess(false);
				actionResult.setMsg(errormsg.value);
			}
			return actionResult;
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return null;
	}
}
