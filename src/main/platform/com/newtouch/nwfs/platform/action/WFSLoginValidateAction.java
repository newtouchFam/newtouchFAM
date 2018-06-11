package com.newtouch.nwfs.platform.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.security.result.ValidateResult;
import com.newtouch.nwfs.gl.datamanger.bp.AccountSetManagerBP;
import com.newtouch.nwfs.platform.bp.WFSLoginValidateBP;
import com.newtouch.nwfs.platform.interceptor.DynamicDataSourceUtil;
import com.newtouch.nwfs.platform.session.M8Session;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/platform/security")
public class WFSLoginValidateAction
{
	@Autowired
	private WFSLoginValidateBP bp;
	
	@Autowired
	private AccountSetManagerBP accountSetManagerBp;

	@RequestMapping("/login")
	@ResponseBody
	public Object login(HttpSession httpSession,
			@RequestParam(value = "setid") String setID,
			@RequestParam(value = "loginname") String loginName,
			@RequestParam(value = "pwd") String password)
	{
		try
		{
			/**
			 * 切换数据源
			 */
			DynamicDataSourceUtil.changeSet(httpSession, setID);

			/**
			 * 验证
			 */
			EntityMap companyMap = new EntityMap();
			ValidateResult result = this.bp.loginValidate(loginName, password, httpSession.getId(), companyMap);

			if (result.isSuccess())
			{
				/**
				 * 设置Session
				 */
				this.saveSession(httpSession, result, setID, companyMap);
				//获取开启科目套
				EntityMap map = this.accountSetManagerBp.getStartAccountSetId();
				httpSession.setAttribute("ACCOUNTSETID", map.getString("accountsetid"));
			}

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
	
	@RequestMapping("/fastlogin")
	@ResponseBody
	public Object quicklogin( HttpSession httpSession )
	{
		try
		{
			DynamicDataSourceUtil.changeSet(httpSession, "sharedatabase");
			M8Session m8Session = new M8Session(httpSession);
			m8Session.setSetID("sharedatabase");
			m8Session.setUserID("4508DE15-71CF-4834-8256-5A445B277623");
			m8Session.setUserCode("guest");
			m8Session.setUserName("guest");
			m8Session.setCompanyID("00000000-0000-0000-0000-000000000001");
			m8Session.setCompanyCode("Y-2017");
			m8Session.setCompanyName("新致企业云");
			
			//获取开启科目套
			EntityMap map = this.accountSetManagerBp.getStartAccountSetId();
			httpSession.setAttribute("ACCOUNTSETID", map.getString("accountsetid"));
			
			EntityMap actionResult = new EntityMap();
			actionResult.put("success", true);
			return actionResult;
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			return ActionResultUtil.toFailure(ex.getMessage());
		}
	}

	private void saveSession(HttpSession httpSession,
			ValidateResult result, String setID,
			EntityMap companyMap)
	{
		M8Session m8Session = new M8Session(httpSession);
		m8Session.setSetID(setID);
		m8Session.setUserID(result.getLoginAccount().getLoginAccountID());
		m8Session.setUserCode(result.getLoginAccount().getLoginName());
		m8Session.setUserName(result.getLoginAccount().getLoingAccountName());
		m8Session.setCompanyID(companyMap.getString("companyid"));
		m8Session.setCompanyCode(companyMap.getString("companycode"));
		m8Session.setCompanyName(companyMap.getString("companyname"));
	}

	@RequestMapping("/loginPorto")
	@ResponseBody
	public Object loginPortal(HttpServletRequest request, HttpServletResponse reponse,
			HttpSession httpSession)
	{
		/**
		 * 验证参数 验证账号密码 设置Session
		 */
		try
		{
			/**
			 * 解析Portal用户和认证串
			 */
			String loginName = "";
			//String auth = "";

			/**
			 * 获取并切换数据源
			 */
			String setID = "";
			DynamicDataSourceUtil.changeSet(httpSession, setID);

			/**
			 * 验证
			 */
			EntityMap companyMap = new EntityMap();
			ValidateResult result = this.bp.loginPortal(loginName, companyMap);

			if (result.isSuccess())
			{
				/**
				 * 设置Session
				 */
				this.saveSession(httpSession, result, setID, companyMap);
			}

			/**
			 * 组织返回信息
			 */
			ActionResult actionResult = new ActionResult();
			actionResult.setSuccess(result.isSuccess()).setMsg(result.getErrDesc());

			return actionResult;
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
		}
		return null;
	}

	@RequestMapping("/logout")
	@ResponseBody
	public ActionResult logout(HttpSession httpSession)
	{
		try
		{
			httpSession.invalidate();

			return ActionResultUtil.toSuccess();
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			return ActionResultUtil.toSuccess();
		}
	}

	/**
	 * 测试函数，需要删除
	 * @deprecated 
	 * @param setID
	 * @return
	 */
	@ResponseBody
	public ActionResult checkSetID(@RequestParam(value = "setid") String setID)
	{
		return ActionResultUtil.toSuccess();
	}
}