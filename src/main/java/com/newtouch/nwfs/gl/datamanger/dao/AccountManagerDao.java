package com.newtouch.nwfs.gl.datamanger.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.entity.AccountsEntity;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerTypeEntity;
/**
 * 科目管理dao层实现类
 * @author Administrator
 *
 */
@Repository
public class AccountManagerDao extends CommonDAO
{
	
	public PageData<EntityMap> getAccountInfoByParentId(String uqaccountsetid, String fullcode, int start, int limit) throws Exception
	{
		if ("root".equals(fullcode)) 
		{
			fullcode = "";
		}
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT ta.uqaccountid, ");
		sb.append(" ta.varaccountcode, ");
		sb.append(" ta.varaccountfullcode, ");
		sb.append(" ta.varaccountname, ");
		sb.append(" ta.varaccountfullname, ");
		sb.append(" ta.uqparentid, ");
		sb.append(" CONCAT('[',tap.varaccountcode,']',tap.varaccountname)  AS parentname, ");
		sb.append(" tc1.categorycode AS intpropertyno, ");
		sb.append(" tc1.categoryname AS intproperty, ");
		sb.append(" tc2.categorycode AS uqtypeidno, ");
		sb.append(" tc2.categoryname AS uqtypeid, ");
		sb.append(" tc3.categorycode AS uqforeigncurridno, ");
		sb.append(" tc3.categoryname AS uqforeigncurrid, ");
		sb.append(" tc4.categorycode AS varmeasureno, ");
		sb.append(" tc4.categoryname AS varmeasure, ");
		sb.append(" ta.intisledge, ");
		sb.append(" ta.intislastlevel, ");
		sb.append(" ta.intflag, ");
		sb.append(" tc5.categorycode AS intisflowno, ");
		sb.append(" tc5.categoryname AS intisflow ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" INNER JOIN tgl_accounts tap ON ta.uqparentid = tap.uqaccountid ");
		sb.append(" INNER JOIN tob_category tc1 ON tc1.categorycode = ta.intproperty AND tc1.categorytype = '10000001' ");
		sb.append(" LEFT JOIN tob_category tc2 ON tc2.categorycode = ta.uqtypeid AND tc2.categorytype = '10000002' ");
		sb.append(" LEFT JOIN tob_category tc3 ON tc3.categorycode = ta.uqforeigncurrid AND tc3.categorytype = '10000003' ");
		sb.append(" LEFT JOIN tob_category tc4 ON tc4.categorycode = ta.varmeasure AND tc4.categorytype = '10000004' ");
		sb.append(" INNER JOIN tob_category tc5 ON tc5.categorycode = ta.intisflow AND tc5.categorytype = '10000010' ");
		sb.append(" WHERE ta.varaccountfullcode LIKE ? ");
		sb.append(" AND ta.uqaccountsetid = ? ");
		sb.append(" AND ta.uqaccountid <> '00000000-0000-0000-0000-000000000000' ");
		sb.append(" ORDER BY ta.varaccountfullcode ");
		String[] fields = new String[]{fullcode + "%",uqaccountsetid};
		return this.getMapPage(sb.toString(), fields, start, limit);
	}
	
	public PageData<EntityMap> getAccountInfoByCondition(String uqaccountsetid, String code, String name, int start, int limit) throws Exception
	{
		ArrayList<Object> params = new ArrayList<Object>();
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT ta.uqaccountid, ");
		sb.append(" ta.varaccountcode, ");
		sb.append(" ta.varaccountfullcode, ");
		sb.append(" ta.varaccountname, ");
		sb.append(" ta.varaccountfullname, ");
		sb.append(" ta.uqparentid, ");
		sb.append(" CONCAT('[',tap.varaccountcode,']',tap.varaccountname)  AS parentname, ");
		sb.append(" tc1.categorycode AS intpropertyno, ");
		sb.append(" tc1.categoryname AS intproperty, ");
		sb.append(" tc2.categorycode AS uqtypeidno, ");
		sb.append(" tc2.categoryname AS uqtypeid, ");
		sb.append(" tc3.categorycode AS uqforeigncurridno, ");
		sb.append(" tc3.categoryname AS uqforeigncurrid, ");
		sb.append(" tc4.categorycode AS varmeasureno, ");
		sb.append(" tc4.categoryname AS varmeasure, ");
		sb.append(" ta.intisledge, ");
		sb.append(" ta.intislastlevel, ");
		sb.append(" ta.intflag, ");
		sb.append(" tc5.categorycode AS intisflowno, ");
		sb.append(" tc5.categoryname AS intisflow ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" INNER JOIN tgl_accounts tap ON ta.uqparentid = tap.uqaccountid ");
		sb.append(" INNER JOIN tob_category tc1 ON tc1.categorycode = ta.intproperty AND tc1.categorytype = '10000001' ");
		sb.append(" LEFT JOIN tob_category tc2 ON tc2.categorycode = ta.uqtypeid AND tc2.categorytype = '10000002' ");
		sb.append(" LEFT JOIN tob_category tc3 ON tc3.categorycode = ta.uqforeigncurrid AND tc3.categorytype = '10000003' ");
		sb.append(" LEFT JOIN tob_category tc4 ON tc4.categorycode = ta.varmeasure AND tc4.categorytype = '10000004' ");
		sb.append(" INNER JOIN tob_category tc5 ON tc5.categorycode = ta.intisflow AND tc5.categorytype = '10000010' ");
		sb.append(" WHERE ta.uqaccountid <> '00000000-0000-0000-0000-000000000000' ");
		sb.append(" AND ta.uqaccountsetid = ? ");
		params.add(uqaccountsetid);
		sb.append(" AND ( 0 = 1 ");
		if (code!=null && !"".equals(code)) 
		{
			sb.append(" OR ta.varaccountcode LIKE ? ");
			params.add(code+"%");
			sb.append(" OR 0 = 1 ");
		}
		if (name!=null && !"".equals(name)) 
		{
			sb.append(" OR ta.varaccountname LIKE ? ");
			params.add("%"+name+"%");
			sb.append(" OR 0 = 1 ");
		}
		sb.append(" )");
		sb.append(" ORDER BY ta.varaccountfullcode ");
		return this.getMapPage(sb.toString(), params, start, limit);
	}
	
	public List<Object> getAccountTree(String uqaccountsetid, String parentId) throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT ta.uqaccountid, ");
		sb.append(" ta.varaccountcode, ");
		sb.append(" ta.varaccountname, ");
		sb.append(" ta.intislastlevel, ");
		sb.append(" ta.varaccountfullcode, ");
		sb.append(" ta.varaccountfullname, ");
		sb.append(" ta.uqparentid, ");
		sb.append(" CONCAT('[',tap.varaccountcode,']',tap.varaccountname) AS parentname, ");
		sb.append(" tc1.categorycode AS intpropertyno, ");
		sb.append(" tc1.categoryname AS intproperty, ");
		sb.append(" tc2.categorycode AS uqtypeidno, ");
		sb.append(" tc2.categoryname AS uqtypeid, ");
		sb.append(" tc3.categorycode AS uqforeigncurridno, ");
		sb.append(" tc3.categoryname AS uqforeigncurrid, ");
		sb.append(" tc4.categorycode AS varmeasureno, ");
		sb.append(" tc4.categoryname AS varmeasure, ");
		sb.append(" ta.intisledge, ");
		sb.append(" ta.intflag, ");
		sb.append(" tc5.categorycode AS intisflowno, ");
		sb.append(" tc5.categoryname AS intisflow ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" INNER JOIN tgl_accounts tap ON ta.uqparentid = tap.uqaccountid ");
		sb.append(" INNER JOIN tob_category tc1 ON tc1.categorycode = ta.intproperty AND tc1.categorytype = '10000001' ");
		sb.append(" LEFT JOIN tob_category tc2 ON tc2.categorycode = ta.uqtypeid AND tc2.categorytype = '10000002' ");
		sb.append(" LEFT JOIN tob_category tc3 ON tc3.categorycode = ta.uqforeigncurrid AND tc3.categorytype = '10000003' ");
		sb.append(" LEFT JOIN tob_category tc4 ON tc4.categorycode = ta.varmeasure AND tc4.categorytype = '10000004' ");
		sb.append(" INNER JOIN tob_category tc5 ON tc5.categorycode = ta.intisflow AND tc5.categorytype = '10000010' ");
		sb.append(" WHERE ta.uqparentid = ? ");
		sb.append(" AND ta.uqaccountsetid = ? ");
		sb.append(" ORDER BY ta.varaccountfullcode ");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new Object[]{parentId,uqaccountsetid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(new Object[]
					{
					mapList.get(i).getString("uqaccountid"),
					mapList.get(i).getString("varaccountcode"),
					mapList.get(i).getString("varaccountname"),
					mapList.get(i).getString("intislastlevel"),
					mapList.get(i).getString("varaccountfullcode"),
					mapList.get(i).getString("varaccountfullname"),
					mapList.get(i).getString("uqparentid"),
					mapList.get(i).getString("parentname"),
					mapList.get(i).getString("intpropertyno"),
					mapList.get(i).getString("intproperty"),
					mapList.get(i).getString("uqtypeidno"),
					mapList.get(i).getString("uqtypeid"),
					mapList.get(i).getString("uqforeigncurridno"),
					mapList.get(i).getString("uqforeigncurrid"),
					mapList.get(i).getString("varmeasureno"),
					mapList.get(i).getString("varmeasure"),
					mapList.get(i).getString("intisledge"),
					mapList.get(i).getString("intflag"),
					mapList.get(i).getString("intisflowno"),
					mapList.get(i).getString("intisflow")
					}
			);
		}
		return resultList ;
	}
	
	public void addAccounts(AccountsEntity account) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_accounts ");
		sb.append(" (uqaccountid, uqaccountsetid, varaccountcode, ");
		sb.append(" varaccountfullcode, varaccountname, varaccountfullname, ");
		sb.append(" intproperty, uqtypeid, uqforeigncurrid, ");
		sb.append(" varmeasure, intisledge, intiscrossledge, ");
		sb.append(" uqpreaccountid, uqparentid, intislastlevel, ");
		sb.append(" intlevel, intflag, intisflow) ");
		sb.append(" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ");
		
		this.execute(sb.toString(), new String[]
			{
			account.getUqaccountid(),
			account.getUqaccountsetid(),
			account.getVaraccountcode(),
			account.getVaraccountfullcode(),
			account.getVaraccountname(),
			account.getVaraccountfullname(),
			account.getIntproperty(),
			account.getUqtypeid(),
			account.getUqforeigncurrid(),
			account.getVarmeasure(),
			account.getIntisledge(),
			account.getIntiscrossledge(),
			account.getUqpreaccountid(),
			account.getUqparentid(),
			account.getIntislastlevel(),
			account.getIntlevel(),
			account.getIntflag(),
			account.getIntisflow()
			}
		);
	}
	
	public void editAccounts(AccountsEntity account) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_accounts ta SET ");
		sb.append(" ta.varaccountname = ?, ");
		sb.append(" ta.intproperty = ?, ");
		sb.append(" ta.uqtypeid = ?, ");
		sb.append(" ta.uqforeigncurrid = ?, ");
		sb.append(" ta.varmeasure = ?,  ");
		sb.append(" ta.intisledge = ?, ");
		sb.append(" ta.intisflow = ? ");
		sb.append(" WHERE ta.uqaccountid = ? ");
		
		this.execute(sb.toString(), new String[]
			{
			account.getVaraccountname(),
			account.getIntproperty(),
			account.getUqtypeid(),
			account.getUqforeigncurrid(),
			account.getVarmeasure(),
			account.getIntisledge(),
			account.getIntisflow(),
			account.getUqaccountid()
			}
		);
	}
	
