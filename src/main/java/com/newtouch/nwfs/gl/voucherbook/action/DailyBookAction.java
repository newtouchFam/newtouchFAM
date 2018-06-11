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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.jasperreports.JRClassicBaseAction;
import com.newtouch.cloud.common.jasperreports.model.wrapper.JasperReportsClassicModelWrapper;
import com.newtouch.nwfs.gl.voucherbook.bp.DailyBookBP;

import net.sf.json.JSONObject;


@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/wfs/voucherbook/dailybook")
public class DailyBookAction extends JRClassicBaseAction
{
	@Autowired
	private DailyBookBP dailybookbp;
	
	@RequestMapping("/gettableName")
	@ResponseBody
	public Object getTableName(@RequestParam String jsonCondition)
	{
		
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			
			String tablename = this.dailybookbp.getTableName(cdtMap);
			
			JSONObject obj = new JSONObject();
			obj.put("success", true);
			obj.put("tablename", tablename);
			
			return obj;
			
		} 
		catch (Exception ex) 
		{
			ex.printStackTrace();
			return ActionResultUtil.toException(ex);
		}
	}
	

	@Override
	protected List<?> fillReportData(
			JasperReportsClassicModelWrapper jrModel,
			HttpServletRequest request, ConditionMap cdtMap,
			String format, String fileName, IntHolder intTotalCount) throws Exception
	{
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		jrModel.setFileName(fileName + df.format(new Date()) + "." + format);
		jrModel.setAttribute("startperioddisplay", cdtMap.getString("startperioddisplay"));
		jrModel.setAttribute("endperioddisplay", cdtMap.getString("endperioddisplay"));
		jrModel.setAttribute("accountleveldisplay", cdtMap.getString("accountleveldisplay"));
		
		PageData<EntityMap> page = this.dailybookbp.getPageData(cdtMap);
		intTotalCount.value = page.getTotal();
		return page.getData();
	}
}
