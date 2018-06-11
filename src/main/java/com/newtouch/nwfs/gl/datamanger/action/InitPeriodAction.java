package com.newtouch.nwfs.gl.datamanger.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.rpc.holders.StringHolder;

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
import com.newtouch.nwfs.gl.datamanger.bp.InitPeriodBP;
import com.newtouch.nwfs.gl.datamanger.util.ExportRateExcel;

@Controller
@Scope("prototype")
@RequestMapping("/datamanager/initperiod")
public class InitPeriodAction
{
	@Autowired
	private InitPeriodBP initperiodbp;
	
	/*
	 * 查询数据
	 */
	@RequestMapping("/getinitperiodlist")
	@ResponseBody
	public Object getInitPeriodList(@RequestParam String paramString, 
			@RequestParam int start, 
			@RequestParam int limit
			)
	{
		try
		{
			ConditionMap paramMap = new ConditionMap(paramString);
			PageData<EntityMap> page = this.initperiodbp.getInitPeriodList(paramMap.getString("uqcompanyid"),paramMap.getString("varaccountcode"),paramMap.getString("varaccountname"),start, limit);
			return ActionResultUtil.toPageData(page);
		} catch (Exception ex)
		{
			ex.printStackTrace();
			return ActionResultUtil.toFailure(ex.getMessage());
		}
	}
	
	/*
	 * 数据导入
	 */
	@RequestMapping("/importinitperiod")
	@ResponseBody
	public Object importInitPeriod(HttpServletRequest request, HttpServletResponse response,
			@RequestParam CommonsMultipartFile uploadFile,
			@RequestParam String jsonCondition
			)
	{
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			StringHolder errormsg = new StringHolder();
			errormsg.value = "";
			this.initperiodbp.importInitPeriod(uploadFile.getInputStream(),cdtMap.getString("companyid"),errormsg);
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
	
	/*
	 * 数据导出
	 */ 
	@RequestMapping("/exportinitperiod")
	@ResponseBody
	public String exportInitPeriod(@RequestParam String jsonCondition,
			HttpServletRequest request, 
			HttpServletResponse response
			)
	{
		ExportRateExcel exportRateExcel = new ExportRateExcel();
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			List<Object[]> list = this.initperiodbp.exportInitPeriod(cdtMap.getString("companyid"),cdtMap.getString("varaccountcode"),cdtMap.getString("varaccountname"));
			if (list.size() <= 0)
			{
				return "没有数据可供导出！";
			}
			
			String fliename = new SimpleDateFormat("yyyy-MM-dd").format(new Date()) + "科目期初余额设置导出.xls";
			String firstSheetName = "科目期初余额设置导出";
			String[] excelFirstTitle = { "科目编号","名称","期初借方余额","期初贷方余额"};

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
	
	/*
	 * 导入模板下载
	 */
	@RequestMapping("/downloadimportmodel")
	@ResponseBody
	public String downloadInitPeriodImportModelEx(HttpServletRequest request, HttpServletResponse response) 
	{
		try
		{
			DownloadUtil.writeDownloadFile(request, response, "", "wfs/gl/datamanager/initperiod/initperiodImportModel.xls");
	
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
	         
	        //获取下载文件露肩
	        String downLoadPath = ctxPath+"/wfs/gl/datamanager/initperiod/initperiodImportModel.xls"; 
	   
	        //获取文件的长度
	        long fileLength = new File(downLoadPath).length(); 
	 
	        //设置文件输出类型
	        response.setContentType("application/octet-stream");
	        String importModelFile = URLEncoder.encode("initperiodImportModel.xls", "UTF-8");
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
	
	/*
	 * 新增科目期初余额
	 */
	@RequestMapping("/addinitperiod")
	@ResponseBody
	public Object addInitPeriod(@RequestParam(required=false, defaultValue="{}") String paramString)
	{
		try
		{
			ConditionMap paramMap = new ConditionMap(paramString);
			this.initperiodbp.addInitPeriod(paramMap.getString("uqcompanyid"),paramMap.getString("accountid"),paramMap.getString("varaccountcode"),paramMap.getDouble("mnydebitperiod"),paramMap.getDouble("mnycreditperiod"));
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} 
		catch (Exception ex)
		{
			ex.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(ex.getMessage());
			return result;
		}
	}
	
	/*
	 * 修改科目期初余额
	 */
	@RequestMapping("/editinitperiod")
	@ResponseBody
	public Object editInitPeriod(@RequestParam(required=false, defaultValue="{}") String paramString)
	{
		try
		{
			ConditionMap paramMap = new ConditionMap(paramString);
			this.initperiodbp.editInitPeriod(paramMap.getString("uqcompanyid"),paramMap.getString("accountid"),paramMap.getString("varaccountcode"),paramMap.getDouble("mnydebitperiod"),paramMap.getDouble("mnycreditperiod"));
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} 
		catch (Exception ex)
		{
			ex.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(ex.getMessage());
			return result;
		}
	}
	
	/*
	 * 删除科目期初余额
	 */
	@RequestMapping("/deleteinitperiod")
	@ResponseBody
	public Object delInitPeriod(@RequestParam(required=false, defaultValue="{}") String paramString)
	{
		try
		{
			ConditionMap paramMap = new ConditionMap(paramString);
			StringHolder errormsg = new StringHolder();
			errormsg.value = "";
			this.initperiodbp.delInitPeriod(paramMap.getString("uqcompanyid"),paramMap.getString("accountids"),paramMap.getString("varaccountcodes"),errormsg);
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
		catch (Exception ex)
		{
			ex.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(ex.getMessage());
			return result;
		}
	}
}
