package com.newtouch.nwfs.gl.component.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.workflow.app.action.CommonTreeDataAction;

public class XyCheckedTreeAction extends CommonTreeDataAction 
{
	@Override
	@RequestMapping("/wf/XyCheckedTreeAction.action")
	@ResponseBody
	public Object execute(HttpServletRequest request,
			@RequestParam(required=false) String scriptPath,
			@RequestParam(required=false) String sqlProcFile,
			@RequestParam(required=false) String sqlFile,
			@RequestParam(required=false) String node,
			@RequestParam(required=false) String firstSqlFile,
			@RequestParam(required=false) String otherSqlFile) throws Exception 
	{
		List<?> lst = null;
		if (StringUtils.isNotBlank(sqlProcFile))
		{
			lst = this.getBp().getProcData(0, 0, this.getStatementParser().getText(scriptPath, sqlProcFile), this.getParams(request), null, null, null);
		}
		else
		{
			if (node.trim().length() == 0 || node.trim().equals("root"))
			{
				lst = this.getBp().getData(0, 0, this.getStatementParser().getText(scriptPath, firstSqlFile), this.getParams(request), null, null, null);
			}
			else
			{
				lst = this.getBp().getData(0, 0, this.getStatementParser().getText(scriptPath, otherSqlFile), this.getParams(request), null, null, null);
			}
		}
		JSONArray array = JSONArray.fromObject(lst);
		JSONArray ary = new JSONArray();
		for (int i = 0; i < array.size(); i++) 
		{
			JSONObject obj = (JSONObject) array.get(i);
			obj.put("checked", false);
			ary.add(obj);
		}
		return ary;
	}
}
