package com.newtouch.nwfs.gl.datamanger.action;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.rpc.holders.StringHolder;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.ObjectUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.DownloadUtil;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nwfs.gl.datamanger.bp.LedgerManagerBP;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerItemEntity;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerTypeEntity;
import com.newtouch.nwfs.gl.datamanger.util.ExportRateExcel;

/**
 * 分户管理action
 * @author Administrator
 */
@Controller
@Scope("prototype")
@RequestMapping("/datamanager/ledgermanager")
public class LedgerManagerAction
{
	// BP层接口对象
	@Autowired
	private LedgerManagerBP ledgerManagerBP;

	/**
	 * 获得分户类别树(分户类别树根节点下面只能有一级)， 根节点"分户类别"在数据库中保存成一条特殊记录，
	 * 为id:"00000000-0000-0000-0000-000000000000", text:"分户类别"，
	 * 查询的时候只需要加载其下面的所有类别即可,刷新时刷新根节点
	 * @return
	 * */
	@RequestMapping("/ledgertypetree")
	@ResponseBody
	public Object getLedgerTypeTree(@RequestParam String node) 
	{
		try {
			List<Object> ledgerTypeList = ledgerManagerBP.getLedgerTypeByParentID(node);
			if(null != ledgerTypeList && ledgerTypeList.size() > 0)
			{
				JSONArray ja = new JSONArray();
				JSONObject jo = null;
				Iterator<Object> it = ledgerTypeList.iterator();
				while(it.hasNext())
				{
					Object[] objs = (Object[]) it.next();
					jo = new JSONObject();
					jo.put("id", objs[0].toString());
					jo.put("text", objs[2].toString());
					String leaf=objs[4].toString();
					int isLeaf=new Integer(leaf);
					jo.put("leaf", (isLeaf ==1 ? new Boolean(true): new Boolean(false)));
					jo.put("ledgertypecode", objs[1].toString());
					jo.put("ledgertypename", objs[2].toString());
					jo.put("parentid", objs[3].toString());
					String status=objs[4].toString();
					int intStatus=new Integer(status);
					jo.put("status", (intStatus == 1 ? new Boolean(true): new Boolean(false)));
					ja.add(jo);
				}
				return ja;
			}
			else
			{
				JSONArray ja = new JSONArray();
				return ja;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.toString());
		}
	}

	/**
	 * 获得分户明细树 类别树需要加点击事件监听， 捕获到左边树的node.id然后传到右边明细的树，
	 * 明细树根据其上级ID和node.id去后台加载项目(
	 * 根节点"项目"在数据库中设置为特殊的一条记录，这样每次点击类别加载明细的时候，其上级ID就是这一条特殊记录的ID)
	 * 新增和修改明细树时只需要刷新明细树的根节点
	 * @return
	 * */
	@RequestMapping("/ledgeritemtree")
	@ResponseBody
	public Object getledgerItemByTypeAndParentID(@RequestParam(required = false) String companyid,
			@RequestParam String node,
			@RequestParam(required = false) String uqledgetypeid
			) 
	{
		try {
			if(companyid == null||"".equals(companyid))
			{
				M8Session session = new M8Session();
				companyid = ObjectUtils.toString(session.getAttribute("M8_COMPANYID"));
			}
			if(uqledgetypeid == null||"".equals(uqledgetypeid))
			{
				uqledgetypeid = "00000000-0000-0000-0000-000000000000";
			}
			List<Object> ledgerItemList = ledgerManagerBP.getledgerItemByTypeAndParentID(uqledgetypeid,node,companyid);
			if(null != ledgerItemList && ledgerItemList.size() > 0)
			{
				JSONArray ja = new JSONArray();
				JSONObject jo = null;
				Iterator<Object> it = ledgerItemList.iterator();
				while(it.hasNext())
				{
					Object[] objs = (Object[]) it.next();
					jo = new JSONObject();
					jo.put("id", objs[0].toString());
					jo.put("text", "["+objs[2].toString()+"]"+objs[3].toString());
					String leaf=objs[10].toString();
					int isLeaf=new Integer(leaf);
					jo.put("leaf", (isLeaf ==1 ? new Boolean(true): new Boolean(false)));
					jo.put("ledgertypeid", objs[1].toString());
					jo.put("ledgercode", objs[2].toString());
					jo.put("ledgername", objs[3].toString());
					jo.put("ledgerfullcode", objs[4].toString());
					jo.put("ledgerfullname", objs[5].toString());
					jo.put("parentid", objs[6].toString());
					jo.put("parentcode", objs[7].toString());
					jo.put("parentname", objs[8].toString());
					String level=objs[9].toString();
					int intlevel=new Integer(level);
					jo.put("intlevel", intlevel);
					String status=objs[11].toString();
					int intStatus=new Integer(status);
					jo.put("status", (intStatus == 1 ? new Boolean(true): new Boolean(false)));
					ja.add(jo);
				}
				return ja;
			}
			else
			{
				JSONArray ja = new JSONArray();
				return ja;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.toString());
		}
	}

