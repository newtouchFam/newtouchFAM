package com.newtouch.nwfs.gl.csmanager.bp;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import javax.xml.rpc.holders.StringHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.security.ifx.IPasswordValidateBP;
import com.newtouch.cloud.security.result.ValidateResult;
import com.newtouch.nwfs.gl.csmanager.dao.CompanyRegisterDAO;
import com.newtouch.nwfs.gl.csmanager.utils.Mail;
import com.newtouch.nwfs.gl.csmanager.utils.MailUtils;


@Service
@Transactional
public class CompanyRegisterBp
{
	@Autowired
	private CompanyRegisterDAO  companyregisterdao;
	@Autowired
	private IPasswordValidateBP bp; //= new PasswordValidateBP();
	@Autowired
	private Properties setInfo;
	
	public boolean doMain(EntityMap entity, Properties prop, Mail mail, StringHolder username, StringHolder password, StringHolder errmsg) throws Exception 
	{
		try {
			addCompany(entity);
			searchCompy(entity.getString("CompanyName"), prop, mail, username, password);
			return true;
		} 
		catch (Exception e) 
		{
			e.printStackTrace();//
			errmsg.value = e.getMessage();
			return false;
		}
	}
	
	public void addCompany(EntityMap entity) throws Exception  
	{
		/*
		 * 先查询是否有这个公司名字
		 * 如果有 返回true
		 * 没有返回false
		 */
		boolean name =this.companyregisterdao.searchCompanyName(entity);
		/*
		 * 如果返回的是true则抛出该公司已经注册
		 * 如果返回的是false则调用保存的方法将该公司插入数据库
		 */
		if(name == true)
		{
			String CompanyName = entity.getString("CompanyName");
			throw new Exception("您公司[" + CompanyName + "]已提交试用申请");
		}
		else
		{
			String companyId = UUID.randomUUID().toString().toUpperCase();

			Calendar cal = Calendar.getInstance();
			Calendar calSmall  = Calendar.getInstance();
			calSmall .setTime(cal.getTime());
			
			//获取免费试用天数
			List<EntityMap> list0 = companyregisterdao.getFreeDays();
			int days = Integer.parseInt(list0.get(0).getString("value"));
			// 当前日期增加有效天数
			calSmall .set(Calendar.DATE
			            , calSmall .get(Calendar.DATE)+days);
			// 服务器当前日期
			Date nowDate = cal.getTime();
			// 账套有效结束时间
			Date lastDate = calSmall.getTime();
			
			entity.put("RegistrationDate",nowDate);
			entity.put("ValidDateStart",nowDate);
			entity.put("ValidDateEnd", lastDate);
			entity.put("CompanyID", companyId);
			companyregisterdao.save(entity);
			int FdbNumber = entity.getInteger("FdbNumber");
			List<String> setids = new ArrayList<String>();
			List<EntityMap> list = companyregisterdao.searchAccountSetStatus();
			
			for(int i = 0;i<FdbNumber;i++)
			{
				setids.add(list.get(i).getString("AccountSetID"));
			}
			for(int i = 0;i<setids.size();i++)
			{
				String AccountSetID = setids.get(i).toString();
				entity.put("AccountSetID",AccountSetID);
				companyregisterdao.saveCompanyIDandAccountSetID(entity);
				companyregisterdao.updateStatus(AccountSetID,nowDate,lastDate);
				companyregisterdao.updateDataBaseStatus(AccountSetID);
			}
		}
	}
	
