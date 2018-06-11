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
import com.newtouch.nwfs.gl.datamanger.bp.InitLedgePeriodBp;
import com.newtouch.nwfs.gl.datamanger.util.ExportRateExcel;

@Controller
@Scope("prototype")
@RequestMapping("/datamanager/initledgeperiod")
public class InitLedgePeriodAction
{
	@Autowired
	private InitLedgePeriodBp ledgePeriodBp;
	
	/**
	 * 查询分户期初余额（分页显示）
	 * @return
	 */
	@RequestMapping("/getinitledgeperiod")
	@ResponseBody
	public  Object getInitLedgePeriod(@RequestParam String paramString,
			@RequestParam int start,
			@RequestParam int limit
			) 
	{
		try
		{
			ConditionMap paramMap = new ConditionMap(paramString);
			PageData<EntityMap> page = 
					this.ledgePeriodBp.getInitLedgePeriod(paramMap.getString("uqcompanyid"),paramMap.getString("uqaccountid"),paramMap.getString("uqledgetypeid"),start,limit);		
			return ActionResultUtil.toPageData(page);
		} 
		catch (Exception e)
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 修改分户期初余额
	 * @return
	 */
	@RequestMapping("/editinitledgeperiod")
	@ResponseBody
	public Object editInitLedgePeriod(@RequestParam(required=false, defaultValue="{}") String paramString) 
	{
		try
		{
			ConditionMap paramMap = new ConditionMap(paramString);
			EntityMap entity = new EntityMap();
			entity.put("uqcompanyid", paramMap.getString("uqcompanyid"));
			entity.put("uqaccountid", paramMap.getString("uqaccountid"));
			entity.put("uqledgeid", paramMap.getString("uqledgeid"));
			entity.put("uqglobalperiodid", "00000000-0000-0000-0000-000000000000");
			entity.put("mnydebitperiod", paramMap.getString("mnydebitperiod"));
			entity.put("mnycreditperiod", paramMap.getString("mnycreditperiod"));
			this.ledgePeriodBp.editInitLedgePeriod(entity);
			
			ActionResult result = new ActionResult();
			result.setSuccess(true);
			return result;
		}
		catch( Exception e)
		{
			e.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
	
	/**
	 * 导入分户期初余额
	 * @return
	 */
	@RequestMapping("/importledgeperiod")
	@ResponseBody
	public String importLedgePeriod(HttpServletRequest request, HttpServletResponse response,
			@RequestParam CommonsMultipartFile uploadFile,
			@RequestParam String jsonCondition
			) 
	{
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			StringHolder errormsg = new StringHolder();
			errormsg.value = "";
			this.ledgePeriodBp.importLedgePeriod(uploadFile.getInputStream(),cdtMap.getString("companyid"),errormsg);
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
	 * 导出分户期初余额
	 * @return
	 */
	@RequestMapping("/exportledgeperiod")
	@ResponseBody
	public String exportLedgePeriod(@RequestParam String jsonCondition,
			HttpServletRequest request, 
			HttpServletResponse response
			) 
	{
		//List<Object[]> list = this.ledgePeriodBp.exportLedgePeriod(this.uqcompanyid, this.uqaccountid, this.uqledgetypeid);
		ExportRateExcel exportRateExcel = new ExportRateExcel();
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			List<Object[]> list = this.ledgePeriodBp.exportLedgePeriod(cdtMap.getString("companyid"),cdtMap.getString("accountid"),cdtMap.getString("ledgetypeid"));
			if (list.size() <= 0)
			{
				return "没有数据可供导出！";
			}
			
			String fliename = new SimpleDateFormat("yyyy-MM-dd").format(new Date()) + "分户期初余额设置导出.xls";
			String firstSheetName = "分户期初余额设置导出";
			String[] excelFirstTitle = { "科目编码","科目名称","分户类别名称","分户项目编码","分户项目名称","上级分户项目名称","期初借方余额","期初贷方余额"};

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
	 * 导入模板下载
	 * @return
	 */
	@RequestMapping("/downloadinitledgeperiodimportmodel")
	@ResponseBody
	public String downloadInitLedgePeriodImportModel(HttpServletRequest request, HttpServletResponse response) 
	{
		try
		{
			DownloadUtil.writeDownloadFile(request, response, "", "wfs/gl/datamanager/initledgeperiod/initledgeperiodImportModel.xls");
	
			return "";
		}
		catch(Exception ex)
		{
			ex.printStackTrace();
			return "导入模板下载发生异常，错误信息：" + ex.getMessage();
		}
	}
	
	
	/**
	 * 获取科目年初数
	 * @return
	 */
	@RequestMapping("/getaccountperiod")
	@ResponseBody
	public Object getAccountPeriod(@RequestParam(required=false, defaultValue="{}") String paramString)
	{
		try
		{
			ConditionMap paramMap = new ConditionMap(paramString);
			EntityMap entity = new EntityMap();
			entity.put("uqcompanyid", paramMap.getString("uqcompanyid"));
			entity.put("uqaccountid", paramMap.getString("uqaccountid"));
			entity.put("uqglobalperiodid", "00000000-0000-0000-0000-000000000000");
			
			List<Object> list = this.ledgePeriodBp.getAccountPeriod(entity);
			if (null != list && list.size() > 0) 
			{
				Object[] objs = (Object[])list.get(0);
				String mnydebitperiod = objs[0] == null ? null : objs[0].toString();
				String mnycreditperiod = objs[1] == null ? null : objs[1].toString();
				ActionResult result = new ActionResult();
				result.setSuccess(true);
				
				if (mnydebitperiod == null && mnycreditperiod == null) 
				{
					result.setAttribute("type", "借/贷");
					result.setAttribute("amount", "无");
				}
				else if (mnydebitperiod != null)
				{
					result.setAttribute("type", "借");
					result.setAttribute("amount", mnydebitperiod);
				}
				else if (mnycreditperiod != null) 
				{
					result.setAttribute("type", "贷");
					result.setAttribute("amount", mnycreditperiod);
				}
				return result;
			}
			else 
			{
				ActionResult result = new ActionResult();
				result.setSuccess(true);
				result.setAttribute("type", "借/贷");
				result.setAttribute("amount", "无");
				return result;
			}
		}
		catch( Exception e)
		{
			e.printStackTrace();
			ActionResult result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
	}
}
