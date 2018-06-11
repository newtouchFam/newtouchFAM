package com.newtouch.cloud.demo.report.action;

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
import com.newtouch.cloud.common.jasperreports.JRClassicBaseAction;
import com.newtouch.cloud.common.jasperreports.model.wrapper.JasperReportsClassicModelWrapper;
import com.newtouch.cloud.demo.report.bp.UnitReportBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/demo/report/unitreport")
public class UnitReportAction extends JRClassicBaseAction
{
	@Autowired
	private UnitReportBP bp;

	protected List<?> fillReportData(JasperReportsClassicModelWrapper jrModel,
			HttpServletRequest request, ConditionMap cdtMap,
			String format, String fileName, IntHolder intTotalCount) throws Exception
	{
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		jrModel.setFileName(fileName + df.format(new Date()) + "." + format);
		jrModel.setAttribute("reportparam", cdtMap.getString("reportparam"));

		List<EntityMap> list = this.bp.getReportData(cdtMap);

		intTotalCount.value = list.size();
		return list;
	}
}