	public void deleteAccounts(String uqaccountid) throws Exception
	{
		String sql = " DELETE FROM tgl_accounts WHERE UQACCOUNTID = ? ";
		this.execute(sql, new String[]{uqaccountid});
	}

	public void updateIntflag(String uqaccountsetid,String uqaccountid, String fullcode, String startorclose, int type) throws Exception 
	{
		ArrayList<Object> params = new ArrayList<Object>();
		StringBuilder sb = new StringBuilder();
		sb.append(" update tgl_accounts ta set ");
		if (type == 1) 
		{
			if (startorclose.equals("start")) 
			{
				sb.append(" ta.intflag = 2 ");
				sb.append(" where uqaccountid = ? ");
				params.add(uqaccountid);
			}
		}
		if (type == 0) 
		{
			if (startorclose.equals("start")) 
			{
				sb.append(" ta.intflag = 2 ");		
			}
			if (startorclose.equals("close")) 
			{
				sb.append(" ta.intflag = 0 ");		
			}
			sb.append(" where ta.varaccountfullcode LIKE ? ");
			sb.append(" AND ta.uqaccountsetid = ? ");
			params.add(fullcode + "%");
			params.add(uqaccountsetid);
		}
		this.execute(sb.toString(), params);
	}
	
	public List<Object> getVoucherCountAboutAccount(String uqaccountid) throws Exception 
	{
		String sql = " SELECT COUNT(0) FROM tgl_voucher_details tvd WHERE tvd.uqaccountid = ? ";
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sql,new String[]{uqaccountid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		};
		return resultList;
	}
	
