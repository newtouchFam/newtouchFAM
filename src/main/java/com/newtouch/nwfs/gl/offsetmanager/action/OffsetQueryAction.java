package com.newtouch.nwfs.gl.offsetmanager.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.offsetmanager.bp.OffsetQueryBp;

/**
 * 往来查询Action
 * @author xtc
 * date : 2017/12/22
 */

@Scope("prototype")
@Controller
@RequestMapping("/offsetmanager/offsetquery")
public class OffsetQueryAction {
	
	@Autowired
	private OffsetQueryBp offsetqueryBp;
	/*
	 * 根据条件查找所有往来数据
	 */
	@RequestMapping("/getdata")
	@ResponseBody
	public ActionResult getdata(@RequestParam String jsonParams, @RequestParam Integer start, @RequestParam Integer limit)
	{
		
		ConditionMap cdtMap = null;
		if (! StringUtil.isNullString(jsonParams))
	    {
	    	cdtMap = new ConditionMap(jsonParams);
	    }
	    else
	    {
	        cdtMap = new ConditionMap();
	    }
	    try 
	    {
	        PageData<EntityMap> datas = offsetqueryBp.getDataPage(cdtMap, start, limit);
	        return ActionResultUtil.toPageData(datas);
	        } catch (Exception e) {
	            return ActionResultUtil.toFailure(e.getMessage());
	        }
	}
	
	/*
	 * 查看往来明细
	 */
	@RequestMapping("/getdetaildata")
	@ResponseBody
	public ActionResult getdetail (@RequestParam String jsonParams, @RequestParam Integer start, @RequestParam Integer limit){
		ConditionMap cdtMap = null;
		if (! StringUtil.isNullString(jsonParams))
	    {
	    	cdtMap = new ConditionMap(jsonParams);
	    }
	    else
	    {
	        cdtMap = new ConditionMap();
	    }
		try 
	    {
	        PageData<EntityMap> datas = offsetqueryBp.getdetail(cdtMap, start, limit);
	        return ActionResultUtil.toPageData(datas);
	        } catch (Exception e) {
	            return ActionResultUtil.toFailure(e.getMessage());
	        }
	}
}
