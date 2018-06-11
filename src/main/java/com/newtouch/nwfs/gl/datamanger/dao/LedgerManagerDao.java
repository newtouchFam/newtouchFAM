package com.newtouch.nwfs.gl.datamanger.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerItemEntity;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerTypeEntity;

/**
 * 分户管理dao层实现类
 * @author Administrator
 *
 */
@Repository
public class LedgerManagerDao extends CommonDAO
{
	/**
	 * 获取左侧分户类别树
	 * */
	public List<Object> getLedgerTypeByParentID(String parentId)
			throws Exception 
	{
		ArrayList<Object> params = new ArrayList<Object>();
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tlt.uqledgetypeid, ");
		sb.append(" tlt.varledgetypecode, ");
		sb.append(" tlt.varledgetypename, ");
		sb.append(" tlt.uqparentid, ");
		sb.append(" tlt.intislastlevel, ");
		sb.append(" tlt.intstatus ");
		sb.append(" FROM tgl_ledgetype tlt ");
		if (!"00000000-0000-0000-0000-000000000000".equals(parentId)) 
		{
			sb.append(" WHERE tlt.uqparentid = ? ");
			params.add(parentId);
//			sb.append(" WHERE tlt.uqparentid = :parentId ");
		}
		else 
		{
			sb.append(" WHERE tlt.uqparentid = tlt.uqledgetypeid ");
		}
		sb.append(" ORDER BY tlt.varledgetypename ");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), params);
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(new Object[]
					{
					mapList.get(i).getString("uqledgetypeid"),
					mapList.get(i).getString("varledgetypecode"),
					mapList.get(i).getString("varledgetypename"),
					mapList.get(i).getString("uqparentid"),
					mapList.get(i).getString("intislastlevel"),
					mapList.get(i).getString("intstatus")
					}
			);
		}
		return resultList ;
		/*Query query = this.getEntityManager().createNativeQuery(sb.toString());
		if (!"00000000-0000-0000-0000-000000000000".equals(parentId)) 
		{
			query.setParameter("parentId", parentId);
		}
		return query.getResultList();*/
	}

	/**
	 * 左侧分户类别树点击时 根据分户类别ID和分户项目‘父级科目ID’获取分户项目信息
	 * */
	public List<Object> getledgerItemByTypeAndParentID(String uqledgetypeid,
			String parentId) throws Exception 
	{
		ArrayList<Object> params = new ArrayList<Object>();
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tl.uqledgeid, ");
		sb.append(" tl.uqledgetypeid, ");
		sb.append(" tl.varledgecode,  ");
		sb.append(" tl.varledgename, ");
		sb.append(" tl.varledgefullcode, ");
		sb.append(" tl.varledgefullname, ");
		sb.append(" tl.uqparentid, ");
		sb.append(" tlp.varledgecode AS parentcode, ");
		sb.append(" tlp.varledgename AS　parentname, ");
		sb.append(" tl.intlevel, ");
		sb.append(" tl.intislastlevel, ");
		sb.append(" tl.intstatus, ");
		sb.append(" tlc.uqcompanyid ");
		sb.append(" FROM tgl_ledger tl ");
		sb.append(" INNER JOIN tgl_ledger tlp ON tlp.uqledgeid = tl.uqparentid ");
		sb.append(" LEFT JOIN tgl_ledger_company tlc ON tlc.uqledgeid = tl.uqledgeid ");
		sb.append(" WHERE tl.uqledgetypeid = ? ");
		params.add(uqledgetypeid);
//		sb.append(" WHERE tl.uqledgetypeid = :uqledgetypeid ");
		if (!"00000000-0000-0000-0000-000000000000".equals(parentId)) 
		{
			sb.append(" AND tl.uqparentid = ? ");
			sb.append(" AND tl.uqledgeid <> ? ");
			params.add(parentId);
			params.add(parentId);
//			sb.append(" AND tl.uqparentid = :parentId ");
//			sb.append(" AND tl.uqledgeid <> :parentId2 ");
		}
		else 
		{
			sb.append(" AND tl.uqparentid = tl.uqledgeid ");
		}
		sb.append(" ORDER BY tl.varledgecode ");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), params);
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(new Object[]
					{
					mapList.get(i).getString("uqledgeid"),
					mapList.get(i).getString("uqledgetypeid"),
					mapList.get(i).getString("varledgecode"),
					mapList.get(i).getString("varledgename"),
					mapList.get(i).getString("varledgefullcode"),
					mapList.get(i).getString("varledgefullname"),
					mapList.get(i).getString("uqparentid"),
					mapList.get(i).getString("parentcode"),
					mapList.get(i).getString("parentname"),
					mapList.get(i).getString("intlevel"),
					mapList.get(i).getString("intislastlevel"),
					mapList.get(i).getString("intstatus"),
					mapList.get(i).getString("uqcompanyid")
					}
			);
		}
		return resultList ;
	}

	/**
	 * 通过分户项目id获得对应的项目的信息
	 * */
	public List<LedgerItemEntity> getLedgerItemByID(String uqledgeid) throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	tl.* ");
		sb.append(" FROM tgl_ledger tl ");
		sb.append(" WHERE tl.uqledgeid = ? ");
		
		return this.getEntityList(sb.toString(), 
				new String[]{uqledgeid}, LedgerItemEntity.class);
	}

	/**
	 * 用于修改父级分户项目的末级状态
	 * */
	public void updateIntisLastLevel(String uqledgeid, int flag)
			throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_ledger tl SET ");
		sb.append(" tl.intislastlevel = ? ");
		sb.append(" WHERE tl.uqledgeid = ? ");
		
		this.execute(sb.toString(), new Object[]{flag,uqledgeid});
	}

	/**
	 * 根据上级项目id获取下级项目id集合，用于判断当前级别的项目下是否还有子项目
	 * */
	public List<Object> getLedgerItemList(LedgerItemEntity itemEntity) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" select t.UQLEDGEID from tgl_ledger t ");
		sb.append(" where t.UQPARENTID = (select tl.UQPARENTID from tgl_ledger tl where ");
		sb.append(" tl.UQLEDGEID = ?) and  t.UQLEDGEID <> ? ");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(),new String[]
			{
			itemEntity.getUqledgeid(),itemEntity.getUqledgeid()
			}
		);
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("UQLEDGEID"));
		};
		return resultList;
	}

	/**
	 * 根据分户明细id查询是否有与此明细关联的凭证，用于判断当前项目是否被凭证所使用
	 * */
	public List<Object> getVoucherByLedger(String uqledgeid) throws Exception 
	{
		String sql = " SELECT COUNT(0) FROM tgl_voucher_detail_ledger tvdl " +
		" INNER JOIN tgl_voucher_details tvd " +
		" on tvd.UQVOUCHERDETAILID = tvdl.UQVOUCHERDETAILID " +
		" INNER JOIN tgl_voucher_mains tvm " +
		" ON tvm.UQVOUCHERID = tvd.UQVOUCHERID " +
		" WHERE tvdl.uqledgerid = ? AND tvm.INTDELETEFLAG = 0 ";
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sql,new String[]{uqledgeid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		};
		return resultList;
	}

	/**
	 * 用于判断同一个上级下分户项目名称是否重复
	 * */
	public List<Object> getLedgerItemName(LedgerItemEntity ledgerItem) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_ledger tl ");
		sb.append(" WHERE tl.varledgename = ? ");
		sb.append(" AND (( tl.uqparentid = ? ");
		sb.append(" AND tl.varledgecode <> ?) ");
		sb.append(" OR tl.uqparentid = tl.uqledgeid) ");
		sb.append(" AND tl.uqledgetypeid = ? ");
		
		List<Object> resultList = new ArrayList<Object>();
		String s = "";
		if(ledgerItem.getUqparentid()!=null)
		{
			s = ledgerItem.getUqparentid();
		}
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]
			{
			ledgerItem.getVarledgename(),
			s,
			ledgerItem.getVarledgecode(),
			ledgerItem.getUqledgetypeid()
			}
		);
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList ;
		
	}
	
	/**
	 * 根据‘分户项目名’和‘上级编码’查询分户项目，用于导入数据时判断同一上级下是否有同名的分户项目
	 * */
	public List<Object> getLedgerItemEntityByName(
			String ledgeritemname, String parentcode) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_ledger tl ");
		sb.append(" WHERE tl.varledgename = ? ");
		sb.append(" AND tl.uqparentid = (select uqledgeid from tgl_ledger ");
		sb.append(" WHERE  varledgecode = ?)");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]
			{ledgeritemname,parentcode});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList ;
	}

	/**
	 * 根据‘分户编号’和‘分户类别id’查询分户记录，用于判断同一类别下分户项目编码是否重复
	 * */
	public List<LedgerItemEntity> getLedgerItemByCode(LedgerItemEntity ledgerItem)
			throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tl.* ");
		sb.append(" FROM tgl_ledger tl ");
		sb.append(" LEFT JOIN tgl_ledgetype tlt ");
		sb.append(" ON tlt.uqledgetypeid = tl.uqledgetypeid ");
		sb.append(" WHERE tl.varledgecode = ? ");
		sb.append(" AND tlt.uqledgetypeid = ? ");
		
		return this.getEntityList(sb.toString(), new Object[]
			{ledgerItem.getVarledgecode(),ledgerItem.getUqledgetypeid()}, 
			LedgerItemEntity.class);
	}
	
	/**
	 * 根据‘分户明细编号’和‘分户类别名’查询分户记录，用于在导入数据时判断的分户项目是否重复
	 * */
	public List<LedgerItemEntity> getLedgerItemEntityByCode(
			String ledgertypename, String varledgecode) throws Exception {
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tl.* ");
		sb.append(" FROM tgl_ledger tl ");
		sb.append(" LEFT JOIN tgl_ledgetype tlt ");
		sb.append(" ON tlt.uqledgetypeid = tl.uqledgetypeid ");
		sb.append(" WHERE tl.varledgecode = ? ");
		sb.append(" AND tlt.uqledgetypeid = (select uqledgetypeid from tgl_ledgetype ");
		sb.append(" where VARLEDGETYPENAME= ?) ");
		
		return this.getEntityList(sb.toString(), new String[]{varledgecode,ledgertypename}, 
				LedgerItemEntity.class);
	}

	/**
	 * 根据‘分户类别名’查询分户类别，用于新增和修改时判断分户类别名是否重复，参数为LedgerTypeEntity实体类
	 * */
	public List<?> getLedgerTypeByName(LedgerTypeEntity ledgerType)
			throws Exception 
	{
		return getLedgerTypeByName(ledgerType.getVarledgetypename());
		
		/*
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_ledgetype tlt ");
		sb.append(" WHERE tlt.varledgetypename = ? ");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]
			{ledgerType.getVarledgetypename()});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList ;
		*/
	}
	
	public List<Object> getLedgerTypeByName(String ledgerTypeName) throws Exception {
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_ledgetype tlt ");
		sb.append(" WHERE tlt.varledgetypename = ? ");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]
			{ledgerTypeName});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList ;
	}
	
	/**
	 * 根据‘分户类别名’查询分户类别，用于新增和修改时判断分户类别名是否重复，参数为分户类别名
	 * */
	public List<Object> getLedgerTypeEntityByName(String varledgetypename) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_ledgetype tlt ");
		sb.append(" WHERE tlt.varledgetypename = ? ");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]
			{varledgetypename});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList ;
		
	}

	/**
	 * 新增分户类别
	 * */
	public void addLedgerType(LedgerTypeEntity ledgerType) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_ledgetype ");
		sb.append(" (uqledgetypeid, varledgetypecode, varledgetypename, ");
		sb.append(" uqparentid, intislastlevel, intstatus)");
		sb.append(" VALUES (?, ?, ?, ?, ?, ?)");
		
		this.execute(sb.toString(), new Object[]
			{
			ledgerType.getUqledgetypeid(),
			ledgerType.getVarledgetypecode(),
			ledgerType.getVarledgetypename(),
			ledgerType.getUqparentid(),
			ledgerType.getIntislastlevel(),
			ledgerType.getIntstatus()
			}
		);
		
	}

	/**
	 * 修改分户类别
	 * */
	public void editLedgerType(LedgerTypeEntity ledgerType) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_ledgetype tlt SET ");
		sb.append(" tlt.varledgetypename = ?");
		sb.append(" WHERE tlt.uqledgetypeid = ?");
		
		this.execute(sb.toString(), new String[]
			{
			ledgerType.getVarledgetypename(),
			ledgerType.getUqledgetypeid()
			}
		);
		
	}

	/**
	 * 删除分户类别
	 * */
	public void deleteLedgerType(String uqledgetypeid) throws Exception 
	{
		String sql = " DELETE FROM tgl_ledgetype WHERE uqledgetypeid = ? ";
		this.execute(sql, new String[]{uqledgetypeid});
	}

	/**
	 * 新增分户明细
	 * */
	public void addLedgerItem(LedgerItemEntity ledgerItem,String companyId) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_ledger ");
		sb.append(" (uqledgeid, uqledgetypeid, varledgecode, ");
		sb.append(" varledgename, varledgefullcode, ");
		sb.append(" varledgefullname, uqparentid, intlevel, ");
		sb.append(" intislastlevel, intstatus) ");
		sb.append(" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		
		this.execute(sb.toString(), new String[]
			{
			ledgerItem.getUqledgeid(),
			ledgerItem.getUqledgetypeid(),
			ledgerItem.getVarledgecode(),
			ledgerItem.getVarledgename(),
			ledgerItem.getVarledgefullcode(),
			ledgerItem.getVarledgefullname(),
			ledgerItem.getUqparentid(),
			ledgerItem.getIntlevel(),
			ledgerItem.getIntislastlevel(),
			ledgerItem.getIntstatus()
			}
		);
		
		StringBuilder sb2 = new StringBuilder();
		sb2.append(" INSERT INTO tgl_ledger_company ");
		sb2.append(" (uqledgeid, uqcompanyid) ");
		sb2.append(" VALUES ( ?, ?) ");
		
		this.execute(sb2.toString(), new String[]{ledgerItem.getUqledgeid(),companyId});
		
		//由于单位只引到分户明细的末级，所以每次执行插入操作时，除了插入当前新增的，还要根据intislastlevel删除掉末级状态不是1的
		StringBuilder sb3 = new StringBuilder();
		sb3.append(" DELETE FROM tgl_ledger_company ");
		sb3.append(" WHERE uqledgeid IN ");
		sb3.append(" (SELECT uqledgeid FROM tgl_ledger WHERE intislastlevel = 0) ");
		
		this.execute(sb3.toString());
	}

	/**
	 * 修改分户明细
	 * */
	public void editLedgerItem(LedgerItemEntity ledgerItem) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_ledger SET ");
		sb.append(" varledgename = ? ");
		sb.append(" WHERE uqledgeid = ? ");
		
		this.execute(sb.toString(), new String[]
				{ledgerItem.getVarledgename(),ledgerItem.getUqledgeid()});
		
	}

	/**
	 * 删除分户明细
	 * */
	public void deleteLedgerItem(String uqledgeid) throws Exception 
	{
		String sql = " DELETE FROM tgl_ledger WHERE uqledgeid = ? ";
		this.execute(sql, new String[]{uqledgeid});
		
		String sql2 = " DELETE FROM tgl_ledger_company WHERE uqledgeid = ? ";
		this.execute(sql2, new String[]{uqledgeid});
	}

	/**
	 * 根据分户类别id查询对应类别下面的分户明细,用于判断分户类别下是否有明细
	 * 
	 * */
	public List<Object> getItemByTypeID(String uqledgetypeid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_ledger tl ");
		sb.append(" WHERE tl.uqledgetypeid = ? ");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]
			{uqledgetypeid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList ;
		
	}

	/**
	 * 根据分户类别ID拿到对应的分户类别
	 * */
	public List<LedgerTypeEntity> getLedgerTypeByID(String uqledgetypeid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	tlt.* ");
		sb.append(" FROM tgl_ledgetype tlt ");
		sb.append(" WHERE tlt.uqledgetypeid = ? ");
		return this.getEntityList(sb.toString(), new String[]{uqledgetypeid}, 
				LedgerTypeEntity.class);
	}

	/**
	 * 通过分户类别id查询科目，用于判断分户类别是否被科目所引用
	 * */
	public List<Object> getAccountByTypeID(String uqledgetypeid) throws Exception 
	{
		String sql = " SELECT COUNT(0) FROM tgl_account_ledgetype tal WHERE tal.uqledgetypeid = ? ";
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sql, new String[]
			{uqledgetypeid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList ;
		
	}

	/**
	 * 导出数据
	 * */
	public List<Object[]> exportLedgerItem(String uqcompanyid) throws Exception {
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tlt.varledgetypename, tll.varledgename as parentname, tl.varledgecode, tl.varledgename ");
		sb.append(" FROM ( ");
		sb.append(" SELECT DISTINCT(tlg.vargroupcode) ");
		sb.append(" FROM tgl_ledger_group tlg");
		sb.append(" INNER JOIN tgl_ledger_company lc on lc.uqledgeid = tlg.uqledgeid ");
		sb.append(" WHERE lc.uqcompanyid = ?) tt, ");
		sb.append(" tgl_ledger tl ");
		sb.append(" LEFT JOIN tgl_ledgetype tlt ON tlt.uqledgetypeid = tl.uqledgetypeid ");
		sb.append(" LEFT JOIN tgl_ledger tll ON tll.uqledgeid = tl.uqparentid ");
		sb.append(" WHERE tl.varledgecode = tt.vargroupcode ");
		sb.append(" ORDER BY tlt.varledgetypename,parentname ");
		
		List<Object[]> resultList = new ArrayList<Object[]>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new Object[]{uqcompanyid});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(new Object[]{
					mapList.get(i).getString("varledgetypename"),
					mapList.get(i).getString("parentname"),
					mapList.get(i).getString("varledgecode"),
					mapList.get(i).getString("varledgename")
			});
		}
		return resultList ;
	}

	/**
	 * 将数据插入模板表
	 * */
	public void insertModelTable(EntityMap entity) throws Exception {
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_ledger_model (  ");
		sb.append(" ledgertypename, ledgeritemcode, ledgeritemname, parentcode) ");
		sb.append(" VALUES ( ?, ?, ?, ?) ");
		
		this.execute(sb.toString(), new String[]
				{
			entity.getString("ledgertypename"),
			entity.getString("ledgeritemcode"),
			entity.getString("ledgeritemname"),
			entity.getString("parentcode")
				}
		);
		
	}
	
	/**
	 * 清除模板表中所有的数据
	 * */
	public void deleteModelTable() throws Exception {
		String sql = " DELETE FROM tgl_ledger_model ";
		this.execute(sql);
	}

	/**
	 * 该方法用来调用存储过程，将模板表中的数据插入tgl_ledger和tgl_ledger_company表
	 * */
	public void callProcedure(String uqcompanyid) throws Exception 
	{
		CallableStatement proc = null;
        try
        {
        	Connection conn =  this.getConnection();
    		//调用存储过程
			proc = conn.prepareCall(" { CALL PROC_IMPORT_LEDGER_STEP_01(?) } ");
			proc.setString(1, uqcompanyid);
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
	
	/**
	 * 该方法用来调用存储过程，将模板表中的数据维护到组表中
	 * */
	public void callProcedureGroup() throws Exception
	{
		CallableStatement proc = null;
        try
        {
        	Connection conn =  this.getConnection();
    		//调用存储过程
			proc = conn.prepareCall(" { CALL PROC_IMPORT_LEDGERGROUP_STEP_01() } ");
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
	
	/**
	 * 该方法用来在明细修改时，修改组表中的信息
	 * */
	public void updateGroup(LedgerItemEntity ledgerItem) throws Exception {
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_ledger_group tlg ");
		sb.append(" SET vargroupname = ? ");
		sb.append(" WHERE tlg.vargroupcode = ? ");
		
		this.execute(sb.toString(), new String[]
				{ledgerItem.getVarledgename(),ledgerItem.getVarledgecode()});
	}

	/**
	 * 用于在明细组表中插入末级数据
	 * */
	public void insertLastLevelToGroupTable(EntityMap entity)
			throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_ledger_group ");
		sb.append(" (uqgroupid, vargroupname, vargroupcode, vargroupfullcode, intgrouplevel, ");
		sb.append(" uqledgeid,varledgecode, intlevel, intislastlevel)");
		sb.append(" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		
		this.execute(sb.toString(), new Object[]
			{
			entity.get("uqgroupid"),
			entity.get("vargroupname"),
			entity.get("vargroupcode"),
			entity.get("vargroupfullcode"),
			entity.get("intgrouplevel"),
			entity.get("uqledgeid"),
			entity.get("varledgecode"),
			entity.get("intlevel"),
			entity.get("intislastlevel")
			}
		);
		
	}

	/**
	 * 用于在新增明细时，删除明细组表中以父级为末级的记录
	 * */
	public void deleteLedgerGroupByLedgerId(String uqledgeid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" DELETE FROM tgl_ledger_group ");
		sb.append(" WHERE uqledgeid = ? ");
		this.execute(sb.toString(), new String[]{uqledgeid});
	}
	
	/**
	 * 用于在删除明细时，用于判断删除的是不是末级，需求要求删除的只能是末级
	 * */
	public List<Object> isLastLevel(LedgerItemEntity ledgerItem) throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" select count(1) from tgl_ledger tl");
		sb.append(" WHERE tl.uqledgeid = ? and tl.intislastlevel = 1");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new String[]
			{ledgerItem.getUqledgeid()});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(1)"));
		}
		return resultList ;
	}

	/**
	 * 用于校验Excel表格中的数据，同一个类别下面编码是否重复
	 */
	public List<Object> checkTypeCode(EntityMap entity) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT count(0) ");
		sb.append(" FROM tgl_ledger_model tlm ");
		sb.append(" WHERE tlm.ledgertypename = ? ");
		sb.append(" AND tlm.ledgeritemcode = ? ");
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new Object[]
			{entity.get("ledgertypename"),entity.get("ledgeritemcode")});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList ;
		
	}
	
	/**
	 * 用于校验Excel表格中的数据，同一个上级下分户明细名称是否重复，注意：如果是一级项目，上级项目编码=自己的编码
	 */
	public List<Object> checkItemName(EntityMap entity) throws Exception 
	{	
		ArrayList<Object> params = new ArrayList<Object>();
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT COUNT(0) ");
		sb.append(" FROM tgl_ledger_model tlm ");
		sb.append(" WHERE tlm.ledgeritemname = ? ");
		sb.append(" AND tlm.ledgertypename = ? ");
		params.add(entity.get("ledgeritemname"));
		params.add(entity.get("ledgertypename"));
//		sb.append(" WHERE tlm.ledgeritemname = :ledgeritemname ");
//		sb.append(" AND tlm.ledgertypename = :ledgertypename ");
		if(!entity.get("parentcode").equals(entity.get("ledgeritemcode")))
		{
			sb.append(" AND tlm.parentcode = ? ");
			params.add(entity.get("parentcode"));
//			sb.append(" AND tlm.parentcode = :parentcode ");
		}
		
		List<Object> resultList = new ArrayList<Object>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), params);
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(mapList.get(i).getString("COUNT(0)"));
		}
		return resultList ;
	}

	/**
	 * 用于在删除明细时，如果上级已经是末级，就要把上级维护到tgl_ledger_company表中
	 * @throws Exception
	 */
	public void addLastLevelToCompany(String uqledgeid, String companyid)
			throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_ledger_company ");
		sb.append(" (uqledgeid,uqcompanyid)");
		sb.append(" VALUES ( ?, ?) ");
		
		this.execute(sb.toString(), new String[]{uqledgeid,companyid});
		
	}
}