	public List<AccountsEntity> getAccountById(String uqaccountid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	ta.* ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" WHERE ta.uqaccountid = ? ");
		return this.getEntityList(sb.toString(), new String[]{uqaccountid}, AccountsEntity.class);
	}

	public List<AccountsEntity> getAccountByCode(String varaccountcode, String uqaccountsetid) throws Exception 
	{
		CallableStatement proc = null;
		ResultSet rs = null;
		AccountsEntity account = new AccountsEntity();
		List<AccountsEntity> list = new ArrayList<AccountsEntity>();
        try
        {
        	Connection conn = this.getConnection();
    		StringBuilder sb = new StringBuilder();
    		sb.append(" SELECT 	ta.* ");
    		sb.append(" FROM tgl_accounts ta ");
    		sb.append(" WHERE ta.varaccountcode = ? ");
    		sb.append(" AND ta.uqaccountsetid = ? ");
    		//调用存储过程
			proc = conn.prepareCall(sb.toString());
			proc.setString(1, varaccountcode);
			proc.setString(2, uqaccountsetid);
			//执行sql
			rs = proc.executeQuery();
			while (rs.next()) 
			{
				account.setUqaccountid(rs.getString("uqaccountid"));
				list.add(account);
			}
			return list;
		}
        catch (Exception e) 
        {
        	e.printStackTrace();
        	return null;
		}
        finally
        {
        	try 
            {
        		if (rs != null)
		        {
					rs.close();
		        }
		        if (proc != null)
		        {
		        	proc.close();
		        }
            } 
            catch (SQLException e) 
            {
				e.printStackTrace();
			}
        }
	}
	
	public List<String> getAccountIdList(String parentId) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT ta.uqaccountid ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" WHERE ta.uqparentid = ? ");
		List<String> resultList = new ArrayList<String>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{parentId});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("uqaccountid"));
		}
		return resultList;
	}
	
	public void updateIntislastlevel(String uqaccountid, int flag) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_accounts ta SET ");
		sb.append(" ta.intislastlevel = ? ");
		sb.append(" WHERE ta.uqaccountid = ? ");
		this.execute(sb.toString(), new Object[]{flag,uqaccountid});
	}
	
	public List<String> getAccountCountByCode(String uqaccountsetid, String accountCode) throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" WHERE ta.varaccountcode = ? ");
		sb.append(" AND ta.uqaccountsetid = ? ");
		
		List<String> resultList = new ArrayList<String>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{accountCode,uqaccountsetid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList;
	}

	public List<EntityMap> getAccountCountByName(AccountsEntity account) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT ta.* ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" WHERE ta.varaccountname = ? ");
		sb.append(" AND ta.uqparentid = ? ");
