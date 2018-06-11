package com.newtouch.nwfs.platform.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;

@Repository
public class MenuDAO extends CommonDAO
{
	public List<EntityMap> getTree(String node, ConditionMap cdtMap)
	{
		ArrayList<Object> alParam = new ArrayList<Object>();

		String strSql = "select mfra.varmenuframeid as \"id\",";
		strSql += " mfra.varcaption as text,";
		strSql += " mfra.intislastlevel as leaf,";
		strSql += " mfun.varpageurl as page";
		strSql += " from tsys_menuframe mfra";
		strSql += " inner join tsys_menuframe_set mfs on mfs.varframesetid = mfra.varframesetid";
		strSql += " left join tsys_menu_function mfun on mfun.varcode = mfra.shortcutcode";
		strSql += " where 1 = 1";

		if (cdtMap.containsCondition("menuframe_set"))
		{
			strSql += " and mfs.varframesetid = ?";
			alParam.add(cdtMap.getString("menuframe_set"));
		}
		else
		{
			strSql += " and mfs.intdefault = 1";
		}

		strSql += " and mfra.intishide = 0";

		if (node.equalsIgnoreCase("root"))
		{
			strSql += " and mfra.varparentid is null";
		}
		else
		{
			strSql += " and mfra.varparentid = ?";
			alParam.add(node);

			if (this.getDialect().toString().indexOf("Oracle") > 0)
			{
				strSql += " and";
				strSql += " (";
				strSql += "     (";
				strSql += "         mfra.shortcutcode is null";
				strSql += "         and";
				strSql += "         (";
				strSql += "             select count(mfun2.varoperationcode)";
				strSql += "             from tsys_menuframe mfra2";
				strSql += "                 left join tsys_menu_function mfun2 on mfun2.varcode = mfra2.shortcutcode";
				strSql += "             where exists (select 1";
				strSql += "                 from tsys_userbase ub";
				strSql += "                     inner join tsys_user_role ur on ur.userid = ub.id";
				strSql += "                     inner join tsys_rolebase rb on rb.id = ur.roleid";
				strSql += "                     inner join tsys_role_permission_global rpg on rpg.roleid = rb.id";
				strSql += "                 where rpg.operationcode = mfun2.varoperationcode";
				strSql += "                     and ub.id = ?)";
				strSql += "             start with mfra2.varmenuframeid = mfra.varmenuframeid and mfra2.varframesetid = mfra.varframesetid";
				strSql += "             connect by prior mfra2.varmenuframeid = mfra2.varparentid and mfra2.varframesetid = mfra.varframesetid";
				strSql += "         ) > 0";
				strSql += "     )";
				strSql += "     or";
				strSql += "     (";
				strSql += "         mfra.shortcutcode is not null";
				strSql += "         and";
				strSql += "         exists (select 1";
				strSql += "             from tsys_userbase ub";
				strSql += "                 inner join tsys_user_role ur on ur.userid = ub.id";
				strSql += "                 inner join tsys_rolebase rb on rb.id = ur.roleid";
				strSql += "                 inner join tsys_role_permission_global rpg on rpg.roleid = rb.id";
				strSql += "             where rpg.operationcode = mfun.varoperationcode";
				strSql += "                 and ub.id = ?)";
				strSql += "     )";
				strSql += " )";
	
				alParam.add(cdtMap.getString("userid"));
				alParam.add(cdtMap.getString("userid"));
			}
		}
		strSql += " order by mfra.intitempos";

		super._MapFieldCastLowerCase = true;
		return super.getMapList(strSql, alParam);
	}
	
	public List<EntityMap> getMenuTree(String userId,String companyId,String parentId,String batchId) throws Exception 
	{
		Connection conn = null;
		ResultSet rs = null;
		CallableStatement proc = null;
		List<EntityMap> menusList  = new ArrayList<EntityMap>();
		conn = this.getConnection();
	   
		proc = conn.prepareCall("{ call PACKXINEM8SMX_BS_SMX_MENU_GETCHILD(?,?,?,?) }");
   
		proc.setString(1, userId);
		proc.setString(2, companyId);
		proc.setString(3, parentId);
		proc.setString(4, batchId);
		rs =proc.executeQuery();
		while(rs.next())
	    {
	        EntityMap entity = new EntityMap();
	        entity.put("id", rs.getString(1));
	        entity.put("text", rs.getString(2));
	        entity.put("leaf", rs.getString(3));
	        entity.put("page", rs.getString(4));
	        menusList.add(entity);
	    }
		
		PreparedStatement pss = conn.prepareStatement("delete t from tsys_temp_menuframe t where t.batch_Id = ? ");
		pss.setString((int)1,batchId);
		pss.execute();

		pss = conn.prepareStatement("delete t from TSYS_TEMP_OPERATIONCODE t where t.batch_Id = ? ");
		pss.setString((int)1,batchId);
		pss.execute();
		
		rs.close();
		return menusList;
	}
}