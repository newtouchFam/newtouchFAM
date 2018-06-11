package com.newtouch.nwfs.gl.datamanger.action;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;


import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import javax.servlet.http.HttpServletResponse;
import javax.xml.rpc.holders.StringHolder;

import com.newtouch.cloud.common.DownloadUtil;
import com.newtouch.cloud.common.ExcelUtil;
import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.bp.PeriodManagerBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/datamanager/periodmanager")
public class PeriodManagerAction
{
	@Autowired
	private PeriodManagerBP periodmanagerbp;
	
	/*
	 * 新增会计期
	 */
	@RequestMapping("/add")
	@ResponseBody
	public ActionResult addGlobalPeriod(@RequestParam(required=false) String jsonString) 
	{
		try
		{
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			ConditionMap cdtMap = new ConditionMap(jsonString);
			String varname = cdtMap.getString("varname");
			int intyear = cdtMap.getInteger("intyear");
			int intmonth = cdtMap.getInteger("intmonth");
			Date dtbegin = format.parse(cdtMap.getString("dtbegin"));
			Date dtend = format.parse(cdtMap.getString("dtend"));
			this.periodmanagerbp.addGlobalPeriod(varname,intyear,intmonth,dtbegin,dtend);
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} 
		catch (Exception ex)
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(ex.getMessage());
			return result;
		}
	}
	
	/*
	 * 修改会计期
	 */
	@RequestMapping("/edit")
	@ResponseBody
	public ActionResult editGlobalPeriod(@RequestParam(required=false) String jsonString)
	{
		try
		{
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			ConditionMap cdtMap = new ConditionMap(jsonString);
			String uqglobalperiodids = cdtMap.getString("uqglobalperiodids");
			String varname = cdtMap.getString("varname");
			int intyear = cdtMap.getInteger("intyear");
			int intmonth = cdtMap.getInteger("intmonth");
			Date dtbegin = format.parse(cdtMap.getString("dtbegin"));
			Date dtend = format.parse(cdtMap.getString("dtend"));
			int status = cdtMap.getInteger("status");
			this.periodmanagerbp.editGlobalPeriod(uqglobalperiodids,varname,intyear,intmonth,dtbegin,dtend,status);
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		}
		catch (Exception ex)
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(ex.getMessage());
			return result;
		}
	}
	
	/*
	 * 删除会计期
	 */
	@RequestMapping("/del")
	@ResponseBody
	public ActionResult delGlobalPeriod(@RequestParam(required=false) String uqglobalperiodids)
	{
		try
		{
			this.periodmanagerbp.delGlobalPeriod(uqglobalperiodids);
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} 
		catch (Exception ex)
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg("删除会计期失败");
			return result;
		}
	}
	
	/*
	 * 查询所有会计期数据
	 */
	@RequestMapping("/get")
	@ResponseBody
	public ActionResult getGlobalPeriodList(@RequestParam int start, @RequestParam int limit)
	{
		try
		{
			PageData<EntityMap> page = this.periodmanagerbp.getGlobalPeriodList(start, limit);
			return ActionResultUtil.toPageData(page);
		} 
		catch (Exception ex)
		{
			ex.printStackTrace();
			return ActionResultUtil.toFailure(ex.getMessage());
		}
	}
	
	/*
	 * 开启或关闭会计期
	 */
	@RequestMapping("/openorclose")
	@ResponseBody
	public ActionResult openOrCloseGlobalPeriod(
			@RequestParam String uqglobalperiodids, @RequestParam int status)
	{
		try
		{
			this.periodmanagerbp.openOrCloseGlobalPeriod(uqglobalperiodids,status);
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		} 
		catch (Exception ex)
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			if(status==2)
			{
				result.setMsg("会计期启用失败");
			}else 
			{
				result.setMsg("会计期停用失败");
			}
			return result;
		}
	}
	
	/*
	 * 查询需要关闭的会计期是否有未记账的凭证
	 */
	
	@RequestMapping("/flag")
	@ResponseBody
	public ActionResult voucherIntFlag(@RequestParam String uqglobalperiodids)
	{
		try
		{
			StringHolder errormsg = new StringHolder();
			errormsg.value = "";
			this.periodmanagerbp.voucherIntFlag(uqglobalperiodids,errormsg);
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			result.put("errormsg", errormsg.value);
			return result;
		} 
		catch (Exception ex)
		{
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			return result;
		}
	}
	
	/*
	 * 获取当前所处会计期
	 */
	@RequestMapping("/curperiod")
	@ResponseBody
	public ActionResult getPeriod()
	{
		try 
		{
			String period = "";
			Calendar cal = Calendar.getInstance();
	        int year = cal.get(Calendar.YEAR);//获取年份
	        int month=cal.get(Calendar.MONTH)+1;//获取月份 
	        
			period = periodmanagerbp.getPeriod(year,month);
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			result.setAttribute("period", period);
			return result;
		} catch (Exception e) {
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	
	@RequestMapping("/downloadmodel")
	@ResponseBody
	public void downloadPeriodImportModel(HttpServletRequest request, HttpServletResponse response) 
	{
		try
		{
//			HttpServletResponse response = ServletActionContext.getResponse();
//			ExportRateExcel exportRateExcel = new ExportRateExcel();
//			InputStream fis = getDownloadPeriodModelFile();
//			String filename = "periodImportModel.xls"; //"会计期导入模板.xls";
//			exportRateExcel.downloadExcel(response, filename, fis);
			
			String filename = "periodImportModel.xls"; //"会计期导入模板.xls";
			HSSFWorkbook workBook = ExcelUtil.readFromFile(request.getServletContext(), "/wfs/gl/datamanager/periodManager/periodImportModel.xls");
			DownloadUtil.writeDownloadFile(request, response, filename, workBook);
		} 
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	/**
	 * 按照路径读取文件
	 * @return
	 */
//	public InputStream getDownloadPeriodModelFile()
//	{   
//	    return ServletActionContext.getServletContext().getResourceAsStream("/wfs/gl/datamanager/periodManager/periodImportModel.xls");   
//	}
	
	
//	public String importPeriod()
//	{
//		try
//		{
//			StringHolder errormsg = new StringHolder();
//			errormsg.value = "";
//			this.periodmanagerbp.importPeriod(periodFile,errormsg);
//			JSONObject rtn = new JSONObject();
//			if(errormsg.value == "")
//			{
//				rtn.put(SUCCESS_KEY, true);
//				this.setJsonString(rtn.toString());
//			}
//			else
//			{
//				rtn.put(SUCCESS_KEY, false);
//				rtn.put(MESSAGE_KEY, errormsg.value);
//				this.setJsonString(rtn.toString());
//			}
//			
//		}
//		catch( Exception e)
//		{
//			JSONObject rtn = new JSONObject();
//			rtn.put(SUCCESS_KEY, false);
//			rtn.put(MESSAGE_KEY, e.getMessage());
//			this.setJsonString(rtn.toString());
//		}
//		return SUCCESS;
//	}
	
//	public String hrefPeriod()
//	{
//		return SUCCESS;
//	}
}
