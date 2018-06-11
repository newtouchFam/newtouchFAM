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
import com.newtouch.nwfs.gl.voucherbook.bp.AccountperiodBp;
import com.newtouch.cloud.common.session.M8Session;

import org.apache.commons.lang.ObjectUtils;

import net.sf.json.JSONObject;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/wfs/voucherbook/accountperiod")
public class AccountperiodAction extends JRClassicBaseAction
{
	@Autowired
	private AccountperiodBp accountperiodBp;
	
	/**
	 * 获取临时表表名
	 * @return
	 */
	@RequestMapping("/gettableName")
	@ResponseBody
	public Object getTableName(@RequestParam String jsonCondition)
	{
		try 
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			//从session中获取单位 和 科目套
			M8Session m8session = new M8Session();
			String uqcompanyid = ObjectUtils.toString(m8session.getCompanyID());
			String uqaccountsetid = ObjectUtils.toString(m8session.getAttribute("ACCOUNTSETID"));
			cdtMap.put("uqcompanyid", uqcompanyid);
			cdtMap.put("uqaccountsetid", uqaccountsetid);
			String tablename = this.accountperiodBp.getTableName(cdtMap);
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
		jrModel.setAttribute("beginyearmonth", cdtMap.getString("beginyearmonth"));
		jrModel.setAttribute("endyearmonth", cdtMap.getString("endyearmonth"));
		jrModel.setAttribute("accountlevel", cdtMap.getString("accountlevel"));
		
		PageData<EntityMap> page = this.accountperiodBp.getPageData(cdtMap);
		intTotalCount.value = page.getTotal();
		return page.getData();
	}
}
