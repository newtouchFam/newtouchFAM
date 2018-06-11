package com.newtouch.nwfs.gl.csmanager.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.Date;
import java.util.List;
import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;

@Repository
public class CompanyRegisterDAO extends CommonDAO
{
	public void save(EntityMap entity) 
	{
	String strSql = "insert into m_company(";
		   strSql+=  "CompanyID,CompanyName,CompanyEmail,AdminID,AdminPWD";
		   strSql+= ",AdminPhone,FdbNumber,RegistrationName,RegistrationDate";
		   strSql+= ",ValidDateStart,ValidDateEnd)";
		   strSql+=	 " values(?,?,?,?,?,?,?,?,?,?,?)";
		   
		this.execute(strSql, new Object[]
		{
				entity.get("CompanyID"),
				entity.get("CompanyName"),
				entity.get("CompanyEmail"),
				entity.get("AdminID"),
				entity.get("AdminPWD"),
				entity.get("AdminPhone"),
				entity.get("FdbNumber"),
				entity.get("RegistrationName"),
				entity.get("RegistrationDate"),
				entity.get("ValidDateStart"),
				entity.get("ValidDateEnd")
				
		});
	}

	public boolean searchCompanyName(EntityMap entity) 
	{
		String companyname = entity.getString("CompanyName");
		StringBuilder strSql = new StringBuilder();
		strSql.append ("select count(1)");
		strSql.append (" from m_company");
		strSql.append (" where companyname = ?");
		int result = this.querySingleInteger(strSql.toString(), new String[]{companyname});
		if(result>0)
		{
			return true;
		}
		else
		{
			return false;   
		}
	}


	public List<EntityMap> searchAccountSetStatus() 
	{
		StringBuilder strSql = new StringBuilder();
		strSql.append("select AccountSetID");
		strSql.append(" from m_fdb");
		strSql.append(" where Status = 2");
		strSql.append(" and AccountSetID <> 'manage'");
		strSql.append(" and AccountSetID <> 'sharedatabase'");
		List<EntityMap> mapList = this.getMapList(strSql.toString());
		return mapList;
	}

	
	public void saveCompanyIDandAccountSetID(EntityMap entity) 
	{
		String CompanyID = entity.getString("CompanyID");
		String AccountSetID = entity.getString("AccountSetID");
		StringBuilder strSql = new StringBuilder();
		strSql.append("insert into m_company_fdb(");
		strSql.append(" ID,CompanyID,AccountSetID)");
		strSql.append(" values(UUID(),?,?)");
		this.execute(strSql.toString(), new Object[]{CompanyID,AccountSetID});
	}

	//更新m_fdb的状态
	
	public void updateStatus(String AccountSetID,Date nowDate,Date lastDate)
	{
		StringBuilder strSql = new StringBuilder();
		strSql.append("update m_fdb mf set");
		strSql.append(" mf.Status = 1,ValidDateStart = ?,ValidDateEnd = ?");
		strSql.append(" where AccountSetID = ?");
		this.execute(strSql.toString(), new Object[]{nowDate,lastDate,AccountSetID});
	}
	
