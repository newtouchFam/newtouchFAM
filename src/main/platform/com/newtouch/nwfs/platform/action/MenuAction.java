package com.newtouch.nwfs.platform.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionJSONUtil;
import com.newtouch.cloud.common.EntityUtil;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.TreeNodeData;
import com.newtouch.nwfs.platform.bp.MenuBP;
import com.newtouch.nwfs.platform.session.M8Session;

@Controller
@Scope("prototype")
@RequestMapping("/menu")
public class MenuAction
{
	@Autowired
	private MenuBP bp;

	@RequestMapping(value="/tree", produces="application/json; charset=utf-8")
	@ResponseBody
	public String getTree(HttpSession httpSession,
			@RequestParam String node,
			@RequestParam(required=false, defaultValue="{}") String jsonCondition)
	{
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			M8Session m8Session = new M8Session(httpSession);
			cdtMap.put("userid", m8Session.getUserID());

			List<EntityMap> list = this.bp.getTree(node, cdtMap);

			List<TreeNodeData> treeData = null;

			treeData = EntityUtil.TreeDataListFromEntityMapList(list,
					"id", "text", "leaf");

			return ActionJSONUtil.toTreeData(treeData);
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			return ActionJSONUtil.toException(ex);
		}
	}
	
	/**
	 * 获取菜单 （带权限）
	 */
	@RequestMapping(value="/menutree", produces="application/json; charset=utf-8")
	@ResponseBody
	public String getMenuTree(HttpSession httpSession,
			@RequestParam String node
			)
	{
		try
		{
			List<EntityMap> list = new ArrayList<EntityMap>();
			M8Session m8Session = new M8Session(httpSession);
			if(m8Session.getUserCode().equals("boss"))
	        {
				ConditionMap cdtMap = new ConditionMap();
				cdtMap.put("userid", m8Session.getUserID());
				list = this.bp.getTree(node, cdtMap);
	        }
	        else
	        {
	        	list = this.bp.getMenuTree(node, m8Session.getUserID(), m8Session.getCompanyID());
	        }
			List<TreeNodeData> treeData = null;
			treeData = EntityUtil.TreeDataListFromEntityMapList(list,
					"id", "text", "leaf");

			return ActionJSONUtil.toTreeData(treeData);
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			return ActionJSONUtil.toException(ex);
		}
	}
}
