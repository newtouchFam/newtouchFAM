package com.newtouch.nwfs.gl.vouchermanager.action;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.vouchermanager.bp.VoucherAccountBP;
import com.newtouch.nwfs.gl.vouchermanager.entity.BaseTreeData2Entity;

@Controller
@Scope("prototype")
@RequestMapping("/vouchermanager/voucheraccount")
public class VoucherAccountAction  
{
	@Autowired
	public VoucherAccountBP voucheraccountbp;
	
	@RequestMapping("/group")
	@ResponseBody
	public Object findAccountGroup(HttpSession httpSession, 
			@RequestParam String node)
	{
		String uqaccountsetid = ObjectUtils.toString(httpSession.getAttribute("ACCOUNTSETID"));
		List<BaseTreeData2Entity> dataList = voucheraccountbp.findAccountGroup(uqaccountsetid, node);
		return dataList;
	}
	
	@RequestMapping("/filter")
	@ResponseBody
	public Object findAccountByFilter(HttpSession httpSession, 
			@RequestParam String jsonFilter,
			@RequestParam(required=false) String codecondition,
			@RequestParam(required=false) String node,
			@RequestParam int start,
			@RequestParam int limit)
	{

		ConditionMap cdtMap = null;
		if (! StringUtil.isNullString(jsonFilter))
		{
			cdtMap = new ConditionMap(jsonFilter);
		}
		else
		{
			cdtMap = new ConditionMap();
		}

		String uqaccountsetid = ObjectUtils.toString(httpSession.getAttribute("ACCOUNTSETID"));
		
		PageData<EntityMap> pageData = voucheraccountbp.findAccountByFilter(uqaccountsetid, cdtMap.getString("code"), node, codecondition, cdtMap, start, limit);
		return ActionResultUtil.toPageData(pageData);
	}
}
