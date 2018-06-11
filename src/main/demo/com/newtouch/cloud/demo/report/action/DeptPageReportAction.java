package com.newtouch.cloud.demo.report.action;

import java.math.BigDecimal;
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
import com.newtouch.cloud.demo.report.bp.DeptPageReportBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/demo/report/deptpagereport")
public class DeptPageReportAction extends JRClassicBaseAction
{
	@Autowired
	private DeptPageReportBP bp;

	protected List<?> fillReportData(JasperReportsClassicModelWrapper jrModel,
			HttpServletRequest request, ConditionMap cdtMap,
			String format, String fileName, IntHolder intTotalCount) throws Exception
	{
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		jrModel.setFileName(fileName + df.format(new Date()) + "." + format);
		jrModel.setAttribute("reportparam", cdtMap.getString("reportparam"));

		PageData<EntityMap> page = this.bp.getReportData(cdtMap);
		intTotalCount.value = page.getTotal();

		double money = 0;
		int i = 0;
		for (EntityMap entity : page.getData())
		{
			entity.put("double", money);
//			entity.put("double2", String.valueOf(money));
			if (i == 0)
			{
				entity.put("double2", "");
			}
			else
			{
				entity.put("double2", money);
			}

			entity.put("bigdecimal", BigDecimal.valueOf(money));
			entity.put("bigdecimal2", BigDecimal.valueOf(money).toString());

			money += 1000.1;
			i++;
		}

		return page.getData();
	}
}
