package com.newtouch.nwfs.gl.datamanger.action;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.rpc.holders.StringHolder;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.bp.AccountManagerBp;
import com.newtouch.nwfs.gl.datamanger.entity.AccountsEntity;
import com.newtouch.nwfs.gl.datamanger.util.ExportRateExcel;

/**
 * 科目管理action
 * @author Administrator
 *
 */
@Controller
@Scope("prototype")
@RequestMapping("/datamanager/accountmanager")
public class AccountManagerAction
{
	//定义变量
	@Autowired
	private AccountManagerBp accountManagerBp;
	
	/**
	 * 根据‘科目组ID’或 ‘科目编号’或‘科目名称’获取科目信息
	 * @return
	 */
	@RequestMapping("/list")
	@ResponseBody
	public ActionResult getAccountInfo(HttpSession httpSession, 
			@RequestParam(required=false) String paramString, 
			@RequestParam(required=false) String fullCode,
			@RequestParam int start, 
			@RequestParam int limit) 
	{
		try 
		{	
			//从session中获取科目套id，传入bp层
			String uqaccountsetid = ObjectUtils.toString(httpSession.getAttribute("ACCOUNTSETID"));
			PageData<EntityMap> page = null;
			ConditionMap cdtMap = new ConditionMap(paramString);
			if (fullCode != null && !"".equals(fullCode))
			{	
//				String fullCode = cdtMap.getString("fullcode");
				//判断输入参数，如果科目组id不为空则调用bp层getAccountInfoByGroupId()方法
				page = this.accountManagerBp.getAccountInfoByParentId(uqaccountsetid, fullCode, start, limit);
				return ActionResultUtil.toPageData(page);
			}
			else if (cdtMap.containsCondition("varaccoundcode") || cdtMap.containsCondition("varaccountname")) 
			{	
				String varAccountCode = cdtMap.containsCondition("varaccoundcode") ? cdtMap.getString("varaccoundcode") : "";
				String varAccountName = cdtMap.containsCondition("varaccountname") ? cdtMap.getString("varaccountname") : "";
				//如果‘科目编号’或‘科目名称’不为空则调用bp层getAccountInfoByCondition()方法
				page = this.accountManagerBp.getAccountInfoByCondition(uqaccountsetid, varAccountCode, varAccountName, start, limit);
				return ActionResultUtil.toPageData(page);
			}
			else 
			{
				ActionResult actionResult = new ActionResult();
				JSONArray array = new JSONArray();
				actionResult.setSuccess(true).setTotal(0).setData(array);
				return actionResult;
			}
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 获取左侧科目树
	 * @return
	 */
	@RequestMapping("/tree")
	@ResponseBody
	public Object getAccountTree(HttpSession httpSession, @RequestParam String node) 
	{
		try 
		{
			//从session中获取科目套id，传入bp层
			String uqaccountsetid = ObjectUtils.toString(httpSession.getAttribute("ACCOUNTSETID"));
			List<Object> list = accountManagerBp.getAccountTree(uqaccountsetid, node);
			if (null != list && list.size() > 0) 
			{
				JSONArray ja = new JSONArray();
				JSONObject jo = null;
				Iterator<Object> it = list.iterator();
				while(it.hasNext())
				{
					Object[] objs = (Object[]) it.next();
					jo = new JSONObject();
					jo.put("id", objs[0].toString());
					jo.put("text", "["+objs[1].toString()+"]"+objs[2].toString());
					String leaf = objs[3].toString();
					int isleaf = new Integer(leaf);
					jo.put("leaf", (isleaf == 1 ? new Boolean(true): new Boolean(false)));
					jo.put("accountcode", objs[1].toString());
					jo.put("accountname", objs[2].toString());
					jo.put("fullcode", objs[4].toString());
					jo.put("fullname", objs[5] == null ? "" : objs[5].toString());
					jo.put("uqparentid", objs[6].toString());
					jo.put("parentname", objs[7].toString());
					jo.put("intpropertyno", objs[8] == null ? "" : objs[8].toString());
					jo.put("intproperty", objs[9] == null ? "" : objs[9].toString());
					jo.put("uqtypeidno", objs[10] == null ? "" : objs[10].toString());
					jo.put("uqtypeid", objs[11] == null ? "" : objs[11].toString());
					jo.put("uqforeigncurridno", objs[12] == null ? "" : objs[12].toString());
					jo.put("uqforeigncurrid", objs[13] == null ? "" : objs[13].toString());
					jo.put("varmeasureno", objs[14] == null ? "" : objs[14].toString());
					jo.put("varmeasure", objs[15] == null ? "" : objs[15].toString());
					jo.put("intisledge", objs[16] == null ? "" : objs[16].toString());
					jo.put("intflag", objs[17] == null ? "" : objs[17].toString());
					jo.put("intisflowno", objs[18] == null ? "" : objs[18].toString());
					jo.put("intisflow", objs[19] == null ? "" : objs[19].toString());
					jo.put("uqledgetypeids", objs[20] == null ? "" : objs[20].toString());
					jo.put("varledgetypenames", objs[21] == null ? "" : objs[21].toString());
					ja.add(jo);
				}
				return ja;
			}
			else
			{
				JSONArray ja = new JSONArray();
				return ja;
			}
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.toString());
		}
	}

	/**
	 * 新增科目
	 * @return
	 */
	@RequestMapping("/add")
	@ResponseBody
	public ActionResult addAccounts(HttpSession httpSession,
			@RequestParam(required=false) String jsonString)
	{
		try 
		{
			ConditionMap cdtMap = new ConditionMap(jsonString);
			//从session中获取科目套id，传入bp层
			String uqaccountsetid = ObjectUtils.toString(httpSession.getAttribute("ACCOUNTSETID"));
			AccountsEntity account = 
					new AccountsEntity(null, uqaccountsetid, 
							cdtMap.getString("varAccountCode"), null,
							cdtMap.getString("varAccountName"), null, 
							cdtMap.getString("intProperty"), cdtMap.getString("uqTypeId"),
							cdtMap.getString("uqForeignCurrId"), cdtMap.getString("varMeasure"), 
							cdtMap.getString("intIsLedge"), null, 
							null, cdtMap.getString("uqParentId"), 
							"1", null, "1", cdtMap.getString("intIsFlow"));
			this.accountManagerBp.addAccounts(account, cdtMap.getString("uqLedgeTypeIds"));
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} 
		catch (Exception e) 
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	
	/**
	 * 修改科目
	 * @return
	 */
	@RequestMapping("/edit")
	@ResponseBody
	public ActionResult editAccounts(HttpSession httpSession,
			@RequestParam(required=false) String jsonString)
	{
		try 
		{
			ConditionMap cdtMap = new ConditionMap(jsonString);
			//从session中获取科目套id，传入bp层
			String uqaccountsetid = ObjectUtils.toString(httpSession.getAttribute("ACCOUNTSETID"));
			AccountsEntity account = new AccountsEntity(
					cdtMap.getString("uqAccountId"), uqaccountsetid,
					cdtMap.getString("varAccountCode"), null, 
					cdtMap.getString("varAccountName"), null,
					cdtMap.getString("intProperty"), cdtMap.getString("uqTypeId"), 
					cdtMap.getString("uqForeignCurrId"), cdtMap.getString("varMeasure"), 
					cdtMap.getString("intIsLedge"), null, 
					null, cdtMap.getString("uqParentId"), 
					null, null, null, cdtMap.getString("intIsFlow"));
			this.accountManagerBp.editAccounts(account, cdtMap.getString("uqLedgeTypeIds"));
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} 
		catch (Exception e) 
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	
	/**
	 * 删除科目信息
	 * @return
	 */
	@RequestMapping("/del")
	@ResponseBody
	public ActionResult deleteAccounts(@RequestParam(required=false) String idArrays)
	{
		try 
		{
			String[] split = idArrays.split(",");
			List<String> arrays = new ArrayList<String>();
			for (int i = 0; i < split.length; i++) {
				arrays.add(split[i]);
			}
			this.accountManagerBp.deleteAccounts(arrays);
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} 
		catch (Exception e) 
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	
	/**
	 * 跟新科目的启用或停用状态
	 * @return
	 */
	@RequestMapping("/updateflag")
	@ResponseBody 
	public ActionResult updateIntflag(HttpSession httpSession,
			@RequestParam(required=false) String idArrays,
			@RequestParam(required=false) String startorclose)
	{
		try 
		{
			//从session中获取科目套id，传入bp层
			String uqaccountsetid = ObjectUtils.toString(httpSession.getAttribute("ACCOUNTSETID"));
			String[] idarrays = idArrays.split(",");
			accountManagerBp.updateIntflag(uqaccountsetid, idarrays, startorclose);
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		}
		catch (Exception e) 
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg("科目启用或停用异常!");
			return result;
		}
	}
	
	/**
	 * 导入科目信息
	 * @return
	 */
	@RequestMapping("/upload")
	@ResponseBody 
	public String uploadAccountFile(HttpServletRequest request, HttpServletResponse response ,
			HttpSession httpSession,
			@RequestParam CommonsMultipartFile uploadFile,
			@RequestParam(required=false) String jsonCondition)
	{
		try
		{
			String uqaccountsetid = ObjectUtils.toString(httpSession.getAttribute("ACCOUNTSETID"));
			StringHolder errormsg = new StringHolder();
			errormsg.value = "";
			this.accountManagerBp.uploadAccountFile(uploadFile.getInputStream(), uqaccountsetid, errormsg);
			if(errormsg.value == "")
			{
				
				return ActionResultUtil.toSuccess("导入成功").toJsonString();
			}
			else
			{
				return ActionResultUtil.toFailure(errormsg.value).toJsonString();
			}
			
		}
		catch (Exception e) 
    	{
			e.printStackTrace();
			return ActionResultUtil.toException(e).toJsonString();
		}
	}

	/**
	 * 导出科目信息
	 */
	@RequestMapping("/export")
	@ResponseBody 
	public void exportAccountInfo(HttpServletResponse response,
			HttpSession httpSession)
	{
		ExportRateExcel exportRateExcel = new ExportRateExcel();
		try
		{
			//从session中获取科目套id，传入bp层
			String uqaccountsetid = ObjectUtils.toString(httpSession.getAttribute("ACCOUNTSETID"));
			List<Object[]> list = this.accountManagerBp.exportAccountInfo(uqaccountsetid);
			String firstSheetName = new SimpleDateFormat("yyyy-MM-dd").format(new Date()) + "会计科目导出";
			String[] excelFirstTitle = { "科目编号","名称","上级科目编号","上级科目名称","科目性质名称","科目类别名称","现金流量标志","外币名称","计量单位名称","分户类别名称","状态"};
			exportRateExcel.expToExcel(response, list, firstSheetName, excelFirstTitle);
		} 
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	
	/**
	 * 导入模板下载
	 * @return
	 */
	@RequestMapping("/downloadImportModel")
	@ResponseBody
	public void downloadAccountImportModel(HttpServletRequest request, HttpServletResponse response) 
	{
		try 
		{
			request.setCharacterEncoding("UTF-8");
	        BufferedInputStream bis = null; 
	        BufferedOutputStream bos = null; 
	   
	        //获取项目根目录
	        String ctxPath = request.getSession().getServletContext().getRealPath(""); 
	         
	        //获取下载文件露肩
	        String downLoadPath = ctxPath+"/wfs/gl/datamanager/accountmanager/accountImportModel.xls"; 
	   
	        //获取文件的长度
	        long fileLength = new File(downLoadPath).length(); 
	 
	        //设置文件输出类型
	        response.setContentType("application/octet-stream");
	        String importModelFile = URLEncoder.encode("accountImportModel.xls", "UTF-8");
	        response.setHeader("Content-disposition", "attachment; filename=" + new String(importModelFile.getBytes("utf-8"), "ISO8859-1"));
	        //设置输出长度
	        response.setHeader("Content-Length", String.valueOf(fileLength)); 
	        //获取输入流
	        bis = new BufferedInputStream(new FileInputStream(downLoadPath)); 
	        //输出流
	        bos = new BufferedOutputStream(response.getOutputStream()); 
	        byte[] buff = new byte[1024]; 
	        int bytesRead; 
	        while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) 
	        { 
	            bos.write(buff, 0, bytesRead); 
	        }
	        bis.close(); 
	        bos.close();
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}
	
	
	/**
	 * 检查科目是否已经进行现金流量编制
	 * @return
	 */
	@RequestMapping("/checkflow")
	@ResponseBody
	public ActionResult checkIntIsFlow(@RequestParam String uqAccountId) 
	{
		try 
		{
			boolean flag = this.accountManagerBp.checkIntIsFlow(uqAccountId);
			
			ActionResult result = new ActionResult();
			result.setSuccess(flag);
			if (!flag) 
			{
				result.setMsg("该科目已经进行现金流量编制，不可修改现金流量标志！");
			}
			return result;
		} 
		catch (Exception e) 
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	
	/**
	 * 刷新科目的全名称
	 * @return
	 */
	public ActionResult refreshFullName(HttpSession httpSession) 
	{
		try
		{
			//从session中获取科目套id，传入bp层
			String uqaccountsetid = ObjectUtils.toString(httpSession.getAttribute("ACCOUNTSETID"));
			
			this.accountManagerBp.refreshFullName(uqaccountsetid);
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			result.setMsg("刷新成功！");
			return result;
		}
		catch (Exception e) 
    	{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg("科目启用或停用异常!");
			return result;
		}
	}
	
}