	/**
	 * 新增分户类别
	 * @return
	 * */
	@RequestMapping("/addledgertype")
	@ResponseBody
	public Object addLedgerType(@RequestParam(required=false, defaultValue="{}") String paramString) 
	{
		try {
			ConditionMap paramMap = new ConditionMap(paramString);
			LedgerTypeEntity ledgerType=new LedgerTypeEntity(null,null,paramMap.getString("varledgetypename"),null,"1","2");
			this.ledgerManagerBP.addLedgerType(ledgerType);
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}

	/**
	 * 修改分户类别
	 * @return
	 * */
	@RequestMapping("/editledgertype")
	@ResponseBody
	public Object editLedgerType(@RequestParam(required=false, defaultValue="{}") String paramString) 
	{
		try {
			ConditionMap paramMap = new ConditionMap(paramString);
			LedgerTypeEntity ledgerType=new LedgerTypeEntity(paramMap.getString("uqledgetypeid"),null,paramMap.getString("varledgetypename"),null,null,null);
			this.ledgerManagerBP.editLedgerType(ledgerType);
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}

	/**
	 * 删除分户类别
	 * @return
	 */
	@RequestMapping("/deleteledgertype")
	@ResponseBody
	public Object deleteLedgerType(@RequestParam String uqledgetypeid) 
	{
		try {
			this.ledgerManagerBP.deleteLedgerType(uqledgetypeid);
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	
	/**
	 * 分户类别导入模板下载
	 * @return
	 */
	@RequestMapping("/downloadledgertypeimportmodel")
	@ResponseBody
	public void downloadLedgerTypeImportModel(HttpServletRequest request, HttpServletResponse response) 
	{
		try 
		{
			request.setCharacterEncoding("UTF-8");
		
	        BufferedInputStream bis = null; 
	        BufferedOutputStream bos = null; 
	   
	        //获取项目根目录
	        String ctxPath = request.getSession().getServletContext().getRealPath(""); 
	         
	        //获取下载文件路径
	        String downLoadPath = ctxPath+"/wfs/gl/datamanager/accountmanager/ledgerTypeImportModel.xls"; 
	   
	        //获取文件的长度
	        long fileLength = new File(downLoadPath).length(); 
	 
	        //设置文件输出类型
	        response.setContentType("application/octet-stream");
	        String importModelFile = URLEncoder.encode("ledgerTypeImportModel.xls", "UTF-8");
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
	 * 在某一个分户类别中新增分户项目
	 * @return
	 * */
	@RequestMapping("/addledgeritem")
	@ResponseBody
	public Object addLedgerItem(@RequestParam(required=false, defaultValue="{}") String paramString) 
	{
		try {
			ConditionMap paramMap = new ConditionMap(paramString);
			LedgerItemEntity ledgerItem=new LedgerItemEntity();
			ledgerItem.setVarledgecode(paramMap.getString("varledgecode"));
			ledgerItem.setVarledgename(paramMap.getString("varledgename"));
			ledgerItem.setUqledgetypeid(paramMap.getString("uqledgetypeid"));
			if(!"00000000-0000-0000-0000-000000000000".equals(paramMap.getString("uqparentid")))
			{
				//如果新增的科目不是1级科目，set其uqparentid
				ledgerItem.setUqparentid(paramMap.getString("uqparentid"));
			}
			ledgerItem.setIntislastlevel("1");
			ledgerItem.setIntstatus("2");
			this.ledgerManagerBP.addLedgerItem(ledgerItem,paramMap.getString("companyid"));
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}

	/**
	 * 在某一个分户类别中修改分户项目
	 * @return
	 * */
	@RequestMapping("/editledgeritem")
	@ResponseBody
	public Object editLedgerItem(@RequestParam(required=false, defaultValue="{}") String paramString) 
	{
		try {
			ConditionMap paramMap = new ConditionMap(paramString);
			LedgerItemEntity ledgerItem=new LedgerItemEntity(paramMap.getString("uqledgeid"),paramMap.getString("uqledgetypeid"),paramMap.getString("varledgecode"),paramMap.getString("varledgename"),null,null,paramMap.getString("uqparentid"),null,null,null);
			this.ledgerManagerBP.editLedgerItem(ledgerItem);
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}

	/**
	 * 在某一个分户类别中删除分户项目
	 * @return
	 * */
	@RequestMapping("/deleteledgeritem")
	@ResponseBody
	public Object deleteLedgerItem(@RequestParam String uqledgeid,
			@RequestParam String companyid
			) 
	{
		try {
			this.ledgerManagerBP.deleteLedgerItem(uqledgeid,companyid);
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	
	/*
	*//**
	 * 导入分户类别
	 * *//*
	@RequestMapping("/importledgertype")
	@ResponseBody
	public Object importLedgerType(@RequestParam CommonsMultipartFile accountFile)
	{
		try
		{
			StringHolder errormsg = new StringHolder();
			errormsg.value = "";
			this.ledgerManagerBP.importLedgerType(accountFile.getInputStream(),errormsg);
			ActionResult result = new ActionResult();
			if(errormsg.value == "")
			{
				result.setSuccess(true);
				return result;
			}
			else
			{
				result.setSuccess(false);
				result.setMsg(errormsg.value);
				return result;
			}
		}
		catch( Exception e)
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	*/
	
	/**
	 * 导入分户明细
	 * */
	@RequestMapping("/importledgeritem")
	@ResponseBody
	public Object importLedgerItem(HttpServletRequest request, HttpServletResponse response,
			@RequestParam CommonsMultipartFile uploadFile,
			@RequestParam String jsonCondition
			)
	{
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			StringHolder errormsg = new StringHolder();
			errormsg.value = "";
			this.ledgerManagerBP.importLedgerItem(uploadFile.getInputStream(),cdtMap.getString("companyid"),errormsg);
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
	 * 导出分户明细
	 * */
	@RequestMapping("/exportledgeritem")
	@ResponseBody
	public String exportLedgerItem(@RequestParam String jsonCondition,
			HttpServletRequest request, 
			HttpServletResponse response
			)
	{
		ExportRateExcel exportRateExcel = new ExportRateExcel();
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			List<Object[]> list = this.ledgerManagerBP.exportLedgerItem(cdtMap.getString("companyid"));
			if (list.size() <= 0)
			{
				return "没有分户项目！";
			}
			
			String fliename = new SimpleDateFormat("yyyy-MM-dd").format(new Date()) + "分户项目导出.xls";
			String firstSheetName = "分户项目信息";
			String[] excelFirstTitle = { "分户类别","上级项目名称","分户项目编码","分户项目名称"};

			HSSFWorkbook hssfWorkbook = exportRateExcel.expToExcel(list, firstSheetName, excelFirstTitle);

			DownloadUtil.writeDownloadFile(request, response, fliename, hssfWorkbook);

			return "";
		} 
		catch (Exception e)
		{
			e.printStackTrace();
			return "导出过程发生异常，错误信息：" + e.getMessage();
		}
	}
	
	/**
	 * 分户项目导入模板下载
	 * downloadLedgerImportModel
	 * @return
	 */
	@RequestMapping("/downloadledgerimportmodel")
	@ResponseBody
	public String downloadLedgerImportModel(HttpServletRequest request, HttpServletResponse response) 
	{
		try
		{
			DownloadUtil.writeDownloadFile(request, response, "", "wfs/gl/datamanager/ledgermanager/ledgerImportModel.xls");
	
			return "";
		}
		catch(Exception ex)
		{
			ex.printStackTrace();
			return "导入模板下载发生异常，错误信息：" + ex.getMessage();
		}
		/*		
		try 
		{
			request.setCharacterEncoding("UTF-8");
		
	        BufferedInputStream bis = null; 
	        BufferedOutputStream bos = null; 
	   
	        //获取项目根目录
	        String ctxPath = request.getSession().getServletContext().getRealPath(""); 
	         
	        //获取下载文件路径
	        String downLoadPath = ctxPath+"/wfs/gl/datamanager/ledgermanager/ledgerImportModel.xls"; 
	   
	        //获取文件的长度
	        long fileLength = new File(downLoadPath).length(); 
	 
	        //设置文件输出类型
	        response.setContentType("application/octet-stream");
	        String importModelFile = URLEncoder.encode("ledgerImportModel.xls", "UTF-8");
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
		*/
	}
}