//		sb.append(" AND ta.varaccountcode <> ? ");
		sb.append(" AND ta.uqaccountsetid = ? ");
		
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]
			{
			account.getVaraccountname(),
			account.getUqparentid(),
//			account.getVaraccountcode(),
			account.getUqaccountsetid()
			}
		);
		return mapList;
	}

	public void addAccountAndLedgeType(String uqaccountid, String uqledgetypeid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_account_ledgetype (uqaccountid, uqledgetypeid) ");
		sb.append(" VALUES (?, ?) ");
		
		this.execute(sb.toString(), new String[]{uqaccountid,uqledgetypeid});
	}

	public void deleteAccountAndLedgeType(String uqaccountid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" DELETE FROM tgl_account_ledgetype ");
		sb.append(" WHERE uqaccountid = ? ");
		this.execute(sb.toString(), new String[]{uqaccountid});
	}

	public List<Object> getLedgeTypes(String uqaccountid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tal.uqledgetypeid, ");
		sb.append(" tl.varledgetypename ");
		sb.append(" FROM tgl_account_ledgetype tal ");
		sb.append(" INNER JOIN tgl_ledgetype tl ON tal.uqledgetypeid = tl.uqledgetypeid ");
		sb.append(" WHERE tal.uqaccountid = ? ");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new Object[]{uqaccountid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(new Object[]
				{
				mapList.get(i).getString("uqledgetypeid"),
				mapList.get(i).getString("varledgetypename")
				}
			);
		}
		return resultList ;
	}
	
	public void importToAccountModel(EntityMap entity) throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_accounts_model ");
		sb.append(" (accountcode, accountname, parentcode, property, ");
		sb.append(" type, foreigncurrid, measure, flag, intisflow) ");
		sb.append(" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		
		this.execute(sb.toString(), new Object[]
			{
			entity.get("accountcode"),
			entity.get("accountname"),
			entity.get("parentcode"),
			entity.get("property"),
			entity.get("type"),
			entity.get("foreigncurrid"),
			entity.get("measure"),
			entity.get("flag"),
			entity.get("intisflow")
			}
		);
	}

	public void dleteAccountModelAll() throws Exception 
	{
		String sql = " DELETE FROM tgl_accounts_model ";
		this.execute(sql);
	}

	public void importAccountInfo(String uqaccountsetid) throws Exception 
	{
		CallableStatement proc = null;
        try
        {
        	Connection conn = this.getConnection();
    		//调用存储过程
			proc = conn.prepareCall(" { CALL PROC_IMPORT_ACCOUNT_STEP_01(?) } ");
			proc.setString(1, uqaccountsetid);
			//执行sql
			proc.executeQuery();
		}
        catch (Exception e) 
        {
        	e.printStackTrace();
		}
        finally
        {
        	try 
            {
		        if (proc != null)
		        {
		        	proc.close();
		        }
            } 
            catch (SQLException e) 
            {
				e.printStackTrace();
			}
        }
	}

	public void importAccountGroup(String uqaccountsetid) throws Exception 
	{
		CallableStatement proc = null;
        try
        {
        	Connection conn = this.getConnection();
    		//调用存储过程
			proc = conn.prepareCall(" { CALL PROC_IMPORT_ACCOUNTGROUP_STEP_01(?) } ");
			proc.setString(1, uqaccountsetid);
			//执行sql
			proc.executeQuery();
		}
        catch (Exception e) 
        {
        	e.printStackTrace();
		}
        finally
        {
        	try 
            {
		        if (proc != null)
		        {
		        	proc.close();
		        }
            } 
            catch (SQLException e) 
            {
				e.printStackTrace();
			}
        }
	}

	public List<Object[]> exportAccountInfo(String uqaccountsetid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT	ta.varaccountcode, ");
		sb.append(" ta.varaccountname, ");
		sb.append(" CASE WHEN tap.varaccountcode = '0000' ");
		sb.append(" THEN ta.varaccountcode ");
		sb.append(" ELSE tap.varaccountcode ");
		sb.append(" END AS parentcode, ");
		sb.append(" CASE WHEN tap.varaccountcode = '0000' ");
		sb.append(" THEN ta.varaccountname ");
		sb.append(" ELSE tap.varaccountname ");
		sb.append(" END AS parentname, ");
		sb.append(" tc1.categoryname AS intproperty, ");
		sb.append(" tc2.categoryname AS uqtypename, ");
		sb.append(" tc5.categoryname AS intisflow, ");
		sb.append(" tc3.categoryname AS uqforeigncurrname, ");
		sb.append(" tc4.categoryname AS varmeasurename, ");
		sb.append(" cast(group_concat(tl.varledgetypename) as char) AS varledgetypename, ");
		sb.append(" ta.intflag ");
		sb.append(" FROM tgl_accounts ta ");
		sb.append(" INNER JOIN tgl_accounts tap ON ta.uqparentid = tap.uqaccountid ");
		sb.append(" INNER JOIN tob_category tc1 ON tc1.categorycode = ta.intproperty AND tc1.categorytype = '10000001' ");
		sb.append(" LEFT JOIN tob_category tc2 ON tc2.categorycode = ta.uqtypeid AND tc2.categorytype = '10000002' ");
		sb.append(" LEFT JOIN tob_category tc3 ON tc3.categorycode = ta.uqforeigncurrid AND tc3.categorytype = '10000003' ");
		sb.append(" LEFT JOIN tob_category tc4 ON tc4.categorycode = ta.varmeasure AND tc4.categorytype = '10000004' ");
		sb.append(" INNER JOIN tob_category tc5 ON tc5.categorycode = ta.intisflow AND tc5.categorytype = '10000010' ");
		sb.append(" LEFT JOIN tgl_account_ledgetype tal ON tal.uqaccountid = ta.uqaccountid ");
		sb.append(" LEFT JOIN tgl_ledgetype tl ON tl.uqledgetypeid = tal.uqledgetypeid ");
		sb.append(" WHERE ta.uqaccountid <> '00000000-0000-0000-0000-000000000000' ");
		sb.append(" AND ta.uqaccountsetid = ? ");
		sb.append(" GROUP BY ta.uqaccountid ");
		sb.append(" ORDER BY ta.varaccountfullcode ");
		
		List<Object[]> resultList = new ArrayList<Object[]>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new Object[]{uqaccountsetid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(new Object[]{
					mapList.get(i).getString("varaccountcode"),
					mapList.get(i).getString("varaccountname"),
					mapList.get(i).getString("parentcode"),
					mapList.get(i).getString("parentname"),
					mapList.get(i).getString("intproperty"),
					mapList.get(i).getString("uqtypename"),
					mapList.get(i).getString("intisflow"),
					mapList.get(i).getString("uqforeigncurrname"),
					mapList.get(i).getString("varmeasurename"),
					mapList.get(i).getString("varledgetypename"),
					mapList.get(i).getString("intflag")
			});
		}
		return resultList ;
	}

	public void insertIntoAccountGroup(EntityMap entity) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_account_group ");
		sb.append(" (uqaccountsetid, uqgroupid, vargroupname, vargroupcode, vargroupfullcode, ");
		sb.append(" intgrouplevel, uqaccountid, varaccountcode, intaccountlevel, intislastlevel) ");
		sb.append(" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ");
		
		this.execute(sb.toString(), new Object[]
			{
			entity.get("uqaccountsetid"),
			entity.get("uqgroupid"),
			entity.get("vargroupname"),
			entity.get("vargroupcode"),
			entity.get("vargroupfullcode"),
			entity.get("intgrouplevel"),
			entity.get("uqaccountid"),
			entity.get("varaccountcode"),
			entity.get("intaccountlevel"),
			entity.get("intislastlevel")
			}
		);
	}

	public void deleteAccountGroupByAccountId(String uqaccountid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" DELETE FROM tgl_account_group ");
		sb.append(" WHERE uqaccountid = ? ");
		this.execute(sb.toString(), new String[]{uqaccountid});
	}

	public void updateAccountGroupByGroupId(String uqaccountsetid, String vargroupcode, String vargroupname) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_account_group tag ");
		sb.append(" SET tag.vargroupname = ? ");
		sb.append(" WHERE tag.uqaccountsetid = ? ");
		sb.append(" AND tag.vargroupcode = ? ");
		this.execute(sb.toString(), new String[]{vargroupname,uqaccountsetid,vargroupcode});
	}

	public List<String> getModelCountByName(EntityMap entity) throws Exception 
	{
		ArrayList<Object> params = new ArrayList<Object>();
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_accounts_model tam ");
		sb.append(" WHERE tam.accountname = ? ");
		sb.append(" AND tam.parentcode = ? ");
		
		params.add(entity.get("accountname"));
		if (entity.get("accountcode").equals(entity.get("parentcode")))
		{
			params.add(entity.get("accountcode"));
		}
		else 
		{
			params.add(entity.get("parentcode"));
		}
		
		List<String> resultList = new ArrayList<String>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), params);
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList;
	}
	
	public List<LedgerTypeEntity> getLedgerTypeByName(String varledgetypename) throws Exception 
	{
		String sql = " SELECT * FROM tgl_ledgetype tl WHERE tl.varledgetypename = ? ";
		return this.getEntityList(sql, new String[]{varledgetypename}, LedgerTypeEntity.class);
	}

	public List<String> getAccountAndLedgetypeCount(String uqaccountid, String uqledgetypeid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_account_ledgetype tal ");
		sb.append(" WHERE tal.uqaccountid = ?");
		sb.append(" AND tal.uqledgetypeid = ? ");
		
		List<String> resultList = new ArrayList<String>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]{uqaccountid,uqledgetypeid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList;
	}

	public void updateAccountIsledge(String uqaccountid, int flag) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_accounts ta  ");
		sb.append(" SET ta.intisledge = ? ");
		sb.append(" WHERE ta.uqaccountid = ? ");
		
		this.execute(sb.toString(), new Object[]{flag,uqaccountid});
	}

	public void insertIntoAccountAndLedgetype(String uqaccountid, String uqledgetypeid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_account_ledgetype  ");
		sb.append(" (uqaccountid, uqledgetypeid) ");
		sb.append(" VALUES ( ?, ?) ");
		
		this.execute(sb.toString(), new String[]{uqaccountid,uqledgetypeid});
	}

	public void updateAccountFullName(AccountsEntity account) throws Exception 
	{
		String sql = " UPDATE tgl_accounts ta SET ta.varaccountfullname = ? WHERE ta.uqaccountid = ? ";
		this.execute(sql, new Object[]{account.getVaraccountfullname(), account.getUqaccountid()});
	}

	public List<EntityMap> checkIntIsFlow(String uqaccountid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 'aa' ");
		sb.append(" FROM tgl_accounts ta, tgl_voucher_details tvd, tgl_voucher_detail_flow tvdf ");
		sb.append(" WHERE ta.uqaccountid = tvd.uqaccountid ");
		sb.append(" AND tvd.uqvoucherdetailid = tvdf.uqvoucherdetailid ");
		sb.append(" AND tvdf.intstatus IN (1,2) ");
		sb.append(" AND ta.uqaccountid = ? ");
		List<EntityMap> list = this.getMapList(sb.toString(), new Object[]{uqaccountid});
		return list;
	}
	
	//通过科目id去查询是否有  往来初始化
	public List<Object> getAciniCount(String uqaccountid) throws Exception 
	{
		String sql = " SELECT COUNT(0) FROM tgl_ac_ini ac WHERE ac.uqaccountid = ? ";
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sql,new String[]{uqaccountid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		};
		return resultList;
	}
	
	//通过科目id去查询是否有  往来核销数据
	public List<Object> getAcdetailCount(String uqaccountid) throws Exception 
	{
		String sql = " SELECT COUNT(0) FROM tgl_ac_offset_main ac WHERE ac.uqaccountid = ? ";
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sql,new String[]{uqaccountid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		};
		return resultList;
	}
}
