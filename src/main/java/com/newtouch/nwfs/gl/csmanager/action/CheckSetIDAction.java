package com.newtouch.nwfs.gl.csmanager.action;

import javax.servlet.http.HttpSession;
import javax.xml.rpc.holders.StringHolder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.nwfs.gl.csmanager.bp.CheckSetIDbp;
import com.newtouch.nwfs.platform.interceptor.DynamicDataSourceUtil;


@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/csmanager/checksetid")
public class CheckSetIDAction 
{
	@Autowired
	private CheckSetIDbp setIDbp;
	private Logger logger = LoggerFactory.getLogger("CheckSetIDAction");
	
	@RequestMapping("/checkSetID")
	@ResponseBody
	public ActionResult  checkSetID(HttpSession httpSession,@RequestParam(required=false) String jsonString) 
	{
		try 
		{
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			//切换到管理库
			DynamicDataSourceUtil.changeSet(httpSession, "manage");
			StringHolder errormsg = new StringHolder();
			
			ConditionMap cdtMap = new ConditionMap(jsonString);
			String SetID = cdtMap.getString("SetID");
			
			setIDbp.checkSetID(SetID, errormsg);
			if(errormsg.value == null)
			{
				result.setSuccess(true);
			}
			else
			{
				result.setSuccess(false);
				result.setMsg(errormsg.value);
			}
			return result;
		}
		catch (Exception e)
		{
			logger.error("[checkSetIDLogger错误信息] :" + e.getMessage());
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg("账套检查失败！");
			return result;
		}
	}
}
