package com.newtouch.test.action;

import java.util.HashMap;
import java.util.Map;

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
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.test.bp.ATestBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/atest/")
public class ATestAction
{
	@Autowired
	private ATestBP bp;

	@RequestMapping("/do1")
	@ResponseBody
	public ActionResult getData(HttpServletRequest reqeust,
			HttpServletResponse response,
			HttpSession httpSession,
			@RequestParam(required=false, defaultValue="1") int start,
			@RequestParam(required=false, defaultValue="0") Integer limit,
			@RequestParam(required=false, defaultValue="abc") String jsonCondition)
	{
		ConditionMap map = new ConditionMap(jsonCondition, start, limit.intValue());
		map.getStart();
		map.getLimit();
		map.getString("cade");
		map.containsCondition("");
		

		return ActionResultUtil.toSingleResult(String.valueOf(start) + ", " + String.valueOf(limit) + ", " + jsonCondition);
	}

	@RequestMapping("/do2")
	@ResponseBody
	public String getData2()
	{
		String ret = "我们aaa";
		return ret;
	}

	@RequestMapping("/do3")
	@ResponseBody
	public Object getData3()
	{
		Map<String, String> m2 = new HashMap<String, String>();
		m2.put("eee", "ggg");

		Map<String, Object> m = new HashMap<String, Object>();
		m.put("abc", "bbb");
		m.put("ccc", 123.567);
		m.put("ddd", m2);
		
		XXX x = new XXX();
		x.setId("myid");
		x.setName("myname");
		m.put("xxx", x);

		return m;
	}

	@RequestMapping("/do4")
	@ResponseBody
	public Object getData4()
	{
		XXX x = new XXX();
		x.setId("myid");
		x.setName("myname");

		return x;
	}

	public class XXX
	{
		private String id;
		private String name;
		public String getId()
		{
			return id;
		}
		public void setId(String id)
		{
			this.id = id;
		}
		public String getName()
		{
			return name;
		}
		public void setName(String name)
		{
			this.name = name;
		}
	}
}