package com.newtouch.nwfs.gl.vouchermanager.action;

import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

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
import com.newtouch.nwfs.gl.vouchermanager.bp.VoucherFlowChooseBP;
import com.newtouch.nwfs.gl.vouchermanager.entity.BaseTreeData2Entity;

/**
 * 现金流量选择action
 * @author feng
 *
 */
@Controller
@Scope("prototype")
@RequestMapping("/vouchermanager/flowchoose")
public class VoucherFlowChooseAction
{
	@Autowired
	private VoucherFlowChooseBP bp;
	
	/**
	 * 获得树
	 * @param node
	 * @return
	 */
	@RequestMapping("/findFlowGroup")
	@ResponseBody
	public Object findFlowGroup(@RequestParam String node)
	{
		List<BaseTreeData2Entity> list = this.bp.findFlowGroup(node);
		if (null != list && list.size() > 0) 
		{
			JSONArray ja = new JSONArray();
			JSONObject jo = null;
			for(int i = 0 ;i < list.size();i++)
			{
				BaseTreeData2Entity entity = list.get(i);
				jo = new JSONObject();
				jo.put("id", entity.getId());
				jo.put("text", entity.getText());
				jo.put("leaf", entity.getLeaf());
				jo.put("code", entity.getCode());
				jo.put("name", entity.getName());
				ja.add(jo);
			}
			return ja ; 
		}
		else
		{
			JSONArray ja = new JSONArray();
			return ja;
		}
	}
	
	/**
	 * 获得列表
	 * @return
	 */
	@RequestMapping("/findFlowByFilter")
	@ResponseBody
	public Object findFlowByFilter(@RequestParam String jsonFilter ,
			@RequestParam Integer start,
			@RequestParam Integer limit ,
			@RequestParam(required=false) String node)
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
		
		if(cdtMap != null )
		{
			if(StringUtil.isNullString(cdtMap.getString("code")) && StringUtil.isNullString(node))
			{
				return null;
			}
		}
		String codecondition = null ;
		PageData<EntityMap> pageData = bp.findAccountByFilter(cdtMap.getString("code"), node, codecondition, cdtMap, start, limit);
        return  ActionResultUtil.toPageData(pageData);
	}

}
