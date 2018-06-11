package com.newtouch.nwfs.gl.vouchermanager.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.ParaList;
import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.vouchermanager.entity.BaseTreeData2Entity;

@Repository
public class VoucherAccountDAO extends CommonDAO
{
	
	public PageData<EntityMap> findAccountByFilter(String uqaccountsetid, String node, String codecondition, ConditionMap cdtMap, int tag, int start, int limit)
	{
		ParaList params = new ParaList();

		String strSql = " SELECT ta.uqaccountid, ta.varaccountcode, ta.varaccountname, ta.varaccountfullname, ";
		strSql += " ifnull(tcy1.CATEGORYNAME,'') intproperty,     ifnull(tcy2.CATEGORYNAME,'') uqtypeid, ";
		strSql += " ifnull(tcy3.CATEGORYNAME,'') uqforeigncurrid, ifnull(ta.intisledge,0) intisledge, ";
		strSql += " ifnull(tcy4.CATEGORYNAME,'') varmeasure, ta.intflag, ta.intislastlevel  FROM tgl_accounts ta";
		strSql += " LEFT JOIN tob_category tcy1 ON tcy1.CATEGORYCODE = ta.INTPROPERTY AND tcy1.CATEGORYTYPE = '10000001' ";
		strSql += " LEFT JOIN tob_category tcy2 ON tcy2.CATEGORYCODE = ta.UQTYPEID AND tcy2.CATEGORYTYPE = '10000002' ";
		strSql += " LEFT JOIN tob_category tcy3 ON tcy3.CATEGORYCODE = ta.UQFOREIGNCURRID AND tcy3.CATEGORYTYPE = '10000003' ";
		strSql += " LEFT JOIN tob_category tcy4 ON tcy4.CATEGORYCODE = ta.VARMEASURE AND tcy4.CATEGORYTYPE = '10000004' ";
		if(tag == 1)
		{
			strSql += " where ta.varaccountcode like '"+node+"%'";
		}
		else
		{
			strSql += " where ta.varaccountfullcode like '"+node+"%'";
		}
		strSql += " and ta.intflag = 2 and ta.uqaccountid <> '00000000-0000-0000-0000-000000000000' ";
		strSql += " and ta.UQACCOUNTSETID = ? ";

		params.add(uqaccountsetid);

		if(!StringUtil.isNullString(codecondition))
		{
			strSql += " and ta.uqtypeid in (" + codecondition + ")";
		}

		if (cdtMap.containsCondition("isleaf"))
		{
			strSql += " and ta.intislastlevel = ?";
			params.add(cdtMap.getInteger("isleaf"));
		}

		strSql += " order by ta.varaccountcode asc";

		PageData<EntityMap> pageData = this.getMapPage(strSql, params, start, limit);
//		PageEntity pageEntity = new PageEntity();
//		pageEntity.setDatas(pageData.getData());
//		pageEntity.setTotal(pageData.getTotal());
		return pageData;
	}

	public List<BaseTreeData2Entity> findAccountGroup(String uqaccountsetid, String node) 
    {
		List<Object> params = new ArrayList<Object>();
        String strSql = "";
        //Query query = null;
        if("root".equals(node))
        {
        	strSql += "SELECT ta.UQACCOUNTID id,";
        	strSql += " ta.VARACCOUNTCODE code,";
        	strSql += " ta.VARACCOUNTFULLCODE name,";
        	strSql += " CONCAT(CONCAT(CONCAT('[',ta.VARACCOUNTCODE),']'),ta.VARACCOUNTNAME) text,";
        	strSql += " ta.INTISLASTLEVEL leaf";
        	strSql += " FROM tgl_accounts ta";
        	strSql += " WHERE ta.UQPARENTID = '00000000-0000-0000-0000-000000000000' ";
        	strSql += " and ta.uqaccountid <> '00000000-0000-0000-0000-000000000000' and ta.intflag = 2  ";
        	strSql += " and ta.UQACCOUNTSETID = ?  ";
			strSql += " order by ta.varaccountcode asc";
			params.add(uqaccountsetid);
        }
        else
        {
        	strSql += "SELECT ta.UQACCOUNTID id,";
        	strSql += " ta.VARACCOUNTCODE code,";
        	strSql += " ta.VARACCOUNTFULLCODE name,";
        	strSql += " CONCAT(CONCAT(CONCAT('[',ta.VARACCOUNTCODE),']'),ta.VARACCOUNTNAME) text,";
        	strSql += " ta.INTISLASTLEVEL leaf";
        	strSql += " FROM tgl_accounts ta";
        	strSql += " WHERE ta.UQPARENTID = ?  and ta.intflag = 2 ";
        	params.add(node);
        	strSql += " and ta.UQACCOUNTSETID = ? ";
        	params.add(uqaccountsetid);
			strSql += " order by ta.varaccountcode asc";
        }
        List<BaseTreeData2Entity> lst = this.getEntityList(strSql, params, BaseTreeData2Entity.class);
        return lst;        
    }

}