	@SuppressWarnings("unchecked")
	public void searchCompy(String strCompyName, Properties prop, 
			Mail mail, StringHolder username, StringHolder password) throws Exception 
	{
		List<EntityMap> comList = companyregisterdao.searchRegisterInfo(strCompyName);
		String CompanyName = "";
		String CompanyEmail = "";
		String AdminID = "";
		String AdminPWD = "";
		String AdminPhone = "";
		String FdbNumber = "";
		String RegistrationName = "";
		List<EntityMap> mapSetIDList = new ArrayList<EntityMap>();
	
			EntityMap map = comList.get(0);
			CompanyName  = map.getString("CompanyName");
			CompanyEmail  = map.getString("CompanyEmail");
			AdminID  = map.getString("AdminID");
			AdminPWD  = map.getString("AdminPWD");
			AdminPhone  = map.getString("AdminPhone");
			FdbNumber  = map.getString("FdbNumber");
			RegistrationName = map.getString("RegistrationName");
			mapSetIDList = (List<EntityMap>)map.get("setIDs"); 
			String setids = "";
			for (int i = 0; i < mapSetIDList.size(); i++) 
			{
				setids+=mapSetIDList.get(i).getString("AccountSetID");
				setids+=",";
			}
			// 去除最后的逗号
			setids=setids.substring(0, setids.length()-1);
			
			//获取邮件内容
			List<EntityMap> emaillist0 = companyregisterdao.getEmailContent();
			String mailcontent = emaillist0.get(0).getString("value")
					.replace("[companyname]", CompanyName)
					.replace("[AdminID]", AdminID)
					.replace("[AdminPWD]", AdminPWD)
					.replace("[CompanyEmail]", CompanyEmail)
					.replace("[AdminPhone]", AdminPhone)
					.replace("[RegistrationName]", RegistrationName)
					.replace("[FdbNumber]", FdbNumber)
					.replace("[AccountSetID]", setids);
			
			List<EntityMap> mapList = new ArrayList<EntityMap>();
			String smtp = "";
			String emailaddress = "";
			String emailpassword = "";
			mapList = companyregisterdao.serachEmail();
			for (int i = 0; i < mapList.size(); i++) {
				String key = mapList.get(i).getString("key");
				if (key.equals("smtp")) {
					smtp = mapList.get(i).getString("value");
				} else if (key.equals("emailaddress")){
					emailaddress = mapList.get(i).getString("value");
				} else if (key.equals("emailpassword")){
					emailpassword = mapList.get(i).getString("value");
				}
			}
			
			//获取 Email标题
			List<EntityMap> emaillist = companyregisterdao.getEmailTitle();
			String emailtitle = emaillist.get(0).getString("value").replace("[companyname]", CompanyName);
			MailUtils.setInfo(smtp,prop);
			username.value = emailaddress;
			password.value = emailpassword;
	        
	        mail.setFrom(emailaddress);
	        mail.addToAddress(emailaddress);
	        mail.setSubject(emailtitle);
	        mail.setContent(mailcontent);
	}

	
	public void insertBasicInf(EntityMap entity, String companyId, StringHolder strErrMsg) throws Exception 
	{
		String strUserID = "";
		ValidateResult result = null;
		try
		{
			//初始化业务数据库基础数据
	//		companyregisterdao.initBasicInf();
			//插入公司、人员信息
			companyregisterdao.insertBasicInf(entity, companyId);
			//根据用户名, 获取用户ID
			strUserID = companyregisterdao.getUserID(entity.getString("AdminID"));
			//初始化用户密码
			//bp.initLoginAccountByName(entity.getString("AdminID"), entity.getString("AdminPWD"));
			result = bp.updatePassword(strUserID, entity.getString("AdminPWD"), strUserID,  1, "修改密码", "修改密码");
			
			if(!result.isSuccess())
			{
				strErrMsg.value = result.getErrDesc();
			}
		} 
		catch (Exception e) 
		{	
			e.printStackTrace();
			strErrMsg.value = result.getErrDesc();
		}
	}
	
	public String getUserID(EntityMap entity)
	{
		String strUserID;
		strUserID = companyregisterdao.getUserID(entity.getString("AdminID"));
		return strUserID;
	}
	
	
	public String getCompanyId(String CompanyName) throws Exception 
	{
		//获取注册公司对应的ID
		String companyId = companyregisterdao.getCompanyId(CompanyName).get(0).getString("CompanyID");
		return companyId;
	}
	
	
	public List<EntityMap> getAccountSet(String companyId) throws Exception
	{
		//获取注册公司对应账套
		List<EntityMap> accountSet = companyregisterdao.getAccountSet(companyId);
		return accountSet;
	}

}
