package com.newtouch.nwfs.gl.voucherbook.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.xml.rpc.holders.IntHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.jasperreports.JRClassicBaseAction;
import com.newtouch.cloud.common.jasperreports.model.wrapper.JasperReportsClassicModelWrapper;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nwfs.gl.voucherbook.bp.FlowSheetBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/voucherbook/flowsheet")
public class FlowSheetAction extends JRClassicBaseAction
{
	@Autowired
	private FlowSheetBP bp;
/*	
	@Override
	protected void bindQueryInfo() throws Exception 
	{
		super.headerParams.put("comperioddisplay", super.conditionMap.getString("comperioddisplay"));
		M8Session session = new M8Session();
		super.headerParams.put("companyname", session.getCompanyName());
	}

	@Override
	protected void bindReportData() throws Exception 
	{
		PageData<?> page = this.bp.getPageData(start, limit, this.conditionMap);

		super.putToReportParameters("list", page.getData().toArray());
	}
	
	public String  count() 
	{ 
		try
		{
			super.putCountJson(1);
		}
		catch (Exception e)
		{
			e.printStackTrace();

			JSONObject obj = new JSONObject();
			obj.put("success", false);
			obj.put("msg", e.getMessage());
			obj.put("error", e.getMessage());
			super.jsonString = obj.toString();
		}

		return SUCCESS;
	}

	public IFlowSheetBP getBp() 
	{
		return bp;
	}

	public void setBp(IFlowSheetBP bp) 
	{
		this.bp = bp;
	}
*/

	@Override
	protected List<?> fillReportData(JasperReportsClassicModelWrapper jrModel,
			HttpServletRequest request, ConditionMap cdtMap, String format,
			String fileName, IntHolder intTotalCount) throws Exception 
	{
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		jrModel.setFileName(fileName + df.format(new Date()) + "." + format);
		
		jrModel.setAttribute("comperioddisplay", cdtMap.getString("comperioddisplay"));
		M8Session m8Session = new M8Session(request.getSession());
		jrModel.setAttribute("companyname",m8Session.getCompanyName());
		//暂时不使用分页
		PageData<EntityMap> page = this.bp.getPageData(0, 999999999, cdtMap);
		intTotalCount.value = page.getTotal();
		return page.getData();
	}
	
}
