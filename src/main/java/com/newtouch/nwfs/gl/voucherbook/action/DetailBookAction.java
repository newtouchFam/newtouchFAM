package com.newtouch.nwfs.gl.voucherbook.action;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.xml.rpc.holders.IntHolder;

import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.jasperreports.JRClassicBaseAction;
import com.newtouch.cloud.common.jasperreports.model.wrapper.JasperReportsClassicModelWrapper;
import com.newtouch.nwfs.gl.voucherbook.bp.DetailBookBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/wfs/voucherbook/detailbook")
public class DetailBookAction extends JRClassicBaseAction
{
	@Autowired
	private DetailBookBP detailbookbp;
	
	//调用存储过程  获得表名
	@RequestMapping("/gettableName")
	@ResponseBody
	public Object getTableName(@RequestParam String jsonCondition)
	{
		try 
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			
			String tablename = this.detailbookbp.getTableName(cdtMap);
			
			JSONObject rtn = new JSONObject();
			rtn.put("success", true);
			rtn.put("tablename", tablename);

			return rtn;
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toException(e);
		}
	}
	

	protected List<?> fillReportData(
			JasperReportsClassicModelWrapper jrModel,
			HttpServletRequest request, ConditionMap cdtMap,
			String format, String fileName, IntHolder intTotalCount) throws Exception
	{
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		jrModel.setFileName(fileName + df.format(new Date()) + "." + format);
		jrModel.setAttribute("startperiod", cdtMap.getString("startperiod"));
		jrModel.setAttribute("endperiod", cdtMap.getString("endperiod"));
		jrModel.setAttribute("disaccountlevel", cdtMap.getString("disaccountlevel"));
		
		PageData<EntityMap> page = this.detailbookbp.getPageData(cdtMap);
		intTotalCount.value = page.getTotal();
		return page.getData();
	}
}
