package com.newtouch.nwfs.gl.vouchermanager.action;

import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.xml.rpc.holders.StringHolder;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.jasperreports.model.wrapper.JRBaseModelWrapper;
import com.newtouch.nwfs.gl.vouchermanager.bp.VoucherPrintBP;

/**
 * 报表答应
 * @author mboat 2017年5月25日
 */
@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/voucher")
public class VoucherPrintAction
{
	@Autowired
	private VoucherPrintBP voucherPrintBP;

	@RequestMapping("/print")
	public String printVoucher(Model model, HttpServletRequest request,
			@RequestParam(name="jsonFilter") String jsonFilter,
			@RequestParam(name="location") String location,
			@RequestParam(name="format") String format) throws Exception
	{
		try
		{
			/**
			 * 初始化View并解析查询参数
			 */
			JRBaseModelWrapper jrModel = new JRBaseModelWrapper(model);
			jrModel.initReportParamters(request);

			jrModel.setJasper(location);
			jrModel.setFormat(format);

			ConditionMap cdtMap = new ConditionMap(jsonFilter);

			EntityMap paramHeader = new EntityMap();
			List<EntityMap> paramDetailList = new LinkedList<EntityMap>();

			StringHolder fileName = new StringHolder();
			this.voucherPrintBP.getVoucherPrintData(cdtMap, paramHeader, paramDetailList, fileName);

			/**
			 * 设置报表数据到jasper报表模板
			 */
			jrModel.setAttributes(paramHeader);
			jrModel.setReportData(paramDetailList);


			jrModel.setIsAttachment(false);
			jrModel.setFileName(fileName.value);

			/**
			 * 返回视图标志
			 */
			return "voucherPrintView";
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			throw ex;
		}
	}
	
	@RequestMapping("/prints")
	public String printsVoucher(Model model, HttpServletRequest request,
			@RequestParam(name="jsonFilter") String jsonFilter,
			@RequestParam(name="location") String location,
			@RequestParam(name="format") String format) throws Exception
	{
		try
		{
			/**
			 * 初始化View并解析查询参数
			 */
			JRBaseModelWrapper jrModel = new JRBaseModelWrapper(model);
			jrModel.initReportParamters(request);

			jrModel.setJasper(location);
			jrModel.setFormat(format);
			
			List<EntityMap> mainDetailList = new LinkedList<EntityMap>();

			JSONObject idObj = JSONObject.fromObject(jsonFilter);
			
			JSONArray arrayvoucherid = JSONArray.fromObject(idObj.getString("voucherids"));

			for(int i = 0; i < arrayvoucherid.size(); i++)
			{
				JSONObject vouobj = arrayvoucherid.getJSONObject(i);
				String voucherid = vouobj.getString("voucherid");
				
				ConditionMap map = new ConditionMap();
				map.put("voucherid", voucherid);
				
				EntityMap subParam = new EntityMap();
				List<EntityMap> subDetailList = new LinkedList<EntityMap>();
				StringHolder fileName = new StringHolder();
				
				this.voucherPrintBP.getVoucherPrintData(map, subParam, subDetailList, fileName);
				
				EntityMap mainMap = new EntityMap();
				mainMap.put("param", subParam);
				mainMap.put("data", subDetailList.toArray());
				mainDetailList.add(mainMap);
			}
			
			StringHolder fileName = new StringHolder();
			fileName.value = "会计凭证";
			EntityMap mainParam = new EntityMap();
			mainParam.put("SUBREPORT_DIR", request.getServletContext().getRealPath("wfs/gl/vouchermanager/vouchermake")+"/");
			/**
			 * 设置报表数据到jasper报表模板
			 */
			jrModel.setAttributes(mainParam);
			jrModel.setReportData(mainDetailList);


			jrModel.setIsAttachment(false);
			jrModel.setFileName(fileName.value);

			/**
			 * 返回视图标志
			 */
			return "voucherPrintView";
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			throw ex;
		}
	}
}