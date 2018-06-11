package com.newtouch.nwfs.gl.datamanger.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.entity.FlowItemsEntity;
import com.newtouch.nwfs.gl.datamanger.entity.FlowItemsModelEntiy;
import com.newtouch.nwfs.gl.datamanger.entity.FlowTypeEntity;
import com.newtouch.nwfs.gl.datamanger.entity.FlowTypeModelEntiy;
/**
 * 现金流量管理dao
 * @author feng
 *
 */
@Repository
public class CashFlowManagerDAO  extends CommonDAO
{
	/**
	 * 获得现金流量分类树
	 * @param parentId	节点的ID
	 * @return	分类树的数据集合
	 * @throws Exception
	 */
	public List<Object> getTypeTree(String uqparentid) throws Exception 
	{
		ArrayList<Object> params = new ArrayList<Object>();
		List<EntityMap> List = null;
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tft.uqflowtypeid , ");
		sb.append(" tft.varcode , ");
		sb.append(" tft.varname , ");
		sb.append(" tft.intislastlevel , ");
		sb.append(" tft.varfullcode , ");
		sb.append(" tft.varfullname , ");
		sb.append(" tft.uqparentid , ");
		sb.append(" CONCAT('[',tftp.varcode,']',tftp.varname) AS parentname , ");
		sb.append(" tft.intlevel  ");
		sb.append(" FROM tgl_flowtype tft  ");
		sb.append(" INNER JOIN tgl_flowtype tftp ON tft.uqparentid = tftp.uqflowtypeid  ");
		//如果是根节点的 就是ID=parentID的
		if("00000000-0000-0000-0000-000000000000".equals(uqparentid))
		{
			sb.append(" WHERE tft.uqparentid = tft.uqflowtypeid ");
		}
		else
		{
			sb.append(" WHERE tft.uqparentid = ? ");
			params.add(uqparentid);
			sb.append(" AND tft.uqparentid <> tft.uqflowtypeid ");
		}
		sb.append(" ORDER BY tft.varfullcode ");
		List = this.getMapList(sb.toString(), params);
		
		List<Object> resultList = new ArrayList<Object>();
		
		for(int i = 0 ;i<List.size();i++ )
		{
			resultList.add(new Object[]
					{
					List.get(i).getString("uqflowtypeid"),
					List.get(i).getString("varcode"),
					List.get(i).getString("varname"),
					List.get(i).getString("intislastlevel"),
					List.get(i).getString("varfullcode"),
					List.get(i).getString("varfullname"),
					List.get(i).getString("uqparentid"),
					List.get(i).getString("parentname"),
					List.get(i).getString("intlevel")
					}
			);
		}
		return resultList;
	}

	/**
	 * 根据现金流量类别ID，获得项目数据
	 * @param uqflowtypeid	现金分类ID
	 * @param start	 分页起始
	 * @param limit	 每页数值
	 * @return	项目列表的数据集合
	 * @throws Exception
	 */
	public PageData<EntityMap> getItemsGrid(String uqflowtypeid, int start, int limit) throws Exception 
	{
		ArrayList<Object> params = new ArrayList<Object>();
		StringBuilder sb = new StringBuilder();
		
		sb.append(" SELECT DISTINCT tfi.uqflowitemid , ");
		sb.append(" tfi.varcode AS varitemcode, ");
		sb.append(" tfi.varname AS varitemname,  ");
		sb.append(" tfta.varcode AS vartypecode , ");
		sb.append(" tfta.varname AS vartypename , ");
		sb.append(" tfi.uqflowtypeid , ");
		sb.append(" tfi.intstatus  ");
		sb.append(" FROM tgl_flowitems tfi  ");
		sb.append(" INNER JOIN  ");
		sb.append(" (  ");
		sb.append(" SELECT tftp.uqflowtypeid , ");
		sb.append(" tftp.varcode , ");
		sb.append(" tftp.varname  ");
		sb.append(" FROM tgl_flowtype tftp ");
		sb.append(" INNER JOIN  ");
		sb.append(" (  ");
		sb.append(" SELECT  ");
		sb.append(" tft.uqflowtypeid,   ");
		sb.append(" tft.varfullcode   ");
		sb.append(" FROM tgl_flowtype tft   ");
		if(!"root".equals(uqflowtypeid))
		{
			sb.append(" WHERE tft.uqflowtypeid = ? ");
			params.add(uqflowtypeid);
		}
		else
		{
			sb.append(" WHERE 1=1 ");
		}
		sb.append(" )tftt ON tftp.varfullcode  like CONCAT(tftt.varfullcode,'%') ");
		sb.append(" ) tfta ON tfi.uqflowtypeid = tfta.uqflowtypeid  ");
		sb.append(" ORDER BY tfi.varcode ");
		
		return this.getMapPage(sb.toString(), params, start, limit);
	}

