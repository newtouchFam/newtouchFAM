package com.newtouch.nwfs.gl.component.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionJSONUtil;
import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nwfs.gl.component.bp.XyLedgerTreeBP;

@Controller
@Scope("prototype")
@RequestMapping("/component/xyledgertree")
public class XyLedgerTreeAction
{
	@Autowired
	private XyLedgerTreeBP xyledgertreebp;
	
	/*
	 * 查询分户组件的数据
	 */
	@RequestMapping("/ledgertree")
	@ResponseBody
	public Object ledgerTree(HttpSession httpSession,
			@RequestParam String id,
			@RequestParam String tag,
			@RequestParam(required=false) String accountcode,
			@RequestParam(required=false, defaultValue = "false") Boolean acin)
	{
		
		try
		{
			M8Session session = new M8Session(httpSession);
			String companyid = session.getCompanyID();
			List<EntityMap> list = new ArrayList<EntityMap>();
			list = this.xyledgertreebp.ledgerTree(companyid,id,tag,accountcode);
			JSONArray array = JSONArray.fromObject(list);
			JSONArray ary = new JSONArray();
			if(StringUtil.isNullString(accountcode))
			{
				for (int i = 0; i < array.size(); i++) 
				{
					JSONObject obj = (JSONObject) array.get(i);
					ary.add(obj);
				}
			}
			else 
			{
				for (int i = 0; i < array.size(); i++) 
				{
					JSONObject obj = (JSONObject) array.get(i);
					if(!acin)
					{
						obj.put("checked", false);
					}
					ary.add(obj);
				}
			}
			return ary;
		} 
		catch (Exception ex)
		{
			ex.printStackTrace();
			return ActionJSONUtil.toException(ex);
		}
	}
}
