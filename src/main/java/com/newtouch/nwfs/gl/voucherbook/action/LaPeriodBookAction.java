package com.newtouch.nwfs.gl.voucherbook.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.xml.rpc.holders.IntHolder;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;





import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.jasperreports.JRClassicBaseAction;
import com.newtouch.cloud.common.jasperreports.model.wrapper.JasperReportsClassicModelWrapper;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nwfs.gl.voucherbook.bp.LaPeriodBookBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/voucherbook/labook")
public class LaPeriodBookAction extends JRClassicBaseAction
{
	@Autowired
	private LaPeriodBookBP bp;
	
	@Override
	protected List<?> fillReportData(JasperReportsClassicModelWrapper jrModel,
			HttpServletRequest request, ConditionMap cdtMap, String format,
			String fileName, IntHolder intTotalCount) throws Exception 
	{
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		jrModel.setFileName(fileName + df.format(new Date()) + "." + format);
		//设置表头的值
		jrModel.setAttribute("ledgername", cdtMap.get("ledgername"));
		jrModel.setAttribute("startperioddisplay", cdtMap.get("startperioddisplay"));
		jrModel.setAttribute("endperioddisplay", cdtMap.get("endperioddisplay"));
		jrModel.setAttribute("accountlevel", cdtMap.get("accountlevel"));

		PageData<EntityMap> page = this.bp.getReportData(cdtMap);
		intTotalCount.value = page.getTotal();
		return page.getData();
	}
	
	@RequestMapping("/getTableName")
	@ResponseBody
	public Object getTableName(HttpSession httpSession,@RequestParam(required=false, defaultValue="{}") String jsonCondition)
	{
		
		
		
		ActionResult result = new ActionResult();
		ConditionMap cdtMap = null ;
		cdtMap  = new ConditionMap(jsonCondition);
		try 
		{
			M8Session m8session = new M8Session(httpSession);
			String uqcompanyid = ObjectUtils.toString(m8session.getCompanyID());
			String uqaccountsetid = ObjectUtils.toString(m8session.getAttribute("ACCOUNTSETID"));
			cdtMap.put("uqcompanyid", uqcompanyid);
			cdtMap.put("uqaccountsetid", uqaccountsetid);
			String ledgerdetailid = cdtMap.getString("ledgerdetailid");
			String ledgertypeid = cdtMap.getString("ledgertypeid");
			if(ledgerdetailid==null||ledgerdetailid.equals(""))
			{
				cdtMap.put("ledgerTypeID", ledgertypeid);
				cdtMap.put("ledgerde", null);	
			}
			else 
			{
				cdtMap.put("ledgerTypeID", null);
				cdtMap.put("ledgerde", ledgerdetailid);
			}
			String tablename = this.bp.getTableName(cdtMap);
			result.setSuccess(true);
			result.put("tablename", tablename);
		}
		catch (Exception e) 
		{
			result.setSuccess(false);
			result.setMsg(e.getMessage());
		}
		return result;
	}
	
}
