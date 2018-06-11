package com.newtouch.cloud.demo.crud.action;

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
import com.newtouch.cloud.demo.crud.bp.DemoBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/demo")
public class DemoAction
{
	@Autowired
	private DemoBP bp;

	@RequestMapping("/list")
	@ResponseBody
	public Object getList()
	{
		return ActionResultUtil.toData(this.bp.getList());
	}

	@RequestMapping("/page")
	@ResponseBody
	public Object getPage()
	{
		return ActionResultUtil.toPageData(this.bp.getPage());
	}

	@RequestMapping("/page2")
	@ResponseBody
	public Object getPage2()
	{
		return ActionResultUtil.toPageData(this.bp.getPage2());
	}

	@RequestMapping("/getmap")
	@ResponseBody
	public Object getMap(@RequestParam("xyz1") String xyz)
	{
		EntityMap map = new EntityMap();
		map.put("abc", xyz);
		map.put("ddd", 456);

		EntityMap map2 = new EntityMap();
		map2.put("abc", "456");
		map2.put("ddd", 456);

		map.put("map", map2);

		return map;
	}

	@RequestMapping("/getresult")
	@ResponseBody
	public ActionResult getResult()
	{
		return new ActionResult().setSuccess(true).setMsg("").setTotal(0);
	}
}