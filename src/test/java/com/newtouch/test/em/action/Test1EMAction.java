package com.newtouch.test.em.action;

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
import com.newtouch.nwfs.platform.session.M8Session;
import com.newtouch.test.em.bp.Test1EMBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/test/test1em")
public class Test1EMAction
{
	@Autowired
	private Test1EMBP bp;

	@RequestMapping("/test1")
	@ResponseBody
	public ActionResult test1(HttpSession httpSession, @RequestParam(required=false) String ds)
	{
		if (ds != null && (! ds.equals("")))
		{
			M8Session m8session = new M8Session(httpSession);
			m8session.setSetID(ds);

//			DataSourceContextHolder.setDataSourceType(ds);
		}

		this.bp.test1();

		return ActionResultUtil.toSuccess();
	}
}