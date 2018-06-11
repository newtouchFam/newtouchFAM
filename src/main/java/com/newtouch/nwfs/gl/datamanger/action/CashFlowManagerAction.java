package com.newtouch.nwfs.gl.datamanger.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.rpc.holders.StringHolder;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

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
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.bp.CashFlowManagerBP;
import com.newtouch.nwfs.gl.datamanger.entity.FlowItemsEntity;
import com.newtouch.nwfs.gl.datamanger.entity.FlowTypeEntity;
import com.newtouch.nwfs.gl.datamanger.util.ExportRateExcel;

/**
 * 现金流量管理action
 * @author feng
 *
 */
@Controller
@Scope("prototype")
@RequestMapping("/datamanager/cashflowmanager")
public class CashFlowManagerAction 
{
	@Autowired
	private CashFlowManagerBP bp;
	
	/**
	 * 根据节点node获的现金流量分类树
	 * @return
	 */
	@RequestMapping("/getTypeTree")
	@ResponseBody
	public Object getTypeTree(@RequestParam String node)
	{
		try 
		{
			List<Object> list = this.bp.getTypeTree(node);
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
					jo.put("varcode", objs[1].toString());
					jo.put("varname", objs[2].toString());
					jo.put("varfullcode", objs[4].toString());
					jo.put("varfullname", objs[5].toString());
					jo.put("uqparentid", objs[6].toString());
					String intlevels =  objs[8].toString();
					jo.put("parentname", "1".equals(intlevels) ? "[0000]现金流量分类" : objs[7].toString());
					jo.put("intlevel", objs[8] == null ? "" : objs[8].toString());
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
	 * 根据uqflowtypeid，得到现金流量项目列表数据
	 * @return
	 */
	@RequestMapping("/getItemsGrid")
	@ResponseBody
	public Object getItemsGrid(
			@RequestParam String uqflowtypeid,
			@RequestParam Integer start,
			@RequestParam Integer limit)
	{
		PageData<EntityMap> page = null;
		try 
		{	
			page = this.bp.getItemsGrid(uqflowtypeid, start, limit);
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
		return ActionResultUtil.toPageData(page);
	}
	
	/**
	 * 新增分类
	 * @return
	 */
	@RequestMapping("/addType")
	@ResponseBody
	public Object addType(@RequestParam String jsonCondition)
	{
		try 
		{
			ConditionMap map = new ConditionMap(jsonCondition);
			FlowTypeEntity flowtype = 
					new FlowTypeEntity(
							null,
							map.getString("vartypecode"),
							map.getString("vartypename"),
							map.getString("uqparentid"),null,null,null,"1");
			this.bp.addType(flowtype,map.getString("uqparentid"));
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
	 * 修改分类
	 * @return
	 */
	@RequestMapping("/editType")
	@ResponseBody
	public Object editType(@RequestParam String jsonCondition)
	{
		try 
		{
			ConditionMap map = new ConditionMap(jsonCondition);
			FlowTypeEntity flowtype = 
					new FlowTypeEntity(
							map.getString("uqflowtypeid"),
							map.getString("vartypecode"),
							map.getString("vartypename"),
							map.getString("uqparentid"),null,null,null,null);
			this.bp.editType(flowtype);
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
	 * 删除分类
	 * @return
	 */
	@RequestMapping("/removeType")
	@ResponseBody
	public Object removeType(@RequestParam String uqflowtypeid)
	{
		try 
		{
			this.bp.removeType(uqflowtypeid);
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
	 * 新增项目
	 * @return
	 */
	@RequestMapping("/addItems")
	@ResponseBody
	public Object addItems(@RequestParam String jsonCondition)
	{
		try 
		{
			ConditionMap map = new ConditionMap(jsonCondition);
			String id = UUID.randomUUID().toString().toUpperCase();
			
			//页面选择类别 获取类别ID 选择项目获取类别编号，再获取类别ID
			String uqflowtypeid = "";
			if(!map.getString("uqflowtypeid").equals("") || map.getString("uqflowtypeid") != null
					&& map.getString("uqvarcode").equals("") || map.getString("uqvarcode") == null)
			{
				uqflowtypeid = map.getString("uqflowtypeid");
			}
			else
			{
				uqflowtypeid = bp.getflowtypeid(map.getString("uqvarcode"));
			}
			
			FlowItemsEntity flowitems = 	
					new FlowItemsEntity(
							id, 
							map.getString("varitemcode"), 
							map.getString("varitemname"), 
							uqflowtypeid/*map.getString("uqflowtypeid")*/, "1");
			this.bp.addItems(flowitems);
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
	 * 修改项目
	 * @return
	 */
	@RequestMapping("/editItems")
	@ResponseBody
	public Object editItems(@RequestParam String jsonCondition)
	{
		try 
		{
			ConditionMap map = new ConditionMap(jsonCondition);
			FlowItemsEntity flowitems = 
					new FlowItemsEntity(
							map.getString("uqflowitemid"), 
							map.getString("varitemcode"), 
							map.getString("varitemname"), 
							map.getString("uqflowtypeid"), 
							map.getString("intstatus"));
			this.bp.editItems(flowitems);
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
	 * 删除项目
	 * @return
	 */
	@RequestMapping("/removeItems")
	@ResponseBody
	public Object removeItems(@RequestParam String[] idArrays)
	{
		try 
		{
			this.bp.removeItems(idArrays);
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
	 * 启用或停用项目
	 * @return
	 */
	@RequestMapping("/startItems")
	@ResponseBody
	public Object startItems(@RequestParam String[] idArrays,@RequestParam String startorclose)
	{
		try 
		{
			String intstatus = null;
			if("start".equals(startorclose))	
			{
				intstatus = "2";
			}
			else
			{
				intstatus = "0";
			}
			this.bp.startItems(intstatus, idArrays);
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
	 * 导入现金流量信息
	 * @return
	 */
	@RequestMapping("/importCashFlowFile")
	@ResponseBody
	public String importCashFlowFile(HttpServletRequest request, HttpServletResponse response ,
			@RequestParam CommonsMultipartFile uploadFile,
			@RequestParam(required=false) String jsonCondition)
	{
		try
		{
			StringHolder errormsg = new StringHolder();
			errormsg.value = "";
			this.bp.importCashFlowFile(uploadFile.getInputStream(), errormsg);
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
	 * 导出现金流量项目的信息
	 */
	@RequestMapping("/exportCashFlowInfo")
	@ResponseBody
	public String exportCashFlowInfo(HttpServletRequest request, HttpServletResponse response) 
	{
		ExportRateExcel exportRateExcel = new ExportRateExcel();
		try
		{
			List<Object[]> list = this.bp.exportCashFlowInfo();
			if (list.size() <= 0)
			{
				return "没有现金流量项目！";
			}
			
			String fliename = new SimpleDateFormat("yyyy-MM-dd").format(new Date()) + "现金流量项目导出.xls";
			String firstSheetName = "现金流量项目信息";
			String[] excelFirstTitle = { "现金流量项目编码","现金流量项目名称","所属类别编码","所属类别名称","状态"};

			HSSFWorkbook hssfWorkbook = exportRateExcel.expToExcel(list, firstSheetName, excelFirstTitle);

			DownloadUtil.writeDownloadFile(request, response, fliename, hssfWorkbook);

			return "";
		} 
		catch (Exception e)
		{
			e.printStackTrace();
			return "导出模板发生异常，错误信息：" + e.getMessage();
		}
	}
	
	/**
	 * 导入模板下载
	 * @return
	 */
	@RequestMapping("/downloadCashFlowImportModel")
	@ResponseBody
	public String downloadCashFlowImportModel(HttpServletRequest request, HttpServletResponse response) 
	{
		try
		{
			DownloadUtil.writeDownloadFile(request, response, "", "wfs/gl/datamanager/cashflowmanager/cashflowImportModel.xls");
	
			return "";
		}
		catch(Exception ex)
		{
			return "导出模板发生异常，错误信息：" + ex.getMessage();
		}
		/*try 
		{
			HSSFWorkbook workBook = ExcelUtil.readFromFile(request.getServletContext(), "wfs/gl/datamanager/cashflowmanager/cashflowImportModel.xls");
			
			DownloadUtil.writeDownloadFile(request, response, "现金流量导入模板", workBook);
			return "";
			
			request.setCharacterEncoding("UTF-8");
	        BufferedInputStream bis = null; 
	        BufferedOutputStream bos = null; 
	   
	        //获取项目根目录
	        String ctxPath = request.getSession().getServletContext().getRealPath(""); 
	         
	        //获取下载文件露肩
	        String downLoadPath = ctxPath+"/wfs/gl/datamanager/cashflowmanager/cashflowImportModel.xls"; 
	   
	        //获取文件的长度
	        long fileLength = new File(downLoadPath).length(); 
	 
	        //设置文件输出类型
	        response.setContentType("application/octet-stream");
	        String importModelFile = URLEncoder.encode("cashflowImportModel.xls", "UTF-8");
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
			return "导出模板发生异常，错误信息：" + e.getMessage();
		}*/
		
	}
	
}
