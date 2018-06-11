package com.newtouch.nwfs.platform.action;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.security.result.ValidateResult;
import com.newtouch.nwfs.platform.bp.WFSPasswordValidateBP;
import com.newtouch.nwfs.platform.interceptor.DynamicDataSourceUtil;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/platform/security")
public class WFSPasswordValidateAction
{
	@Autowired
	private WFSPasswordValidateBP bp;

	@RequestMapping("/updatepassword")
	@ResponseBody
	public Object updatePassword(HttpSession httpSession,
			@RequestParam(value = "setid") String setID,
			@RequestParam(value="loginname") String loginName,
			@RequestParam(value="oldpwd") String password_old,
			@RequestParam(value="newpwd") String password_new)
	{
		try
		{
			/**
			 * 切换数据源
			 */
			DynamicDataSourceUtil.changeSet(httpSession, setID);

			ValidateResult result = this.bp.updatePassword(loginName,
					password_old, password_new, httpSession.getId());

			/**
			 * 组织返回信息
			 */
			EntityMap actionResult = new EntityMap();
			actionResult.put("success", result.isSuccess());
			actionResult.put("type", result.getValidateResultType().value());
			actionResult.put("action", result.getValidatedActionType().toString());
			actionResult.put("msg", result.getErrDesc());

			return actionResult;
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			return ActionResultUtil.toFailure(ex.getMessage());
		}
	}
}