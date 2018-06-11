package com.newtouch.cloud.demo.crud.action;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.EntityUtil;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.demo.crud.bp.AccountBP;
import com.newtouch.cloud.demo.crud.entity.AccountEntity;
import com.newtouch.nwfs.platform.session.M8Session;

/**
 * 主数据后台服务Demo样例
 */
@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/demo/account")
public class AccountAction
{
	@Autowired
	private AccountBP bp;

	
	@RequestMapping("/list")
	@ResponseBody
	public ActionResult getList(HttpSession httpSession,
			@RequestParam(required=false) String jsonCondition)
	{
		try
		{
			M8Session m8session = new M8Session(httpSession);

			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			cdtMap.put("userid", m8session.getUserID());

			List<AccountEntity> list = this.bp.getList(cdtMap);
			return ActionResultUtil.toData(list);
		}
		catch(Exception ex)
		{
			ex.printStackTrace();

			return ActionResultUtil.toFailure(ex.getMessage());
		}
	}

	@RequestMapping("/list2")
	@ResponseBody
	public ActionResult getList2(HttpSession httpSession,
			@RequestParam(required=false) String jsonCondition)
	{
		try
		{
			M8Session m8session = new M8Session(httpSession);

			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			cdtMap.put("userid", m8session.getUserID());

			List<EntityMap> list = this.bp.getList2(cdtMap);
			return ActionResultUtil.toData(list);
		}
		catch(Exception ex)
		{
			ex.printStackTrace();

			return ActionResultUtil.toFailure(ex.getMessage());
		}
	}

	@RequestMapping("/page")
	@ResponseBody
	public ActionResult getPage(HttpSession httpSession, @RequestParam String jsonCondition,
			@RequestParam int start, @RequestParam int limit)
	{
		try
		{
			M8Session m8session = new M8Session(httpSession);

			ConditionMap cdtMap = new ConditionMap(jsonCondition, start, limit);
			cdtMap.put("userid", m8session.getUserID());

			PageData<AccountEntity> page = this.bp.getPage(cdtMap);
			return ActionResultUtil.toPageData(page);
		}
		catch(Exception ex)
		{
			ex.printStackTrace();

			return ActionResultUtil.toFailure(ex.getMessage());
		}
	}

	@RequestMapping("/page2")
	@ResponseBody
	public ActionResult getPage2(HttpSession httpSession, @RequestParam String jsonCondition,
			@RequestParam int start, @RequestParam int limit)
	{
		try
		{
			M8Session m8session = new M8Session(httpSession);

			ConditionMap cdtMap = new ConditionMap(jsonCondition, start, limit);
			cdtMap.put("userid", m8session.getUserID());

			PageData<EntityMap> page = this.bp.getPage2(cdtMap);
			return ActionResultUtil.toPageData(page);
		}
		catch(Exception ex)
		{
			ex.printStackTrace();

			return ActionResultUtil.toFailure(ex.getMessage());
		}
	}

	@RequestMapping("/add")
	@ResponseBody
	public ActionResult add(HttpSession httpSession, @RequestParam String jsonString)
	{
		try
		{
			AccountEntity account = EntityUtil.EntityFromJSON(jsonString, AccountEntity.class);

			this.bp.add(account);

			return ActionResultUtil.toSuccess();
		}
		catch(Exception ex)
		{
			ex.printStackTrace();

			return ActionResultUtil.toFailure(ex.getMessage());
		}
	}
}