	//更新m_database的状态
	public void updateDataBaseStatus(String DataBaseID)
	{
		StringBuilder strSql = new StringBuilder();
		strSql.append("update m_database md set");
		strSql.append(" md.Status = 1");
		strSql.append(" where DataBaseID = ?");
		this.execute(strSql.toString(), new Object[]{DataBaseID});
	}
	
	
	public List<EntityMap> searchRegisterInfo(String strCompyName) 
	{
		String CompanyName = strCompyName;
		StringBuilder strSql = new StringBuilder();
		strSql.append("select CompanyID,CompanyName,CompanyEmail,AdminID");
		strSql.append(",AdminPWD,AdminPhone,FdbNumber,RegistrationName");
		strSql.append(" from m_company");
		strSql.append(" where CompanyName = ?");
		
		// 查询公司信息
		List<EntityMap> mapList = this.getMapList(strSql.toString(), new Object[]{CompanyName});
		
		// 取得之前插入的公司ID
		String strCompanyID = mapList.get(0).getString("CompanyID");
		
		// 查询公司分配的账套ID
		StringBuilder strSetIDSql = new StringBuilder();
		strSetIDSql.append("select ID,CompanyID,AccountSetID");
		strSetIDSql.append(" from m_company_fdb");
		strSetIDSql.append(" where CompanyID = ?");
		// 账套信息
		List<EntityMap> mapSetIDList = this.getMapList(strSetIDSql.toString(), new Object[]{strCompanyID});
		
		// 设置返回的公司信息
		// 在公司返回结果集中存放公司的账套信息
		mapList.get(0).put("setIDs", mapSetIDList);
		
		return mapList ;
	}

	
	public List<EntityMap> serachEmail() 
	{
		StringBuilder strSql = new StringBuilder();
		strSql.append("select m.key,m.value");
		strSql.append(" from m_data_dictionary m");
		strSql.append(" where m.key <> 'pop3'");
		List<EntityMap> mapList = this.getMapList(strSql.toString());
		return mapList;
	}

	
	public List<EntityMap> getFreeDays()
	{
		StringBuilder strSql = new StringBuilder();
		strSql.append("select m.value");
		strSql.append(" from m_data_dictionary m");
		strSql.append(" where m.key = 'trialtime'");
		List<EntityMap> mapList = this.getMapList(strSql.toString());
		return mapList;
	}

	
	public List<EntityMap> getEmailTitle()
	{
		StringBuilder strSql = new StringBuilder();
		strSql.append("select m.value");
		strSql.append(" from m_data_dictionary m");
		strSql.append(" where m.key = 'mailsubject'");
		List<EntityMap> mapList = this.getMapList(strSql.toString());
		return mapList;
	}

	
	public List<EntityMap> getEmailContent()
	{
		StringBuilder strSql = new StringBuilder();
		strSql.append("select m.value");
		strSql.append(" from m_data_dictionary m");
		strSql.append(" where m.key = 'mailcontent'");
		List<EntityMap> mapList = this.getMapList(strSql.toString());
		return mapList;
	}

	
	public List<EntityMap> getCompanyId(String companyName) 
	{
		StringBuilder strSql = new StringBuilder();
		strSql.append(" select CompanyID");
		strSql.append(" from m_company ");
		strSql.append(" where CompanyName = ? ");
		List<EntityMap> mapList = this.getMapList(strSql.toString(), new Object[]{companyName});
		return mapList;
	}

	
	public List<EntityMap> getAccountSet(String companyId) 
	{
		StringBuilder strSql = new StringBuilder();
		strSql.append(" select AccountSetID");
		strSql.append(" from m_company_fdb ");
		strSql.append(" where CompanyID = ? ");
		List<EntityMap> mapList = this.getMapList(strSql.toString(), new Object[]{companyId});
		return mapList;
	}

	
	public void insertBasicInf(EntityMap entity, String companyId)
	{
		CallableStatement proc = null;
        try
        {
        	//Session session = (Session) this.getEntityManager().getDelegate();
    		//Connection conn = session.connection();
        	Connection conn =  this.getConnection();
    		//调用存储过程
    		proc = conn.prepareCall(" { CALL PROC_DEFAULT_DATA_COMPANY_USER(?, ?, ?, ?, ?, ?) } ");
		    proc.setString(1, companyId);
		    proc.setString(2, entity.getString("CompanyEmail"));
		    proc.setString(3, entity.getString("CompanyName"));
		    proc.setString(4, entity.getString("AdminID"));
		    proc.setString(5, entity.getString("RegistrationName"));
		    proc.registerOutParameter(6, Types.VARCHAR);
    		//执行sql
			proc.executeQuery();
        }
        catch (Exception e) 
        {
        	e.printStackTrace();
		}
	}

	public String  getUserID(String strUserName)
	{
		StringBuilder strSql = new StringBuilder();
		strSql.append("select t.ID");
		strSql.append(" from tsys_userbase t");
		strSql.append(" where t.VARNAME = ?");
		
		List<EntityMap> mapList = this.getMapList(strSql.toString(), new Object[]{strUserName});
		
		if(mapList.size() > 0)
		{
			//String strUserID = ((EntityMap)mapList.get(0)).getString("ID");
			return ((EntityMap)mapList.get(0)).getString("ID");
		}
		return null;
	}
	
	public void initBasicInf() 
	{
		CallableStatement proc = null;
        try
        {
        	//Session session = (Session) this.getEntityManager().getDelegate();
    		//Connection conn = session.connection();
        	Connection conn =  this.getConnection();
    		//调用存储过程
    		proc = conn.prepareCall(" { CALL PROC_DEFAULT_DATA(?) } ");
		    proc.registerOutParameter(1, Types.VARCHAR);
    		//执行sql
			proc.executeQuery();
        }
        catch (Exception e) 
        {
        	e.printStackTrace();
		}
	}
}
