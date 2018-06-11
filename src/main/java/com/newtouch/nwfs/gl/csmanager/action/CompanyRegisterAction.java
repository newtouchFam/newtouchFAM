
package com.newtouch.nwfs.gl.csmanager.action;

import java.util.List;
import java.util.Properties;

import javax.mail.Session;
import javax.servlet.http.HttpSession;
import javax.xml.rpc.holders.StringHolder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.nwfs.gl.csmanager.bp.CompanyRegisterBp;
import com.newtouch.nwfs.gl.csmanager.utils.Mail;
import com.newtouch.nwfs.gl.csmanager.utils.MailUtils;
import com.newtouch.nwfs.platform.interceptor.DynamicDataSourceUtil;
//import com.opensymphony.xwork2.ActionSupport;

@Controller
@Scope("prototype")
@RequestMapping("/csmanager/companyregister")
public class CompanyRegisterAction
{
	@Autowired
	private CompanyRegisterBp companyregisterbp;//Bp层
	
	private Logger logger = LoggerFactory.getLogger("CompanyRegisterAction");
	
	@RequestMapping(value = "/getInfo", method = RequestMethod.POST)
	@ResponseBody
	public ActionResult  getInfo(HttpSession httpSession,@RequestParam(value="jsonString",required=false) String jsonString)
	{
		System.out.println("jsonString => " + jsonString);
		
		ActionResult result = new ActionResult();
		DynamicDataSourceUtil.changeSet (httpSession,"manage");
		ConditionMap cdtMap = new ConditionMap(jsonString);
		String CompanyName = cdtMap.getString("CompanyName");
		String CompanyEmail = cdtMap.getString("CompanyEmail");
		String AdminID = cdtMap.getString("AdminID");
		String AdminPWD = cdtMap.getString("AdminPWD");
		String AdminPhone = cdtMap.getString("AdminPhone");
		String FdbNumber = cdtMap.getString("FdbNumber");
		String RegistrationName = cdtMap.getString("RegistrationName");

		EntityMap entity = new EntityMap();
		entity.put("CompanyName", CompanyName);
		entity.put("CompanyEmail", CompanyEmail);
		entity.put("AdminID", AdminID);
		entity.put("AdminPWD",AdminPWD);
		entity.put("AdminPhone", AdminPhone);
		entity.put("FdbNumber",FdbNumber);
		entity.put("RegistrationName",RegistrationName);
		Properties prop = new Properties();
		StringHolder username = new StringHolder();
		StringHolder password = new StringHolder();
		StringHolder errmsg = new StringHolder();
		Mail mail = new Mail();
		try 
		{
			boolean doMainFlag = this.companyregisterbp.doMain
					(entity, prop, mail, username, password, errmsg);
			boolean insertBasicFlag = false;
			if(doMainFlag == true)
			{
				//业务数据库插入公司人员信息
				insertBasicFlag = insertBasicInf(httpSession,entity, errmsg);
				Session session = MailUtils.createSession(prop, username.value, password.value);
				//发送邮件
				if (insertBasicFlag == true) 
				{
					//当管理数据库处理成功  且  业务数据库处理成功 发送正常处理邮件
					MailUtils.send(session, mail);
				}
				else
				{
					//当管理数据库处理成功  但 业务数据库处理失败  发送业务处理异常文件
					String businessError =mail.getContent()
							+" 管理数据库数据处理完成，业务数据库数据处理异常，请运维人员手动完成《业务数据库 公司注册 执行手册》8、9、10步。";
					mail.setContent(businessError);
					MailUtils.send(session, mail);
				}
				if(errmsg.value != null && errmsg.value.length() > 0)
				{
					result.setSuccess(false);
					result.setMsg(errmsg.value);
				}else{
					result.setSuccess(true);
					result.setMsg("ok");
				}
			}else{
				result.setSuccess(false);
				result.setMsg(errmsg.value);
			}
			return result;
		} 
		catch (Exception e)
		{
			logger.error(e.getMessage());
			
			result.setSuccess(false);
			result.setMsg(e.getMessage());
			return result;
		}
		
		
	}
	
	public boolean insertBasicInf(HttpSession httpSession,EntityMap entity, StringHolder errmsg)
	{
		try 
		{
			String companyId = this.companyregisterbp.getCompanyId(entity.getString("CompanyName"));
			List<EntityMap> accountSet = this.companyregisterbp.getAccountSet(companyId);
			//遍历公司所有账套  插入对应数据库
			for (int i = 0; i < accountSet.size(); i++) 
			{
				DynamicDataSourceUtil.changeSet (httpSession, accountSet.get(i).getString("AccountSetID"));
				this.companyregisterbp.insertBasicInf(entity,companyId, errmsg);
			}
			return true;
		} 
		catch (Exception e) 
		{
			return false;
		}
	}
	

}
