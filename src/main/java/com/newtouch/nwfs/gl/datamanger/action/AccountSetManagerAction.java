package com.newtouch.nwfs.gl.datamanger.action;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.bp.AccountSetManagerBP;

@Controller
@Scope("prototype")
@RequestMapping("/datamanager/accountsetmanager")
public class AccountSetManagerAction 
{
	@Autowired
	private AccountSetManagerBP accountsetmanagerbp;
//	private static final String	SUCCESS_KEY	= "success";
//	private static final String	MESSAGE_KEY	= "msg";
//	private String[] idarrays;		//传来的ID数组
//	private int intflag;
//	private String uqaccountsetid;
//	private String varaccountsetcode;
//	private String varaccountsetname;
//	private int start;
//	private int limit;
	
	/**
	 * 获得帐套列表信息
	 */
	@RequestMapping("/accountsetlist")
	@ResponseBody
	public Object getAccountSetList(HttpSession httpSession,
			@RequestParam int start, @RequestParam int limit)
	{
		try 
		{
			PageData<EntityMap> page = this.accountsetmanagerbp.getAccountSetList(start, limit);
			return ActionResultUtil.toPageData(page);
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 增加帐套
	 */
	
	@RequestMapping("/addaccountset")
	@ResponseBody
	public Object addAccountSet(HttpSession httpSession, @RequestParam String varaccountsetcode,
			 @RequestParam String varaccountsetname)
	{
		try 
		{	
			accountsetmanagerbp.addAccountSet(varaccountsetcode, varaccountsetname);
			ActionResult ar = new ActionResult();
			ar.setSuccess(true);
			return ar;
		} 
		catch (Exception e) 
		{
			ActionResult ar = new ActionResult();
			ar.setSuccess(false);
			ar.setMsg("帐套编码或名称已经存在了");
			return ar;
		}
	}

	/**
	 * 修改帐套信息
	 */
	@RequestMapping("/editaccountset")
	@ResponseBody
	public Object editAccountSet(HttpSession httpSession, @RequestParam String uqaccountsetid,
			 @RequestParam String varaccountsetcode,@RequestParam String varaccountsetname)
	{
		try 
		{	
			accountsetmanagerbp.editAccountSet(uqaccountsetid, varaccountsetcode, varaccountsetname);
			ActionResult ar = new ActionResult();
			ar.setSuccess(true);
			return ar;
		} 
		catch (Exception e) 
		{
			ActionResult ar = new ActionResult();
			ar.setSuccess(false);
			ar.setMsg("更改的信息已经存在");
			return ar;
		}
	}
	
	/**
	 * 删除新建的帐套
	 */
	
	@RequestMapping("/delaccountset")
	@ResponseBody
	public Object delAccountSet(HttpSession httpSession, @RequestParam String[] idarrays)
	{
		try
		{
			accountsetmanagerbp.delAccountSet(idarrays);
			ActionResult ar = new ActionResult();
			ar.setSuccess(true);
			return ar;
		} 
		catch (Exception e) 
		{
			ActionResult ar = new ActionResult();
			ar.setSuccess(false);
			ar.setMsg("删除异常");
			return ar;
		}
	}
	
	/**
	 * 启用或关闭 帐套
	 */
	
	@RequestMapping("/startaccountset")
	@ResponseBody
	public Object startAccountSet(HttpSession httpSession, @RequestParam String[] idarrays,
			@RequestParam int intflag)
	{
		try 
		{
			accountsetmanagerbp.startAccountSet(idarrays,intflag);
			ActionResult ar = new ActionResult();
			ar.setSuccess(true);
			return ar;
		}
		catch (Exception e) 
		{
			ActionResult ar = new ActionResult();
			ar.setSuccess(false);
			ar.setMsg("启用异常");
			return ar;
		}
	}
}
