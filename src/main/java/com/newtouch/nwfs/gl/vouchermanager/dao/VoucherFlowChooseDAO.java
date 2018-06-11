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

/**
 * 现金流量选择dao
 * @author feng
 *
 */
@Repository
public class VoucherFlowChooseDAO  extends CommonDAO 
{
	
	public PageData<EntityMap> findFlowByFilter(String node, String codecondition, ConditionMap cdtMap, int start, int limit)
	{
		ParaList params = new ParaList();

		String strSql = "select ";
		strSql +="    fi.uqflowitemid,fi.varcode,fi.varname, ";
		strSql +="    ft.varcode as vartypecode,ft.varname as vartypename ";
		strSql +="  from ";
		strSql +="    tgl_flowitems fi  ";
		strSql +="  inner join tgl_flowtype ft on ft.uqflowtypeid=fi.uqflowtypeid ";
		strSql +="  where 1=1 and fi.intstatus = 2";
		
		if(cdtMap != null)
		{
			if(!StringUtil.isNullString(cdtMap.getString("code")))
			{
				strSql +="  and fi.varcode like '"+cdtMap.getString("code")+"%'";
			}
			else
			{
				strSql +="  and fi.uqflowtypeid = ? ";
				params.add(node);
			}
		}
		else
		{
			strSql +="  and fi.uqflowtypeid = ? ";
			params.add(node);
		}
		strSql +="  order by fi.varcode";
		PageData<EntityMap> pageData = this.getMapPage(strSql, params, start, limit);
		return pageData;
	}
	
	public List<BaseTreeData2Entity> findFlowGroup(String node) 
    {
		List<Object> params = new ArrayList<Object>();
        String strSql = "";
        
        if("root".equals(node))
        {
        	strSql += "select ft.uqflowtypeid as id, ft.varcode as code, ft.varname as name, ";
			strSql += "  CONCAT('[',ft.varcode,']',ft.varname) as text, ft.intislastlevel as leaf ";
			strSql += "  from tgl_flowtype ft ";
			strSql += "  where ft.uqflowtypeid=ft.uqparentid";
        }
        else
        {
        	strSql += "select ft.uqflowtypeid as id, ft.varcode as code, ft.varname as name, ";
			strSql += "  CONCAT('[',ft.varcode,']',ft.varname) as text, ft.intislastlevel as leaf ";
			strSql += "  from tgl_flowtype ft ";
			strSql += "  where ft.uqparentid=? and ft.uqparentid<>ft.uqflowtypeid";
			params.add(node);
        }
        
        List<BaseTreeData2Entity> lst = this.getEntityList(strSql, params, BaseTreeData2Entity.class);
        return lst;     
    }

}
