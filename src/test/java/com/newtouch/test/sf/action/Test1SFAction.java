package com.newtouch.test.sf.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.datasouce.dynamic.DataSourceContextHolder;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.test.sf.bp.Test1SFBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/test/test1sf")
public class Test1SFAction
{
	@Autowired
	private Test1SFBP bp;

	@RequestMapping("/test1")
	@ResponseBody
	public ActionResult test1(@RequestParam(required=false) String ds)
	{
		if (ds != null && (! ds.equals("")))
		{
			DataSourceContextHolder.setDataSourceType(ds);
		}

		this.bp.test1();

		return ActionResultUtil.toSuccess();
	}
}