	/**
	 * 新增现金流量类别
	 * @param flowtype	现金分类实体
	 * @throws Exception
	 */
	public void addType(FlowTypeEntity flowtype) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_flowtype ");
		sb.append(" (uqflowtypeid, varcode, varname, ");
		sb.append(" uqparentid, varfullcode, ");
		sb.append(" varfullname, intlevel, intislastlevel ) ");
		sb.append(" VALUES (?,?,?,?,?,?,?,?) ");
		
		this.execute(sb.toString(), new String[]
			{
			flowtype.getUqflowtypeid(),
			flowtype.getVarcode(),
			flowtype.getVarname(),
			flowtype.getUqparentid(),
			flowtype.getVarfullcode(),
			flowtype.getVarfullname(),
			flowtype.getIntlevel(),
			flowtype.getIntislastlevel()
			}
		);
	}

	/**
	 * 修改现金流量类别
	 * @param flowtype	现金分类实体
	 * @throws Exception
	 */
	public void editType(FlowTypeEntity flowtype) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_flowtype tft SET ");
		sb.append(" tft.varcode = ?, ");
		sb.append(" tft.varname = ?, ");
		sb.append(" tft.varfullcode = ?, ");
		sb.append(" tft.varfullname = ? ");
		sb.append(" WHERE tft.uqflowtypeid = ? ");
		
		this.execute(sb.toString(), new String[]
			{
			flowtype.getVarcode(),
			flowtype.getVarname(),
			flowtype.getVarfullcode(),
			flowtype.getVarfullname(),
			flowtype.getUqflowtypeid()
			}
		);
	}

	/**
	 * 删除现金流量类别
	 * @param uqflowtypeid 现金流量分类ID
	 * @throws Exception
	 */
	public void removeType(String uqflowtypeid) throws Exception 
	{
		String sql = " DELETE FROM tgl_flowtype WHERE uqflowtypeid = ? ";
		this.execute(sql, new String[]{uqflowtypeid});
	}

	/**
	 * 新增现金流量项目
	 * @param flowitems 现金流量项目实体
	 * @throws Exception
	 */
	public void addItems(FlowItemsEntity flowitems) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_flowitems ");
		sb.append(" (uqflowitemid, varcode, varname, ");
		sb.append(" uqflowtypeid, intstatus) ");
		sb.append(" VALUES (?,?,?,?,?) ");
		
		this.execute(sb.toString(), new String[]
			{
			flowitems.getUqflowitemid(),
			flowitems.getVarcode(),
			flowitems.getVarname(),
			flowitems.getUqflowtypeid(),
			flowitems.getIntstatus()
			}
		);
		
	}

	/**
	 * 修改现金流量项目
	 * @param flowitems	 现金流量项目实体
	 * @throws Exception
	 */
	public void editItems(FlowItemsEntity flowitems) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_flowitems tfi SET ");
		sb.append(" tfi.varcode = ?, ");
		sb.append(" tfi.varname = ? ");
		sb.append(" WHERE tfi.uqflowitemid = ? ");
		
		this.execute(sb.toString(), new String[]
			{
			flowitems.getVarcode(),
			flowitems.getVarname(),
			flowitems.getUqflowitemid()
			}
		);
	}

	/**
	 * 删除现金流量项目
	 * @param uqflowitemid	现金流量项目ID
	 * @throws Exception
	 */
	public void removeItems(String uqflowitemid) throws Exception 
	{
		String sql = " DELETE FROM tgl_flowitems WHERE uqflowitemid = ? ";
		this.execute(sql, new String[]{uqflowitemid});
	}

	/**
	 * 启用或停用现金流量项目
	 * @param uqflowitemid	现金流量项目ID
	 * @param intstatus		需要更新的状态（0，新增；1，启用；2，停用）
	 * @throws Exception
	 */
	public void startItems(String uqflowitemid, String intstatus) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_flowitems tfi SET ");
		sb.append(" tfi.intstatus = ? ");
		sb.append(" WHERE tfi.uqflowitemid = ? ");
		this.execute(sb.toString(), new String[]{intstatus,uqflowitemid}
		);
	}

	/**
	 * 判断类别下是否存在项目
	 * @param uqflowtypeid	类别ID
	 * @return	true存在 false不存在
	 * @throws Exception
	 */
	public boolean exitItemsByType(String uqflowtypeid) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowitems tfi  ");
		strSQL.append(" INNER JOIN (  ");
		strSQL.append(" SELECT tftp.uqflowtypeid, ");
		strSQL.append(" tftp.varcode, ");
		strSQL.append(" tftp.varname ");
		strSQL.append(" FROM tgl_flowtype tftp ");
		strSQL.append(" INNER JOIN ");
		strSQL.append(" ( ");
		strSQL.append(" SELECT ");
		strSQL.append(" tft.uqflowtypeid, ");
		strSQL.append(" tft.varfullcode ");
		strSQL.append(" FROM tgl_flowtype tft ");
		strSQL.append(" WHERE tft.uqflowtypeid = ? ");
		strSQL.append(" )");
		strSQL.append(" tftt ON tftp.varfullcode  like CONCAT(tftt.varfullcode,'%')");
		strSQL.append(" ) tfta ON tfi.uqflowtypeid = tfta.uqflowtypeid ");
		int result = this.querySingleInteger(strSQL.toString(), new String[]{uqflowtypeid});
		
		if( result > 0 )
		{
			return true;//存在
		}
		else
		{
			return false;
		}
	}

	/**
	 * 判断同一个上级类别下，类别名称是否唯一
	 * @param uqparentid	上级类别ID
	 * @param varname		类别名称
	 * @return	true唯一 false不唯一
	 * @throws Exception
	 */
	public boolean exitTypeName(String uqparentid, String varname, String uqflowtypeid) throws Exception 
	{
		//判断下 
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowtype tft  ");
		strSQL.append(" INNER JOIN tgl_flowtype tftp ON tft.uqparentid = tftp.uqflowtypeid  ");
		strSQL.append(" WHERE tft.uqparentid = ? ");
		strSQL.append(" AND tft.uqflowtypeid <> ? ");
		strSQL.append(" AND  tft.varname = ? ");
		int result = this.querySingleInteger(strSQL.toString(), new String[]{uqparentid,uqflowtypeid,varname});
		
		if( result > 0 )
		{
			return false;//存在
		}
		else
		{
			return true; //b不存在 唯一
		}
	}
	

	/**
	 * 判断 类别的code是否唯一
	 * @param uqparentid	上级类别ID
	 * @param varcode	类别编号
	 * @param uqflowtypeid
	 * @return	true唯一 false不唯一
	 * @throws Exception
	 */
	public boolean exitTypeCode( String varcode ,String uqflowtypeid) throws Exception
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowtype tft  ");
		strSQL.append(" WHERE tft.uqflowtypeid <> ? ");
		strSQL.append(" AND  tft.varcode = ? ");
		int result = this.querySingleInteger(strSQL.toString(), new String[]{uqflowtypeid,varcode});
		
		if( result > 0 )
		{
			return false;//存在
		}
		else
		{
			return true; //b不存在 唯一
		}
	}

	/**
	 * 判断一个类别下，项目名称是否唯一
	 * @param uqflowtypeid	类别ID
	 * @param varname	项目名称
	 * @return	true唯一 false不唯一
	 * @throws Exception
	 */
	public boolean exitItemsName(String uqflowtypeid, String varname,String uqflowitemid) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowitems tfi  ");
		strSQL.append(" WHERE tfi.uqflowtypeid = ?  ");
		strSQL.append(" AND tfi.varname = ? ");
		strSQL.append(" AND tfi.uqflowitemid <> ? ");
		int result = this.querySingleInteger(strSQL.toString(), new String[]{uqflowtypeid,varname,uqflowitemid});
		
		if( result > 0 )
		{
			return false;//存在
		}
		else
		{
			return true;
		}
	}

	/**
	 * 判断项目的编号是否唯一
	 * @param varcode	项目编号
	 * @return	true唯一 false不唯一
	 * @throws Exception
	 */
	public boolean exitTtemsCode(String varcode ,String uqflowitemid) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowitems tfi  ");
		strSQL.append(" WHERE tfi.varcode = ?  ");
		strSQL.append(" AND tfi.uqflowitemid <> ?  ");
		int result = this.querySingleInteger(strSQL.toString(), new String[]{varcode,uqflowitemid});
		
		if( result > 0 )
		{
			return false;//存在
		}
		else
		{
			return true;
		}
	}

	/**
	 * 判断项目下是否被凭证使用
	 * @param uqflowitemid	项目ID
	 * @return	true被使用 false没有被使用
	 * @throws Exception
	 */
	public boolean exitVoucherUsing(String uqflowitemid) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowitems tfi  ");
		strSQL.append(" INNER JOIN tgl_voucher_detail_flow tvdf ON tfi.uqflowitemid = tvdf.uqflowitemid  ");
		strSQL.append(" INNER JOIN tgl_voucher_details tvd ON tvdf.uqvoucherdetailid = tvd.UQVOUCHERDETAILID  ");
		strSQL.append(" INNER JOIN tgl_voucher_mains tvm ON tvd.UQVOUCHERID = tvm.UQVOUCHERID ");
		strSQL.append(" WHERE tfi.uqflowitemid = ? ");
		int result = this.querySingleInteger(strSQL.toString(), new String[]{uqflowitemid});
		
		if( result > 0 )
		{
			return true;//存在
		}
		else
		{
			return false;
		}
	}

	/**
	 * 根据类别ID查询出类别信息
	 * @param uqflowtypeid 类别ID
	 * @return
	 * @throws Exception
	 */
	public List<FlowTypeEntity> getFlowTypeById(String uqflowtypeid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	tft.* ");
		sb.append(" FROM tgl_flowtype tft ");
		sb.append(" WHERE tft.uqflowtypeid = ? ");
		return this.getEntityList(sb.toString(), new String[]{uqflowtypeid}, FlowTypeEntity.class);
	}

	/**
	 * 查询类别下的子类别是否小于等于1
	 * @param uqflowtypeid
	 * @return true 是的  false 不是
	 * @throws Exception
	 */
	public boolean exitTypes(String uqflowtypeid) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowtype tft  ");
		strSQL.append(" WHERE tft.uqparentid = ? ");
		strSQL.append(" AND tft.uqflowtypeid <> tft.uqparentid ");
		int result = this.querySingleInteger(strSQL.toString(), new String[]{uqflowtypeid});
		
		if( result > 1 )
		{
			return false;//存在
		}
		else
		{
			return true;
		}
	}

	/**
	 * 更新现金流量分类是否末级字段
	 * @param uqflowtypeid 类别ID
	 * @param intislastlevel 是否末级的状态
	 * @return
	 * @throws Exception
	 */
	public void updateTypeIntislastlevel(String uqflowtypeid ,String intislastlevel) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_flowtype tft SET ");
		sb.append(" tft.intislastlevel = ? ");
		sb.append(" WHERE tft.uqflowtypeid = ? ");
		this.execute(sb.toString(), new String[]{intislastlevel,uqflowtypeid});
	}

	/**
	 * 更新类别的 fullcode和 fullname
	 * @param getUqflowtypeid 类别的ID
	 * @param fullvarcode	新的全编码
	 * @param fullvarname	新的全名称
	 * @throws Exception
	 */
	public void updateTypeNameAndCode(String uqflowtypeid, String varfullcode, String varfullname) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_flowtype tft SET ");
		sb.append(" tft.varfullcode = ? ,");
		sb.append(" tft.varfullname = ? ");
		sb.append(" WHERE tft.uqflowtypeid = ? ");
		this.execute(sb.toString(), new String[]{varfullcode,varfullname,uqflowtypeid}
		);
	}

	/**
	 * 获得该类别下的全部子集 
	 * @param fullcode 类别全编码
	 * @param fullname 类别全名称
	 * @param uqflowtypeid 类别ID
	 * @return
	 * @throws Exception
	 */
	public List<FlowTypeEntity> getFlowTypeList(String varfullcode,String varfullname, String uqflowtypeid) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	tft.* ");
		sb.append(" FROM tgl_flowtype tft ");
		sb.append(" WHERE tft.uqflowtypeid <> ? ");
		sb.append(" AND tft.varfullcode LIKE ? ");
		sb.append(" AND tft.varfullname LIKE ? ");
		return this.getEntityList(sb.toString(), new String[]{uqflowtypeid,varfullcode+"%",varfullname+"%"}, FlowTypeEntity.class);
	}

	/**
	 * 将数据导入现金流量类别模板表中
	 * @param entity
	 * @throws Exception
	 */
	public void importToFlowTypeModel(EntityMap entity) throws Exception 
	{
		String typeid = UUID.randomUUID().toString().toUpperCase();
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_flowtypemodel (  ");
		sb.append(" typeid , vartypecode, vartypename, parentcode) ");
		sb.append(" VALUES (?, ?, ?, ?) ");
		
		this.execute(sb.toString(), new String[]
			{
			typeid,
			entity.getString("vartypecode"),
			entity.getString("vartypename"),
			entity.getString("parentcode")
			}
		);
	}
	
	/**
	 * 将数据导入现金流量项目模板表中
	 * @param entity
	 * @throws Exception
	 */
	public void importToFlowItemsModel(EntityMap entity) throws Exception 
	{
		String itemsid = UUID.randomUUID().toString().toUpperCase();
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_flowitemsmodel (  ");
		sb.append(" itemsid , varitemscode, varitemsname ,vartypecode ,intstatus) ");
		sb.append(" VALUES ( ?, ?, ?, ?, 1) ");
		
		this.execute(sb.toString(), new String[]
			{
			itemsid,
			entity.getString("varitemscode"),
			entity.getString("varitemsname"),
			entity.getString("vartypecode")
			}
		);
	}
	
	/**
	 * 获得 模板表中第一级别的数据
	 * @return
	 * @throws Exception
	 */
	public List<FlowTypeModelEntiy> getOneTypeModel() throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	tft.* ");
		sb.append(" FROM tgl_flowtypemodel tft ");
		sb.append(" WHERE tft.vartypecode = tft.parentcode ");
		return this.getEntityList(sb.toString(), FlowTypeModelEntiy.class);
	}
	
	/**
	 * 根据传入的parentcode查询 子集的类别 集合
	 * @param parentcode	
	 * @return
	 * @throws Exception
	 */
	public List<FlowTypeModelEntiy> getTypeModel(String parentcode) throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	tft.* ");
		sb.append(" FROM tgl_flowtypemodel tft ");
		sb.append(" WHERE tft.parentcode = ?  ");
		sb.append(" AND  tft.parentcode <> tft.vartypecode ");
		return this.getEntityList(sb.toString(),new String[]{parentcode}, FlowTypeModelEntiy.class);
	}
	
	/**
	 * 查询导入表中挂在 已有的类别下的 数据	此时挂入的类别数据 可以根据code也得出
	 * @return
	 * @throws Exception
	 */
	public List<FlowTypeModelEntiy> getTypeModel() throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	tft.* ");
		sb.append(" FROM tgl_flowtypemodel tft ");
		sb.append(" INNER JOIN tgl_flowtype tftp ON tft.parentcode = tftp.varcode  ");
		return this.getEntityList(sb.toString(), FlowTypeModelEntiy.class);
	}
	
	/**
	 * 更新模板表数据
	 * @param type
	 * @throws Exception
	 */
	public void updateTypeModel(FlowTypeModelEntiy type) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_flowtypemodel tft SET ");
		sb.append(" tft.vartypecode = ?, ");
		sb.append(" tft.vartypename = ?, ");
		sb.append(" tft.uqparentid = ?, ");
		sb.append(" tft.varfullcode = ?, ");
		sb.append(" tft.varfullname = ?, ");
		sb.append(" tft.intlevel = ?, ");
		sb.append(" tft.intislastlevel = ? ");
		sb.append(" WHERE tft.typeid = ? ");
		
		this.execute(sb.toString(), new String[]
			{
			type.getVartypecode(),
			type.getVartypename(),
			type.getUqparentid(),
			type.getVarfullcode(),
			type.getVarfullname(),
			type.getIntlevel(),
			type.getIntislastlevel(),
			type.getTypeid()
			}
		);
	}

	/**
	 * 将模板表中的数据 导入现金流量类别表
	 * @throws Exception
	 */
	public void importToFlowTypeInfo() throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_flowtype (  ");
		sb.append(" uqflowtypeid , varcode, varname ,uqparentid ,varfullcode,varfullname,intlevel,intislastlevel) ");
		sb.append(" SELECT typeid,vartypecode,vartypename,uqparentid,varfullcode,varfullname,intlevel,intislastlevel ");
		sb.append(" FROM  tgl_flowtypemodel ");
		this.execute(sb.toString());
	}
	
	/**
	 * 获得 模板表中的项目 
	 * @return
	 * @throws Exception
	 */
	public List<FlowItemsModelEntiy> getItemsModel() throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	tfi.* ");
		sb.append(" FROM tgl_flowitemsmodel tfi ");
		return this.getEntityList(sb.toString(), FlowItemsModelEntiy.class);
	}
	
	/**
	 * 更新 项目 模板表的数据
	 * @param items
	 * @throws Exception
	 */
	public void updateItemsModel(FlowItemsModelEntiy items) throws Exception
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" UPDATE tgl_flowitemsmodel tfi SET ");
		sb.append(" tfi.uqflowtypeid = ? ");
		sb.append(" WHERE tfi.itemsid = ? ");
		
		this.execute(sb.toString(), new String[]
			{
			items.getUqflowtypeid(),
			items.getItemsid()
			}
		);
	}
	
	/**
	 * 将模板表中的数据 导入现金流量项目表
	 * @throws Exception
	 */
	public void importToFlowItemsInfo() throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" INSERT INTO tgl_flowitems (  ");
		sb.append(" uqflowitemid , varcode, varname ,uqflowtypeid,intstatus ) ");
		sb.append(" SELECT itemsid ,varitemscode, varitemsname, uqflowtypeid,intstatus ");
		sb.append(" FROM  tgl_flowitemsmodel ");
		this.execute(sb.toString());
	}

	/**
	 * 导出现金流量表中的数据
	 * @return
	 * @throws Exception
	 */
	public List<Object[]> exportCashFlowInfo() throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT tfi.varcode varitemscode,tfi.varname varitemsname , ");
		sb.append(" tft.varcode vartypecode,tft.varname vartypename , ");
		sb.append(" case when tfi.intstatus = '0' then '停用' when tfi.intstatus ='1' then '新建' else '启用' end as intstatus ");
		sb.append(" FROM tgl_flowitems tfi LEFT JOIN tgl_flowtype  tft ");
		sb.append(" ON tfi.uqflowtypeid = tft.uqflowtypeid ");
		sb.append(" ORDER BY tfi.varcode ,tfi.varname , tft.varcode");
		
		List<Object[]> resultList = new ArrayList<Object[]>();
		List<EntityMap> mapList = this.getMapList(sb.toString(), new Object[]{});
		for (int i = 0; i < mapList.size(); i++) 
		{
			resultList.add(new Object[]{
					mapList.get(i).getString("varitemscode"),
					mapList.get(i).getString("varitemsname"),
					mapList.get(i).getString("vartypecode"),
					mapList.get(i).getString("vartypename"),
					mapList.get(i).getString("intstatus")
			});
		}
		return resultList ;
	}

	/**
	 * 清空现金流量类别模板表中的数据
	 * @throws Exception
	 */
	public void removeAllCashFlowModel() throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" DELETE FROM tgl_flowtypemodel ");
		this.execute(sb.toString());
	}

	/**
	 * 清空现金流量项目模板表中的数据
	 * @throws Exception
	 */
	public void removeAllFlowItemsModel() throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" DELETE FROM tgl_flowitemsmodel ");
		this.execute(sb.toString());
	}

	/**
	 * 根据所属的类别code 查询类别模板表中是否存在
	 * @param vartypecode 所属类别code
	 * @return true 存在   false不存在
	 * @throws Exception
	 */
	public boolean getTypeModelCountByCode(String vartypecode) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowtypemodel tft  ");
		strSQL.append(" WHERE tft.vartypecode = ? ");
		int result = this.querySingleInteger(strSQL.toString(), new String[]{vartypecode});
		
		if( result > 0 )
		{
			return true;//存在
		}
		else
		{
			return false;
		}
	}

	/**
	 * 根据所属的类别code 查询类别表中是否存在
	 * @param vartypecode	所属类别code
	 * @return	查询出的个数
	 * @throws Exception
	 */
	public int getTypeCountByCode(String vartypecode) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowtype tft  ");
		strSQL.append(" WHERE tft.varcode = ? ");
		return this.querySingleInteger(strSQL.toString(), new String[]{vartypecode});
	}

	/**
	 * 根据类别的code查询 模板表中 该类别下的项目name的个数
	 * @param varitemsname	项目name
	 * @param vartypecode	所属类别code
	 * @return
	 * @throws Exception
	 */
	public int getItemsModelCountByName(String varitemsname, String vartypecode) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowitemsmodel tfi  ");
		strSQL.append(" WHERE tfi.varitemsname = ? ");
		strSQL.append(" AND tfi.vartypecode = ? ");
		return this.querySingleInteger(strSQL.toString(), new String[]{varitemsname,vartypecode});
	}

	/**
	 * 根据所属类别的code 查询该类别下的name是否唯一 在模板表中
	 * @param vartypesname	类别name
	 * @param parentcode	所属的类别code
	 * @return
	 * @throws Exception
	 */
	public int getTypeModelCountByName(String vartypesname, String parentcode) throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowtypemodel tfi  ");
		strSQL.append(" WHERE tfi.vartypename = ? ");
		strSQL.append(" AND tfi.parentcode = ? ");
		return this.querySingleInteger(strSQL.toString(), new String[]{vartypesname,parentcode});
	}

	/**
	 * 根据code得到类别实体
	 * @param vartypecode	类别的code
	 * @return
	 * @throws Exception
	 */
	public List<FlowTypeEntity> getFlowTypeByCode(String vartypecode) throws Exception 
	{
		StringBuilder sb = new StringBuilder();
		sb.append(" SELECT 	tft.* ");
		sb.append(" FROM tgl_flowtype tft ");
		sb.append(" WHERE tft.varcode = ? ");
		return this.getEntityList(sb.toString(), new String[]{vartypecode}, FlowTypeEntity.class);
	}

	/**
	 * 根据 varcode varname 查询第一级下的 是否存在重复
	 * @param varcode 
	 * @param varname
	 * @return	true 唯一	false不唯一
	 * @throws Exception
	 */
	public boolean exitOneTypeCodeAndName(String varcode, String varname)
			throws Exception 
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT count(1) ");
		strSQL.append(" FROM tgl_flowtype tft  ");
		strSQL.append(" WHERE tft.intlevel = 1 ");
		strSQL.append(" AND ( tft.varcode = ? ");
		strSQL.append(" OR tft.varname = ? ) ");
		int result = this.querySingleInteger(strSQL.toString(), new String[]{varcode,varname});
		
		if( result > 0 )
		{
			return false;//存在
		}
		else
		{
			return true; //b不存在 唯一
		}
	}
	
	/**
	 * 根据 uqvarcode类别编号 查询类别ID
	 * @param uqvarcode 
	 * @return	类别ID
	 * @throws Exception
	 */
	public String getflowtypeid(String uqvarcode) throws Exception
	{
		StringBuilder strSQL = new StringBuilder();
		strSQL.append(" SELECT uqflowtypeid ");
		strSQL.append(" FROM tgl_flowtype tf  ");
		strSQL.append(" WHERE tf.varcode = ? ");
		List<EntityMap> mapList = this.getMapList(strSQL.toString(), new String[]{uqvarcode});
		return mapList.get(0).getString("uqflowtypeid");
	}
}
