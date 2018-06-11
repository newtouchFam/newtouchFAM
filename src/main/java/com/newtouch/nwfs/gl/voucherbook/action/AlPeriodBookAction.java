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
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.jasperreports.JRClassicBaseAction;
import com.newtouch.cloud.common.jasperreports.model.wrapper.JasperReportsClassicModelWrapper;
import com.newtouch.nwfs.gl.voucherbook.bp.AlPeriodBookBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/voucherbook/alperiodbook")
public class AlPeriodBookAction extends JRClassicBaseAction
{
	@Autowired
	private AlPeriodBookBP alperiodbookbp;

	/*
	 * 通过查询条件调用存储过程，返回查询数据临时表的表名
	 */
	@RequestMapping("/gettablename")
	@ResponseBody
	public ActionResult getTableName(@RequestParam String jsonCondition)
	{
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);

			String tablename = this.alperiodbookbp.getTableName(cdtMap);

			return new ActionResult().setSuccess(true)
					.setAttribute("tablename", tablename);
		} 
		catch (Exception ex)
		{
			ex.printStackTrace();
			return ActionResultUtil.toException(ex);
		}
	}
	
	/*
	 * 查询临时表的数据
	 */
	protected List<?> fillReportData(JasperReportsClassicModelWrapper jrModel,
			HttpServletRequest request, ConditionMap cdtMap,
			String format, String fileName, IntHolder intTotalCount) throws Exception
	{
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		jrModel.setFileName(fileName + df.format(new Date()) + "." + format);
		
		jrModel.setAttribute("startperioddisplay", cdtMap.get("startperioddisplay"));
		jrModel.setAttribute("endperioddisplay", cdtMap.get("endperioddisplay"));
		jrModel.setAttribute("accountname", cdtMap.get("accountname"));

		PageData<EntityMap> page = this.alperiodbookbp.getPageData(cdtMap.getStart(), cdtMap.getLimit(), cdtMap);
		intTotalCount.value = page.getTotal();
		return page.getData();
	}
}
